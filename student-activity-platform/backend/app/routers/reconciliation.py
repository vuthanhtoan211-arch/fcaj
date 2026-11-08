from datetime import datetime
from copy import deepcopy
import os
from typing import Literal
from zoneinfo import ZoneInfo

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from pydantic import (
    BaseModel,
    Field,
)

from app.services.reconciliation import (
    reconcile_all,
)

from app.data.store import (
    activities,
    evidence,
    participation,
    registrations,
    get_activity_bucket,
)

from app.auth import (
    CurrentUser,
    get_current_user,
    require_admin,
)


# ==========================================
# ROUTER
# ==========================================

router = APIRouter(
    prefix="/activities",
    tags=["Reconciliation"],
)


# ==========================================
# TIMEZONE
# ==========================================

VN_TIMEZONE = ZoneInfo(
    "Asia/Ho_Chi_Minh"
)


# ==========================================
# DECISION REQUEST
# ==========================================

class DecisionRequest(BaseModel):

    decision: Literal[
        "CONFIRMED",
        "REJECTED",
    ]

    note: str = Field(
        default="",
        max_length=500,
    )


# ==========================================
# HELPERS
# ==========================================

def is_true(value) -> bool:

    if (
        value is True
        or value == 1
    ):
        return True

    return (
        str(
            value or ""
        )
        .strip()
        .upper()
        in {
            "YES",
            "TRUE",
            "1",
            "Y",
        }
    )


# ==========================================
# EVIDENCE DATASET IMPORTED
# ==========================================

def evidence_dataset_imported(
    activity_id: str,
    activity=None,
):

    if activity is None:

        activity = activities.get(
            activity_id,
            {}
        )

    evidence_bucket = evidence.get(
        activity_id,
        {}
    )

    return (
        bool(
            activity.get(
                "evidence_import"
            )
        )
        or
        bool(
            evidence_bucket
        )
    )


# ==========================================
# SYNC EVIDENCE
# ==========================================

def sync_evidence_fields(
    activity_id: str,
    row: dict,
):
    """
    Evidence có 3 trạng thái:

    YES
        Sinh viên có Evidence.

    NO
        BTC đã Import Evidence nhưng
        MSSV sinh viên không có trong file.

    NOT_IMPORTED
        BTC chưa Import dữ liệu Evidence
        cho hoạt động này.
    """

    activity = activities.get(
        activity_id,
        {}
    )

    mssv = str(
        row.get(
            "mssv",
            ""
        )
    ).strip().upper()

    evidence_bucket = evidence.get(
        activity_id,
        {}
    )

    imported = (
        evidence_dataset_imported(
            activity_id,
            activity,
        )
    )

    evidence_record = (
        evidence_bucket.get(
            mssv
        )
    )

    # ======================================
    # CHƯA IMPORT EVIDENCE
    # ======================================

    if not imported:

        evidence_status = (
            "NOT_IMPORTED"
        )

        evidence_submitted = None

    # ======================================
    # CÓ EVIDENCE
    # ======================================

    elif (
        evidence_record
        and evidence_record.get(
            "submitted"
        )
    ):

        evidence_status = "YES"

        evidence_submitted = True

    # ======================================
    # ĐÃ IMPORT NHƯNG KHÔNG CÓ MSSV
    # ======================================

    else:

        evidence_status = "NO"

        evidence_submitted = False

    # ======================================
    # SAVE FIELDS
    # ======================================

    row[
        "evidence"
    ] = evidence_submitted

    row[
        "evidence_submitted"
    ] = evidence_submitted

    row[
        "evidence_status"
    ] = evidence_status

    row[
        "evidence_dataset_imported"
    ] = imported

    # ======================================
    # NORMALIZE ISSUES
    # ======================================

    current_issues = row.get(
        "issues",
        []
    )

    if not isinstance(
        current_issues,
        list
    ):

        current_issues = [
            value.strip()
            for value in
            str(
                current_issues
            ).split(",")
            if value.strip()
        ]

    # Xóa trạng thái Evidence cũ.
    issues = [
        issue
        for issue in current_issues
        if str(
            issue
        ).upper()
        not in {
            "MISSING_EVIDENCE",
            "EVIDENCE_NOT_IMPORTED",
        }
    ]

    # Chưa có dataset Evidence.
    if (
        evidence_status
        == "NOT_IMPORTED"
    ):

        issues.append(
            "EVIDENCE_NOT_IMPORTED"
        )

    # Đã có dataset nhưng SV không có Evidence.
    elif (
        evidence_status
        == "NO"
    ):

        issues.append(
            "MISSING_EVIDENCE"
        )

    # ======================================
    # REMOVE DUPLICATE ISSUES
    # ======================================

    unique_issues = []

    seen = set()

    for issue in issues:

        key = str(
            issue
        ).upper()

        if key not in seen:

            seen.add(
                key
            )

            unique_issues.append(
                issue
            )

    row[
        "issues"
    ] = unique_issues

    # ======================================
    # RECALCULATE RECONCILIATION STATUS
    # ======================================

    check_in = is_true(
        row.get(
            "check_in"
        )
        if "check_in" in row
        else row.get(
            "checked_in"
        )
    )

    check_out = is_true(
        row.get(
            "check_out"
        )
        if "check_out" in row
        else row.get(
            "checked_out"
        )
    )

    # Không có cả Check-in lẫn Check-out.
    if (
        not check_in
        and not check_out
    ):

        row[
            "reconciliation_status"
        ] = "NO_ATTENDANCE"

    # Có dữ liệu điểm danh nhưng thiếu thành phần.
    elif unique_issues:

        row[
            "reconciliation_status"
        ] = "NEEDS_REVIEW"

    # Đầy đủ.
    else:

        row[
            "reconciliation_status"
        ] = "READY"

    return row


