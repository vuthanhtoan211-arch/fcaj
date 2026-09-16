---
title: "Worklog Week 4"
date: 2026-09-28
weight: 4
chapter: false
pre: "<b>1.4.</b>"
---


### Week 4 Objectives:

* Begin deploying the core backend components of the system on AWS.
* Configure access permissions and security policies based on the Least Privilege principle.
* Deploy Amazon DynamoDB for operational data storage.
* Deploy Amazon S3 for raw data, processed data, and export files.
* Deploy AWS Lambda functions for backend business logic.
* Deploy Amazon API Gateway to expose REST APIs.
* Connect the realtime Check-in/Check-out API to DynamoDB.
* Configure Amazon CloudWatch for logging and error monitoring.
* Perform backend integration testing in the AWS environment.


### Tasks to be completed this week:

| Day | Tasks | Start Date | Completion Date | Reference |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Prepare the AWS environment for the project <br> - Verify the deployment Region and AWS CLI configuration <br> - Study the **Least Privilege** principle <br> - Create required IAM Roles and Policies for Lambda, API Gateway, DynamoDB, S3, and CloudWatch <br> - Verify permissions between AWS services <br> - Monitor and control resources to minimize unnecessary AWS costs | 28/09/2026 | 28/09/2026 | <https://docs.aws.amazon.com/iam/> |
| 3 | - Create AWS data storage resources <br>&emsp; + Amazon DynamoDB for operational data <br>&emsp; + Amazon S3 Raw Data Bucket <br>&emsp; + Amazon S3 Processed/Export Bucket <br> - Define keys and main attributes for: <br>&emsp; + Activities <br>&emsp; + Students <br>&emsp; + Registrations <br>&emsp; + Attendance <br>&emsp; + Participation Status <br> - Test uploading Registration and Evidence data to Amazon S3 | 29/09/2026 | 29/09/2026 | <https://docs.aws.amazon.com/dynamodb/> <br> <https://docs.aws.amazon.com/s3/> |
| 4 | - Deploy AWS Lambda functions for backend processing <br>&emsp; + Registration processing <br>&emsp; + Evidence processing <br>&emsp; + Realtime Check-in/Check-out <br>&emsp; + Reconciliation Logic <br> - Deploy Amazon API Gateway <br> - Create basic REST API endpoints <br>&emsp; + Activity API <br>&emsp; + Registration API <br>&emsp; + Attendance API <br>&emsp; + Reconciliation API <br> - Integrate API Gateway with AWS Lambda | 30/09/2026 | 30/09/2026 | <https://docs.aws.amazon.com/lambda/> <br> <https://docs.aws.amazon.com/apigateway/> |
| 5 | - Connect AWS Lambda with Amazon DynamoDB and Amazon S3 <br> - Implement the realtime Check-in/Check-out workflow <br>&emsp; + Receive Student ID and Activity ID from the API <br>&emsp; + Validate Registration <br>&emsp; + Store CHECK_IN/CHECK_OUT events in DynamoDB <br>&emsp; + Return processing results to the client <br> - Handle unregistered students, invalid data, and duplicate attendance events <br> - Configure CloudWatch Logs for Lambda and API Gateway | 01/10/2026 | 01/10/2026 | <https://docs.aws.amazon.com/cloudwatch/> |
| 6 | - Perform end-to-end backend testing on AWS <br>&emsp; + Registration Upload <br>&emsp; + Evidence Upload <br>&emsp; + Realtime Check-in <br>&emsp; + Realtime Check-out <br>&emsp; + Reconciliation <br> - Compare AWS results with previous local testing results <br> - Verify data stored in DynamoDB <br> - Review logs and errors in CloudWatch <br> - Verify processed/export files in Amazon S3 <br> - Document issues and adjust system configuration | 02/10/2026 | 02/10/2026 | Project Proposal and AWS Documentation |


### Expected Outcomes for Week 4:

* Prepared the basic AWS environment for the project.

* Created and configured IAM Roles and Policies according to the **Least Privilege** principle.

* Deployed Amazon DynamoDB for major operational data, including:

  * Activities
  * Students
  * Registrations
  * Attendance
  * Participation Status

* Deployed Amazon S3 storage for:

  * Raw Data.
  * Processed Data.
  * Export Data.

* Successfully uploaded and validated Registration and Evidence data in Amazon S3.

* Deployed AWS Lambda functions for:

  * Registration processing.
  * Evidence processing.
  * Realtime Check-in.
  * Realtime Check-out.
  * Reconciliation.

* Deployed Amazon API Gateway and integrated it with AWS Lambda.

* Created the initial REST API endpoints for the platform.

* Implemented the realtime Check-in/Check-out workflow on AWS:

  * The QR Scanner sends a request to the API.
  * Amazon API Gateway receives the request.
  * AWS Lambda executes the business logic.
  * Lambda validates the student's Registration in DynamoDB.
  * Attendance data is written directly to DynamoDB.
  * The API immediately returns the processing result.

* Ensured that Check-in and Check-out continue to operate as **realtime API events** rather than Excel/CSV attendance imports.

* Integrated AWS Lambda with Amazon S3 for Registration and Evidence processing.

* Implemented the initial reconciliation workflow between:

  * Registration
  * Check-in
  * Check-out
  * Evidence

* Configured Amazon CloudWatch for:

  * Lambda Logs.
  * API Gateway Logs.
  * Error monitoring.
  * System debugging.

* Completed initial end-to-end backend testing in the AWS environment.

* Verified that the API Gateway → Lambda → DynamoDB workflow operates according to the system architecture.

* Completed the core AWS backend environment in preparation for Frontend development, Authentication, and system integration in the following week.