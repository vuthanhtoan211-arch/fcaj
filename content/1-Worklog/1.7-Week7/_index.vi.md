---
title: "Worklog Tuần 7"
date: 2026-10-19
weight: 7
chapter: false
pre: "<b>1.7.</b>"
---

### Mục tiêu tuần 7:

* Tiếp tục hoàn thiện hệ thống **Student Activity Management & Engagement Analytics Platform**, tập trung vào đối soát và phân tích dữ liệu.
* Phát triển quy trình Reconciliation giữa Registration, Attendance và Evidence.
* Xác định các điều kiện đánh giá mức độ tham gia hoạt động của sinh viên.
* Xây dựng và hoàn thiện các trạng thái Participation Status.
* Phát hiện những trường hợp thiếu Check-in, thiếu Check-out, thiếu Evidence hoặc không có dữ liệu điểm danh.
* Phát triển chức năng cho ADMIN kiểm tra, xác nhận và điều chỉnh kết quả đối soát.
* Xây dựng cơ chế chốt danh sách kết quả tham gia sau khi được xác nhận.
* Nghiên cứu các phương pháp tổng hợp và phân tích dữ liệu tham gia hoạt động.
* Xây dựng Analytics Dashboard với các chỉ số về đăng ký, điểm danh, tham gia và tỷ lệ hoàn thành.
* Kết nối Analytics Dashboard với FastAPI REST API.
* Thiết kế giao diện trực quan hóa dữ liệu bằng biểu đồ, bảng thống kê và các chỉ số tổng hợp.
* Kiểm thử tính chính xác của dữ liệu đối soát và kết quả thống kê bằng dữ liệu giả lập.

### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | --- | --- | --- | --- |
| Thứ 2 | - Rà soát dữ liệu Registration, Attendance và Evidence đã xây dựng. <br> - Phân tích quy trình đối soát giữa các nguồn dữ liệu. <br> - Xác định những điều kiện để sinh viên được công nhận tham gia hoạt động. <br> - Thiết kế các trạng thái Participation Status dựa trên kết quả kiểm tra dữ liệu. <br> - Phân tích các trường hợp thiếu Check-in, thiếu Check-out, thiếu Evidence và không có Attendance. <br> - Xác định trường hợp có thể tự động đánh giá và trường hợp cần ADMIN kiểm tra thủ công. <br> - Chuẩn bị dữ liệu giả lập để kiểm thử đối soát. | 19/10/2026 | 19/10/2026 | Tài liệu Proposal, Business Rules và Reconciliation Service |
| Thứ 3 | - Phát triển và hoàn thiện Reconciliation Service bằng Python/FastAPI. <br> - Xây dựng logic tổng hợp Registration, Attendance và Evidence theo Activity ID và MSSV. <br> - Xử lý các trường hợp dữ liệu thiếu hoặc không thống nhất. <br> - Xây dựng API thực hiện Reconciliation theo từng hoạt động. <br> - Phát triển API truy xuất kết quả đối soát. <br> - Kiểm tra việc cập nhật Participation Status khi dữ liệu nguồn thay đổi. <br> - Kiểm thử các trường hợp sinh viên đủ điều kiện, thiếu dữ liệu hoặc cần xác nhận. | 20/10/2026 | 20/10/2026 | https://fastapi.tiangolo.com/ <br> Tài liệu nghiệp vụ của dự án |
| Thứ 4 | - Phát triển giao diện Reconciliation trên React. <br> - Hiển thị danh sách sinh viên và các trạng thái Registration, Check-in, Check-out, Evidence. <br> - Phân biệt bản ghi hợp lệ và bản ghi cần ADMIN xem xét. <br> - Xây dựng chức năng xác nhận hoặc điều chỉnh kết quả tham gia theo MSSV. <br> - Nghiên cứu cơ chế khóa danh sách sau khi hoàn tất đối soát. <br> - Kết nối giao diện với API Decision và Finalize. <br> - Kiểm tra quyền truy cập và các thông báo lỗi trong quá trình xác nhận kết quả. | 21/10/2026 | 21/10/2026 | https://react.dev/ <br> Tài liệu Reconciliation API |
| Thứ 5 | - Nghiên cứu các chỉ số phân tích mức độ tham gia hoạt động sinh viên. <br> - Xác định số lượng hoạt động, số sinh viên đăng ký, số sinh viên Check-in/Check-out và số sinh viên hoàn thành. <br> - Xây dựng công thức tính tỷ lệ tham gia, tỷ lệ vắng mặt và tỷ lệ hoàn thành. <br> - Phát triển logic tổng hợp dữ liệu Analytics bằng Python. <br> - Thiết kế API cung cấp dữ liệu thống kê cho Frontend. <br> - Xác định cấu trúc dữ liệu để hiển thị biểu đồ và bảng thống kê. <br> - Kiểm tra các trường hợp không có dữ liệu hoặc dữ liệu chưa hoàn chỉnh. | 22/10/2026 | 22/10/2026 | Tài liệu Analytics của dự án <br> https://fastapi.tiangolo.com/ |
| Thứ 6 | - Phát triển giao diện Analytics Dashboard bằng React. <br> - Kết nối Frontend với API `/analytics`. <br> - Thiết kế các KPI Card và biểu đồ thống kê. <br> - Hiển thị tổng số hoạt động, tổng số đăng ký và các chỉ số tham gia. <br> - Xử lý trạng thái Loading, Error và Empty Data trên Dashboard. <br> - Kiểm tra sự thống nhất giữa số liệu Dashboard và dữ liệu Backend. <br> - Kiểm thử toàn bộ luồng Registration → Attendance → Evidence → Reconciliation → Analytics. <br> - Tổng hợp kết quả và ghi nhận những vấn đề cần tiếp tục hoàn thiện. | 23/10/2026 | 23/10/2026 | https://react.dev/ <br> Tài liệu Analytics và Test Data của dự án |

