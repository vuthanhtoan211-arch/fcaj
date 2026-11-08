from fastapi import APIRouter, Depends, HTTPException

from app.auth import CurrentUser, get_current_user, require_admin
from app.schemas import ScanRequest
from app.services.attendance import check_in, check_out, set_checkout_state
from app.data.store import activities, students, registrations, attendance


router = APIRouter(prefix="/activities", tags=["Attendance"])


# =========================================
# RESPONSE HANDLING
# =========================================

def return_or_raise(result):
    if result["success"]:
        return result

    code = result.get("code")
    if code in {"STUDENT_NOT_FOUND", "ACTIVITY_NOT_FOUND"}:
        http_status = 404
    elif code in {
        "ALREADY_CHECKED_IN",
        "ALREADY_CHECKED_OUT",
        "AWS_ATTENDANCE_CONFLICT",
    }:
        http_status = 409
    elif code in {"MSSV_REQUIRED", "INVALID_SCHEDULE"}:
        http_status = 422
    elif code in {"AWS_ATTENDANCE_SYNC_FAILED", "AWS_ATTENDANCE_CONFIG_ERROR"}:
        http_status = 503
    else:
        http_status = 403

    raise HTTPException(status_code=http_status, detail=result)


# =========================================
# CHECK-IN / CHECK-OUT — ADMIN ONLY
# =========================================

@router.post("/{activity_id}/check-in")
def api_check_in(
    activity_id: str,
    body: ScanRequest,
    admin_role: str = Depends(require_admin),
    current_user: CurrentUser = Depends(get_current_user),
):
    del admin_role
    return return_or_raise(check_in(activity_id, body.mssv, current_user.username))


@router.post("/{activity_id}/check-out")
def api_check_out(
    activity_id: str,
    body: ScanRequest,
    admin_role: str = Depends(require_admin),
    current_user: CurrentUser = Depends(get_current_user),
):
    del admin_role
    return return_or_raise(check_out(activity_id, body.mssv, current_user.username))


# =========================================
# OPEN / CLOSE CHECK-OUT — ADMIN ONLY
# =========================================

@router.post("/{activity_id}/check-out/open")
def api_open_checkout(
    activity_id: str,
    admin_role: str = Depends(require_admin),
):
    del admin_role
    return return_or_raise(set_checkout_state(activity_id, True))


@router.post("/{activity_id}/check-out/close")
def api_close_checkout(
    activity_id: str,
    admin_role: str = Depends(require_admin),
):
    del admin_role
    return return_or_raise(set_checkout_state(activity_id, False))


# =========================================
# ATTENDANCE SUMMARY — ADMIN ONLY
# =========================================

@router.get("/{activity_id}/attendance")
def api_get_attendance(
    activity_id: str,
    admin_role: str = Depends(require_admin),
):
    del admin_role
    if activity_id not in activities:
        raise HTTPException(status_code=404, detail="Activity not found")

    registration_bucket = registrations.get(activity_id, {})
    attendance_bucket = attendance.get(activity_id, {})
    items = []

    for mssv, record in attendance_bucket.items():
        registration_record = registration_bucket.get(mssv, {})
        student_record = students.get(mssv, {})
        full_name = (
            registration_record.get("full_name")
            or registration_record.get("student_name")
            or registration_record.get("name")
            or student_record.get("full_name")
            or student_record.get("student_name")
            or student_record.get("name")
            or ""
        )
        items.append({**record, "full_name": full_name})

    total_checked_in = sum(bool(rec.get("check_in_time")) for rec in attendance_bucket.values())
    total_checked_out = sum(bool(rec.get("check_out_time")) for rec in attendance_bucket.values())

    return {
        "success": True,
        "data": {
            "total_registered": len(registration_bucket),
            "total_checked_in": total_checked_in,
            "total_checked_out": total_checked_out,
            "check_out_open": activities[activity_id].get("check_out_open", False),
            "items": items,
        },
    }
