---
title: "Worklog Tuần 2"
date: 2026-09-14
weight: 2
chapter: false
pre: "<b>1.2.</b>"
---

### Mục tiêu tuần 2:

* Xác định đề tài và phạm vi triển khai của dự án thực tập.
* Phân tích bài toán thực tế về quản lý, theo dõi và đánh giá mức độ tham gia hoạt động của sinh viên.
* Xác định các nhóm người dùng và phân quyền cơ bản của hệ thống.
* Khảo sát những nguồn dữ liệu đầu vào phục vụ quản lý hoạt động sinh viên.
* Xây dựng quy trình nghiệp vụ từ đăng ký, điểm danh, thu thập minh chứng đến đối soát và xác nhận kết quả tham gia.
* Xác định các quy tắc xử lý dữ liệu Registration, Attendance và Evidence.
* Nghiên cứu các công nghệ phù hợp để xây dựng Frontend, Backend và hệ thống lưu trữ dữ liệu.
* Tìm hiểu và lựa chọn các dịch vụ AWS phù hợp với yêu cầu của dự án và khả năng kiểm soát chi phí.
* Thiết kế kiến trúc hệ thống ở mức tổng quan, phân biệt thành phần phát triển local và thành phần dự kiến tích hợp AWS.
* Xây dựng mô hình dữ liệu ban đầu và chuẩn bị dữ liệu giả lập phục vụ các giai đoạn phát triển, kiểm thử sau này.

### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | --- | --- | --- | --- |
| Thứ 2 | - Nghiên cứu và xác định đề tài **Student Activity Management & Engagement Analytics Platform**. <br> - Phân tích những khó khăn trong việc quản lý dữ liệu tham gia hoạt động sinh viên bằng nhiều nguồn khác nhau. <br> - Xác định mục tiêu tổng quát và phạm vi của phiên bản MVP. <br> - Xác định các nhóm chức năng chính: Activity Management, Registration, Attendance, Evidence, Reconciliation, Analytics và Export. <br> - Phác thảo các yêu cầu chức năng và phi chức năng của hệ thống. | 14/09/2026 | 14/09/2026 | Tài liệu đề xuất dự án và https://cloudjourney.awsstudygroup.com/ |
| Thứ 3 | - Phân tích các nhóm người dùng của hệ thống. <br> - Xác định hai vai trò chính là **ADMIN** và **STUDENT**. <br> - Xác định quyền quản lý hoạt động, tài khoản sinh viên, danh sách đăng ký và kết quả tham gia của ADMIN. <br> - Xác định quyền xem hoạt động, quản lý hồ sơ và theo dõi kết quả cá nhân của STUDENT. <br> - Phân tích nguồn dữ liệu Registration từ hệ thống đăng ký của trường. <br> - Phân tích nguồn dữ liệu Evidence từ Google Forms/Google Sheets được xuất thành file CSV/XLSX. <br> - Xác định yêu cầu bảo mật và giới hạn quyền truy cập dữ liệu. | 15/09/2026 | 15/09/2026 | Tài liệu Proposal, tài liệu yêu cầu hệ thống |
| Thứ 4 | - Xây dựng quy trình nghiệp vụ đăng ký và ghi nhận tham gia hoạt động. <br> - Xác định Registration được nhập từ dữ liệu nguồn thông qua chức năng Preview và Import. <br> - Phân tích quy trình Check-in/Check-out bằng mã QR trên thẻ sinh viên. <br> - Xác định yêu cầu API nhận sự kiện điểm danh và ghi nhận thời gian ngay khi thao tác. <br> - Xây dựng quy tắc kiểm tra sinh viên có nằm trong danh sách đăng ký hay không. <br> - Xác định cách xử lý trường hợp Check-in trùng, Check-out không hợp lệ hoặc thiếu sự kiện điểm danh. <br> - Phân tích vai trò của Evidence trong việc xác minh và đối soát dữ liệu tham gia. | 16/09/2026 | 16/09/2026 | Tài liệu nghiệp vụ và Proposal của dự án |
| Thứ 5 | - Thiết kế kiến trúc tổng thể của hệ thống. <br> - Lựa chọn **React và Vite** cho Frontend. <br> - Lựa chọn **Python và FastAPI** cho Backend REST API. <br> - Nghiên cứu SQLite làm cơ sở dữ liệu cho môi trường phát triển local và demo. <br> - Tìm hiểu Amazon DynamoDB để thử nghiệm lưu trữ dữ liệu nghiệp vụ trên AWS. <br> - Tìm hiểu Amazon S3 để lưu file và dữ liệu xử lý. <br> - Nghiên cứu AWS Amplify phục vụ triển khai Frontend. <br> - Tìm hiểu AWS IAM, Lambda và CloudWatch phục vụ phân quyền, xử lý serverless và ghi log. <br> - Phân biệt kiến trúc được đề xuất với những thành phần thực tế sẽ triển khai trong các tuần sau. | 17/09/2026 | 17/09/2026 | https://docs.aws.amazon.com/ <br> https://fastapi.tiangolo.com/ <br> https://vite.dev/ |
| Thứ 6 | - Thiết kế mô hình dữ liệu ban đầu cho các nhóm: Activities, Students, Registrations, Attendance, Evidence, Participation và Users. <br> - Xác định các trường dữ liệu quan trọng như Activity ID, MSSV, thời gian Check-in/Check-out và trạng thái tham gia. <br> - Phác thảo các REST API cần phát triển. <br> - Xác định luồng xử lý **Registration → Attendance → Evidence → Reconciliation → Analytics/Export**. <br> - Chuẩn bị các trường hợp dữ liệu giả: đăng ký hợp lệ, dữ liệu trùng, thiếu Check-in, thiếu Check-out và thiếu Evidence. <br> - Tổng hợp kết quả phân tích yêu cầu, cập nhật Proposal và lên kế hoạch xây dựng Backend trong tuần tiếp theo. | 18/09/2026 | 18/09/2026 | Tài liệu Proposal, AWS Documentation và tài liệu thiết kế hệ thống |

