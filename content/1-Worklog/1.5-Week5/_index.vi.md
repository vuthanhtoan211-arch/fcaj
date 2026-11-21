---
title: "Worklog Tuần 5"
date: 2026-10-05
weight: 5
chapter: false
pre: "<b>1.5.</b>"
---

### Mục tiêu tuần 5:

* Bắt đầu phát triển giao diện Web cho hệ thống **Student Activity Management & Engagement Analytics Platform**.
* Tìm hiểu React, Vite và phương pháp xây dựng Single Page Application (SPA).
* Thiết kế cấu trúc Frontend theo hướng component-based, dễ quản lý và mở rộng.
* Xây dựng giao diện đăng nhập và hệ thống điều hướng phù hợp với từng vai trò người dùng.
* Phát triển cơ chế Authentication và Authorization thông qua FastAPI Backend.
* Hoàn thiện mô hình phân quyền gồm hai vai trò chính là **ADMIN** và **STUDENT**.
* Xây dựng cơ chế quản lý phiên đăng nhập, xác thực bằng Bearer Token và bảo vệ các API.
* Phát triển giao diện quản lý hoạt động, thông tin cá nhân và tài khoản sinh viên.
* Xây dựng giao diện phục vụ Attendance và Reconciliation.
* Kết nối Frontend React với các REST API của FastAPI.
* Kiểm thử các tình huống đăng nhập, phân quyền, quản lý tài khoản và gọi API.
* Tối ưu giao diện, khả năng xử lý lỗi và trải nghiệm người dùng trong môi trường local.

### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | --- | --- | --- | --- |
| Thứ 2 | - Nghiên cứu React và Vite để xây dựng ứng dụng Web. <br> - Khởi tạo cấu trúc thư mục Frontend trong dự án `student-activity-platform`. <br> - Tìm hiểu JSX, Component, Props, State và React Hooks. <br> - Xây dựng cấu trúc thư mục `src/components`, `src/pages` và `src/services`. <br> - Thiết kế giao diện tổng thể gồm Sidebar, Header, khu vực nội dung và hệ thống điều hướng. <br> - Xác định các trang chính như Login, Dashboard, Activities, Attendance, Reconciliation và Profile. <br> - Kiểm tra khả năng chạy Frontend bằng Vite Development Server. | 05/10/2026 | 05/10/2026 | https://react.dev/ <br> https://vite.dev/ |
| Thứ 3 | - Phát triển giao diện đăng nhập và thiết kế quy trình Authentication. <br> - Kết nối form đăng nhập với FastAPI thông qua endpoint `/auth/login`. <br> - Xây dựng cơ chế lưu và sử dụng Bearer Token trong các API request. <br> - Nghiên cứu cơ chế xác minh phiên bằng `/auth/me` và đăng xuất bằng `/auth/logout`. <br> - Phân biệt trạng thái đăng nhập, phiên hết hạn và thông tin xác thực không hợp lệ. <br> - Xây dựng cơ chế điều hướng sau đăng nhập theo vai trò ADMIN/STUDENT. <br> - Kiểm thử đăng nhập với tài khoản giả lập. | 06/10/2026 | 06/10/2026 | https://fastapi.tiangolo.com/tutorial/security/ <br> https://react.dev/ |
| Thứ 4 | - Hoàn thiện mô hình phân quyền gồm ADMIN và STUDENT. <br> - Xây dựng cơ chế kiểm tra quyền truy cập API tại Backend. <br> - Xác định các trang và chức năng chỉ ADMIN được sử dụng. <br> - Phát triển giao diện quản lý tài khoản sinh viên. <br> - Xây dựng các thao tác xem danh sách, khóa/mở khóa và đặt lại mật khẩu sinh viên. <br> - Nghiên cứu chức năng đồng bộ tài khoản từ dữ liệu sinh viên. <br> - Kiểm tra việc STUDENT không nhìn thấy và không được truy cập chức năng quản lý tài khoản sinh viên. <br> - Kiểm thử phản hồi HTTP 403 khi tài khoản không có quyền truy cập API quản trị. | 07/10/2026 | 07/10/2026 | https://fastapi.tiangolo.com/tutorial/security/ <br> Tài liệu phân quyền của dự án |
| Thứ 5 | - Phát triển giao diện Activity Management. <br> - Kết nối Frontend với các API tạo, cập nhật và truy xuất hoạt động. <br> - Thiết kế form nhập thông tin hoạt động và hiển thị trạng thái công bố. <br> - Xây dựng giao diện xem danh sách và chi tiết hoạt động. <br> - Phát triển trang hồ sơ cá nhân và các chức năng cập nhật thông tin tài khoản. <br> - Nghiên cứu chức năng đổi mật khẩu và quản lý ảnh đại diện. <br> - Xây dựng cơ chế xử lý Loading, Success và Error khi gọi API. <br> - Kiểm tra khả năng cập nhật giao diện khi dữ liệu thay đổi. | 08/10/2026 | 08/10/2026 | https://react.dev/ <br> https://fastapi.tiangolo.com/ |
| Thứ 6 | - Phát triển giao diện Attendance và Reconciliation. <br> - Thiết kế khu vực nhập MSSV hoặc dữ liệu từ thiết bị quét mã để thực hiện Check-in/Check-out. <br> - Kết nối thao tác điểm danh với FastAPI REST API. <br> - Hiển thị thông báo cho các trường hợp thành công, chưa đăng ký, thao tác trùng và dữ liệu không hợp lệ. <br> - Thiết kế giao diện theo dõi danh sách đăng ký và trạng thái tham gia. <br> - Kiểm tra hiển thị phù hợp với vai trò ADMIN/STUDENT. <br> - Kiểm thử luồng Frontend → FastAPI → dữ liệu local bằng dữ liệu giả lập. <br> - Tổng hợp các lỗi giao diện và API cần tiếp tục hoàn thiện. | 09/10/2026 | 09/10/2026 | Tài liệu FastAPI, React và Business Rules của dự án |

