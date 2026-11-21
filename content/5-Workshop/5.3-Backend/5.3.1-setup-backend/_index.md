
---
title: "Set up and configure the FastAPI Backend"
date: 2026-11-09
weight: 1
chapter: false
pre: "<b>5.3.1.</b>"
---

## Set up and configure the FastAPI Backend

In this section, we will prepare the Python environment, install the required dependencies, and start the FastAPI Backend of the Student Activity Management & Engagement Analytics Platform.

{{% notice note %}}
Complete section 5.2 - Prerequisite before proceeding. This workshop uses Windows, PowerShell, and Visual Studio Code as the development environment.
{{% /notice %}}

#### Step 1: Open the project source code

1. Open Visual Studio Code.
2. Select **File → Open Folder**.
3. Select the project source code directory:

```text
C:\Projects\student-activity-platform
```

The main project structure is:

```text
student-activity-platform/
├── backend/
│   ├── app/
│   │   └── main.py
│   └── requirements.txt
└── frontend/
```

* backend/: Contains FastAPI source code and business logic components.
* frontend/: Contains the React/Vite source code.
* app/main.py: The main Backend entry point.
* requirements.txt: Contains the required Python dependencies.

<!--
![Project source code](/images/5-Workshop/5.3-Backend/project-structure.png)
-->

#### Step 2: Open the Backend Terminal

In Visual Studio Code:

* Select **Terminal → New Terminal**.
* Use PowerShell.
* Navigate to the Backend directory:

```powershell
cd C:\Projects\student-activity-platform\backend
```

Verify the Python version:

```powershell
python --version
```

<!--
![Backend terminal](/images/5-Workshop/5.3-Backend/backend-terminal.png)
-->

#### Step 3: Create a Python Virtual Environment

A Python Virtual Environment isolates project dependencies from the system-wide Python environment.

Run the following command:

```powershell
python -m venv .venv
```

Activate the Virtual Environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

After successful activation, the Terminal will display:

```text
(.venv) PS C:\Projects\student-activity-platform\backend>
```

{{% notice note %}}
If the Virtual Environment was already created during the Prerequisite section, simply activate the existing .venv environment.
{{% /notice %}}

<!--
![Python virtual environment](/images/5-Workshop/5.3-Backend/virtual-environment.png)
-->

If PowerShell prevents the activation script from running, use:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

.\.venv\Scripts\Activate.ps1
```

This Execution Policy setting applies only to the current PowerShell session.

Alternatively, invoke the Virtual Environment's Python executable directly:

```powershell
.\.venv\Scripts\python.exe --version
```

#### Step 4: Install Backend dependencies

From the backend directory, run:

```powershell
python -m pip install --upgrade pip

python -m pip install -r requirements.txt
```

The dependencies are installed according to the project configuration and include components such as:

* FastAPI: REST API development.
* Uvicorn: ASGI Server for running the Backend.
* boto3: Connecting to and interacting with AWS services.
* CSV/XLSX processing libraries.
* Authentication and data validation libraries.

Verify the installed packages:

```powershell
python -m pip list
```

<!--
![Install backend dependencies](/images/5-Workshop/5.3-Backend/install-dependencies.png)
-->

#### Step 5: Configure the Demo environment

Set the environment variable for the project's Demo mode:

```powershell
$env:SAP_DEMO_MODE="1"
```

Verify the environment variable:

```powershell
$env:SAP_DEMO_MODE
```

Expected output:

```text
1
```

The Demo version supports local development and testing of the application's business functions.

SQLite supports local data persistence and application state recovery.

{{% notice note %}}
Setting SAP_DEMO_MODE does not automatically migrate all data operations to DynamoDB. AWS integration will be configured and tested separately in section 5.4.
{{% /notice %}}

If preparing AWS connectivity for the next section, configure the AWS Profile:

```powershell
$env:AWS_PROFILE="sap-dev"
```

The profile must already be configured according to section 5.2.

#### Step 6: Explore the FastAPI Application structure

Open:

```text
backend/app/main.py
```

This file initializes the FastAPI Application and connects the Backend components.

When reviewing the source code, pay attention to:

* FastAPI Application initialization.
* API Router registration.
* CORS configuration for Frontend connectivity.
* Data initialization and recovery mechanisms.
* Authentication and Authorization configuration.

The system provides API groups for functionality such as:

* Authentication.
* Student Account Management.
* Activity Management.
* Registration Import.
* Check-in / Check-out.
* Evidence Import.
* Reconciliation.
* Participation Confirmation.
* Analytics and Export.

You do not need to recreate main.py when using the existing project source code.

<!--
![FastAPI main application](/images/5-Workshop/5.3-Backend/fastapi-main.png)
-->

#### Step 7: Start the FastAPI Backend

In the Terminal with the Virtual Environment activated, run:

```powershell
python -m uvicorn app.main:app --reload
```

Explanation:

* app.main: The module containing the FastAPI Application.
* app: The FastAPI Application object defined in the module.
* --reload: Automatically reloads the application when source code changes during development.

After successful startup, the Terminal should display information similar to:

```text
INFO: Uvicorn running on http://127.0.0.1:8000
INFO: Application startup complete.
```

<!--
![Backend running successfully](/images/5-Workshop/5.3-Backend/backend-running.png)
-->

The Backend is now available at:

```text
http://127.0.0.1:8000
```

#### Step 8: Access Swagger UI

Open your browser and navigate to:

[FastAPI Swagger UI](http://127.0.0.1:8000/docs)

FastAPI automatically generates Swagger UI documentation based on the APIs defined in the source code.

Swagger UI allows developers to:

* Explore available REST APIs.
* Inspect HTTP Methods and API Endpoints.
* Review Request Body schemas.
* Inspect input parameters.
* Execute API Requests.
* Verify HTTP Status Codes and Response Bodies.

<!--
![FastAPI Swagger UI](/images/5-Workshop/5.3-Backend/swagger-ui.png)
-->

You can also access the ReDoc API documentation at:

```text
http://127.0.0.1:8000/redoc
```

#### Results

After completing this section:

* The Python Virtual Environment is ready.
* Backend dependencies are installed.
* SAP_DEMO_MODE is configured.
* The FastAPI Backend can run on port 8000.
* Swagger UI is available for REST API testing.

In the next section, we will test Authentication, Activity Management, and business APIs before integrating Amazon DynamoDB.

[Next: Test the Backend and REST APIs](../5.3.2-test-backend/)