### Kết quả đạt được tuần 7:

* **Hoàn thiện hướng xử lý Reconciliation giữa nhiều nguồn dữ liệu:**
  * Xây dựng quy trình đối soát giữa Registration, Attendance và Evidence.
  * Sử dụng Activity ID và MSSV để liên kết dữ liệu từ các nguồn.
  * Xác định các điều kiện đánh giá kết quả tham gia.
  * Phát hiện dữ liệu thiếu, trùng lặp hoặc không thống nhất.
  * Phân biệt kết quả đủ điều kiện xác nhận và kết quả cần xem xét thủ công.
  * Chuẩn bị dữ liệu để quản lý Participation Status.

* **Phát triển Reconciliation Service bằng FastAPI:**
  * Tổng hợp danh sách sinh viên đã đăng ký.
  * Kiểm tra các bản ghi Check-in/Check-out theo từng sinh viên.
  * Kết hợp dữ liệu Evidence để đánh giá mức độ hoàn thành.
  * Xây dựng logic đánh dấu các trường hợp thiếu dữ liệu.
  * Tạo kết quả đối soát theo Activity ID.
  * Nghiên cứu cơ chế cập nhật kết quả khi dữ liệu nguồn thay đổi.
  * Kiểm tra các điều kiện cần thiết trước khi xác nhận danh sách cuối cùng.

* **Xác định các trạng thái Participation Status:**
  * **READY:** Dữ liệu đáp ứng điều kiện để xem xét công nhận tham gia.
  * **NEEDS_REVIEW:** Dữ liệu chưa đủ hoặc cần ADMIN xác minh.
  * **MISSING_CHECK_IN:** Thiếu dữ liệu Check-in.
  * **MISSING_CHECK_OUT:** Thiếu dữ liệu Check-out.
  * **MISSING_EVIDENCE:** Thiếu minh chứng tham gia.
  * **NO_ATTENDANCE:** Có đăng ký nhưng không có dữ liệu điểm danh.
  * **FINALIZED:** Kết quả đã được chốt theo quy trình xác nhận.

  Các trạng thái và lý do cần kiểm tra được sử dụng để hỗ trợ việc đối soát, giúp ADMIN xác định rõ những trường hợp chưa đủ thông tin.

