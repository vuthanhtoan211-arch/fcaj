
---
title: "Review Resources and Costs"
date: 2026-11-09
weight: 1
chapter: false
pre: "<b>5.11.1.</b>"
---

## Review Resources and Costs

Before performing clean-up, we need to inspect the AWS resources used by the Student Activity Management & Engagement Analytics Platform.

Resource inventory helps prevent accidental deletion and identify services that may incur charges.

#### 1. Verify AWS Account and Region

1. Sign in to the [AWS Management Console](https://console.aws.amazon.com/).
2. Verify the AWS Account.
3. Select:

```text
Asia Pacific (Singapore)
ap-southeast-1
```

4. Ensure that the Account and Region match the project environment.

<!--
![AWS region verification](/images/5-Workshop/5.11-Clean-up/aws-region.png)
-->

{{% notice note %}}
Standard IAM Roles and Policies are global resources, and AWS Billing operates at the account level. Therefore, resource inventory should not be limited to a single AWS Region.
{{% /notice %}}

#### 2. Review AWS Amplify Hosting

1. Open the [AWS Amplify Console](https://console.aws.amazon.com/amplify/).
2. Find the project's Frontend application.
3. Inspect the main branch.
4. Verify Deployment Status.
5. Record the Website URL.

The previous Demo used:

```text
https://main.d2p96elhe5x6se.amplifyapp.com
```

<!--
![Amplify resource inventory](/images/5-Workshop/5.11-Clean-up/amplify-review.png)
-->

Determine whether the Website is still needed for demonstrations or reporting.

#### 3. Review Amazon DynamoDB

Open the [Amazon DynamoDB Console](https://console.aws.amazon.com/dynamodb/).

Inspect the following five tables:

```text
SAP-Activities
SAP-Registrations
SAP-Attendance
SAP-Evidence
SAP-Participation
```

For each table, record:

* Table name.
* Current status.
* Billing mode.
* Storage size.
* Item count if available.
* Backup or Point-in-time recovery configuration.

<!--
![DynamoDB table inventory](/images/5-Workshop/5.11-Clean-up/dynamodb-review.png)
-->

{{% notice warning %}}
These five tables are primary business datasets within the project's AWS Integration. Retain them if they are needed for workshops, demonstrations, or further testing.
{{% /notice %}}

#### 4. Review Amazon S3

Open the [Amazon S3 Console](https://console.aws.amazon.com/s3/).

Select:

```text
sap-data-project-2026-huflit01
```

Inspect Objects under:

```text
lambda-demo/input/
lambda-demo/processed/
```

Also review any other Prefixes and Objects.

<!--
![S3 resource review](/images/5-Workshop/5.11-Clean-up/s3-review.png)
-->

Do not assume that the Bucket contains only the Lambda Demo files.

Inspect its complete contents before considering deletion.

#### 5. Review AWS Lambda

Open the [AWS Lambda Console](https://console.aws.amazon.com/lambda/).

Select:

```text
sap-csv-processor-demo
```

Review:

* Function State.
* Runtime.
* Memory.
* Timeout.
* Execution Role.
* Triggers.
* Environment variables.
* Last modified timestamp.

<!--
![Lambda resource review](/images/5-Workshop/5.11-Clean-up/lambda-review.png)
-->

Determine whether the Function is still required for the S3 – Lambda – S3 demonstration.

#### 6. Review AWS IAM

Open the [AWS IAM Console](https://console.aws.amazon.com/iam/).

Check the Execution Role:

```text
sap-csv-processor-demo-role-9ui2ib5d
```

Check the Policy:

```text
SAP-Lambda-S3-Demo-Access
```

Identify whether the Role or Policy is used by other resources.

Do not delete shared permissions without reviewing dependencies.

<!--
![IAM resource review](/images/5-Workshop/5.11-Clean-up/iam-review.png)
-->

#### 7. Review Amazon CloudWatch

Open the [Amazon CloudWatch Console](https://console.aws.amazon.com/cloudwatch/).

Navigate to Logs → Log groups.

Find:

```text
/aws/lambda/sap-csv-processor-demo
```

Review:

* Log Retention.
* Log Streams.
* Recent invocations.
* Log storage.
* Any recorded errors.

<!--
![CloudWatch resource review](/images/5-Workshop/5.11-Clean-up/cloudwatch-review.png)
-->

The earlier project exercise used a seven-day retention period.

#### 8. Review AWS Billing

Open [AWS Billing and Cost Management](https://console.aws.amazon.com/costmanagement/).

Inspect:

1. Bills.
2. Cost Explorer.
3. Service-level charges.
4. The relevant reporting period.
5. Any currently estimated charges.

<!--
![AWS billing overview](/images/5-Workshop/5.11-Clean-up/billing-overview.png)
-->

Review charges associated with:

* AWS Amplify Hosting.
* Amazon DynamoDB.
* Amazon S3.
* AWS Lambda.
* Amazon CloudWatch.

Actual costs depend on consumption, configuration, and current pricing.

Do not assume that every service is free.

#### 9. Review AWS Cost Explorer

In Billing and Cost Management:

1. Open Cost Explorer.
2. Choose the desired date range.
3. Group costs by Service.
4. Inspect individual service charges.
5. Record charges requiring follow-up.

<!--
![AWS cost explorer](/images/5-Workshop/5.11-Clean-up/cost-explorer.png)
-->

Cost data may be delayed. A single billing check does not prove that no additional charges will appear.

#### 10. Create a resource inventory

| Resource | Recommendation | Reason |
| --- | --- | --- |
| Amplify Frontend | Retain | Demonstrations |
| Five DynamoDB Tables | Retain | AWS Integration data |
| S3 Bucket | Retain | May contain project data |
| Lambda Function | Retain if needed | CSV Processing Demo |
| IAM Execution Role | Retain while required | Function permissions |
| CloudWatch Log Group | Retain as appropriate | Evidence and debugging |
| Cloudflare Quick Tunnel | Stop after Demo | Temporary endpoint |
| Local FastAPI | Stop when unused | Demo Backend |

This is a recommendation, not confirmation that resources have been cleaned up.

#### Results

After this section, we have identified resources to retain, disposable testing resources, and AWS costs requiring monitoring.

[Next: Stop the Demo Environment](../5.11.2-stop-demo/)
