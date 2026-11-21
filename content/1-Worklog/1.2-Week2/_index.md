---
title: "Worklog Week 2"
date: 2026-09-14
weight: 2
chapter: false
pre: "<b>1.2.</b>"
---

### Week 2 Objectives:

* Define the internship project topic and implementation scope.
* Analyze the practical challenges of managing, tracking, and evaluating student participation in university activities.
* Identify the main user roles and access control requirements.
* Investigate the data sources used for student activity management.
* Establish the business workflow from registration and attendance to evidence collection, reconciliation, and participation confirmation.
* Define data processing rules for Registration, Attendance, and Evidence.
* Research suitable technologies for Frontend, Backend, and database development.
* Identify AWS services appropriate for the project requirements and cost constraints.
* Design a high-level architecture that distinguishes local development components from potential AWS integrations.
* Prepare a preliminary data model and synthetic datasets for subsequent development and testing.

### Tasks to Be Implemented This Week:

| Day | Tasks | Start Date | Completion Date | References |
| --- | --- | --- | --- | --- |
| Monday | - Research and define the **Student Activity Management & Engagement Analytics Platform** project. <br> - Analyze challenges associated with managing participation data from multiple independent sources. <br> - Establish the overall project objectives and MVP scope. <br> - Identify core modules: Activity Management, Registration, Attendance, Evidence, Reconciliation, Analytics, and Export. <br> - Outline the main functional and non-functional requirements. | 14/09/2026 | 14/09/2026 | Project proposal and https://cloudjourney.awsstudygroup.com/ |
| Tuesday | - Analyze the system's user groups. <br> - Define two primary roles: **ADMIN** and **STUDENT**. <br> - Identify ADMIN responsibilities for activity management, student accounts, registration data, and participation results. <br> - Identify STUDENT permissions for viewing activities, managing personal profiles, and checking individual participation results. <br> - Analyze Registration data originating from the university's registration system. <br> - Investigate Evidence data exported from Google Forms/Google Sheets into CSV/XLSX files. <br> - Define preliminary security and access control requirements. | 15/09/2026 | 15/09/2026 | Project Proposal and system requirements |
| Wednesday | - Design the registration and attendance workflow. <br> - Establish Registration Preview and Import as the main mechanisms for importing external registration records. <br> - Analyze the process of scanning QR codes on student identification cards for Check-in/Check-out. <br> - Define the requirement for APIs to receive attendance events and immediately record timestamps. <br> - Determine how the system verifies whether a student has registered for an activity. <br> - Specify expected behavior for duplicate Check-ins, invalid Check-outs, and missing attendance events. <br> - Analyze how Evidence contributes to participation verification and reconciliation. | 16/09/2026 | 16/09/2026 | Business requirements and Project Proposal |
| Thursday | - Design the high-level system architecture. <br> - Select **React and Vite** for Frontend development. <br> - Select **Python and FastAPI** for the Backend REST API. <br> - Investigate SQLite for local development and demonstration environments. <br> - Research Amazon DynamoDB for experimental cloud-based business data storage. <br> - Explore Amazon S3 for file storage and data processing outputs. <br> - Study AWS Amplify for Frontend hosting. <br> - Investigate AWS IAM, Lambda, and CloudWatch for access control, serverless processing, and monitoring. <br> - Distinguish the proposed architecture from services that would be implemented in later weeks. | 17/09/2026 | 17/09/2026 | https://docs.aws.amazon.com/ <br> https://fastapi.tiangolo.com/ <br> https://vite.dev/ |
| Friday | - Design the initial data model for Activities, Students, Registrations, Attendance, Evidence, Participation, and Users. <br> - Identify important fields such as Activity ID, Student ID (MSSV), Check-in/Check-out timestamps, and participation status. <br> - Outline the REST API endpoints required for development. <br> - Define the workflow **Registration → Attendance → Evidence → Reconciliation → Analytics/Export**. <br> - Prepare synthetic test scenarios involving valid registrations, duplicate records, missing Check-ins, missing Check-outs, and missing Evidence. <br> - Summarize the analysis results, update the Project Proposal, and prepare for Backend development in Week 3. | 18/09/2026 | 18/09/2026 | Project Proposal, AWS Documentation, and architecture notes |

### Week 2 Achievements:

* **Defined the project topic and development direction:**
  * Selected **Student Activity Management & Engagement Analytics Platform** as the internship project.
  * Established the goal of developing a web-based system for managing activities, tracking participation, reconciling data, and analyzing student engagement.
  * Defined an MVP focused on essential business functions before expanding AWS integrations.

* **Analyzed the practical problem:**
  * Registration, attendance, and evidence records may originate from different independent systems.
  * Manual data consolidation can introduce missing records, duplicates, and inaccurate participation results.
  * A centralized workflow is needed to validate, reconcile, and confirm participation outcomes.
  * Reconciled data should support statistical analysis and reporting.

