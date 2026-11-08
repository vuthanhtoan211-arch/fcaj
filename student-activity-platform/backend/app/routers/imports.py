
from collections import Counter
import os
import csv
import re
import unicodedata

import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import BotoCoreError, ClientError

from datetime import datetime
from io import BytesIO, StringIO
from pathlib import Path
from zoneinfo import ZoneInfo

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
)
from openpyxl import load_workbook

from app.data.store import (
    activities,
    registrations,
    attendance,
    evidence,
    participation,
    students,
    get_activity_bucket,
)
from app.auth import require_admin


router = APIRouter(
    prefix="/activities",
    tags=["Imports"],
)

VN_TIMEZONE = ZoneInfo("Asia/Ho_Chi_Minh")
ALLOWED_EXTENSIONS = {".xlsx", ".csv"}
MSSV_PATTERN = re.compile(r"^[A-Z0-9]{6,20}$")
PREVIEW_LIMIT = 30


# ==========================================
# AWS REGISTRATIONS PILOT
# ==========================================

def _registration_aws_pilot_enabled(activity_id, activity):
    if os.getenv("SAP_REGISTRATIONS_AWS_PILOT", "0").strip() != "1":
        return False

    allowed_id = os.getenv(
        "SAP_REGISTRATIONS_AWS_TEST_ACTIVITY_ID", ""
    ).strip()

    if not allowed_id:
        raise HTTPException(
            status_code=503,
            detail=(
                "Đã bật Registration AWS Pilot nhưng chưa cấu hình "
                "SAP_REGISTRATIONS_AWS_TEST_ACTIVITY_ID."
            ),
        )

    if activity_id != allowed_id:
        return False

    publication_status = str(
        activity.get("publication_status")
        or activity.get("status")
        or ""
    ).upper()

    if publication_status != "DRAFT":
        raise HTTPException(
            status_code=409,
            detail=(
                "Registration AWS Pilot chỉ áp dụng "
                "cho Activity DRAFT."
            ),
        )

    return True


def _sync_registration_aws_pilot(activity_id, records):
    """
    Đồng bộ Registration của Activity thử nghiệm lên DynamoDB.

    DynamoDB được ghi trước local.
    Nếu thất bại, thử khôi phục snapshot AWS cũ.

    Đây chưa phải giao dịch nguyên tử giữa AWS và SQLite.
    """

    region = (
        os.getenv("AWS_DEFAULT_REGION")
        or os.getenv("AWS_REGION")
        or "ap-southeast-1"
    )

    table_name = os.getenv(
        "SAP_REGISTRATIONS_TABLE",
        "SAP-Registrations",
    )

    table = None
    previous = []
    write_started = False

    try:
        table = boto3.resource(
            "dynamodb",
            region_name=region,
        ).Table(table_name)

        query = table.query(
            KeyConditionExpression=Key("activity_id").eq(
                activity_id
            ),
            ConsistentRead=True,
        )

        previous.extend(query.get("Items", []))

        while "LastEvaluatedKey" in query:
            query = table.query(
                KeyConditionExpression=Key(
                    "activity_id"
                ).eq(activity_id),
                ConsistentRead=True,
                ExclusiveStartKey=query["LastEvaluatedKey"],
            )

            previous.extend(query.get("Items", []))

        desired = [
            {
                "activity_id": activity_id,
                "mssv": record["mssv"],
                "full_name": record["full_name"],
                "ho_lot": record["ho_lot"],
                "ten": record["ten"],
                "unit_name": record["unit_name"],
                "portal_activity": record["portal_activity"],
                "role": record["role"],
                "registered_at": record["registered_at"],
                "source": "PORTAL_IMPORT",
            }
            for record in records
        ]

        keys = [item["mssv"] for item in desired]

        if len(keys) != len(set(keys)):
            raise HTTPException(
                status_code=422,
                detail=(
                    "File chứa MSSV trùng nhau "
                    "trong Activity thử nghiệm."
                ),
            )

        write_started = True

        with table.batch_writer(
            overwrite_by_pkeys=[
                "activity_id",
                "mssv",
            ]
        ) as batch:
            for old in previous:
                batch.delete_item(
                    Key={
                        "activity_id": old["activity_id"],
                        "mssv": old["mssv"],
                    }
                )

            for item in desired:
                batch.put_item(Item=item)

    except HTTPException:
        raise

    except (
        BotoCoreError,
        ClientError,
        OSError,
        ValueError,
    ) as error:

        rollback_ok = False

        if write_started and table is not None:
            try:
                current = []

                result = table.query(
                    KeyConditionExpression=Key(
                        "activity_id"
                    ).eq(activity_id),
                    ConsistentRead=True,
                )

                current.extend(result.get("Items", []))

                while "LastEvaluatedKey" in result:
                    result = table.query(
                        KeyConditionExpression=Key(
                            "activity_id"
                        ).eq(activity_id),
                        ConsistentRead=True,
                        ExclusiveStartKey=result[
                            "LastEvaluatedKey"
                        ],
                    )

                    current.extend(result.get("Items", []))

                with table.batch_writer(
                    overwrite_by_pkeys=[
                        "activity_id",
                        "mssv",
                    ]
                ) as batch:

                    for item in current:
                        batch.delete_item(
                            Key={
                                "activity_id": item[
                                    "activity_id"
                                ],
                                "mssv": item["mssv"],
                            }
                        )

                    for item in previous:
                        batch.put_item(Item=item)

                rollback_ok = True

            except (
                BotoCoreError,
                ClientError,
                OSError,
                ValueError,
            ):
                pass

        message = (
            "Đồng bộ Registration lên DynamoDB thất bại. "
            "Dữ liệu local chưa thay đổi."
        )

        if write_started and not rollback_ok:
            message += (
                " Cần kiểm tra lại dữ liệu DynamoDB "
                "của Activity thử nghiệm."
            )

        raise HTTPException(
            status_code=503,
            detail=message,
        ) from error


