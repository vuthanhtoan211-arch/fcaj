
---
title: "Blog 1 - What Happens If I Remove Each AWS Service?"
date: 2026-09-18
weight: 1
chapter: false
pre: "<b>3.1.</b>"
---

# I TRIED “REMOVING” EACH AWS SERVICE FROM MY STUDENT ACTIVITY PLATFORM – WHERE WOULD THE SYSTEM BREAK?

## Understanding AWS Through a Practical Project

### 1. A Question While Learning AWS

When I first started learning AWS, I usually studied each service individually:

* Amazon S3 provides data storage.
* Amazon DynamoDB is a NoSQL database.
* AWS Lambda runs code without requiring direct server management.
* AWS IAM manages access permissions.
* Amazon CloudWatch monitors system resources.
* AWS Amplify supports Web Application deployment.

However, memorizing the definition of each service was not enough to understand how these services work together in a complete system.

While developing the Student Activity Management & Engagement Analytics Platform during my internship at First Cloud AI Journey (FCAJ), I asked myself:

**What would happen if I removed each AWS service from my system architecture?**

Would the entire application stop working, or would only specific features be affected?

This question became a useful way to understand the responsibilities and dependencies of AWS services instead of simply memorizing their definitions.

### 2. The Real-world Problem Behind the Project

My project focuses on managing and analyzing student participation in university activities.

For a large technology event such as IT Day, organizers need to manage:

* Student registration lists from the University Portal.
* Check-in and Check-out records.
* Participation evidence from Google Forms or Google Sheets.
* Reconciliation and participation confirmation results.
* Post-event statistical reports.

When an activity involves more than 1,000 registered students, manually comparing student IDs across multiple Excel files can become time-consuming.

Therefore, I developed a Web Application to centralize these processes.

### 3. System Architecture

The current version of the project uses:

* React/Vite for Frontend development.
* Python/FastAPI for Backend development.
* SQLite for persistence and recovery in the Demo environment.
* Amazon DynamoDB for cloud-based business data storage integration and testing.
* Cloudflare Quick Tunnel to connect the Frontend with the locally running Backend.

The project also integrates and experiments with six AWS services:

1. AWS Amplify.
2. Amazon DynamoDB.
3. Amazon S3.
4. AWS Lambda.
5. AWS IAM.
6. Amazon CloudWatch.

![Student Activity Management & Engagement Analytics Platform Architecture](/images/2-Proposal/student_activity_architectur.drawio.png)

The architecture consists of three main components.

**Web Application**

ADMIN and STUDENT users access the React/Vite interface hosted on AWS Amplify.

The browser sends REST API requests through Cloudflare Quick Tunnel to the FastAPI Backend.

**Cloud Data Storage**

FastAPI uses SQLite for local persistence while integrating Amazon DynamoDB through the AWS SDK for Python (boto3).

The business data groups integrated or tested with DynamoDB include Activities, Registrations, Attendance, Evidence, and Participation.

**Serverless CSV Processing Demo**

Amazon S3 stores input CSV files. AWS Lambda reads, validates, and processes the data before writing JSON results back to Amazon S3.

AWS IAM provides execution permissions, while Amazon CloudWatch records Lambda logs and execution information.

### 4. Removing AWS Amplify: Can Students Still Access the Website?

AWS Amplify Hosting is used to deploy the React/Vite Frontend.

When users visit the Website, their browsers load HTML, CSS, and JavaScript resources from the hosting environment.

After loading the interface, the browser sends API requests to the Backend.

If AWS Amplify were removed from the current architecture:

* The hosted Website would become unavailable at its current deployment URL.
* ADMIN and STUDENT users could no longer access the interface through that URL.
* The FastAPI Backend could continue running.
* SQLite and DynamoDB resources could still exist.
* The Lambda CSV Processor could continue operating independently.

AWS Amplify provides Frontend deployment and delivery rather than processing the application's entire business logic.

