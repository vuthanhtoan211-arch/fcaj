
"""DynamoDB repository for SAP Activities.

This module is not automatically connected to FastAPI.
It does not import local SQLite data or sample activities.
"""

from __future__ import annotations

import os
from decimal import Decimal
from typing import Any

import boto3
from botocore.exceptions import ClientError


class ActivityConflictError(Exception):
    """A conditional DynamoDB write could not be completed."""


class ActivityRepository:
    def __init__(
        self,
        session: boto3.Session | None = None,
    ) -> None:
        self.session = session or boto3.Session(
            region_name=os.getenv(
                "AWS_REGION",
                "ap-southeast-1",
            )
        )

        self.table_name = os.getenv(
            "SAP_ACTIVITIES_TABLE",
            "SAP-Activities",
        )

        self.table = self.session.resource(
            "dynamodb"
        ).Table(self.table_name)

    @staticmethod
    def _to_dynamo(value: Any) -> Any:
        if isinstance(value, float):
            return Decimal(str(value))

        if isinstance(value, dict):
            return {
                str(key): ActivityRepository._to_dynamo(item)
                for key, item in value.items()
            }

        if isinstance(value, (list, tuple)):
            return [
                ActivityRepository._to_dynamo(item)
                for item in value
            ]

        return value

    @staticmethod
    def _from_dynamo(value: Any) -> Any:
        if isinstance(value, Decimal):
            if value == value.to_integral_value():
                return int(value)
            return float(value)

        if isinstance(value, dict):
            return {
                key: ActivityRepository._from_dynamo(item)
                for key, item in value.items()
            }

        if isinstance(value, list):
            return [
                ActivityRepository._from_dynamo(item)
                for item in value
            ]

        return value

    @staticmethod
    def _validate_id(activity_id: str) -> str:
        value = str(activity_id or "").strip()

        if not value:
            raise ValueError(
                "activity_id is required"
            )

        return value

    @staticmethod
    def _handle_condition_error(
        error: ClientError,
        activity_id: str,
    ) -> None:
        code = error.response.get(
            "Error", {}
        ).get("Code")

        if code == "ConditionalCheckFailedException":
            raise ActivityConflictError(
                f"Conditional write failed: {activity_id}"
            ) from error

        raise error

    def get(
        self,
        activity_id: str,
    ) -> dict | None:
        activity_id = self._validate_id(
            activity_id
        )

        response = self.table.get_item(
            Key={"activity_id": activity_id},
            ConsistentRead=True,
        )

        item = response.get("Item")

        if item is None:
            return None

        return self._from_dynamo(item)

    def list_all(self) -> list[dict]:
        """Scan all items. Suitable for small demo datasets."""
        items = []
        args: dict[str, Any] = {
            "ConsistentRead": True,
        }

        while True:
            response = self.table.scan(**args)

            items.extend(
                self._from_dynamo(item)
                for item in response.get("Items", [])
            )

            cursor = response.get(
                "LastEvaluatedKey"
            )

            if not cursor:
                break

            args["ExclusiveStartKey"] = cursor

        return items

    def create(
        self,
        activity: dict,
    ) -> dict:
        activity_id = self._validate_id(
            activity.get("activity_id")
        )

        item = dict(activity)
        item["activity_id"] = activity_id

        try:
            self.table.put_item(
                Item=self._to_dynamo(item),
                ConditionExpression=(
                    "attribute_not_exists(#pk)"
                ),
                ExpressionAttributeNames={
                    "#pk": "activity_id",
                },
            )

        except ClientError as error:
            self._handle_condition_error(
                error,
                activity_id,
            )

        return item

    def update_fields(
        self,
        activity_id: str,
        changes: dict,
    ) -> dict:
        """Update specified fields without replacing other fields."""
        activity_id = self._validate_id(
            activity_id
        )

        if not isinstance(changes, dict):
            raise ValueError(
                "changes must be a dictionary"
            )

        if not changes:
            raise ValueError(
                "changes cannot be empty"
            )

        if "activity_id" in changes:
            raise ValueError(
                "activity_id cannot be changed"
            )

        names = {
            "#pk": "activity_id",
        }
        values = {}
        expressions = []

        for index, (field, value) in enumerate(
            changes.items()
        ):
            if not isinstance(field, str) or not field:
                raise ValueError(
                    "Field names must be non-empty strings"
                )

            name_token = f"#field{index}"
            value_token = f":value{index}"

            names[name_token] = field
            values[value_token] = self._to_dynamo(
                value
            )

            expressions.append(
                f"{name_token} = {value_token}"
            )

        try:
            response = self.table.update_item(
                Key={
                    "activity_id": activity_id,
                },
                UpdateExpression=(
                    "SET " + ", ".join(expressions)
                ),
                ConditionExpression=(
                    "attribute_exists(#pk)"
                ),
                ExpressionAttributeNames=names,
                ExpressionAttributeValues=values,
                ReturnValues="ALL_NEW",
            )

        except ClientError as error:
            self._handle_condition_error(
                error,
                activity_id,
            )

        return self._from_dynamo(
            response.get("Attributes", {})
        )

    def update_existing(
        self,
        activity: dict,
    ) -> dict:
        """Update supplied fields without replacing the full item."""
        activity_id = self._validate_id(
            activity.get("activity_id")
        )

        changes = {
            key: value
            for key, value in activity.items()
            if key != "activity_id"
        }

        return self.update_fields(
            activity_id,
            changes,
        )

    def delete_if_exists(
        self,
        activity_id: str,
    ) -> None:
        """Hard deletion stays disabled until related-data checks."""
        raise NotImplementedError(
            "Activity deletion is disabled until "
            "Registration, Attendance, Evidence and "
            "Participation guards are implemented."
        )