# ==========================================
# NORMALIZATION
# ==========================================

def normalize_header(value):
    text = str(value or "").strip().lower()
    text = text.replace("đ", "d")
    text = unicodedata.normalize("NFD", text)

    text = "".join(
        character
        for character in text
        if unicodedata.category(character) != "Mn"
    )

    text = re.sub(r"[^a-z0-9]+", " ", text)
    return text.strip()


HEADER_ALIASES = {
    "mssv": {
        "ma sinh vien",
        "mssv",
        "student id",
        "student code",
    },
    "ho_lot": {
        "ho lot",
        "ho va ten lot",
        "ho dem",
    },
    "ten": {
        "ten",
        "first name",
    },
    "full_name": {
        "ho va ten",
        "ho ten",
        "full name",
    },
    "unit_name": {
        "ten don vi",
        "don vi",
        "khoa",
        "lop",
    },
    "portal_activity": {
        "hoat dong",
        "ten hoat dong",
        "activity",
        "activity name",
    },
    "role": {
        "vai tro",
        "role",
    },
    "registered_at": {
        "ngay dang ky",
        "thoi gian dang ky",
        "registration date",
        "registered at",
    },
}


def resolve_columns(headers):
    normalized_headers = {
        normalize_header(header): index
        for index, header in enumerate(headers)
    }

    resolved = {}

    for field_name, aliases in HEADER_ALIASES.items():
        for alias in aliases:
            normalized_alias = normalize_header(alias)

            if normalized_alias in normalized_headers:
                resolved[field_name] = normalized_headers[
                    normalized_alias
                ]
                break

    if "mssv" not in resolved:
        raise HTTPException(
            status_code=422,
            detail={
                "code": "MISSING_MSSV_COLUMN",
                "message": (
                    "Không tìm thấy cột "
                    "'Mã sinh viên' trong file."
                ),
            },
        )

    has_full_name = "full_name" in resolved

    has_split_name = (
        "ho_lot" in resolved
        and "ten" in resolved
    )

    if not has_full_name and not has_split_name:
        raise HTTPException(
            status_code=422,
            detail={
                "code": "MISSING_NAME_COLUMNS",
                "message": (
                    "File phải có cột 'Họ và tên' "
                    "hoặc hai cột 'Họ lót' và 'Tên'."
                ),
            },
        )

    return resolved


def get_cell_value(row, column_index):
    if column_index is None:
        return ""

    if column_index >= len(row):
        return ""

    value = row[column_index]

    if value is None:
        return ""

    return value


def normalize_text(value):
    return " ".join(
        str(value or "").strip().split()
    )


def normalize_date_value(value):
    if value is None:
        return ""

    if isinstance(value, datetime):
        return value.isoformat()

    return normalize_text(value)


# ==========================================
# READ XLSX / CSV
# ==========================================

