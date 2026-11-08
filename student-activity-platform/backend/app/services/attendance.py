from datetime import datetime, timedelta
import os

import boto3
from botocore.exceptions import BotoCoreError, ClientError

from zoneinfo import ZoneInfo

from app.data.store import (

    students,

    activities,

    registrations,

    attendance,

    get_activity_bucket,

)

VN_TIMEZONE = ZoneInfo("Asia/Ho_Chi_Minh")

CHECK_IN_EARLY_MINUTES = 30

CHECK_IN_LATE_MINUTES = 20

# =========================================

# TIME

# =========================================

# =========================================
# AWS ATTENDANCE PILOT (OPT-IN)
# =========================================

def _is_aws_attendance_pilot(activity_id: str) -> bool:
    """Only one explicitly selected test activity can write to DynamoDB.

    Other activities always continue using the existing local workflow.
    """
    return (
        os.getenv("SAP_ATTENDANCE_AWS_PILOT", "0").strip() == "1"
        and bool(os.getenv("SAP_ATTENDANCE_AWS_TEST_ACTIVITY_ID", "").strip())
        and activity_id == os.getenv("SAP_ATTENDANCE_AWS_TEST_ACTIVITY_ID", "").strip()
    )


def _sync_attendance_event(activity_id, mssv, kind, timestamp, operator_id):
    """Write one scan immediately to AWS, before mutating local memory.

    The conditional update prevents duplicate scans from overwriting a
    timestamp already recorded on DynamoDB. A failure leaves local attendance
    unchanged, so the API never reports a successful local-only test scan.
    """
    if (
        os.getenv("SAP_ATTENDANCE_AWS_PILOT", "0").strip() == "1"
        and not os.getenv("SAP_ATTENDANCE_AWS_TEST_ACTIVITY_ID", "").strip()
    ):
        return failure(
            "AWS_ATTENDANCE_CONFIG_ERROR",
            "Attendance AWS Pilot đang bật nhưng thiếu SAP_ATTENDANCE_AWS_TEST_ACTIVITY_ID. Không ghi local để tránh đồng bộ thiếu.",
        )

    if not _is_aws_attendance_pilot(activity_id):
        return None

    if kind not in {"check_in", "check_out"}:
        return failure("AWS_ATTENDANCE_CONFIG_ERROR", "Loại sự kiện điểm danh không hợp lệ.")

    region = (
        os.getenv("AWS_REGION")
        or os.getenv("AWS_DEFAULT_REGION")
        or "ap-southeast-1"
    )
    table_name = os.getenv("SAP_ATTENDANCE_TABLE", "SAP-Attendance").strip()

    time_field = f"{kind}_time"
    by_field = f"{kind}_by"
    try:
        table = boto3.resource("dynamodb", region_name=region).Table(table_name)
        table.update_item(
            Key={"activity_id": activity_id, "mssv": mssv},
            UpdateExpression="SET #time = :time, #by = :by",
            ConditionExpression="attribute_not_exists(#time)",
            ExpressionAttributeNames={"#time": time_field, "#by": by_field},
            ExpressionAttributeValues={":time": timestamp, ":by": operator_id},
        )
        return None
    except ClientError as exc:
        error_code = exc.response.get("Error", {}).get("Code", "")
        if error_code == "ConditionalCheckFailedException":
            return failure(
                "AWS_ATTENDANCE_CONFLICT",
                "AWS đã ghi nhận lượt điểm danh này. Không ghi đè thời gian cũ; cần đối chiếu local và DynamoDB.",
            )
        return failure(
            "AWS_ATTENDANCE_SYNC_FAILED",
            "Không thể ghi Attendance lên DynamoDB. Điểm danh local chưa thay đổi. Kiểm tra quyền IAM, AWS login và log máy chủ.",
        )
    except (BotoCoreError, OSError, ValueError) as exc:
        return failure(
            "AWS_ATTENDANCE_SYNC_FAILED",
            "Không thể kết nối DynamoDB. Điểm danh local chưa thay đổi. Kiểm tra AWS profile và log máy chủ.",
        )


def now_vn():

    return datetime.now(VN_TIMEZONE)

def failure(code, message, data=None):

    result = {

        "success": False,

        "code": code,

        "message": message,

    }

    if data is not None:

        result["data"] = data

    return result

def activity_schedule(activity):

    try:

        start = datetime.fromisoformat(

            activity["start_time"]

        )

        end = datetime.fromisoformat(

            activity["end_time"]

        )

        if start.tzinfo is None:

            start = start.replace(

                tzinfo=VN_TIMEZONE

            )

        if end.tzinfo is None:

            end = end.replace(

                tzinfo=VN_TIMEZONE

            )

        start = start.astimezone(

            VN_TIMEZONE

        )

        end = end.astimezone(

            VN_TIMEZONE

        )

        if end <= start:

            return None

        return start, end

    except (

        KeyError,

        TypeError,

        ValueError,

    ):

        return None