# ==========================================
# DECISION CONSISTENCY
# ==========================================

def normalize_decision_state(row: dict):
    status = str(row.get("reconciliation_status", "")).upper()
    final_status = str(row.get("final_status", "PENDING")).upper()
    source = str(row.get("decision_source", "")).upper()
    issues = list(row.get("issues", []))
    decision_issues = list(row.get("decision_issues") or [])

    if status == "READY":
        valid = final_status == "CONFIRMED" and source == "SYSTEM"
    elif status == "NO_ATTENDANCE":
        valid = final_status == "REJECTED" and source == "SYSTEM"
    elif status == "NEEDS_REVIEW":
        valid = (
            final_status in {"CONFIRMED", "REJECTED"}
            and source == "MANUAL"
            and decision_issues == issues
        )
    else:
        valid = False

    if not valid:
        row["final_status"] = "PENDING"
        row["confirmed_by"] = None
        row["confirmed_at"] = None
        row["decision_source"] = None
        row["decision_issues"] = None
        if status == "NEEDS_REVIEW":
            row["note"] = ""

    return row


# ==========================================
# AWS PARTICIPATION PILOT (TEST DATA ONLY)
# ==========================================

PILOT_ACTIVITY_NAME = "AWS Registration Pilot Test"
PILOT_MSSV = {"TEST000001", "TEST000002", "TEST000003"}
PILOT_MARKER = "SAP_PARTICIPATION_PILOT_V1"


def _participation_pilot_enabled(activity_id: str) -> bool:
    """Only write to AWS for one explicitly selected synthetic activity."""
    if os.getenv("SAP_PARTICIPATION_AWS_PILOT", "0").strip() != "1":
        return False

    configured = os.getenv("SAP_PARTICIPATION_AWS_TEST_ACTIVITY_ID", "").strip()
    if not configured:
        raise HTTPException(
            status_code=503,
            detail={
                "code": "PARTICIPATION_PILOT_NOT_CONFIGURED",
                "message": "Thiếu SAP_PARTICIPATION_AWS_TEST_ACTIVITY_ID.",
            },
        )
    return activity_id == configured


