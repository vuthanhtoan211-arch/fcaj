---
title: "Worklog Week 7"
date: 2026-10-19
weight: 7
chapter: false
pre: "<b>1.7.</b>"
---

### Week 7 Objectives:

* Continue developing the **Student Activity Management & Engagement Analytics Platform**, focusing on data reconciliation and analytics.
* Improve Reconciliation between Registration, Attendance, and Evidence.
* Define the conditions for evaluating student participation in university activities.
* Establish and refine Participation Status categories.
* Detect missing Check-ins, missing Check-outs, missing Evidence, and absent attendance records.
* Develop ADMIN workflows for reviewing, confirming, and adjusting reconciliation results.
* Design the finalization process for confirmed participation results.
* Explore methods for aggregating and analyzing student engagement data.
* Build an Analytics Dashboard with registration, attendance, participation, and completion metrics.
* Connect the Analytics Dashboard to FastAPI REST APIs.
* Develop data visualization interfaces using charts, statistical tables, and KPI Cards.
* Test reconciliation accuracy and analytical results using synthetic datasets.

### Tasks to Be Implemented This Week:

| Day | Tasks | Start Date | Completion Date | References |
| --- | --- | --- | --- | --- |
| Monday | - Review Registration, Attendance, and Evidence datasets developed in previous weeks. <br> - Analyze the reconciliation process across these data sources. <br> - Define the conditions for recognizing student participation. <br> - Design Participation Status categories based on validation results. <br> - Analyze missing Check-in, missing Check-out, missing Evidence, and no-attendance scenarios. <br> - Distinguish automatically evaluated records from those requiring ADMIN review. <br> - Prepare synthetic reconciliation test data. | 19/10/2026 | 19/10/2026 | Project Proposal, Business Rules, and Reconciliation Service documentation |
| Tuesday | - Develop and improve the Python/FastAPI Reconciliation Service. <br> - Aggregate Registration, Attendance, and Evidence using Activity ID and Student ID. <br> - Handle missing or inconsistent records. <br> - Develop an activity-specific Reconciliation API. <br> - Build an endpoint for retrieving reconciliation results. <br> - Investigate how Participation Status changes when source data is updated. <br> - Test complete, incomplete, and review-required participation scenarios. | 20/10/2026 | 20/10/2026 | https://fastapi.tiangolo.com/ <br> Project Business Rules |
| Wednesday | - Develop the React Reconciliation interface. <br> - Display student lists and Registration, Check-in, Check-out, and Evidence statuses. <br> - Distinguish complete records from those requiring administrative review. <br> - Build participation decision and adjustment operations by Student ID. <br> - Explore finalization and result locking after reconciliation. <br> - Connect the interface to Decision and Finalize APIs. <br> - Review access control and error handling during result confirmation. | 21/10/2026 | 21/10/2026 | https://react.dev/ <br> Reconciliation API documentation |
| Thursday | - Research student participation analytics metrics. <br> - Define activity counts, registration counts, Check-in/Check-out totals, and completion counts. <br> - Design participation, absence, and completion rate calculations. <br> - Develop Analytics aggregation logic using Python. <br> - Design an API that provides aggregated data to the Frontend. <br> - Define response structures for charts and statistical tables. <br> - Handle empty or incomplete datasets. | 22/10/2026 | 22/10/2026 | Project Analytics documentation <br> https://fastapi.tiangolo.com/ |
| Friday | - Develop the React Analytics Dashboard. <br> - Connect the Frontend to the `/analytics` API. <br> - Design KPI Cards and statistical charts. <br> - Display activity counts, registration totals, and participation metrics. <br> - Handle Loading, Error, and Empty Data states. <br> - Verify consistency between Dashboard metrics and Backend results. <br> - Test the Registration → Attendance → Evidence → Reconciliation → Analytics workflow. <br> - Summarize results and document remaining improvements. | 23/10/2026 | 23/10/2026 | https://react.dev/ <br> Project Analytics documentation and Test Data |

### Week 7 Achievements:

* **Improved multi-source Reconciliation:**
  * Developed the reconciliation workflow using Registration, Attendance, and Evidence.
  * Linked records using Activity IDs and Student IDs.
  * Defined conditions for evaluating participation.
  * Identified missing, duplicate, and inconsistent records.
  * Distinguished records suitable for confirmation from those requiring manual review.
  * Prepared information for managing Participation Status.

* **Developed the FastAPI Reconciliation Service:**
  * Aggregated registered student records.
  * Verified Check-in/Check-out information by student.
  * Combined Evidence with Attendance to evaluate participation requirements.
  * Established rules for identifying missing information.
  * Produced reconciliation results by Activity ID.
  * Investigated how to refresh results when source records change.
  * Defined checks required before finalizing participation lists.

* **Established Participation Status categories:**
  * **READY:** Records meet the conditions for participation consideration.
  * **NEEDS_REVIEW:** Incomplete or inconsistent records require ADMIN verification.
  * **MISSING_CHECK_IN:** Check-in information is missing.
  * **MISSING_CHECK_OUT:** Check-out information is missing.
  * **MISSING_EVIDENCE:** Participation evidence is missing.
  * **NO_ATTENDANCE:** A student registered but has no attendance records.
  * **FINALIZED:** Participation results have been finalized through the confirmation workflow.

  Status indicators and review reasons help administrators understand why particular records need attention.

