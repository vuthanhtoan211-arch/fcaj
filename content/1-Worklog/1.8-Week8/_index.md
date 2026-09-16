---
title: "Worklog Week 8"
date: 2026-10-26
weight: 8
chapter: false
pre: "<b>1.8.</b>"
---


### Week 8 Objectives:

* Perform comprehensive testing of the integrated system.
* Identify and resolve remaining Frontend and Backend issues.
* Test Authentication and Authorization.
* Verify the correctness of business rules.
* Perform basic API and realtime Check-in/Check-out performance testing.
* Test abnormal data and system error scenarios.
* Conduct User Acceptance Testing (UAT).
* Improve the user interface and user experience.
* Review AWS security configurations.
* Review AWS resources and optimize cloud costs.
* Prepare a stable system version for demonstration and reporting.


### Tasks to be completed this week:

| Day | Tasks | Start Date | Completion Date | Reference |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Review issues identified during the previous integration testing phase <br> - Classify issues related to Frontend, Backend, Data Processing, and Analytics <br> - Verify API endpoints <br> - Fix request/response, validation, and error-handling issues <br> - Verify data consistency between DynamoDB, Amazon S3, and the Web Application | 26/10/2026 | 26/10/2026 | Testing documents and AWS Documentation |
| 3 | - Perform Authentication and Authorization testing <br> - Review the Amazon Cognito User Pool <br> - Verify JWT Tokens and Cognito Authorizer <br> - Test permissions for Youth Union Staff and Admin users <br> - Test API access without a Token or with an invalid Token <br> - Review IAM Roles and Policies according to the Least Privilege principle <br> - Verify Amazon S3 and DynamoDB permissions | 27/10/2026 | 27/10/2026 | <https://docs.aws.amazon.com/cognito/> <br> <https://docs.aws.amazon.com/iam/> |
| 4 | - Test business rules and basic system performance <br> - Test realtime Check-in/Check-out with multiple consecutive requests <br> - Verify scenarios including: <br>&emsp; + Unregistered student <br>&emsp; + Duplicate Check-in <br>&emsp; + Check-out without Check-in <br>&emsp; + Missing Evidence <br>&emsp; + Duplicate Registration <br>&emsp; + Invalid Student ID <br> - Monitor Lambda Duration, Errors, and API response behavior using CloudWatch <br> - Optimize processing logic where necessary | 28/10/2026 | 28/10/2026 | <https://docs.aws.amazon.com/cloudwatch/> |
| 5 | - Conduct User Acceptance Testing (UAT) <br> - Test the system from the Youth Union Staff / Organizer perspective <br> - Test functions including: <br>&emsp; + Login <br>&emsp; + Activity Management <br>&emsp; + Registration Import <br>&emsp; + Evidence Import <br>&emsp; + Realtime Check-in/Check-out <br>&emsp; + Reconciliation <br>&emsp; + Export Results <br>&emsp; + Analytics Dashboard <br> - Record UI/UX and workflow issues <br> - Improve the interface and user-facing messages | 29/10/2026 | 29/10/2026 | Project Proposal and Test Cases |
| 6 | - Review and optimize AWS resources <br> - Review active AWS resources <br> - Remove or disable unnecessary testing resources <br> - Review CloudWatch Logs and log retention settings <br> - Review Amazon S3 storage usage <br> - Review Lambda and DynamoDB configurations <br> - Review AWS Billing / Cost Management <br> - Perform Regression Testing after bug fixes <br> - Prepare a stable system version for demonstration and documentation | 30/10/2026 | 30/10/2026 | <https://docs.aws.amazon.com/cost-management/> |


### Expected Outcomes for Week 8:

* Reviewed and resolved issues identified during the system integration testing phase.

* Improved the stability of the Frontend and Backend components.

* Successfully verified Authentication using Amazon Cognito.

* Confirmed the authentication workflow:

  **User → Amazon Cognito → JWT Token → API Gateway → Cognito Authorizer → AWS Lambda**

* Tested access permissions for:

  * Youth Union Staff / Organizer.
  * Admin / Management.

* Tested unauthorized access scenarios including:

  * Missing JWT Token.
  * Invalid Token.
  * Expired Token.
  * User without sufficient permissions.

* Reviewed IAM Roles and Policies according to the **Least Privilege** principle.

* Retested major system business rules:

  * Students must register before Check-in/Check-out.
  * Check-in must be recorded in real time.
  * Check-out must be recorded in real time.
  * Invalid duplicate Check-in events are rejected.
  * Check-in and Check-out sequence is validated.
  * Missing Evidence is detected.
  * Invalid data is detected.
  * Reconciliation follows the defined business rules.

* Confirmed that Check-in and Check-out continue to operate as **realtime API events** rather than imported Attendance files.

* Performed basic testing with multiple consecutive realtime attendance requests.

* Monitored important Amazon CloudWatch metrics:

  * Lambda Invocations.
  * Lambda Errors.
  * Lambda Duration.
  * API Gateway Requests.
  * HTTP 4XX Errors.
  * HTTP 5XX Errors.

* Completed User Acceptance Testing for:

  * Authentication.
  * Activity Management.
  * Registration Import.
  * Evidence Import.
  * Realtime Attendance.
  * Reconciliation.
  * Export Results.
  * Analytics Dashboard.

* Improved the Web Application to provide:

  * Better usability.
  * Clearer status information.
  * More understandable error messages.
  * Faster and simpler Check-in/Check-out operations for organizers.

* Performed Regression Testing after issue resolution to ensure that existing functions continued to work correctly.

* Reviewed active AWS resources.

* Removed or disabled unnecessary testing resources.

* Reviewed AWS Billing / Cost Management to minimize unexpected AWS costs.

* Prepared a stable system version for:

  * System demonstration.
  * Workshop preparation.
  * Technical documentation.
  * Internship report completion.