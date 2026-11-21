---
title: "Worklog Tuần 6"
date: 2026-10-12
weight: 6
chapter: false
pre: "<b>1.6.</b>"
---

### Mục tiêu tuần 6:

* Tiếp tục hoàn thiện các chức năng quản lý và xử lý dữ liệu của hệ thống **Student Activity Management & Engagement Analytics Platform**.
* Phát triển quy trình nhập danh sách đăng ký sinh viên từ file CSV/XLSX.
* Xây dựng chức năng xem trước và kiểm tra dữ liệu trước khi thực hiện Import.
* Chuẩn hóa dữ liệu MSSV, thông tin sinh viên và các trường dữ liệu nghiệp vụ.
* Phát hiện dữ liệu bị trùng lặp, thiếu thông tin hoặc không hợp lệ.
* Phát triển chức năng nhập dữ liệu minh chứng tham gia từ Google Forms/Google Sheets.
* Xây dựng giao diện quản lý Registration và Evidence bằng React.
* Kết nối Frontend với các REST API xử lý dữ liệu của FastAPI.
* Nghiên cứu và phát triển chức năng xuất danh sách tham gia dưới định dạng Excel.
* Xây dựng các báo cáo Check-in, Check-out, vắng mặt và kết quả tham gia cuối cùng.
* Kiểm thử quy trình xử lý dữ liệu bằng các bộ dữ liệu giả lập.
* Chuẩn bị dữ liệu phục vụ chức năng Reconciliation và Analytics trong các giai đoạn tiếp theo.

### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | --- | --- | --- | --- |
| Thứ 2 | - Rà soát cấu trúc dữ liệu Registration và các yêu cầu nghiệp vụ đã xác định. <br> - Nghiên cứu cách đọc file CSV/XLSX bằng Python. <br> - Xác định các trường dữ liệu cần thiết như MSSV, họ tên, lớp và Activity ID. <br> - Xây dựng bước kiểm tra định dạng file và cấu trúc cột dữ liệu. <br> - Nghiên cứu cách chuẩn hóa dữ liệu MSSV và xử lý giá trị trống. <br> - Thiết kế quy trình Registration Import: **Upload → Preview → Validate → Import**. <br> - Chuẩn bị file dữ liệu giả để kiểm thử các trường hợp hợp lệ và không hợp lệ. | 12/10/2026 | 12/10/2026 | https://pandas.pydata.org/docs/ <br> https://openpyxl.readthedocs.io/ |
| Thứ 3 | - Phát triển các API Registration Import trong FastAPI. <br> - Xây dựng API xem trước dữ liệu đăng ký theo Activity ID. <br> - Kiểm tra các trường bắt buộc và phát hiện MSSV trùng lặp. <br> - Phân biệt bản ghi hợp lệ, không hợp lệ và cần kiểm tra. <br> - Xây dựng logic Import dữ liệu sau khi thực hiện Validation. <br> - Phát triển chức năng truy xuất danh sách sinh viên đã đăng ký. <br> - Kiểm thử các trường hợp file thiếu cột, dữ liệu trống, trùng MSSV hoặc sai định dạng. <br> - Hoàn thiện thông báo lỗi API nhằm hỗ trợ người quản trị kiểm tra file trước khi nhập. | 13/10/2026 | 13/10/2026 | https://fastapi.tiangolo.com/tutorial/request-files/ <br> Tài liệu Registration API |
| Thứ 4 | - Phát triển chức năng xử lý Evidence từ file CSV/XLSX. <br> - Phân tích cấu trúc dữ liệu minh chứng được xuất từ Google Forms/Google Sheets. <br> - Xác định các trường dùng để liên kết Evidence với MSSV và Activity ID. <br> - Xây dựng API Preview để kiểm tra dữ liệu minh chứng. <br> - Phát hiện các trường hợp thiếu thông tin, trùng lặp hoặc không khớp sinh viên đăng ký. <br> - Xây dựng chức năng Import và truy xuất danh sách Evidence. <br> - Kiểm tra cách xử lý dữ liệu không hợp lệ để tránh ảnh hưởng đến kết quả đối soát. | 14/10/2026 | 14/10/2026 | https://fastapi.tiangolo.com/ <br> https://support.google.com/docs/ |
| Thứ 5 | - Phát triển giao diện React phục vụ Registration và Evidence Import. <br> - Xây dựng chức năng chọn file và gửi dữ liệu lên Backend. <br> - Hiển thị bảng Preview trước khi người quản trị xác nhận Import. <br> - Thiết kế thông báo số bản ghi hợp lệ, không hợp lệ và trùng lặp. <br> - Kết nối giao diện với API Registration và Evidence. <br> - Hiển thị danh sách dữ liệu đã nhập theo từng hoạt động. <br> - Xử lý trạng thái Loading, Success và Error trong quá trình upload. <br> - Kiểm tra việc phân quyền chỉ ADMIN được sử dụng các chức năng Import. | 15/10/2026 | 15/10/2026 | https://react.dev/ <br> Tài liệu API của dự án |
| Thứ 6 | - Nghiên cứu chức năng xuất dữ liệu từ Backend sang Excel. <br> - Tìm hiểu thư viện OpenPyXL và cách tạo Workbook, Worksheet. <br> - Phân tích các nhóm dữ liệu cần xuất: Final Results, Check-in, Check-out và Absent. <br> - Xây dựng logic tổng hợp dữ liệu theo Activity ID. <br> - Thiết kế định dạng file xuất với tiêu đề, cột dữ liệu và thông tin sinh viên. <br> - Nghiên cứu xử lý dữ liệu thiếu hoặc không hợp lệ khi xuất báo cáo. <br> - Kiểm thử quá trình tạo và tải file bằng dữ liệu giả lập. <br> - Tổng hợp các chức năng xử lý dữ liệu đã xây dựng và chuẩn bị cho Reconciliation/Analytics. | 16/10/2026 | 16/10/2026 | https://openpyxl.readthedocs.io/ <br> Tài liệu Export của dự án |

