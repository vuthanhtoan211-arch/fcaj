---
title: "Proposal"
date: 2026-09-11
weight: 2
chapter: false
pre: "<b>2.</b>"
---

This proposal describes the **Student Activity Management & Engagement Analytics Platform**, a student activity management, reconciliation, and reporting project developed during First Cloud AI Journey (FCAJ). It distinguishes the implemented application and experimental AWS components from future extensions.

# Student Activity Management & Engagement Analytics Platform

## A Platform for Student Activity Management, Participation Reconciliation, and Engagement Analytics

### 1. Executive Summary

The platform is designed to help event organizers manage activities, record attendance, reconcile participation data, and analyze student engagement in university activities.

The project is relevant to workshops, seminars, academic competitions, extracurricular programs, and large annual events such as IT Day. A typical activity may involve around 100–200 students; larger events can exceed 1,000 participants. These figures describe potential business needs, **not verified load-testing results**.

Student registration, attendance, and participation evidence often originate from separate systems. Registration lists come from a University Portal, check-in/check-out is associated with student-card QR codes or IDs, and supporting evidence can come from Google Forms or Sheets. Consolidating such records by hand is slow and error-prone.

The implemented MVP includes:

- **React/Vite** for the frontend.
- **Python/FastAPI** for authentication, REST APIs, and business rules.
- **SQLite** for local demo persistence and recovery.
- **AWS Amplify Hosting** for the frontend deployment.
- **Cloudflare Quick Tunnel** connecting a hosted frontend with a locally running FastAPI backend during demonstration.
- **Amazon DynamoDB** as a tested AWS cloud-data integration, without claiming a complete migration away from SQLite.
- An independent **Amazon S3 + AWS Lambda CSV Processing Demo**, with AWS IAM permissions and CloudWatch logging.

The application has two business roles: `ADMIN` and `STUDENT`. The goal is to improve data consistency, reduce repetitive Excel work, and enable organizers to review participation and analytics in one place.

### 2. Problem Statement

#### 2.1. Existing Process

1. Organizers publish an activity.
2. Students register through the University Portal.
3. Organizers export registration lists to CSV or Excel.
4. Student-card QR codes or student IDs are used for attendance.
5. Students submit participation evidence using Google Forms where applicable.
6. Organizers check students out and reconcile the available records.
7. The final participant list is submitted through the university's existing administrative process.

Fragmented files can contain invalid or duplicate student IDs, missing check-in/check-out records, and incomplete evidence. Manual verification becomes increasingly difficult as participation grows.

#### 2.2. Proposed Solution

The project consolidates the relevant workflows in a Web Application. It does **not** claim direct API integration with the University Portal or Google Sheets.

| Source | Collection method in the current MVP |
| --- | --- |
| University Portal | ADMIN exports and imports CSV/XLSX registration lists. |
| Student Card QR / Student ID | ADMIN records Check-in/Check-out immediately through FastAPI, using ID entry or a scanner acting as keyboard input. |
| Google Forms / Google Sheets | ADMIN exports and imports evidence files in CSV/XLSX format. |

The backend validates required fields, student IDs, and duplicates. Registration, Attendance, and Evidence are associated with the corresponding Activity ID to support reconciliation.

**Important:** Check-in and Check-out are designed to be written when a student arrives or leaves; they are not primarily recorded by importing attendance spreadsheets after the event. Complete camera-based QR scanning on physical devices still requires further verification.

#### 2.3. Objectives

- Centralize student activity and participation data.
- Reduce manual CSV/Excel reconciliation.
- Support real-time Check-in and Check-out.
- Validate imported registration and evidence data.
- Reconcile records using Activity ID and Student ID.
- Let ADMIN review and confirm participation outcomes.
- Provide an Analytics Dashboard and report export.
- Build practical experience with Web APIs, data processing, security, and AWS.
- Test business data integration with DynamoDB and independent CSV processing with S3/Lambda.

#### 2.4. Project Scope

**Implemented or tested within the MVP:** Authentication, ADMIN/STUDENT authorization, activity and student-account management, personal profile, registration/evidence import, attendance APIs, reconciliation, participation confirmation, analytics/export, AWS Amplify frontend deployment, FastAPI demo through Cloudflare Tunnel, SQLite persistence, DynamoDB experiments, and the S3/Lambda/IAM/CloudWatch CSV test.

