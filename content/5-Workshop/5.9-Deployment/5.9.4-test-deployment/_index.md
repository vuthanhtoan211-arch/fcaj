
---
title: "Verify the Deployed Application"
date: 2026-11-09
weight: 4
chapter: false
pre: "<b>5.9.4.</b>"
---

## Verify the Deployed Application

In this section, we will verify the Student Activity Management & Engagement Analytics Platform after deploying its Frontend using AWS Amplify Hosting and connecting the Backend through Cloudflare Quick Tunnel.

The objective is to validate the complete workflow from the browser to the Frontend, FastAPI Backend, and configured data persistence in the Demo environment.

#### 1. Prepare the testing environment

Ensure that the following components are available:

* Deployed AWS Amplify Frontend.
* Successful main branch deployment.
* FastAPI Demo Backend on port 8001.
* Cloudflare Quick Tunnel.
* SQLite Demo Persistence.
* ADMIN and STUDENT Demo accounts.

The previous deployment used:

```text
Frontend:
https://main.d2p96elhe5x6se.amplifyapp.com

Backend HTTPS:
https://replies-cabinet-recipes-prevent.trycloudflare.com

Backend Local:
http://127.0.0.1:8001
```

Use the actual active Amplify and Tunnel addresses during a new workshop execution.

{{% notice note %}}
The Cloudflare URL above is a historical testing address. Do not assume that it remains accessible after the Quick Tunnel process has stopped.
{{% /notice %}}

#### 2. Review the deployment architecture

```text
Browser
   |
   +---- HTTPS ----> AWS Amplify Hosting
   |                 React / Vite
   |
   +---- HTTPS ----> Cloudflare Quick Tunnel
                          |
                          v
                    FastAPI Backend
                    127.0.0.1:8001
                          |
                          v
                    SQLite Demo Data
```

The browser loads the Frontend from AWS Amplify and sends API requests to Cloudflare Quick Tunnel.

FastAPI receives requests, validates authentication, processes business operations, and stores data according to its Demo configuration.

When AWS Pilot integration is enabled, applicable business workflows may also interact with Amazon DynamoDB.

#### 3. Verify Backend Health

Open PowerShell:

```powershell
Invoke-RestMethod `
  -Uri "http://127.0.0.1:8001/health"
```

Verify the HTTPS Endpoint:

```powershell
$tunnelUrl = "https://YOUR-TUNNEL.trycloudflare.com"

Invoke-RestMethod `
  -Uri "$tunnelUrl/health"
```

Replace YOUR-TUNNEL with the actual Tunnel hostname.

Expected results:

* The local Backend responds successfully.
* The Cloudflare HTTPS Endpoint responds successfully.
* Requests are forwarded to the correct Backend on port 8001.

<!--
![Deployment health verification](/images/5-Workshop/5.9-Deployment/deployment-health.png)
-->

During the November 9, 2026 test, the HTTPS Health Endpoint was verified successfully.

#### 4. Verify the AWS Amplify interface

Open the deployed Amplify Website.

Verify that:

* The Website uses HTTPS.
* The login page is displayed.
* CSS and JavaScript assets work correctly.
* No critical resource loading errors occur.

<!--
![Deployed login interface](/images/5-Workshop/5.9-Deployment/deployed-login.png)
-->

Displaying the login page only confirms Frontend Hosting availability. Authentication testing is necessary to verify Backend connectivity.

#### 5. Inspect API requests from the Website

Press F12 to open Developer Tools.

1. Select Network.
2. Select Fetch/XHR.
3. Perform a login operation.
4. Open the POST /auth/login request.
5. Inspect the Request URL.

Expected URL:

```text
POST https://YOUR-TUNNEL.trycloudflare.com/auth/login
```

The request must not target localhost on the user's device.

<!--
![Deployed login API request](/images/5-Workshop/5.9-Deployment/deployed-api-request.png)
-->

Also inspect:

* HTTP Method.
* HTTP Status Code.
* Response Body.
* Request Origin.
* CORS Response Headers.

During the previous deployment test, login requests from the Amplify Website were confirmed to reach the Cloudflare HTTPS Endpoint.

#### 6. Test invalid login credentials

Use a Demo account with an incorrect password.

Attempt to sign in through the Amplify Website.

Expected result:

```text
HTTP 401 Unauthorized
```

The interface should display an appropriate login failure message.

<!--
![Invalid login test](/images/5-Workshop/5.9-Deployment/invalid-login-test.png)
-->

During the November 9, 2026 test, invalid credentials produced an HTTP 401 response.

This confirms that the request reached the Backend and authentication validation was performed.

HTTP 401 is the expected result of this negative test, not a Cloudflare Tunnel failure.

#### 7. Test ADMIN login

1. Return to the login page.
2. Enter valid ADMIN Demo credentials.
3. Sign in.
4. Inspect the administrative Home page.
5. Verify ADMIN functionality.

<!--
![Deployed ADMIN dashboard](/images/5-Workshop/5.9-Deployment/deployed-admin-dashboard.png)
-->

Expected results:

* Successful login.
* Valid authentication information returned by the Backend.
* Updated Frontend authentication session.
* Appropriate administrative functionality displayed.

Inspect /auth/me if the Frontend uses this Endpoint to retrieve current user information.

ADMIN login through the deployed Amplify Website passed during the previous project test.

#### 8. Test activity creation

From the ADMIN interface:

1. Open Activity Management.
2. Select the new activity function.
3. Enter Demo activity information.
4. Save the activity.

Illustrative information:

```text
Activity Name: Amplify Deployment Demo

Location: University Hall

Description:
Testing Frontend and Backend integration
after AWS deployment.
```

Complete the required date, time, and other fields using the actual application form.

<!--
![Create activity from Amplify](/images/5-Workshop/5.9-Deployment/deployed-create-activity.png)
-->

Expected results:

* The Frontend submits a request through Cloudflare Tunnel.
* The Backend processes activity creation.
* An Activity ID is generated.
* The activity appears in the list.

Record the actual Activity ID for subsequent verification.

<!--
![Activity creation successful](/images/5-Workshop/5.9-Deployment/deployed-activity-success.png)
-->

During the November 9, 2026 deployment test, creating and saving an activity through the Amplify Website passed.

#### 9. Verify data after refreshing

After creating an activity:

1. Record its name and Activity ID.
2. Press F5 to reload the page.
3. Open the activity list again.
4. Inspect the newly created activity.

<!--
![Deployed activity list](/images/5-Workshop/5.9-Deployment/deployed-activity-list.png)
-->

Expected results:

* The activity remains retrievable from the Backend.
* Reloading the Frontend does not remove the stored activity.
* Displayed information matches the API response.

For SQLite Persistence verification, additionally restart the Backend with the same Demo configuration according to section 5.3.2.

A successful browser refresh alone does not prove data recovery after a Backend restart.

#### 10. Test STUDENT login

Sign out of the ADMIN account.

Sign in using a STUDENT Demo account.

Verify:

* The student Home page is displayed.
* Authorized personal functionality is available.
* Student Account Management is not displayed.
* Unauthorized participation confirmation or activity management is restricted.

<!--
![Deployed STUDENT dashboard](/images/5-Workshop/5.9-Deployment/deployed-student-dashboard.png)
-->

Verify STUDENT access restrictions for administrative APIs.

Example:

```text
GET /admin/students
```

The Backend must deny access when the user lacks ADMIN permissions.

STUDENT login passed during the earlier deployment test.

#### 11. Test additional business functionality

After validating authentication and activity creation, test the business workflows available in the Demo.

| Feature | Test |
| --- | --- |
| Registration Import | Import CSV/XLSX registration records |
| Check-in / Check-out | Record student attendance in real time |
| Evidence Import | Import participation evidence |
| Reconciliation | Compare student records |
| Participation | Confirm or reject participation |
| Analytics Dashboard | Display analytical indicators |
| Export | Download supported report formats |

