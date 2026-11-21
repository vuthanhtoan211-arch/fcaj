
---
title: "Triển khai AWS Amplify và Cloudflare Tunnel"
date: 2026-11-09
weight: 9
chapter: false
pre: "<b>5.9.</b>"
---

## Triển khai AWS Amplify và Cloudflare Tunnel

Trong phần này, chúng ta sẽ triển khai Student Activity Management & Engagement Analytics Platform lên môi trường Demo có thể truy cập qua Internet bằng AWS Amplify Hosting và Cloudflare Quick Tunnel.

Sau khi hoàn thành quá trình phát triển Backend FastAPI, Frontend React/Vite, tích hợp Amazon DynamoDB và các chức năng nghiệp vụ, bước tiếp theo là đưa giao diện Web lên môi trường Cloud để phục vụ trình diễn và kiểm thử hệ thống.

#### Giới thiệu về AWS Amplify Hosting

AWS Amplify Hosting là dịch vụ hỗ trợ triển khai và lưu trữ các ứng dụng Web Frontend trên AWS.

Dịch vụ hỗ trợ:

* Kết nối với GitHub Repository.
* Tự động cài đặt thư viện và build ứng dụng.
* Triển khai các tài nguyên Frontend đã build.
* Cung cấp địa chỉ Website HTTPS.
* Quản lý biến môi trường trong quá trình build.
* Hỗ trợ Continuous Deployment khi mã nguồn được cập nhật.

Trong đồ án, AWS Amplify Hosting được sử dụng để triển khai giao diện React/Vite từ repository fcaj và branch main.

#### Giới thiệu về Cloudflare Quick Tunnel

Cloudflare Quick Tunnel cung cấp một địa chỉ HTTPS tạm thời để chuyển tiếp yêu cầu từ Internet đến một dịch vụ đang chạy trên máy tính local.

Trong môi trường Demo của đồ án, FastAPI Backend chạy trên Windows tại địa chỉ:

```text
http://127.0.0.1:8001
```

Cloudflare Quick Tunnel được sử dụng để Frontend đã triển khai trên AWS Amplify có thể gửi REST API Request đến Backend này.

#### Kiến trúc triển khai

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

Trong kiến trúc này:

* GitHub quản lý mã nguồn và cung cấp source code cho Amplify.
* AWS Amplify Hosting triển khai Frontend React/Vite.
* Trình duyệt tải Frontend từ Amplify.
* Frontend gửi REST API Request thông qua Cloudflare Quick Tunnel.
* FastAPI xử lý xác thực, phân quyền và nghiệp vụ.
* SQLite hỗ trợ lưu trữ dữ liệu Demo.
* DynamoDB được sử dụng trong phạm vi tích hợp Cloud đã cấu hình.

![System Architecture](/images/2-Proposal/student_activity_architectur.drawio.png)

{{% notice note %}}
AWS Amplify Hosting không trực tiếp chạy FastAPI Backend trong kiến trúc hiện tại. Trình duyệt gọi API thông qua Cloudflare Quick Tunnel đến Backend đang chạy trên máy tính local.
{{% /notice %}}

#### Quy trình triển khai

1. Chuẩn bị source code Frontend và GitHub Repository.
2. Kiểm tra khả năng build React/Vite.
3. Khởi chạy FastAPI Backend Demo tại port 8001.
4. Tạo Cloudflare Quick Tunnel.
5. Kiểm tra HTTPS API Endpoint.
6. Cấu hình biến môi trường VITE_API_BASE_URL.
7. Triển khai Frontend lên AWS Amplify Hosting.
8. Cấu hình CORS phù hợp với địa chỉ Amplify.
9. Kiểm thử đăng nhập và các chức năng nghiệp vụ.

#### Nội dung

1. [Chuẩn bị source code và cấu hình triển khai](5.9.1-prepare-deployment/)
2. [Kết nối Backend bằng Cloudflare Quick Tunnel](5.9.2-cloudflare-tunnel/)
3. [Triển khai Frontend lên AWS Amplify Hosting](5.9.3-amplify-hosting/)
4. [Kiểm thử ứng dụng sau khi triển khai](5.9.4-test-deployment/)

#### Mục tiêu

Sau khi hoàn thành phần này, bạn sẽ có thể:

* Chuẩn bị ứng dụng React/Vite để triển khai lên AWS.
* Hiểu quy trình build và deploy Frontend từ GitHub.
* Cấu hình biến môi trường Vite cho môi trường Deployment.
* Tạo Cloudflare Quick Tunnel kết nối Backend local với Internet.
* Triển khai Frontend bằng AWS Amplify Hosting.
* Kiểm tra CORS và HTTPS API Connectivity.
* Kiểm thử Authentication và các chức năng nghiệp vụ sau triển khai.
* Phân biệt môi trường Demo với kiến trúc Production.

#### Kết quả triển khai

Trong đợt kiểm thử ngày 09/11/2026, đồ án đã triển khai thành công Frontend trên AWS Amplify Hosting, kết nối Backend FastAPI thông qua Cloudflare Quick Tunnel và kiểm tra các chức năng đăng nhập ADMIN/STUDENT, tạo và lưu hoạt động.

Môi trường hiện tại là phiên bản Demo, chưa phải hệ thống Production được triển khai hoàn toàn trên AWS.

{{% notice warning %}}
Cloudflare Quick Tunnel chỉ phù hợp với môi trường phát triển và kiểm thử tạm thời. Địa chỉ Tunnel có thể thay đổi khi khởi động lại. Chỉ sử dụng dữ liệu giả lập và tài khoản Demo khi cung cấp Backend qua Internet.
{{% /notice %}}
