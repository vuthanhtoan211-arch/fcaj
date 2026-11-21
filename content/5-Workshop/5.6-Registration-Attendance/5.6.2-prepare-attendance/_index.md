
---
title: "Prepare Activity and Attendance"
date: 2026-11-09
weight: 2
chapter: false
pre: "<b>5.6.2.</b>"
---

## Prepare Activity and Attendance

Before recording Check-in and Check-out, we need to prepare the activity, student data, and applicable business conditions.

In the Student Activity Management & Engagement Analytics Platform, attendance is recorded for a specific activity. Each attendance record must be associated with the correct Activity ID and Student ID.

#### 1. Prepare a Demo activity

1. Open the Web Application.
2. Sign in using an ADMIN account.
3. Navigate to Activity Management.
4. Select the activity used for registration imports in section 5.6.1.

If no suitable activity exists, create a new activity.

Illustrative information:

```text
Activity Name: AWS Workshop Demo
Location: University Hall
Description: Attendance Recording Workshop
```

Complete the required fields in the application form.

<!--
![Prepare activity](/images/5-Workshop/5.6-Registration-Attendance/prepare-activity.png)
-->

Record the Activity ID for subsequent tests.

#### 2. Configure the activity schedule

The activity schedule directly affects Check-in and Check-out eligibility.

Illustrative example:

```text
Start Time: 08:00
End Time: 11:30
Timezone: Asia/Ho_Chi_Minh
```

During the workshop, select a date and time appropriate for the actual testing session.

To test Check-in immediately, prepare an activity whose Check-in window includes the current time.

{{% notice note %}}
The 08:00 and 11:30 timestamps are illustrative. Do not use an activity whose permitted attendance window has expired and expect attendance requests to succeed.
{{% /notice %}}

<!--
![Activity schedule](/images/5-Workshop/5.6-Registration-Attendance/activity-schedule.png)
-->

#### 3. Verify the activity status

The activity must be in a state permitted by the business rules before attendance can be recorded.

For example, a newly created activity may have DRAFT status.

ADMIN should review the supported activity state transitions and move the activity into an appropriate attendance-enabled state.

Do not modify database status values directly to bypass Backend business rules.

<!--
![Activity status](/images/5-Workshop/5.6-Registration-Attendance/activity-status.png)
-->

#### 4. Understand Check-in time rules

The project's Backend uses the following time zone:

```text
Asia/Ho_Chi_Minh
UTC+07:00
```

The attendance configuration previously used in the project includes:

* Early Check-in: 30 minutes before the activity start time.
* Late Check-in: 20 minutes after the activity start time.

For an activity starting at 08:00, the illustrative Check-in window is:

```text
07:30 - Check-in window opens
08:00 - Activity starts
08:20 - Check-in window closes
```

Test scenarios:

| Time | Expected Result |
| --- | --- |
| 07:15 | Before the Check-in window |
| 07:45 | Within the Check-in window |
| 08:00 | Within the Check-in window |
| 08:10 | Within the Check-in window |
| 08:30 | After the Check-in window |

These scenarios assume that all other business conditions are satisfied.

Before performing the lab, verify the current Attendance Service configuration to ensure the time rules have not changed.

#### 5. Understand Check-out rules

Check-out records when a student completes or leaves an activity according to the applicable business rules.

Verify the following conditions:

* The activity exists and is in an appropriate state.
* The student has a Check-in record if required.
* The Check-out time satisfies the current rules.
* The operation does not create duplicate Check-out records.
* The user is authorized to record attendance.

Do not assume that Check-out uses the same 30-minute early and 20-minute late intervals as Check-in.

Review the Check-out rules in the current source code and actual API responses.

#### 6. Verify registered students

Open the registration list for the selected activity.

Inspect the synthetic student IDs:

```text
0818000001
0818000002
0818000003
0818000004
```

Ensure that the test students satisfy the registration and attendance requirements.

Prepare an unknown student ID to test invalid student scenarios.

<!--
![Registered students](/images/5-Workshop/5.6-Registration-Attendance/registered-students.png)
-->

#### 7. Prepare a QR scanner

In the project's intended business workflow, organizers use student card QR codes to receive student identification information.

A compatible scanner may operate as a keyboard-input device, entering the student ID into the attendance interface.

Workflow:

```text
Student Card QR
       |
       v
QR Scanner
       |
       v
Student ID Input
       |
       v
Attendance Interface
```

If a scanner is unavailable, enter student IDs manually to test the REST API workflow.

Inspect the actual QR payload. If it contains additional information, the system must extract the correct student identifier.

Do not assume that every student card QR code contains only a plain-text student ID.

<!--
![Student card scanner](/images/5-Workshop/5.6-Registration-Attendance/qr-scanner.png)
-->

{{% notice note %}}
Manual student ID input is suitable for testing when scanner hardware is unavailable. Camera-based QR scanning or dedicated scanner integration should only be reported as tested after verification with the actual hardware.
{{% /notice %}}

#### 8. Prepare ADMIN permissions

Ensure that the user recording attendance has the ADMIN role.

The current system uses two roles:

* ADMIN.
* STUDENT.

ADMIN users are responsible for administrative attendance operations.

The Backend must validate access permissions before recording or updating Attendance data.

Do not grant administrative access by modifying Frontend role information.

#### 9. Open the attendance interface

In the Web Application:

1. Select the Demo activity.
2. Open attendance management.
3. Verify the Activity ID and activity name.
4. Inspect the student ID input area.
5. Select the intended Check-in or Check-out operation.

<!--
![Attendance preparation interface](/images/5-Workshop/5.6-Registration-Attendance/attendance-ready.png)
-->

#### 10. Verify attendance readiness

| Component | Requirement |
| --- | --- |
| Activity | Created successfully |
| Activity Status | Attendance operations permitted |
| Schedule | Appropriate for the actual test time |
| Registration | Student list prepared |
| Student ID | Valid synthetic student data |
| ADMIN Account | Authorized to record attendance |
| Backend | Running |
| Frontend | Connected to the REST API |
| Scanner / Manual Input | Student ID input available |

#### Results

After completing this section, we have prepared the activity, student registration records, administrative permissions, and time conditions required for attendance recording.

In the next section, we will perform Check-in and Check-out through the Web interface and inspect REST API results, including invalid business scenarios.

[Next: Record Check-in and Check-out](../5.6.3-check-in-check-out/)
