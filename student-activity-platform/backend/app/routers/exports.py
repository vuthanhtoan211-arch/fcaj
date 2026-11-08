from io import BytesIO
from datetime import datetime
from zoneinfo import ZoneInfo
import re

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from fastapi.responses import (
    StreamingResponse,
)

from openpyxl import Workbook

from openpyxl.styles import (
    Alignment,
    Border,
    Font,
    PatternFill,
    Side,
)

from openpyxl.utils import (
    get_column_letter,
)

from app.data.store import (
    activities,
    attendance,
    participation,
    registrations,
)

from app.repositories.participation_read_repository import get_participation_bucket_for_read

from app.auth import require_admin

# ==========================================
# ROUTER
# ==========================================

router = APIRouter(
    prefix="/activities",
    tags=["Exports"],
)

# ==========================================
# CONFIG
# ==========================================

VN_TIMEZONE = ZoneInfo(
    "Asia/Ho_Chi_Minh"
)

ALLOWED_EXPORT_TYPES = {
    "final",
    "checkin",
    "checkout",
    "absent",
    "all",
}

# ==========================================
# BOOLEAN HELPER
# ==========================================

def is_true(
    value
):

    if (
        value is True
        or value == 1
    ):

        return True

    return str(
        value or ""
    ).strip().upper() in {
        "YES",
        "TRUE",
        "Y",
        "1",
    }

# ==========================================
# GET ATTENDANCE RECORD
# ==========================================

def get_attendance_record(
    activity_id,
    mssv,
):

    bucket = attendance.get(
        activity_id,
        {},
    )

    record = bucket.get(
        mssv,
        {},
    )

    if isinstance(
        record,
        dict,
    ):

        return record

    return {}

# ==========================================
# GET CHECK-IN / CHECK-OUT TIME
# ==========================================

def get_event_time(
    record,
    event_type,
):

    if not isinstance(
        record,
        dict,
    ):

        return ""

    if event_type == "checkin":

        keys = [
            "check_in_at",
            "checked_in_at",
            "check_in_time",
            "checkin_at",
            "checkin_time",
            "check_in",
        ]

    else:

        keys = [
            "check_out_at",
            "checked_out_at",
            "check_out_time",
            "checkout_at",
            "checkout_time",
            "check_out",
        ]

    for key in keys:

        value = record.get(
            key
        )

        if isinstance(
            value,
            datetime,
        ):

            return value.isoformat()

        if (
            isinstance(
                value,
                str,
            )
            and value.strip()
            and value.strip().upper()
            not in {
                "YES",
                "NO",
                "TRUE",
                "FALSE",
                "Y",
                "N",
            }
        ):

            return value.strip()

    return ""

# ==========================================
# HAS CHECK-IN / CHECK-OUT
# ==========================================

def has_event(
    attendance_record,
    participation_record,
    event_type,
):

    timestamp = get_event_time(
        attendance_record,
        event_type,
    )

    if timestamp:

        return True

    if event_type == "checkin":

        attendance_keys = [
            "checked_in",
            "check_in",
        ]

        participation_keys = [
            "check_in",
            "checked_in",
        ]

    else:

        attendance_keys = [
            "checked_out",
            "check_out",
        ]

        participation_keys = [
            "check_out",
            "checked_out",
        ]

    for key in attendance_keys:

        if is_true(
            attendance_record.get(
                key
            )
        ):

            return True

    for key in participation_keys:

        if is_true(
            participation_record.get(
                key
            )
        ):

            return True

    return False

# ==========================================
# STUDENT NAME
# ==========================================

def get_full_name(
    registration,
    participant,
):

    return (
        registration.get(
            "full_name"
        )
        or participant.get(
            "full_name"
        )
        or participant.get(
            "student_name"
        )
        or participant.get(
            "name"
        )
        or ""
    )

# ==========================================
# UNIT / CLASS
# ==========================================

