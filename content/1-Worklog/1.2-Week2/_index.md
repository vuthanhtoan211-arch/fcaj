---
title: "Worklog Week 2"
date: 2026-09-14
weight: 2
chapter: false
pre: "<b>1.2.</b>"
---


### Week 2 Objectives:

* Define the internship project topic and implementation scope.
* Analyze the student activity participation management problem.
* Identify the system's input data sources and data processing workflow.
* Define business rules for registration, Check-in, Check-out, and participation evidence.
* Design the overall AWS architecture for the system.
* Identify suitable AWS services for each system component.
* Design the initial data model and prepare synthetic data for development and testing.
* Prepare a local development environment before deploying AWS resources.


### Tasks to be completed this week:

| Day | Tasks | Start Date | Completion Date | Reference |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Research and define the project **Student Activity Management and Engagement Analytics Platform** <br> - Analyze the practical problems of managing student activity participation data <br> - Define the project's objectives, scope, and main functions <br> - Identify the main system users, including Youth Union Staff/Organizers and Admins | 14/09/2026 | 14/09/2026 | <https://cloudjourney.awsstudygroup.com/> |
| 3 | - Analyze the system's input data sources <br>&emsp; + Student registration data from the University Portal <br>&emsp; + Realtime Check-in/Check-out events from Student Card QR scanning <br>&emsp; + Participation evidence and feedback from Google Forms/Google Sheets <br> - Define the data flow from external systems into the application <br> - Identify data validation and reconciliation requirements | 15/09/2026 | 15/09/2026 | <https://cloudjourney.awsstudygroup.com/> |
| 4 | - Define the system's main business rules <br>&emsp; + Only registered students are allowed to Check-in/Check-out <br>&emsp; + Check-in and Check-out must be recorded in real time <br>&emsp; + Registered students without both Check-in and Check-out are identified as not participating <br>&emsp; + Participation evidence is used during reconciliation <br> - Define participation statuses and cases requiring manual review | 16/09/2026 | 16/09/2026 | Project Proposal |
| 5 | - Design the overall AWS system architecture <br> - Study and define the roles of the following services: <br>&emsp; + AWS Amplify – Web Application <br>&emsp; + Amazon Cognito – Authentication <br>&emsp; + Amazon API Gateway – REST API <br>&emsp; + AWS Lambda – Business Logic <br>&emsp; + Amazon DynamoDB – Operational Database <br>&emsp; + Amazon S3 – File Storage <br>&emsp; + AWS IAM – Access Control <br>&emsp; + Amazon CloudWatch – Monitoring & Logging <br> - Complete the architecture diagram and system data flow | 17/09/2026 | 17/09/2026 | <https://docs.aws.amazon.com/> |
| 6 | - Design the initial data model for the system <br>&emsp; + Activities <br>&emsp; + Students <br>&emsp; + Registrations <br>&emsp; + Attendance <br>&emsp; + Participation Status <br>&emsp; + Users <br> - Define the data structure for realtime Check-in/Check-out events <br> - Prepare synthetic datasets for registration, attendance, evidence, and reconciliation testing <br> - Prepare the source code structure and local development environment before AWS deployment | 18/09/2026 | 18/09/2026 | Project Proposal and system design documents |


### Expected Outcomes for Week 2:

* Defined the internship project:

  **Student Activity Management and Engagement Analytics Platform**

  The system is designed to manage, reconcile, and analyze student participation data for university activities.

* Defined the MVP scope and the main system users:

  * Youth Union Staff / Organizers.
  * Admin / Management users.

* Identified the main data sources:

  * University Portal – activity registration data.
  * QR Scanner – realtime Check-in/Check-out events.
  * Google Forms / Google Sheets – participation evidence and feedback.

* Defined the main business rules:

  * Students must register for an activity before they can Check-in or Check-out.
  * Students who are not registered are rejected when their QR code is scanned.
  * Check-in and Check-out events must be recorded in real time.
  * Registered students without Check-in and Check-out are classified as registered but not participating.
  * Participation evidence is combined with attendance information during reconciliation.
  * Organizers review and confirm the final participation results after reconciliation.

* Defined the overall data processing workflow:

  * Registration data is imported into the system.
  * Organizers scan the QR code on each student's card to record realtime Check-in/Check-out events.
  * Participation evidence is imported into the system.
  * The system reconciles data from the different sources.
  * Organizers review and confirm the results.
  * Final participation results can be exported to Excel/CSV for reporting purposes.

* Completed the initial AWS architecture design using:

  * AWS Amplify
  * Amazon Cognito
  * Amazon API Gateway
  * AWS Lambda
  * Amazon DynamoDB
  * Amazon S3
  * AWS IAM
  * Amazon CloudWatch

* Gained an initial understanding of AWS analytics services that may be used in later phases:

  * AWS Glue
  * Amazon Athena
  * Amazon QuickSight

* Designed the initial data model for:

  * Activities
  * Students
  * Registrations
  * Attendance
  * Participation Status
  * Users

* Prepared synthetic data for testing scenarios such as:

  * Fully registered and attended students.
  * Missing Check-in.
  * Missing Check-out.
  * Missing participation evidence.
  * Registered but absent students.
  * Duplicate or invalid input data.

* Prepared the project structure and local development environment for implementing APIs, data processing, and reconciliation logic in the following week.

* Actual AWS resource deployment is planned for later phases to minimize unnecessary AWS costs during the early development stage.