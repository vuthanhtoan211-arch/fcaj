# Student Activity Management & Engagement Analytics Platform

> **Đồ án:** Hệ thống quản lý hoạt động sinh viên và phân tích mức độ tham gia  
> **Công nghệ:** React · Vite · JavaScript · FastAPI · Python · SQLite · AWS Amplify · Amazon DynamoDB · Amazon S3 · AWS IAM · AWS Lambda · Amazon CloudWatch  
> **Phạm vi:** Website demo + các luồng AWS Pilot / Serverless thử nghiệm riêng, **không phải production hoàn toàn trên AWS**.

## 1. Giới thiệu

**Student Activity Management & Engagement Analytics Platform** hỗ trợ quản lý hoạt động sinh viên từ tạo/công bố hoạt động, nhập đăng ký, ghi nhận tham gia, tiếp nhận minh chứng, đối soát kết quả đến phân tích và xuất báo cáo. Hệ thống phân tách hai vai trò **ADMIN** và **STUDENT**, kiểm tra quyền truy cập ở Backend.

Đồ án hiện minh họa **6 dịch vụ AWS** trong các phần triển khai và kiểm thử:

1. **AWS Amplify Hosting** — triển khai giao diện React/Vite.
2. **Amazon DynamoDB** — các luồng lưu/đọc dữ liệu thử nghiệm AWS Pilot.
3. **Amazon S3** — lưu file và dữ liệu demo, gồm CSV đầu vào và JSON đầu ra.
4. **AWS IAM** — execution role và policy giới hạn quyền Lambda.
5. **AWS Lambda** — xử lý CSV đăng ký giả bằng Python.
6. **Amazon CloudWatch** — nhật ký Lambda, retention 7 ngày.

**Phân biệt các môi trường:** Frontend của website được host trên AWS Amplify. Backend FastAPI phục vụ website demo hiện chạy trên máy Windows, truy cập qua **Cloudflare Quick Tunnel (HTTPS)** và lưu dữ liệu giả bằng SQLite. DynamoDB được tích hợp theo luồng AWS Pilot có giới hạn. Quy trình **S3 → Lambda → S3 + CloudWatch** đã được kiểm thử thực tế riêng; **chưa được nối vào luồng Import chính của website**.

## 2. Chức năng hệ thống

### ADMIN

- Đăng nhập/đăng xuất, quản lý hồ sơ, phiên đăng nhập, đổi mật khẩu và ảnh đại diện.
- Quản lý hoạt động: tạo, sửa, gửi duyệt, công bố, hủy và quản lý trạng thái.
- Quản lý tài khoản sinh viên: xem, khóa/mở khóa, đặt lại mật khẩu, đồng bộ tài khoản.
- Nhập danh sách đăng ký từ nguồn ngoài; xem trước và kiểm tra trước khi import.
- Ghi nhận **check-in/check-out ngay khi quét hoặc nhập MSSV** qua API Attendance; mở/đóng check-out và xử lý trùng lặp.
- Nhập minh chứng từ CSV/XLSX, xem trước và phát hiện bản ghi sai.
- Đối soát đăng ký, điểm danh và minh chứng; quyết định kết quả, chốt danh sách cuối.
- Xem Analytics, thông báo, xuất báo cáo Excel.

### STUDENT

- Đăng nhập và quản lý hồ sơ, mật khẩu.
- Xem hoạt động và thông tin được phép truy cập.
- Xem dữ liệu/kết quả tham gia cá nhân và thông báo liên quan.

> **Thiết kế nghiệp vụ:** Đăng ký có thể được nhập từ cổng trường hoặc dữ liệu Google Forms/Sheets xuất ra CSV/XLSX; hệ thống không bắt buộc sinh viên tự đăng ký trên web. Check-in/check-out được gửi và lưu **theo thời gian thực**, không chủ yếu nhập Excel sau sự kiện. Tính năng quét QR bằng camera trình duyệt chưa nghiệm thu trên bản AWS Amplify.

## 3. Kiến trúc thực tế — 6 dịch vụ AWS

### 3.1. Website đang chạy

```text
Người dùng (ADMIN / STUDENT)
           |
           v
AWS Amplify Hosting [1] — React / Vite
           |
           | HTTPS / REST + Bearer token
           v
Cloudflare Quick Tunnel (demo tạm thời; không phải AWS)
           |
           v
FastAPI trên máy Windows — Auth / Activities / Attendance /
                            Evidence / Reconciliation / Analytics / Export
           |
           +----> SQLite demo riêng (trạng thái ứng dụng và tài khoản giả)

AWS Pilot tách biệt:
FastAPI có mã tích hợp ---> Amazon DynamoDB [2] (các bảng/luồng Pilot)
                         Amazon S3 [3] (poster và file khi bật cấu hình)
```

