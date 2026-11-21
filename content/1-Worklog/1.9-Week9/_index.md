---
title: "Worklog Week 9"
date: 2026-11-02
weight: 9
chapter: false
pre: "<b>1.9.</b>"
---

### Week 9 Objectives:

* Continue preparing the **Student Activity Management & Engagement Analytics Platform** for cloud deployment.
* Study AWS Amplify Hosting for React/Vite Frontend applications.
* Organize the GitHub Repository and source code for deployment.
* Review Frontend Build configuration and environment variables.
* Prepare the deployment of the Frontend through GitHub and AWS Amplify.
* Research secure connectivity between a public HTTPS Frontend and a FastAPI Backend.
* Prepare an isolated demo Backend with FastAPI, SQLite, and synthetic records.
* Study Cloudflare Tunnel for exposing a local Backend through HTTPS.
* Connect the deployed Frontend to Backend REST APIs.
* Test Authentication and Authorization on a hosted application.
* Verify ADMIN and STUDENT application behavior.
* Review demo data persistence after page reloads.
* Investigate CORS, HTTPS, Bearer Token, and API Base URL issues.
* Understand the limitations of temporary demo hosting and possible production improvements.
* Monitor AWS usage and minimize unnecessary expenses.

### Tasks to Be Implemented This Week:

| Day | Tasks | Start Date | Completion Date | References |
| --- | --- | --- | --- | --- |
| Monday | - Review the application's source code structure. <br> - Prepare the GitHub Repository for deployment. <br> - Verify Frontend and Backend folder organization. <br> - Study Vite Production Build requirements. <br> - Review `package.json`, dependencies, and Build commands. <br> - Check `.gitignore` to prevent committing `.env`, SQLite files, credentials, and unnecessary artifacts. <br> - Identify the environment settings required for hosted Frontend operation. | 02/11/2026 | 02/11/2026 | https://vite.dev/guide/ <br> https://docs.github.com/ |
| Tuesday | - Study AWS Amplify Hosting and GitHub-based deployment. <br> - Explore connecting an Amplify application to a GitHub Repository. <br> - Identify the `main` deployment branch. <br> - Research Build configuration for React/Vite. <br> - Review Monorepo support and the Frontend directory structure. <br> - Study the `VITE_API_BASE_URL` environment variable. <br> - Learn how GitHub updates can trigger automated Build and Deploy operations. | 03/11/2026 | 03/11/2026 | https://docs.aws.amazon.com/amplify/ <br> https://docs.aws.amazon.com/amplify/latest/userguide/ |
| Wednesday | - Prepare an isolated Backend demo environment. <br> - Study how to duplicate the FastAPI Backend while using a separate SQLite database. <br> - Define the requirement to use only synthetic users and student records. <br> - Explore disabling unnecessary AWS Pilot features in the demo environment. <br> - Review the `/health` endpoint and Authentication APIs. <br> - Study Cloudflare Tunnel for exposing local FastAPI through HTTPS. <br> - Investigate CORS requirements for Frontend and Backend applications hosted on different domains. | 04/11/2026 | 04/11/2026 | https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/ <br> https://fastapi.tiangolo.com/tutorial/cors/ |
| Thursday | - Research HTTPS connectivity between AWS Amplify and FastAPI. <br> - Set up or review Cloudflare Tunnel configuration for the demo Backend. <br> - Check API endpoint paths and Frontend environment variables. <br> - Review Bearer Token transmission in authenticated HTTP requests. <br> - Investigate CORS and cross-origin request errors. <br> - Learn how to inspect Network Requests and API Responses using Browser Developer Tools. <br> - Prepare synthetic ADMIN/STUDENT accounts and data for public website testing. | 05/11/2026 | 05/11/2026 | https://developers.cloudflare.com/ <br> https://fastapi.tiangolo.com/ |
| Friday | - Review the Frontend and Backend demo deployment configuration. <br> - Test Login, Logout, and session verification scenarios. <br> - Review ADMIN/STUDENT interfaces and permissions. <br> - Examine Activity Management and demo data operations. <br> - Test data persistence after page reloads. <br> - Investigate Cloudflare Quick Tunnel limitations. <br> - Review AWS resource usage and Billing. <br> - Document deployment and integration issues requiring further work. | 06/11/2026 | 06/11/2026 | AWS Amplify Documentation, Cloudflare Documentation, and Test Notes |

### Week 9 Achievements:

* **Prepared the GitHub Repository for deployment:**
  * Reviewed Frontend and Backend source code organization.
  * Identified the project's Monorepo structure.
  * Studied Git-based source control and deployment workflows.
  * Selected the `main` branch for deployment.
  * Reviewed files that must be excluded from the public repository.
  * Prepared the source code for AWS Amplify Hosting.

* **Studied and configured AWS Amplify Hosting:**
  * Learned how React/Vite applications can be deployed through AWS Amplify.
  * Investigated connecting Amplify to a GitHub Repository.
  * Identified the Frontend directory within the Monorepo.
  * Reviewed dependency installation and Production Build commands.
  * Studied deployment automation triggered by GitHub changes.
  * Identified environment variables required for Backend connectivity.

