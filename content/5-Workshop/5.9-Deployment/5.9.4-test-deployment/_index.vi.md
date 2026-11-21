
---
title: "Kiểm thử ứng dụng sau khi triển khai"
date: 2026-11-09
weight: 4
chapter: false
pre: "<b>5.9.4.</b>"
---

## Kiểm thử ứng dụng sau khi triển khai

Trong phần này, chúng ta sẽ kiểm thử Student Activity Management & Engagement Analytics Platform sau khi Frontend đã được triển khai trên AWS Amplify Hosting và Backend được kết nối qua Cloudflare Quick Tunnel.

Mục tiêu là xác nhận toàn bộ luồng kết nối từ trình duyệt đến Frontend, FastAPI Backend và cơ chế lưu trữ dữ liệu hoạt động đúng trong môi trường Demo.

#### 1. Chuẩn bị môi trường kiểm thử

Đảm bảo các thành phần đang hoạt động:

* AWS Amplify Frontend đã được deploy.
* Branch main triển khai thành công.
* FastAPI Demo Backend tại port 8001.
* Cloudflare Quick Tunnel.
* SQLite Demo Persistence.
* Tài khoản ADMIN và STUDENT Demo.

Trong đợt triển khai trước đây, các địa chỉ được sử dụng:

```text
Frontend:
https://main.d2p96elhe5x6se.amplifyapp.com

Backend HTTPS:
https://replies-cabinet-recipes-prevent.trycloudflare.com

Backend Local:
http://127.0.0.1:8001
```

Sử dụng địa chỉ Amplify và Tunnel đang hoạt động khi thực hiện Workshop mới.

{{% notice note %}}
URL Cloudflare trên là địa chỉ lịch sử. Không giả định rằng URL vẫn hoạt động sau khi tiến trình Quick Tunnel đã dừng.
{{% /notice %}}

#### 2. Kiểm tra kiến trúc triển khai

```text
Browser
   |
   +---- HTTPS ----> AWS Amplify Hosting
   |                 React / Vite
   |
   +---- HTTPS ----> Cloudflare Quick Tunnel
                          |
                          v
                    FastAPI Backend
                    127.0.0.1:8001
                          |
                          v
                    SQLite Demo Data
```

Trình duyệt tải mã nguồn Frontend từ AWS Amplify và gửi API Request đến Cloudflare Quick Tunnel.

FastAPI tiếp nhận Request, kiểm tra xác thực, xử lý nghiệp vụ và lưu dữ liệu theo cấu hình Demo.

Nếu AWS Pilot được bật, các nghiệp vụ tương ứng có thể thực hiện thêm thao tác với Amazon DynamoDB.

#### 3. Kiểm tra Backend Health

Mở PowerShell:

```powershell
Invoke-RestMethod `
  -Uri "http://127.0.0.1:8001/health"
```

Tiếp tục kiểm tra qua HTTPS:

```powershell
$tunnelUrl = "https://YOUR-TUNNEL.trycloudflare.com"

Invoke-RestMethod `
  -Uri "$tunnelUrl/health"
```

Thay YOUR-TUNNEL bằng URL thực tế.

Kết quả mong đợi:

* Backend local trả về thành công.
* Cloudflare HTTPS Endpoint trả về thành công.
* Tunnel đang chuyển tiếp đúng đến port 8001.

<!--
![Deployment health verification](/images/5-Workshop/5.9-Deployment/deployment-health.png)
-->

Trong lịch sử kiểm thử ngày 09/11/2026, HTTPS Health Endpoint đã được xác nhận PASS.

#### 4. Kiểm tra giao diện trên AWS Amplify

Mở Website Amplify được triển khai.

Kiểm tra:

* Website sử dụng HTTPS.
* Trang đăng nhập được hiển thị.
* Các thành phần CSS và JavaScript hoạt động.
* Không xuất hiện lỗi tải tài nguyên nghiêm trọng.

<!--
![Deployed login interface](/images/5-Workshop/5.9-Deployment/deployed-login.png)
-->

