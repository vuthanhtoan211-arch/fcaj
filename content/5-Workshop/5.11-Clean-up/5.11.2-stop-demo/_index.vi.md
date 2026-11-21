
---
title: "Dừng môi trường Demo"
date: 2026-11-09
weight: 2
chapter: false
pre: "<b>5.11.2.</b>"
---

## Dừng môi trường Demo

Trong phần này, chúng ta sẽ dừng các tiến trình chạy trên máy tính local sau khi hoàn thành buổi Demo.

Kiến trúc triển khai của đồ án sử dụng AWS Amplify Hosting cho Frontend và Cloudflare Quick Tunnel để kết nối Backend FastAPI.

Vì vậy, cần phân biệt giữa việc dừng Backend local và việc xóa tài nguyên Hosting trên AWS.

#### 1. Kiểm tra môi trường đang hoạt động

Môi trường Demo đã sử dụng:

```text
Frontend:
AWS Amplify Hosting

Backend:
127.0.0.1:8001

Cloudflare:
Quick Tunnel

Database:
SQLite Demo
```

Hai Terminal chính:

```text
Terminal 1: FastAPI Backend

Terminal 2: Cloudflare Quick Tunnel
```

<!--
![Demo running terminals](/images/5-Workshop/5.11-Clean-up/demo-terminals.png)
-->

#### 2. Kiểm tra dữ liệu trước khi dừng

Trước khi dừng:

1. Đăng nhập vào giao diện ADMIN.
2. Kiểm tra hoạt động Demo.
3. Ghi lại các Activity ID cần sử dụng tiếp.
4. Kiểm tra dữ liệu đã lưu.
5. Hoàn thành các ảnh chụp minh chứng cần thiết.

Nếu cần sao lưu SQLite, xác định đúng file database theo cấu hình Backend.

Không sao chép dữ liệu trong khi hệ thống đang ghi mà chưa sử dụng phương pháp sao lưu nhất quán.

#### 3. Dừng Cloudflare Quick Tunnel

Mở Terminal đang chạy cloudflared.

Ví dụ:

```powershell
cloudflared tunnel --url http://127.0.0.1:8001
```

Nhấn:

```text
Ctrl + C
```

Tiến trình cloudflared sẽ nhận yêu cầu dừng.

<!--
![Stop Cloudflare Tunnel](/images/5-Workshop/5.11-Clean-up/stop-cloudflare.png)
-->

Sau khi dừng, URL trycloudflare.com của phiên Demo sẽ không còn chuyển tiếp yêu cầu đến Backend.

Địa chỉ Tunnel cũ không được sử dụng làm Endpoint cố định trong tài liệu triển khai mới.

#### 4. Dừng FastAPI Backend

Mở Terminal đang chạy Uvicorn.

Ví dụ lệnh đã sử dụng:

```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

Nhấn:

```text
Ctrl + C
```

Kiểm tra Terminal đã kết thúc tiến trình.

<!--
![Stop FastAPI Backend](/images/5-Workshop/5.11-Clean-up/stop-backend.png)
-->

Không cần xóa thư mục Backend hoặc Virtual Environment để dừng ứng dụng.

#### 5. Kiểm tra port 8001

Mở PowerShell và thực hiện:

```powershell
Get-NetTCPConnection -LocalPort 8001 -State Listen -ErrorAction SilentlyContinue
```

Nếu không có kết quả, không còn tiến trình TCP đang lắng nghe trên port 8001 tại thời điểm kiểm tra.

Có thể kiểm tra thêm:

```powershell
Test-NetConnection 127.0.0.1 -Port 8001
```

Khi Backend đã dừng, TcpTestSucceeded thường trả về False.

<!--
![Verify backend stopped](/images/5-Workshop/5.11-Clean-up/backend-stopped.png)
-->

#### 6. Kiểm tra Website Amplify

Mở Website Amplify đã triển khai:

```text
https://main.d2p96elhe5x6se.amplifyapp.com
```

Nếu Amplify App vẫn được giữ lại, các tài nguyên Frontend vẫn có thể được tải từ AWS.

Tuy nhiên, chức năng cần gọi Backend sẽ không hoạt động khi Tunnel đã dừng.

Điều này phản ánh đúng kiến trúc:

```text
AWS Amplify Frontend
          |
          v
Cloudflare Quick Tunnel
          |
          v
Local FastAPI Backend
```

Website được Hosting trên Cloud không đồng nghĩa với Backend cũng đang hoạt động trên Cloud.

#### 7. Kiểm tra Frontend local

Nếu Frontend local vẫn đang chạy bằng:

```powershell
npm run dev
```

Nhấn Ctrl + C trong Terminal tương ứng.

Việc dừng Vite Development Server không ảnh hưởng đến ứng dụng đang được Hosting trên Amplify.

#### 8. Bảo toàn dữ liệu SQLite

Sau khi Backend dừng hoàn toàn:

* Xác định đúng file SQLite Demo.
* Lưu một bản sao nếu cần tiếp tục phát triển.
* Giữ nguyên source code Backend.
* Giữ lại cấu hình cần thiết để tái khởi chạy Demo.

Không xóa file SQLite nếu chưa chắc dữ liệu đã được lưu ở nơi khác.

#### 9. Phân biệt dừng và xóa

| Thao tác | Ảnh hưởng |
| --- | --- |
| Dừng FastAPI | Backend local không tiếp nhận Request |
| Dừng cloudflared | Tunnel ngừng chuyển tiếp |
| Dừng Vite | Frontend Development Server dừng |
| Giữ Amplify App | Website tiếp tục được Hosting |
| Xóa Amplify App | Ngừng Hosting ứng dụng đó |
| Xóa SQLite | Có thể mất dữ liệu Demo |

#### Kết quả

Sau khi hoàn thành phần này, môi trường Demo local đã được dừng một cách có kiểm soát.

Source code, cơ sở dữ liệu cần giữ lại và tài nguyên AWS không bị xóa chỉ vì các tiến trình local kết thúc.

[Tiếp theo: Dọn dẹp tài nguyên thử nghiệm AWS](../5.11.3-clean-aws/)
