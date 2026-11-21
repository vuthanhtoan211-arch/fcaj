
---
title: "Giới thiệu"
date: 2026-11-09
weight: 1
chapter: false
pre: "<b>5.1.</b>"
---

#### Giới thiệu về Student Activity Management & Engagement Analytics Platform

**Student Activity Management & Engagement Analytics Platform** là hệ thống được xây dựng nhằm hỗ trợ công tác quản lý, theo dõi, đối soát và phân tích dữ liệu tham gia hoạt động của sinh viên tại trường đại học.

Trong thực tế, dữ liệu hoạt động sinh viên thường được thu thập từ nhiều nguồn khác nhau như University Portal, hệ thống điểm danh bằng mã QR trên thẻ sinh viên, Google Forms và Google Sheets. Sau mỗi hoạt động, Ban Tổ chức cần tổng hợp, kiểm tra và đối chiếu các dữ liệu này để xác định kết quả tham gia của từng sinh viên.

Việc xử lý thủ công bằng nhiều file Excel hoặc CSV có thể mất nhiều thời gian, phát sinh dữ liệu trùng lặp, thiếu thông tin và gây khó khăn khi tổ chức các hoạt động có số lượng sinh viên tham gia lớn.

Workshop này giới thiệu cách xây dựng một nền tảng quản lý dữ liệu tập trung kết hợp Web Application và các dịch vụ AWS, giúp người học hiểu rõ quy trình phát triển ứng dụng, tích hợp lưu trữ dữ liệu trên Cloud, xử lý dữ liệu và triển khai hệ thống.

Hệ thống được xây dựng bằng **React/Vite**, **Python/FastAPI**, **SQLite** và tích hợp **Amazon DynamoDB**, đồng thời sử dụng các dịch vụ AWS để triển khai giao diện, lưu trữ file, xử lý dữ liệu Serverless, quản lý quyền truy cập và giám sát quá trình thực thi.

#### Giới thiệu về các dịch vụ AWS sử dụng

* **AWS Amplify:** Dịch vụ hỗ trợ triển khai và hosting ứng dụng Web. Trong workshop này, AWS Amplify được sử dụng để triển khai giao diện React/Vite, giúp ADMIN và STUDENT truy cập hệ thống thông qua trình duyệt.

* **Amazon DynamoDB:** Dịch vụ cơ sở dữ liệu NoSQL được quản lý bởi AWS. DynamoDB được tích hợp và kiểm thử để lưu trữ các nhóm dữ liệu nghiệp vụ như Activities, Registrations, Attendance, Evidence và Participation.

* **Amazon S3:** Dịch vụ lưu trữ đối tượng trên AWS, được sử dụng để lưu file CSV đầu vào và kết quả JSON sau khi xử lý trong Serverless CSV Processing Demo.

* **AWS Lambda:** Dịch vụ Compute theo mô hình Serverless, cho phép thực thi mã nguồn mà không cần quản lý máy chủ trực tiếp. Trong workshop này, Lambda được sử dụng để đọc file CSV, kiểm tra dữ liệu, phát hiện bản ghi trùng lặp và tạo kết quả xử lý.

* **AWS IAM:** Dịch vụ quản lý danh tính và quyền truy cập trên AWS. IAM được sử dụng để cấp quyền cho Lambda truy cập Amazon S3 và ghi log lên Amazon CloudWatch theo nguyên tắc Least Privilege.

* **Amazon CloudWatch:** Dịch vụ giám sát và ghi nhận log trên AWS. CloudWatch được sử dụng để theo dõi quá trình thực thi Lambda, kiểm tra lỗi, thời gian xử lý và các thông tin vận hành.

#### Tổng quan về Workshop

Trong workshop này, bạn sẽ tìm hiểu và xây dựng hệ thống theo ba thành phần chính:

**1. Web Application**

Đây là thành phần chính của hệ thống, được sử dụng để quản lý hoạt động và dữ liệu tham gia của sinh viên.

* Frontend được phát triển bằng React/Vite và triển khai trên AWS Amplify Hosting.
* Backend được phát triển bằng Python/FastAPI để cung cấp REST API và xử lý nghiệp vụ.
* Cloudflare Quick Tunnel được sử dụng để kết nối Frontend với Backend chạy trong môi trường local.
* SQLite hỗ trợ lưu trữ và khôi phục dữ liệu của phiên bản Demo.
* Hệ thống sử dụng Authentication và Authorization để phân quyền ADMIN và STUDENT.

ADMIN có thể quản lý hoạt động, quản lý tài khoản sinh viên, nhập dữ liệu đăng ký, ghi nhận Check-in/Check-out, nhập minh chứng, đối soát dữ liệu, xác nhận kết quả tham gia và xuất báo cáo.