def get_unit_name(
    registration,
):

    return (
        registration.get(
            "unit_name"
        )
        or registration.get(
            "class_name"
        )
        or registration.get(
            "class"
        )
        or registration.get(
            "class_code"
        )
        or ""
    )

# ==========================================
# PARSE DATETIME
# ==========================================

def parse_datetime(
    value,
):

    if not value:

        return None

    if isinstance(
        value,
        datetime,
    ):

        return value

    text = str(
        value
    ).strip()

    if not text:

        return None

    if text.endswith(
        "Z"
    ):

        text = (
            text[:-1]
            + "+00:00"
        )

    try:

        return datetime.fromisoformat(
            text
        )

    except ValueError:

        return None

# ==========================================
# FORMAT DATETIME
# ==========================================

def format_datetime(
    value,
):

    if not value:

        return ""

    date = parse_datetime(
        value
    )

    if date is None:

        return str(
            value
        )

    if date.tzinfo is not None:

        date = date.astimezone(
            VN_TIMEZONE
        )

    return date.strftime(
        "%d/%m/%Y %H:%M:%S"
    )

# ==========================================
# FORMAT DATE
# ==========================================

def format_date(
    value,
):

    if not value:

        return ""

    date = parse_datetime(
        value
    )

    if date is None:

        return str(
            value
        )

    if date.tzinfo is not None:

        date = date.astimezone(
            VN_TIMEZONE
        )

    return date.strftime(
        "%d/%m/%Y"
    )

# ==========================================
# FINAL PARTICIPATION LIST
# ==========================================

def build_final_rows(
    activity_id,
):

    registration_bucket = (
        registrations.get(
            activity_id,
            {},
        )
    )

    participation_bucket = get_participation_bucket_for_read(activity_id)

    result = []

    for mssv, participant in (
        participation_bucket.items()
    ):

        # Chi xuat ket qua cua sinh vien co dang ky.
        if mssv not in registration_bucket:
            continue

        final_status = str(
            participant.get(
                "final_status",
                "",
            )
        ).upper()

        if (
            final_status
            != "CONFIRMED"
        ):

            continue

        registration = (
            registration_bucket.get(
                mssv,
                {},
            )
        )

        attendance_record = (
            get_attendance_record(
                activity_id,
                mssv,
            )
        )

        check_in_value = (
            get_event_time(
                attendance_record,
                "checkin",
            )
            or participant.get(
                "check_in_at",
                "",
            )
        )

        check_out_value = (
            get_event_time(
                attendance_record,
                "checkout",
            )
            or participant.get(
                "check_out_at",
                "",
            )
        )

        decision_source = str(
            participant.get(
                "decision_source",
                "",
            )
        ).upper()

        result.append([

            mssv,

            get_full_name(
                registration,
                participant,
            ),

            get_unit_name(
                registration
            ),

            format_datetime(
                check_in_value
            ),

            format_datetime(
                check_out_value
            ),

            (
                "Có"
                if is_true(
                    participant.get(
                        "evidence"
                    )
                )
                else "Không"
            ),

            (
                "BTC xử lý"
                if (
                    decision_source
                    == "MANUAL"
                )
                else "Hệ thống"
            ),

            participant.get(
                "note",
                "",
            ),

        ])

    result.sort(
        key=lambda row:
            (
                str(
                    row[1]
                ).lower(),

                str(
                    row[0]
                ),
            )
    )

    return result

# ==========================================
# CHECK-IN LIST
# ==========================================

