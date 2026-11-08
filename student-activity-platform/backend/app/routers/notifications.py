from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query

from app.auth import CurrentUser, get_current_user
from app.notification_db import (
    ensure_personal_notifications,
    get_unread_count,
    list_notifications,
    mark_all_notifications_read,
    mark_notification_read,
)


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


@router.get("")
def get_notifications(
    limit: int = Query(default=30, ge=1, le=100),
    user: CurrentUser = Depends(get_current_user),
):
    ensure_personal_notifications(user)

    rows = list_notifications(
        username=user.username,
        role=user.role,
        limit=limit,
    )

    return {
        "success": True,
        "unread_count": get_unread_count(
            username=user.username,
            role=user.role,
        ),
        "data": rows,
    }


@router.get("/unread-count")
def unread_count(
    user: CurrentUser = Depends(get_current_user),
):
    ensure_personal_notifications(user)

    return {
        "success": True,
        "unread_count": get_unread_count(
            username=user.username,
            role=user.role,
        ),
    }


@router.post("/{notification_id}/read")
def mark_read(
    notification_id: int,
    user: CurrentUser = Depends(get_current_user),
):
    ok = mark_notification_read(
        notification_id=notification_id,
        username=user.username,
        role=user.role,
    )

    if not ok:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "NOTIFICATION_NOT_FOUND",
                "message": "Không tìm thấy thông báo.",
            },
        )

    return {
        "success": True,
        "message": "Đã đánh dấu thông báo là đã đọc.",
    }


@router.post("/read-all")
def mark_all_read(
    user: CurrentUser = Depends(get_current_user),
):
    updated = mark_all_notifications_read(
        username=user.username,
        role=user.role,
    )

    return {
        "success": True,
        "updated": updated,
        "message": "Đã đánh dấu tất cả thông báo là đã đọc.",
    }
