---
title: "Worklog Tuần 11"
date: 2026-11-16
weight: 11
chapter: false
pre: "<b>1.11.</b>"
---

### Mục tiêu tuần 11:

* Chuẩn bị và thực hiện Demo dự án **Student Activity Management & Engagement Analytics Platform**.
* Rà soát toàn bộ chức năng của hệ thống trước khi trình bày.
* Hoàn thiện nội dung Workshop và Demo Presentation.
* Trình bày bài toán thực tế, mục tiêu và giải pháp của dự án.
* Giải thích kiến trúc triển khai thực tế và vai trò của 6 dịch vụ AWS.
* Demo các chức năng quản lý hoạt động, đăng ký, điểm danh, minh chứng, đối soát và phân tích dữ liệu.
* Trình bày quy trình AWS Lambda xử lý CSV từ Amazon S3.
* Phân biệt môi trường Web Application, AWS Pilot và Serverless Demo.
* Ghi nhận phản hồi từ người hướng dẫn và các thành viên tham gia.
* Phân loại các góp ý về chức năng, giao diện, dữ liệu, bảo mật và tài liệu.
* Khắc phục những vấn đề quan trọng dựa trên kết quả kiểm thử và phản hồi.
* Thực hiện Regression Testing sau khi chỉnh sửa hệ thống.
* Cập nhật Architecture Diagram, README, API Documentation, User Guide và Test Report.
* Chuẩn hóa source code và tài liệu trên GitHub.
* Tổng hợp các minh chứng kỹ thuật để chuẩn bị báo cáo thực tập và bàn giao dự án.
* Rà soát tài nguyên AWS và chi phí sử dụng dịch vụ.

### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | --- | --- | --- | --- |
| Thứ 2 | - Rà soát phiên bản Demo của hệ thống. <br> - Kiểm tra Frontend AWS Amplify và Backend FastAPI. <br> - Kiểm tra kết nối Cloudflare Tunnel và dữ liệu SQLite demo. <br> - Kiểm thử Authentication và phân quyền ADMIN/STUDENT. <br> - Kiểm tra các chức năng Activity Management, Registration Import, Attendance, Evidence Import, Reconciliation, Analytics và Export. <br> - Chuẩn bị tài khoản và dữ liệu giả lập phục vụ trình bày. <br> - Rà soát Demo Script và các hình ảnh minh chứng. <br> - Kiểm tra các tài nguyên AWS liên quan đến phần Demo. | 16/11/2026 | 16/11/2026 (dự kiến) | Demo Script, User Guide, Test Report và tài liệu dự án |
| Thứ 3 | - Dự kiến thực hiện Demo dự án **Student Activity Management & Engagement Analytics Platform**. <br> - Giới thiệu Problem Statement, Objectives và Proposed Solution. <br> - Trình bày kiến trúc thực tế của Web Application. <br> - Giới thiệu 6 dịch vụ AWS gồm Amplify, DynamoDB, S3, IAM, Lambda và CloudWatch. <br> - Demo các chức năng nghiệp vụ chính. <br> - Trình bày luồng Check-in/Check-out thời gian thực qua FastAPI. <br> - Demo hoặc giới thiệu kết quả xử lý CSV bằng AWS Lambda và Amazon S3. <br> - Giải thích cách kiểm tra CloudWatch Logs và IAM Permissions. <br> - Trả lời các câu hỏi kỹ thuật và ghi nhận góp ý. | 17/11/2026 | 17/11/2026 (dự kiến) | Demo Presentation, Architecture Diagram và AWS Test Evidence |
| Thứ 4 | - Tổng hợp phản hồi nhận được sau buổi Demo, nếu đã diễn ra. <br> - Phân loại góp ý theo các nhóm Functionality, UI/UX, Data Processing, Security, Analytics và Documentation. <br> - Xác định những lỗi ảnh hưởng trực tiếp đến chức năng chính. <br> - Phân biệt lỗi cần khắc phục trước khi bàn giao và đề xuất Future Development. <br> - Cập nhật danh sách Issues và mức độ ưu tiên xử lý. <br> - Đánh giá các giới hạn của môi trường Backend demo và Cloudflare Quick Tunnel. <br> - Rà soát khả năng bảo vệ dữ liệu và kiểm soát chi phí AWS. | 18/11/2026 | 18/11/2026 (dự kiến) | Demo Feedback, Issue List và Project Test Report |
| Thứ 5 | - Chỉnh sửa những vấn đề được xác nhận từ quá trình Demo và kiểm thử. <br> - Rà soát Authentication và Authorization. <br> - Kiểm tra các lỗi hiển thị danh sách hoạt động, tài khoản và dữ liệu tham gia. <br> - Cải thiện Validation và Error Handling khi Import dữ liệu. <br> - Kiểm tra lại Reconciliation và Analytics sau các thay đổi. <br> - Thực hiện Regression Testing cho các chức năng bị ảnh hưởng. <br> - Cập nhật tài liệu API, User Guide và Test Report. <br> - Ghi nhận các vấn đề chưa xử lý được và lý do. | 19/11/2026 | 19/11/2026 (dự kiến) | Source Code, Test Cases và Feedback |
| Thứ 6 | - Rà soát và chuẩn hóa GitHub Repository. <br> - Kiểm tra README, cấu trúc Frontend/Backend và hướng dẫn chạy hệ thống. <br> - Cập nhật AWS Architecture Diagram theo trạng thái triển khai cuối cùng. <br> - Tổng hợp screenshot của Amplify, DynamoDB Pilot, S3, IAM, Lambda và CloudWatch. <br> - Kiểm tra API Documentation, User Guide, Test Report và Demo Script. <br> - Rà soát AWS Billing và các tài nguyên đang tồn tại. <br> - Lưu trữ source code, dữ liệu giả và tài liệu phục vụ bàn giao. <br> - Chuẩn bị nội dung tổng kết và Internship Report. | 20/11/2026 | 20/11/2026 (dự kiến) | GitHub Repository, AWS Documentation và Internship Report |

