from __future__ import annotations



from datetime import datetime

from typing import Any

from zoneinfo import ZoneInfo



from fastapi import APIRouter, Depends



from app.auth import (

    CurrentUser,

    require_student_with_mssv,

)

from app.data.store import (

    activities,

    attendance,

    evidence,

    participation,

    registrations,

)





router = APIRouter(

    prefix="/me",

    tags=["My Results"],

)



VN_TIMEZONE = ZoneInfo("Asia/Ho_Chi_Minh")





# ==========================================

# GENERIC HELPERS

# ==========================================



TRUE_VALUES = {

    "1",

    "TRUE",

    "YES",

    "Y",

    "CÓ",

    "CO",

}





def normalize_mssv(value: Any) -> str:

    return str(value or "").strip().upper()





def is_true(value: Any) -> bool:

    if value is True or value == 1:

        return True



    return str(value or "").strip().upper() in TRUE_VALUES





def get_bucket_record(

    store: dict,

    activity_id: str,

    mssv: str,

) -> dict:

    """

    Các store hiện tại chủ yếu có dạng:

        store[activity_id][mssv] = {...}



    Helper này vẫn hỗ trợ bucket là list để tương thích

    dữ liệu cũ đã từng được import theo cấu trúc khác.

    """



    bucket = store.get(activity_id, {})



    if isinstance(bucket, dict):

        direct = bucket.get(mssv)



        if isinstance(direct, dict):

            return direct



        for key, record in bucket.items():

            if (

                normalize_mssv(key) == mssv

                and isinstance(record, dict)

            ):

                return record



        return {}



    if isinstance(bucket, list):

        for record in bucket:

            if not isinstance(record, dict):

                continue



            if normalize_mssv(record.get("mssv")) == mssv:

                return record



    return {}





def first_timestamp(

    *records: dict,

    keys: tuple[str, ...],

) -> str | None:

    for record in records:

        if not isinstance(record, dict):

            continue



        for key in keys:

            value = record.get(key)



            if isinstance(value, datetime):

                return value.isoformat()



            if isinstance(value, str):

                text = value.strip()



                if (

                    text

                    and text.upper()

                    not in {

                        "YES",

                        "NO",

                        "TRUE",

                        "FALSE",

                        "Y",

                        "N",

                    }

                ):

                    return text



    return None





def has_event(

    attendance_record: dict,

    participation_record: dict,

    event_type: str,

) -> bool:

    if event_type == "checkin":

        timestamp_keys = (

            "check_in_at",

            "checked_in_at",

            "check_in_time",

            "checkin_at",

            "checkin_time",

            "check_in",

        )

        boolean_keys = (

            "checked_in",

            "check_in",

        )

    else:

        timestamp_keys = (

            "check_out_at",

            "checked_out_at",

            "check_out_time",

            "checkout_at",

            "checkout_time",

            "check_out",

        )

        boolean_keys = (

            "checked_out",

            "check_out",

        )



    if first_timestamp(

        attendance_record,

        participation_record,

        keys=timestamp_keys,

    ):

        return True



    for record in (

        attendance_record,

        participation_record,

    ):

        if not isinstance(record, dict):

            continue



        for key in boolean_keys:

            if is_true(record.get(key)):

                return True



    return False





def event_time(

    attendance_record: dict,

    participation_record: dict,

    event_type: str,

) -> str | None:

    if event_type == "checkin":

        keys = (

            "check_in_at",

            "checked_in_at",

            "check_in_time",

            "checkin_at",

            "checkin_time",

            "check_in",

        )

    else:

        keys = (

            "check_out_at",

            "checked_out_at",

            "check_out_time",

            "checkout_at",

            "checkout_time",

            "check_out",

        )



    return first_timestamp(

        attendance_record,

        participation_record,

        keys=keys,

    )





def evidence_status(

    activity: dict,

    evidence_bucket: Any,

    evidence_record: dict,

) -> str:

    dataset_imported = bool(

        activity.get("evidence_import")

    ) or bool(evidence_bucket)



    if not dataset_imported:

        return "NOT_IMPORTED"



    if evidence_record:

        submitted = evidence_record.get("submitted")



        # File Evidence cũ không phải lúc nào cũng có field submitted.

        # Nếu đã có record của MSSV thì vẫn xem là có Evidence,

        # trừ khi submitted được ghi rõ là false.

        if submitted is None or is_true(submitted):

            return "YES"



    return "NO"