def build_checkin_rows(
    activity_id,
):

    registration_bucket = (
        registrations.get(
            activity_id,
            {},
        )
    )

    participation_bucket = get_participation_bucket_for_read(activity_id)

    attendance_bucket = (
        attendance.get(
            activity_id,
            {},
        )
    )

    # Cung pham vi voi Analytics: chi sinh vien da dang ky.
    # Attendance/Participation ngoai danh sach can duoc ra soat rieng.
    all_mssv = set(registration_bucket.keys())

    result = []

    for mssv in all_mssv:

        registration = (
            registration_bucket.get(
                mssv,
                {},
            )
        )

        participant = (
            participation_bucket.get(
                mssv,
                {},
            )
        )

        attendance_record = (
            get_attendance_record(
                activity_id,
                mssv,
            )
        )

        if not has_event(
            attendance_record,
            participant,
            "checkin",
        ):

            continue

        check_in_value = (
            get_event_time(
                attendance_record,
                "checkin",
            )
            or participant.get(
                "check_in_at",
                "",
            )
        )

        result.append([

            mssv,

            get_full_name(
                registration,
                participant,
            ),

            get_unit_name(
                registration
            ),

            format_datetime(
                check_in_value
            ),

        ])

    result.sort(
        key=lambda row:
            (
                str(
                    row[3]
                ),

                str(
                    row[0]
                ),
            )
    )

    return result

# ==========================================
# CHECK-OUT LIST
# ==========================================

def build_checkout_rows(
    activity_id,
):

    registration_bucket = (
        registrations.get(
            activity_id,
            {},
        )
    )

    participation_bucket = get_participation_bucket_for_read(activity_id)

    attendance_bucket = (
        attendance.get(
            activity_id,
            {},
        )
    )

    # Cung pham vi voi Analytics: chi sinh vien da dang ky.
    # Attendance/Participation ngoai danh sach can duoc ra soat rieng.
    all_mssv = set(registration_bucket.keys())

    result = []

    for mssv in all_mssv:

        registration = (
            registration_bucket.get(
                mssv,
                {},
            )
        )

        participant = (
            participation_bucket.get(
                mssv,
                {},
            )
        )

        attendance_record = (
            get_attendance_record(
                activity_id,
                mssv,
            )
        )

        if not has_event(
            attendance_record,
            participant,
            "checkout",
        ):

            continue

        check_out_value = (
            get_event_time(
                attendance_record,
                "checkout",
            )
            or participant.get(
                "check_out_at",
                "",
            )
        )

        result.append([

            mssv,

            get_full_name(
                registration,
                participant,
            ),

            get_unit_name(
                registration
            ),

            format_datetime(
                check_out_value
            ),

        ])

    result.sort(
        key=lambda row:
            (
                str(
                    row[3]
                ),

                str(
                    row[0]
                ),
            )
    )

    return result

# ==========================================
# REGISTERED BUT ABSENT
# ==========================================

def build_absent_rows(
    activity_id,
):

    registration_bucket = (
        registrations.get(
            activity_id,
            {},
        )
    )

    participation_bucket = get_participation_bucket_for_read(activity_id)

    result = []

    for mssv, registration in (
        registration_bucket.items()
    ):

        participant = (
            participation_bucket.get(
                mssv,
                {},
            )
        )

        attendance_record = (
            get_attendance_record(
                activity_id,
                mssv,
            )
        )

        checked_in = has_event(
            attendance_record,
            participant,
            "checkin",
        )

        checked_out = has_event(
            attendance_record,
            participant,
            "checkout",
        )

        # Không Check-in VÀ không Check-out.
        if (
            checked_in
            or checked_out
        ):

            continue

        result.append([

            mssv,

            registration.get(
                "full_name",
                "",
            ),

            get_unit_name(
                registration
            ),

            format_datetime(
                registration.get(
                    "registered_at"
                )
            ),

            registration.get(
                "portal_activity",
                "",
            ),

        ])

    result.sort(
        key=lambda row:
            (
                str(
                    row[1]
                ).lower(),

                str(
                    row[0]
                ),
            )
    )

    return result

# ==========================================
# EXCEL STYLES
# ==========================================

HEADER_FILL = PatternFill(
    fill_type="solid",
    fgColor="2563EB",
)

TITLE_FILL = PatternFill(
    fill_type="solid",
    fgColor="EFF6FF",
)

HEADER_FONT = Font(
    bold=True,
    color="FFFFFF",
)

TITLE_FONT = Font(
    bold=True,
    size=15,
    color="0F172A",
)

