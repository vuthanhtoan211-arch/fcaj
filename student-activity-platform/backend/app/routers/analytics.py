from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi import (
    APIRouter,
    Depends,
)

from app.data.store import (
    activities,
    attendance,
    evidence,
    registrations,
)

from app.repositories.participation_read_repository import get_participation_bucket_for_read

from app.auth import CurrentUser, require_admin


# ==========================================
# ROUTER
# ==========================================

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


VN_TIMEZONE = ZoneInfo(
    "Asia/Ho_Chi_Minh"
)


# ==========================================
# BOOLEAN
# ==========================================

def is_true(
    value,
):

    if (
        value is True
        or value == 1
    ):

        return True


    return str(
        value or ""
    ).strip().upper() in {
        "YES",
        "TRUE",
        "Y",
        "1",
    }


# ==========================================
# ATTENDANCE EVENT
# ==========================================

def has_event(
    attendance_record,
    participation_record,
    event_type,
):

    attendance_record = (
        attendance_record
        if isinstance(
            attendance_record,
            dict,
        )
        else {}
    )


    participation_record = (
        participation_record
        if isinstance(
            participation_record,
            dict,
        )
        else {}
    )


    if event_type == "checkin":

        timestamp_keys = [
            "check_in_at",
            "checked_in_at",
            "check_in_time",
            "checkin_at",
            "checkin_time",
        ]

        attendance_keys = [
            "check_in",
            "checked_in",
        ]

        participation_keys = [
            "check_in",
            "checked_in",
        ]

    else:

        timestamp_keys = [
            "check_out_at",
            "checked_out_at",
            "check_out_time",
            "checkout_at",
            "checkout_time",
        ]

        attendance_keys = [
            "check_out",
            "checked_out",
        ]

        participation_keys = [
            "check_out",
            "checked_out",
        ]


    # Timestamp tồn tại
    for key in timestamp_keys:

        value = attendance_record.get(
            key
        )


        if (
            value is not None
            and str(
                value
            ).strip()
        ):

            return True


    # Attendance boolean
    for key in attendance_keys:

        value = attendance_record.get(
            key
        )


        if is_true(
            value
        ):

            return True


        # Một số phiên bản lưu trực tiếp
        # timestamp vào check_in/check_out.
        if (
            isinstance(
                value,
                str,
            )
            and value.strip()
            and value.strip().upper()
            not in {
                "YES",
                "NO",
                "TRUE",
                "FALSE",
            }
        ):

            return True


    # Participation sau đối soát
    for key in participation_keys:

        if is_true(
            participation_record.get(
                key
            )
        ):

            return True


    return False


# ==========================================
# ACTIVITY FILTER
# ==========================================

def is_usable_activity(
    activity_id,
    activity,
):

    if (
        activity_id
        == "ACT#DEMO"
    ):

        return False


    if str(
        activity.get(
            "academic_year",
            ""
        )
    ).upper() == "TEST":

        return False


    publication_status = str(
        activity.get(
            "publication_status",
            ""
        )
    ).upper()


    status = str(
        activity.get(
            "status",
            ""
        )
    ).upper()


    if (
        publication_status
        == "CANCELLED"
        or status
        == "CANCELLED"
    ):

        return False


    # Nếu có publication_status thì chỉ
    # thống kê hoạt động đã xuất bản.
    if (
        publication_status
        and publication_status
        not in {
            "PUBLISHED",
        }
    ):

        return False


    return True


# ==========================================
# SAFE PERCENT
# ==========================================

def calculate_percent(
    value,
    total,
):

    if not total:

        return 0.0


    return round(
        (
            value
            / total
        )
        * 100,
        1,
    )


# ==========================================
# PER ACTIVITY
# ==========================================

def build_activity_analytics(
    activity_id,
    activity,
):

    registration_bucket = (
        registrations.get(
            activity_id,
            {},
        )
    )


    attendance_bucket = (
        attendance.get(
            activity_id,
            {},
        )
    )


    evidence_bucket = (
        evidence.get(
            activity_id,
            {},
        )
    )


    participation_bucket = get_participation_bucket_for_read(activity_id)


    # Các tỷ lệ luôn tính trên sinh viên có đăng ký.
    registered_ids = set(registration_bucket)
    check_in_count = 0
    check_out_count = 0
    evidence_count = 0
    confirmed_count = 0
    rejected_count = 0
    pending_count = 0
    not_reconciled_count = 0

    for mssv in registered_ids:
        attendance_record = attendance_bucket.get(mssv, {})
        participation_record = participation_bucket.get(mssv, {})
        evidence_record = evidence_bucket.get(mssv, {})

        if has_event(attendance_record, participation_record, "checkin"):
            check_in_count += 1
        if has_event(attendance_record, participation_record, "checkout"):
            check_out_count += 1
        if isinstance(evidence_record, dict) and is_true(evidence_record.get("submitted")):
            evidence_count += 1

        if mssv not in participation_bucket:
            not_reconciled_count += 1
            continue

        final_status = str(participation_record.get("final_status") or "PENDING").strip().upper() if isinstance(participation_record, dict) else "PENDING"
        if final_status == "CONFIRMED":
            confirmed_count += 1
        elif final_status == "REJECTED":
            rejected_count += 1
        else:
            pending_count += 1

    registered_count = len(registered_ids)
    # Không nhập các bản ghi không đăng ký vào tỷ lệ; vẫn báo cáo để rà soát.
    outside_attendance_count = len(set(attendance_bucket) - registered_ids)
    outside_participation_count = len(set(participation_bucket) - registered_ids)
    outside_evidence_count = len(set(evidence_bucket) - registered_ids)

    final_list_locked = is_true(activity.get("final_list_locked", False))
    official_confirmed_count = confirmed_count if final_list_locked else 0

    return {

        "activity_id":
            activity_id,

        "activity_name":
            activity.get(
                "activity_name",
                "",
            ),

        "activity_type":
            activity.get(
                "activity_type",
                "OTHER",
            ),

        "start_time":
            activity.get(
                "start_time",
            ),

        "location":
            activity.get(
                "location",
                "",
            ),

        "semester":
            activity.get(
                "semester",
                "",
            ),

        "academic_year":
            activity.get(
                "academic_year",
                "",
            ),

        "final_list_locked": final_list_locked,

        "registered":
            registered_count,

        "check_in":
            check_in_count,

        "check_out":
            check_out_count,

        "evidence":
            evidence_count,

        "confirmed":
            confirmed_count,

        "rejected":
            rejected_count,

        "pending":
            pending_count,

        "not_reconciled": not_reconciled_count,
        "official_confirmed": official_confirmed_count,
        "registered_locked": registered_count if final_list_locked else 0,
        "outside_registration_attendance": outside_attendance_count,
        "outside_registration_participation": outside_participation_count,
        "outside_registration_evidence": outside_evidence_count,

        "attendance_rate":
            calculate_percent(
                check_in_count,
                registered_count,
            ),

        "checkout_rate":
            calculate_percent(
                check_out_count,
                registered_count,
            ),

        # Ty le doi soat (co the con thay doi neu chua khoa).
        "completion_rate": calculate_percent(confirmed_count, registered_count),
        # Ty le chinh thuc: chi co y nghia cho danh sach da khoa.
        "official_completion_rate": calculate_percent(official_confirmed_count, registered_count) if final_list_locked else 0.0,
    }


