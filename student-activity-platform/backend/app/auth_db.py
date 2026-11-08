from __future__ import annotations



import base64

import hashlib

import hmac

import os

import secrets

import sqlite3

import time

from datetime import datetime, timezone

from pathlib import Path

from typing import Any, Iterable





# ==========================================

# DATABASE CONFIG

# ==========================================



BACKEND_ROOT = Path(__file__).resolve().parent.parent

DATA_DIR = BACKEND_ROOT / "data"

DATA_DIR.mkdir(parents=True, exist_ok=True)



AUTH_DB_PATH = DATA_DIR / "auth.sqlite3"



PBKDF2_ITERATIONS = 210_000

SESSION_TTL_SECONDS = 12 * 60 * 60



ROLE_STUDENT = "STUDENT"

ROLE_ADMIN = "ADMIN"





# ==========================================

# BASIC HELPERS

# ==========================================



def utc_now_iso() -> str:

    return datetime.now(timezone.utc).isoformat()





def normalize_username(value: str | None) -> str:

    return str(value or "").strip().upper()





def get_connection() -> sqlite3.Connection:

    connection = sqlite3.connect(

        AUTH_DB_PATH,

        timeout=10,

    )

    connection.row_factory = sqlite3.Row

    connection.execute("PRAGMA foreign_keys = ON")

    return connection





# ==========================================

# PASSWORD HASHING

# ==========================================



def hash_password(password: str) -> tuple[str, str]:

    salt = secrets.token_bytes(16)

    digest = hashlib.pbkdf2_hmac(

        "sha256",

        password.encode("utf-8"),

        salt,

        PBKDF2_ITERATIONS,

    )



    return (

        base64.b64encode(salt).decode("ascii"),

        base64.b64encode(digest).decode("ascii"),

    )





def verify_password(

    password: str,

    salt_b64: str,

    hash_b64: str,

) -> bool:

    try:

        salt = base64.b64decode(salt_b64.encode("ascii"))

        expected = base64.b64decode(hash_b64.encode("ascii"))

    except Exception:

        return False



    actual = hashlib.pbkdf2_hmac(

        "sha256",

        password.encode("utf-8"),

        salt,

        PBKDF2_ITERATIONS,

    )



    return hmac.compare_digest(actual, expected)





def validate_new_password(password: str) -> list[str]:

    issues: list[str] = []



    if len(password) < 8:

        issues.append("Mật khẩu phải có ít nhất 8 ký tự.")



    if not any(character.islower() for character in password):

        issues.append("Mật khẩu phải có ít nhất 1 chữ thường.")



    if not any(character.isupper() for character in password):

        issues.append("Mật khẩu phải có ít nhất 1 chữ hoa.")



    if not any(character.isdigit() for character in password):

        issues.append("Mật khẩu phải có ít nhất 1 chữ số.")



    if not any(not character.isalnum() for character in password):

        issues.append("Mật khẩu phải có ít nhất 1 ký tự đặc biệt.")



    return issues





# ==========================================

# SCHEMA

# ==========================================



def initialize_auth_database() -> None:

    with get_connection() as connection:

        connection.executescript(

            """

            CREATE TABLE IF NOT EXISTS users (

                username TEXT PRIMARY KEY,

                role TEXT NOT NULL CHECK(role IN ('STUDENT', 'ADMIN')),

                mssv TEXT UNIQUE,

                full_name TEXT NOT NULL DEFAULT '',

                class_name TEXT NOT NULL DEFAULT '',

                cohort TEXT NOT NULL DEFAULT '',

                email TEXT NOT NULL DEFAULT '',

                phone TEXT NOT NULL DEFAULT '',

                avatar_url TEXT,

                password_salt TEXT NOT NULL,

                password_hash TEXT NOT NULL,

                must_change_password INTEGER NOT NULL DEFAULT 1,

                is_active INTEGER NOT NULL DEFAULT 1,

                created_at TEXT NOT NULL,

                updated_at TEXT NOT NULL,

                last_login_at TEXT

            );



            CREATE TABLE IF NOT EXISTS sessions (

                token_hash TEXT PRIMARY KEY,

                username TEXT NOT NULL,

                created_at INTEGER NOT NULL,

                expires_at INTEGER NOT NULL,

                revoked_at INTEGER,

                FOREIGN KEY(username) REFERENCES users(username)

                    ON DELETE CASCADE

            );



            CREATE INDEX IF NOT EXISTS idx_sessions_username

                ON sessions(username);



            CREATE INDEX IF NOT EXISTS idx_sessions_expires

                ON sessions(expires_at);

            """

        )





# ==========================================