INFO_LABEL_FONT = Font(
    bold=True,
    color="334155",
)

THIN_BORDER = Border(

    left=Side(
        style="thin",
        color="E2E8F0",
    ),

    right=Side(
        style="thin",
        color="E2E8F0",
    ),

    top=Side(
        style="thin",
        color="E2E8F0",
    ),

    bottom=Side(
        style="thin",
        color="E2E8F0",
    ),

)

# ==========================================
# WRITE EXCEL SHEET
# ==========================================

def write_sheet(
    worksheet,
    activity,
    title,
    columns,
    rows,
):

    column_count = len(
        columns
    )

    # ======================================
    # IMPORTANT
    #
    # Không lấy .column_letter từ cell sau
    # khi merge vì có thể là MergedCell.
    # ======================================

    last_column = (
        get_column_letter(
            column_count
        )
    )

    # ======================================
    # TITLE
    # ======================================

    worksheet.merge_cells(
        f"A1:{last_column}1"
    )

    worksheet["A1"] = (
        title
    )

    worksheet["A1"].font = (
        TITLE_FONT
    )

    worksheet["A1"].fill = (
        TITLE_FILL
    )

    worksheet["A1"].alignment = (
        Alignment(
            horizontal="center",
            vertical="center",
        )
    )

    worksheet.row_dimensions[
        1
    ].height = 28

    # ======================================
    # ACTIVITY INFORMATION
    # ======================================

    info_rows = [

        (
            "Hoạt động",
            activity.get(
                "activity_name",
                "",
            ),
        ),

        (
            "Mã hoạt động",
            activity.get(
                "activity_id",
                "",
            ),
        ),

        (
            "Ngày tổ chức",
            format_date(
                activity.get(
                    "start_time"
                )
            ),
        ),

        (
            "Địa điểm",
            activity.get(
                "location",
                "",
            ),
        ),

        (
            "Số lượng",
            len(
                rows
            ),
        ),

    ]

    for row_index, (
        label,
        value,
    ) in enumerate(
        info_rows,
        start=2,
    ):

        label_cell = (
            worksheet.cell(
                row=row_index,
                column=1,
                value=label,
            )
        )

        value_cell = (
            worksheet.cell(
                row=row_index,
                column=2,
                value=value,
            )
        )

        label_cell.font = (
            INFO_LABEL_FONT
        )

        label_cell.alignment = (
            Alignment(
                vertical="top",
            )
        )

        value_cell.alignment = (
            Alignment(
                vertical="top",
                wrap_text=True,
            )
        )

    # ======================================
    # TABLE HEADER
    # ======================================

    header_row = 8

    for index, column in enumerate(
        columns,
        start=1,
    ):

        cell = worksheet.cell(
            row=header_row,
            column=index,
            value=column,
        )

        cell.fill = (
            HEADER_FILL
        )

        cell.font = (
            HEADER_FONT
        )

        cell.border = (
            THIN_BORDER
        )

        cell.alignment = (
            Alignment(
                horizontal="center",
                vertical="center",
                wrap_text=True,
            )
        )

    worksheet.row_dimensions[
        header_row
    ].height = 24

    # ======================================
    # TABLE DATA
    # ======================================

    for row_index, row in enumerate(
        rows,
        start=header_row + 1,
    ):

        # STT
        worksheet.cell(
            row=row_index,
            column=1,
            value=(
                row_index
                - header_row
            ),
        )

        # Data bắt đầu từ cột B
        for column_index, value in enumerate(
            row,
            start=2,
        ):

            cell = worksheet.cell(
                row=row_index,
                column=column_index,
                value=value,
            )

            # Du lieu tu Portal la van ban, khong phai Excel formula.
            # openpyxl tu dong nhan chuoi bat dau bang '=' la formula.
            if isinstance(value, str) and value.startswith('='):
                cell.data_type = 's'

        # Style cho cả dòng
        for column_index in range(
            1,
            column_count + 1,
        ):

            cell = worksheet.cell(
                row=row_index,
                column=column_index,
            )

            cell.border = (
                THIN_BORDER
            )

            cell.alignment = (
                Alignment(
                    vertical="top",
                    wrap_text=True,
                )
            )

    # ======================================
    # FREEZE / FILTER
    # ======================================

    worksheet.freeze_panes = (
        "A9"
    )

    last_data_row = max(
        header_row,
        header_row + len(
            rows
        ),
    )

    worksheet.auto_filter.ref = (
        f"A{header_row}:"
        f"{last_column}"
        f"{last_data_row}"
    )

    # ======================================
    # COLUMN WIDTH
    # ======================================

    widths = {

        1: 8,

        2: 16,

        3: 28,

        4: 24,

        5: 22,

        6: 22,

        7: 16,

        8: 18,

        9: 36,

    }

    for column_index in range(
        1,
        column_count + 1,
    ):

        column_letter = (
            get_column_letter(
                column_index
            )
        )

        worksheet.column_dimensions[
            column_letter
        ].width = widths.get(
            column_index,
            18,
        )