def read_xlsx(content: bytes):
    try:
        workbook = load_workbook(
            filename=BytesIO(content),
            read_only=True,
            data_only=True,
        )

    except Exception as error:
        raise HTTPException(
            status_code=422,
            detail={
                "code": "INVALID_XLSX",
                "message": (
                    "Không thể đọc file Excel. "
                    "Vui lòng kiểm tra lại file .xlsx."
                ),
            },
        ) from error

    try:
        worksheet = workbook.active

        values = list(
            worksheet.iter_rows(values_only=True)
        )

    finally:
        workbook.close()

    return values


def read_csv(content: bytes):
    try:
        text = content.decode("utf-8-sig")

    except UnicodeDecodeError:
        try:
            text = content.decode("utf-8")

        except UnicodeDecodeError as error:
            raise HTTPException(
                status_code=422,
                detail={
                    "code": "INVALID_CSV_ENCODING",
                    "message": (
                        "File CSV phải sử dụng "
                        "mã hóa UTF-8."
                    ),
                },
            ) from error

    if not text.strip():
        return []

    try:
        dialect = csv.Sniffer().sniff(
            text[:4096],
            delimiters=",;\t",
        )

    except csv.Error:
        dialect = csv.excel

    reader = csv.reader(
        StringIO(text),
        dialect,
    )

    return list(reader)


async def read_uploaded_file(file: UploadFile):
    filename = file.filename or ""
    extension = Path(filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=422,
            detail={
                "code": "UNSUPPORTED_FILE",
                "message": (
                    "Hiện tại hệ thống chỉ hỗ trợ "
                    "file .xlsx và .csv."
                ),
            },
        )

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=422,
            detail={
                "code": "EMPTY_FILE",
                "message": "File tải lên đang trống.",
            },
        )

    if extension == ".xlsx":
        rows = read_xlsx(content)
    else:
        rows = read_csv(content)

    if not rows or len(rows) < 2:
        raise HTTPException(
            status_code=422,
            detail={
                "code": "NO_DATA",
                "message": (
                    "File không có dữ liệu "
                    "sinh viên để import."
                ),
            },
        )

    return filename, rows


# ==========================================
# BUILD RECORDS
# ==========================================

def build_records(rows):
    headers = [
        normalize_text(value)
        for value in rows[0]
    ]

    columns = resolve_columns(headers)
    records = []

    for row_number, row in enumerate(
        rows[1:],
        start=2,
    ):
        if not any(
            normalize_text(value)
            for value in row
        ):
            continue

        mssv = normalize_text(
            get_cell_value(
                row,
                columns.get("mssv"),
            )
        ).upper()

        if "full_name" in columns:
            full_name = normalize_text(
                get_cell_value(
                    row,
                    columns.get("full_name"),
                )
            )

            ho_lot = ""
            ten = ""

        else:
            ho_lot = normalize_text(
                get_cell_value(
                    row,
                    columns.get("ho_lot"),
                )
            )

            ten = normalize_text(
                get_cell_value(
                    row,
                    columns.get("ten"),
                )
            )

            full_name = f"{ho_lot} {ten}".strip()

        unit_name = normalize_text(
            get_cell_value(
                row,
                columns.get("unit_name"),
            )
        )

        portal_activity = normalize_text(
            get_cell_value(
                row,
                columns.get("portal_activity"),
            )
        )

        role = normalize_text(
            get_cell_value(
                row,
                columns.get("role"),
            )
        )

        registered_at = normalize_date_value(
            get_cell_value(
                row,
                columns.get("registered_at"),
            )
        )

        records.append({
            "row_number": row_number,
            "mssv": mssv,
            "ho_lot": ho_lot,
            "ten": ten,
            "full_name": full_name,
            "unit_name": unit_name,
            "portal_activity": portal_activity,
            "role": role,
            "registered_at": registered_at,
        })

    return headers, records


# ==========================================
# VALIDATION
# ==========================================