### Kết quả đạt được tuần 5:

* **Xây dựng nền tảng giao diện Frontend bằng React và Vite:**
  * Khởi tạo ứng dụng React phục vụ hệ thống quản lý hoạt động sinh viên.
  * Thiết lập môi trường phát triển và chạy ứng dụng bằng Vite.
  * Tổ chức mã nguồn theo hướng component-based.
  * Phân chia các thành phần giao diện thành Page, Component và Service.
  * Xây dựng cấu trúc điều hướng giữa các trang chức năng.
  * Thiết kế bố cục giao diện gồm Sidebar, Header và khu vực hiển thị nội dung chính.
  * Chuẩn bị nền tảng để mở rộng giao diện và triển khai ứng dụng Web trong những tuần tiếp theo.

* **Xây dựng các trang chức năng chính:**
  * Login.
  * Dashboard.
  * Activity Management.
  * Student Account Management.
  * Attendance.
  * Reconciliation.
  * Personal Profile.

  Các trang được thiết kế theo hướng có thể tái sử dụng component và quản lý dữ liệu thông qua REST API.

* **Phát triển cơ chế Authentication với FastAPI:**
  * Sử dụng Backend để tiếp nhận và kiểm tra thông tin đăng nhập.
  * Thiết kế cơ chế xác thực dựa trên Bearer Token.
  * Nghiên cứu và sử dụng các endpoint:
    * `/auth/login`.
    * `/auth/me`.
    * `/auth/logout`.
    * `/auth/change-password`.
  * Xây dựng cơ chế kiểm tra trạng thái phiên trước khi truy cập chức năng được bảo vệ.
  * Xử lý các trường hợp đăng nhập thất bại hoặc phiên đăng nhập không còn hợp lệ.
  * Nghiên cứu cách quản lý dữ liệu tài khoản và phiên đăng nhập bằng SQLite.

