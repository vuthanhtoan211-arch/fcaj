---
title: "Proposal"
date: 2026-09-11
weight: 2
chapter: false
pre: "<b>2.</b>"
---

This section presents the proposal for a platform to manage, reconcile, and analyze student participation in university activities. The project is developed during the internship at First Cloud AI Journey (FCAJ), combining Web Application development with AWS services within the actual implementation scope.

# Student Activity Management & Engagement Analytics Platform

## A Platform for Student Activity Management, Participation Reconciliation, and Engagement Analytics

### 1. Executive Summary

The Student Activity Management & Engagement Analytics Platform is designed to help event organizers manage activity information, track attendance, reconcile participation data, and analyze student engagement in university activities.

The system targets workshops, seminars, political education sessions, academic competitions, extracurricular activities, and annual programs such as IT Day or TechConnect. A typical activity may involve approximately 100–200 students, while larger programs may have more than 1,000 participants. These figures describe the business context of the project and are not verified load-testing results.

Currently, activity data is generated through multiple tools. Students register through the University Portal, organizers record attendance using QR codes on student identification cards, and participation evidence is collected through Google Forms or Google Sheets. After an activity, organizers must consolidate Excel/CSV files, verify student IDs, and manually reconcile records to determine the final list of eligible participants.

The project proposes a centralized platform that supports activity management, registration data import, real-time Check-in/Check-out, evidence import, reconciliation, participation confirmation, analytics, and report export.

The MVP uses **React/Vite** for the Frontend, **Python/FastAPI** for the Backend, and **SQLite** for state persistence and recovery in the Demo environment. **Amazon DynamoDB** has been integrated and tested for business data storage on AWS. The two main user roles are `ADMIN` and `STUDENT`.

The Frontend is deployed using AWS Amplify Hosting. The Demo FastAPI Backend runs on a local computer and is accessible through Cloudflare Quick Tunnel. In addition to the main application, the project includes a Serverless CSV Processing Demo using Amazon S3, AWS Lambda, AWS IAM, and Amazon CloudWatch.

The six AWS services used within the project's implementation and experimental scope are:

* AWS Amplify.
* Amazon DynamoDB.
* Amazon S3.
* AWS Lambda.
* AWS IAM.
* Amazon CloudWatch.

The primary objectives are to reduce manual Excel processing, improve data consistency, support participation confirmation, and provide analytical insights for student activity management. The architecture is developed incrementally and does not assume that the entire application has been migrated to an AWS Serverless Production environment.

### 2. Problem Statement

#### 2.1. Current Workflow

1. Organizers plan and announce a student activity.
2. Students register through the University Portal.
3. Organizers export the registration list in Excel/CSV format.
4. At the venue, organizers scan student-card QR codes or record student IDs for Check-in.
5. Students provide participation evidence or feedback through Google Forms.
6. Organizers perform Check-out when required by the activity.
7. After the activity, organizers consolidate, filter, and reconcile the collected data.
8. The final participation list is submitted to the responsible organization according to the existing administrative process.

The main challenges include fragmented data, invalid or duplicate student IDs, registered students without attendance records, missing Check-in/Check-out, missing evidence, and difficulty determining participation results quickly. As the number of participants increases, Excel-based reconciliation becomes more time-consuming and error-prone.

#### 2.2. Proposed Solution

The Web Application provides a centralized management and reconciliation workflow. The University Portal and Google Forms/Google Sheets remain external data sources; the current version does not directly integrate with their APIs.

| Data Source | Data Collection Method |
| --- | --- |
| University Portal | ADMIN exports and imports registration lists in CSV/XLSX format. |
| Student Card QR / Student ID | ADMIN records real-time Check-in/Check-out through APIs using student ID input or a keyboard-input scanner workflow. |
| Google Forms / Google Sheets | ADMIN exports and imports participation evidence in CSV/XLSX format. |

