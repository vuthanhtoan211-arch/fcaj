
---
title: "Verify Attendance Data"
date: 2026-11-09
weight: 4
chapter: false
pre: "<b>5.6.4.</b>"
---

## Verify Attendance Data

In this section, we will inspect and verify Check-in and Check-out records in the Student Activity Management & Engagement Analytics Platform.

The objective is to ensure attendance records are associated with the correct student, activity, and timestamps, and can be used for post-event reconciliation.

#### 1. Inspect the attendance list

Sign in using an ADMIN account.

1. Open the Web Application.
2. Select the Demo activity.
3. Open the attendance list.
4. Inspect the recorded Check-in and Check-out information.

<!--
![Attendance verification](/images/5-Workshop/5.6-Registration-Attendance/attendance-verification.png)
-->

Review the following information:

* Activity ID.
* Student ID.
* Student information.
* Check-in timestamp.
* Check-out timestamp.
* Attendance status.

The records should match the operations performed in section 5.6.3.

#### 2. Compare attendance with registration data

Registration and Attendance represent different data groups.

Registration indicates that a student registered for an activity.

Attendance indicates whether a student has recorded Check-in and Check-out.

Example:

| Student ID | Registration | Check-in | Check-out |
| --- | --- | --- | --- |
| 0818000001 | Yes | Yes | Yes |
| 0818000002 | Yes | Yes | No |
| 0818000003 | Yes | No | No |
| 0818000004 | Yes | Yes | Yes |

From this illustrative dataset:

* 4 students registered.
* 3 students checked in.
* 2 students checked out.
* 1 student checked in but has no Check-out record.
* 1 student has no attendance record.

These figures demonstrate the comparison process and do not represent actual test results.

<!--
![Registration attendance comparison](/images/5-Workshop/5.6-Registration-Attendance/registration-attendance-comparison.png)
-->

#### 3. Classify attendance scenarios

##### Complete Check-in and Check-out records

The student has both attendance timestamps.

These records provide input for additional participation verification.

##### Missing Check-out

The student has checked in but does not have a Check-out record.

Organizers may need to investigate before confirming participation.

##### Missing attendance records

The student may appear in the registration list but has not checked in.

Registration alone does not prove that the student attended the activity.

##### Inconsistent records

Examples include:

* A Check-out record without Check-in.
* A Check-out timestamp earlier than Check-in.
* Attendance associated with the wrong Activity ID.
* Student IDs inconsistent with student information.

These cases should be investigated according to the Backend's business rules and validation mechanisms.

#### 4. Inspect attendance data through REST APIs

Open Swagger UI:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

Locate the Attendance API group or activity-related data retrieval Endpoints.

1. Provide an ADMIN Access Token.
2. Enter the Activity ID.
3. Execute the request.
4. Inspect the HTTP Status Code.
5. Compare the Response Body with the Frontend attendance list.

<!--
![Attendance API response](/images/5-Workshop/5.6-Registration-Attendance/attendance-api-response.png)
-->

Use the attendance retrieval Endpoint defined in the current Backend Swagger UI.

Do not introduce a new Endpoint only for testing if the application already provides the required functionality.

#### 5. Verify SQLite Local Persistence

The project's Demo version uses SQLite to support application state persistence and recovery.

To verify attendance persistence:

1. Record Check-in or Check-out for a Demo student.
2. Record the Activity ID, Student ID, and timestamp.
3. Inspect the data through the interface or REST API.
4. Stop the Backend using Ctrl + C.
5. Restart the Backend with the same Demo configuration.
6. Inspect the previously recorded attendance information.

Restart the Backend:

```powershell
cd C:\Projects\student-activity-platform\backend

.\.venv\Scripts\Activate.ps1

$env:SAP_DEMO_MODE="1"

python -m uvicorn app.main:app --reload
```

<!--
![Attendance persistence test](/images/5-Workshop/5.6-Registration-Attendance/attendance-persistence.png)
-->

The expected result is that records covered by the persistence mechanism remain recoverable after the Backend restarts.

If the records are missing, inspect the persistence module, configured data source, and Demo settings.

Do not delete the SQLite file or change its storage path during this test.

#### 6. Verify data in Amazon DynamoDB

If the Attendance AWS Pilot is enabled, attendance data can be inspected directly on AWS.

Open:

[Amazon DynamoDB Console](https://console.aws.amazon.com/dynamodb/)

##### Step 1: Select the AWS Region

```text
Asia Pacific (Singapore)
ap-southeast-1
```

##### Step 2: Select the Attendance table

In the DynamoDB Console:

* Choose Tables.
* Select SAP-Attendance.
* Verify that the table status is ACTIVE.

<!--
![DynamoDB Attendance table](/images/5-Workshop/5.6-Registration-Attendance/dynamodb-attendance-table.png)
-->

##### Step 3: Query records by Activity ID

Choose Explore table items.

* Select Query.
* Enter the Demo activity's activity_id.
* Execute the query.

<!--
![Query Attendance records](/images/5-Workshop/5.6-Registration-Attendance/dynamodb-attendance-query.png)
-->

##### Step 4: Inspect the item

Select the record corresponding to a student whose attendance was recorded.

Inspect the actual attributes:

* activity_id.
* mssv.
* Check-in timestamp.
* Check-out timestamp.
* Attendance attributes stored by the repository.

Compare these values with the Backend response and Frontend display.

<!--
![Attendance item details](/images/5-Workshop/5.6-Registration-Attendance/dynamodb-attendance-item.png)
-->

{{% notice note %}}
Verify DynamoDB records only when the corresponding Attendance AWS integration is enabled. A successful Check-in or Check-out API response does not automatically prove that data was written to DynamoDB.
{{% /notice %}}

#### 7. Verify DynamoDB records using Python

Use boto3 to retrieve an Attendance Record by Activity ID and Student ID.

Create a separate test file in the backend directory:

```text
test_attendance_record.py
```

Content:

```python
import boto3
from pprint import pprint

session = boto3.Session(
    profile_name="sap-dev",
    region_name="ap-southeast-1"
)

dynamodb = session.resource("dynamodb")

table = dynamodb.Table("SAP-Attendance")

activity_id = input("Activity ID: ").strip()
mssv = input("Student ID: ").strip()

response = table.get_item(
    Key={
        "activity_id": activity_id,
        "mssv": mssv
    },
    ConsistentRead=True
)

item = response.get("Item")

if item:
    print("Attendance record found")
    pprint(item)
else:
    print("Attendance record not found")
```

Run:

```powershell
python test_attendance_record.py
```

Enter the Activity ID and Student ID of the test record.

The script uses the sap-dev AWS Profile and requires dynamodb:GetItem permission for SAP-Attendance.

The key structure must match the table verified in section 5.4.

<!--
![Python attendance verification](/images/5-Workshop/5.6-Registration-Attendance/attendance-python-test.png)
-->

The script is read-only and does not update or delete DynamoDB items.

#### 8. Verify data access permissions

Test the ADMIN and STUDENT roles.

##### ADMIN

* View attendance lists for authorized activities.
* Inspect student attendance information within administrative permissions.
* Perform authorized attendance management operations.

##### STUDENT

* View personal participation information within the authorized scope.
* Cannot access unauthorized administrative attendance lists.
* Cannot modify another student's attendance records.

Verify both the interface and REST APIs to ensure Backend authorization is enforced.

<!--
![Attendance authorization](/images/5-Workshop/5.6-Registration-Attendance/attendance-authorization.png)
-->

#### 9. Verify data consistency

Compare the following data sources:

| Component | Verification |
| --- | --- |
| Registration | Student and activity association |
| Frontend | Displayed attendance status |
| Backend | Data returned through REST APIs |
| SQLite | Records covered by Local Persistence |
| DynamoDB | Cloud records when AWS Pilot is enabled |

If discrepancies are identified:

* Verify the Activity ID.
* Verify the Student ID.
* Inspect interface filters.
* Check timestamps and time zones.
* Review repository and AWS Pilot settings.
* Inspect Backend read/write errors.

Matching local and DynamoDB records in a test does not demonstrate that the entire system supports automatic bidirectional synchronization.

#### 10. Prepare data for reconciliation

After verifying attendance records, we will use them as inputs for participation reconciliation.

Example:

```text
Student ID: 0818000001

Registration: YES
Check-in: Recorded
Check-out: Recorded
Evidence: Not yet verified
Participation: Not yet confirmed
```

Having both Check-in and Check-out records does not automatically mean that every participation requirement has been satisfied.

Some activities may require additional evidence or other conditions.

The next workflow is:

```text
Registration Data
        +
Attendance Data
        +
Evidence Data
        |
        v
Reconciliation
        |
        v
ADMIN Confirmation
        |
        v
Participation Result
```

Final participation confirmation must follow the activity's business rules and appropriate administrative decisions.

#### 11. Summarize test results

| Test | Expected Result |
| --- | --- |
| Registration List | Correct registered students displayed |
| Check-in | Correct student and activity recorded |
| Check-out | Correct Attendance Record updated |
| Duplicate Operation | No duplicate attendance record |
| Time Validation | Attendance time rules enforced |
| Backend Authorization | Unauthorized access denied |
| Local Persistence | Covered records recoverable |
| DynamoDB Verification | Item available when AWS Pilot is enabled |
| Data Consistency | Records match performed operations |

Workshop participants should record actual results and capture corresponding screenshots for each test.

#### Conclusion

In this section, we completed the registration and attendance management workflow of the Student Activity Management & Engagement Analytics Platform.

Registration data is imported from the University Portal, while Attendance data is recorded directly in real time through FastAPI REST APIs.

By comparing Frontend, Backend, SQLite, and Amazon DynamoDB records, we gained a better understanding of data accuracy and persistence verification in a practical management system.

In the next section, we will import participation evidence from Google Forms/Google Sheets, reconcile data, and confirm student participation results.

[Next: Evidence Processing and Reconciliation](../../5.7-Evidence-Reconciliation/)
