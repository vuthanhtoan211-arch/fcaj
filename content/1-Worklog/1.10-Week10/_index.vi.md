---
title: "Worklog Tuần 10"
date: 2026-11-09
weight: 10
chapter: false
pre: "<b>1.10.</b>"
---

### Mục tiêu tuần 10:

* Tiếp tục hoàn thiện dự án **Student Activity Management & Engagement Analytics Platform**.
* Kiểm tra kết quả triển khai Frontend trên AWS Amplify Hosting.
* Kiểm thử kết nối giữa AWS Amplify Frontend và FastAPI Backend thông qua Cloudflare Tunnel.
* Rà soát các chức năng chính và xác nhận phạm vi triển khai thực tế của hệ thống.
* Tổng hợp các kết quả nghiên cứu và kiểm thử Amazon DynamoDB Pilot.
* Nghiên cứu và thực hành AWS Lambda để xử lý dữ liệu theo kiến trúc Serverless.
* Sử dụng Amazon S3 để lưu trữ dữ liệu đầu vào và kết quả xử lý.
* Thiết lập AWS IAM Role và Policy theo nguyên tắc Least Privilege.
* Tích hợp AWS Lambda với Amazon S3 để đọc file CSV và xuất kết quả JSON.
* Thực hiện kiểm thử xử lý dữ liệu đăng ký sinh viên bằng dữ liệu giả lập.
* Sử dụng Amazon CloudWatch để theo dõi log và kết quả thực thi Lambda.
* Kiểm tra thời gian thực thi, bộ nhớ sử dụng và khả năng xử lý lỗi của Lambda.
* Quản lý thời gian lưu trữ CloudWatch Logs để hạn chế chi phí phát sinh.
* Tổng hợp kiến trúc và minh chứng thực hành của 6 dịch vụ AWS.
* Chuẩn bị tài liệu kỹ thuật, README, Demo Script và báo cáo thực tập.
* Rà soát tài nguyên AWS và AWS Billing nhằm bảo đảm việc sử dụng dịch vụ phù hợp với ngân sách.

### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | --- | --- | --- | --- |
| Thứ 2 | - Rà soát dự án **Student Activity Management & Engagement Analytics Platform**. <br> - Kiểm tra cấu trúc source code React/Vite và FastAPI. <br> - Kiểm tra cấu hình AWS Amplify Hosting và trạng thái triển khai Frontend. <br> - Rà soát kết nối Frontend với Backend demo thông qua Cloudflare Tunnel. <br> - Kiểm tra các chức năng Authentication, Activity Management, Registration Import, Attendance, Reconciliation, Analytics và Export. <br> - Tổng hợp phạm vi các dịch vụ AWS đã nghiên cứu và thử nghiệm. <br> - Phân biệt hệ thống đang hoạt động với kiến trúc AWS đề xuất ban đầu. | 09/11/2026 | 09/11/2026 | Tài liệu dự án, GitHub Repository và AWS Amplify Documentation |
| Thứ 3 | - Nghiên cứu quy trình xử lý dữ liệu Serverless bằng AWS Lambda. <br> - Tạo Lambda Function `sap-csv-processor-demo` bằng Python 3.13 tại Region Singapore. <br> - Chuẩn bị thư mục `lambda-demo/input/` và `lambda-demo/processed/` trên Amazon S3. <br> - Upload file `registrations.csv` chứa dữ liệu sinh viên giả lập lên S3. <br> - Thiết lập IAM Execution Role và Inline Policy cho Lambda. <br> - Giới hạn quyền `s3:GetObject` đối với thư mục input và `s3:PutObject` đối với thư mục processed. <br> - Xây dựng Lambda Function đọc CSV, kiểm tra MSSV, phát hiện trùng lặp và dữ liệu không hợp lệ. <br> - Thực hiện Deploy và Test Lambda. <br> - Kiểm tra file JSON kết quả được ghi lên S3. <br> - Truy cập CloudWatch Logs, kiểm tra thời gian chạy và cấu hình Log Retention 7 ngày. | 10/11/2026 | 10/11/2026 | https://docs.aws.amazon.com/lambda/ <br> https://docs.aws.amazon.com/s3/ <br> https://docs.aws.amazon.com/iam/ <br> https://docs.aws.amazon.com/cloudwatch/ |
| Thứ 4 — Dự kiến | - Rà soát lại các bài kiểm thử DynamoDB Pilot. <br> - Kiểm tra tài liệu liên quan đến các bảng `SAP-Activities`, `SAP-Registrations`, `SAP-Attendance`, `SAP-Evidence` và `SAP-Participation`. <br> - Tổng hợp kết quả thử nghiệm lưu trữ dữ liệu nghiệp vụ trên AWS. <br> - Kiểm tra sự khác biệt giữa dữ liệu SQLite của Backend demo và dữ liệu DynamoDB Pilot. <br> - Chuẩn bị bảng tổng hợp chức năng của từng dịch vụ AWS. <br> - Xây dựng Demo Script mô tả các luồng xử lý chính. <br> - Thu thập screenshot và thông tin kỹ thuật phục vụ báo cáo. | 11/11/2026 | 11/11/2026 (dự kiến) | Tài liệu AWS Pilot, Test Scripts và DynamoDB Documentation |
| Thứ 5 — Dự kiến | - Rà soát sơ đồ kiến trúc AWS của dự án. <br> - Cập nhật Architecture Diagram theo 6 dịch vụ AWS đang sử dụng hoặc thử nghiệm. <br> - Phân biệt luồng Web Application và luồng AWS Lambda xử lý CSV. <br> - Cập nhật README và các hướng dẫn cài đặt, cấu hình, chạy Demo. <br> - Chuẩn bị nội dung Workshop/Presentation: Problem Statement, Solution, Architecture, Data Flow và AWS Services. <br> - Kiểm tra các tài liệu API, User Guide và Test Report. <br> - Chuẩn bị phương án dự phòng khi Backend demo hoặc Cloudflare Tunnel không hoạt động. | 12/11/2026 | 12/11/2026 (dự kiến) | GitHub Repository, README, Architecture Diagram và tài liệu dự án |
| Thứ 6 — Dự kiến | - Tổng hợp kết quả triển khai 6 dịch vụ AWS: Amplify, DynamoDB, S3, IAM, Lambda và CloudWatch. <br> - Kiểm tra trạng thái tài nguyên đang hoạt động. <br> - Rà soát AWS Billing và các dịch vụ có khả năng phát sinh chi phí. <br> - Kiểm tra CloudWatch Log Retention và các file dữ liệu thử nghiệm trong S3. <br> - Hoàn thiện bảng minh chứng kỹ thuật cho báo cáo thực tập. <br> - Rà soát source code và tài liệu trên GitHub. <br> - Xây dựng danh sách các hạn chế của MVP và hướng phát triển tương lai. <br> - Tổng hợp nội dung Self-evaluation và chuẩn bị cho giai đoạn Demo, Feedback, bàn giao. | 13/11/2026 | 13/11/2026 (dự kiến) | AWS Billing, AWS Documentation, GitHub Repository và Internship Report |

### Kết quả đạt được tính đến ngày 10/11/2026:

* **1. Tổng hợp kiến trúc thực tế của dự án:**

  Hệ thống hiện tại được phát triển bằng các công nghệ:
  * React + Vite cho Frontend.
  * Python + FastAPI cho Backend REST API.
  * SQLite cho môi trường local và demo.
  * AWS Amplify để triển khai Frontend.
  * Cloudflare Tunnel để cung cấp HTTPS Endpoint tạm thời cho Backend demo.
  * Amazon DynamoDB và Amazon S3 trong các luồng AWS Pilot.
  * AWS Lambda, IAM và CloudWatch trong quy trình thử nghiệm xử lý CSV riêng biệt.

  Luồng hoạt động của Web Application:

  **User → AWS Amplify Hosting → Cloudflare Tunnel → FastAPI Backend → SQLite Demo**

  Đây là kiến trúc demo, chưa phải mô hình Backend hoàn toàn chạy trên AWS Production.