**Outside the current scope or not fully verified:** Direct University Portal/Google Sheets API integrations, a verified camera QR scanner on real devices, automatic university conduct-point credits, an always-on AWS-hosted FastAPI production backend, migration of every API to DynamoDB, automated S3-to-Lambda event triggering, Cognito, API Gateway, Glue, Athena, QuickSight, and production-scale load testing.

#### 2.5. Target Users

| Role | Access and responsibilities |
| --- | --- |
| ADMIN | Manage activities and student accounts; import data; record attendance; reconcile and confirm participation; view analytics and export results. |
| STUDENT | Sign in, view authorized personal information and activities, change password, and track personal participation results. |

Event organizers operate under `ADMIN`. `STAFF` is not a separate business role in the current application.

### 3. Solution Architecture

#### 3.1. Actual Architecture Overview

This **actual project architecture diagram** shows the main application, the tested DynamoDB storage integration, and the independently executed serverless CSV processing experiment. It does not claim that the backend is deployed on AWS or that an S3 event trigger has been configured.

![Actual Student Activity Management and Engagement Analytics Platform architecture](/fcaj/images/2-Proposal/student_activity_architectur.drawio.png)

**Web Application and local demo:** Users access React/Vite through AWS Amplify Hosting. Their browsers send API requests through Cloudflare Quick Tunnel to a locally running FastAPI backend, with an access token on protected endpoints. The backend handles business logic and SQLite local persistence.

**AWS cloud-data experiment:** FastAPI has been integrated or tested with DynamoDB through boto3 for Activities, Registrations, Attendance, Evidence, and Participation. Successful table or item tests do not mean all application storage was migrated from SQLite.

**Independent serverless experiment:** Amazon S3 stores CSV input, AWS Lambda validates records and writes JSON output, AWS IAM authorizes resource access, and CloudWatch provides execution logs and metrics. The Lambda function was invoked manually through a Test Event.

#### 3.2. Application Connectivity

AWS Amplify serves the web interface; it is not the application's API Gateway or backend proxy. The user browser makes the actual FastAPI requests through Cloudflare Quick Tunnel. SQLite remains part of the local demo, while DynamoDB integration is treated as a separate tested capability.

For evidence, refer to the actual architecture diagram above and the frontend/backend screenshots in Workshop 5.3–5.9.

#### 3.3. Technology Stack

| Component | Technology | Responsibility |
| --- | --- | --- |
| Frontend | React/Vite | ADMIN/STUDENT interface and analytics. |
| Backend | Python/FastAPI | REST APIs, authentication, authorization, and business logic. |
| Local persistence | SQLite | Demo persistence and recovery. |
| Tested cloud database | Amazon DynamoDB | Cloud-data integration tests. |
| Frontend hosting | AWS Amplify | Frontend build and hosting. |
| Network connectivity | Cloudflare Quick Tunnel | Temporary HTTPS access to local FastAPI. |
| Object storage | Amazon S3 | Sample CSV input and processed JSON output. |
| Serverless processing | AWS Lambda | Independent CSV processing demonstration. |
| Resource permissions | AWS IAM | Execution role and service permissions. |
| Monitoring | Amazon CloudWatch | Lambda logs and metrics. |
| Version control | Git/GitHub | Project source and change history. |
| Documentation | Hugo/Markdown | Internship workshop and report. |

#### 3.4. Data Design

| Group | Main information |
| --- | --- |
| Users / Students | Account, student ID, profile, role, status. |
| Activities | Activity ID, name, schedule, location, status. |
| Registrations | Registration by student and activity. |
| Attendance | Check-in, check-out, timestamps. |
| Evidence | Participation evidence by student and activity. |
| Participation | Reconciliation result and confirmation status. |

Reconciliation uses Student ID together with Activity ID to avoid mixing records from different events.

#### 3.5. Implemented Business Features – Screenshots

Instead of a hypothetical flowchart, the following screenshots demonstrate **real interfaces and results implemented in the project**.

![Actual activities list interface](/fcaj/images/5-Workshop/5.6-Registration-Attendance/activities-list.png)

![Actual Check-in interface](/fcaj/images/5-Workshop/5.6-Registration-Attendance/check-in.png)

