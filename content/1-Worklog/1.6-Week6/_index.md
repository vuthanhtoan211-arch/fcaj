---
title: "Worklog Week 6"
date: 2026-10-12
weight: 6
chapter: false
pre: "<b>1.6.</b>"
---


### Week 6 Objectives:

* Complete the file processing pipeline using Amazon S3.
* Implement Registration and Evidence file uploads through the Web Application.
* Use Pre-signed URLs for secure file uploads to Amazon S3.
* Configure S3 Events to automatically trigger AWS Lambda processing.
* Complete input data validation, normalization, and transformation.
* Store processed data in Amazon DynamoDB and the Processed Data Bucket.
* Implement participation result exports in CSV/XLSX format.
* Prepare datasets for analytics.
* Configure the initial AWS Glue and Amazon Athena environment.
* Perform end-to-end testing of the data processing workflow.


### Tasks to be completed this week:

| Day | Tasks | Start Date | Completion Date | Reference |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Complete the file upload functionality in the Web Application <br> - Implement upload workflows for: <br>&emsp; + Registration Data <br>&emsp; + Evidence Data <br> - Create an API for requesting Pre-signed URLs from the Backend <br> - Use Pre-signed URLs to upload files directly from the Frontend to the Amazon S3 Raw Data Bucket <br> - Validate file type, size, and CSV/XLSX format <br> - Verify S3 access permissions | 12/10/2026 | 12/10/2026 | <https://docs.aws.amazon.com/s3/> |
| 3 | - Configure Amazon S3 Event Notifications <br> - Automatically invoke the File Processing Lambda when a new file is uploaded <br> - Complete File Processing Lambda functions for: <br>&emsp; + Reading CSV/XLSX files <br>&emsp; + Validating required fields <br>&emsp; + Normalizing Student IDs <br>&emsp; + Validating data formats <br>&emsp; + Detecting duplicate records <br>&emsp; + Detecting invalid records <br> - Record processing logs using Amazon CloudWatch | 13/10/2026 | 13/10/2026 | <https://docs.aws.amazon.com/lambda/> |
| 4 | - Store valid processed records in Amazon DynamoDB <br> - Store processed datasets in the Amazon S3 Processed Data Bucket <br> - Generate validation results for invalid records <br> - Test scenarios including: <br>&emsp; + Invalid Student ID <br>&emsp; + Missing required fields <br>&emsp; + Duplicate data <br>&emsp; + Invalid file format <br> - Display file processing status in the Web Application | 14/10/2026 | 14/10/2026 | Project Proposal and AWS Documentation |
| 5 | - Implement the Export Participation Results function <br> - Retrieve reconciliation results from DynamoDB <br> - Generate CSV/XLSX files containing: <br>&emsp; + Student ID <br>&emsp; + Student Name <br>&emsp; + Activity <br>&emsp; + Registration Status <br>&emsp; + Check-in Status <br>&emsp; + Check-out Status <br>&emsp; + Evidence Status <br>&emsp; + Participation Status <br> - Store generated files in the Amazon S3 Processed & Export Bucket <br> - Generate Pre-signed URLs for downloading the result files through the Web Application | 15/10/2026 | 15/10/2026 | <https://docs.aws.amazon.com/s3/> |
| 6 | - Prepare the Analytics Dataset from processed data <br> - Organize S3 data for analytics workloads <br> - Study AWS Glue Data Catalog <br> - Create a Glue Crawler to detect the dataset schema <br> - Study Amazon Athena and execute initial SQL queries <br>&emsp; + Total registered students <br>&emsp; + Total participating students <br>&emsp; + Participation rate <br>&emsp; + Number of NEEDS_REVIEW cases <br> - Verify the dataset in preparation for Dashboard development during the following week | 16/10/2026 | 16/10/2026 | <https://docs.aws.amazon.com/glue/> <br> <https://docs.aws.amazon.com/athena/> |


### Expected Outcomes for Week 6:

* Completed the upload and processing pipeline for:

  * Registration Data.
  * Evidence Data.

* Implemented the secure upload workflow:

  **Frontend → API Gateway → Lambda → Pre-signed URL → Amazon S3**

* Enabled users to upload CSV/XLSX files through the Web Application.

* Completed the automatic file processing workflow:

  **S3 Raw Data → S3 Event → File Processing Lambda**

* Implemented File Processing Lambda capabilities including:

  * Reading CSV/XLSX data.
  * Required field validation.
  * Student ID normalization.
  * Data format validation.
  * Duplicate detection.
  * Invalid record detection.
  * Separation of valid and invalid records.

* Stored valid structured records in Amazon DynamoDB.

* Stored normalized datasets in the Amazon S3 Processed Data Bucket.

* Generated validation information for records requiring review.

* Displayed file processing status through the Web Application.

* Maintained the realtime attendance architecture:

  * Check-in continues to be recorded through realtime API requests.
  * Check-out continues to be recorded through realtime API requests.
  * Only Registration and Evidence use the file import pipeline.

* Implemented the Export Participation Results function.

* Generated result files containing:

  * Student ID.
  * Student Name.
  * Activity.
  * Registration Status.
  * Check-in Status.
  * Check-out Status.
  * Evidence Status.
  * Participation Status.

* Generated participation result files in CSV/XLSX format.

* Stored generated files in the Amazon S3 Processed & Export Bucket.

* Generated Pre-signed URLs that allow authorized users to download result files from the Web Application.

* Prepared an Analytics Dataset from processed and reconciled data.

* Configured the initial AWS Glue Data Catalog for metadata management.

* Executed initial Amazon Athena queries for:

  * Total registered students.
  * Total participating students.
  * Participation rate.
  * Total absent students.
  * Cases requiring manual review.
  * Participation status statistics.

* Completed the main analytics data flow:

  **Web Application → S3 Raw Data → File Processing Lambda → DynamoDB / S3 Processed Data → AWS Glue → Amazon Athena**

* Prepared the required data and queries for building an Amazon QuickSight Analytics Dashboard during the following week.