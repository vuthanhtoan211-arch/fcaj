---
title: "Workshop"
weight: 5
chapter: false
pre: "<b>5.</b>"
---

# Workshop – Student Activity Management & Engagement Analytics Platform

This hands-on workshop documents the actual implementation and testing of a student activity management and engagement analytics platform. Its main application uses React/Vite, FastAPI and SQLite; AWS Amplify hosts the frontend; DynamoDB was tested for cloud data storage; and a separate Amazon S3 / AWS Lambda CSV-processing demo uses IAM and CloudWatch.

## Workshop contents

1. Introduction and architecture
2. Prerequisites
3. FastAPI backend development
4. DynamoDB integration and testing
5. React/Vite frontend development
6. Registration and real-time attendance
7. Evidence import, reconciliation and participation confirmation
8. Analytics dashboard and report export
9. Deployment and testing
10. Serverless CSV processing with Amazon S3 and AWS Lambda
11. AWS resource cleanup and verification

**Implementation boundary:** FastAPI is a locally run demo backend, not an AWS-hosted production API. The Lambda pipeline was tested separately from the application's normal CSV/XLSX import functionality.
