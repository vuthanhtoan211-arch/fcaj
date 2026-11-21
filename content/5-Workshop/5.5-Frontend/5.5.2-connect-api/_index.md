
---
title: "Connect the Frontend to FastAPI REST APIs"
date: 2026-11-09
weight: 2
chapter: false
pre: "<b>5.5.2.</b>"
---

## Connect the Frontend to FastAPI REST APIs

In this section, we will configure communication between the React/Vite Frontend and FastAPI Backend of the Student Activity Management & Engagement Analytics Platform.

The Frontend displays the user interface and receives user interactions. The Backend handles authentication, validation, business logic, and database access.

Both components communicate through REST APIs.

#### 1. Understand Frontend and Backend communication

```text
User
  |
  v
React Component
  |
  v
API Service (api.js)
  |
  | HTTP Request
  v
FastAPI Router
  |
  v
Business Logic / Repository
  |
  v
SQLite / DynamoDB Integration
  |
  v
API Response
  |
  v
React Component
  |
  v
Updated User Interface
```

For example, when an ADMIN opens the activity list:

* The Frontend requests available activities.
* The Backend verifies access permissions.
* The Backend retrieves data from the configured storage mechanism.
* The Backend returns a JSON response.
* The Frontend updates the activity list.

The Frontend does not need to connect directly to DynamoDB using AWS credentials.

#### 2. Verify the Backend and Frontend

Ensure that the Backend is running at:

```text
http://127.0.0.1:8000
```

Ensure that the Frontend is running at:

```text
http://localhost:5173
```

Use two separate Terminals in Visual Studio Code.

Backend Terminal:

```powershell
cd C:\Projects\student-activity-platform\backend

.\.venv\Scripts\Activate.ps1

$env:SAP_DEMO_MODE="1"

python -m uvicorn app.main:app --reload
```

Frontend Terminal:

```powershell
cd C:\Projects\student-activity-platform\frontend

npm run dev
```

<!--
![Frontend and Backend running](/images/5-Workshop/5.5-Frontend/frontend-backend-running.png)
-->

#### 3. Inspect the API Service file

In Visual Studio Code, open:

```text
frontend/src/services/api.js
```

The api.js file manages API requests from the Frontend to the Backend.

Locate the API_BASE_URL configuration.

The local Backend address used in the project is:

```javascript
const API_BASE_URL = "http://127.0.0.1:8000";
```

If the current source code uses environment variables to configure the API address, preserve that mechanism and verify its value.

Do not declare another API_BASE_URL if it already exists.

<!--
![API base URL configuration](/images/5-Workshop/5.5-Frontend/api-base-url.png)
-->

{{% notice note %}}
This code illustrates the local API Base URL. Do not replace the entire api.js file because it also contains business APIs, authentication logic, and error handling.
{{% /notice %}}

#### 4. Understand REST API requests

The system provides APIs such as:

| API | Method | Purpose |
| --- | --- | --- |
| /auth/login | POST | User login |
| /auth/me | GET | Retrieve current user information |
| /auth/logout | POST | User logout |
| /admin/students | GET | Retrieve student accounts |
| /activities/{activity_id}/check-in | POST | Record Check-in |
| /activities/{activity_id}/check-out | POST | Record Check-out |

Other APIs related to Activity Management, Registration, Evidence, Participation, Analytics, and Export should be reviewed using the current Backend's Swagger UI.

The following example retrieves current user information:

```javascript
async function getCurrentUser() {
  const token = localStorage.getItem("sap_access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(
    "http://127.0.0.1:8000/auth/me",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
}
```

Explanation:

* fetch(): Sends an HTTP request.
* Authorization: Provides the Access Token for a protected API.
* response.ok: Checks whether the request was successful.
* response.json(): Converts the Response into JavaScript data.

This example demonstrates REST API communication. Existing project components should continue using the shared API Service rather than introducing duplicated request mechanisms.

