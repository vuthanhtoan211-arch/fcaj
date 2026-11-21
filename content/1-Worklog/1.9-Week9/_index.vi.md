---
title: "Worklog Tuần 9"
date: 2026-11-02
weight: 9
chapter: false
pre: "<b>1.9.</b>"
---

### Mục tiêu tuần 9:

* Tiếp tục hoàn thiện và chuẩn bị triển khai hệ thống **Student Activity Management & Engagement Analytics Platform** trên môi trường Cloud.
* Tìm hiểu quy trình triển khai ứng dụng Frontend thông qua AWS Amplify Hosting.
* Chuẩn hóa GitHub Repository và cấu trúc source code phục vụ triển khai.
* Kiểm tra cấu hình Build và các biến môi trường của ứng dụng React/Vite.
* Triển khai Frontend lên AWS Amplify thông qua GitHub.
* Nghiên cứu phương pháp kết nối Frontend chạy HTTPS với Backend FastAPI.
* Xây dựng môi trường Backend demo độc lập, sử dụng SQLite và dữ liệu giả.
* Thiết lập Cloudflare Tunnel để cung cấp HTTPS Endpoint cho FastAPI.
* Kết nối AWS Amplify Frontend với Backend thông qua REST API.
* Kiểm thử chức năng Authentication và Authorization trên website đã triển khai.
* Kiểm tra hoạt động của hệ thống với hai vai trò ADMIN và STUDENT.
* Xác minh khả năng lưu trữ và truy xuất dữ liệu demo sau khi tải lại trang.
* Rà soát các vấn đề liên quan đến CORS, HTTPS, Token và API Base URL.
* Tìm hiểu các giới hạn của mô hình triển khai demo và phương án phát triển trong tương lai.
* Theo dõi tài nguyên AWS và hạn chế chi phí phát sinh.

### Các công việc cần triển khai trong tuần này:

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| --- | --- | --- | --- | --- |
| Thứ 2 | - Rà soát cấu trúc source code của hệ thống. <br> - Chuẩn bị GitHub Repository phục vụ triển khai. <br> - Kiểm tra cấu trúc thư mục Frontend và Backend. <br> - Nghiên cứu các yêu cầu Build của Vite. <br> - Kiểm tra `package.json`, các dependencies và lệnh Build. <br> - Rà soát `.gitignore` để tránh đưa `.env`, SQLite, Credentials và các file không cần thiết lên GitHub. <br> - Xác định cấu hình môi trường cần thiết khi triển khai Frontend. | 02/11/2026 | 02/11/2026 | https://vite.dev/guide/ <br> https://docs.github.com/ |
| Thứ 3 | - Tìm hiểu AWS Amplify Hosting và phương pháp triển khai từ GitHub Repository. <br> - Nghiên cứu quy trình kết nối GitHub với Amplify. <br> - Xác định nhánh triển khai `main`. <br> - Cấu hình Build phù hợp với React/Vite. <br> - Nghiên cứu cấu trúc Monorepo và đường dẫn thư mục Frontend. <br> - Kiểm tra cấu hình biến môi trường `VITE_API_BASE_URL`. <br> - Nghiên cứu cơ chế tự động Build/Deploy khi cập nhật mã nguồn trên GitHub. | 03/11/2026 | 03/11/2026 | https://docs.aws.amazon.com/amplify/ <br> https://docs.aws.amazon.com/amplify/latest/userguide/ |
| Thứ 4 | - Chuẩn bị môi trường Backend demo độc lập với Backend đang phát triển. <br> - Tìm hiểu cách sao chép Backend và khởi tạo SQLite riêng cho bản demo. <br> - Xác định yêu cầu chỉ sử dụng tài khoản và dữ liệu sinh viên giả. <br> - Nghiên cứu cơ chế tắt các AWS Pilot trong môi trường demo khi không cần thiết. <br> - Kiểm tra API `/health` và các endpoint Authentication. <br> - Nghiên cứu Cloudflare Tunnel để cung cấp HTTPS cho Backend local. <br> - Phân tích yêu cầu CORS khi Frontend và Backend nằm trên các domain khác nhau. | 04/11/2026 | 04/11/2026 | https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/ <br> https://fastapi.tiangolo.com/tutorial/cors/ |
| Thứ 5 | - Nghiên cứu kết nối AWS Amplify với FastAPI thông qua HTTPS. <br> - Thiết lập hoặc rà soát cấu hình Cloudflare Tunnel cho Backend demo. <br> - Kiểm tra đường dẫn API và biến môi trường trên Frontend. <br> - Rà soát việc gửi Bearer Token qua các HTTP request. <br> - Kiểm tra CORS và các lỗi kết nối do khác Origin. <br> - Nghiên cứu cách sử dụng Browser Developer Tools để kiểm tra Network Request và API Response. <br> - Chuẩn bị tài khoản ADMIN/STUDENT và dữ liệu giả phục vụ kiểm thử website công khai. | 05/11/2026 | 05/11/2026 | https://developers.cloudflare.com/ <br> https://fastapi.tiangolo.com/ |
| Thứ 6 | - Kiểm tra toàn bộ cấu hình triển khai Frontend và Backend demo. <br> - Kiểm thử các trường hợp Login, Logout và xác minh phiên. <br> - Kiểm tra giao diện theo vai trò ADMIN/STUDENT. <br> - Rà soát chức năng quản lý hoạt động và dữ liệu demo. <br> - Kiểm tra khả năng lưu dữ liệu sau tải lại trang. <br> - Nghiên cứu các giới hạn khi sử dụng Cloudflare Quick Tunnel. <br> - Kiểm tra trạng thái tài nguyên và AWS Billing. <br> - Tổng hợp những vấn đề cần hoàn thiện trong giai đoạn triển khai và kiểm thử cuối. | 06/11/2026 | 06/11/2026 | AWS Amplify Documentation, Cloudflare Documentation và Test Notes |