### Kết quả dự kiến đạt được tuần 11:

* **1. Hoàn thiện công tác chuẩn bị Demo dự án:**
  * Kiểm tra trạng thái hoạt động của Frontend và Backend demo.
  * Xác minh kết nối giữa AWS Amplify, Cloudflare Tunnel và FastAPI.
  * Chuẩn bị tài khoản thử nghiệm dành cho ADMIN và STUDENT.
  * Sử dụng dữ liệu sinh viên giả để bảo vệ thông tin cá nhân.
  * Chuẩn bị tình huống Demo hợp lệ và không hợp lệ.
  * Hoàn thiện Demo Script và các bước trình bày.
  * Chuẩn bị phương án dự phòng nếu Backend hoặc Tunnel tạm thời không hoạt động.

* **2. Dự kiến trình bày thành công bài toán và giải pháp của dự án:**
  * Giới thiệu vấn đề quản lý dữ liệu tham gia hoạt động sinh viên.
  * Phân tích hạn chế của việc tổng hợp dữ liệu thủ công.
  * Trình bày mục tiêu xây dựng một hệ thống quản lý và đối soát tập trung.
  * Giải thích các nhóm chức năng và quy trình nghiệp vụ.
  * Nêu rõ phạm vi MVP và những chức năng dự kiến mở rộng.

* **3. Trình bày kiến trúc Web Application thực tế:**

  **User → AWS Amplify Hosting → Cloudflare Tunnel → FastAPI Backend → SQLite Demo**

  Các thành phần:
  * **React/Vite:** Xây dựng giao diện Web.
  * **AWS Amplify:** Triển khai Frontend.
  * **Cloudflare Tunnel:** Cung cấp HTTPS Endpoint tạm thời cho Backend.
  * **FastAPI:** Xử lý REST API và nghiệp vụ.
  * **SQLite:** Lưu dữ liệu trong môi trường demo.
  * **DynamoDB/S3 Pilot:** Các luồng thử nghiệm AWS có kiểm soát.

  Phần trình bày cần làm rõ rằng Backend hiện chưa được chuyển thành hệ thống serverless hoàn toàn trên AWS.

