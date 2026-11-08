from __future__ import annotations

import os
import re
import sqlite3
from contextlib import closing
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

from app.data.store import activities, participation, registrations


# ==========================================
# CONFIGURATION
# ==========================================

BACKEND_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = BACKEND_ROOT / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

VN_TIMEZONE = ZoneInfo("Asia/Ho_Chi_Minh")

NOTIFICATION_DB_PATH = Path(
    os.getenv(
        "SAP_NOTIFICATION_DB_PATH",
        str(DATA_DIR / "notifications.sqlite3"),
    )
)


# ==========================================
# TIME / NORMALIZATION
# ==========================================

def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def normalize_username(value: Any) -> str:
    return str(value or "").strip().upper()


def normalize_role(value: Any) -> str:
    return str(value or "").strip().upper()


# ==========================================
# DATABASE
# ==========================================

def get_connection() -> sqlite3.Connection:
    NOTIFICATION_DB_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    connection = sqlite3.connect(
        NOTIFICATION_DB_PATH,
        timeout=15,
    )
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA journal_mode=WAL")
    connection.execute("PRAGMA synchronous=NORMAL")
    return connection


def initialize_notification_database() -> None:
    with closing(get_connection()) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS notifications (
                notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_key TEXT NOT NULL UNIQUE,
                audience_type TEXT NOT NULL,
                audience_value TEXT NOT NULL,
                category TEXT NOT NULL,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                activity_id TEXT,
                created_at TEXT NOT NULL
            )
            """
        )

        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS notification_reads (
                notification_id INTEGER NOT NULL,
                username TEXT NOT NULL,
                read_at TEXT NOT NULL,
                PRIMARY KEY (notification_id, username),
                FOREIGN KEY (notification_id)
                    REFERENCES notifications(notification_id)
                    ON DELETE CASCADE
            )
            """
        )

        connection.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_notifications_audience
            ON notifications(audience_type, audience_value, created_at)
            """
        )

        connection.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_notification_reads_username
            ON notification_reads(username, notification_id)
            """
        )

        connection.commit()


# ==========================================
# CREATE
# ==========================================

