
---
title: "Connect the Backend to Amazon DynamoDB"
date: 2026-11-09
weight: 2
chapter: false
pre: "<b>5.4.2.</b>"
---

## Connect the Backend to Amazon DynamoDB

In this section, we will configure the AWS SDK for Python (boto3) so that the FastAPI Backend can connect to and interact with Amazon DynamoDB.

#### 1. Open the Backend in Visual Studio Code

Open the project source code directory:

```text
C:\Projects\student-activity-platform
```

Open PowerShell and navigate to the Backend directory:

```powershell
cd C:\Projects\student-activity-platform\backend
```

Activate the Python Virtual Environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks script execution:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

.\.venv\Scripts\Activate.ps1
```

<!--
![Backend Environment](/images/5-Workshop/5.4-DynamoDB/backend-environment.png)
-->

#### 2. Install and verify boto3

boto3 is the AWS SDK for Python. It allows Python applications to interact with AWS services through APIs.

Install boto3:

```powershell
python -m pip install boto3
```

Verify the installation:

```powershell
python -c "import boto3; print(boto3.__version__)"
```

If boto3 has already been installed through requirements.txt, installation is not required again.

<!--
![Install Boto3](/images/5-Workshop/5.4-DynamoDB/install-boto3.png)
-->

#### 3. Configure the AWS Profile

The project uses the following AWS Profile:

```text
sap-dev
```

List available profiles:

```powershell
aws configure list-profiles
```

If sap-dev does not exist, configure the profile according to section 5.2 - Prerequisite.

Set the environment variables:

```powershell
$env:AWS_PROFILE="sap-dev"
$env:AWS_REGION="ap-southeast-1"
$env:AWS_DEFAULT_REGION="ap-southeast-1"
```

Verify the AWS Identity:

```powershell
aws sts get-caller-identity --profile sap-dev
```

Check the configured Region:

```powershell
aws configure get region --profile sap-dev
```

AWS operations in this section use the Singapore Region.

{{% notice warning %}}
Do not include AWS Access Keys or Secret Access Keys directly in Backend or Frontend source code. Do not upload credential files to GitHub. Use only authorized accounts and permissions.
{{% /notice %}}

<!--
![AWS Profile Configuration](/images/5-Workshop/5.4-DynamoDB/aws-profile.png)
-->

#### 4. Understand the DynamoDB connection

boto3 supports Sessions and Clients for performing DynamoDB operations.

Illustrative example:

```python
import boto3

session = boto3.Session(
    profile_name="sap-dev",
    region_name="ap-southeast-1"
)

dynamodb = session.client("dynamodb")

response = dynamodb.list_tables()

print(response["TableNames"])
```

Explanation:

* boto3.Session: Creates an AWS connection session.
* profile_name: Uses credentials associated with sap-dev.
* region_name: Specifies the Region containing the DynamoDB tables.
* session.client: Initializes the DynamoDB Client.
* list_tables: Retrieves the table list in the selected Region.

The actual project can manage Profile, Region, and table names through environment variables and configuration modules.

Do not replace the entire Backend configuration with the illustrative code above.

#### 5. Prepare DynamoDB permissions for the Backend

The Backend requires appropriate permissions to read and write business data.

Common operations include:

* dynamodb:DescribeTable.
* dynamodb:GetItem.
* dynamodb:PutItem.
* dynamodb:UpdateItem.
* dynamodb:Query.
* dynamodb:Scan.

Example IAM Policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AccessSAPTables",
            "Effect": "Allow",
            "Action": [
                "dynamodb:DescribeTable",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:Query",
                "dynamodb:Scan"
            ],
            "Resource": [
                "arn:aws:dynamodb:ap-southeast-1:YOUR_ACCOUNT_ID:table/SAP-Activities",
                "arn:aws:dynamodb:ap-southeast-1:YOUR_ACCOUNT_ID:table/SAP-Registrations",
                "arn:aws:dynamodb:ap-southeast-1:YOUR_ACCOUNT_ID:table/SAP-Attendance",
                "arn:aws:dynamodb:ap-southeast-1:YOUR_ACCOUNT_ID:table/SAP-Evidence",
                "arn:aws:dynamodb:ap-southeast-1:YOUR_ACCOUNT_ID:table/SAP-Participation"
            ]
        },
        {
            "Sid": "ListTables",
            "Effect": "Allow",
            "Action": "dynamodb:ListTables",
            "Resource": "*"
        }
    ]
}
```

Replace YOUR_ACCOUNT_ID with your actual AWS Account ID.

This is an example policy for data integration and verification operations in the workshop, not a complete deployment policy.

If the repository uses BatchWriteItem, DeleteItem, or other operations, grant additional permissions only when required by the actual implementation.

Avoid granting access to unrelated DynamoDB tables.

#### 6. Verify resources using the project script

The Backend source code includes:

```text
backend/check_aws_resources.py
```

This script verifies AWS connectivity and the status of project resources.

From the backend directory, run:

```powershell
$env:AWS_PROFILE="sap-dev"
$env:AWS_DEFAULT_REGION="ap-southeast-1"

.\.venv\Scripts\python.exe .\check_aws_resources.py
```

The script uses boto3 to inspect AWS resources.

Verify the following tables:

```text
SAP-Activities
SAP-Registrations
SAP-Attendance
SAP-Evidence
SAP-Participation
```

The expected result is that the tables are accessible and have an ACTIVE status.

<!--
![AWS Resource Check](/images/5-Workshop/5.4-DynamoDB/aws-resource-check.png)
-->

{{% notice note %}}
check_aws_resources.py is a read-only verification script. It does not create tables, modify items, or delete DynamoDB data. If the script also checks S3, ensure that the Bucket name and access permissions are configured correctly.
{{% /notice %}}

#### 7. Understand Backend data access

In the project architecture, FastAPI uses repository components and AWS configuration to perform business data storage operations.

Integration flow:

```text
FastAPI Router
      |
      v
Business Service
      |
      v
DynamoDB Repository
      |
      | boto3
      v
Amazon DynamoDB
```

Component responsibilities:

* Router: Receives REST API requests.
* Business Service: Validates and processes business operations.
* Repository: Encapsulates data access operations.
* boto3: Sends AWS API requests to DynamoDB.
* DynamoDB: Stores and retrieves business data.

This approach separates business logic from Cloud resource access.

#### 8. Start the Backend

Configure the Demo environment:

```powershell
$env:SAP_DEMO_MODE="1"
$env:AWS_PROFILE="sap-dev"
$env:AWS_REGION="ap-southeast-1"
$env:AWS_DEFAULT_REGION="ap-southeast-1"
```

Review the AWS Pilot settings in the current source code before testing data writes.

Start the Backend:

```powershell
python -m uvicorn app.main:app --reload
```

Open Swagger UI:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

<!--
![FastAPI AWS Integration](/images/5-Workshop/5.4-DynamoDB/backend-aws-running.png)
-->

{{% notice note %}}
Configuring an AWS Profile and Region only prepares AWS connectivity. Whether business APIs use DynamoDB depends on the repository and AWS Pilot configuration in the current Backend. SAP_DEMO_MODE=1 does not automatically enable every DynamoDB operation.
{{% /notice %}}

#### Results

After completing this section:

* boto3 is installed.
* The sap-dev AWS Profile is configured.
* The Backend has connection settings for the Singapore Region.
* check_aws_resources.py can inspect AWS resources.
* DynamoDB tables are ready for integration testing.

In the next section, we will test Backend data reading and writing operations with DynamoDB.

[Next: Test data reading and writing](../5.4.3-test-dynamodb/)
