from pathlib import Path
from datetime import (
    datetime,
    timedelta,
)
from zoneinfo import ZoneInfo

import csv
import os


# =========================================
# CONFIGURATION
# =========================================

PROJECT_ROOT = (
    Path(__file__)
    .resolve()
    .parents[3]
)

SAMPLE_DATA_DIR = (
    PROJECT_ROOT /
    "sample-data"
)

VN_TIMEZONE = ZoneInfo(
    "Asia/Ho_Chi_Minh"
)

DEMO_ACTIVITY_ID = (
    "ACT#DEMO"
)


# =========================================
# DATA STORE
# =========================================

students = {}

activities = {

    "ACT#AWS2026": {

        "activity_id":
            "ACT#AWS2026",

        "activity_name":
            "AWS Cloud Workshop",

        "activity_type":
            "WORKSHOP",

        "start_time":
            "2026-10-10T08:00:00+07:00",

        "end_time":
            "2026-10-10T11:00:00+07:00",

        "location":
            "Hall A",

        "capacity":
            200,

        "point_value":
            5,

        "semester":
            "1",

        "academic_year":
            "2026-2027",

        "status":
            "UPCOMING",

        "final_list_locked":
            False,

        "check_out_open":
            False,
    }
}


registrations = {}

attendance = {}

evidence = {}

participation = {}


# =========================================
# ACTIVITY BUCKET
# =========================================

def get_activity_bucket(
    store,
    activity_id
):

    if activity_id not in store:
        store[activity_id] = {}

    return store[activity_id]


# =========================================
# LOAD STUDENTS
# =========================================

def load_students():

    students.clear()

    path = (
        SAMPLE_DATA_DIR /
        "students.csv"
    )

    with open(
        path,
        "r",
        encoding="utf-8-sig",
        newline=""
    ) as file:

        reader = csv.DictReader(
            file
        )

        for row in reader:

            mssv = (
                row["mssv"]
                .strip()
                .upper()
            )

            students[mssv] = {
                **row,
                "mssv": mssv,
            }


# =========================================
# LOAD REGISTRATIONS
# =========================================

def load_registrations(
    activity_id="ACT#AWS2026"
):

    bucket = get_activity_bucket(
        registrations,
        activity_id
    )

    bucket.clear()

    path = (
        SAMPLE_DATA_DIR /
        "registration_input.csv"
    )

    with open(
        path,
        "r",
        encoding="utf-8-sig",
        newline=""
    ) as file:

        reader = csv.DictReader(
            file
        )

        for row in reader:

            mssv = (
                row["mssv"]
                .strip()
                .upper()
            )

            full_name = (
                row["full_name"]
                .strip()
            )

            if mssv not in students:
                continue

            if not full_name:
                continue

            bucket[mssv] = {
                **row,
                "mssv": mssv,
            }


# =========================================
# LOAD EVIDENCE
# =========================================

def load_evidence(
    activity_id="ACT#AWS2026"
):

    bucket = get_activity_bucket(
        evidence,
        activity_id
    )

    bucket.clear()

    path = (
        SAMPLE_DATA_DIR /
        "evidence_input.csv"
    )

    with open(
        path,
        "r",
        encoding="utf-8-sig",
        newline=""
    ) as file:

        reader = csv.DictReader(
            file
        )

        for row in reader:

            mssv = (
                row["mssv"]
                .strip()
                .upper()
            )

            if mssv not in students:
                continue

            bucket[mssv] = {
                "submitted": True,
                "submitted_at": (
                    row["submitted_at"]
                ),
            }


# =========================================
# INITIALIZE DATA
# =========================================

def initialize_data():

    # Lưu ý:
    # Dữ liệu điểm danh trong RAM
    # sẽ bị reset khi backend restart.

    attendance.clear()

    participation.clear()

    activities[
        "ACT#AWS2026"
    ]["check_out_open"] = False

    load_students()

    load_registrations()

    load_evidence()


    # =====================================
    # OPTIONAL DEMO ACTIVITY
    # =====================================

    demo_enabled = (
        os.getenv(
            "SAP_DEMO_MODE"
        ) == "1"
    )

    if demo_enabled:

        current = datetime.now(
            VN_TIMEZONE
        )

        activities[
            DEMO_ACTIVITY_ID
        ] = {

            "activity_id":
                DEMO_ACTIVITY_ID,

            "activity_name":
                "TEST - Điểm danh nội bộ",

            "activity_type":
                "WORKSHOP",

            "start_time": (
                current -
                timedelta(
                    minutes=5
                )
            ).isoformat(),

            "end_time": (
                current +
                timedelta(
                    hours=2
                )
            ).isoformat(),

            "location":
                "Local test",

            "capacity":
                200,

            "point_value":
                0,

            "semester":
                "TEST",

            "academic_year":
                "TEST",

            "status":
                "ACTIVE",

            "final_list_locked":
                False,

            "check_out_open":
                False,
        }


        # Dùng bản sao Registration mẫu.
        # Attendance của ACT#DEMO
        # hoàn toàn tách biệt với AWS.

        registrations[
            DEMO_ACTIVITY_ID
        ] = dict(
            registrations[
                "ACT#AWS2026"
            ]
        )

        evidence[
            DEMO_ACTIVITY_ID
        ] = {}

    else:

        activities.pop(
            DEMO_ACTIVITY_ID,
            None
        )

        registrations.pop(
            DEMO_ACTIVITY_ID,
            None
        )

        evidence.pop(
            DEMO_ACTIVITY_ID,
            None
        )


    print(
        "===== DATA INITIALIZED ====="
    )

    print(
        f"Students: {len(students)}"
    )

    print(
        "AWS registrations: "
        f"{len(registrations['ACT#AWS2026'])}"
    )

    print(
        "AWS evidence: "
        f"{len(evidence['ACT#AWS2026'])}"
    )

    print(
        f"Demo mode: {demo_enabled}"
    )