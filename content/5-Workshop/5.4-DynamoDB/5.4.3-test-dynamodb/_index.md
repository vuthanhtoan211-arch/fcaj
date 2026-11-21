
---
title: "Test DynamoDB data reading and writing"
date: 2026-11-09
weight: 3
chapter: false
pre: "<b>5.4.3.</b>"
---

## Test DynamoDB Data Reading and Writing

In this section, we will test connectivity, data retrieval, and business data storage between the FastAPI Backend and Amazon DynamoDB.

The objective is to verify Backend business operations and confirm that data covered by the AWS Pilot integration can be stored on AWS.

#### 1. Prepare the testing environment

Open PowerShell in the Backend directory:

```powershell
cd C:\Projects\student-activity-platform\backend

.\.venv\Scripts\Activate.ps1
```

Configure AWS:

```powershell
$env:AWS_PROFILE="sap-dev"
$env:AWS_REGION="ap-southeast-1"
$env:AWS_DEFAULT_REGION="ap-southeast-1"
```

Verify resources:

```powershell
.\.venv\Scripts\python.exe .\check_aws_resources.py
```

Ensure that all five DynamoDB tables have an ACTIVE status.

#### 2. Test data retrieval using boto3

We will use the DynamoDB Resource interface to retrieve data from SAP-Activities.

Create a Python test file in the backend directory:

```text
test_dynamodb_read.py
```

Add the following content:

```python
import boto3
from pprint import pprint

session = boto3.Session(
    profile_name="sap-dev",
    region_name="ap-southeast-1"
)

dynamodb = session.resource("dynamodb")

table = dynamodb.Table("SAP-Activities")

response = table.scan(Limit=5)

print("DynamoDB connection successful")
print("Returned items:", response.get("Count", 0))

for item in response.get("Items", []):
    pprint(item)
```

Run the script:

```powershell
python test_dynamodb_read.py
```

Expected results:

* Successful DynamoDB connectivity.
* Data can be retrieved from SAP-Activities.
* Existing items are displayed if the table contains data.

<!--
![DynamoDB Read Test](/images/5-Workshop/5.4-DynamoDB/dynamodb-read-test.png)
-->

If the table is empty, the returned item count may be zero. This does not indicate a connection failure.

{{% notice note %}}
Scan is used here to inspect a small set of records. In real applications, use GetItem or Query when the data keys are known to avoid unnecessary table scans. Limit controls the number of items evaluated in one request, not the total number of items in the table.
{{% /notice %}}

#### 3. Test activity creation through the Backend

Start FastAPI:

```powershell
$env:SAP_DEMO_MODE="1"

python -m uvicorn app.main:app --reload
```

Before starting the Backend, review the Activities AWS Pilot or repository configuration in the current source code to ensure that activity creation uses DynamoDB.

Open Swagger UI:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

##### Step 1: Sign in as ADMIN

1. Locate POST /auth/login.
2. Choose **Try it out**.
3. Enter the ADMIN Demo account credentials.
4. Choose **Execute**.
5. Retrieve the returned Access Token.

Use the Access Token to authenticate administrative requests according to the Backend configuration.

##### Step 2: Create a test activity

Locate the activity creation API in the Activities group.

The Endpoint is typically:

```text
POST /activities
```

Enter test data according to the Request Body displayed in Swagger UI.

Example information:

```text
Activity Name: AWS DynamoDB Integration Test
Location: University Hall
Description: Testing cloud data storage
```

Provide the required time, status, and other fields according to the actual API Schema.

Choose **Execute**.

<!--
![Create Activity API](/images/5-Workshop/5.4-DynamoDB/create-activity-api.png)
-->

Expected results:

* The Backend creates the activity successfully.
* The Response contains the new Activity ID.
* If the Activities AWS Pilot is correctly enabled, the item appears in SAP-Activities.

Record the actual Activity ID for the next step.

#### 4. Verify the activity using GetItem

DynamoDB GetItem retrieves an item when its complete Primary Key is provided.

An Activity ID used in a previous project integration test was:

```text
ACT#AWSTEST-9198ABC48900
```

For a new workshop execution, use the Activity ID returned by your API rather than relying on an existing test record.

Create the following test file:

```text
test_dynamodb_activity.py
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

table = dynamodb.Table("SAP-Activities")

activity_id = input("Enter Activity ID: ").strip()

response = table.get_item(
    Key={
        "activity_id": activity_id
    },
    ConsistentRead=True
)

item = response.get("Item")

if item:
    print("Activity found in DynamoDB")
    pprint(item)
else:
    print("Activity not found in DynamoDB")
```

Run:

```powershell
python test_dynamodb_activity.py
```

Enter the Activity ID created through the Backend.