Việc Website hiển thị trang đăng nhập chỉ xác nhận Frontend Hosting hoạt động. Cần kiểm tra đăng nhập để xác nhận Backend Connectivity.

#### 5. Kiểm tra API Request từ Website

Mở Developer Tools bằng phím F12.

1. Chọn tab Network.
2. Chọn Fetch/XHR.
3. Thực hiện đăng nhập.
4. Mở Request POST /auth/login.
5. Kiểm tra Request URL.

Kết quả mong đợi:

```text
POST https://YOUR-TUNNEL.trycloudflare.com/auth/login
```

Request không được trỏ đến localhost của máy người dùng.

<!--
![Deployed login API request](/images/5-Workshop/5.9-Deployment/deployed-api-request.png)
-->

Kiểm tra thêm:

* HTTP Method.
* HTTP Status Code.
* Response Body.
* Request Origin.
* CORS Response Headers.

Trong đợt kiểm thử trước đây, Request đăng nhập từ Website Amplify đã được xác nhận gửi đến Cloudflare HTTPS Endpoint.

#### 6. Kiểm thử đăng nhập không hợp lệ

Sử dụng tài khoản Demo với mật khẩu không chính xác.

Thực hiện đăng nhập trên Website Amplify.

Kết quả mong đợi:

```text
HTTP 401 Unauthorized
```

Giao diện cần hiển thị thông báo đăng nhập thất bại phù hợp.

<!--
![Invalid login test](/images/5-Workshop/5.9-Deployment/invalid-login-test.png)
-->

Trong lần kiểm thử ngày 09/11/2026, Request đăng nhập bằng thông tin không hợp lệ đã nhận HTTP 401.

Kết quả này cho thấy Request đã đến được Backend và được kiểm tra xác thực.

HTTP 401 trong trường hợp này là kết quả mong đợi của bài kiểm thử, không phải lỗi Cloudflare Tunnel.

#### 7. Kiểm thử đăng nhập ADMIN

1. Quay lại trang đăng nhập.
2. Nhập thông tin tài khoản ADMIN Demo hợp lệ.
3. Thực hiện đăng nhập.
4. Kiểm tra trang chủ quản trị.
5. Kiểm tra các chức năng ADMIN.

<!--
![Deployed ADMIN dashboard](/images/5-Workshop/5.9-Deployment/deployed-admin-dashboard.png)
-->

Kết quả mong đợi:

* Đăng nhập thành công.
* Backend trả về thông tin xác thực hợp lệ.
* Frontend cập nhật phiên đăng nhập.
* Các chức năng quản trị được hiển thị đúng quyền.

Kiểm tra API /auth/me nếu Frontend sử dụng Endpoint này để xác minh thông tin người dùng.

Trong lịch sử kiểm thử đồ án, đăng nhập ADMIN trên Website Amplify đã đạt PASS.

#### 8. Kiểm thử tạo hoạt động

Từ giao diện ADMIN:

1. Mở chức năng quản lý hoạt động.
2. Chọn tạo hoạt động mới.
3. Nhập dữ liệu Demo.
4. Lưu hoạt động.

Ví dụ thông tin:

```text
Activity Name: Amplify Deployment Demo

Location: University Hall

Description:
Testing Frontend and Backend integration
after AWS deployment.
```

Điền ngày giờ và các trường bắt buộc theo biểu mẫu thực tế.

<!--
![Create activity from Amplify](/images/5-Workshop/5.9-Deployment/deployed-create-activity.png)
-->

Kết quả mong đợi:

* Frontend gửi Request qua Cloudflare Tunnel.
* Backend xử lý tạo hoạt động.
* Activity ID được tạo.
* Hoạt động xuất hiện trong danh sách.

Ghi lại Activity ID thực tế để phục vụ kiểm tra dữ liệu.

<!--
![Activity creation successful](/images/5-Workshop/5.9-Deployment/deployed-activity-success.png)
-->

Trong đợt kiểm thử ngày 09/11/2026, chức năng tạo và lưu hoạt động qua Website Amplify đã đạt PASS.

