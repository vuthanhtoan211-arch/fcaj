from datetime import date, datetime
import os
from io import BytesIO, StringIO
from pathlib import Path
from zoneinfo import ZoneInfo

import csv
import re
import unicodedata

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)

from openpyxl import load_workbook

from app.data.store import (
    activities,
    evidence,
    registrations,
    get_activity_bucket,
)

from app.auth import require_admin

from app.routers.activities import (
    get_current_role,
)


# ==========================================
# ROUTER
# ==========================================

router = APIRouter(
    prefix="/activities",
    tags=["Evidence Import"],
    dependencies=[Depends(require_admin)],
)


# ==========================================
# CONFIG
# ==========================================

VN_TIMEZONE = ZoneInfo(
    "Asia/Ho_Chi_Minh"
)

ALLOWED_EXTENSIONS = {
    ".xlsx",
    ".csv",
}

MSSV_PATTERN = re.compile(
    r"^[A-Z0-9]{6,20}$"
)

PREVIEW_LIMIT = 30


# ==========================================
# TEXT NORMALIZATION
# ==========================================

def normalize_text(
    value
):

    return " ".join(
        str(
            value or ""
        )
        .strip()
        .split()
    )


def normalize_header(
    value
):

    text = normalize_text(
        value
    ).lower()

    # Unicode NFD không đổi đ -> d.
    text = text.replace(
        "đ",
        "d"
    )

    text = unicodedata.normalize(
        "NFD",
        text
    )

    text = "".join(
        character
        for character in text
        if unicodedata.category(
            character
        ) != "Mn"
    )

    text = re.sub(
        r"[^a-z0-9]+",
        " ",
        text
    )

    return text.strip()


# ==========================================
# HEADER ALIASES
# ==========================================

HEADER_ALIASES = {

    "mssv": (
        "mssv",
        "ma sinh vien",
        "ma sv",
        "student id",
        "student code",
    ),

    "full_name": (
        "ho va ten",
        "ho ten",
        "full name",
        "full_name",
    ),

    "class_name": (
        "lop",
        "class",
        "class name",
    ),

    # Email cá nhân do sinh viên tự nhập.
    "personal_email": (
        "email ca nhan",
        "email sinh vien",
        "student email",
    ),

    # Email tài khoản Google thu bởi Google Form.
    "response_email": (
        "dia chi email",
        "email address",
    ),

    "submitted_at": (
        "dau thoi gian",
        "timestamp",
        "thoi gian",
        "thoi gian gui",
        "ngay gui",
        "submitted at",
        "submitted_at",
    ),

    # Câu hỏi cảm nghĩ có thể khác nhau
    # tùy chương trình.
    "reflection": (
        "cam nghi",
        "cam nhan",
        "suy nghi",
        "reflection",
    ),

    "purpose": (
        "muc dich tham gia",
        "purpose",
    ),

    "improvement": (
        "gop y cai thien",
        "improvement",
    ),

    "rating": (
        "danh gia thang diem 5",
        "rating",
        "score",
    ),

    "future_content": (
        "noi dung mong muon",
        "mong muon hoat dong",
        "future content",
    ),

}


# ==========================================
# HEADER MATCHING
# ==========================================

