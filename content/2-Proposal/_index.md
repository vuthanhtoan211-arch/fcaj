---
title: "Proposal"
date: 2026-09-11
weight: 2
chapter: false
pre: " <b> 2. </b> "
---


This section presents the proposal for developing a cloud-based platform to manage, reconcile, and analyze student participation in Youth Union activities using AWS services.

# Cloud-Based Student & Youth Union Activity Management and Engagement Analytics Platform
## An AWS-Based Platform for Student Activity Management, Participation Reconciliation, and Engagement Analytics

### 1. Executive Summary

The Cloud-Based Student & Youth Union Activity Management and Engagement Analytics Platform is proposed to support the management of student activities such as workshops, seminars, political education sessions, competitions, recreational activities, and annual programs.

Typical activities such as workshops, seminars, and political education sessions usually involve approximately 100–200 students. Larger annual programs such as IT Day or TechConnect may involve more than 1,000 participants. On average, approximately 3–4 activities are organized per semester.

Currently, activity-related data is managed through multiple systems and tools. Activity announcements are published through the Faculty Youth Union's communication channels, students register through the university portal, organizers perform Check-in and Check-out by scanning QR codes on student identification cards, and participation evidence and event feedback are collected through Google Forms and Google Sheets.

After each activity, organizers must collect data from multiple sources, download Excel or CSV files, filter records, verify student IDs, and manually reconcile the information to determine the final list of participants.

The proposed project does not aim to replace the university portal, the existing student-card QR scanning process, or Google Forms. Instead, the system acts as a centralized data processing platform on AWS.

Youth Union staff export data from the existing systems and upload the files through a Web Application. The AWS platform then stores, validates, standardizes, reconciles, and classifies the data before supporting organizers in confirming the final participation list.

The proposed platform uses a serverless AWS architecture consisting of AWS Amplify, Amazon Cognito, Amazon API Gateway, AWS Lambda, Amazon S3, Amazon DynamoDB, AWS Glue, Amazon Athena, Amazon QuickSight, Amazon CloudWatch, and AWS Identity and Access Management (IAM).

The primary objectives of the project are to reduce manual Excel processing, centralize student activity data, support participation reconciliation and confirmation, simplify data export, and provide analytical dashboards for evaluating student engagement across multiple activities.


### 2. Problem Statement

*Current Situation*

The current student activity management process relies on multiple separate systems and tools.

The general workflow can be summarized as follows:

1. The Faculty Youth Union plans and organizes an activity.
2. Activity information is published through communication channels.
3. Students access the university portal to register for the activity.
4. At the event venue, students present their student identification cards.
5. Organizers scan the QR code on each student card to record the student ID for Check-in.
6. During or near the end of the activity, students complete a Google Form for participation evidence and activity feedback.
7. At the end of the activity, organizers may scan student cards again to record Check-out.
8. After the activity, organizers collect and reconcile data from multiple sources.
9. Data from Google Sheets is downloaded to Excel for further filtering, checking, and manual adjustment.
10. The final participant list is completed and submitted to the University Youth Union according to the existing administrative process.

The current process generates data from several different sources:

- Registration list from the university portal.
- Check-in list from the student-card QR scanning system.
- Check-out list from the student-card QR scanning system.
- Participation evidence and feedback from Google Forms and Google Sheets.
- Excel or CSV files used for final processing and reconciliation.

This fragmented process introduces several challenges:

- Data is distributed across multiple systems and files.
- Organizers spend significant time comparing student IDs.
- Students may register but not actually attend the activity.
- Some students may have Check-in records but no Check-out records.
- Some students may have Check-out records but no Check-in records.
- Some students may have attendance records but no participation evidence.
- It is difficult to quickly determine the participation status of each student.
- Historical activity data is difficult to manage centrally.
- Student engagement across multiple activities is difficult to analyze.
- Large activities with more than 1,000 participants significantly increase the amount of manual processing required.

*Proposed Solution*

The proposed solution is to develop a centralized activity data management, processing, reconciliation, and analytics platform on AWS.

The MVP does not directly integrate with or replace the existing systems. Youth Union staff continue to use the current systems for registration, attendance collection, and participation evidence.

The exported datasets are uploaded to the Web Application in Excel or CSV format.

The input datasets include:

- Registration File exported from the University Portal.
- Check-in File.
- Check-out File.
- Evidence File exported from Google Forms or Google Sheets.

Amazon S3 is used to store the original uploaded files.

After a file is uploaded to Amazon S3, an AWS Lambda function is triggered to:

