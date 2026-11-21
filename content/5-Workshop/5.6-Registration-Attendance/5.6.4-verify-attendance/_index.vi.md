
---
title: "Xác minh dữ liệu điểm danh"
date: 2026-11-09
weight: 4
chapter: false
pre: "<b>5.6.4.</b>"
---

## Xác minh dữ liệu điểm danh

Trong phần này, chúng ta sẽ kiểm tra và xác minh dữ liệu Check-in/Check-out đã được ghi nhận trong hệ thống Student Activity Management & Engagement Analytics Platform.

Mục tiêu là đảm bảo dữ liệu điểm danh được lưu đúng sinh viên, đúng hoạt động, đúng thời gian và có thể sử dụng trong quá trình đối soát sau chương trình.

#### 1. Kiểm tra danh sách điểm danh

Đăng nhập bằng tài khoản ADMIN.

1. Mở Web Application.
2. Chọn hoạt động Demo.
3. Truy cập danh sách điểm danh.
4. Kiểm tra dữ liệu Check-in và Check-out đã ghi nhận.

<!--
![Attendance verification](/images/5-Workshop/5.6-Registration-Attendance/attendance-verification.png)
-->

Các thông tin cần kiểm tra:

* Activity ID.
* MSSV.
* Thông tin sinh viên.
* Thời gian Check-in.
* Thời gian Check-out.
* Trạng thái điểm danh.

Dữ liệu cần khớp với các thao tác đã thực hiện trong phần 5.6.3.

#### 2. Đối chiếu với danh sách đăng ký

Danh sách đăng ký và danh sách điểm danh là hai nhóm dữ liệu khác nhau.

Registration cho biết sinh viên đã đăng ký tham gia hoạt động.

Attendance cho biết sinh viên đã thực hiện Check-in và Check-out.

Ví dụ:

| MSSV | Registration | Check-in | Check-out |
| --- | --- | --- | --- |
| 0818000001 | Có | Có | Có |
| 0818000002 | Có | Có | Không |
| 0818000003 | Có | Không | Không |
| 0818000004 | Có | Có | Có |

Từ bộ dữ liệu minh họa trên:

* Có 4 sinh viên đăng ký.
* Có 3 sinh viên Check-in.
* Có 2 sinh viên Check-out.
* Có 1 sinh viên đã Check-in nhưng chưa Check-out.
* Có 1 sinh viên chưa có dữ liệu điểm danh.

Các số liệu trên chỉ minh họa cách đối chiếu, không phải kết quả kiểm thử thực tế.

<!--
![Registration attendance comparison](/images/5-Workshop/5.6-Registration-Attendance/registration-attendance-comparison.png)
-->

#### 3. Phân loại các trường hợp điểm danh

##### Đủ dữ liệu Check-in và Check-out

Sinh viên có cả hai mốc thời gian điểm danh.

Đây là dữ liệu đầu vào để tiếp tục kiểm tra các điều kiện xác nhận tham gia.

##### Thiếu Check-out

Sinh viên đã có Check-in nhưng chưa có Check-out.

Ban Tổ chức cần kiểm tra thêm trước khi xác nhận kết quả tham gia.

##### Chưa có dữ liệu điểm danh

Sinh viên có thể xuất hiện trong danh sách đăng ký nhưng chưa thực hiện Check-in.

Không tự động xem đăng ký là bằng chứng đã tham gia hoạt động.

##### Dữ liệu không nhất quán

Ví dụ:

* Check-out xuất hiện nhưng không có Check-in.
* Thời gian Check-out sớm hơn Check-in.
* Bản ghi liên kết sai Activity ID.
* MSSV không phù hợp với dữ liệu sinh viên.

Những trường hợp này cần được kiểm tra theo quy tắc nghiệp vụ và cơ chế xử lý của Backend.

#### 4. Kiểm tra dữ liệu thông qua REST API

Mở Swagger UI:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

Tìm nhóm API Attendance hoặc các Endpoint truy xuất dữ liệu liên quan đến hoạt động.

1. Sử dụng Access Token của ADMIN.
2. Nhập Activity ID cần kiểm tra.
3. Thực hiện Request.
4. Kiểm tra HTTP Status Code.
5. Đối chiếu Response Body với danh sách trên Frontend.

<!--
![Attendance API response](/images/5-Workshop/5.6-Registration-Attendance/attendance-api-response.png)
-->

Tên Endpoint truy xuất Attendance cần lấy từ Swagger UI của phiên bản Backend hiện tại.

Không tạo thêm Endpoint mới chỉ để thực hiện bài kiểm thử nếu hệ thống đã có chức năng tương ứng.

#### 5. Kiểm tra SQLite Local Persistence