* **Defined two main user roles:**

  **ADMIN:**
  * Manage activities and publication status.
  * Manage student accounts.
  * Import Registration and Evidence datasets.
  * Perform or manage attendance operations.
  * Reconcile and confirm participation results.
  * Access Analytics and export reports.

  **STUDENT:**
  * Sign in and manage a personal profile.
  * View permitted activities and their details.
  * Check personal participation history and results.
  * Access relevant notifications.

* **Identified the primary data sources:**
  * **Registration:** Student registration data exported from the university system and imported through CSV/XLSX.
  * **Attendance:** Check-in/Check-out events sent directly to the API when an organizer scans a code or enters a Student ID.
  * **Evidence:** Participation evidence exported from Google Forms/Google Sheets as CSV/XLSX.
  * **Activity:** Activity information created and maintained within the application.

* **Established preliminary business rules:**
  * Registration records must be validated before import.
  * Students must have valid registrations before their attendance is accepted under the defined workflow.
  * Check-in and Check-out are designed as real-time API events rather than primarily being imported from Excel files.
  * Duplicate or invalid attendance operations must be detected.
  * Evidence is used alongside Registration and Attendance during reconciliation.
  * Missing or inconsistent records must be flagged for ADMIN review.
  * Final participation results must be confirmed before reporting.

* **Designed the overall data processing workflow:**

  **Activity Management → Registration Import → Real-time Attendance → Evidence Import → Reconciliation → Participation Result → Analytics & Export**

  The workflow includes:
  * ADMIN creates and manages activities.
  * Registration datasets are validated and imported.
  * Attendance is recorded immediately when the relevant action occurs.
  * Evidence records are imported and validated.
  * Backend services reconcile the data sources.
  * Final results are aggregated for analysis and reporting.

* **Proposed the technology architecture:**
  * **React + Vite:** Web user interface.
  * **FastAPI + Python:** REST API and business logic.
  * **SQLite:** Data persistence for local development and demonstration.
  * **AWS Amplify:** Planned cloud hosting for the Frontend.
  * **Amazon DynamoDB:** Planned pilot integration for business data.
  * **Amazon S3:** Planned storage for posters, datasets, and processed results.
  * **AWS IAM:** Research into secure service-to-service permissions.
  * **AWS Lambda:** Research into serverless data processing.
  * **Amazon CloudWatch:** Research into monitoring and execution logs.

  These components represented the **proposed architecture and development plan for Week 2**, not a claim that all AWS services had already been deployed.

* **Distinguished research options from actual implementation:**
  * Amazon Cognito and Amazon API Gateway were considered as alternatives within a fully serverless architecture.
  * AWS Glue, Amazon Athena, and Amazon QuickSight were explored as possible future analytics enhancements.
  * These services were not treated as implemented components.
  * Initial Backend development with FastAPI was prioritized before cloud integration.

* **Prepared the initial data model:**
  * Activities.
  * Students.
  * Registrations.
  * Attendance.
  * Evidence.
  * Participation.
  * Users.

  Identified the basic relationships between Activity ID, Student ID, Registration, Attendance, and participation results.

* **Prepared synthetic testing scenarios:**
  * Valid registration and complete attendance.
  * Student not present in the registration list.
  * Duplicate Student IDs.
  * Missing Check-in.
  * Missing Check-out.
  * Missing Evidence.
  * Registration without attendance.
  * Records requiring manual review.

* **Established the next development steps:**
  * Outlined the required modules and REST API endpoints.
  * Selected a local-first development strategy followed by targeted AWS integration.
  * Prioritized synthetic datasets to protect student information and reduce cloud costs.
  * Prepared the basic requirements for Backend development in Week 3.

### Challenges and Lessons Learned:

* **Multiple data sources:** Registration, Attendance, and Evidence have different structures, making data validation and reconciliation essential.
* **Real-time attendance design:** It is important to distinguish immediate Check-in/Check-out API events from batch data imports.
* **AWS architecture selection:** A fully serverless design introduces multiple services and additional complexity, making it unsuitable to deploy all components at the start of the project.
* **Cost management:** A local-first development approach with synthetic data helps minimize AWS expenses during development.
* **Role-based access control:** ADMIN and STUDENT responsibilities must be defined early to avoid extensive modifications during Backend and Frontend development.

### Plan for Next Week:

* Initialize the Python and FastAPI Backend project.
* Design REST API endpoints and business data models.
* Develop basic Activity Management functionality.
* Implement Registration Import and Evidence Import processing.
* Build Check-in/Check-out APIs using synthetic data.
* Develop reconciliation logic for missing, duplicate, and inconsistent records.
* Test core business workflows locally before integrating AWS services.