The FastAPI Backend handles import requests, validates file formats, required fields, student IDs, and duplicate records. Registration, attendance, and evidence data are associated with the corresponding activity for Reconciliation.

An important distinction is that **Attendance is recorded directly at the time of Check-in/Check-out**, rather than relying on attendance files imported after the event. Full Camera QR Scanner integration still requires verification through physical-device testing.

After reconciliation, the system helps ADMIN users review complete records, missing attendance, missing evidence, and other cases requiring further investigation. Participation results are confirmed according to the activity's applicable rules and subsequently used for the Analytics Dashboard and Export.

#### 2.3. Project Objectives

* Centralize student activity and participation data.
* Reduce manual data processing and Excel-based reconciliation.
* Support real-time Check-in/Check-out recording.
* Standardize and validate Registration and Evidence data.
* Reconcile records using Activity ID and Student ID.
* Support ADMIN participation confirmation and student access to personal results.
* Develop an Analytics Dashboard and data export functionality.
* Apply Web Development, REST API, data processing, and Cloud Computing knowledge.
* Integrate and test business data storage on Amazon DynamoDB.
* Experiment with Serverless CSV processing on AWS.

#### 2.4. Project Scope

**Within the MVP scope:**

* Authentication, Authorization, and ADMIN/STUDENT account management.
* Activity management and authorized personal profile management.
* Registration Import and Evidence Import from CSV/XLSX files.
* Real-time Check-in/Check-out APIs.
* Reconciliation, Participation Confirmation, Analytics, and Export.
* Frontend Hosting with AWS Amplify and Demo Backend connectivity through Cloudflare Quick Tunnel.
* SQLite Local Persistence and Amazon DynamoDB cloud data storage integration.
* Serverless CSV Processing Demo using S3, Lambda, IAM, and CloudWatch.

**Outside the current scope or requiring further development:**

* Direct integration with the University Portal and Google Sheets APIs.
* Full verification of the Camera QR Scanner on physical devices.
* Automatic official conduct-point updates in university student accounts.
* Deployment of the Backend on stable Production Cloud infrastructure.
* Complete migration of all persistence and data retrieval workflows to DynamoDB.
* Full import pipeline automation through S3 Event Notifications and Lambda.
* Amazon Cognito, API Gateway, AWS Glue, Amazon Athena, and Amazon QuickSight.
* Large-scale Production load testing and advanced Machine Learning analytics.

#### 2.5. Target Users

| Role | Main Features |
| --- | --- |
| ADMIN | Manage activities and student accounts, import data, record attendance, reconcile records, confirm participation, view dashboards, and export reports. |
| STUDENT | Sign in, view or update authorized profile information, change passwords, browse activities, and track personal participation results. |

Event organizers use the ADMIN role. STAFF is not an independent business role in the current version.

### 3. Solution Architecture

#### 3.1. Architecture Overview

The architecture diagram below presents the components used in the project and the actual scope of AWS integration.

![Student Activity Management & Engagement Analytics Platform Architecture](/images/2-Proposal/student_activity_architectur.drawio.png)

The architecture is divided into three main areas:

**1. Web Application and Local Demo Environment**

* ADMIN/STUDENT users access the application through a Web Browser.
* AWS Amplify Hosting serves the React/Vite Frontend.
* After loading the Frontend, the browser sends REST API requests to Cloudflare Quick Tunnel, including an Access Token for protected APIs.
* Cloudflare Quick Tunnel forwards requests to the locally running FastAPI Backend.
* FastAPI handles Authentication, Authorization, activity management, account management, data import, attendance, reconciliation, confirmation, Analytics, and Export.
* SQLite supports Demo application state persistence and recovery.

**2. AWS Cloud Data Storage**

* Amazon DynamoDB has been integrated through the AWS SDK for Python (boto3).
* Activities, Registrations, Attendance, Evidence, and Participation are the business data groups included in the DynamoDB integration or storage testing scope.
* The existence of AWS tables and successful read/write tests does not establish that the entire application has removed SQLite. The diagram presents both components separately to reflect the current implementation scope.

