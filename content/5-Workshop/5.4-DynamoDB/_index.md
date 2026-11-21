
---
title: "Verify data in the AWS Console"
date: 2026-11-09
weight: 4
chapter: false
pre: "<b>5.4.4.</b>"
---

## Verify Data in the AWS Console

In this section, we will use the AWS Management Console to inspect data stored in the Amazon DynamoDB tables of the Student Activity Management & Engagement Analytics Platform.

The objective is to compare data across the FastAPI Backend, local SQLite environment, and Amazon DynamoDB.

#### 1. Open the Amazon DynamoDB Console

1. Open the [Amazon DynamoDB Console](https://console.aws.amazon.com/dynamodb/).

2. Select the AWS Region:

```text
Asia Pacific (Singapore)
ap-southeast-1
```

3. In the navigation pane, choose **Tables**.

4. Verify the five project tables.

<!--
![DynamoDB Tables](/images/5-Workshop/5.4-DynamoDB/dynamodb-tables.png)
-->

Ensure that the tables have an ACTIVE status.

#### 2. Verify Activities data

1. Select **SAP-Activities**.

2. Choose **Explore table items**.

3. Switch to Query mode when searching by Partition Key.

4. Enter the Activity ID created in section 5.4.3 into the activity_id field.

5. Run the query.

<!--
![Explore Activities Table](/images/5-Workshop/5.4-DynamoDB/explore-activities.png)
-->

During an earlier AWS integration test, the project used the following Activity ID:

```text
ACT#AWSTEST-9198ABC48900
```

This identifier represents a historical integration test record. For a new workshop execution, use the Activity ID returned by the API in the previous section.

Inspect:

* Activity ID.
* Activity name.
* Location.
* Scheduled time.
* Activity status.

Compare these values with the Backend Response.

<!--
![Activity Item Details](/images/5-Workshop/5.4-DynamoDB/activity-item.png)
-->

Matching data confirms that the Activity has been stored in DynamoDB.

#### 3. Verify Registrations data

1. Return to the Tables list.

2. Select **SAP-Registrations**.

3. Choose **Explore table items**.

4. Select Query.

5. Enter the activity_id of the activity to inspect.

6. Execute the query.

<!--
![Registration Items](/images/5-Workshop/5.4-DynamoDB/registration-items.png)
-->

Inspect the following:

* activity_id.
* mssv.
* Registration information.
* Business attributes stored by the current repository implementation.

Compare the number of registrations with the data imported from CSV/XLSX files.

Each student's registration within an activity is identified by the combination of activity_id and mssv.

#### 4. Verify Attendance data

1. Select **SAP-Attendance**.

2. Choose **Explore table items**.

3. Query records using activity_id.

4. Select the test student's item.

<!--
![Attendance Items](/images/5-Workshop/5.4-DynamoDB/attendance-items.png)
-->

Inspect Check-in and Check-out data recorded through the API.

Verify:

* The Student ID matches the student who recorded attendance.
* The Activity ID matches the selected activity.
* Check-in and Check-out timestamps are appropriate.
* Attendance information is consistent with the Backend.

Pay attention to time zone representation. The application's attendance business logic uses Asia/Ho_Chi_Minh, while stored timestamps may use a different time representation.

{{% notice note %}}
Attendance is recorded in real time. Separate Check-in and Check-out files do not need to be imported after the activity.
{{% /notice %}}

#### 5. Verify Evidence data

1. Select **SAP-Evidence**.

2. Choose **Explore table items**.

3. Query records using activity_id.

4. Inspect items with mssv as the Sort Key.

<!--
![Evidence Items](/images/5-Workshop/5.4-DynamoDB/evidence-items.png)
-->

Compare the records with the evidence file imported through the Backend.

During the project's AWS Pilot test on November 6, 2026, three synthetic Evidence records were verified in DynamoDB.

This result illustrates how Evidence data can be stored using Activity ID and Student ID.

When performing the workshop, the number of records should reflect the actual input dataset.

#### 6. Verify Participation data

1. Select **SAP-Participation**.

2. Choose **Explore table items**.

3. Select Query.

4. Enter the activity_id of the activity that has completed reconciliation.

5. Inspect the returned items.

<!--
![Participation Items](/images/5-Workshop/5.4-DynamoDB/participation-items.png)
-->

Relevant business attributes include:

* activity_id.
* mssv.
* Attendance status.
* Evidence status.
* Reconciliation result.
* Participation confirmation status.

During an earlier AWS Pilot test, three synthetic records were retrieved from SAP-Participation.

Some records contained information such as:

```text
NO_ATTENDANCE
REJECTED
evidence_status: YES
```

This illustrates that a student may submit participation evidence but still have missing attendance information, resulting in an unconfirmed participation outcome according to business rules or ADMIN decisions.

Submitting evidence alone does not automatically guarantee confirmed participation.

<!--
![Participation Item Detail](/images/5-Workshop/5.4-DynamoDB/participation-detail.png)
-->

#### 7. Verify data using AWS CLI

In addition to the AWS Console, AWS CLI can retrieve an Activity from SAP-Activities.

Run:

```powershell
aws dynamodb get-item `
  --table-name SAP-Activities `
  --key '{"activity_id":{"S":"ACT#AWSTEST-9198ABC48900"}}' `
  --consistent-read `
  --region ap-southeast-1 `
  --profile sap-dev
```

Replace the Activity ID with the actual identifier to inspect.

If the item exists, the Response contains the Item field and its attributes.

To query Evidence records for an activity:

```powershell
aws dynamodb query `
  --table-name SAP-Evidence `
  --key-condition-expression "activity_id = :aid" `
  --expression-attribute-values '{":aid":{"S":"ACT#AWSTEST-9198ABC48900"}}' `
  --consistent-read `
  --region ap-southeast-1 `
  --profile sap-dev
```

You can replace SAP-Evidence with SAP-Registrations, SAP-Attendance, or SAP-Participation to inspect other business data groups.

Use an Activity ID with corresponding records in each table.

<!--
![AWS CLI Verification](/images/5-Workshop/5.4-DynamoDB/cli-verification.png)
-->

#### 8. Compare SQLite and DynamoDB data

In the Demo version, SQLite continues to support local application persistence and recovery.

To verify data consistency:

1. Select a Demo activity.
2. Identify its Activity ID.
3. Inspect its data through the REST APIs.
4. Inspect local data covered by SQLite persistence.
5. Query the corresponding DynamoDB records.
6. Compare record counts and relevant business attributes.

Verification table:

| Data | Backend/SQLite | DynamoDB |
| --- | --- | --- |
| Activities | Verify Activity ID and status | SAP-Activities |
| Registrations | Verify registration records | SAP-Registrations |
| Attendance | Verify Check-in/Check-out data | SAP-Attendance |
| Evidence | Verify participation evidence | SAP-Evidence |
| Participation | Verify confirmation results | SAP-Participation |

During previous project tests, Evidence and Participation data were compared with corresponding local records.

However, matching test datasets do not demonstrate that the entire application has migrated to DynamoDB or that automatic bidirectional synchronization exists for every business operation.

#### 9. Troubleshoot common issues

| Error | Possible Cause |
| --- | --- |
| ResourceNotFoundException | Incorrect Region or table name |
| AccessDeniedException | Missing IAM permissions |
| ValidationException | Incorrect Key Schema or data types |
| Item not found | Incorrect Activity ID or data has not been written to DynamoDB |
| Successful API but empty DynamoDB table | The API may use SQLite or its AWS Pilot is not enabled |
| Mismatched record counts | Check input data, filters, and processing behavior |

#### 10. Completion results

After completing this section, we have:

* Verified the status of five DynamoDB tables.
* Inspected Activities data.
* Inspected Registrations data.
* Inspected Attendance data.
* Inspected Evidence data.
* Inspected Participation data.
* Used AWS Console and AWS CLI to retrieve records.
* Compared Cloud data with Backend business data.

<!--
![DynamoDB Integration Complete](/images/5-Workshop/5.4-DynamoDB/integration-complete.png)
-->

#### Conclusion

Amazon DynamoDB allows the project to explore NoSQL data storage on AWS.

Through this section, we learned how to design tables, configure boto3, integrate the Backend, test data reading and writing, and verify results using the AWS Management Console.

DynamoDB integration represents an important step in extending the Student Activity Management & Engagement Analytics Platform from a local development environment toward a Cloud architecture.

SQLite remains part of the current Demo, while DynamoDB supports the Cloud storage workflows that have been integrated and tested.

In the next section, we will develop and configure the React/Vite Frontend to communicate with the FastAPI Backend.

[Next: Frontend Development with React/Vite](../../5.5-Frontend/)
