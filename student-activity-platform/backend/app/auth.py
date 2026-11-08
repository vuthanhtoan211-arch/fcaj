from __future__ import annotations

from dataclasses import dataclass

from fastapi import Depends, Header, HTTPException, Request

from app.auth_db import (
    ROLE_ADMIN,
    ROLE_STUDENT,
    get_user_by_session,
)


# ==========================================
# VALID ROLES
# ==========================================

VALID_ROLES = {
    ROLE_STUDENT,
    ROLE_ADMIN,
}


# ==========================================
# CURRENT USER
# ==========================================

@dataclass
class CurrentUser:
    username: str
    role: str
    user_id: str
    mssv: str | None = None
    full_name: str = ""
    class_name: str = ""
    cohort: str = ""
    email: str = ""
    phone: str = ""
    avatar_url: str | None = None
    must_change_password: bool = False


def user_from_dict(data: dict) -> CurrentUser:
    return CurrentUser(
        username=data["username"],
        role=data["role"],
        user_id=data.get("user_id") or data["username"],
        mssv=data.get("mssv"),
        full_name=data.get("full_name", ""),
        class_name=data.get("class_name", ""),
        cohort=data.get("cohort", ""),
        email=data.get("email", ""),
        phone=data.get("phone", ""),
        avatar_url=data.get("avatar_url"),
        must_change_password=bool(
            data.get("must_change_password")
        ),
    )


# ==========================================
# BEARER TOKEN
# ==========================================

def extract_bearer_token(
    authorization: str | None,
) -> str:
    value = str(authorization or "").strip()

    if not value:
        raise HTTPException(
            status_code=401,
            detail={
                "code": "AUTH_REQUIRED",
                "message": "Bạn cần đăng nhập để sử dụng chức năng này.",
            },
        )

    scheme, separator, token = value.partition(" ")

    if (
        not separator
        or scheme.lower() != "bearer"
        or not token.strip()
    ):
        raise HTTPException(
            status_code=401,
            detail={
                "code": "INVALID_AUTH_HEADER",
                "message": "Phiên đăng nhập không hợp lệ.",
            },
        )

    return token.strip()


def get_access_token(
    authorization: str | None = Header(
        default=None,
        alias="Authorization",
    ),
) -> str:
    return extract_bearer_token(authorization)


# ==========================================
# SESSION USER
# ==========================================

def get_current_user(
    token: str = Depends(get_access_token),
) -> CurrentUser:
    user = get_user_by_session(token)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail={
                "code": "SESSION_EXPIRED",
                "message": "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
            },
        )

    return user_from_dict(user)


def ensure_password_changed(
    user: CurrentUser,
) -> None:
    if user.must_change_password:
        raise HTTPException(
            status_code=403,
            detail={
                "code": "PASSWORD_CHANGE_REQUIRED",
                "message": "Bạn phải đổi mật khẩu trước khi tiếp tục.",
            },
        )


# ==========================================
# CURRENT ROLE
# ==========================================
#
# Một số router hiện tại vẫn dùng
# Depends(get_current_role).
#
# STUDENT chỉ được dùng API đọc hoạt động public.
# Dữ liệu cá nhân của STUDENT đi qua /me/*.
# Các API quản trị phải dùng require_admin.
# ==========================================

def get_current_role(
    request: Request,
    user: CurrentUser = Depends(get_current_user),
) -> str:
    ensure_password_changed(user)

    if user.role == ROLE_STUDENT:
        path = request.url.path.rstrip("/") or "/"
        method = request.method.upper()

        parts = [
            part
            for part in path.split("/")
            if part
        ]

        is_activity_list = (
            method == "GET"
            and parts == ["activities"]
        )

        is_activity_detail = (
            method == "GET"
            and len(parts) == 2
            and parts[0] == "activities"
        )

        if not (
            is_activity_list
            or is_activity_detail
        ):
            raise HTTPException(
                status_code=403,
                detail={
                    "code": "STUDENT_READ_ONLY",
                    "message": (
                        "Tài khoản sinh viên không có quyền "
                        "sử dụng chức năng quản trị này."
                    ),
                },
            )

    return user.role


# ==========================================
# ADMIN
# ==========================================

def require_admin(
    user: CurrentUser = Depends(get_current_user),
) -> str:
    ensure_password_changed(user)

    if user.role != ROLE_ADMIN:
        raise HTTPException(
            status_code=403,
            detail={
                "code": "ADMIN_REQUIRED",
                "message": (
                    "Chỉ ADMIN mới có quyền "
                    "thực hiện thao tác này."
                ),
            },
        )

    return user.role


# ==========================================
# STUDENT
# ==========================================

def require_student(
    user: CurrentUser = Depends(get_current_user),
) -> CurrentUser:
    ensure_password_changed(user)

    if user.role != ROLE_STUDENT:
        raise HTTPException(
            status_code=403,
            detail={
                "code": "STUDENT_REQUIRED",
                "message": (
                    "Chức năng này chỉ dành "
                    "cho sinh viên."
                ),
            },
        )

    return user


def require_student_with_mssv(
    user: CurrentUser = Depends(get_current_user),
) -> CurrentUser:
    user = require_student(user)

    if not user.mssv:
        raise HTTPException(
            status_code=401,
            detail={
                "code": "STUDENT_MSSV_REQUIRED",
                "message": (
                    "Tài khoản sinh viên chưa "
                    "được liên kết MSSV."
                ),
            },
        )

    return user
