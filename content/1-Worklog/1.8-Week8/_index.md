---
title: "Worklog Week 8"
date: 2026-10-26
weight: 8
chapter: false
pre: "<b>1.8.</b>"
---

### Week 8 Objectives:

* Continue improving the **Student Activity Management & Engagement Analytics Platform** after developing its core modules.
* Perform integration testing between the React/Vite Frontend and the Python/FastAPI Backend.
* Review Authentication, session management, and role-based authorization.
* Verify access control for the ADMIN and STUDENT roles.
* Test Activity Management, Registration Import, Attendance, Evidence Import, Reconciliation, Analytics, and Export.
* Identify and address issues involving APIs, data processing, and user interfaces.
* Review data consistency after create, update, and page reload operations.
* Improve student account management and personal profile functionality.
* Test invalid Login attempts, expired sessions, and unauthorized API requests.
* Review the real-time Check-in/Check-out workflow to ensure timestamps are recorded when API requests are processed.
* Improve UI feedback, error handling, and usability across different screen sizes.
* Prepare source code, demo data, and environment configuration for future AWS Amplify deployment.

### Tasks to Be Implemented This Week:

| Day | Tasks | Start Date | Completion Date | References |
| --- | --- | --- | --- | --- |
| Monday | - Review the Frontend and Backend project structure. <br> - Verify that React/Vite and FastAPI start correctly in the local environment. <br> - Review critical API endpoints and Frontend–Backend connectivity. <br> - Test Authentication using `/auth/login`, `/auth/me`, and `/auth/logout`. <br> - Review Bearer Token storage and request handling. <br> - Identify invalid credentials, missing Tokens, and invalid session cases. <br> - Document issues requiring further investigation. | 26/10/2026 | 26/10/2026 | https://fastapi.tiangolo.com/tutorial/security/ <br> https://react.dev/ |
| Tuesday | - Review ADMIN and STUDENT authorization in both Frontend and Backend. <br> - Test access restrictions for student account administration APIs. <br> - Verify that STUDENT users cannot access administrative functionality. <br> - Review student account activation/deactivation and password reset. <br> - Check student account synchronization. <br> - Test password changes and personal profile updates. <br> - Review profile persistence after reloads and subsequent logins. <br> - Identify and address navigation and account-state display issues. | 27/10/2026 | 27/10/2026 | Authentication/Authorization notes and Admin Students API |
| Wednesday | - Test Activity Management and Registration Import workflows. <br> - Review activity creation, update, publication, and cancellation. <br> - Verify activity lists and detail views. <br> - Test CSV/XLSX Registration Preview and Import. <br> - Check duplicate Student IDs, missing information, and invalid formats. <br> - Review imported registration data after page reloads. <br> - Test Evidence Import and activity-related evidence mapping. <br> - Record data processing and API response issues. | 28/10/2026 | 28/10/2026 | Activity API, Registration API, and Evidence API documentation |
| Thursday | - Test the real-time Check-in/Check-out workflow. <br> - Verify Student ID and Activity ID handling in the Attendance interface. <br> - Check student registration before attendance recording. <br> - Test valid Check-ins, duplicate Check-ins, and invalid requests. <br> - Test Check-out operations and Check-out opening/closing rules. <br> - Review Backend timestamps and attendance statuses. <br> - Test Reconciliation after Attendance data changes. <br> - Review error messages and UI refresh behavior. | 29/10/2026 | 29/10/2026 | Attendance Service and Reconciliation API documentation |
| Friday | - Review Analytics Dashboard and Export Results. <br> - Compare aggregated metrics with Registration, Attendance, and Reconciliation data. <br> - Check empty Dashboard states and API errors. <br> - Review Final Results, Check-in, Check-out, and Absent reports. <br> - Inspect Loading, Success, and Error feedback in the UI. <br> - Review responsive layouts across device sizes. <br> - Check API Base URL configuration, environment variables, and files that must not be committed to GitHub. <br> - Prepare a plan for deploying the Frontend on AWS Amplify. | 30/10/2026 | 30/10/2026 | Analytics/Export documentation <br> https://vite.dev/guide/env-and-mode |

### Week 8 Achievements:

* **Reviewed Frontend–Backend integration:**
  * Verified the React/Vite and FastAPI application structure.
  * Identified endpoints consumed by the Frontend.
  * Reviewed REST API request and response handling.
  * Checked Bearer Token usage for authenticated requests.
  * Distinguished issues originating from the Frontend, Backend, and input datasets.
  * Prepared approaches for handling unavailable APIs and invalid responses.

* **Tested and improved Authentication:**
  * Reviewed successful Login scenarios.
  * Checked invalid credential handling.
  * Examined session validation.
  * Tested or reviewed Logout functionality.
  * Reviewed the following API endpoints:
    * `/auth/login`.
    * `/auth/me`.
    * `/auth/logout`.
    * `/auth/change-password`.
    * `/auth/profile`.
    * `/auth/avatar`.
  * Defined expected handling for expired sessions and invalid Tokens.
  * Reviewed account information persistence and update operations.

* **Reviewed ADMIN/STUDENT authorization:**
  * Confirmed that ADMIN and STUDENT are the application's two current roles.
  * Verified that administrative features should only be visible to ADMIN users.
  * Reviewed access restrictions for student account lists.
  * Checked Backend authorization requirements for protected operations.
  * Distinguished hidden UI elements from actual API protection.
  * Reviewed synchronization of Authentication and Authorization states across application pages.

