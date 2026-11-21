
---
title: "AWS Resource Clean-up"
date: 2026-11-09
weight: 11
chapter: false
pre: "<b>5.11.</b>"
---

## AWS Resource Clean-up

In the final workshop section, we will review, manage, and clean up resources used to build the Student Activity Management & Engagement Analytics Platform.

During AWS development, resources such as S3 Buckets, Lambda Functions, DynamoDB Tables, Amplify Apps, and CloudWatch Log Groups may remain active after an exercise is completed.

Effective resource lifecycle management helps reduce unnecessary costs and ensures resources are used appropriately.

### Objectives

After completing this section, you will be able to:

* Inventory the AWS resources used in the project.
* Review costs using AWS Billing and Cost Explorer.
* Stop the FastAPI Backend and Cloudflare Quick Tunnel.
* Distinguish resources to retain from disposable test resources.
* Back up necessary data before deletion.
* Verify the environment after clean-up.
* Complete workshop documentation and evidence.

### Resources to Review

| Service | Resource |
| --- | --- |
| AWS Amplify | React/Vite Frontend Hosting |
| Amazon DynamoDB | Five SAP business data tables |
| Amazon S3 | Project data storage bucket |
| AWS Lambda | sap-csv-processor-demo |
| AWS IAM | Execution Role and S3 Access Policy |
| Amazon CloudWatch | Lambda Logs and Metrics |
| Cloudflare | Quick Tunnel |
| Local Environment | FastAPI and SQLite Demo |

### Clean-up Principles

Before deleting any resource:

1. Identify whether the resource is still required.
2. Inspect whether it contains important data.
3. Review dependencies between services.
4. Back up data that must be retained.
5. Delete only resources confirmed to be unnecessary.
6. Verify the result after clean-up.

{{% notice warning %}}
Do not delete SAP-Activities, SAP-Registrations, SAP-Attendance, SAP-Evidence, or SAP-Participation while they are still required for Demo or AWS integration testing.

Do not delete the project S3 Bucket without reviewing its contents.
{{% /notice %}}

### Contents

1. [Review resources and costs](5.11.1-review-resources/)
2. [Stop the Demo environment](5.11.2-stop-demo/)
3. [Clean up AWS test resources](5.11.3-clean-aws/)
4. [Verify clean-up and review the workshop](5.11.4-verify-cleanup/)

### Expected Results

After completing this section, unnecessary Demo processes will be stopped, AWS resources will be reviewed, and important data will remain protected.

Resources required for future demonstrations, maintenance, or development should be explicitly marked for retention.

Clean-up does not require deleting the entire AWS environment. The main objective is safe and controlled resource management.