Phiên bản Demo của đồ án sử dụng SQLite để hỗ trợ lưu trữ và khôi phục trạng thái ứng dụng.

Để kiểm tra dữ liệu điểm danh:

1. Ghi nhận Check-in hoặc Check-out cho sinh viên Demo.
2. Ghi lại Activity ID, MSSV và thời gian điểm danh.
3. Kiểm tra dữ liệu thông qua giao diện hoặc REST API.
4. Dừng Backend bằng Ctrl + C.
5. Khởi chạy lại Backend với cùng cấu hình Demo.
6. Kiểm tra bản ghi điểm danh đã thực hiện.

Khởi chạy lại Backend:

```powershell
cd C:\Projects\student-activity-platform\backend

.\.venv\Scripts\Activate.ps1

$env:SAP_DEMO_MODE="1"

python -m uvicorn app.main:app --reload
```

<!--
![Attendance persistence test](/images/5-Workshop/5.6-Registration-Attendance/attendance-persistence.png)
-->

Kết quả mong đợi là các bản ghi thuộc phạm vi persistence được khôi phục sau khi Backend khởi động lại.

Nếu dữ liệu không xuất hiện, cần kiểm tra module persistence, nguồn dữ liệu đang được sử dụng và cấu hình Demo.

Không xóa file SQLite hoặc thay đổi đường dẫn lưu trữ trong quá trình kiểm thử.

#### 6. Xác minh dữ liệu trên Amazon DynamoDB

Nếu AWS Pilot dành cho Attendance đã được bật, chúng ta có thể kiểm tra dữ liệu điểm danh trên AWS.

Mở:

[Amazon DynamoDB Console](https://console.aws.amazon.com/dynamodb/)

##### Bước 1: Chọn AWS Region

```text
Asia Pacific (Singapore)
ap-southeast-1
```

##### Bước 2: Chọn bảng Attendance

Trong DynamoDB Console:

* Chọn Tables.
* Chọn SAP-Attendance.
* Kiểm tra trạng thái ACTIVE.

<!--
![DynamoDB Attendance table](/images/5-Workshop/5.6-Registration-Attendance/dynamodb-attendance-table.png)
-->

##### Bước 3: Truy vấn theo Activity ID

Chọn Explore table items.

* Chọn Query.
* Nhập activity_id của hoạt động Demo.
* Thực hiện truy vấn.

<!--
![Query Attendance records](/images/5-Workshop/5.6-Registration-Attendance/dynamodb-attendance-query.png)
-->

##### Bước 4: Kiểm tra item

Chọn bản ghi tương ứng với MSSV đã thực hiện điểm danh.

Kiểm tra các thuộc tính thực tế:

* activity_id.
* mssv.
* Thời gian Check-in.
* Thời gian Check-out.
* Các thuộc tính Attendance được repository lưu trữ.

Đối chiếu với kết quả Backend và giao diện.

<!--
![Attendance item details](/images/5-Workshop/5.6-Registration-Attendance/dynamodb-attendance-item.png)
-->

{{% notice note %}}
Chỉ thực hiện đối chiếu DynamoDB khi nhóm Attendance đang sử dụng phần tích hợp AWS phù hợp. API Check-in hoặc Check-out thành công không tự động chứng minh dữ liệu đã được lưu trên DynamoDB.
{{% /notice %}}

#### 7. Kiểm tra DynamoDB bằng Python

Có thể sử dụng boto3 để truy xuất bản ghi điểm danh theo Activity ID và MSSV.

Trong thư mục backend, tạo file kiểm thử riêng:

```text
test_attendance_record.py
```

Nội dung:

```python
import boto3
from pprint import pprint

session = boto3.Session(
    profile_name="sap-dev",
    region_name="ap-southeast-1"
)

dynamodb = session.resource("dynamodb")

table = dynamodb.Table("SAP-Attendance")

activity_id = input("Activity ID: ").strip()
mssv = input("Student ID: ").strip()

response = table.get_item(
    Key={
        "activity_id": activity_id,
        "mssv": mssv
    },
    ConsistentRead=True
)

item = response.get("Item")

if item:
    print("Attendance record found")
    pprint(item)
else:
    print("Attendance record not found")
```

Chạy script:

```powershell
python test_attendance_record.py
```

Nhập Activity ID và MSSV của bản ghi thử nghiệm.

Script sử dụng AWS Profile sap-dev và yêu cầu IAM Identity có quyền dynamodb:GetItem đối với SAP-Attendance.

Cấu trúc Key cần khớp với bảng đã xác minh trong phần 5.4.

<!--
![Python attendance verification](/images/5-Workshop/5.6-Registration-Attendance/attendance-python-test.png)
-->

Script chỉ đọc dữ liệu và không thực hiện cập nhật hoặc xóa item.

#### 8. Kiểm tra quyền truy cập dữ liệu

Thực hiện kiểm thử với hai Role ADMIN và STUDENT.

##### ADMIN

* Xem danh sách điểm danh của hoạt động.
* Kiểm tra dữ liệu các sinh viên theo quyền quản trị.
* Thực hiện các chức năng quản lý điểm danh được cấp quyền.

##### STUDENT

* Xem thông tin tham gia cá nhân trong phạm vi được cấp quyền.
* Không truy cập trái phép danh sách điểm danh quản trị.
* Không sửa dữ liệu điểm danh của sinh viên khác.

Kiểm tra cả giao diện và REST API để đảm bảo Backend thực thi quyền truy cập.

<!--
![Attendance authorization](/images/5-Workshop/5.6-Registration-Attendance/attendance-authorization.png)
-->

#### 9. Kiểm tra tính nhất quán dữ liệu

Đối chiếu các nguồn dữ liệu:

| Thành phần | Nội dung kiểm tra |
| --- | --- |
| Registration | Sinh viên thuộc hoạt động nào |
| Frontend | Trạng thái điểm danh hiển thị |
| Backend | Dữ liệu được REST API trả về |
| SQLite | Dữ liệu thuộc phạm vi Local Persistence |
| DynamoDB | Dữ liệu Cloud khi AWS Pilot được bật |

Nếu phát hiện dữ liệu không trùng khớp:

* Kiểm tra Activity ID.
* Kiểm tra MSSV.
* Kiểm tra bộ lọc trên giao diện.
* Kiểm tra thời gian và múi giờ.
* Kiểm tra cấu hình repository và AWS Pilot.
* Kiểm tra lỗi đọc/ghi trong Backend.

Việc dữ liệu local và DynamoDB trùng khớp trong một bài kiểm thử không đồng nghĩa với việc toàn bộ hệ thống đã có cơ chế đồng bộ hai chiều tự động.

#### 10. Chuẩn bị dữ liệu cho Reconciliation

Sau khi xác minh dữ liệu điểm danh, chúng ta sẽ sử dụng dữ liệu này cho quá trình đối soát.

Ví dụ:

```text
Student ID: 0818000001

Registration: YES
Check-in: Recorded
Check-out: Recorded
Evidence: Chưa kiểm tra
Participation: Chưa xác nhận
```

Sinh viên có đầy đủ Check-in và Check-out chưa chắc đã đáp ứng tất cả điều kiện xác nhận tham gia.

Một số hoạt động có thể yêu cầu thêm minh chứng hoặc điều kiện khác.

Quy trình tiếp theo:

```text
Registration Data
        +
Attendance Data
        +
Evidence Data
        |
        v
Reconciliation
        |
        v
ADMIN Confirmation
        |
        v
Participation Result
```

Kết quả xác nhận cuối cùng phải dựa trên quy tắc nghiệp vụ của hoạt động và quyết định quản trị phù hợp.

#### 11. Tổng hợp kết quả kiểm thử

| Nội dung | Kết quả mong đợi |
| --- | --- |
| Registration List | Hiển thị đúng sinh viên đăng ký |
| Check-in | Ghi nhận đúng sinh viên và hoạt động |
| Check-out | Cập nhật đúng bản ghi Attendance |
| Duplicate Operation | Không tạo bản ghi điểm danh trùng |
| Time Validation | Tuân thủ quy tắc thời gian |
| Backend Authorization | Từ chối truy cập trái quyền |
| Local Persistence | Khôi phục dữ liệu thuộc phạm vi lưu trữ |
| DynamoDB Verification | Tìm thấy item khi AWS Pilot được bật |
| Data Consistency | Dữ liệu khớp với thao tác đã thực hiện |

Người thực hiện Workshop cần ghi nhận kết quả thực tế và bổ sung ảnh minh chứng cho từng bài kiểm thử.

#### Kết luận

Trong phần này, chúng ta đã hoàn thành quy trình quản lý đăng ký và điểm danh của Student Activity Management & Engagement Analytics Platform.

Dữ liệu Registration được nhập từ University Portal, trong khi Attendance được ghi nhận trực tiếp theo thời gian thực thông qua FastAPI REST API.

Thông qua việc đối chiếu dữ liệu trên Frontend, Backend, SQLite và Amazon DynamoDB, chúng ta hiểu rõ hơn cách kiểm tra tính chính xác và khả năng lưu trữ của một hệ thống quản lý dữ liệu.

Trong phần tiếp theo, chúng ta sẽ nhập minh chứng tham gia từ Google Forms/Google Sheets, đối soát dữ liệu và xác nhận kết quả tham gia của sinh viên.

[Tiếp theo: Xử lý minh chứng và đối soát dữ liệu](../../5.7-Evidence-Reconciliation/)