* **Reviewed Student Account Management:**
  * Checked student account listing and detail APIs.
  * Reviewed account deactivation and reactivation.
  * Tested or examined password reset workflows.
  * Investigated student account synchronization.
  * Identified missing-account and invalid-data scenarios.
  * Reviewed success and error messages in administrative interfaces.

* **Reviewed Personal Profile functionality:**
  * Examined account information update operations.
  * Reviewed password change functionality.
  * Investigated avatar upload and display handling.
  * Checked profile persistence after page reloads.
  * Identified requirements for invalid inputs and unsuccessful updates.

* **Reviewed Activity Management:**
  * Checked activity creation and update operations.
  * Reviewed activity listing and detail views.
  * Examined approval, publication, and cancellation states.
  * Reviewed role-based activity visibility.
  * Identified invalid records and missing-activity cases.

* **Tested Registration and Evidence Import:**
  * Reviewed the Upload → Preview → Validation → Import workflow.
  * Checked CSV/XLSX format requirements.
  * Reviewed missing and duplicate Student IDs.
  * Examined invalid data and validation feedback.
  * Checked imported records after Import.
  * Reviewed links between Evidence and Registration.
  * Identified inconsistent records requiring manual review.

* **Reviewed real-time Attendance APIs:**
  * Checked Student ID handling in the Attendance interface.
  * Reviewed registration verification before Attendance processing.
  * Examined Check-in/Check-out timestamps.
  * Reviewed duplicate attendance prevention.
  * Examined Check-out opening and closing rules.
  * Checked attendance records and counter updates.
  * Prepared additional test cases for unregistered and ineligible students.

  **Note:** Check-in/Check-out continued to operate through real-time FastAPI requests. Browser-based QR camera scanning was not confirmed as a completed feature.

* **Reviewed Reconciliation functionality:**
  * Checked Registration, Attendance, and Evidence aggregation.
  * Reviewed records with missing Check-ins, Check-outs, or Evidence.
  * Examined participation decisions requiring ADMIN review.
  * Reviewed Decision and Finalize APIs.
  * Identified consistency requirements when source data changes.
  * Prepared result verification steps before report generation.

* **Reviewed the Analytics Dashboard:**
  * Examined the `/analytics` API and aggregated data responses.
  * Reviewed registration and participation metrics.
  * Examined participation and completion rate calculations.
  * Checked empty-data scenarios.
  * Reviewed Dashboard refresh behavior after business operations.
  * Identified potential UI improvements.

* **Reviewed Export Results:**
  * Examined activity-specific exports.
  * Reviewed report categories:
    * Final Results.
    * Check-in Records.
    * Check-out Records.
    * Absent Students.
  * Checked worksheet structure and Excel content.
  * Investigated missing-field handling.
  * Reviewed the Frontend download workflow.

* **Improved the user interface and user experience:**
  * Reviewed Sidebar, Header, and page layouts.
  * Examined feedback for unavailable Backend services.
  * Improved or identified improvements for Loading, Empty Data, and Success states.
  * Reviewed responsive behavior across screen sizes.
  * Identified interface components requiring usability improvements.
  * Reviewed role-based UI visibility.

* **Prepared for AWS Amplify deployment:**
  * Reviewed the Frontend structure and Build commands.
  * Studied the `VITE_API_BASE_URL` environment variable.
  * Identified the need for a secure HTTPS Backend endpoint when hosting the Frontend publicly.
  * Explored GitHub-based deployment workflows.
  * Prepared the use of Cloudflare Tunnel to expose an isolated local demo Backend.
  * Distinguished AWS Amplify Frontend hosting from a full AWS Backend deployment.

* **Clarified the implementation scope during Week 8:**
  * React/Vite remained the Frontend framework.
  * FastAPI handled Authentication and core business logic.
  * SQLite supported local application data and state.
  * Amazon DynamoDB and S3 remained limited AWS Pilot components.
  * AWS Amplify was not reported as successfully deployed during Week 8.
  * AWS Lambda was not used as the application's main Backend.
  * Cognito, API Gateway, Glue, Athena, and QuickSight were not part of the running application.

### Challenges and Lessons Learned:

* **Multi-module testing:** Systems with several components require both individual module tests and end-to-end workflow verification.
* **Authentication and Authorization:** Login testing should be combined with Backend permission verification.
* **Frequently changing data:** After Import, Attendance, and Reconciliation operations, the interface must reflect the updated application state.
* **Error handling:** Data, authorization, API, and network failures should be clearly distinguished.
* **Attendance verification:** Timestamps and duplicate prevention must be validated against actual test records.
* **Web deployment:** A public HTTPS Frontend cannot rely on a visitor's localhost HTTP Backend.
* **Data protection:** Public demos should use synthetic accounts and records rather than exposing real student information.
* **Cost management:** Existing infrastructure should be reused, and AWS resources should be checked before provisioning additional services.

### Plan for Next Week:

* Prepare the GitHub repository for application deployment.
* Finalize React/Vite Build configuration.
* Deploy the Frontend using AWS Amplify Hosting.
* Prepare an isolated FastAPI and SQLite demo Backend.
* Set up HTTPS access using Cloudflare Tunnel.
* Configure the API Base URL for the deployed environment.
* Test ADMIN and STUDENT Login using synthetic accounts.
* Verify the Frontend → HTTPS Backend → Demo Data workflow.
* Document deployment results and limitations.