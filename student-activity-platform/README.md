# Student Activity Management & Engagement Analytics Platform

> **Đồ án:** Hệ thống quản lý hoạt động sinh viên và phân tích mức độ tham gia  
> **Công nghệ:** React · Vite · FastAPI · Python · SQLite · AWS (DynamoDB Pilot)

## 1. Tổng quan

Student Activity Management & Engagement Analytics Platform hỗ trợ quản lý hoạt động dành cho sinh viên từ khâu tạo và công bố hoạt động, nhập danh sách đăng ký, ghi nhận tham gia, tiếp nhận minh chứng, đối soát kết quả đến phân tích và xuất báo cáo.

Hệ thống phân tách hai vai trò **ADMIN** và **STUDENT**. Các thao tác quản trị được xác thực và kiểm tra quyền ở Backend; sinh viên có thể theo dõi hoạt động và xem dữ liệu tham gia của chính mình.

> **Phạm vi hiện tại:** Ứng dụng đã được phát triển và kiểm thử trong môi trường local. Một số luồng được thử nghiệm riêng với AWS DynamoDB (Pilot, sử dụng dữ liệu giả). Đây **chưa phải** bản triển khai production hoàn chỉnh; không sử dụng dữ liệu sinh viên thật để chạy thử AWS Pilot.

## 2. Chức năng

### ADMIN

- Đăng nhập, quản lý phiên và hồ sơ tài khoản; cập nhật thông tin và ảnh đại diện; đổi mật khẩu.
- Quản lý hoạt động: tạo, chỉnh sửa, gửi duyệt, công bố, hủy và quản lý trạng thái hoạt động.
- Quản lý tài khoản sinh viên: xem, khóa/mở khóa, đặt lại mật khẩu và đồng bộ tài khoản.
- Nhập danh sách đăng ký từ dữ liệu nguồn; kiểm tra dữ liệu trước khi nhập.
- Ghi nhận **check-in/check-out** theo thời gian thực thông qua thao tác quét mã và API Attendance.
- Nhập minh chứng tham gia (Evidence) từ **CSV/XLSX**, xem trước kết quả và phát hiện bản ghi không hợp lệ.
- Đối soát dữ liệu đăng ký, điểm danh và minh chứng; xử lý kết quả và khóa danh sách cuối khi phù hợp.
- Xem Analytics, thông báo và xuất dữ liệu phục vụ báo cáo.

### STUDENT

- Đăng nhập và quản lý hồ sơ cá nhân, ảnh đại diện, mật khẩu.
- Xem danh sách và chi tiết hoạt động được phép truy cập.
- Xem hoạt động đã tham gia, kết quả cá nhân và phân tích dành cho sinh viên.
- Nhận và xem thông báo liên quan.

## 3. Công nghệ và kiến trúc

| Thành phần | Công nghệ / vai trò |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Python, FastAPI, REST API |
| Cơ sở dữ liệu local | SQLite: tài khoản/phiên, trạng thái ứng dụng, thông báo |
| Kiểm soát truy cập | Bearer token lưu phiên trong SQLite; quyền ADMIN / STUDENT |
| Dữ liệu đầu vào | CSV, XLSX, dữ liệu minh chứng từ Google Forms/Sheets được xuất ra file |
| AWS Pilot | Thử nghiệm tích hợp DynamoDB trên phạm vi hoạt động và dữ liệu TEST được giới hạn |

**Luồng xử lý khái quát:**

```text
React / Vite Frontend
        |
        | REST API + Bearer token
        v
FastAPI Backend
        |-- Authentication / Authorization
        |-- Activities / Registration / Attendance
        |-- Evidence / Reconciliation / Analytics
        |-- Notifications / Exports
        |
        +-- SQLite (local application state + auth + notifications)
        |
        +-- AWS DynamoDB (chỉ các luồng Pilot được bật và cấu hình)
```

**Lưu ý về Attendance:** Check-in và check-out được ghi nhận ngay khi thao tác, không phải chủ yếu nhập điểm danh hàng loạt từ Excel. Dữ liệu đăng ký và Evidence có thể nhập từ file tùy quy trình.

## 4. Cấu trúc thư mục