<!--
![DynamoDB GetItem Test](/images/5-Workshop/5.4-DynamoDB/dynamodb-getitem.png)
-->

Finding the item confirms that the Activity exists in DynamoDB.

If no item is found, check:

* Whether the Activity ID is correct.
* Whether the Region and AWS Profile are correct.
* Whether AWS integration is enabled for Activities.
* Whether the repository is using SQLite or DynamoDB.
* Whether the Backend logs contain IAM or connectivity errors.

#### 5. Test Registration, Attendance, and Evidence

Use a Demo activity and synthetic student accounts to perform the following operations.

##### Registration

* Import student registrations using the CSV/XLSX Template.
* Verify Registration data through the Backend.
* Inspect corresponding records in SAP-Registrations when its AWS Pilot is enabled.

##### Attendance

* Record Check-in and Check-out through the attendance APIs.
* Use an activity within a valid attendance state and time window.
* Verify corresponding data in SAP-Attendance.

Attendance Endpoints:

```text
POST /activities/{activity_id}/check-in
POST /activities/{activity_id}/check-out
```

##### Evidence

* Import participation evidence from CSV/XLSX files.
* Validate student IDs and evidence information.
* Inspect corresponding items in SAP-Evidence.

<!--
![Registration AWS Pilot](/images/5-Workshop/5.4-DynamoDB/registration-pilot.png)

![Attendance AWS Pilot](/images/5-Workshop/5.4-DynamoDB/attendance-pilot.png)

![Evidence AWS Pilot](/images/5-Workshop/5.4-DynamoDB/evidence-pilot.png)
-->

Each business data group may have its own AWS Pilot configuration. Verify and enable the appropriate settings before performing each integration test.

#### 6. Query data by Activity ID

The Registration, Attendance, Evidence, and Participation tables use activity_id as the Partition Key and mssv as the Sort Key.

Query can retrieve records associated with the same activity.

Create:

```text
test_dynamodb_query.py
```

Add the following content:

```python
import boto3
from boto3.dynamodb.conditions import Key
from pprint import pprint

session = boto3.Session(
    profile_name="sap-dev",
    region_name="ap-southeast-1"
)

dynamodb = session.resource("dynamodb")

activity_id = input("Enter Activity ID: ").strip()

tables = [
    "SAP-Registrations",
    "SAP-Attendance",
    "SAP-Evidence",
    "SAP-Participation"
]

for table_name in tables:
    table = dynamodb.Table(table_name)

    items = []

    params = {
        "KeyConditionExpression":
            Key("activity_id").eq(activity_id),
        "ConsistentRead": True
    }

    while True:
        response = table.query(**params)

        items.extend(response.get("Items", []))

        last_key = response.get("LastEvaluatedKey")

        if not last_key:
            break

        params["ExclusiveStartKey"] = last_key

    print("\nTable:", table_name)
    print("Total items:", len(items))

    for item in items:
        pprint(item)
```

Run:

```powershell
python test_dynamodb_query.py
```

Enter the Activity ID to inspect.

The script queries the four tables and displays records associated with the specified activity.

<!--
![DynamoDB Query Results](/images/5-Workshop/5.4-DynamoDB/dynamodb-query.png)
-->

#### 7. Test Participation

After preparing Registration, Attendance, and Evidence data:

* Perform the reconciliation operation through the Backend.
* Inspect complete and incomplete participation records.
* Confirm participation using ADMIN permissions.
* Verify SAP-Participation records when the corresponding AWS Pilot is enabled.

Relevant statuses may include:

* CONFIRMED: Participation has been confirmed.
* REJECTED: Participation has not been approved.

Actual results depend on the input data, business rules, and ADMIN decisions.

<!--
![Participation AWS Pilot](/images/5-Workshop/5.4-DynamoDB/participation-pilot.png)
-->

#### 8. Summarize the test results

| Test | Expected Result |
| --- | --- |
| AWS Connectivity | Successful AWS connection |
| Scan | Activity data can be retrieved |
| Create Activity | The Backend creates an activity |
| GetItem | The activity is found in DynamoDB |
| Registration | Registration records appear when the Pilot is enabled |
| Attendance | Attendance is recorded according to business rules |
| Evidence | Evidence is stored by Activity ID and Student ID |
| Participation | Reconciliation and confirmation results are stored when the Pilot is enabled |
| Query | Records can be retrieved by Activity ID |

These results represent workshop testing criteria.

Participants should compare API Responses with DynamoDB items to confirm actual Cloud data storage.

#### Conclusion

In this section, we explored DynamoDB connectivity, Scan, GetItem, and Query operations, and tested business data writes through the Backend.

A successful API Response does not automatically prove that data was stored on AWS. Direct DynamoDB item verification is necessary to confirm the integration.

[Next: Verify data in the AWS Console](../5.4.4-verify-data/)
