---
title: "Worklog Week 7"
date: 2026-10-19
weight: 7
chapter: false
pre: "<b>1.7.</b>"
---


### Week 7 Objectives:

* Build the student participation analytics dashboard.
* Connect Amazon QuickSight to the analytics data source.
* Develop KPIs for organizers and administrators.
* Visualize registration, participation, absence, and review statistics.
* Analyze participation data by activity, class, and participation status.
* Complete Amazon CloudWatch monitoring for the backend.
* Configure CloudWatch Alarms for important system errors.
* Perform full system integration testing from the Frontend to the Analytics Dashboard.
* Review AWS security permissions and access control.
* Monitor AWS resource usage and costs during testing.


### Tasks to be completed this week:

| Day | Tasks | Start Date | Completion Date | Reference |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Review the Analytics Dataset stored in Amazon S3 <br> - Verify the schema in AWS Glue Data Catalog <br> - Complete Amazon Athena queries for Dashboard metrics <br>&emsp; + Total registered students <br>&emsp; + Total participating students <br>&emsp; + Total absent students <br>&emsp; + Participation Rate <br>&emsp; + Number of NEEDS_REVIEW cases <br> - Verify data accuracy before visualization | 19/10/2026 | 19/10/2026 | <https://docs.aws.amazon.com/athena/> |
| 3 | - Study Amazon QuickSight <br> - Connect QuickSight to Amazon Athena <br> - Create an Analytics Dataset for visualization <br> - Build the initial KPI Cards <br>&emsp; + Total Registered Students <br>&emsp; + Total Participants <br>&emsp; + Participation Rate <br>&emsp; + Total Absent Students <br>&emsp; + Needs Review Cases <br> - Verify the data displayed on the Dashboard | 20/10/2026 | 20/10/2026 | <https://docs.aws.amazon.com/quicksight/> |
| 4 | - Complete the Analytics Dashboard <br> - Build visualizations for: <br>&emsp; + Participation Status Distribution <br>&emsp; + Participation Rate by Activity <br>&emsp; + Registration vs Participation <br>&emsp; + Student Participation by Class <br>&emsp; + Reconciliation Status Statistics <br> - Add filters for Activity, Class, and Participation Status <br> - Review Dashboard usability for Organizers and Admin users | 21/10/2026 | 21/10/2026 | <https://docs.aws.amazon.com/quicksight/> |
| 5 | - Complete Monitoring & Logging using Amazon CloudWatch <br> - Review Lambda Logs and API Gateway Logs <br> - Monitor metrics including: <br>&emsp; + Lambda Invocations <br>&emsp; + Lambda Errors <br>&emsp; + Lambda Duration <br>&emsp; + API Gateway Requests <br>&emsp; + HTTP 4XX / 5XX Errors <br> - Configure CloudWatch Alarms for important errors <br> - Review IAM Roles and Policies according to the Least Privilege principle | 22/10/2026 | 22/10/2026 | <https://docs.aws.amazon.com/cloudwatch/> <br> <https://docs.aws.amazon.com/iam/> |
| 6 | - Perform full system integration testing <br>&emsp; + User Login <br>&emsp; + Activity Management <br>&emsp; + Registration Import <br>&emsp; + Evidence Import <br>&emsp; + Realtime Check-in <br>&emsp; + Realtime Check-out <br>&emsp; + Reconciliation <br>&emsp; + Export Results <br>&emsp; + Analytics Dashboard <br> - Review logs and resolve remaining issues <br> - Verify permissions between system components <br> - Review active AWS resources and minimize unnecessary resource usage <br> - Document testing results for final system improvements | 23/10/2026 | 23/10/2026 | Project Proposal and AWS Documentation |


### Expected Outcomes for Week 7:

* Completed the Amazon Athena queries required for analytics.

* Defined the major system KPIs:

  * Total Registered Students.
  * Total Participants.
  * Participation Rate.
  * Total Absent Students.
  * Total Needs Review Cases.

* Completed the analytics workflow:

  **Amazon S3 → AWS Glue Data Catalog → Amazon Athena → Amazon QuickSight**

* Built the Analytics Dashboard using Amazon QuickSight.

* Displayed key information including:

  * Total registered students.
  * Total participating students.
  * Participation rate.
  * Total absent students.
  * Number of cases requiring review.
  * Participation status distribution.

* Developed visualizations for:

  * Registration vs Participation.
  * Participation Rate by Activity.
  * Participation Status Distribution.
  * Student Participation by Class.
  * Reconciliation Status.

* Added Dashboard filters for:

  * Activity.
  * Class.
  * Participation Status.

* Enabled Organizers and Admin users to analyze student participation data through visual dashboards instead of relying only on raw data.

* Completed system monitoring using Amazon CloudWatch.

* Monitored major AWS Lambda metrics:

  * Invocations.
  * Errors.
  * Duration.

* Monitored Amazon API Gateway metrics:

  * Request Count.
  * HTTP 4XX Errors.
  * HTTP 5XX Errors.

* Configured initial CloudWatch Alarms for important backend errors.

* Reviewed and adjusted IAM Roles and Policies according to the **Least Privilege** principle.

* Completed integration testing of the overall workflow:

  **User → Amplify → Cognito → API Gateway → Lambda → DynamoDB / S3 → Glue → Athena → QuickSight**

* Successfully tested the main system functions:

  * Authentication.
  * Activity Management.
  * Registration Import.
  * Evidence Import.
  * Realtime Check-in.
  * Realtime Check-out.
  * Reconciliation.
  * Export Results.
  * Analytics Dashboard.

* Confirmed that Check-in and Check-out continue to operate as **realtime API events**.

* Reviewed system logs and identified remaining issues for further improvement.

* Reviewed active AWS resources to reduce unnecessary usage and minimize unexpected AWS costs.

* Completed the Analytics and Monitoring components in preparation for final optimization, system testing, and project documentation.