
---
title: "Chuẩn bị source code và cấu hình triển khai"
date: 2026-11-09
weight: 1
chapter: false
pre: "<b>5.9.1.</b>"
---

## Chuẩn bị source code và cấu hình triển khai

Trong phần này, chúng ta sẽ chuẩn bị mã nguồn Frontend React/Vite và môi trường Backend FastAPI để triển khai Student Activity Management & Engagement Analytics Platform.

Mục tiêu là đảm bảo mã nguồn có thể build thành công, được quản lý trên GitHub và có cấu hình phù hợp với môi trường Demo.

#### 1. Chuẩn bị môi trường

Đảm bảo đã hoàn thành các phần Workshop từ 5.2 đến 5.8.

Các công cụ cần thiết:

* Visual Studio Code.
* Git.
* Node.js và npm.
* Python và FastAPI.
* GitHub Account.
* AWS Account có quyền sử dụng Amplify Hosting.
* Cloudflare cloudflared.
* AWS CLI và Profile sap-dev nếu cần kiểm thử tích hợp AWS.

#### 2. Kiểm tra cấu trúc source code

Mở Visual Studio Code và truy cập project:

```text
C:\Projects\student-activity-platform
```

Cấu trúc chính:

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

Frontend chứa mã nguồn React/Vite và Backend chứa các API, Business Services và cơ chế truy cập dữ liệu.

AWS Amplify Hosting chỉ cần build thư mục Frontend trong quá trình triển khai hiện tại.

<!--
![Project structure](/images/5-Workshop/5.9-Deployment/project-structure.png)
-->

#### 3. Kiểm tra GitHub Repository

Trong quá trình triển khai đồ án, chúng ta sử dụng:

```text
Repository: fcaj
Branch: main
```

Mở repository fcaj trên GitHub.

Kiểm tra:

* Branch main chứa mã nguồn Frontend cần triển khai.
* Thư mục Frontend chứa package.json.
* Các file cấu hình build đã được cập nhật.
* Không có thông tin xác thực hoặc dữ liệu nhạy cảm được đưa lên repository.

<!--
![GitHub repository](/images/5-Workshop/5.9-Deployment/github-repository.png)
-->

Nếu project đã được kết nối với GitHub, có thể kiểm tra bằng Terminal:

```powershell
git status
git remote -v
git branch --show-current
```

Các lệnh trên giúp xác định trạng thái repository, địa chỉ remote và branch hiện tại.

Nếu chưa đứng trong thư mục Git Repository, cần chuyển đến đúng thư mục chứa source code đã được quản lý bởi Git.

{{% notice warning %}}
Không đưa AWS Credentials, mật khẩu ADMIN, Access Token, dữ liệu sinh viên thật hoặc file cơ sở dữ liệu SQLite chứa dữ liệu cá nhân lên GitHub.
{{% /notice %}}

#### 4. Kiểm tra file .gitignore

Mở file .gitignore của repository.

Kiểm tra các thư mục và file không cần đưa lên GitHub.

Ví dụ:

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

Các quy tắc trên là ví dụ cần điều chỉnh theo cấu trúc repository thực tế.

Không xóa hoặc thay thế .gitignore hiện tại nếu project đã có cấu hình phù hợp.

Cần lưu ý rằng .gitignore không tự xóa những file đã được Git theo dõi trước đó.

#### 5. Kiểm tra cấu hình API_BASE_URL

Mở file:

```text
frontend/src/services/api.js
```

Frontend cần sử dụng địa chỉ Backend phù hợp với môi trường triển khai.

Trong môi trường local, Backend phát triển sử dụng port 8000.

Trong môi trường Demo được đưa qua Cloudflare Quick Tunnel, Backend sử dụng port 8001.

Để hỗ trợ thay đổi địa chỉ API mà không cần sửa cứng mã nguồn, đồ án sử dụng biến:

```text
VITE_API_BASE_URL
```

Ví dụ cấu hình minh họa:

```javascript
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");
```

Giải thích:

* import.meta.env: Truy cập biến môi trường trong Vite.
* VITE_API_BASE_URL: Địa chỉ Backend được cung cấp khi build.
* Địa chỉ local: Giá trị mặc định phục vụ phát triển.
* replace(): Loại bỏ dấu gạch chéo ở cuối URL.

Cần đối chiếu với cấu hình thực tế trong file api.js.

Không khai báo thêm API_BASE_URL nếu biến này đã tồn tại.

<!--
![Frontend API configuration](/images/5-Workshop/5.9-Deployment/api-config.png)
-->

{{% notice note %}}
Biến môi trường có tiền tố VITE_ có thể xuất hiện trong JavaScript được build và gửi đến trình duyệt. Chỉ sử dụng VITE_API_BASE_URL để lưu địa chỉ API công khai, không lưu Secret Access Key, mật khẩu hoặc Access Token trong biến này.
{{% /notice %}}