* **Phát triển nhóm API Reconciliation:**
  * `POST /activities/{activity_id}/reconcile` — thực hiện đối soát.
  * `GET /activities/{activity_id}/reconciliation` — truy xuất kết quả đối soát.
  * `POST /activities/{activity_id}/participants/{mssv}/decision` — xác nhận hoặc điều chỉnh quyết định.
  * `POST /activities/{activity_id}/finalize` — chốt kết quả của hoạt động.

  Những API này tạo thành luồng xử lý từ dữ liệu ban đầu đến kết quả tham gia cuối cùng.

* **Phát triển giao diện Reconciliation trên React:**
  * Hiển thị danh sách sinh viên của từng hoạt động.
  * Hiển thị trạng thái Registration và Attendance.
  * Hiển thị thông tin Evidence liên quan.
  * Phân biệt những bản ghi có dữ liệu đầy đủ và những bản ghi cần xem xét.
  * Thiết kế chức năng hỗ trợ ADMIN xác nhận kết quả.
  * Kết nối thao tác Decision và Finalize với Backend.
  * Hiển thị thông báo lỗi hoặc trạng thái xử lý khi gửi yêu cầu.

* **Xây dựng quy trình chốt kết quả tham gia:**
  * ADMIN thực hiện đối soát sau khi có dữ liệu Registration, Attendance và Evidence.
  * Những trường hợp thiếu hoặc không thống nhất dữ liệu được kiểm tra.
  * ADMIN đưa ra quyết định đối với các trường hợp cần xác minh.
  * Hệ thống tổng hợp các kết quả đã được xác nhận.
  * Danh sách cuối cùng được chốt bằng chức năng Finalize.
  * Kết quả được chuẩn bị cho việc xuất Excel và phân tích dữ liệu.

* **Nghiên cứu các chỉ số phân tích mức độ tham gia:**
  * Tổng số hoạt động.
  * Tổng số lượt đăng ký.
  * Tổng số sinh viên có Check-in.
  * Tổng số sinh viên có Check-out.
  * Tổng số sinh viên hoàn thành điều kiện tham gia.
  * Tổng số sinh viên vắng mặt hoặc thiếu dữ liệu.
  * Tỷ lệ tham gia.
  * Tỷ lệ hoàn thành.
  * Tỷ lệ vắng mặt.

  Các chỉ số được lựa chọn để phục vụ việc theo dõi kết quả hoạt động và đánh giá mức độ tham gia sinh viên.

* **Xây dựng logic Analytics bằng Python:**
  * Tổng hợp dữ liệu từ các hoạt động.
  * Phân tích số lượng đăng ký và tham gia.
  * Tính toán các tỷ lệ thống kê.
  * Xử lý các trường hợp không có dữ liệu.
  * Chuẩn hóa kết quả phân tích trước khi trả về Frontend.
  * Phân biệt dữ liệu đăng ký với dữ liệu tham gia thực tế.
  * Chuẩn bị dữ liệu cho các biểu đồ và bảng thống kê.

* **Phát triển Analytics API:**
  * Sử dụng Router `/analytics`.
  * Xây dựng chức năng `get_analytics_summary`.
  * Phát triển logic `build_activity_analytics`.
  * Nghiên cứu và sử dụng các hàm hỗ trợ tính toán tỷ lệ phần trăm.
  * Trả về dữ liệu tổng hợp để Frontend hiển thị Dashboard.

* **Phát triển giao diện Analytics Dashboard:**
  * Thiết kế Dashboard bằng React.
  * Xây dựng các KPI Card.
  * Thiết kế biểu đồ thống kê và bảng dữ liệu.
  * Kết nối giao diện với hàm `getAnalyticsSummary()`.
  * Hiển thị số liệu theo kết quả từ Backend.
  * Xử lý trạng thái tải dữ liệu và trường hợp API không phản hồi.
  * Nghiên cứu cách làm mới dữ liệu khi kết quả nghiệp vụ thay đổi.

