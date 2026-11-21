
---
title: "Introduction"
date: 2026-11-09
weight: 1
chapter: false
pre: "<b>5.1.</b>"
---

#### Introduction to the Student Activity Management & Engagement Analytics Platform

The **Student Activity Management & Engagement Analytics Platform** is a system designed to support the management, tracking, reconciliation, and analysis of student participation data in university activities.

In practice, student activity data is collected from multiple sources, including the University Portal, student identification card QR-based attendance systems, Google Forms, and Google Sheets. After each activity, organizers need to consolidate, validate, and reconcile these datasets to determine the participation results of each student.

Manually processing multiple Excel or CSV files can be time-consuming, introduce duplicate records and missing information, and create additional challenges when managing large-scale student activities.

This workshop introduces how to build a centralized data management platform by combining Web Application development with AWS services. It helps learners understand application development, Cloud data storage integration, data processing, and system deployment.

The system is developed using **React/Vite**, **Python/FastAPI**, and **SQLite**, with **Amazon DynamoDB** integration. AWS services are also used for Frontend hosting, file storage, Serverless data processing, access management, and execution monitoring.

#### Introduction to AWS Services Used

* **AWS Amplify:** A service that supports Web Application deployment and hosting. In this workshop, AWS Amplify is used to deploy the React/Vite Frontend, allowing ADMIN and STUDENT users to access the system through a Web browser.

* **Amazon DynamoDB:** A fully managed NoSQL database service provided by AWS. DynamoDB is integrated and tested to store business data groups such as Activities, Registrations, Attendance, Evidence, and Participation.

* **Amazon S3:** An object storage service provided by AWS. It is used to store input CSV files and processed JSON results in the Serverless CSV Processing Demo.

* **AWS Lambda:** A Serverless Compute service that allows developers to execute code without directly managing servers. In this workshop, Lambda is used to read CSV files, validate data, detect duplicate records, and generate processing results.

* **AWS IAM:** A service for managing identities and access permissions on AWS. IAM provides Lambda with permissions to access Amazon S3 and write execution logs to Amazon CloudWatch, following the Least Privilege principle.

* **Amazon CloudWatch:** An AWS monitoring and logging service. CloudWatch is used to monitor Lambda execution, review errors, measure execution duration, and inspect operational information.

#### Workshop Overview

In this workshop, you will explore and develop a system consisting of three main components:

**1. Web Application**

This is the main component of the system, used to manage student activities and participation data.

* The Frontend is developed using React/Vite and deployed on AWS Amplify Hosting.
* The Backend is developed using Python/FastAPI to provide REST APIs and process business logic.
* Cloudflare Quick Tunnel is used to connect the Frontend with the locally running Backend.
* SQLite supports data persistence and recovery in the Demo environment.
* Authentication and Authorization are implemented for the ADMIN and STUDENT user roles.

ADMIN users can manage activities, manage student accounts, import registration data, record Check-in/Check-out, import participation evidence, reconcile data, confirm participation results, and export reports.

STUDENT users can sign in, view personal information, browse activities, and track their own participation results within the authorized scope.

**2. AWS Cloud Data Storage**

Amazon DynamoDB is used to integrate and test cloud-based business data storage.

In this workshop, you will learn how to connect Python/FastAPI to DynamoDB using the AWS SDK for Python (boto3) and perform data reading and writing operations.

The main business data groups include:

* Activities: Activity information.
* Registrations: Student registration records.
* Attendance: Check-in/Check-out records.
* Evidence: Student participation evidence.
* Participation: Participation results.

The current Demo combines local persistence using SQLite with DynamoDB integration on AWS. The workshop does not assume that the entire application persistence mechanism has been fully migrated to DynamoDB.

**3. AWS Serverless CSV Processing**

This is an independent Serverless data processing workflow developed using Amazon S3, AWS Lambda, AWS IAM, and Amazon CloudWatch.

The workflow includes:

* Upload a CSV file containing registration data to Amazon S3.
* Use AWS Lambda to read the CSV data.
* Validate required data fields.
* Detect duplicate and invalid records.
* Aggregate processing results.
* Store the processed JSON output back in Amazon S3.
* Use AWS IAM to manage execution permissions.
* Monitor execution results and logs using Amazon CloudWatch.

This workflow helps learners understand how to build an AWS-based Data Processing Pipeline without directly managing servers.

#### Architecture Overview

The following diagram illustrates the architecture of the Student Activity Management & Engagement Analytics Platform, including the Web Application, Local Demo Environment, AWS Cloud Data Storage, and Serverless CSV Processing Demo.

![Student Activity Management & Engagement Analytics Platform Architecture](/images/2-Proposal/student_activity_architectur.drawio.png)

The system receives data from three primary sources:

* **University Portal:** Provides student registration lists in CSV/XLSX format.
* **Student Card QR / Student ID:** Provides student identification information for real-time Check-in/Check-out recording.
* **Google Forms / Google Sheets:** Provides participation evidence in CSV/XLSX format.

The main business workflow of the system is:

Registration Import → Real-time Attendance → Evidence Import → Reconciliation → Participation Confirmation → Analytics & Export.

#### Workshop Objectives

After completing this workshop, you will be able to:

* Understand the overall architecture of a student activity management and analytics system.
* Develop Backend REST APIs using Python/FastAPI.
* Develop a Web Application interface using React/Vite.
* Understand Authentication and ADMIN/STUDENT role-based access control.
* Import, validate, and process CSV/XLSX data.
* Understand real-time attendance recording and data reconciliation workflows.
* Connect a Python application to Amazon DynamoDB.
* Deploy the Frontend using AWS Amplify Hosting.
* Build a CSV data processing workflow using Amazon S3 and AWS Lambda.
* Configure AWS IAM permissions for required resources.
* Monitor Lambda execution and logs using Amazon CloudWatch.
* Understand how to select and combine AWS services according to the requirements of a real-world project.

Through this workshop, learners will have the opportunity to combine Web Development, Data Processing, Cloud Computing, and AWS knowledge to build a practical student activity management system.

This workshop is designed for educational, internship, and demonstration purposes. Deploying the Backend on stable Cloud infrastructure, fully migrating the persistence mechanism to a Cloud database, and operating the system at Production scale remain future development directions.