# =========================================

# STUDENT / REGISTRATION HELPERS

# =========================================

def get_registration_record(

    activity_id,

    mssv,

):

    return registrations.get(

        activity_id,

        {},

    ).get(

        mssv,

        {},

    )

def get_student_full_name(

    activity_id,

    mssv,

):

    registration = (

        get_registration_record(

            activity_id,

            mssv,

        )

    )

    student = students.get(

        mssv,

        {},

    )

    return (

        registration.get("full_name")

        or registration.get("student_name")

        or registration.get("name")

        or student.get("full_name")

        or student.get("student_name")

        or student.get("name")

        or ""

    )

# =========================================

# VALIDATION

# =========================================

def validate_student(

    activity_id,

    mssv,

):

    activity = activities.get(

        activity_id

    )

    if activity is None:

        return None, None, failure(

            "ACTIVITY_NOT_FOUND",

            "Không tìm thấy hoạt động.",

        )

    if activity.get(

        "final_list_locked",

        False,

    ):

        return None, None, failure(

            "ACTIVITY_LOCKED",

            "Danh sách hoạt động đã bị khóa.",

        )

    publication_status = str(

        activity.get(

            "publication_status",

            activity.get(

                "status",

                "",

            ),

        )

    ).strip().upper()

    if publication_status == "CANCELLED":

        return None, None, failure(

            "ACTIVITY_CANCELLED",

            "Hoạt động đã bị hủy. Không thể Check-in hoặc Check-out.",

        )

    # Chỉ hoạt động đã công bố mới được ghi nhận điểm danh.
    if publication_status != "PUBLISHED":
        return None, None, failure(
            "ACTIVITY_NOT_PUBLISHED",
            "Chỉ hoạt động đã công bố mới được Check-in hoặc Check-out.",
        )

    mssv = str(

        mssv or ""

    ).strip().upper()

    if not mssv:

        return None, None, failure(

            "MSSV_REQUIRED",

            "Vui lòng nhập MSSV.",

        )

    registration_bucket = (

        registrations.get(

            activity_id,

            {},

        )

    )

    # Registration là nguồn xác thực chính.

    #

    # Sinh viên chỉ cần có trong danh sách

    # đăng ký của hoạt động là được phép

    # Check-in / Check-out.

    #

    # KHÔNG phụ thuộc Evidence.

    # KHÔNG bắt buộc phải tồn tại sẵn

    # trong global students.

    if mssv not in registration_bucket:

        return None, None, failure(

            "NOT_REGISTERED",

            "Sinh viên chưa có tên trong danh sách đăng ký từ Portal của hoạt động này.",

        )

    return activity, mssv, None

# =========================================

# ATTENDANCE RECORD

# =========================================

def attendance_record(

    activity_id,

    mssv,

):

    bucket = get_activity_bucket(

        attendance,

        activity_id,

    )

    if mssv not in bucket:

        bucket[mssv] = {

            "activity_id": activity_id,

            "mssv": mssv,

            "check_in_time": None,

            "check_out_time": None,

            "check_in_by": None,

            "check_out_by": None,

        }

    return bucket[mssv]

# =========================================

# CHECK-IN

# =========================================

def check_in(

    activity_id: str,

    mssv: str,

    operator_id: str,

):

    activity, mssv, error = (

        validate_student(

            activity_id,

            mssv,

        )

    )

    if error:

        return error

    operator_id = str(

        operator_id or ""

    ).strip()

    if not operator_id:

        return failure(

            "OPERATOR_REQUIRED",

            "Không xác định được tài khoản ADMIN thực hiện Check-in.",

        )

    schedule = activity_schedule(

        activity

    )

    if schedule is None:

        return failure(

            "INVALID_SCHEDULE",

            "Hoạt động chưa có thời gian hợp lệ.",

        )

    start, _ = schedule

    current = now_vn()

    opens = start - timedelta(

        minutes=CHECK_IN_EARLY_MINUTES

    )

    closes = start + timedelta(

        minutes=CHECK_IN_LATE_MINUTES

    )

    if current < opens:

        return failure(

            "CHECK_IN_NOT_OPEN",

            "Chưa đến giờ Check-in. "

            f"Mở lúc {opens:%d/%m/%Y %H:%M}.",

        )

    if current > closes:

        return failure(

            "CHECK_IN_CLOSED",

            "Đã hết giờ Check-in "

            f"({closes:%d/%m/%Y %H:%M}).",

        )

    existing = attendance.get(

        activity_id,

        {},

    ).get(

        mssv

    )

    if (

        existing

        and existing.get(

            "check_in_time"

        )

    ):

        return failure(

            "ALREADY_CHECKED_IN",

            "Sinh viên đã Check-in.",

            existing,

        )

    timestamp = current.isoformat()
    sync_error = _sync_attendance_event(
        activity_id, mssv, "check_in", timestamp, operator_id
    )
    if sync_error is not None:
        return sync_error

    record = attendance_record(activity_id, mssv)
    record["check_in_time"] = timestamp
    record["check_in_by"] = operator_id

    return {

        "success": True,

        "code": "CHECK_IN_SUCCESS",

        "message": "Check-in thành công.",

        "data": {

            **record,

            "full_name":

                get_student_full_name(

                    activity_id,

                    mssv,

                ),

        },

    }

