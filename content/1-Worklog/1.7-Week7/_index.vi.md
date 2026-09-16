---
title: "Worklog Tuần 7"
date: 2026-10-19
weight: 7
chapter: false
pre: "<b>1.7.</b>"
---


### Mục tiêu tuần 7:

* Xây dựng Dashboard phân tích dữ liệu tham gia hoạt động sinh viên.
* Kết nối Amazon QuickSight với nguồn dữ liệu Analytics.
* Xây dựng các KPI phục vụ Ban tổ chức và Admin.
* Trực quan hóa tỷ lệ đăng ký, tham gia, vắng mặt và các trường hợp cần kiểm tra.
* Phân tích dữ liệu theo hoạt động, lớp và trạng thái tham gia.
* Hoàn thiện Amazon CloudWatch Monitoring cho Backend.
* Cấu hình CloudWatch Alarm cho một số lỗi quan trọng.
* Kiểm thử toàn bộ hệ thống từ Frontend đến Analytics Dashboard.
* Kiểm tra bảo mật và quyền truy cập giữa các dịch vụ AWS.
* Theo dõi tài nguyên và chi phí AWS trong quá trình thử nghiệm.


### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Kiểm tra Analytics Dataset đã chuẩn bị trên Amazon S3 <br> - Kiểm tra schema trong AWS Glue Data Catalog <br> - Hoàn thiện các truy vấn Amazon Athena phục vụ Dashboard <br>&emsp; + Tổng số sinh viên đăng ký <br>&emsp; + Tổng số sinh viên tham gia <br>&emsp; + Tổng số sinh viên vắng mặt <br>&emsp; + Participation Rate <br>&emsp; + Số trường hợp NEEDS_REVIEW <br> - Kiểm tra tính chính xác của dữ liệu trước khi trực quan hóa | 19/10/2026 | 19/10/2026 | <https://docs.aws.amazon.com/athena/> |
| 3 | - Tìm hiểu Amazon QuickSight <br> - Kết nối QuickSight với nguồn dữ liệu Amazon Athena <br> - Tạo Dataset phục vụ trực quan hóa <br> - Xây dựng các KPI Card cơ bản <br>&emsp; + Total Registered Students <br>&emsp; + Total Participants <br>&emsp; + Participation Rate <br>&emsp; + Total Absent Students <br>&emsp; + Needs Review Cases <br> - Kiểm tra dữ liệu hiển thị trên Dashboard | 20/10/2026 | 20/10/2026 | <https://docs.aws.amazon.com/quicksight/> |
| 4 | - Hoàn thiện Analytics Dashboard <br> - Xây dựng các biểu đồ: <br>&emsp; + Participation Status Distribution <br>&emsp; + Participation Rate by Activity <br>&emsp; + Registration vs Participation <br>&emsp; + Student Participation by Class <br>&emsp; + Reconciliation Status Statistics <br> - Thêm bộ lọc theo Activity, Class và Participation Status <br> - Kiểm tra khả năng sử dụng Dashboard cho Ban tổ chức/Admin | 21/10/2026 | 21/10/2026 | <https://docs.aws.amazon.com/quicksight/> |
| 5 | - Hoàn thiện Monitoring & Logging bằng Amazon CloudWatch <br> - Kiểm tra Lambda Logs và API Gateway Logs <br> - Theo dõi các chỉ số: <br>&emsp; + Lambda Invocations <br>&emsp; + Lambda Errors <br>&emsp; + Lambda Duration <br>&emsp; + API Gateway Requests <br>&emsp; + HTTP 4XX / 5XX Errors <br> - Cấu hình CloudWatch Alarm cho một số lỗi quan trọng <br> - Kiểm tra IAM Role và Policy theo nguyên tắc Least Privilege | 22/10/2026 | 22/10/2026 | <https://docs.aws.amazon.com/cloudwatch/> <br> <https://docs.aws.amazon.com/iam/> |
| 6 | - Thực hiện kiểm thử tích hợp toàn bộ hệ thống <br>&emsp; + User Login <br>&emsp; + Activity Management <br>&emsp; + Registration Import <br>&emsp; + Evidence Import <br>&emsp; + Realtime Check-in <br>&emsp; + Realtime Check-out <br>&emsp; + Reconciliation <br>&emsp; + Export Results <br>&emsp; + Analytics Dashboard <br> - Kiểm tra log và xử lý các lỗi còn lại <br> - Kiểm tra quyền truy cập giữa các thành phần <br> - Kiểm tra tài nguyên AWS đang sử dụng và hạn chế các tài nguyên không cần thiết <br> - Ghi nhận kết quả kiểm thử để chuẩn bị hoàn thiện hệ thống | 23/10/2026 | 23/10/2026 | Tài liệu Proposal và AWS Documentation |


