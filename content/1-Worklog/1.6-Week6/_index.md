---
title: "Worklog Week 6"
date: 2026-10-12
weight: 6
chapter: false
pre: "<b>1.6.</b>"
---

### Week 6 Objectives:

* Continue improving the data management capabilities of the **Student Activity Management & Engagement Analytics Platform**.
* Develop student Registration Import from CSV/XLSX files.
* Implement Preview and Validation before committing imported records.
* Normalize Student IDs and relevant student information.
* Detect duplicate, incomplete, or invalid records.
* Develop Evidence Import from Google Forms/Google Sheets exports.
* Build React interfaces for managing Registration and Evidence datasets.
* Connect the Frontend to FastAPI data processing endpoints.
* Research and develop Excel report generation.
* Prepare Check-in, Check-out, Absent, and Final Participation reports.
* Test data processing workflows using synthetic datasets.
* Prepare normalized data for Reconciliation and Analytics in subsequent weeks.

### Tasks to Be Implemented This Week:

| Day | Tasks | Start Date | Completion Date | References |
| --- | --- | --- | --- | --- |
| Monday | - Review Registration data structures and business requirements. <br> - Study CSV/XLSX processing in Python. <br> - Identify important fields such as Student ID, Full Name, Class, and Activity ID. <br> - Design file format and required-column validation. <br> - Research Student ID normalization and empty-value handling. <br> - Define the Registration Import workflow: **Upload → Preview → Validate → Import**. <br> - Prepare synthetic files containing valid and invalid records. | 12/10/2026 | 12/10/2026 | https://pandas.pydata.org/docs/ <br> https://openpyxl.readthedocs.io/ |
| Tuesday | - Develop Registration Import APIs using FastAPI. <br> - Implement data preview by Activity ID. <br> - Validate required fields and detect duplicate Student IDs. <br> - Categorize valid, invalid, and review-required records. <br> - Develop the Import workflow after Validation. <br> - Implement registration list retrieval. <br> - Test missing columns, blank values, duplicates, and unsupported file formats. <br> - Improve API error messages to help administrators verify files before importing. | 13/10/2026 | 13/10/2026 | https://fastapi.tiangolo.com/tutorial/request-files/ <br> Registration API documentation |
| Wednesday | - Develop CSV/XLSX Evidence processing. <br> - Analyze data exported from Google Forms/Google Sheets. <br> - Identify fields linking Evidence records to Student IDs and Activity IDs. <br> - Design and implement the Evidence Preview API. <br> - Detect missing information, duplicates, and records that do not match registered students. <br> - Develop Evidence Import and retrieval functionality. <br> - Review invalid data handling to prevent incorrect participation results. | 14/10/2026 | 14/10/2026 | https://fastapi.tiangolo.com/ <br> https://support.google.com/docs/ |
| Thursday | - Develop React interfaces for Registration and Evidence Import. <br> - Implement file selection and upload to the Backend. <br> - Display Preview tables before an administrator confirms Import. <br> - Show counts of valid, invalid, and duplicate records. <br> - Connect the user interface to Registration and Evidence APIs. <br> - Display imported datasets by activity. <br> - Handle Loading, Success, and Error states during uploads. <br> - Verify that only ADMIN can access Import functionality. | 15/10/2026 | 15/10/2026 | https://react.dev/ <br> Project API documentation |
| Friday | - Research Excel report generation from the Backend. <br> - Study OpenPyXL, Workbooks, and Worksheets. <br> - Define report categories: Final Results, Check-in, Check-out, and Absent. <br> - Build data aggregation logic by Activity ID. <br> - Design worksheet layouts, headers, and student data columns. <br> - Investigate handling of missing or invalid records during Export. <br> - Test report generation and downloads using synthetic data. <br> - Summarize the data processing modules and prepare for Reconciliation/Analytics. | 16/10/2026 | 16/10/2026 | https://openpyxl.readthedocs.io/ <br> Project Export documentation |

### Week 6 Achievements:

* **Developed the Registration Import workflow:**
  * Implemented the approach for reading student registration records from CSV/XLSX.
  * Validated file structure and required columns.
  * Normalized Student IDs and relevant student information.
  * Identified missing or duplicate records.
  * Established the **Preview → Validation → Import** workflow to prevent invalid data from being imported.
  * Enabled registration retrieval by activity.