#### 9. Kiểm tra dữ liệu sau khi tải lại

Sau khi tạo hoạt động:

1. Ghi lại tên và Activity ID.
2. Tải lại trang bằng F5.
3. Mở lại danh sách hoạt động.
4. Kiểm tra hoạt động vừa tạo.

<!--
![Deployed activity list](/images/5-Workshop/5.9-Deployment/deployed-activity-list.png)
-->

Kết quả mong đợi:

* Hoạt động vẫn có thể truy xuất từ Backend.
* Dữ liệu không bị mất chỉ vì Frontend tải lại trang.
* Thông tin hiển thị khớp với Response của API.

Nếu cần kiểm tra SQLite Persistence, thực hiện thêm bài kiểm thử khởi động lại Backend với cùng cấu hình Demo theo phần 5.3.2.

Không xem việc tải lại trang thành công là bằng chứng duy nhất cho khả năng khôi phục dữ liệu sau khi Backend khởi động lại.

#### 10. Kiểm thử đăng nhập STUDENT

Đăng xuất khỏi tài khoản ADMIN.

Đăng nhập bằng tài khoản STUDENT Demo.

Kiểm tra:

* Trang chủ sinh viên được hiển thị.
* Sinh viên truy cập được các chức năng cá nhân.
* Không xuất hiện chức năng quản lý tài khoản sinh viên.
* Không có quyền xác nhận Participation hoặc quản lý hoạt động trái phép.

<!--
![Deployed STUDENT dashboard](/images/5-Workshop/5.9-Deployment/deployed-student-dashboard.png)
-->

Kiểm tra quyền truy cập của STUDENT trên các API quản trị.

Ví dụ:

```text
GET /admin/students
```

Backend cần từ chối nếu tài khoản không có quyền ADMIN.

Trong lần kiểm thử Deployment trước đây, đăng nhập STUDENT đã đạt PASS.

#### 11. Kiểm tra các chức năng nghiệp vụ bổ sung

Sau khi xác nhận Authentication và Activity Management hoạt động, tiếp tục kiểm thử các nhóm chức năng có trong phiên bản Demo.

| Chức năng | Nội dung kiểm thử |
| --- | --- |
| Registration Import | Nhập danh sách đăng ký CSV/XLSX |
| Check-in / Check-out | Ghi nhận MSSV theo thời gian thực |
| Evidence Import | Nhập dữ liệu minh chứng |
| Reconciliation | Đối chiếu dữ liệu sinh viên |
| Participation | Xác nhận hoặc từ chối kết quả |
| Analytics Dashboard | Hiển thị chỉ số thống kê |
| Export | Tải báo cáo theo định dạng hỗ trợ |

Thực hiện với dữ liệu giả lập và các hoạt động phù hợp.

Những bài kiểm thử này là bước mở rộng để đánh giá toàn bộ luồng nghiệp vụ trên môi trường triển khai.

Không mặc định tất cả đã PASS chỉ vì chức năng đăng nhập và tạo hoạt động hoạt động thành công.

<!--
![Deployed business functionality](/images/5-Workshop/5.9-Deployment/deployed-business-test.png)
-->

#### 12. Kiểm tra trên một trình duyệt hoặc thiết bị khác

Mở Website Amplify trên một trình duyệt khác hoặc thiết bị được phép tham gia Demo.

Sử dụng tài khoản Demo để kiểm tra đăng nhập và truy cập ứng dụng.

Mục đích là xác nhận Frontend không phụ thuộc vào localhost của thiết bị đang truy cập.

Các thiết bị không cần chạy FastAPI hoặc cài đặt Python vì Browser gửi Request đến Cloudflare HTTPS Endpoint.

Backend vẫn phải được duy trì trên máy tính đang chạy cloudflared.

<!--
![Deployed application on another device](/images/5-Workshop/5.9-Deployment/deployed-device-test.png)
-->

#### 13. Kiểm tra khi Backend hoặc Tunnel ngừng hoạt động

Trong môi trường thử nghiệm riêng:

