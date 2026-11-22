---
title: "Quản lý đăng ký và điểm danh"
date: 2026-11-09
weight: 6
chapter: false
pre: "<b>5.6.</b>"
---

## Quản lý đăng ký và điểm danh

Phần này trình bày chức năng nhập danh sách đăng ký và ghi nhận **Check-in/Check-out theo thời gian thực** đã được xây dựng trong đồ án **Student Activity Management & Engagement Analytics Platform**.

Đối với hoạt động tại trường đại học, dữ liệu đăng ký thường được xuất từ hệ thống bên ngoài, trong khi dữ liệu điểm danh phát sinh tại địa điểm tổ chức. Mục tiêu của phần này là quản lý dữ liệu theo đúng hoạt động và MSSV, giảm thao tác tổng hợp Excel thủ công và chuẩn bị dữ liệu cho bước đối soát.

### 1. Nguồn dữ liệu và phạm vi triển khai

| Nguồn dữ liệu | Cách tiếp nhận trong đồ án | Mục đích |
| --- | --- | --- |
| University Portal | ADMIN nhập file CSV/XLSX đã xuất | Xây dựng danh sách đăng ký |
| QR thẻ sinh viên / MSSV | ADMIN sử dụng giao diện điểm danh để gửi yêu cầu API ngay khi thao tác | Ghi nhận Check-in và Check-out |
| Thông tin hoạt động | ADMIN quản lý hoạt động trên Web Application | Áp dụng đúng hoạt động và điều kiện điểm danh |

Phiên bản hiện tại **chưa đồng bộ trực tiếp bằng API với University Portal**. Dữ liệu đăng ký được nhập từ file, còn Check-in/Check-out được gửi đến FastAPI Backend ngay khi thực hiện. Có thể sử dụng thiết bị quét cung cấp MSSV như dữ liệu nhập; không mặc định rằng chức năng quét QR bằng camera đã được kiểm thử hoàn chỉnh trên mọi thiết bị.

### 2. Kiến trúc triển khai thực tế

- **Frontend:** React/Vite cung cấp giao diện quản lý hoạt động, nhập đăng ký và điểm danh cho ADMIN.
- **Backend:** Python/FastAPI kiểm tra yêu cầu, phân quyền và xử lý các quy tắc điểm danh.
- **Lưu trữ Demo:** SQLite lưu dữ liệu ứng dụng trong môi trường chạy local.
- **Thử nghiệm AWS:** Amazon DynamoDB được sử dụng để kiểm thử nhóm dữ liệu `SAP-Registrations` và `SAP-Attendance`, không đồng nghĩa toàn bộ cơ sở dữ liệu Production đã chuyển lên AWS.

Chức năng đăng ký và điểm danh thuộc **ứng dụng FastAPI chính**, tách biệt với bài Demo xử lý CSV bằng AWS Lambda tại mục 5.10.

### 3. Nhập danh sách sinh viên đăng ký

ADMIN chọn hoạt động, tải lên file danh sách đăng ký được xuất từ University Portal và kiểm tra kết quả nhập. Backend kiểm tra các trường cần thiết, MSSV, dữ liệu thiếu và bản ghi trùng theo quy tắc đã triển khai.

![Giao diện nhập danh sách đăng ký thực tế](/fcaj/images/5-Workshop/5.6-Registration-Attendance/registration-import.png)

*Hình 5.6.1. Giao diện nhập danh sách đăng ký trong Web Application.*

### 4. Ghi nhận Check-in và Check-out theo thời gian thực

Khi tổ chức sự kiện, ADMIN chọn đúng hoạt động và xác định sinh viên bằng thông tin thẻ hoặc MSSV. Mỗi thao tác hợp lệ được gửi ngay qua REST API để hệ thống lưu bản ghi điểm danh.

Backend kiểm tra hoạt động, khung thời gian được phép và trạng thái điểm danh hiện tại. Check-out là thao tác riêng, không được tự động suy ra chỉ vì sinh viên có tên trong danh sách đăng ký.

![Giao diện Check-in thực tế](/fcaj/images/5-Workshop/5.6-Registration-Attendance/check-in.png)

*Hình 5.6.2. Thao tác Check-in trên Web Application.*

![Giao diện Check-out thực tế](/fcaj/images/5-Workshop/5.6-Registration-Attendance/check-out.png)

*Hình 5.6.3. Thao tác Check-out trên Web Application.*

### 5. Kiểm tra tính hợp lệ của dữ liệu

Nội dung kiểm thử gồm:

1. Sinh viên hợp lệ xuất hiện trong danh sách đăng ký của đúng hoạt động.
2. Check-in hợp lệ được ghi nhận cùng thời điểm thực hiện.
3. Check-out hợp lệ cập nhật bản ghi điểm danh tương ứng.
4. Yêu cầu trùng lặp hoặc không hợp lệ được xử lý theo quy tắc Backend.
5. MSSV được liên kết đúng với Activity ID.
6. ADMIN có thể kiểm tra dữ liệu đã ghi nhận trước khi đối soát.

Cặp **Activity ID và MSSV** rất quan trọng vì một sinh viên có thể tham gia nhiều hoạt động. Không thể ghép dữ liệu điểm danh của các hoạt động khác nhau chỉ dựa trên MSSV.

### 6. Nội dung thực hành

1. [Nhập dữ liệu đăng ký sinh viên](5.6.1-import-registration/)
2. [Chuẩn bị hoạt động và điều kiện điểm danh](5.6.2-prepare-attendance/)
3. [Thực hiện Check-in và Check-out](5.6.3-check-in-check-out/)
4. [Kiểm tra kết quả điểm danh](5.6.4-verify-attendance/)

### 7. Kết quả đạt được

Sau phần này, người học có thể nhập và kiểm tra dữ liệu đăng ký, ghi nhận điểm danh theo thời gian thực qua FastAPI, xem các bản ghi tương ứng và hiểu cách chuẩn bị dữ liệu cho phần đối soát tại mục 5.7.

> **Lưu ý về phạm vi:** Hình ảnh thể hiện giao diện và kết quả thực hành thực tế. Backend FastAPI/SQLite chạy local và phần thử nghiệm DynamoDB có phạm vi khác nhau; không xem đây là bằng chứng Backend đã được triển khai hoàn toàn trên Cloud.
