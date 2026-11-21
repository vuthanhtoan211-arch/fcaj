
---
title: "Xây dựng Backend FastAPI"
date: 2026-11-09
weight: 3
chapter: false
pre: "<b>5.3.</b>"
---

## Xây dựng Backend FastAPI

Trong phần này, chúng ta sẽ xây dựng và cấu hình Backend cho hệ thống Student Activity Management & Engagement Analytics Platform bằng Python và FastAPI.

FastAPI là một Web Framework hiện đại dành cho Python, hỗ trợ xây dựng REST API với hiệu năng cao, kiểm tra dữ liệu đầu vào và tự động tạo tài liệu API thông qua Swagger UI.

Backend đảm nhiệm các chức năng chính của hệ thống:

* Xác thực người dùng và quản lý Access Token.
* Phân quyền ADMIN và STUDENT.
* Quản lý hoạt động sinh viên.
* Quản lý tài khoản sinh viên.
* Nhập dữ liệu đăng ký và minh chứng từ CSV/XLSX.
* Ghi nhận Check-in/Check-out theo thời gian thực.
* Đối soát và xác nhận kết quả tham gia.
* Tổng hợp dữ liệu phục vụ Analytics Dashboard và Export.

Trong phiên bản Demo, Backend sử dụng SQLite để hỗ trợ lưu trữ và khôi phục dữ liệu local. Amazon DynamoDB được tích hợp và kiểm thử trong phần tiếp theo của workshop.

Frontend React/Vite sẽ giao tiếp với Backend thông qua REST API.

#### Nội dung

1. [Cài đặt và cấu hình Backend FastAPI](5.3.1-setup-backend/)
2. [Kiểm thử Backend và REST API](5.3.2-test-backend/)

Sau khi hoàn thành phần này, bạn sẽ có một môi trường Backend hoạt động trên máy tính local, sẵn sàng kết nối với Frontend và tích hợp các dịch vụ AWS.
