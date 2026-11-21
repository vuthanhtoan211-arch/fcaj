---
title: "Worklog Tuần 8"
date: 2026-10-26
weight: 8
chapter: false
pre: "<b>1.8.</b>"
---

### Mục tiêu tuần 8:

* Tiếp tục hoàn thiện hệ thống **Student Activity Management & Engagement Analytics Platform** sau giai đoạn phát triển các chức năng chính.
* Kiểm thử tích hợp giữa Frontend React/Vite và Backend Python/FastAPI.
* Rà soát cơ chế Authentication, quản lý phiên đăng nhập và phân quyền người dùng.
* Kiểm tra việc phân quyền giữa hai vai trò ADMIN và STUDENT.
* Kiểm thử các chức năng Activity Management, Registration Import, Attendance, Evidence Import, Reconciliation, Analytics và Export.
* Phát hiện và khắc phục những lỗi liên quan đến API, xử lý dữ liệu và giao diện.
* Kiểm tra tính nhất quán của dữ liệu sau các thao tác tạo, cập nhật và tải lại trang.
* Hoàn thiện chức năng quản lý tài khoản và hồ sơ cá nhân.
* Kiểm tra các trường hợp đăng nhập không hợp lệ, phiên hết hạn và truy cập API trái quyền.
* Rà soát quy trình Check-in/Check-out nhằm bảo đảm dữ liệu được ghi nhận tại thời điểm xử lý API.
* Cải thiện khả năng hiển thị, thông báo lỗi và trải nghiệm sử dụng trên các kích thước màn hình khác nhau.
* Chuẩn bị source code, dữ liệu demo và cấu hình môi trường để triển khai Frontend lên AWS Amplify trong giai đoạn tiếp theo.

### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | --- | --- | --- | --- |
| Thứ 2 | - Rà soát toàn bộ cấu trúc Frontend và Backend. <br> - Kiểm tra khả năng khởi động React/Vite và FastAPI trong môi trường local. <br> - Kiểm tra các API quan trọng và cấu hình kết nối Frontend–Backend. <br> - Kiểm thử Authentication qua `/auth/login`, `/auth/me` và `/auth/logout`. <br> - Kiểm tra cơ chế lưu và sử dụng Bearer Token. <br> - Xác định các trường hợp lỗi đăng nhập, thiếu Token và phiên đăng nhập không hợp lệ. <br> - Tổng hợp danh sách các vấn đề cần khắc phục. | 26/10/2026 | 26/10/2026 | https://fastapi.tiangolo.com/tutorial/security/ <br> https://react.dev/ |
| Thứ 3 | - Kiểm thử phân quyền ADMIN và STUDENT tại Frontend và Backend. <br> - Kiểm tra quyền truy cập các API quản lý tài khoản sinh viên. <br> - Kiểm tra việc STUDENT không thể truy cập chức năng quản trị. <br> - Rà soát chức năng khóa/mở khóa tài khoản và đặt lại mật khẩu. <br> - Kiểm tra chức năng đồng bộ tài khoản sinh viên. <br> - Kiểm thử chức năng thay đổi mật khẩu và cập nhật hồ sơ cá nhân. <br> - Rà soát việc lưu thông tin tài khoản sau khi tải lại trang hoặc đăng nhập lại. <br> - Ghi nhận và xử lý các lỗi về hiển thị menu và trạng thái tài khoản. | 27/10/2026 | 27/10/2026 | Tài liệu Authentication/Authorization và Admin Students API |
| Thứ 4 | - Kiểm thử các chức năng Activity Management và Registration Import. <br> - Kiểm tra quy trình tạo, cập nhật, công bố và hủy hoạt động. <br> - Kiểm tra hiển thị danh sách và thông tin chi tiết hoạt động. <br> - Kiểm thử Preview và Import Registration từ CSV/XLSX. <br> - Kiểm tra các trường hợp MSSV trùng, thiếu thông tin hoặc dữ liệu sai định dạng. <br> - Kiểm tra danh sách đăng ký sau khi Import và tải lại trang. <br> - Kiểm thử Evidence Import và việc liên kết minh chứng với hoạt động. <br> - Ghi nhận những lỗi xử lý dữ liệu và phản hồi từ API. | 28/10/2026 | 28/10/2026 | Tài liệu Activity API, Registration API và Evidence API |
| Thứ 5 | - Kiểm thử luồng Check-in/Check-out thời gian thực. <br> - Kiểm tra việc nhận MSSV và Activity ID từ giao diện Attendance. <br> - Kiểm tra dữ liệu đăng ký trước khi ghi nhận điểm danh. <br> - Kiểm thử Check-in hợp lệ, Check-in trùng và các yêu cầu không hợp lệ. <br> - Kiểm thử Check-out và quy trình mở/đóng Check-out. <br> - Kiểm tra trạng thái điểm danh và thời gian được Backend ghi nhận. <br> - Kiểm thử Reconciliation khi dữ liệu Attendance thay đổi. <br> - Rà soát các thông báo lỗi và khả năng cập nhật dữ liệu trên giao diện. | 29/10/2026 | 29/10/2026 | Tài liệu Attendance Service và Reconciliation API |
| Thứ 6 | - Kiểm tra Analytics Dashboard và chức năng Export Results. <br> - Đối chiếu các chỉ số tổng hợp với dữ liệu Registration, Attendance và Reconciliation. <br> - Kiểm tra trường hợp Dashboard chưa có dữ liệu hoặc API không phản hồi. <br> - Kiểm thử các nhóm báo cáo Final Results, Check-in, Check-out và Absent. <br> - Rà soát thông báo Loading, Success và Error trên giao diện. <br> - Kiểm tra bố cục Responsive và khả năng sử dụng trên thiết bị khác nhau. <br> - Rà soát cấu hình API Base URL, biến môi trường và các thành phần không nên đưa lên GitHub. <br> - Chuẩn bị kế hoạch triển khai Frontend lên AWS Amplify. | 30/10/2026 | 30/10/2026 | Tài liệu Analytics/Export <br> https://vite.dev/guide/env-and-mode |

