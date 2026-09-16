---
title: "Bản đề xuất"
date: 2026-09-11
weight: 2
chapter: false
pre: " <b> 2. </b> "
---



Tại phần này, nội dung trình bày đề xuất xây dựng hệ thống quản lý, đối soát và phân tích mức độ tham gia hoạt động của đoàn viên, sinh viên trên nền tảng AWS.

# Cloud-Based Student & Youth Union Activity Management and Engagement Analytics Platform
## Hệ thống quản lý và phân tích mức độ tham gia hoạt động của đoàn viên, sinh viên trên nền tảng AWS

### 1. Tóm tắt điều hành

Cloud-Based Student & Youth Union Activity Management and Engagement Analytics Platform là nền tảng được đề xuất nhằm hỗ trợ công tác quản lý dữ liệu các hoạt động dành cho sinh viên như workshop, hội thảo, sinh hoạt chính trị, cuộc thi, hoạt động vui chơi và các chương trình thường niên.

Các hoạt động thông thường như workshop, hội thảo hoặc sinh hoạt chính trị có quy mô khoảng 100–200 sinh viên. Trong khi đó, những chương trình lớn như IT Day hoặc TechConnect có thể có hơn 1.000 sinh viên tham gia. Trung bình mỗi học kỳ có khoảng 3–4 hoạt động được tổ chức.

Hiện nay, quá trình quản lý dữ liệu hoạt động được thực hiện thông qua nhiều hệ thống và công cụ khác nhau. Thông tin hoạt động được đăng tải trên các kênh truyền thông của Đoàn Khoa, sinh viên đăng ký tham gia thông qua Portal của trường, Ban Tổ chức thực hiện Check-in và Check-out bằng cách quét mã QR trên thẻ sinh viên, còn minh chứng tham gia và đánh giá chương trình được thu thập thông qua Google Forms và Google Sheets.

Sau khi chương trình kết thúc, Ban Tổ chức phải lấy dữ liệu từ các nguồn khác nhau, tải xuống dưới dạng Excel hoặc CSV, lọc dữ liệu, kiểm tra MSSV và thực hiện đối soát thủ công để xác định danh sách sinh viên thực tế tham gia.

Dự án không nhằm thay thế Portal của trường, hệ thống quét QR thẻ sinh viên hoặc Google Forms hiện tại. Thay vào đó, hệ thống đóng vai trò là một nền tảng xử lý dữ liệu tập trung trên AWS. Ban Tổ chức xuất dữ liệu từ các hệ thống hiện có và tải chúng lên Web Application. Nền tảng AWS tiếp nhận, lưu trữ, kiểm tra, chuẩn hóa, đối chiếu và phân loại dữ liệu trước khi hỗ trợ cán bộ xác nhận danh sách cuối cùng.

Nền tảng dự kiến sử dụng kiến trúc AWS Serverless gồm AWS Amplify, Amazon Cognito, Amazon API Gateway, AWS Lambda, Amazon S3, Amazon DynamoDB, AWS Glue, Amazon Athena, Amazon QuickSight, Amazon CloudWatch và AWS IAM.

Mục tiêu chính của dự án là giảm thời gian xử lý Excel thủ công, tập trung hóa dữ liệu hoạt động, hỗ trợ quá trình đối soát và xác nhận danh sách tham gia, đồng thời cung cấp dashboard phục vụ thống kê và phân tích mức độ tham gia của sinh viên.


### 2. Tuyên bố vấn đề

*Vấn đề hiện tại*

Quy trình quản lý hoạt động hiện nay sử dụng nhiều hệ thống và công cụ riêng biệt.

Quy trình tổng quát được thực hiện như sau:

1. Đoàn Khoa xây dựng và tổ chức hoạt động.
2. Thông tin hoạt động được đăng tải trên các kênh truyền thông.
3. Sinh viên truy cập Portal của trường để đăng ký tham gia.
4. Khi đến địa điểm tổ chức, sinh viên xuất trình thẻ sinh viên.
5. Ban Tổ chức quét mã QR trên thẻ để ghi nhận MSSV phục vụ Check-in.
6. Trong hoặc gần cuối chương trình, sinh viên thực hiện Google Form để cung cấp minh chứng tham gia và đánh giá chương trình.
7. Khi chương trình kết thúc, Ban Tổ chức có thể tiếp tục quét QR trên thẻ để ghi nhận Check-out.
8. Sau chương trình, Ban Tổ chức tổng hợp dữ liệu từ các nguồn và thực hiện đối soát.
9. Dữ liệu từ Google Sheets được tải xuống Excel để tiếp tục lọc, kiểm tra và chỉnh sửa.
10. Danh sách sinh viên tham gia cuối cùng được hoàn thiện và gửi cho Đoàn Trường theo quy trình hiện hành.

