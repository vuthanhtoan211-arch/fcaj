---
title: "Xử lý dữ liệu Serverless với Amazon S3 và AWS Lambda"
date: 2026-11-09
weight: 10
chapter: false
pre: "<b>5.10.</b>"
---

# Xử lý dữ liệu Serverless với Amazon S3 và AWS Lambda

Phần này ghi lại **bài thực hành xử lý CSV độc lập đã triển khai và kiểm thử thực tế** trong đồ án Student Activity Management & Engagement Analytics Platform. Đây không phải Backend FastAPI chính và không phải một Data Pipeline Production đã cấu hình tự động kích hoạt.

## 1. Mục tiêu

- Lưu dữ liệu đăng ký sinh viên giả lập trên Amazon S3.
- Cấu hình AWS IAM Execution Role cho Lambda.
- Xây dựng hàm Lambda đọc và kiểm tra CSV.
- Phân loại bản ghi hợp lệ, trùng lặp và không hợp lệ.
- Ghi kết quả xử lý thành file JSON trên Amazon S3.
- Kiểm tra log và thông tin thực thi bằng Amazon CloudWatch.
- Lưu lại minh chứng thực tế cho Workshop FCAJ.

## 2. Dịch vụ AWS sử dụng

| Dịch vụ | Vai trò trong bài thực hành |
| --- | --- |
| Amazon S3 | Lưu file CSV đầu vào và JSON đầu ra |
| AWS Lambda | Xử lý, kiểm tra và phân loại dữ liệu đăng ký |
| AWS IAM | Cấp quyền thực thi và truy cập tài nguyên |
| Amazon CloudWatch | Theo dõi log và thông tin thực thi Lambda |

**AWS Region:** Asia Pacific (Singapore), `ap-southeast-1`.

## 3. Kiến trúc thực tế của đồ án

Sơ đồ dưới đây là **sơ đồ kiến trúc thực tế của đồ án**, phân biệt ứng dụng React/Vite–FastAPI–SQLite, phần thử nghiệm lưu trữ DynamoDB và bài kiểm thử xử lý CSV bằng S3/Lambda. Lambda được gọi bằng **Test Event trong AWS Lambda Console**, chưa cấu hình tự động kích hoạt bằng S3 Event Notification.

![Sơ đồ kiến trúc thực tế Student Activity Management Platform](/fcaj/images/2-Proposal/student_activity_architectur.drawio.png)

## 4. Tài nguyên AWS đã thực hành

| Tài nguyên | Tên đã sử dụng |
| --- | --- |
| S3 bucket | `sap-data-project-2026-huflit01` |
| Lambda function | `sap-csv-processor-demo` |
| IAM policy | `SAP-Lambda-S3-Demo-Access` |
| File đầu vào | `lambda-demo/input/registrations.csv` |
| File kết quả | `lambda-demo/processed/registrations-result.json` |
| CloudWatch log group | `/aws/lambda/sap-csv-processor-demo` |

Các tên trên được ghi nhận trong thời gian thực hành. Sau phần Clean-up 5.11, tài nguyên thực tế có thể đã bị xóa để tránh phát sinh chi phí.

## 5. Các bước thực hành và ảnh minh chứng thật

### Bước 1 – Chuẩn bị S3 Bucket và dữ liệu CSV

File CSV mẫu gồm bốn bản ghi giả lập, có một bản ghi trùng và một bản ghi không hợp lệ.

![Ảnh thực tế file CSV trên S3](/fcaj/images/5-Workshop/5.10-Serverless-Processing/s3-input-object.png)

### Bước 2 – Cấu hình quyền AWS IAM

IAM Execution Role được cấp các quyền cần thiết để Lambda thao tác với S3 và ghi nhật ký lên CloudWatch.

![Ảnh thực tế quyền IAM của Lambda](/fcaj/images/5-Workshop/5.10-Serverless-Processing/iam-role-permissions.png)

### Bước 3 – Tạo và kiểm thử AWS Lambda

Lambda được gọi thủ công bằng **Test Event** trên AWS Lambda Console. Kết quả kiểm thử ghi nhận quá trình thực thi thành công.

![Ảnh thực tế kết quả Lambda Test thành công](/fcaj/images/5-Workshop/5.10-Serverless-Processing/lambda-test-success.png)

### Bước 4 – Kiểm tra kết quả JSON trên S3

Sau khi xử lý, Lambda lưu kết quả tổng hợp ở dạng JSON tại vị trí Output đã cấu hình.

![Ảnh thực tế file kết quả JSON trên Amazon S3](/fcaj/images/5-Workshop/5.10-Serverless-Processing/s3-processed-result.png)

### Bước 5 – Kiểm tra Amazon CloudWatch

CloudWatch được dùng để xem log thực thi, thời gian xử lý và hỗ trợ xác định nguyên nhân lỗi.

![Ảnh thực tế báo cáo thực thi CloudWatch](/fcaj/images/5-Workshop/5.10-Serverless-Processing/cloudwatch-execution-report.png)

## 6. Kết quả kiểm thử đã ghi nhận

| Chỉ số | Kết quả |
| --- | ---: |
| Tổng bản ghi CSV | 4 |
| Bản ghi hợp lệ | 2 |
| Bản ghi trùng | 1 |
| Bản ghi không hợp lệ | 1 |
| Lambda Status Code | 200 |

Các chỉ số này chỉ phản ánh một bộ dữ liệu thử nghiệm bốn bản ghi, không phải kiểm thử tải Production.

## 7. Hướng dẫn chi tiết trong Workshop

1. [5.10.1 – Chuẩn bị Amazon S3 và CSV](5.10.1-setup-s3/)
2. [5.10.2 – Cấu hình IAM Execution Role](5.10.2-configure-iam/)
3. [5.10.3 – Xây dựng Lambda CSV Processor](5.10.3-create-lambda/)
4. [5.10.4 – Kiểm thử Serverless Processing](5.10.4-test-serverless/)

## 8. Kết luận

Bài thực hành đã minh họa cách Amazon S3, AWS Lambda, IAM và CloudWatch phối hợp xử lý một file CSV. Các chức năng chính như Registration Import, Attendance, Reconciliation và Analytics trong Web Application vẫn được xử lý bởi FastAPI ở phạm vi Demo đã triển khai.
