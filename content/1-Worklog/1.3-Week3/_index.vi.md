---
title: "Worklog Tuần 3"
date: 2026-09-21
weight: 3
chapter: false
pre: "<b>1.3.</b>"
---

### Mục tiêu tuần 3:

* Bắt đầu phát triển các chức năng Backend cốt lõi của **Student Activity Management & Engagement Analytics Platform** trong môi trường local.
* Xây dựng cấu trúc source code bằng ngôn ngữ Python và framework FastAPI.
* Thiết kế REST API phục vụ quản lý hoạt động, dữ liệu sinh viên, đăng ký và điểm danh.
* Tìm hiểu cách tổ chức Backend thành các thành phần Router, Service, Repository và Data Model.
* Xây dựng chức năng quản lý thông tin và trạng thái hoạt động.
* Phát triển chức năng đọc, kiểm tra và chuẩn hóa dữ liệu Registration từ CSV/XLSX.
* Xây dựng chức năng nhập minh chứng tham gia (Evidence).
* Phát triển API Check-in/Check-out theo thời gian thực, có kiểm tra đăng ký và trạng thái điểm danh.
* Thiết kế và xây dựng logic đối soát giữa Registration, Attendance và Evidence.
* Sử dụng dữ liệu giả để kiểm thử các trường hợp nghiệp vụ hợp lệ và không hợp lệ.
* Chuẩn bị cơ sở để tích hợp Amazon DynamoDB và Amazon S3 trong các giai đoạn sau.

### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | --- | --- | --- | --- |
| Thứ 2 | - Khởi tạo thư mục dự án **student-activity-platform** và cấu trúc Backend bằng Python/FastAPI. <br> - Thiết lập Python Virtual Environment và cài đặt các thư viện cần thiết. <br> - Tìm hiểu cấu trúc ứng dụng FastAPI và cách tổ chức các module. <br> - Phân chia source code thành Router, Service, Repository và Model. <br> - Xây dựng điểm khởi chạy ứng dụng và API Health Check. <br> - Làm quen với Uvicorn và quá trình chạy Backend trong môi trường local. | 21/09/2026 | 21/09/2026 | https://fastapi.tiangolo.com/ <br> https://www.uvicorn.org/ |
| Thứ 3 | - Thiết kế các REST API cho chức năng Activity Management. <br> - Xây dựng cấu trúc dữ liệu Activity gồm Activity ID, tên hoạt động, thời gian, địa điểm và trạng thái. <br> - Phát triển các thao tác tạo, cập nhật và lấy danh sách hoạt động. <br> - Nghiên cứu quy trình gửi duyệt, công bố và hủy hoạt động. <br> - Thiết kế request/response bằng Pydantic. <br> - Tìm hiểu cách xử lý lỗi HTTP và kiểm tra dữ liệu đầu vào. <br> - Kiểm thử các API bằng dữ liệu hoạt động giả lập. | 22/09/2026 | 22/09/2026 | https://fastapi.tiangolo.com/ <br> https://docs.pydantic.dev/ |
| Thứ 4 | - Xây dựng module xử lý dữ liệu Registration. <br> - Đọc danh sách đăng ký sinh viên từ CSV/XLSX. <br> - Kiểm tra các trường bắt buộc như MSSV và thông tin sinh viên. <br> - Chuẩn hóa dữ liệu và phát hiện các dòng trùng lặp. <br> - Thiết kế API Preview để người quản trị kiểm tra dữ liệu trước khi Import. <br> - Xây dựng logic Import và truy xuất danh sách đăng ký theo hoạt động. <br> - Nghiên cứu xử lý Evidence từ Google Forms/Google Sheets được xuất thành file. <br> - Tạo bộ dữ liệu thử nghiệm gồm bản ghi hợp lệ, thiếu thông tin và trùng MSSV. | 23/09/2026 | 23/09/2026 | https://pandas.pydata.org/docs/ <br> https://fastapi.tiangolo.com/tutorial/request-files/ |
| Thứ 5 | - Xây dựng API Attendance phục vụ Check-in/Check-out thời gian thực. <br> - Thiết kế dữ liệu đầu vào gồm Activity ID và MSSV. <br> - Xây dựng chức năng kiểm tra sinh viên có trong danh sách đăng ký hay không. <br> - Thiết kế logic ghi nhận thời gian Check-in ngay khi API được gọi. <br> - Xây dựng xử lý Check-out theo trạng thái điểm danh. <br> - Phát hiện Check-in/Check-out trùng hoặc thao tác không hợp lệ. <br> - Nghiên cứu các trường hợp mở và đóng Check-out theo quy định hoạt động. <br> - Kiểm thử bằng dữ liệu MSSV giả lập, chưa phụ thuộc camera QR thực tế. | 24/09/2026 | 24/09/2026 | https://fastapi.tiangolo.com/ <br> Tài liệu nghiệp vụ Attendance |
| Thứ 6 | - Phân tích và xây dựng logic Reconciliation giữa Registration, Attendance và Evidence. <br> - Xác định các trường hợp đủ điều kiện, thiếu Check-in, thiếu Check-out, thiếu Evidence và không có dữ liệu điểm danh. <br> - Thiết kế trạng thái kết quả tham gia và các trường hợp cần ADMIN xem xét. <br> - Xây dựng API phục vụ đối soát và truy xuất kết quả. <br> - Nghiên cứu chức năng xác nhận hoặc điều chỉnh kết quả tham gia. <br> - Kiểm thử luồng nghiệp vụ với dữ liệu sinh viên giả. <br> - Tổng hợp những phần đã xây dựng và những vấn đề cần tiếp tục hoàn thiện ở tuần sau. | 25/09/2026 | 25/09/2026 | Tài liệu Proposal, Business Rules và FastAPI Documentation |