- Read the uploaded file.
- Validate the file structure.
- Check required fields.
- Standardize student IDs.
- Detect duplicate records.
- Detect invalid data.
- Transform the data into a structured format.
- Store structured operational data in Amazon DynamoDB.

The student ID is used as the main identifier for matching data across Registration, Check-in, Check-out, and Evidence sources.

The system automatically classifies records into categories such as:

- Complete participation data.
- Check-in available but Check-out missing.
- Check-out available but Check-in missing.
- Registered but no attendance records.
- Attendance available but participation evidence missing.
- Records that require additional manual review.

The system does not automatically make the final participation decision using a rigid rule.

Instead, the reconciliation results are displayed to organizers through a Reconciliation interface.

After reviewing the results, authorized staff may confirm participation using one of the following statuses:

- `CONFIRMED`
- `REJECTED`

After the final participant list is confirmed, the list is locked in the system and can be exported as Excel or CSV.

*Benefits and Value*

The proposed platform significantly reduces repetitive Excel-based reconciliation work.

Instead of opening multiple files and manually searching for student IDs, organizers can review reconciliation results in a centralized interface.

The platform also creates a historical data source that can support analysis of:

- Total registrations.
- Total confirmed participants.
- Participation Rate.
- No-show Rate.
- Missing Check-in Rate.
- Missing Check-out Rate.
- Missing Evidence Rate.
- Participation by activity type.
- Participation trends by semester.
- Student participation history.

The value of the project is therefore not limited to moving files to the cloud. The platform provides centralized integration, validation, reconciliation, storage, export, and analytics capabilities for data generated from multiple existing systems.


### 3. Solution Architecture

The platform adopts a serverless AWS architecture to reduce infrastructure management, support scalability, and optimize costs for the intermittent workload of student activities.

The system receives data from three primary external sources:

1. **University Portal** for student registration data.
2. **Student Card QR Scanner** for Check-in and Check-out data.
3. **Google Forms / Google Sheets** for participation evidence.

These existing systems remain outside AWS and are not replaced by the MVP.

Youth Union staff export data as Excel or CSV files and upload the files through the Web Application.

![Student Activity Management Platform Architecture](/images/2-Proposal/student_activity_architecture.png)

*Overall Processing Flow*

1. Youth Union staff export files from existing systems.
2. Authorized users access the Web Application through HTTPS.
3. Amazon Cognito authenticates users and provides JWT tokens.
4. The frontend sends REST API requests to Amazon API Gateway with the JWT token.
5. Amazon API Gateway invokes the Application Lambda to process business logic.
6. The Application Lambda reads and writes operational data in Amazon DynamoDB.
7. The frontend uses a pre-signed URL to upload Excel or CSV files directly to the Amazon S3 Raw Data Bucket.
8. An S3 Object Created event triggers the File Processing Lambda.
9. The File Processing Lambda validates, standardizes, transforms, and stores structured data in DynamoDB.
10. Processed data and exported files are stored in the S3 Processed & Export Data area.
11. AWS Glue catalogs the analytics dataset.
12. Amazon Athena queries data directly from Amazon S3 and uses AWS Glue Data Catalog as metadata.
13. Amazon QuickSight visualizes the analytical results through dashboards.

*AWS Services Used*

- *AWS Amplify*: Hosts the Web Application used by Youth Union staff and administrators.
- *Amazon Cognito*: Provides authentication, user management, and JWT-based access.
- *Amazon API Gateway*: Provides REST APIs for the frontend.
- *AWS Lambda – Application Logic*: Handles activity management, reconciliation, participation confirmation, pre-signed URL generation, and export logic.
- *AWS Lambda – File Processing*: Reads and processes uploaded Excel or CSV files.
- *Amazon S3 – Raw Data*: Stores original Registration, Check-in, Check-out, and Evidence files.
- *Amazon S3 – Processed & Export Data*: Stores processed data, analytical datasets, and exported files.
- *Amazon DynamoDB*: Stores structured operational data.
- *AWS Glue*: Provides the Data Catalog for analytics.
- *Amazon Athena*: Queries data stored on Amazon S3 using SQL.
- *Amazon QuickSight*: Provides analytical dashboards and visualizations.
- *Amazon CloudWatch*: Provides logs, metrics, error monitoring, and alarms.
- *AWS IAM*: Controls service permissions according to the Least Privilege principle.

*Data Design*

Amazon DynamoDB stores structured operational information including:

- Activities.
- Students.
- Registrations.
- Attendance.
- Participation Status.
- Reconciliation Status.