### Kết quả đạt được tuần 8:

* **Rà soát quá trình tích hợp Frontend và Backend:**
  * Kiểm tra cấu trúc React/Vite và FastAPI.
  * Xác định các endpoint mà Frontend đang sử dụng.
  * Kiểm tra cơ chế gửi và nhận dữ liệu thông qua REST API.
  * Rà soát việc gửi Bearer Token trong các request yêu cầu xác thực.
  * Phân biệt lỗi phát sinh từ Frontend, Backend và dữ liệu đầu vào.
  * Chuẩn bị các phương án xử lý lỗi khi API không phản hồi hoặc trả về trạng thái không hợp lệ.

* **Kiểm thử và hoàn thiện cơ chế Authentication:**
  * Kiểm tra quy trình đăng nhập bằng tài khoản hợp lệ.
  * Kiểm tra trường hợp sai thông tin đăng nhập.
  * Rà soát quá trình xác minh phiên đăng nhập.
  * Kiểm tra chức năng đăng xuất.
  * Kiểm tra các API liên quan:
    * `/auth/login`.
    * `/auth/me`.
    * `/auth/logout`.
    * `/auth/change-password`.
    * `/auth/profile`.
    * `/auth/avatar`.
  * Xác định yêu cầu xử lý phiên hết hạn và Token không hợp lệ.
  * Rà soát khả năng cập nhật và lưu trữ thông tin tài khoản.

* **Kiểm tra phân quyền ADMIN/STUDENT:**
  * Xác định rõ hai vai trò hiện tại của hệ thống là ADMIN và STUDENT.
  * Kiểm tra chức năng quản trị chỉ xuất hiện với ADMIN.
  * Rà soát quyền truy cập danh sách tài khoản sinh viên.
  * Kiểm tra cơ chế Backend từ chối các yêu cầu không đủ quyền.
  * Phân biệt việc ẩn thành phần giao diện với việc bảo vệ API.
  * Rà soát khả năng đồng bộ trạng thái đăng nhập và quyền truy cập giữa các trang.

* **Rà soát chức năng quản lý tài khoản sinh viên:**
  * Kiểm tra API danh sách và chi tiết tài khoản.
  * Rà soát chức năng khóa và mở khóa tài khoản.
  * Kiểm tra quy trình đặt lại mật khẩu.
  * Nghiên cứu và kiểm tra chức năng đồng bộ tài khoản.
  * Xác định các trường hợp tài khoản không tồn tại hoặc dữ liệu không hợp lệ.
  * Kiểm tra các thông báo thành công và lỗi trong giao diện quản trị.

