---
title: "Worklog Tuần 11"
date: 2026-11-16
weight: 11
chapter: false
pre: "<b>1.11.</b>"
---


### Mục tiêu tuần 11:

* Thực hiện Demo và trình bày kết quả của dự án.
* Trình bày kiến trúc AWS và các chức năng chính của hệ thống.
* Ghi nhận phản hồi từ người hướng dẫn và các thành viên tham gia.
* Phân loại các góp ý theo mức độ ưu tiên.
* Chỉnh sửa những vấn đề cuối cùng của hệ thống dựa trên feedback.
* Hoàn thiện tài liệu kỹ thuật và báo cáo thực tập.
* Chuẩn hóa source code và cấu trúc repository.
* Hoàn thiện tài liệu hướng dẫn triển khai và vận hành hệ thống.
* Lưu trữ các minh chứng quan trọng của dự án.
* Chuẩn bị bàn giao phiên bản cuối của hệ thống.


### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Kiểm tra hệ thống lần cuối trước Demo <br> - Kiểm tra tài khoản và dữ liệu Demo <br> - Kiểm tra Web Application, API và Analytics Dashboard <br> - Kiểm tra luồng Realtime Check-in/Check-out <br> - Kiểm tra file Registration và Evidence dùng cho Demo <br> - Kiểm tra các screenshot, Architecture Diagram và tài liệu trình bày | 16/11/2026 | 16/11/2026 | Demo Script, User Guide và Test Report |
| 3 | - Thực hiện Demo dự án **Student Activity Management and Engagement Analytics Platform** <br> - Trình bày bài toán và giải pháp <br> - Trình bày AWS Architecture <br> - Demo các chức năng chính: <br>&emsp; + Authentication <br>&emsp; + Activity Management <br>&emsp; + Registration Import <br>&emsp; + Realtime Check-in/Check-out <br>&emsp; + Evidence Import <br>&emsp; + Reconciliation <br>&emsp; + Export Results <br>&emsp; + Analytics Dashboard <br> - Trả lời các câu hỏi liên quan đến kiến trúc và cách vận hành hệ thống | 17/11/2026 | 17/11/2026 | Workshop materials và Demo Presentation |
| 4 | - Tổng hợp feedback sau buổi Demo <br> - Phân loại feedback theo các nhóm: <br>&emsp; + Functionality <br>&emsp; + UI/UX <br>&emsp; + Data Processing <br>&emsp; + Security <br>&emsp; + Analytics <br>&emsp; + Documentation <br> - Xác định các vấn đề cần sửa ngay và các đề xuất dành cho Future Development <br> - Cập nhật danh sách Issues và kế hoạch xử lý | 18/11/2026 | 18/11/2026 | Feedback từ người hướng dẫn và người tham gia Demo |
| 5 | - Chỉnh sửa phiên bản cuối dựa trên feedback <br> - Sửa các lỗi nhỏ còn lại của Frontend và Backend <br> - Điều chỉnh nội dung hiển thị trên Dashboard nếu cần <br> - Cập nhật validation và thông báo lỗi <br> - Thực hiện Regression Testing sau khi chỉnh sửa <br> - Cập nhật Architecture Diagram, User Guide, API Documentation và Test Report nếu có thay đổi | 19/11/2026 | 19/11/2026 | Feedback, source code và tài liệu dự án |
| 6 | - Hoàn thiện và chuẩn hóa source code trên GitHub <br> - Kiểm tra README và cấu trúc repository <br> - Hoàn thiện hướng dẫn cài đặt, cấu hình và chạy hệ thống <br> - Tổng hợp các tài liệu bàn giao <br> - Lưu trữ screenshot và kết quả Demo <br> - Kiểm tra lại tài nguyên AWS và Billing <br> - Chuẩn bị phiên bản cuối để bàn giao và hoàn thiện Internship Report | 20/11/2026 | 20/11/2026 | GitHub Repository, AWS Documentation và Internship Report |


### Kết quả dự kiến đạt được tuần 11:

* Thực hiện thành công buổi Demo của dự án:

  **Student Activity Management and Engagement Analytics Platform**

* Trình bày được bài toán thực tế mà hệ thống giải quyết.

* Trình bày được kiến trúc tổng thể của hệ thống với các dịch vụ:

  * AWS Amplify.
  * Amazon Cognito.
  * Amazon API Gateway.
  * AWS Lambda.
  * Amazon DynamoDB.
  * Amazon S3.
  * AWS Glue.
  * Amazon Athena.
  * Amazon QuickSight.
  * AWS IAM.
  * Amazon CloudWatch.

* Demo được luồng nghiệp vụ chính:

  **Login → Create Activity → Import Registration → Realtime Check-in/Check-out → Import Evidence → Reconciliation → Confirm Participation → Export Results → Analytics Dashboard**

* Giải thích được cơ chế Check-in/Check-out realtime:

  * Ban tổ chức quét QR trên thẻ sinh viên.
  * Frontend gửi request đến API.
  * API Gateway chuyển request đến Lambda.
  * Lambda kiểm tra Registration.
  * Attendance được ghi nhận trong DynamoDB.
  * Kết quả được trả về ngay cho người dùng.

* Tiếp tục đảm bảo Check-in/Check-out không được xử lý theo hình thức import file Excel/CSV.

* Ghi nhận được feedback từ người hướng dẫn và người tham gia Demo.

* Phân loại feedback theo các nhóm:

  * Functionality.
  * UI/UX.
  * Data Processing.
  * Security.
  * Analytics.
  * Documentation.

* Xác định được:

  * Các vấn đề cần sửa ngay.
  * Các đề xuất có thể phát triển trong tương lai.
  * Các hạn chế có thể chấp nhận trong phiên bản MVP.

* Hoàn thiện các chỉnh sửa cuối của hệ thống dựa trên feedback.

* Thực hiện Regression Testing để xác nhận các chức năng chính vẫn hoạt động đúng sau khi chỉnh sửa.

* Cập nhật phiên bản cuối của:

  * AWS Architecture Diagram.
  * API Documentation.
  * User Guide.
  * Test Report.
  * Demo Script.
  * Workshop materials.

* Chuẩn hóa GitHub Repository với cấu trúc source code rõ ràng.

* Hoàn thiện README với các nội dung:

  * Giới thiệu dự án.
  * Kiến trúc hệ thống.
  * Công nghệ và dịch vụ AWS sử dụng.
  * Cấu trúc source code.
  * Hướng dẫn cài đặt.
  * Hướng dẫn cấu hình.
  * Hướng dẫn chạy hệ thống.
  * Các chức năng chính.

* Chuẩn bị đầy đủ bộ tài liệu bàn giao:

  * Source code.
  * Architecture Diagram.
  * API Documentation.
  * User Guide.
  * Test Report.
  * Demo materials.
  * Workshop materials.
  * Screenshots.
  * Project results.

* Rà soát lại tài nguyên AWS và AWS Billing để đảm bảo không còn tài nguyên thử nghiệm không cần thiết.

* Hoàn thiện phiên bản hệ thống cuối cùng để phục vụ việc bàn giao và hoàn thiện báo cáo thực tập.