* **Prepared the Frontend for cloud hosting:**
  * Reviewed Vite configuration.
  * Studied the `VITE_API_BASE_URL` environment variable.
  * Distinguished local Backend addresses from public Backend URLs.
  * Identified the need for HTTPS API endpoints when hosting a public Frontend.
  * Reviewed Service Layer API requests.
  * Prepared solutions for API Base URL and CORS configuration issues.

* **Developed an isolated Backend demo approach:**
  * Established requirements for separating demo resources from development data.
  * Explored using a separate FastAPI Backend.
  * Planned dedicated SQLite storage for demo accounts and application state.
  * Prepared synthetic student records and test activities.
  * Established safeguards for avoiding exposure of real student data.
  * Investigated disabling unnecessary AWS Pilot integrations in the public demo.

* **Studied and prepared Cloudflare Tunnel connectivity:**
  * Learned how local FastAPI can be exposed through an HTTPS tunnel.
  * Investigated how Cloudflare Tunnel connects to a Backend port.
  * Identified the requirement to keep the Backend process and tunnel active during demonstrations.
  * Examined Quick Tunnel URL changes and temporary hosting limitations.
  * Distinguished a temporary demo endpoint from a stable production deployment.

* **Prepared Frontend–Backend integration:**
  * Designed the following application flow:

    **User → AWS Amplify (React/Vite) → Cloudflare HTTPS Tunnel → FastAPI → SQLite Demo**

  * Identified required Frontend and Backend configuration settings.
  * Studied CORS for cross-origin API calls.
  * Reviewed Bearer Token handling in authenticated requests.
  * Prepared a Browser Developer Tools-based API verification workflow.
  * Identified possible failures in Amplify Hosting, Cloudflare Tunnel, and FastAPI.

* **Reviewed Authentication and Authorization requirements:**
  * Prepared synthetic ADMIN and STUDENT test accounts.
  * Investigated Login and Logout behavior on a hosted application.
  * Reviewed session validation through `/auth/me`.
  * Defined expected role-based interface behavior.
  * Established restrictions for administrative functionality.
  * Prepared invalid Token and expired session test scenarios.

* **Prepared application business workflows for demonstration:**
  * Activity Management.
  * Registration Import.
  * Attendance.
  * Evidence Import.
  * Reconciliation.
  * Analytics.
  * Export Results.

  These workflows continued to rely on FastAPI rather than Amazon API Gateway and AWS Lambda.

* **Applied security-related considerations:**
  * Avoided committing AWS Credentials to source code.
  * Used synthetic accounts for public demonstrations.
  * Distinguished public Frontend variables from Backend secrets.
  * Required ADMIN permissions to be checked by the Backend.
  * Identified Cloudflare Tunnel limitations for demo purposes.
  * Reviewed CORS and public API exposure risks.

* **Researched deployment cost management:**
  * Studied AWS Amplify Hosting usage and pricing concepts.
  * Distinguished hosting costs from Backend and storage expenses.
  * Explored local Backend hosting as a way to avoid continuously running an AWS virtual server.
  * Reviewed AWS Billing and existing resource management.
  * Prioritized reusing available infrastructure.

* **Clarified the deployment architecture and its limitations:**
  * AWS Amplify was selected for Frontend hosting.
  * FastAPI remained the primary Backend.
  * SQLite supported isolated demo data.
  * Cloudflare Tunnel served as a temporary HTTPS connectivity mechanism.
  * DynamoDB and S3 remained separate AWS Pilot integrations.
  * Amazon Cognito did not replace the application's Authentication module.
  * Amazon API Gateway was not the website's API entry point.
  * The application was not presented as a fully AWS-hosted production system.

### Challenges and Lessons Learned:

* **Monorepo configuration:** Deploying a Frontend located in a nested directory requires accurate Build and output paths.
* **Environment variables:** React/Vite requires the correct API Base URL for the deployed environment.
* **HTTPS and CORS:** A hosted HTTPS application needs an HTTPS API endpoint and compatible cross-origin configuration.
* **Cloudflare Quick Tunnel:** Tunnel URLs can change, requiring Frontend configuration updates.
* **Demo isolation:** A separate SQLite database and synthetic records reduce the risk of exposing real student data.
* **Cloud cost management:** A continuously running AWS Backend is not required for a temporary MVP demonstration.
* **Deployment troubleshooting:** Build failures, API connectivity failures, Authentication issues, and data problems must be investigated separately.

### Plan for Next Week:

* Complete or verify AWS Amplify Frontend deployment.
* Test the public website and its FastAPI demo connection.
* Verify ADMIN/STUDENT roles and synthetic data.
* Review the AWS Pilot test suites.
* Inventory AWS resources and review Billing.
* Explore adding AWS IAM, Lambda, and CloudWatch for a separate demo data processing workflow.
* Design CSV processing using Amazon S3 and AWS Lambda.
* Prepare technical evidence for the internship report.