def _write_participation_pilot(activity_id: str, bucket: dict) -> None:
    """Transactionally mirror up to three fake participation rows to DynamoDB.

    This is an opt-in test path, not production-wide synchronization.
    It refuses any existing DynamoDB item that does not bear our marker.
    """
    if not _participation_pilot_enabled(activity_id):
        return

    activity = activities.get(activity_id, {})
    registered = registrations.get(activity_id, {})
    if (
        activity.get("activity_name") != PILOT_ACTIVITY_NAME
        or activity.get("final_list_locked", False)
        or not bucket
        or set(bucket) != PILOT_MSSV
        or set(registered) != PILOT_MSSV
        or any(str(row.get("mssv", "")).upper() != mssv
               for mssv, row in bucket.items())
        or any(str(row.get("activity_id", "")) != activity_id
               for row in bucket.values())
    ):
        raise HTTPException(
            status_code=409,
            detail={
                "code": "PARTICIPATION_PILOT_UNSAFE_DATA",
                "message": (
                    "Pilot chỉ được ghi ba MSSV TEST000001–TEST000003 "
                    "của AWS Registration Pilot Test, khi danh sách chưa khóa."
                ),
            },
        )

    try:
        import boto3
        from boto3.dynamodb.conditions import Key
        from boto3.dynamodb.types import TypeSerializer
    except ImportError as exc:
        raise HTTPException(
            status_code=503,
            detail={
                "code": "PARTICIPATION_PILOT_MISSING_DEPENDENCY",
                "message": "Thiếu boto3 để đồng bộ SAP-Participation.",
            },
        ) from exc

    table_name = os.getenv("SAP_PARTICIPATION_TABLE", "SAP-Participation").strip()
    table_name = table_name or "SAP-Participation"

    try:
        resource = boto3.resource("dynamodb")
        table = resource.Table(table_name)
        existing = {}
        params = {
            "KeyConditionExpression": Key("activity_id").eq(activity_id),
            "ConsistentRead": True,
        }
        while True:
            response = table.query(**params)
            for item in response.get("Items", []):
                existing[str(item.get("mssv", ""))] = item
            if "LastEvaluatedKey" not in response:
                break
            params["ExclusiveStartKey"] = response["LastEvaluatedKey"]

        # Do not silently delete/replace legacy or unrelated AWS data.
        if any(
            mssv not in PILOT_MSSV
            or item.get("pilot_marker") != PILOT_MARKER
            for mssv, item in existing.items()
        ):
            raise HTTPException(
                status_code=409,
                detail={
                    "code": "PARTICIPATION_PILOT_EXISTING_DATA_BLOCKED",
                    "message": (
                        "SAP-Participation chứa bản ghi chưa được đánh dấu "
                        "là dữ liệu pilot. Không ghi đè."
                    ),
                },
            )

        serializer = TypeSerializer()
        transaction = []
        for mssv, row in sorted(bucket.items()):
            payload = deepcopy(row)
            payload["activity_id"] = activity_id
            payload["mssv"] = mssv
            payload["pilot_marker"] = PILOT_MARKER
            marshalled = {k: serializer.serialize(v) for k, v in payload.items()}
            transaction.append({
                "Put": {
                    "TableName": table_name,
                    "Item": marshalled,
                    "ConditionExpression": (
                        "attribute_not_exists(activity_id) OR #pilot = :pilot"
                    ),
                    "ExpressionAttributeNames": {"#pilot": "pilot_marker"},
                    "ExpressionAttributeValues": {
                        ":pilot": serializer.serialize(PILOT_MARKER)
                    },
                }
            })

        # DynamoDB transaction is atomic: no partial batch on failure.
        boto3.client("dynamodb").transact_write_items(TransactItems=transaction)

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail={
                "code": "PARTICIPATION_PILOT_AWS_ERROR",
                "message": (
                    "Không thể ghi Participation lên DynamoDB; "
                    "dữ liệu local của lần thao tác này đã được hoàn tác. "
                    f"Chi tiết: {type(exc).__name__}"
                ),
            },
        ) from exc


