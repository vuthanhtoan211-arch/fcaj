
---
title: "Analytics Dashboard and Export"
date: 2026-11-09
weight: 8
chapter: false
pre: "<b>5.8.</b>"
---

## Analytics Dashboard and Export

In this section, we will explore data analytics, Dashboard visualization, and report export functionality in the Student Activity Management & Engagement Analytics Platform.

After completing registration management, attendance recording, evidence imports, and reconciliation, the system contains the business datasets required to analyze student engagement.

University activity organizers need to understand registration totals, actual attendance, attendance completion, and confirmed participation results for each activity.

Manually aggregating multiple Excel files can be time-consuming and may introduce inconsistencies between reports.

The Analytics Dashboard helps ADMIN users monitor important indicators, review activity outcomes, and use data to support student activity management.

#### Analytics Data Sources

The system uses the following business datasets:

* **Activities:** Information about university activities.
* **Registrations:** Student registration records.
* **Attendance:** Real-time Check-in and Check-out records.
* **Evidence:** Participation evidence imported from CSV/XLSX files.
* **Participation:** Reconciliation and student participation confirmation results.

These datasets are associated using Activity ID and Student ID to support accurate aggregation.

#### Analytics and Export Architecture

```text
Registration Data
        +
Attendance Data
        +
Evidence Data
        +
Participation Results
        |
        v
Python / FastAPI Backend
        |
        v
Data Aggregation & Analytics
        |
        +----------------------+
        |                      |
        v                      v
REST API Response        Report Generation
        |                      |
        v                      v
React / Vite Dashboard     CSV / XLSX
        |                      |
        v                      v
ADMIN / STUDENT          ADMIN Download
```

The Python/FastAPI Backend retrieves, aggregates, and processes business data.

The React/Vite Frontend receives analytical results through REST APIs and displays indicators appropriate for the user's permissions.

SQLite supports local Demo persistence and recovery. Amazon DynamoDB is integrated and tested for cloud-based business data storage.

![System Architecture](/images/2-Proposal/student_activity_architectur.drawio.png)

#### Analytics Metrics

The Analytics Dashboard may use indicators such as:

* Total activities.
* Total registrations.
* Students with Check-in records.
* Students with Check-out records.
* Students with complete attendance records.
* Students with participation evidence.
* Confirmed participants.
* Rejected participants.
* Confirmed participation rate.

The actual displayed indicators depend on the Analytics functionality available in the current project version.

#### Business Workflow

1. Prepare Registration, Attendance, Evidence, and Participation data.
2. Identify the activity scope for analysis.
3. Aggregate data and calculate metrics through the Backend.
4. Display analytical results on the React/Vite Dashboard.
5. Review indicators and use supported filters.
6. Export reports from business data.
7. Verify consistency between the Dashboard, Backend, and exported reports.

#### Contents

1. [Prepare analytics data and metrics](5.8.1-prepare-analytics/)
2. [Build the Analytics Dashboard](5.8.2-build-dashboard/)
3. [Export CSV/XLSX reports](5.8.3-export-reports/)
4. [Verify analytics and reports](5.8.4-verify-analytics/)

#### Objectives

After completing this section, you will be able to:

* Understand how business data supports an Analytics Dashboard.
* Distinguish registration, attendance, and confirmed participation data.
* Calculate analytical indicators using Python.
* Display analytics results using React/Vite.
* Inspect Dashboard data through REST APIs.
* Export reports for administrative use.
* Verify data accuracy across application components.
* Understand ADMIN/STUDENT authorization for analytics functionality.

{{% notice note %}}
The project's Analytics Dashboard is implemented using React/Vite and FastAPI. Amazon QuickSight, AWS Glue, and Amazon Athena are not used as the primary analytics components in this workshop.
{{% /notice %}}

#### Conclusion

Through this section, learners will understand how to transform business records into meaningful analytical indicators that help organizers evaluate activity outcomes and student engagement.

This connects the platform's data management capabilities with its analytics functionality, contributing to a more complete Student Activity Management & Engagement Analytics Platform.
