
---
title: "Tích hợp Amazon DynamoDB"
date: 2026-11-09
weight: 4
chapter: false
pre: "<b>5.4.</b>"
---

## Tích hợp Amazon DynamoDB

Trong phần này, chúng ta sẽ tích hợp Amazon DynamoDB vào hệ thống Student Activity Management & Engagement Analytics Platform để tìm hiểu cách lưu trữ và truy xuất dữ liệu nghiệp vụ trên AWS.

**Amazon DynamoDB** là dịch vụ cơ sở dữ liệu NoSQL được quản lý bởi AWS, hỗ trợ lưu trữ dữ liệu dạng Key-Value và Document với khả năng mở rộng linh hoạt.

Trong đồ án, DynamoDB được sử dụng để lưu trữ và kiểm thử năm nhóm dữ liệu chính:

* Activities: Thông tin hoạt động.
* Registrations: Danh sách sinh viên đăng ký.
* Attendance: Dữ liệu Check-in/Check-out.
* Evidence: Minh chứng tham gia.
* Participation: Kết quả đối soát và xác nhận tham gia.

Backend Python/FastAPI sẽ sử dụng AWS SDK for Python (boto3) để kết nối và thực hiện các thao tác với DynamoDB.

#### Kiến trúc tích hợp

```text
Python / FastAPI Backend
          |
          | AWS SDK (boto3)
          v
     Amazon DynamoDB
          |
          +-- SAP-Activities
          +-- SAP-Registrations
          +-- SAP-Attendance
          +-- SAP-Evidence
          +-- SAP-Participation
```

Phiên bản Demo hiện tại vẫn sử dụng SQLite để hỗ trợ lưu trữ và khôi phục trạng thái ứng dụng trong môi trường local.

DynamoDB là phần tích hợp Cloud Data Storage đã được triển khai và kiểm thử. Workshop không giả định rằng toàn bộ cơ chế persistence đã chuyển hoàn toàn sang DynamoDB.

![System Architecture](/images/2-Proposal/student_activity_architectur.drawio.png)

#### Nội dung

1. [Tạo các bảng Amazon DynamoDB](5.4.1-create-tables/)
2. [Kết nối Backend với Amazon DynamoDB](5.4.2-connect-backend/)
3. [Kiểm thử đọc và ghi dữ liệu](5.4.3-test-dynamodb/)
4. [Xác minh dữ liệu trên AWS Console](5.4.4-verify-data/)

#### Mục tiêu

Sau khi hoàn thành phần này, bạn sẽ có thể:

* Hiểu cách thiết kế bảng DynamoDB cho dữ liệu hoạt động sinh viên.
* Phân biệt Partition Key và Sort Key.
* Tạo và kiểm tra năm bảng dữ liệu trên AWS.
* Cấu hình AWS Profile cho ứng dụng Python.
* Sử dụng boto3 để truy xuất dữ liệu DynamoDB.
* Kiểm tra kết quả lưu trữ dữ liệu từ Backend.
* Xác minh dữ liệu nghiệp vụ bằng AWS Management Console.
* Hiểu sự khác biệt giữa SQLite Local Persistence và DynamoDB Cloud Storage.