### Kết quả đạt được tuần 6:

* **Phát triển quy trình Registration Import:**
  * Xây dựng hướng xử lý dữ liệu đăng ký sinh viên từ CSV/XLSX.
  * Kiểm tra cấu trúc và các trường bắt buộc của file.
  * Chuẩn hóa dữ liệu MSSV và thông tin sinh viên.
  * Phát hiện bản ghi thiếu thông tin hoặc trùng lặp.
  * Xây dựng quy trình **Preview → Validation → Import** nhằm hạn chế nhập dữ liệu không hợp lệ.
  * Cho phép truy xuất dữ liệu đăng ký theo từng hoạt động sau khi nhập.

* **Xây dựng nhóm API Registration:**
  * `POST /activities/{activity_id}/registrations/preview` — xem trước dữ liệu.
  * `POST /activities/{activity_id}/registrations/import` — nhập dữ liệu đã kiểm tra.
  * `GET /activities/{activity_id}/registrations` — truy xuất danh sách đăng ký.

  Các API phục vụ việc nhập danh sách từ dữ liệu nguồn bên ngoài, không yêu cầu sinh viên phải tự đăng ký lại trên hệ thống.

* **Phát triển chức năng Evidence Import:**
  * Nghiên cứu và xử lý dữ liệu minh chứng từ Google Forms/Google Sheets được xuất thành file.
  * Thiết kế cơ chế liên kết Evidence với Activity ID và MSSV.
  * Kiểm tra dữ liệu bị thiếu, không hợp lệ hoặc trùng lặp.
  * Xây dựng chức năng xem trước trước khi Import.
  * Chuẩn bị dữ liệu Evidence để kết hợp với Registration và Attendance trong quá trình Reconciliation.

* **Xây dựng nhóm API Evidence:**
  * `POST /activities/{activity_id}/evidence/preview` — xem trước minh chứng.
  * `POST /activities/{activity_id}/evidence/import` — nhập dữ liệu minh chứng.
  * `GET /activities/{activity_id}/evidence` — xem danh sách minh chứng.

  Việc nhập Evidence được thực hiện theo từng hoạt động để tránh nhầm lẫn giữa các bộ dữ liệu.

* **Phát triển giao diện Import trên React:**
  * Thiết kế khu vực chọn và tải file CSV/XLSX.
  * Kết nối các thao tác Upload, Preview và Import với Backend.
  * Xây dựng khu vực hiển thị dữ liệu trước khi xác nhận.
  * Hiển thị các bản ghi hợp lệ và những dòng cần kiểm tra.
  * Xử lý thông báo thành công hoặc lỗi.
  * Hiển thị danh sách dữ liệu đã được nhập.
  * Giới hạn chức năng quản trị theo quyền ADMIN.

* **Nghiên cứu và phát triển xử lý dữ liệu Excel bằng Python:**
  * Tìm hiểu cách đọc và ghi dữ liệu CSV/XLSX.
  * Sử dụng thư viện hỗ trợ xử lý bảng dữ liệu.
  * Nghiên cứu cách tạo Workbook và Worksheet.
  * Xây dựng các quy tắc định dạng báo cáo.
  * Xác định cách tổng hợp dữ liệu từ các nguồn nghiệp vụ.