* **Developed Registration API endpoints:**
  * `POST /activities/{activity_id}/registrations/preview` — preview imported registration records.
  * `POST /activities/{activity_id}/registrations/import` — import validated records.
  * `GET /activities/{activity_id}/registrations` — retrieve registration lists.

  The workflow was designed for registration data originating from external systems rather than requiring students to register again within the application.

* **Developed Evidence Import functionality:**
  * Studied and processed evidence exported from Google Forms/Google Sheets.
  * Designed Evidence relationships using Activity IDs and Student IDs.
  * Validated missing, duplicate, and inconsistent records.
  * Developed the Preview process before Import.
  * Prepared Evidence records for reconciliation with Registration and Attendance.

* **Developed Evidence API endpoints:**
  * `POST /activities/{activity_id}/evidence/preview` — preview evidence records.
  * `POST /activities/{activity_id}/evidence/import` — import evidence data.
  * `GET /activities/{activity_id}/evidence` — retrieve evidence records.

  Evidence was organized by activity to avoid mixing records from different events.

* **Developed React Import interfaces:**
  * Created interfaces for selecting and uploading CSV/XLSX files.
  * Connected Upload, Preview, and Import operations to the Backend.
  * Designed data tables for reviewing records before confirmation.
  * Displayed valid and review-required records.
  * Handled success and error messages.
  * Displayed imported records.
  * Restricted administrative Import operations to authorized ADMIN users.

* **Improved Python-based Excel data processing:**
  * Studied CSV/XLSX reading and writing.
  * Used tools for processing structured tabular data.
  * Learned how to create Workbooks and Worksheets.
  * Defined report formatting requirements.
  * Established data aggregation rules for business datasets.

* **Developed Export Results functionality:**
  * Designed activity-specific export endpoints.
  * Prepared the following report categories:
    * Final Results.
    * Check-in Records.
    * Check-out Records.
    * Absent Students.
  * Explored worksheet formatting and multi-sheet exports.
  * Investigated empty, missing, and invalid data handling.
  * Prepared Excel downloads for administrative reporting.

* **Developed the Export API:**
  * `GET /activities/{activity_id}/export/{export_type}`.

  The endpoint supports different output datasets depending on the export type selected by ADMIN.

* **Connected the Frontend to FastAPI:**
  * Used the Service Layer for HTTP requests.
  * Integrated file upload processes.
  * Displayed Preview results.
  * Managed loading states and validation errors.
  * Refreshed imported record lists after successful operations.
  * Reviewed access control for administrative features.

* **Tested data processing scenarios:**
  * Valid CSV/XLSX files.
  * Unsupported file formats.
  * Missing required columns.
  * Duplicate Student IDs.
  * Empty Student IDs.
  * Incomplete student information.
  * Evidence records that do not match Registration.
  * Files containing multiple invalid records.
  * Report generation with complete or incomplete datasets.

* **Prepared data for Reconciliation:**
  * Registration provides the student activity registration dataset.
  * Attendance provides real-time Check-in/Check-out events.
  * Evidence provides participation evidence records.
  * The datasets were normalized for future reconciliation.
  * Missing and inconsistent records were identified for ADMIN review.

* **Clarified the technical implementation scope:**
  * React/Vite was used for the Frontend.
  * Python/FastAPI handled Import, Validation, and Export.
  * SQLite supported local application state.
  * DynamoDB and S3 remained part of limited AWS Pilot workflows.
  * AWS Glue, Athena, and QuickSight were not used for Import/Export during this phase.
  * Check-in/Check-out continued to operate through real-time APIs rather than batch Excel imports.

### Challenges and Lessons Learned:

* **Inconsistent CSV/XLSX data:** Source files may have different column names, formats, or missing values, making normalization essential.
* **Duplicate detection:** Repeated Student IDs must be handled carefully to avoid inaccurate participation records.
* **Evidence processing:** Evidence exported from Google Forms may not fully match registration data.
* **Import user experience:** Preview allows administrators to identify issues before saving records.
* **File upload security:** Backend validation and administrative authorization are required.
* **Excel reporting:** Reports must use clear headers and readable formats for practical use.
* **Analytics preparation:** Early data normalization reduces downstream reconciliation and reporting errors.

### Plan for Next Week:

* Improve Reconciliation logic using Registration, Attendance, and Evidence.
* Define Participation Status categories.
* Develop ADMIN participation decisions and finalization functionality.
* Build the Analytics Dashboard.
* Identify metrics such as registration counts, attendance counts, absence rates, and completion rates.
* Connect reconciled data to reporting and statistics.
* Test data aggregation and visualization using synthetic datasets.