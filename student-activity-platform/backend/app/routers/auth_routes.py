from __future__ import annotations

from io import BytesIO
from pathlib import Path
from uuid import uuid4
import re

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel, Field, field_validator

from app.auth import CurrentUser, get_access_token, get_current_user
from app.auth_db import (
    authenticate_user,
    change_password,
    create_session,
    get_user,
    revoke_session,
    update_avatar,
    update_profile,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

BACKEND_ROOT = Path(__file__).resolve().parent.parent.parent
UPLOADS_DIR = BACKEND_ROOT / "uploads"
AVATAR_DIR = UPLOADS_DIR / "avatars"
MAX_AVATAR_SIZE = 5 * 1024 * 1024
MAX_AVATAR_PIXELS = 16_000_000
ALLOWED_AVATAR_TYPES = {
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WEBP",
}
AVATAR_EXTENSIONS = {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp"}


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=1, max_length=200)


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=1, max_length=200)
    new_password: str = Field(min_length=8, max_length=200)


class UpdateProfileRequest(BaseModel):
    email: str | None = Field(default=None, max_length=200)
    phone: str | None = Field(default=None, max_length=50)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        if value and (
            len(value) > 200
            or not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", value)
            or any(ord(ch) < 32 or ord(ch) == 127 for ch in value)
        ):
            raise ValueError("Địa chỉ email không hợp lệ.")
        return value

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        if value:
            digit_count = sum(ch.isdigit() for ch in value)
            if (
                not re.fullmatch(r"\+?[0-9\s().-]+", value)
                or not 7 <= digit_count <= 15
            ):
                raise ValueError("Số điện thoại không hợp lệ.")
        return value


def serialize_user(user: CurrentUser | dict) -> dict:
    if isinstance(user, CurrentUser):
        return {
            "username": user.username,
            "user_id": user.user_id,
            "role": user.role,
            "mssv": user.mssv,
            "full_name": user.full_name,
            "class_name": user.class_name,
            "cohort": user.cohort,
            "email": user.email,
            "phone": user.phone,
            "avatar_url": user.avatar_url,
            "must_change_password": user.must_change_password,
        }
    return {
        "username": user.get("username"),
        "user_id": user.get("user_id") or user.get("username"),
        "role": user.get("role"),
        "mssv": user.get("mssv"),
        "full_name": user.get("full_name", ""),
        "class_name": user.get("class_name", ""),
        "cohort": user.get("cohort", ""),
        "email": user.get("email", ""),
        "phone": user.get("phone", ""),
        "avatar_url": user.get("avatar_url"),
        "must_change_password": bool(user.get("must_change_password")),
    }


@router.post("/login")
def login(body: LoginRequest):
    user = authenticate_user(body.username, body.password)
    if user is None:
        raise HTTPException(
            status_code=401,
            detail={
                "code": "INVALID_CREDENTIALS",
                "message": "Tên đăng nhập hoặc mật khẩu không đúng.",
            },
        )
    token, expires_at = create_session(user["username"])
    return {
        "success": True,
        "access_token": token,
        "token_type": "bearer",
        "expires_at": expires_at,
        "must_change_password": bool(user.get("must_change_password")),
        "user": serialize_user(user),
    }


@router.get("/me")
def me(user: CurrentUser = Depends(get_current_user)):
    return {"success": True, "user": serialize_user(user)}


@router.post("/logout")
def logout(token: str = Depends(get_access_token)):
    revoke_session(token)
    return {"success": True, "message": "Đăng xuất thành công."}


@router.post("/change-password")
def api_change_password(
    body: ChangePasswordRequest,
    user: CurrentUser = Depends(get_current_user),
    token: str = Depends(get_access_token),
):
    ok, message = change_password(
        username=user.username,
        current_password=body.current_password,
        new_password=body.new_password,
        keep_session_token=token,
    )
    if not ok:
        raise HTTPException(
            status_code=400,
            detail={"code": "PASSWORD_CHANGE_FAILED", "message": message},
        )
    return {"success": True, "message": message, "must_change_password": False}


@router.patch("/profile")
def api_update_profile(
    body: UpdateProfileRequest,
    user: CurrentUser = Depends(get_current_user),
):
    if user.must_change_password:
        raise HTTPException(
            status_code=403,
            detail={
                "code": "PASSWORD_CHANGE_REQUIRED",
                "message": "Bạn phải đổi mật khẩu trước khi cập nhật hồ sơ.",
            },
        )
    updated = update_profile(
        username=user.username,
        email=body.email,
        phone=body.phone,
    )
    if updated is None:
        raise HTTPException(
            status_code=404,
            detail={"code": "USER_NOT_FOUND", "message": "Không tìm thấy tài khoản."},
        )
    return {
        "success": True,
        "message": "Cập nhật hồ sơ thành công.",
        "user": serialize_user(updated),
    }


