---
title: "Worklog Tuần 8"
date: 2026-10-26
weight: 8
chapter: false
pre: "<b>1.8.</b>"
---


### Mục tiêu tuần 8:

* Kiểm thử toàn bộ hệ thống sau quá trình tích hợp.
* Phát hiện và sửa các lỗi còn tồn tại ở Frontend và Backend.
* Kiểm thử Authentication và Authorization.
* Kiểm tra tính chính xác của các quy tắc nghiệp vụ.
* Kiểm thử hiệu năng cơ bản của API và luồng Check-in/Check-out realtime.
* Kiểm thử các trường hợp dữ liệu bất thường và lỗi hệ thống.
* Thực hiện User Acceptance Testing (UAT).
* Hoàn thiện giao diện và trải nghiệm người dùng.
* Kiểm tra cấu hình bảo mật AWS.
* Rà soát tài nguyên và tối ưu chi phí AWS.
* Chuẩn bị phiên bản hệ thống ổn định phục vụ demo và báo cáo.


### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Tổng hợp các lỗi được phát hiện từ quá trình Integration Testing tuần trước <br> - Phân loại lỗi theo Frontend, Backend, Data Processing và Analytics <br> - Kiểm tra lại các API endpoint <br> - Sửa các lỗi liên quan đến request/response, validation và error handling <br> - Kiểm tra tính nhất quán của dữ liệu giữa DynamoDB, S3 và giao diện Web | 26/10/2026 | 26/10/2026 | Tài liệu kiểm thử và AWS Documentation |
| 3 | - Kiểm thử Authentication và Authorization <br> - Kiểm tra Amazon Cognito User Pool <br> - Kiểm tra JWT Token và Cognito Authorizer <br> - Kiểm thử quyền của Youth Union Staff và Admin <br> - Kiểm tra khả năng truy cập API khi không có Token hoặc Token không hợp lệ <br> - Rà soát IAM Role/Policy theo nguyên tắc Least Privilege <br> - Kiểm tra quyền truy cập Amazon S3 và DynamoDB | 27/10/2026 | 27/10/2026 | <https://docs.aws.amazon.com/cognito/> <br> <https://docs.aws.amazon.com/iam/> |
| 4 | - Kiểm thử các quy tắc nghiệp vụ và hiệu năng cơ bản <br> - Kiểm thử realtime Check-in/Check-out với nhiều request liên tiếp <br> - Kiểm tra các trường hợp: <br>&emsp; + Sinh viên chưa đăng ký <br>&emsp; + Check-in trùng lặp <br>&emsp; + Check-out khi chưa Check-in <br>&emsp; + Thiếu Evidence <br>&emsp; + Dữ liệu Registration trùng lặp <br>&emsp; + MSSV không hợp lệ <br> - Theo dõi Lambda Duration, Errors và API response time trên CloudWatch <br> - Điều chỉnh các phần xử lý chưa tối ưu | 28/10/2026 | 28/10/2026 | <https://docs.aws.amazon.com/cloudwatch/> |
| 5 | - Thực hiện User Acceptance Testing (UAT) <br> - Kiểm thử hệ thống theo góc nhìn của Youth Union Staff / Organizer <br> - Kiểm thử các chức năng: <br>&emsp; + Login <br>&emsp; + Activity Management <br>&emsp; + Registration Import <br>&emsp; + Evidence Import <br>&emsp; + Realtime Check-in/Check-out <br>&emsp; + Reconciliation <br>&emsp; + Export Results <br>&emsp; + Analytics Dashboard <br> - Ghi nhận các vấn đề về UI/UX và quy trình sử dụng <br> - Điều chỉnh giao diện và thông báo cho người dùng | 29/10/2026 | 29/10/2026 | Tài liệu Proposal và Test Cases |
| 6 | - Rà soát và tối ưu tài nguyên AWS <br> - Kiểm tra các tài nguyên đang hoạt động <br> - Xóa hoặc tắt các tài nguyên thử nghiệm không còn cần thiết <br> - Kiểm tra CloudWatch Logs và thời gian lưu trữ log <br> - Kiểm tra dung lượng dữ liệu trên S3 <br> - Rà soát cấu hình Lambda và DynamoDB <br> - Kiểm tra AWS Billing / Cost Management <br> - Thực hiện Regression Testing sau khi sửa lỗi <br> - Chuẩn bị phiên bản ổn định cho giai đoạn demo và hoàn thiện tài liệu | 30/10/2026 | 30/10/2026 | <https://docs.aws.amazon.com/cost-management/> |


