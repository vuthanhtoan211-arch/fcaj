
---
title: "AWS Amplify and Cloudflare Tunnel Deployment"
date: 2026-11-09
weight: 9
chapter: false
pre: "<b>5.9.</b>"
---

## AWS Amplify and Cloudflare Tunnel Deployment

In this section, we will deploy the Student Activity Management & Engagement Analytics Platform to an Internet-accessible Demo environment using AWS Amplify Hosting and Cloudflare Quick Tunnel.

After developing the FastAPI Backend, React/Vite Frontend, DynamoDB integration, and business functionality, the next step is to deploy the Web interface to a Cloud environment for demonstration and testing.

#### Introduction to AWS Amplify Hosting

AWS Amplify Hosting is a service for deploying and hosting Web Frontend applications on AWS.

The service supports:

* GitHub Repository integration.
* Automated dependency installation and application builds.
* Deployment of built Frontend assets.
* HTTPS Website endpoints.
* Build-time environment variable management.
* Continuous Deployment when source code changes.

The project uses AWS Amplify Hosting to deploy the React/Vite Frontend from the fcaj repository and main branch.

#### Introduction to Cloudflare Quick Tunnel

Cloudflare Quick Tunnel provides a temporary HTTPS endpoint that forwards Internet requests to a service running on a local computer.

In the project's Demo environment, the FastAPI Backend runs on Windows at:

```text
http://127.0.0.1:8001
```

Cloudflare Quick Tunnel enables the Frontend deployed on AWS Amplify to send REST API requests to this Backend.

#### Deployment Architecture

```text
ADMIN / STUDENT
        |
        | HTTPS
        v
Browser
        |
        | Load Frontend
        v
AWS Amplify Hosting
React / Vite Application

Browser
        |
        | HTTPS REST API + Access Token
        v
Cloudflare Quick Tunnel
        |
        v
Local FastAPI Backend
127.0.0.1:8001
        |
        +-- SQLite Demo Persistence
        |
        +-- Amazon DynamoDB Integration
            (when configured)
```

In this architecture:

* GitHub manages source code and provides the Frontend source to Amplify.
* AWS Amplify Hosting deploys the React/Vite Frontend.
* The browser loads the Frontend from Amplify.
* The Frontend sends REST API requests through Cloudflare Quick Tunnel.
* FastAPI processes authentication, authorization, and business operations.
* SQLite supports Demo data persistence.
* DynamoDB supports configured Cloud data integration workflows.

![System Architecture](/images/2-Proposal/student_activity_architectur.drawio.png)

{{% notice note %}}
AWS Amplify Hosting does not run the FastAPI Backend directly in the current architecture. The browser calls APIs through Cloudflare Quick Tunnel, which forwards requests to the local Backend.
{{% /notice %}}

#### Deployment Workflow

1. Prepare the Frontend source code and GitHub Repository.
2. Verify the React/Vite build process.
3. Start the FastAPI Demo Backend on port 8001.
4. Create a Cloudflare Quick Tunnel.
5. Verify the HTTPS API Endpoint.
6. Configure VITE_API_BASE_URL.
7. Deploy the Frontend using AWS Amplify Hosting.
8. Configure CORS for the Amplify Website origin.
9. Verify authentication and business operations.

#### Contents

1. [Prepare source code and deployment configuration](5.9.1-prepare-deployment/)
2. [Connect the Backend using Cloudflare Quick Tunnel](5.9.2-cloudflare-tunnel/)
3. [Deploy the Frontend with AWS Amplify Hosting](5.9.3-amplify-hosting/)
4. [Verify the deployed application](5.9.4-test-deployment/)

#### Objectives

After completing this section, you will be able to:

* Prepare a React/Vite application for AWS deployment.
* Understand Frontend builds and deployments from GitHub.
* Configure Vite environment variables for deployment.
* Create a Cloudflare Quick Tunnel for a local Backend.
* Deploy a Frontend using AWS Amplify Hosting.
* Verify CORS and HTTPS API connectivity.
* Test authentication and business operations after deployment.
* Distinguish between Demo and Production environments.

#### Deployment Results

During the deployment test on November 9, 2026, the project successfully deployed the Frontend using AWS Amplify Hosting, connected the local FastAPI Backend through Cloudflare Quick Tunnel, and verified ADMIN/STUDENT login and activity creation and persistence.

The current environment is a Demo rather than a fully cloud-hosted Production system.

{{% notice warning %}}
Cloudflare Quick Tunnel is intended for temporary development and testing. Its URL may change after restarting the Tunnel. Use synthetic data and Demo accounts when exposing the Backend over the Internet.
{{% /notice %}}
