---
title: "Worklog Tuần 4"
date: 2026-09-28
weight: 4
chapter: false
pre: "<b>1.4.</b>"
---

### Mục tiêu tuần 4:

* Tiếp tục hoàn thiện các chức năng Backend của **Student Activity Management & Engagement Analytics Platform**.
* Nghiên cứu và thử nghiệm tích hợp các dịch vụ lưu trữ dữ liệu trên AWS.
* Tìm hiểu Amazon DynamoDB và cách tổ chức dữ liệu theo mô hình NoSQL.
* Thiết kế các bảng DynamoDB phục vụ quản lý hoạt động, đăng ký, điểm danh và kết quả tham gia.
* Tìm hiểu Amazon S3 và phương pháp lưu trữ file dữ liệu trên Cloud.
* Xây dựng cơ chế kết nối Backend FastAPI với các dịch vụ AWS thông qua thư viện Boto3.
* Thử nghiệm lưu trữ thông tin hoạt động trên DynamoDB.
* Nghiên cứu cơ chế ghi nhận Check-in/Check-out trực tiếp vào DynamoDB trong phạm vi AWS Pilot.
* Thử nghiệm tải lên poster hoạt động và quản lý đường dẫn file trên Amazon S3.
* Kiểm tra tính chính xác của dữ liệu giữa môi trường local và các luồng AWS Pilot.
* Sử dụng dữ liệu giả lập và giới hạn phạm vi kiểm thử để tránh ảnh hưởng đến dữ liệu thực tế.
* Theo dõi mức sử dụng tài nguyên và kiểm soát chi phí AWS.

### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | --- | --- | --- | --- |
| Thứ 2 | - Tiếp tục rà soát cấu trúc Backend và các chức năng đã phát triển ở tuần 3. <br> - Tìm hiểu cách sử dụng Boto3 để kết nối Python với AWS. <br> - Nghiên cứu Amazon DynamoDB, mô hình NoSQL và các thao tác đọc/ghi dữ liệu. <br> - Tìm hiểu Partition Key, Sort Key và cách truy xuất dữ liệu trong DynamoDB. <br> - Xác định những module Backend có thể sử dụng DynamoDB trong phạm vi AWS Pilot. <br> - Nghiên cứu AWS Region và cấu hình kết nối phù hợp với môi trường thử nghiệm. | 28/09/2026 | 28/09/2026 | https://docs.aws.amazon.com/dynamodb/ <br> https://boto3.amazonaws.com/v1/documentation/api/latest/index.html |
| Thứ 3 | - Thiết kế mô hình lưu trữ dữ liệu nghiệp vụ trên DynamoDB. <br> - Nghiên cứu cấu trúc các bảng `SAP-Activities`, `SAP-Registrations`, `SAP-Attendance`, `SAP-Evidence` và `SAP-Participation`. <br> - Xác định thông tin định danh và các thuộc tính cần lưu trữ cho từng nhóm dữ liệu. <br> - Thiết kế Repository phục vụ truy cập dữ liệu từ Backend. <br> - Xây dựng cơ chế cấu hình AWS Pilot thông qua biến môi trường. <br> - Phân biệt hoạt động thử nghiệm AWS với hoạt động được lưu trong môi trường local. <br> - Chuẩn bị dữ liệu hoạt động và MSSV giả lập để thực hiện kiểm thử. | 29/09/2026 | 29/09/2026 | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ <br> Tài liệu thiết kế dữ liệu của dự án |
| Thứ 4 | - Nghiên cứu và phát triển luồng AWS Pilot cho Activity Management. <br> - Kết nối Backend FastAPI với bảng `SAP-Activities`. <br> - Thử nghiệm thao tác tạo, đọc và cập nhật dữ liệu hoạt động giả lập. <br> - Kiểm tra dữ liệu được lưu trên DynamoDB và dữ liệu phản hồi từ API. <br> - Nghiên cứu cơ chế sử dụng `SAP_ACTIVITIES_AWS_PILOT` để giới hạn phạm vi AWS. <br> - Xử lý tình huống AWS không phản hồi hoặc thiếu cấu hình xác thực. <br> - Kiểm tra để bảo đảm các hoạt động thông thường không tự động chuyển sang DynamoDB khi chưa bật chế độ Pilot. | 30/09/2026 | 30/09/2026 | https://docs.aws.amazon.com/dynamodb/ <br> Tài liệu FastAPI và AWS Pilot |
| Thứ 5 | - Nghiên cứu cơ chế tích hợp Attendance với DynamoDB. <br> - Tìm hiểu cấu trúc lưu trữ sự kiện Check-in và Check-out. <br> - Thiết kế quy trình ghi nhận sự kiện điểm danh ngay khi API xử lý yêu cầu. <br> - Nghiên cứu cách bật AWS Pilot cho một hoạt động thử nghiệm cụ thể. <br> - Kiểm tra các trường hợp Check-in hợp lệ, Check-in trùng, Check-out hợp lệ và Check-out trùng. <br> - Nghiên cứu cơ chế bảo toàn dữ liệu khi thao tác ghi DynamoDB thất bại. <br> - Chuẩn bị các bài kiểm thử độc lập để không ảnh hưởng dữ liệu hoạt động thông thường. | 01/10/2026 | 01/10/2026 | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ <br> Tài liệu Attendance API |
| Thứ 6 | - Nghiên cứu Amazon S3 và các thành phần Bucket, Object và Object Key. <br> - Tìm hiểu cách sử dụng Boto3 để upload file từ Backend lên S3. <br> - Thiết kế đường dẫn lưu poster hoạt động trong S3. <br> - Nghiên cứu Presigned URL để truy cập file theo thời hạn. <br> - Thử nghiệm quản lý metadata ảnh hoạt động kết hợp DynamoDB và S3. <br> - Tổng hợp các bài kiểm thử AWS Pilot cho Activity, Attendance và Poster. <br> - Kiểm tra tài nguyên và mức sử dụng AWS, hạn chế tạo tài nguyên không cần thiết. <br> - Ghi nhận những vấn đề còn lại để tiếp tục kiểm thử và hoàn thiện tích hợp. | 02/10/2026 | 02/10/2026 | https://docs.aws.amazon.com/s3/ <br> https://boto3.amazonaws.com/v1/documentation/api/latest/index.html |