def is_published_activity(activity: dict) -> bool:

    publication_status = str(

        activity.get("publication_status")

        or ""

    ).strip().upper()



    if publication_status:

        return publication_status == "PUBLISHED"



    # Tương thích activity demo cũ chưa có publication_status.

    status = str(

        activity.get("status")

        or ""

    ).strip().upper()



    return status in {

        "PUBLISHED",

        "UPCOMING",

        "ACTIVE",

        "COMPLETED",

    }





def parse_datetime(value: Any) -> datetime | None:

    if isinstance(value, datetime):

        parsed = value

    else:

        text = str(value or "").strip()



        if not text:

            return None



        if text.endswith("Z"):

            text = text[:-1] + "+00:00"



        try:

            parsed = datetime.fromisoformat(text)

        except ValueError:

            return None



    if parsed.tzinfo is None:

        parsed = parsed.replace(tzinfo=VN_TIMEZONE)



    return parsed.astimezone(VN_TIMEZONE)





def runtime_activity_status(activity: dict) -> str:
    """
    Tính trạng thái theo thời gian hiện tại thay vì tin vào field status
    đã lưu trước đó trong store.
    """
    publication_status = str(
        activity.get("publication_status")
        or ""
    ).strip().upper()

    if publication_status == "CANCELLED":
        return "CANCELLED"

    start = parse_datetime(activity.get("start_time"))
    end = parse_datetime(activity.get("end_time"))

    if start is None or end is None:
        fallback = str(
            activity.get("status")
            or "UPCOMING"
        ).strip().upper()

        if fallback in {
            "UPCOMING",
            "ACTIVE",
            "COMPLETED",
        }:
            return fallback

        return "UPCOMING"

    now = datetime.now(VN_TIMEZONE)

    if now < start:
        return "UPCOMING"

    if now <= end:
        return "ACTIVE"

    return "COMPLETED"


def percentage(

    numerator: int,

    denominator: int,

) -> float:

    if denominator <= 0:

        return 0.0



    return round(

        (numerator / denominator) * 100,

        1,

    )





def safe_int(

    value: Any,

    default: int = 0,

) -> int:

    try:

        return int(value)

    except (TypeError, ValueError):

        return default





def student_payload(

    user: CurrentUser,

) -> dict:

    return {

        "mssv": normalize_mssv(user.mssv),

        "full_name": user.full_name,

        "class_name": user.class_name,

        "cohort": user.cohort,

    }