![Actual evidence reconciliation result](/fcaj/images/5-Workshop/5.7-Evidence-Reconciliation/reconciliation-result.png)

![Actual analytics dashboard](/fcaj/images/5-Workshop/5.8-Analytics-Export/analytics-dashboard.png)

#### 3.6. Security and Monitoring

FastAPI uses token-based authentication and ADMIN/STUDENT authorization for application access. AWS IAM controls AWS resource permissions and does not replace application sign-in. The project emphasizes validation, least-privilege AWS permissions, secret protection, and synthetic or anonymized demo data.

CloudWatch logging applies to the independent Lambda demo. No API Gateway logging, CloudWatch alarm configuration, or FastAPI log integration is claimed without implementation evidence. The demo log retention setting was seven days.

### 4. Technical Implementation

#### 4.1. Main Features

| Feature | Implemented responsibility |
| --- | --- |
| Authentication | Sign-in/out, token validation, password changes. |
| Authorization | ADMIN/STUDENT role restrictions in frontend and backend. |
| Activity management | Activity creation, display, updates, and status. |
| Student-account administration | ADMIN list, lock/unlock, reset passwords, synchronize accounts. |
| Personal profile | Authorized profile view and updates. |
| Registration import | CSV/XLSX validation and import. |
| Attendance | Real-time check-in and check-out with duplicate/time checks. |
| Evidence import | Import and validate participation evidence. |
| Reconciliation | Associate registration, attendance, and evidence. |
| Participation confirmation | ADMIN review and decision. |
| Analytics | Summary indicators and activity statistics. |
| Export | Supported report and data export formats. |

Students cannot access administrative account management, data imports, or participation confirmation. Business time logic uses `Asia/Ho_Chi_Minh`.

#### 4.2. Reconciliation Rules

| Registration | Check-in | Check-out | Evidence | Example result |
| --- | --- | --- | --- | --- |
| Yes | Yes | Yes | Yes | Complete data. |
| Yes | Yes | No | Yes | Missing Check-out. |
| Yes | No | Yes | Yes | Missing Check-in. |
| Yes | No | No | No | Registered without participation records. |
| Yes | Yes | Yes | No | Missing evidence. |
| Yes | No | No | Yes | Evidence present, attendance missing. |
| No | Yes | Yes | Yes | Registration needs review. |

Missing information does not automatically prove non-participation. ADMIN applies activity-specific business rules when confirming or rejecting records.

#### 4.3. Actual Serverless CSV Processing Test

The real experiment was performed on Amazon S3 and AWS Lambda using an IAM execution role and CloudWatch logs. The Lambda console test returned the following recorded results:

| Test metric | Observed result |
| --- | ---: |
| Total records | 4 |
| Valid records | 2 |
| Duplicate records | 1 |
| Invalid records | 1 |
| Response status code | 200 |
| Output object | `registrations-result.json` |

![Actual Lambda processing test](/fcaj/images/5-Workshop/5.10-Serverless-Processing/lambda-test-success.png)

![Actual JSON output stored in Amazon S3](/fcaj/images/5-Workshop/5.10-Serverless-Processing/s3-processed-result.png)

This experiment is separate from the web application's CSV/XLSX import implementation. S3 Event Notifications were not configured as an automatic trigger during the recorded test.

#### 4.4. Non-functional Requirements

- **Usability:** Clear role-based user interface and understandable errors.
- **Security:** Backend permission checks, protected credentials, appropriate personal-data handling.
- **Reliability:** Validation, duplicate checks, and relevant backup practices.
- **Maintainability:** Separate modules and repositories, documentation, version control.
- **Performance:** Adequate for demos; production-scale load testing remains necessary.

#### 4.5. Test Strategy

Test cases cover valid and invalid sign-in, locked accounts, unauthorized ADMIN API access, malformed CSV/XLSX files, duplicate student IDs, invalid check-in/check-out records, missing evidence, reconciliation, confirmation, analytics, and export. AWS-related checks include DynamoDB read/write tests and Lambda processing with S3 and CloudWatch. A proper Test Report should distinguish expected from observed results.

### 5. Roadmap and Implementation Milestones

The twelve-week internship plan runs from **September 7 to November 27, 2026**. Future milestones should not be described as completed before evidence exists.