# USER SERIALIZATION

# ==========================================



def row_to_user(row: sqlite3.Row | None) -> dict[str, Any] | None:

    if row is None:

        return None



    return {

        "username": row["username"],

        "user_id": row["username"],

        "role": row["role"],

        "mssv": row["mssv"],

        "full_name": row["full_name"],

        "class_name": row["class_name"],

        "cohort": row["cohort"],

        "email": row["email"],

        "phone": row["phone"],

        "avatar_url": row["avatar_url"],

        "must_change_password": bool(row["must_change_password"]),

        "is_active": bool(row["is_active"]),

        "created_at": row["created_at"],

        "updated_at": row["updated_at"],

        "last_login_at": row["last_login_at"],

    }





def get_user(username: str) -> dict[str, Any] | None:

    normalized = normalize_username(username)



    with get_connection() as connection:

        row = connection.execute(

            "SELECT * FROM users WHERE username = ?",

            (normalized,),

        ).fetchone()



    return row_to_user(row)





# ==========================================

# CREATE / SEED USERS

# ==========================================



def create_user_if_missing(

    *,

    username: str,

    password: str,

    role: str,

    mssv: str | None = None,

    full_name: str = "",

    class_name: str = "",

    cohort: str = "",

    email: str = "",

    phone: str = "",

    must_change_password: bool = True,

) -> bool:

    normalized_username = normalize_username(username)

    normalized_role = str(role or "").strip().upper()



    if normalized_role not in {ROLE_STUDENT, ROLE_ADMIN}:

        raise ValueError("Vai trò tài khoản không hợp lệ.")



    if not normalized_username:

        raise ValueError("Username không được để trống.")



    salt_b64, hash_b64 = hash_password(password)

    now = utc_now_iso()



    with get_connection() as connection:

        existing = connection.execute(

            "SELECT username FROM users WHERE username = ?",

            (normalized_username,),

        ).fetchone()



        if existing:

            return False



        connection.execute(

            """

            INSERT INTO users (

                username,

                role,

                mssv,

                full_name,

                class_name,

                cohort,

                email,

                phone,

                avatar_url,

                password_salt,

                password_hash,

                must_change_password,

                is_active,

                created_at,

                updated_at

            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, 1, ?, ?)

            """,

            (

                normalized_username,

                normalized_role,

                normalize_username(mssv) if mssv else None,

                str(full_name or "").strip(),

                str(class_name or "").strip(),

                str(cohort or "").strip(),

                str(email or "").strip(),

                str(phone or "").strip(),

                salt_b64,

                hash_b64,

                1 if must_change_password else 0,

                now,

                now,

            ),

        )



    return True





def iter_student_records() -> Iterable[dict[str, Any]]:

    """

    Đọc dữ liệu sinh viên đang có trong app.data.store.

    Hàm được viết linh hoạt để hỗ trợ cả dict lẫn list.

    """

    try:

        from app.data.store import students  # local import để tránh circular import

    except Exception:

        return []



    if isinstance(students, dict):

        result = []

        for key, value in students.items():

            if isinstance(value, dict):

                record = dict(value)

                record.setdefault("mssv", key)

                result.append(record)

        return result



    if isinstance(students, list):

        return [item for item in students if isinstance(item, dict)]



    return []





def seed_initial_accounts() -> dict[str, int]:
    """Create missing accounts only when explicit initial passwords are configured.

    Existing accounts and password hashes remain untouched. In particular,
    missing environment variables must never create publicly known passwords.
    """
    initialize_auth_database()

    student_initial_password = os.getenv(
        "SAP_STUDENT_INITIAL_PASSWORD", ""
    ).strip()
    admin_initial_password = os.getenv(
        "SAP_ADMIN_PASSWORD", ""
    ).strip()
    admin_username = os.getenv("SAP_ADMIN_USERNAME", "admin")

    # Validate configured bootstrap passwords before creating any accounts.
    for name, password in (
        ("SAP_STUDENT_INITIAL_PASSWORD", student_initial_password),
        ("SAP_ADMIN_PASSWORD", admin_initial_password),
    ):
        if password:
            issues = validate_new_password(password)
            if issues:
                raise ValueError(
                    f"{name} không đáp ứng yêu cầu bảo mật: " + " ".join(issues)
                )

    created_students = 0

    if student_initial_password:
        for student in iter_student_records():
            mssv = normalize_username(student.get("mssv"))
            if not mssv:
                continue
            if create_user_if_missing(
                username=mssv,
                password=student_initial_password,
                role=ROLE_STUDENT,
                mssv=mssv,
                full_name=student.get("full_name", ""),
                class_name=student.get("class_name", ""),
                cohort=student.get("cohort", ""),
                email=student.get("email", ""),
                phone=student.get("phone", ""),
                must_change_password=True,
            ):
                created_students += 1

        # Demo users must be explicitly enabled, never created by default.
        demo_mssv = normalize_username(os.getenv("SAP_DEMO_STUDENT_ID", ""))
        if demo_mssv and create_user_if_missing(
            username=demo_mssv,
            password=student_initial_password,
            role=ROLE_STUDENT,
            mssv=demo_mssv,
            full_name=os.getenv("SAP_DEMO_STUDENT_NAME", "Sinh viên Demo"),
            class_name=os.getenv("SAP_DEMO_STUDENT_CLASS", ""),
            cohort=os.getenv("SAP_DEMO_STUDENT_COHORT", ""),
            email=os.getenv("SAP_DEMO_STUDENT_EMAIL", ""),
            phone="",
            must_change_password=True,
        ):
            created_students += 1

    created_admin = False
    if admin_initial_password:
        created_admin = create_user_if_missing(
            username=admin_username,
            password=admin_initial_password,
            role=ROLE_ADMIN,
            full_name="Quản trị viên hệ thống",
            must_change_password=True,
        )

    return {
        "created_students": created_students,
        "created_admin": 1 if created_admin else 0,
    }