def validate_records(records):
    results = []
    seen_by_activity = {}

    for record in records:
        errors = []

        mssv = record.get("mssv", "")
        full_name = record.get("full_name", "")
        portal_activity = record.get(
            "portal_activity", ""
        )

        group_key = (
            portal_activity or "__DEFAULT__"
        )

        if group_key not in seen_by_activity:
            seen_by_activity[group_key] = set()

        if not mssv:
            errors.append("MISSING_MSSV")

        elif not MSSV_PATTERN.fullmatch(mssv):
            errors.append("INVALID_MSSV")

        if not full_name:
            errors.append("MISSING_FULL_NAME")

        if (
            mssv
            and mssv in seen_by_activity[group_key]
        ):
            errors.append("DUPLICATE_MSSV")

        if mssv:
            seen_by_activity[group_key].add(mssv)

        results.append({
            **record,
            "valid": len(errors) == 0,
            "errors": errors,
        })

    return results


def build_portal_activity_summary(records):
    counter = Counter(
        record["portal_activity"]
        for record in records
        if record.get("portal_activity")
    )

    return [
        {
            "name": name,
            "count": count,
        }
        for name, count in sorted(
            counter.items(),
            key=lambda item: item[0].lower(),
        )
    ]


# ==========================================
# ACTIVITY VALIDATION
# ==========================================

def require_activity(activity_id):
    activity = activities.get(activity_id)

    if activity is None:
        raise HTTPException(
            status_code=404,
            detail=(
                "Không tìm thấy hoạt động "
                "trong hệ thống."
            ),
        )

    if activity.get("final_list_locked", False):
        raise HTTPException(
            status_code=409,
            detail=(
                "Danh sách cuối đã khóa. "
                "Không thể thay đổi dữ liệu đăng ký."
            ),
        )

    publication_status = activity.get(
        "publication_status",
        activity.get("status", ""),
    )

    if str(publication_status).upper() == "CANCELLED":
        raise HTTPException(
            status_code=409,
            detail=(
                "Không thể import dữ liệu "
                "cho hoạt động đã hủy."
            ),
        )

    return activity


# ==========================================
# PREVIEW REGISTRATION
# ==========================================

@router.post("/{activity_id}/registrations/preview")
async def preview_registration_import(
    activity_id: str,
    file: UploadFile = File(...),
    role: str = Depends(require_admin),
):
    _ = role

    activity = require_activity(activity_id)

    filename, rows = await read_uploaded_file(file)

    headers, records = build_records(rows)
    validated = validate_records(records)

    portal_activities = build_portal_activity_summary(records)

    valid_count = sum(
        1
        for item in validated
        if item["valid"]
    )

    invalid_count = len(validated) - valid_count

    return {
        "success": True,
        "message": "Đã đọc file đăng ký từ Portal.",
        "data": {
            "activity_id": activity_id,
            "activity_name": activity.get("activity_name"),
            "file_name": filename,
            "headers": headers,
            "total_rows": len(records),
            "valid_rows": valid_count,
            "invalid_rows": invalid_count,
            "portal_activities": portal_activities,
            "requires_portal_activity_selection": (
                len(portal_activities) > 1
            ),
            "preview": validated[:PREVIEW_LIMIT],
        },
    }


# ==========================================
# IMPORT REGISTRATION
# ==========================================