| Week | Main activity |
| --- | --- |
| 1 | Cloud Computing, AWS Fundamentals, AWS CLI, Amazon EC2. |
| 2 | Requirements and architecture proposal. |
| 3 | FastAPI, SQLite, and core REST APIs. |
| 4 | DynamoDB/S3 research and cloud-data experiments. |
| 5 | React/Vite, authentication, role-based controls. |
| 6 | Registration and evidence CSV/XLSX import. |
| 7 | Reconciliation and analytics. |
| 8 | Integration tests and improvements. |
| 9 | Amplify hosting, FastAPI demo, Cloudflare Tunnel. |
| 10 | S3, Lambda, IAM, CloudWatch experiments. |
| 11 | Demo preparation and technical documentation. |
| 12 | Report finalization, website review, archiving and handover preparation. |

**Future enhancements:** Stable cloud backend deployment, production data architecture, QR scanner verification, direct university-system APIs, S3/Lambda event-driven automation, advanced analytics, monitoring, CI/CD, and load/security testing.

### 6. Budget Estimation

| AWS Service | Cost drivers |
| --- | --- |
| Amplify | Build, hosting, storage, transfer. |
| DynamoDB | Storage and database requests/capacity. |
| S3 | Object storage, requests, transfer. |
| Lambda | Invocations, memory, duration. |
| CloudWatch | Log ingestion/storage and metrics. |
| IAM | No direct charges for roles or policies. |

The MVP minimizes cost through local demo hosting, limited test data, and cleanup of unnecessary resources. Actual charges depend on the region, workload and account terms; the project does **not** assume zero AWS expenditure. Use [AWS Pricing Calculator](https://calculator.aws/) and Billing data for estimates.

### 7. Risk Assessment

| Risk | Potential impact | Mitigation |
| --- | --- | --- |
| Invalid files / duplicate IDs | Medium–High | Input validation and duplicate detection. |
| Missing attendance or evidence | High | Reconciliation and manual ADMIN review. |
| Unauthorized access | High | Token validation and backend role checks. |
| Local FastAPI outage | High | Pre-demo verification and local restart plan. |
| Temporary Cloudflare URL changes | High | Update frontend API URL and retest. |
| SQLite and DynamoDB mismatch | High | Identify source of truth and synchronization boundaries. |
| Lambda/IAM failure | Medium–High | Verify role permissions, S3 objects and logs. |
| Personal-data/secret exposure | High | Synthetic data, anonymization, least privilege. |
| Unexpected AWS costs | Medium | Billing review and resource cleanup. |
| Production scaling limits | High | Load testing before operational deployment. |

When necessary, organizers can correct and re-import files or use the existing spreadsheet procedure. Backup assumptions should reflect the persistence mechanism actually in use.

### 8. Expected Outcomes

#### 8.1. Improved Operations

The system is intended to reduce repetitive manual comparison of student IDs and provide a centralized view of Registration, Attendance, Evidence, Reconciliation, and Participation. STUDENT can access only their authorized records.

#### 8.2. Analytics and Export

The dashboard supports indicators for activities, registrations, attendance, confirmed participation, rates and missing data. As an **illustrative example only**, 1,050 confirmations out of 1,200 registrations would yield 87.5%; these are not actual event measurements.

#### 8.3. AWS Outcomes

Actual evidence documents AWS Amplify hosting, DynamoDB tests, S3 input/output, Lambda CSV processing, IAM permissions and CloudWatch monitoring. Undeployed technologies are not presented as completed services.

#### 8.4. Deliverables

- Frontend/Backend source code and GitHub repository.
- Web Application demo with synthetic data.
- Architecture diagram, proposal and documentation.
- API guide, test report, and demo materials.
- AWS screenshots, worklog and Hugo workshop website.

#### 8.5. Limitations and Future Work

FastAPI currently depends on a local computer and the temporary Cloudflare Tunnel. SQLite remains part of the demo; not every data-access API has been verified as fully migrated to DynamoDB. Lambda processing is a separate experiment. Full camera QR scanning, direct university API integration, production backend hosting, and large-scale performance testing remain future work.

**Note:** This proposal reflects documented implementation and experimental evidence. Any incomplete final internship milestones must be checked before being reported as finished.
