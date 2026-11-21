
---
title: "Prepare Analytics Data and Metrics"
date: 2026-11-09
weight: 1
chapter: false
pre: "<b>5.8.1.</b>"
---

## Prepare Analytics Data and Metrics

In this section, we will prepare business datasets and calculate analytical indicators for the Student Activity Management & Engagement Analytics Platform.

The objective is to produce accurate and consistent metrics that reflect student activity participation.

#### 1. Prepare the environment

Complete the following sections:

* 5.3 - Backend Development with FastAPI.
* 5.4 - Amazon DynamoDB Integration.
* 5.5 - Frontend Development with React/Vite.
* 5.6 - Registration and Attendance Management.
* 5.7 - Evidence Processing and Reconciliation.

Ensure that the following are available:

* FastAPI Backend at http://127.0.0.1:8000.
* React/Vite Frontend at http://localhost:5173.
* An ADMIN Demo account.
* An activity with Registration, Attendance, Evidence, and Participation records.

#### 2. Identify analytics data sources

The Analytics Dashboard uses business data processed by the Backend.

| Dataset | Analytical Purpose |
| --- | --- |
| Activities | Activity information and totals |
| Registrations | Student registration counts |
| Attendance | Check-in, Check-out, and attendance completion |
| Evidence | Evidence availability |
| Participation | Confirmed and rejected participation results |

Each record must be associated with the correct Activity ID and Student ID.

When aggregating multiple activities, distinguish participation records from unique students.

For example, a student participating in three activities can generate three participation records while representing only one unique student.

#### 3. Prepare a sample dataset

Reuse the synthetic activity data from section 5.7.

| Student ID | Registration | Check-in | Check-out | Evidence |
| --- | --- | --- | --- | --- |
| 0818000001 | Yes | Yes | Yes | Yes |
| 0818000002 | Yes | Yes | No | Yes |
| 0818000003 | Yes | No | No | Yes |
| 0818000004 | Yes | Yes | Yes | No |

Current confirmation results:

| Student ID | Participation |
| --- | --- |
| 0818000001 | CONFIRMED |
| 0818000002 | Not yet confirmed |
| 0818000003 | REJECTED |
| 0818000004 | Not yet confirmed |

This dataset contains:

* Total registrations: 4.
* Students with Check-in: 3.
* Students with Check-out: 2.
* Students with complete attendance: 2.
* Students with Evidence: 3.
* Confirmed participants: 1.
* Rejected participants: 1.
* Students awaiting a final decision: 2.

These figures are synthetic workshop data.

<!--
![Analytics sample data](/images/5-Workshop/5.8-Analytics-Export/analytics-sample-data.png)
-->

#### 4. Define analytical metrics

##### Total Registrations

The number of valid registration records within the selected activity scope.

```text
Total Registrations = 4
```

Duplicate file rows should not be counted as separate registrations for the same student and activity.

##### Total Check-in

The number of students with valid Check-in records.

```text
Total Check-in = 3
```

##### Total Check-out

The number of students with valid Check-out records.

```text
Total Check-out = 2
```

##### Complete Attendance

The number of students satisfying both Check-in and Check-out requirements.

```text
Complete Attendance = 2
```

##### Evidence Submitted

The number of students with Evidence records.

```text
Evidence Submitted = 3
```

Evidence availability does not automatically indicate approved evidence or confirmed participation.

##### Confirmed Participants

The number of students with CONFIRMED participation results.

```text
Confirmed Participants = 1
```

##### Rejected Participants

The number of students with REJECTED participation results.

```text
Rejected Participants = 1
```

#### 5. Calculate analytical rates

##### Check-in Rate

```text
Check-in Rate
= Registered Students with Check-in
  / Total Registrations x 100

= 3 / 4 x 100

= 75%
```

##### Attendance Completion Rate

```text
Attendance Completion Rate
= Registered Students with Complete Attendance
  / Total Registrations x 100

= 2 / 4 x 100

= 50%
```

##### Evidence Submission Rate

```text
Evidence Submission Rate
= Registered Students with Evidence
  / Total Registrations x 100

= 3 / 4 x 100

= 75%
```

##### Confirmed Participation Rate

```text
Confirmed Participation Rate
= Confirmed Registered Students
  / Total Registrations x 100

= 1 / 4 x 100

= 25%
```

{{% notice note %}}
These example rates use registered students as the denominator. The actual Dashboard must follow consistent Backend metric definitions. Handle zero registrations to prevent division-by-zero errors.
{{% /notice %}}