# =========================================

# CHECK-OUT

# =========================================

def check_out(

    activity_id: str,

    mssv: str,

    operator_id: str,

):

    activity, mssv, error = (

        validate_student(

            activity_id,

            mssv,

        )

    )

    if error:

        return error

    operator_id = str(

        operator_id or ""

    ).strip()

    if not operator_id:

        return failure(

            "OPERATOR_REQUIRED",

            "Không xác định được tài khoản ADMIN thực hiện Check-out.",

        )

    schedule = activity_schedule(

        activity

    )

    if schedule is None:

        return failure(

            "INVALID_SCHEDULE",

            "Hoạt động chưa có thời gian hợp lệ.",

        )

    start, _ = schedule

    current = now_vn()

    if current < start:

        return failure(

            "CHECK_OUT_BEFORE_START",

            "Chương trình chưa bắt đầu.",

        )

    if not activity.get(

        "check_out_open",

        False,

    ):

        return failure(

            "CHECK_OUT_NOT_OPEN",

            "BTC chưa mở Check-out.",

        )

    existing = attendance.get(

        activity_id,

        {},

    ).get(

        mssv

    )

    if (

        existing

        and existing.get(

            "check_out_time"

        )

    ):

        return failure(

            "ALREADY_CHECKED_OUT",

            "Sinh viên đã Check-out.",

            existing,

        )

    # Vẫn cho phép Check-out nếu sinh viên

    # bỏ lỡ Check-in để BTC xử lý khi đối soát.

    timestamp = current.isoformat()
    sync_error = _sync_attendance_event(
        activity_id, mssv, "check_out", timestamp, operator_id
    )
    if sync_error is not None:
        return sync_error

    record = attendance_record(activity_id, mssv)
    record["check_out_time"] = timestamp
    record["check_out_by"] = operator_id

    return {

        "success": True,

        "code": "CHECK_OUT_SUCCESS",

        "message": "Check-out thành công.",

        "data": {

            **record,

            "full_name":

                get_student_full_name(

                    activity_id,

                    mssv,

                ),

        },

    }

# =========================================

# OPEN / CLOSE CHECK-OUT

# =========================================

def set_checkout_state(

    activity_id: str,

    is_open: bool,

):

    activity = activities.get(

        activity_id

    )

    if activity is None:

        return failure(

            "ACTIVITY_NOT_FOUND",

            "Không tìm thấy hoạt động.",

        )

    if activity.get(

        "final_list_locked",

        False,

    ):

        return failure(

            "ACTIVITY_LOCKED",

            "Danh sách hoạt động đã bị khóa.",

        )

    if is_open:

        publication_status = str(
            activity.get("publication_status", activity.get("status", ""))
        ).strip().upper()
        if publication_status == "CANCELLED":
            return failure(
                "ACTIVITY_CANCELLED",
                "Không thể mở Check-out cho hoạt động đã hủy.",
            )
        if publication_status != "PUBLISHED":
            return failure(
                "ACTIVITY_NOT_PUBLISHED",
                "Chỉ hoạt động đã công bố mới được mở Check-out.",
            )

        schedule = activity_schedule(

            activity

        )

        if schedule is None:

            return failure(

                "INVALID_SCHEDULE",

                "Hoạt động chưa có thời gian hợp lệ.",

            )

        start, _ = schedule

        if now_vn() < start:

            return failure(

                "CHECK_OUT_BEFORE_START",

                "Không thể mở Check-out "

                "trước khi sự kiện bắt đầu.",

            )

    activity["check_out_open"] = (

        is_open

    )

    return {

        "success": True,

        "code": (

            "CHECK_OUT_OPENED"

            if is_open

            else "CHECK_OUT_CLOSED"

        ),

        "message": (

            "Đã mở Check-out."

            if is_open

            else "Đã đóng Check-out."

        ),

        "data": {

            "activity_id": activity_id,

            "check_out_open": is_open,

        },

    }
