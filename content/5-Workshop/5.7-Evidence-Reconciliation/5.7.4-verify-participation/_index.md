
---
title: "Verify Participation Results"
date: 2026-11-09
weight: 4
chapter: false
pre: "<b>5.7.4.</b>"
---

## Verify Participation Results

In this section, we will verify reconciliation and participation confirmation results in the Student Activity Management & Engagement Analytics Platform.

The objective is to ensure that Participation records are associated with the correct student, activity, and confirmation status, and can be used for Analytics Dashboard and Export.

#### 1. Inspect the Participation list

Sign in using an ADMIN account.

1. Open the Web Application.
2. Select the Demo activity.
3. Open Participation Management.
4. Review reconciled student records.
5. Inspect the confirmation statuses.

<!--
![Participation verification interface](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-verification.png)
-->

Review the following information:

* Activity ID.
* Student ID.
* Registration.
* Check-in.
* Check-out.
* Evidence.
* Reconciliation Result.
* Participation Status.

The results must match the operations performed in section 5.7.3.

#### 2. Compare source data and confirmation results

Use the synthetic dataset from previous exercises:

| Student ID | Registration | Check-in | Check-out | Evidence |
| --- | --- | --- | --- | --- |
| 0818000001 | Yes | Yes | Yes | Yes |
| 0818000002 | Yes | Yes | No | Yes |
| 0818000003 | Yes | No | No | Yes |
| 0818000004 | Yes | Yes | Yes | No |

Illustrative outcomes after the two ADMIN decisions in section 5.7.3:

| Student ID | Confirmation Result |
| --- | --- |
| 0818000001 | CONFIRMED |
| 0818000002 | Not yet confirmed |
| 0818000003 | REJECTED |
| 0818000004 | Not yet confirmed |

"Not yet confirmed" is a business description rather than a newly introduced Backend status.

This example contains:

* Total registrations: 4.
* Confirmed participants: 1.
* Rejected participants: 1.
* Students awaiting a final decision: 2.

These are synthetic workshop figures, not actual university activity results.

<!--
![Participation comparison](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-comparison.png)
-->

#### 3. Verify results through REST APIs

Open Swagger UI:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

Locate the Participation retrieval Endpoint defined in the current Backend.

Perform the following:

1. Provide an ADMIN Access Token.
2. Enter the Activity ID.
3. Execute the request.
4. Inspect the HTTP Status Code.
5. Inspect records in the Response.
6. Compare the results with the Frontend.

<!--
![Participation API response](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-api-response.png)
-->

Do not create a new Endpoint if the Backend already provides the necessary retrieval functionality.

#### 4. Verify SQLite Local Persistence

The Demo version uses SQLite to support local persistence and application state recovery.

To verify participation persistence:

1. Confirm or reject a Demo student.
2. Record the Activity ID, Student ID, and status.
3. Verify the result through the REST API.
4. Stop FastAPI using Ctrl + C.
5. Restart the Backend with the same configuration.
6. Retrieve the Participation Record again.

Restart the Backend:

```powershell
cd C:\Projects\student-activity-platform\backend

.\.venv\Scripts\Activate.ps1

$env:SAP_DEMO_MODE="1"

python -m uvicorn app.main:app --reload
```

<!--
![Participation persistence test](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-persistence.png)
-->

The expected result is that records covered by the persistence mechanism remain recoverable after restarting the Backend.

If records are missing, review:

* SAP_DEMO_MODE configuration.
* SQLite storage location.
* Persistence module.
* Repository and configured data source.
* Backend startup logs.

Do not delete the SQLite file during verification.

#### 5. Verify Evidence in Amazon DynamoDB

If the Evidence AWS Pilot is enabled:

1. Open the [Amazon DynamoDB Console](https://console.aws.amazon.com/dynamodb/).
2. Select Singapore - ap-southeast-1.
3. Select SAP-Evidence.
4. Verify the ACTIVE status.
5. Choose Explore table items.
6. Select Query.
7. Enter the target activity_id.
8. Execute the query.

<!--
![DynamoDB evidence query](/images/5-Workshop/5.7-Evidence-Reconciliation/dynamodb-evidence-query.png)
-->

Inspect the items associated with the Demo students.

During the project's AWS Pilot test on November 6, 2026, three synthetic Evidence records were verified in DynamoDB.

Actual workshop record counts depend on the imported dataset.

#### 6. Verify Participation in Amazon DynamoDB

If the Participation AWS Pilot is enabled:

1. Return to the Tables list.
2. Select SAP-Participation.
3. Choose Explore table items.
4. Select Query.
5. Enter the Activity ID of the reconciled activity.
6. Execute the query.

<!--
![DynamoDB participation query](/images/5-Workshop/5.7-Evidence-Reconciliation/dynamodb-participation-query.png)
-->

Inspect the actual item attributes:

* activity_id.
* mssv.
* Attendance status.
* Evidence status.
* Reconciliation result.
* Participation confirmation status.

Exact attribute names must match the stored item and current repository implementation.

<!--
![DynamoDB participation item](/images/5-Workshop/5.7-Evidence-Reconciliation/dynamodb-participation-item.png)
-->

During a previous AWS integration test, three synthetic Participation records were retrieved.

Some records contained:

```text
NO_ATTENDANCE
REJECTED
evidence_status: YES
```

This illustrates a scenario where a student has evidence but lacks attendance records and is not confirmed for participation.

{{% notice note %}}
Three records represent an earlier project test result, not a required workshop record count. New workshop data must be verified using the actual Activity ID and Student ID.
{{% /notice %}}

#### 7. Verify records using boto3

Python can retrieve Evidence and Participation records for the same activity.

Create a separate test script:

```text
backend/test_participation_verification.py
```

Content:

```python
import boto3
from boto3.dynamodb.conditions import Key

session = boto3.Session(
    profile_name="sap-dev",
    region_name="ap-southeast-1"
)

dynamodb = session.resource("dynamodb")

activity_id = input("Activity ID: ").strip()

if not activity_id:
    raise ValueError("Activity ID is required")

tables = [
    "SAP-Evidence",
    "SAP-Participation"
]

for table_name in tables:
    table = dynamodb.Table(table_name)

    records = []

    params = {
        "KeyConditionExpression":
            Key("activity_id").eq(activity_id),
        "ConsistentRead": True
    }

    while True:
        response = table.query(**params)

        records.extend(
            response.get("Items", [])
        )

        last_key = response.get("LastEvaluatedKey")

        if not last_key:
            break

        params["ExclusiveStartKey"] = last_key

    print("\nTable:", table_name)
    print("Total records:", len(records))

    for record in records:
        print("Student ID:", record.get("mssv"))
```

Run:

```powershell
cd C:\Projects\student-activity-platform\backend

.\.venv\Scripts\Activate.ps1

python test_participation_verification.py
```

Enter the Activity ID to inspect.

<!--
![Python participation verification](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-python-test.png)
-->

The script uses the sap-dev AWS Profile and requires dynamodb:Query permissions for the relevant tables.

It handles pagination using LastEvaluatedKey to retrieve all result pages for the selected activity.

The script only reads records and displays Student IDs. It does not update or delete data.

#### 8. Inspect an individual student record

Use GetItem to verify a specific student's Participation Record.

Example:

```python
import boto3
from pprint import pprint

session = boto3.Session(
    profile_name="sap-dev",
    region_name="ap-southeast-1"
)

dynamodb = session.resource("dynamodb")

table = dynamodb.Table("SAP-Participation")

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
    print("Participation record found")
    pprint(item)
else:
    print("Participation record not found")
```

This example requires dynamodb:GetItem permission.

The key structure must match the SAP-Participation Key Schema verified in section 5.4.

If no item is returned, verify Activity ID, Student ID, AWS Profile, Region, and AWS Pilot configuration.

A missing DynamoDB item does not automatically demonstrate a failed confirmation when the Backend uses local persistence.

#### 9. Verify the STUDENT interface

Sign out of the ADMIN account.

Sign in using the Demo STUDENT account associated with a confirmed participation record.

Verify:

* The student can view authorized personal participation information.
* The correct activity is displayed.
* The confirmation status matches the Backend.
* Administrative confirmation controls are unavailable.
* Other students' information cannot be accessed without authorization.

<!--
![Student participation history](/images/5-Workshop/5.7-Evidence-Reconciliation/student-participation-history.png)
-->

Repeat the test with a rejected Demo record if a corresponding test account is available.

If the current interface does not display a particular status, record the actual behavior for future Frontend improvements.

#### 10. Verify data consistency

Compare the following components:

| Component | Verification |
| --- | --- |
| Registration | Student registration information |
| Attendance | Check-in and Check-out records |
| Evidence | Participation evidence |
| Reconciliation | Consolidated evaluation results |
| Participation | Final confirmation results |
| Frontend | Role-appropriate displayed information |
| SQLite | Records covered by local persistence |
| DynamoDB | Cloud records when AWS Pilot is enabled |

If discrepancies are identified:

* Verify Activity ID.
* Verify Student ID.
* Review the latest source data.
* Verify whether reconciliation results are current.
* Inspect repository configuration.
* Review Backend logs.
* Inspect AWS storage results.

Matching local and DynamoDB records in one test does not prove complete migration or automatic bidirectional synchronization.

#### 11. Prepare data for Analytics Dashboard

After verification, Participation becomes an important source for analytical indicators.

Example:

```text
Total Registrations: 4
Confirmed Participants: 1
Rejected Participants: 1
Unconfirmed Students: 2
```

The confirmed participation rate among registered students is:

```text
Participation Rate
= Confirmed Registered Students / Total Registrations
  x 100

= 1 / 4 x 100

= 25%
```

This illustrative result represents a point in time before all administrative decisions are finalized.

The rate may change after additional participation decisions.

Analytical metrics should use consistent business definitions and distinguish between:

* Registered students.
* Students with Check-in records.
* Students with complete attendance records.
* Confirmed participants.

Analytics and Export functionality will be covered in section 5.8.

#### 12. Summarize test results

| Test | Expected Result |
| --- | --- |
| Evidence Import | Evidence data processed |
| Reconciliation | Three source datasets matched correctly |
| CONFIRMED | Correct confirmation result stored |
| REJECTED | Correct rejection result stored |
| ADMIN Authorization | Administrative operations permitted |
| STUDENT Authorization | Only authorized information accessible |
| Local Persistence | Covered records recoverable |
| SAP-Evidence | Records accessible when AWS Pilot is enabled |
| SAP-Participation | Results accessible when AWS Pilot is enabled |
| Data Consistency | Results match business records |

Workshop participants should record actual results and capture corresponding screenshots.

{{% notice warning %}}
Do not disclose real student information or AWS authentication credentials in DynamoDB Console, Terminal, or REST API screenshots.
{{% /notice %}}

#### Conclusion

In this section, we completed the evidence processing, reconciliation, and student participation confirmation workflow.

Data from the University Portal, Attendance records, and Google Forms/Google Sheets was combined to support ADMIN business decisions.

Through FastAPI REST APIs, SQLite Local Persistence, and Amazon DynamoDB integration, we can verify the application's data processing and storage behavior.

Participation results provide a foundation for Analytics Dashboard, student engagement analysis, and report exports.

[Next: Analytics Dashboard and Export](../../5.8-Analytics-Export/)