### Kết quả dự kiến đạt được tuần 7:

* Hoàn thiện các truy vấn Amazon Athena phục vụ phân tích dữ liệu.

* Xây dựng được các chỉ số KPI chính cho hệ thống:

  * Total Registered Students.
  * Total Participants.
  * Participation Rate.
  * Total Absent Students.
  * Total Needs Review Cases.

* Kết nối được:

  **Amazon S3 → AWS Glue Data Catalog → Amazon Athena → Amazon QuickSight**

* Xây dựng được Analytics Dashboard trên Amazon QuickSight.

* Dashboard hiển thị được các thông tin chính như:

  * Tổng số sinh viên đăng ký.
  * Tổng số sinh viên tham gia.
  * Tỷ lệ tham gia hoạt động.
  * Tổng số sinh viên vắng mặt.
  * Số trường hợp cần kiểm tra.
  * Phân bố trạng thái tham gia.

* Xây dựng được biểu đồ so sánh:

  * Registration và Participation.
  * Participation Rate giữa các hoạt động.
  * Participation Status Distribution.
  * Student Participation theo lớp.
  * Reconciliation Status.

* Thiết lập được các bộ lọc Dashboard:

  * Activity.
  * Class.
  * Participation Status.

* Giúp Ban tổ chức và Admin có thể theo dõi dữ liệu tham gia hoạt động trực quan hơn thay vì chỉ xem dữ liệu thô.

* Hoàn thiện hệ thống Monitoring bằng Amazon CloudWatch.

* Theo dõi được các chỉ số chính của AWS Lambda:

  * Invocations.
  * Errors.
  * Duration.

* Theo dõi được các chỉ số của Amazon API Gateway:

  * Request Count.
  * HTTP 4XX Errors.
  * HTTP 5XX Errors.

* Cấu hình bước đầu CloudWatch Alarm để cảnh báo khi có lỗi đáng chú ý trong Backend.

* Kiểm tra và điều chỉnh IAM Role/Policy theo nguyên tắc **Least Privilege**.

* Hoàn thành kiểm thử tích hợp toàn bộ luồng:

  **User → Amplify → Cognito → API Gateway → Lambda → DynamoDB / S3 → Glue → Athena → QuickSight**

* Kiểm thử thành công các chức năng chính:

  * Authentication.
  * Activity Management.
  * Registration Import.
  * Evidence Import.
  * Realtime Check-in.
  * Realtime Check-out.
  * Reconciliation.
  * Export Results.
  * Analytics Dashboard.

* Xác nhận Check-in/Check-out tiếp tục hoạt động dưới dạng **realtime API events**.

* Kiểm tra log và xác định được các lỗi còn tồn tại để tiếp tục chỉnh sửa.

* Kiểm tra các tài nguyên AWS đang sử dụng nhằm hạn chế những tài nguyên không cần thiết và giảm nguy cơ phát sinh chi phí ngoài dự kiến.

* Hoàn thiện phần Analytics và Monitoring để chuẩn bị cho giai đoạn tối ưu, kiểm thử cuối cùng và hoàn thiện tài liệu dự án.