* **Developed Reconciliation API endpoints:**
  * `POST /activities/{activity_id}/reconcile` — run reconciliation.
  * `GET /activities/{activity_id}/reconciliation` — retrieve reconciliation results.
  * `POST /activities/{activity_id}/participants/{mssv}/decision` — confirm or adjust a participation decision.
  * `POST /activities/{activity_id}/finalize` — finalize activity participation results.

  These APIs support the workflow from imported data to confirmed participation outcomes.

* **Developed the React Reconciliation interface:**
  * Displayed activity-specific student lists.
  * Presented Registration and Attendance status information.
  * Included related Evidence information.
  * Distinguished complete records from records requiring review.
  * Designed ADMIN participation confirmation operations.
  * Connected Decision and Finalize actions to the Backend.
  * Implemented processing and error feedback for API interactions.

* **Designed the participation finalization workflow:**
  * ADMIN runs reconciliation after Registration, Attendance, and Evidence are available.
  * Incomplete or inconsistent records are reviewed.
  * ADMIN confirms decisions for cases requiring verification.
  * The application aggregates the approved results.
  * Final participation lists are locked through the Finalize operation.
  * Confirmed data becomes available for reporting and analysis.

* **Researched student engagement metrics:**
  * Total number of activities.
  * Total registration count.
  * Total students with Check-in records.
  * Total students with Check-out records.
  * Total students meeting participation requirements.
  * Number of absent students or incomplete records.
  * Participation rate.
  * Completion rate.
  * Absence rate.

  These indicators support activity monitoring and evaluation of student engagement.

* **Developed Python-based Analytics logic:**
  * Aggregated records across activities.
  * Analyzed registration and participation totals.
  * Calculated statistical rates.
  * Handled empty datasets.
  * Structured analytical responses for the Frontend.
  * Distinguished registrations from verified attendance.
  * Prepared data for charts and statistical tables.

* **Developed the Analytics API:**
  * Used the `/analytics` Router.
  * Developed the `get_analytics_summary` function.
  * Implemented the `build_activity_analytics` logic.
  * Explored percentage calculation utilities.
  * Provided aggregated data for Frontend Dashboard rendering.

* **Developed the Analytics Dashboard:**
  * Designed the Dashboard using React.
  * Implemented KPI Cards.
  * Created statistical charts and tables.
  * Connected the interface to `getAnalyticsSummary()`.
  * Displayed metrics returned by the Backend.
  * Handled data loading and API error states.
  * Investigated data refresh behavior after business operations.

* **Distinguished the analytical data sources:**
  * Registration represents the number of students registered for an activity.
  * Attendance represents Check-in and Check-out events.
  * Evidence contributes to participation verification.
  * Reconciliation produces evaluated participation results.
  * Finalized Results support confirmed reporting and analysis.

  Distinguishing these datasets helps avoid confusing registration totals with actual participation.

* **Tested synthetic business scenarios:**
  * Students with complete Registration, Check-in, Check-out, and Evidence.
  * Missing Check-in.
  * Missing Check-out.
  * Missing Evidence.
  * Registered students without attendance.
  * Records requiring ADMIN review.
  * Activities without registrations.
  * Activities awaiting reconciliation.
  * Dashboards with empty or incomplete datasets.

* **Clarified the Analytics implementation scope:**
  * Python/FastAPI handled the statistical calculations.
  * React provided the Dashboard interface.
  * The local application continued to manage its own business data.
  * Amazon DynamoDB was used in selected AWS Pilot workflows.
  * AWS Glue, Amazon Athena, and Amazon QuickSight were not deployed for the Analytics Dashboard.
  * AWS Lambda was not the main Backend for Reconciliation or Analytics.

### Challenges and Lessons Learned:

* **Multi-source reconciliation:** Registration, Attendance, and Evidence may contain different states, making clear business rules essential for accurate participation evaluation.
* **Missing data:** Not all incomplete records can be automatically resolved; some require ADMIN verification.
* **Participation Status management:** It is important to distinguish records being reviewed from finalized results.
* **Analytics calculations:** Statistical rates require appropriate denominators and protection against division by zero.
* **Dashboard consistency:** Dashboard values should come from Backend results rather than hardcoded Frontend values.
* **Synthetic testing:** Diverse test scenarios help validate reconciliation logic.
* **Appropriate architecture:** Python/FastAPI and React allow the project to reuse existing functionality without immediately deploying additional paid analytics services.

### Plan for Next Week:

* Continue integration testing across application modules.
* Verify Authentication and Authorization for ADMIN and STUDENT.
* Test Activity Management, Import, Attendance, Reconciliation, Analytics, and Export workflows.
* Review UI and data processing issues.
* Test API error responses and invalid session handling.
* Improve error handling and user experience.
* Prepare for AWS Amplify Frontend deployment and HTTPS environment testing.