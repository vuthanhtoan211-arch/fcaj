"""Isolated, opt-in AWS Activities API probe.

Not a replacement for /activities and not a migration tool.
"""
from __future__ import annotations

import os
from datetime import datetime
from uuid import uuid4
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, status
from botocore.exceptions import ClientError, BotoCoreError

from app.auth import require_admin
from app.repositories.activities_repository import ActivityRepository, ActivityConflictError
from app.routers.activities import CreateActivityRequest, normalize_activity_input

router = APIRouter(prefix="/aws-test/activities", tags=["AWS Activities (Test)"])
TZ = ZoneInfo("Asia/Ho_Chi_Minh")


def _enabled() -> None:
    if os.getenv("SAP_ENABLE_AWS_TEST_API", "0") != "1":
        raise HTTPException(status_code=404, detail="AWS test API is disabled")


def _repo() -> ActivityRepository:
    try:
        return ActivityRepository()
    except (ClientError, BotoCoreError) as exc:
        raise HTTPException(status_code=503, detail="Cannot connect to DynamoDB") from exc


@router.get("")
def list_cloud_activities(_role: str = Depends(require_admin)):
    _enabled()
    try:
        rows = _repo().list_all()
        return {"success": True, "data": rows}
    except (ClientError, BotoCoreError) as exc:
        raise HTTPException(status_code=503, detail="DynamoDB read failed") from exc


@router.get("/{activity_id}")
def get_cloud_activity(activity_id: str, _role: str = Depends(require_admin)):
    _enabled()
    try:
        item = _repo().get(activity_id)
    except (ClientError, BotoCoreError) as exc:
        raise HTTPException(status_code=503, detail="DynamoDB read failed") from exc
    if item is None:
        raise HTTPException(status_code=404, detail="Cloud activity not found")
    return {"success": True, "data": item}


@router.post("", status_code=status.HTTP_201_CREATED)
def create_cloud_test_activity(body: CreateActivityRequest, role: str = Depends(require_admin)):
    _enabled()
    now = datetime.now(TZ).isoformat()
    activity_id = f"ACT#AWSTEST-{uuid4().hex[:12].upper()}"
    item = {
        "activity_id": activity_id,
        **normalize_activity_input(body),
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
        "aws_test_only": True,
    }
    try:
        created = _repo().create(item)
    except ActivityConflictError as exc:
        raise HTTPException(status_code=409, detail="Activity already exists") from exc
    except (ClientError, BotoCoreError) as exc:
        raise HTTPException(status_code=503, detail="DynamoDB write failed") from exc
    return {"success": True, "data": created}