### Kết quả đạt được tuần 4:

* **Nắm được kiến thức nền tảng về Amazon DynamoDB:**
  * Hiểu DynamoDB là dịch vụ cơ sở dữ liệu NoSQL được AWS quản lý.
  * Tìm hiểu các khái niệm Table, Item và Attribute.
  * Nắm được vai trò của Partition Key và Sort Key.
  * Phân biệt thao tác đọc một bản ghi với truy vấn dữ liệu theo khóa.
  * Hiểu được cách dữ liệu ứng dụng có thể được ánh xạ sang cấu trúc DynamoDB.

* **Xây dựng định hướng lưu trữ dữ liệu nghiệp vụ trên DynamoDB:**
  * Nghiên cứu các bảng:
    * `SAP-Activities`.
    * `SAP-Registrations`.
    * `SAP-Attendance`.
    * `SAP-Evidence`.
    * `SAP-Participation`.
  * Xác định các nhóm dữ liệu phù hợp với từng bảng.
  * Phân tích mối quan hệ giữa Activity ID, MSSV và các bản ghi nghiệp vụ.
  * Chuẩn bị cơ sở để kiểm thử đọc/ghi dữ liệu AWS bằng các bản ghi giả lập.

* **Nghiên cứu và xây dựng cơ chế AWS Pilot:**
  * Tìm hiểu phương pháp kích hoạt chức năng AWS thông qua biến môi trường.
  * Phân biệt chế độ phát triển local và chế độ AWS Pilot.
  * Nghiên cứu cách giới hạn hoạt động thử nghiệm để không ảnh hưởng dữ liệu thông thường.
  * Xác định yêu cầu sử dụng MSSV TEST và hoạt động giả lập khi kiểm thử.
  * Chuẩn bị phương án xử lý khi thiếu AWS Credentials hoặc không thể kết nối đến dịch vụ AWS.

* **Phát triển hướng tích hợp Activity Management với DynamoDB:**
  * Nghiên cứu cách sử dụng Boto3 để tương tác với bảng `SAP-Activities`.
  * Xây dựng Repository hỗ trợ các thao tác đọc và ghi dữ liệu hoạt động.
  * Phân tích cơ chế tạo và cập nhật hoạt động thử nghiệm.
  * Kiểm tra yêu cầu đồng nhất dữ liệu giữa phản hồi API và dữ liệu được lưu trữ.
  * Xác định các điều kiện cần thiết để chỉ hoạt động Pilot được xử lý trên AWS.

* **Phát triển cơ chế Attendance AWS Pilot:**
  * Thiết kế cách lưu sự kiện Check-in và Check-out trong bảng `SAP-Attendance`.
  * Giữ nguyên nguyên tắc ghi nhận điểm danh thông qua API thời gian thực.
  * Xác định yêu cầu lưu timestamp khi người dùng thực hiện thao tác điểm danh.
  * Nghiên cứu cách ngăn chặn Check-in hoặc Check-out trùng lặp.
  * Xác định các trường hợp lỗi cần phản hồi rõ ràng cho người dùng.
  * Chuẩn bị bài kiểm thử để xác nhận dữ liệu được ghi ngay vào DynamoDB.