def build_my_rows(

    user: CurrentUser,

) -> list[dict]:

    """

    Tổng hợp dữ liệu cá nhân theo đúng MSSV lấy từ session.



    Hàm này là nguồn dùng chung cho:

    - GET /me/results

    - GET /me/analytics

    """



    mssv = normalize_mssv(user.mssv)

    rows: list[dict] = []



    for activity_id, activity in activities.items():

        if not isinstance(activity, dict):

            continue



        if not is_published_activity(activity):

            continue



        registration_record = get_bucket_record(

            registrations,

            activity_id,

            mssv,

        )

        attendance_record = get_bucket_record(

            attendance,

            activity_id,

            mssv,

        )

        evidence_record = get_bucket_record(

            evidence,

            activity_id,

            mssv,

        )

        participation_record = get_bucket_record(

            participation,

            activity_id,

            mssv,

        )



        # Chỉ hiện hoạt động có liên quan tới sinh viên này.

        if not any(

            (

                registration_record,

                attendance_record,

                evidence_record,

                participation_record,

            )

        ):

            continue



        registered = bool(registration_record)



        checked_in = has_event(

            attendance_record,

            participation_record,

            "checkin",

        )

        checked_out = has_event(

            attendance_record,

            participation_record,

            "checkout",

        )



        current_evidence_status = evidence_status(

            activity,

            evidence.get(activity_id, {}),

            evidence_record,

        )



        reconciliation_status = str(

            participation_record.get(

                "reconciliation_status"

            )

            or "NOT_RECONCILED"

        ).strip().upper()



        final_status = str(

            participation_record.get(

                "final_status"

            )

            or (

                "PENDING"

                if participation_record

                else "NOT_AVAILABLE"

            )

        ).strip().upper()



        point_value = safe_int(

            activity.get("point_value"),

            0,

        )



        rows.append(

            {

                "activity_id": activity_id,

                "activity_name": activity.get(

                    "activity_name"

                ) or activity.get("name") or "Hoạt động",

                "activity_type": activity.get(

                    "activity_type"

                ) or "OTHER",

                "description": activity.get(

                    "description"

                ) or "",

                "start_time": activity.get(

                    "start_time"

                ),

                "end_time": activity.get(

                    "end_time"

                ),

                "location": activity.get(

                    "location"

                ) or "",

                "image_url": activity.get(

                    "image_url"

                ),

                "status": activity.get(

                    "status"

                ),

                "publication_status": activity.get(

                    "publication_status"

                ),

                "final_list_locked": bool(

                    activity.get("final_list_locked")

                ),

                "semester": str(

                    activity.get("semester")

                    or ""

                ).strip(),

                "academic_year": str(

                    activity.get("academic_year")

                    or ""

                ).strip(),

                "point_value": point_value,

                "registered": registered,

                "registered_at": (

                    registration_record.get(

                        "registered_at"

                    )

                    if registration_record

                    else None

                ),

                "check_in": checked_in,

                "check_in_at": event_time(

                    attendance_record,

                    participation_record,

                    "checkin",

                ),

                "check_out": checked_out,

                "check_out_at": event_time(

                    attendance_record,

                    participation_record,

                    "checkout",

                ),

                "evidence_status": current_evidence_status,

                "evidence_submitted": (

                    True

                    if current_evidence_status == "YES"

                    else False

                    if current_evidence_status == "NO"

                    else None

                ),

                "evidence_submitted_at": (

                    evidence_record.get("submitted_at")

                    if evidence_record

                    else None

                ),

                "reconciliation_status": reconciliation_status,

                "issues": list(

                    participation_record.get("issues")

                    or []

                ),

                "final_status": final_status,

                "decision_source": participation_record.get(

                    "decision_source"

                ),

                "confirmed_at": participation_record.get(

                    "confirmed_at"

                ),

                "note": participation_record.get(

                    "note"

                ) or "",

            }

        )



    rows.sort(

        key=lambda item: str(

            item.get("start_time")

            or ""

        ),

        reverse=True,

    )



    return rows






def build_my_activity_rows(
    user: CurrentUser,
) -> list[dict]:
    """
    Trả toàn bộ hoạt động đã PUBLISHED cho STUDENT đang đăng nhập.

    Trạng thái đăng ký chỉ được xác định từ danh sách Registration
    mà BTC đã import từ Portal của trường. Frontend không truyền MSSV,
    vì vậy sinh viên không thể kiểm tra trạng thái đăng ký của người khác.
    """

    mssv = normalize_mssv(user.mssv)
    rows: list[dict] = []

    for activity_id, activity in activities.items():
        if not isinstance(activity, dict):
            continue

        if not is_published_activity(activity):
            continue

        registration_record = get_bucket_record(
            registrations,
            activity_id,
            mssv,
        )

        registered = bool(registration_record)

        rows.append(
            {
                "activity_id": activity_id,
                "activity_name": activity.get(
                    "activity_name"
                ) or activity.get("name") or "Hoạt động",
                "activity_type": activity.get(
                    "activity_type"
                ) or "OTHER",
                "description": activity.get(
                    "description"
                ) or "",
                "start_time": activity.get(
                    "start_time"
                ),
                "end_time": activity.get(
                    "end_time"
                ),
                "location": activity.get(
                    "location"
                ) or "",
                "image_url": activity.get(
                    "image_url"
                ),
                "status": runtime_activity_status(
                    activity
                ),
                "publication_status": activity.get(
                    "publication_status"
                ),
                "capacity": activity.get(
                    "capacity"
                ),
                "is_featured": is_true(
                    activity.get("is_featured")
                ),
                "final_list_locked": bool(
                    activity.get("final_list_locked")
                ),
                "semester": str(
                    activity.get("semester")
                    or ""
                ).strip(),
                "academic_year": str(
                    activity.get("academic_year")
                    or ""
                ).strip(),
                "point_value": safe_int(
                    activity.get("point_value"),
                    0,
                ),
                "registered": registered,
                "registered_at": (
                    registration_record.get(
                        "registered_at"
                    )
                    if registration_record
                    else None
                ),
                "registration_source": "PORTAL_IMPORT",
            }
        )

    rows.sort(
        key=lambda item: str(
            item.get("start_time")
            or ""
        ),
        reverse=True,
    )

    return rows


