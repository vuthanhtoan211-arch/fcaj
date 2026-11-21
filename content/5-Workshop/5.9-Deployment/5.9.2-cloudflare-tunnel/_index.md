
---
title: "Connect the Backend using Cloudflare Quick Tunnel"
date: 2026-11-09
weight: 2
chapter: false
pre: "<b>5.9.2.</b>"
---

## Connect the Backend using Cloudflare Quick Tunnel

In this section, we will use Cloudflare Quick Tunnel to provide an HTTPS Endpoint for the local FastAPI Backend.

The objective is to enable the React/Vite Frontend hosted on AWS Amplify to communicate with the local Backend without deploying it to a separate Cloud server.

#### 1. Understand Cloudflare Quick Tunnel

Cloudflare Quick Tunnel establishes a connection from the local computer to Cloudflare's network.

The local application can then be accessed through a temporary HTTPS URL under the trycloudflare.com domain.

Connection workflow:

```text
React / Vite Frontend
        |
        | HTTPS REST API
        v
Cloudflare Public Endpoint
        |
        v
cloudflared Tunnel
        |
        v
FastAPI Backend
127.0.0.1:8001
```

Router Port Forwarding is not required for this Demo workflow.

The Quick Tunnel operates while cloudflared remains running and the Backend is available.

Reference:

[Cloudflare Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/)

#### 2. Prepare the Demo dataset

Before exposing the Backend over the Internet:

* Use synthetic student data.
* Prepare ADMIN and STUDENT Demo accounts.
* Use a separate SQLite Demo database.
* Verify API access permissions.
* Ensure that no sensitive information or real student data is exposed.

The project uses port 8001 for its Demo Backend, separate from development port 8000.

{{% notice warning %}}
A Quick Tunnel provides an Internet-accessible address. A random Tunnel URL is not an authentication or authorization mechanism. The Backend must still protect Endpoints and validate Access Tokens.
{{% /notice %}}

#### 3. Start the FastAPI Demo Backend

Open PowerShell in the Backend directory:

```powershell
cd C:\Projects\student-activity-platform\backend
```

Activate the Virtual Environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

Configure Demo mode:

```powershell
$env:SAP_DEMO_MODE="1"
```

Verify the current persistence configuration to ensure a separate Demo SQLite database is used.

Start the Backend:

```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

Expected output:

```text
INFO: Uvicorn running on http://127.0.0.1:8001
INFO: Application startup complete.
```

<!--
![Demo Backend running](/images/5-Workshop/5.9-Deployment/backend-demo-running.png)
-->

Keep the Backend Terminal running.

If AWS integration is required, use the AWS Pilot settings verified in section 5.4. Do not enable unnecessary AWS permissions solely for a Frontend demonstration.

#### 4. Verify the local Backend

Open:

[FastAPI Health Endpoint](http://127.0.0.1:8001/health)

Alternatively, run:

```powershell
Invoke-RestMethod `
  -Uri "http://127.0.0.1:8001/health"
```

The Health Endpoint should return a successful response.

The actual JSON structure depends on the Backend version.

Verify Swagger UI:

```text
http://127.0.0.1:8001/docs
```

<!--
![Local Backend health check](/images/5-Workshop/5.9-Deployment/local-health.png)
-->

Proceed only after confirming local Backend availability.

#### 5. Install cloudflared

Open the official documentation:

[Install cloudflared](https://developers.cloudflare.com/tunnel/downloads/)

Download and install the Windows version.

Windows Package Manager can also be used:

```powershell
winget install --id Cloudflare.cloudflared
```

Open a new Terminal and verify:

```powershell
cloudflared --version
```

If cloudflared is not available in PATH, invoke its executable directly.

The project previously used:

```text
C:\Program Files (x86)\cloudflared\cloudflared.exe
```

Verify the executable:

```powershell
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" --version
```

<!--
![Cloudflared installed](/images/5-Workshop/5.9-Deployment/cloudflared-version.png)
-->

Installation paths may vary between computers.

#### 6. Create a Cloudflare Quick Tunnel

Open a separate PowerShell Terminal.

Keep the Backend Terminal running.

Execute:

```powershell
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://127.0.0.1:8001
```

If cloudflared is available in PATH:

```powershell
cloudflared tunnel --url http://127.0.0.1:8001
```

After connecting successfully, cloudflared displays a temporary address similar to:

```text
https://random-name.trycloudflare.com
```

<!--
![Cloudflare Quick Tunnel created](/images/5-Workshop/5.9-Deployment/cloudflare-tunnel-running.png)
-->

Copy the generated URL for the next steps.

During the November 9, 2026 deployment test, the project used:

```text
https://replies-cabinet-recipes-prevent.trycloudflare.com
```

This is a historical test URL rather than a permanent deployment Endpoint.

{{% notice note %}}
A new Quick Tunnel can generate a different hostname. Update VITE_API_BASE_URL and rebuild the Frontend whenever the API Tunnel address changes.
{{% /notice %}}

#### 7. Verify the HTTPS Health Endpoint

Assign the new Tunnel URL to a PowerShell variable:

```powershell
$tunnelUrl = "https://YOUR-TUNNEL.trycloudflare.com"
```

Replace the placeholder with the actual URL.

Run:

```powershell
Invoke-RestMethod `
  -Uri "$tunnelUrl/health"
```

Alternatively, open:

```text
https://YOUR-TUNNEL.trycloudflare.com/health
```

Expected results:

* The HTTPS Endpoint is accessible.
* Cloudflare forwards the request to FastAPI.
* The Backend returns a successful Health Response.

<!--
![Public HTTPS health check](/images/5-Workshop/5.9-Deployment/tunnel-health.png)
-->

If the local Health Endpoint works but the Tunnel Endpoint fails, inspect the cloudflared process and Backend address.

#### 8. Verify REST API connectivity

Backend API paths remain unchanged when using the Tunnel.

Examples:

```text
POST https://YOUR-TUNNEL.trycloudflare.com/auth/login

GET https://YOUR-TUNNEL.trycloudflare.com/auth/me
```

Only the API Base URL changes.

Protected APIs still require appropriate Access Tokens.

If Swagger UI is enabled for the Demo, inspect it at:

```text
https://YOUR-TUNNEL.trycloudflare.com/docs
```

Do not expose sensitive API documentation or testing Endpoints in a Production environment.

<!--
![Public FastAPI Swagger](/images/5-Workshop/5.9-Deployment/tunnel-swagger.png)
-->

#### 9. Verify CORS configuration

The Frontend and Backend use different origins.

Example:

```text
Frontend:
https://main.d2p96elhe5x6se.amplifyapp.com

Backend:
https://YOUR-TUNNEL.trycloudflare.com
```

FastAPI CORSMiddleware must allow the Amplify Frontend origin.

Do not substitute the Tunnel URL for the Amplify Website origin.

Cloudflare Tunnel provides HTTPS connectivity but does not replace FastAPI's CORS configuration.

CORS will be verified again after deploying the Frontend.

#### 10. Keep the Demo environment available

Maintain two running processes during the Demo:

```text
Terminal 1: FastAPI Backend - port 8001
Terminal 2: Cloudflare Quick Tunnel
```

If the local computer shuts down, enters Sleep mode, or loses Internet connectivity, the Backend may become unavailable.

Stopping cloudflared makes the Quick Tunnel Endpoint unavailable.

The AWS Amplify Frontend may still load, but Backend-dependent operations will fail.

#### 11. Troubleshoot common issues

| Issue | What to Check |
| --- | --- |
| cloudflared not recognized | PATH or executable location |
| Local Health failure | FastAPI Backend and port 8001 |
| Cloudflare HTTP 502 | Tunnel connectivity to the local Backend |
| Tunnel URL unavailable | cloudflared process or changed hostname |
| HTTP 401 | Invalid authentication credentials |
| Browser CORS error | Allowed Amplify origin |
| Frontend calls localhost | VITE_API_BASE_URL and rebuild |

#### 12. Results

During the November 9, 2026 deployment test, the project successfully:

* Started the FastAPI Demo Backend on port 8001.
* Created a Cloudflare Quick Tunnel using cloudflared.
* Verified the HTTPS Health Endpoint.
* Prepared the public HTTPS API URL for AWS Amplify.

These results confirm that the Demo Backend can be reached through HTTPS while the Backend and Tunnel are running.

{{% notice warning %}}
Cloudflare Quick Tunnel is used for temporary testing and demonstrations. It is not a permanent or highly available Production hosting solution.
{{% /notice %}}

[Next: Deploy the Frontend with AWS Amplify Hosting](../5.9.3-amplify-hosting/)