**Không đồng nhất** DynamoDB Pilot với cơ sở dữ liệu chính của Backend demo: bản demo công khai **không cung cấp AWS credentials** và không tự động sử dụng DynamoDB/S3 cho toàn bộ thao tác. Quick Tunnel có URL thay đổi; khi Backend hoặc Tunnel dừng, website có thể không tải dữ liệu được.

### 3.2. Luồng serverless đã kiểm thử thành công

```text
Amazon S3 [3]
  sap-data-project-2026-huflit01
  lambda-demo/input/registrations.csv  (dữ liệu giả)
                 |
                 | s3:GetObject
                 v
           AWS Lambda [5]
           sap-csv-processor-demo
           Python 3.13 / boto3 / csv
           Kiểm tra MSSV thiếu, trùng và hợp lệ
                 |
          +------+------------------+
          |                         |
          | s3:PutObject            | stdout/logger
          v                         v
       Amazon S3 [3]         Amazon CloudWatch [6]
       lambda-demo/          /aws/lambda/sap-csv-processor-demo
       processed/            retention: 7 ngày
       registrations-result.json

AWS IAM [4] — execution role + policy giới hạn GetObject/PutObject theo prefix
```

Lambda được **gọi thủ công bằng Test Event `{}`**. Không cấu hình S3 Trigger, EventBridge Schedule, Function URL hay API Gateway; quy trình không chạy thường trực. Bản demo CSV là **bài kiểm thử serverless độc lập**, không đưa dữ liệu sinh viên thật lên AWS.

### 3.3. Vai trò và mức độ xác nhận của sáu dịch vụ

| Dịch vụ AWS | Tài nguyên/vai trò | Mức độ xác nhận |
|---|---|---|
| **Amplify Hosting** | React/Vite từ repository GitHub, branch `main` | Website đã deploy; đã kiểm thử giao diện và đăng nhập qua Backend demo HTTPS |
| **DynamoDB** | `SAP-Activities`, `SAP-Registrations`, `SAP-Attendance`, `SAP-Evidence`, `SAP-Participation` trong các luồng Pilot | Có repository, cấu hình và test scripts; từng thử nghiệm riêng trong quá trình phát triển. **Chưa tái kiểm tra trực tiếp trạng thái/ảnh Console các bảng trong đợt kiểm thử Lambda này** |
| **S3** | Bucket `sap-data-project-2026-huflit01` | **PASS trực tiếp:** upload CSV 117 B; Lambda đọc CSV, ghi JSON 55 B; nhìn thấy object đầu ra trên S3 |
| **IAM** | Role `sap-csv-processor-demo-role-9ui2ib5d` | **PASS:** role có policy ghi log và inline policy S3 hạn chế prefix |
| **Lambda** | Function `sap-csv-processor-demo` tại `ap-southeast-1` | **PASS:** Test trả `statusCode: 200`, xử lý CSV và lưu JSON |
| **CloudWatch** | `/aws/lambda/sap-csv-processor-demo` | **PASS:** log có dòng `SAP S3 demo processed`, retention **1 week (7 days)** |

## 4. Minh chứng kiểm thử S3 + Lambda + IAM + CloudWatch

**Ngày kiểm thử:** 10/11/2026 theo giờ Việt Nam (bản ghi AWS hiển thị 09/11/2026 UTC).  
**Region:** Asia Pacific (Singapore), `ap-southeast-1`.  
**Dữ liệu:** hoàn toàn giả, không chứa dữ liệu sinh viên thực tế.

### 4.1. Đầu vào

Object: `s3://sap-data-project-2026-huflit01/lambda-demo/input/registrations.csv`

```csv
mssv,full_name
DEMO001,Student Demo One
DEMO002,Student Demo Two
DEMO001,Student Demo Duplicate
,Student Demo Invalid
```

### 4.2. Đầu ra

Object: `s3://sap-data-project-2026-huflit01/lambda-demo/processed/registrations-result.json`

```json
{
  "total": 4,
  "valid": 2,
  "duplicates": 1,
  "invalid": 1
}
```

### 4.3. Kết quả thực thi đã xác nhận

