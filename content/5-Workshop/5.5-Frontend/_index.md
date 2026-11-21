
---
title: "Frontend Development with React/Vite"
date: 2026-11-09
weight: 5
chapter: false
pre: "<b>5.5.</b>"
---

## Frontend Development with React/Vite

In this section, we will develop and configure the Frontend of the Student Activity Management & Engagement Analytics Platform using React and Vite.

React is a JavaScript library used to build component-based user interfaces. Vite is a Frontend development and build tool that provides fast startup and automatic interface updates when source code changes.

The Frontend serves as the primary interaction layer between users and the system.

The main features include:

* User login and authentication.
* ADMIN and STUDENT role-based interfaces.
* Student activity management.
* Student account management.
* Registration data imports from CSV/XLSX files.
* Real-time Check-in and Check-out recording.
* Participation evidence imports.
* Data reconciliation and participation confirmation.
* Analytics Dashboard and report exports.
* Personal profile management.

#### Frontend Architecture

```text
ADMIN / STUDENT
       |
       v
React / Vite Frontend
       |
       | REST API + Access Token
       v
Python / FastAPI Backend
       |
       +-- SQLite Local Persistence
       |
       +-- Amazon DynamoDB Integration
```

In the development environment, the Frontend runs locally and sends REST API requests to the FastAPI Backend on port 8000.

After development and testing, the Frontend will be deployed using AWS Amplify Hosting. Cloudflare Quick Tunnel provides connectivity between the deployed Frontend and the local Backend in the Demo environment.

![Student Activity Management & Engagement Analytics Platform Architecture](/images/2-Proposal/student_activity_architectur.drawio.png)

#### Contents

1. [Set up and run the React/Vite Frontend](5.5.1-setup-frontend/)
2. [Connect the Frontend to FastAPI REST APIs](5.5.2-connect-api/)
3. [Implement ADMIN/STUDENT authentication and authorization](5.5.3-authentication/)
4. [Test the interface and system functionality](5.5.4-test-interface/)

#### Objectives

After completing this section, you will be able to:

* Understand the Frontend structure of a React/Vite Web Application.
* Install dependencies and run the application locally.
* Connect React to the FastAPI Backend through REST APIs.
* Understand Access Token and login session management.
* Develop interfaces appropriate for ADMIN and STUDENT users.
* Test the main system features.
* Prepare the Frontend for deployment using AWS Amplify Hosting.

Through this section, learners will understand how user interfaces communicate with Backend services and data storage components in a complete Web Application.