# ==========================================

# TEMPORARY PASSWORD RESET (LOCAL/ADMIN TOOL)

# ==========================================


def set_temporary_password(
    *,
    username: str,
    temporary_password: str,
) -> tuple[bool, str]:
    """
    Đặt lại mật khẩu tạm cho một tài khoản hiện có.

    Dùng cho môi trường local/demo hoặc thao tác quản trị có kiểm soát.
    Sau khi reset, tài khoản bị bắt buộc đổi mật khẩu ở lần đăng nhập kế tiếp.
    Tất cả session hiện tại của tài khoản sẽ bị thu hồi.
    """
    normalized = normalize_username(username)
    password = str(temporary_password or "")

    if not normalized:
        return False, "Username không được để trống."

    if not password:
        return False, "Mật khẩu tạm không được để trống."

    with get_connection() as connection:
        row = connection.execute(
            "SELECT username FROM users WHERE username = ?",
            (normalized,),
        ).fetchone()

        if row is None:
            return False, "Không tìm thấy tài khoản."

        salt_b64, hash_b64 = hash_password(password)
        now = utc_now_iso()

        connection.execute(
            """
            UPDATE users
            SET password_salt = ?,
                password_hash = ?,
                must_change_password = 1,
                is_active = 1,
                updated_at = ?
            WHERE username = ?
            """,
            (
                salt_b64,
                hash_b64,
                now,
                normalized,
            ),
        )

    revoke_all_user_sessions(normalized)

    return True, "Đã đặt lại mật khẩu tạm. Tài khoản phải đổi mật khẩu ở lần đăng nhập tiếp theo."


# ==========================================

# AUTHENTICATION

# ==========================================



def authenticate_user(

    username: str,

    password: str,

) -> dict[str, Any] | None:

    normalized = normalize_username(username)



    with get_connection() as connection:

        row = connection.execute(

            "SELECT * FROM users WHERE username = ?",

            (normalized,),

        ).fetchone()



        if row is None:

            return None



        if not bool(row["is_active"]):

            return None



        if not verify_password(

            password,

            row["password_salt"],

            row["password_hash"],

        ):

            return None



        now = utc_now_iso()

        connection.execute(

            "UPDATE users SET last_login_at = ?, updated_at = ? WHERE username = ?",

            (now, now, normalized),

        )



        updated = connection.execute(

            "SELECT * FROM users WHERE username = ?",

            (normalized,),

        ).fetchone()



    return row_to_user(updated)





# ==========================================

# SESSIONS

# ==========================================



def token_hash(token: str) -> str:

    return hashlib.sha256(token.encode("utf-8")).hexdigest()





def cleanup_expired_sessions() -> None:

    now = int(time.time())

    with get_connection() as connection:

        connection.execute(

            "DELETE FROM sessions WHERE expires_at <= ?",

            (now,),

        )





def create_session(username: str) -> tuple[str, int]:

    cleanup_expired_sessions()



    token = secrets.token_urlsafe(48)

    hashed = token_hash(token)

    created_at = int(time.time())

    expires_at = created_at + SESSION_TTL_SECONDS



    with get_connection() as connection:

        connection.execute(

            """

            INSERT INTO sessions (

                token_hash,

                username,

                created_at,

                expires_at,

                revoked_at

            ) VALUES (?, ?, ?, ?, NULL)

            """,

            (

                hashed,

                normalize_username(username),

                created_at,

                expires_at,

            ),

        )



    return token, expires_at