| Chỉ số | Kết quả |
|---|---:|
| Lambda `statusCode` | **200** |
| Tổng bản ghi | 4 |
| Bản ghi hợp lệ, MSSV không trùng | 2 |
| Bản ghi trùng MSSV | 1 |
| Bản ghi thiếu/không hợp lệ | 1 |
| Duration | **404,97 ms** |
| Billed duration (ghi nhận tại lần test) | **892 ms** |
| Memory cấu hình | **128 MB** |
| Max memory used | **93 MB** |
| File JSON đầu ra trên S3 | **Đã xác nhận, 55 B** |
| CloudWatch log | **PASS**, `SAP S3 demo processed: {'total': 4, 'valid': 2, 'duplicates': 1, 'invalid': 1}` |
| CloudWatch log retention | **7 ngày** |

Lưu ý: `statusCode: 200` ở trên là **trường do Python Lambda trả về**, không có nghĩa hệ thống đã triển khai API Gateway hay endpoint HTTP công khai.

### 4.4. Phân quyền IAM dùng cho demo

- Role: `sap-csv-processor-demo-role-9ui2ib5d`.
- Policy ghi log Lambda cơ bản (tự động tạo khi tạo function).
- Inline policy `SAP-Lambda-S3-Demo-Access`:
  - `s3:GetObject` chỉ cho `arn:aws:s3:::sap-data-project-2026-huflit01/lambda-demo/input/*`.
  - `s3:PutObject` chỉ cho `arn:aws:s3:::sap-data-project-2026-huflit01/lambda-demo/processed/*`.
  - Không cấp quyền `s3:DeleteObject`, `s3:*`, hoặc truy cập toàn bộ bucket.

Trên bucket có thể còn policy hoặc điều kiện mã hóa riêng; các quyền IAM trên **không thay thế** bucket policy hoặc yêu cầu KMS nếu được bật. Không đưa AWS access keys vào source code.

## 5. Cấu trúc thư mục mã nguồn

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
│   │   └── main.py
│   ├── requirements.txt
│   └── test_*.py                 # Các bài kiểm thử chức năng/AWS Pilot
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

**Lưu ý:** Code Lambda đã được nhập và triển khai trên AWS Console; **chưa xác nhận có file Lambda tương ứng được commit vào repository**. Không nhận định GitHub tự động chứa code đã sửa trực tiếp trên Console. Các SQLite, file `.env`, `.venv`, `node_modules`, uploads, AWS credentials và dữ liệu sinh viên thật **không được commit**.

## 6. Hướng dẫn chạy ứng dụng trên Windows

### 6.1. Backend phát triển local

Yêu cầu Python tương thích `backend/requirements.txt`, Node.js/npm, PowerShell.

```powershell
cd C:\Projects\student-activity-platform\backend
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

# Chỉ dùng cho môi trường phát triển với dữ liệu giả.
$env:SAP_ADMIN_USERNAME = "admin"
$env:SAP_ADMIN_PASSWORD = Read-Host "Mat khau admin moi"
$env:SAP_STUDENT_INITIAL_PASSWORD = Read-Host "Mat khau sinh vien khoi tao"
$env:SAP_DEMO_MODE = "1"

.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- Health: `http://127.0.0.1:8000/health`.
- OpenAPI `/docs` có thể dùng khi phát triển nhưng **bị tắt trong bản Backend demo công khai**.
- Các biến mật khẩu khởi tạo **không tự đổi mật khẩu** của tài khoản SQLite đã tồn tại.

### 6.2. Frontend

```powershell
cd C:\Projects\student-activity-platform\frontend
npm.cmd ci
```

Tạo file `.env.local` trong `frontend/` (không commit):

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000
```

```powershell
npm.cmd run dev
```

Mở URL Vite in ra, thường `http://localhost:5173` hoặc `http://localhost:5174`. Sau khi sửa `.env.local`, khởi động lại Vite.

### 6.3. Backend demo độc lập đã dùng khi thử nghiệm

Backend demo được tách khỏi dữ liệu làm việc tại `C:\Projects\sap-cloud-demo\backend`, sử dụng SQLite riêng, port `8001`, cờ `SAP_DEMO_MODE=1` và **không cung cấp AWS credentials**. Không trỏ Quick Tunnel về port `8000` của Backend gốc có thể chứa dữ liệu thật.

