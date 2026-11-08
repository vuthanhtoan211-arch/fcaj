
import logging
from pathlib import Path

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
    notification_status,
)
from app.persistence import (
    initialize_state_database,
    load_application_state,
    persistence_status,
    save_application_state,
)

logger = logging.getLogger(__name__)

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


# ==========================================
# INITIALIZE LOCAL APPLICATION STATE
# ==========================================

initialize_state_database()
state_restore_result = load_application_state()


# ==========================================
# INITIALIZE AUTH DATABASE
# ==========================================

initialize_auth_database()
seed_result = seed_initial_accounts()


# ==========================================
# INITIALIZE NOTIFICATIONS DATABASE
# ==========================================

initialize_notification_database()


# ==========================================
# APP
# ==========================================

app = FastAPI(
    title=(
        "Student Activity Management & "
        "Engagement Analytics Platform"
    ),
    version="0.5.0",
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# GLOBAL AUTHENTICATION GATE
# + AUTO SAVE AFTER SUCCESSFUL MUTATIONS
# + NOTIFICATION EVENT HOOKS
# ==========================================

PUBLIC_PATHS = {
    "/health",
    "/auth/login",
    "/docs",
    "/openapi.json",
    "/redoc",
}

MUTATING_METHODS = {
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
}

# Các API AWS thử nghiệm không sử dụng
# SQLite application state hoặc notification hooks.
AWS_TEST_PREFIX = "/aws-test/"


@app.middleware("http")
async def authentication_gate(
    request: Request,
    call_next,
):
    path = request.url.path
    method = request.method.upper()

    is_public_request = (
        method == "OPTIONS"
        or path in PUBLIC_PATHS
        or path.startswith("/uploads/")
    )

    if not is_public_request:
        authorization = str(
            request.headers.get("Authorization")
            or ""
        ).strip()

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
                        "message": (
                            "Phiên đăng nhập không hợp lệ "
                            "hoặc đã hết hạn."
                        ),
                    }
                },
            )

    response = await call_next(request)

    is_aws_test_request = path.startswith(
        AWS_TEST_PREFIX
    )

    should_run_local_hooks = (
        method in MUTATING_METHODS
        and response.status_code < 400
        and not is_aws_test_request
    )

    if should_run_local_hooks:
        try:
            save_application_state()
        except Exception:
            logger.exception("[PERSISTENCE] Failed to save application state")
            # Không trả HTTP 2xx khi bước lưu local bị lỗi.
            # Lưu ý: router có thể đã thay đổi dữ liệu trong bộ nhớ
            # hoặc ghi DynamoDB trước khi middleware chạy.
            # Vì vậy không tự động retry thao tác từ frontend.
            return JSONResponse(
                status_code=503,
                content={
                    "detail": {
                        "code": "PERSISTENCE_SAVE_FAILED",
                        "message": (
                            "Thao tác có thể đã được thực hiện nhưng "
                            "lưu dữ liệu local thất bại. "
                            "Vui lòng kiểm tra lại dữ liệu trước "
                            "khi thực hiện lại."
                        ),
                    }
                },
            )

        try:
            emit_event_notifications(
                method,
                path,
            )
        except Exception as error:
            print(
                "[NOTIFICATIONS] Không thể tạo notification event:",
                error,
            )

    return response


# ==========================================
# STATIC UPLOADS
# ==========================================

BACKEND_ROOT = Path(__file__).resolve().parent.parent
UPLOADS_DIR = BACKEND_ROOT / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory=UPLOADS_DIR),
    name="uploads",
)


# ==========================================
# ROUTERS
# ==========================================

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

# API thử nghiệm AWS, tách biệt với API chính.
app.include_router(cloud_activities_probe_router)


# ==========================================
# HEALTH
# ==========================================

@app.get("/health", tags=["System"])
def health():
    return {
        "status": "ok",
        "authentication": "sqlite-session",
        "application_state": persistence_status(),
        "notifications": notification_status(),
        "roles": [
            "STUDENT",
            "ADMIN",
        ],
        "auth_seed": seed_result,
        "state_restore": state_restore_result,
        "activity_poster_upload": True,
    }