Use synthetic datasets and appropriate Demo activities.

These additional tests evaluate the complete business workflow in the deployed environment.

Do not assume every feature has passed solely because authentication and activity creation work.

<!--
![Deployed business functionality](/images/5-Workshop/5.9-Deployment/deployed-business-test.png)
-->

#### 12. Verify using another browser or device

Open the Amplify Website using another browser or an authorized Demo device.

Use Demo credentials to verify login and application access.

The objective is to confirm that the Frontend does not depend on localhost on the user's device.

The other device does not need Python or FastAPI because its browser communicates with the Cloudflare HTTPS Endpoint.

The Backend must remain running on the computer hosting cloudflared.

<!--
![Deployed application on another device](/images/5-Workshop/5.9-Deployment/deployed-device-test.png)
-->

#### 13. Test Backend or Tunnel interruption

In a dedicated test environment:

* Inspect the Website when the Backend is temporarily unavailable.
* Review Frontend connectivity error messages.
* Restart the Backend using the same configuration.
* Verify the Health Endpoint.
* Check whether connectivity is restored.

If cloudflared is stopped and a new Quick Tunnel is created, update VITE_API_BASE_URL and redeploy the Frontend.

The Amplify Website may still display its interface while the Backend is unavailable.

This illustrates the difference between Frontend Hosting Availability and Backend API Availability.

#### 14. Summarize deployment test results

Results recorded during the November 9, 2026 deployment:

| Test | Result |
| --- | --- |
| Amplify main deployment | PASS |
| FastAPI Demo port 8001 | PASS |
| Cloudflare HTTPS Health | PASS |
| VITE_API_BASE_URL configuration | PASS |
| Amplify Redeploy | PASS |
| Login Request through Tunnel | PASS |
| Invalid Login - HTTP 401 | PASS |
| ADMIN Login | PASS |
| STUDENT Login | PASS |
| Create and Save Activity | PASS |

These results represent the verified deployment test scope.

Additional testing is required where evidence is not yet available:

* Complete business workflows on the deployed Website.
* Concurrent user access.
* Performance and load capacity.
* Recovery from Backend interruptions.
* Production security readiness.

<!--
![Deployment test results](/images/5-Workshop/5.9-Deployment/deployment-test-results.png)
-->

#### 15. Evaluate the Demo architecture

Advantages:

* Frontend hosting on AWS Amplify.
* HTTPS Website access.
* Internet connectivity to a local Backend.
* Convenient application demonstrations and testing.
* Suitable for Cloud Computing learning.

Limitations:

* The Backend depends on a local computer.
* Quick Tunnel uses a temporary address.
* Frontend redeployment is required when the API URL changes.
* SQLite Demo Persistence has not been entirely replaced by a Cloud Database.
* A highly available and scalable Production Backend has not yet been established.

Future improvements:

* Deploy the Backend using an appropriate Cloud service.
* Establish a stable Backend Endpoint.
* Complete Cloud data storage integration.
* Strengthen security, monitoring, and credential management.
* Perform Load Testing and performance evaluation.

These are proposed future improvements, not completed deployment components.

#### Conclusion

In this section, we completed the deployment and verification of the Student Activity Management & Engagement Analytics Platform using AWS Amplify Hosting and Cloudflare Quick Tunnel.

The React/Vite Frontend was deployed to a Cloud environment and communicates with the FastAPI Demo Backend through HTTPS REST APIs.

Successful ADMIN/STUDENT login, Health checks, API connectivity, and activity creation demonstrate integration between the deployed Frontend and local Backend.

In the next section, we will explore serverless CSV processing using Amazon S3 and AWS Lambda, with IAM permissions for resource access.

[Next: Serverless Data Processing with Amazon S3 and AWS Lambda](../../5.10-Serverless-Processing/)