def build_result_summary(

    rows: list[dict],

) -> dict:

    return {

        "total_activities": len(rows),

        "registered": sum(

            1 for row in rows

            if row["registered"]

        ),

        "checked_in": sum(

            1 for row in rows

            if row["check_in"]

        ),

        "checked_out": sum(

            1 for row in rows

            if row["check_out"]

        ),

        "evidence_yes": sum(

            1 for row in rows

            if row["evidence_status"] == "YES"

        ),

        "confirmed": sum(

            1 for row in rows

            if row["final_status"] == "CONFIRMED"

        ),

        "rejected": sum(

            1 for row in rows

            if row["final_status"] == "REJECTED"

        ),

        "pending": sum(

            1 for row in rows

            if row["final_status"] in {

                "PENDING",

                "NOT_AVAILABLE",

            }

        ),

    }





# ==========================================

# MY RESULTS

# ==========================================



@router.get("/results")

def get_my_results(

    user: CurrentUser = Depends(

        require_student_with_mssv

    ),

):

    """

    Trả dữ liệu tham gia CHỈ của MSSV đang đăng nhập.



    Frontend không truyền MSSV vào request, vì vậy sinh viên

    không thể đổi URL/query để xem dữ liệu của người khác.

    """



    rows = build_my_rows(user)



    return {

        "success": True,

        "data": {

            "student": student_payload(user),

            "summary": build_result_summary(rows),

            "items": rows,

        },

    }






# ==========================================
# MY ACTIVITIES
# ==========================================


@router.get("/activities")
def get_my_activities(
    user: CurrentUser = Depends(
        require_student_with_mssv
    ),
):
    """
    Trả tất cả hoạt động đã công bố cho STUDENT kèm trạng thái
    đăng ký của chính MSSV đang đăng nhập.

    Registration là danh sách do BTC import từ Portal của trường.
    Endpoint này không tạo đăng ký mới và không cho phép STUDENT
    tự đăng ký trong hệ thống.
    """

    rows = build_my_activity_rows(user)

    return {
        "success": True,
        "data": {
            "student": student_payload(user),
            "items": rows,
        },
    }


# ==========================================

# MY ANALYTICS

# ==========================================



@router.get("/analytics")

