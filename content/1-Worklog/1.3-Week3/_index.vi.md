---
title: "Worklog Tuần 3"
date: 2026-09-21
weight: 3
chapter: false
pre: "<b>1.3.</b>"
---


### Mục tiêu tuần 3:

* Bắt đầu hiện thực các chức năng cốt lõi của hệ thống trong môi trường phát triển local.
* Xây dựng cấu trúc source code cho dự án.
* Xây dựng chức năng đọc, kiểm tra và chuẩn hóa dữ liệu đăng ký sinh viên.
* Xây dựng chức năng xử lý dữ liệu minh chứng tham gia.
* Xây dựng API mô phỏng quá trình Check-in/Check-out realtime bằng QR Code.
* Xây dựng các quy tắc đối soát dữ liệu giữa Registration, Attendance và Evidence.
* Kiểm thử các trường hợp dữ liệu hợp lệ, không hợp lệ và thiếu dữ liệu.
* Chuẩn bị hệ thống để có thể ánh xạ sang các dịch vụ AWS trong giai đoạn triển khai sau.


### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Khởi tạo cấu trúc source code cho dự án **Student Activity Management and Engagement Analytics Platform** <br> - Tổ chức các thư mục phục vụ xử lý API, dữ liệu và business logic <br> - Cấu hình môi trường phát triển local <br> - Kiểm tra bộ dữ liệu giả lập đã chuẩn bị từ tuần trước <br> - Xác định cấu trúc request/response chung cho các API | 21/09/2026 | 21/09/2026 | Tài liệu Proposal và tài liệu thiết kế hệ thống |
| 3 | - Xây dựng chức năng xử lý dữ liệu đăng ký sinh viên <br>&emsp; + Đọc dữ liệu từ CSV/Excel <br>&emsp; + Kiểm tra các trường bắt buộc <br>&emsp; + Chuẩn hóa MSSV <br>&emsp; + Phát hiện và loại bỏ dữ liệu trùng lặp <br>&emsp; + Phát hiện MSSV hoặc dữ liệu không hợp lệ <br> - Xây dựng chức năng xử lý dữ liệu minh chứng từ Google Forms/Google Sheets <br> - Tạo kết quả validation cho các dòng dữ liệu lỗi | 22/09/2026 | 22/09/2026 | Tài liệu Proposal và bộ dữ liệu kiểm thử |
| 4 | - Xây dựng API Check-in/Check-out realtime <br>&emsp; + Nhận dữ liệu từ thao tác quét QR trên thẻ sinh viên <br>&emsp; + Xác định sinh viên và hoạt động <br>&emsp; + Kiểm tra sinh viên có đăng ký hoạt động hay không <br>&emsp; + Ghi nhận loại sự kiện CHECK_IN hoặc CHECK_OUT <br>&emsp; + Ghi nhận thời gian thực hiện <br>&emsp; + Ngăn việc ghi nhận trùng lặp không hợp lệ <br> - Mô phỏng quá trình quét QR bằng dữ liệu test trong môi trường local | 23/09/2026 | 23/09/2026 | <https://docs.aws.amazon.com/apigateway/> |
| 5 | - Xây dựng logic đối soát dữ liệu tham gia hoạt động <br> - Kết hợp dữ liệu Registration, Check-in, Check-out và Evidence <br> - Xác định các trường hợp: <br>&emsp; + Đủ dữ liệu và sẵn sàng xác nhận <br>&emsp; + Thiếu Check-in <br>&emsp; + Thiếu Check-out <br>&emsp; + Thiếu minh chứng <br>&emsp; + Không có dữ liệu điểm danh <br>&emsp; + Có nhiều lỗi cần kiểm tra <br> - Gán trạng thái Participation Status tương ứng cho từng sinh viên | 24/09/2026 | 24/09/2026 | Tài liệu Proposal và business rules của dự án |
| 6 | - Kiểm thử toàn bộ luồng xử lý trong môi trường local <br>&emsp; + Import Registration <br>&emsp; + Import Evidence <br>&emsp; + Realtime Check-in <br>&emsp; + Realtime Check-out <br>&emsp; + Reconciliation <br> - Kiểm thử với các trường hợp dữ liệu lỗi và dữ liệu thiếu <br> - Kiểm tra kết quả API và xử lý lỗi <br> - Hoàn thiện tài liệu mô tả API và luồng xử lý <br> - Chuẩn bị ánh xạ các module local sang API Gateway, Lambda, DynamoDB và S3 trong giai đoạn AWS | 25/09/2026 | 25/09/2026 | <https://docs.aws.amazon.com/> |


