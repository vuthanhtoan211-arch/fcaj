---
title: "Worklog Week 4"
date: 2026-09-28
weight: 4
chapter: false
pre: "<b>1.4.</b>"
---

### Week 4 Objectives:

* Continue improving the core Backend functionality of the **Student Activity Management & Engagement Analytics Platform**.
* Research and experiment with AWS cloud data storage services.
* Learn about Amazon DynamoDB and NoSQL data modeling.
* Design DynamoDB tables for activities, registrations, attendance, and participation results.
* Explore Amazon S3 and cloud-based file storage concepts.
* Develop the foundation for connecting FastAPI to AWS services using Boto3.
* Experiment with activity data storage in DynamoDB.
* Investigate real-time Check-in/Check-out persistence in DynamoDB through limited AWS Pilot workflows.
* Explore activity poster uploads and object management in Amazon S3.
* Evaluate data consistency between the local environment and selected AWS Pilot operations.
* Use synthetic data and isolated test activities to protect existing application records.
* Monitor AWS resource usage and minimize unnecessary expenses.

### Tasks to Be Implemented This Week:

| Day | Tasks | Start Date | Completion Date | References |
| --- | --- | --- | --- | --- |
| Monday | - Review the Backend structure and functionality developed during Week 3. <br> - Learn how to use Boto3 to connect Python applications to AWS. <br> - Study Amazon DynamoDB, NoSQL data models, and basic read/write operations. <br> - Understand Partition Keys, Sort Keys, and DynamoDB access patterns. <br> - Identify Backend modules suitable for DynamoDB Pilot integration. <br> - Research AWS Region settings and connection configuration for a test environment. | 28/09/2026 | 28/09/2026 | https://docs.aws.amazon.com/dynamodb/ <br> https://boto3.amazonaws.com/v1/documentation/api/latest/index.html |
| Tuesday | - Design the DynamoDB business data model. <br> - Study table structures for `SAP-Activities`, `SAP-Registrations`, `SAP-Attendance`, `SAP-Evidence`, and `SAP-Participation`. <br> - Identify important keys and attributes for each dataset. <br> - Design Repository components for Backend data access. <br> - Introduce the concept of environment-variable-based AWS Pilot configuration. <br> - Distinguish synthetic AWS test activities from regular local activities. <br> - Prepare synthetic activities and Student IDs for integration testing. | 29/09/2026 | 29/09/2026 | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ <br> Project data architecture notes |
| Wednesday | - Research and develop the Activity Management AWS Pilot workflow. <br> - Connect FastAPI to the `SAP-Activities` table. <br> - Experiment with creating, reading, and updating synthetic activity records. <br> - Compare API responses with records stored in DynamoDB. <br> - Investigate the `SAP_ACTIVITIES_AWS_PILOT` configuration flag. <br> - Study error handling when AWS is unavailable or credentials are missing. <br> - Ensure regular activities do not automatically use DynamoDB unless the appropriate Pilot mode is enabled. | 30/09/2026 | 30/09/2026 | https://docs.aws.amazon.com/dynamodb/ <br> FastAPI and AWS Pilot development notes |
| Thursday | - Research DynamoDB integration for Attendance processing. <br> - Study data structures for Check-in and Check-out events. <br> - Design immediate attendance persistence when API requests are processed. <br> - Explore how to enable the AWS Pilot for a dedicated synthetic activity. <br> - Define test scenarios for valid Check-ins, duplicate Check-ins, valid Check-outs, and duplicate Check-outs. <br> - Investigate consistency requirements when a DynamoDB write fails. <br> - Prepare isolated tests to prevent modifications to regular application data. | 01/10/2026 | 01/10/2026 | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ <br> Attendance API documentation |
| Friday | - Study Amazon S3 concepts, including Buckets, Objects, and Object Keys. <br> - Explore Boto3-based file uploads from FastAPI to S3. <br> - Design the object key structure for storing activity posters. <br> - Learn how Presigned URLs provide temporary access to stored objects. <br> - Investigate the relationship between image metadata in DynamoDB and file content in S3. <br> - Summarize AWS Pilot test scenarios for Activities, Attendance, and Posters. <br> - Review AWS resource usage and avoid unnecessary provisioning. <br> - Document remaining issues for continued integration testing. | 02/10/2026 | 02/10/2026 | https://docs.aws.amazon.com/s3/ <br> https://boto3.amazonaws.com/v1/documentation/api/latest/index.html |

### Week 4 Achievements:

* **Gained foundational knowledge of Amazon DynamoDB:**
  * Understood DynamoDB as an AWS-managed NoSQL database service.
  * Studied Tables, Items, and Attributes.
  * Learned the purposes of Partition Keys and Sort Keys.
  * Distinguished single-item reads from key-based queries.
  * Understood how application records can be mapped into DynamoDB data structures.

