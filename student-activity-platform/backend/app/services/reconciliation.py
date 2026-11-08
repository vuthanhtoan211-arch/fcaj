"""Build reconciliation records without mutating application stores.

The caller (the API router) is responsible for committing a complete result
only after business validation and optional DynamoDB synchronization succeed.
"""

from app.data.store import (
    students,
    activities,
    registrations,
    attendance,
    evidence,
    participation,
)


def evidence_dataset_imported(activity_id: str) -> bool:
    activity = activities.get(activity_id, {})
    evidence_bucket = evidence.get(activity_id, {})
    return bool(activity.get("evidence_import")) or bool(evidence_bucket)


def get_full_name(registration_record, mssv):
    student_record = students.get(mssv, {})
    return (
        registration_record.get("full_name")
        or registration_record.get("student_name")
        or registration_record.get("name")
        or student_record.get("full_name")
        or student_record.get("student_name")
        or student_record.get("name")
        or ""
    )


def reconcile_student(activity_id: str, mssv: str) -> dict:
    """Calculate one student's result; do not save it to participation."""
    registration_bucket = registrations.get(activity_id, {})
    attendance_bucket = attendance.get(activity_id, {})
    evidence_bucket = evidence.get(activity_id, {})
    existing_participation = participation.get(activity_id, {})

    registration_record = registration_bucket.get(mssv, {})
    registered = mssv in registration_bucket
    attendance_record = attendance_bucket.get(mssv, {})
    check_in = bool(attendance_record.get("check_in_time"))
    check_out = bool(attendance_record.get("check_out_time"))
    evidence_record = evidence_bucket.get(mssv, {})
    evidence_submitted = bool(evidence_record.get("submitted"))
    dataset_imported = evidence_dataset_imported(activity_id)

    if evidence_submitted:
        evidence_status = "YES"
    elif dataset_imported:
        evidence_status = "NO"
    else:
        evidence_status = "NOT_IMPORTED"

    issues = []
    if not check_in and not check_out:
        reconciliation_status = "NO_ATTENDANCE"
        issues.append("NO_ATTENDANCE")
    else:
        reconciliation_status = "READY"
        if not check_in:
            issues.append("MISSING_CHECK_IN")
        if not check_out:
            issues.append("MISSING_CHECK_OUT")

    if not dataset_imported:
        issues.append("EVIDENCE_NOT_IMPORTED")
    elif not evidence_submitted:
        issues.append("MISSING_EVIDENCE")

    if reconciliation_status != "NO_ATTENDANCE" and issues:
        reconciliation_status = "NEEDS_REVIEW"

    old_record = existing_participation.get(mssv, {})
    return {
        "activity_id": activity_id,
        "mssv": mssv,
        "full_name": get_full_name(registration_record, mssv),
        "registered": registered,
        "check_in": check_in,
        "check_out": check_out,
        "evidence": evidence_submitted,
        "evidence_submitted": evidence_submitted,
        "evidence_status": evidence_status,
        "evidence_dataset_imported": dataset_imported,
        "reconciliation_status": reconciliation_status,
        "issues": issues,
        "final_status": old_record.get("final_status", "PENDING"),
        "confirmed_by": old_record.get("confirmed_by"),
        "confirmed_at": old_record.get("confirmed_at"),
        "decision_source": old_record.get("decision_source"),
        "decision_issues": old_record.get("decision_issues"),
        "note": old_record.get("note"),
    }


def reconcile_all(activity_id: str) -> list[dict]:
    """Build a complete, unsaved candidate for all registered students."""
    if activity_id not in activities:
        raise ValueError("Activity not found")

    return [
        reconcile_student(activity_id, mssv)
        for mssv in registrations.get(activity_id, {})
    ]
