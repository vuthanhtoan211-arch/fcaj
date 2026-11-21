---
title: "Worklog Week 11"
date: 2026-11-16
weight: 11
chapter: false
pre: "<b>1.11.</b>"
---

### Week 11 Objectives:

* Prepare and conduct a demonstration of the **Student Activity Management & Engagement Analytics Platform**.
* Review all major application functions before the presentation.
* Finalize Workshop materials and the Demo Presentation.
* Explain the project's practical problem, objectives, and proposed solution.
* Present the actual deployment architecture and the roles of six AWS services.
* Demonstrate activity management, registration, attendance, evidence, reconciliation, and analytics functions.
* Present the AWS Lambda CSV processing workflow using Amazon S3.
* Distinguish the Web Application environment from AWS Pilot and Serverless Demo components.
* Collect feedback from supervisors and participants.
* Categorize suggestions related to functionality, UI/UX, data processing, security, and documentation.
* Address important issues identified through testing and feedback.
* Perform Regression Testing after implementing changes.
* Update the Architecture Diagram, README, API Documentation, User Guide, and Test Report.
* Organize source code and documentation in the GitHub Repository.
* Collect technical evidence for internship reporting and project handover.
* Review AWS resources and associated costs.

### Tasks to Be Implemented This Week:

| Day | Tasks | Start Date | Completion Date | References |
| --- | --- | --- | --- | --- |
| Monday | - Review the project demonstration environment. <br> - Check the AWS Amplify Frontend and FastAPI Backend. <br> - Verify Cloudflare Tunnel connectivity and SQLite demo data. <br> - Test Authentication and ADMIN/STUDENT authorization. <br> - Review Activity Management, Registration Import, Attendance, Evidence Import, Reconciliation, Analytics, and Export. <br> - Prepare synthetic accounts and datasets for the demonstration. <br> - Review the Demo Script and technical screenshots. <br> - Check the AWS resources required for the presentation. | 16/11/2026 | 16/11/2026 (planned) | Demo Script, User Guide, Test Report, and Project Documentation |
| Tuesday | - Plan to conduct the **Student Activity Management & Engagement Analytics Platform** demonstration. <br> - Present the Problem Statement, Objectives, and Proposed Solution. <br> - Explain the actual Web Application architecture. <br> - Introduce six AWS services: Amplify, DynamoDB, S3, IAM, Lambda, and CloudWatch. <br> - Demonstrate the primary business functions. <br> - Explain real-time Check-in/Check-out through FastAPI. <br> - Demonstrate or present the results of AWS Lambda CSV processing with Amazon S3. <br> - Explain CloudWatch logging and IAM permissions. <br> - Answer technical questions and record feedback. | 17/11/2026 | 17/11/2026 (planned) | Demo Presentation, Architecture Diagram, and AWS Test Evidence |
| Wednesday | - Summarize feedback if the demonstration has taken place. <br> - Categorize comments into Functionality, UI/UX, Data Processing, Security, Analytics, and Documentation. <br> - Identify issues affecting essential application functions. <br> - Distinguish urgent fixes from Future Development suggestions. <br> - Update the Issue List and assign priorities. <br> - Evaluate the limitations of the local Backend and Cloudflare Quick Tunnel. <br> - Review data protection and AWS cost considerations. | 18/11/2026 | 18/11/2026 (planned) | Demo Feedback, Issue List, and Project Test Report |
| Thursday | - Address confirmed issues from the Demo and testing activities. <br> - Review Authentication and Authorization. <br> - Investigate issues involving activities, accounts, and participation data. <br> - Improve Import Validation and Error Handling. <br> - Recheck Reconciliation and Analytics after modifications. <br> - Perform Regression Testing on affected features. <br> - Update API Documentation, User Guide, and Test Report. <br> - Document unresolved issues and their causes. | 19/11/2026 | 19/11/2026 (planned) | Source Code, Test Cases, and Feedback |
| Friday | - Review and organize the GitHub Repository. <br> - Check the README, Frontend/Backend structure, and setup instructions. <br> - Update the AWS Architecture Diagram to reflect actual implementation status. <br> - Collect screenshots of Amplify, DynamoDB Pilot, S3, IAM, Lambda, and CloudWatch. <br> - Review API Documentation, User Guide, Test Report, and Demo Script. <br> - Check AWS Billing and existing resources. <br> - Archive source code, synthetic data, and handover documents. <br> - Prepare the final internship report materials. | 20/11/2026 | 20/11/2026 (planned) | GitHub Repository, AWS Documentation, and Internship Report |

