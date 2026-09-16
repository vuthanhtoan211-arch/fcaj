---
title: "Worklog Tuần 2"
date: 2026-09-14
weight: 2
chapter: false
pre: "<b>1.2.</b>"
---


### Mục tiêu tuần 2:

* Xác định đề tài và phạm vi triển khai của dự án thực tập.
* Phân tích bài toán quản lý dữ liệu tham gia hoạt động sinh viên.
* Xác định các nguồn dữ liệu đầu vào và quy trình xử lý dữ liệu của hệ thống.
* Xây dựng các quy tắc nghiệp vụ cho đăng ký, Check-in, Check-out và minh chứng tham gia.
* Thiết kế kiến trúc tổng thể cho hệ thống trên nền tảng AWS.
* Xác định các dịch vụ AWS phù hợp với từng thành phần của hệ thống.
* Thiết kế mô hình dữ liệu và chuẩn bị dữ liệu giả lập để phục vụ quá trình phát triển và kiểm thử.
* Chuẩn bị môi trường phát triển cục bộ trước khi triển khai các tài nguyên AWS.


### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Nghiên cứu và xác định đề tài dự án **Student Activity Management and Engagement Analytics Platform** <br> - Phân tích bài toán thực tế trong việc quản lý dữ liệu tham gia hoạt động sinh viên <br> - Xác định mục tiêu, phạm vi và các chức năng chính của hệ thống <br> - Xác định nhóm người dùng chính gồm Ban tổ chức/Youth Union Staff và Admin | 14/09/2026 | 14/09/2026 | <https://cloudjourney.awsstudygroup.com/> |
| 3 | - Phân tích các nguồn dữ liệu đầu vào của hệ thống <br>&emsp; + Danh sách sinh viên đăng ký từ University Portal <br>&emsp; + Check-in/Check-out realtime thông qua quét QR trên thẻ sinh viên <br>&emsp; + Dữ liệu minh chứng và phản hồi từ Google Forms/Google Sheets <br> - Xây dựng luồng dữ liệu từ các nguồn bên ngoài vào hệ thống <br> - Xác định các quy tắc kiểm tra và đối soát dữ liệu | 15/09/2026 | 15/09/2026 | <https://cloudjourney.awsstudygroup.com/> |
| 4 | - Xây dựng các quy tắc nghiệp vụ cho hệ thống <br>&emsp; + Chỉ sinh viên đã đăng ký mới được Check-in/Check-out <br>&emsp; + Check-in và Check-out được ghi nhận theo thời gian thực <br>&emsp; + Sinh viên đăng ký nhưng không có Check-in và Check-out được ghi nhận là không tham gia <br>&emsp; + Dữ liệu minh chứng được sử dụng trong quá trình đối soát <br> - Xác định các trạng thái tham gia và các trường hợp cần kiểm tra thủ công | 16/09/2026 | 16/09/2026 | Tài liệu Proposal của dự án |
| 5 | - Thiết kế kiến trúc tổng thể của hệ thống trên AWS <br> - Tìm hiểu và xác định vai trò của các dịch vụ: <br>&emsp; + AWS Amplify – Web Application <br>&emsp; + Amazon Cognito – Authentication <br>&emsp; + Amazon API Gateway – REST API <br>&emsp; + AWS Lambda – Business Logic <br>&emsp; + Amazon DynamoDB – Operational Database <br>&emsp; + Amazon S3 – File Storage <br>&emsp; + AWS IAM – Access Control <br>&emsp; + Amazon CloudWatch – Monitoring & Logging <br> - Hoàn thiện sơ đồ kiến trúc và luồng xử lý dữ liệu | 17/09/2026 | 17/09/2026 | <https://docs.aws.amazon.com/> |
| 6 | - Thiết kế mô hình dữ liệu cho hệ thống <br>&emsp; + Activities <br>&emsp; + Students <br>&emsp; + Registrations <br>&emsp; + Attendance <br>&emsp; + Participation Status <br>&emsp; + Users <br> - Xác định cấu trúc dữ liệu cho sự kiện Check-in/Check-out realtime <br> - Chuẩn bị dữ liệu giả lập để kiểm thử các trường hợp đăng ký, điểm danh, minh chứng và đối soát <br> - Chuẩn bị cấu trúc source code và môi trường phát triển local trước khi triển khai lên AWS | 18/09/2026 | 18/09/2026 | Tài liệu Proposal và tài liệu thiết kế hệ thống |


