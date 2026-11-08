"""Activity APIs for the student activity platform.

The default backend remains the existing in-memory/SQLite snapshot.

Opt-in pilot: set SAP_ACTIVITIES_AWS_PILOT=1 to mirror *newly created*
activities to DynamoDB. Pilot mutations are written to DynamoDB before
updating the local mirror. This is NOT a database migration or a production
DynamoDB cutover: other business routers still depend on the local store.
"""

import os
from datetime import datetime
from uuid import uuid4
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.auth import ROLE_STUDENT, get_current_role, require_admin
from app.data.store import (
    activities,
    registrations,
    attendance,
    evidence,
    participation,
)

router = APIRouter(prefix="/activities", tags=["Activities"])
VN_TIMEZONE = ZoneInfo("Asia/Ho_Chi_Minh")


class CreateActivityRequest(BaseModel):
    activity_name: str = Field(min_length=3, max_length=200)
    activity_type: str = Field(min_length=2, max_length=50)
    description: str = ""
    start_time: datetime
    end_time: datetime
    location: str = Field(min_length=1, max_length=200)
    capacity: int = Field(gt=0)
    point_value: int = Field(default=0, ge=0)
    semester: str = ""
    academic_year: str = ""


class UpdateActivityRequest(BaseModel):
    activity_name: str = Field(min_length=3, max_length=200)
    activity_type: str = Field(min_length=2, max_length=50)
    description: str = ""
    start_time: datetime
    end_time: datetime
    location: str = Field(min_length=1, max_length=200)
    capacity: int = Field(gt=0)
    point_value: int = Field(default=0, ge=0)
    semester: str = ""
    academic_year: str = ""


class CancelActivityRequest(BaseModel):
    reason: str = Field(default="", max_length=500)


class FeatureActivityRequest(BaseModel):
    is_featured: bool


def aws_pilot_enabled() -> bool:
    """Explicitly opt in to DynamoDB mirroring for *new* pilot activities."""
    return os.getenv("SAP_ACTIVITIES_AWS_PILOT", "0") == "1"


def _is_pilot(activity: dict) -> bool:
    return activity.get("aws_pilot") is True


def _cloud_repository():
    # Lazy import: the legacy local path does not require AWS credentials.
    try:
        from app.repositories.activities_repository import ActivityRepository

        return ActivityRepository()
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail="Không thể khởi tạo kết nối AWS DynamoDB.",
        ) from exc


def _ensure_pilot_mutable(activity: dict) -> None:
    if _is_pilot(activity) and not aws_pilot_enabled():
        raise HTTPException(
            status_code=503,
            detail=(
                "Hoạt động AWS pilot đang tạm khóa chỉnh sửa vì "
                "SAP_ACTIVITIES_AWS_PILOT chưa được bật."
            ),
        )


def _mirror_create(activity: dict) -> None:
    if not _is_pilot(activity):
        return
    repo = _cloud_repository()
    try:
        repo.create(activity)
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail="Không thể lưu hoạt động pilot lên DynamoDB.",
        ) from exc


def _mirror_update(before: dict, after: dict) -> None:
    if not _is_pilot(before):
        return
    _ensure_pilot_mutable(before)
    changes = {
        key: value
        for key, value in after.items()
        if key != "activity_id" and before.get(key) != value
    }
    if not changes:
        return
    repo = _cloud_repository()
    try:
        repo.update_fields(before["activity_id"], changes)
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=(
                "Không thể cập nhật DynamoDB. "
                "Dữ liệu hoạt động local chưa bị thay đổi."
            ),
        ) from exc


def _commit_activity_update(activity: dict, candidate: dict) -> None:
    # Write to DynamoDB first. Only mutate local memory when cloud write passes.
    _mirror_update(activity, candidate)
    activity.clear()
    activity.update(candidate)


def generate_activity_id() -> str:
    while True:
        activity_id = (
            "ACT#"
            + datetime.now(VN_TIMEZONE).strftime("%Y%m%d")
            + "-"
            + uuid4().hex[:8].upper()
        )
        if activity_id not in activities:
            return activity_id


