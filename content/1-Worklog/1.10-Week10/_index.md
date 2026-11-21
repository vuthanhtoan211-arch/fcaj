---
title: "Worklog Week 10"
date: 2026-11-09
weight: 10
chapter: false
pre: "<b>1.10.</b>"
---

### Week 10 Objectives:

* Continue improving the **Student Activity Management & Engagement Analytics Platform**.
* Review the AWS Amplify Frontend deployment.
* Verify connectivity between AWS Amplify and the FastAPI demo Backend through Cloudflare Tunnel.
* Review core application features and clarify the actual deployment architecture.
* Summarize previous Amazon DynamoDB Pilot experiments and test results.
* Study and implement serverless data processing using AWS Lambda.
* Use Amazon S3 to store input datasets and processing results.
* Configure AWS IAM Roles and Policies following the Principle of Least Privilege.
* Integrate AWS Lambda with Amazon S3 to process CSV files and generate JSON output.
* Test student registration data processing using synthetic records.
* Use Amazon CloudWatch to monitor Lambda execution logs.
* Examine execution duration, memory usage, and error handling.
* Configure CloudWatch Logs retention to reduce unnecessary storage costs.
* Summarize the architecture and technical evidence for six AWS services.
* Prepare technical documentation, README, Demo Scripts, and internship reporting materials.
* Review AWS resources and Billing to maintain cost awareness.

### Tasks to Be Implemented This Week:

| Day | Tasks | Start Date | Completion Date | References |
| --- | --- | --- | --- | --- |
| Monday | - Review the **Student Activity Management & Engagement Analytics Platform** project. <br> - Inspect the React/Vite and FastAPI source code structure. <br> - Review AWS Amplify Hosting configuration and Frontend deployment status. <br> - Examine Frontend connectivity with the demo Backend through Cloudflare Tunnel. <br> - Review Authentication, Activity Management, Registration Import, Attendance, Reconciliation, Analytics, and Export. <br> - Summarize the AWS services previously studied and tested. <br> - Distinguish the operational application from the original proposed AWS architecture. | 09/11/2026 | 09/11/2026 | Project documentation, GitHub Repository, and AWS Amplify Documentation |
| Tuesday | - Study serverless data processing using AWS Lambda. <br> - Create the `sap-csv-processor-demo` Lambda Function using Python 3.13 in the Singapore Region. <br> - Prepare the `lambda-demo/input/` and `lambda-demo/processed/` prefixes in Amazon S3. <br> - Upload a synthetic `registrations.csv` dataset. <br> - Configure an IAM Execution Role and Inline Policy for Lambda. <br> - Restrict `s3:GetObject` to input objects and `s3:PutObject` to processed output objects. <br> - Develop CSV processing logic to validate Student IDs and detect duplicates or invalid records. <br> - Deploy and Test the Lambda Function. <br> - Verify JSON output stored in S3. <br> - Review CloudWatch Logs, execution metrics, and configure seven-day log retention. | 10/11/2026 | 10/11/2026 | https://docs.aws.amazon.com/lambda/ <br> https://docs.aws.amazon.com/s3/ <br> https://docs.aws.amazon.com/iam/ <br> https://docs.aws.amazon.com/cloudwatch/ |
| Wednesday — Planned | - Review the DynamoDB Pilot test suites. <br> - Examine documentation for `SAP-Activities`, `SAP-Registrations`, `SAP-Attendance`, `SAP-Evidence`, and `SAP-Participation`. <br> - Summarize cloud data persistence experiments. <br> - Compare the SQLite demo database with DynamoDB Pilot workflows. <br> - Prepare a technical summary of the AWS services. <br> - Develop a Demo Script for the application's main business workflows. <br> - Collect screenshots and technical details for the internship report. | 11/11/2026 | 11/11/2026 (planned) | AWS Pilot documentation, Test Scripts, and DynamoDB Documentation |
| Thursday — Planned | - Review the AWS Architecture Diagram. <br> - Update the architecture to reflect six implemented or tested AWS services. <br> - Clearly distinguish the Web Application workflow from the separate Lambda CSV processing workflow. <br> - Update the README and application setup instructions. <br> - Prepare Workshop/Presentation content covering the Problem Statement, Solution, Architecture, Data Flow, and AWS Services. <br> - Review API Documentation, User Guide, and Test Report. <br> - Prepare contingency procedures for Backend or Cloudflare Tunnel failures during the Demo. | 12/11/2026 | 12/11/2026 (planned) | GitHub Repository, README, Architecture Diagram, and Project Documentation |
| Friday — Planned | - Summarize the six AWS services: Amplify, DynamoDB, S3, IAM, Lambda, and CloudWatch. <br> - Review active AWS resources. <br> - Check AWS Billing and potential cost-generating services. <br> - Verify CloudWatch Log Retention and S3 demo objects. <br> - Organize technical evidence for the internship report. <br> - Review source code and project documentation on GitHub. <br> - Identify MVP limitations and future enhancements. <br> - Prepare Self-evaluation materials and the Demo, Feedback, and Handover phases. | 13/11/2026 | 13/11/2026 (planned) | AWS Billing, AWS Documentation, GitHub Repository, and Internship Report |