Amazon S3 is separated into two primary storage purposes.

**Raw Data**

- Registration Files.
- Check-in Files.
- Check-out Files.
- Evidence Files.

**Processed & Export Data**

- Processed Data.
- Reconciliation Data.
- Analytics Dataset.
- Export Files.
- Final Participation List.

*Security*

Amazon Cognito is used to authenticate authorized users.

The frontend includes the JWT token when sending API requests. Amazon API Gateway validates the token through a Cognito Authorizer before allowing requests to reach the backend.

AWS IAM follows the Least Privilege principle.

Each Lambda function receives only the permissions required for its responsibilities, such as:

- Reading from or writing to specific S3 buckets.
- Reading from or writing to required DynamoDB resources.
- Writing logs to Amazon CloudWatch.

*Monitoring*

Amazon CloudWatch is used to monitor important system components, including:

- API Gateway Logs.
- Lambda Invocations.
- Lambda Errors.
- Lambda Duration.
- File Processing Errors.
- Application Errors.
- CloudWatch Alarms.

This architecture enables the project to address functional requirements while also demonstrating security, monitoring, scalability, and cost optimization practices.


### 4. Technical Implementation

*Implementation Phases*

The project is divided into several phases, from business analysis to system design, development, testing, documentation, and resource cleanup.

1. *Business Analysis and AWS Research*

   Analyze the current activity management process, identify problems, define system requirements, and research suitable AWS services.

2. *Architecture Design*

   Design the AWS Architecture Diagram, Data Flow, Security Model, and Monitoring Strategy.

3. *Database Design*

   Identify the required entities and access patterns for Amazon DynamoDB.

4. *API Design*

   Design REST APIs for Activity Management, File Upload, Reconciliation, Confirmation, and Export.

5. *Authentication and Authorization*

   Configure Amazon Cognito and Cognito Authorizer.

6. *Web Application Development*

   Develop the user interface for Youth Union Staff and Admin users.

7. *File Upload Pipeline*

   Allow the frontend to request pre-signed URLs and upload files directly to Amazon S3.

8. *File Processing Pipeline*

   Use S3 events to invoke AWS Lambda for processing Excel and CSV files.

9. *Reconciliation Engine*

   Match Registration, Check-in, Check-out, and Evidence records using student IDs.

10. *Participation Confirmation*

    Allow authorized organizers to review reconciliation results and confirm participation.

11. *Export Functionality*

    Generate Excel or CSV files for operational reporting.

12. *Analytics*

    Use Amazon S3, AWS Glue, Amazon Athena, and Amazon QuickSight to create analytical dashboards.

13. *Security and Monitoring*

    Configure Amazon CloudWatch, IAM Least Privilege, and required alarms.

14. *Testing*

    Perform functional, integration, and End-to-End testing.

15. *Documentation and Cleanup*

    Complete workshop documentation, project reports, and remove unused AWS resources.

*Main Web Application Functions*

Youth Union Staff / Organizers can:

- Sign in to the system.
- Manage activities.
- Upload Registration Files.
- Upload Check-in Files.
- Upload Check-out Files.
- Upload Evidence Files.
- Review validation results.
- Review reconciliation results.
- Confirm participation.
- Export datasets.
- View analytical dashboards.

Admin users can:

- Manage accounts.
- Manage roles and permissions.
- Manage system configurations.
- Monitor system activity.

*Reconciliation Rules*

The system automatically classifies data but does not make all final participation decisions without human review.

Example classification:

| Registration | Check-in | Check-out | Evidence | Classification |
|---|---|---|---|---|
| Yes | Yes | Yes | Yes | Complete data |
| Yes | Yes | No | Yes | Missing Check-out |
| Yes | No | Yes | Yes | Missing Check-in |
| Yes | No | No | No | Registered but did not attend |
| Yes | Yes | Yes | No | Missing evidence |

In the current operational process, Check-in and Evidence are important data sources for determining actual participation.

Check-out is used as additional attendance information to support reconciliation.

Incomplete records are placed in a list requiring organizer review.

After review, participation status can be set to:

- `CONFIRMED`
- `REJECTED`

The final participant list is locked after confirmation.


### 5. Roadmap & Implementation Milestones

The project is planned for a 12-week internship period.

- *Weeks 1–2: Research and Analysis*
    - Study AWS Cloud fundamentals.
    - Research serverless AWS services.
    - Analyze the current activity management process.
    - Identify project requirements.
    - Complete the project proposal.