The Frontend could still be run locally for development and testing.

**Lesson learned:** Frontend Hosting and Backend Processing are separate responsibilities. A system may lose its public interface while its Backend and data remain available.

### 5. Removing Amazon DynamoDB: What Happens to Student Data?

Amazon DynamoDB is a managed NoSQL database service provided by AWS.

In my project, I integrated and tested the following data groups:

* Activities.
* Registrations.
* Attendance.
* Evidence.
* Participation.

These data groups support activity management, attendance tracking, and participation confirmation.

For example, when organizers record a student's participation, the information is associated with the corresponding student ID and activity.

```text
Student ID: 0818XXXXXX
Activity ID: ACT-DEMO-001
Check-in: Recorded
Check-out: Recorded
```

If DynamoDB were removed or became inaccessible to the application:

* AWS-based read and write operations would fail.
* Cloud persistence integrations would be interrupted.
* The application would no longer be able to retrieve cloud records without the required connectivity or permissions.
* Synchronization between local and AWS environments could be affected.

However, because the current Demo version still includes SQLite, local functionality could continue depending on Backend persistence and error-handling behavior.

Removing DynamoDB does not necessarily cause the entire application to stop working.

**Lesson learned:** A system must clearly define its primary data source, supplementary persistence mechanisms, and failure-handling behavior.

### 6. Removing Amazon S3: Does Lambda Still Have Data to Process?

Amazon S3 is an object storage service used to store data files.

In the Serverless CSV Processing Demo, S3 has two main responsibilities:

* Store input CSV files.
* Store processed JSON results.

Consider the following sample registration file:

```csv
student_id,full_name
0818000001,Student A
0818000002,Student B
0818000001,Student A
,Student C
```

The file contains four records, including a duplicate record and a record with a missing student ID.

AWS Lambda reads the file, validates each record, and generates a processing result.

If the input S3 storage were removed:

* Lambda would no longer have the required CSV input.
* The object retrieval operation could fail.

If the output S3 storage were removed:

* Lambda might still read and process the input.
* However, the result could not be stored in its intended location.

This would not necessarily interrupt Registration Import in the Web Application because that feature is handled separately by FastAPI.

**Lesson learned:** Amazon S3 is more than a file storage service. In Data Pipelines, it can serve as both the input data source and the output destination.

### 7. Removing AWS Lambda: Who Processes the CSV Data?

AWS Lambda allows developers to execute code without directly managing servers.

In my project, Lambda is used to demonstrate a Serverless CSV Processing workflow.

Its responsibilities include:

* Read CSV files from Amazon S3.
* Validate required fields.
* Detect duplicate records.
* Detect invalid records.
* Summarize processing results.
* Write JSON output back to S3.

One CSV Processor test produced the following results:

| Metric | Result |
| --- | --- |
| Total Records | 4 |
| Valid Records | 2 |
| Duplicate Records | 1 |
| Invalid Records | 1 |

If AWS Lambda were removed:

* The input CSV could remain available in Amazon S3.
* The file could still be downloaded.
* However, the Serverless CSV Processing Demo would no longer have a compute component to generate new JSON results.

Lambda is not the primary Backend of the current project.

Activity Management, Authentication, Attendance, Reconciliation, and Analytics are handled by FastAPI.

**Lesson learned:** AWS Lambda provides compute capabilities for independent tasks, particularly data processing workflows that run on demand.

### 8. Removing AWS IAM: Resources Without Permissions

During my AWS studies, I learned that creating a resource does not automatically allow an application to access it.

AWS IAM manages permissions and access to AWS resources.

For example, the Lambda CSV Processor requires appropriate permissions to:

* Read CSV files from S3.
* Write JSON results to S3.
* Send execution logs to CloudWatch.

If Lambda does not have permission to read an S3 object, the operation may return:

```text
AccessDenied
```

If Lambda can read the input but cannot write the output, the processing result cannot be saved as intended.

