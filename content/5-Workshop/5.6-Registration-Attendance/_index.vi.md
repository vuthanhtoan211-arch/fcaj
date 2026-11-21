
---
title: "Quản lý đăng ký và điểm danh"
date: 2026-11-09
weight: 6
chapter: false
pre: "<b>5.6.</b>"
---

## Quản lý đăng ký và điểm danh

Trong phần này, chúng ta sẽ thực hành quy trình quản lý đăng ký và ghi nhận điểm danh của hệ thống Student Activity Management & Engagement Analytics Platform.

Trong thực tế, khi tổ chức các hoạt động tại trường đại học, Ban Tổ chức cần quản lý danh sách sinh viên đăng ký, kiểm tra thông tin người tham gia và ghi nhận thời gian Check-in/Check-out.

Nếu thực hiện thủ công bằng nhiều file Excel, quá trình kiểm tra và tổng hợp dữ liệu có thể mất nhiều thời gian, đặc biệt đối với những hoạt động có số lượng sinh viên tham gia lớn.

Hệ thống được xây dựng nhằm tập trung hóa dữ liệu và hỗ trợ Ban Tổ chức ghi nhận điểm danh theo thời gian thực thông qua Web Application.

#### Nguồn dữ liệu

Hệ thống sử dụng hai nguồn dữ liệu chính trong quy trình đăng ký và điểm danh:

* University Portal: Cung cấp danh sách sinh viên đăng ký tham gia hoạt động dưới dạng CSV/XLSX.
* Student Card QR / MSSV: Cung cấp mã định danh sinh viên để ghi nhận Check-in và Check-out trong quá trình diễn ra hoạt động.

Danh sách đăng ký được nhập từ file, trong khi dữ liệu điểm danh được gửi trực tiếp đến Backend thông qua REST API.

#### Kiến trúc xử lý

```text
University Portal
        |
        | Export CSV / XLSX
        v
ADMIN - React / Vite
        |
        | Registration Import
        v
FastAPI Backend
        |
        v
Registration Data

Student Card QR / MSSV
        |
        v
ADMIN - Attendance Interface
        |
        | Real-time REST API
        v
FastAPI Backend
        |
        v
Attendance Data
```

Backend sử dụng SQLite để hỗ trợ lưu trữ và khôi phục dữ liệu trong môi trường Demo.

Amazon DynamoDB được tích hợp để kiểm thử lưu trữ dữ liệu Registration và Attendance trên AWS thông qua các bảng SAP-Registrations và SAP-Attendance.

![System Architecture](/images/2-Proposal/student_activity_architectur.drawio.png)

#### Quy trình nghiệp vụ

1. ADMIN tạo và chuẩn bị hoạt động.
2. Nhập danh sách sinh viên đăng ký từ University Portal.
3. Kiểm tra và chuẩn hóa dữ liệu MSSV.
4. Chuẩn bị thời gian và điều kiện điểm danh.
5. Ghi nhận Check-in theo thời gian thực.
6. Ghi nhận Check-out theo thời gian thực.
7. Kiểm tra và xác minh dữ liệu điểm danh.
8. Chuẩn bị dữ liệu cho quá trình đối soát và xác nhận tham gia.

#### Nội dung

1. [Nhập danh sách sinh viên đăng ký](5.6.1-import-registration/)
2. [Chuẩn bị hoạt động và điểm danh](5.6.2-prepare-attendance/)
3. [Ghi nhận Check-in và Check-out](5.6.3-check-in-check-out/)
4. [Xác minh dữ liệu điểm danh](5.6.4-verify-attendance/)

#### Mục tiêu

Sau khi hoàn thành phần này, bạn sẽ có thể:

* Nhập dữ liệu đăng ký sinh viên từ file CSV/XLSX.
* Kiểm tra dữ liệu thiếu và dữ liệu trùng lặp.
* Hiểu mối quan hệ giữa Activity ID và MSSV.
* Chuẩn bị một hoạt động đủ điều kiện điểm danh.
* Sử dụng REST API để ghi nhận Check-in/Check-out.
* Kiểm tra các quy tắc nghiệp vụ liên quan đến điểm danh.
* Xác minh dữ liệu trong Backend và Amazon DynamoDB khi AWS Pilot được bật.
* Chuẩn bị dữ liệu phục vụ đối soát và phân tích kết quả tham gia.

Phần này giúp người học hiểu cách xây dựng một quy trình quản lý hoạt động sinh viên từ dữ liệu đăng ký ban đầu đến dữ liệu điểm danh được ghi nhận trong thực tế.
