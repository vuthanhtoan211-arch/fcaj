
---
title: "Test the Backend and REST APIs"
date: 2026-11-09
weight: 2
chapter: false
pre: "<b>5.3.2.</b>"
---

## Test the Backend and REST APIs

In this section, we will use Swagger UI to test the main APIs of the Student Activity Management & Engagement Analytics Platform.

The objective is to verify Backend functionality, user authentication, authorization, and business operations before integrating Amazon DynamoDB.

#### Step 1: Verify Backend availability

Ensure that the FastAPI Backend is running:

```powershell
python -m uvicorn app.main:app --reload
```

Access:

[Swagger UI](http://127.0.0.1:8000/docs)

Review the available API groups.

<!--
![Swagger API endpoints](/images/5-Workshop/5.3-Backend/swagger-endpoints.png)
-->

#### Step 2: Test Authentication

In Swagger UI, locate:

```text
POST /auth/login
```

* Expand the Endpoint.
* Choose **Try it out**.
* Enter the ADMIN Demo account information according to the displayed Request Body.
* Choose **Execute**.

If the credentials are valid, the Backend returns a successful login response and Access Token information according to the API response schema.

Expected result:

```text
HTTP 200 OK
```

<!--
![Admin login API](/images/5-Workshop/5.3-Backend/admin-login.png)
-->

{{% notice warning %}}
Use Demo accounts only. Do not expose real passwords or Access Tokens in internship report screenshots.
{{% /notice %}}

#### Step 3: Verify the current user information

Locate the Endpoint:

```text
GET /auth/me
```

Use the Access Token received from the login operation.

If Swagger UI provides an **Authorize** button, select it and enter the Token according to the API authentication configuration.

Alternatively, send the request using PowerShell:

```powershell
$token = "YOUR_DEMO_ACCESS_TOKEN"

Invoke-RestMethod `
  -Method Get `
  -Uri "http://127.0.0.1:8000/auth/me" `
  -Headers @{ Authorization = "Bearer $token" }
```

Replace YOUR_DEMO_ACCESS_TOKEN with a valid Access Token.

Review the Response to verify the current user and assigned Role.

<!--
![Current user API](/images/5-Workshop/5.3-Backend/auth-me.png)
-->

#### Step 4: Test Student Account Management

Using an ADMIN account, locate the Endpoint:

```text
GET /admin/students
```

Execute the Request using the ADMIN Access Token.

Expected results:

* The Backend authorizes the request.
* Student account information is returned according to the API schema.
* ADMIN users can access the authorized account management operations.

Next, sign in with a STUDENT account and attempt to access the same Endpoint.

Expected results:

* The STUDENT account cannot access administrative student account management functionality.
* The Backend returns an authorization error, typically HTTP 403 Forbidden when a valid Token lacks the required permissions.

<!--
![Admin student management API](/images/5-Workshop/5.3-Backend/admin-students.png)
-->

#### Step 5: Test Activity Management

In Swagger UI, locate the Activity Management API group.

Use the Endpoints provided by the current project source code to:

* Create a Demo activity.
* Retrieve the activity list.
* Retrieve activity details.
* Update activity information.

Example activity data:

```text
Activity Name: AWS Workshop Demo
Location: University Hall
Description: Student activity management test
```

When creating the activity, provide the required fields displayed in the Swagger UI Request Body.

Expected results:

* The activity is created successfully.
* The activity appears in the activity list.
* An Activity ID is available for subsequent tests.

<!--
![Create activity API](/images/5-Workshop/5.3-Backend/create-activity.png)

![Activity list API](/images/5-Workshop/5.3-Backend/activity-list.png)
-->

#### Step 6: Test Attendance APIs

The system records Check-in and Check-out in real time.

Attendance Endpoints:

```text
POST /activities/{activity_id}/check-in

POST /activities/{activity_id}/check-out
```

Prepare the following:

* An existing Demo activity.
* A valid Demo student.
* An ADMIN account or an account authorized to record attendance.
* An activity in a state and time window that permits attendance.
* A student registration record if required by the business rules.

In Swagger UI:

1. Expand the Check-in Endpoint.
2. Choose **Try it out**.
3. Enter the Activity ID.
4. Enter the student information according to the Request Body.
5. Choose **Execute**.
6. Review the Response.

Repeat the procedure using the Check-out Endpoint.

Expected results:

* Check-in is associated with the correct activity and student.
* Check-out is recorded after Check-in when the business requirements are satisfied.
* Duplicate or invalid operations are handled appropriately.
* Requests outside the permitted attendance window are handled according to the business rules.

{{% notice note %}}
Attendance APIs operate in real time. Use an activity with an appropriate attendance window instead of an activity that has already ended.
{{% /notice %}}

<!--
![Check-in API test](/images/5-Workshop/5.3-Backend/check-in-test.png)

![Check-out API test](/images/5-Workshop/5.3-Backend/check-out-test.png)
-->

#### Step 7: Verify SQLite persistence

The Demo version uses SQLite to support local data persistence and application state recovery.

To verify this behavior:

* Create a Demo activity through the API.
* Record its Activity ID.
* Stop the Backend using Ctrl + C.
* Restart the Backend:

```powershell
python -m uvicorn app.main:app --reload
```

* Open Swagger UI.
* Retrieve the activity using the relevant API and verify the recorded Activity ID.

The expected result is that data covered by the persistence mechanism remains recoverable after restarting the application.

If the data cannot be recovered, review the Demo configuration and persistence implementation in the source code.

<!--
![SQLite persistence test](/images/5-Workshop/5.3-Backend/sqlite-persistence.png)
-->

#### Step 8: Summarize the test results

| Test | Expected Result |
| --- | --- |
| FastAPI Startup | Backend available on port 8000 |
| Swagger UI | REST API documentation displayed |
| Authentication | Successful login with valid credentials |
| Current User | Current user information returned |
| ADMIN Authorization | Administrative functionality accessible |
| STUDENT Authorization | Administrative functionality restricted |
| Activity Management | Activities can be created and retrieved |
| Check-in / Check-out | Valid real-time attendance recording |
| SQLite Persistence | Data covered by persistence can be recovered |

The results above represent testing criteria. Workshop participants should verify the actual results and capture corresponding screenshots.

#### Conclusion

After completing this section, the FastAPI Backend is prepared and its primary business functions can be tested.

The Backend is ready for React/Vite Frontend connectivity and Amazon DynamoDB integration for cloud-based business data storage.

In the next section, we will create and configure DynamoDB tables and verify data reading and writing operations using the AWS SDK for Python.

[Next: Amazon DynamoDB Integration](../../5.4-DynamoDB/)
