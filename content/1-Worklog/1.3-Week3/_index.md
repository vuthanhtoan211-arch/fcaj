---
title: "Worklog Week 3"
date: 2026-09-21
weight: 3
chapter: false
pre: "<b>1.3.</b>"
---

### Week 3 Objectives:

* Begin developing the core Backend functionality of the **Student Activity Management & Engagement Analytics Platform** in a local environment.
* Establish the Python and FastAPI project structure.
* Design REST APIs for activity management, student data, registration, and attendance.
* Understand how to organize Backend code using Routers, Services, Repositories, and Data Models.
* Implement the initial activity management functionality.
* Develop CSV/XLSX registration data reading, validation, and normalization.
* Build the foundation for Evidence Import.
* Develop real-time Check-in/Check-out APIs with registration and attendance status validation.
* Design reconciliation logic combining Registration, Attendance, and Evidence.
* Use synthetic datasets to test valid and invalid business scenarios.
* Prepare the Backend for future Amazon DynamoDB and Amazon S3 integrations.

### Tasks to Be Implemented This Week:

| Day | Tasks | Start Date | Completion Date | References |
| --- | --- | --- | --- | --- |
| Monday | - Initialize the **student-activity-platform** project structure using Python and FastAPI. <br> - Configure a Python Virtual Environment and install the required libraries. <br> - Explore FastAPI application structure and module organization. <br> - Separate Backend responsibilities into Router, Service, Repository, and Model components. <br> - Establish the application entry point and Health Check API. <br> - Learn how to run the local Backend using Uvicorn. | 21/09/2026 | 21/09/2026 | https://fastapi.tiangolo.com/ <br> https://www.uvicorn.org/ |
| Tuesday | - Design REST APIs for Activity Management. <br> - Define the Activity data structure, including Activity ID, title, time, location, and status. <br> - Develop the initial activity creation, update, and retrieval operations. <br> - Research approval, publication, and cancellation workflows. <br> - Define request and response models using Pydantic. <br> - Study HTTP error handling and input validation. <br> - Test activity APIs using synthetic activity records. | 22/09/2026 | 22/09/2026 | https://fastapi.tiangolo.com/ <br> https://docs.pydantic.dev/ |
| Wednesday | - Develop the Registration data processing module. <br> - Read student registration records from CSV/XLSX files. <br> - Validate required fields such as Student ID and student information. <br> - Normalize data and detect duplicate records. <br> - Design a Preview API that allows administrators to review data before importing. <br> - Build the Import workflow and registration retrieval functionality. <br> - Explore Evidence processing using CSV/XLSX files exported from Google Forms/Google Sheets. <br> - Prepare synthetic datasets containing valid, incomplete, and duplicate records. | 23/09/2026 | 23/09/2026 | https://pandas.pydata.org/docs/ <br> https://fastapi.tiangolo.com/tutorial/request-files/ |
| Thursday | - Develop real-time Attendance APIs for Check-in/Check-out. <br> - Define API inputs using Activity ID and Student ID. <br> - Design registration verification before recording attendance. <br> - Implement the logic for recording Check-in timestamps when API requests are processed. <br> - Build Check-out handling based on the current attendance state. <br> - Detect duplicate or invalid attendance operations. <br> - Explore the rules for opening and closing Check-out periods. <br> - Test Attendance APIs using synthetic student identifiers without relying on a physical QR camera. | 24/09/2026 | 24/09/2026 | https://fastapi.tiangolo.com/ <br> Attendance business requirements |
| Friday | - Analyze and develop Reconciliation logic combining Registration, Attendance, and Evidence. <br> - Define cases involving complete participation, missing Check-in, missing Check-out, missing Evidence, and missing attendance records. <br> - Design participation statuses and scenarios requiring ADMIN review. <br> - Build the initial APIs for reconciliation and result retrieval. <br> - Explore the process for confirming or adjusting participation decisions. <br> - Test the business workflow with synthetic student records. <br> - Summarize completed modules and identify improvements for the following week. | 25/09/2026 | 25/09/2026 | Project Proposal, Business Rules, and FastAPI Documentation |

### Week 3 Achievements:

* **Established the FastAPI Backend foundation:**
  * Initialized the Python project structure.
  * Configured the local development environment and required dependencies.
  * Learned how to run the Backend using Uvicorn.
  * Organized Backend components using a separation-of-concerns approach.
  * Established the REST API foundation for implementing business features.