#### 6. Kiểm tra cấu hình CORS

Mở file:

```text
backend/app/main.py
```

Kiểm tra cấu hình CORSMiddleware của FastAPI.

Backend cần cho phép origin của Frontend local và Website đã triển khai trên Amplify.

Địa chỉ Amplify được sử dụng trong đợt triển khai trước đây:

```text
https://main.d2p96elhe5x6se.amplifyapp.com
```

Ví dụ cấu hình:

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

Nếu sử dụng một Amplify App mới, thay origin bằng địa chỉ Website thực tế.

Chỉ sử dụng origin gồm protocol và hostname, không thêm đường dẫn /login hoặc /docs.

Không thêm CORSMiddleware trùng lặp nếu ứng dụng đã có cấu hình.

<!--
![Backend CORS configuration](/images/5-Workshop/5.9-Deployment/cors-config.png)
-->

#### 7. Chuẩn bị Backend Demo riêng

Để trình diễn hệ thống mà không ảnh hưởng đến môi trường phát triển chính, đồ án sử dụng Backend Demo trên port 8001 cùng dữ liệu SQLite Demo riêng.

Cấu hình cần phân biệt:

| Environment | Backend Port |
| --- | --- |
| Development | 8000 |
| Internet-accessible Demo | 8001 |

Port khác nhau không tự động tạo cơ sở dữ liệu khác nhau.

Trước khi chạy Backend Demo, cần kiểm tra cấu hình persistence để xác nhận ứng dụng sử dụng file SQLite dành riêng cho Demo.

Không tự ý xóa hoặc ghi đè cơ sở dữ liệu đang dùng cho phát triển.

#### 8. Kiểm tra Frontend build

Mở Terminal tại thư mục Frontend:

```powershell
cd C:\Projects\student-activity-platform\frontend
```

Kiểm tra môi trường:

```powershell
node --version
npm --version
```

Nếu đã có package-lock.json:

```powershell
npm ci
```

Nếu chưa có package-lock.json:

```powershell
npm install
```

Build ứng dụng:

```powershell
npm run build
```

Nếu PowerShell chặn npm.ps1, sử dụng:

```powershell
npm.cmd run build
```

Kết quả mong đợi là Vite tạo thư mục:

```text
frontend/dist/
```

Trong đó có các tài nguyên phục vụ triển khai:

```text
dist/
├── index.html
└── assets/
    ├── ...
```

<!--
![Frontend build successful](/images/5-Workshop/5.9-Deployment/frontend-build.png)
-->

#### 9. Kiểm tra bản build

Có thể sử dụng Vite Preview để kiểm tra bản build:

```powershell
npm run preview
```

Truy cập địa chỉ hiển thị trong Terminal.

Ví dụ:

```text
http://localhost:4173
```

Kiểm tra:

* Trang đăng nhập hiển thị bình thường.
* Các tài nguyên CSS và JavaScript được tải.
* Không có lỗi build nghiêm trọng.
* Điều hướng hoạt động phù hợp.

Nếu sử dụng Vite Preview để kiểm thử API, Backend cần cho phép origin của cổng Preview.

Bản build được tạo ở bước này nhằm kiểm tra khả năng build. Bản triển khai cuối cùng sẽ được build với HTTPS API URL của Cloudflare Quick Tunnel.

#### 10. Chuẩn bị cấu hình build cho Amplify

Nếu Frontend nằm ở thư mục frontend trong GitHub Repository, Amplify cần biết thư mục này là vị trí ứng dụng.

Cấu hình build phải đảm bảo:

* Cài đặt dependencies tại đúng thư mục Frontend.
* Chạy npm run build.
* Sử dụng dist làm thư mục build artifacts.
* Cung cấp VITE_API_BASE_URL trong môi trường build.

Cấu hình chi tiết sẽ được thực hiện tại phần 5.9.3.

#### 11. Kiểm tra trước khi triển khai

| Thành phần | Yêu cầu |
| --- | --- |
| GitHub Repository | Mã nguồn Frontend đã được chuẩn bị |
| Branch | main |
| Dependencies | Cài đặt thành công |
| Frontend Build | Tạo được thư mục dist |
| API Configuration | Hỗ trợ VITE_API_BASE_URL |
| CORS | Cho phép origin phù hợp |
| Demo Backend | Sử dụng port 8001 |
| Demo Database | Dữ liệu SQLite được tách riêng |
| Credentials | Không có Secret trong repository |

#### Kết quả

Sau khi hoàn thành phần này, chúng ta đã chuẩn bị source code, kiểm tra quy trình build và xác định các cấu hình cần thiết cho việc triển khai.

Frontend đã sẵn sàng để nhận HTTPS API Endpoint từ Cloudflare Quick Tunnel và được triển khai bằng AWS Amplify Hosting.

[Tiếp theo: Kết nối Backend bằng Cloudflare Quick Tunnel](../5.9.2-cloudflare-tunnel/)