def header_matches(
    field,
    header
):

    aliases = (
        HEADER_ALIASES[
            field
        ]
    )

    # Match chính xác trước.
    if header in aliases:

        return True


    # ======================================
    # CLASS
    # ======================================

    # Ví dụ file thật:
    #
    # LỚP
    # Lưu ý: Ghi IN HOA chữ cái...
    #
    # Normalize sẽ thành:
    #
    # lop luu y ghi in hoa...
    #
    if field == "class_name":

        return (
            header == "lop"
            or
            header.startswith(
                "lop "
            )
        )


    # ======================================
    # GOOGLE FORM TIMESTAMP
    # ======================================

    if field == "submitted_at":

        return header.startswith(
            "dau thoi gian"
        )


    # ======================================
    # REFLECTION
    # ======================================

    if field == "reflection":

        has_reflection_word = any(
            keyword in header
            for keyword in (
                "cam nghi",
                "cam nhan",
                "suy nghi",
            )
        )

        has_activity_word = any(
            keyword in header
            for keyword in (
                "tham quan",
                "hoat dong",
                "chuong trinh",
            )
        )

        return (
            has_reflection_word
            and
            has_activity_word
        )


    # ======================================
    # PURPOSE
    # ======================================

    if field == "purpose":

        return (
            "muc dich" in header
            and
            "tham gia" in header
        )


    # ======================================
    # IMPROVEMENT / FEEDBACK
    # ======================================

    if field == "improvement":

        return (
            (
                "thieu sot" in header
                or
                "gop y" in header
            )
            and
            (
                "cai thien" in header
                or
                "to chuc" in header
            )
        )


    # ======================================
    # RATING
    # ======================================

    if field == "rating":

        return (
            "danh gia" in header
            and
            (
                "thang diem 5"
                in header
                or
                "diem" in header
            )
        )


    # ======================================
    # FUTURE CONTENT
    # ======================================

    if field == "future_content":

        return (
            "mong muon" in header
            and
            "hoat dong" in header
            and
            (
                "noi dung"
                in header
                or
                "thoi gian toi"
                in header
            )
        )


    return False


# ==========================================
# RESOLVE COLUMNS
# ==========================================

def resolve_columns(
    headers
):

    normalized_headers = [

        normalize_header(
            header
        )

        for header in headers
    ]


    resolved = {}


    for field in HEADER_ALIASES:

        for (
            index,
            header
        ) in enumerate(
            normalized_headers
        ):

            if header_matches(
                field,
                header
            ):

                resolved[
                    field
                ] = index

                break


    # MSSV bắt buộc.
    if "mssv" not in resolved:

        raise HTTPException(
            status_code=422,
            detail={
                "code":
                    "MISSING_MSSV_COLUMN",

                "message":
                    (
                        "Không tìm thấy cột MSSV "
                        "trong file Evidence."
                    ),
            },
        )


    return resolved


# ==========================================
# CELL VALUE
# ==========================================

def get_cell_value(
    row,
    index
):

    if (
        index is None
        or
        index >= len(row)
    ):

        return ""


    value = row[
        index
    ]


    if value is None:

        return ""


    return value


# ==========================================
# DATE VALUE
# ==========================================

def normalize_date_value(
    value
):

    if value is None:

        return ""


    # Google Sheets / Excel thường trả datetime.
    if isinstance(
        value,
        datetime
    ):

        # Excel thường không lưu timezone.
        # Hệ thống của mình chạy theo giờ Việt Nam.
        if value.tzinfo is None:

            value = value.replace(
                tzinfo=VN_TIMEZONE
            )


        return value.isoformat()


    if isinstance(
        value,
        date
    ):

        return datetime(
            value.year,
            value.month,
            value.day,
            tzinfo=VN_TIMEZONE,
        ).isoformat()


    return normalize_text(
        value
    )


# ==========================================
# RATING
# ==========================================

def normalize_rating(
    value
):

    if (
        value is None
        or
        value == ""
    ):

        return ""


    # Excel có thể đọc 5 thành 5.0.
    if isinstance(
        value,
        (int, float)
    ):

        numeric = float(
            value
        )


        if numeric.is_integer():

            return str(
                int(
                    numeric
                )
            )


        return str(
            numeric
        )


    text = normalize_text(
        value
    )


    try:

        numeric = float(
            text.replace(
                ",",
                "."
            )
        )


        if numeric.is_integer():

            return str(
                int(
                    numeric
                )
            )


        return str(
            numeric
        )


    except ValueError:

        return text


# ==========================================
# READ XLSX
# ==========================================