### Kết quả đạt được tuần 3:

* **Xây dựng nền tảng Backend bằng FastAPI:**
  * Khởi tạo cấu trúc dự án Python.
  * Thiết lập môi trường phát triển local và các thư viện cần thiết.
  * Tìm hiểu cách vận hành ứng dụng thông qua Uvicorn.
  * Tổ chức các thành phần Backend theo hướng tách biệt trách nhiệm.
  * Xây dựng nền tảng REST API để phát triển các chức năng nghiệp vụ.

* **Hình thành cấu trúc source code Backend:**
  * `app/main.py`: Điểm khởi chạy ứng dụng và khai báo Router.
  * `app/routers/`: Tiếp nhận các HTTP request.
  * `app/services/`: Xử lý quy tắc nghiệp vụ.
  * `app/repositories/`: Truy cập dữ liệu và chuẩn bị cho việc tích hợp nguồn lưu trữ.
  * Các module xác thực, xử lý lỗi và lưu trữ dữ liệu được tổ chức theo nhu cầu phát triển.

  Việc tách các lớp giúp hạn chế phụ thuộc giữa giao diện API, xử lý nghiệp vụ và cơ chế lưu dữ liệu.

* **Phát triển nhóm chức năng Activity Management:**
  * Thiết kế dữ liệu hoạt động gồm thông tin định danh, tên, mô tả, thời gian và trạng thái.
  * Xây dựng hướng xử lý tạo và cập nhật thông tin hoạt động.
  * Xác định các trạng thái phục vụ quy trình quản lý và công bố hoạt động.
  * Thiết kế API để truy xuất danh sách và chi tiết hoạt động.
  * Bước đầu xử lý dữ liệu đầu vào và các trường hợp lỗi nghiệp vụ.

* **Xây dựng module Registration Import:**
  * Nghiên cứu cách đọc và xử lý dữ liệu CSV/XLSX.
  * Xác định các trường bắt buộc trong dữ liệu đăng ký.
  * Chuẩn hóa MSSV và xử lý các trường hợp thiếu thông tin.
  * Phát hiện dữ liệu trùng và bản ghi không hợp lệ.
  * Thiết kế quy trình **Preview → Validate → Import → View Registrations**.
  * Xác định yêu cầu không ghi dữ liệu chưa được kiểm tra vào danh sách chính thức.

* **Nghiên cứu và phát triển xử lý Evidence:**
  * Xác định nguồn dữ liệu minh chứng từ Google Forms/Google Sheets.
  * Thiết kế cách tiếp nhận file CSV/XLSX.
  * Nghiên cứu kiểm tra dữ liệu minh chứng theo MSSV và Activity ID.
  * Xác định các trường hợp minh chứng không hợp lệ hoặc không khớp dữ liệu đăng ký.
  * Chuẩn bị logic để kết hợp Evidence với Attendance trong quá trình đối soát.

* **Xây dựng API Attendance theo thời gian thực:**
  * Thiết kế API Check-in và Check-out theo Activity ID.
  * Xác định MSSV là thông tin dùng để nhận diện sinh viên trong quá trình điểm danh.
  * Kiểm tra đăng ký trước khi thực hiện nghiệp vụ điểm danh.
  * Ghi nhận thời điểm Check-in/Check-out khi Backend xử lý yêu cầu.
  * Xác định cách ngăn chặn thao tác trùng lặp.
  * Xử lý các trường hợp điểm danh không hợp lệ.
  * Chuẩn bị cơ chế quản lý thời điểm mở và đóng Check-out.

  **Nguyên tắc quan trọng:** Check-in/Check-out được ghi nhận bằng API ngay khi có thao tác. Dữ liệu điểm danh không được thiết kế để chủ yếu nhập hàng loạt từ Excel.