### Kết quả dự kiến đạt được tuần 2:

* Xác định được đề tài dự án:

  **Student Activity Management and Engagement Analytics Platform**

  Hệ thống hướng đến việc quản lý, đối soát và phân tích dữ liệu tham gia các hoạt động của sinh viên.

* Xác định được phạm vi của phiên bản MVP và các nhóm người dùng chính:

  * Youth Union Staff / Ban tổ chức.
  * Admin / Người quản trị.

* Xác định được các nguồn dữ liệu chính của hệ thống:

  * University Portal – dữ liệu đăng ký hoạt động.
  * QR Scanner – dữ liệu Check-in/Check-out realtime.
  * Google Forms / Google Sheets – dữ liệu minh chứng và phản hồi.

* Xây dựng được các quy tắc nghiệp vụ cơ bản:

  * Sinh viên phải đăng ký hoạt động trước khi được Check-in hoặc Check-out.
  * Sinh viên không có trong danh sách đăng ký sẽ bị từ chối khi quét QR.
  * Check-in và Check-out phải được ghi nhận theo thời gian thực.
  * Sinh viên đã đăng ký nhưng không có Check-in và Check-out được xác định là đã đăng ký nhưng không tham gia.
  * Dữ liệu minh chứng được sử dụng kết hợp với dữ liệu điểm danh trong quá trình đối soát.
  * Sau quá trình đối soát, Ban tổ chức thực hiện xác nhận kết quả tham gia.

* Xây dựng được luồng xử lý dữ liệu tổng quát:

  * Dữ liệu đăng ký được đưa vào hệ thống.
  * Ban tổ chức quét QR trên thẻ sinh viên để ghi nhận Check-in/Check-out realtime.
  * Dữ liệu minh chứng được nhập vào hệ thống.
  * Hệ thống tổng hợp và đối soát các nguồn dữ liệu.
  * Ban tổ chức kiểm tra và xác nhận kết quả.
  * Kết quả cuối cùng có thể được xuất thành Excel/CSV để phục vụ báo cáo.

* Hoàn thiện thiết kế kiến trúc tổng thể với các dịch vụ AWS chính:

  * AWS Amplify
  * Amazon Cognito
  * Amazon API Gateway
  * AWS Lambda
  * Amazon DynamoDB
  * Amazon S3
  * AWS IAM
  * Amazon CloudWatch

* Bước đầu tìm hiểu các dịch vụ phục vụ phân tích dữ liệu trong giai đoạn sau:

  * AWS Glue
  * Amazon Athena
  * Amazon QuickSight

* Xây dựng được mô hình dữ liệu cơ bản cho:

  * Activities
  * Students
  * Registrations
  * Attendance
  * Participation Status
  * Users

* Chuẩn bị dữ liệu giả lập để kiểm thử các trường hợp:

  * Sinh viên đăng ký và tham gia đầy đủ.
  * Thiếu Check-in.
  * Thiếu Check-out.
  * Thiếu minh chứng.
  * Đăng ký nhưng không tham gia.
  * Dữ liệu trùng lặp hoặc không hợp lệ.

* Chuẩn bị cấu trúc dự án và môi trường phát triển local để có thể bắt đầu xây dựng API, xử lý dữ liệu và logic đối soát trong tuần tiếp theo.

* Việc tạo và triển khai các tài nguyên AWS thực tế được thực hiện ở các giai đoạn sau nhằm hạn chế phát sinh chi phí trong thời gian phát triển ban đầu.