def read_xlsx(
    content: bytes
):

    try:

        workbook = load_workbook(
            filename=BytesIO(
                content
            ),
            read_only=True,
            data_only=True,
        )

    except Exception as error:

        raise HTTPException(
            status_code=422,
            detail={
                "code":
                    "INVALID_XLSX",

                "message":
                    (
                        "Không thể đọc file Excel "
                        "Evidence."
                    ),
            },
        ) from error


    try:

        worksheet = (
            workbook.active
        )


        rows = list(
            worksheet.iter_rows(
                values_only=True
            )
        )


    finally:

        workbook.close()


    return rows


# ==========================================
# READ CSV
# ==========================================

def read_csv(
    content: bytes
):

    try:

        text = content.decode(
            "utf-8-sig"
        )

    except UnicodeDecodeError as error:

        raise HTTPException(
            status_code=422,
            detail={
                "code":
                    "INVALID_CSV_ENCODING",

                "message":
                    (
                        "File CSV Evidence "
                        "phải sử dụng UTF-8."
                    ),
            },
        ) from error


    if not text.strip():

        return []


    try:

        dialect = csv.Sniffer().sniff(
            text[:4096],
            delimiters=",;\t"
        )

    except csv.Error:

        dialect = csv.excel


    return list(
        csv.reader(
            StringIO(
                text
            ),
            dialect
        )
    )


# ==========================================
# READ UPLOAD
# ==========================================

async def read_uploaded_file(
    file: UploadFile
):

    filename = (
        file.filename
        or
        ""
    )


    extension = (
        Path(
            filename
        )
        .suffix
        .lower()
    )


    if (
        extension
        not in
        ALLOWED_EXTENSIONS
    ):

        raise HTTPException(
            status_code=422,
            detail={
                "code":
                    "UNSUPPORTED_FILE",

                "message":
                    (
                        "Evidence chỉ hỗ trợ "
                        "file .xlsx hoặc .csv."
                    ),
            },
        )


    content = await file.read()


    if not content:

        raise HTTPException(
            status_code=422,
            detail={
                "code":
                    "EMPTY_FILE",

                "message":
                    "File Evidence đang trống.",
            },
        )


    if extension == ".xlsx":

        rows = read_xlsx(
            content
        )

    else:

        rows = read_csv(
            content
        )


    if (
        not rows
        or
        len(rows) < 2
    ):

        raise HTTPException(
            status_code=422,
            detail={
                "code":
                    "NO_DATA",

                "message":
                    (
                        "File không có dữ liệu "
                        "Evidence."
                    ),
            },
        )


    return (
        filename,
        rows
    )


# ==========================================
# BUILD RECORDS
# ==========================================