* **2. Rà soát AWS Amplify Hosting:**
  * Xác định AWS Amplify là dịch vụ triển khai giao diện React/Vite.
  * Sử dụng GitHub làm nguồn mã triển khai.
  * Sử dụng nhánh `main`.
  * Cấu hình API Base URL bằng biến môi trường `VITE_API_BASE_URL`.
  * Kiểm tra yêu cầu HTTPS khi Frontend kết nối Backend công khai.
  * Ghi nhận địa chỉ Web Application:

    `https://main.d2p96elhe5x6se.amplifyapp.com`

  * Xác định rằng Frontend được triển khai trên AWS, còn Backend demo vẫn chạy riêng trong môi trường local.

* **3. Tổng hợp quá trình nghiên cứu Amazon DynamoDB Pilot:**
  * Nghiên cứu cơ chế lưu trữ dữ liệu nghiệp vụ trên Amazon DynamoDB.
  * Xác định các bảng dữ liệu:
    * `SAP-Activities`.
    * `SAP-Registrations`.
    * `SAP-Attendance`.
    * `SAP-Evidence`.
    * `SAP-Participation`.
  * Nghiên cứu và phát triển các cơ chế AWS Pilot cho Activity, Registration, Attendance, Evidence và Participation.
  * Tìm hiểu cách sử dụng Boto3 để truy cập DynamoDB.
  * Áp dụng dữ liệu giả và hoạt động thử nghiệm để hạn chế ảnh hưởng đến dữ liệu thật.
  * Tiếp tục phân biệt dữ liệu vận hành của Backend demo và dữ liệu AWS Pilot.

  **Lưu ý:** DynamoDB là thành phần Pilot, không phải cơ sở dữ liệu chính của toàn bộ Web Application trong môi trường demo.

* **4. Tích hợp Amazon S3 cho quy trình xử lý dữ liệu thử nghiệm:**
  * Sử dụng S3 Bucket:

    `sap-data-project-2026-huflit01`

  * Tạo cấu trúc lưu trữ phục vụ Lambda demo:
    * `lambda-demo/input/`.
    * `lambda-demo/processed/`.
  * Chuẩn bị file CSV chứa dữ liệu sinh viên giả lập.
  * Upload thành công file:

    `lambda-demo/input/registrations.csv`

  * Sử dụng S3 làm nơi lưu file đầu vào và kết quả xử lý.
  * Kiểm tra đối tượng đầu ra sau khi Lambda thực thi.

* **5. Triển khai AWS Lambda xử lý CSV:**
  * Tạo Lambda Function:

    `sap-csv-processor-demo`

  * Region: `ap-southeast-1` (Singapore).
  * Runtime: Python 3.13.
  * Architecture: x86_64.
  * Memory: 128 MB.
  * Timeout: 10 giây.

  Xây dựng chức năng xử lý:
  * Đọc file CSV từ Amazon S3.
  * Kiểm tra sự tồn tại của cột `mssv`.
  * Đọc và đếm tổng số bản ghi.
  * Phát hiện MSSV hợp lệ.
  * Phát hiện MSSV trùng lặp.
  * Phát hiện MSSV trống hoặc không hợp lệ.
  * Tổng hợp kết quả dưới dạng JSON.
  * Ghi kết quả xử lý trở lại Amazon S3.
  * Ghi thông tin thực thi vào CloudWatch Logs.