* Kiểm tra Website khi Backend tạm thời không khả dụng.
* Quan sát thông báo lỗi kết nối của Frontend.
* Khởi chạy lại Backend với cùng cấu hình.
* Kiểm tra Health Endpoint.
* Kiểm tra khả năng kết nối lại.

Nếu dừng cloudflared và tạo Quick Tunnel mới, cần cập nhật VITE_API_BASE_URL rồi redeploy Frontend.

Website Amplify có thể vẫn hiển thị giao diện trong khi Backend không hoạt động.

Điều này giúp phân biệt Frontend Hosting Availability với Backend API Availability.

#### 14. Tổng hợp kết quả kiểm thử

Kết quả đã ghi nhận trong đợt triển khai ngày 09/11/2026:

| Nội dung kiểm thử | Kết quả |
| --- | --- |
| Amplify main deployment | PASS |
| FastAPI Demo port 8001 | PASS |
| Cloudflare HTTPS Health | PASS |
| VITE_API_BASE_URL configuration | PASS |
| Amplify Redeploy | PASS |
| Login Request through Tunnel | PASS |
| Invalid Login - HTTP 401 | PASS |
| ADMIN Login | PASS |
| STUDENT Login | PASS |
| Create and Save Activity | PASS |

Các kết quả trên phản ánh phạm vi kiểm thử triển khai đã thực hiện.

Những nội dung sau cần kiểm thử bổ sung nếu chưa có minh chứng:

* Toàn bộ luồng nghiệp vụ trên Website đã triển khai.
* Nhiều người dùng truy cập đồng thời.
* Hiệu năng và khả năng chịu tải.
* Khả năng phục hồi sau gián đoạn Backend.
* Mức độ hoàn thiện về bảo mật Production.

<!--
![Deployment test results](/images/5-Workshop/5.9-Deployment/deployment-test-results.png)
-->

#### 15. Đánh giá kiến trúc Demo

Ưu điểm:

* Frontend được triển khai trên AWS Amplify Hosting.
* Hỗ trợ Website HTTPS.
* Có thể kết nối Backend local qua Internet.
* Dễ trình diễn và kiểm thử ứng dụng.
* Phù hợp với quá trình học tập Cloud Computing.

Hạn chế:

* Backend vẫn phụ thuộc vào máy tính local.
* Quick Tunnel sử dụng địa chỉ tạm thời.
* Cần redeploy Frontend khi API URL thay đổi.
* SQLite Demo chưa thay thế hoàn toàn bằng Cloud Database.
* Chưa có kiến trúc Backend Production có khả năng mở rộng và tính sẵn sàng cao.

Hướng phát triển trong tương lai:

* Triển khai Backend trên dịch vụ Cloud phù hợp.
* Sử dụng Backend Endpoint ổn định.
* Hoàn thiện cơ chế lưu trữ Cloud.
* Tăng cường bảo mật, giám sát và quản lý thông tin xác thực.
* Thực hiện Load Testing và đánh giá hiệu năng.

Các hướng trên là đề xuất phát triển, không phải những thành phần đã triển khai hoàn chỉnh trong đồ án hiện tại.

#### Kết luận

Trong phần này, chúng ta đã hoàn thành quá trình triển khai và kiểm thử Student Activity Management & Engagement Analytics Platform bằng AWS Amplify Hosting và Cloudflare Quick Tunnel.

Frontend React/Vite đã được đưa lên môi trường Cloud và có thể gửi REST API Request đến FastAPI Backend Demo thông qua HTTPS.

Các bài kiểm thử đăng nhập ADMIN/STUDENT, kiểm tra Health Endpoint, kết nối API và tạo hoạt động đã chứng minh khả năng tích hợp giữa Frontend đã triển khai và Backend local.

Trong phần tiếp theo, chúng ta sẽ tìm hiểu quy trình xử lý dữ liệu CSV bằng Amazon S3 và AWS Lambda, đồng thời sử dụng IAM để quản lý quyền truy cập.

[Tiếp theo: Xử lý dữ liệu Serverless với Amazon S3 và AWS Lambda](../../5.10-Serverless-Processing/)
