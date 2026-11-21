
---
title: "Ghi nhận Check-in và Check-out"
date: 2026-11-09
weight: 3
chapter: false
pre: "<b>5.6.3.</b>"
---

## Ghi nhận Check-in và Check-out

Trong phần này, chúng ta sẽ thực hành ghi nhận điểm danh sinh viên theo thời gian thực trong hệ thống Student Activity Management & Engagement Analytics Platform.

Check-in ghi nhận sự có mặt của sinh viên khi tham gia hoạt động.

Check-out ghi nhận thời điểm sinh viên hoàn thành hoặc rời hoạt động theo quy định nghiệp vụ.

Cả hai thao tác được thực hiện thông qua giao diện Web và FastAPI REST API.

#### 1. Tìm hiểu luồng xử lý điểm danh

```text
ADMIN / Organizer
       |
       v
Scan Student Card QR
or Enter Student ID
       |
       v
React / Vite Frontend
       |
       | POST Check-in / Check-out
       v
FastAPI Backend
       |
       v
Validate Business Rules
       |
       v
Store Attendance Record
       |
       v
Return API Response
       |
       v
Display Attendance Result
```

Backend kiểm tra:

* Thông tin xác thực và quyền người dùng.
* Activity ID.
* MSSV.
* Trạng thái hoạt động.
* Điều kiện đăng ký nếu nghiệp vụ yêu cầu.
* Khung thời gian điểm danh.
* Bản ghi điểm danh đã tồn tại.

Sau khi các điều kiện được đáp ứng, Backend ghi nhận dữ liệu Attendance và trả về kết quả.

#### 2. Chuẩn bị môi trường thực hành

Đảm bảo đã hoàn thành phần 5.6.1 và 5.6.2.

Mở Backend Terminal:

```powershell
cd C:\Projects\student-activity-platform\backend

.\.venv\Scripts\Activate.ps1

$env:SAP_DEMO_MODE="1"

python -m uvicorn app.main:app --reload
```

Mở Frontend Terminal:

```powershell
cd C:\Projects\student-activity-platform\frontend

npm run dev
```

Truy cập:

[http://localhost:5173](http://localhost:5173)

Nếu cả Backend và Frontend đã hoạt động, không cần khởi chạy thêm một phiên mới.

#### 3. Đăng nhập và chọn hoạt động

1. Đăng nhập bằng tài khoản ADMIN Demo.
2. Mở chức năng quản lý hoạt động.
3. Chọn hoạt động đã chuẩn bị.
4. Mở giao diện điểm danh.
5. Kiểm tra tên hoạt động, trạng thái và thời gian tổ chức.

<!--
![Attendance management page](/images/5-Workshop/5.6-Registration-Attendance/attendance-management.png)
-->

Đảm bảo thời điểm hiện tại nằm trong khoảng được phép Check-in.

#### 4. Thực hiện Check-in trên giao diện

##### Bước 1: Tiếp nhận MSSV

Sử dụng một sinh viên trong danh sách đăng ký mẫu:

```text
MSSV: 0818000001
```

Ban Tổ chức có thể:

* Quét mã QR trên thẻ sinh viên bằng thiết bị tương thích.
* Nhập MSSV thủ công trong giao diện điểm danh.

<!--
![Input student ID](/images/5-Workshop/5.6-Registration-Attendance/check-in-input.png)
-->

##### Bước 2: Gửi yêu cầu Check-in

Chọn chức năng Check-in trên giao diện.

Frontend gửi yêu cầu đến Endpoint:

```text
POST /activities/{activity_id}/check-in
```

Trong đó:

* activity_id: Mã của hoạt động đang được chọn.
* Request Body: Thông tin MSSV theo API Schema.
* Authorization: Access Token của ADMIN.

Backend kiểm tra dữ liệu và các điều kiện nghiệp vụ trước khi lưu.

##### Bước 3: Kiểm tra kết quả

Sau khi Request được xử lý thành công, giao diện cần hiển thị kết quả Check-in phù hợp.

Ví dụ minh họa:

```text
Student ID: 0818000001
Activity: AWS Workshop Demo
Operation: Check-in
Result: Success
```

Thời gian thực tế được ghi nhận theo cơ chế của Backend.

<!--
![Check-in successful](/images/5-Workshop/5.6-Registration-Attendance/check-in-success.png)
-->

Không xem thao tác nhập MSSV là đã điểm danh thành công nếu chưa nhận được kết quả xác nhận từ Backend.

#### 5. Kiểm tra Check-in API bằng Swagger UI

Mở:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

1. Đăng nhập qua API POST /auth/login nếu chưa có Access Token.
2. Cấu hình xác thực theo cơ chế của Swagger UI.
3. Tìm POST /activities/{activity_id}/check-in.
4. Chọn Try it out.
5. Nhập Activity ID.
6. Nhập dữ liệu sinh viên theo Request Body thực tế.
7. Chọn Execute.
8. Kiểm tra HTTP Status Code và Response Body.

<!--
![Check-in Swagger API](/images/5-Workshop/5.6-Registration-Attendance/check-in-api.png)
-->

Ví dụ Request Body minh họa:

```json
{
    "mssv": "0818000002"
}
```

Tên trường và các thuộc tính bắt buộc phải được kiểm tra theo Swagger UI hiện tại.

Sử dụng sinh viên khác với sinh viên vừa Check-in ở bước trước nếu muốn thực hiện một bài kiểm thử Check-in thành công mới.

{{% notice note %}}
Nếu kiểm thử lại cùng một sinh viên đã Check-in, Backend có thể báo thao tác trùng lặp. Đây là tình huống kiểm tra quy tắc nghiệp vụ, không phải lỗi kết nối API.
{{% /notice %}}

#### 6. Kiểm thử các trường hợp Check-in không hợp lệ

Để xác nhận Backend xử lý đúng nghiệp vụ, thực hiện các bài kiểm thử sau trên dữ liệu Demo.

##### Trường hợp 1: Check-in trùng lặp

Sử dụng MSSV đã Check-in thành công và thực hiện Check-in lần nữa.

Kết quả mong đợi:

* Backend nhận diện bản ghi đã tồn tại.
* Không tạo thêm lượt Check-in độc lập cho cùng sinh viên và hoạt động.
* Giao diện hiển thị kết quả hoặc thông báo phù hợp.

<!--
![Duplicate check-in](/images/5-Workshop/5.6-Registration-Attendance/duplicate-check-in.png)
-->

##### Trường hợp 2: MSSV không hợp lệ

Nhập MSSV không tồn tại trong dữ liệu thử nghiệm hoặc không đúng định dạng.

Kết quả mong đợi:

* Backend từ chối hoặc xử lý theo quy tắc hiện tại.
* Không ghi nhận điểm danh sai cho một sinh viên khác.

##### Trường hợp 3: Ngoài thời gian Check-in

Thực hiện với hoạt động chưa mở hoặc đã hết khung thời gian Check-in.

Kết quả mong đợi:

* Backend kiểm tra thời gian.
* Request không được ghi nhận sai quy định.

<!--
![Attendance time validation](/images/5-Workshop/5.6-Registration-Attendance/check-in-time-error.png)
-->

##### Trường hợp 4: Không đủ quyền

Sử dụng tài khoản STUDENT để gọi API điểm danh quản trị.

Kết quả mong đợi:

* Backend từ chối nếu người dùng không có quyền thực hiện.
* Không tạo Attendance Record trái quyền.

#### 7. Thực hiện Check-out trên giao diện

Sau khi sinh viên đã Check-in và đáp ứng điều kiện Check-out:

1. Mở lại giao diện điểm danh.
2. Chọn đúng hoạt động.
3. Chọn thao tác Check-out.
4. Quét mã QR hoặc nhập MSSV đã Check-in.
5. Gửi yêu cầu Check-out.

Ví dụ:

```text
MSSV: 0818000001
```

Frontend gửi Request đến:

```text
POST /activities/{activity_id}/check-out
```

<!--
![Check-out interface](/images/5-Workshop/5.6-Registration-Attendance/check-out-input.png)
-->

Backend kiểm tra các điều kiện Check-out và cập nhật bản ghi Attendance tương ứng.

Kết quả mong đợi:

```text
Student ID: 0818000001
Activity: AWS Workshop Demo
Operation: Check-out
Result: Success
```

<!--
![Check-out successful](/images/5-Workshop/5.6-Registration-Attendance/check-out-success.png)
-->

{{% notice note %}}
Chỉ thực hiện Check-out thành công khi thời gian và trạng thái hoạt động đáp ứng quy tắc nghiệp vụ. Không giả định rằng có thể Check-out ngay sau Check-in trong mọi trường hợp.
{{% /notice %}}

#### 8. Kiểm tra Check-out API

Mở Swagger UI.

Tìm Endpoint:

```text
POST /activities/{activity_id}/check-out
```

Thực hiện:

1. Cung cấp Access Token của ADMIN.
2. Nhập Activity ID.
3. Nhập MSSV đã có bản ghi Check-in.
4. Kiểm tra các trường bắt buộc trong Request Body.
5. Gửi Request.
6. Kiểm tra Response.

<!--
![Check-out Swagger API](/images/5-Workshop/5.6-Registration-Attendance/check-out-api.png)
-->

Sử dụng một sinh viên chưa Check-out để kiểm thử lần ghi nhận đầu tiên.

#### 9. Kiểm thử các trường hợp Check-out không hợp lệ

| Test Case | Kết quả mong đợi |
| --- | --- |
| Check-out hợp lệ | Bản ghi Attendance được cập nhật |
| Chưa Check-in | Xử lý theo quy tắc nghiệp vụ |
| Check-out trùng lặp | Không tạo lượt Check-out trùng |
| Ngoài thời gian cho phép | Backend xử lý theo quy tắc thời gian |
| Sai Activity ID | Không cập nhật hoạt động khác |
| MSSV không hợp lệ | Không ghi nhận dữ liệu sai |
| STUDENT gọi API quản trị | Từ chối nếu không đủ quyền |

#### 10. Kiểm tra Attendance trong giao diện

Sau khi hoàn thành Check-in và Check-out, mở danh sách điểm danh của hoạt động.

Ví dụ dữ liệu minh họa:

| MSSV | Check-in | Check-out |
| --- | --- | --- |
| 0818000001 | 08:05 | 11:30 |
| 0818000002 | 08:10 | Chưa ghi nhận |
| 0818000003 | Chưa ghi nhận | Chưa ghi nhận |

Các mốc thời gian trên chỉ dùng để minh họa cách hiển thị. Kết quả thực hành phải lấy từ dữ liệu được Backend ghi nhận.

Danh sách giúp Ban Tổ chức theo dõi:

* Sinh viên đã Check-in.
* Sinh viên đã Check-out.
* Sinh viên chưa điểm danh.
* Sinh viên còn thiếu Check-out.

<!--
![Attendance list](/images/5-Workshop/5.6-Registration-Attendance/attendance-list.png)
-->

#### 11. Kiểm tra HTTP Request và Response

Mở Developer Tools và chọn tab Network.

Kiểm tra Request Check-in/Check-out:

* Request URL.
* HTTP Method.
* Request Payload.
* HTTP Status Code.
* Response Body.

Các mã phản hồi thường gặp trong nhóm Attendance API có thể bao gồm:

| HTTP Status Code | Ý nghĩa |
| --- | --- |
| 200 | Request được xử lý thành công |
| 401 | Chưa được xác thực |
| 403 | Không đủ quyền |
| 404 | Không tìm thấy tài nguyên |
| 409 | Xung đột trạng thái hoặc thao tác nghiệp vụ |
| 422 | Dữ liệu hoặc điều kiện nghiệp vụ không hợp lệ |

Mã phản hồi cụ thể cần được đối chiếu với cách ánh xạ lỗi trong Backend Attendance Service.

<!--
![Attendance API network](/images/5-Workshop/5.6-Registration-Attendance/attendance-network.png)
-->

#### 12. Xử lý khi kết nối bị gián đoạn

Trong môi trường Demo, Backend FastAPI chạy local.

Nếu Backend không hoạt động hoặc Frontend mất kết nối:

* Giao diện có thể không gửi được yêu cầu điểm danh.
* Sinh viên không nên được đánh dấu thành công khi chưa có Response xác nhận.
* ADMIN cần kiểm tra kết nối và thử lại sau khi xác minh trạng thái bản ghi.

Nếu một Request bị mất phản hồi, dữ liệu có thể đã được Backend ghi nhận. Cần kiểm tra danh sách Attendance trước khi thực hiện lại.

Hệ thống hiện không mặc định có cơ chế điểm danh offline hoặc hàng đợi tự đồng bộ khi kết nối được khôi phục.

#### Kết quả

Sau khi hoàn thành phần này, chúng ta đã thực hành luồng điểm danh theo thời gian thực từ Frontend đến FastAPI.

Mỗi thao tác Check-in và Check-out được xử lý theo Activity ID, MSSV, quyền người dùng và các điều kiện nghiệp vụ.

Dữ liệu Attendance được sử dụng cho quá trình kiểm tra, đối soát và xác nhận tham gia trong các bước tiếp theo.

[Tiếp theo: Xác minh dữ liệu điểm danh](../5.6.4-verify-attendance/)
