---
title: "Worklog Week 5"
date: 2026-10-05
weight: 5
chapter: false
pre: "<b>1.5.</b>"
---

### Week 5 Objectives:

* Begin developing the web interface for the **Student Activity Management & Engagement Analytics Platform**.
* Learn React, Vite, and Single Page Application (SPA) development concepts.
* Design a component-based Frontend architecture that is maintainable and extensible.
* Develop the Login interface and role-based navigation system.
* Implement Authentication and Authorization using the FastAPI Backend.
* Establish two primary user roles: **ADMIN** and **STUDENT**.
* Design session management, Bearer Token authentication, and protected API access.
* Develop interfaces for Activity Management, Student Account Management, and Personal Profiles.
* Create the initial Attendance and Reconciliation interfaces.
* Connect the React Frontend to FastAPI REST APIs.
* Test Login, role-based permissions, account management, and API interactions.
* Improve user experience, validation, and error handling in the local development environment.

### Tasks to Be Implemented This Week:

| Day | Tasks | Start Date | Completion Date | References |
| --- | --- | --- | --- | --- |
| Monday | - Study React and Vite for web application development. <br> - Initialize the Frontend structure within the `student-activity-platform` project. <br> - Learn JSX, Components, Props, State, and React Hooks. <br> - Organize source code into `src/components`, `src/pages`, and `src/services`. <br> - Design the main layout with a Sidebar, Header, content area, and navigation system. <br> - Identify key pages such as Login, Dashboard, Activities, Attendance, Reconciliation, and Profile. <br> - Verify the Frontend development environment using the Vite Development Server. | 05/10/2026 | 05/10/2026 | https://react.dev/ <br> https://vite.dev/ |
| Tuesday | - Develop the Login interface and Authentication workflow. <br> - Connect the Login form to the FastAPI `/auth/login` endpoint. <br> - Implement Bearer Token storage and usage in API requests. <br> - Explore session verification through `/auth/me` and Logout through `/auth/logout`. <br> - Handle invalid credentials, expired sessions, and unauthenticated states. <br> - Implement role-based navigation after Login. <br> - Test Authentication using synthetic accounts. | 06/10/2026 | 06/10/2026 | https://fastapi.tiangolo.com/tutorial/security/ <br> https://react.dev/ |
| Wednesday | - Establish the ADMIN and STUDENT authorization model. <br> - Develop role validation for protected Backend APIs. <br> - Identify pages and operations restricted to ADMIN. <br> - Develop the Student Account Management interface. <br> - Implement account listing, activation/deactivation, and password reset operations. <br> - Study student account synchronization. <br> - Verify that STUDENT users cannot access student account administration features. <br> - Test HTTP 403 responses when unauthorized roles attempt to access administrator endpoints. | 07/10/2026 | 07/10/2026 | https://fastapi.tiangolo.com/tutorial/security/ <br> Project access control documentation |
| Thursday | - Develop Activity Management interfaces. <br> - Connect the Frontend to activity creation, update, and retrieval APIs. <br> - Design activity forms and publication status displays. <br> - Implement activity lists and detail pages. <br> - Develop the Personal Profile page and account information update features. <br> - Explore password change and avatar management. <br> - Implement Loading, Success, and Error states for API interactions. <br> - Verify that the interface refreshes correctly after data changes. | 08/10/2026 | 08/10/2026 | https://react.dev/ <br> https://fastapi.tiangolo.com/ |
| Friday | - Develop Attendance and Reconciliation interfaces. <br> - Design a Student ID input area for manual entry or scanner-provided data. <br> - Connect Check-in/Check-out actions to FastAPI REST APIs. <br> - Display responses for successful attendance, missing registration, duplicate operations, and invalid input. <br> - Design Registration and Participation Status views. <br> - Review role-specific visibility and access controls. <br> - Test the Frontend → FastAPI → local data workflow using synthetic records. <br> - Document remaining UI and API issues for further improvement. | 09/10/2026 | 09/10/2026 | FastAPI and React documentation; Project Business Rules |

### Week 5 Achievements:

* **Established the React and Vite Frontend foundation:**
  * Initialized the React application for student activity management.
  * Configured the development environment and Vite Development Server.
  * Organized source code using a component-based architecture.
  * Separated Pages, Components, and Services.
  * Implemented the foundation for page navigation.
  * Designed a layout with a Sidebar, Header, and main content area.
  * Prepared the application for further development and eventual cloud deployment.

* **Developed the primary application pages:**
  * Login.
  * Dashboard.
  * Activity Management.
  * Student Account Management.
  * Attendance.
  * Reconciliation.
  * Personal Profile.

  The interfaces were designed to reuse components and communicate with the Backend through REST APIs.

* **Implemented FastAPI-based Authentication:**
  * Used the Backend to process and validate Login credentials.
  * Designed Bearer Token-based authentication.
  * Integrated or prepared the following API endpoints:
    * `/auth/login`.
    * `/auth/me`.
    * `/auth/logout`.
    * `/auth/change-password`.
  * Introduced session validation before accessing protected functions.
  * Handled Login failures and invalid session states.
  * Studied SQLite-based account and session persistence.