### Kết quả đạt được tuần 9:

* **Chuẩn bị GitHub Repository phục vụ triển khai hệ thống:**
  * Rà soát và tổ chức source code của Frontend và Backend.
  * Xác định cấu trúc Monorepo cho dự án thực tập.
  * Nghiên cứu cách quản lý mã nguồn và đồng bộ thay đổi thông qua Git.
  * Xác định nhánh `main` phục vụ quá trình triển khai.
  * Rà soát các file cấu hình không được đưa vào GitHub.
  * Chuẩn bị nền tảng cho việc triển khai Frontend thông qua AWS Amplify.

* **Nghiên cứu và cấu hình AWS Amplify Hosting:**
  * Tìm hiểu cách triển khai ứng dụng React/Vite lên AWS Amplify.
  * Nghiên cứu quy trình kết nối Amplify với GitHub.
  * Xác định vị trí thư mục Frontend trong Repository.
  * Kiểm tra các lệnh cài đặt dependencies và tạo Production Build.
  * Nghiên cứu cơ chế tự động triển khai khi GitHub có thay đổi.
  * Xác định biến môi trường cần thiết cho việc kết nối Backend.

* **Chuẩn bị Frontend cho môi trường Cloud:**
  * Kiểm tra cấu hình Vite.
  * Nghiên cứu biến môi trường `VITE_API_BASE_URL`.
  * Phân biệt địa chỉ Backend local và địa chỉ Backend công khai.
  * Xác định yêu cầu API Endpoint phải sử dụng HTTPS khi Frontend được triển khai công khai.
  * Rà soát việc gọi API qua Service Layer.
  * Chuẩn bị xử lý các lỗi cấu hình API Base URL và CORS.

* **Xây dựng phương án Backend demo độc lập:**
  * Xác định yêu cầu tách môi trường demo khỏi Backend và dữ liệu đang phát triển.
  * Nghiên cứu việc sử dụng một bản FastAPI riêng.
  * Sử dụng SQLite để lưu tài khoản và trạng thái ứng dụng của môi trường demo.
  * Chuẩn bị dữ liệu sinh viên giả và hoạt động thử nghiệm.
  * Xác định cơ chế bảo vệ dữ liệu thật khi sử dụng một Endpoint công khai.
  * Nghiên cứu việc vô hiệu hóa những AWS Pilot không cần thiết trong bản demo.

* **Nghiên cứu và thiết lập phương án Cloudflare Tunnel:**
  * Tìm hiểu cách công khai FastAPI local thông qua HTTPS.
  * Nghiên cứu cách Cloudflare Tunnel kết nối với cổng Backend.
  * Xác định yêu cầu duy trì Backend và Tunnel trong lúc thực hiện Demo.
  * Tìm hiểu giới hạn của Quick Tunnel và khả năng thay đổi URL.
  * Phân biệt môi trường demo tạm thời với môi trường Production ổn định.

* **Chuẩn bị kết nối Frontend và Backend:**
  * Thiết kế luồng xử lý:

    **User → AWS Amplify (React/Vite) → Cloudflare HTTPS Tunnel → FastAPI → SQLite Demo**

  * Xác định các điểm cần cấu hình giữa Frontend và Backend.
  * Nghiên cứu CORS cho những Request khác Origin.
  * Xác định cách gửi Bearer Token trong API Request.
  * Chuẩn bị quy trình kiểm tra API bằng Browser Developer Tools.
  * Nghiên cứu cách xác định lỗi từ Amplify, Tunnel hoặc FastAPI.