### Expected Achievements for Week 11:

* **1. Prepare the project demonstration:**
  * Review the Frontend and demo Backend.
  * Verify the AWS Amplify → Cloudflare Tunnel → FastAPI connection.
  * Prepare synthetic ADMIN and STUDENT accounts.
  * Use artificial student records to protect personal information.
  * Prepare successful and unsuccessful demonstration scenarios.
  * Finalize the Demo Script and presentation sequence.
  * Prepare alternatives if the Backend or temporary Tunnel becomes unavailable.

* **2. Present the project problem and solution:**
  * Explain the challenges of managing student participation data.
  * Describe the limitations of manual data consolidation.
  * Present the objectives of a centralized management and reconciliation system.
  * Explain the application's primary modules and business workflow.
  * Describe the MVP scope and potential extensions.

* **3. Present the actual Web Application architecture:**

  **User → AWS Amplify Hosting → Cloudflare Tunnel → FastAPI Backend → SQLite Demo**

  Components:
  * **React/Vite:** Web user interface.
  * **AWS Amplify:** Frontend hosting.
  * **Cloudflare Tunnel:** Temporary HTTPS connectivity.
  * **FastAPI:** REST APIs and business logic.
  * **SQLite:** Demo data storage.
  * **DynamoDB/S3 Pilot:** Selected AWS test integrations.

  The presentation should explain that the Backend has not been migrated to an entirely serverless AWS production architecture.

* **4. Explain the six AWS services:**

  | AWS Service | Actual Role |
  | --- | --- |
  | AWS Amplify | React/Vite Frontend hosting |
  | Amazon DynamoDB | Business data storage experiments |
  | Amazon S3 | File storage and processing results |
  | AWS IAM | Lambda execution permissions |
  | AWS Lambda | CSV processing demonstration |
  | Amazon CloudWatch | Lambda logs and monitoring |

  * Distinguish Web Application services from Serverless Demo components.
  * Explain each service's purpose.
  * Describe the budget-conscious deployment approach.
  * Avoid presenting Cognito, API Gateway, Glue, Athena, or QuickSight as deployed services.

* **5. Demonstrate the primary application functions:**

  **Authentication:**
  * Sign in with ADMIN and STUDENT accounts.
  * Verify role-based access.
  * Sign out and check session behavior.

  **Activity Management:**
  * View the activity list.
  * Create or update an activity.
  * Review activity status.

  **Registration Import:**
  * Select a CSV/XLSX file.
  * Preview and validate records.
  * Import registration data.

  **Real-time Attendance:**
  * Submit a Check-in using a Student ID through FastAPI.
  * Review results and timestamps.
  * Perform Check-out.
  * Test duplicate or invalid operations.

  **Evidence Import:**
  * Import evidence from a file.
  * Validate records and match them with registered students.

  **Reconciliation:**
  * Combine Registration, Attendance, and Evidence.
  * Review records requiring attention.
  * Confirm or adjust participation results.

  **Analytics and Export:**
  * Display the Analytics Dashboard.
  * Review registration and participation metrics.
  * Export Excel reports.

* **6. Present the independent AWS Serverless Demo:**

  **Amazon S3 (CSV Input) → AWS Lambda → Amazon S3 (JSON Output)**

  Supporting components:
  * AWS IAM provides S3 read/write permissions.
  * Amazon CloudWatch records execution logs.

  Technical details:
  * Lambda Function: `sap-csv-processor-demo`.
  * Runtime: Python 3.13.
  * S3 Bucket: `sap-data-project-2026-huflit01`.
  * Input: `lambda-demo/input/registrations.csv`.
  * Output: `lambda-demo/processed/registrations-result.json`.
  * IAM Inline Policy: `SAP-Lambda-S3-Demo-Access`.
  * CloudWatch Log Group: `/aws/lambda/sap-csv-processor-demo`.

  Previously verified Week 10 result:

  ```json
  {
    "total": 4,
    "valid": 2,
    "duplicates": 1,
    "invalid": 1
  }
  ```

  This result will serve as evidence of Lambda, S3, IAM, and CloudWatch integration.