def build_records(
    rows
):

    headers = [

        normalize_text(
            value
        )

        for value in rows[0]
    ]


    columns = resolve_columns(
        headers
    )


    records = []


    for (
        row_number,
        row
    ) in enumerate(
        rows[1:],
        start=2
    ):

        # Bỏ dòng trắng hoàn toàn.
        if not any(
            normalize_text(
                value
            )
            for value in row
        ):

            continue


        # ==================================
        # MSSV
        # ==================================

        mssv = normalize_text(
            get_cell_value(
                row,
                columns.get(
                    "mssv"
                )
            )
        ).upper()


        # ==================================
        # NAME
        # ==================================

        full_name = normalize_text(
            get_cell_value(
                row,
                columns.get(
                    "full_name"
                )
            )
        )


        # ==================================
        # CLASS
        # ==================================

        class_name = normalize_text(
            get_cell_value(
                row,
                columns.get(
                    "class_name"
                )
            )
        )


        # ==================================
        # EMAIL
        # ==================================

        personal_email = normalize_text(
            get_cell_value(
                row,
                columns.get(
                    "personal_email"
                )
            )
        )


        response_email = normalize_text(
            get_cell_value(
                row,
                columns.get(
                    "response_email"
                )
            )
        )


        # Ưu tiên Email cá nhân.
        email = (
            personal_email
            or
            response_email
        )


        # ==================================
        # SUBMITTED AT
        # ==================================

        submitted_at = (
            normalize_date_value(
                get_cell_value(
                    row,
                    columns.get(
                        "submitted_at"
                    )
                )
            )
        )


        # ==================================
        # PROGRAM-SPECIFIC REFLECTION
        # ==================================

        reflection = normalize_text(
            get_cell_value(
                row,
                columns.get(
                    "reflection"
                )
            )
        )


        # ==================================
        # PURPOSE
        # ==================================

        purpose = normalize_text(
            get_cell_value(
                row,
                columns.get(
                    "purpose"
                )
            )
        )


        # ==================================
        # IMPROVEMENT
        # ==================================

        improvement = normalize_text(
            get_cell_value(
                row,
                columns.get(
                    "improvement"
                )
            )
        )


        # ==================================
        # RATING
        # ==================================

        rating = normalize_rating(
            get_cell_value(
                row,
                columns.get(
                    "rating"
                )
            )
        )


        # ==================================
        # FUTURE CONTENT
        # ==================================

        future_content = normalize_text(
            get_cell_value(
                row,
                columns.get(
                    "future_content"
                )
            )
        )


        # ==================================
        # KEEP ALL ORIGINAL GOOGLE FORM DATA
        # ==================================

        raw_data = {}


        for (
            index,
            header
        ) in enumerate(
            headers
        ):

            if not header:

                continue


            raw_data[
                header
            ] = normalize_text(
                get_cell_value(
                    row,
                    index
                )
            )


        records.append({

            "row_number":
                row_number,

            "mssv":
                mssv,

            "full_name":
                full_name,

            "class_name":
                class_name,

            # Email dùng chung.
            "email":
                email,

            # Giữ riêng hai loại email.
            "personal_email":
                personal_email,

            "response_email":
                response_email,

            "submitted_at":
                submitted_at,

            # Câu hỏi tùy từng chương trình.
            "reflection":
                reflection,

            "purpose":
                purpose,

            "improvement":
                improvement,

            "rating":
                rating,

            "future_content":
                future_content,

            # Toàn bộ dữ liệu Google Form.
            "raw_data":
                raw_data,

        })


    return (
        headers,
        columns,
        records
    )


# ==========================================
# VALIDATION
# ==========================================

def validate_records(
    activity_id,
    records
):

    activity_registrations = (
        registrations.get(
            activity_id,
            {}
        )
    )


    seen = set()

    validated = []


    for record in records:

        errors = []

        mssv = record.get(
            "mssv",
            ""
        )


        # ==================================
        # MSSV REQUIRED
        # ==================================

        if not mssv:

            errors.append(
                "MISSING_MSSV"
            )


        elif not MSSV_PATTERN.fullmatch(
            mssv
        ):

            errors.append(
                "INVALID_MSSV"
            )


        # ==================================
        # DUPLICATE RESPONSE
        # ==================================

        if (
            mssv
            and
            mssv in seen
        ):

            errors.append(
                "DUPLICATE_MSSV"
            )


        if mssv:

            seen.add(
                mssv
            )


        # ==================================
        # MUST BE REGISTERED
        # ==================================

        if (
            mssv
            and
            mssv not in
            activity_registrations
        ):

            errors.append(
                "NOT_REGISTERED"
            )


        validated.append({

            **record,

            "valid":
                len(errors) == 0,

            "errors":
                errors,

        })


    return validated


# ==========================================
# ERROR SUMMARY
# ==========================================