@router.post("/{activity_id}/registrations/import")
async def import_registrations(
    activity_id: str,
    file: UploadFile = File(...),
    portal_activity: str = Form(default=""),
    role: str = Depends(require_admin),
):
    _ = role

    activity = require_activity(activity_id)

    # Không cho thay thế danh sách Registration
    # khi đã phát sinh dữ liệu nghiệp vụ liên quan.
    linked_data = {
        "attendance": len(
            attendance.get(activity_id, {})
        ),
        "evidence": len(
            evidence.get(activity_id, {})
        ),
        "participation": len(
            participation.get(activity_id, {})
        ),
    }

    if any(linked_data.values()):
        raise HTTPException(
            status_code=409,
            detail={
                "code": "REGISTRATIONS_HAVE_DEPENDENT_DATA",
                "message": (
                    "Không thể import thay thế Registration "
                    "vì Activity đã có dữ liệu điểm danh, "
                    "minh chứng hoặc đối soát. "
                    "Hãy giữ nguyên danh sách và xử lý "
                    "sai lệch theo quy trình được phê duyệt; "
                    "không tự động xóa dữ liệu liên quan."
                ),
                "related_data": linked_data,
            },
        )

    filename, rows = await read_uploaded_file(file)

    _, records = build_records(rows)

    portal_activities = build_portal_activity_summary(
        records
    )

    selected_portal_activity = normalize_text(
        portal_activity
    )

    if (
        len(portal_activities) > 1
        and not selected_portal_activity
    ):
        raise HTTPException(
            status_code=409,
            detail={
                "code": "PORTAL_ACTIVITY_REQUIRED",
                "message": (
                    "File Portal có nhiều hoạt động. "
                    "Vui lòng chọn hoạt động cần import."
                ),
                "portal_activities": portal_activities,
            },
        )

    if (
        len(portal_activities) == 1
        and not selected_portal_activity
    ):
        selected_portal_activity = (
            portal_activities[0]["name"]
        )

    if selected_portal_activity:
        selected_records = [
            record
            for record in records
            if record.get("portal_activity")
            == selected_portal_activity
        ]

        if not selected_records:
            raise HTTPException(
                status_code=422,
                detail={
                    "code": "PORTAL_ACTIVITY_NOT_FOUND",
                    "message": (
                        "Không tìm thấy hoạt động Portal "
                        "đã chọn trong file."
                    ),
                },
            )

    else:
        selected_records = records

    validated = validate_records(selected_records)

    valid_records = [
        record
        for record in validated
        if record["valid"]
    ]

    invalid_records = [
        record
        for record in validated
        if not record["valid"]
    ]

    if not valid_records:
        raise HTTPException(
            status_code=422,
            detail={
                "code": "NO_VALID_REGISTRATIONS",
                "message": (
                    "Không có sinh viên hợp lệ "
                    "để import."
                ),
            },
        )

    # Ghi AWS trước khi thay đổi local,
    # nhưng chỉ khi đúng Activity AWS Pilot.
    if _registration_aws_pilot_enabled(
        activity_id,
        activity,
    ):
        _sync_registration_aws_pilot(
            activity_id,
            valid_records,
        )

    # ======================================
    # REPLACE REGISTRATION LIST
    # ======================================

    bucket = get_activity_bucket(
        registrations,
        activity_id,
    )

    bucket.clear()

    for record in valid_records:
        mssv = record["mssv"]

        existing_student = students.get(
            mssv,
            {},
        )

        students[mssv] = {
            **existing_student,
            "mssv": mssv,
            "full_name": record["full_name"],
            "unit_name": record["unit_name"],
        }

        bucket[mssv] = {
            "mssv": mssv,
            "full_name": record["full_name"],
            "ho_lot": record["ho_lot"],
            "ten": record["ten"],
            "unit_name": record["unit_name"],
            "portal_activity": record[
                "portal_activity"
            ],
            "role": record["role"],
            "registered_at": record[
                "registered_at"
            ],
            "source": "PORTAL_IMPORT",
        }

    imported_at = datetime.now(
        VN_TIMEZONE
    ).isoformat()

    activity["registration_count"] = len(bucket)

    activity["registration_import"] = {
        "source": "PORTAL",
        "file_name": filename,
        "portal_activity": selected_portal_activity,
        "imported_at": imported_at,
        "imported_by_role": role,
        "total_selected_rows": len(
            selected_records
        ),
        "valid_rows": len(valid_records),
        "invalid_rows": len(invalid_records),
    }

    return {
        "success": True,
        "message": (
            f"Đã import {len(valid_records)} "
            "sinh viên đăng ký."
        ),
        "data": {
            "activity_id": activity_id,
            "activity_name": activity.get(
                "activity_name"
            ),
            "file_name": filename,
            "portal_activity": selected_portal_activity,
            "total_selected_rows": len(
                selected_records
            ),
            "imported_count": len(
                valid_records
            ),
            "invalid_count": len(
                invalid_records
            ),
            "invalid_rows": invalid_records[:50],
            "imported_at": imported_at,
        },
    }


# ==========================================
# GET REGISTRATIONS — ADMIN ONLY
# ==========================================

@router.get("/{activity_id}/registrations")
def get_registrations(
    activity_id: str,
    role: str = Depends(require_admin),
):
    _ = role

    activity = activities.get(activity_id)

    if activity is None:
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy hoạt động.",
        )

    bucket = registrations.get(
        activity_id,
        {},
    )

    rows = list(bucket.values())

    rows.sort(
        key=lambda item: (
            item.get("full_name", "").lower(),
            item.get("mssv", ""),
        )
    )

    return {
        "success": True,
        "data": {
            "activity_id": activity_id,
            "activity_name": activity.get(
                "activity_name"
            ),
            "total": len(rows),
            "registration_import": activity.get(
                "registration_import"
            ),
            "items": rows,
        },
    }
