from __future__ import annotations

import os
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from app.auth import require_admin
from app.auth_db import (
    ROLE_STUDENT,
    get_connection,
    normalize_username,
    revoke_all_user_sessions,
    row_to_user,
    seed_initial_accounts,
    set_temporary_password,
    utc_now_iso,
    validate_new_password,
)


router = APIRouter(
    prefix="/admin/students",
    tags=["Admin Student Accounts"],
)


class AccountStatusRequest(BaseModel):
    is_active: bool


class ResetPasswordRequest(BaseModel):
    temporary_password: str = Field(
        min_length=8,
        max_length=200,
    )


def ensure_student_account(username: str) -> dict:
    normalized = normalize_username(username)

    with get_connection() as connection:
        row = connection.execute(
            "SELECT * FROM users WHERE username = ?",
            (normalized,),
        ).fetchone()

    user = row_to_user(row)

    if user is None or user.get("role") != ROLE_STUDENT:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "STUDENT_ACCOUNT_NOT_FOUND",
                "message": "Không tìm thấy tài khoản sinh viên.",
            },
        )

    return user


@router.get("")
def list_student_accounts(
    search: str = Query(default="", max_length=100),
    status: Literal["ALL", "ACTIVE", "INACTIVE"] = "ALL",
    password_state: Literal["ALL", "INITIAL", "CHANGED"] = "ALL",
    admin_role: str = Depends(require_admin),
):
    del admin_role

    conditions = ["role = 'STUDENT'"]
    parameters: list[object] = []

    query_text = str(search or "").strip()

    if query_text:
        like_value = f"%{query_text.upper()}%"
        conditions.append(
            "(" \
            "UPPER(username) LIKE ? OR " \
            "UPPER(COALESCE(mssv, '')) LIKE ? OR " \
            "UPPER(full_name) LIKE ? OR " \
            "UPPER(class_name) LIKE ? OR " \
            "UPPER(email) LIKE ?" \
            ")"
        )
        parameters.extend([like_value] * 5)

    if status == "ACTIVE":
        conditions.append("is_active = 1")
    elif status == "INACTIVE":
        conditions.append("is_active = 0")

    if password_state == "INITIAL":
        conditions.append("must_change_password = 1")
    elif password_state == "CHANGED":
        conditions.append("must_change_password = 0")

    where_sql = " AND ".join(conditions)

    with get_connection() as connection:
        rows = connection.execute(
            f"""
            SELECT *
            FROM users
            WHERE {where_sql}
            ORDER BY
                is_active DESC,
                COALESCE(last_login_at, '') DESC,
                username ASC
            """,
            tuple(parameters),
        ).fetchall()

        summary_row = connection.execute(
            """
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS active,
                SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) AS inactive,
                SUM(CASE WHEN must_change_password = 1 THEN 1 ELSE 0 END) AS initial_password,
                SUM(CASE WHEN last_login_at IS NOT NULL THEN 1 ELSE 0 END) AS logged_in
            FROM users
            WHERE role = 'STUDENT'
            """
        ).fetchone()

    data = [row_to_user(row) for row in rows]

    return {
        "success": True,
        "data": data,
        "count": len(data),
        "summary": {
            "total": int(summary_row["total"] or 0),
            "active": int(summary_row["active"] or 0),
            "inactive": int(summary_row["inactive"] or 0),
            "initial_password": int(summary_row["initial_password"] or 0),
            "logged_in": int(summary_row["logged_in"] or 0),
        },
        "filters": {
            "search": query_text,
            "status": status,
            "password_state": password_state,
        },
    }


@router.get("/{username}")
def get_student_account(
    username: str,
    admin_role: str = Depends(require_admin),
):
    del admin_role

    return {
        "success": True,
        "data": ensure_student_account(username),
    }


@router.patch("/{username}/status")
def update_student_account_status(
    username: str,
    body: AccountStatusRequest,
    admin_role: str = Depends(require_admin),
):
    del admin_role

    user = ensure_student_account(username)
    normalized = user["username"]
    now = utc_now_iso()

    with get_connection() as connection:
        connection.execute(
            """
            UPDATE users
            SET is_active = ?, updated_at = ?
            WHERE username = ? AND role = 'STUDENT'
            """,
            (
                1 if body.is_active else 0,
                now,
                normalized,
            ),
        )

        updated_row = connection.execute(
            "SELECT * FROM users WHERE username = ?",
            (normalized,),
        ).fetchone()

    if not body.is_active:
        revoke_all_user_sessions(normalized)

    return {
        "success": True,
        "message": (
            "Đã mở khóa tài khoản sinh viên."
            if body.is_active
            else "Đã khóa tài khoản sinh viên và thu hồi các phiên đăng nhập hiện tại."
        ),
        "data": row_to_user(updated_row),
    }


@router.post("/{username}/reset-password")
def reset_student_password(
    username: str,
    body: ResetPasswordRequest,
    admin_role: str = Depends(require_admin),
):
    del admin_role

    user = ensure_student_account(username)

    issues = validate_new_password(body.temporary_password)
    if issues:
        raise HTTPException(
            status_code=422,
            detail={
                "code": "WEAK_TEMPORARY_PASSWORD",
                "message": " ".join(issues),
            },
        )

    ok, message = set_temporary_password(
        username=user["username"],
        temporary_password=body.temporary_password,
    )

    if not ok:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "PASSWORD_RESET_FAILED",
                "message": message,
            },
        )

    return {
        "success": True,
        "message": message,
        "data": ensure_student_account(user["username"]),
    }


@router.post("/sync/from-student-store")
def sync_student_accounts(
    admin_role: str = Depends(require_admin),
):
    del admin_role

    before = 0
    with get_connection() as connection:
        before = int(
            connection.execute(
                "SELECT COUNT(*) FROM users WHERE role = 'STUDENT'"
            ).fetchone()[0]
        )

    result = seed_initial_accounts()

    with get_connection() as connection:
        after = int(
            connection.execute(
                "SELECT COUNT(*) FROM users WHERE role = 'STUDENT'"
            ).fetchone()[0]
        )

    return {
        "success": True,
        "message": "Đã đồng bộ tài khoản sinh viên từ dữ liệu hệ thống.",
        "created": max(0, after - before),
        "student_accounts": after,
        "seed_result": result,
        "initial_password_source": (
            "SAP_STUDENT_INITIAL_PASSWORD"
            if os.getenv("SAP_STUDENT_INITIAL_PASSWORD")
            else "default-local-config"
        ),
    }