**3. AWS Serverless CSV Processing Demo**

* Amazon S3 stores the input CSV file.
* AWS Lambda reads, validates, and processes CSV data, distinguishing valid, duplicate, and invalid records.
* The JSON processing result is written back to Amazon S3.
* AWS IAM provides Lambda execution permissions, S3 access, and the required logging permissions.
* Amazon CloudWatch monitors logs and execution metrics.

The CSV Processor is tested independently of the main application's Registration Import/Evidence Import workflow. The diagram does not claim that S3 Event Notifications have been automated or that the Lambda function writes processing results directly to DynamoDB without corresponding implementation evidence.

#### 3.2. Application Connectivity

```text
ADMIN / STUDENT
       |
       v
Web Browser (React / Vite)
       |
       +---- HTTPS / Load Web Application ----> AWS Amplify Hosting
       |
       +---- HTTPS / REST API + Access Token --> Cloudflare Quick Tunnel
                                                        |
                                                        v
                                               Python / FastAPI Backend
                                                 |               |
                                          Local Read/Write    AWS SDK (boto3)
                                                 |               |
                                                 v               v
                                               SQLite       Amazon DynamoDB
```

AWS Amplify serves the Frontend resources. The browser sends API requests to Cloudflare Tunnel; Amplify is not presented as an API Gateway or Backend Proxy.

#### 3.3. Technology Stack and AWS Services

| Component | Technology / Service | Responsibility |
| --- | --- | --- |
| Frontend | React/Vite | ADMIN/STUDENT interfaces and Analytics Dashboard. |
| Backend | Python/FastAPI | REST APIs, authentication, authorization, and business logic. |
| Local Persistence | SQLite | Demo state persistence and recovery. |
| Cloud Database | Amazon DynamoDB | AWS business data storage integration and testing. |
| Frontend Hosting | AWS Amplify | Web Application build and deployment. |
| Connectivity | Cloudflare Quick Tunnel | Temporary HTTPS endpoint for the local Backend. |
| File Storage | Amazon S3 | Input CSV and output JSON storage for the Serverless Demo. |
| Serverless Processing | AWS Lambda | Independent CSV validation and processing. |
| AWS Permissions | AWS IAM | Execution Role and resource access permissions. |
| Monitoring | Amazon CloudWatch | Lambda logs, metrics, and execution duration. |
| Version Control | Git/GitHub | Source code and development history management. |
| Documentation | Hugo/Markdown | Internship report website and project documentation. |

#### 3.4. Data Design

| Data Group | Description |
| --- | --- |
| Users / Students | Accounts, student IDs, profiles, roles, and account status. |
| Activities | Activity IDs, names, types, schedules, locations, and status. |
| Registrations | Student registration data associated with activities. |
| Attendance | Check-in/Check-out timestamps and attendance status. |
| Evidence | Participation evidence associated with students and activities. |
| Participation | Reconciliation and participation confirmation results. |

Student ID identifies the student, while Activity ID identifies the corresponding activity. Combining these identifiers supports record matching, duplicate reduction, data consistency, and historical retrieval.

#### 3.5. Business Workflow

```text
Activity Management
        |
        v
Registration Import
        |
        v
Real-time Check-in / Check-out
        |
        v
Evidence Import
        |
        v
Reconciliation
        |
        v
Participation Confirmation
        |
        v
Analytics Dashboard / Export
```

This workflow is handled by the React/Vite application and the FastAPI Backend. The current Analytics Dashboard does not use Glue, Athena, or QuickSight.

#### 3.6. Security and Monitoring

Authentication and Authorization are implemented at the FastAPI Backend. Protected API requests use Access Tokens, and the Backend enforces ADMIN/STUDENT permissions. AWS IAM manages AWS resource access and does not replace application user authentication.

Security principles include input validation, restricting access to other users' personal data, preventing credential exposure in GitHub or report screenshots, using synthetic or anonymized data, and applying Least Privilege permissions.