### Kết quả dự kiến đạt được tuần 8:

* Tổng hợp và xử lý được các lỗi được phát hiện sau quá trình Integration Testing.

* Hoàn thiện các chức năng Backend và Frontend còn chưa ổn định.

* Kiểm tra thành công cơ chế Authentication bằng Amazon Cognito.

* Xác nhận luồng xác thực:

  **User → Amazon Cognito → JWT Token → API Gateway → Cognito Authorizer → AWS Lambda**

* Kiểm thử quyền truy cập của hai nhóm người dùng:

  * Youth Union Staff / Organizer.
  * Admin / Management.

* Kiểm tra các trường hợp truy cập không hợp lệ:

  * Không có JWT Token.
  * Token không hợp lệ.
  * Token hết hạn.
  * Người dùng không có quyền thực hiện chức năng.

* Rà soát IAM Role và IAM Policy theo nguyên tắc **Least Privilege**.

* Kiểm thử lại các quy tắc nghiệp vụ chính của hệ thống:

  * Sinh viên phải đăng ký trước khi Check-in/Check-out.
  * Check-in được ghi nhận realtime.
  * Check-out được ghi nhận realtime.
  * Không cho phép Check-in trùng không hợp lệ.
  * Kiểm tra thứ tự Check-in và Check-out.
  * Phát hiện thiếu Evidence.
  * Phát hiện dữ liệu không hợp lệ.
  * Thực hiện Reconciliation đúng theo Business Rules.

* Tiếp tục đảm bảo Check-in/Check-out là **realtime API events**, không sử dụng file import cho dữ liệu Attendance.

* Thực hiện kiểm thử nhiều request Check-in/Check-out liên tiếp để đánh giá khả năng xử lý cơ bản của hệ thống.

* Theo dõi các chỉ số trên Amazon CloudWatch:

  * Lambda Invocations.
  * Lambda Errors.
  * Lambda Duration.
  * API Gateway Requests.
  * HTTP 4XX Errors.
  * HTTP 5XX Errors.

* Hoàn thành User Acceptance Testing cho các chức năng chính:

  * Authentication.
  * Activity Management.
  * Registration Import.
  * Evidence Import.
  * Realtime Attendance.
  * Reconciliation.
  * Export Results.
  * Analytics Dashboard.

* Điều chỉnh giao diện Web để:

  * Dễ sử dụng hơn.
  * Hiển thị trạng thái rõ ràng hơn.
  * Hiển thị thông báo lỗi dễ hiểu hơn.
  * Hỗ trợ Ban tổ chức thao tác nhanh trong quá trình Check-in/Check-out.

* Thực hiện Regression Testing sau khi sửa lỗi để đảm bảo các chức năng cũ vẫn hoạt động bình thường.

* Rà soát các tài nguyên AWS đang sử dụng.

* Xóa hoặc tắt các tài nguyên thử nghiệm không còn cần thiết.

* Kiểm tra AWS Billing / Cost Management nhằm hạn chế phát sinh chi phí ngoài dự kiến.

* Hoàn thiện phiên bản hệ thống ổn định để chuẩn bị cho:

  * Demo hệ thống.
  * Workshop.
  * Hoàn thiện tài liệu kỹ thuật.
  * Hoàn thiện báo cáo thực tập.