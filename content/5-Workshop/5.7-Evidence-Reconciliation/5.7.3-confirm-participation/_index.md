
---
title: "Confirm Participation Results"
date: 2026-11-09
weight: 3
chapter: false
pre: "<b>5.7.3.</b>"
---

## Confirm Participation Results

In this section, we will confirm student participation based on previously reconciled data.

After combining Registration, Attendance, and Evidence, ADMIN users review the applicable business requirements to determine whether each student's participation should be approved.

Confirmation results are stored as Participation records and used for Analytics Dashboard, student activity history, and report exports.

#### 1. Distinguish Reconciliation and Participation

**Reconciliation**

The process of comparing records from:

* Registration.
* Attendance.
* Evidence.

Reconciliation identifies complete and incomplete data.

**Participation Confirmation**

The process of determining a final participation outcome according to business requirements and ADMIN decisions.

The project's final participation statuses include:

* CONFIRMED: Student participation is approved.
* REJECTED: Student participation is not approved.

Before a final decision, a record may remain unconfirmed according to the current implementation.

{{% notice note %}}
A reconciliation result does not automatically indicate confirmed Participation. Verify the actual confirmation status stored by the Backend.
{{% /notice %}}

#### 2. Prepare the environment and data

Complete:

* Section 5.6 - Registration and Attendance Management.
* Section 5.7.1 - Import Participation Evidence.
* Section 5.7.2 - Reconcile Student Participation Data.

Ensure that the following are available:

* FastAPI Backend.
* React/Vite Frontend.
* An ADMIN Demo account.
* An activity with reconciliation results.

Use the same Activity ID from previous exercises.

#### 3. Understand the confirmation workflow

```text
Reconciliation Result
          |
          v
      ADMIN Review
          |
          v
Validate Activity Requirements
          |
          v
Participation Decision
          |
          +-- CONFIRMED
          |
          +-- REJECTED
          |
          v
FastAPI Participation Processing
          |
          v
Store Participation Result
          |
          v
Analytics / Student History / Export
```

The Backend validates ADMIN permissions, activity information, student information, and business conditions before saving the confirmation result.

#### 4. Open the participation confirmation interface

1. Open the Web Application.
2. Sign in using an ADMIN account.
3. Select the reconciled activity.
4. Open Reconciliation or Participation.
5. Inspect student records and reconciliation results.

<!--
![Participation management interface](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-interface.png)
-->

Review:

* Student ID.
* Full name if displayed.
* Registration status.
* Check-in information.
* Check-out information.
* Evidence status.
* Reconciliation result.
* Current confirmation status.

#### 5. Review participation requirements

Use the synthetic dataset from section 5.7.2:

| Student ID | Check-in | Check-out | Evidence |
| --- | --- | --- | --- |
| 0818000001 | Yes | Yes | Yes |
| 0818000002 | Yes | No | Yes |
| 0818000003 | No | No | Yes |
| 0818000004 | Yes | Yes | No |

For this illustrative exercise, assume the activity requires registration, complete Check-in/Check-out, and valid evidence.

Under this assumption:

* Student 0818000001 has complete data for confirmation review.
* Student 0818000002 requires missing Check-out review.
* Student 0818000003 has no Attendance records.
* Student 0818000004 requires evidence review.

These are assumed workshop requirements. Actual confirmation decisions must follow the activity's configured business rules.

#### 6. Perform a CONFIRMED decision

Select the Demo student with complete records:

```text
Student ID: 0818000001
```

Perform the following:

1. Open the student's reconciliation details.
2. Review Registration, Attendance, and Evidence.
3. Select the participation confirmation operation.
4. Verify the information before saving.
5. Confirm the operation.

<!--
![Confirm student participation](/images/5-Workshop/5.7-Evidence-Reconciliation/confirm-participation.png)
-->

The Frontend submits the confirmation request to FastAPI.

The Backend validates permissions and business conditions, then saves the result if the operation is valid.

Expected result:

```text
Student ID: 0818000001
Participation Status: CONFIRMED
```

<!--
![Confirmed participation result](/images/5-Workshop/5.7-Evidence-Reconciliation/confirmed-result.png)
-->