* **4. Trình bày 6 dịch vụ AWS trong phạm vi dự án:**

  | Dịch vụ | Vai trò thực tế |
  | --- | --- |
  | AWS Amplify | Hosting giao diện React/Vite |
  | Amazon DynamoDB | Thử nghiệm lưu trữ dữ liệu nghiệp vụ |
  | Amazon S3 | Lưu file và kết quả xử lý |
  | AWS IAM | Cấp quyền truy cập cho Lambda |
  | AWS Lambda | Xử lý file CSV trong quy trình demo |
  | Amazon CloudWatch | Ghi log và giám sát Lambda |

  * Phân biệt dịch vụ đang phục vụ Web Application với dịch vụ thuộc quy trình Serverless Demo.
  * Giới thiệu vai trò của từng thành phần.
  * Giải thích lý do lựa chọn phương án triển khai phù hợp với ngân sách.
  * Không trình bày Cognito, API Gateway, Glue, Athena hoặc QuickSight như những dịch vụ đã triển khai.

* **5. Dự kiến Demo các chức năng chính của hệ thống:**

  **Authentication:**
  * Đăng nhập bằng tài khoản ADMIN và STUDENT.
  * Kiểm tra quyền truy cập tương ứng.
  * Đăng xuất và xác minh phiên.

  **Activity Management:**
  * Xem danh sách hoạt động.
  * Tạo hoặc cập nhật hoạt động.
  * Kiểm tra trạng thái hoạt động.

  **Registration Import:**
  * Chọn file CSV/XLSX.
  * Preview và Validation.
  * Import danh sách đăng ký.

  **Realtime Attendance:**
  * Gửi Check-in bằng MSSV đến FastAPI.
  * Kiểm tra kết quả và timestamp.
  * Thực hiện Check-out.
  * Kiểm tra trường hợp trùng lặp hoặc không hợp lệ.

  **Evidence Import:**
  * Nhập dữ liệu minh chứng từ file.
  * Kiểm tra tính hợp lệ và liên kết với sinh viên.

  **Reconciliation:**
  * Tổng hợp Registration, Attendance và Evidence.
  * Xem các trạng thái cần kiểm tra.
  * Xác nhận hoặc điều chỉnh kết quả.

  **Analytics & Export:**
  * Hiển thị Dashboard thống kê.
  * Kiểm tra số liệu đăng ký và tham gia.
  * Xuất báo cáo Excel.

* **6. Dự kiến giới thiệu quy trình AWS Serverless Demo:**

  **Amazon S3 (CSV Input) → AWS Lambda → Amazon S3 (JSON Output)**

  Kết hợp:
  * AWS IAM cấp quyền đọc/ghi S3.
  * Amazon CloudWatch lưu log thực thi.

  Nội dung trình bày:
  * Lambda Function `sap-csv-processor-demo`.
  * Python 3.13 Runtime.
  * S3 Bucket `sap-data-project-2026-huflit01`.
  * Đầu vào `lambda-demo/input/registrations.csv`.
  * Đầu ra `lambda-demo/processed/registrations-result.json`.
  * IAM Inline Policy `SAP-Lambda-S3-Demo-Access`.
  * CloudWatch Log Group `/aws/lambda/sap-csv-processor-demo`.

  Kết quả đã kiểm thử từ tuần 10:

  ```json
  {
    "total": 4,
    "valid": 2,
    "duplicates": 1,
    "invalid": 1
  }
  ```

  Trong Demo, kết quả này sẽ được sử dụng làm minh chứng cho việc tích hợp Lambda, S3, IAM và CloudWatch.

* **7. Dự kiến thu thập và phân loại Feedback:**
  * **Functionality:** Các chức năng hoạt động chưa đúng yêu cầu.
  * **UI/UX:** Giao diện, khả năng điều hướng và thông báo.
  * **Data Processing:** Import, Validation và Reconciliation.
  * **Security:** Authentication, Authorization và quản lý dữ liệu.
  * **Analytics:** Độ chính xác của chỉ số thống kê.
  * **Documentation:** Nội dung README, sơ đồ và hướng dẫn sử dụng.

  Những góp ý thực tế sẽ được ghi nhận sau khi Demo diễn ra.

* **8. Dự kiến thực hiện các chỉnh sửa và Regression Testing:**
  * Kiểm tra và sửa lỗi đã được xác nhận.
  * Cập nhật giao diện hoặc Backend nếu cần thiết.
  * Kiểm thử lại những chức năng liên quan.
  * Xác minh các thao tác quản lý không làm ảnh hưởng dữ liệu ngoài phạm vi.
  * Kiểm tra kết quả Reconciliation và Analytics sau khi sửa lỗi.
  * Tổng hợp các lỗi chưa khắc phục và phương án xử lý.

