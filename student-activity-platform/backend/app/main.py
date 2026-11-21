"""FastAPI application entrypoint for local development and AWS VM hosting."""
import logging
import os
from pathlib import Path
from urllib.parse import urlparse

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.auth_db import (
    get_user_by_session,
    initialize_auth_database,
    seed_initial_accounts,
)
from app.notification_db import (
    emit_event_notifications,
    initialize_notification_database,
)
from app.persistence import (
    initialize_state_database,
    load_application_state,
    save_application_state,
)
from app.routers.activities import router as activities_router
from app.routers.activity_images import router as activity_images_router
from app.routers.analytics import router as analytics_router
from app.routers.attendance import router as attendance_router
from app.routers.auth_routes import router as auth_router
from app.routers.admin_users import router as admin_users_router
from app.routers.evidence_imports import router as evidence_imports_router
from app.routers.exports import router as exports_router
from app.routers.imports import router as imports_router
from app.routers.me import router as me_router
from app.routers.notifications import router as notifications_router
from app.routers.reconciliation import router as reconciliation_router
from app.routers.cloud_activities_probe import (
    router as cloud_activities_probe_router,
)

logger = logging.getLogger(__name__)

# The existing application uses SQLite and an in-memory state snapshot.
# On a VM, keep backend/data and backend/uploads on persistent disk.
# Run one Uvicorn worker until state management supports multiple workers.
initialize_state_database()
state_restore_result = load_application_state()
initialize_auth_database()
seed_result = seed_initial_accounts()
initialize_notification_database()

app = FastAPI(
    title="Student Activity Management & Engagement Analytics Platform",
    version="0.5.0",
)

# Comma-separated trusted browser origins, e.g.:
# SAP_CORS_ORIGINS=https://main.d2p96elhe5x6se.amplifyapp.com
# Never use '*' with credentials or allow arbitrary origins.
DEFAULT_CORS_ORIGINS = (
    "http://localhost:5173",
    "http://127.0.0.1:5173",
)


def _configured_cors_origins() -> list[str]:
    origins = list(DEFAULT_CORS_ORIGINS)
    configured = os.getenv("SAP_CORS_ORIGINS", "")
    for raw in configured.split(","):
        origin = raw.strip().rstrip("/")
        if not origin:
            continue
        parsed = urlparse(origin)
        if (
            parsed.scheme not in {"http", "https"}
            or not parsed.hostname
            or parsed.path not in {"", "/"}
            or parsed.params
            or parsed.query
            or parsed.fragment
            or parsed.username
            or parsed.password
            or origin == "*"
        ):
            raise ValueError(f"Invalid SAP_CORS_ORIGINS origin: {origin!r}")
        # HTTP is only allowed for local development.
        if parsed.scheme == "http" and parsed.hostname not in {
            "localhost", "127.0.0.1"
        }:
            raise ValueError("Non-local SAP_CORS_ORIGINS entries must use HTTPS")
        if origin not in origins:
            origins.append(origin)
    return origins


app.add_middleware(
    CORSMiddleware,
    allow_origins=_configured_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PUBLIC_PATHS = {
    "/health",
    "/auth/login",
    "/docs",
    "/openapi.json",
    "/redoc",
}
MUTATING_METHODS = {"POST", "PUT", "PATCH", "DELETE"}
AWS_TEST_PREFIX = "/aws-test/"


@app.middleware("http")
async def authentication_gate(request: Request, call_next):
    path = request.url.path
    method = request.method.upper()
    is_public_request = (
        method == "OPTIONS"
        or path in PUBLIC_PATHS
        or path.startswith("/uploads/")
    )
    if not is_public_request:
        authorization = str(request.headers.get("Authorization") or "").strip()
        if not authorization.lower().startswith("bearer "):
            return JSONResponse(
                status_code=401,
                content={
                    "detail": {
                        "code": "AUTHENTICATION_REQUIRED",
                        "message": "Vui lòng đăng nhập để tiếp tục.",
                    }
                },
            )
        token = authorization[7:].strip()
        if not token or get_user_by_session(token) is None:
            return JSONResponse(
                status_code=401,
                content={
                    "detail": {
                        "code": "INVALID_SESSION",
                        "message": "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
                    }
                },
            )

    response = await call_next(request)
    should_run_local_hooks = (
        method in MUTATING_METHODS
        and response.status_code < 400
        and not path.startswith(AWS_TEST_PREFIX)
    )
    if should_run_local_hooks:
        try:
            save_application_state()
        except Exception:
            logger.exception("[PERSISTENCE] Failed to save application state")
            return JSONResponse(
                status_code=503,
                content={
                    "detail": {
                        "code": "PERSISTENCE_SAVE_FAILED",
                        "message": (
                            "Thao tác có thể đã được thực hiện nhưng lưu dữ liệu "
                            "local thất bại. Vui lòng kiểm tra lại dữ liệu "
                            "trước khi thực hiện lại."
                        ),
                    }
                },
            )
        try:
            emit_event_notifications(method, path)
        except Exception:
            logger.exception("[NOTIFICATIONS] Failed to emit event")
    return response


BACKEND_ROOT = Path(__file__).resolve().parent.parent
UPLOADS_DIR = BACKEND_ROOT / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

app.include_router(auth_router)
app.include_router(admin_users_router)
app.include_router(me_router)
app.include_router(notifications_router)
app.include_router(activities_router)
app.include_router(activity_images_router)
app.include_router(attendance_router)
app.include_router(imports_router)
app.include_router(evidence_imports_router)
app.include_router(reconciliation_router)
app.include_router(exports_router)
app.include_router(analytics_router)
app.include_router(cloud_activities_probe_router)


@app.get("/health", tags=["System"])
def health():
    # Public health endpoint must not disclose database contents or seed state.
    return {
        "status": "ok",
        "authentication": "sqlite-session",
        "roles": ["STUDENT", "ADMIN"],
        "activity_poster_upload": True,
    }