def get_runtime_status(activity: dict) -> str:
    """UPCOMING / ACTIVE / COMPLETED for a published activity."""
    now = datetime.now(VN_TIMEZONE)
    try:
        start = datetime.fromisoformat(activity["start_time"])
        end = datetime.fromisoformat(activity["end_time"])
        if start.tzinfo is None:
            start = start.replace(tzinfo=VN_TIMEZONE)
        if end.tzinfo is None:
            end = end.replace(tzinfo=VN_TIMEZONE)
        start = start.astimezone(VN_TIMEZONE)
        end = end.astimezone(VN_TIMEZONE)
    except (KeyError, TypeError, ValueError):
        return "UPCOMING"

    if now < start:
        return "UPCOMING"
    if start <= now <= end:
        return "ACTIVE"
    return "COMPLETED"


def get_publication_status(activity: dict) -> str:
    return str(
        activity.get("publication_status", activity.get("status", "DRAFT"))
    ).strip().upper()


def normalize_activity_input(
    body: CreateActivityRequest | UpdateActivityRequest,
) -> dict:
    name = body.activity_name.strip()
    activity_type = body.activity_type.strip().upper()
    location = body.location.strip()
    if not name:
        raise HTTPException(status_code=422, detail="Tên hoạt động không hợp lệ.")
    if not activity_type:
        raise HTTPException(status_code=422, detail="Loại hoạt động không hợp lệ.")
    if not location:
        raise HTTPException(status_code=422, detail="Địa điểm không được để trống.")
    if body.start_time.utcoffset() is None or body.end_time.utcoffset() is None:
        raise HTTPException(
            status_code=422,
            detail="Thời gian phải có múi giờ. Ví dụ: +07:00.",
        )
    if body.end_time <= body.start_time:
        raise HTTPException(
            status_code=422,
            detail="Thời gian kết thúc phải sau thời gian bắt đầu.",
        )
    return {
        "activity_name": name,
        "activity_type": activity_type,
        "description": body.description.strip(),
        "start_time": body.start_time.isoformat(),
        "end_time": body.end_time.isoformat(),
        "location": location,
        "capacity": body.capacity,
        "point_value": body.point_value,
        "semester": body.semester.strip(),
        "academic_year": body.academic_year.strip(),
    }


def get_related_data_summary(activity_id: str) -> dict:
    """Count business records linked to the activity ID in the local store."""
    stores = {
        "registrations": registrations,
        "attendance": attendance,
        "evidence": evidence,
        "participation": participation,
    }
    summary = {}
    for key, store in stores.items():
        bucket = store.get(activity_id, {})
        if isinstance(bucket, (dict, list)):
            summary[key] = len(bucket)
        else:
            summary[key] = 1 if bucket else 0
    return summary


def can_delete_activity(activity_id: str) -> bool:
    return not any(get_related_data_summary(activity_id).values())


def activity_for_response(activity: dict) -> dict:
    result = dict(activity)
    publication_status = get_publication_status(activity)
    if publication_status == "PUBLISHED":
        result["status"] = get_runtime_status(activity)
    elif publication_status == "CANCELLED":
        result["status"] = "CANCELLED"
    else:
        result["status"] = publication_status
    # Pilot deletion is disabled until cloud-safe deletion is implemented.
    result["can_delete"] = (
        not _is_pilot(activity)
        and can_delete_activity(str(activity.get("activity_id") or ""))
    )
    return result


def ensure_student_can_view(activity: dict, role: str) -> None:
    if role == ROLE_STUDENT and get_publication_status(activity) != "PUBLISHED":
        raise HTTPException(status_code=404, detail="Không tìm thấy hoạt động.")


@router.get("")
def get_activities(role: str = Depends(get_current_role)):
    rows = []
    for activity in activities.values():
        if role == ROLE_STUDENT and get_publication_status(activity) != "PUBLISHED":
            continue
        rows.append(activity_for_response(activity))
    return {"success": True, "data": rows}


