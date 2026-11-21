
---
title: "Cài đặt và cấu hình Backend FastAPI"
date: 2026-11-09
weight: 1
chapter: false
pre: "<b>5.3.1.</b>"
---

## Cài đặt và cấu hình Backend FastAPI

Trong phần này, chúng ta sẽ chuẩn bị môi trường Python, cài đặt các thư viện cần thiết và khởi chạy Backend FastAPI của hệ thống Student Activity Management & Engagement Analytics Platform.

{{% notice note %}}
Bạn cần hoàn thành phần 5.2 - Các bước chuẩn bị trước khi thực hiện. Workshop sử dụng Windows, PowerShell và Visual Studio Code làm môi trường phát triển.
{{% /notice %}}

#### Bước 1: Mở source code của đồ án

1. Mở Visual Studio Code.
2. Chọn **File → Open Folder**.
3. Chọn thư mục chứa source code:

```text
C:\Projects\student-activity-platform
```

Cấu trúc thư mục chính của đồ án:

```text
student-activity-platform/
├── backend/
│   ├── app/
│   │   └── main.py
│   └── requirements.txt
└── frontend/
```

* backend/: Chứa mã nguồn FastAPI và các thành phần xử lý nghiệp vụ.
* frontend/: Chứa mã nguồn React/Vite.
* app/main.py: Điểm khởi chạy chính của Backend.
* requirements.txt: Danh sách các thư viện Python cần thiết.

<!--
![Project source code](/images/5-Workshop/5.3-Backend/project-structure.png)
-->

#### Bước 2: Mở Terminal cho Backend

Trong Visual Studio Code:

* Chọn **Terminal → New Terminal**.
* Sử dụng PowerShell.
* Di chuyển đến thư mục Backend:

```powershell
cd C:\Projects\student-activity-platform\backend
```

Kiểm tra phiên bản Python:

```powershell
python --version
```

<!--
![Backend terminal](/images/5-Workshop/5.3-Backend/backend-terminal.png)
-->

#### Bước 3: Tạo Python Virtual Environment

Python Virtual Environment giúp tách biệt các thư viện của đồ án với môi trường Python chung trên máy tính.

Thực hiện lệnh:

```powershell
python -m venv .venv
```

Kích hoạt Virtual Environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

Sau khi kích hoạt thành công, Terminal sẽ hiển thị:

```text
(.venv) PS C:\Projects\student-activity-platform\backend>
```

{{% notice note %}}
Nếu Virtual Environment đã được tạo ở phần Prerequisite, bạn chỉ cần kích hoạt lại môi trường .venv mà không cần tạo mới.
{{% /notice %}}

<!--
![Python virtual environment](/images/5-Workshop/5.3-Backend/virtual-environment.png)
-->

Nếu PowerShell chặn việc chạy script Activate.ps1, sử dụng:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

.\.venv\Scripts\Activate.ps1
```

Thiết lập Execution Policy này chỉ có hiệu lực trong phiên PowerShell hiện tại.

Bạn cũng có thể gọi trực tiếp Python trong Virtual Environment mà không cần kích hoạt:

```powershell
.\.venv\Scripts\python.exe --version
```

#### Bước 4: Cài đặt các thư viện Backend

Tại thư mục backend, thực hiện:

```powershell
python -m pip install --upgrade pip