### Kết quả đạt được tuần 2:

* **Xác định được đề tài và định hướng phát triển:**
  * Lựa chọn đề tài **Student Activity Management & Engagement Analytics Platform**.
  * Xác định mục tiêu xây dựng hệ thống Web hỗ trợ quản lý hoạt động, ghi nhận tham gia, đối soát và phân tích dữ liệu sinh viên.
  * Xác định phiên bản MVP tập trung vào các chức năng nghiệp vụ chính trước khi mở rộng khả năng triển khai trên AWS.

* **Phân tích được bài toán thực tế:**
  * Dữ liệu đăng ký, điểm danh và minh chứng có thể được thu thập từ nhiều nguồn độc lập.
  * Việc tổng hợp thủ công dễ xảy ra tình trạng thiếu dữ liệu, trùng lặp và khó xác định kết quả tham gia chính xác.
  * Hệ thống cần cung cấp quy trình tập trung để kiểm tra, đối chiếu và xác nhận kết quả.
  * Dữ liệu sau khi đối soát cần được sử dụng để thống kê và xuất báo cáo.

* **Xác định được hai vai trò chính của hệ thống:**

  **ADMIN:**
  * Quản lý hoạt động và trạng thái công bố.
  * Quản lý tài khoản sinh viên.
  * Nhập dữ liệu đăng ký và minh chứng.
  * Thực hiện hoặc quản lý thao tác điểm danh.
  * Đối soát, xác nhận kết quả tham gia.
  * Xem Analytics và xuất báo cáo.

  **STUDENT:**
  * Đăng nhập và quản lý hồ sơ cá nhân.
  * Xem danh sách, chi tiết hoạt động.
  * Theo dõi lịch sử và kết quả tham gia của bản thân.
  * Nhận các thông báo được phép truy cập.

* **Xác định được các nguồn dữ liệu đầu vào:**
  * **Registration:** Dữ liệu sinh viên đăng ký từ hệ thống của trường, nhập vào bằng CSV/XLSX.
  * **Attendance:** Sự kiện Check-in/Check-out gửi trực tiếp đến API khi Ban tổ chức thao tác quét mã hoặc nhập MSSV.
  * **Evidence:** Dữ liệu minh chứng từ Google Forms/Google Sheets, có thể xuất thành CSV/XLSX.
  * **Activity:** Thông tin hoạt động được quản lý trực tiếp trên hệ thống.

* **Xây dựng được các quy tắc nghiệp vụ cơ bản:**
  * Dữ liệu đăng ký phải được kiểm tra trước khi Import.
  * Sinh viên cần có đăng ký hợp lệ trước khi được ghi nhận tham gia theo quy trình điểm danh.
  * Check-in và Check-out được thiết kế là sự kiện API thời gian thực, không phải dữ liệu chủ yếu nhập hàng loạt từ Excel.
  * Các thao tác điểm danh trùng lặp hoặc không đúng trạng thái cần được phát hiện.
  * Evidence được dùng kết hợp với Registration và Attendance trong quá trình đối soát.
  * Những trường hợp thiếu dữ liệu được đánh dấu để ADMIN xem xét.
  * Kết quả cuối cùng cần được xác nhận trước khi xuất báo cáo.

* **Hoàn thiện luồng xử lý dữ liệu tổng quát:**

  **Activity Management → Registration Import → Realtime Attendance → Evidence Import → Reconciliation → Participation Result → Analytics & Export**

  Trong đó:
  * ADMIN tạo và quản lý hoạt động.
  * Dữ liệu đăng ký được kiểm tra và nhập vào hệ thống.
  * Check-in/Check-out được ghi nhận ngay khi có thao tác.
  * Minh chứng được nhập và kiểm tra tính hợp lệ.
  * Backend đối soát các nguồn dữ liệu.
  * Kết quả được tổng hợp phục vụ thống kê và báo cáo.

