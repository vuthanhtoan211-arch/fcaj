---
title: "Worklog Tuần 10"
date: 2026-11-09
weight: 10
chapter: false
pre: "<b>1.10.</b>"
---


### Mục tiêu tuần 10:

* Hoàn thiện phiên bản cuối của hệ thống Student Activity Management and Engagement Analytics Platform.
* Kiểm tra lại toàn bộ chức năng trước khi Demo.
* Hoàn thiện nội dung Workshop và Demo Presentation.
* Thực hiện chạy thử kịch bản Demo từ đầu đến cuối.
* Tổng hợp kết quả đạt được của dự án.
* Đánh giá ưu điểm, hạn chế và hướng phát triển trong tương lai.
* Hoàn thiện Self-evaluation.
* Tổng hợp Sharing and Feedback trong quá trình thực tập.
* Hoàn thiện các phần còn lại của báo cáo thực tập.
* Rà soát và dọn dẹp tài nguyên AWS không còn cần thiết.
* Kiểm tra chi phí AWS trước khi kết thúc dự án.


### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Rà soát phiên bản cuối của hệ thống <br> - Kiểm tra toàn bộ chức năng chính: <br>&emsp; + Authentication <br>&emsp; + Activity Management <br>&emsp; + Registration Import <br>&emsp; + Evidence Import <br>&emsp; + Realtime Check-in/Check-out <br>&emsp; + Reconciliation <br>&emsp; + Export Results <br>&emsp; + Analytics Dashboard <br> - Kiểm tra dữ liệu Demo và tài khoản Demo <br> - Sửa các lỗi nhỏ còn lại trước khi trình bày | 09/11/2026 | 09/11/2026 | Tài liệu dự án và Test Report |
| 3 | - Hoàn thiện nội dung Workshop <br> - Chuẩn bị các phần trình bày: <br>&emsp; + Problem Statement <br>&emsp; + Proposed Solution <br>&emsp; + AWS Architecture <br>&emsp; + Data Flow <br>&emsp; + Realtime Attendance <br>&emsp; + Data Processing & Reconciliation <br>&emsp; + Analytics Dashboard <br>&emsp; + Security & Monitoring <br> - Hoàn thiện slide và các hình ảnh minh họa <br> - Kiểm tra nội dung thuyết trình và thời lượng trình bày | 10/11/2026 | 10/11/2026 | Proposal, Architecture Diagram và tài liệu Workshop |
| 4 | - Thực hiện chạy thử Demo toàn bộ hệ thống <br> - Kiểm tra Demo Flow: <br>&emsp; + Login <br>&emsp; + Create Activity <br>&emsp; + Import Registration <br>&emsp; + Realtime Check-in <br>&emsp; + Realtime Check-out <br>&emsp; + Import Evidence <br>&emsp; + Reconciliation <br>&emsp; + Confirm Participation <br>&emsp; + Export Results <br>&emsp; + Analytics Dashboard <br> - Chuẩn bị phương án xử lý nếu Demo gặp lỗi <br> - Ghi nhận các câu hỏi kỹ thuật có thể được đặt ra | 11/11/2026 | 11/11/2026 | Demo Script và User Guide |
| 5 | - Tổng hợp kết quả dự án <br> - Viết Self-evaluation <br> - Đánh giá các kiến thức và kỹ năng đã học được <br> - Tổng hợp Sharing and Feedback <br> - Ghi nhận những khó khăn trong quá trình thực hiện và cách giải quyết <br> - Viết phần hạn chế của hệ thống và Future Development <br> - Hoàn thiện các nội dung còn thiếu trong Internship Report | 12/11/2026 | 12/11/2026 | Internship Report và tài liệu dự án |
| 6 | - Rà soát toàn bộ tài nguyên AWS của dự án <br> - Kiểm tra AWS Billing / Cost Management <br> - Xóa hoặc tắt các tài nguyên thử nghiệm không còn sử dụng <br> - Kiểm tra Lambda, API Gateway, DynamoDB, S3, Cognito, Glue, Athena, QuickSight và CloudWatch <br> - Lưu lại screenshot và tài liệu cần thiết trước khi dọn tài nguyên <br> - Kiểm tra lại source code và tài liệu trên GitHub <br> - Hoàn thiện bản báo cáo và tổng kết quá trình thực tập | 13/11/2026 | 13/11/2026 | AWS Documentation và tài liệu Internship Report |


