"""Activity poster storage: local by default, opt-in private S3 for AWS pilot.

S3 images are private. Persist an S3 object reference, not an expiring URL.
The authenticated poster-url endpoint returns a short-lived presigned URL.
"""
from __future__ import annotations

import os
import re
from datetime import datetime
from pathlib import Path
from uuid import uuid4
from zoneinfo import ZoneInfo

from botocore.exceptions import BotoCoreError, ClientError
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.auth import ROLE_STUDENT, get_current_role, require_admin
from app.data.store import activities
from app.routers.activities import get_publication_status

router = APIRouter(prefix="/activities", tags=["Activity Posters"])
VN_TIMEZONE = ZoneInfo("Asia/Ho_Chi_Minh")
BACKEND_ROOT = Path(__file__).resolve().parent.parent.parent
POSTER_DIR = BACKEND_ROOT / "uploads" / "activity-posters"
POSTER_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_BASE_URL = os.getenv("SAP_PUBLIC_BASE_URL", "http://127.0.0.1:8000").rstrip("/")
MAX_POSTER_SIZE = 5 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}
S3_REFERENCE_PREFIX = "s3://"
PRESIGNED_EXPIRES_SECONDS = 900


def safe_activity_id(activity_id: str) -> str:
    return re.sub(r"[^A-Za-z0-9_-]+", "-", str(activity_id or "").strip()).strip("-") or "activity"


def validate_image_signature(content: bytes, content_type: str) -> bool:
    if content_type == "image/jpeg":
        return content.startswith(b"\xff\xd8\xff")
    if content_type == "image/png":
        return content.startswith(b"\x89PNG\r\n\x1a\n")
    if content_type == "image/webp":
        return len(content) >= 12 and content[:4] == b"RIFF" and content[8:12] == b"WEBP"
    return False


def _is_s3_key(value: object) -> bool:
    return str(value or "").startswith(S3_REFERENCE_PREFIX)


def _parse_s3_key(value: object) -> tuple[str, str]:
    reference = str(value or "")
    if not _is_s3_key(reference):
        raise ValueError("Not an S3 reference")
    rest = reference[len(S3_REFERENCE_PREFIX):]
    bucket, sep, key = rest.partition("/")
    if not sep or not bucket or not key or not key.startswith("activity-posters/"):
        raise ValueError("Invalid S3 poster reference")
    return bucket, key


def _s3_client():
    import boto3
    return boto3.client("s3", region_name=os.getenv("AWS_REGION", "ap-southeast-1"))


def _presigned_url(reference: object) -> str:
    bucket, key = _parse_s3_key(reference)
    return _s3_client().generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket, "Key": key},
        ExpiresIn=PRESIGNED_EXPIRES_SECONDS,
    )


def _local_poster_path(image_key: object) -> Path | None:
    key = str(image_key or "")
    if not key.startswith("activity-posters/"):
        return None
    filename = Path(key).name
    if key != f"activity-posters/{filename}":
        return None
    return POSTER_DIR / filename


def delete_previous_local_poster(activity: dict) -> None:
    target = _local_poster_path(activity.get("image_key"))
    if target is not None:
        try:
            target.unlink(missing_ok=True)
        except OSError:
            pass


def _cloud_update_poster(activity: dict, changes: dict) -> None:
    """Update DynamoDB before local state to avoid false local success."""
    if activity.get("aws_pilot") is not True:
        return
    if os.getenv("SAP_ACTIVITIES_AWS_PILOT", "0") != "1":
        raise HTTPException(
            status_code=503,
            detail="Bật SAP_ACTIVITIES_AWS_PILOT=1 để cập nhật poster của Activity Pilot.",
        )
    from app.repositories.activities_repository import ActivityRepository
    try:
        ActivityRepository().update_fields(activity["activity_id"], changes)
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail="Không thể đồng bộ metadata poster lên DynamoDB. Poster cũ được giữ nguyên.",
        ) from exc


def _poster_url(activity: dict) -> str | None:
    key = activity.get("image_key")
    if _is_s3_key(key):
        return _presigned_url(key)
    return str(activity.get("image_url") or "") or None


@router.get("/{activity_id}/poster-url")
def get_activity_poster_url(
    activity_id: str,
    role: str = Depends(get_current_role),
):
    """Return a temporary URL for an authorized viewer (never makes S3 public)."""
    activity = activities.get(activity_id)
    if activity is None or (
        role == ROLE_STUDENT and get_publication_status(activity) != "PUBLISHED"
    ):
        raise HTTPException(status_code=404, detail="Không tìm thấy hoạt động.")
    try:
        url = _poster_url(activity)
    except (ClientError, BotoCoreError, ValueError) as exc:
        raise HTTPException(status_code=503, detail="Không thể tạo đường dẫn poster.") from exc
    if not url:
        raise HTTPException(status_code=404, detail="Hoạt động chưa có poster.")
    return {
        "success": True,
        "data": {
            "activity_id": activity_id,
            "image_url": url,
            "expires_in": PRESIGNED_EXPIRES_SECONDS if _is_s3_key(activity.get("image_key")) else None,
        },
    }


