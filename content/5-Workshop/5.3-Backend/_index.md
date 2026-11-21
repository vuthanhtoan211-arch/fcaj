
---
title: "Backend Development with FastAPI"
date: 2026-11-09
weight: 3
chapter: false
pre: "<b>5.3.</b>"
---

## Backend Development with FastAPI

In this section, we will develop and configure the Backend for the Student Activity Management & Engagement Analytics Platform using Python and FastAPI.

FastAPI is a modern Python Web Framework that supports high-performance REST API development, input validation, and automatic API documentation through Swagger UI.

The Backend is responsible for the main business functions of the system:

* User authentication and Access Token management.
* ADMIN and STUDENT role-based authorization.
* Student activity management.
* Student account management.
* Registration and evidence imports from CSV/XLSX files.
* Real-time Check-in and Check-out recording.
* Data reconciliation and participation confirmation.
* Data aggregation for Analytics Dashboard and Export.

In the Demo version, the Backend uses SQLite for local data persistence and recovery. Amazon DynamoDB integration and testing will be covered in the following workshop section.

The React/Vite Frontend communicates with the Backend through REST APIs.

#### Contents

1. [Set up and configure the FastAPI Backend](5.3.1-setup-backend/)
2. [Test the Backend and REST APIs](5.3.2-test-backend/)

After completing this section, you will have a working local Backend environment ready for Frontend connectivity and AWS service integration.
