---
title: "Serverless Data Processing with Amazon S3 and AWS Lambda"
date: 2026-11-09
weight: 10
chapter: false
pre: "<b>5.10.</b>"
---

# Serverless Data Processing with Amazon S3 and AWS Lambda

This section documents an **independent, actually tested CSV-processing experiment** developed for the Student Activity Management & Engagement Analytics Platform. It is not the primary FastAPI backend and is not described as a production, automatically triggered pipeline.

## 1. Objectives

- Store sample student registration records in a real Amazon S3 bucket.
- Configure the AWS IAM execution permissions required by Lambda.
- Write and test a Lambda function that reads and validates CSV data.
- Count valid, duplicate, and invalid records.
- Write the processing result as a JSON object back to S3.
- Review execution logs in Amazon CloudWatch.
- Capture and verify evidence for the FCAJ technical workshop.

## 2. Services Used

| AWS Service | Role in the experiment |
| --- | --- |
| Amazon S3 | Input CSV and output JSON object storage |
| AWS Lambda | Process and validate registration records |
| AWS IAM | Lambda execution role and access permissions |
| Amazon CloudWatch | Lambda execution logs and metrics |

**Region:** Asia Pacific (Singapore), `ap-southeast-1`.

## 3. Actual System Architecture

The following is the **project's actual architecture diagram**. It distinguishes the main React/Vite–FastAPI–SQLite application, the DynamoDB storage pilot, and this independent S3/Lambda test. The demo was invoked through a **Lambda Console Test Event**, not by an S3 event notification.

![Actual Student Activity Management and Engagement Analytics Platform architecture](/fcaj/images/2-Proposal/student_activity_architectur.drawio.png)

## 4. AWS Resources Tested

| Resource | Recorded identifier |
| --- | --- |
| Amazon S3 bucket | `sap-data-project-2026-huflit01` |
| Lambda function | `sap-csv-processor-demo` |
| IAM policy | `SAP-Lambda-S3-Demo-Access` |
| CSV input object | `lambda-demo/input/registrations.csv` |
| JSON output object | `lambda-demo/processed/registrations-result.json` |
| CloudWatch log group | `/aws/lambda/sap-csv-processor-demo` |

These names describe resources used at the time of the exercise. They may no longer exist after the AWS cleanup documented in section 5.11.

## 5. Test Procedure and Real Evidence

### Step 1 – Prepare the S3 bucket and CSV input

The input CSV contained four synthetic records, including one duplicate and one record with invalid data.

![Real S3 input object screenshot](/fcaj/images/5-Workshop/5.10-Serverless-Processing/s3-input-object.png)

### Step 2 – Configure IAM permissions

The Lambda execution role was configured to permit the required S3 operations and CloudWatch logging.

![Real Lambda execution role permissions](/fcaj/images/5-Workshop/5.10-Serverless-Processing/iam-role-permissions.png)

### Step 3 – Create and test AWS Lambda

The function was invoked manually with a **Test Event** in the AWS Lambda Console. The execution returned a successful result for the recorded test.

![Actual successful Lambda test execution](/fcaj/images/5-Workshop/5.10-Serverless-Processing/lambda-test-success.png)

### Step 4 – Verify JSON output in S3

Lambda stored a JSON summary of the processed registration data in the configured S3 output location.

![Actual processed JSON output in S3](/fcaj/images/5-Workshop/5.10-Serverless-Processing/s3-processed-result.png)

### Step 5 – Review CloudWatch logs

The CloudWatch records were used to inspect execution and troubleshooting information.

![Actual CloudWatch execution report](/fcaj/images/5-Workshop/5.10-Serverless-Processing/cloudwatch-execution-report.png)

## 6. Recorded Test Results

| Metric | Observed value |
| --- | ---: |
| Total CSV records | 4 |
| Valid | 2 |
| Duplicate | 1 |
| Invalid | 1 |
| Lambda response status code | 200 |

The results relate only to the four-record experimental sample. They do not demonstrate a production-scale load test.

## 7. Detailed Workshop Guides

1. [Set up Amazon S3 and prepare CSV data](5.10.1-setup-s3/)
2. [Configure the IAM execution role](5.10.2-configure-iam/)
3. [Create the Lambda CSV processor](5.10.3-create-lambda/)
4. [Test the serverless processing workflow](5.10.4-test-serverless/)

## 8. Conclusion

This exercise demonstrated how S3, Lambda, IAM, and CloudWatch work together in a focused serverless data-processing task. The core application's normal CSV/XLSX import, attendance management, reconciliation, and analytics still run through FastAPI in the implemented demo.
