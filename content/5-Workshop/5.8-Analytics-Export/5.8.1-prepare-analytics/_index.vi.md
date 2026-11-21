
---
title: "Chuẩn bị dữ liệu và chỉ số phân tích"
date: 2026-11-09
weight: 1
chapter: false
pre: "<b>5.8.1.</b>"
---

## Chuẩn bị dữ liệu và chỉ số phân tích

Trong phần này, chúng ta sẽ chuẩn bị các nguồn dữ liệu và tìm hiểu cách tính toán những chỉ số thống kê phục vụ Analytics Dashboard của Student Activity Management & Engagement Analytics Platform.

Mục tiêu là xây dựng dữ liệu phân tích chính xác, nhất quán và phản ánh đúng kết quả tham gia hoạt động của sinh viên.

#### 1. Chuẩn bị môi trường

Đảm bảo đã hoàn thành các phần:

* 5.3 - Xây dựng Backend FastAPI.
* 5.4 - Tích hợp Amazon DynamoDB.
* 5.5 - Xây dựng Frontend React/Vite.
* 5.6 - Quản lý đăng ký và điểm danh.
* 5.7 - Xử lý minh chứng và đối soát dữ liệu.

Các thành phần cần hoạt động:

* FastAPI Backend tại http://127.0.0.1:8000.
* React/Vite Frontend tại http://localhost:5173.
* Tài khoản ADMIN Demo.
* Hoạt động có dữ liệu Registration, Attendance, Evidence và Participation.

#### 2. Xác định các nguồn dữ liệu

Analytics Dashboard sử dụng dữ liệu đã được xử lý bởi Backend.

| Nhóm dữ liệu | Nội dung phân tích |
| --- | --- |
| Activities | Số lượng và thông tin hoạt động |
| Registrations | Số lượt sinh viên đăng ký |
| Attendance | Số lượt Check-in, Check-out và mức độ hoàn thành điểm danh |
| Evidence | Số sinh viên có hoặc chưa có minh chứng |
| Participation | Số sinh viên được xác nhận hoặc từ chối tham gia |

Mỗi bản ghi cần được liên kết với đúng Activity ID và MSSV.

Khi tổng hợp dữ liệu của nhiều hoạt động, cần phân biệt số lượt tham gia với số sinh viên duy nhất.

Ví dụ, một sinh viên tham gia ba hoạt động có thể tạo ba lượt tham gia nhưng vẫn chỉ là một sinh viên duy nhất.

#### 3. Chuẩn bị bộ dữ liệu mẫu

Sử dụng lại bộ dữ liệu của hoạt động Demo từ phần 5.7.

| MSSV | Registration | Check-in | Check-out | Evidence |
| --- | --- | --- | --- | --- |
| 0818000001 | Có | Có | Có | Có |
| 0818000002 | Có | Có | Không | Có |
| 0818000003 | Có | Không | Không | Có |
| 0818000004 | Có | Có | Có | Không |

Kết quả xác nhận hiện tại:

| MSSV | Participation |
| --- | --- |
| 0818000001 | CONFIRMED |
| 0818000002 | Chưa xác nhận |
| 0818000003 | REJECTED |
| 0818000004 | Chưa xác nhận |

Từ bộ dữ liệu trên, chúng ta có:

* Tổng số sinh viên đăng ký: 4.
* Số sinh viên đã Check-in: 3.
* Số sinh viên đã Check-out: 2.
* Số sinh viên có đầy đủ điểm danh: 2.
* Số sinh viên có minh chứng: 3.
* Số sinh viên được xác nhận tham gia: 1.
* Số sinh viên bị từ chối: 1.
* Số sinh viên chưa có quyết định cuối cùng: 2.

Các số liệu trên là dữ liệu giả lập phục vụ Workshop.

<!--
![Analytics sample data](/images/5-Workshop/5.8-Analytics-Export/analytics-sample-data.png)
-->

#### 4. Xây dựng các chỉ số thống kê

##### Total Registrations

Tổng số bản ghi đăng ký hợp lệ trong phạm vi hoạt động đang phân tích.

```text
Total Registrations = 4
```

