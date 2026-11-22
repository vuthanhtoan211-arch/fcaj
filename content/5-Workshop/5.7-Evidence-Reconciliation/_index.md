---
title: "Evidence Import and Participation Reconciliation"
date: 2026-11-09
weight: 7
chapter: false
pre: "<b>5.7.</b>"
---

## Evidence Import and Participation Reconciliation

This section explains how the **Student Activity Management & Engagement Analytics Platform** imports participation evidence, compares it with registration and real-time attendance records, and supports ADMIN confirmation of participation results.

An imported registration list does not prove attendance, and an attendance timestamp alone may not satisfy all requirements of an activity. Reconciliation helps organizers inspect data from multiple sources before making an authorized decision.

### 1. Data sources

| Dataset | How it is collected | Main information |
| --- | --- | --- |
| Registration | CSV/XLSX imported from the University Portal | Student ID and activity |
| Attendance | Real-time Check-in/Check-out through FastAPI | Check-in and Check-out records |
| Evidence | CSV/XLSX exported from Google Forms or Google Sheets | Submitted participation evidence |

The current application imports exported evidence files; it **does not claim a direct Google Forms/Sheets API integration**. Matching is performed using the corresponding **Activity ID and MSSV**, which prevents combining records from unrelated activities.

### 2. Import evidence data

ADMIN selects the appropriate activity and imports evidence records exported from the external form or spreadsheet. The Backend checks the supported file format, required fields, student IDs and potential duplicates, then makes the data available for reconciliation.

![Actual evidence import interface](/fcaj/images/5-Workshop/5.7-Evidence-Reconciliation/evidence-import.png)

*Figure 5.7.1. Evidence import performed in the Web Application.*

### 3. Reconcile registration, attendance and evidence

The FastAPI Backend compares records for the selected activity and identifies whether registration, Check-in, Check-out and evidence information are present. The resulting view helps ADMIN recognize complete records and cases that need additional review.

| Example condition | What the organizer should check |
| --- | --- |
| Registration, Check-in, Check-out and Evidence are available | Verify the activity's remaining eligibility rules |
| Missing Check-out | Review the incomplete attendance information |
| Evidence exists without recorded attendance | Verify the event requirements and source data |
| Attendance exists but evidence is missing | Determine whether evidence is required |
| Records belong to another activity | Correct the Activity ID association before proceeding |

These cases illustrate possible business conditions; **they do not define new Backend status codes** or mean that a student is automatically approved or rejected.

![Actual reconciliation result](/fcaj/images/5-Workshop/5.7-Evidence-Reconciliation/reconciliation-result.png)

*Figure 5.7.2. Reconciliation results in the implemented platform.*

### 4. Confirm participation results

After reviewing the consolidated data, an authorized ADMIN applies the rules of the activity and performs the supported participation-confirmation action. Records with missing or conflicting information should be investigated rather than altered merely to force a successful result.

![Actual participation confirmation interface](/fcaj/images/5-Workshop/5.7-Evidence-Reconciliation/participation-confirmation.png)

*Figure 5.7.3. ADMIN participation review and confirmation.*

### 5. Architecture and scope

- **Frontend:** React/Vite displays import, reconciliation and confirmation interfaces.
- **Backend:** FastAPI performs matching and participation business logic.
- **Local demo:** SQLite stores the primary demo application data.
- **AWS pilot:** Amazon DynamoDB was used to test `SAP-Evidence` and `SAP-Participation` data groups.

This functionality is handled by the current Web Application. **AWS Glue, Amazon Athena and Amazon QuickSight are not components of the implemented reconciliation service.**

### 6. Workshop contents

1. [Import evidence data](5.7.1-import-evidence/)
2. [Reconcile participation records](5.7.2-reconciliation/)
3. [Confirm participation results](5.7.3-confirm-participation/)
4. [Verify final participation records](5.7.4-verify-participation/)

### 7. Expected learning outcomes

After completing this section, learners can import evidence files, explain how the Backend matches data by Activity ID and MSSV, investigate incomplete records, understand the ADMIN confirmation step and prepare validated participation information for Analytics and Export in section 5.8.

> **Implementation note:** Figures in this section are screenshots of the project. The tables describe scenarios for review, not results from a production-scale dataset or automatic approval rules.