- *Weeks 3–4: System Design*
    - Finalize AWS Architecture.
    - Design DynamoDB.
    - Define access patterns.
    - Design REST APIs.
    - Design User Flow.
    - Design Security and Monitoring strategies.

- *Weeks 5–6: Core Backend Development*
    - Configure Amazon Cognito.
    - Create Amazon DynamoDB resources.
    - Develop AWS Lambda functions.
    - Configure Amazon API Gateway.
    - Configure AWS IAM.
    - Test backend APIs.

- *Weeks 7–8: File Processing*
    - Create Amazon S3 buckets.
    - Implement pre-signed file upload.
    - Process Registration Files.
    - Process Check-in Files.
    - Process Check-out Files.
    - Process Evidence Files.
    - Implement validation.
    - Implement duplicate detection.

- *Weeks 9–10: Reconciliation & Export*
    - Develop the Reconciliation Engine.
    - Develop Participation Confirmation.
    - Implement final list locking.
    - Generate Excel/CSV exports.
    - Test the End-to-End workflow.

- *Week 11: Analytics, Security & Monitoring*
    - Configure AWS Glue Data Catalog.
    - Create Amazon Athena queries.
    - Develop Amazon QuickSight dashboards.
    - Configure CloudWatch Logs.
    - Configure Metrics and Alarms.
    - Review IAM Least Privilege.
    - Monitor AWS costs.

- *Week 12: Testing & Documentation*
    - Perform Functional Testing.
    - Perform Integration Testing.
    - Perform End-to-End Testing.
    - Test the system with large synthetic datasets.
    - Complete Workshop documentation.
    - Complete the internship report.
    - Clean up unused AWS resources.

*Future Enhancements*

Future versions may include:

- Dynamic QR Code Check-in/Check-out.
- Student Self Check-in using mobile devices.
- QR Token expiration.
- Attendance time-window validation.
- Direct integration with the University Portal if APIs are available.
- Google Sheets API integration.
- Notification System.
- Email Notifications.
- Advanced Student Engagement Analysis.
- Machine Learning for engagement segmentation or participation prediction.


### 6. Budget Estimation

The project uses a serverless architecture to minimize infrastructure costs when the platform is not actively being used.

The actual cost depends on:

- Number of users.
- Number of activities.
- Number of API requests.
- Number and size of uploaded files.
- Amazon S3 storage volume.
- Lambda invocation count and execution duration.
- DynamoDB requests.
- AWS Glue usage.
- Athena data scanned.
- Amazon QuickSight subscription model.
- CloudWatch log volume.