@router.post("/{activity_id}/image")
async def upload_activity_image(
    activity_id: str,
    file: UploadFile = File(...),
    role: str = Depends(require_admin),
):
    activity = activities.get(activity_id)
    if activity is None:
        raise HTTPException(status_code=404, detail={
            "code": "ACTIVITY_NOT_FOUND", "message": "Không tìm thấy hoạt động."
        })

    content_type = str(file.content_type or "").lower().strip()
    extension = ALLOWED_CONTENT_TYPES.get(content_type)
    if extension is None:
        raise HTTPException(status_code=422, detail={
            "code": "INVALID_POSTER_TYPE", "message": "Poster chỉ hỗ trợ JPG, PNG hoặc WebP."
        })
    content = await file.read(MAX_POSTER_SIZE + 1)
    if not content:
        raise HTTPException(status_code=422, detail={
            "code": "EMPTY_POSTER", "message": "File poster đang trống."
        })
    if len(content) > MAX_POSTER_SIZE:
        raise HTTPException(status_code=413, detail={
            "code": "POSTER_TOO_LARGE", "message": "Poster tối đa 5 MB."
        })
    if not validate_image_signature(content, content_type):
        raise HTTPException(status_code=422, detail={
            "code": "INVALID_POSTER_CONTENT", "message": "Nội dung file ảnh không hợp lệ."
        })

    filename = f"{safe_activity_id(activity_id)}-{uuid4().hex[:12]}{extension}"
    now = datetime.now(VN_TIMEZONE).isoformat()
    storage_mode = os.getenv("SAP_POSTER_STORAGE", "local").strip().lower()
    if storage_mode not in {"local", "s3"}:
        raise HTTPException(status_code=503, detail="SAP_POSTER_STORAGE phải là local hoặc s3.")

    # A pilot record must never be mutated locally without updating DynamoDB.
    if activity.get("aws_pilot") is True and os.getenv("SAP_ACTIVITIES_AWS_PILOT", "0") != "1":
        raise HTTPException(status_code=503, detail="AWS Pilot đang tắt; không thể đổi poster của Activity Pilot.")

    previous = dict(activity)
    new_s3_ref = None
    new_s3_client = None
    new_s3_bucket = None
    new_s3_key = None
    target = None

    if storage_mode == "s3":
        if activity.get("aws_pilot") is not True:
            raise HTTPException(
                status_code=409,
                detail="Chế độ S3 hiện chỉ dành cho Activity AWS Pilot.",
            )
        bucket = os.getenv("SAP_S3_BUCKET", "").strip()
        if not bucket:
            raise HTTPException(status_code=503, detail="Chưa cấu hình SAP_S3_BUCKET.")
        new_s3_bucket = bucket
        new_s3_key = f"activity-posters/{filename}"
        new_s3_ref = f"s3://{bucket}/{new_s3_key}"
        try:
            new_s3_client = _s3_client()
            new_s3_client.put_object(
                Bucket=bucket, Key=new_s3_key, Body=content,
                ContentType=content_type,
                ServerSideEncryption="AES256",
            )
        except (ClientError, BotoCoreError) as exc:
            raise HTTPException(status_code=503, detail="Upload poster lên S3 thất bại.") from exc
        image_key = new_s3_ref
        # Do not persist a presigned URL: it expires after 15 minutes.
        image_url = None
    else:
        image_key = f"activity-posters/{filename}"
        image_url = f"{PUBLIC_BASE_URL}/uploads/{image_key}"
        target = POSTER_DIR / filename
        try:
            target.write_bytes(content)
        except OSError as exc:
            raise HTTPException(status_code=500, detail="Không lưu được poster local.") from exc

    changes = {
        "image_key": image_key,
        "image_url": image_url,
        "updated_at": now,
        "updated_by": role,
    }
    try:
        _cloud_update_poster(activity, changes)
    except Exception:
        # Best-effort cleanup of only the newly uploaded object, never old poster.
        if new_s3_client is not None and new_s3_bucket and new_s3_key:
            try:
                new_s3_client.delete_object(Bucket=new_s3_bucket, Key=new_s3_key)
            except (ClientError, BotoCoreError):
                pass
        if target is not None:
            try:
                target.unlink(missing_ok=True)
            except OSError:
                pass
        raise

    activity.update(changes)
    delete_previous_local_poster(previous)
    # We intentionally do not auto-delete the prior S3 object. A later cleanup
    # process can verify that no Activity references it before removal.

    result = dict(activity)
    try:
        result["image_url"] = _poster_url(activity)
    except (ClientError, BotoCoreError, ValueError):
        # Persist succeeded; client may fetch /poster-url again later.
        result["image_url"] = None

    return {
        "success": True,
        "message": "Cập nhật poster hoạt động thành công.",
        "data": result,
    }
