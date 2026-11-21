
---
title: "Prepare Source Code and Deployment Configuration"
date: 2026-11-09
weight: 1
chapter: false
pre: "<b>5.9.1.</b>"
---

## Prepare Source Code and Deployment Configuration

In this section, we will prepare the React/Vite Frontend source code and FastAPI Backend environment for deploying the Student Activity Management & Engagement Analytics Platform.

The objective is to ensure that the source code builds successfully, is managed through GitHub, and supports the Demo deployment configuration.

#### 1. Prepare the environment

Complete workshop sections 5.2 through 5.8.

Required tools and resources:

* Visual Studio Code.
* Git.
* Node.js and npm.
* Python and FastAPI.
* GitHub Account.
* AWS Account with Amplify Hosting permissions.
* Cloudflare cloudflared.
* AWS CLI and sap-dev Profile when testing AWS integrations.

#### 2. Inspect the project source structure

Open the project using Visual Studio Code:

```text
C:\Projects\student-activity-platform
```

Main source structure:

```text
student-activity-platform/
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── ...
└── frontend/
    ├── src/
    │   ├── services/
    │   │   └── api.js
    │   └── ...
    ├── package.json
    ├── package-lock.json
    └── ...
```

The Frontend contains React/Vite source code. The Backend contains APIs, Business Services, and data access mechanisms.

AWS Amplify Hosting only builds the Frontend for the current deployment.

<!--
![Project structure](/images/5-Workshop/5.9-Deployment/project-structure.png)
-->

#### 3. Inspect the GitHub Repository

The project's deployment uses:

```text
Repository: fcaj
Branch: main
```

Open the fcaj repository on GitHub.

Verify that:

* The main branch contains the intended Frontend source.
* The Frontend directory contains package.json.
* Build configuration files are up to date.
* Credentials and sensitive information are not included in the repository.

<!--
![GitHub repository](/images/5-Workshop/5.9-Deployment/github-repository.png)
-->

If the project is already connected to GitHub, inspect the repository using:

```powershell
git status
git remote -v
git branch --show-current
```

These commands display repository status, configured remotes, and the current branch.

Run them from the appropriate Git Repository directory.

{{% notice warning %}}
Do not upload AWS credentials, ADMIN passwords, Access Tokens, real student data, or SQLite database files containing personal information to GitHub.
{{% /notice %}}

#### 4. Inspect the .gitignore file

Open the repository's .gitignore file.

Verify which files and directories should be excluded from Git.

Example:

```gitignore
node_modules/
dist/
.venv/
__pycache__/
.env
.env.local
.env.production.local
*.db
*.sqlite
*.sqlite3
```

These rules are illustrative and should be adapted to the actual repository structure.

Preserve the existing .gitignore when it already provides suitable exclusions.

Remember that .gitignore does not automatically remove files already tracked by Git.

#### 5. Inspect API_BASE_URL configuration

Open:

```text
frontend/src/services/api.js
```

The Frontend must use a Backend address appropriate for its environment.

The local development Backend uses port 8000.

The Demo Backend connected through Cloudflare Quick Tunnel uses port 8001.

The project uses the following variable to configure its Backend URL:

```text
VITE_API_BASE_URL
```

Illustrative configuration:

```javascript
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");
```

Explanation:

* import.meta.env: Provides access to Vite environment variables.
* VITE_API_BASE_URL: Specifies the Backend address at build time.
* Local address: Provides a development fallback.
* replace(): Removes trailing slashes from the URL.

Compare this example with the existing api.js configuration.

Do not introduce another API_BASE_URL declaration if one already exists.

<!--
![Frontend API configuration](/images/5-Workshop/5.9-Deployment/api-config.png)
-->

{{% notice note %}}
Variables prefixed with VITE_ may be embedded in JavaScript delivered to the browser. Use VITE_API_BASE_URL for the public API address, never for Secret Access Keys, passwords, or Access Tokens.
{{% /notice %}}

#### 6. Inspect CORS configuration

Open:

```text
backend/app/main.py
```

Review FastAPI's CORSMiddleware configuration.

The Backend must permit the local Frontend origin and the deployed Amplify Website origin.

The Amplify address used during the previous deployment test was:

```text
https://main.d2p96elhe5x6se.amplifyapp.com
```

Illustrative configuration:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://main.d2p96elhe5x6se.amplifyapp.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For a new Amplify App, use the actual deployed Website origin.

An origin includes the protocol and hostname, not application paths such as /login or /docs.

Do not add duplicate CORSMiddleware when the application already has CORS configuration.

<!--
![Backend CORS configuration](/images/5-Workshop/5.9-Deployment/cors-config.png)
-->

#### 7. Prepare a separate Demo Backend

The project uses a Demo Backend on port 8001 with a separate SQLite Demo dataset to avoid interfering with the main development environment.

Environment configuration:

| Environment | Backend Port |
| --- | --- |
| Development | 8000 |
| Internet-accessible Demo | 8001 |

Different ports do not automatically create separate databases.

Before starting the Demo Backend, verify the persistence configuration to ensure it uses the intended Demo SQLite database.

Do not delete or overwrite the development database.

#### 8. Verify the Frontend build

Open the Frontend Terminal:

```powershell
cd C:\Projects\student-activity-platform\frontend
```

Check the environment:

```powershell
node --version
npm --version
```

If package-lock.json exists:

```powershell
npm ci
```

Otherwise:

```powershell
npm install
```

Build the application:

```powershell
npm run build
```

If PowerShell blocks npm.ps1, use:

```powershell
npm.cmd run build
```

Vite should generate:

```text
frontend/dist/
```

This directory contains deployable Frontend assets:

```text
dist/
├── index.html
└── assets/
    ├── ...
```

<!--
![Frontend build successful](/images/5-Workshop/5.9-Deployment/frontend-build.png)
-->

#### 9. Verify the built application

Use Vite Preview to inspect the build:

```powershell
npm run preview
```

Open the address displayed in the Terminal.

Example:

```text
http://localhost:4173
```

Verify:

* The login page renders correctly.
* CSS and JavaScript assets load.
* No critical build errors occur.
* Navigation works as expected.

If testing Backend connectivity through Vite Preview, configure the Backend to allow the actual Preview origin.

This build verifies compilation. The final deployed build will use the Cloudflare Quick Tunnel HTTPS API address.

#### 10. Prepare Amplify build configuration

If the Frontend is located in the frontend directory of the GitHub Repository, Amplify must use the correct application location.

The build configuration must:

* Install dependencies in the correct Frontend directory.
* Execute npm run build.
* Use dist as the build artifacts directory.
* Provide VITE_API_BASE_URL during the build.

Detailed Amplify configuration will be covered in section 5.9.3.

#### 11. Review deployment readiness

| Component | Requirement |
| --- | --- |
| GitHub Repository | Frontend source prepared |
| Branch | main |
| Dependencies | Installed successfully |
| Frontend Build | dist directory generated |
| API Configuration | VITE_API_BASE_URL supported |
| CORS | Appropriate origins permitted |
| Demo Backend | Port 8001 |
| Demo Database | Separate SQLite Demo data |
| Credentials | No secrets in the repository |

#### Results

After completing this section, we have prepared source code, verified the Frontend build, and identified the required deployment settings.

The Frontend is ready to receive the Cloudflare Quick Tunnel HTTPS API Endpoint and be deployed using AWS Amplify Hosting.

[Next: Connect the Backend using Cloudflare Quick Tunnel](../5.9.2-cloudflare-tunnel/)