Trong quy trình hiện tại, dữ liệu được tạo ra từ nhiều nguồn:

- Danh sách đăng ký từ Portal của trường.
- Danh sách Check-in từ hệ thống quét QR thẻ sinh viên.
- Danh sách Check-out từ hệ thống quét QR thẻ sinh viên.
- Dữ liệu minh chứng và đánh giá từ Google Forms/Google Sheets.
- Các file Excel hoặc CSV được sử dụng để tổng hợp và xử lý.

Việc sử dụng nhiều nguồn dữ liệu làm phát sinh một số vấn đề:

- Dữ liệu bị phân tán trên nhiều hệ thống và nhiều file.
- Ban Tổ chức mất nhiều thời gian đối chiếu MSSV.
- Sinh viên có thể đăng ký nhưng không thực tế tham gia.
- Có trường hợp Check-in nhưng thiếu Check-out.
- Có trường hợp Check-out nhưng thiếu Check-in.
- Có trường hợp đã điểm danh nhưng chưa hoàn thành minh chứng.
- Khó xác định nhanh trạng thái tham gia của từng sinh viên.
- Dữ liệu lịch sử của nhiều hoạt động khó được quản lý tập trung.
- Khó thống kê mức độ tham gia của sinh viên qua nhiều chương trình.
- Khối lượng xử lý tăng đáng kể đối với chương trình có hơn 1.000 người tham gia.

*Giải pháp đề xuất*

Giải pháp đề xuất là xây dựng một nền tảng quản lý, xử lý và phân tích dữ liệu tập trung trên AWS.

Hệ thống không kết nối trực tiếp hoặc thay thế các hệ thống hiện tại trong phiên bản MVP. Ban Tổ chức vẫn sử dụng các công cụ đang có để thực hiện đăng ký, điểm danh và thu thập minh chứng.

Sau mỗi giai đoạn, dữ liệu được xuất thành Excel hoặc CSV và được cán bộ tải lên Web Application của hệ thống.

Các dữ liệu đầu vào gồm:

- Registration File từ University Portal.
- Check-in File.
- Check-out File.
- Evidence File từ Google Forms/Google Sheets.

Amazon S3 được sử dụng để lưu các file nguồn.

Sau khi file được tải lên S3, AWS Lambda được kích hoạt để:

- Đọc file.
- Kiểm tra cấu trúc dữ liệu.
- Kiểm tra các trường bắt buộc.
- Chuẩn hóa MSSV.
- Phát hiện dữ liệu trùng lặp.
- Phát hiện dữ liệu không hợp lệ.
- Chuyển đổi dữ liệu.
- Lưu dữ liệu có cấu trúc vào Amazon DynamoDB.

MSSV được sử dụng làm thông tin chính để đối chiếu dữ liệu giữa Registration, Check-in, Check-out và Evidence.

Hệ thống hỗ trợ tự động phân loại các trường hợp:

- Có đầy đủ dữ liệu.
- Có Check-in nhưng thiếu Check-out.
- Có Check-out nhưng thiếu Check-in.
- Đăng ký nhưng không có dữ liệu điểm danh.
- Có điểm danh nhưng thiếu minh chứng.
- Có dữ liệu bất thường cần kiểm tra thủ công.

Hệ thống không tự động đưa ra quyết định cuối cùng dựa trên một công thức cứng. Các kết quả được đưa vào màn hình Reconciliation để Ban Tổ chức kiểm tra trước khi xác nhận.

Sau quá trình đối soát, cán bộ có thể xác nhận trạng thái:

- `CONFIRMED`
- `REJECTED`

Danh sách cuối sau khi được xác nhận sẽ được khóa trong hệ thống và có thể xuất dưới dạng Excel hoặc CSV.

*Lợi ích và giá trị mang lại*

Hệ thống giúp giảm đáng kể các thao tác Excel thủ công khi tổng hợp và đối chiếu dữ liệu.

