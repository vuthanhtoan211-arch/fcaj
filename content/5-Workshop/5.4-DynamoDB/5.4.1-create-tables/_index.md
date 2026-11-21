
---
title: "Create Amazon DynamoDB tables"
date: 2026-11-09
weight: 1
chapter: false
pre: "<b>5.4.1.</b>"
---

## Create Amazon DynamoDB Tables

In this section, we will prepare Amazon DynamoDB tables to store business data for the Student Activity Management & Engagement Analytics Platform.

To complete this lab, you need to:

* Complete section 5.2 - Prerequisite.
* Complete section 5.3 - Backend Development.
* Have an AWS account with appropriate DynamoDB permissions.
* Configure AWS CLI with the sap-dev profile.

#### 1. Design the table structure

In Amazon DynamoDB, each table requires a Primary Key to identify individual items.

A Primary Key can consist of:

* **Partition Key:** The primary attribute used to partition and identify data.
* **Sort Key:** An attribute used to distinguish multiple items sharing the same Partition Key.

The project uses five business data tables:

| Table Name | Partition Key | Sort Key |
| --- | --- | --- |
| SAP-Activities | activity_id | None |
| SAP-Registrations | activity_id | mssv |
| SAP-Attendance | activity_id | mssv |
| SAP-Evidence | activity_id | mssv |
| SAP-Participation | activity_id | mssv |

The activity_id and mssv keys are represented as Strings to preserve identifier values and leading zeros in student IDs.

Example:

```text
activity_id: ACT#DEMO001
mssv: 0818000001
```

This design allows the application to retrieve activity information and locate individual student records within an activity.

{{% notice note %}}
If you are using tables already created for the project, verify their existing Key Schema before proceeding. Do not recreate or modify the keys of existing tables. The key structure must match the Backend repository implementation.
{{% /notice %}}

#### 2. Open the Amazon DynamoDB Console

1. Open the [AWS Management Console](https://console.aws.amazon.com/).

2. Search for **DynamoDB**.

3. Select **Amazon DynamoDB**.

4. In the upper-right corner, select the Region:

```text
Asia Pacific (Singapore)
ap-southeast-1
```

5. In the navigation pane, choose **Tables**.

<!--
![Amazon DynamoDB Console](/images/5-Workshop/5.4-DynamoDB/dynamodb-console.png)
-->

If the five SAP tables already exist, inspect their status and Key Schema before proceeding to the verification step.

#### 3. Create the SAP-Activities table

SAP-Activities stores student activity information.

1. In the DynamoDB Console, choose **Create table**.

2. Enter the Table name:

```text
SAP-Activities
```

3. Enter the Partition key:

```text
activity_id
```

4. Select **String** as the data type.

5. Do not configure a Sort key for this table.

<!--
![Create Activities Table](/images/5-Workshop/5.4-DynamoDB/create-activities.png)
-->

6. Under Table settings, choose **Customize settings** if you need to configure the Capacity mode.

7. Select **On-demand** for the learning environment if appropriate for your workload and budget.

8. Keep suitable default encryption settings.

9. Choose **Create table**.

<!--
![Activities Table Created](/images/5-Workshop/5.4-DynamoDB/activities-created.png)
-->

After creation, verify that the table status is ACTIVE.

Business attributes stored in the table may include:

* activity_id.
* Activity name.
* Description.
* Location.
* Scheduled time.
* Activity status.

DynamoDB does not require all non-key attributes to be defined when creating a table.

#### 4. Create the SAP-Registrations table

This table stores student registration records for individual activities.

1. Choose **Create table**.

2. Enter the Table name:

```text
SAP-Registrations
```

3. Configure the Partition key:

```text
activity_id
String
```

4. Configure the Sort key:

```text
mssv
String
```

5. Select an appropriate Capacity mode.

6. Choose **Create table**.

<!--
![Create Registrations Table](/images/5-Workshop/5.4-DynamoDB/create-registrations.png)
-->

This key structure allows multiple students to register for the same activity while distinguishing each student by their student ID.

#### 5. Create the SAP-Attendance table

SAP-Attendance stores student Check-in and Check-out records.

Table configuration:

```text
Table name: SAP-Attendance
Partition key: activity_id (String)
Sort key: mssv (String)
```

Follow the same table creation procedure used for SAP-Registrations.

Items may contain:

* Activity ID.
* Student ID.
* Check-in timestamp.
* Check-out timestamp.
* Attendance status information.

<!--
![Create Attendance Table](/images/5-Workshop/5.4-DynamoDB/create-attendance.png)
-->

The system records attendance through real-time REST APIs rather than importing attendance spreadsheets after an activity.

#### 6. Create the SAP-Evidence table

SAP-Evidence stores student participation evidence.

Table configuration:

```text
Table name: SAP-Evidence
Partition key: activity_id (String)
Sort key: mssv (String)
```

Choose **Create table** and verify the table status.

<!--
![Create Evidence Table](/images/5-Workshop/5.4-DynamoDB/create-evidence.png)
-->

Evidence can be exported from Google Forms or Google Sheets as CSV/XLSX files and processed by the Backend.

#### 7. Create the SAP-Participation table

SAP-Participation stores reconciliation and participation confirmation results.

Table configuration:

```text
Table name: SAP-Participation
Partition key: activity_id (String)
Sort key: mssv (String)
```

Relevant business data may include:

* Registration status.
* Attendance status.
* Evidence status.
* Reconciliation results.
* Participation confirmation results.

<!--
![Create Participation Table](/images/5-Workshop/5.4-DynamoDB/create-participation.png)
-->

#### 8. Verify the table list

After creating or preparing the tables, return to the DynamoDB Console.

Choose **Tables** and verify the following resources:

* SAP-Activities.
* SAP-Registrations.
* SAP-Attendance.
* SAP-Evidence.
* SAP-Participation.

Each table should have an ACTIVE status.

<!--
![DynamoDB Tables](/images/5-Workshop/5.4-DynamoDB/dynamodb-tables.png)
-->

Verify the table list using AWS CLI:

```powershell
aws dynamodb list-tables --region ap-southeast-1 --profile sap-dev
```

The output should contain the five business data tables:

```json
{
    "TableNames": [
        "SAP-Activities",
        "SAP-Attendance",
        "SAP-Evidence",
        "SAP-Participation",
        "SAP-Registrations"
    ]
}
```

Your AWS account may contain additional tables.

Inspect the SAP-Evidence table:

```powershell
aws dynamodb describe-table --table-name SAP-Evidence --region ap-southeast-1 --profile sap-dev --query "Table.{Status:TableStatus,KeySchema:KeySchema,Attributes:AttributeDefinitions}"
```

The Key Schema should include:

```text
activity_id: HASH
mssv: RANGE
```

HASH represents the Partition Key, and RANGE represents the Sort Key.

Repeat this verification for the remaining tables.

#### Results

After completing this section:

* Five DynamoDB tables have been created or verified in the Singapore Region.
* Partition Keys and Sort Keys have been inspected.
* The tables are ACTIVE.
* AWS CLI can access table information.

In the next section, we will use boto3 to connect the FastAPI Backend to the DynamoDB tables.

[Next: Connect the Backend to Amazon DynamoDB](../5.4.2-connect-backend/)
