
---
title: "Stop the Demo Environment"
date: 2026-11-09
weight: 2
chapter: false
pre: "<b>5.11.2.</b>"
---

## Stop the Demo Environment

In this section, we will stop local processes after completing the application demonstration.

The deployment uses AWS Amplify Hosting for the Frontend and Cloudflare Quick Tunnel to connect to the FastAPI Backend.

Stopping local services is different from deleting AWS Hosting resources.

#### 1. Review running components

The Demo environment uses:

```text
Frontend:
AWS Amplify Hosting

Backend:
127.0.0.1:8001

Cloudflare:
Quick Tunnel

Database:
SQLite Demo
```

Main Terminal sessions:

```text
Terminal 1: FastAPI Backend

Terminal 2: Cloudflare Quick Tunnel
```

<!--
![Demo running terminals](/images/5-Workshop/5.11-Clean-up/demo-terminals.png)
-->

#### 2. Verify data before shutdown

Before stopping services:

1. Sign in as ADMIN.
2. Review the Demo activity.
3. Record Activity IDs needed later.
4. Verify saved data.
5. Capture required screenshots.

If SQLite backup is needed, identify the configured database file.

Do not copy an actively written database without using a consistent backup method.

#### 3. Stop Cloudflare Quick Tunnel

Open the cloudflared Terminal.

Example command:

```powershell
cloudflared tunnel --url http://127.0.0.1:8001
```

Press:

```text
Ctrl + C
```

The cloudflared process receives the stop request.

<!--
![Stop Cloudflare Tunnel](/images/5-Workshop/5.11-Clean-up/stop-cloudflare.png)
-->

After stopping the Tunnel, its trycloudflare.com URL no longer forwards requests to the local Backend.

Do not treat the previous temporary hostname as a permanent API Endpoint.

#### 4. Stop FastAPI

Open the Uvicorn Terminal.

Previously used command:

```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

Press Ctrl + C.

Verify that the process has terminated.

<!--
![Stop FastAPI Backend](/images/5-Workshop/5.11-Clean-up/stop-backend.png)
-->

Stopping FastAPI does not require deleting the Backend source code or Virtual Environment.

#### 5. Verify port 8001

Open PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 8001 -State Listen -ErrorAction SilentlyContinue
```

No result indicates that no TCP listener is found on port 8001 at the time of inspection.

Alternatively:

```powershell
Test-NetConnection 127.0.0.1 -Port 8001
```

After shutdown, TcpTestSucceeded would normally be False.

<!--
![Verify backend stopped](/images/5-Workshop/5.11-Clean-up/backend-stopped.png)
-->

#### 6. Verify the Amplify Website

Open the previously deployed Website:

```text
https://main.d2p96elhe5x6se.amplifyapp.com
```

If the Amplify App remains deployed, Frontend assets can still be served by AWS.

However, Backend-dependent features will fail when the Tunnel is stopped.

Architecture:

```text
AWS Amplify Frontend
          |
          v
Cloudflare Quick Tunnel
          |
          v
Local FastAPI Backend
```

Cloud-hosted Frontend availability does not mean that the Backend is hosted in the Cloud.

#### 7. Stop the local Frontend

If the Vite Development Server is running:

```powershell
npm run dev
```

Press Ctrl + C in its Terminal.

Stopping Vite does not affect the separate Amplify-hosted Frontend.

#### 8. Preserve SQLite data

After the Backend has fully stopped:

* Identify the correct Demo SQLite file.
* Create a backup if future work requires it.
* Preserve the Backend source code.
* Retain configuration required to restart the Demo.

Do not delete SQLite data unless its retention and backup requirements are understood.

#### 9. Understand stopping versus deletion

| Operation | Effect |
| --- | --- |
| Stop FastAPI | Local Backend becomes unavailable |
| Stop cloudflared | Tunnel forwarding stops |
| Stop Vite | Local development server stops |
| Keep Amplify App | Website remains hosted |
| Delete Amplify App | Application hosting is removed |
| Delete SQLite | Demo data may be lost |

#### Results

After completing this section, the local Demo environment has been shut down in a controlled manner.

Source code, necessary databases, and AWS resources remain intact unless separately managed.

[Next: Clean Up AWS Test Resources](../5.11.3-clean-aws/)