Thay vì mở nhiều file và tìm kiếm từng MSSV, Ban Tổ chức có thể xem trạng thái dữ liệu tập trung tại màn hình Reconciliation.

Nền tảng đồng thời tạo ra nguồn dữ liệu lịch sử phục vụ phân tích:

- Tổng số lượt đăng ký.
- Tổng số người tham gia được xác nhận.
- Participation Rate.
- No-show Rate.
- Missing Check-in Rate.
- Missing Check-out Rate.
- Missing Evidence Rate.
- Mức độ tham gia theo loại hoạt động.
- Xu hướng tham gia theo học kỳ.
- Lịch sử tham gia của sinh viên.

Giá trị chính của dự án không chỉ nằm ở việc đưa dữ liệu lên Cloud mà còn ở khả năng tích hợp, chuẩn hóa, đối soát, lưu trữ và phân tích dữ liệu từ nhiều nguồn khác nhau.


### 3. Kiến trúc giải pháp

Nền tảng áp dụng kiến trúc AWS Serverless nhằm hạn chế công việc quản trị máy chủ, hỗ trợ khả năng mở rộng theo nhu cầu sử dụng và phù hợp với đặc điểm workload không liên tục của các hoạt động sinh viên.

Dữ liệu đầu vào được tạo từ ba nhóm nguồn chính:

1. **University Portal** cung cấp danh sách sinh viên đăng ký.
2. **Student Card QR Scanner** cung cấp dữ liệu Check-in và Check-out.
3. **Google Forms/Google Sheets** cung cấp dữ liệu minh chứng tham gia.

Các hệ thống trên nằm ngoài AWS và không bị thay thế bởi nền tảng trong phiên bản MVP.

Ban Tổ chức xuất dữ liệu dưới dạng Excel hoặc CSV, sau đó truy cập Web Application để tải dữ liệu lên hệ thống.

![Student Activity Management Platform Architecture](/images/student_activity_architecture.png)

*Luồng xử lý tổng quát*

1. Ban Tổ chức xuất dữ liệu từ các hệ thống hiện tại.
2. Cán bộ truy cập Web Application thông qua HTTPS.
3. Amazon Cognito thực hiện Authentication và cung cấp JWT Token.
4. Frontend gửi các REST API Request đến Amazon API Gateway kèm JWT Token.
5. API Gateway gọi Application Lambda để xử lý Business Logic.
6. Application Lambda đọc và ghi dữ liệu trên Amazon DynamoDB.
7. Frontend sử dụng Pre-signed URL để upload Excel/CSV lên Amazon S3 Raw Data Bucket.
8. S3 Object Created Event kích hoạt File Processing Lambda.
9. File Processing Lambda kiểm tra, chuẩn hóa và lưu dữ liệu có cấu trúc vào DynamoDB.
10. Dữ liệu đã xử lý được lưu vào S3 Processed & Export Data.
11. AWS Glue lập Data Catalog cho dữ liệu phục vụ Analytics.
12. Amazon Athena truy vấn trực tiếp dữ liệu trên Amazon S3 và sử dụng AWS Glue Data Catalog làm metadata.
13. Amazon QuickSight trực quan hóa kết quả phân tích dưới dạng Dashboard.

*Dịch vụ AWS sử dụng*

- *AWS Amplify*: Hosting Web Application được sử dụng bởi cán bộ và Admin.
- *Amazon Cognito*: Authentication, User Management và JWT Token.
- *Amazon API Gateway*: Cung cấp REST API cho frontend.
- *AWS Lambda – Application Logic*: Xử lý nghiệp vụ quản lý hoạt động, đối soát, xác nhận, tạo Pre-signed URL và tạo file export.
- *AWS Lambda – File Processing*: Đọc và xử lý Excel/CSV được tải lên.
- *Amazon S3 – Raw Data*: Lưu các file Registration, Check-in, Check-out và Evidence gốc.
- *Amazon S3 – Processed & Export Data*: Lưu dữ liệu đã xử lý, Analytics Dataset và file export.
- *Amazon DynamoDB*: Operational Database của hệ thống.
- *AWS Glue*: Data Catalog cho Analytics.
- *Amazon Athena*: Truy vấn dữ liệu trên S3 bằng SQL.
- *Amazon QuickSight*: Dashboard và trực quan hóa dữ liệu.
- *Amazon CloudWatch*: Logs, Metrics, Error Monitoring và Alarms.
- *AWS IAM*: Roles, Policies và Service Permissions theo nguyên tắc Least Privilege.