#### 6. Illustrate analytics processing using Python

Create a separate practice file:

```text
analytics_demo.py
```

Content:

```python
students = [
    {
        "mssv": "0818000001",
        "check_in": True,
        "check_out": True,
        "evidence": True,
        "participation": "CONFIRMED"
    },
    {
        "mssv": "0818000002",
        "check_in": True,
        "check_out": False,
        "evidence": True,
        "participation": None
    },
    {
        "mssv": "0818000003",
        "check_in": False,
        "check_out": False,
        "evidence": True,
        "participation": "REJECTED"
    },
    {
        "mssv": "0818000004",
        "check_in": True,
        "check_out": True,
        "evidence": False,
        "participation": None
    }
]

total = len(students)

check_in = sum(
    student["check_in"] for student in students
)

check_out = sum(
    student["check_out"] for student in students
)

complete_attendance = sum(
    student["check_in"] and student["check_out"]
    for student in students
)

evidence = sum(
    student["evidence"] for student in students
)

confirmed = sum(
    student["participation"] == "CONFIRMED"
    for student in students
)

rejected = sum(
    student["participation"] == "REJECTED"
    for student in students
)

pending = total - confirmed - rejected

def rate(count, total):
    return round(count / total * 100, 2) if total else 0

print("Total registrations:", total)
print("Total check-in:", check_in)
print("Total check-out:", check_out)
print("Complete attendance:", complete_attendance)
print("Evidence submitted:", evidence)
print("Confirmed participants:", confirmed)
print("Rejected participants:", rejected)
print("Awaiting decision:", pending)
print("Check-in rate:", rate(check_in, total))
print("Attendance completion rate:",
      rate(complete_attendance, total))
print("Confirmed participation rate:",
      rate(confirmed, total))
```

Run:

```powershell
python analytics_demo.py
```

Expected output:

```text
Total registrations: 4
Total check-in: 3
Total check-out: 2
Complete attendance: 2
Evidence submitted: 3
Confirmed participants: 1
Rejected participants: 1
Awaiting decision: 2
Check-in rate: 75.0
Attendance completion rate: 50.0
Confirmed participation rate: 25.0
```

<!--
![Analytics Python output](/images/5-Workshop/5.8-Analytics-Export/analytics-python-output.png)
-->

{{% notice note %}}
analytics_demo.py is a standalone learning example using one record per registered student within one activity. It does not replace the project's existing Analytics Service.
{{% /notice %}}

#### 7. Understand Analytics API data

The Backend aggregates business records and returns results for Frontend visualization.

Illustrative JSON response:

```json
{
    "total_registrations": 4,
    "total_check_in": 3,
    "total_check_out": 2,
    "complete_attendance": 2,
    "evidence_submitted": 3,
    "confirmed_participants": 1,
    "rejected_participants": 1,
    "awaiting_decision": 2,
    "check_in_rate": 75.0,
    "attendance_completion_rate": 50.0,
    "participation_rate": 25.0
}
```

These attributes illustrate a possible Analytics API response.

Use the current Backend source code and Swagger UI to determine the actual field names and response structure.

#### 8. Inspect current Analytics data

Open Swagger UI:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

Locate the Analytics group or activity statistics APIs.

1. Authenticate using an ADMIN account.
2. Identify the target Activity ID.
3. Execute the existing API request.
4. Inspect the response.
5. Compare the indicators with Registration, Attendance, and Participation data.

<!--
![Analytics API response](/images/5-Workshop/5.8-Analytics-Export/analytics-api-response.png)
-->

If the API aggregates the entire system rather than a single activity, verify its data scope before comparing results.

#### 9. Handle special scenarios

| Scenario | Expected Handling |
| --- | --- |
| No registrations | No division-by-zero error |
| Registration without attendance | Check-in count remains zero |
| Check-in without Check-out | Not counted as complete attendance |
| Evidence with REJECTED status | Not counted as CONFIRMED |
| Student attends multiple activities | Distinguish records from unique students |
| Decisions are incomplete | Distinguish pending decisions from REJECTED |
| Incorrect Activity ID | Do not aggregate unrelated activity data |

#### Results

After completing this section, we have prepared analytics data and explored the calculation of key Dashboard indicators.

Defining the correct data scope, numerator, and denominator helps ensure that reports accurately reflect activity outcomes.

In the next section, we will display analytical indicators using the React/Vite Frontend.

[Next: Build the Analytics Dashboard](../5.8.2-build-dashboard/)