python -m pip install -r requirements.txt
```

Các thư viện được sử dụng theo cấu hình của đồ án, bao gồm những nhóm chức năng như:

* FastAPI: Xây dựng REST API.
* Uvicorn: ASGI Server để khởi chạy Backend.
* boto3: Kết nối và tương tác với các dịch vụ AWS.
* Thư viện xử lý CSV/XLSX.
* Thư viện hỗ trợ xác thực và kiểm tra dữ liệu.

Kiểm tra các thư viện đã được cài đặt:

```powershell
python -m pip list
```

<!--
![Install backend dependencies](/images/5-Workshop/5.3-Backend/install-dependencies.png)
-->

#### Bước 5: Cấu hình môi trường Demo

Để chạy phiên bản Demo của đồ án, cấu hình biến môi trường:

```powershell
$env:SAP_DEMO_MODE="1"
```

Kiểm tra biến môi trường:

```powershell
$env:SAP_DEMO_MODE
```

Kết quả:

```text
1
```

Phiên bản Demo cho phép phát triển và kiểm thử các chức năng nghiệp vụ trong môi trường local.

SQLite được sử dụng để hỗ trợ lưu trữ và khôi phục trạng thái ứng dụng.

{{% notice note %}}
Việc cấu hình SAP_DEMO_MODE không đồng nghĩa với việc toàn bộ thao tác dữ liệu sẽ tự động sử dụng DynamoDB. Phần tích hợp AWS sẽ được thực hiện và kiểm tra riêng tại mục 5.4.
{{% /notice %}}

Nếu cần chuẩn bị AWS Profile cho các thao tác tích hợp tiếp theo:

```powershell
$env:AWS_PROFILE="sap-dev"
```

Profile này cần được cấu hình theo hướng dẫn tại phần 5.2.

#### Bước 6: Tìm hiểu cấu trúc FastAPI Application

Mở file:

```text
backend/app/main.py
```

Đây là file khởi tạo FastAPI Application và kết nối các thành phần của Backend.

Trong quá trình tìm hiểu source code, cần chú ý:

* Khởi tạo FastAPI Application.
* Đăng ký API Routers.
* Cấu hình CORS để Frontend có thể gửi yêu cầu.
* Các cơ chế khởi tạo và khôi phục dữ liệu.
* Cấu hình Authentication và Authorization.

Các nhóm API của hệ thống phục vụ những chức năng như:

* Authentication.
* Student Account Management.
* Activity Management.
* Registration Import.
* Check-in / Check-out.
* Evidence Import.
* Reconciliation.
* Participation Confirmation.
* Analytics và Export.

Không cần tạo lại toàn bộ file main.py nếu bạn đang sử dụng source code hoàn chỉnh của đồ án.

<!--
![FastAPI main application](/images/5-Workshop/5.3-Backend/fastapi-main.png)
-->

#### Bước 7: Khởi chạy FastAPI Backend

Tại Terminal đã kích hoạt Virtual Environment, thực hiện:

```powershell
python -m uvicorn app.main:app --reload
```

Giải thích:

* app.main: Module chứa FastAPI Application.
* app: Đối tượng FastAPI được khởi tạo trong module.
* --reload: Tự động tải lại ứng dụng khi mã nguồn thay đổi trong môi trường phát triển.

Sau khi khởi chạy thành công, Terminal sẽ hiển thị thông tin tương tự:

```text
INFO: Uvicorn running on http://127.0.0.1:8000
INFO: Application startup complete.
```

<!--
![Backend running successfully](/images/5-Workshop/5.3-Backend/backend-running.png)
-->

Backend hiện đang hoạt động tại địa chỉ:

```text
http://127.0.0.1:8000
```

#### Bước 8: Truy cập Swagger UI

Mở trình duyệt và truy cập:

[FastAPI Swagger UI](http://127.0.0.1:8000/docs)

FastAPI tự động tạo giao diện Swagger UI dựa trên các API được định nghĩa trong source code.

Swagger UI cho phép:

* Xem danh sách REST API.
* Kiểm tra HTTP Method và API Endpoint.
* Xem cấu trúc Request Body.
* Xem các tham số đầu vào.
* Thực hiện API Request.
* Kiểm tra HTTP Status Code và Response Body.

<!--
![FastAPI Swagger UI](/images/5-Workshop/5.3-Backend/swagger-ui.png)
-->

Bạn cũng có thể truy cập tài liệu API dưới dạng ReDoc:

```text
http://127.0.0.1:8000/redoc
```

#### Kết quả

Sau khi hoàn thành các bước trên:

* Python Virtual Environment đã sẵn sàng.
* Các thư viện Backend đã được cài đặt.
* Môi trường SAP_DEMO_MODE đã được cấu hình.
* FastAPI Backend đã có thể khởi chạy tại port 8000.
* Swagger UI đã sẵn sàng để kiểm thử REST API.

Trong phần tiếp theo, chúng ta sẽ kiểm thử Authentication, Activity Management và các API nghiệp vụ trước khi thực hiện tích hợp Amazon DynamoDB.

[Tiếp theo: Kiểm thử Backend và REST API](../5.3.2-test-backend/)