* **6. Thiết lập AWS IAM theo nguyên tắc Least Privilege:**
  * Sử dụng Lambda Execution Role:

    `sap-csv-processor-demo-role-9ui2ib5d`

  * Cấu hình Policy ghi log cơ bản cho Lambda.
  * Tạo Inline Policy:

    `SAP-Lambda-S3-Demo-Access`

  * Chỉ cấp quyền cần thiết:
    * `s3:GetObject` cho `lambda-demo/input/*`.
    * `s3:PutObject` cho `lambda-demo/processed/*`.
  * Không cấp quyền truy cập toàn bộ các file trong S3 Bucket.
  * Không cấp các quyền xóa file hoặc quản lý Bucket không cần thiết.
  * Hiểu rõ vai trò của IAM Execution Role trong việc cho phép Lambda tương tác với AWS Services.

* **7. Kiểm thử Lambda với dữ liệu sinh viên giả lập:**

  Dữ liệu đầu vào:

  | MSSV | Họ tên | Trạng thái |
  | --- | --- | --- |
  | DEMO001 | Student Demo One | Hợp lệ |
  | DEMO002 | Student Demo Two | Hợp lệ |
  | DEMO001 | Student Demo Duplicate | Trùng MSSV |
  | Trống | Student Demo Invalid | Không hợp lệ |

  Kết quả xử lý thực tế:

  ```json
  {
    "total": 4,
    "valid": 2,
    "duplicates": 1,
    "invalid": 1
  }
  ```

  * Lambda được Deploy thành công.
  * Thực hiện Test và nhận `statusCode: 200`.
  * Kết quả trả về đúng với dữ liệu đầu vào.
  * Xác nhận Lambda có thể đọc và xử lý dữ liệu từ S3.
  * Xác nhận kết quả được lưu tại:

    `lambda-demo/processed/registrations-result.json`

* **8. Kiểm tra kết quả thực thi trên Amazon CloudWatch:**
  * Truy cập Log Group:

    `/aws/lambda/sap-csv-processor-demo`

  * Kiểm tra các sự kiện START, END và REPORT.
  * Xác nhận có log xử lý dữ liệu CSV thành công.
  * Kết quả thực thi được ghi nhận:
    * Duration: 404.97 ms.
    * Memory Size: 128 MB.
    * Max Memory Used: 93 MB.
  * Kiểm tra log để xác nhận dữ liệu được xử lý đúng.
  * Cấu hình Log Retention thành **1 tuần (7 ngày)**.
  * Hiểu vai trò của CloudWatch trong theo dõi và hỗ trợ debug Lambda.

* **9. Hoàn thành luồng tích hợp Serverless độc lập:**

  **Amazon S3 (CSV Input) → AWS Lambda (Python Processing) → Amazon S3 (JSON Output)**

  Các thành phần hỗ trợ:
  * AWS IAM: Cấp quyền để Lambda đọc/ghi S3 và ghi log.
  * Amazon CloudWatch: Theo dõi thông tin và kết quả thực thi.

  Luồng xử lý:
  * File Registration CSV được upload lên S3.
  * Lambda được gọi thủ công bằng Test Event.
  * Lambda đọc dữ liệu từ S3.
  * Python xử lý và phân loại các bản ghi.
  * Kết quả JSON được ghi trở lại S3.
  * CloudWatch lưu thông tin thực thi.

  **Lưu ý:** Đây là quy trình Serverless demo riêng. Lambda chưa được tích hợp làm Backend chính và chưa tự động thay thế API Registration Import của hệ thống FastAPI.

* **10. Tổng hợp 6 dịch vụ AWS của dự án:**

  | Dịch vụ AWS | Vai trò | Phạm vi |
  | --- | --- | --- |
  | AWS Amplify | Triển khai giao diện React/Vite | Frontend Hosting |
  | Amazon DynamoDB | Thử nghiệm lưu dữ liệu nghiệp vụ | AWS Pilot |
  | Amazon S3 | Lưu file và dữ liệu thử nghiệm | Storage / Lambda Demo |
  | AWS IAM | Phân quyền truy cập AWS | Lambda Execution Role |
  | AWS Lambda | Xử lý dữ liệu Registration CSV | Serverless Demo |
  | Amazon CloudWatch | Theo dõi log và kết quả Lambda | Monitoring / Logging |