#### 5. Understand CORS

The local Frontend and Backend operate on different origins:

```text
Frontend: http://localhost:5173
Backend:  http://127.0.0.1:8000
```

Cross-Origin Resource Sharing (CORS) allows the Backend to specify which origins can access its APIs through a browser.

Open:

```text
backend/app/main.py
```

Review the CORSMiddleware configuration.

Illustrative example:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Use this example only if it matches the current application configuration.

If CORSMiddleware is already configured, do not add a duplicate middleware.

When deploying the Frontend using AWS Amplify, add the actual HTTPS Website origin to the allowed origins.

<!--
![FastAPI CORS configuration](/images/5-Workshop/5.5-Frontend/cors-config.png)
-->

{{% notice note %}}
CORS does not replace Authentication or Authorization. The Backend must still validate Access Tokens and user permissions for protected APIs.
{{% /notice %}}

#### 6. Inspect API requests in the browser

1. Open the Frontend at http://localhost:5173.
2. Press F12 to open Developer Tools.
3. Select the Network tab.
4. Select the Fetch/XHR filter.
5. Sign in using a Demo account.
6. Observe the API request sent to the Backend.

<!--
![Browser network requests](/images/5-Workshop/5.5-Frontend/network-requests.png)
-->

Inspect the login request:

* Request URL.
* Request Method.
* HTTP Status Code.
* Request Payload.
* Response Body.

After successful login, open the activity list or personal profile page.

Inspect the corresponding API requests sent to FastAPI.

{{% notice warning %}}
When capturing Network or Swagger UI screenshots for the internship report, hide Access Tokens, passwords, and personal information.
{{% /notice %}}

#### 7. Handle API responses

The Frontend must handle responses returned by the Backend.

| HTTP Status Code | Meaning |
| --- | --- |
| 200 | Successful request |
| 201 | Resource created successfully |
| 400 | Invalid request |
| 401 | Authentication required or invalid Access Token |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Data or business operation conflict |
| 422 | Invalid input data |
| 500 | Internal Server error |

Actual status codes depend on each API Endpoint.

When an API returns an error, the Frontend should display an appropriate message.

Examples include:

* Invalid login credentials: Display a login failure message.
* Expired Token: Request authentication again according to the application's session handling.
* Insufficient permissions: Display an access restriction message.
* Backend unavailable: Display a connection error.

#### 8. Test business APIs

After establishing connectivity, sign in using an ADMIN Demo account and perform the following operations:

* Open the activity list.
* Create a test activity.
* Open the student account management page.
* Review personal profile information.

Use Developer Tools to inspect the corresponding HTTP requests and responses.

<!--
![Activity API request](/images/5-Workshop/5.5-Frontend/activity-api-request.png)

![Student management API request](/images/5-Workshop/5.5-Frontend/student-api-request.png)
-->

Registration Import, Attendance, and Evidence Import will be covered in detail in the following workshop sections.

#### 9. Troubleshoot common connectivity issues

| Error | What to check |
| --- | --- |
| Failed to fetch | Backend availability, API URL, and CORS |
| ERR_CONNECTION_REFUSED | Uvicorn running on port 8000 |
| CORS error | Allowed Frontend origins in CORSMiddleware |
| HTTP 401 | Access Token and login session |
| HTTP 403 | ADMIN/STUDENT Role |
| HTTP 404 | API path in Swagger UI |
| HTTP 422 | Request Body and API Schema |
| HTTP 500 | Backend logs and data configuration |

#### Results

After completing this section:

* The Frontend is configured to communicate with FastAPI.
* API_BASE_URL is correctly configured.
* REST API requests and responses can be inspected in the browser.
* CORS is configured for the local environment.
* Learners understand common connectivity and API errors.

In the next section, we will explore Authentication, Access Token management, and ADMIN/STUDENT authorization.

[Next: ADMIN/STUDENT authentication and authorization](../5.5.3-authentication/)