def _read_participation_pilot(activity_id: str) -> dict:
    """Read pilot Participation from DynamoDB, without mutating local state.

    Only the explicitly configured synthetic activity uses this read path.
    An incomplete, foreign, or unavailable AWS dataset is reported as an error,
    rather than silently presenting potentially stale local data.
    """
    try:
        import boto3
        from boto3.dynamodb.conditions import Key
    except ImportError as exc:
        raise HTTPException(
            status_code=503,
            detail={
                "code": "PARTICIPATION_PILOT_MISSING_DEPENDENCY",
                "message": "Thiếu boto3 để đọc SAP-Participation.",
            },
        ) from exc

    table_name = os.getenv("SAP_PARTICIPATION_TABLE", "SAP-Participation").strip()
    table_name = table_name or "SAP-Participation"
    try:
        table = boto3.resource("dynamodb").Table(table_name)
        params = {
            "KeyConditionExpression": Key("activity_id").eq(activity_id),
            "ConsistentRead": True,
        }
        fetched = {}
        while True:
            response = table.query(**params)
            for item in response.get("Items", []):
                mssv = str(item.get("mssv", "")).upper()
                if (
                    mssv not in PILOT_MSSV
                    or item.get("pilot_marker") != PILOT_MARKER
                    or item.get("activity_id") != activity_id
                    or mssv in fetched
                ):
                    raise HTTPException(
                        status_code=409,
                        detail={
                            "code": "PARTICIPATION_PILOT_UNEXPECTED_AWS_DATA",
                            "message": "Dữ liệu Participation AWS không đúng phạm vi Pilot.",
                        },
                    )
                record = deepcopy(item)
                record.pop("pilot_marker", None)
                fetched[mssv] = record
            if "LastEvaluatedKey" not in response:
                break
            params["ExclusiveStartKey"] = response["LastEvaluatedKey"]

        # This pilot is deliberately scoped to three known synthetic records.
        # An empty/partial AWS dataset must not be treated as a completed reconciliation.
        if set(fetched) != PILOT_MSSV:
            raise HTTPException(
                status_code=503,
                detail={
                    "code": "PARTICIPATION_PILOT_INCOMPLETE_AWS_DATA",
                    "message": (
                        "SAP-Participation chưa có đủ ba bản ghi thử nghiệm. "
                        "Không tự động lấy dữ liệu SQLite thay thế."
                    ),
                },
            )
        return fetched
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail={
                "code": "PARTICIPATION_PILOT_AWS_READ_ERROR",
                "message": f"Không thể đọc SAP-Participation: {type(exc).__name__}",
            },
        ) from exc


# ==========================================
# RUN RECONCILIATION
# ==========================================