* **Designed the initial DynamoDB business data model:**
  * Investigated the following tables:
    * `SAP-Activities`.
    * `SAP-Registrations`.
    * `SAP-Attendance`.
    * `SAP-Evidence`.
    * `SAP-Participation`.
  * Identified the purpose of each table.
  * Analyzed relationships between Activity IDs, Student IDs, and business records.
  * Prepared the data structure for testing AWS storage operations using synthetic records.

* **Developed the AWS Pilot integration approach:**
  * Studied environment-variable-based AWS feature flags.
  * Distinguished regular local operation from AWS Pilot mode.
  * Investigated how to restrict AWS operations to selected test activities.
  * Established the requirement to use synthetic Student IDs and activity data.
  * Prepared error handling approaches for missing AWS credentials or unavailable AWS services.

* **Developed the Activity Management DynamoDB integration approach:**
  * Studied Boto3 access to the `SAP-Activities` table.
  * Developed Repository components for activity data operations.
  * Investigated the creation and updating of synthetic activity records.
  * Defined consistency requirements between API responses and persisted data.
  * Identified conditions under which only selected Pilot activities should use AWS storage.

* **Developed the Attendance AWS Pilot approach:**
  * Designed Check-in and Check-out persistence using `SAP-Attendance`.
  * Preserved the requirement for real-time API-based attendance processing.
  * Established timestamp recording requirements for attendance events.
  * Investigated duplicate Check-in and Check-out prevention.
  * Identified invalid attendance cases requiring explicit error responses.
  * Prepared tests to verify immediate DynamoDB persistence.

* **Explored Amazon S3 file storage:**
  * Understood Buckets, Objects, Object Keys, and Prefixes.
  * Learned how files can be uploaded using Boto3.
  * Designed the `activity-posters/` object key prefix for poster uploads.
  * Studied Presigned URLs and time-limited object access.
  * Explored storing poster metadata in DynamoDB while keeping the file content in S3.
  * Distinguished metadata records from actual file objects.

* **Prepared AWS Pilot integration tests:**
  * Reviewed DynamoDB table and S3 bucket configuration requirements.
  * Experimented with synthetic activity data operations.
  * Prepared AWS-based Check-in/Check-out test cases.
  * Investigated methods for verifying DynamoDB records after API calls.
  * Explored poster uploads and image metadata validation.
  * Defined testing constraints to avoid modifying real student data.

* **Improved Python-to-AWS integration knowledge:**
  * Learned the differences between Boto3 Clients and Resources.
  * Understood the roles of AWS Regions and Credentials.
  * Investigated AWS ClientError handling and connection failures.
  * Recognized that a successful HTTP response alone is insufficient proof of persistence.
  * Understood the importance of inspecting stored data during integration testing.

* **Applied security and cost-management principles:**
  * Avoided storing AWS access keys in source code.
  * Used synthetic data for AWS Pilot testing.
  * Restricted test workflows to explicitly selected activities.
  * Avoided creating duplicate AWS tables or buckets.
  * Studied AWS Free Tier conditions and resource usage monitoring.
  * Prioritized local functionality before expanding cloud integrations.

* **Clarified the actual AWS integration scope:**
  * FastAPI remained the primary Backend application.
  * SQLite continued to support local development and demonstration data.
  * DynamoDB and S3 were researched and integrated through limited AWS Pilot workflows.
  * The complete application was not migrated to a fully serverless architecture.
  * API Gateway and Lambda were not used as the main Backend for business operations.

### Challenges and Lessons Learned:

* **SQL versus NoSQL:** DynamoDB uses a different data model from SQLite, requiring careful key design and access pattern planning.
* **Data consistency:** Combining local storage with AWS Pilot operations requires preventing unintended or inconsistent updates.
* **Attendance verification:** Tests should validate both HTTP responses and actual timestamps and records persisted in DynamoDB.
* **S3 file management:** Object content, metadata, and retrieval URLs must be handled separately.
* **AWS security:** Credentials and access permissions must be protected and managed carefully.
* **Cloud costs:** Small datasets, limited test execution, and resource reuse help minimize unnecessary AWS expenses.

### Plan for Next Week:

* Continue developing the React and Vite Frontend.
* Build Login, Dashboard, and Activity Management pages.
* Develop student account management interfaces based on ADMIN/STUDENT roles.
* Connect Frontend components to the FastAPI REST API.
* Improve Authentication and Authorization.
* Develop the attendance management user interface.
* Test Frontend-to-Backend interactions in the local development environment.