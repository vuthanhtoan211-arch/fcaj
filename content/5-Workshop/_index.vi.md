
---
title: "Xử lý dữ liệu Serverless với Amazon S3 và AWS Lambda"
date: 2026-11-09
weight: 10
chapter: false
pre: "<b>5.10.</b>"
---

## Xử lý dữ liệu Serverless với Amazon S3 và AWS Lambda

Trong phần này, chúng ta sẽ xây dựng và kiểm thử một quy trình xử lý dữ liệu CSV bằng các dịch vụ AWS trong hệ thống Student Activity Management & Engagement Analytics Platform.

Sau khi hoàn thành các chức năng quản lý đăng ký, điểm danh, đối soát và triển khai Web Application, chúng ta sẽ mở rộng kiến trúc bằng một bài thực hành Serverless Data Processing.

Mục tiêu là tìm hiểu cách sử dụng Amazon S3 để lưu trữ dữ liệu, AWS Lambda để xử lý file CSV, AWS IAM để quản lý quyền truy cập và Amazon CloudWatch để theo dõi quá trình thực thi.

#### Giới thiệu về Serverless Computing

Serverless Computing là mô hình điện toán cho phép nhà phát triển xây dựng và chạy các chức năng mà không cần trực tiếp quản lý máy chủ.

AWS Lambda cho phép thực thi mã nguồn khi nhận được yêu cầu hoặc sự kiện phù hợp.

Trong bài thực hành này, Lambda được sử dụng để đọc danh sách đăng ký sinh viên từ Amazon S3, kiểm tra dữ liệu và tạo file kết quả JSON.

#### Các dịch vụ AWS được sử dụng

| Dịch vụ | Vai trò |
| --- | --- |
| Amazon S3 | Lưu trữ file CSV đầu vào và JSON đầu ra |
| AWS Lambda | Xử lý và kiểm tra dữ liệu CSV |
| AWS IAM | Cấp quyền cho Lambda truy cập tài nguyên |
| Amazon CloudWatch | Ghi log và giám sát quá trình thực thi |

#### Kiến trúc Serverless Data Processing

```text
ADMIN / Developer
        |
        | Upload CSV
        v
Amazon S3 - Input
lambda-demo/input/registrations.csv
        |
        | Read input object
        v
AWS Lambda
sap-csv-processor-demo
        |
        +-- Validate Student ID
        +-- Detect Duplicates
        +-- Count Valid Records
        +-- Count Invalid Records
        |
        | Write JSON result
        v
Amazon S3 - Output
lambda-demo/processed/registrations-result.json

IAM Execution Role
        |
        +----> Lambda access permissions

AWS Lambda
        |
        +----> Amazon CloudWatch Logs
```

Lambda được thực thi thông qua Test Event trong AWS Lambda Console.

Sau khi được gọi, Function sử dụng quyền từ IAM Execution Role để đọc file CSV trong S3, xử lý dữ liệu và lưu kết quả.

![System Architecture](/images/2-Proposal/student_activity_architectur.drawio.png)

{{% notice note %}}
Serverless CSV Processing là bài thực hành mở rộng của đồ án. Quy trình này hoạt động độc lập với chức năng Import CSV/XLSX hiện tại của FastAPI Backend.
{{% /notice %}}

#### Cấu hình tài nguyên AWS

Các tài nguyên đã sử dụng trong quá trình thực hành:

```text
Region: ap-southeast-1

S3 Bucket:
sap-data-project-2026-huflit01

Lambda Function:
sap-csv-processor-demo

IAM Policy:
SAP-Lambda-S3-Demo-Access

Input Object:
lambda-demo/input/registrations.csv

Output Object:
lambda-demo/processed/registrations-result.json
```

#### Quy trình thực hành

1. Chuẩn bị Amazon S3 Bucket.
2. Tạo file CSV chứa dữ liệu sinh viên giả lập.
3. Upload file vào S3.
4. Tạo IAM Execution Role và cấu hình quyền truy cập.
5. Xây dựng AWS Lambda CSV Processor.
6. Thực thi Lambda thông qua Test Event.
7. Kiểm tra file JSON kết quả trong Amazon S3.
8. Kiểm tra CloudWatch Logs.
9. Đánh giá kết quả xử lý và thời gian thực thi.

#### Nội dung

1. [Tạo Amazon S3 Bucket và chuẩn bị dữ liệu](5.10.1-setup-s3/)
2. [Cấu hình IAM Execution Role](5.10.2-configure-iam/)
3. [Xây dựng AWS Lambda CSV Processor](5.10.3-create-lambda/)
4. [Kiểm thử và giám sát bằng CloudWatch](5.10.4-test-serverless/)

#### Mục tiêu

Sau khi hoàn thành phần này, bạn sẽ có thể:

* Hiểu nguyên lý xử lý dữ liệu theo mô hình Serverless.
* Sử dụng Amazon S3 để lưu trữ dữ liệu đầu vào và đầu ra.
* Cấu hình IAM Role theo nguyên tắc Least Privilege.
* Xây dựng Lambda Function bằng Python và boto3.
* Đọc và xử lý dữ liệu CSV từ Amazon S3.
* Phát hiện bản ghi hợp lệ, trùng lặp và không hợp lệ.
* Lưu kết quả xử lý dưới dạng JSON.
* Kiểm tra kết quả thực thi bằng CloudWatch Logs.
* Phân biệt thực thi bằng Test Event với kiến trúc Event-driven tự động.

#### Kết quả thực tế

Trong đợt thực hành ngày 09/11/2026, Lambda đã xử lý thành công file CSV gồm bốn bản ghi và tạo kết quả:

```json
{
    "total": 4,
    "valid": 2,
    "duplicates": 1,
    "invalid": 1
}
```

File JSON kết quả đã được lưu trong Amazon S3 tại:

```text
lambda-demo/processed/registrations-result.json
```

Lambda trả về statusCode 200 và CloudWatch ghi nhận thời gian thực thi 404.97 ms.

Kết quả này minh họa khả năng xây dựng một quy trình xử lý dữ liệu độc lập trên AWS mà không cần triển khai máy chủ xử lý riêng.

{{% notice note %}}
Trong phạm vi thực hành hiện tại, Lambda được kích hoạt bằng Test Event. Tự động kích hoạt Lambda bằng S3 Event Notification là hướng mở rộng trong tương lai.
{{% /notice %}}
