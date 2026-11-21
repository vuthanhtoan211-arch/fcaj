
---
title: "Kết nối Frontend với FastAPI REST API"
date: 2026-11-09
weight: 2
chapter: false
pre: "<b>5.5.2.</b>"
---

## Kết nối Frontend với FastAPI REST API

Trong phần này, chúng ta sẽ cấu hình kết nối giữa Frontend React/Vite và Backend FastAPI của Student Activity Management & Engagement Analytics Platform.

Frontend chịu trách nhiệm hiển thị giao diện và tiếp nhận thao tác của người dùng. Backend chịu trách nhiệm xác thực, kiểm tra dữ liệu, xử lý nghiệp vụ và truy cập cơ sở dữ liệu.

Hai thành phần giao tiếp với nhau thông qua REST API.

#### 1. Tìm hiểu luồng giao tiếp giữa Frontend và Backend

```text
User
  |
  v
React Component
  |
  v
API Service (api.js)
  |
  | HTTP Request
  v
FastAPI Router
  |
  v
Business Logic / Repository
  |
  v
SQLite / DynamoDB Integration
  |
  v
API Response
  |
  v
React Component
  |
  v
Updated User Interface
```

Ví dụ, khi ADMIN mở danh sách hoạt động:

* Frontend gửi yêu cầu lấy danh sách hoạt động.
* Backend kiểm tra quyền truy cập.
* Backend truy xuất dữ liệu từ cơ chế lưu trữ được cấu hình.
* Backend trả về kết quả dưới dạng JSON.
* Frontend cập nhật danh sách hoạt động trên giao diện.

Frontend không cần kết nối trực tiếp với DynamoDB bằng AWS Credentials.

#### 2. Kiểm tra Backend và Frontend

Đảm bảo Backend đang chạy:

```text
http://127.0.0.1:8000
```

Đảm bảo Frontend đang chạy:

```text
http://localhost:5173
```

Sử dụng hai Terminal riêng trong Visual Studio Code.

Terminal Backend:

```powershell
cd C:\Projects\student-activity-platform\backend

.\.venv\Scripts\Activate.ps1

$env:SAP_DEMO_MODE="1"

python -m uvicorn app.main:app --reload
```

Terminal Frontend:

```powershell
cd C:\Projects\student-activity-platform\frontend

npm run dev
```

<!--
![Frontend and Backend running](/images/5-Workshop/5.5-Frontend/frontend-backend-running.png)
-->

#### 3. Kiểm tra file API Service

Trong Visual Studio Code, mở file:

```text
frontend/src/services/api.js
```

File api.js quản lý các API Request từ Frontend đến Backend.

Tìm cấu hình API_BASE_URL.

Địa chỉ Backend local được sử dụng trong đồ án:

```javascript
const API_BASE_URL = "http://127.0.0.1:8000";
```

Nếu source code hiện tại sử dụng biến môi trường để cấu hình địa chỉ API, giữ nguyên cơ chế đó và kiểm tra giá trị tương ứng.

Không tạo thêm một API_BASE_URL khác nếu biến này đã được khai báo.

<!--
![API base URL configuration](/images/5-Workshop/5.5-Frontend/api-base-url.png)
-->

{{% notice note %}}
Đoạn code trên minh họa giá trị API Base URL trong môi trường local. Không thay thế toàn bộ file api.js của đồ án vì file này còn chứa các API nghiệp vụ, xác thực và xử lý lỗi.
{{% /notice %}}

#### 4. Tìm hiểu cách gửi REST API Request

Các nhóm API trong hệ thống bao gồm:

| API | Method | Mục đích |
| --- | --- | --- |
| /auth/login | POST | Đăng nhập |
| /auth/me | GET | Lấy thông tin người dùng |
| /auth/logout | POST | Đăng xuất |
| /admin/students | GET | Lấy danh sách tài khoản sinh viên |
| /activities/{activity_id}/check-in | POST | Ghi nhận Check-in |
| /activities/{activity_id}/check-out | POST | Ghi nhận Check-out |

Các API khác liên quan đến Activity Management, Registration, Evidence, Participation, Analytics và Export cần được kiểm tra theo Swagger UI của phiên bản Backend hiện tại.

Ví dụ minh họa gửi yêu cầu lấy thông tin người dùng:

```javascript
async function getCurrentUser() {
  const token = localStorage.getItem("sap_access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(
    "http://127.0.0.1:8000/auth/me",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
}
```

Giải thích:

* fetch(): Gửi HTTP Request.
* Authorization: Cung cấp Access Token cho API được bảo vệ.
* response.ok: Kiểm tra Request có thành công hay không.
* response.json(): Chuyển Response thành dữ liệu JavaScript.

Đây là ví dụ giúp người học hiểu luồng REST API. Các Component trong đồ án nên tiếp tục sử dụng API Service hiện có thay vì tạo nhiều cơ chế gửi Request trùng lặp.

#### 5. Tìm hiểu cơ chế CORS

Frontend và Backend local hoạt động trên hai origin khác nhau:

```text
Frontend: http://localhost:5173
Backend:  http://127.0.0.1:8000
```

Cross-Origin Resource Sharing (CORS) cho phép Backend xác định những origin nào được phép truy cập API thông qua trình duyệt.

Mở file:

```text
backend/app/main.py
```

Kiểm tra cấu hình CORSMiddleware.

Ví dụ minh họa:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Chỉ sử dụng đoạn cấu hình minh họa nếu phù hợp với source code hiện tại.

Nếu Backend đã cấu hình CORSMiddleware, không thêm một Middleware trùng lặp.

Khi Frontend được triển khai trên AWS Amplify, cần bổ sung origin HTTPS thực tế của Website vào danh sách được phép.

<!--
![FastAPI CORS configuration](/images/5-Workshop/5.5-Frontend/cors-config.png)
-->

{{% notice note %}}
CORS không thay thế Authentication hoặc Authorization. Backend vẫn phải kiểm tra Access Token và quyền người dùng cho các API được bảo vệ.
{{% /notice %}}

#### 6. Kiểm tra API Request trên trình duyệt

1. Mở Frontend tại http://localhost:5173.
2. Nhấn F12 để mở Developer Tools.
3. Chọn tab Network.
4. Chọn bộ lọc Fetch/XHR.
5. Thực hiện đăng nhập bằng tài khoản Demo.
6. Quan sát API Request được gửi đến Backend.

<!--
![Browser network requests](/images/5-Workshop/5.5-Frontend/network-requests.png)
-->

Chọn Request đăng nhập để kiểm tra:

* Request URL.
* Request Method.
* HTTP Status Code.
* Request Payload.
* Response Body.

Sau khi đăng nhập thành công, thực hiện một thao tác như mở danh sách hoạt động hoặc trang hồ sơ cá nhân.

Kiểm tra các API Request tương ứng được gửi đến FastAPI.

{{% notice warning %}}
Khi chụp ảnh Network hoặc Swagger UI để đưa vào báo cáo, cần che Access Token, mật khẩu và dữ liệu cá nhân.
{{% /notice %}}

#### 7. Xử lý API Response

Frontend cần xử lý kết quả trả về từ Backend.

| HTTP Status Code | Ý nghĩa |
| --- | --- |
| 200 | Request thành công |
| 201 | Tài nguyên được tạo thành công |
| 400 | Request không hợp lệ |
| 401 | Chưa xác thực hoặc Access Token không hợp lệ |
| 403 | Không đủ quyền thực hiện |
| 404 | Không tìm thấy tài nguyên |
| 409 | Xung đột dữ liệu hoặc thao tác nghiệp vụ |
| 422 | Dữ liệu đầu vào không phù hợp |
| 500 | Lỗi xử lý phía Server |

Các Status Code thực tế phụ thuộc vào từng Endpoint.

Khi API trả về lỗi, Frontend cần hiển thị thông báo phù hợp để người dùng biết thao tác có thành công hay không.

Ví dụ:

* Sai thông tin đăng nhập: Hiển thị thông báo đăng nhập thất bại.
* Token hết hạn: Yêu cầu người dùng đăng nhập lại theo cơ chế xác thực.
* Không đủ quyền: Thông báo người dùng không có quyền truy cập.
* Không kết nối được Backend: Thông báo lỗi kết nối.

#### 8. Kiểm tra các API nghiệp vụ

Sau khi kết nối thành công, đăng nhập bằng tài khoản ADMIN Demo và thực hiện:

* Mở danh sách hoạt động.
* Tạo một hoạt động thử nghiệm.
* Mở trang quản lý tài khoản sinh viên.
* Kiểm tra thông tin hồ sơ cá nhân.

Trong Developer Tools, kiểm tra HTTP Request và Response tương ứng.

<!--
![Activity API request](/images/5-Workshop/5.5-Frontend/activity-api-request.png)

![Student management API request](/images/5-Workshop/5.5-Frontend/student-api-request.png)
-->

Các chức năng Registration Import, Attendance và Evidence Import sẽ được thực hành chi tiết trong những phần tiếp theo.

#### 9. Xử lý các lỗi kết nối thường gặp

| Lỗi | Cách kiểm tra |
| --- | --- |
| Failed to fetch | Kiểm tra Backend, API URL và CORS |
| ERR_CONNECTION_REFUSED | Kiểm tra Uvicorn có đang chạy tại port 8000 |
| CORS error | Kiểm tra origin Frontend trong CORSMiddleware |
| HTTP 401 | Kiểm tra Access Token và phiên đăng nhập |
| HTTP 403 | Kiểm tra Role ADMIN/STUDENT |
| HTTP 404 | Đối chiếu đường dẫn API với Swagger UI |
| HTTP 422 | Kiểm tra Request Body theo API Schema |
| HTTP 500 | Kiểm tra log Backend và cấu hình dữ liệu |

#### Kết quả

Sau khi hoàn thành phần này:

* Frontend đã được cấu hình để giao tiếp với FastAPI.
* API_BASE_URL được xác định đúng.
* REST API Request và Response có thể được kiểm tra trên trình duyệt.
* CORS được cấu hình phù hợp với môi trường local.
* Người học hiểu cách xử lý các lỗi kết nối và lỗi API thường gặp.

Trong phần tiếp theo, chúng ta sẽ tìm hiểu cơ chế Authentication, quản lý Access Token và phân quyền ADMIN/STUDENT.

[Tiếp theo: Xác thực và phân quyền ADMIN/STUDENT](../5.5.3-authentication/)