* **Hoàn thiện mô hình phân quyền ADMIN/STUDENT:**

  **ADMIN:**
  * Truy cập các chức năng quản trị.
  * Quản lý thông tin và trạng thái hoạt động.
  * Quản lý tài khoản sinh viên.
  * Nhập dữ liệu đăng ký và minh chứng.
  * Thực hiện hoặc quản lý điểm danh.
  * Đối soát, xác nhận và xuất dữ liệu tham gia.
  * Xem thống kê và báo cáo.

  **STUDENT:**
  * Đăng nhập và truy cập các chức năng được cấp quyền.
  * Xem danh sách, chi tiết hoạt động.
  * Quản lý hồ sơ cá nhân.
  * Theo dõi lịch sử và kết quả tham gia.
  * Xem những thông báo liên quan.

* **Xây dựng chức năng quản lý tài khoản sinh viên:**
  * Thiết kế giao diện danh sách tài khoản sinh viên.
  * Nghiên cứu và phát triển các thao tác:
    * Xem thông tin tài khoản.
    * Khóa tài khoản.
    * Mở khóa tài khoản.
    * Đặt lại mật khẩu.
    * Đồng bộ tài khoản sinh viên.
  * Xác định API quản trị trong nhóm `/admin/students`.
  * Kiểm tra quyền tại Backend, không chỉ dựa vào việc ẩn chức năng trên giao diện.
  * Xử lý trường hợp STUDENT cố truy cập API chỉ dành cho ADMIN.

* **Phát triển giao diện quản lý hoạt động:**
  * Hiển thị danh sách hoạt động.
  * Hiển thị thông tin chi tiết.
  * Thiết kế form tạo và cập nhật hoạt động.
  * Hiển thị trạng thái hoạt động.
  * Nghiên cứu quy trình gửi duyệt, công bố và hủy hoạt động.
  * Kết nối dữ liệu hoạt động với FastAPI.

* **Nghiên cứu và phát triển trang hồ sơ cá nhân:**
  * Thiết kế chức năng xem và cập nhật thông tin tài khoản.
  * Nghiên cứu cơ chế thay đổi mật khẩu.
  * Tìm hiểu quy trình tải lên và hiển thị ảnh đại diện.
  * Xác định yêu cầu giữ dữ liệu khi tải lại trang hoặc đăng nhập lại.
  * Nghiên cứu xử lý các trường hợp thiếu thông tin và dữ liệu không hợp lệ.

* **Phát triển giao diện Attendance:**
  * Xây dựng khu vực tiếp nhận MSSV.
  * Kết nối thao tác Check-in/Check-out với REST API.
  * Hiển thị trạng thái điểm danh theo hoạt động.
  * Xử lý thông báo khi điểm danh thành công.
  * Hiển thị lỗi trong trường hợp Check-in trùng hoặc dữ liệu không hợp lệ.
  * Xác định khả năng kết nối thiết bị quét mã hoặc camera trong các giai đoạn nâng cấp tiếp theo.

  **Lưu ý:** Trong giai đoạn này, hệ thống tập trung vào việc ghi nhận sự kiện điểm danh thông qua API thời gian thực. Việc sử dụng camera quét QR trực tiếp trên giao diện chưa được xem là chức năng hoàn thiện.

* **Phát triển giao diện Reconciliation:**
  * Hiển thị thông tin Registration và Attendance.
  * Thiết kế khu vực theo dõi Evidence và Participation Status.
  * Xác định các trường hợp cần kiểm tra thủ công.
  * Chuẩn bị giao diện phục vụ ADMIN xem xét và xác nhận kết quả.
  * Nghiên cứu cách hiển thị kết quả sau khi đối soát.