*Thiết kế dữ liệu*

Amazon DynamoDB lưu các nhóm dữ liệu chính:

- Activities.
- Students.
- Registrations.
- Attendance.
- Participation Status.
- Reconciliation Status.

Amazon S3 được chia thành hai mục đích chính:

**Raw Data**

- Registration Files.
- Check-in Files.
- Check-out Files.
- Evidence Files.

**Processed & Export Data**

- Processed Data.
- Reconciliation Data.
- Analytics Dataset.
- Export Files.
- Final Participation List.

*Bảo mật*

Amazon Cognito được sử dụng để xác thực người dùng.

Frontend gửi JWT Token kèm theo API Request. Amazon API Gateway kiểm tra Token thông qua Cognito Authorizer trước khi cho phép Request truy cập backend.

AWS IAM được áp dụng theo nguyên tắc Least Privilege. Mỗi Lambda Function chỉ được cấp những quyền thực sự cần thiết, ví dụ:

- Đọc hoặc ghi đúng S3 Bucket cần thiết.
- Đọc hoặc ghi đúng DynamoDB Table cần thiết.
- Ghi log vào CloudWatch.

*Monitoring*

Amazon CloudWatch được sử dụng để giám sát các thành phần quan trọng:

- API Gateway Logs.
- Lambda Invocation.
- Lambda Error.
- Lambda Duration.
- File Processing Error.
- Application Error.
- CloudWatch Alarm.

Kiến trúc này giúp hệ thống không chỉ đáp ứng chức năng nghiệp vụ mà còn thể hiện các yếu tố Security, Monitoring và Scalability cần thiết cho một dự án AWS hoàn chỉnh.


### 4. Triển khai kỹ thuật

*Các giai đoạn triển khai*

Dự án được triển khai theo nhiều giai đoạn từ phân tích nghiệp vụ đến thiết kế, phát triển, kiểm thử và hoàn thiện tài liệu.

1. *Phân tích nghiệp vụ và nghiên cứu AWS*

   Phân tích quy trình hoạt động hiện tại, xác định vấn đề và nghiên cứu các dịch vụ AWS phù hợp.

2. *Thiết kế kiến trúc*

   Xây dựng AWS Architecture Diagram, Data Flow, Security Model và Monitoring Strategy.

3. *Thiết kế cơ sở dữ liệu*

   Xác định các thực thể và Access Pattern cho Amazon DynamoDB.

4. *Thiết kế API*

   Xác định REST API cho Activity Management, File Upload, Reconciliation, Confirmation và Export.

5. *Xây dựng Authentication*

   Cấu hình Amazon Cognito và Cognito Authorizer.

6. *Xây dựng Web Application*

   Xây dựng giao diện dành cho Youth Union Staff và Admin.

7. *Xây dựng File Upload Pipeline*

   Frontend yêu cầu Pre-signed URL và upload file trực tiếp lên Amazon S3.

8. *Xây dựng File Processing*

   S3 Event kích hoạt Lambda để đọc và xử lý Excel/CSV.

9. *Xây dựng Reconciliation Engine*

   Hệ thống đối chiếu Registration, Check-in, Check-out và Evidence bằng MSSV.

10. *Xây dựng Participation Confirmation*

    Ban Tổ chức kiểm tra và xác nhận trạng thái tham gia.

11. *Xây dựng Export*

    Tạo Excel/CSV phục vụ quy trình quản lý sau hoạt động.

12. *Xây dựng Analytics*

    Sử dụng S3, AWS Glue, Amazon Athena và Amazon QuickSight.

13. *Monitoring và Security*

    Cấu hình CloudWatch, IAM Least Privilege và các Alarm cần thiết.

14. *Testing*

    Kiểm thử từng chức năng và toàn bộ quy trình End-to-End.

15. *Documentation và Cleanup*

    Hoàn thiện Workshop, báo cáo và xóa các AWS Resource không còn cần thiết.

*Chức năng chính của Web Application*

Youth Union Staff / Organizer có thể:

- Đăng nhập.
- Quản lý hoạt động.
- Upload Registration File.
- Upload Check-in File.
- Upload Check-out File.
- Upload Evidence File.
- Xem kết quả Validation.
- Xem Reconciliation.
- Xác nhận Participation.
- Export dữ liệu.
- Xem Dashboard thống kê.