def build_error_summary(
    validated
):

    summary = {

        "missing_mssv":
            0,

        "invalid_mssv":
            0,

        "duplicate_mssv":
            0,

        "not_registered":
            0,

    }


    mapping = {

        "MISSING_MSSV":
            "missing_mssv",

        "INVALID_MSSV":
            "invalid_mssv",

        "DUPLICATE_MSSV":
            "duplicate_mssv",

        "NOT_REGISTERED":
            "not_registered",

    }


    for record in validated:

        for error in record.get(
            "errors",
            []
        ):

            key = mapping.get(
                error
            )


            if key:

                summary[
                    key
                ] += 1


    return summary


# ==========================================
# REQUIRE ACTIVITY
# ==========================================

def require_activity(
    activity_id
):

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


    # Evidence là một đầu vào của đối soát.
    # Sau khi danh sách cuối đã khóa,
    # không cho phép thay đổi nữa.
    if activity.get(
        "final_list_locked",
        False
    ):

        raise HTTPException(
            status_code=409,
            detail=(
                "Danh sách cuối đã khóa. "
                "Không thể thay đổi Evidence."
            ),
        )


    return activity


# ==========================================
# PREVIEW EVIDENCE
# ==========================================

@router.post(
    "/{activity_id}/evidence/preview"
)
async def preview_evidence_import(
    activity_id: str,

    file: UploadFile = File(...),

    role: str = Depends(
        get_current_role
    ),
):

    _ = role


    activity = require_activity(
        activity_id
    )


    filename, rows = (
        await read_uploaded_file(
            file
        )
    )


    (
        headers,
        columns,
        records,
    ) = build_records(
        rows
    )


    validated = validate_records(
        activity_id,
        records
    )


    valid_count = sum(
        1
        for record in validated
        if record[
            "valid"
        ]
    )


    invalid_count = (
        len(validated)
        -
        valid_count
    )


    registered_count = len(
        registrations.get(
            activity_id,
            {}
        )
    )


    error_summary = (
        build_error_summary(
            validated
        )
    )


    # Header thật nào đã được hệ thống nhận diện.
    detected_columns = {

        field:
            headers[index]

        for (
            field,
            index
        ) in columns.items()

    }


    return {

        "success":
            True,

        "message":
            "Đã đọc file Evidence.",

        "data": {

            "activity_id":
                activity_id,

            "activity_name":
                activity.get(
                    "activity_name"
                ),

            "file_name":
                filename,

            "headers":
                headers,

            "detected_columns":
                detected_columns,

            "registered_count":
                registered_count,

            "total_rows":
                len(records),

            "valid_rows":
                valid_count,

            "invalid_rows":
                invalid_count,

            "error_summary":
                error_summary,

            "preview":
                validated[
                    :PREVIEW_LIMIT
                ],

        },

    }


# ==========================================
# AWS EVIDENCE PILOT (OPT-IN, TEST DATA ONLY)
# ==========================================

# Khi chưa bật SAP_EVIDENCE_AWS_PILOT=1, luồng import
# vẫn chỉ ghi local như trước. Pilot chỉ đồng bộ một
# Activity thử nghiệm riêng; các Activity khác tiếp tục
# sử dụng local và không bị tác động trên AWS.
EVIDENCE_PILOT_ACTIVITY_NAME = "AWS Registration Pilot Test"
EVIDENCE_PILOT_TEST_MSSV = {
    "TEST000001",
    "TEST000002",
    "TEST000003",
}