Bản demo HTTPS sử dụng Cloudflare Quick Tunnel; hostname tạm thời thay đổi giữa các phiên. Khi đổi URL Quick Tunnel, cần cập nhật `VITE_API_BASE_URL` trên Amplify và redeploy. Các biến `VITE_*` được đóng gói vào trình duyệt nên không được chứa secrets.

## 7. Triển khai AWS Amplify

- Repository: https://github.com/vuthanhtoan211-arch/fcaj
- Branch: `main`.
- Frontend monorepo: `student-activity-platform/frontend`.
- Build: `npm ci` và `npm run build`; output: `dist`.
- Website: https://main.d2p96elhe5x6se.amplifyapp.com
- Frontend gọi FastAPI Backend qua HTTPS của Cloudflare Quick Tunnel; **Amplify không host FastAPI**.

Website có thể tải giao diện nhưng không đăng nhập/lấy dữ liệu nếu Backend Windows hoặc Tunnel dừng. Triển khai hiện tại chỉ phù hợp để trình diễn, không bảo đảm SLA hay uptime production.

## 8. API và luồng dữ liệu chính

| Nhóm | Endpoint / nghiệp vụ tiêu biểu |
|---|---|
| Authentication | `POST /auth/login`, `GET /auth/me`, đổi mật khẩu |
| Quản lý sinh viên | `GET /admin/students`, `PATCH /admin/students/{username}/status`, reset mật khẩu |
| Activities | Tạo/sửa/gửi duyệt/công bố/hủy hoạt động |
| Registrations | `POST /activities/{activity_id}/registrations/preview`, `/import`; `GET` danh sách |
| Attendance | `POST /activities/{activity_id}/check-in`, `/check-out`; mở/đóng Check-out |
| Evidence | Preview/import và xem dữ liệu minh chứng |
| Reconciliation | Reconcile, quyết định, finalize |
| Analytics/Export | Tổng hợp Analytics, xuất dữ liệu theo loại |

**Luồng nghiệp vụ:** Tạo hoạt động → Import đăng ký → Check-in/Check-out thời gian thực → Import minh chứng → Đối soát → Chốt danh sách → Analytics/Export.

Bài test Lambda CSV là **một luồng AWS độc lập** minh họa tiền xử lý dữ liệu; chưa thay thế API import của FastAPI.

## 9. Bảng tổng hợp kiểm thử

| Hạng mục | Trạng thái và giới hạn |
|---|---|
| Amplify deploy, kết nối website đến Backend demo | **Đã kiểm thử thành công** |
| Đăng nhập ADMIN/STUDENT, tạo hoạt động demo | **Đã kiểm thử thành công** |
| API quản trị không token | Trước đó đã xác nhận trả 401 ở endpoint kiểm tra |
| STUDENT gọi API ADMIN trả 403 | **Chưa xác nhận lại bằng kết quả HTTP trong đợt này**; không tự khẳng định PASS |
| Import, Attendance, Evidence, Reconciliation, Analytics, Excel export | Có mã nguồn/API; bằng chứng từng nghiệp vụ cần được kiểm tra riêng khi tổng hợp test case |
| DynamoDB Pilot | Có các repository/kiểm thử AWS Pilot; chưa tái xác nhận bảng bằng AWS Console trong đợt này |
| S3 upload CSV demo | **PASS:** `registrations.csv`, 117 B |
| Lambda đọc CSV và tạo JSON trên S3 | **PASS:** `statusCode: 200`, số liệu `4 / 2 / 1 / 1` |
| IAM role/policy hạn chế S3 | **PASS:** role và inline policy hiện trong IAM |
| CloudWatch log và retention | **PASS:** bản ghi lần xử lý S3, retention 7 ngày |
| Quét QR bằng camera trình duyệt | Đang để ngoài phạm vi nghiệm thu bản Amplify hiện tại |

Có mã kiểm thử không có nghĩa toàn bộ hệ thống PASS hoặc đủ điều kiện production.

## 10. Bảo mật, chi phí và giới hạn vận hành