* **Thiết kế logic Reconciliation:**
  * Kết hợp ba nguồn dữ liệu:
    * Registration.
    * Attendance.
    * Evidence.
  * Xác định các trạng thái nghiệp vụ:
    * Đã đăng ký và có dữ liệu tham gia đầy đủ.
    * Thiếu Check-in.
    * Thiếu Check-out.
    * Thiếu Evidence.
    * Không có dữ liệu Attendance.
    * Có thông tin cần ADMIN xem xét.
  * Phân biệt kết quả hệ thống tự xác định với kết quả cần được kiểm tra và xác nhận.
  * Chuẩn bị cơ sở cho chức năng Finalize và Export.

* **Thực hiện kiểm thử với dữ liệu giả lập:**
  * Sinh viên đã đăng ký và có Check-in hợp lệ.
  * Sinh viên chưa đăng ký nhưng gửi yêu cầu Check-in.
  * Sinh viên thực hiện Check-in trùng.
  * Sinh viên thực hiện Check-out không hợp lệ.
  * Sinh viên thiếu Check-in hoặc Check-out.
  * Sinh viên thiếu minh chứng.
  * MSSV bị trùng hoặc thiếu thông tin trong danh sách Import.
  * Các trường hợp dữ liệu cần đối soát thủ công.

* **Hiểu rõ hơn cơ chế xử lý REST API:**
  * Phân biệt các HTTP Method như GET, POST, PUT và DELETE.
  * Nắm được vai trò của Request Body, Path Parameter và Query Parameter.
  * Tìm hiểu HTTP Status Code như 200, 400, 403, 404, 409 và 422.
  * Biết cách sử dụng Pydantic để kiểm tra dữ liệu đầu vào.
  * Hiểu tầm quan trọng của xử lý lỗi rõ ràng và thống nhất giữa các API.

* **Chuẩn bị nền tảng tích hợp AWS:**
  * Xác định các module có khả năng kết nối Amazon DynamoDB.
  * Xác định những nhóm file có thể lưu trên Amazon S3.
  * Nghiên cứu cách sử dụng Repository để thay đổi cơ chế lưu trữ mà không cần viết lại toàn bộ nghiệp vụ.
  * Tiếp tục ưu tiên kiểm thử local và sử dụng dữ liệu giả trước khi phát sinh tài nguyên AWS.

### Khó khăn và bài học kinh nghiệm:

* **Tổ chức kiến trúc Backend:** Việc chia Router, Service và Repository giúp code dễ kiểm tra và mở rộng hơn nhưng cần xác định trách nhiệm rõ ràng cho từng lớp.
* **Dữ liệu nhập không đồng nhất:** Các file Registration và Evidence có thể thiếu cột, sai định dạng MSSV hoặc trùng thông tin, vì vậy cần bước Preview và Validation.
* **Điểm danh thời gian thực:** Cần xử lý chính xác các trường hợp Check-in/Check-out trùng và đảm bảo thao tác được ghi nhận ngay khi API xử lý.
* **Đối soát nhiều nguồn dữ liệu:** Không thể chỉ dựa vào Registration để xác định sinh viên đã tham gia; cần kết hợp Attendance và Evidence.
* **Kiểm thử bằng dữ liệu giả:** Giúp phát hiện lỗi nghiệp vụ mà không ảnh hưởng thông tin của sinh viên thật.
* **Chuẩn bị cho AWS:** Việc xây dựng Backend local trước giúp giảm độ phức tạp và chi phí khi bắt đầu tích hợp Cloud.

### Định hướng tuần tiếp theo:

* Tiếp tục hoàn thiện các chức năng Backend.
* Hoàn thiện mô hình lưu trữ và kiểm thử dữ liệu nghiệp vụ.
* Nghiên cứu và triển khai AWS Pilot với Amazon DynamoDB và Amazon S3 theo phạm vi giới hạn.
* Kiểm thử thao tác đọc/ghi dữ liệu trên AWS bằng dữ liệu giả.
* Kiểm tra việc đồng bộ dữ liệu giữa môi trường local và các luồng AWS Pilot.
* Ghi nhận kết quả kiểm thử và chuẩn bị tài liệu kỹ thuật cho giai đoạn tích hợp tiếp theo.