Without the necessary logging permissions, troubleshooting information may also become unavailable.

Removing required IAM permissions can therefore interrupt AWS workflows even when all the resources still exist.

IAM permissions should follow the Least Privilege principle, granting only the access required for each component's responsibilities.

**Lesson learned:** Cloud Security is not limited to protecting login credentials. It also means controlling which applications can perform specific actions on specific resources.

### 9. Removing Amazon CloudWatch: Would the System Still Run?

Amazon CloudWatch is used to monitor Lambda execution logs and metrics.

When the CSV Processor runs, CloudWatch helps me inspect:

* Whether Lambda was invoked.
* Whether errors occurred.
* Execution duration.
* Information recorded in execution logs.
* Data processing results.

Without CloudWatch Logs:

* Lambda could still execute if its other requirements and permissions were satisfied.
* CSV files could still be processed.
* JSON results could still be written to S3.
* However, identifying the causes of failures would become more difficult.

For example, if Lambda fails to generate a JSON file, logs can help determine whether the cause is a missing input file, invalid data, or incorrect IAM permissions.

**Lesson learned:** Monitoring does not necessarily produce business results directly, but it provides visibility into system behavior and supports troubleshooting.

### 10. Summary: Where Would the System Break?

| AWS Service | Responsibility | Impact If Removed |
| --- | --- | --- |
| AWS Amplify | Frontend Hosting | Website unavailable at the current hosting URL |
| Amazon DynamoDB | Cloud Database | DynamoDB read/write workflows interrupted |
| Amazon S3 | Object Storage | Missing input files or unavailable output storage |
| AWS Lambda | Serverless Compute | CSV Processing Demo cannot execute |
| AWS IAM | Access Control | Required resource access may be denied |
| Amazon CloudWatch | Monitoring | Reduced visibility into execution and errors |

Not every AWS service has the same impact on the overall system.

Some services directly support user-facing functionality, some manage data, and others provide security or monitoring.

This highlights the importance of assigning clear responsibilities to each architectural component.

### 11. A Learning Exercise for AWS Beginners

When studying an AWS architecture, I found it useful to ask four questions:

1. Where does this service receive its input?
2. What responsibility does it perform?
3. Where does its output go?
4. What happens if it becomes unavailable?

For AWS Lambda in my project:

* Input: CSV file stored in Amazon S3.
* Processing: Validate and classify records.
* Output: JSON file stored in Amazon S3.
* Failure: New processing results cannot be generated when Lambda does not execute.

This approach helps me understand architectures through data flow and service dependencies.

### 12. Conclusion

By analyzing the six AWS services in my Student Activity Management & Engagement Analytics Platform, I learned that building a Cloud system is not about combining as many services as possible.

The important considerations are:

* Selecting the appropriate service for each responsibility.
* Understanding data flows.
* Identifying component dependencies.
* Applying appropriate access permissions.
* Monitoring and troubleshooting failures.
* Considering scalability and operational costs.

The process of hypothetically removing individual services helped me understand AWS architectures from a more practical perspective.

Instead of simply memorizing what Amazon S3 or AWS Lambda does, I can now understand why each service is needed and how the system behaves without it.

This provides a valuable foundation for my future development in Cloud Computing and Cloud & Data Engineering.

**Note:** The service-removal scenarios in this article are hypothetical architecture analyses, not actual deletion of active AWS resources. The architecture and technical content have been updated to reflect the current project scope.

### 13. References

* [AWS Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)
* [Amazon DynamoDB Developer Guide](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html)
* [Amazon S3 User Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
* [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
* [AWS IAM User Guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)
* [Amazon CloudWatch User Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)
* [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)


> 📌 **Community Sharing:** This technical article has been published in the AWS Study Group VN Facebook community to share practical insights and encourage discussions about AWS Cloud Architecture.
>
> 🔗 **Original Post:** [Read the article on Facebook](https://www.facebook.com/share/p/1FBZRfrKJZ/)