### Kết quả dự kiến đạt được tuần 3:

* Hoàn thiện cấu trúc source code ban đầu cho dự án **Student Activity Management and Engagement Analytics Platform**.

* Xây dựng được module xử lý dữ liệu đăng ký sinh viên có khả năng:

  * Đọc dữ liệu CSV/Excel.
  * Kiểm tra dữ liệu đầu vào.
  * Chuẩn hóa MSSV.
  * Phát hiện dữ liệu trùng lặp.
  * Phát hiện dữ liệu không hợp lệ.
  * Trả về kết quả validation.

* Xây dựng được module xử lý dữ liệu minh chứng tham gia hoạt động.

* Xây dựng được API Check-in/Check-out realtime với luồng xử lý:

  * Ban tổ chức quét QR Code trên thẻ sinh viên.
  * Hệ thống nhận MSSV và Activity ID.
  * Kiểm tra sinh viên có nằm trong danh sách đăng ký hay không.
  * Nếu hợp lệ, hệ thống ghi nhận CHECK_IN hoặc CHECK_OUT.
  * Thời gian điểm danh được ghi nhận tại thời điểm request được gửi đến hệ thống.
  * Nếu sinh viên không đăng ký hoặc dữ liệu không hợp lệ, hệ thống trả về thông báo lỗi.

* Đảm bảo Check-in/Check-out được thiết kế dưới dạng **realtime API event**, không sử dụng file Excel/CSV để import dữ liệu điểm danh.

* Xây dựng được logic đối soát giữa các nguồn dữ liệu:

  * Registration
  * Check-in
  * Check-out
  * Evidence

* Xác định được các trạng thái chính trong quá trình đối soát:

  * `READY`
  * `NEEDS_REVIEW: MISSING_CHECK_IN`
  * `NEEDS_REVIEW: MISSING_CHECK_OUT`
  * `NEEDS_REVIEW: MISSING_EVIDENCE`
  * `NO_ATTENDANCE`
  * Các trường hợp có nhiều lỗi kết hợp.

* Kiểm thử được các tình huống như:

  * Sinh viên đăng ký và tham gia đầy đủ.
  * Sinh viên chưa đăng ký nhưng quét QR.
  * Check-in trùng lặp.
  * Check-out khi chưa có Check-in.
  * Thiếu Check-in.
  * Thiếu Check-out.
  * Thiếu minh chứng.
  * Đăng ký nhưng không tham gia.
  * MSSV không hợp lệ.
  * Dữ liệu đăng ký bị trùng.

* Hoàn thiện bước đầu tài liệu API, business logic và quy trình xử lý dữ liệu.

* Xác định được cách ánh xạ các thành phần local sang kiến trúc AWS:

  * Local API → Amazon API Gateway.
  * Business Logic → AWS Lambda.
  * Operational Data → Amazon DynamoDB.
  * Registration/Evidence files → Amazon S3.
  * Authentication → Amazon Cognito.
  * Logs và monitoring → Amazon CloudWatch.

* Hoàn thành phần phát triển và kiểm thử cốt lõi ở môi trường local trước khi triển khai tài nguyên thực tế trên AWS, giúp hạn chế chi phí phát sinh trong quá trình phát triển.