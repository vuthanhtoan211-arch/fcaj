from __future__ import annotations

import os
import pickle
import sqlite3
from contextlib import closing
from datetime import datetime, timezone
from pathlib import Path
from threading import RLock
from typing import Any

from app.data import store as memory_store


# ==========================================
# CONFIGURATION
# ==========================================

BACKEND_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = BACKEND_ROOT / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

STATE_DB_PATH = Path(
    os.getenv(
        "SAP_STATE_DB_PATH",
        str(DATA_DIR / "app_state.sqlite3"),
    )
)

TRACKED_DATASETS = (
    "activities",
    "students",
    "registrations",
    "attendance",
    "evidence",
    "participation",
)

_STATE_LOCK = RLock()


# ==========================================
# HELPERS
# ==========================================

def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_connection() -> sqlite3.Connection:
    STATE_DB_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    connection = sqlite3.connect(
        STATE_DB_PATH,
        timeout=15,
    )
    connection.execute("PRAGMA journal_mode=WAL")
    connection.execute("PRAGMA synchronous=NORMAL")
    return connection


def initialize_state_database() -> None:
    with _STATE_LOCK:
        with closing(get_connection()) as connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS app_state (
                    dataset_name TEXT PRIMARY KEY,
                    payload BLOB NOT NULL,
                    updated_at TEXT NOT NULL
                )
                """
            )
            connection.commit()


def _get_dataset(name: str) -> Any:
    return getattr(
        memory_store,
        name,
        None,
    )


def _restore_in_place(
    target: Any,
    value: Any,
) -> bool:
    if isinstance(target, dict) and isinstance(value, dict):
        target.clear()
        target.update(value)
        return True

    if isinstance(target, list) and isinstance(value, list):
        target.clear()
        target.extend(value)
        return True

    if isinstance(target, set) and isinstance(value, set):
        target.clear()
        target.update(value)
        return True

    return False


# ==========================================
# LOAD
# ==========================================

def load_application_state() -> dict[str, int]:
    """
    Nạp state đã lưu vào các collection đang tồn tại
    trong app.data.store.

    Rất quan trọng: không gán object mới, mà restore
    in-place để các router đã import activities /
    attendance / registrations... vẫn giữ đúng reference.
    """

    initialize_state_database()

    restored = 0
    skipped = 0

    with _STATE_LOCK:
        with closing(get_connection()) as connection:
            rows = connection.execute(
                """
                SELECT dataset_name, payload
                FROM app_state
                """
            ).fetchall()

    for dataset_name, payload in rows:
        if dataset_name not in TRACKED_DATASETS:
            skipped += 1
            continue

        target = _get_dataset(dataset_name)

        if target is None:
            skipped += 1
            continue

        try:
            value = pickle.loads(payload)
        except Exception:
            skipped += 1
            continue

        if _restore_in_place(target, value):
            restored += 1
        else:
            skipped += 1

    return {
        "restored": restored,
        "skipped": skipped,
    }


# ==========================================
# SAVE
# ==========================================

def save_application_state() -> dict[str, int]:
    """
    Ghi toàn bộ collection chính xuống SQLite.

    Đây là lớp persistence local. API/router hiện tại
    không cần đổi cách đọc/ghi dữ liệu.
    """

    initialize_state_database()

    saved = 0
    skipped = 0
    now = utc_now_iso()

    rows: list[tuple[str, bytes, str]] = []

    for dataset_name in TRACKED_DATASETS:
        value = _get_dataset(dataset_name)

        if value is None:
            raise RuntimeError(
                f"Cannot save application state: missing dataset {dataset_name!r}"
            )

        try:
            payload = pickle.dumps(
                value,
                protocol=pickle.HIGHEST_PROTOCOL,
            )
        except Exception as error:
            # Không bỏ qua dataset bị lỗi: lưu một snapshot thiếu dữ liệu
            # có thể khiến dữ liệu cũ và mới bị lệch sau khi restart.
            raise RuntimeError(
                f"Cannot serialize application state dataset {dataset_name!r}"
            ) from error

        rows.append(
            (
                dataset_name,
                payload,
                now,
            )
        )

    if not rows:
        return {
            "saved": saved,
            "skipped": skipped,
        }

    with _STATE_LOCK:
        with closing(get_connection()) as connection:
            connection.executemany(
                """
                INSERT INTO app_state (
                    dataset_name,
                    payload,
                    updated_at
                )
                VALUES (?, ?, ?)
                ON CONFLICT(dataset_name)
                DO UPDATE SET
                    payload = excluded.payload,
                    updated_at = excluded.updated_at
                """,
                rows,
            )
            connection.commit()

    saved = len(rows)

    return {
        "saved": saved,
        "skipped": skipped,
    }


# ==========================================
# STATUS / MAINTENANCE
# ==========================================

def persistence_status() -> dict[str, Any]:
    initialize_state_database()

    dataset_count = 0
    last_updated_at = None

    with _STATE_LOCK:
        with closing(get_connection()) as connection:
            row = connection.execute(
                """
                SELECT
                    COUNT(*),
                    MAX(updated_at)
                FROM app_state
                """
            ).fetchone()

    if row:
        dataset_count = int(row[0] or 0)
        last_updated_at = row[1]

    return {
        "enabled": True,
        "engine": "sqlite",
        "dataset_count": dataset_count,
        "last_updated_at": last_updated_at,
    }
