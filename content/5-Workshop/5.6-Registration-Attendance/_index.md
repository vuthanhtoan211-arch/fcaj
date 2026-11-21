
---
title: "Registration and Attendance Management"
date: 2026-11-09
weight: 6
chapter: false
pre: "<b>5.6.</b>"
---

## Registration and Attendance Management

In this section, we will explore the registration management and attendance recording workflows of the Student Activity Management & Engagement Analytics Platform.

When organizing university activities, organizers need to manage student registration lists, verify participant information, and record Check-in and Check-out timestamps.

Managing these processes manually using multiple Excel files can be time-consuming, especially for activities involving large numbers of students.

The platform is designed to centralize student activity data and support real-time attendance recording through a Web Application.

#### Data Sources

The registration and attendance workflows use two primary data sources:

* University Portal: Provides student registration lists in CSV/XLSX format.
* Student Card QR / Student ID: Provides student identification information for Check-in and Check-out during an activity.

Registration records are imported from files, while attendance records are sent directly to the Backend through REST APIs.

#### Processing Architecture

```text
University Portal
        |
        | Export CSV / XLSX
        v
ADMIN - React / Vite
        |
        | Registration Import
        v
FastAPI Backend
        |
        v
Registration Data

Student Card QR / Student ID
        |
        v
ADMIN - Attendance Interface
        |
        | Real-time REST API
        v
FastAPI Backend
        |
        v
Attendance Data
```

The Backend uses SQLite to support local Demo persistence and application state recovery.

Amazon DynamoDB is integrated to test cloud-based Registration and Attendance storage through the SAP-Registrations and SAP-Attendance tables.

![System Architecture](/images/2-Proposal/student_activity_architectur.drawio.png)

#### Business Workflow

1. ADMIN creates and prepares an activity.
2. Import student registrations from the University Portal.
3. Validate and standardize student IDs.
4. Prepare attendance time windows and business conditions.
5. Record real-time Check-in.
6. Record real-time Check-out.
7. Inspect and verify attendance records.
8. Prepare data for reconciliation and participation confirmation.

#### Contents

1. [Import student registration data](5.6.1-import-registration/)
2. [Prepare activity and attendance](5.6.2-prepare-attendance/)
3. [Record Check-in and Check-out](5.6.3-check-in-check-out/)
4. [Verify attendance data](5.6.4-verify-attendance/)

#### Objectives

After completing this section, you will be able to:

* Import student registration data from CSV/XLSX files.
* Validate missing and duplicate records.
* Understand the relationship between Activity ID and Student ID.
* Prepare an activity that satisfies attendance requirements.
* Record Check-in and Check-out through REST APIs.
* Verify attendance business rules.
* Inspect Backend and DynamoDB records when AWS Pilot integration is enabled.
* Prepare data for reconciliation and participation analytics.

This section helps learners understand how to build a student activity management workflow, starting from initial registration data and continuing through real-time attendance recording.