@router.post(
    "/{activity_id}/reconcile"
)
def run_reconciliation(
    activity_id: str,
    admin_role: str = Depends(
        require_admin
    ),
    current_user: CurrentUser = Depends(
        get_current_user
    ),
):

    del admin_role

    activity = activities.get(
        activity_id
    )

    if activity is None:

        raise HTTPException(
            status_code=404,
            detail=(
                "Không tìm thấy hoạt động."
            ),
        )

    publication_status = str(
        activity.get(
            "publication_status",
            activity.get(
                "status",
                ""
            )
        )
    ).upper()

    if publication_status in {"DRAFT", "PENDING_APPROVAL"}:
        raise HTTPException(
            status_code=409,
            detail="Chỉ hoạt động đã công bố mới được đối soát hoặc khóa danh sách.",
        )

    if publication_status == "CANCELLED":
        raise HTTPException(
            status_code=409,
            detail=(
                "Hoạt động đã bị hủy. "
                "Không thể thực hiện đối soát."
            ),
        )

    if activity.get(
        "final_list_locked",
        False
    ):

        raise HTTPException(
            status_code=409,
            detail=(
                "Danh sách cuối đã khóa. "
                "Không thể chạy lại đối soát."
            ),
        )

    # ======================================
    # QUAN TRỌNG
    #
    # Không chặn đối soát nếu chưa Import
    # Evidence.
    #
    # Khi chưa Import:
    # evidence_status = NOT_IMPORTED
    #
    # => Frontend hiện "Chưa nhập".
    # ======================================

    old_bucket = (
        get_activity_bucket(
            participation,
            activity_id
        )
    )

    # Snapshot để không làm hỏng dữ liệu local nếu DynamoDB từ chối ghi.
    previous_reconciled_at = activity.get("last_reconciled_at")
    previous_reconciled_by = activity.get("last_reconciled_by")
    had_reconciled_at = "last_reconciled_at" in activity
    had_reconciled_by = "last_reconciled_by" in activity

    previous_manual = {}

    # ======================================
    # SAVE PREVIOUS MANUAL DECISIONS
    # ======================================

    for mssv, record in (
        old_bucket.items()
    ):

        final_status = str(
            record.get(
                "final_status",
                "PENDING"
            )
        ).upper()

        decision_source = str(
            record.get(
                "decision_source",
                ""
            )
        ).upper()

        if (
            final_status
            in {
                "CONFIRMED",
                "REJECTED",
            }
            and
            decision_source
            == "MANUAL"
        ):

            previous_manual[
                mssv
            ] = {

                "final_status":
                    final_status,

                "note":
                    record.get(
                        "note",
                        ""
                    ),

                "confirmed_by":
                    record.get(
                        "confirmed_by"
                    ),

                "confirmed_at":
                    record.get(
                        "confirmed_at"
                    ),

                "decision_issues":
                    list(
                        record.get(
                            "decision_issues"
                        )
                        or record.get(
                            "issues",
                            []
                        )
                    ),
            }

    # ======================================
    # RECONCILE
    # ======================================

    # Xây dựng toàn bộ dữ liệu trên bản nháp, không sửa local trước khi
    # reconcile_all() và bước ghi AWS hoàn tất.
    results = reconcile_all(activity_id)
    bucket = {}

    summary = {

        "READY": 0,

        "NEEDS_REVIEW": 0,

        "NO_ATTENDANCE": 0,
    }

    final_summary = {

        "CONFIRMED": 0,

        "REJECTED": 0,

        "PENDING": 0,
    }

    current_time = (
        datetime.now(
            VN_TIMEZONE
        ).isoformat()
    )

    # ======================================
    # AUTO DECISION
    # ======================================

    for row in results:

        mssv = str(
            row.get(
                "mssv",
                ""
            )
        ).strip().upper()

        # Đồng bộ Evidence thật
        # từ evidence store.
        sync_evidence_fields(
            activity_id,
            row
        )

        normalize_decision_state(
            row
        )

        status = str(
            row.get(
                "reconciliation_status",
                "NEEDS_REVIEW"
            )
        ).upper()

        if (
            status
            not in summary
        ):

            status = (
                "NEEDS_REVIEW"
            )

            row[
                "reconciliation_status"
            ] = status

        summary[
            status
        ] += 1

        # ==================================
        # READY
        #
        # Check-in + Check-out + Evidence
        # đầy đủ.
        # ==================================

        if status == "READY":

            row[
                "final_status"
            ] = "CONFIRMED"

            row[
                "note"
            ] = (
                "Tự động xác nhận: "
                "đầy đủ dữ liệu tham gia."
            )

            row[
                "confirmed_by"
            ] = "SYSTEM"

            row[
                "confirmed_at"
            ] = current_time

            row[
                "decision_source"
            ] = "SYSTEM"

            row[
                "decision_issues"
            ] = None

        # ==================================
        # NO ATTENDANCE
        # ==================================

        elif (
            status
            == "NO_ATTENDANCE"
        ):

            row[
                "final_status"
            ] = "REJECTED"

            row[
                "note"
            ] = (
                "Tự động không xác nhận: "
                "không có Check-in "
                "và Check-out."
            )

            row[
                "confirmed_by"
            ] = "SYSTEM"

            row[
                "confirmed_at"
            ] = current_time

            row[
                "decision_source"
            ] = "SYSTEM"

            row[
                "decision_issues"
            ] = None

        # ==================================
        # NEEDS REVIEW
        # ==================================

        else:

            old_decision = (
                previous_manual.get(
                    mssv
                )
            )

            current_issues = list(
                row.get(
                    "issues",
                    []
                )
            )

            # Nếu BTC đã xử lý trước đó
            # và vấn đề vẫn giống nhau
            # thì giữ quyết định cũ.
            if (
                old_decision
                and
                old_decision.get(
                    "decision_issues",
                    []
                )
                == current_issues
            ):

                row[
                    "final_status"
                ] = old_decision[
                    "final_status"
                ]

                row[
                    "note"
                ] = old_decision[
                    "note"
                ]

                row[
                    "confirmed_by"
                ] = old_decision[
                    "confirmed_by"
                ]

                row[
                    "confirmed_at"
                ] = old_decision[
                    "confirmed_at"
                ]

                row[
                    "decision_source"
                ] = "MANUAL"

                row[
                    "decision_issues"
                ] = list(
                    old_decision.get(
                        "decision_issues",
                        []
                    )
                )

            else:

                row[
                    "final_status"
                ] = "PENDING"

                row[
                    "note"
                ] = ""

                row[
                    "confirmed_by"
                ] = None

                row[
                    "confirmed_at"
                ] = None

                row[
                    "decision_source"
                ] = None

                row[
                    "decision_issues"
                ] = None

        final_status = str(
            row.get(
                "final_status",
                "PENDING"
            )
        ).upper()

        if (
            final_status
            not in final_summary
        ):

            final_status = "PENDING"

            row[
                "final_status"
            ] = final_status

        final_summary[
            final_status
        ] += 1

        bucket[
            mssv
        ] = row

    # ======================================
    # LAST RECONCILIATION
    # ======================================

    activity[
        "last_reconciled_at"
    ] = current_time

    activity[
        "last_reconciled_by"
    ] = current_user.username

    try:
        _write_participation_pilot(activity_id, bucket)
    except Exception:
        if had_reconciled_at:
            activity["last_reconciled_at"] = previous_reconciled_at
        else:
            activity.pop("last_reconciled_at", None)
        if had_reconciled_by:
            activity["last_reconciled_by"] = previous_reconciled_by
        else:
            activity.pop("last_reconciled_by", None)
        raise

    # Chỉ commit sau khi toàn bộ phép tính và ghi AWS thành công.
    old_bucket.clear()
    old_bucket.update(bucket)

    return {

        "success":
            True,

        "message":
            "Đã chạy đối soát thành công.",

        "summary":
            summary,

        "final_summary":
            final_summary,

        "data":
            results,
    }


