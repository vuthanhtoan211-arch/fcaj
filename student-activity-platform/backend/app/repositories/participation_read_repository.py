"""Shared read-only participation data access for local and AWS pilot activities.

Only the dedicated synthetic activity uses DynamoDB. All other activities keep
using their existing in-memory state restored from SQLite.
"""

from __future__ import annotations

import os
from decimal import Decimal
from typing import Any

from fastapi import HTTPException
from app.data.store import participation


def _pilot_activity(activity_id: str) -> bool:
    if os.getenv("SAP_PARTICIPATION_AWS_PILOT", "0").strip() != "1":
        return False
    target = os.getenv("SAP_PARTICIPATION_AWS_TEST_ACTIVITY_ID", "").strip()
    return bool(target) and activity_id == target


def _normal(value: Any) -> Any:
    if isinstance(value, Decimal):
        return int(value) if value % 1 == 0 else float(value)
    if isinstance(value, dict):
        return {str(k): _normal(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_normal(v) for v in value]
    return value


def get_participation_bucket_for_read(activity_id: str) -> dict[str, dict]:
    """Read current participation records from their designated authority.

    Fail closed on AWS errors, missing rows, or unexpected records. Never
    silently report local cached state as fresh AWS data.
    """
    if not _pilot_activity(activity_id):
        return participation.get(activity_id, {})

    import boto3
    from boto3.dynamodb.conditions import Key

    allowed = {"TEST000001", "TEST000002", "TEST000003"}
    table_name = os.getenv("SAP_PARTICIPATION_TABLE", "SAP-Participation").strip()
    if not table_name:
        raise HTTPException(status_code=503, detail="Participation DynamoDB table is not configured")

    try:
        table = boto3.resource("dynamodb").Table(table_name)
        params = {
            "KeyConditionExpression": Key("activity_id").eq(activity_id),
            "ConsistentRead": True,
        }
        found: dict[str, dict] = {}
        while True:
            response = table.query(**params)
            for raw in response.get("Items", []):
                mssv = str(raw.get("mssv", "")).strip().upper()
                if (
                    mssv not in allowed
                    or raw.get("activity_id") != activity_id
                    or mssv in found
                ):
                    raise ValueError("Unexpected Participation pilot record")
                found[mssv] = _normal(raw)
            cursor = response.get("LastEvaluatedKey")
            if not cursor:
                break
            params["ExclusiveStartKey"] = cursor
        return found
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail="Cannot verify current Participation data from DynamoDB",
        ) from exc