Reload the records to verify the stored status.

#### 7. Perform a REJECTED decision

Select the Demo student who does not satisfy the illustrative requirements:

```text
Student ID: 0818000003
```

This student has Evidence but no Check-in or Check-out records.

Perform the following:

1. Review the reconciliation result.
2. Identify the reason for ineligibility.
3. Select the rejection operation.
4. Provide a reason if supported by the interface and API.
5. Save the result.

<!--
![Reject student participation](/images/5-Workshop/5.7-Evidence-Reconciliation/reject-participation.png)
-->

Expected result:

```text
Student ID: 0818000003
Participation Status: REJECTED
```

<!--
![Rejected participation result](/images/5-Workshop/5.7-Evidence-Reconciliation/rejected-result.png)
-->

Earlier AWS Pilot tests included records containing NO_ATTENDANCE, REJECTED, and evidence_status: YES.

This illustrates that having evidence does not automatically satisfy attendance requirements.

#### 8. Review incomplete records

Not every incomplete record should be rejected immediately.

Examples include:

* Missing Check-out information requiring investigation.
* Evidence not yet submitted at the reconciliation time.
* Registration data not yet fully updated.
* Imported evidence awaiting review.

ADMIN users should evaluate records according to activity requirements before making decisions.

If source data is legitimately updated, perform reconciliation again using the application's supported workflow.

If a final participation decision needs modification, use the supported Backend operation rather than directly editing SQLite or DynamoDB records.

#### 9. Inspect the confirmation REST API

Press F12 to open Developer Tools.

1. Select Network.
2. Select Fetch/XHR.
3. Confirm a Demo participation record.
4. Inspect the corresponding request.
5. Verify Activity ID, Student ID, and confirmation status.
6. Inspect the HTTP Status Code and Response.

<!--
![Participation confirmation API](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-api.png)
-->

Open Swagger UI to identify the actual confirmation Endpoint in the Participation group:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

Illustrative business data:

```json
{
    "activity_id": "ACT-DEMO-001",
    "mssv": "0818000001",
    "participation_status": "CONFIRMED"
}
```

This is an illustrative data model. Do not use it as an actual Request Body without verifying the current API Schema.

#### 10. Verify confirmation authorization

The system uses two roles:

* ADMIN.
* STUDENT.

ADMIN users review and confirm participation results.

STUDENT users can access their own participation information within their authorized scope.

Test:

1. Sign in using a STUDENT Demo account.
2. Verify that administrative confirmation controls are unavailable.
3. Use a STUDENT Access Token to test the confirmation Endpoint identified in Swagger UI.
4. Verify that the Backend rejects unauthorized operations.

The expected result is HTTP 403 Forbidden for an authenticated account without sufficient permissions.

<!--
![Participation authorization test](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-authorization.png)
-->

#### 11. Verify confirmed results

Return to the activity's Participation list.

Verify that:

* CONFIRMED is stored for the correct student.
* REJECTED is stored for the correct student.
* Other student records remain unchanged.
* Activity ID remains correct.
* Attendance and Evidence source records remain accurate.

Example:

| Student ID | Participation Status |
| --- | --- |
| 0818000001 | CONFIRMED |
| 0818000003 | REJECTED |

<!--
![Participation results list](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-results.png)
-->

Do not assume that other students have been confirmed without corresponding decisions.

#### 12. Summarize test cases

| Test Case | Expected Result |
| --- | --- |
| Confirm an eligible record | CONFIRMED stored |
| Reject an ineligible record | REJECTED stored |
| Incorrect Activity ID | No unrelated activity updated |
| Invalid Student ID | No incorrect student updated |
| STUDENT attempts confirmation | Access denied when unauthorized |
| Reload page | Saved results displayed |
| Updated source data | Handled through the current reconciliation workflow |

#### Conclusion

In this section, we practiced confirming and rejecting participation results using ADMIN permissions.

Participation represents a business outcome based on reconciled data rather than merely registration or attendance status.

These results will support student activity history, Analytics Dashboard, and Export.

Participation confirmation in the project does not automatically update official student conduct scores in the university's University Portal.

[Next: Verify Participation Results](../5.7.4-verify-participation/)
