---
title: "Worklog Week 5"
date: 2026-10-05
weight: 5
chapter: false
pre: "<b>1.5.</b>"
---


### Week 5 Objectives:

* Develop the Web interface for the Student Activity Management and Engagement Analytics Platform.
* Implement user authentication using Amazon Cognito.
* Configure access roles for Youth Union Staff and Admin users.
* Integrate the Frontend with the REST APIs deployed through Amazon API Gateway.
* Develop interfaces for activity and student data management.
* Develop the realtime Check-in/Check-out interface.
* Develop the participation reconciliation interface.
* Deploy the Frontend using AWS Amplify.
* Test authentication, API communication, and data presentation on the Web application.


### Tasks to be completed this week:

| Day | Tasks | Start Date | Completion Date | Reference |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Design the Web application structure <br> - Define the main application pages: <br>&emsp; + Login <br>&emsp; + Dashboard <br>&emsp; + Activities <br>&emsp; + Students / Registrations <br>&emsp; + Attendance <br>&emsp; + Reconciliation <br> - Initialize the Frontend using React or Next.js <br> - Organize components and application routing | 05/10/2026 | 05/10/2026 | Project Proposal and system design documents |
| 3 | - Create and configure Amazon Cognito <br> - Create a User Pool for Authentication <br> - Configure accounts for the main user groups <br>&emsp; + Youth Union Staff / Organizer <br>&emsp; + Admin / Management <br> - Integrate Sign in / Sign out into the Frontend <br> - Handle JWT Tokens after authentication <br> - Test valid and invalid login scenarios | 06/10/2026 | 06/10/2026 | <https://docs.aws.amazon.com/cognito/> |
| 4 | - Integrate the Frontend with Amazon API Gateway <br> - Configure JWT Token transmission in API requests <br> - Develop the Activity Management interface <br>&emsp; + View activity list <br>&emsp; + View activity details <br>&emsp; + Create/update activities based on user permissions <br> - Develop the registered student list interface <br> - Verify data returned from Lambda and DynamoDB | 07/10/2026 | 07/10/2026 | <https://docs.aws.amazon.com/apigateway/> |
| 5 | - Develop the Attendance interface for realtime Check-in/Check-out <br> - Simulate QR scanning through the Web interface <br>&emsp; + Receive Student ID / QR data <br>&emsp; + Send Check-in or Check-out request <br>&emsp; + Display the result immediately after receiving the API response <br> - Display messages for: <br>&emsp; + Successful Check-in <br>&emsp; + Successful Check-out <br>&emsp; + Unregistered student <br>&emsp; + Duplicate scan <br>&emsp; + Invalid data <br> - Develop the Attendance Status interface | 08/10/2026 | 08/10/2026 | Project Proposal and API Documentation |
| 6 | - Develop the Reconciliation interface <br>&emsp; + Display Registration <br>&emsp; + Check-in <br>&emsp; + Check-out <br>&emsp; + Evidence <br>&emsp; + Participation Status <br> - Allow organizers to review NEEDS_REVIEW cases <br> - Perform end-to-end testing from Frontend → API Gateway → Lambda → DynamoDB <br> - Deploy the Web Application using AWS Amplify <br> - Verify HTTPS access <br> - Identify and fix Frontend/API integration issues after deployment | 09/10/2026 | 09/10/2026 | <https://docs.aws.amazon.com/amplify/> |


### Expected Outcomes for Week 5:

* Developed the initial Web interface for the **Student Activity Management and Engagement Analytics Platform**.

* Completed the main application pages:

  * Login
  * Dashboard
  * Activities
  * Students / Registrations
  * Attendance
  * Reconciliation

* Integrated Amazon Cognito for user authentication.

* Configured the two main user groups:

  * Youth Union Staff / Organizer.
  * Admin / Management.

* Implemented basic authentication functions:

  * Sign in.
  * Sign out.
  * JWT Token handling.
  * User authentication state management.
  * Role-based access restrictions.

* Successfully connected the Frontend to Amazon API Gateway.

* Implemented authenticated API communication through the following workflow:

  * The user signs in.
  * Amazon Cognito authenticates the user.
  * Cognito returns a JWT Token.
  * The Frontend sends API requests with the JWT Token.
  * Amazon API Gateway receives the request.
  * AWS Lambda executes the business logic.
  * DynamoDB is queried or updated.
  * The result is returned and displayed on the Web interface.

* Developed the initial Activity Management interface with basic functions:

  * View activity list.
  * View activity details.
  * Create activities.
  * Update activity information.

* Developed the registered student management interface.

* Developed the realtime Check-in/Check-out interface.

* When an organizer scans a student's QR Code:

  * The Frontend sends the Student ID and Activity ID to the API.
  * The Backend validates the student's Registration.
  * A CHECK_IN or CHECK_OUT event is written to DynamoDB.
  * The processing result is returned and displayed immediately.

* Ensured that Check-in/Check-out continues to operate through **realtime API events** rather than Excel/CSV attendance imports.

* Developed the Reconciliation interface to display:

  * Registration Status.
  * Check-in Status.
  * Check-out Status.
  * Evidence Status.
  * Participation Status.

* Displayed important reconciliation results such as:

  * `READY`
  * `NEEDS_REVIEW: MISSING_CHECK_IN`
  * `NEEDS_REVIEW: MISSING_CHECK_OUT`
  * `NEEDS_REVIEW: MISSING_EVIDENCE`
  * `NO_ATTENDANCE`

* Deployed the Frontend application using AWS Amplify.

* Verified that the Web Application can be accessed securely through HTTPS.

* Completed the basic integrated application workflow:

  **AWS Amplify → Amazon Cognito → API Gateway → AWS Lambda → Amazon DynamoDB**

* Completed the initial Web Application in preparation for advanced file processing, reporting, data analytics, and dashboard development in the following week.