Amazon CloudWatch monitors the Lambda CSV Processor through Execution Logs, Invocation/Error Metrics, Execution Duration, and Log Retention. The recorded Demo configuration uses a seven-day log retention period. API Gateway Logs, CloudWatch Alarms, and FastAPI log forwarding to CloudWatch are not presented as implemented features without supporting evidence.

### 4. Technical Implementation

#### 4.1. Main Functional Requirements

| Feature | Processing Responsibility |
| --- | --- |
| Authentication | Sign in, sign out, Access Token validation, and password changes. |
| Authorization | Enforce ADMIN/STUDENT permissions in the interface and Backend. |
| Activity Management | Create, view, update, and manage activity details and status. |
| Student Account Management | ADMIN can view accounts, lock/unlock accounts, reset passwords, and synchronize student accounts. |
| Personal Profile | View and update personal information within the authorized scope. |
| Registration Import | Import CSV/XLSX files and validate structure, student IDs, missing fields, and duplicates. |
| Attendance | Record real-time Check-in/Check-out and validate activity, time, and existing records. |
| Evidence Import | Import and validate participation evidence from CSV/XLSX files. |
| Reconciliation | Match Registration, Attendance, and Evidence using Activity ID and Student ID. |
| Participation Confirmation | ADMIN reviews and confirms or rejects participation according to business rules. |
| Analytics Dashboard | Aggregate activity, registration, attendance, and participation statistics. |
| Export | Export data and lists for operational reporting in supported formats. |

STUDENT users cannot access ADMIN student account management, administrative data import, or participation confirmation features. Business timestamps use the Asia/Ho_Chi_Minh time zone.

#### 4.2. Reconciliation Rules

| Registration | Check-in | Check-out | Evidence | Example Classification |
| --- | --- | --- | --- | --- |
| Yes | Yes | Yes | Yes | Complete data. |
| Yes | Yes | No | Yes | Missing Check-out. |
| Yes | No | Yes | Yes | Missing Check-in. |
| Yes | No | No | No | Registered but no participation records. |
| Yes | Yes | Yes | No | Missing evidence. |
| Yes | No | No | Yes | Evidence available but attendance missing. |
| No | Yes | Yes | Yes | Registration requires review. |

Missing data does not automatically mean that a student did not participate. ADMIN users review the records and apply the rules of the corresponding activity. Participation outcomes include `CONFIRMED`, `REJECTED`, and records awaiting confirmation, depending on the business workflow.

#### 4.3. Serverless CSV Processing Demo

```text
Amazon S3 (Input CSV)
          |
          v
AWS Lambda (CSV Processor)
          |
          v
Amazon S3 (Output JSON)
```

Lambda uses its IAM Execution Role to read the CSV file from S3, validate required fields, detect duplicate and invalid records, and generate a JSON result. CloudWatch supports execution log and metric review. This workflow is tested using a Test Event; automatic invocation through S3 Event Notifications remains an extension requiring appropriate configuration and testing.

Recorded CSV Processor Demo test results:

| Metric | Result |
| --- | --- |
| Total Records | 4 |
| Valid Records | 2 |
| Duplicate Records | 1 |
| Invalid Records | 1 |
| Status Code in Lambda Result | 200 |
| Output File | registrations-result.json |

These results demonstrate CSV processing using Lambda and output storage on S3. They do not establish large-scale performance or a complete Serverless migration of the Web Application's import workflows.

#### 4.4. Non-functional Requirements

* **Usability:** Provide a clear interface, role-appropriate functionality, and understandable error messages.
* **Security:** Enforce authentication and Backend authorization, protect credentials and student data.
* **Reliability:** Validate data before storage, handle errors, reduce duplicates, and support appropriate backups.
* **Maintainability:** Separate Frontend and Backend, organize functional modules, manage Git/GitHub, and provide technical documentation.
* **Performance:** Support Demo requirements and future expansion; perform load testing before Production operation.