* **Established the ADMIN/STUDENT authorization model:**

  **ADMIN:**
  * Access administrative features.
  * Manage activities and publication status.
  * Manage student accounts.
  * Import Registration and Evidence records.
  * Perform or manage Attendance operations.
  * Reconcile and finalize participation results.
  * Access Analytics and Export functions.

  **STUDENT:**
  * Sign in and access permitted features.
  * View activities and their details.
  * Manage personal profile information.
  * Track individual participation history and results.
  * View relevant notifications.

* **Developed Student Account Management functionality:**
  * Designed the student account listing interface.
  * Developed or investigated the following operations:
    * Retrieve student account information.
    * Deactivate student accounts.
    * Reactivate student accounts.
    * Reset passwords.
    * Synchronize student accounts.
  * Identified administrative endpoints under `/admin/students`.
  * Applied authorization checks at the Backend rather than relying only on hidden UI elements.
  * Defined handling for STUDENT users attempting to access administrator-only APIs.

* **Developed Activity Management interfaces:**
  * Displayed activity lists and details.
  * Designed forms for creating and updating activities.
  * Displayed activity status information.
  * Explored activity approval, publication, and cancellation workflows.
  * Connected activity-related views to FastAPI.

* **Developed the Personal Profile interface:**
  * Designed profile viewing and information update functions.
  * Explored password change functionality.
  * Studied avatar upload and display processes.
  * Established requirements for preserving profile data after page reloads and subsequent logins.
  * Investigated validation for incomplete or invalid user information.

* **Developed the Attendance interface:**
  * Built an area for receiving Student ID input.
  * Connected Check-in/Check-out operations to REST APIs.
  * Displayed attendance statuses by activity.
  * Implemented feedback for successful attendance operations.
  * Investigated duplicate attendance and invalid input handling.
  * Identified scanner and camera integration as potential future improvements.

  **Note:** The system focused on real-time attendance API events during this development phase. Browser-based QR camera scanning was not considered a completed feature.

* **Developed the Reconciliation interface:**
  * Designed displays for Registration and Attendance records.
  * Prepared views for Evidence and Participation Status.
  * Identified records requiring manual review.
  * Designed interfaces for ADMIN participation confirmation.
  * Explored how reconciled results should be displayed.

* **Connected React to FastAPI REST APIs:**
  * Studied the Fetch API and reusable API request functions.
  * Developed a Service Layer for Frontend–Backend communication.
  * Used Bearer Tokens for authenticated requests.
  * Investigated CORS configuration for local development.
  * Implemented Loading, Success, and Error handling.
  * Tested basic data exchange between the Frontend and Backend.

  **Week 5 Application Flow:**

  **React/Vite Frontend → FastAPI REST API → SQLite / Local Application State**

* **Performed basic functional testing:**
  * Tested Login with ADMIN and STUDENT accounts.
  * Reviewed role-based navigation.
  * Verified that STUDENT users should not see administrative functions.
  * Tested Backend authorization requirements.
  * Tested activity creation and data display.
  * Reviewed account management operations.
  * Tested Attendance API requests.
  * Documented UI and API issues requiring additional work.

* **Clarified the actual system architecture:**
  * React and Vite were used for Frontend development.
  * Python and FastAPI were used for Backend development.
  * Authentication was implemented in the FastAPI Backend.
  * SQLite was used for local authentication and application state.
  * DynamoDB and S3 remained within limited AWS Pilot workflows.
  * Amazon Cognito was not used to replace FastAPI Authentication.
  * Amazon API Gateway was not used as the application's API entry point.
  * AWS Amplify was not reported as deployed during Week 5.

### Challenges and Lessons Learned:

* **React code organization:** As the number of pages increases, separating Components and Services helps reduce duplicated logic and improve maintainability.
* **Authentication management:** Token storage, Login state, and expired sessions must be handled consistently between the Frontend and Backend.
* **Role-based authorization:** Hiding ADMIN navigation items is insufficient; Backend permission checks are mandatory.
* **UI and data synchronization:** After creating or updating records, the interface must reflect the latest Backend data.
* **API error handling:** Authentication, authorization, validation, and network failures require different responses.
* **Attendance interface:** Reliable Check-in/Check-out API processing must be prioritized before adding browser-based QR camera features.
* **Phased deployment:** Completing core local functionality before AWS hosting reduces simultaneous development and deployment issues.

### Plan for Next Week:

* Continue improving the main Frontend interfaces.
* Develop Registration Import and Evidence Import pages.
* Build Preview, Validation, and Import workflows in the UI.
* Improve participant management views.
* Implement CSV/XLSX export functionality.
* Connect additional data processing APIs to the Frontend.
* Test missing, invalid, and duplicate input records.
* Prepare structured data for Reconciliation and Analytics development in subsequent weeks.