* **Nghiên cứu Amazon S3 và khả năng lưu trữ file:**
  * Hiểu được cấu trúc Bucket, Object, Object Key và Prefix.
  * Nghiên cứu cách upload file bằng Boto3.
  * Thiết kế đường dẫn lưu poster hoạt động theo dạng `activity-posters/`.
  * Tìm hiểu cách tạo Presigned URL cho phép truy cập file có giới hạn thời gian.
  * Nghiên cứu lưu metadata poster trên DynamoDB và nội dung file trên S3.
  * Phân biệt dữ liệu metadata với dữ liệu file thực tế.

* **Chuẩn bị và thực hiện các bước kiểm thử AWS Pilot:**
  * Kiểm tra cấu hình bảng DynamoDB và bucket S3.
  * Thử nghiệm các thao tác với dữ liệu hoạt động giả.
  * Xây dựng các trường hợp kiểm thử Check-in/Check-out trên AWS.
  * Nghiên cứu cách xác nhận bản ghi tồn tại trên DynamoDB sau khi API xử lý.
  * Kiểm tra cơ chế upload poster và truy xuất thông tin ảnh.
  * Tổng hợp các điều kiện kiểm thử nhằm tránh thao tác nhầm với dữ liệu thật.

* **Hiểu rõ hơn quá trình tích hợp Python với AWS:**
  * Tìm hiểu cách khởi tạo Boto3 Client và Resource.
  * Hiểu vai trò của AWS Region và AWS Credentials.
  * Nghiên cứu cách xử lý AWS ClientError và các lỗi kết nối.
  * Phân biệt API trả kết quả thành công với việc dữ liệu thực sự được lưu trên AWS.
  * Nhận thức được tầm quan trọng của việc kiểm tra trực tiếp dữ liệu lưu trữ khi thực hiện kiểm thử.

* **Áp dụng nguyên tắc bảo mật và kiểm soát chi phí:**
  * Không đưa AWS Access Key và Secret Access Key vào source code.
  * Chỉ sử dụng dữ liệu giả phục vụ AWS Pilot.
  * Giới hạn phạm vi kiểm thử theo hoạt động được chỉ định.
  * Tránh tạo bảng hoặc bucket trùng lặp khi tài nguyên đã tồn tại.
  * Nghiên cứu cơ chế AWS Free Tier và theo dõi mức sử dụng dịch vụ.
  * Ưu tiên hoàn thiện chức năng local trước khi mở rộng tài nguyên Cloud.

* **Xác định rõ phạm vi tích hợp AWS của dự án:**
  * FastAPI tiếp tục là Backend chính của hệ thống.
  * SQLite tiếp tục phục vụ lưu trữ dữ liệu cho môi trường phát triển và demo.
  * DynamoDB và S3 được nghiên cứu, phát triển và kiểm thử trong phạm vi AWS Pilot.
  * Chưa chuyển toàn bộ hệ thống sang mô hình serverless.
  * Chưa sử dụng API Gateway hoặc Lambda làm Backend chính cho các chức năng nghiệp vụ.

### Khó khăn và bài học kinh nghiệm:

* **Khác biệt giữa SQL và NoSQL:** DynamoDB sử dụng mô hình dữ liệu khác SQLite, nên cần xác định cách truy xuất và tổ chức khóa phù hợp.
* **Quản lý trạng thái dữ liệu:** Khi kết hợp môi trường local và AWS Pilot, cần tránh việc cập nhật không nhất quán hoặc ghi nhầm dữ liệu.
* **Kiểm thử điểm danh:** Không chỉ kiểm tra HTTP Response mà còn phải xác nhận timestamp và trạng thái thực tế được lưu trên DynamoDB.
* **Quản lý file S3:** Cần phân biệt nội dung file, metadata và đường dẫn truy xuất khi tích hợp poster hoạt động.
* **Bảo mật AWS:** Việc sử dụng Credentials và quyền truy cập cần được quản lý cẩn thận.
* **Chi phí Cloud:** Ưu tiên dữ liệu nhỏ, bài kiểm thử có giới hạn và tái sử dụng tài nguyên AWS để tránh chi phí không cần thiết.

### Định hướng tuần tiếp theo:

* Tiếp tục hoàn thiện Frontend bằng React và Vite.
* Xây dựng các trang đăng nhập, Dashboard và quản lý hoạt động.
* Xây dựng giao diện quản lý tài khoản sinh viên theo hai vai trò ADMIN/STUDENT.
* Kết nối Frontend với FastAPI REST API.
* Hoàn thiện cơ chế Authentication và Authorization.
* Phát triển giao diện hỗ trợ Check-in/Check-out.
* Kiểm thử quá trình tương tác giữa Frontend và Backend trong môi trường local.