#### 4.5. Testing Strategy

Testing focuses on valid/invalid login credentials, locked accounts, STUDENT access to ADMIN APIs, missing CSV/XLSX columns, duplicate student IDs, invalid or out-of-window Check-in/Check-out, missing Evidence, reconciliation, confirmation, and exported data. The project also includes Frontend/Backend integration testing, DynamoDB connectivity testing, and Lambda CSV Processor testing with S3/CloudWatch.

The Test Report should record inputs, expected results, actual results, PASS/FAIL status, and limitations that have not been tested. Planned testing objectives must not automatically be considered completed.

### 5. Roadmap & Implementation Milestones

The project follows a 12-week internship plan from September 7, 2026, to November 27, 2026. The roadmap aligns with the Worklog; final milestones must be updated according to actual results and supporting evidence.

| Week | Activities |
| --- | --- |
| 1 | AWS Fundamentals, Cloud Computing, AWS CLI, and Amazon EC2. |
| 2 | Requirements analysis, Project Proposal, and architecture design. |
| 3 | Python/FastAPI, SQLite, and core REST API development. |
| 4 | Amazon DynamoDB and Amazon S3 research and integration within the Data Pilot. |
| 5 | React/Vite development, Authentication, Authorization, and ADMIN/STUDENT access control. |
| 6 | Registration Import, Evidence Import, CSV/XLSX processing, and Export. |
| 7 | Reconciliation, Participation Status, and Analytics Dashboard. |
| 8 | Integration testing, bug fixing, and user interface optimization. |
| 9 | AWS Amplify Hosting, FastAPI Demo, and Cloudflare Tunnel. |
| 10 | S3, Lambda, IAM, CloudWatch, and evidence consolidation for six AWS services. |
| 11 | Demo preparation, feedback collection where applicable, and technical documentation. |
| 12 | Final report, Hugo website review, project archiving, and handover preparation. |

**Future Enhancements:** Deploy FastAPI on stable Cloud infrastructure; complete Production data persistence and expand DynamoDB integration; verify the QR Scanner; integrate University Portal/Google Sheets APIs; automate file processing using S3/Lambda; add notifications, advanced Analytics, CI/CD, Monitoring, security testing, and performance testing.

### 6. Budget Estimation

The MVP is designed to keep costs appropriate for educational and Demo purposes. FastAPI currently runs locally, so the Demo does not require a continuously running AWS Backend server.

| AWS Service | Cost Factors |
| --- | --- |
| AWS Amplify | Build, Hosting, Storage, and Data Transfer. |
| Amazon DynamoDB | Storage, Read/Write Requests, or Capacity. |
| Amazon S3 | Storage, Requests, and Data Transfer. |
| AWS Lambda | Invocation, Execution Duration, and Memory. |
| Amazon CloudWatch | Log ingestion, log storage, metrics, and additional features where applicable. |
| AWS IAM | No direct charge for IAM Roles and Policies. |

