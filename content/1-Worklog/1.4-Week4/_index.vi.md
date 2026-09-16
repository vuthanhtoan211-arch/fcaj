---
title: "Worklog Tuần 4"
date: 2026-09-28
weight: 4
chapter: false
pre: "<b>1.4.</b>"
---


### Mục tiêu tuần 4:

* Bắt đầu triển khai các thành phần backend cốt lõi của hệ thống trên AWS.
* Thiết lập quyền truy cập và các chính sách bảo mật theo nguyên tắc Least Privilege.
* Triển khai cơ sở dữ liệu Amazon DynamoDB cho dữ liệu nghiệp vụ.
* Triển khai Amazon S3 để lưu trữ dữ liệu đầu vào, dữ liệu đã xử lý và file export.
* Triển khai AWS Lambda cho các chức năng xử lý nghiệp vụ.
* Triển khai Amazon API Gateway để cung cấp REST API cho hệ thống.
* Kết nối API realtime Check-in/Check-out với DynamoDB.
* Thiết lập Amazon CloudWatch để theo dõi log và lỗi của hệ thống.
* Thực hiện kiểm thử luồng backend trên môi trường AWS.


### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Chuẩn bị môi trường AWS cho dự án <br> - Kiểm tra Region triển khai và cấu hình AWS CLI <br> - Tìm hiểu nguyên tắc **Least Privilege** <br> - Tạo IAM Role/Policy cần thiết cho Lambda, API Gateway, DynamoDB, S3 và CloudWatch <br> - Kiểm tra quyền truy cập giữa các dịch vụ <br> - Theo dõi và kiểm soát tài nguyên nhằm hạn chế phát sinh chi phí không cần thiết | 28/09/2026 | 28/09/2026 | <https://docs.aws.amazon.com/iam/> |
| 3 | - Tạo các tài nguyên lưu trữ dữ liệu trên AWS <br>&emsp; + Amazon DynamoDB cho dữ liệu nghiệp vụ <br>&emsp; + Amazon S3 Raw Data Bucket <br>&emsp; + Amazon S3 Processed/Export Bucket <br> - Thiết kế key và thuộc tính chính cho các nhóm dữ liệu <br>&emsp; + Activities <br>&emsp; + Students <br>&emsp; + Registrations <br>&emsp; + Attendance <br>&emsp; + Participation Status <br> - Thử nghiệm upload dữ liệu Registration và Evidence lên S3 | 29/09/2026 | 29/09/2026 | <https://docs.aws.amazon.com/dynamodb/> <br> <https://docs.aws.amazon.com/s3/> |
| 4 | - Triển khai AWS Lambda cho các chức năng backend <br>&emsp; + Xử lý dữ liệu Registration <br>&emsp; + Xử lý Evidence <br>&emsp; + Xử lý Check-in/Check-out realtime <br>&emsp; + Reconciliation Logic <br> - Triển khai Amazon API Gateway <br> - Tạo các REST API endpoint cơ bản <br>&emsp; + Activity API <br>&emsp; + Registration API <br>&emsp; + Attendance API <br>&emsp; + Reconciliation API <br> - Kết nối API Gateway với Lambda | 30/09/2026 | 30/09/2026 | <https://docs.aws.amazon.com/lambda/> <br> <https://docs.aws.amazon.com/apigateway/> |
| 5 | - Kết nối AWS Lambda với Amazon DynamoDB và Amazon S3 <br> - Triển khai luồng Check-in/Check-out realtime <br>&emsp; + Nhận MSSV và Activity ID từ API <br>&emsp; + Kiểm tra Registration <br>&emsp; + Ghi nhận CHECK_IN/CHECK_OUT vào DynamoDB <br>&emsp; + Trả về trạng thái xử lý cho người dùng <br> - Xử lý các trường hợp lỗi như sinh viên chưa đăng ký, dữ liệu sai hoặc sự kiện trùng lặp <br> - Cấu hình CloudWatch Logs cho Lambda và API Gateway | 01/10/2026 | 01/10/2026 | <https://docs.aws.amazon.com/cloudwatch/> |
| 6 | - Thực hiện kiểm thử end-to-end cho backend trên AWS <br>&emsp; + Upload Registration <br>&emsp; + Upload Evidence <br>&emsp; + Realtime Check-in <br>&emsp; + Realtime Check-out <br>&emsp; + Reconciliation <br> - So sánh kết quả AWS với kết quả đã kiểm thử ở môi trường local <br> - Kiểm tra dữ liệu được lưu trong DynamoDB <br> - Kiểm tra log và lỗi trên CloudWatch <br> - Kiểm tra file processed/export trên S3 <br> - Ghi nhận các lỗi và điều chỉnh cấu hình hệ thống | 02/10/2026 | 02/10/2026 | Tài liệu Proposal và AWS Documentation |


### Kết quả dự kiến đạt được tuần 4:

* Thiết lập được môi trường AWS cơ bản cho dự án.

* Tạo và cấu hình IAM Role/Policy cho các dịch vụ theo nguyên tắc **Least Privilege**.

* Triển khai được Amazon DynamoDB để lưu trữ các dữ liệu nghiệp vụ chính:

  * Activities
  * Students
  * Registrations
  * Attendance
  * Participation Status

* Triển khai được hệ thống lưu trữ trên Amazon S3 gồm:

  * Raw Data Bucket.
  * Processed Data Bucket.
  * Export Data.

* Upload và kiểm tra được dữ liệu Registration và Evidence trên Amazon S3.

* Triển khai được các AWS Lambda function phục vụ:

  * Xử lý Registration.
  * Xử lý Evidence.
  * Realtime Check-in.
  * Realtime Check-out.
  * Reconciliation.

* Triển khai được Amazon API Gateway và kết nối với AWS Lambda.

* Xây dựng được các REST API endpoint cơ bản cho hệ thống.

* Thực hiện được luồng Check-in/Check-out realtime trên AWS:

  * QR Scanner gửi request tới API.
  * API Gateway nhận request.
  * AWS Lambda xử lý business logic.
  * Lambda kiểm tra Registration trong DynamoDB.
  * Attendance được ghi trực tiếp vào DynamoDB.
  * API trả về kết quả ngay sau khi xử lý.

* Đảm bảo dữ liệu Check-in/Check-out tiếp tục được xử lý dưới dạng **realtime API event**, không chuyển sang hình thức import Excel/CSV.

* Kết nối được Lambda với S3 để xử lý dữ liệu Registration và Evidence.

* Bước đầu triển khai được logic đối soát trên AWS giữa:

  * Registration
  * Check-in
  * Check-out
  * Evidence

* Cấu hình Amazon CloudWatch để:

  * Theo dõi Lambda Logs.
  * Theo dõi API Gateway Logs.
  * Kiểm tra lỗi trong quá trình xử lý.
  * Hỗ trợ debug hệ thống.

* Hoàn thành kiểm thử end-to-end cho phần backend trên AWS.

* Xác nhận luồng xử lý từ API Gateway → Lambda → DynamoDB hoạt động đúng với thiết kế ban đầu.

* Hoàn thiện backend cốt lõi để chuẩn bị cho việc xây dựng giao diện Web, Authentication và tích hợp Frontend trong tuần tiếp theo.