# ==========================================
# GET RECONCILIATION
# ==========================================

@router.get(
    "/{activity_id}/reconciliation"
)
def get_reconciliation(
    activity_id: str,
    admin_role: str = Depends(
        require_admin
    ),
    current_user: CurrentUser = Depends(
        get_current_user
    ),
):

    del admin_role

    activity = activities.get(
        activity_id
    )

    if activity is None:

        raise HTTPException(
            status_code=404,
            detail=(
                "Không tìm thấy hoạt động."
            ),
        )

    publication_status = str(
        activity.get(
            "publication_status",
            activity.get(
                "status",
                ""
            )
        )
    ).upper()

    if publication_status == "CANCELLED":
        raise HTTPException(
            status_code=409,
            detail=(
                "Hoạt động đã bị hủy. "
                "Không thể thực hiện đối soát."
            ),
        )

    # AWS is the read source only for the explicitly configured pilot Activity.
    # All other activities retain their existing SQLite/in-memory behavior.
    if _participation_pilot_enabled(activity_id):
        bucket = _read_participation_pilot(activity_id)
    else:
        bucket = deepcopy(participation.get(activity_id, {}))

    # ======================================
    # SYNC EVIDENCE REAL DATA
    #
    # Khi Evidence vừa được Import,
    # những record đối soát cũ cũng sẽ
    # được cập nhật Có / Không đúng.
    # ======================================

    for row in (
        bucket.values()
    ):

        sync_evidence_fields(
            activity_id,
            row
        )

        normalize_decision_state(
            row
        )

    items = list(
        bucket.values()
    )

    items.sort(
        key=lambda row:
            (
                str(
                    row.get(
                        "final_status",
                        "PENDING"
                    )
                ).upper()
                != "PENDING",

                str(
                    row.get(
                        "mssv",
                        ""
                    )
                ),
            )
    )

    summary = {

        "CONFIRMED": 0,

        "REJECTED": 0,

        "PENDING": 0,
    }

    for row in items:

        status = str(
            row.get(
                "final_status",
                "PENDING"
            )
        ).upper()

        if (
            status
            not in summary
        ):

            status = "PENDING"

        summary[
            status
        ] += 1

    imported = (
        evidence_dataset_imported(
            activity_id,
            activity
        )
    )

    return {

        "success":
            True,

        "data": {

            "activity_id":
                activity_id,

            "activity_name":
                activity.get(
                    "activity_name"
                ),

            "final_list_locked":
                activity.get(
                    "final_list_locked",
                    False
                ),

            # Toàn bộ dataset Evidence
            # đã được import hay chưa.
            "evidence_dataset_imported":
                imported,

            "evidence_dataset_status":
                (
                    "IMPORTED"
                    if imported
                    else "NOT_IMPORTED"
                ),

            "summary":
                summary,

            "items":
                items,
        },
    }