# ==========================================
# FINAL LIST SHEET
# ==========================================

def add_final_sheet(
    workbook,
    activity,
    activity_id,
    worksheet=None,
):

    rows = build_final_rows(
        activity_id
    )

    if worksheet is None:

        worksheet = (
            workbook.create_sheet(
                "Danh_sach_tham_gia"
            )
        )

    write_sheet(
        worksheet,
        activity,
        "DANH SÁCH THAM GIA CUỐI CÙNG",
        [
            "STT",
            "MSSV",
            "Họ và tên",
            "Đơn vị / Lớp",
            "Thời gian Check-in",
            "Thời gian Check-out",
            "Evidence",
            "Nguồn xác nhận",
            "Ghi chú",
        ],
        rows,
    )

# ==========================================
# CHECK-IN SHEET
# ==========================================

def add_checkin_sheet(
    workbook,
    activity,
    activity_id,
    worksheet=None,
):

    rows = build_checkin_rows(
        activity_id
    )

    if worksheet is None:

        worksheet = (
            workbook.create_sheet(
                "Check_in"
            )
        )

    write_sheet(
        worksheet,
        activity,
        "DANH SÁCH CHECK-IN",
        [
            "STT",
            "MSSV",
            "Họ và tên",
            "Đơn vị / Lớp",
            "Thời gian Check-in",
        ],
        rows,
    )

# ==========================================
# CHECK-OUT SHEET
# ==========================================

def add_checkout_sheet(
    workbook,
    activity,
    activity_id,
    worksheet=None,
):

    rows = build_checkout_rows(
        activity_id
    )

    if worksheet is None:

        worksheet = (
            workbook.create_sheet(
                "Check_out"
            )
        )

    write_sheet(
        worksheet,
        activity,
        "DANH SÁCH CHECK-OUT",
        [
            "STT",
            "MSSV",
            "Họ và tên",
            "Đơn vị / Lớp",
            "Thời gian Check-out",
        ],
        rows,
    )

# ==========================================
# ABSENT SHEET
# ==========================================

def add_absent_sheet(
    workbook,
    activity,
    activity_id,
    worksheet=None,
):

    rows = build_absent_rows(
        activity_id
    )

    if worksheet is None:

        worksheet = (
            workbook.create_sheet(
                "Khong_tham_gia"
            )
        )

    write_sheet(
        worksheet,
        activity,
        (
            "DANH SÁCH ĐĂNG KÝ "
            "NHƯNG KHÔNG THAM GIA"
        ),
        [
            "STT",
            "MSSV",
            "Họ và tên",
            "Đơn vị / Lớp",
            "Ngày đăng ký",
            "Hoạt động Portal",
        ],
        rows,
    )

# ==========================================
# EXPORT ENDPOINT
# ==========================================