# ==========================================
# SUMMARY
# ==========================================

@router.get(
    "/summary"
)
def get_analytics_summary(
    current_user: CurrentUser = Depends(require_admin),
):

    _ = current_user


    rows = []


    for (
        activity_id,
        activity,
    ) in activities.items():

        if not is_usable_activity(
            activity_id,
            activity,
        ):

            continue


        rows.append(
            build_activity_analytics(
                activity_id,
                activity,
            )
        )


    rows.sort(
        key=lambda item:
            str(
                item.get(
                    "start_time",
                    ""
                )
            ),
        reverse=True,
    )


    # ======================================
    # TOTALS
    # ======================================

    total_registrations = sum(
        item[
            "registered"
        ]
        for item in rows
    )


    total_check_in = sum(
        item[
            "check_in"
        ]
        for item in rows
    )


    total_check_out = sum(
        item[
            "check_out"
        ]
        for item in rows
    )


    total_evidence = sum(
        item[
            "evidence"
        ]
        for item in rows
    )


    total_confirmed = sum(
        item[
            "confirmed"
        ]
        for item in rows
    )


    total_rejected = sum(
        item[
            "rejected"
        ]
        for item in rows
    )


    total_pending = sum(
        item[
            "pending"
        ]
        for item in rows
    )


    total_official_confirmed = sum(item["official_confirmed"] for item in rows)
    total_registered_locked = sum(item["registered_locked"] for item in rows)
    total_not_reconciled = sum(item["not_reconciled"] for item in rows)
    total_outside_attendance = sum(item["outside_registration_attendance"] for item in rows)
    total_outside_participation = sum(item["outside_registration_participation"] for item in rows)
    total_outside_evidence = sum(item["outside_registration_evidence"] for item in rows)

    locked_activities = sum(
        1
        for item in rows
        if item[
            "final_list_locked"
        ]
    )


    # ======================================
    # ACTIVITY TYPE DISTRIBUTION
    # ======================================

    type_counts = {}


    for item in rows:

        activity_type = str(
            item.get(
                "activity_type",
                "OTHER",
            )
        ).upper()


        type_counts[
            activity_type
        ] = (
            type_counts.get(
                activity_type,
                0,
            )
            + 1
        )


    activity_types = [

        {
            "activity_type":
                activity_type,

            "count":
                count,
        }

        for (
            activity_type,
            count,
        ) in type_counts.items()
    ]


    activity_types.sort(
        key=lambda item:
            item["count"],
        reverse=True,
    )


    # ======================================
    # TOP REGISTRATIONS
    # ======================================

    top_activities = sorted(
        rows,
        key=lambda item:
            item[
                "registered"
            ],
        reverse=True,
    )[:6]


    return {

        "success":
            True,

        "data": {

            "generated_at":
                datetime.now(
                    VN_TIMEZONE
                ).isoformat(),

            "summary": {

                "total_activities":
                    len(rows),

                "locked_activities":
                    locked_activities,

                "total_registrations":
                    total_registrations,

                "total_check_in":
                    total_check_in,

                "total_check_out":
                    total_check_out,

                "total_evidence":
                    total_evidence,

                "total_confirmed":
                    total_confirmed,

                "total_rejected":
                    total_rejected,

                "total_pending":
                    total_pending,

                "total_not_reconciled": total_not_reconciled,
                "total_official_confirmed": total_official_confirmed,
                "total_registered_locked": total_registered_locked,
                "total_outside_registration_attendance": total_outside_attendance,
                "total_outside_registration_participation": total_outside_participation,
                "total_outside_registration_evidence": total_outside_evidence,

                "attendance_rate":
                    calculate_percent(
                        total_check_in,
                        total_registrations,
                    ),

                "checkout_rate":
                    calculate_percent(
                        total_check_out,
                        total_registrations,
                    ),

                "completion_rate":
                    calculate_percent(total_confirmed, total_registrations),
                "official_completion_rate":
                    calculate_percent(total_official_confirmed, total_registered_locked),
            },

            "activity_types":
                activity_types,

            "top_activities":
                top_activities,

            "activities":
                rows,
        },
    }