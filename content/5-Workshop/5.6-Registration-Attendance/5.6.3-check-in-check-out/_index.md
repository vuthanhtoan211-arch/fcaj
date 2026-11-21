
---
title: "Record Check-in and Check-out"
date: 2026-11-09
weight: 3
chapter: false
pre: "<b>5.6.3.</b>"
---

## Record Check-in and Check-out

In this section, we will practice real-time student attendance recording in the Student Activity Management & Engagement Analytics Platform.

Check-in records a student's arrival at an activity.

Check-out records when the student completes or leaves the activity according to the applicable business rules.

Both operations are performed through the Web interface and FastAPI REST APIs.

#### 1. Understand the attendance workflow

```text
ADMIN / Organizer
       |
       v
Scan Student Card QR
or Enter Student ID
       |
       v
React / Vite Frontend
       |
       | POST Check-in / Check-out
       v
FastAPI Backend
       |
       v
Validate Business Rules
       |
       v
Store Attendance Record
       |
       v
Return API Response
       |
       v
Display Attendance Result
```

The Backend validates:

* Authentication and user permissions.
* Activity ID.
* Student ID.
* Activity status.
* Registration requirements where applicable.
* Attendance time windows.
* Existing attendance records.

After the required conditions are satisfied, the Backend records Attendance data and returns the result.

#### 2. Prepare the workshop environment

Complete sections 5.6.1 and 5.6.2 before proceeding.

Open the Backend Terminal:

```powershell
cd C:\Projects\student-activity-platform\backend

.\.venv\Scripts\Activate.ps1

$env:SAP_DEMO_MODE="1"

python -m uvicorn app.main:app --reload
```

Open the Frontend Terminal:

```powershell
cd C:\Projects\student-activity-platform\frontend

npm run dev
```

Access:

