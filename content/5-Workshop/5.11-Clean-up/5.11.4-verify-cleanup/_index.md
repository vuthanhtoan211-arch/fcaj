
---
title: "Verify Clean-up and Review Workshop"
date: 2026-11-09
weight: 4
chapter: false
pre: "<b>5.11.4.</b>"
---

## Verify Clean-up and Review Workshop

In this final section, we will verify resource management results and review the skills applied throughout the Student Activity Management & Engagement Analytics Platform Workshop.

The objective is to confirm that the Demo environment has been stopped appropriately, important resources remain protected, and workshop evidence has been documented.

#### 1. Verify the local environment

Open PowerShell and inspect port 8001:

```powershell
Get-NetTCPConnection -LocalPort 8001 -State Listen -ErrorAction SilentlyContinue
```

Verify:

* FastAPI Demo is stopped if no longer needed.
* Cloudflare Quick Tunnel is stopped.
* Vite Development Server is stopped when unused.
* Source code remains available.
* Required SQLite Demo data is preserved.

<!--
![Local cleanup verification](/images/5-Workshop/5.11-Clean-up/local-verification.png)
-->

If the Backend is needed for another demonstration, document its active state rather than requiring shutdown.

#### 2. Verify AWS Amplify

Open AWS Amplify Console.

Verify:

* The Amplify App remains available if required.
* The main branch is still deployed.
* Build History can be accessed.
* The Website URL has been documented.
* The Backend connection uses a temporary Tunnel URL.

<!--
![Amplify final verification](/images/5-Workshop/5.11-Clean-up/amplify-final.png)
-->

If the Tunnel is stopped, Frontend assets may still load while Backend-dependent features remain unavailable.

This matches the current Demo architecture.

#### 3. Verify Amazon DynamoDB

Open DynamoDB Console in ap-southeast-1.

Retain the following tables if still needed:

```text
SAP-Activities
SAP-Registrations
SAP-Attendance
SAP-Evidence
SAP-Participation
```

<!--
![DynamoDB final verification](/images/5-Workshop/5.11-Clean-up/dynamodb-final.png)
-->

Inspect table status and required backups.

Demo data does not need to be deleted if it remains necessary for internship reporting.

#### 4. Verify Amazon S3

Open S3 Console and select:

```text
sap-data-project-2026-huflit01
```

Review data requiring retention.

If Lambda demonstrations will continue, preserve:

```text
lambda-demo/input/registrations.csv
lambda-demo/processed/registrations-result.json
```

<!--
![S3 final verification](/images/5-Workshop/5.11-Clean-up/s3-final.png)
-->

Confirm that no important Objects have been accidentally deleted.

#### 5. Verify AWS Lambda and IAM

If the following Function is retained:

```text
sap-csv-processor-demo
```

Verify:

* The Function exists.
* The Execution Role is correctly configured.
* Required IAM Policies remain attached.
* No unintended changes have been made.
* The Test Event can be reused when needed.

<!--
![Lambda final verification](/images/5-Workshop/5.11-Clean-up/lambda-final.png)
-->

Another Lambda invocation is not required merely to confirm that the resource exists and its configuration is intact.

#### 6. Verify Amazon CloudWatch

Inspect:

```text
/aws/lambda/sap-csv-processor-demo
```

If retained:

* Verify Log Retention.
* Review required execution evidence.
* Save screenshots before important Logs expire.

<!--
![CloudWatch final verification](/images/5-Workshop/5.11-Clean-up/cloudwatch-final.png)
-->

The exercise used a seven-day retention period. Older Logs may no longer be available during later reviews.

#### 7. Review final Billing information

Open AWS Billing and Cost Management.

Inspect:

* Service-level costs.
* Remaining resources.
* The selected reporting period.
* Any charges requiring continued monitoring.

<!--
![Final billing review](/images/5-Workshop/5.11-Clean-up/billing-final.png)
-->

Do not assume that stopping local services eliminates all AWS charges.

#### 8. Review the AWS services used

The project and Workshop explored six main AWS services.