@router.post("", status_code=status.HTTP_201_CREATED)
def create_activity(
    body: CreateActivityRequest,
    role: str = Depends(require_admin),
):
    data = normalize_activity_input(body)
    activity_id = generate_activity_id()
    now = datetime.now(VN_TIMEZONE).isoformat()
    new_activity = {
        "activity_id": activity_id,
        **data,
        "status": "DRAFT",
        "publication_status": "DRAFT",
        "is_featured": False,
        "image_url": None,
        "image_key": None,
        "check_out_open": False,
        "final_list_locked": False,
        "created_at": now,
        "created_by": role,
        "updated_at": now,
        "updated_by": role,
    }
    if aws_pilot_enabled():
        new_activity["aws_pilot"] = True
        # DynamoDB first: no phantom local activity if cloud write fails.
        _mirror_create(new_activity)
    activities[activity_id] = new_activity
    return {
        "success": True,
        "message": "Tạo hoạt động thành công.",
        "data": activity_for_response(new_activity),
    }


@router.put("/{activity_id}")
def update_activity(
    activity_id: str,
    body: UpdateActivityRequest,
    role: str = Depends(require_admin),
):
    activity = activities.get(activity_id)
    if activity is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy hoạt động.")
    if get_publication_status(activity) != "DRAFT":
        raise HTTPException(
            status_code=409,
            detail="Chỉ hoạt động ở trạng thái BẢN NHÁP mới được chỉnh sửa.",
        )
    candidate = dict(activity)
    candidate.update(normalize_activity_input(body))
    candidate.update({
        "publication_status": "DRAFT",
        "status": "DRAFT",
        "updated_at": datetime.now(VN_TIMEZONE).isoformat(),
        "updated_by": role,
    })
    _commit_activity_update(activity, candidate)
    return {
        "success": True,
        "message": "Cập nhật hoạt động thành công.",
        "data": activity_for_response(activity),
    }


@router.post("/{activity_id}/submit-approval")
def submit_activity_for_approval(
    activity_id: str,
    role: str = Depends(require_admin),
):
    activity = activities.get(activity_id)
    if activity is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy hoạt động.")
    if get_publication_status(activity) != "DRAFT":
        raise HTTPException(
            status_code=409,
            detail="Chỉ hoạt động ở trạng thái BẢN NHÁP mới được gửi duyệt.",
        )
    now = datetime.now(VN_TIMEZONE).isoformat()
    candidate = dict(activity)
    candidate.update({
        "publication_status": "PENDING_APPROVAL",
        "status": "PENDING_APPROVAL",
        "submitted_at": now,
        "submitted_by": role,
        "updated_at": now,
        "updated_by": role,
    })
    _commit_activity_update(activity, candidate)
    return {
        "success": True,
        "message": "Đã gửi hoạt động để phê duyệt.",
        "data": activity_for_response(activity),
    }


@router.post("/{activity_id}/publish")
def publish_activity(
    activity_id: str,
    role: str = Depends(require_admin),
):
    activity = activities.get(activity_id)
    if activity is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy hoạt động.")
    if get_publication_status(activity) != "PENDING_APPROVAL":
        raise HTTPException(
            status_code=409,
            detail="Chỉ hoạt động đang CHỜ DUYỆT mới được phê duyệt và xuất bản.",
        )
    now = datetime.now(VN_TIMEZONE).isoformat()
    candidate = dict(activity)
    candidate.update({
        "publication_status": "PUBLISHED",
        "status": get_runtime_status(activity),
        "published_at": now,
        "published_by": role,
        "updated_at": now,
        "updated_by": role,
    })
    _commit_activity_update(activity, candidate)
    return {
        "success": True,
        "message": "Hoạt động đã được phê duyệt và xuất bản.",
        "data": activity_for_response(activity),
    }