* **11. Kiểm soát tài nguyên và chi phí AWS:**
  * Giới hạn Lambda ở mức 128 MB RAM và thời gian chạy tối đa 10 giây.
  * Sử dụng bộ dữ liệu nhỏ phục vụ thử nghiệm.
  * Tránh triển khai các tài nguyên AWS không cần thiết cho mục tiêu Demo.
  * Cấu hình CloudWatch Log Retention 7 ngày.
  * Nghiên cứu cách kiểm tra mức sử dụng dịch vụ qua AWS Billing.
  * Nhận thức rằng chi phí AWS có thể được cập nhật sau thời điểm sử dụng, không xem số tiền hiện tại bằng 0 là bảo đảm không phát sinh phí.

### Kết quả dự kiến hoàn thiện từ 11/11 đến 13/11/2026:

* Tổng hợp và đối chiếu các bài kiểm thử DynamoDB Pilot.
* Hoàn thiện Architecture Diagram với 6 dịch vụ AWS.
* Cập nhật README để phản ánh đúng kiến trúc triển khai.
* Chuẩn bị Demo Script và các tình huống trình bày.
* Tổng hợp screenshot chứng minh AWS Amplify, DynamoDB, S3, IAM, Lambda và CloudWatch.
* Kiểm tra tài liệu API, User Guide và Test Report.
* Rà soát GitHub Repository và cấu trúc source code.
* Kiểm tra AWS Billing và các tài nguyên không còn cần thiết.
* Chuẩn bị nội dung Workshop, Self-evaluation và báo cáo thực tập.

### Khó khăn và bài học kinh nghiệm:

* **Tích hợp nhiều dịch vụ AWS:** Cần phân biệt rõ chức năng và vai trò của từng dịch vụ trong kiến trúc để tránh sử dụng sai mục đích.
* **Cấu hình IAM:** Lambda phải có đúng quyền đọc file đầu vào và ghi file kết quả trên S3. Việc giới hạn quyền giúp giảm rủi ro bảo mật.
* **Xử lý dữ liệu CSV:** Dữ liệu đầu vào có thể bị trùng, thiếu MSSV hoặc không hợp lệ nên cần kiểm tra trước khi sử dụng.
* **Kiểm thử Serverless:** Cần kiểm tra cả kết quả Lambda Test, file JSON trên S3 và log CloudWatch để xác nhận toàn bộ quy trình hoạt động.
* **Phân biệt Demo và Production:** Website đang dùng FastAPI Backend riêng; Lambda xử lý CSV là một thành phần thử nghiệm, chưa phải Backend chính.
* **Monitoring:** CloudWatch giúp xác định thời gian xử lý, bộ nhớ sử dụng và các lỗi khi Lambda thực thi.
* **Kiểm soát chi phí:** Cần giới hạn tài nguyên, xóa dữ liệu thử nghiệm không cần thiết và thường xuyên theo dõi AWS Billing.
* **Ghi nhận minh chứng:** Screenshot, kết quả Test và tài liệu kỹ thuật rất quan trọng để chứng minh việc triển khai dịch vụ AWS trong báo cáo thực tập.

### Định hướng tuần tiếp theo:

* Chuẩn bị và thực hiện Demo dự án.
* Kiểm tra lại toàn bộ các chức năng chính trước khi trình bày.
* Trình bày kiến trúc hệ thống và 6 dịch vụ AWS đã sử dụng.
* Demo luồng nghiệp vụ Web Application.
* Demo quy trình Amazon S3 → AWS Lambda → Amazon S3.
* Ghi nhận phản hồi từ người hướng dẫn và người tham gia.
* Phân loại các lỗi và đề xuất cải tiến.
* Hoàn thiện Architecture Diagram, README, API Documentation và User Guide.
* Chuẩn bị phiên bản cuối để phục vụ báo cáo và bàn giao.