* **Phân biệt các nguồn số liệu Analytics:**
  * Registration thể hiện số lượng sinh viên đăng ký.
  * Attendance thể hiện các sự kiện Check-in và Check-out.
  * Evidence hỗ trợ kiểm tra điều kiện tham gia.
  * Reconciliation tạo kết quả đánh giá tổng hợp.
  * Finalized Results phục vụ báo cáo và thống kê sau xác nhận.

  Việc phân biệt các nguồn dữ liệu giúp hạn chế nhầm lẫn giữa số lượng đăng ký và số lượng sinh viên thực sự tham gia.

* **Kiểm thử các trường hợp nghiệp vụ bằng dữ liệu giả:**
  * Sinh viên có đầy đủ Registration, Check-in, Check-out và Evidence.
  * Sinh viên thiếu Check-in.
  * Sinh viên thiếu Check-out.
  * Sinh viên thiếu Evidence.
  * Sinh viên đăng ký nhưng không tham gia.
  * Sinh viên có dữ liệu cần ADMIN xem xét.
  * Hoạt động chưa có dữ liệu đăng ký.
  * Hoạt động có dữ liệu nhưng chưa hoàn tất đối soát.
  * Dashboard không có dữ liệu hoặc dữ liệu chưa đầy đủ.

* **Hiểu rõ phạm vi triển khai của Analytics:**
  * Logic thống kê được thực hiện trong Backend bằng Python/FastAPI.
  * Giao diện Dashboard được xây dựng bằng React.
  * Dữ liệu nghiệp vụ của môi trường local tiếp tục được quản lý bởi hệ thống hiện tại.
  * Amazon DynamoDB được sử dụng trong một số luồng AWS Pilot riêng.
  * Chưa triển khai AWS Glue, Amazon Athena hoặc Amazon QuickSight cho Analytics Dashboard.
  * Chưa sử dụng AWS Lambda làm Backend chính cho chức năng Reconciliation và Analytics.

### Khó khăn và bài học kinh nghiệm:

* **Đối soát nhiều nguồn dữ liệu:** Registration, Attendance và Evidence có thể có trạng thái khác nhau, do đó cần quy tắc nghiệp vụ rõ ràng để tránh đánh giá sai kết quả tham gia.
* **Xử lý dữ liệu thiếu:** Không phải mọi trường hợp thiếu dữ liệu đều có thể tự động kết luận; một số bản ghi cần ADMIN xác minh.
* **Quản lý Participation Status:** Cần phân biệt trạng thái đang đối soát, kết quả cần xem xét và kết quả đã chốt.
* **Tính toán Analytics:** Các tỷ lệ thống kê cần sử dụng mẫu số phù hợp và xử lý trường hợp mẫu số bằng 0.
* **Đồng bộ số liệu:** Số liệu trên Dashboard cần được tính từ dữ liệu Backend thay vì sử dụng giá trị cố định trên giao diện.
* **Kiểm thử dữ liệu giả:** Việc chuẩn bị nhiều tình huống giúp đánh giá tính chính xác của logic đối soát.
* **Kiến trúc phù hợp:** Sử dụng Python/FastAPI và React giúp tận dụng các chức năng đã xây dựng mà không cần triển khai thêm các dịch vụ Analytics có thể phát sinh chi phí.

### Định hướng tuần tiếp theo:

* Tiếp tục kiểm thử tích hợp các chức năng của hệ thống.
* Kiểm tra Authentication và Authorization cho hai vai trò ADMIN/STUDENT.
* Kiểm thử luồng quản lý hoạt động, Import, Attendance, Reconciliation, Analytics và Export.
* Rà soát các lỗi xử lý dữ liệu và giao diện.
* Kiểm tra các trường hợp API trả về lỗi hoặc phiên đăng nhập không hợp lệ.
* Nâng cao khả năng xử lý lỗi và trải nghiệm người dùng.
* Chuẩn bị hệ thống cho giai đoạn triển khai Frontend lên AWS Amplify và kiểm thử trên môi trường HTTPS.