@router.post("/{activity_id}/cancel")
def cancel_activity(
    activity_id: str,
    body: CancelActivityRequest,
    role: str = Depends(require_admin),
):
    activity = activities.get(activity_id)
    if activity is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy hoạt động.")
    if get_publication_status(activity) == "CANCELLED":
        raise HTTPException(status_code=409, detail="Hoạt động này đã được hủy.")
    if get_runtime_status(activity) == "COMPLETED":
        raise HTTPException(
            status_code=409,
            detail="Không thể hủy hoạt động đã kết thúc.",
        )
    now = datetime.now(VN_TIMEZONE).isoformat()
    candidate = dict(activity)
    candidate.update({
        "publication_status": "CANCELLED",
        "status": "CANCELLED",
        "cancel_reason": (body.reason or "").strip(),
        "cancelled_at": now,
        "cancelled_by": role,
        "is_featured": False,
        "check_out_open": False,
        "updated_at": now,
        "updated_by": role,
    })
    _commit_activity_update(activity, candidate)
    return {
        "success": True,
        "message": "Đã hủy hoạt động.",
        "data": activity_for_response(activity),
    }


@router.post("/{activity_id}/featured")
def set_activity_featured(
    activity_id: str,
    body: FeatureActivityRequest,
    role: str = Depends(require_admin),
):
    activity = activities.get(activity_id)
    if activity is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy hoạt động.")
    if get_publication_status(activity) != "PUBLISHED":
        raise HTTPException(
            status_code=409,
            detail="Chỉ hoạt động đã xuất bản mới được đặt làm nổi bật.",
        )
    if body.is_featured and get_runtime_status(activity) == "COMPLETED":
        raise HTTPException(
            status_code=409,
            detail="Không thể đặt hoạt động đã kết thúc làm nổi bật.",
        )
    now = datetime.now(VN_TIMEZONE).isoformat()
    candidate = dict(activity)
    candidate.update({
        "is_featured": body.is_featured,
        "updated_at": now,
        "updated_by": role,
    })
    _commit_activity_update(activity, candidate)
    message = (
        "Đã đặt hoạt động làm nổi bật."
        if body.is_featured else "Đã bỏ đánh dấu nổi bật."
    )
    return {
        "success": True,
        "message": message,
        "data": activity_for_response(activity),
    }


@router.delete("/{activity_id}")
def delete_activity(
    activity_id: str,
    role: str = Depends(require_admin),
):
    del role
    activity = activities.get(activity_id)
    if activity is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy hoạt động.")
    if _is_pilot(activity):
        raise HTTPException(
            status_code=409,
            detail=(
                "Chưa hỗ trợ xóa hoạt động AWS pilot. "
                "Để tránh lệch dữ liệu, cần triển khai xóa an toàn trên "
                "cả DynamoDB và SQLite trước."
            ),
        )
    related_data = get_related_data_summary(activity_id)
    blockers = {key: value for key, value in related_data.items() if value > 0}
    if blockers:
        labels = {
            "registrations": "Registration",
            "attendance": "Attendance",
            "evidence": "Evidence",
            "participation": "Kết quả/đối soát",
        }
        blocker_text = ", ".join(
            f"{labels.get(key, key)}: {value}" for key, value in blockers.items()
        )
        raise HTTPException(
            status_code=409,
            detail={
                "code": "ACTIVITY_HAS_RELATED_DATA",
                "message": (
                    "Không thể xóa hoạt động vì đã có dữ liệu sinh viên liên quan. "
                    f"{blocker_text}. Hãy giữ hoạt động trong lịch sử."
                ),
                "related_data": related_data,
            },
        )
    activities.pop(activity_id, None)
    registrations.pop(activity_id, None)
    attendance.pop(activity_id, None)
    evidence.pop(activity_id, None)
    participation.pop(activity_id, None)
    return {
        "success": True,
        "message": "Đã xóa vĩnh viễn hoạt động.",
        "data": {"activity_id": activity_id},
    }


@router.get("/{activity_id}")
def get_activity(
    activity_id: str,
    role: str = Depends(get_current_role),
):
    activity = activities.get(activity_id)
    if activity is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy hoạt động.")
    ensure_student_can_view(activity, role)
    return {"success": True, "data": activity_for_response(activity)}
