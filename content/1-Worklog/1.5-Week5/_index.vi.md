---
title: "Worklog Tuần 5"
date: 2026-10-05
weight: 5
chapter: false
pre: "<b>1.5.</b>"
---


### Mục tiêu tuần 5:

* Xây dựng giao diện Web cho hệ thống Student Activity Management and Engagement Analytics Platform.
* Triển khai cơ chế xác thực người dùng bằng Amazon Cognito.
* Phân quyền người dùng cho Youth Union Staff và Admin.
* Kết nối Frontend với REST API đã triển khai trên Amazon API Gateway.
* Xây dựng giao diện quản lý hoạt động và dữ liệu sinh viên.
* Xây dựng giao diện hỗ trợ Check-in/Check-out realtime.
* Xây dựng giao diện theo dõi kết quả đối soát.
* Triển khai Frontend lên AWS Amplify.
* Kiểm thử luồng đăng nhập, gọi API và hiển thị dữ liệu trên giao diện.


### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Thiết kế cấu trúc giao diện Web cho hệ thống <br> - Xác định các trang chính: <br>&emsp; + Login <br>&emsp; + Dashboard <br>&emsp; + Activities <br>&emsp; + Students / Registrations <br>&emsp; + Attendance <br>&emsp; + Reconciliation <br> - Khởi tạo Frontend bằng React hoặc Next.js <br> - Tổ chức cấu trúc component và routing | 05/10/2026 | 05/10/2026 | Tài liệu Proposal và tài liệu thiết kế hệ thống |
| 3 | - Tạo và cấu hình Amazon Cognito <br> - Tạo User Pool phục vụ Authentication <br> - Cấu hình tài khoản cho các nhóm người dùng <br>&emsp; + Youth Union Staff / Organizer <br>&emsp; + Admin / Management <br> - Tích hợp chức năng Sign in / Sign out vào Frontend <br> - Xử lý JWT Token sau khi đăng nhập <br> - Kiểm thử các trường hợp đăng nhập hợp lệ và không hợp lệ | 06/10/2026 | 06/10/2026 | <https://docs.aws.amazon.com/cognito/> |
| 4 | - Kết nối Frontend với Amazon API Gateway <br> - Cấu hình gửi JWT Token trong API request <br> - Xây dựng giao diện quản lý hoạt động <br>&emsp; + Xem danh sách hoạt động <br>&emsp; + Xem thông tin chi tiết <br>&emsp; + Tạo/cập nhật hoạt động theo quyền người dùng <br> - Xây dựng giao diện hiển thị danh sách sinh viên đăng ký <br> - Kiểm tra dữ liệu trả về từ Lambda và DynamoDB | 07/10/2026 | 07/10/2026 | <https://docs.aws.amazon.com/apigateway/> |
| 5 | - Xây dựng giao diện Attendance cho Check-in/Check-out realtime <br> - Mô phỏng thao tác quét QR trên giao diện <br>&emsp; + Nhận MSSV / QR data <br>&emsp; + Gửi request Check-in hoặc Check-out <br>&emsp; + Hiển thị kết quả ngay sau khi API phản hồi <br> - Hiển thị thông báo cho các trường hợp: <br>&emsp; + Check-in thành công <br>&emsp; + Check-out thành công <br>&emsp; + Sinh viên chưa đăng ký <br>&emsp; + Quét trùng <br>&emsp; + Dữ liệu không hợp lệ <br> - Xây dựng giao diện xem trạng thái Attendance | 08/10/2026 | 08/10/2026 | Tài liệu Proposal và API Documentation |
| 6 | - Xây dựng giao diện Reconciliation <br>&emsp; + Hiển thị Registration <br>&emsp; + Check-in <br>&emsp; + Check-out <br>&emsp; + Evidence <br>&emsp; + Participation Status <br> - Cho phép Ban tổ chức kiểm tra các trường hợp NEEDS_REVIEW <br> - Kiểm thử toàn bộ luồng Frontend → API Gateway → Lambda → DynamoDB <br> - Triển khai Web Application lên AWS Amplify <br> - Kiểm tra truy cập hệ thống qua HTTPS <br> - Kiểm tra và sửa lỗi giao diện/API sau khi triển khai | 09/10/2026 | 09/10/2026 | <https://docs.aws.amazon.com/amplify/> |


### Kết quả dự kiến đạt được tuần 5:

* Xây dựng được giao diện Web ban đầu cho hệ thống **Student Activity Management and Engagement Analytics Platform**.

* Hoàn thiện các trang chức năng chính:

  * Login
  * Dashboard
  * Activities
  * Students / Registrations
  * Attendance
  * Reconciliation

* Tích hợp Amazon Cognito để xác thực người dùng.

* Thiết lập hai nhóm người dùng chính:

  * Youth Union Staff / Organizer.
  * Admin / Management.

* Xây dựng được chức năng:

  * Đăng nhập.
  * Đăng xuất.
  * Lưu và sử dụng JWT Token.
  * Kiểm tra trạng thái xác thực người dùng.
  * Hạn chế quyền truy cập vào các chức năng theo vai trò người dùng.

* Kết nối thành công Frontend với Amazon API Gateway.

* Gửi được các authenticated request từ Frontend đến Backend theo luồng:

  * User đăng nhập.
  * Amazon Cognito xác thực người dùng.
  * Cognito trả về JWT Token.
  * Frontend gửi request kèm JWT Token.
  * API Gateway tiếp nhận request.
  * AWS Lambda thực hiện business logic.
  * DynamoDB được đọc hoặc cập nhật.
  * Kết quả được trả về và hiển thị trên giao diện.

* Xây dựng được giao diện quản lý hoạt động với các chức năng cơ bản:

  * Xem danh sách hoạt động.
  * Xem thông tin chi tiết.
  * Tạo hoạt động.
  * Cập nhật thông tin hoạt động.

* Xây dựng được giao diện quản lý danh sách sinh viên đăng ký.

* Xây dựng được giao diện Check-in/Check-out realtime.

* Khi Ban tổ chức thực hiện quét QR:

  * Frontend gửi dữ liệu MSSV và Activity ID đến API.
  * Backend kiểm tra Registration.
  * CHECK_IN hoặc CHECK_OUT được ghi nhận trong DynamoDB.
  * Kết quả được trả về và hiển thị ngay trên giao diện.

* Đảm bảo Check-in/Check-out vẫn hoạt động theo cơ chế **realtime API**, không sử dụng Excel/CSV để nhập dữ liệu Attendance.

* Xây dựng được giao diện Reconciliation để hiển thị:

  * Registration Status.
  * Check-in Status.
  * Check-out Status.
  * Evidence Status.
  * Participation Status.

* Hiển thị được các trường hợp cần kiểm tra như:

  * `READY`
  * `NEEDS_REVIEW: MISSING_CHECK_IN`
  * `NEEDS_REVIEW: MISSING_CHECK_OUT`
  * `NEEDS_REVIEW: MISSING_EVIDENCE`
  * `NO_ATTENDANCE`

* Triển khai Frontend lên AWS Amplify.

* Truy cập được Web Application thông qua HTTPS.

* Hoàn thành luồng tích hợp cơ bản:

  **AWS Amplify → Amazon Cognito → API Gateway → AWS Lambda → Amazon DynamoDB**

* Hoàn thiện phiên bản Web Application cơ bản để chuẩn bị cho việc xử lý file nâng cao, xuất báo cáo và xây dựng hệ thống Analytics trong tuần tiếp theo.