* **9. Hoàn thiện tài liệu kỹ thuật của dự án:**
  * Project README.
  * AWS Architecture Diagram.
  * API Documentation.
  * User Guide.
  * Test Report.
  * Demo Script.
  * Workshop Presentation.
  * AWS Technical Evidence.

  Nội dung tài liệu phải nhất quán với kiến trúc đang được sử dụng.

* **10. Chuẩn hóa GitHub Repository:**
  * Kiểm tra cấu trúc source code.
  * Xác định các file cấu hình cần bảo vệ.
  * Rà soát README và hướng dẫn triển khai.
  * Kiểm tra đường dẫn Frontend và Backend.
  * Lưu lại các phiên bản và tài liệu phục vụ báo cáo.
  * Đảm bảo dữ liệu bí mật không được đưa vào GitHub.

* **11. Đánh giá hạn chế của phiên bản MVP:**
  * Backend demo phụ thuộc vào máy tính đang chạy FastAPI.
  * Cloudflare Quick Tunnel có địa chỉ tạm thời và có thể thay đổi.
  * SQLite được sử dụng trong môi trường demo, chưa phải cơ sở dữ liệu Production.
  * DynamoDB mới được tích hợp ở phạm vi AWS Pilot.
  * Lambda CSV Processor chưa được kết nối vào luồng Registration Import chính của Web Application.
  * Chức năng quét QR bằng camera chưa được xác nhận hoàn thiện.
  * Hệ thống chưa tích hợp trực tiếp với University Portal.
  * Chưa thực hiện kiểm thử tải lớn ở quy mô Production.

* **12. Đề xuất hướng phát triển trong tương lai:**
  * Triển khai Backend trên hạ tầng Cloud ổn định.
  * Nâng cấp cơ chế xác thực và bảo mật phù hợp với môi trường Production.
  * Mở rộng tích hợp DynamoDB hoặc cơ sở dữ liệu được quản lý.
  * Tự động hóa quy trình xử lý file bằng S3 Event Notifications và Lambda khi phù hợp.
  * Tích hợp QR Scanner trực tiếp với hệ thống điểm danh.
  * Kết nối dữ liệu đăng ký với University Portal.
  * Bổ sung Notification và các chức năng hỗ trợ người dùng.
  * Nâng cao Dashboard và khả năng phân tích dữ liệu.
  * Thực hiện Performance Testing và kiểm thử tải lớn.

### Khó khăn dự kiến và bài học cần tổng kết:

* **Chuẩn bị Demo:** Cần có kịch bản rõ ràng và dữ liệu thử nghiệm ổn định để tránh thao tác nhầm trong lúc trình bày.
* **Phụ thuộc Backend local:** Nếu máy tính hoặc Cloudflare Tunnel ngừng hoạt động, website có thể không truy cập được API.
* **Kiến trúc AWS:** Cần giải thích chính xác vai trò của 6 dịch vụ, không nhầm AWS Pilot hoặc Lambda Demo với Backend Production.
* **Xử lý Feedback:** Những góp ý cần được phân loại theo mức độ ảnh hưởng và khả năng hoàn thiện.
* **Regression Testing:** Khi sửa một chức năng, cần kiểm tra lại các chức năng liên quan.
* **Quản lý tài liệu:** README, Architecture Diagram và API Documentation phải thống nhất với source code thực tế.
* **Kiểm soát chi phí:** Các tài nguyên AWS cần được theo dõi trong suốt quá trình thực hiện Demo và bàn giao.
* **Bảo vệ dữ liệu:** Minh chứng và dữ liệu thử nghiệm phải được chọn lọc trước khi đưa vào báo cáo công khai.

### Định hướng tuần tiếp theo:

* Hoàn thiện Worklog từ tuần 1 đến tuần 12.
* Kiểm tra sự thống nhất giữa bản tiếng Việt và tiếng Anh.
* Hoàn thiện Proposal, Workshop, Self-evaluation và Sharing and Feedback.
* Rà soát các nội dung báo cáo thực tập.
* Hoàn thiện sơ đồ kiến trúc và tài liệu kỹ thuật phiên bản cuối.
* Kiểm tra website báo cáo Hugo và GitHub Repository.
* Tổng hợp screenshot, kết quả kiểm thử và minh chứng AWS.
* Rà soát AWS Billing và các tài nguyên đang hoạt động.
* Chuẩn bị nộp báo cáo và bàn giao dự án.