* **Kiểm tra chức năng hồ sơ cá nhân:**
  * Rà soát việc cập nhật thông tin người dùng.
  * Kiểm tra chức năng thay đổi mật khẩu.
  * Nghiên cứu và kiểm tra quy trình upload ảnh đại diện.
  * Kiểm tra khả năng giữ dữ liệu hồ sơ sau khi tải lại trang.
  * Xác định yêu cầu xử lý dữ liệu rỗng, sai định dạng hoặc cập nhật thất bại.

* **Rà soát Activity Management:**
  * Kiểm tra các thao tác tạo và cập nhật hoạt động.
  * Kiểm tra khả năng hiển thị danh sách hoạt động.
  * Rà soát các trạng thái gửi duyệt, công bố và hủy.
  * Kiểm tra dữ liệu được hiển thị theo quyền người dùng.
  * Xác định những trường hợp dữ liệu không hợp lệ hoặc hoạt động không tồn tại.

* **Kiểm thử Registration và Evidence Import:**
  * Kiểm tra quy trình Upload → Preview → Validation → Import.
  * Rà soát yêu cầu về cấu trúc file CSV/XLSX.
  * Kiểm tra dữ liệu MSSV thiếu hoặc trùng lặp.
  * Kiểm tra bản ghi không hợp lệ và các thông báo cần xử lý.
  * Rà soát danh sách dữ liệu sau Import.
  * Kiểm tra quá trình liên kết Evidence với Registration.
  * Xác định các trường hợp dữ liệu không khớp cần được xem xét.

* **Kiểm thử Attendance API theo thời gian thực:**
  * Kiểm tra khả năng tiếp nhận MSSV qua giao diện.
  * Rà soát cơ chế xác minh đăng ký trước khi ghi nhận Attendance.
  * Kiểm tra thời điểm ghi nhận Check-in/Check-out.
  * Kiểm tra xử lý thao tác trùng lặp.
  * Rà soát quy trình mở và đóng Check-out.
  * Kiểm tra khả năng cập nhật danh sách và số liệu điểm danh.
  * Chuẩn bị những trường hợp kiểm thử liên quan đến dữ liệu chưa đăng ký hoặc chưa đủ điều kiện.

  **Lưu ý:** Việc ghi nhận Check-in/Check-out vẫn thực hiện thông qua FastAPI trong thời gian thực. Chức năng quét QR bằng camera chưa được xác nhận hoàn thiện và không được ghi là đã triển khai thành công.

* **Rà soát chức năng Reconciliation:**
  * Kiểm tra dữ liệu Registration, Attendance và Evidence.
  * Kiểm tra các bản ghi thiếu Check-in, thiếu Check-out hoặc thiếu Evidence.
  * Rà soát kết quả cần ADMIN xác nhận.
  * Kiểm tra API Decision và Finalize.
  * Xác định yêu cầu giữ tính nhất quán của kết quả khi dữ liệu nguồn thay đổi.
  * Chuẩn bị quy trình kiểm tra kết quả trước khi xuất báo cáo.

* **Kiểm tra Analytics Dashboard:**
  * Rà soát API `/analytics` và dữ liệu tổng hợp được trả về.
  * Kiểm tra các chỉ số liên quan đến đăng ký và tham gia.
  * Xác định cách tính tỷ lệ tham gia và tỷ lệ hoàn thành.
  * Kiểm tra các trường hợp không có dữ liệu.
  * Rà soát việc làm mới Dashboard sau các thao tác nghiệp vụ.
  * Xác định những phần cần cải thiện về bố cục và hiển thị.

* **Kiểm tra chức năng Export Results:**
  * Rà soát dữ liệu xuất theo từng Activity ID.
  * Kiểm tra các nhóm báo cáo:
    * Final Results.
    * Check-in Records.
    * Check-out Records.
    * Absent Students.
  * Kiểm tra cấu trúc bảng dữ liệu và nội dung Excel.
  * Xác định cách xử lý các bản ghi thiếu thông tin.
  * Rà soát quy trình tải xuống báo cáo từ Frontend.

