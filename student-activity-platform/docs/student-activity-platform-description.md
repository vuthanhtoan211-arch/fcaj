# Student Activity Management & Engagement Analytics Platform

**Project type:** Full-stack web application with AWS cloud integration experiments  
**Program:** First Cloud AI Journey (FCAJ)  
**Domain:** Student activity management, attendance tracking, data reconciliation, and engagement analytics  
**Architecture diagram:** `student-activity-platform.drawio.xml`

## 1. Project Overview

The **Student Activity Management & Engagement Analytics Platform** is a web application designed to support the management and analysis of student participation in university activities. The project addresses the fragmentation of registration lists, attendance records, participation evidence, and reporting data across separate tools and spreadsheets.

The application consolidates these workflows into an administrative interface and a student-facing interface. It supports activity management, registration data imports, real-time attendance recording, participation evidence processing, reconciliation, analytics, and report exports.

The primary working demonstration uses a **React/Vite frontend**, a **Python/FastAPI backend**, and **SQLite for local persistence**. Selected AWS services were implemented or explored separately to demonstrate cloud hosting, NoSQL data modeling, serverless file processing, access management, and logging.

## 2. Objectives

- Centralize student activities and related participation records.
- Reduce manual work when importing registration and evidence data from existing university systems.
- Record check-in and check-out events in real time using a student ID/QR-code scanner or manual student ID entry.
- Reconcile registration, attendance, and evidence records to support participation confirmation.
- Provide administrators with activity statistics and downloadable reports.
- Practice cloud infrastructure, deployment, permissions, monitoring, and responsible resource management on AWS.

## 3. User Roles and Main Features

The application supports **two roles: ADMIN and STUDENT**.

### 3.1 ADMIN

- Sign in and access protected administrative features.
- Manage activities and review activity information.
- Import student registration data from CSV/XLSX files exported by the university portal.
- Record attendance through real-time check-in and check-out workflows.
- Import participation evidence exported from Google Forms/Google Sheets.
- Reconcile registration, attendance, and evidence information to determine participation results.
- View activity statistics and export reports.
- Manage student accounts, including listing, locking/unlocking, password reset, and account synchronization.

### 3.2 STUDENT

- Sign in to the student interface.
- Access student-facing activity and participation information made available by the application.
- View personal profile or participation information where enabled in the current build.
- Cannot access ADMIN-only student-account management features.

## 4. Technology Stack

| Layer | Technologies | Purpose |
| --- | --- | --- |
| Frontend | React, Vite, JavaScript | Web interface for ADMIN and STUDENT |
| Backend | Python, FastAPI | REST APIs, authentication, authorization, business logic |
| Local database | SQLite | Persistence for the working local demonstration |
| Cloud frontend hosting | AWS Amplify | Hosting the React/Vite frontend |
| Temporary API access | Cloudflare Quick Tunnel | Exposing a local backend through a temporary HTTPS endpoint for cloud-hosted frontend demonstrations |
| Cloud data experiment | Amazon DynamoDB | Exploring operational NoSQL tables |
| Object storage experiment | Amazon S3 | Storing demonstration CSV input and JSON output |
| Serverless experiment | AWS Lambda | Validating and processing sample CSV registration records |
| Permissions | AWS IAM | Lambda execution permissions and S3 access |
| Monitoring | Amazon CloudWatch | Lambda execution logs and monitoring |

## 5. System Architecture

The attached file `student-activity-platform.drawio.xml` contains architecture diagrams. It distinguishes the **implemented demonstration** from a broader **future cloud architecture**.

### 5.1 Implemented Demonstration

1. A user opens the React/Vite web interface, either on a local development server or through the frontend hosted by AWS Amplify.
2. The frontend sends authenticated REST API requests to the FastAPI backend.
3. In the local demonstration, FastAPI handles the application's business logic and reads/writes application records in SQLite.
4. When the frontend is hosted on Amplify while the backend remains local, a Cloudflare Quick Tunnel can temporarily expose the backend through HTTPS. This endpoint is temporary and may change between sessions.
5. A separate AWS experiment uses DynamoDB tables to explore cloud data storage and an S3–Lambda workflow to process sample registration CSV files.

**Important deployment boundary:** AWS Amplify hosts the frontend; the main FastAPI backend and SQLite database are not described as fully migrated to AWS. The serverless CSV experiment is separate from the complete application workflow.

### 5.2 Cloud Architecture for Future Development

The diagram also presents a possible expanded architecture involving **Amazon Cognito, Amazon API Gateway, application Lambda functions, AWS Glue, Amazon Athena, and Amazon QuickSight**. These components represent a proposed direction for deeper cloud integration and analytics, **not a claim that those services were deployed in the completed demonstration**.

## 6. Key Data Workflows

### 6.1 Registration Import

- University registration data is exported from the existing portal in CSV/XLSX format.
- ADMIN imports the file into the platform.
- The backend processes records so they can be associated with activities and student accounts.

### 6.2 Real-Time Check-in and Check-out

- An organizer scans a student-card QR code using a scanner that supplies the student ID as keyboard input, or enters the student ID manually.
- Each check-in/check-out action is submitted immediately to the backend through an API request.
- The backend validates and stores the attendance record for later reconciliation and reporting.