def _evidence_pilot_is_target(activity_id, activity):
    if os.getenv("SAP_EVIDENCE_AWS_PILOT", "0").strip() != "1":
        return False

    test_id = os.getenv(
        "SAP_EVIDENCE_AWS_TEST_ACTIVITY_ID", ""
    ).strip()

    if not test_id:
        raise HTTPException(
            status_code=503,
            detail={
                "code": "EVIDENCE_PILOT_NOT_CONFIGURED",
                "message": (
                    "Đã bật AWS Evidence Pilot nhưng chưa cấu hình "
                    "SAP_EVIDENCE_AWS_TEST_ACTIVITY_ID."
                ),
            },
        )

    # Không ảnh hưởng import local của các hoạt động khác.
    if activity_id != test_id:
        return False

    if (
        activity.get("activity_name") != EVIDENCE_PILOT_ACTIVITY_NAME
        or activity.get("final_list_locked", False)
        or str(activity.get("publication_status", "")).strip().upper()
        not in {"DRAFT", "PUBLISHED"}
    ):
        raise HTTPException(
            status_code=409,
            detail={
                "code": "EVIDENCE_PILOT_UNSAFE_ACTIVITY",
                "message": "Activity thử nghiệm AWS không đúng điều kiện an toàn.",
            },
        )

    return True


def _sync_evidence_pilot(activity_id, activity, replacement_bucket):
    """Đồng bộ thay thế Evidence lên DynamoDB trước khi cập nhật local.

    Chỉ dùng với dữ liệu giả thuộc ba MSSV TEST. Nếu một thao tác ghi
    thất bại, cố gắng phục hồi snapshot trên AWS và báo lỗi. Đây không
    phải giao dịch phân tán nguyên tử; không dùng cho dữ liệu thật.
    """
    if not _evidence_pilot_is_target(activity_id, activity):
        return

    local_bucket = evidence.get(activity_id, {})
    if (
        not replacement_bucket
        or not set(replacement_bucket).issubset(EVIDENCE_PILOT_TEST_MSSV)
        or not set(local_bucket).issubset(EVIDENCE_PILOT_TEST_MSSV)
        or not set(registrations.get(activity_id, {})).issubset(
            EVIDENCE_PILOT_TEST_MSSV
        )
    ):
        raise HTTPException(
            status_code=409,
            detail={
                "code": "EVIDENCE_PILOT_REAL_DATA_BLOCKED",
                "message": (
                    "AWS Pilot chỉ cho phép Evidence và Registration "
                    "của ba MSSV thử nghiệm TEST000001–TEST000003."
                ),
            },
        )

    try:
        import boto3
        from boto3.dynamodb.conditions import Key
        from botocore.exceptions import BotoCoreError, ClientError
    except ImportError as error:
        raise HTTPException(
            status_code=503,
            detail={
                "code": "EVIDENCE_PILOT_DEPENDENCY_MISSING",
                "message": "Thiếu thư viện boto3/botocore để đồng bộ AWS.",
            },
        ) from error

    table_name = os.getenv(
        "SAP_EVIDENCE_TABLE", "SAP-Evidence"
    ).strip() or "SAP-Evidence"

    # Boto3 đọc AWS_PROFILE / AWS_REGION / AWS_DEFAULT_REGION.
    # Lỗi IAM / region / mạng phải trả về lỗi, không ghi local thành công.
    try:
        table = boto3.resource("dynamodb").Table(table_name)
        old_items = {}
        query_kwargs = {
            "KeyConditionExpression": Key("activity_id").eq(activity_id),
            "ConsistentRead": True,
        }
        while True:
            response = table.query(**query_kwargs)
            for item in response.get("Items", []):
                old_items[str(item["mssv"])] = item
            if "LastEvaluatedKey" not in response:
                break
            query_kwargs["ExclusiveStartKey"] = response["LastEvaluatedKey"]

        if not set(old_items).issubset(EVIDENCE_PILOT_TEST_MSSV):
            raise HTTPException(
                status_code=409,
                detail={
                    "code": "EVIDENCE_PILOT_AWS_DATA_BLOCKED",
                    "message": "AWS đang có Evidence ngoài danh sách TEST; dừng import.",
                },
            )

        def write_snapshot(items):
            with table.batch_writer(
                overwrite_by_pkeys=["activity_id", "mssv"]
            ) as batch:
                for mssv in set(old_items) - set(items):
                    batch.delete_item(
                        Key={"activity_id": activity_id, "mssv": mssv}
                    )
                for mssv, record in items.items():
                    batch.put_item(Item={
                        **record,
                        "activity_id": activity_id,
                        "mssv": mssv,
                    })

        replacement_items = {
            mssv: dict(record)
            for mssv, record in replacement_bucket.items()
        }
        try:
            write_snapshot(replacement_items)
        except Exception as write_error:
            # Phục hồi tốt nhất: xóa mọi TEST key trong phạm vi ảnh hưởng,
            # rồi ghi lại các item cũ. Không xóa dữ liệu ngoài TEST.
            rollback_error = None
            try:
                with table.batch_writer(
                    overwrite_by_pkeys=["activity_id", "mssv"]
                ) as batch:
                    for mssv in set(old_items) | set(replacement_items):
                        if mssv not in old_items:
                            batch.delete_item(Key={
                                "activity_id": activity_id, "mssv": mssv
                            })
                    for item in old_items.values():
                        batch.put_item(Item=item)
            except Exception as error:
                rollback_error = error

            raise HTTPException(
                status_code=503,
                detail={
                    "code": "EVIDENCE_PILOT_AWS_WRITE_FAILED",
                    "message": (
                        "Không thể đồng bộ Evidence lên AWS. "
                        + (
                            "Phục hồi AWS cũng thất bại; cần kiểm tra thủ công."
                            if rollback_error is not None else
                            "Đã thử phục hồi snapshot AWS cũ."
                        )
                    ),
                },
            ) from write_error

    except HTTPException:
        raise
    except (BotoCoreError, ClientError, OSError, ValueError, TypeError) as error:
        raise HTTPException(
            status_code=503,
            detail={
                "code": "EVIDENCE_PILOT_AWS_UNAVAILABLE",
                "message": "Không thể đọc/ghi DynamoDB Evidence. Local chưa thay đổi.",
            },
        ) from error


