---
title: "Worklog Week 11"
date: 2026-11-16
weight: 11
chapter: false
pre: "<b>1.11.</b>"
---


### Week 11 Objectives:

* Present and demonstrate the completed project.
* Present the AWS architecture and major system functions.
* Collect feedback from mentors and participants.
* Classify feedback based on priority and category.
* Apply final system improvements based on feedback.
* Complete the technical documentation and internship report.
* Standardize the source code and repository structure.
* Complete system deployment and operation instructions.
* Archive important project evidence and screenshots.
* Prepare the final system version for project handover.


### Tasks to be completed this week:

| Day | Tasks | Start Date | Completion Date | Reference |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Perform a final system check before the Demo <br> - Verify Demo accounts and datasets <br> - Verify the Web Application, APIs, and Analytics Dashboard <br> - Verify the realtime Check-in/Check-out workflow <br> - Review Registration and Evidence files prepared for the Demo <br> - Review screenshots, Architecture Diagram, and presentation materials | 16/11/2026 | 16/11/2026 | Demo Script, User Guide, and Test Report |
| 3 | - Demonstrate the **Student Activity Management and Engagement Analytics Platform** <br> - Present the business problem and proposed solution <br> - Present the AWS Architecture <br> - Demonstrate major functions: <br>&emsp; + Authentication <br>&emsp; + Activity Management <br>&emsp; + Registration Import <br>&emsp; + Realtime Check-in/Check-out <br>&emsp; + Evidence Import <br>&emsp; + Reconciliation <br>&emsp; + Export Results <br>&emsp; + Analytics Dashboard <br> - Answer questions related to the system architecture and operation | 17/11/2026 | 17/11/2026 | Workshop materials and Demo Presentation |
| 4 | - Consolidate feedback after the project Demo <br> - Classify feedback into: <br>&emsp; + Functionality <br>&emsp; + UI/UX <br>&emsp; + Data Processing <br>&emsp; + Security <br>&emsp; + Analytics <br>&emsp; + Documentation <br> - Identify issues that require immediate fixes and suggestions for Future Development <br> - Update the issue list and improvement plan | 18/11/2026 | 18/11/2026 | Feedback from mentors and Demo participants |
| 5 | - Apply final improvements based on feedback <br> - Fix remaining minor Frontend and Backend issues <br> - Adjust Dashboard presentation where necessary <br> - Improve validation and user-facing error messages <br> - Perform Regression Testing after modifications <br> - Update the Architecture Diagram, User Guide, API Documentation, and Test Report when required | 19/11/2026 | 19/11/2026 | Feedback, project source code, and documentation |
| 6 | - Finalize and standardize the source code on GitHub <br> - Review the README and repository structure <br> - Complete installation, configuration, and system execution instructions <br> - Consolidate project handover materials <br> - Archive screenshots and Demo results <br> - Review AWS resources and Billing <br> - Prepare the final version for project handover and Internship Report completion | 20/11/2026 | 20/11/2026 | GitHub Repository, AWS Documentation, and Internship Report |


### Expected Outcomes for Week 11:

* Successfully presented and demonstrated the **Student Activity Management and Engagement Analytics Platform**.

* Clearly explained the practical problem addressed by the system.

* Presented the overall AWS architecture using:

  * AWS Amplify.
  * Amazon Cognito.
  * Amazon API Gateway.
  * AWS Lambda.
  * Amazon DynamoDB.
  * Amazon S3.
  * AWS Glue.
  * Amazon Athena.
  * Amazon QuickSight.
  * AWS IAM.
  * Amazon CloudWatch.

* Demonstrated the major business workflow:

  **Login → Create Activity → Import Registration → Realtime Check-in/Check-out → Import Evidence → Reconciliation → Confirm Participation → Export Results → Analytics Dashboard**

* Explained the realtime Check-in/Check-out mechanism:

  * The organizer scans the QR code on a student's card.
  * The Frontend sends an API request.
  * API Gateway forwards the request to Lambda.
  * Lambda validates Registration.
  * Attendance is recorded in DynamoDB.
  * The result is immediately returned to the user.

* Confirmed that Check-in and Check-out continue to operate as realtime API events rather than Excel/CSV Attendance imports.

* Collected feedback from mentors and Demo participants.

* Classified feedback into:

  * Functionality.
  * UI/UX.
  * Data Processing.
  * Security.
  * Analytics.
  * Documentation.

* Identified:

  * Issues requiring immediate correction.
  * Suggestions for future development.
  * Acceptable limitations of the MVP.

* Applied final improvements based on received feedback.

* Performed Regression Testing to ensure that the major system functions remained stable after modifications.

* Updated the final versions of:

  * AWS Architecture Diagram.
  * API Documentation.
  * User Guide.
  * Test Report.
  * Demo Script.
  * Workshop materials.

* Standardized the GitHub Repository and project source code structure.

* Completed the README with:

  * Project overview.
  * System architecture.
  * AWS services and technologies.
  * Source code structure.
  * Installation instructions.
  * Configuration instructions.
  * System execution instructions.
  * Main functions.

* Prepared the complete project handover package:

  * Source code.
  * Architecture Diagram.
  * API Documentation.
  * User Guide.
  * Test Report.
  * Demo materials.
  * Workshop materials.
  * Screenshots.
  * Project results.

* Reviewed AWS resources and AWS Billing to ensure that unnecessary testing resources were no longer active.

* Completed the final system version for project handover and final Internship Report preparation.