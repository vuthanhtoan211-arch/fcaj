
---
title: "Prerequisite"
date: 2026-11-09
weight: 2
chapter: false
pre: "<b>5.2.</b>"
---

## Prerequisites

Before starting the **Student Activity Management & Engagement Analytics Platform** workshop, we need to prepare the local development environment, AWS account, resource access permissions, and required tools for developing, deploying, and testing the application.

In this workshop, we will use:

* Python/FastAPI for Backend development.
* React/Vite for Frontend development.
* SQLite for local Demo persistence.
* Amazon DynamoDB for Cloud data storage integration.
* AWS Amplify for Frontend deployment.
* Amazon S3 and AWS Lambda for CSV data processing.
* AWS IAM for access management.
* Amazon CloudWatch for execution monitoring.
* Cloudflare Quick Tunnel to connect the Frontend with the local Backend.

#### 1. Prepare an AWS Account

First, you need an AWS account to use the services included in this workshop.

Access the [AWS Management Console](https://console.aws.amazon.com/).

* Sign in to your AWS account.
* Use an IAM User or IAM Role with appropriate permissions.
* Avoid using the AWS Root account for daily application development.
* Verify the AWS Region before creating resources.
* Review AWS Billing to monitor potential charges during the workshop.

In this workshop, we will use the AWS Region appropriate for the actual project deployment environment.

Amazon DynamoDB, Amazon S3, AWS Lambda, and Amazon CloudWatch resources should be configured in the appropriate Region to support integration and testing.

{{% notice note %}}
Use the same AWS Region selected for the project. Resource names and configuration values may need to be adjusted according to your AWS account.
{{% /notice %}}

#### 2. Prepare IAM Permissions

AWS Identity and Access Management (IAM) is used to manage identities and control access to AWS resources.

In this workshop, we distinguish between two permission groups:

* Permissions required by workshop participants to create, configure, test, and clean up resources.
* Execution permissions required by AWS Lambda and the Backend to access AWS resources.

##### 2.1. Workshop Participant Permissions

The IAM identity used for the workshop requires appropriate permissions to perform the following operations:

| Service | Required Operations |
| --- | --- |
| Amazon DynamoDB | Create tables, inspect tables, read and write items |
| Amazon S3 | Create buckets, upload, download, and manage objects |
| AWS Lambda | Create functions, update code, configure, and test functions |
| AWS IAM | Create or use execution roles, configure policies, and pass roles |
| Amazon CloudWatch | View log groups, log streams, metrics, and configure log retention |
| AWS Amplify | Create applications, connect repositories, configure builds, and deploy |

When using an AWS account provided by an internship program or organization, verify the permissions already assigned to your identity before proceeding.

Avoid assigning AdministratorAccess or permissions outside the required workshop scope.

##### 2.2. IAM Role for AWS Lambda

The AWS Lambda CSV Processor requires permissions to:

* Read input CSV files from Amazon S3.
* Write processed JSON results back to Amazon S3.
* Send execution logs to Amazon CloudWatch.

Open the AWS Management Console.

* Search for **IAM**.
* Select **Roles**.
* Choose **Create role**.
* Under Trusted entity type, select **AWS service**.
* Under Use case, select **Lambda**.
* Choose **Next**.
* Attach the **AWSLambdaBasicExecutionRole** policy for CloudWatch logging.
* Enter a role name, for example:

```text
SAP-Lambda-CSV-Processor-Role
```

* Choose **Create role**.

Next, add an Inline Policy that allows Lambda to read and write objects within the S3 storage locations used in the workshop.

Example IAM Permission Policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ReadInputCSV",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::YOUR-SAP-BUCKET/input/*"
        },
        {
            "Sid": "WriteOutputJSON",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::YOUR-SAP-BUCKET/output/*"
        }
    ]
}
```

Where:

* YOUR-SAP-BUCKET: The actual S3 Bucket used in the workshop.
* input/: The prefix containing input CSV files.
* output/: The prefix containing processed JSON results.

Replace YOUR-SAP-BUCKET and the prefixes with your actual resource configuration.

{{% notice warning %}}
This IAM Policy is intended only for the Lambda CSV Processor. It is not a complete deployment policy for the IAM user performing the workshop. Adjust the Resource ARNs if your actual bucket or prefixes differ from the example.
{{% /notice %}}

<!--
Add screenshots after creating the IAM Role:

![IAM Lambda Role](/images/5-Workshop/5.2-Prerequisite/iam-role.png)

![IAM Permission Policy](/images/5-Workshop/5.2-Prerequisite/iam-policy.png)
-->

#### 3. Install the Development Environment

In this workshop, we will develop and test the application locally before integrating AWS services.

##### 3.1. Visual Studio Code

Visual Studio Code is used for Backend and Frontend development.

Download and install:

[Visual Studio Code](https://code.visualstudio.com/)

Recommended extensions include:

* Python.
* Pylance.
* ESLint.
* Prettier.
* AWS Toolkit.

##### 3.2. Python

Python is used to develop the FastAPI Backend and AWS Lambda CSV Processor.

Download Python:

[Python Downloads](https://www.python.org/downloads/)

After installation, open PowerShell and verify:

```powershell
python --version
pip --version
```

Use a Python version compatible with the project source code and dependencies.

##### 3.3. Node.js and npm

Node.js and npm are used to develop and run the React/Vite Frontend.

Download Node.js:

[Node.js Downloads](https://nodejs.org/)

Use a Node.js LTS version compatible with Vite and the project's package.json configuration.

Verify the installation:

```powershell
node --version
npm --version
```

##### 3.4. Git

Git is used for source code management and connecting the repository to AWS Amplify Hosting.

Download Git:

[Git Downloads](https://git-scm.com/downloads)

Verify the installation:

```powershell
git --version
```

A GitHub account is also required to store the source code and support Frontend deployment.

##### 3.5. AWS CLI

The AWS Command Line Interface (AWS CLI) allows AWS operations to be performed directly from the Terminal.

Installation guide:

[AWS CLI Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

Verify the installation:

```powershell
aws --version
```

<!--
![Development Environment](/images/5-Workshop/5.2-Prerequisite/development-environment.png)
-->

#### 4. Configure AWS CLI and AWS Profile

The project uses an AWS Profile to connect the Python Backend with AWS resources through boto3.

The workshop uses the following profile name:

```text
sap-dev
```

##### 4.1. Configure AWS Credentials

If you use an IAM User with Access Keys provided for the learning environment, open PowerShell and run:

```powershell
aws configure --profile sap-dev
```

Enter the requested configuration values:

```text
AWS Access Key ID: <Your Access Key ID>
AWS Secret Access Key: <Your Secret Access Key>
Default region name: <Your AWS Region>
Default output format: json
```

If your account uses AWS IAM Identity Center, configure the profile using:

```powershell
aws configure sso --profile sap-dev
aws sso login --profile sap-dev
```

Choose the authentication method appropriate for your AWS account.

##### 4.2. Verify AWS Connectivity

After configuration, verify the profile:

```powershell
aws sts get-caller-identity --profile sap-dev
```

If the configuration is successful, AWS CLI will return information about the AWS Account and IAM Identity currently in use.

Verify the configured Region:

```powershell
aws configure get region --profile sap-dev
```

You can also verify DynamoDB and S3 access if the necessary permissions have been granted:

```powershell
aws dynamodb list-tables --profile sap-dev
aws s3 ls --profile sap-dev
```

{{% notice warning %}}
Do not expose AWS Access Keys, Secret Access Keys, Session Tokens, or authentication credentials in GitHub repositories, Frontend source code, or internship report screenshots.
{{% /notice %}}

<!--
![AWS CLI Profile](/images/5-Workshop/5.2-Prerequisite/aws-cli-profile.png)

![AWS Connection Test](/images/5-Workshop/5.2-Prerequisite/aws-connection-test.png)
-->

#### 5. Prepare the Project Source Code

In this workshop, we use the source code of the **Student Activity Management & Engagement Analytics Platform**.

The main project directory structure is:

```text
student-activity-platform/
├── backend/
└── frontend/
```

The source code can be stored on GitHub or in a local development directory.

If the source code is available on GitHub, run:

```powershell
cd C:\Projects

git clone <YOUR_GITHUB_REPOSITORY_URL>

cd student-activity-platform
```

Replace YOUR_GITHUB_REPOSITORY_URL with your actual project repository URL.

If the source code is already available on your computer, simply open the project directory in VS Code.

#### 6. Prepare the FastAPI Backend

##### 6.1. Create a Python Virtual Environment

Open a Terminal in the Backend directory:

```powershell
cd C:\Projects\student-activity-platform\backend
```

Create a Python Virtual Environment:

```powershell
python -m venv .venv
```

Activate the Virtual Environment in PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks script execution, use:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

.\.venv\Scripts\Activate.ps1
```

This configuration applies only to the current PowerShell session.

##### 6.2. Install Dependencies

Install the Backend dependencies using requirements.txt:

```powershell
python -m pip install --upgrade pip

pip install -r requirements.txt
```

The main dependencies used in the project include:

* FastAPI.
* Uvicorn.
* boto3.
* CSV/XLSX processing libraries.
* Authentication and Authorization libraries specified in the project's requirements.txt.

##### 6.3. Start the Backend

Configure the project's Demo environment:

```powershell
$env:SAP_DEMO_MODE="1"
```

Configure the AWS Profile when testing AWS integration:

```powershell
$env:AWS_PROFILE="sap-dev"
```

Start FastAPI:

```powershell
python -m uvicorn app.main:app --reload
```

After the Backend starts successfully, access:

```text
http://127.0.0.1:8000
```

Check the REST API documentation:

```text
http://127.0.0.1:8000/docs
```

Swagger UI can be used to test APIs related to Authentication, Activities, Registration, Attendance, Evidence, and Participation.

<!--
![FastAPI Backend Running](/images/5-Workshop/5.2-Prerequisite/backend-running.png)

![Swagger API Documentation](/images/5-Workshop/5.2-Prerequisite/swagger-ui.png)
-->

#### 7. Prepare the React/Vite Frontend

Open a new Terminal and navigate to the Frontend directory:

```powershell
cd C:\Projects\student-activity-platform\frontend
```

Install Node.js dependencies:

```powershell
npm install
```

Start the Frontend:

```powershell
npm run dev
```

Vite typically provides the following local URL:

```text
http://localhost:5173
```

If port 5173 is already in use, check the URL displayed in the Terminal.

The Frontend must connect to the FastAPI Backend at:

```text
http://127.0.0.1:8000
```

Verify the API_BASE_URL configuration in the Frontend source code.

Ensure that:

* The Backend is running.
* The Frontend is running.
* The Frontend can communicate with the Backend.
* Backend CORS settings allow the Frontend origin.
* The application login page is accessible.
* ADMIN and STUDENT test accounts are available.

<!--
![Frontend Running](/images/5-Workshop/5.2-Prerequisite/frontend-running.png)

![Application Login Page](/images/5-Workshop/5.2-Prerequisite/login-page.png)
-->

#### 8. Prepare Amazon DynamoDB Resources

Amazon DynamoDB will be used to integrate and test business data storage on AWS.

The project includes the following DynamoDB tables:

| Table Name | Purpose |
| --- | --- |
| SAP-Activities | Store activity information |
| SAP-Registrations | Store student registration records |
| SAP-Attendance | Store Check-in/Check-out records |
| SAP-Evidence | Store participation evidence |
| SAP-Participation | Store participation results |

Access the [Amazon DynamoDB Console](https://console.aws.amazon.com/dynamodb/).

* Verify the AWS Region.
* Select **Tables**.
* Review the tables already created in the project environment.

If performing the workshop in a new AWS account, the tables will be created according to the Partition Key and Sort Key definitions required by the source code in the Amazon DynamoDB Integration section.

Do not change the table Key Schema without checking the Backend implementation, as this may cause read and write operations to fail.

Verify available tables using AWS CLI:

```powershell
aws dynamodb list-tables --profile sap-dev
```

{{% notice note %}}
SQLite remains part of local persistence and recovery in the Demo environment. DynamoDB represents the tested AWS data storage integration. This workshop does not assume that the entire Backend has been fully migrated to DynamoDB.
{{% /notice %}}

<!--
![DynamoDB Tables](/images/5-Workshop/5.2-Prerequisite/dynamodb-tables.png)
-->

#### 9. Prepare Amazon S3 and AWS Lambda

##### 9.1. Amazon S3

Access the [Amazon S3 Console](https://s3.console.aws.amazon.com/s3/).

Prepare an S3 Bucket for the Serverless CSV Processing Demo.

Illustrative storage structure:

```text
YOUR-SAP-BUCKET/
├── input/
│   └── registrations.csv
└── output/
    └── registrations-result.json
```

Where:

* input/: Contains CSV files to be processed.
* output/: Contains JSON results generated by Lambda.

Use the Bucket and Object Keys required by the actual Lambda configuration.

When creating a Bucket:

* Choose a valid and globally unique Bucket name.
* Select the appropriate AWS Region.
* Keep Block Public Access enabled.
* Use appropriate default encryption.
* Do not upload real student information without authorization.

##### 9.2. AWS Lambda

Access the [AWS Lambda Console](https://console.aws.amazon.com/lambda/).

Prepare the following information for the Lambda Function:

* Function name: SAP-CSV-Processor (illustrative name).
* Runtime: A Python runtime compatible with the Lambda source code.
* Execution Role: SAP-Lambda-CSV-Processor-Role or the actual configured role.
* Input: CSV Object stored in S3.
* Output: JSON Object stored in S3.

The Lambda Function will be configured and tested in detail in the Serverless CSV Processing section.

##### 9.3. Amazon CloudWatch

Amazon CloudWatch will be used to inspect logs after Lambda execution.

Prepare the following:

* Lambda has logging permissions through its Execution Role.
* A Log Group corresponding to the Lambda Function.
* An appropriate Log Retention period for the learning environment.

For the Demo environment, a seven-day retention period can be configured to support monitoring and testing.

<!--
![S3 Bucket](/images/5-Workshop/5.2-Prerequisite/s3-bucket.png)

![Lambda Function](/images/5-Workshop/5.2-Prerequisite/lambda-function.png)

![CloudWatch Log Group](/images/5-Workshop/5.2-Prerequisite/cloudwatch-log-group.png)
-->

#### 10. Prepare Cloudflare Quick Tunnel

In the current project implementation, the FastAPI Backend runs on a local computer. Cloudflare Quick Tunnel provides a temporary HTTPS Endpoint so the Frontend hosted on AWS Amplify can send REST API requests to the Backend.

Download and install cloudflared:

[Cloudflare Tunnel Downloads](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/)

Verify the installation:

```powershell
cloudflared --version
```

Ensure that the FastAPI Backend is running at:

```text
http://127.0.0.1:8000
```

Start a Quick Tunnel:

```powershell
cloudflared tunnel --url http://127.0.0.1:8000
```

Cloudflare will provide a temporary HTTPS URL similar to:

```text
https://<random-name>.trycloudflare.com
```

This URL will be used when configuring the API Endpoint for the Frontend deployed on AWS Amplify.

{{% notice warning %}}
Cloudflare Quick Tunnel is intended for development and demonstration purposes. The URL may change whenever the tunnel is restarted. Do not use Quick Tunnel as a Production Backend solution. Do not expose real personal data, default credentials, or unprotected administrative APIs through a public endpoint.
{{% /notice %}}

<!--
![Cloudflare Quick Tunnel](/images/5-Workshop/5.2-Prerequisite/cloudflare-tunnel.png)
-->

#### 11. Prepare AWS Amplify Hosting

AWS Amplify is used to deploy the React/Vite Frontend.

Before deployment, prepare:

* A GitHub Repository containing the Frontend source code.
* A deployment branch.
* The package.json file and Vite configuration.
* The API Endpoint configuration for the deployment environment.
* A running FastAPI Backend and Cloudflare Tunnel for the Demo.

Verify that the Frontend builds successfully:

```powershell
cd C:\Projects\student-activity-platform\frontend

npm run build
```

After a successful build, Vite typically generates:

```text
dist/
```

Access the [AWS Amplify Console](https://console.aws.amazon.com/amplify/).

Connecting the GitHub Repository, configuring Build Settings, and deploying the Website will be covered in the Application Deployment section.

<!--
![Amplify Console](/images/5-Workshop/5.2-Prerequisite/amplify-console.png)
-->

#### 12. Prepare Sample Data

To test Registration Import, Attendance, Evidence Import, Reconciliation, and Analytics, we need to prepare sample datasets.

The following data is synthetic and intended only for learning purposes.

##### 12.1. Registration Data

Example student registration file:

```csv
student_id,full_name,class_name
0818000001,Student A,DS01
0818000002,Student B,DS01
0818000003,Student C,DS02
```

##### 12.2. Attendance Data

Prepare sample student IDs for testing Check-in and Check-out in the Web Application:

```text
Student ID: 0818000001
Student ID: 0818000002
Student ID: 0818000003
```

Attendance records are captured in real time through REST APIs rather than imported from Check-in/Check-out files after an activity.

##### 12.3. Evidence Data

Example participation evidence file:

```csv
student_id,evidence_url
0818000001,https://example.com/evidence-01
0818000002,https://example.com/evidence-02
```

Column names and file formats must be adjusted to match the actual project's Import Templates.

##### 12.4. Lambda CSV Processing Data

Prepare a CSV file containing four records:

```csv
student_id,full_name
0818000001,Student A
0818000002,Student B
0818000001,Student A
,Student C
```

This file is used to test duplicate detection and required-field validation in the Lambda CSV Processor.

Expected processing results:

| Metric | Count |
| --- | --- |
| Total Records | 4 |
| Valid Records | 2 |
| Duplicate Records | 1 |
| Invalid Records | 1 |

#### 13. Verify Workshop Readiness

After completing the preparation steps, verify the following components:

| Component | Requirement |
| --- | --- |
| AWS Account | Accessible with appropriate permissions |
| Python | Installed and working |
| Node.js/npm | Installed and working |
| Git | Source code is accessible |
| AWS CLI | The sap-dev profile is configured |
| FastAPI | Backend can run on port 8000 |
| React/Vite | Frontend runs locally and builds successfully |
| SQLite | Ready for local Demo persistence |
| DynamoDB | Access permissions and business tables are prepared |
| Amazon S3 | Workshop storage is ready to be created or reused |
| AWS Lambda | Runtime and Execution Role are prepared |
| Amazon CloudWatch | Execution logs can be accessed |
| Cloudflare Tunnel | A temporary HTTPS Endpoint can be generated |
| AWS Amplify | GitHub Repository is available for deployment |
| Sample Data | Registration, Attendance, and Evidence samples are available |

Once these requirements are satisfied, the environment is ready for Backend development, AWS integration, Frontend deployment, and application testing.

#### Conclusion

In this section, we prepared the development environment and prerequisites required for the Student Activity Management & Engagement Analytics Platform workshop.

The architecture combines React/Vite, FastAPI, SQLite, and AWS services selected according to their respective responsibilities.

![Student Activity Management & Engagement Analytics Platform Architecture](/images/2-Proposal/student_activity_architectur.drawio.png)

In the next section, we will begin developing and configuring the FastAPI Backend, which provides the foundation for activity management, attendance recording, data processing, and Amazon DynamoDB integration.
