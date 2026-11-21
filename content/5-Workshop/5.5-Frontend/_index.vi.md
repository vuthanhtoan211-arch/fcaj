
---
title: "Xây dựng Frontend React/Vite"
date: 2026-11-09
weight: 5
chapter: false
pre: "<b>5.5.</b>"
---

## Xây dựng Frontend React/Vite

Trong phần này, chúng ta sẽ xây dựng và cấu hình Frontend cho hệ thống Student Activity Management & Engagement Analytics Platform bằng React và Vite.

React là thư viện JavaScript được sử dụng để xây dựng giao diện người dùng theo mô hình Component. Vite là công cụ hỗ trợ phát triển và build ứng dụng Frontend với khả năng khởi chạy nhanh và tự động cập nhật giao diện khi mã nguồn thay đổi.

Frontend đóng vai trò là thành phần tương tác trực tiếp giữa người dùng và hệ thống.

Các chức năng chính bao gồm:

* Đăng nhập và xác thực người dùng.
* Hiển thị giao diện theo quyền ADMIN và STUDENT.
* Quản lý hoạt động sinh viên.
* Quản lý tài khoản sinh viên.
* Nhập dữ liệu đăng ký từ CSV/XLSX.
* Ghi nhận Check-in và Check-out theo thời gian thực.
* Nhập dữ liệu minh chứng tham gia.
* Đối soát và xác nhận kết quả tham gia.
* Hiển thị Analytics Dashboard và hỗ trợ xuất báo cáo.
* Quản lý hồ sơ cá nhân.

#### Kiến trúc Frontend

```text
ADMIN / STUDENT
       |
       v
React / Vite Frontend
       |
       | REST API + Access Token
       v
Python / FastAPI Backend
       |
       +-- SQLite Local Persistence
       |
       +-- Amazon DynamoDB Integration
```

Trong môi trường phát triển, Frontend chạy trên máy tính local và gửi REST API Request đến Backend FastAPI tại port 8000.

Sau khi hoàn thành quá trình phát triển và kiểm thử, Frontend sẽ được triển khai lên AWS Amplify Hosting. Cloudflare Quick Tunnel được sử dụng để kết nối giao diện đã triển khai với Backend local trong môi trường Demo.

![Student Activity Management & Engagement Analytics Platform Architecture](/images/2-Proposal/student_activity_architectur.drawio.png)

#### Nội dung

1. [Cài đặt và khởi chạy Frontend React/Vite](5.5.1-setup-frontend/)
2. [Kết nối Frontend với FastAPI REST API](5.5.2-connect-api/)
3. [Xác thực và phân quyền ADMIN/STUDENT](5.5.3-authentication/)
4. [Kiểm thử giao diện và chức năng hệ thống](5.5.4-test-interface/)

#### Mục tiêu

Sau khi hoàn thành phần này, bạn sẽ có thể:

* Hiểu cấu trúc Frontend của một Web Application sử dụng React/Vite.
* Cài đặt các thư viện và khởi chạy ứng dụng trên môi trường local.
* Kết nối React với Backend FastAPI thông qua REST API.
* Hiểu cách quản lý Access Token và thông tin phiên đăng nhập.
* Xây dựng giao diện phù hợp với quyền ADMIN và STUDENT.
* Kiểm thử các chức năng chính của hệ thống.
* Chuẩn bị Frontend để triển khai lên AWS Amplify Hosting.

Thông qua phần này, người học sẽ hiểu rõ cách kết nối giao diện người dùng với Backend và các thành phần lưu trữ dữ liệu trong một hệ thống Web hoàn chỉnh.