def _validated_avatar_bytes(content: bytes, claimed_type: str) -> tuple[bytes, str]:
    """Decode and re-encode uploads so arbitrary bytes are never served as images."""
    try:
        from PIL import Image, UnidentifiedImageError
    except ImportError as error:
        raise HTTPException(
            status_code=503,
            detail={
                "code": "AVATAR_IMAGE_LIBRARY_MISSING",
                "message": "Backend chưa cài thư viện Pillow để xác minh ảnh.",
            },
        ) from error

    try:
        with Image.open(BytesIO(content)) as image:
            actual_format = (image.format or "").upper()
            if actual_format != ALLOWED_AVATAR_TYPES.get(claimed_type):
                raise HTTPException(
                    status_code=422,
                    detail={
                        "code": "INVALID_AVATAR_TYPE",
                        "message": "Định dạng nội dung ảnh không khớp JPG, PNG hoặc WebP.",
                    },
                )
            width, height = image.size
            if width < 1 or height < 1 or width * height > MAX_AVATAR_PIXELS:
                raise HTTPException(
                    status_code=422,
                    detail={
                        "code": "INVALID_AVATAR_DIMENSIONS",
                        "message": "Kích thước ảnh không hợp lệ hoặc quá lớn.",
                    },
                )
            image.load()
            # Strip metadata and embedded content by creating a fresh pixel-only image.
            if actual_format == "JPEG":
                cleaned = image.convert("RGB")
            elif image.mode in ("RGBA", "LA", "P"):
                cleaned = image.convert("RGBA")
            else:
                cleaned = image.convert("RGB")
            output = BytesIO()
            cleaned.save(output, format=actual_format)
            saved_bytes = output.getvalue()
            if len(saved_bytes) > MAX_AVATAR_SIZE:
                raise HTTPException(
                    status_code=413,
                    detail={
                        "code": "AVATAR_TOO_LARGE",
                        "message": "Ảnh sau khi xử lý vượt quá giới hạn 5 MB.",
                    },
                )
            return saved_bytes, AVATAR_EXTENSIONS[actual_format]
    except HTTPException:
        raise
    except (OSError, ValueError, UnidentifiedImageError) as error:
        raise HTTPException(
            status_code=422,
            detail={
                "code": "INVALID_AVATAR_CONTENT",
                "message": "Không thể đọc hoặc xác minh nội dung ảnh đại diện.",
            },
        ) from error


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    user: CurrentUser = Depends(get_current_user),
):
    if user.must_change_password:
        raise HTTPException(
            status_code=403,
            detail={
                "code": "PASSWORD_CHANGE_REQUIRED",
                "message": "Bạn phải đổi mật khẩu trước khi cập nhật ảnh đại diện.",
            },
        )
    claimed_type = str(file.content_type or "").lower().split(";", 1)[0].strip()
    if claimed_type not in ALLOWED_AVATAR_TYPES:
        raise HTTPException(
            status_code=422,
            detail={
                "code": "INVALID_AVATAR_TYPE",
                "message": "Ảnh đại diện chỉ hỗ trợ JPG, PNG hoặc WebP.",
            },
        )
    try:
        content = await file.read(MAX_AVATAR_SIZE + 1)
    finally:
        await file.close()
    if not content:
        raise HTTPException(
            status_code=422,
            detail={"code": "EMPTY_AVATAR", "message": "File ảnh không được để trống."},
        )
    if len(content) > MAX_AVATAR_SIZE:
        raise HTTPException(
            status_code=413,
            detail={"code": "AVATAR_TOO_LARGE", "message": "Ảnh đại diện tối đa 5 MB."},
        )

    clean_bytes, extension = _validated_avatar_bytes(content, claimed_type)
    safe_username = re.sub(r"[^A-Z0-9_-]+", "_", user.username.upper())
    file_name = f"{safe_username}-{uuid4().hex}{extension}"
    target = AVATAR_DIR / file_name
    current = get_user(user.username)
    if current is None:
        raise HTTPException(
            status_code=404,
            detail={"code": "USER_NOT_FOUND", "message": "Không tìm thấy tài khoản."},
        )
    old_avatar_url = str(current.get("avatar_url") or "")

    try:
        AVATAR_DIR.mkdir(parents=True, exist_ok=True)
        target.write_bytes(clean_bytes)
        updated = update_avatar(
            username=user.username,
            avatar_url=f"/uploads/avatars/{file_name}",
        )
        if updated is None:
            raise HTTPException(
                status_code=404,
                detail={"code": "USER_NOT_FOUND", "message": "Không tìm thấy tài khoản."},
            )
    except Exception:
        target.unlink(missing_ok=True)
        raise

    # Only delete a previous file belonging to this user and stored locally.
    old_prefix = f"/uploads/avatars/{safe_username}-"
    if old_avatar_url.startswith(old_prefix):
        old_filename = old_avatar_url.rsplit("/", 1)[-1]
        if re.fullmatch(r"[A-Z0-9_-]+-[0-9a-f]{10,32}\.(jpg|png|webp)", old_filename):
            try:
                (AVATAR_DIR / old_filename).unlink(missing_ok=True)
            except OSError:
                pass  # Cleanup failure should not invalidate a committed profile update.

    return {
        "success": True,
        "message": "Cập nhật ảnh đại diện thành công.",
        "user": serialize_user(updated),
    }