Không đếm các dòng trùng lặp trong file CSV như những lượt đăng ký độc lập nếu chúng thuộc cùng sinh viên và hoạt động.

##### Total Check-in

Số sinh viên có dữ liệu Check-in hợp lệ.

```text
Total Check-in = 3
```

##### Total Check-out

Số sinh viên có dữ liệu Check-out hợp lệ.

```text
Total Check-out = 2
```

##### Complete Attendance

Số sinh viên có đầy đủ Check-in và Check-out theo điều kiện nghiệp vụ.

```text
Complete Attendance = 2
```

##### Evidence Submitted

Số sinh viên có bản ghi Evidence trong phạm vi hoạt động.

```text
Evidence Submitted = 3
```

Có bản ghi Evidence không đồng nghĩa với minh chứng đã được kiểm duyệt hoặc sinh viên đã được xác nhận tham gia.

##### Confirmed Participants

Số sinh viên có kết quả xác nhận CONFIRMED.

```text
Confirmed Participants = 1
```

##### Rejected Participants

Số sinh viên có kết quả xác nhận REJECTED.

```text
Rejected Participants = 1
```

#### 5. Tính các chỉ số tỷ lệ

##### Check-in Rate

Tỷ lệ sinh viên đăng ký đã thực hiện Check-in.

```text
Check-in Rate
= Registered Students with Check-in
  / Total Registrations x 100

= 3 / 4 x 100

= 75%
```

##### Attendance Completion Rate

Tỷ lệ sinh viên đăng ký có đầy đủ Check-in và Check-out.

```text
Attendance Completion Rate
= Registered Students with Complete Attendance
  / Total Registrations x 100

= 2 / 4 x 100

= 50%
```

##### Evidence Submission Rate

Tỷ lệ sinh viên đăng ký có dữ liệu minh chứng.

```text
Evidence Submission Rate
= Registered Students with Evidence
  / Total Registrations x 100

= 3 / 4 x 100

= 75%
```

##### Confirmed Participation Rate

Tỷ lệ sinh viên đăng ký đã được xác nhận tham gia.

```text
Confirmed Participation Rate
= Confirmed Registered Students
  / Total Registrations x 100

= 1 / 4 x 100

= 25%
```

{{% notice note %}}
Các công thức trên sử dụng số sinh viên đăng ký làm mẫu số để minh họa cách xây dựng chỉ số. Khi triển khai Dashboard, cần sử dụng định nghĩa chỉ số nhất quán với Backend hiện tại. Nếu không có sinh viên đăng ký, tỷ lệ cần được xử lý để tránh lỗi chia cho 0.
{{% /notice %}}

#### 6. Minh họa xử lý dữ liệu bằng Python

Đoạn code dưới đây minh họa cách tổng hợp các chỉ số từ dữ liệu đã đối soát.

Tạo một file thực hành riêng:

```text
analytics_demo.py
```

Nội dung:

```python
students = [
    {
        "mssv": "0818000001",
        "check_in": True,
        "check_out": True,
        "evidence": True,
        "participation": "CONFIRMED"
    },
    {
        "mssv": "0818000002",
        "check_in": True,
        "check_out": False,
        "evidence": True,
        "participation": None
    },
    {
        "mssv": "0818000003",
        "check_in": False,
        "check_out": False,
        "evidence": True,
        "participation": "REJECTED"
    },
    {
        "mssv": "0818000004",
        "check_in": True,
        "check_out": True,
        "evidence": False,
        "participation": None
    }
]

total = len(students)

check_in = sum(
    student["check_in"] for student in students
)

check_out = sum(
    student["check_out"] for student in students
)

complete_attendance = sum(
    student["check_in"] and student["check_out"]
    for student in students
)

evidence = sum(
    student["evidence"] for student in students
)

confirmed = sum(
    student["participation"] == "CONFIRMED"
    for student in students
)

rejected = sum(
    student["participation"] == "REJECTED"
    for student in students
)

pending = total - confirmed - rejected

def rate(count, total):
    return round(count / total * 100, 2) if total else 0

print("Total registrations:", total)
print("Total check-in:", check_in)
print("Total check-out:", check_out)
print("Complete attendance:", complete_attendance)
print("Evidence submitted:", evidence)
print("Confirmed participants:", confirmed)
print("Rejected participants:", rejected)
print("Awaiting decision:", pending)
print("Check-in rate:", rate(check_in, total))
print("Attendance completion rate:",
      rate(complete_attendance, total))
print("Confirmed participation rate:",
      rate(confirmed, total))
```