def get_user_by_session(token: str) -> dict[str, Any] | None:

    if not token:

        return None



    now = int(time.time())

    hashed = token_hash(token)



    with get_connection() as connection:

        row = connection.execute(

            """

            SELECT users.*

            FROM sessions

            JOIN users ON users.username = sessions.username

            WHERE sessions.token_hash = ?

              AND sessions.revoked_at IS NULL

              AND sessions.expires_at > ?

              AND users.is_active = 1

            """,

            (hashed, now),

        ).fetchone()



    return row_to_user(row)





def revoke_session(token: str) -> None:

    if not token:

        return



    with get_connection() as connection:

        connection.execute(

            "UPDATE sessions SET revoked_at = ? WHERE token_hash = ?",

            (int(time.time()), token_hash(token)),

        )





def revoke_all_user_sessions(username: str) -> None:

    with get_connection() as connection:

        connection.execute(

            """

            UPDATE sessions

            SET revoked_at = ?

            WHERE username = ? AND revoked_at IS NULL

            """,

            (int(time.time()), normalize_username(username)),

        )





# ==========================================

# PASSWORD CHANGE

# ==========================================



def change_password(
    *,
    username: str,
    current_password: str,
    new_password: str,
    keep_session_token: str | None = None,
) -> tuple[bool, str]:
    normalized = normalize_username(username)
    issues = validate_new_password(new_password)
    if issues:
        return False, " ".join(issues)
    if current_password == new_password:
        return False, "Mật khẩu mới phải khác mật khẩu hiện tại."

    # Password update and session revocation are in the same SQLite transaction.
    with get_connection() as connection:
        row = connection.execute(
            "SELECT * FROM users WHERE username = ?", (normalized,)
        ).fetchone()
        if row is None or not bool(row["is_active"]):
            return False, "Không tìm thấy tài khoản đang hoạt động."
        if not verify_password(
            current_password, row["password_salt"], row["password_hash"]
        ):
            return False, "Mật khẩu hiện tại không đúng."

        salt_b64, hash_b64 = hash_password(new_password)
        now = utc_now_iso()
        revoked_at = int(time.time())
        connection.execute(
            """
            UPDATE users
            SET password_salt = ?, password_hash = ?,
                must_change_password = 0, updated_at = ?
            WHERE username = ?
            """,
            (salt_b64, hash_b64, now, normalized),
        )

        if keep_session_token:
            # Keep only the authenticated session that requested the change.
            connection.execute(
                """
                UPDATE sessions SET revoked_at = ?
                WHERE username = ? AND revoked_at IS NULL AND token_hash <> ?
                """,
                (revoked_at, normalized, token_hash(keep_session_token)),
            )
        else:
            connection.execute(
                """
                UPDATE sessions SET revoked_at = ?
                WHERE username = ? AND revoked_at IS NULL
                """,
                (revoked_at, normalized),
            )
    return True, "Đổi mật khẩu thành công."





# ==========================================

# PROFILE UPDATE

# ==========================================



def update_profile(
    *,
    username: str,
    email: str | None = None,
    phone: str | None = None,
) -> dict[str, Any] | None:
    normalized = normalize_username(username)
    now = utc_now_iso()
    with get_connection() as connection:
        row = connection.execute(
            "SELECT * FROM users WHERE username = ? AND is_active = 1",
            (normalized,),
        ).fetchone()
        if row is None:
            return None

        next_email = str(email).strip() if email is not None else row["email"]
        next_phone = str(phone).strip() if phone is not None else row["phone"]
        connection.execute(
            """
            UPDATE users SET email = ?, phone = ?, updated_at = ?
            WHERE username = ? AND is_active = 1
            """,
            (next_email, next_phone, now, normalized),
        )
        updated = connection.execute(
            "SELECT * FROM users WHERE username = ?", (normalized,)
        ).fetchone()
    return row_to_user(updated)





def update_avatar(
    *,
    username: str,
    avatar_url: str,
) -> dict[str, Any] | None:
    normalized = normalize_username(username)
    now = utc_now_iso()
    with get_connection() as connection:
        cursor = connection.execute(
            """
            UPDATE users SET avatar_url = ?, updated_at = ?
            WHERE username = ? AND is_active = 1
            """,
            (avatar_url, now, normalized),
        )
        if cursor.rowcount != 1:
            return None
        updated = connection.execute(
            "SELECT * FROM users WHERE username = ?", (normalized,)
        ).fetchone()
    return row_to_user(updated)