- Chỉ dùng **dữ liệu giả** khi thử AWS. Không đưa tên/MSSV thật, SQLite, mật khẩu, bearer token, AWS access keys vào GitHub hoặc log.
- Lambda `sap-csv-processor-demo`: cấu hình 128 MB, timeout 10 giây; **không bật trigger tự động**, Function URL, VPC hoặc capacity provider.
- IAM chỉ cho Lambda đọc `lambda-demo/input/*`, ghi `lambda-demo/processed/*`. Không cấp `AmazonS3FullAccess`.
- CloudWatch log group `/aws/lambda/sap-csv-processor-demo` đặt retention **7 ngày**.
- IAM cơ bản không thu phí riêng; Lambda, S3, CloudWatch, DynamoDB và Amplify có thể phát sinh chi phí theo sử dụng/hạn mức Free Tier. **Billing 0 USD ở lần kiểm tra trước không bảo đảm tất cả phát sinh sau đó bằng 0**; cần xem Bills/Free Tier và đặt Budget cảnh báo theo tài khoản.
- Nếu bucket bật **versioning**, ghi đè một JSON cùng tên có thể giữ lại các phiên bản cũ và phát sinh lưu trữ; hạn chế chạy lại Test không cần thiết.
- Không bật AWS credentials cho Backend demo công khai. Không tự động tạo thêm tài nguyên AWS nếu không có nhu cầu.
- Cần rà soát dependency vulnerabilities, CORS, giới hạn tệp tải lên, giới hạn tốc độ, backup/restore và IAM trước khi triển khai production.
- Cloudflare Quick Tunnel chỉ dùng demo; tắt khi không sử dụng. Hệ thống **chưa triển khai toàn bộ Backend trên AWS**.

## 11. Minh chứng nên lưu cho báo cáo

1. **Amplify:** Hosting/build/deployment status và trang web sử dụng được.
2. **DynamoDB:** Danh sách bảng AWS Pilot và kết quả kiểm thử đã xác nhận (bổ sung ảnh nếu chưa có).
3. **S3:** `lambda-demo/input/registrations.csv` và `lambda-demo/processed/registrations-result.json`.
4. **IAM:** Role `sap-csv-processor-demo-role-9ui2ib5d` và hai policy liên quan.
5. **Lambda:** Test Response `statusCode: 200`, số liệu `total=4, valid=2, duplicates=1, invalid=1`.
6. **CloudWatch:** Log stream có `SAP S3 demo processed`, mục Retention `1 week`.
7. **Billing:** Ảnh Bills/Free Tier sau khi dữ liệu sử dụng được cập nhật.

Không commit screenshots chứa mật khẩu/token, danh tính sinh viên thật hoặc cấu hình bảo mật nhạy cảm. Có thể ẩn số tài khoản AWS trong ảnh minh chứng công khai.

## 12. Checklist bàn giao

- [x] Xây dựng React/Vite Frontend và FastAPI Backend.
- [x] Phân tách vai trò ADMIN và STUDENT.
- [x] Host Frontend trên AWS Amplify.
- [x] Kết nối bản demo Frontend ↔ Backend qua HTTPS.
- [x] Có mã AWS Pilot DynamoDB và S3 cho các nghiệp vụ lựa chọn.
- [x] Kiểm thử S3 → Lambda → S3 bằng CSV giả và JSON kết quả.
- [x] IAM execution role và chính sách S3 giới hạn quyền.
- [x] CloudWatch ghi log thành công, retention 7 ngày.
- [ ] Bổ sung ảnh/chứng cứ DynamoDB Pilot đã xác minh cho hồ sơ nộp.
- [ ] Tổng hợp kết quả test-case của các luồng nghiệp vụ chính dựa trên bằng chứng thực tế.
- [ ] Đưa README mới vào repository; lưu code Lambda thành file nguồn trong repository nếu muốn tái triển khai được.
- [ ] Hoàn thiện sơ đồ kiến trúc, hình minh chứng, báo cáo/video demo.
- [ ] Kiểm tra Billing sau khi cập nhật và dọn tài nguyên demo khi không còn cần.

## 13. Liên kết

- **Repository:** https://github.com/vuthanhtoan211-arch/fcaj
- **Mã nguồn ứng dụng:** https://github.com/vuthanhtoan211-arch/fcaj/tree/main/student-activity-platform
- **Website demo trên Amplify:** https://main.d2p96elhe5x6se.amplifyapp.com

> **Tuyên bố phạm vi cuối:** Đồ án có **6 dịch vụ AWS được sử dụng qua các phần triển khai/thử nghiệm**. Đã xác nhận trực tiếp chuỗi **Amazon S3 + IAM + Lambda + CloudWatch** và việc host Frontend trên **Amplify**. **DynamoDB** là tích hợp **AWS Pilot**, không phải nơi lưu toàn bộ dữ liệu của bản Backend demo SQLite. Các kết quả này không đồng nghĩa hệ thống hoàn toàn serverless hoặc đã sẵn sàng chạy production.