# ==========================================
# MANUAL DECISION
# ==========================================

@router.post(
    "/{activity_id}/participants/{mssv}/decision"
)
def decision(
    activity_id: str,
    mssv: str,
    body: DecisionRequest,
    admin_role: str = Depends(
        require_admin
    ),
    current_user: CurrentUser = Depends(
        get_current_user
    ),
):

    del admin_role

    activity = activities.get(
        activity_id
    )

    if activity is None:

        raise HTTPException(
            status_code=404,
            detail=(
                "Không tìm thấy hoạt động."
            ),
        )

    publication_status = str(
        activity.get(
            "publication_status",
            activity.get(
                "status",
                ""
            )
        )
    ).upper()

    if publication_status in {"DRAFT", "PENDING_APPROVAL"}:
        raise HTTPException(
            status_code=409,
            detail="Chỉ hoạt động đã công bố mới được đối soát hoặc khóa danh sách.",
        )

    if publication_status == "CANCELLED":
        raise HTTPException(
            status_code=409,
            detail=(
                "Hoạt động đã bị hủy. "
                "Không thể thực hiện đối soát."
            ),
        )

    if activity.get(
        "final_list_locked",
        False
    ):

        raise HTTPException(
            status_code=409,
            detail=(
                "Danh sách cuối đã khóa."
            ),
        )

    # ======================================
    # PHẢI CÓ DATASET EVIDENCE
    #
    # Có thể chạy đối soát trước,
    # nhưng BTC chưa được quyết định
    # bằng tay nếu chưa nhập Evidence.
    # ======================================

    if not evidence_dataset_imported(
        activity_id,
        activity
    ):

        raise HTTPException(
            status_code=409,
            detail={

                "code":
                    "EVIDENCE_NOT_IMPORTED",

                "message":
                    (
                        "Chưa nhập Evidence. "
                        "Chưa thể xử lý thủ công."
                    ),
            },
        )

    persisted_bucket = get_activity_bucket(participation, activity_id)
    bucket = deepcopy(persisted_bucket)
    normalized_mssv = mssv.strip().upper()
    record = bucket.get(normalized_mssv)

    if record is None:
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy dữ liệu đối soát của sinh viên.",
        )

    # Chỉ cập nhật bản sao cho đến khi AWS write thành công.
    sync_evidence_fields(activity_id, record)

    reconciliation_status = str(
        record.get(
            "reconciliation_status",
            ""
        )
    ).upper()

    if (
        reconciliation_status
        != "NEEDS_REVIEW"
    ):

        raise HTTPException(
            status_code=409,
            detail=(
                "Chỉ trường hợp CẦN KIỂM TRA "
                "mới được xử lý thủ công."
            ),
        )

    record[
        "final_status"
    ] = body.decision

    record[
        "note"
    ] = (
        body.note
        or ""
    ).strip()

    record[
        "confirmed_by"
    ] = current_user.username

    record[
        "confirmed_at"
    ] = (
        datetime.now(
            VN_TIMEZONE
        ).isoformat()
    )

    record[
        "decision_source"
    ] = "MANUAL"

    record[
        "decision_issues"
    ] = list(
        record.get(
            "issues",
            []
        )
    )

    _write_participation_pilot(activity_id, bucket)
    persisted_bucket.clear()
    persisted_bucket.update(bucket)

    return {

        "success":
            True,

        "message":
            (
                "Đã xác nhận sinh viên tham gia."
                if (
                    body.decision
                    == "CONFIRMED"
                )
                else
                "Đã đánh dấu sinh viên không tham gia."
            ),

        "data":
            record,
    }


# ==========================================
# FINALIZE
# ==========================================

