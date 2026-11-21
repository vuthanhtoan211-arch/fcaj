
---
title: "Kiểm thử Backend và REST API"
date: 2026-11-09
weight: 2
chapter: false
pre: "<b>5.3.2.</b>"
---

## Kiểm thử Backend và REST API

Trong phần này, chúng ta sẽ sử dụng Swagger UI để kiểm tra các API chính của Student Activity Management & Engagement Analytics Platform.

Mục tiêu là kiểm tra khả năng hoạt động của Backend, xác thực người dùng, phân quyền và các chức năng nghiệp vụ trước khi tích hợp Amazon DynamoDB.

#### Bước 1: Kiểm tra Backend đang hoạt động

Đảm bảo FastAPI Backend đã được khởi chạy:

```powershell
python -m uvicorn app.main:app --reload
```

Truy cập:

[Swagger UI](http://127.0.0.1:8000/docs)

Kiểm tra các nhóm API được hiển thị.

<!--
![Swagger API endpoints](/images/5-Workshop/5.3-Backend/swagger-endpoints.png)
-->

#### Bước 2: Kiểm thử Authentication

Trong Swagger UI, tìm Endpoint:

```text
POST /auth/login
```

* Mở Endpoint.
* Chọn **Try it out**.
* Nhập thông tin tài khoản ADMIN Demo theo Request Body được hiển thị.
* Chọn **Execute**.

Nếu thông tin đăng nhập hợp lệ, Backend trả về kết quả đăng nhập thành công và thông tin Access Token theo cấu trúc Response của API.

Kết quả mong đợi:

```text
HTTP 200 OK
```

<!--
![Admin login API](/images/5-Workshop/5.3-Backend/admin-login.png)
-->

{{% notice warning %}}
Chỉ sử dụng tài khoản Demo. Không công khai mật khẩu thật hoặc Access Token trong ảnh chụp báo cáo thực tập.
{{% /notice %}}

#### Bước 3: Kiểm tra thông tin người dùng hiện tại

Tìm Endpoint:

```text
GET /auth/me
```

Sử dụng Access Token nhận được từ bước đăng nhập.

Nếu Swagger UI hỗ trợ nút **Authorize**, chọn nút này và cung cấp Token theo cấu hình xác thực của API.

Nếu không, có thể gửi yêu cầu bằng PowerShell:

```powershell
$token = "YOUR_DEMO_ACCESS_TOKEN"

Invoke-RestMethod `
  -Method Get `
  -Uri "http://127.0.0.1:8000/auth/me" `
  -Headers @{ Authorization = "Bearer $token" }
```

Thay YOUR_DEMO_ACCESS_TOKEN bằng Access Token hợp lệ.

Kiểm tra Response để xác nhận tài khoản đang sử dụng và Role tương ứng.

<!--
![Current user API](/images/5-Workshop/5.3-Backend/auth-me.png)
-->

#### Bước 4: Kiểm thử quản lý tài khoản sinh viên

Sử dụng tài khoản ADMIN và tìm Endpoint:

```text
GET /admin/students
```

Thực hiện Request với Access Token của ADMIN.

Kết quả mong đợi:

* Backend cho phép truy cập.
* Trả về dữ liệu danh sách tài khoản sinh viên theo cấu trúc API.
* ADMIN có thể sử dụng các chức năng quản lý tài khoản được cấp quyền.

Tiếp tục đăng nhập bằng tài khoản STUDENT và thử gọi Endpoint trên.

Kết quả mong đợi:

* STUDENT không được phép truy cập chức năng quản lý tài khoản sinh viên.
* Backend trả về lỗi phân quyền, thông thường là HTTP 403 Forbidden đối với Token hợp lệ nhưng không đủ quyền.

<!--
![Admin student management API](/images/5-Workshop/5.3-Backend/admin-students.png)
-->

#### Bước 5: Kiểm thử Activity Management

Trong Swagger UI, tìm nhóm API quản lý hoạt động.

Sử dụng các Endpoint tương ứng với phiên bản source code của đồ án để:

* Tạo hoạt động Demo.
* Xem danh sách hoạt động.
* Xem chi tiết hoạt động.
* Cập nhật thông tin hoạt động.

Ví dụ dữ liệu hoạt động:

```text
Activity Name: AWS Workshop Demo
Location: University Hall
Description: Student activity management test
```

Khi tạo hoạt động, sử dụng các trường bắt buộc được hiển thị trong Request Body của Swagger UI.

Kết quả mong đợi:

* Hoạt động được tạo thành công.
* Hoạt động xuất hiện trong danh sách.
* Có Activity ID để sử dụng trong các bước kiểm thử tiếp theo.

<!--
![Create activity API](/images/5-Workshop/5.3-Backend/create-activity.png)

![Activity list API](/images/5-Workshop/5.3-Backend/activity-list.png)
-->

#### Bước 6: Kiểm thử Attendance API

Hệ thống ghi nhận Check-in và Check-out theo thời gian thực.

Các Endpoint điểm danh:

```text
POST /activities/{activity_id}/check-in

POST /activities/{activity_id}/check-out
```

Chuẩn bị:

* Một hoạt động Demo đã được tạo.
* Một sinh viên Demo hợp lệ.
* Tài khoản ADMIN hoặc tài khoản được cấp quyền điểm danh.
* Hoạt động đang ở trạng thái và khung thời gian cho phép điểm danh.
* Dữ liệu đăng ký của sinh viên nếu nghiệp vụ yêu cầu.

Trong Swagger UI:

1. Mở Endpoint Check-in.
2. Chọn **Try it out**.
3. Nhập Activity ID.
4. Nhập thông tin sinh viên theo Request Body.
5. Chọn **Execute**.
6. Kiểm tra Response.

Tiếp tục thực hiện tương tự với Endpoint Check-out.

Kết quả mong đợi:

* Check-in được ghi nhận đúng hoạt động và sinh viên.
* Check-out được ghi nhận sau Check-in khi đáp ứng điều kiện nghiệp vụ.
* Các thao tác trùng lặp hoặc không hợp lệ được xử lý phù hợp.
* Các thao tác ngoài khung thời gian cho phép không được ghi nhận sai quy định.

{{% notice note %}}
Các API điểm danh sử dụng thời gian thực. Khi kiểm thử, cần lựa chọn thời gian hoạt động phù hợp thay vì nhập một hoạt động đã kết thúc.
{{% /notice %}}

<!--
![Check-in API test](/images/5-Workshop/5.3-Backend/check-in-test.png)

![Check-out API test](/images/5-Workshop/5.3-Backend/check-out-test.png)
-->

#### Bước 7: Kiểm tra cơ chế lưu trữ SQLite

Phiên bản Demo sử dụng SQLite để hỗ trợ lưu trữ và khôi phục trạng thái ứng dụng.

Để kiểm tra:

* Tạo một hoạt động Demo bằng API.
* Ghi lại Activity ID.
* Dừng Backend bằng Ctrl + C.
* Khởi chạy lại Backend:

```powershell
python -m uvicorn app.main:app --reload
```

* Truy cập Swagger UI.
* Sử dụng API xem hoạt động để kiểm tra lại Activity ID.

Kết quả mong đợi là dữ liệu thuộc phạm vi persistence vẫn có thể được khôi phục sau khi khởi động lại ứng dụng.

Nếu dữ liệu không được khôi phục, kiểm tra cấu hình Demo và cơ chế persistence trong source code.

<!--
![SQLite persistence test](/images/5-Workshop/5.3-Backend/sqlite-persistence.png)
-->

#### Bước 8: Tổng hợp kết quả kiểm thử

| Nội dung kiểm thử | Kết quả mong đợi |
| --- | --- |
| FastAPI Startup | Backend hoạt động tại port 8000 |
| Swagger UI | Hiển thị danh sách REST API |
| Authentication | Đăng nhập thành công với tài khoản hợp lệ |
| Current User | Trả về thông tin người dùng hiện tại |
| ADMIN Authorization | Truy cập được chức năng quản trị |
| STUDENT Authorization | Không truy cập được chức năng quản trị |
| Activity Management | Tạo và truy xuất hoạt động |
| Check-in / Check-out | Ghi nhận điểm danh hợp lệ theo thời gian thực |
| SQLite Persistence | Khôi phục dữ liệu thuộc phạm vi lưu trữ |

Các kết quả trên là tiêu chí kiểm thử. Người thực hiện workshop cần xác nhận kết quả thực tế và bổ sung ảnh chụp tương ứng.

#### Kết luận

Sau khi hoàn thành phần này, Backend FastAPI đã được chuẩn bị và kiểm thử các nhóm chức năng chính.

Backend có thể tiếp tục được kết nối với Frontend React/Vite và tích hợp Amazon DynamoDB để lưu trữ dữ liệu nghiệp vụ trên AWS.

Trong phần tiếp theo, chúng ta sẽ tạo và cấu hình các bảng DynamoDB, sau đó kiểm thử thao tác đọc và ghi dữ liệu thông qua AWS SDK for Python.

[Tiếp theo: Tích hợp Amazon DynamoDB](../../5.4-DynamoDB/)
