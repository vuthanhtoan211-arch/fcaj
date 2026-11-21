
---
title: "Blog 2 - Secure File Uploads to Amazon S3 with Pre-signed URLs"
date: 2026-09-18
weight: 2
chapter: false
pre: "<b>3.2.</b>"
---

# UPLOADING CSV/XLSX FILES TO AWS WITHOUT EXPOSING S3 CREDENTIALS: HOW DO PRE-SIGNED URLS WORK?

## Learning How to Build a Secure File Upload Workflow on AWS

### 1. Starting with a Familiar Problem

While developing the Student Activity Management & Engagement Analytics Platform, I needed to support data import from CSV and Excel files.

These files may include:

* Student registration lists from the University Portal.
* Participation evidence from Google Forms.
* Student records requiring reconciliation.
* Files used for reporting and analytics.

In the current implementation, Registration and Evidence files are submitted to FastAPI for validation and processing.

However, while studying how the system could be expanded on AWS, I asked myself:

**How can users upload files directly to Amazon S3 without knowing the AWS Access Key and Secret Access Key?**

One solution I discovered was Amazon S3 Pre-signed URLs.

### 2. Why Should AWS Credentials Not Be Stored in the Frontend?

Suppose I develop a React application that uploads files directly to Amazon S3.

An insecure approach would be to include AWS Access Keys and Secret Access Keys in the Frontend source code.

```text
React Frontend
    |
    | AWS Credentials
    v
Amazon S3
```

JavaScript running in a browser can be inspected by users.

If credentials are embedded in Frontend code, they may be discovered through browser Developer Tools or built JavaScript files.

This creates risks such as:

* Unauthorized AWS resource access.
* Reading data outside the intended scope.
* Unwanted uploads or deletions.
* Unexpected AWS costs.
* Exposure of student information.

Environment variables embedded in a Frontend build are not secure secret storage if their values become part of the delivered JavaScript.

Therefore, a Web Application should not expose long-term AWS credentials directly to the browser.

### 3. What Is a Pre-signed URL?

A Pre-signed URL is a URL signed using AWS credentials that allows its holder to perform a specific operation on an S3 resource for a limited period.

Examples include:

* Uploading an object using HTTP PUT.
* Downloading an object using HTTP GET.

The Backend generates a signed URL and returns it to the user.

The user does not need an AWS Access Key or Secret Access Key to perform the authorized operation.

A Pre-signed URL contains information related to:

* The S3 Bucket.
* The Object Key.
* The HTTP Method.
* The expiration time.
* The AWS signature.

The URL is generated using the permissions of the signing IAM Principal.

If that Principal does not have permission to upload the specified object, the URL cannot grant access beyond those permissions.

The S3 Bucket does not need to be public.

### 4. How Does a Pre-signed URL Work?

Assume an ADMIN user needs to upload a student registration file.

The proposed workflow is:

```text
ADMIN / React Frontend
          |
          | 1. Request Upload URL
          v
FastAPI Backend
          |
          | 2. Generate Pre-signed URL
          v
AWS SDK / IAM Permissions
          |
          | 3. Return Signed URL
          v
ADMIN / React Frontend
          |
          | 4. HTTP PUT File
          v
Amazon S3
```

The implementation steps are:

1. The ADMIN signs in to the Web Application.
2. The ADMIN selects a CSV or XLSX file.
3. The Frontend requests an upload URL from FastAPI.
4. The Backend validates the Access Token and ADMIN permissions.
5. The Backend validates file information and the associated activity.
6. The Backend generates a Pre-signed URL using boto3.
7. The Frontend receives the signed URL.
8. The browser uploads the file directly to Amazon S3.
9. The system verifies the upload before beginning data processing.

The file does not need to pass through FastAPI during the entire upload process.

The Backend focuses on authentication, business validation, and issuing appropriate upload URLs.

### 5. Generating a Pre-signed URL with Python

The following example demonstrates Python and boto3:

```python
import boto3
from uuid import uuid4

s3 = boto3.client("s3")

bucket_name = "your-private-demo-bucket"

object_key = f"uploads/{uuid4()}.csv"

upload_url = s3.generate_presigned_url(
    ClientMethod="put_object",
    Params={
        "Bucket": bucket_name,
        "Key": object_key,
        "ContentType": "text/csv"
    },
    ExpiresIn=300
)

print(upload_url)
```

Explanation:

* put_object: The S3 upload operation.
* Bucket: The destination S3 Bucket.
* Key: The object's storage path.
* ContentType: The content type used during upload.
* ExpiresIn: The URL validity period in seconds.

In this example, the URL is configured to expire after 300 seconds.

The Backend must have valid AWS credentials and s3:PutObject permission for the specified resource.