Actual costs depend on AWS region, stored data volume, traffic, requests, resource configuration, and account credits or free usage allowances. The [AWS Pricing Calculator](https://calculator.aws/) can be used to prepare estimates and cross-check them with AWS Billing.

Cost control strategies include selecting appropriate resource configurations, considering DynamoDB On-Demand capacity for intermittent workloads, limiting experimental data and unnecessary Lambda executions, using appropriate CloudWatch Log Retention, monitoring Billing, and configuring AWS Budgets or alerts when necessary. Unused resources should be removed only after evidence has been archived and Demo or handover requirements are protected.

The project does not assume zero AWS costs. A fixed total budget is not provided without complete workload parameters and actual Billing information.

### 7. Risk Assessment

| Risk | Expected Impact | Mitigation |
| --- | --- | --- |
| Invalid CSV/XLSX files or invalid/duplicate student IDs | Medium–High | Validate file structures, standardize IDs, detect duplicates, and report errors. |
| Missing Check-in/Check-out or Evidence | High | Reconcile by Activity ID/Student ID and support ADMIN review of exceptions. |
| Unauthorized access | High | Validate tokens, enforce Backend permissions, and test ADMIN APIs. |
| Local FastAPI Backend becomes unavailable | High | Verify availability before demonstrations and prepare a restart/local Demo fallback. |
| Cloudflare Quick Tunnel URL changes | High | Update the API Base URL and verify connectivity before demonstrations. |
| Inconsistent local and DynamoDB data | High | Verify synchronization scope, read/write behavior, and the source of truth before Production expansion. |
| Lambda CSV Processing failure or incorrect IAM permissions | Medium–High | Review the Execution Role, S3 Input/Output, and CloudWatch Logs. |
| Student data or credential exposure | High | Use synthetic/anonymized data, protect secrets, and apply Least Privilege. |
| AWS costs exceed expectations | Medium | Monitor Billing, limit experimental resources, and configure alerts where needed. |
| Insufficient Production capacity | High | Perform load testing and improve infrastructure and data storage before operational deployment. |

If a problem occurs, ADMIN users can correct and re-import files, review exceptional cases, or use the existing Excel workflow as a fallback. The Backend can be restarted locally, and the Lambda Demo can be rerun using the input file retained on S3. Backup and synchronization procedures must reflect the actual persistence mechanism rather than assuming that all application data has a complete AWS copy.

### 8. Expected Outcomes

#### 8.1. Operational Improvement

The system aims to establish a centralized management workflow that reduces repetitive Excel operations and manual student ID searches. Organizers can manage Registration, Attendance, Evidence, Reconciliation, and Participation within a single application, while students can access their personal information within the authorized scope.

#### 8.2. Analytics and Export

The Analytics Dashboard uses business data to support indicators such as total activities, total registrations, Check-in/Check-out records, participation results, participation rate, and missing-data cases. Indicators must be calculated using consistent definitions and actual system data.

For illustration, if 1,050 of 1,200 registered participation records are confirmed, the participation rate is 87.5%. These figures are a calculation example, not measurements from an actual event.

The system supports exporting lists and management data in the formats provided by the corresponding features. Official conduct-point approval and updates in the University Portal remain part of the university's administrative process and are outside the MVP scope.

#### 8.3. AWS Implementation Outcomes

* AWS Amplify: React/Vite Frontend deployment.
* Amazon DynamoDB: business data storage integration and testing on AWS.
* Amazon S3: input CSV and output JSON storage.
* AWS Lambda: Serverless CSV processing experiment.
* AWS IAM: execution and resource access permissions.
* Amazon CloudWatch: Lambda execution logs and metrics.

Supporting evidence must accurately reflect the implementation scope. Services that have not been deployed must not be presented as completed outcomes.

#### 8.4. Expected Project Deliverables

* Frontend/Backend Source Code and GitHub Repository.
* Web Application Demo and synthetic data.
* Architecture Diagram and Project Proposal.
* README, API Documentation, and User Guide.
* Test Report, Demo Script, and AWS Configuration Notes.
* AWS Project Evidence, Worklog, and Hugo internship report website.

#### 8.5. Limitations and Future Development

The Demo Backend depends on a locally running computer and the temporary Cloudflare Quick Tunnel URL. SQLite remains part of the Demo persistence mechanism, while DynamoDB has been integrated without verified migration of every API to a Cloud Database. The Lambda CSV Processor remains an independent Demo. The Camera QR Scanner, direct University Portal/Google Sheets integration, large-scale load testing, and Production deployment require further development.

In the long term, the project can evolve into a scalable student activity management platform connected with university systems. It also provides practical experience in Data Science, Web Development, Cloud Computing, data processing, and future Cloud & Data Engineering development.

**Note:** This Proposal has been updated to reflect the current architecture diagram, development scope, and recorded test results. Uncompleted work, especially the final internship milestones, must be verified against actual evidence before being reported as completed outcomes.