@router.post(
    "/{activity_id}/finalize"
)
def finalize_activity(
    activity_id: str,
    admin_role: str = Depends(
        require_admin
    ),
    current_user: CurrentUser = Depends(
        get_current_user
    ),
):

    del admin_role

    activity = activities.get(
        activity_id
    )

    if activity is None:

        raise HTTPException(
            status_code=404,
            detail=(
                "Không tìm thấy hoạt động."
            ),
        )

    publication_status = str(
        activity.get(
            "publication_status",
            activity.get(
                "status",
                ""
            )
        )
    ).upper()

    if publication_status in {"DRAFT", "PENDING_APPROVAL"}:
        raise HTTPException(
            status_code=409,
            detail="Chỉ hoạt động đã công bố mới được đối soát hoặc khóa danh sách.",
        )

    if publication_status == "CANCELLED":
        raise HTTPException(
            status_code=409,
            detail=(
                "Hoạt động đã bị hủy. "
                "Không thể thực hiện đối soát."
            ),
        )

    if _participation_pilot_enabled(activity_id):
        raise HTTPException(
            status_code=409,
            detail={
                "code": "PARTICIPATION_PILOT_FINALIZE_NOT_SUPPORTED",
                "message": (
                    "Chưa hỗ trợ khóa danh sách cuối trên AWS Pilot. "
                    "Phải đồng bộ trạng thái khóa và đảm bảo tính nhất quán "
                    "giữa Activity và Participation trước khi cho phép."
                ),
            },
        )

    if activity.get(
        "final_list_locked",
        False
    ):

        raise HTTPException(
            status_code=409,
            detail=(
                "Danh sách cuối đã được khóa."
            ),
        )

    # Không được khóa danh sách
    # nếu BTC chưa nhập Evidence.
    if not evidence_dataset_imported(
        activity_id,
        activity
    ):

        raise HTTPException(
            status_code=409,
            detail={

                "code":
                    "EVIDENCE_NOT_IMPORTED",

                "message":
                    (
                        "Chưa nhập Evidence. "
                        "Không thể khóa danh sách cuối."
                    ),
            },
        )

    bucket = deepcopy(participation.get(activity_id, {}))

    if not bucket:

        raise HTTPException(
            status_code=409,
            detail=(
                "Chưa có dữ liệu đối soát "
                "để khóa danh sách cuối."
            ),
        )

    registered_mssv = set(registrations.get(activity_id, {}))
    if not registered_mssv or set(bucket) != registered_mssv:
        raise HTTPException(
            status_code=409,
            detail={
                "code": "PARTICIPATION_DATASET_INCOMPLETE",
                "message": "Danh sách đối soát chưa đầy đủ so với Registration.",
            },
        )

    # Đồng bộ Evidence lần cuối.
    for row in (
        bucket.values()
    ):

        sync_evidence_fields(
            activity_id,
            row
        )

        # Xác thực lại quyết định sau khi Evidence thay đổi.
        normalize_decision_state(row)

    pending = [

        row

        for row in (
            bucket.values()
        )

        if str(
            row.get(
                "final_status",
                "PENDING"
            )
        ).upper()
        == "PENDING"
    ]

    if pending:

        raise HTTPException(
            status_code=409,
            detail={

                "code":
                    "PENDING_PARTICIPANTS_EXIST",

                "message":
                    (
                        "Vẫn còn sinh viên "
                        "chưa được xử lý."
                    ),

                "pending_count":
                    len(
                        pending
                    ),
            },
        )

    confirmed_count = sum(

        1

        for row in (
            bucket.values()
        )

        if str(
            row.get(
                "final_status",
                ""
            )
        ).upper()
        == "CONFIRMED"
    )

    rejected_count = sum(

        1

        for row in (
            bucket.values()
        )

        if str(
            row.get(
                "final_status",
                ""
            )
        ).upper()
        == "REJECTED"
    )

    activity[
        "final_list_locked"
    ] = True

    activity[
        "finalized_at"
    ] = (
        datetime.now(
            VN_TIMEZONE
        ).isoformat()
    )

    activity[
        "finalized_by"
    ] = current_user.username

    return {

        "success":
            True,

        "message":
            (
                "Đã khóa và xác nhận "
                "danh sách cuối."
            ),

        "data": {

            "activity_id":
                activity_id,

            "confirmed_count":
                confirmed_count,

            "rejected_count":
                rejected_count,

            "total":
                len(
                    bucket
                ),

            "final_list_locked":
                True,
        },
    }