Chạy script:

```powershell
python analytics_demo.py
```

Kết quả mong đợi:

```text
Total registrations: 4
Total check-in: 3
Total check-out: 2
Complete attendance: 2
Evidence submitted: 3
Confirmed participants: 1
Rejected participants: 1
Awaiting decision: 2
Check-in rate: 75.0
Attendance completion rate: 50.0
Confirmed participation rate: 25.0
```

<!--
![Analytics Python output](/images/5-Workshop/5.8-Analytics-Export/analytics-python-output.png)
-->

{{% notice note %}}
analytics_demo.py là script minh họa độc lập. Dữ liệu đã được chuẩn bị theo một dòng cho mỗi sinh viên đăng ký trong một hoạt động. Không thay thế Analytics Service hiện tại của Backend bằng đoạn code này.
{{% /notice %}}

#### 7. Tìm hiểu cấu trúc dữ liệu Analytics API

Backend cần tổng hợp dữ liệu và trả kết quả để Frontend hiển thị.

Ví dụ cấu trúc JSON minh họa:

```json
{
    "total_registrations": 4,
    "total_check_in": 3,
    "total_check_out": 2,
    "complete_attendance": 2,
    "evidence_submitted": 3,
    "confirmed_participants": 1,
    "rejected_participants": 1,
    "awaiting_decision": 2,
    "check_in_rate": 75.0,
    "attendance_completion_rate": 50.0,
    "participation_rate": 25.0
}
```

Các thuộc tính trên thể hiện dữ liệu mà một Analytics API có thể cung cấp.

Tên thuộc tính và cấu trúc Response thực tế cần được lấy từ Swagger UI và mã nguồn Backend của đồ án.

#### 8. Kiểm tra dữ liệu Analytics hiện tại

Mở Swagger UI:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

Tìm nhóm Analytics hoặc các API thống kê của hoạt động.

Thực hiện:

1. Sử dụng tài khoản ADMIN.
2. Xác định Activity ID cần phân tích.
3. Gửi Request đến API hiện có.
4. Kiểm tra Response.
5. Đối chiếu các chỉ số với dữ liệu Registration, Attendance và Participation.

<!--
![Analytics API response](/images/5-Workshop/5.8-Analytics-Export/analytics-api-response.png)
-->

Nếu API sử dụng phạm vi toàn hệ thống thay vì một hoạt động, cần kiểm tra dữ liệu đầu vào trước khi so sánh kết quả.

#### 9. Kiểm tra các trường hợp đặc biệt

| Trường hợp | Cách xử lý |
| --- | --- |
| Hoạt động chưa có đăng ký | Không xảy ra lỗi chia cho 0 |
| Có đăng ký nhưng chưa điểm danh | Số Check-in bằng 0 |
| Có Check-in nhưng thiếu Check-out | Không tính là hoàn thành đầy đủ điểm danh |
| Có minh chứng nhưng bị REJECTED | Không tính là CONFIRMED |
| Sinh viên tham gia nhiều hoạt động | Phân biệt số lượt và số sinh viên duy nhất |
| Dữ liệu chưa được xác nhận hết | Phân biệt chưa xác nhận với REJECTED |
| Sai Activity ID | Không sử dụng dữ liệu của hoạt động khác |

#### Kết quả

Sau khi hoàn thành phần này, chúng ta đã chuẩn bị dữ liệu và tìm hiểu cách tính các chỉ số phục vụ Analytics Dashboard.

Việc xác định chính xác phạm vi dữ liệu, tử số và mẫu số giúp đảm bảo các báo cáo phản ánh đúng kết quả hoạt động.

Trong phần tiếp theo, chúng ta sẽ tìm hiểu cách hiển thị các chỉ số Analytics trên giao diện React/Vite.

[Tiếp theo: Xây dựng Analytics Dashboard](../5.8.2-build-dashboard/)