* **Phát triển chức năng Export Results:**
  * Thiết kế API xuất dữ liệu theo Activity ID.
  * Xây dựng hướng xử lý các nhóm báo cáo:
    * Final Results.
    * Check-in Records.
    * Check-out Records.
    * Absent Students.
  * Tìm hiểu cách định dạng bảng dữ liệu và xuất nhiều Worksheet.
  * Nghiên cứu xử lý dữ liệu trống, sai định dạng hoặc thiếu trường.
  * Chuẩn bị cơ chế tải xuống báo cáo Excel phục vụ người quản trị.

* **Xây dựng API xuất dữ liệu:**
  * `GET /activities/{activity_id}/export/{export_type}`.

  API được thiết kế để cung cấp những dạng dữ liệu khác nhau tùy theo loại báo cáo mà ADMIN lựa chọn.

* **Kết nối Frontend với Backend:**
  * Sử dụng Service Layer để gửi HTTP request đến FastAPI.
  * Gửi file dữ liệu thông qua cơ chế upload phù hợp.
  * Kiểm tra và hiển thị kết quả Preview.
  * Xử lý trạng thái đang tải dữ liệu.
  * Xử lý thông báo Validation Error.
  * Cập nhật danh sách sau khi Import.
  * Kiểm tra quyền truy cập các chức năng chỉ dành cho ADMIN.

* **Kiểm thử các trường hợp dữ liệu:**
  * File CSV/XLSX hợp lệ.
  * File không đúng định dạng.
  * File thiếu cột bắt buộc.
  * MSSV trùng.
  * MSSV trống.
  * Bản ghi thiếu thông tin sinh viên.
  * Evidence không khớp dữ liệu Registration.
  * File chứa nhiều bản ghi cần kiểm tra.
  * Xuất báo cáo khi có dữ liệu hoặc chưa đủ dữ liệu.

* **Chuẩn bị dữ liệu phục vụ Reconciliation:**
  * Registration cung cấp thông tin sinh viên đăng ký hoạt động.
  * Attendance cung cấp dữ liệu Check-in/Check-out thời gian thực.
  * Evidence cung cấp minh chứng tham gia.
  * Các nguồn dữ liệu được chuẩn hóa để phục vụ bước đối soát.
  * Những trường hợp dữ liệu thiếu hoặc không thống nhất được xác định để ADMIN kiểm tra.

* **Nắm rõ phạm vi công nghệ của hệ thống:**
  * React/Vite phục vụ Frontend.
  * Python/FastAPI xử lý Import, Validation và Export.
  * SQLite phục vụ lưu trữ trạng thái ứng dụng trong môi trường local.
  * DynamoDB và S3 tiếp tục được phát triển hoặc thử nghiệm theo phạm vi AWS Pilot.
  * Không sử dụng AWS Glue, Athena hoặc QuickSight để thực hiện chức năng Import/Export trong giai đoạn này.
  * Check-in/Check-out vẫn được xử lý qua API thời gian thực, không chuyển thành quy trình Import file Excel.

### Khó khăn và bài học kinh nghiệm:

* **Dữ liệu CSV/XLSX không đồng nhất:** Các file nguồn có thể khác tên cột, định dạng hoặc chứa giá trị trống, do đó cần chuẩn hóa trước khi Import.
* **Phát hiện dữ liệu trùng:** MSSV trùng cần được xử lý hợp lý để tránh làm sai danh sách tham gia.
* **Xử lý Evidence:** Dữ liệu minh chứng từ Google Forms có thể không khớp hoàn toàn với dữ liệu đăng ký.
* **Trải nghiệm Import:** Chức năng Preview giúp người quản trị phát hiện lỗi trước khi lưu dữ liệu.
* **Bảo mật file upload:** Backend cần kiểm tra file và giới hạn thao tác theo quyền được cấp.
* **Xuất Excel:** Cần bảo đảm nội dung, định dạng và tên cột dễ đọc để phục vụ báo cáo.
* **Chuẩn bị Analytics:** Việc chuẩn hóa dữ liệu ngay từ đầu giúp giảm lỗi trong quá trình thống kê và đối soát.

### Định hướng tuần tiếp theo:

* Hoàn thiện logic Reconciliation giữa Registration, Attendance và Evidence.
* Xây dựng các trạng thái Participation Status.
* Phát triển chức năng ADMIN xác nhận và chốt kết quả tham gia.
* Xây dựng Analytics Dashboard.
* Xác định các chỉ số như số lượng đăng ký, tham gia, vắng mặt và tỷ lệ hoàn thành.
* Kết nối dữ liệu đã đối soát với báo cáo và thống kê.
* Kiểm thử dữ liệu và trực quan hóa các kết quả tổng hợp.