* **Kết nối Frontend với Backend FastAPI:**
  * Tìm hiểu cách sử dụng Fetch API và các hàm gọi REST API.
  * Xây dựng Service Layer phục vụ giao tiếp giữa React và FastAPI.
  * Sử dụng Bearer Token trong các yêu cầu cần xác thực.
  * Nghiên cứu xử lý CORS trong môi trường phát triển local.
  * Xử lý các trạng thái Loading, Success và Error.
  * Kiểm tra luồng tương tác giữa giao diện và Backend.

  **Luồng xử lý trong tuần 5:**

  **React/Vite Frontend → FastAPI REST API → SQLite / Local Application State**

* **Thực hiện kiểm thử chức năng cơ bản:**
  * Đăng nhập bằng tài khoản ADMIN và STUDENT.
  * Kiểm tra điều hướng theo vai trò.
  * Kiểm tra các chức năng quản trị không được hiển thị cho STUDENT.
  * Kiểm tra yêu cầu API quản trị phải có quyền phù hợp.
  * Kiểm tra tạo và hiển thị dữ liệu hoạt động.
  * Kiểm tra các thao tác quản lý tài khoản.
  * Kiểm tra quá trình gửi request Attendance.
  * Ghi nhận các lỗi giao diện và xử lý API cần tiếp tục khắc phục.

* **Xác định đúng phạm vi triển khai của hệ thống:**
  * Frontend sử dụng React và Vite.
  * Backend sử dụng Python và FastAPI.
  * Authentication được xử lý bởi FastAPI và hệ thống tài khoản local.
  * SQLite được sử dụng cho dữ liệu xác thực và trạng thái ứng dụng trong môi trường local.
  * DynamoDB và S3 tiếp tục được nghiên cứu hoặc kiểm thử theo phạm vi AWS Pilot.
  * Amazon Cognito chưa được tích hợp để thay thế Authentication của FastAPI.
  * Amazon API Gateway chưa được sử dụng làm cổng API của ứng dụng.
  * AWS Amplify chưa được ghi nhận là đã triển khai Frontend trong tuần này.

### Khó khăn và bài học kinh nghiệm:

* **Tổ chức mã nguồn React:** Khi số lượng trang tăng lên, cần tách component và service để dễ bảo trì, tránh lặp lại logic gọi API.
* **Xử lý Authentication:** Việc quản lý Token, trạng thái đăng nhập và phiên hết hạn cần được thiết kế thống nhất giữa Frontend và Backend.
* **Phân quyền người dùng:** Chỉ ẩn menu ADMIN trên Frontend là chưa đủ; Backend phải kiểm tra quyền trước khi xử lý request.
* **Đồng bộ giao diện với dữ liệu:** Khi tạo, cập nhật hoặc thay đổi trạng thái tài khoản, giao diện cần phản ánh kết quả mới.
* **Xử lý lỗi API:** Cần phân biệt lỗi xác thực, lỗi phân quyền, lỗi dữ liệu và lỗi kết nối.
* **Giao diện điểm danh:** Cần ưu tiên độ chính xác của API Check-in/Check-out trước khi mở rộng sang camera QR.
* **Triển khai theo giai đoạn:** Hoàn thiện hệ thống local trước khi đưa Frontend lên AWS giúp giảm số lượng vấn đề phải xử lý đồng thời.

### Định hướng tuần tiếp theo:

* Tiếp tục hoàn thiện các trang chức năng trên Frontend.
* Phát triển giao diện Registration Import và Evidence Import.
* Xây dựng chức năng Preview, Validation và Import trên giao diện.
* Hoàn thiện trang quản lý danh sách sinh viên tham gia.
* Phát triển chức năng xuất dữ liệu CSV/XLSX.
* Kết nối giao diện với các API xử lý dữ liệu của Backend.
* Kiểm thử các trường hợp dữ liệu sai, thiếu hoặc trùng lặp.
* Chuẩn bị dữ liệu cho chức năng Analytics và Reconciliation trong những tuần tiếp theo.