### Kết quả dự kiến đạt được tuần 10:

* Hoàn thiện phiên bản cuối của **Student Activity Management and Engagement Analytics Platform**.

* Kiểm tra và xác nhận các chức năng chính hoạt động ổn định:

  * User Authentication.
  * Activity Management.
  * Registration Import.
  * Evidence Import.
  * Realtime Check-in.
  * Realtime Check-out.
  * Reconciliation.
  * Participation Confirmation.
  * Export Results.
  * Analytics Dashboard.

* Xác nhận luồng tổng thể của hệ thống:

  **User → AWS Amplify → Amazon Cognito → API Gateway → AWS Lambda → DynamoDB / S3 → AWS Glue → Amazon Athena → Amazon QuickSight**

* Tiếp tục đảm bảo Check-in/Check-out hoạt động dưới dạng **realtime API events**.

* Hoàn thiện nội dung Workshop giới thiệu dự án.

* Hoàn thiện Demo Script theo luồng:

  **Login → Create Activity → Import Registration → Realtime Check-in/Check-out → Import Evidence → Reconciliation → Confirm Participation → Export Results → Analytics Dashboard**

* Thực hiện chạy thử Demo nhiều lần để giảm rủi ro khi trình bày.

* Chuẩn bị phương án xử lý các tình huống Demo không mong muốn như:

  * API không phản hồi.
  * Dữ liệu Demo không đúng.
  * Authentication hết phiên.
  * File import không hợp lệ.
  * Dashboard chưa cập nhật dữ liệu.

* Tổng hợp các kết quả nổi bật của dự án:

  * Xây dựng được hệ thống Web trên AWS.
  * Xây dựng được Authentication và Authorization.
  * Xử lý Registration và Evidence từ file.
  * Ghi nhận Attendance realtime.
  * Thực hiện Reconciliation tự động.
  * Xuất kết quả CSV/XLSX.
  * Xây dựng Analytics Dashboard.
  * Thiết lập Monitoring và Logging.

* Hoàn thiện phần Self-evaluation với các nội dung:

  * Kiến thức AWS đã học được.
  * Kỹ năng phát triển hệ thống Cloud.
  * Kỹ năng thiết kế Architecture.
  * Kỹ năng Backend và Frontend.
  * Kỹ năng xử lý và phân tích dữ liệu.
  * Kỹ năng kiểm thử và xử lý lỗi.
  * Kỹ năng viết tài liệu và trình bày.

* Tổng hợp Sharing and Feedback trong quá trình thực tập.

* Ghi nhận các hạn chế của phiên bản MVP như:

  * Chưa tích hợp trực tiếp với hệ thống University Portal.
  * QR Scanner hiện được mô phỏng hoặc tích hợp ở mức MVP.
  * Dữ liệu phân tích còn sử dụng bộ dữ liệu thử nghiệm.
  * Chưa kiểm thử ở quy mô người dùng lớn.
  * Một số quy trình vẫn cần Ban tổ chức xác nhận thủ công.

* Đề xuất các hướng phát triển trong tương lai:

  * Tích hợp trực tiếp với University Portal.
  * Tích hợp thiết bị QR Scanner thực tế.
  * Phát triển ứng dụng Mobile.
  * Bổ sung Notification.
  * Mở rộng Dashboard và các chỉ số phân tích.
  * Tự động hóa nhiều bước Reconciliation hơn.
  * Mở rộng hệ thống cho nhiều đơn vị và nhiều loại hoạt động.

* Hoàn thiện các phần chính của Internship Report.

* Rà soát AWS Billing / Cost Management.

* Xóa hoặc tắt các tài nguyên thử nghiệm không còn sử dụng nhằm tránh tiếp tục phát sinh chi phí.

* Lưu lại đầy đủ:

  * Source code.
  * Architecture Diagram.
  * API Documentation.
  * User Guide.
  * Test Report.
  * Screenshots.
  * Workshop materials.
  * Demo materials.

* Hoàn thành quá trình thực tập và tổng kết những kiến thức, kỹ năng và kinh nghiệm đạt được trong quá trình thực hiện dự án.