def get_my_analytics(

    user: CurrentUser = Depends(

        require_student_with_mssv

    ),

):

    """

    Analytics cá nhân cho STUDENT.



    Không nhận MSSV từ frontend. Toàn bộ dữ liệu được giới hạn

    bằng MSSV của session đang đăng nhập.

    """



    rows = build_my_rows(user)

    now = datetime.now(VN_TIMEZONE)



    registered_rows = [

        row for row in rows

        if row["registered"]

    ]



    registered_count = len(registered_rows)

    checked_in_count = sum(

        1 for row in registered_rows

        if row["check_in"]

    )

    checked_out_count = sum(

        1 for row in registered_rows

        if row["check_out"]

    )

    evidence_count = sum(

        1 for row in registered_rows

        if row["evidence_status"] == "YES"

    )

    confirmed_count = sum(

        1 for row in registered_rows

        if row["final_status"] == "CONFIRMED"

    )

    rejected_count = sum(

        1 for row in registered_rows

        if row["final_status"] == "REJECTED"

    )

    pending_count = sum(

        1 for row in registered_rows

        if row["final_status"] in {

            "PENDING",

            "NOT_AVAILABLE",

        }

    )



    total_points = sum(

        safe_int(row.get("point_value"))

        for row in registered_rows

        if row["final_status"] == "CONFIRMED"

    )



    upcoming_rows: list[dict] = []



    for row in registered_rows:

        start = parse_datetime(

            row.get("start_time")

        )



        if start is not None and start > now:

            upcoming_rows.append(

                {

                    "activity_id": row["activity_id"],

                    "activity_name": row["activity_name"],

                    "activity_type": row["activity_type"],

                    "start_time": row["start_time"],

                    "location": row["location"],

                    "image_url": row["image_url"],

                }

            )



    upcoming_rows.sort(

        key=lambda item: str(

            item.get("start_time")

            or ""

        )

    )



    # --------------------------------------

    # BY ACTIVITY TYPE

    # --------------------------------------



    type_buckets: dict[str, dict] = {}



    for row in registered_rows:

        activity_type = str(

            row.get("activity_type")

            or "OTHER"

        ).strip().upper()



        bucket = type_buckets.setdefault(

            activity_type,

            {

                "activity_type": activity_type,

                "total": 0,

                "confirmed": 0,

                "rejected": 0,

                "pending": 0,

                "points": 0,

            },

        )



        bucket["total"] += 1



        final_status = row["final_status"]



        if final_status == "CONFIRMED":

            bucket["confirmed"] += 1

            bucket["points"] += safe_int(

                row.get("point_value")

            )

        elif final_status == "REJECTED":

            bucket["rejected"] += 1

        else:

            bucket["pending"] += 1



    by_type = []



    for bucket in type_buckets.values():

        by_type.append(

            {

                **bucket,

                "participation_rate": percentage(

                    bucket["confirmed"],

                    bucket["total"],

                ),

            }

        )



    by_type.sort(

        key=lambda item: (

            -item["total"],

            item["activity_type"],

        )

    )



    # --------------------------------------

    # BY SEMESTER

    # --------------------------------------



    semester_buckets: dict[tuple[str, str], dict] = {}



    for row in registered_rows:

        academic_year = str(

            row.get("academic_year")

            or "Chưa xác định"

        ).strip()

        semester = str(

            row.get("semester")

            or "Chưa xác định"

        ).strip()



        key = (

            academic_year,

            semester,

        )



        bucket = semester_buckets.setdefault(

            key,

            {

                "academic_year": academic_year,

                "semester": semester,

                "total": 0,

                "confirmed": 0,

                "rejected": 0,

                "pending": 0,

                "points": 0,

            },

        )



        bucket["total"] += 1



        if row["final_status"] == "CONFIRMED":

            bucket["confirmed"] += 1

            bucket["points"] += safe_int(

                row.get("point_value")

            )

        elif row["final_status"] == "REJECTED":

            bucket["rejected"] += 1

        else:

            bucket["pending"] += 1



    by_semester = list(

        semester_buckets.values()

    )



    by_semester.sort(

        key=lambda item: (

            item["academic_year"],

            item["semester"],

        ),

        reverse=True,

    )



    # --------------------------------------

    # RECENT PERSONAL RESULTS

    # --------------------------------------



    recent = []



    for row in registered_rows[:8]:

        earned_points = (

            safe_int(row.get("point_value"))

            if row["final_status"] == "CONFIRMED"

            else 0

        )



        recent.append(

            {

                "activity_id": row["activity_id"],

                "activity_name": row["activity_name"],

                "activity_type": row["activity_type"],

                "start_time": row["start_time"],

                "location": row["location"],

                "final_status": row["final_status"],

                "check_in": row["check_in"],

                "check_out": row["check_out"],

                "evidence_status": row["evidence_status"],

                "point_value": row["point_value"],

                "earned_points": earned_points,

            }

        )



    summary = {

        "total_related": len(rows),

        "total_registered": registered_count,

        "checked_in": checked_in_count,

        "checked_out": checked_out_count,

        "evidence_submitted": evidence_count,

        "confirmed": confirmed_count,

        "rejected": rejected_count,

        "pending": pending_count,

        "upcoming_registered": len(upcoming_rows),

        "total_points": total_points,

        "attendance_rate": percentage(

            checked_in_count,

            registered_count,

        ),

        "checkout_rate": percentage(

            checked_out_count,

            registered_count,

        ),

        "evidence_rate": percentage(

            evidence_count,

            registered_count,

        ),

        "participation_rate": percentage(

            confirmed_count,

            registered_count,

        ),

    }



    return {

        "success": True,

        "data": {

            "student": student_payload(user),

            "summary": summary,

            "by_type": by_type,

            "by_semester": by_semester,

            "upcoming": upcoming_rows[:5],

            "recent": recent,

        },

    }
