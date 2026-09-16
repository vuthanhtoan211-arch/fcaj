---
title: "Worklog Week 3"
date: 2026-09-21
weight: 3
chapter: false
pre: "<b>1.3.</b>"
---


### Week 3 Objectives:

* Begin implementing the core functions of the system in the local development environment.
* Establish the initial project source code structure.
* Implement student registration data validation and normalization.
* Implement participation evidence processing.
* Develop a realtime API for QR-based Check-in and Check-out.
* Implement reconciliation rules between Registration, Attendance, and Evidence data.
* Test valid, invalid, duplicate, and missing-data scenarios.
* Prepare the application for mapping to AWS services in later deployment phases.


### Tasks to be completed this week:

| Day | Tasks | Start Date | Completion Date | Reference |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Initialize the source code structure for the **Student Activity Management and Engagement Analytics Platform** <br> - Organize modules for APIs, data processing, and business logic <br> - Configure the local development environment <br> - Review the synthetic test dataset prepared during the previous week <br> - Define common API request and response structures | 21/09/2026 | 21/09/2026 | Project Proposal and system design documents |
| 3 | - Implement student registration data processing <br>&emsp; + Read CSV/Excel input files <br>&emsp; + Validate required fields <br>&emsp; + Normalize student IDs (MSSV) <br>&emsp; + Detect and remove duplicate records <br>&emsp; + Detect invalid student IDs and invalid records <br> - Implement participation evidence processing from Google Forms/Google Sheets <br> - Generate validation results for invalid records | 22/09/2026 | 22/09/2026 | Project Proposal and synthetic test dataset |
| 4 | - Develop the realtime Check-in/Check-out API <br>&emsp; + Receive data from Student Card QR scanning <br>&emsp; + Identify the student and activity <br>&emsp; + Verify that the student is registered for the activity <br>&emsp; + Record CHECK_IN or CHECK_OUT events <br>&emsp; + Record event timestamps <br>&emsp; + Prevent invalid duplicate attendance events <br> - Simulate QR scanning using test data in the local environment | 23/09/2026 | 23/09/2026 | <https://docs.aws.amazon.com/apigateway/> |
| 5 | - Implement participation reconciliation logic <br> - Combine Registration, Check-in, Check-out, and Evidence data <br> - Identify reconciliation scenarios: <br>&emsp; + Complete data and ready for confirmation <br>&emsp; + Missing Check-in <br>&emsp; + Missing Check-out <br>&emsp; + Missing evidence <br>&emsp; + No attendance records <br>&emsp; + Multiple validation issues <br> - Assign an appropriate Participation Status to each student | 24/09/2026 | 24/09/2026 | Project Proposal and project business rules |
| 6 | - Perform end-to-end testing in the local environment <br>&emsp; + Registration import <br>&emsp; + Evidence import <br>&emsp; + Realtime Check-in <br>&emsp; + Realtime Check-out <br>&emsp; + Reconciliation <br> - Test invalid and incomplete data scenarios <br> - Verify API responses and error handling <br> - Complete initial API and processing-flow documentation <br> - Prepare the mapping from local modules to API Gateway, Lambda, DynamoDB, and S3 | 25/09/2026 | 25/09/2026 | <https://docs.aws.amazon.com/> |


### Expected Outcomes for Week 3:

* Established the initial source code structure for the **Student Activity Management and Engagement Analytics Platform**.

* Implemented a student registration processing module capable of:

  * Reading CSV/Excel input files.
  * Validating input data.
  * Normalizing student IDs.
  * Detecting duplicate records.
  * Detecting invalid records.
  * Returning validation results.

* Implemented the initial participation evidence processing module.

* Developed a realtime Check-in/Check-out API with the following workflow:

  * An organizer scans the QR Code on a student's card.
  * The system receives the Student ID and Activity ID.
  * The system checks whether the student is registered for the activity.
  * If valid, the system records a CHECK_IN or CHECK_OUT event.
  * The attendance timestamp is recorded when the request is received.
  * Invalid or unregistered students receive an appropriate error response.

* Ensured that Check-in and Check-out are implemented as **realtime API events** rather than attendance data imported later from Excel/CSV files.

* Implemented reconciliation logic between:

  * Registration
  * Check-in
  * Check-out
  * Evidence

* Defined major reconciliation statuses, including:

  * `READY`
  * `NEEDS_REVIEW: MISSING_CHECK_IN`
  * `NEEDS_REVIEW: MISSING_CHECK_OUT`
  * `NEEDS_REVIEW: MISSING_EVIDENCE`
  * `NO_ATTENDANCE`
  * Combined issue cases.

* Tested scenarios including:

  * Fully registered and attended students.
  * QR scans from unregistered students.
  * Duplicate Check-in events.
  * Check-out without a valid Check-in.
  * Missing Check-in.
  * Missing Check-out.
  * Missing participation evidence.
  * Registered but absent students.
  * Invalid Student IDs.
  * Duplicate registration records.

* Completed the initial API, business logic, and data processing documentation.

* Defined the mapping between local components and the planned AWS architecture:

  * Local API → Amazon API Gateway.
  * Business Logic → AWS Lambda.
  * Operational Data → Amazon DynamoDB.
  * Registration/Evidence Files → Amazon S3.
  * Authentication → Amazon Cognito.
  * Logging and Monitoring → Amazon CloudWatch.

* Completed the core implementation and testing in the local environment before creating actual AWS resources, helping minimize unnecessary cloud costs during development.