* **Đề xuất được kiến trúc công nghệ cho dự án:**
  * **React + Vite:** Phát triển giao diện Web.
  * **FastAPI + Python:** Xây dựng REST API và xử lý nghiệp vụ.
  * **SQLite:** Lưu dữ liệu phục vụ phát triển và demo local.
  * **AWS Amplify:** Dự kiến triển khai Frontend lên Cloud.
  * **Amazon DynamoDB:** Dự kiến nghiên cứu và thử nghiệm các luồng lưu trữ dữ liệu nghiệp vụ.
  * **Amazon S3:** Dự kiến lưu trữ poster, file dữ liệu và kết quả xử lý.
  * **AWS IAM:** Nghiên cứu quản lý quyền truy cập giữa các dịch vụ.
  * **AWS Lambda:** Nghiên cứu xử lý dữ liệu serverless.
  * **Amazon CloudWatch:** Nghiên cứu theo dõi log và trạng thái thực thi.

  Đây là **kiến trúc và kế hoạch được đề xuất trong tuần 2**, chưa phải kết quả triển khai toàn bộ dịch vụ AWS.

* **Phân biệt được kiến trúc nghiên cứu và kiến trúc triển khai:**
  * Amazon Cognito và Amazon API Gateway được xem xét như các lựa chọn trong kiến trúc serverless.
  * AWS Glue, Amazon Athena và Amazon QuickSight được tìm hiểu ở mức định hướng phân tích dữ liệu mở rộng.
  * Chưa đưa các dịch vụ này vào danh sách chức năng đã triển khai.
  * Ưu tiên phát triển và kiểm thử Backend bằng FastAPI trước khi tích hợp AWS.

* **Xây dựng mô hình dữ liệu ban đầu:**
  * Activities.
  * Students.
  * Registrations.
  * Attendance.
  * Evidence.
  * Participation.
  * Users.

  Bước đầu xác định mối quan hệ giữa Activity ID, MSSV, Registration, Attendance và kết quả tham gia.

* **Chuẩn bị được các tình huống kiểm thử bằng dữ liệu giả:**
  * Sinh viên đăng ký và tham gia đầy đủ.
  * Sinh viên không có trong danh sách đăng ký.
  * Dữ liệu MSSV bị trùng.
  * Thiếu Check-in.
  * Thiếu Check-out.
  * Thiếu minh chứng.
  * Có dữ liệu đăng ký nhưng không có điểm danh.
  * Dữ liệu cần được xác nhận thủ công.

* **Hoàn thiện định hướng cho giai đoạn tiếp theo:**
  * Phác thảo các module và REST API cần xây dựng.
  * Lựa chọn phương pháp phát triển local trước, triển khai AWS sau.
  * Ưu tiên dữ liệu giả nhằm bảo vệ thông tin sinh viên và hạn chế chi phí AWS.
  * Chuẩn bị các yêu cầu và tài liệu làm cơ sở phát triển Backend trong tuần 3.

### Khó khăn và bài học kinh nghiệm:

* **Phân tích nhiều nguồn dữ liệu:** Registration, Attendance và Evidence có cấu trúc khác nhau, vì vậy cần thiết kế bước chuẩn hóa và đối soát trước khi tổng hợp.
* **Thiết kế điểm danh thời gian thực:** Cần phân biệt rõ việc ghi nhận Check-in/Check-out qua API với thao tác Import dữ liệu từ Excel.
* **Lựa chọn kiến trúc AWS:** Mô hình serverless hoàn toàn có nhiều dịch vụ và yêu cầu cấu hình phức tạp, chưa phù hợp để triển khai đồng loạt khi bắt đầu dự án.
* **Quản lý chi phí:** Việc ưu tiên phát triển local và sử dụng dữ liệu giả giúp giảm rủi ro chi phí khi nghiên cứu AWS.
* **Thiết kế phân quyền:** Cần xác định quyền của ADMIN/STUDENT ngay từ giai đoạn phân tích để tránh sửa nhiều khi phát triển Backend và Frontend.

### Định hướng tuần tiếp theo:

* Khởi tạo cấu trúc Backend bằng Python và FastAPI.
* Thiết kế REST API và các mô hình dữ liệu nghiệp vụ.
* Xây dựng chức năng quản lý hoạt động.
* Phát triển xử lý Registration Import và Evidence Import.
* Xây dựng API Check-in/Check-out với dữ liệu giả.
* Triển khai logic đối soát và kiểm tra các trường hợp dữ liệu thiếu/trùng.
* Kiểm thử nghiệp vụ cốt lõi trong môi trường local trước khi triển khai các thành phần AWS.