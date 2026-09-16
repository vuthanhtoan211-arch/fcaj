---
title: "Worklog Tuần 9"
date: 2026-11-02
weight: 9
chapter: false
pre: "<b>1.9.</b>"
---


### Mục tiêu tuần 9:

* Hoàn thiện tài liệu kỹ thuật của hệ thống.
* Cập nhật và hoàn thiện sơ đồ kiến trúc AWS sau quá trình triển khai thực tế.
* Hoàn thiện tài liệu mô tả các API của hệ thống.
* Xây dựng tài liệu hướng dẫn sử dụng cho Ban tổ chức và Admin.
* Tổng hợp kết quả kiểm thử hệ thống.
* Ghi nhận các lỗi đã phát hiện và phương án xử lý.
* Chuẩn bị hình ảnh minh họa và kết quả thực tế phục vụ báo cáo.
* Chuẩn bị kịch bản Demo hệ thống.
* Chuẩn bị nội dung Workshop giới thiệu kiến trúc và cách vận hành hệ thống.
* Rà soát hệ thống trước khi chuyển sang giai đoạn hoàn thiện báo cáo.


### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Rà soát lại toàn bộ kiến trúc của **Student Activity Management and Engagement Analytics Platform** <br> - Cập nhật sơ đồ AWS Architecture theo hệ thống thực tế <br> - Kiểm tra các luồng chính: <br>&emsp; + Authentication <br>&emsp; + API & Business Logic <br>&emsp; + Realtime Attendance <br>&emsp; + File Processing <br>&emsp; + Reconciliation <br>&emsp; + Analytics <br> - Bổ sung mô tả vai trò của từng dịch vụ AWS trong kiến trúc | 02/11/2026 | 02/11/2026 | Tài liệu Proposal và AWS Architecture |
| 3 | - Hoàn thiện API Documentation <br> - Mô tả các nhóm API chính: <br>&emsp; + Authentication-related requests <br>&emsp; + Activity Management API <br>&emsp; + Registration API <br>&emsp; + Attendance API <br>&emsp; + Reconciliation API <br>&emsp; + Export API <br> - Ghi nhận Method, Endpoint, Request, Response và Error Cases <br> - Bổ sung ví dụ request/response cho các API quan trọng <br> - Kiểm tra sự thống nhất giữa tài liệu API và hệ thống thực tế | 03/11/2026 | 03/11/2026 | API Documentation và source code của dự án |
| 4 | - Xây dựng User Guide cho Youth Union Staff / Organizer và Admin <br> - Hướng dẫn các thao tác chính: <br>&emsp; + Đăng nhập hệ thống <br>&emsp; + Tạo và quản lý hoạt động <br>&emsp; + Import danh sách Registration <br>&emsp; + Import Evidence <br>&emsp; + Thực hiện Check-in/Check-out realtime <br>&emsp; + Kiểm tra Reconciliation <br>&emsp; + Xác nhận Participation Result <br>&emsp; + Export kết quả <br>&emsp; + Xem Analytics Dashboard <br> - Chụp screenshot các chức năng chính để minh họa | 04/11/2026 | 04/11/2026 | Hệ thống Web Application và tài liệu dự án |
| 5 | - Tổng hợp Test Report của hệ thống <br> - Ghi nhận kết quả kiểm thử: <br>&emsp; + Functional Testing <br>&emsp; + Authentication & Authorization Testing <br>&emsp; + Realtime Check-in/Check-out Testing <br>&emsp; + Data Validation Testing <br>&emsp; + Integration Testing <br>&emsp; + User Acceptance Testing <br> - Tổng hợp các lỗi đã phát hiện, nguyên nhân và cách xử lý <br> - Ghi nhận các hạn chế còn tồn tại của phiên bản MVP | 05/11/2026 | 05/11/2026 | Test Cases, CloudWatch Logs và Test Report |
| 6 | - Chuẩn bị kịch bản Demo hệ thống <br> - Xây dựng Demo Flow từ đầu đến cuối <br>&emsp; + Login <br>&emsp; + Create Activity <br>&emsp; + Import Registration <br>&emsp; + Realtime Check-in/Check-out <br>&emsp; + Import Evidence <br>&emsp; + Reconciliation <br>&emsp; + Confirm Participation <br>&emsp; + Export Results <br>&emsp; + View Analytics Dashboard <br> - Chuẩn bị nội dung Workshop giới thiệu kiến trúc AWS và các dịch vụ đã sử dụng <br> - Kiểm tra lại hệ thống trước khi thực hiện Demo | 06/11/2026 | 06/11/2026 | Tài liệu dự án và AWS Documentation |


### Kết quả dự kiến đạt được tuần 9:

* Hoàn thiện tài liệu kiến trúc cho dự án **Student Activity Management and Engagement Analytics Platform**.

* Cập nhật sơ đồ kiến trúc AWS để phản ánh đúng hệ thống đã triển khai.

* Mô tả rõ vai trò của các dịch vụ:

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

* Hoàn thiện tài liệu mô tả các luồng xử lý chính:

  * Authentication Flow.
  * Activity Management Flow.
  * Registration Import Flow.
  * Evidence Processing Flow.
  * Realtime Check-in/Check-out Flow.
  * Reconciliation Flow.
  * Export Flow.
  * Analytics Flow.

* Hoàn thiện API Documentation cho các nhóm API chính.

* Với mỗi API, tài liệu thể hiện được:

  * HTTP Method.
  * Endpoint.
  * Authentication requirement.
  * Request parameters/body.
  * Response structure.
  * Error response.
  * Ví dụ sử dụng.

* Hoàn thiện User Guide dành cho:

  * Youth Union Staff / Organizer.
  * Admin / Management.

* User Guide hướng dẫn đầy đủ các thao tác:

  * Login.
  * Activity Management.
  * Registration Import.
  * Evidence Import.
  * Realtime Attendance.
  * Reconciliation.
  * Participation Confirmation.
  * Export Results.
  * Analytics Dashboard.

* Thu thập được các screenshot quan trọng của hệ thống để sử dụng trong:

  * Internship Report.
  * Proposal.
  * Workshop.
  * Demo Presentation.

* Hoàn thiện Test Report của hệ thống.

* Tổng hợp được kết quả của:

  * Functional Testing.
  * Authentication Testing.
  * Authorization Testing.
  * Data Validation Testing.
  * Realtime Attendance Testing.
  * Integration Testing.
  * UAT.

* Xây dựng được bảng tổng hợp:

  * Test Case.
  * Expected Result.
  * Actual Result.
  * Status.
  * Issues.
  * Resolution.

* Ghi nhận được các hạn chế của phiên bản MVP và các hướng phát triển trong tương lai.

* Hoàn thiện kịch bản Demo theo luồng:

  **Login → Create Activity → Import Registration → Realtime Check-in/Check-out → Import Evidence → Reconciliation → Confirm Participation → Export Results → Analytics Dashboard**

* Chuẩn bị nội dung Workshop nhằm trình bày:

  * Bài toán thực tế.
  * Kiến trúc hệ thống.
  * Các dịch vụ AWS đã sử dụng.
  * Luồng dữ liệu.
  * Realtime Attendance.
  * Data Processing.
  * Analytics Dashboard.
  * Security & Monitoring.
  * Kết quả đạt được.

* Chuẩn bị đầy đủ tài liệu và hệ thống để chuyển sang giai đoạn hoàn thiện báo cáo, Workshop và Demo cuối kỳ.