# ==========================================
# IMPORT EVIDENCE
# ==========================================

@router.post(
    "/{activity_id}/evidence/import"
)
async def import_evidence(
    activity_id: str,

    file: UploadFile = File(...),

    role: str = Depends(
        get_current_role
    ),
):

    activity = require_activity(
        activity_id
    )


    filename, rows = (
        await read_uploaded_file(
            file
        )
    )


    (
        headers,
        columns,
        records,
    ) = build_records(
        rows
    )


    validated = validate_records(
        activity_id,
        records
    )


    valid_records = [

        record

        for record in validated

        if record[
            "valid"
        ]

    ]


    invalid_records = [

        record

        for record in validated

        if not record[
            "valid"
        ]

    ]


    if not valid_records:

        raise HTTPException(
            status_code=422,
            detail={
                "code":
                    "NO_VALID_EVIDENCE",

                "message":
                    (
                        "Không có Evidence hợp lệ "
                        "để import."
                    ),
            },
        )


    # ======================================
    # PREPARE REPLACEMENT WITHOUT MUTATING LOCAL
    # ======================================

    replacement_bucket = {}

    for record in valid_records:

        mssv = record[
            "mssv"
        ]


        replacement_bucket[
            mssv
        ] = {

            "mssv":
                mssv,

            "submitted":
                True,

            "submitted_at":
                record[
                    "submitted_at"
                ],

            "full_name":
                record[
                    "full_name"
                ],

            "class_name":
                record[
                    "class_name"
                ],

            "email":
                record[
                    "email"
                ],

            "personal_email":
                record[
                    "personal_email"
                ],

            "response_email":
                record[
                    "response_email"
                ],

            "reflection":
                record[
                    "reflection"
                ],

            "purpose":
                record[
                    "purpose"
                ],

            "improvement":
                record[
                    "improvement"
                ],

            "rating":
                record[
                    "rating"
                ],

            "future_content":
                record[
                    "future_content"
                ],

            "raw_data":
                record[
                    "raw_data"
                ],

            "source":
                "EVIDENCE_IMPORT",

        }


    # AWS phải ghi thành công trước khi thay danh sách local.
    # Khi Pilot tắt / Activity khác, hàm này không gọi AWS.
    _sync_evidence_pilot(
        activity_id,
        activity,
        replacement_bucket,
    )

    bucket = get_activity_bucket(evidence, activity_id)
    bucket.clear()
    bucket.update(replacement_bucket)


    imported_at = datetime.now(
        VN_TIMEZONE
    ).isoformat()


    error_summary = (
        build_error_summary(
            validated
        )
    )


    registered_count = len(
        registrations.get(
            activity_id,
            {}
        )
    )


    # ======================================
    # IMPORT METADATA
    # ======================================

    activity[
        "evidence_count"
    ] = len(
        bucket
    )


    activity[
        "evidence_import"
    ] = {

        "source":
            "GOOGLE_FORM",

        "file_name":
            filename,

        "imported_at":
            imported_at,

        "imported_by_role":
            role,

        "total_rows":
            len(records),

        "valid_rows":
            len(
                valid_records
            ),

        "invalid_rows":
            len(
                invalid_records
            ),

        "registered_count":
            registered_count,

        "error_summary":
            error_summary,

        "detected_columns": {

            field:
                headers[index]

            for (
                field,
                index
            ) in columns.items()

        },

    }


    return {

        "success":
            True,

        "message":
            (
                f"Đã import "
                f"{len(valid_records)} "
                "Evidence hợp lệ."
            ),

        "data": {

            "activity_id":
                activity_id,

            "activity_name":
                activity.get(
                    "activity_name"
                ),

            "file_name":
                filename,

            "total_rows":
                len(records),

            "imported_count":
                len(
                    valid_records
                ),

            "invalid_count":
                len(
                    invalid_records
                ),

            "error_summary":
                error_summary,

            "invalid_rows":
                invalid_records[
                    :50
                ],

            "imported_at":
                imported_at,

        },

    }