[http://localhost:5173](http://localhost:5173)

If both services are already running, do not start additional instances.

#### 3. Sign in and select an activity

1. Sign in using an ADMIN Demo account.
2. Open Activity Management.
3. Select the prepared activity.
4. Open the attendance interface.
5. Verify the activity name, status, and schedule.

<!--
![Attendance management page](/images/5-Workshop/5.6-Registration-Attendance/attendance-management.png)
-->

Ensure that the current time is within the permitted Check-in window.

#### 4. Perform Check-in through the interface

##### Step 1: Receive the student ID

Select a student from the sample registration list:

```text
Student ID: 0818000001
```

The organizer can:

* Scan the student card QR code using compatible hardware.
* Enter the student ID manually in the attendance interface.

<!--
![Input student ID](/images/5-Workshop/5.6-Registration-Attendance/check-in-input.png)
-->

##### Step 2: Submit the Check-in request

Select the Check-in operation.

The Frontend sends a request to:

```text
POST /activities/{activity_id}/check-in
```

Where:

* activity_id: Identifier of the selected activity.
* Request Body: Student information according to the API Schema.
* Authorization: ADMIN Access Token.

The Backend validates the request and business conditions before storing the record.

##### Step 3: Verify the result

After successful processing, the interface should display the appropriate Check-in result.

Illustrative example:

```text
Student ID: 0818000001
Activity: AWS Workshop Demo
Operation: Check-in
Result: Success
```

The actual timestamp is recorded according to the Backend implementation.

<!--
![Check-in successful](/images/5-Workshop/5.6-Registration-Attendance/check-in-success.png)
-->

Entering a student ID alone does not confirm successful attendance. Wait for the Backend result.

#### 5. Test the Check-in API using Swagger UI

Open:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

1. Sign in through POST /auth/login if an Access Token is not available.
2. Configure authentication according to Swagger UI.
3. Locate POST /activities/{activity_id}/check-in.
4. Choose Try it out.
5. Enter the Activity ID.
6. Enter student information according to the actual Request Body.
7. Choose Execute.
8. Inspect the HTTP Status Code and Response Body.

<!--
![Check-in Swagger API](/images/5-Workshop/5.6-Registration-Attendance/check-in-api.png)
-->

Illustrative Request Body:

```json
{
    "mssv": "0818000002"
}
```

Verify the actual field names and required attributes in the current Swagger UI.

Use a different student from the previous Check-in test when testing a new successful attendance operation.

{{% notice note %}}
Repeating Check-in for a student who already has a Check-in record may produce a duplicate-operation response. This tests business validation rather than API connectivity.
{{% /notice %}}

#### 6. Test invalid Check-in scenarios

Use synthetic data to verify Backend business validation.

##### Scenario 1: Duplicate Check-in

Submit Check-in again for a student who has already checked in.

Expected results:

* The Backend identifies the existing record.
* No additional independent Check-in record is created for the same student and activity.
* The interface displays an appropriate result or notification.

<!--
![Duplicate check-in](/images/5-Workshop/5.6-Registration-Attendance/duplicate-check-in.png)
-->

##### Scenario 2: Invalid student ID

Enter an unknown student ID or an unsupported student ID format.

Expected results:

* The Backend rejects or handles the request according to the current rules.
* Attendance is not incorrectly recorded for another student.

##### Scenario 3: Outside the Check-in window

Use an activity whose Check-in window has not opened or has already closed.

Expected results:

* The Backend validates the current time.
* The request is not recorded contrary to the attendance rules.

<!--
![Attendance time validation](/images/5-Workshop/5.6-Registration-Attendance/check-in-time-error.png)
-->

##### Scenario 4: Insufficient permissions

Use a STUDENT account to call an administrative attendance API.

Expected results:

* The Backend denies the request when the user lacks permission.
* No unauthorized Attendance Record is created.

#### 7. Perform Check-out through the interface

After a student has checked in and satisfies the Check-out requirements:

1. Open the attendance interface.
2. Select the correct activity.
3. Select the Check-out operation.
4. Scan the QR code or enter the student ID.
5. Submit the Check-out request.

Example:

```text
Student ID: 0818000001
```

The Frontend sends a request to:

```text
POST /activities/{activity_id}/check-out
```

<!--
![Check-out interface](/images/5-Workshop/5.6-Registration-Attendance/check-out-input.png)
-->

The Backend validates the Check-out requirements and updates the corresponding Attendance Record.

Expected result:

```text
Student ID: 0818000001
Activity: AWS Workshop Demo
Operation: Check-out
Result: Success
```

<!--
![Check-out successful](/images/5-Workshop/5.6-Registration-Attendance/check-out-success.png)
-->

{{% notice note %}}
A successful Check-out requires an appropriate activity state and time window. Do not assume that Check-out is always permitted immediately after Check-in.
{{% /notice %}}

#### 8. Test the Check-out API

Open Swagger UI.

Locate:

```text
POST /activities/{activity_id}/check-out
```

Perform the following:

1. Provide the ADMIN Access Token.
2. Enter the Activity ID.
3. Enter the ID of a student who has checked in.
4. Review the required Request Body fields.
5. Execute the request.
6. Inspect the Response.

<!--
![Check-out Swagger API](/images/5-Workshop/5.6-Registration-Attendance/check-out-api.png)
-->

Use a student who has not previously checked out when testing the first Check-out operation.

#### 9. Test invalid Check-out scenarios

| Test Case | Expected Result |
| --- | --- |
| Valid Check-out | Attendance Record updated |
| Missing Check-in | Handled according to business rules |
| Duplicate Check-out | No duplicate Check-out record |
| Outside permitted time | Handled according to time rules |
| Incorrect Activity ID | No update to an unrelated activity |
| Invalid Student ID | No incorrect attendance record |
| STUDENT calls admin API | Access denied when unauthorized |

#### 10. Inspect Attendance data in the interface

After Check-in and Check-out, open the activity's attendance list.

Illustrative data:

| Student ID | Check-in | Check-out |
| --- | --- | --- |
| 0818000001 | 08:05 | 11:30 |
| 0818000002 | 08:10 | Not recorded |
| 0818000003 | Not recorded | Not recorded |

The timestamps are illustrative. Actual workshop results must come from records stored by the Backend.

The attendance list helps organizers identify:

* Students who have checked in.
* Students who have checked out.
* Students without attendance records.
* Students with missing Check-out records.

<!--
![Attendance list](/images/5-Workshop/5.6-Registration-Attendance/attendance-list.png)
-->

#### 11. Inspect HTTP requests and responses

Open Developer Tools and select the Network tab.

Inspect Check-in and Check-out requests:

* Request URL.
* HTTP Method.
* Request Payload.
* HTTP Status Code.
* Response Body.

Possible Attendance API response codes include:

| HTTP Status Code | Meaning |
| --- | --- |
| 200 | Successful request processing |
| 401 | Authentication required |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | State or business operation conflict |
| 422 | Invalid input or business conditions |

The exact response codes should be verified against the Backend Attendance Service error mapping.

<!--
![Attendance API network](/images/5-Workshop/5.6-Registration-Attendance/attendance-network.png)
-->

#### 12. Handle connectivity interruptions

In the Demo environment, FastAPI runs locally.

If the Backend becomes unavailable or the Frontend loses connectivity:

* The attendance request may not reach the Backend.
* A student should not be marked as successfully recorded without a confirmed response.
* ADMIN should verify connectivity and the record status before retrying.

If a response is lost, the Backend may already have saved the attendance record. Inspect the attendance list before submitting another request.

The current system should not be assumed to provide offline attendance recording or automatic synchronization queues after connectivity is restored.

#### Results

After completing this section, we have practiced real-time attendance recording from the Frontend to FastAPI.

Each Check-in and Check-out operation is processed using the Activity ID, Student ID, user permissions, and applicable business conditions.

Attendance records provide the foundation for subsequent data verification, reconciliation, and participation confirmation.

[Next: Verify Attendance Data](../5.6.4-verify-attendance/)
