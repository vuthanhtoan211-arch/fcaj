---
title: "Worklog Tuần 6"
date: 2026-10-12
weight: 6
chapter: false
pre: "<b>1.6.</b>"
---


### Mục tiêu tuần 6:

* Hoàn thiện pipeline xử lý file dữ liệu trên Amazon S3.
* Xây dựng chức năng upload file Registration và Evidence thông qua Web Application.
* Sử dụng Pre-signed URL để upload file an toàn lên Amazon S3.
* Cấu hình S3 Event để tự động kích hoạt AWS Lambda xử lý dữ liệu.
* Hoàn thiện chức năng kiểm tra, chuẩn hóa và chuyển đổi dữ liệu đầu vào.
* Lưu dữ liệu đã xử lý vào Amazon DynamoDB và Processed Data Bucket.
* Xây dựng chức năng xuất kết quả đối soát dưới dạng CSV/XLSX.
* Chuẩn bị dữ liệu phục vụ Analytics.
* Tìm hiểu và cấu hình bước đầu AWS Glue và Amazon Athena.
* Kiểm thử toàn bộ luồng xử lý dữ liệu từ Frontend đến Storage và Database.


### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ----------------------------------------- |
| 2 | - Hoàn thiện chức năng upload file trên Web Application <br> - Xây dựng luồng upload cho: <br>&emsp; + Registration Data <br>&emsp; + Evidence Data <br> - Tạo API yêu cầu Pre-signed URL từ Backend <br> - Sử dụng Pre-signed URL để upload file trực tiếp từ Frontend lên Amazon S3 Raw Data Bucket <br> - Kiểm tra loại file, kích thước file và định dạng CSV/XLSX <br> - Kiểm thử quyền truy cập S3 | 12/10/2026 | 12/10/2026 | <https://docs.aws.amazon.com/s3/> |
| 3 | - Cấu hình Amazon S3 Event Notification <br> - Tự động kích hoạt File Processing Lambda khi có file mới được upload <br> - Hoàn thiện File Processing Lambda với các chức năng: <br>&emsp; + Đọc file CSV/XLSX <br>&emsp; + Kiểm tra các trường bắt buộc <br>&emsp; + Chuẩn hóa MSSV <br>&emsp; + Kiểm tra định dạng dữ liệu <br>&emsp; + Phát hiện dữ liệu trùng lặp <br>&emsp; + Phát hiện dữ liệu không hợp lệ <br> - Ghi log kết quả xử lý trên Amazon CloudWatch | 13/10/2026 | 13/10/2026 | <https://docs.aws.amazon.com/lambda/> |
| 4 | - Lưu dữ liệu hợp lệ sau khi xử lý vào Amazon DynamoDB <br> - Lưu kết quả đã xử lý vào Amazon S3 Processed Data Bucket <br> - Tạo báo cáo validation cho các bản ghi lỗi <br> - Kiểm tra các trường hợp: <br>&emsp; + MSSV không hợp lệ <br>&emsp; + Thiếu thông tin bắt buộc <br>&emsp; + Dữ liệu trùng lặp <br>&emsp; + File sai định dạng <br> - Hiển thị trạng thái xử lý file trên Web Application | 14/10/2026 | 14/10/2026 | Tài liệu Proposal và AWS Documentation |
| 5 | - Xây dựng chức năng Export Participation Results <br> - Lấy dữ liệu kết quả đối soát từ DynamoDB <br> - Sinh file CSV/XLSX chứa các thông tin: <br>&emsp; + MSSV <br>&emsp; + Họ tên <br>&emsp; + Activity <br>&emsp; + Registration Status <br>&emsp; + Check-in Status <br>&emsp; + Check-out Status <br>&emsp; + Evidence Status <br>&emsp; + Participation Status <br> - Lưu file export vào Amazon S3 Processed & Export Bucket <br> - Tạo Pre-signed URL cho phép người dùng tải file kết quả từ Web Application | 15/10/2026 | 15/10/2026 | <https://docs.aws.amazon.com/s3/> |
| 6 | - Chuẩn bị Analytics Dataset từ dữ liệu đã xử lý <br> - Tổ chức dữ liệu trên S3 theo cấu trúc phù hợp cho phân tích <br> - Tìm hiểu AWS Glue Data Catalog <br> - Tạo Glue Crawler để nhận diện schema dữ liệu trên S3 <br> - Tìm hiểu Amazon Athena và thực hiện các truy vấn SQL thử nghiệm <br>&emsp; + Tổng số sinh viên đăng ký <br>&emsp; + Số sinh viên tham gia <br>&emsp; + Tỷ lệ tham gia <br>&emsp; + Số trường hợp NEEDS_REVIEW <br> - Kiểm tra dữ liệu để chuẩn bị xây dựng Dashboard trong tuần tiếp theo | 16/10/2026 | 16/10/2026 | <https://docs.aws.amazon.com/glue/> <br> <https://docs.aws.amazon.com/athena/> |