* **Cải thiện giao diện và trải nghiệm người dùng:**
  * Kiểm tra khả năng hiển thị của Sidebar, Header và các trang chức năng.
  * Rà soát các thông báo lỗi khi Backend không phản hồi.
  * Cải thiện cách thể hiện Loading, Empty Data và Success.
  * Kiểm tra bố cục giao diện trên các kích thước màn hình.
  * Xác định những thành phần cần điều chỉnh để người dùng dễ thao tác.
  * Rà soát việc phân quyền hiển thị theo từng vai trò.

* **Chuẩn bị cho giai đoạn triển khai AWS Amplify:**
  * Rà soát cấu trúc Frontend và các lệnh Build.
  * Nghiên cứu biến môi trường `VITE_API_BASE_URL`.
  * Xác định yêu cầu Frontend HTTPS phải kết nối được với Backend HTTPS.
  * Tìm hiểu việc quản lý source code và triển khai thông qua GitHub.
  * Chuẩn bị phương án sử dụng Cloudflare Tunnel để công khai Backend demo từ môi trường local.
  * Phân biệt việc triển khai Frontend lên AWS Amplify với việc triển khai toàn bộ Backend lên AWS.

* **Xác định phạm vi hệ thống ở giai đoạn tuần 8:**
  * React/Vite tiếp tục vận hành Frontend.
  * FastAPI xử lý Authentication và nghiệp vụ chính.
  * SQLite được dùng cho dữ liệu và trạng thái ứng dụng trong môi trường local.
  * Amazon DynamoDB và S3 tiếp tục phục vụ các thử nghiệm AWS Pilot.
  * Chưa ghi nhận AWS Amplify là đã triển khai thành công trong tuần này.
  * Chưa sử dụng AWS Lambda làm Backend chính.
  * Không sử dụng Cognito, API Gateway, Glue, Athena hoặc QuickSight trong hệ thống vận hành hiện tại.

### Khó khăn và bài học kinh nghiệm:

* **Kiểm thử nhiều module:** Khi hệ thống có nhiều chức năng, cần kiểm tra cả từng module và luồng nghiệp vụ tổng thể để phát hiện lỗi tích hợp.
* **Authentication và Authorization:** Việc kiểm tra đăng nhập cần đi kèm xác minh quyền tại Backend.
* **Dữ liệu thay đổi liên tục:** Sau các thao tác Import, Attendance và Reconciliation, giao diện cần hiển thị dữ liệu mới phù hợp với trạng thái hệ thống.
* **Xử lý trường hợp lỗi:** Cần phân biệt lỗi từ dữ liệu, phân quyền, API và kết nối mạng để hỗ trợ việc khắc phục.
* **Kiểm thử Attendance:** Thời gian điểm danh và việc ngăn thao tác trùng cần được xác minh bằng dữ liệu thực tế của môi trường thử nghiệm.
* **Triển khai Web:** Frontend HTTPS không thể dựa vào một Backend HTTP localhost trên máy người dùng khi được công khai.
* **Bảo vệ dữ liệu:** Môi trường demo công khai nên sử dụng tài khoản và dữ liệu giả, không đưa thông tin sinh viên thật lên Internet.
* **Kiểm soát chi phí:** Cần tận dụng hạ tầng đã có và kiểm tra tài nguyên trước khi triển khai thêm dịch vụ AWS.

### Định hướng tuần tiếp theo:

* Chuẩn bị repository GitHub phục vụ triển khai ứng dụng.
* Hoàn thiện cấu hình Build của React/Vite.
* Triển khai Frontend lên AWS Amplify Hosting.
* Thiết lập Backend demo riêng bằng FastAPI và SQLite.
* Nghiên cứu kết nối HTTPS thông qua Cloudflare Tunnel.
* Cấu hình API Base URL phù hợp với môi trường triển khai.
* Kiểm thử đăng nhập ADMIN/STUDENT trên website công khai bằng tài khoản giả.
* Kiểm tra luồng Frontend → HTTPS Backend → dữ liệu demo.
* Ghi nhận kết quả triển khai và những giới hạn của mô hình demo.