When temporary credentials are used, the signed URL may expire earlier if the underlying credentials expire.

**Note:** This example is intended for learning. Production applications should not unnecessarily print or log signed URLs because anyone holding the URL may use its granted access while it remains valid.

### 6. Uploading a File from React

After receiving the signed URL, the Frontend can upload the file using the Fetch API.

```javascript
async function uploadFile(file, uploadUrl) {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "text/csv",
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return true;
}
```

The Content-Type should match the value used when generating the URL.

For XLSX files, the appropriate content type can be used:

```text
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

If the Frontend and S3 use different origins, the Bucket must have an appropriate CORS configuration allowing upload requests from the application's origin.

CORS does not replace IAM or authentication. It controls cross-origin requests permitted by web browsers.

### 7. What IAM Permissions Are Required?

The Backend should only receive the permissions necessary for its responsibilities.

An illustrative IAM Policy is shown below:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::your-private-demo-bucket/uploads/*"
    }
  ]
}
```

This policy allows uploads within the uploads/ prefix of the specified Bucket.

It does not automatically grant permissions to read, delete, or administer the entire Bucket.

This demonstrates the Least Privilege principle:

* The Backend receives only the required upload permissions.
* Users receive a URL for a specific object.
* The S3 Bucket can remain private.

### 8. Important Security Considerations

Pre-signed URLs are useful, but they do not automatically solve every security problem.

**Expiration**

Use short validity periods appropriate for the upload requirements.

**Access Control**

Generate URLs only after validating the user's identity and authorization for the relevant activity.

**Object Keys**

The Backend should generate controlled Object Keys rather than accepting unrestricted storage paths from users.

Example structure:

```text
uploads/
  ACT-DEMO-001/
    registration/
      unique-file-id.csv
```

**File Validation**

File extensions and Content-Type values are not sufficient to guarantee valid files.

The system must still validate content, structure, file size, and data after upload.

Pre-signed POST with a content-length-range condition can be considered when an upload size restriction must be enforced through a policy.

**URL Protection**

A Pre-signed URL may be reused during its validity period. It is not automatically a one-time credential.

Avoid public sharing and unnecessary logging of signed URLs.

**Personal Data**

Use synthetic data or properly authorized information. Do not expose student records through publicly accessible storage.

### 9. Combining Pre-signed URLs with AWS Lambda

After a file is successfully uploaded to Amazon S3, an automated processing workflow could be implemented in the future.

```text
React Frontend
      |
      | Pre-signed Upload
      v
Amazon S3 Input
      |
      | S3 Event Notification
      v
AWS Lambda
      |
      | Validate & Process
      v
Amazon S3 Output
```

AWS Lambda could:

* Read CSV files from S3.
* Validate student IDs.
* Detect duplicate records.
* Identify invalid data.
* Generate JSON results.

S3 Event Notifications can be configured to invoke Lambda when new objects arrive in the input prefix.

If Lambda writes results to the same Bucket, the trigger should not also match the output prefix, as this could create unintended recursive invocations.

### 10. Connection to My Internship Project

In the current Student Activity Management & Engagement Analytics Platform:

* Registration and Evidence imports are handled by FastAPI.
* The Frontend is deployed using AWS Amplify.
* DynamoDB is integrated and tested for AWS-based data storage.
* Amazon S3 and AWS Lambda are used in an independent Serverless CSV Processing Demo.
* AWS IAM provides required resource permissions.

Pre-signed URLs represent a potential enhancement to the file upload architecture.

With this integration, ADMIN users could upload files directly to S3 while FastAPI manages authorization and business information.

This could reduce file transfer workloads on the Backend and support a more flexible Data Pipeline.

However, this article does not claim that Pre-signed URLs or automated S3 Event Notifications have been fully integrated into the current Website.

### 11. Conclusion

Through studying Amazon S3 Pre-signed URLs, I learned that Cloud file uploads involve more than storage. They also require authentication, authorization, and security.

My main takeaways include:

* Never expose secret AWS credentials in the Frontend.
* Use the Backend to validate permissions and generate signed URLs.
* Restrict access to specific Object Keys and operations.
* Configure appropriate expiration periods.
* Validate uploaded data.
* Combine S3 and Lambda for Serverless processing when appropriate.

This knowledge is useful for Web Applications that handle documents, images, CSV files, or Excel files.

It also provides a foundation for my future studies in Cloud Security, Data Engineering, and AWS-based data processing architectures.

### 12. References

* [Amazon S3 – Sharing objects with presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)
* [Uploading objects with presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
* [Boto3 – generate_presigned_url](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3/client/generate_presigned_url.html)
* [Amazon S3 CORS](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html)
* [Amazon S3 Event Notifications](https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html)
* [AWS IAM User Guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)