### Kết quả dự kiến đạt được tuần 6:

* Hoàn thiện pipeline upload và xử lý file cho hai nguồn dữ liệu:

  * Registration Data.
  * Evidence Data.

* Xây dựng được luồng upload an toàn:

  **Frontend → API Gateway → Lambda → Pre-signed URL → Amazon S3**

* Người dùng có thể chọn file CSV/XLSX từ Web Application và upload lên Amazon S3.

* Hoàn thiện cơ chế xử lý tự động:

  **S3 Raw Data → S3 Event → File Processing Lambda**

* File Processing Lambda có khả năng:

  * Đọc dữ liệu CSV/XLSX.
  * Kiểm tra các trường bắt buộc.
  * Chuẩn hóa MSSV.
  * Kiểm tra định dạng dữ liệu.
  * Phát hiện dữ liệu trùng lặp.
  * Phát hiện bản ghi không hợp lệ.
  * Phân loại dữ liệu hợp lệ và dữ liệu lỗi.

* Lưu dữ liệu hợp lệ sau xử lý vào Amazon DynamoDB.

* Lưu dữ liệu đã được chuẩn hóa vào Amazon S3 Processed Data Bucket.

* Tạo được thông tin validation cho các bản ghi lỗi để Ban tổ chức có thể kiểm tra.

* Hiển thị được trạng thái xử lý file trên Web Application.

* Tiếp tục đảm bảo Attendance không sử dụng file import:

  * Check-in được ghi nhận realtime thông qua API.
  * Check-out được ghi nhận realtime thông qua API.
  * Chỉ Registration và Evidence sử dụng pipeline import file.

* Xây dựng được chức năng Export Participation Results.

* File kết quả xuất ra bao gồm các thông tin cơ bản:

  * Student ID.
  * Student Name.
  * Activity.
  * Registration Status.
  * Check-in Status.
  * Check-out Status.
  * Evidence Status.
  * Participation Status.

* Sinh được file kết quả ở định dạng CSV/XLSX.

* Lưu file export vào Amazon S3 Processed & Export Bucket.

* Tạo được Pre-signed URL để người dùng tải file kết quả từ Web Application.

* Chuẩn bị được Analytics Dataset từ dữ liệu đã qua xử lý và đối soát.

* Bước đầu cấu hình AWS Glue Data Catalog để quản lý metadata của dữ liệu trên Amazon S3.

* Thực hiện được các truy vấn thử nghiệm bằng Amazon Athena như:

  * Tổng số sinh viên đăng ký.
  * Tổng số sinh viên tham gia.
  * Tỷ lệ tham gia hoạt động.
  * Số sinh viên vắng mặt.
  * Số trường hợp cần kiểm tra.
  * Thống kê trạng thái tham gia.

* Hoàn thiện luồng dữ liệu chính:

  **Web Application → S3 Raw Data → File Processing Lambda → DynamoDB / S3 Processed Data → AWS Glue → Amazon Athena**

* Chuẩn bị dữ liệu và các truy vấn cần thiết để xây dựng Analytics Dashboard bằng Amazon QuickSight trong tuần tiếp theo.