```text
student-activity-platform/
├── backend/
│   ├── app/
│   │   ├── data/
│   │   ├── repositories/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── auth.py
│   │   ├── auth_db.py
│   │   ├── main.py
│   │   ├── notification_db.py
│   │   └── persistence.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

> Dữ liệu SQLite, file `.env`, tệp upload, môi trường Python `.venv` và `node_modules` không được đưa vào repository. Vì vậy, chạy mã nguồn mới clone sẽ không có dữ liệu và ảnh đại diện đã tạo trên máy phát triển.

## 5. Hướng dẫn chạy trên Windows (môi trường local)

**Yêu cầu:** Git, Python tương thích với `backend/requirements.txt`, Node.js và npm. Có thể dùng hai cửa sổ PowerShell để chạy Backend và Frontend.

### 5.1. Khởi tạo Backend

Từ thư mục `student-activity-platform/backend`:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Để khởi tạo tài khoản mới trong **môi trường local thử nghiệm**, cần cấu hình mật khẩu khởi tạo thông qua biến môi trường. Không lưu mật khẩu thật trong mã nguồn hoặc commit lên GitHub:

```powershell
# Thay <...> bằng giá trị riêng trên máy của bạn.
$env:SAP_ADMIN_USERNAME = "admin"
$env:SAP_ADMIN_PASSWORD = "<mat-khau-admin-rieng>"
$env:SAP_STUDENT_INITIAL_PASSWORD = "<mat-khau-sinh-vien-khoi-tao-rieng>"

# Chỉ bật nếu cần chạy các luồng demo tương ứng.
$env:SAP_DEMO_MODE = "1"

.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Backend local: `http://127.0.0.1:8000`  
Tài liệu API (development): `http://127.0.0.1:8000/docs`  
Health check: `http://127.0.0.1:8000/health`

**Quan trọng:** Mật khẩu khởi tạo chỉ phục vụ quá trình tạo tài khoản mới; chúng không tự thay đổi mật khẩu của tài khoản SQLite đã tồn tại. Không dùng mật khẩu mẫu hoặc dữ liệu thật trong môi trường thử nghiệm công khai.

### 5.2. Khởi tạo Frontend

Mở PowerShell khác, vào `student-activity-platform/frontend`:

```powershell
npm ci
npm run dev
```

Mở URL do Vite hiển thị (thông thường là `http://localhost:5173`). Trong phiên bản mã nguồn hiện tại, địa chỉ Backend phía Frontend được cấu hình cho `http://127.0.0.1:8000`; khi triển khai lên môi trường khác phải chuyển sang cấu hình phù hợp.

## 6. Bảo mật và dữ liệu thử nghiệm

- API quản trị yêu cầu quyền **ADMIN** ở Backend; việc ẩn nút trên giao diện không thay thế kiểm tra quyền API.
- Tài khoản **STUDENT** chỉ được truy cập các API được phân quyền; dữ liệu cá nhân truy cập qua các endpoint dành cho sinh viên.
- Hệ thống hỗ trợ đổi mật khẩu, khóa tài khoản và thu hồi phiên đăng nhập.
- Các thư mục SQLite, uploads và biến môi trường được loại trừ qua `.gitignore`.
- AWS Pilot chỉ dành cho hoạt động kiểm thử đã cấu hình và các MSSV TEST; **không xem AWS Pilot là hệ thống production**.
- Trước khi triển khai public/production cần rà soát thêm: bí mật cấu hình, mật khẩu khởi tạo, CORS, xử lý tệp tải lên, giới hạn tài nguyên và cách lưu trữ dữ liệu bền vững.

## 7. Phạm vi kiểm thử đã thực hiện

Các luồng đã được thử nghiệm trong quá trình phát triển bao gồm:

- Đăng nhập, phân quyền ADMIN/STUDENT và truy cập hồ sơ.
- Cập nhật email, số điện thoại và ảnh đại diện; giữ dữ liệu sau tải lại/đăng nhập lại.
- Đổi mật khẩu và đăng nhập với mật khẩu mới.
- Các API GET quản trị được kiểm tra với tài khoản STUDENT trả về HTTP `403` theo kỳ vọng.
- Các chức năng Attendance, Evidence, Reconciliation, Analytics, Export và một số luồng AWS Pilot đã được kiểm tra riêng trong quá trình phát triển.

Các kiểm thử trên **không đồng nghĩa** toàn bộ hệ thống đã được kiểm toán bảo mật hoặc vận hành production.

## 8. Hướng phát triển

- Hoàn thiện cấu hình triển khai theo môi trường (development/staging/production).
- Bổ sung tài liệu API, dữ liệu demo an toàn và kịch bản kiểm thử tự động.
- Tối ưu giới hạn tệp import, xử lý lỗi và nhật ký vận hành.
- Hoàn thiện triển khai trên AWS và xây dựng tài liệu vận hành/khôi phục dữ liệu.
- Bổ sung sơ đồ kiến trúc, ảnh chụp giao diện và video demo vào hồ sơ nộp đồ án.

---

**Repository tổng hợp bài nộp:** [FCJ / Blog / Worklog / Source Code](https://github.com/vuthanhtoan211-arch/fcaj)  
**Thư mục đồ án:** [student-activity-platform](https://github.com/vuthanhtoan211-arch/fcaj/tree/main/student-activity-platform)
