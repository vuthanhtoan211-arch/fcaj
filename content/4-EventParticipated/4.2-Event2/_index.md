---
title: "AWS First Cloud AI Journey Community Day 2026"
date: 2026-10-31
weight: 2
chapter: false
pre: "<b>4.2.</b>"
---

# AWS First Cloud AI Journey Community Day 2026

## 1. Event Introduction

**AWS First Cloud AI Journey Community Day 2026** is a community event associated with First Cloud AI Journey (FCAJ). It provides students and technology enthusiasts with opportunities to learn, exchange ideas, and explore developments in cloud computing, artificial intelligence, and software development.

The sessions covered AWS Cloud, serverless architecture, Amazon SQS, internship experiences, and the importance of consistent open-source contributions.

For me, this event was an opportunity to broaden my technical perspective and relate industry discussions to my **Student Activity Management & Engagement Analytics Platform** internship project.

## 2. Event Information

| Item | Details |
| --- | --- |
| Event | AWS First Cloud AI Journey Community Day 2026 |
| Date | Saturday, October 31, 2026 |
| Time | 09:00–12:00 |
| Venue | Bitexco Financial Tower |
| Address | 02 Hai Trieu Street, Ho Chi Minh City, Vietnam |
| Format | In-person |
| Participation | Student / Attendee |

## 3. Participation Objectives

- Keep up with AWS services and cloud application development practices.
- Learn how serverless systems are designed and deployed.
- Understand AWS Lambda and Amazon SQS in modern architectures.
- Learn from AWS internship and project development experiences.
- Identify skills relevant to cloud computing and data engineering.
- Understand how open-source communities support continuous learning.

## 4. Sessions Attended

The program included six main topics:

1. **Lessons Learned from Building Software Factories**
2. **Education**
3. **AWS Lambda Web Functions: Rethinking Serverless Web Architecture**
4. **Amazon SQS: Building Asynchronous Systems**
5. **My 3-Month AWS Internship Journey**
6. **Start & Maintain Consistency with Open Source Contributing**

## 5. Technical Knowledge Gained

### 5.1. Lessons Learned from Building Software Factories

This session emphasized that software engineering involves more than writing individual features. Good solutions require clear architecture, repeatable development practices, testing, deployment, code quality, and maintainability.

**Connection to my project:** My platform is divided into a React/Vite frontend, a Python/FastAPI backend, a SQLite database for the local demonstration, and a distinct AWS experimental scope. Separation of responsibilities makes the project easier to test, maintain, and extend.

### 5.2. Education – Preparing for Technology Careers

The Education session highlighted the importance of programming skills, problem-solving, technical documentation, and active independent learning. As a Data Science student, I found that studying cloud computing complements my knowledge of databases, data processing, and analytics.

### 5.3. AWS Lambda Web Functions: Rethinking Serverless Web Architecture

The discussion introduced HTTP workloads on serverless functions, scaling, performance, operational costs, and trade-offs compared with server-based or container-based applications.

**Connection to my project:** I developed and tested an independent **AWS Lambda CSV Processing Demo**. The experiment was performed as follows:

1. Upload a sample CSV file to Amazon S3.
2. Invoke Lambda through a Test Event.
3. Read and validate registration data.
4. Distinguish valid, duplicate, and invalid records.
5. Save the processing result as JSON in Amazon S3.
6. Inspect execution logs using Amazon CloudWatch.

This experiment is separate from the primary FastAPI backend and does not represent a fully automated S3-triggered production data pipeline.

![AWS Lambda CSV processing test result](/fcaj/images/5-Workshop/5.10-Serverless-Processing/lambda-test-success.png)

### 5.4. Amazon SQS: Building Asynchronous Systems

The Amazon Simple Queue Service (SQS) session explained how message queues decouple components and support asynchronous background tasks. I learned that queues may help systems tolerate peaks in workloads and avoid blocking user-facing requests.

**Future consideration:** SQS could potentially be used to process large registration files asynchronously or to decouple ingestion and processing. **SQS is not implemented in the current project.**

### 5.5. My 3-Month AWS Internship Journey

The internship sharing session reinforced the value of hands-on practice, systematic troubleshooting, technical documentation, time management, and regularly reviewing progress. These lessons are reflected in my worklog and workshop materials.

### 5.6. Start & Maintain Consistency with Open Source Contributing

This session demonstrated how open-source participation can improve code-reading skills, collaboration, Git/GitHub usage, and long-term technical learning. I was particularly interested in how consistent documentation and version control help maintain software projects.

## 6. Lessons Learned and Project Applications

After attending the event, I became more aware of the need to select cloud components based on the actual problem rather than on service popularity.

The current project includes:

- **Frontend:** React/Vite, deployed to AWS Amplify Hosting.
- **Backend:** FastAPI running on a local demo computer, accessible through Cloudflare Quick Tunnel.
- **Data persistence:** SQLite in the demo environment, with separate DynamoDB integration and testing.
- **Core business functions:** registration import, real-time check-in/check-out, evidence import, reconciliation, participation confirmation, analytics, and export.
- **Independent serverless experiment:** Amazon S3, AWS Lambda, AWS IAM, and CloudWatch.

The event also encouraged further research into asynchronous tasks, data pipelines, observability, cost optimization, and open-source collaboration.

## 7. Personal Reflection

AWS First Cloud AI Journey Community Day 2026 provided valuable perspectives on practical cloud systems and the skills needed for a technology career.

I particularly appreciated the combination of architecture, implementation, internship experience, and open-source learning. The discussions motivated me to continue improving my knowledge of cloud computing and data engineering.

## 8. Event Participation Photos

The following are photographs documenting my attendance at the actual event:

### Photo 1 – Event participation

![Participation at AWS First Cloud AI Journey Community Day 2026](/fcaj/images/4-Event/Event2/hinh1.jpg)

### Photo 2 – Event activities

![Activities during AWS First Cloud AI Journey Community Day 2026](/fcaj/images/4-Event/Event2/hinh2.jpg)

### Photo 3 – Community event moments

![A moment from AWS First Cloud AI Journey Community Day 2026](/fcaj/images/4-Event/Event2/hinh3.jpg)

### Photo 4 – Additional event evidence

![Additional participation evidence from the community event](/fcaj/images/4-Event/Event2/hinh4.jpg)

## 9. Conclusion

The event strengthened my understanding of serverless architecture, asynchronous processing, practical software engineering, and the importance of maintaining a learning community. The lessons gained will support future improvements to the Student Activity Management & Engagement Analytics Platform and my professional development in cloud and data engineering.
