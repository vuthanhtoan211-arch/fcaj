---
title: "Registration and Attendance Management"
date: 2026-11-09
weight: 6
chapter: false
pre: "<b>5.6.</b>"
---

## Registration and Attendance Management

This section documents the registration import and real-time Check-in/Check-out functions implemented in the **Student Activity Management & Engagement Analytics Platform**.

University events often collect registrations through an external portal, while attendance is recorded at the venue. The objective of this module is to combine these records by activity and student, reduce manual spreadsheet processing, and prepare reliable data for subsequent reconciliation.

### 1. Data sources and implementation scope

| Data source | Method used in the project | Purpose |
| --- | --- | --- |
| University Portal | ADMIN imports exported CSV/XLSX files | Build the registration list |
| Student card QR / Student ID (MSSV) | ADMIN uses the attendance interface to submit an immediate API request | Record Check-in and Check-out |
| Activity configuration | ADMIN manages the activity through the Web Application | Apply the correct activity and attendance conditions |

The current version **does not automatically synchronize with the University Portal API**. Registration files are imported, whereas Check-in and Check-out events are sent to the FastAPI Backend when they occur. A scanner that provides the student ID as input may be used; complete camera-based QR scanning should not be assumed without device testing.

### 2. Technical implementation

- **Frontend:** React/Vite provides the ADMIN interfaces for activities, registration import and attendance.
- **Backend:** Python/FastAPI validates requests, enforces permissions and processes attendance rules.
- **Local demo storage:** SQLite stores application data for the locally running demonstration.
- **AWS integration test:** Amazon DynamoDB was used to test the `SAP-Registrations` and `SAP-Attendance` data groups. It is not presented as a fully migrated production database.

Registration and attendance belong to the **main FastAPI application**, not the separate AWS Lambda CSV Processing Demo described in section 5.10.

### 3. Import student registration data

ADMIN selects an activity, uploads the registration file exported from the University Portal and reviews the import result. The Backend checks the expected fields, student IDs, missing values and duplicate records according to the implemented import rules.

![Actual registration import interface](/fcaj/images/5-Workshop/5.6-Registration-Attendance/registration-import.png)

*Figure 5.6.1. Registration import interface from the implemented Web Application.*

### 4. Record Check-in and Check-out in real time

During an event, the organizer selects the correct activity and identifies a student using their card information or MSSV. Each valid action is submitted immediately to the attendance REST API and stored as an attendance record.

The Backend checks whether the operation is allowed, including the activity, permitted time window and current attendance state. Check-out is recorded as a distinct operation; it is not inferred merely from a registration record.

![Actual Check-in interface](/fcaj/images/5-Workshop/5.6-Registration-Attendance/check-in.png)

*Figure 5.6.2. Check-in operation in the Web Application.*

![Actual Check-out interface](/fcaj/images/5-Workshop/5.6-Registration-Attendance/check-out.png)

*Figure 5.6.3. Check-out operation in the Web Application.*

### 5. Validation and verification

The workshop verifies the following cases:

1. An eligible student is included in the correct activity's registration data.
2. A valid Check-in is recorded with its timestamp.
3. A valid Check-out updates the corresponding attendance record.
4. Duplicate or invalid requests are handled according to Backend rules.
5. Student IDs remain associated with the correct Activity ID.
6. ADMIN can review the recorded attendance data before reconciliation.

The association of **Activity ID and MSSV** is essential: one student can participate in multiple activities, so attendance must not be matched using MSSV alone across the whole system.

### 6. Workshop contents

1. [Import registration data](5.6.1-import-registration/)
2. [Prepare the activity and attendance conditions](5.6.2-prepare-attendance/)
3. [Perform Check-in and Check-out](5.6.3-check-in-check-out/)
4. [Verify attendance results](5.6.4-verify-attendance/)

### 7. Expected learning outcomes

After completing this section, learners can import and validate registration data, record real-time attendance through FastAPI, inspect the corresponding records and explain how these data become inputs to the reconciliation process in section 5.7.

> **Implementation note:** The screenshots document the actual user interface and tests. The local FastAPI/SQLite workflow and the DynamoDB pilot have different scopes; the screenshots do not imply a fully cloud-hosted backend.