* **Developed the initial Backend code structure:**
  * `app/main.py`: Application entry point and Router registration.
  * `app/routers/`: HTTP request handling.
  * `app/services/`: Business logic implementation.
  * `app/repositories/`: Data access and preparation for additional storage integrations.
  * Authentication, error handling, and persistence modules were organized according to development requirements.

  Separating these layers helps reduce dependencies between APIs, business logic, and data storage.

* **Developed the Activity Management module:**
  * Designed activity attributes, including identifiers, titles, descriptions, schedules, and statuses.
  * Established the initial logic for creating and updating activities.
  * Defined activity lifecycle states for approval and publication workflows.
  * Designed APIs for listing and retrieving activity details.
  * Introduced input validation and business error handling.

* **Developed the Registration Import workflow:**
  * Studied CSV/XLSX reading and processing techniques.
  * Identified required registration fields.
  * Established Student ID normalization and missing-data validation.
  * Designed duplicate and invalid record detection.
  * Defined the workflow **Preview → Validate → Import → View Registrations**.
  * Established the requirement to validate records before committing them to the official registration dataset.

* **Explored Evidence processing:**
  * Identified Google Forms/Google Sheets as sources of evidence data.
  * Designed the process for importing exported CSV/XLSX files.
  * Investigated Evidence validation using Student ID and Activity ID.
  * Defined situations involving invalid evidence or records that do not match the registration dataset.
  * Prepared the foundation for using Evidence during participation reconciliation.

* **Developed real-time Attendance APIs:**
  * Designed Check-in and Check-out APIs associated with Activity IDs.
  * Used Student IDs to identify students during attendance processing.
  * Established registration checks before accepting attendance events.
  * Designed timestamp recording during Backend request processing.
  * Introduced duplicate attendance prevention.
  * Defined invalid attendance scenarios.
  * Prepared the rules for opening and closing Check-out periods.

  **Important principle:** Check-in/Check-out data is recorded through APIs when attendance actions occur. Attendance is not primarily processed through batch Excel imports.

* **Designed the Reconciliation logic:**
  * Combined three primary data sources:
    * Registration.
    * Attendance.
    * Evidence.
  * Defined participation situations:
    * Registered students with complete attendance and evidence.
    * Missing Check-in.
    * Missing Check-out.
    * Missing Evidence.
    * No attendance records.
    * Records requiring ADMIN review.
  * Distinguished automatically evaluated results from cases requiring manual confirmation.
  * Established the foundation for Finalize and Export operations.

* **Tested business scenarios using synthetic datasets:**
  * Registered students with valid Check-ins.
  * Unregistered students attempting to Check in.
  * Duplicate Check-in attempts.
  * Invalid Check-out requests.
  * Missing Check-in or Check-out information.
  * Missing participation evidence.
  * Duplicate or incomplete Student IDs in imported files.
  * Records requiring manual reconciliation.

* **Improved understanding of REST API development:**
  * Studied HTTP methods such as GET, POST, PUT, and DELETE.
  * Learned the roles of Request Bodies, Path Parameters, and Query Parameters.
  * Explored HTTP status codes including 200, 400, 403, 404, 409, and 422.
  * Used Pydantic concepts for input validation.
  * Recognized the importance of consistent and informative API error responses.

* **Prepared for AWS integration:**
  * Identified Backend modules that could integrate with Amazon DynamoDB.
  * Identified file categories suitable for Amazon S3 storage.
  * Explored the Repository pattern to support future changes in persistence without rewriting core business logic.
  * Continued prioritizing local testing and synthetic data before provisioning AWS resources.

### Challenges and Lessons Learned:

* **Backend architecture:** Separating Routers, Services, and Repositories improves maintainability but requires clearly defined responsibilities.
* **Inconsistent imported data:** Registration and Evidence files may contain missing columns, invalid Student IDs, and duplicate records, making Preview and Validation essential.
* **Real-time attendance:** Correct handling of repeated Check-in/Check-out attempts is necessary, and attendance events must be processed immediately.
* **Multi-source reconciliation:** Registration alone is insufficient to confirm participation; Attendance and Evidence must also be considered.
* **Synthetic testing:** Using artificial records helps identify business logic errors without exposing real student information.
* **AWS preparation:** Local-first Backend development reduces complexity and cloud costs during the initial implementation phase.

### Plan for Next Week:

* Continue improving core Backend functionality.
* Refine data persistence and business logic testing.
* Research and implement limited AWS Pilot integrations using Amazon DynamoDB and Amazon S3.
* Test AWS read/write operations using synthetic data.
* Check consistency between local application state and selected AWS Pilot workflows.
* Document test results and prepare technical materials for the next integration phase.