### 6.3 Evidence Import and Reconciliation

- Participation evidence or feedback is collected through external forms and exported from Google Forms/Google Sheets.
- ADMIN imports the resulting CSV/XLSX file.
- The application compares registration, attendance, and evidence information to help determine participation status.

### 6.4 Analytics and Export

- The system aggregates activity and participation information for administrative review.
- ADMIN can inspect statistics and export reports to support documentation and follow-up work.

## 7. AWS Serverless CSV Processing Experiment

This experiment demonstrates file validation and processing with AWS services, independently of the main local application.

**Demo resources:**

- **S3 bucket:** `sap-data-project-2026-huflit01`
- **Lambda function:** `sap-csv-processor-demo`
- **Input object:** `lambda-demo/input/registrations.csv`
- **Output object:** `lambda-demo/processed/registrations-result.json`
- **CloudWatch log group:** `/aws/lambda/sap-csv-processor-demo`
- **IAM permissions:** A Lambda execution role with the access needed for its S3 operations and logging.

**Processing sequence:**

1. A sample registration CSV file is stored in Amazon S3.
2. The Lambda function is invoked using a manual test event in the demonstration.
3. The function reads the CSV, checks required fields, and identifies duplicate or invalid records.
4. A JSON processing result is written back to Amazon S3.
5. Execution details can be inspected in Amazon CloudWatch Logs.

**Recorded sample outcome:** Four input records were tested: two valid records, one duplicate, and one invalid record. The demonstration returned a successful processing response.

**Note:** An automatic S3 event trigger is not claimed as part of the verified demonstration.

## 8. Cloud Database Experiment

The DynamoDB exploration uses five operational data categories, represented by the following tables:

- `SAP-Activities`
- `SAP-Registrations`
- `SAP-Attendance`
- `SAP-Evidence`
- `SAP-Participation`

These tables illustrate a cloud-oriented data model. **SQLite remains the main persistence layer for the working local demo**, so the presence of DynamoDB tables does not imply that the whole application was migrated to DynamoDB.

## 9. Running the Local Demonstration

**Prerequisites:** Python environment and dependencies for the backend; Node.js and npm for the frontend; the local project source code and an appropriately configured demo database.

### Backend (Windows PowerShell)

```powershell
cd C:\Projects\student-activity-platform\backend
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
$env:SAP_DEMO_MODE="1"
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Swagger API documentation: `http://127.0.0.1:8000/docs`

### Frontend (separate PowerShell terminal)

```powershell
cd C:\Projects\student-activity-platform\frontend
$env:VITE_API_BASE_URL="http://127.0.0.1:8000"
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

Frontend URL: `http://127.0.0.1:5173/`

**Configuration note:** Port availability and CORS settings must match the actual frontend/backend origins. Demo credentials are intentionally not included in this submission; never publish passwords or access tokens.

## 10. Deployment and Verification

- The React/Vite frontend was deployed to AWS Amplify on the `main` branch.
- The local FastAPI backend was used for application demonstrations; a Cloudflare Quick Tunnel provided a temporary public HTTPS endpoint when needed.
- Application features were exercised through browser interactions and backend API testing.
- The AWS Lambda experiment was verified through a test execution, S3 output, and CloudWatch logs.
- AWS resources were reviewed for clean-up after the demonstrations. Any actual deletion should be documented using before/after evidence; this file does not claim that all resources were deleted.

The historical Amplify demo address was:

`https://main.d2p96elhe5x6se.amplifyapp.com`

Its current availability and backend connectivity depend on deployment status and the temporary tunnel configuration.

## 11. Results, Limitations, and Future Improvements

### Results

The project demonstrates an integrated workflow covering student activity management, imports, real-time attendance, reconciliation, administrative analytics, and reporting. It also documents practical AWS experiments for hosting, file processing, NoSQL storage, IAM permissions, and monitoring.

### Current Limitations

- The primary FastAPI backend and SQLite database operate in a local demo environment.
- The Amplify-hosted frontend depends on a separately reachable backend for live API operations.
- The S3/Lambda workflow is a focused experiment rather than the production ingestion pipeline for the entire application.
- The complete proposed AWS analytics stack has not been implemented.

### Future Improvements

- Deploy the backend to durable cloud infrastructure with secure networking and secrets management.
- Integrate operational data storage and improve backup/recovery strategies.
- Automate file ingestion and transformation with suitable event-driven services.
- Add CI/CD, infrastructure as code, tests, observability, and cost monitoring.
- Explore production-ready cloud analytics using services such as AWS Glue, Athena, and QuickSight when justified by requirements.

## 12. Submitted Materials

- **Architecture:** `student-activity-platform.drawio.xml` (editable diagrams.net XML)
- **Project description:** `student-activity-platform-description.md` (this document)
- **Workshop:** The First Cloud AI Journey workshop website submitted separately
- **Demo video and source code:** Shared using the corresponding submission form links, when available

---

*Prepared for the First Cloud AI Journey project submission. This description reflects the implemented local demo and verified AWS experiments while clearly separating proposed future architecture.*