Admin có thể:

- Quản lý tài khoản.
- Quản lý quyền.
- Quản lý cấu hình hệ thống.
- Theo dõi hoạt động hệ thống.

*Quy tắc đối soát*

Hệ thống tự động phân loại dữ liệu nhưng không tự quyết định hoàn toàn kết quả cuối cùng.

Ví dụ:

| Registration | Check-in | Check-out | Evidence | Phân loại |
|---|---|---|---|---|
| Có | Có | Có | Có | Đầy đủ dữ liệu |
| Có | Có | Không | Có | Thiếu Check-out |
| Có | Không | Có | Có | Thiếu Check-in |
| Có | Không | Không | Không | Đăng ký nhưng không tham gia |
| Có | Có | Có | Không | Thiếu minh chứng |

Trong quy trình hiện tại, Check-in và Evidence là các nguồn dữ liệu quan trọng để xác định việc tham gia. Check-out được sử dụng như dữ liệu bổ sung để hỗ trợ đối soát.

Các trường hợp không đầy đủ sẽ được đưa vào danh sách cần kiểm tra.

Sau khi cán bộ xác nhận, sinh viên có một trong hai trạng thái:

- `CONFIRMED`
- `REJECTED`

Danh sách cuối được khóa sau khi xác nhận.


### 5. Lộ trình & Mốc triển khai

Dự án dự kiến được thực hiện trong 12 tuần thực tập.

- *Tuần 1–2: Nghiên cứu và phân tích*
    - Tìm hiểu AWS Cloud.
    - Nghiên cứu AWS Serverless.
    - Phân tích quy trình hiện tại.
    - Xác định yêu cầu.
    - Hoàn thiện Proposal.

- *Tuần 3–4: System Design*
    - Hoàn thiện AWS Architecture.
    - Thiết kế DynamoDB.
    - Xác định Access Pattern.
    - Thiết kế REST API.
    - Thiết kế User Flow.
    - Thiết kế Security và Monitoring.

- *Tuần 5–6: Core Backend*
    - Amazon Cognito.
    - Amazon DynamoDB.
    - AWS Lambda.
    - Amazon API Gateway.
    - AWS IAM.
    - Kiểm thử API.

- *Tuần 7–8: File Processing*
    - Xây dựng S3 Bucket.
    - Xây dựng Pre-signed Upload.
    - Xử lý Registration File.
    - Xử lý Check-in File.
    - Xử lý Check-out File.
    - Xử lý Evidence File.
    - Validation.
    - Duplicate Detection.

- *Tuần 9–10: Reconciliation & Export*
    - Reconciliation Engine.
    - Participation Confirmation.
    - Final List Locking.
    - Export Excel/CSV.
    - End-to-End Workflow.

- *Tuần 11: Analytics, Security & Monitoring*
    - AWS Glue Data Catalog.
    - Amazon Athena.
    - Amazon QuickSight.
    - CloudWatch Logs.
    - Metrics và Alarm.
    - IAM Least Privilege.
    - Cost Monitoring.

- *Tuần 12: Testing & Documentation*
    - Functional Testing.
    - Integration Testing.
    - End-to-End Testing.
    - Kiểm thử dữ liệu giả lập quy mô lớn.
    - Hoàn thiện Workshop.
    - Hoàn thiện báo cáo.
    - Cleanup AWS Resources.

*Hướng phát triển sau MVP*

- QR Code động cho Check-in/Check-out.
- Sinh viên tự Check-in bằng điện thoại.
- QR Token có thời gian hết hạn.
- Kiểm soát Time Window của điểm danh.
- Tích hợp trực tiếp với University Portal nếu được cung cấp API.
- Tích hợp Google Sheets API.
- Notification System.
- Email Notification.
- Student Engagement Analysis nâng cao.
- Machine Learning để phân nhóm hoặc dự đoán mức độ tham gia.


### 6. Ước tính ngân sách

Dự án sử dụng kiến trúc Serverless nhằm giảm chi phí khi hệ thống không được sử dụng.

Chi phí thực tế phụ thuộc vào:

- Số lượng người dùng.
- Số lượng hoạt động.
- Số lượng API Request.
- Kích thước và số lượng file upload.
- Dung lượng Amazon S3.
- Lambda Invocation và Execution Duration.
- DynamoDB Request.
- AWS Glue Usage.
- Athena Data Scanned.
- Amazon QuickSight Plan.
- CloudWatch Log Volume.

Có thể sử dụng [AWS Pricing Calculator](https://calculator.aws/) để tính chi phí chính xác sau khi hoàn thiện các thông số triển khai.

*Các thành phần chi phí*

- *AWS Amplify*: Hosting Web Application.
- *Amazon Cognito*: Phụ thuộc số Monthly Active Users.
- *Amazon API Gateway*: Tính theo số API Request.
- *AWS Lambda*: Tính theo Invocation và Execution Duration.
- *Amazon S3*: Storage và Request.
- *Amazon DynamoDB*: Có thể sử dụng On-Demand Capacity.
- *AWS Glue*: Chi phí khi chạy Crawler hoặc ETL Job.
- *Amazon Athena*: Tính theo lượng dữ liệu được quét.
- *Amazon QuickSight*: Phụ thuộc loại tài khoản và gói sử dụng.
- *Amazon CloudWatch*: Log Storage, Metrics và Alarm.
- *AWS IAM*: Không phát sinh chi phí trực tiếp.

*Chiến lược tối ưu chi phí*

- Sử dụng Serverless thay vì EC2 chạy liên tục.
- Sử dụng DynamoDB On-Demand cho workload không ổn định.
- Chỉ chạy Glue khi cần.
- Tối ưu cấu trúc dữ liệu để giảm Athena Data Scan.
- Thiết lập CloudWatch Log Retention.
- Sử dụng S3 Lifecycle khi cần.
- Xóa Resource thử nghiệm sau khi hoàn thành.
- Cấu hình AWS Budgets.
- Thiết lập Billing Alert.

*Mục tiêu ngân sách*

Phiên bản MVP được thiết kế để duy trì chi phí thấp trong môi trường học tập, thực tập và demo.

Chi phí chính thức sẽ được cập nhật bằng AWS Pricing Calculator sau khi hoàn thiện cấu hình triển khai thực tế.


### 7. Đánh giá rủi ro

*Ma trận rủi ro*

| Rủi ro | Ảnh hưởng | Xác suất |
|---|---|---|
| File Excel/CSV sai định dạng | Trung bình | Cao |
| MSSV thiếu hoặc sai | Cao | Trung bình |
| Dữ liệu trùng lặp | Trung bình | Trung bình |
| Cấu trúc file giữa các nguồn khác nhau | Cao | Trung bình |
| Dữ liệu không đồng nhất giữa các nguồn | Cao | Trung bình |
| Lambda xử lý file thất bại | Cao | Thấp |
| Quyền IAM cấu hình sai | Cao | Thấp |
| Người dùng truy cập sai quyền | Cao | Thấp |
| Rò rỉ dữ liệu sinh viên | Cao | Thấp |
| Chi phí AWS vượt dự kiến | Trung bình | Thấp |

*Chiến lược giảm thiểu*

- *File Format*: Xây dựng Template chuẩn cho từng loại file.
- *Validation*: Kiểm tra các trường bắt buộc trước khi xử lý.
- *MSSV Validation*: Chuẩn hóa và kiểm tra MSSV.
- *Duplicate Detection*: Sử dụng Activity ID kết hợp MSSV.
- *Error Handling*: Dữ liệu lỗi được đưa vào Validation Error List.
- *Raw Data Backup*: Giữ lại file gốc trên Amazon S3.
- *Monitoring*: Theo dõi Lambda Error và Duration bằng CloudWatch.
- *Authentication*: Sử dụng Amazon Cognito.
- *Authorization*: Sử dụng Role và Permission phù hợp.
- *Least Privilege*: Giới hạn quyền IAM theo Resource.
- *Data Protection*: Sử dụng dữ liệu giả lập hoặc đã ẩn danh trong môi trường phát triển nếu chưa có quyền sử dụng dữ liệu thật.
- *Cost Control*: AWS Budgets và Billing Alert.
- *Cleanup*: Xóa Resource thử nghiệm không còn sử dụng.

*Kế hoạch dự phòng*

- File xử lý thất bại có thể được upload lại.
- File gốc vẫn được giữ trên Amazon S3.
- Pipeline có thể chạy lại từ dữ liệu nguồn.
- Export File có thể được tạo lại từ dữ liệu trong hệ thống.
- Nếu Analytics Layer gặp lỗi, dữ liệu nguồn vẫn còn trên S3.
- Quy trình Excel hiện tại vẫn có thể được sử dụng trong trường hợp hệ thống thử nghiệm gặp sự cố.


### 8. Kết quả kỳ vọng

*Cải tiến quy trình*

Hệ thống tạo một nền tảng tập trung để quản lý dữ liệu liên quan đến hoạt động sinh viên.

Thay vì phải mở nhiều file Excel và tìm kiếm từng MSSV, Ban Tổ chức có thể xem kết quả đối soát trên một giao diện tập trung.

Hệ thống hỗ trợ nhận biết:

- Sinh viên có đầy đủ dữ liệu.
- Sinh viên thiếu Check-in.
- Sinh viên thiếu Check-out.
- Sinh viên thiếu minh chứng.
- Sinh viên đăng ký nhưng không có dữ liệu điểm danh.
- Sinh viên cần kiểm tra thủ công.

*Giảm công việc thủ công*

Registration, Check-in, Check-out và Evidence được hệ thống xử lý và đối chiếu tự động theo MSSV.

Ban Tổ chức chỉ tập trung xử lý các trường hợp ngoại lệ thay vì kiểm tra thủ công toàn bộ danh sách.

*Quản lý danh sách*

Sau đối soát, cán bộ có thể xác nhận:

- `CONFIRMED`
- `REJECTED`

Danh sách cuối cùng được khóa sau khi xác nhận.

Hệ thống hỗ trợ xuất:

- Registration List.
- Check-in List.
- Check-out List.
- Missing Check-in List.
- Missing Check-out List.
- Missing Evidence List.
- Registered but No Attendance List.
- Reconciliation List.
- Final Participation List.

Các file có thể được xuất dưới dạng Excel hoặc CSV.

*Phạm vi điểm của hoạt động*

Hệ thống có thể lưu mức điểm được quy định cho từng hoạt động.

Ví dụ:

```text
Activity: AWS Cloud Workshop
Activity Point Value: 5
Tuy nhiên, hệ thống không thực hiện cộng điểm rèn luyện chính thức vào tài khoản sinh viên.

Nền tảng chỉ lưu thông tin hoạt động và trạng thái tham gia đã được xác nhận.

Quá trình cộng điểm chính thức thuộc quy trình của Đoàn Trường và nằm ngoài phạm vi dự án.

Phân tích dữ liệu

Dashboard dự kiến cung cấp:

Total Activities.
Total Registrations.
Confirmed Participants.
Participation Rate.
No-show Rate.
Missing Check-in Rate.
Missing Check-out Rate.
Missing Evidence Rate.
Activities by Type.
Participation by Semester.
Participation Trends.

Ví dụ:

Total Registrations: 1,200
Confirmed Participants: 1,050

Participation Rate
= 1,050 / 1,200 × 100
= 87.5%

Khả năng mở rộng

Kiến trúc Serverless cho phép hệ thống xử lý các hoạt động quy mô khoảng 100–200 sinh viên và có thể mở rộng để phục vụ những chương trình có hơn 1.000 sinh viên mà không cần duy trì máy chủ chạy liên tục.

Bảo mật và giám sát

Hệ thống áp dụng:

Amazon Cognito Authentication.
Cognito Authorizer.
JWT Token.
AWS IAM Least Privilege.
Amazon CloudWatch Logs.
CloudWatch Metrics.
CloudWatch Alarms.
AWS Budgets và Billing Alerts.

Giá trị dài hạn

Dự án tạo ra một nền tảng dữ liệu có thể tiếp tục được phát triển để hỗ trợ công tác tổ chức hoạt động sinh viên.

Các hướng mở rộng trong tương lai gồm:

QR Check-in/Check-out động.
Student Self Check-in.
Portal Integration.
Google Sheets Integration.
Notification System.
Advanced Analytics.
Student Engagement Analysis.
Machine Learning.

Mục tiêu cuối cùng của dự án là chuyển quá trình xử lý dữ liệu sau hoạt động từ mô hình phân tán và phụ thuộc nhiều vào Excel thủ công sang một quy trình tập trung, có khả năng kiểm tra, đối soát, lưu trữ, theo dõi và phân tích trên nền tảng AWS.