* **7. Collect and categorize feedback:**
  * **Functionality:** Features that do not meet requirements.
  * **UI/UX:** Layout, navigation, and user feedback.
  * **Data Processing:** Import, Validation, and Reconciliation.
  * **Security:** Authentication, Authorization, and data handling.
  * **Analytics:** Accuracy of statistical indicators.
  * **Documentation:** README, diagrams, and user instructions.

  Actual feedback will be documented after the demonstration.

* **8. Implement corrections and Regression Testing:**
  * Investigate and address confirmed defects.
  * Update Frontend or Backend components when necessary.
  * Retest affected functions.
  * Verify that account and activity changes do not affect unrelated records.
  * Recheck Reconciliation and Analytics following modifications.
  * Document unresolved issues and possible solutions.

* **9. Finalize project documentation:**
  * Project README.
  * AWS Architecture Diagram.
  * API Documentation.
  * User Guide.
  * Test Report.
  * Demo Script.
  * Workshop Presentation.
  * AWS Technical Evidence.

  Documentation should reflect the actual source code and deployed architecture.

* **10. Organize the GitHub Repository:**
  * Verify the source code structure.
  * Identify configuration files requiring protection.
  * Review README and deployment instructions.
  * Check Frontend and Backend paths.
  * Preserve versions and supporting documents for reporting.
  * Ensure that secrets are not committed to GitHub.

* **11. Evaluate MVP limitations:**
  * The demo Backend depends on a local computer running FastAPI.
  * Cloudflare Quick Tunnel uses a temporary URL that may change.
  * SQLite is used for the demo environment rather than as a production database.
  * DynamoDB integration remains limited to AWS Pilot scenarios.
  * The Lambda CSV Processor is not connected to the main Registration Import workflow.
  * Browser-based QR camera scanning has not been confirmed as complete.
  * The application is not directly integrated with the University Portal.
  * Large-scale production load testing has not been performed.

* **12. Propose future improvements:**
  * Deploy the Backend on stable cloud infrastructure.
  * Strengthen Authentication and security for production use.
  * Expand DynamoDB or managed database integration.
  * Consider S3 Event Notifications and Lambda for automatic file processing.
  * Integrate a practical QR Scanner with real-time Attendance APIs.
  * Connect registration data directly to the University Portal.
  * Add Notifications and user support features.
  * Enhance Dashboard analytics capabilities.
  * Perform performance and load testing.

### Expected Challenges and Lessons to Review:

* **Demo preparation:** A clear script and reliable synthetic datasets reduce presentation risks.
* **Local Backend dependency:** If the computer or Cloudflare Tunnel stops, the public website may lose API access.
* **AWS architecture:** The six AWS services should be explained accurately without confusing AWS Pilot or Lambda Demo with production infrastructure.
* **Feedback management:** Suggestions should be prioritized based on impact and feasibility.
* **Regression Testing:** Changes to one module require checking related functions.
* **Documentation consistency:** README, Architecture Diagrams, and API Documentation must match the implementation.
* **Cost management:** AWS resources should be monitored throughout the Demo and handover phases.
* **Data protection:** Screenshots and test datasets should be reviewed before inclusion in public reports.

### Plan for Next Week:

* Complete Worklogs from Week 1 through Week 12.
* Verify consistency between Vietnamese and English versions.
* Finalize the Proposal, Workshop, Self-evaluation, and Sharing and Feedback sections.
* Review the internship report.
* Complete the final Architecture Diagram and technical documentation.
* Check the Hugo reporting website and GitHub Repository.
* Organize screenshots, test results, and AWS evidence.
* Review AWS Billing and active resources.
* Prepare final submission and project handover.