def create_notification(
    *,
    event_key: str,
    audience_type: str,
    audience_value: str,
    category: str,
    title: str,
    message: str,
    activity_id: str | None = None,
) -> bool:
    initialize_notification_database()

    key = str(event_key or "").strip()
    audience_type = str(audience_type or "").strip().upper()
    audience_value = str(audience_value or "").strip().upper()

    if not key:
        raise ValueError("event_key không được để trống.")

    if audience_type not in {"USER", "ROLE", "ALL"}:
        raise ValueError("audience_type không hợp lệ.")

    if not audience_value:
        audience_value = "*"

    with closing(get_connection()) as connection:
        cursor = connection.execute(
            """
            INSERT OR IGNORE INTO notifications (
                event_key,
                audience_type,
                audience_value,
                category,
                title,
                message,
                activity_id,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                key,
                audience_type,
                audience_value,
                str(category or "INFO").strip().upper(),
                str(title or "Thông báo").strip(),
                str(message or "").strip(),
                str(activity_id).strip() if activity_id else None,
                utc_now_iso(),
            ),
        )
        connection.commit()
        return cursor.rowcount > 0


# ==========================================
# ACTIVITY HELPERS
# ==========================================

def _activity_name(activity_id: str) -> str:
    activity = activities.get(activity_id) or {}
    return str(
        activity.get("activity_name")
        or activity.get("title")
        or activity_id
    ).strip()


def _is_published(activity: dict) -> bool:
    publication_status = str(
        activity.get("publication_status")
        or ""
    ).upper()

    status = str(activity.get("status") or "").upper()

    return (
        publication_status == "PUBLISHED"
        or status in {"PUBLISHED", "UPCOMING", "ACTIVE", "COMPLETED"}
    )


def _parse_datetime(value: Any) -> datetime | None:
    if isinstance(value, datetime):
        parsed = value
    else:
        text = str(value or "").strip()

        if not text:
            return None

        if text.endswith("Z"):
            text = text[:-1] + "+00:00"

        try:
            parsed = datetime.fromisoformat(text)
        except ValueError:
            return None

    # Activity time trong hệ thống được nhập theo giờ Việt Nam.
    # Nếu chuỗi không kèm timezone, phải hiểu là Asia/Ho_Chi_Minh
    # thay vì UTC để reminder không bị lệch 7 giờ.
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=VN_TIMEZONE)

    return parsed.astimezone(timezone.utc)


# ==========================================
# PERSONAL STUDENT NOTIFICATIONS
# ==========================================

def ensure_personal_notifications(user: Any) -> None:
    """
    Sinh notification cá nhân theo trạng thái dữ liệu hiện tại.

    Dedupe bằng event_key nên:
    - import Registration lại không spam cùng một thông báo;
    - reminder 24h chỉ phát một lần;
    - mở Check-out lại không spam cùng một thông báo;
    - thông báo hủy hoạt động chỉ phát một lần;
    - kết quả CONFIRMED/REJECTED chỉ phát một lần cho mỗi trạng thái.
    """

    if isinstance(user, dict):
        role = normalize_role(user.get("role"))
        username = normalize_username(user.get("username"))
        mssv = normalize_username(user.get("mssv"))
    else:
        role = normalize_role(getattr(user, "role", ""))
        username = normalize_username(getattr(user, "username", ""))
        mssv = normalize_username(getattr(user, "mssv", ""))

    if role != "STUDENT" or not username or not mssv:
        return

    now = datetime.now(timezone.utc)

    # --------------------------------------
    # REGISTRATION + 24H REMINDER
    # --------------------------------------

    for activity_id, bucket in list(registrations.items()):
        if not isinstance(bucket, dict):
            continue

        if mssv not in bucket:
            continue

        activity = activities.get(activity_id) or {}
        name = _activity_name(activity_id)

        create_notification(
            event_key=f"REGISTRATION:{activity_id}:{mssv}",
            audience_type="USER",
            audience_value=username,
            category="REGISTRATION",
            title="Đã ghi nhận đăng ký",
            message=f"Bạn đã có tên trong danh sách đăng ký hoạt động {name}.",
            activity_id=activity_id,
        )

        publication_status = str(
            activity.get("publication_status")
            or ""
        ).strip().upper()
        runtime_status = str(
            activity.get("status")
            or ""
        ).strip().upper()

        # Sinh viên đã đăng ký phải được biết nếu hoạt động bị hủy.
        if (
            publication_status == "CANCELLED"
            or runtime_status == "CANCELLED"
        ):
            reason = str(
                activity.get("cancel_reason")
                or ""
            ).strip()

            message = f"Hoạt động {name} đã bị hủy."
            if reason:
                message += f" Lý do: {reason}"

            create_notification(
                event_key=f"CANCELLED:{activity_id}:{mssv}",
                audience_type="USER",
                audience_value=username,
                category="ACTIVITY",
                title="Hoạt động đã bị hủy",
                message=message,
                activity_id=activity_id,
            )
            continue

        if not _is_published(activity):
            continue

        # Check-out chỉ thông báo cho sinh viên có Registration của hoạt động.
        # event_key cố định giúp đóng/mở lại không tạo spam.
        if bool(activity.get("check_out_open")):
            create_notification(
                event_key=f"CHECKOUT_OPEN:{activity_id}:{mssv}",
                audience_type="USER",
                audience_value=username,
                category="REMINDER",
                title="Check-out đã được mở",
                message=(
                    f"Check-out của hoạt động {name} đã được mở. "
                    "Hãy hoàn tất Check-out theo hướng dẫn của Ban Tổ chức."
                ),
                activity_id=activity_id,
            )

        start_at = _parse_datetime(activity.get("start_time"))
        if start_at is None:
            continue

        seconds = (start_at - now).total_seconds()

        if 0 < seconds <= 24 * 60 * 60:
            create_notification(
                event_key=f"REMINDER24:{activity_id}:{mssv}",
                audience_type="USER",
                audience_value=username,
                category="REMINDER",
                title="Hoạt động sắp diễn ra",
                message=(
                    f"Hoạt động {name} sẽ diễn ra trong vòng 24 giờ tới. "
                    "Hãy kiểm tra thời gian và địa điểm trước khi tham gia."
                ),
                activity_id=activity_id,
            )

    # --------------------------------------
    # RESULT UPDATE
    # --------------------------------------

    for activity_id, bucket in list(participation.items()):
        if not isinstance(bucket, dict):
            continue

        record = bucket.get(mssv)
        if not isinstance(record, dict):
            continue

        final_status = str(
            record.get("final_status")
            or "PENDING"
        ).upper()

        if final_status not in {"CONFIRMED", "REJECTED"}:
            continue

        name = _activity_name(activity_id)

        if final_status == "CONFIRMED":
            title = "Kết quả tham gia đã được xác nhận"
            message = f"Bạn đã được xác nhận tham gia hoạt động {name}."
        else:
            title = "Kết quả tham gia đã được cập nhật"
            message = (
                f"Hoạt động {name} hiện có kết quả không xác nhận tham gia. "
                "Bạn có thể mở Kết quả của tôi để xem chi tiết."
            )

        create_notification(
            event_key=f"RESULT:{activity_id}:{mssv}:{final_status}",
            audience_type="USER",
            audience_value=username,
            category="RESULT",
            title=title,
            message=message,
            activity_id=activity_id,
        )


# ==========================================
# GLOBAL EVENT NOTIFICATIONS
# ==========================================

def emit_event_notifications(
    method: str,
    path: str,
) -> None:
    """
    Được gọi sau mutation thành công trong main middleware.
    Không đọc request body nên không ảnh hưởng route hiện tại.
    """

    method = str(method or "").upper()
    path = str(path or "").strip()

    if method != "POST":
        return

    # /activities/{id}/publish
    match = re.fullmatch(r"/activities/([^/]+)/publish", path)
    if match:
        activity_id = match.group(1)
        name = _activity_name(activity_id)

        create_notification(
            event_key=f"PUBLISHED:{activity_id}",
            audience_type="ROLE",
            audience_value="STUDENT",
            category="ACTIVITY",
            title="Hoạt động mới được công bố",
            message=f"{name} đã được công bố. Bạn có thể xem thông tin hoạt động ngay bây giờ.",
            activity_id=activity_id,
        )
        return

    # /activities/{id}/registrations/import
    match = re.fullmatch(r"/activities/([^/]+)/registrations/import", path)
    if match:
        activity_id = match.group(1)
        name = _activity_name(activity_id)

        create_notification(
            event_key=f"ADMIN:REGIMPORT:{activity_id}:{utc_now_iso()[:16]}",
            audience_type="ROLE",
            audience_value="ADMIN",
            category="IMPORT",
            title="Đã cập nhật Registration",
            message=f"Danh sách đăng ký của {name} vừa được cập nhật.",
            activity_id=activity_id,
        )
        return

    # /activities/{id}/evidence/import
    match = re.fullmatch(r"/activities/([^/]+)/evidence/import", path)
    if match:
        activity_id = match.group(1)
        name = _activity_name(activity_id)

        create_notification(
            event_key=f"ADMIN:EVIDENCE:{activity_id}:{utc_now_iso()[:16]}",
            audience_type="ROLE",
            audience_value="ADMIN",
            category="IMPORT",
            title="Đã cập nhật Evidence",
            message=f"Dữ liệu minh chứng của {name} vừa được cập nhật.",
            activity_id=activity_id,
        )
        return

    # /activities/{id}/reconcile
    match = re.fullmatch(r"/activities/([^/]+)/reconcile", path)
    if match:
        activity_id = match.group(1)
        name = _activity_name(activity_id)

        create_notification(
            event_key=f"ADMIN:RECONCILE:{activity_id}:{utc_now_iso()[:16]}",
            audience_type="ROLE",
            audience_value="ADMIN",
            category="RECONCILIATION",
            title="Đối soát đã được cập nhật",
            message=f"Hệ thống vừa chạy đối soát cho {name}.",
            activity_id=activity_id,
        )
        return

    # /activities/{id}/finalize
    match = re.fullmatch(r"/activities/([^/]+)/finalize", path)
    if match:
        activity_id = match.group(1)
        name = _activity_name(activity_id)

        create_notification(
            event_key=f"ADMIN:FINALIZE:{activity_id}",
            audience_type="ROLE",
            audience_value="ADMIN",
            category="FINAL",
            title="Danh sách cuối đã được khóa",
            message=f"Danh sách kết quả cuối của {name} đã được khóa.",
            activity_id=activity_id,
        )
        return


# ==========================================
# QUERY
# ==========================================

def _audience_where() -> str:
    return """
    (
        n.audience_type = 'ALL'
        OR (n.audience_type = 'ROLE' AND n.audience_value = ?)
        OR (n.audience_type = 'USER' AND n.audience_value = ?)
    )
    """


def list_notifications(
    *,
    username: str,
    role: str,
    limit: int = 30,
) -> list[dict[str, Any]]:
    initialize_notification_database()

    username = normalize_username(username)
    role = normalize_role(role)
    limit = max(1, min(int(limit or 30), 100))

    with closing(get_connection()) as connection:
        rows = connection.execute(
            f"""
            SELECT
                n.notification_id,
                n.category,
                n.title,
                n.message,
                n.activity_id,
                n.created_at,
                CASE WHEN r.notification_id IS NULL THEN 0 ELSE 1 END AS is_read,
                r.read_at
            FROM notifications n
            LEFT JOIN notification_reads r
                ON r.notification_id = n.notification_id
                AND r.username = ?
            WHERE {_audience_where()}
            ORDER BY n.notification_id DESC
            LIMIT ?
            """,
            (
                username,
                role,
                username,
                limit,
            ),
        ).fetchall()

    return [
        {
            "notification_id": int(row["notification_id"]),
            "category": row["category"],
            "title": row["title"],
            "message": row["message"],
            "activity_id": row["activity_id"],
            "created_at": row["created_at"],
            "is_read": bool(row["is_read"]),
            "read_at": row["read_at"],
        }
        for row in rows
    ]


def get_unread_count(
    *,
    username: str,
    role: str,
) -> int:
    initialize_notification_database()

    username = normalize_username(username)
    role = normalize_role(role)

    with closing(get_connection()) as connection:
        row = connection.execute(
            f"""
            SELECT COUNT(*) AS total
            FROM notifications n
            LEFT JOIN notification_reads r
                ON r.notification_id = n.notification_id
                AND r.username = ?
            WHERE {_audience_where()}
              AND r.notification_id IS NULL
            """,
            (
                username,
                role,
                username,
            ),
        ).fetchone()

    return int(row["total"] if row else 0)


# ==========================================
# READ STATE
# ==========================================

def _notification_visible_to_user(
    connection: sqlite3.Connection,
    notification_id: int,
    username: str,
    role: str,
) -> bool:
    row = connection.execute(
        f"""
        SELECT 1
        FROM notifications n
        WHERE n.notification_id = ?
          AND {_audience_where()}
        LIMIT 1
        """,
        (
            int(notification_id),
            normalize_role(role),
            normalize_username(username),
        ),
    ).fetchone()

    return row is not None


def mark_notification_read(
    *,
    notification_id: int,
    username: str,
    role: str,
) -> bool:
    initialize_notification_database()

    username = normalize_username(username)
    role = normalize_role(role)

    with closing(get_connection()) as connection:
        if not _notification_visible_to_user(
            connection,
            notification_id,
            username,
            role,
        ):
            return False

        connection.execute(
            """
            INSERT OR IGNORE INTO notification_reads (
                notification_id,
                username,
                read_at
            ) VALUES (?, ?, ?)
            """,
            (
                int(notification_id),
                username,
                utc_now_iso(),
            ),
        )
        connection.commit()

    return True


def mark_all_notifications_read(
    *,
    username: str,
    role: str,
) -> int:
    initialize_notification_database()

    username = normalize_username(username)
    role = normalize_role(role)
    now = utc_now_iso()

    with closing(get_connection()) as connection:
        rows = connection.execute(
            f"""
            SELECT n.notification_id
            FROM notifications n
            LEFT JOIN notification_reads r
                ON r.notification_id = n.notification_id
                AND r.username = ?
            WHERE {_audience_where()}
              AND r.notification_id IS NULL
            """,
            (
                username,
                role,
                username,
            ),
        ).fetchall()

        ids = [int(row["notification_id"]) for row in rows]

        connection.executemany(
            """
            INSERT OR IGNORE INTO notification_reads (
                notification_id,
                username,
                read_at
            ) VALUES (?, ?, ?)
            """,
            [
                (notification_id, username, now)
                for notification_id in ids
            ],
        )
        connection.commit()

    return len(ids)


# ==========================================
# STATUS
# ==========================================

def notification_status() -> dict[str, Any]:
    initialize_notification_database()

    with closing(get_connection()) as connection:
        row = connection.execute(
            """
            SELECT COUNT(*) AS total,
                   MAX(created_at) AS last_created_at
            FROM notifications
            """
        ).fetchone()

    return {
        "enabled": True,
        "engine": "sqlite",
        "notification_count": int(row["total"] if row else 0),
        "last_created_at": row["last_created_at"] if row else None,
    }