| Service | Project Role |
| --- | --- |
| AWS Amplify Hosting | React/Vite Frontend deployment |
| Amazon DynamoDB | Cloud business data storage testing |
| Amazon S3 | CSV and JSON storage |
| AWS Lambda | Serverless CSV processing |
| AWS IAM | Resource access management |
| Amazon CloudWatch | Lambda logging and monitoring |

Supporting technologies:

* FastAPI Backend.
* React/Vite Frontend.
* SQLite Local Persistence.
* Cloudflare Quick Tunnel.
* GitHub.
* Python and boto3.

#### 9. Review implemented functionality

The Workshop covered:

1. Student activity management.
2. ADMIN/STUDENT authentication and authorization.
3. CSV/XLSX registration imports.
4. Real-time Check-in and Check-out.
5. Evidence imports from Google Forms/Google Sheets.
6. Registration, Attendance, and Evidence reconciliation.
7. Participation confirmation.
8. Analytics Dashboard.
9. Report Export.
10. Frontend deployment and Demo Backend connectivity.
11. Serverless CSV processing using Lambda and S3.

These features were developed and tested at different scopes. The system should not be described as fully migrated to AWS Production.

#### 10. Summarize verified results

| Area | Recorded Scope |
| --- | --- |
| Frontend Deployment | Amplify Hosting |
| Backend Connectivity | Cloudflare Quick Tunnel |
| ADMIN/STUDENT Login | Tested |
| Activity Creation | Tested in Demo |
| DynamoDB Integration | AWS Pilot |
| S3 CSV Processing | Lambda Test Event |
| CSV Result | 4 records: 2 valid, 1 duplicate, 1 invalid |
| Output Storage | S3 JSON Object |
| Monitoring | CloudWatch Logs |

These results represent the previously recorded testing scope.

Comprehensive Load Testing, Production Backend deployment, and high-concurrency verification have not been established.

#### 11. Review learning outcomes

Throughout the Workshop, learners practiced:

* Designing Cloud-connected Web architectures.
* Developing REST APIs using Python/FastAPI.
* Building React/Vite interfaces.
* Organizing and processing student activity data.
* Integrating Amazon DynamoDB.
* Deploying Frontend applications using AWS Amplify Hosting.
* Building AWS Lambda processing functions.
* Managing access with IAM.
* Monitoring execution using CloudWatch.
* Reviewing costs and managing AWS resource lifecycles.

These are foundational skills for Cloud Computing and Data Engineering.

#### 12. Explore future improvements

Potential improvements include:

* Hosting FastAPI on a Cloud service with a stable Endpoint.
* Extending DynamoDB integration where appropriate.
* Automating S3 and Lambda processing.
* Improving monitoring and alerting.
* Strengthening security and Secret management.
* Performing performance and concurrent load testing.
* Improving deployment automation.
* Developing operational and data recovery documentation.

These items are future improvements rather than completed components of the existing Demo.

#### 13. Complete the workshop checklist

| Item | Status to Verify |
| --- | --- |
| Source code preserved | Check |
| Workshop documentation completed | Check |
| Evidence screenshots prepared | Check |
| Demo environment stopped appropriately | Check |
| AWS resources inventoried | Check |
| Required data preserved | Check |
| AWS costs reviewed | Check |
| Test resources managed | Check |

Update each item based on the actual environment.

#### Conclusion

The Student Activity Management & Engagement Analytics Platform Workshop provided practical experience across Web Application development and AWS integration.

Through Amplify Hosting, DynamoDB, S3, Lambda, IAM, and CloudWatch, learners explored application deployment, data storage, processing, and monitoring in a Cloud environment.

Combining Registration, Attendance, Evidence, Reconciliation, and Participation demonstrated how a data-driven platform can support a real-world educational management problem.

Resource lifecycle management at the end of the Workshop helps ensure that the exercise concludes safely, unnecessary costs are limited, and important project data remains available.

**Workshop Completed – Student Activity Management & Engagement Analytics Platform.**