@router.get(
    "/{activity_id}/export/{export_type}"
)
def export_activity_data(
    activity_id: str,
    export_type: str,

    admin_role: str = Depends(
        require_admin
    ),
):

    del admin_role

    activity = activities.get(
        activity_id
    )

    if activity is None:

        raise HTTPException(
            status_code=404,
            detail=(
                "Không tìm thấy hoạt động."
            ),
        )

    normalized_type = (
        export_type
        .strip()
        .lower()
    )

    if (
        normalized_type
        not in ALLOWED_EXPORT_TYPES
    ):

        raise HTTPException(
            status_code=422,
            detail=(
                "Loại dữ liệu xuất "
                "không hợp lệ."
            ),
        )

    # ======================================
    # FINAL / ALL REQUIRE LOCKED FINAL LIST
    # ======================================

    if (
        normalized_type
        in {
            "final",
            "all",
        }
        and
        not activity.get(
            "final_list_locked",
            False,
        )
    ):

        raise HTTPException(
            status_code=409,
            detail={

                "code":
                    "FINAL_LIST_NOT_LOCKED",

                "message":
                    (
                        "Phải khóa danh sách cuối "
                        "trước khi xuất danh sách "
                        "tham gia chính thức."
                    ),

            },
        )

    # ======================================
    # CREATE WORKBOOK
    # ======================================

    workbook = Workbook()

    default_sheet = (
        workbook.active
    )

    # ======================================
    # FINAL
    # ======================================

    if (
        normalized_type
        == "final"
    ):

        default_sheet.title = (
            "Danh_sach_tham_gia"
        )

        add_final_sheet(
            workbook,
            activity,
            activity_id,
            default_sheet,
        )

    # ======================================
    # CHECK-IN
    # ======================================

    elif (
        normalized_type
        == "checkin"
    ):

        default_sheet.title = (
            "Check_in"
        )

        add_checkin_sheet(
            workbook,
            activity,
            activity_id,
            default_sheet,
        )

    # ======================================
    # CHECK-OUT
    # ======================================

    elif (
        normalized_type
        == "checkout"
    ):

        default_sheet.title = (
            "Check_out"
        )

        add_checkout_sheet(
            workbook,
            activity,
            activity_id,
            default_sheet,
        )

    # ======================================
    # ABSENT
    # ======================================

    elif (
        normalized_type
        == "absent"
    ):

        default_sheet.title = (
            "Khong_tham_gia"
        )

        add_absent_sheet(
            workbook,
            activity,
            activity_id,
            default_sheet,
        )

    # ======================================
    # ALL
    # ======================================

    else:

        default_sheet.title = (
            "Danh_sach_tham_gia"
        )

        add_final_sheet(
            workbook,
            activity,
            activity_id,
            default_sheet,
        )

        add_checkin_sheet(
            workbook,
            activity,
            activity_id,
        )

        add_checkout_sheet(
            workbook,
            activity,
            activity_id,
        )

        add_absent_sheet(
            workbook,
            activity,
            activity_id,
        )

    # ======================================
    # SAVE WORKBOOK TO MEMORY
    # ======================================

    buffer = BytesIO()

    workbook.save(
        buffer
    )

    workbook.close()

    buffer.seek(
        0
    )

    # ======================================
    # FILE NAME
    # ======================================

    safe_activity_id = re.sub(
        r"[^A-Za-z0-9_-]+",
        "_",
        activity_id,
    )

    type_names = {

        "final":
            "danh_sach_tham_gia",

        "checkin":
            "check_in",

        "checkout":
            "check_out",

        "absent":
            "khong_tham_gia",

        "all":
            "tat_ca_danh_sach",

    }

    filename = (
        f"{safe_activity_id}_"
        f"{type_names[normalized_type]}"
        ".xlsx"
    )

    # ======================================
    # DOWNLOAD RESPONSE
    # ======================================

    return StreamingResponse(

        buffer,

        media_type=(
            "application/vnd.openxmlformats-"
            "officedocument.spreadsheetml.sheet"
        ),

        headers={

            "Content-Disposition":
                (
                    f'attachment; '
                    f'filename="{filename}"'
                ),

        },

    )