The [AWS Pricing Calculator](https://calculator.aws/) will be used to estimate the final cost after the deployment configuration and workload assumptions are finalized.

*Expected Cost Components*

- *AWS Amplify*: Web Application hosting.
- *Amazon Cognito*: Cost based on Monthly Active Users where applicable.
- *Amazon API Gateway*: Cost based on API requests.
- *AWS Lambda*: Cost based on invocation count and execution duration.
- *Amazon S3*: Storage and request costs.
- *Amazon DynamoDB*: On-Demand capacity can be used for unpredictable workloads.
- *AWS Glue*: Cost when Crawlers or ETL jobs are executed.
- *Amazon Athena*: Cost based on the amount of data scanned.
- *Amazon QuickSight*: Cost depends on account type and subscription model.
- *Amazon CloudWatch*: Log storage, metrics, and alarms.
- *AWS IAM*: No direct charge for roles and policies.

*Cost Optimization Strategy*

- Use Serverless services instead of continuously running EC2 instances.
- Use DynamoDB On-Demand capacity for irregular workloads.
- Run AWS Glue only when required.
- Optimize S3 data structure to reduce Athena scan volume.
- Configure appropriate CloudWatch Log Retention.
- Use S3 Lifecycle policies for long-term storage when appropriate.
- Delete unused development resources.
- Configure AWS Budgets.
- Configure billing alerts.

*Budget Objective*

The MVP is designed to maintain a low operational cost for internship, educational, and demonstration purposes.

The official estimated cost will be calculated using AWS Pricing Calculator after the final architecture configuration, storage assumptions, and workload parameters are confirmed.


### 7. Risk Assessment

*Risk Matrix*

| Risk | Impact | Probability |
|---|---|---|
| Invalid Excel/CSV format | Medium | High |
| Missing or incorrect student ID | High | Medium |
| Duplicate records | Medium | Medium |
| Different file structures across data sources | High | Medium |
| Inconsistent data between sources | High | Medium |
| Lambda file processing failure | High | Low |
| Incorrect IAM permissions | High | Low |
| Unauthorized user access | High | Low |
| Exposure of student data | High | Low |
| AWS cost exceeds expectations | Medium | Low |

*Mitigation Strategies*

- *File Format*: Define standard templates for Registration, Check-in, Check-out, and Evidence files.
- *Validation*: Check all required fields before processing.
- *Student ID Validation*: Standardize and validate student IDs before storage.
- *Duplicate Detection*: Use Activity ID together with Student ID to identify duplicate records.
- *Error Handling*: Store invalid rows in a Validation Error List instead of inserting them directly into operational data.
- *Raw Data Backup*: Keep original files in Amazon S3.
- *Monitoring*: Monitor Lambda Errors and Duration using CloudWatch.
- *Authentication*: Use Amazon Cognito.
- *Authorization*: Apply appropriate roles and permissions.
- *Least Privilege*: Limit IAM permissions to required resources and actions.
- *Data Protection*: Use synthetic or anonymized data during development unless permission to use real student data is granted.
- *Cost Control*: Use AWS Budgets and billing alerts.
- *Cleanup*: Remove unused test resources.

*Contingency Plan*

- Failed files can be corrected and uploaded again.
- Original source files remain available in Amazon S3.
- The processing pipeline can be executed again from stored raw data.
- Export files can be regenerated from stored operational data.
- If the Analytics Layer is unavailable, the source data remains available in Amazon S3.
- The existing Excel-based process can remain available as a temporary fallback during the pilot stage.


### 8. Expected Outcomes

*Process Improvement*

The project is expected to provide a centralized platform for student activity data.

Instead of opening multiple Excel files and manually searching for individual student IDs, organizers can review reconciliation results through a unified interface.

The system can identify:

- Students with complete participation data.
- Students missing Check-in.
- Students missing Check-out.
- Students missing participation evidence.
- Students who registered but have no attendance data.
- Students requiring manual review.

*Reduction of Manual Work*

Registration, Check-in, Check-out, and Evidence data are automatically processed and matched using student IDs.

Organizers therefore focus primarily on exceptional cases rather than manually checking every record.

*Participation List Management*

After reconciliation, authorized staff can assign:

- `CONFIRMED`
- `REJECTED`

The final participation list is locked after confirmation.

The platform supports exporting:

- Registration List.
- Check-in List.
- Check-out List.
- Missing Check-in List.
- Missing Check-out List.
- Missing Evidence List.
- Registered but No Attendance List.
- Reconciliation List.
- Final Participation List.

The exported data can be generated in Excel or CSV format.

*Activity Point Scope*

The system can store the point value assigned to each activity.

Example:

```text
Activity: AWS Cloud Workshop
Activity Point Value: 5
However, the system does not officially add conduct points to student accounts.

The platform only records activity information and confirmed participation status.

Official conduct-point processing remains part of the University Youth Union's administrative process and is outside the project scope.

Analytics

The analytical dashboard is expected to include:

Total Activities.
Total Registrations.
Confirmed Participants.
Participation Rate.
No-show Rate.
Missing Check-in Rate.
Missing Check-out Rate.
Missing Evidence Rate.
Activities by Type.
Participation by Semester.
Participation Trends.

Example:

Total Registrations: 1,200
Confirmed Participants: 1,050

Participation Rate
= 1,050 / 1,200 × 100
= 87.5%

Scalability

The serverless architecture supports normal activities with approximately 100–200 participants while also providing the ability to handle larger programs with more than 1,000 participants without maintaining continuously running servers.

Services such as AWS Lambda, Amazon S3, and Amazon DynamoDB can scale according to workload demand.

Security and Monitoring

The platform applies:

Amazon Cognito Authentication.
Cognito Authorizer.
JWT Token.
AWS IAM Least Privilege.
Amazon CloudWatch Logs.
CloudWatch Metrics.
CloudWatch Alarms.
AWS Budgets and Billing Alerts.

This ensures that the project demonstrates not only functional implementation but also important AWS practices for security, monitoring, scalability, and cost control.

Long-Term Value

The project creates a centralized data platform that can be extended in future versions.

Potential future developments include:

Dynamic QR Check-in/Check-out.
Student Self Check-in.
University Portal Integration.
Google Sheets Integration.
Notification System.
Advanced Analytics.
Student Engagement Analysis.
Machine Learning.

The long-term objective is to transform the post-event data management process from a fragmented and highly manual Excel-based workflow into a centralized, traceable, scalable, and analytical workflow running on AWS.