STUDENT có thể đăng nhập, xem thông tin cá nhân, theo dõi các hoạt động và kết quả tham gia của bản thân trong phạm vi được cấp quyền.

**2. AWS Cloud Data Storage**

Amazon DynamoDB được sử dụng để tích hợp và kiểm thử lưu trữ dữ liệu nghiệp vụ trên AWS.

Trong workshop này, bạn sẽ tìm hiểu cách kết nối Python/FastAPI với DynamoDB thông qua AWS SDK for Python (boto3), đồng thời thực hiện các thao tác đọc và ghi dữ liệu.

Các nhóm dữ liệu chính gồm:

* Activities: Thông tin hoạt động.
* Registrations: Dữ liệu đăng ký.
* Attendance: Dữ liệu Check-in/Check-out.
* Evidence: Minh chứng tham gia.
* Participation: Kết quả tham gia.

Phiên bản Demo hiện tại kết hợp cơ chế lưu trữ local bằng SQLite với phần tích hợp DynamoDB trên AWS. Workshop không giả định rằng toàn bộ cơ chế lưu trữ của hệ thống đã được chuyển hoàn toàn sang DynamoDB.

**3. AWS Serverless CSV Processing**

Đây là quy trình xử lý dữ liệu Serverless độc lập được xây dựng bằng Amazon S3, AWS Lambda, AWS IAM và Amazon CloudWatch.

Quy trình thực hiện:

* Tải file CSV chứa dữ liệu đăng ký lên Amazon S3.
* Sử dụng AWS Lambda để đọc dữ liệu CSV.
* Kiểm tra các trường dữ liệu bắt buộc.
* Phát hiện bản ghi trùng lặp và không hợp lệ.
* Tổng hợp kết quả xử lý.
* Lưu kết quả JSON trở lại Amazon S3.
* Sử dụng AWS IAM để quản lý quyền thực thi.
* Theo dõi kết quả và log thực thi bằng Amazon CloudWatch.

Quy trình này giúp người học hiểu cách xây dựng một Data Processing Pipeline trên AWS mà không cần quản lý máy chủ trực tiếp.

#### Kiến trúc tổng quan

Sơ đồ dưới đây minh họa kiến trúc của Student Activity Management & Engagement Analytics Platform, bao gồm Web Application, Local Demo Environment, AWS Cloud Data Storage và Serverless CSV Processing Demo.

![Student Activity Management & Engagement Analytics Platform Architecture](/images/2-Proposal/student_activity_architectur.drawio.png)

Hệ thống tiếp nhận dữ liệu từ ba nguồn chính:

* **University Portal:** Cung cấp danh sách sinh viên đăng ký dưới dạng CSV/XLSX.
* **Student Card QR / MSSV:** Cung cấp thông tin định danh sinh viên phục vụ ghi nhận Check-in/Check-out theo thời gian thực.
* **Google Forms / Google Sheets:** Cung cấp dữ liệu minh chứng tham gia dưới dạng CSV/XLSX.

Luồng nghiệp vụ chính của hệ thống:

Registration Import → Real-time Attendance → Evidence Import → Reconciliation → Participation Confirmation → Analytics & Export.

#### Mục tiêu của Workshop

Sau khi hoàn thành workshop, bạn sẽ có thể:

* Hiểu kiến trúc tổng thể của một hệ thống quản lý và phân tích dữ liệu sinh viên.
* Xây dựng Backend REST API bằng Python/FastAPI.
* Phát triển giao diện Web Application bằng React/Vite.
* Hiểu cách xây dựng Authentication và phân quyền ADMIN/STUDENT.
* Thực hiện nhập, kiểm tra và xử lý dữ liệu CSV/XLSX.
* Hiểu quy trình ghi nhận điểm danh theo thời gian thực và đối soát dữ liệu.
* Kết nối ứng dụng Python với Amazon DynamoDB.
* Triển khai Frontend lên AWS Amplify Hosting.
* Xây dựng quy trình xử lý CSV bằng Amazon S3 và AWS Lambda.
* Cấu hình AWS IAM để cấp quyền truy cập tài nguyên cần thiết.
* Theo dõi log và quá trình thực thi Lambda bằng Amazon CloudWatch.
* Hiểu cách lựa chọn và kết hợp các dịch vụ AWS phù hợp với yêu cầu của một dự án thực tế.

Thông qua workshop, người học sẽ có cơ hội kết hợp kiến thức về Web Development, Data Processing, Cloud Computing và AWS để xây dựng một hệ thống phục vụ bài toán quản lý hoạt động sinh viên.

Workshop được thiết kế cho môi trường học tập, thực tập và Demo. Việc triển khai Backend trên hạ tầng Cloud ổn định, chuyển đổi hoàn toàn cơ chế lưu trữ sang Cloud Database và vận hành hệ thống ở quy mô Production là những hướng phát triển tiếp theo.
