
---
title: "Serverless Data Processing with Amazon S3 and AWS Lambda"
date: 2026-11-09
weight: 10
chapter: false
pre: "<b>5.10.</b>"
---

## Serverless Data Processing with Amazon S3 and AWS Lambda

In this section, we will build and test a CSV data processing workflow using AWS services for the Student Activity Management & Engagement Analytics Platform.

After completing registration management, attendance recording, reconciliation, and Web Application deployment, we will extend the architecture with a Serverless Data Processing demonstration.

The objective is to use Amazon S3 for data storage, AWS Lambda for CSV processing, AWS IAM for access permissions, and Amazon CloudWatch for execution monitoring.

#### Introduction to Serverless Computing

Serverless Computing enables developers to build and run application functionality without directly managing servers.

AWS Lambda executes application code when invoked by an appropriate request or event.

In this workshop, Lambda reads student registration records from Amazon S3, validates the data, and generates a JSON result file.

#### AWS Services

| Service | Purpose |
| --- | --- |
| Amazon S3 | Store CSV input and JSON output |
| AWS Lambda | Process and validate CSV records |
| AWS IAM | Manage Lambda resource permissions |
| Amazon CloudWatch | Record logs and monitor execution |

#### Serverless Data Processing Architecture

```text
ADMIN / Developer
        |
        | Upload CSV
        v
Amazon S3 - Input
lambda-demo/input/registrations.csv
        |
        | Read input object
        v
AWS Lambda
sap-csv-processor-demo
        |
        +-- Validate Student ID
        +-- Detect Duplicates
        +-- Count Valid Records
        +-- Count Invalid Records
        |
        | Write JSON result
        v
Amazon S3 - Output
lambda-demo/processed/registrations-result.json

IAM Execution Role
        |
        +----> Lambda access permissions

AWS Lambda
        |
        +----> Amazon CloudWatch Logs
```

The Lambda Function is invoked through a Test Event in the AWS Lambda Console.

After invocation, the Function uses its IAM Execution Role permissions to read the CSV file from S3, process the records, and store the result.

![System Architecture](/images/2-Proposal/student_activity_architectur.drawio.png)

{{% notice note %}}
Serverless CSV Processing is an additional project demonstration. This workflow operates independently of the current FastAPI Backend's CSV/XLSX Import functionality.
{{% /notice %}}

#### AWS Resource Configuration

Resources used during the project exercise:

```text
Region: ap-southeast-1

S3 Bucket:
sap-data-project-2026-huflit01

Lambda Function:
sap-csv-processor-demo

IAM Policy:
SAP-Lambda-S3-Demo-Access

Input Object:
lambda-demo/input/registrations.csv

Output Object:
lambda-demo/processed/registrations-result.json
```

#### Workshop Workflow

1. Prepare the Amazon S3 Bucket.
2. Create a CSV file containing synthetic student records.
3. Upload the input file to S3.
4. Configure an IAM Execution Role.
5. Build the AWS Lambda CSV Processor.
6. Invoke Lambda using a Test Event.
7. Inspect the generated JSON file in Amazon S3.
8. Review CloudWatch Logs.
9. Evaluate processing results and execution duration.

#### Contents

1. [Set up Amazon S3 and prepare data](5.10.1-setup-s3/)
2. [Configure IAM Execution Role](5.10.2-configure-iam/)
3. [Build the AWS Lambda CSV Processor](5.10.3-create-lambda/)
4. [Test and monitor with CloudWatch](5.10.4-test-serverless/)

#### Objectives

After completing this section, you will be able to:

* Understand Serverless data processing principles.
* Store input and output data using Amazon S3.
* Configure IAM permissions using the Least Privilege principle.
* Develop a Lambda Function using Python and boto3.
* Read and process CSV data from Amazon S3.
* Identify valid, duplicate, and invalid records.
* Store processing results as JSON.
* Inspect Lambda execution using CloudWatch Logs.
* Distinguish manual Test Events from automated event-driven processing.

#### Actual Project Results

During the November 9, 2026 exercise, Lambda successfully processed four CSV records and generated:

```json
{
    "total": 4,
    "valid": 2,
    "duplicates": 1,
    "invalid": 1
}
```

The resulting JSON file was stored in Amazon S3 at:

```text
lambda-demo/processed/registrations-result.json
```

Lambda returned statusCode 200, and CloudWatch recorded an execution duration of 404.97 ms.

These results demonstrate a standalone AWS data processing workflow without requiring a dedicated processing server.

{{% notice note %}}
The current exercise uses a Lambda Test Event. Automatically invoking Lambda through S3 Event Notifications is a future extension.
{{% /notice %}}