* **Rà soát Authentication và Authorization cho bản demo:**
  * Chuẩn bị tài khoản ADMIN và STUDENT giả.
  * Nghiên cứu kiểm tra chức năng Login và Logout trên môi trường công khai.
  * Rà soát việc xác minh phiên qua `/auth/me`.
  * Kiểm tra yêu cầu hiển thị giao diện theo từng vai trò.
  * Xác định các chức năng quản trị không được STUDENT truy cập.
  * Chuẩn bị các tình huống xử lý Token không hợp lệ hoặc phiên hết hạn.

* **Chuẩn bị các chức năng nghiệp vụ phục vụ Demo:**
  * Activity Management.
  * Registration Import.
  * Attendance.
  * Evidence Import.
  * Reconciliation.
  * Analytics.
  * Export Results.

  Các chức năng được giữ nguyên mô hình xử lý bằng FastAPI; không chuyển sang API Gateway và Lambda.

* **Tìm hiểu và áp dụng các nguyên tắc bảo mật:**
  * Không đưa AWS Credentials vào mã nguồn.
  * Không sử dụng tài khoản sinh viên thật để kiểm thử website công khai.
  * Phân biệt thông tin công khai của Frontend với biến môi trường bí mật của Backend.
  * Xác định yêu cầu kiểm tra quyền ADMIN tại Backend.
  * Nghiên cứu giới hạn sử dụng Cloudflare Tunnel đối với môi trường demo.
  * Rà soát cấu hình CORS và API Endpoint nhằm hạn chế truy cập không phù hợp.

* **Nghiên cứu kiểm soát chi phí triển khai:**
  * Tìm hiểu mức sử dụng và cách tính phí AWS Amplify Hosting.
  * Phân biệt chi phí Hosting với chi phí Backend và dữ liệu.
  * Nghiên cứu sử dụng Backend local nhằm hạn chế phải triển khai máy chủ AWS liên tục.
  * Tìm hiểu AWS Billing và cách kiểm tra tài nguyên hiện có.
  * Xác định yêu cầu không tạo thêm dịch vụ nếu các tài nguyên hiện tại đã đáp ứng được mục tiêu demo.

* **Đánh giá các giới hạn kiến trúc:**
  * AWS Amplify phục vụ triển khai Frontend.
  * FastAPI tiếp tục là Backend chính.
  * SQLite phục vụ dữ liệu demo.
  * Cloudflare Tunnel được sử dụng làm phương án kết nối HTTPS tạm thời.
  * DynamoDB và S3 tiếp tục thuộc các luồng AWS Pilot riêng.
  * Không sử dụng Cognito để thay thế Authentication hiện tại.
  * Không sử dụng API Gateway để chuyển tiếp các request của website.
  * Chưa ghi nhận toàn bộ hệ thống đã được triển khai trên hạ tầng AWS Production.

### Khó khăn và bài học kinh nghiệm:

* **Cấu hình Monorepo:** Khi Frontend nằm trong thư mục con, cần xác định chính xác đường dẫn Build và thư mục đầu ra.
* **Cấu hình biến môi trường:** Frontend React/Vite cần sử dụng đúng API Base URL cho môi trường triển khai.
* **HTTPS và CORS:** Website HTTPS cần gọi đến Backend qua Endpoint HTTPS và phải được Backend cho phép Origin phù hợp.
* **Cloudflare Quick Tunnel:** Địa chỉ Tunnel có thể thay đổi, vì vậy cấu hình Frontend có thể phải cập nhật khi khởi động lại.
* **Tách môi trường Demo:** Việc dùng SQLite riêng và dữ liệu giả giúp hạn chế rủi ro lộ hoặc thay đổi dữ liệu thật.
* **Chi phí Cloud:** Không nhất thiết phải triển khai Backend lên máy chủ AWS liên tục nếu mục tiêu hiện tại là thử nghiệm và trình bày MVP.
* **Kiểm thử triển khai:** Cần phân biệt lỗi Build, lỗi kết nối API, lỗi Authentication và lỗi dữ liệu để xử lý chính xác.

### Định hướng tuần tiếp theo:

* Hoàn tất hoặc xác minh quá trình triển khai AWS Amplify Frontend.
* Kiểm thử website công khai và luồng kết nối tới FastAPI demo.
* Xác minh các vai trò ADMIN/STUDENT và dữ liệu thử nghiệm.
* Rà soát các bộ kiểm thử AWS Pilot đã xây dựng.
* Kiểm kê tài nguyên AWS và kiểm tra Billing.
* Nghiên cứu bổ sung AWS IAM, Lambda và CloudWatch cho một quy trình xử lý dữ liệu demo riêng biệt.
* Thiết kế luồng xử lý CSV bằng Amazon S3 và AWS Lambda.
* Chuẩn bị các minh chứng kỹ thuật phục vụ báo cáo thực tập.