# ==========================================
# GET EVIDENCE
# ==========================================

@router.get(
    "/{activity_id}/evidence"
)
def get_evidence(
    activity_id: str,

    role: str = Depends(
        get_current_role
    ),
):

    _ = role


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


    bucket = evidence.get(
        activity_id,
        {}
    )


    items = list(
        bucket.values()
    )


    items.sort(
        key=lambda item:
            (
                item.get(
                    "submitted_at",
                    ""
                ),
                item.get(
                    "mssv",
                    ""
                ),
            )
    )


    # ======================================
    # DATASET STATUS
    # ======================================

    evidence_import = (
        activity.get(
            "evidence_import"
        )
    )


    # Demo data cũ có thể có Evidence
    # nhưng chưa có metadata evidence_import.
    imported = (
        bool(
            evidence_import
        )
        or
        bool(
            items
        )
    )


    registered_count = len(
        registrations.get(
            activity_id,
            {}
        )
    )


    evidence_count = len(
        items
    )


    missing_count = max(
        registered_count
        -
        evidence_count,
        0
    )


    if registered_count > 0:

        coverage_rate = round(
            (
                evidence_count
                /
                registered_count
            )
            * 100,
            1
        )

    else:

        coverage_rate = 0


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

            # Đây là phần quan trọng:
            #
            # NOT_IMPORTED != sinh viên không có Evidence.
            "dataset_status":
                (
                    "IMPORTED"
                    if imported
                    else "NOT_IMPORTED"
                ),

            "imported":
                imported,

            "registered_count":
                registered_count,

            "total":
                evidence_count,

            # Chỉ được kết luận thiếu Evidence
            # sau khi dataset đã tồn tại.
            "missing_count":
                (
                    missing_count
                    if imported
                    else None
                ),

            "coverage_rate":
                (
                    coverage_rate
                    if imported
                    else None
                ),

            "evidence_import":
                evidence_import,

            "items":
                items,

        },

    }