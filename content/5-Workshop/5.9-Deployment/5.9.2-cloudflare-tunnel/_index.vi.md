
---
title: "Kết nối Backend bằng Cloudflare Quick Tunnel"
date: 2026-11-09
weight: 2
chapter: false
pre: "<b>5.9.2.</b>"
---

## Kết nối Backend bằng Cloudflare Quick Tunnel

Trong phần này, chúng ta sẽ sử dụng Cloudflare Quick Tunnel để tạo HTTPS Endpoint cho FastAPI Backend đang chạy trên máy tính local.

Mục tiêu là cho phép Frontend React/Vite được triển khai trên AWS Amplify Hosting gửi REST API Request đến Backend mà không cần triển khai Backend lên một máy chủ Cloud riêng.

#### 1. Tìm hiểu Cloudflare Quick Tunnel

Cloudflare Quick Tunnel tạo kết nối từ máy tính local đến mạng Cloudflare.

Ứng dụng local sẽ được truy cập thông qua một URL HTTPS tạm thời có tên miền trycloudflare.com.

Luồng kết nối:

```text
React / Vite Frontend
        |
        | HTTPS REST API
        v
Cloudflare Public Endpoint
        |
        v
cloudflared Tunnel
        |
        v
FastAPI Backend
127.0.0.1:8001
```

Trong mô hình này, không cần cấu hình Port Forwarding trên Router để phục vụ Demo.

Quick Tunnel chỉ hoạt động trong thời gian tiến trình cloudflared đang chạy và Backend vẫn có thể tiếp nhận yêu cầu.

Tài liệu tham khảo:

[Cloudflare Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/)

#### 2. Chuẩn bị dữ liệu Demo

Trước khi cung cấp Backend qua Internet:

* Sử dụng dữ liệu sinh viên giả lập.
* Chuẩn bị tài khoản ADMIN và STUDENT Demo.
* Sử dụng SQLite riêng cho môi trường Demo.
* Kiểm tra quyền truy cập các API.
* Đảm bảo không có dữ liệu sinh viên thật hoặc thông tin nhạy cảm.

Trong đồ án, Backend Demo chạy tại port 8001 để tách biệt với Backend phát triển tại port 8000.

{{% notice warning %}}
Quick Tunnel cung cấp địa chỉ có thể truy cập từ Internet. Không xem URL ngẫu nhiên của Tunnel là cơ chế xác thực hoặc phân quyền. Backend vẫn phải bảo vệ các Endpoint và kiểm tra Access Token.
{{% /notice %}}

#### 3. Khởi chạy FastAPI Backend Demo

Mở PowerShell tại thư mục Backend:

```powershell
cd C:\Projects\student-activity-platform\backend
```

Kích hoạt Virtual Environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

Thiết lập môi trường Demo:

```powershell
$env:SAP_DEMO_MODE="1"
```

Kiểm tra cấu hình persistence hiện tại để bảo đảm Backend sử dụng cơ sở dữ liệu SQLite Demo riêng.

Khởi chạy:

```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

Kết quả mong đợi:

```text
INFO: Uvicorn running on http://127.0.0.1:8001
INFO: Application startup complete.
```

<!--
![Demo Backend running](/images/5-Workshop/5.9-Deployment/backend-demo-running.png)
-->

Giữ Terminal Backend hoạt động.

Nếu cần AWS Integration, sử dụng các cấu hình AWS Pilot đã được kiểm thử theo phần 5.4. Không bật các quyền AWS không cần thiết chỉ để trình diễn Frontend.

#### 4. Kiểm tra Backend local

Mở trình duyệt:

[FastAPI Health Endpoint](http://127.0.0.1:8001/health)

Có thể kiểm tra bằng PowerShell:

```powershell
Invoke-RestMethod `
  -Uri "http://127.0.0.1:8001/health"
```

Kết quả mong đợi là Endpoint Health trả về thành công.

Cấu trúc JSON thực tế phụ thuộc vào phiên bản Backend.

Kiểm tra thêm Swagger UI:

```text
http://127.0.0.1:8001/docs
```

<!--
![Local Backend health check](/images/5-Workshop/5.9-Deployment/local-health.png)
-->

Chỉ tiếp tục khi Backend local hoạt động bình thường.

#### 5. Cài đặt cloudflared

Truy cập tài liệu chính thức:

[Install cloudflared](https://developers.cloudflare.com/tunnel/downloads/)

Tải và cài đặt phiên bản phù hợp với Windows.

Có thể sử dụng Windows Package Manager:

```powershell
winget install --id Cloudflare.cloudflared
```

Sau khi cài đặt, mở Terminal mới và kiểm tra:

```powershell
cloudflared --version
```

Nếu cloudflared chưa có trong PATH, có thể gọi trực tiếp file thực thi.

Trong đợt triển khai của đồ án, cloudflared được sử dụng tại:

```text
C:\Program Files (x86)\cloudflared\cloudflared.exe
```

Kiểm tra:

```powershell
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" --version
```

<!--
![Cloudflared installed](/images/5-Workshop/5.9-Deployment/cloudflared-version.png)
-->

Đường dẫn cài đặt có thể khác nhau tùy theo máy tính.

#### 6. Tạo Cloudflare Quick Tunnel

Mở một Terminal PowerShell mới.

Không đóng Terminal Backend.

Thực hiện:

```powershell
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://127.0.0.1:8001
```

Nếu cloudflared đã có trong PATH, có thể sử dụng:

```powershell
cloudflared tunnel --url http://127.0.0.1:8001
```

Sau khi kết nối thành công, Terminal sẽ cung cấp một địa chỉ tương tự:

```text
https://random-name.trycloudflare.com
```

<!--
![Cloudflare Quick Tunnel created](/images/5-Workshop/5.9-Deployment/cloudflare-tunnel-running.png)
-->

Sao chép URL thực tế được tạo để sử dụng trong các bước tiếp theo.

Trong lần kiểm thử ngày 09/11/2026, đồ án sử dụng:

```text
https://replies-cabinet-recipes-prevent.trycloudflare.com
```

Đây là URL lịch sử của phiên kiểm thử, không phải Endpoint cố định cho các lần triển khai sau.

{{% notice note %}}
Mỗi lần tạo Quick Tunnel mới, Cloudflare có thể cung cấp một hostname khác. Cần cập nhật VITE_API_BASE_URL và build lại Frontend nếu địa chỉ Tunnel thay đổi.
{{% /notice %}}

#### 7. Kiểm tra HTTPS Health Endpoint

Gán địa chỉ Tunnel mới vào biến PowerShell:

```powershell
$tunnelUrl = "https://YOUR-TUNNEL.trycloudflare.com"
```

Thay giá trị trên bằng URL thực tế.

Kiểm tra:

```powershell
Invoke-RestMethod `
  -Uri "$tunnelUrl/health"
```

Hoặc mở trình duyệt:

```text
https://YOUR-TUNNEL.trycloudflare.com/health
```

Kết quả mong đợi:

* HTTPS Endpoint có thể truy cập.
* Cloudflare chuyển tiếp yêu cầu đến FastAPI.
* Backend trả về Health Response thành công.

<!--
![Public HTTPS health check](/images/5-Workshop/5.9-Deployment/tunnel-health.png)
-->

Nếu Health Endpoint local hoạt động nhưng URL Tunnel không hoạt động, cần kiểm tra tiến trình cloudflared và địa chỉ Backend.

#### 8. Kiểm tra kết nối đến REST API

Khi sử dụng Tunnel, các API của Backend vẫn giữ nguyên đường dẫn.

Ví dụ:

```text
POST https://YOUR-TUNNEL.trycloudflare.com/auth/login

GET https://YOUR-TUNNEL.trycloudflare.com/auth/me
```

Địa chỉ API chỉ thay đổi phần Base URL.

Các API được bảo vệ vẫn yêu cầu Access Token phù hợp.

Nếu Swagger UI đang được bật cho Demo, có thể kiểm tra tại:

```text
https://YOUR-TUNNEL.trycloudflare.com/docs
```

Không công khai tài liệu API hoặc các Endpoint thử nghiệm nhạy cảm trong môi trường Production.

<!--
![Public FastAPI Swagger](/images/5-Workshop/5.9-Deployment/tunnel-swagger.png)
-->

#### 9. Kiểm tra cấu hình CORS

Frontend và Backend sử dụng hai origin khác nhau.

Ví dụ:

```text
Frontend:
https://main.d2p96elhe5x6se.amplifyapp.com

Backend:
https://YOUR-TUNNEL.trycloudflare.com
```

Trong cấu hình CORSMiddleware của FastAPI, cần cho phép origin của Amplify Frontend.

Không sử dụng URL Tunnel làm origin thay thế cho Website Amplify.

Cloudflare Tunnel cung cấp HTTPS Connectivity nhưng không tự động thay thế cấu hình CORS của FastAPI.

Kiểm tra CORS sẽ được thực hiện lại sau khi Frontend đã triển khai.

#### 10. Giữ môi trường Demo hoạt động

Trong quá trình Demo, cần duy trì hai tiến trình:

```text
Terminal 1: FastAPI Backend - port 8001
Terminal 2: Cloudflare Quick Tunnel
```

Nếu máy tính tắt, chuyển sang trạng thái Sleep hoặc mất kết nối Internet, Backend có thể không còn truy cập được qua Tunnel.

Nếu đóng cloudflared, HTTPS URL của Quick Tunnel sẽ ngừng hoạt động.

AWS Amplify Frontend vẫn có thể tải giao diện nhưng không thể thực hiện nghiệp vụ cần Backend.

#### 11. Xử lý các lỗi thường gặp

| Vấn đề | Nội dung kiểm tra |
| --- | --- |
| cloudflared không được nhận diện | PATH hoặc đường dẫn file thực thi |
| Health local thất bại | FastAPI Backend và port 8001 |
| HTTP 502 từ Cloudflare | Tunnel không kết nối được Backend local |
| URL Tunnel không hoạt động | Tiến trình cloudflared hoặc URL đã thay đổi |
| API trả HTTP 401 | Thông tin xác thực không hợp lệ |
| Trình duyệt báo CORS | Origin của Amplify chưa được cho phép |
| Frontend gọi localhost | Kiểm tra VITE_API_BASE_URL và build lại |

#### 12. Kết quả

Trong đợt kiểm thử ngày 09/11/2026, đồ án đã:

* Khởi chạy FastAPI Demo tại port 8001.
* Tạo Cloudflare Quick Tunnel bằng cloudflared.
* Kiểm tra HTTPS Health Endpoint thành công.
* Chuẩn bị HTTPS API URL cho Frontend trên AWS Amplify.

Kết quả này xác nhận Backend Demo có thể được truy cập qua HTTPS trong thời gian Tunnel và Backend đang hoạt động.

{{% notice warning %}}
Cloudflare Quick Tunnel được sử dụng để trình diễn và kiểm thử. Không xem đây là kiến trúc Production có tính sẵn sàng cao hoặc Endpoint cố định lâu dài.
{{% /notice %}}

[Tiếp theo: Triển khai Frontend lên AWS Amplify Hosting](../5.9.3-amplify-hosting/)