### Achievements as of November 10, 2026:

* **1. Reviewed the actual project architecture:**

  The system currently uses:
  * React and Vite for the Frontend.
  * Python and FastAPI for REST API development.
  * SQLite for local development and demo data.
  * AWS Amplify for Frontend hosting.
  * Cloudflare Tunnel for temporary HTTPS connectivity to the demo Backend.
  * Amazon DynamoDB and Amazon S3 for selected AWS Pilot workflows.
  * AWS Lambda, IAM, and CloudWatch for an independent CSV processing demonstration.

  Main Web Application workflow:

  **User → AWS Amplify Hosting → Cloudflare Tunnel → FastAPI Backend → SQLite Demo**

  This is a demonstration architecture, not a fully AWS-hosted production Backend.

* **2. Reviewed AWS Amplify Hosting:**
  * Identified AWS Amplify as the hosting service for the React/Vite Frontend.
  * Used GitHub as the source repository.
  * Used the `main` deployment branch.
  * Configured the Backend API address through `VITE_API_BASE_URL`.
  * Reviewed HTTPS requirements for public Frontend–Backend communication.
  * Recorded the application URL:

    `https://main.d2p96elhe5x6se.amplifyapp.com`

  * Confirmed the architectural distinction between AWS-hosted Frontend assets and the separately operated FastAPI demo Backend.

* **3. Summarized Amazon DynamoDB Pilot development:**
  * Studied DynamoDB-based persistence for business data.
  * Identified the following tables:
    * `SAP-Activities`.
    * `SAP-Registrations`.
    * `SAP-Attendance`.
    * `SAP-Evidence`.
    * `SAP-Participation`.
  * Developed or reviewed AWS Pilot mechanisms for activity, registration, attendance, evidence, and participation data.
  * Investigated DynamoDB operations using Boto3.
  * Used synthetic test activities and Student IDs for isolated experiments.
  * Distinguished the application's SQLite demo database from DynamoDB Pilot storage.

  **Note:** DynamoDB was used in limited Pilot workflows, not as the primary database for the entire demo website.

* **4. Integrated Amazon S3 into the data processing demonstration:**
  * Used the S3 Bucket:

    `sap-data-project-2026-huflit01`

  * Created the following prefixes:
    * `lambda-demo/input/`.
    * `lambda-demo/processed/`.
  * Prepared and uploaded the synthetic CSV file:

    `lambda-demo/input/registrations.csv`

  * Used Amazon S3 for input storage and processed output.
  * Verified the output object following Lambda execution.

* **5. Deployed an AWS Lambda CSV processor:**
  * Created the Lambda Function:

    `sap-csv-processor-demo`

  * AWS Region: `ap-southeast-1` (Singapore).
  * Runtime: Python 3.13.
  * Architecture: x86_64.
  * Memory: 128 MB.
  * Timeout: 10 seconds.

  The Function was designed to:
  * Read CSV input from Amazon S3.
  * Verify the presence of the `mssv` column.
  * Count total records.
  * Identify valid Student IDs.
  * Detect duplicate Student IDs.
  * Detect missing or invalid Student IDs.
  * Produce JSON processing results.
  * Write the JSON output to Amazon S3.
  * Log processing information to Amazon CloudWatch.

* **6. Configured AWS IAM using Least Privilege:**
  * Used the Lambda Execution Role:

    `sap-csv-processor-demo-role-9ui2ib5d`

  * Configured basic Lambda logging permissions.
  * Added the Inline Policy:

    `SAP-Lambda-S3-Demo-Access`

  * Restricted permissions to:
    * `s3:GetObject` for objects under `lambda-demo/input/*`.
    * `s3:PutObject` for objects under `lambda-demo/processed/*`.
  * Avoided unnecessary bucket-wide access.
  * Did not grant S3 deletion or bucket administration privileges.
  * Understood how Lambda Execution Roles authorize service-to-service access.

* **7. Successfully tested Lambda with synthetic registration data:**

  Input dataset:

  | Student ID | Full Name | Expected Classification |
  | --- | --- | --- |
  | DEMO001 | Student Demo One | Valid |
  | DEMO002 | Student Demo Two | Valid |
  | DEMO001 | Student Demo Duplicate | Duplicate |
  | Empty | Student Demo Invalid | Invalid |

  Actual processing result:

  ```json
  {
    "total": 4,
    "valid": 2,
    "duplicates": 1,
    "invalid": 1
  }
  ```

  * Successfully deployed the Lambda Function.
  * Executed a Lambda Test Event and received `statusCode: 200`.
  * Confirmed that the processing result matched the input dataset.
  * Verified that Lambda could read input objects from S3.
  * Confirmed that the output was stored at:

    `lambda-demo/processed/registrations-result.json`

* **8. Monitored AWS Lambda using Amazon CloudWatch:**
  * Accessed the Log Group:

    `/aws/lambda/sap-csv-processor-demo`

  * Reviewed START, END, and REPORT events.
  * Verified the successful CSV processing log entry.
  * Observed execution metrics:
    * Duration: 404.97 ms.
    * Configured Memory: 128 MB.
    * Maximum Memory Used: 93 MB.
  * Used logs to confirm processing behavior.
  * Configured Log Retention to **7 days**.
  * Learned how CloudWatch supports Lambda monitoring and debugging.

* **9. Completed an independent Serverless integration workflow:**

  **Amazon S3 (CSV Input) → AWS Lambda (Python Processing) → Amazon S3 (JSON Output)**

  Supporting AWS services:
  * AWS IAM grants Lambda the required S3 and logging permissions.
  * Amazon CloudWatch records execution logs and metrics.

  Execution workflow:
  * A synthetic CSV dataset is uploaded to S3.
  * Lambda is invoked manually through a Test Event.
  * Lambda retrieves the CSV object.
  * Python validates and classifies the records.
  * The JSON result is written back to S3.
  * CloudWatch stores execution information.

  **Important:** This Serverless workflow is a separate AWS demonstration. It does not replace the application's FastAPI Backend or its existing Registration Import API.

* **10. Summarized the six AWS services:**

  | AWS Service | Purpose | Implementation Scope |
  | --- | --- | --- |
  | AWS Amplify | Host the React/Vite web interface | Frontend Hosting |
  | Amazon DynamoDB | Test business data storage | AWS Pilot |
  | Amazon S3 | Store files and processing results | Storage / Lambda Demo |
  | AWS IAM | Manage AWS resource permissions | Lambda Execution Role |
  | AWS Lambda | Process synthetic Registration CSV | Serverless Demo |
  | Amazon CloudWatch | Monitor Lambda logs and execution | Monitoring / Logging |

* **11. Reviewed AWS resource usage and cost controls:**
  * Configured Lambda with 128 MB memory and a 10-second timeout.
  * Used a small synthetic dataset for testing.
  * Avoided deploying unnecessary AWS resources for the demonstration.
  * Configured a seven-day CloudWatch Logs retention period.
  * Reviewed AWS Billing as the source for monitoring cloud charges.
  * Recognized that billing information may be delayed and that an initially displayed cost of zero does not guarantee that no charges will occur.

### Planned Achievements for November 11–13, 2026:

* Review and summarize DynamoDB Pilot tests.
* Finalize the AWS Architecture Diagram covering six services.
* Update the README to reflect the actual deployment architecture.
* Prepare the Demo Script and presentation workflow.
* Collect screenshots for Amplify, DynamoDB, S3, IAM, Lambda, and CloudWatch.
* Review API Documentation, User Guide, and Test Report.
* Organize source code and project documentation on GitHub.
* Review AWS Billing and unnecessary resources.
* Prepare Workshop, Self-evaluation, and internship report materials.

### Challenges and Lessons Learned:

* **Multi-service AWS integration:** Each AWS service has a distinct responsibility, and the architecture must clearly explain how the services are used.
* **IAM configuration:** Lambda requires the correct permissions to read input files and write output files. Restricting access helps reduce security risks.
* **CSV data validation:** Input records may contain duplicates, missing Student IDs, or invalid values and must be checked before further processing.
* **Serverless verification:** Successful testing requires examining the Lambda Test result, the output JSON object in S3, and CloudWatch Logs.
* **Demo versus production:** The website continues to use FastAPI as its main Backend; Lambda CSV processing is a separate demonstration.
* **Monitoring:** CloudWatch provides execution duration, memory usage, and diagnostic information.
* **Cost management:** AWS resource usage must be limited, unnecessary test data should be removed, and Billing should be reviewed regularly.
* **Technical evidence:** Screenshots, test results, and configuration records are important for demonstrating AWS implementation in an internship report.

### Plan for Next Week:

* Prepare and conduct the project demonstration.
* Review critical application functionality before the presentation.
* Present the system architecture and six AWS services.
* Demonstrate the main Web Application workflow.
* Demonstrate the Amazon S3 → AWS Lambda → Amazon S3 processing workflow.
* Collect feedback from supervisors and participants.
* Categorize issues and improvement suggestions.
* Finalize Architecture Diagrams, README, API Documentation, and User Guide.
* Prepare the final project version for reporting and handover.