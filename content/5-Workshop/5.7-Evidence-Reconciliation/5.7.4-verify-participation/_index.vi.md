
---
title: "Xác minh kết quả tham gia"
date: 2026-11-09
weight: 4
chapter: false
pre: "<b>5.7.4.</b>"
---

## Xác minh kết quả tham gia

Trong phần này, chúng ta sẽ kiểm tra kết quả đối soát và xác nhận tham gia đã được thực hiện trong hệ thống Student Activity Management & Engagement Analytics Platform.

Mục tiêu là xác nhận dữ liệu Participation được lưu đúng sinh viên, đúng hoạt động, đúng trạng thái và có thể sử dụng cho Analytics Dashboard và Export.

#### 1. Kiểm tra danh sách Participation

Đăng nhập bằng tài khoản ADMIN.

1. Mở Web Application.
2. Truy cập hoạt động Demo.
3. Mở chức năng quản lý kết quả tham gia.
4. Kiểm tra danh sách sinh viên đã được đối soát.
5. Kiểm tra các trạng thái xác nhận.

<!--
![Participation verification interface](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-verification.png)
-->

Các thông tin cần đối chiếu:

* Activity ID.
* MSSV.
* Registration.
* Check-in.
* Check-out.
* Evidence.
* Reconciliation Result.
* Participation Status.

Kết quả phải phù hợp với các thao tác đã thực hiện trong phần 5.7.3.

#### 2. Đối chiếu dữ liệu nguồn và kết quả xác nhận

Sử dụng bộ dữ liệu giả lập từ các phần trước:

| MSSV | Registration | Check-in | Check-out | Evidence |
| --- | --- | --- | --- | --- |
| 0818000001 | Có | Có | Có | Có |
| 0818000002 | Có | Có | Không | Có |
| 0818000003 | Có | Không | Không | Có |
| 0818000004 | Có | Có | Có | Không |

Kết quả xác nhận minh họa sau khi ADMIN đã thực hiện hai thao tác tại phần 5.7.3:

| MSSV | Kết quả xác nhận |
| --- | --- |
| 0818000001 | CONFIRMED |
| 0818000002 | Chưa xác nhận |
| 0818000003 | REJECTED |
| 0818000004 | Chưa xác nhận |

Trong đó, "Chưa xác nhận" là mô tả nghiệp vụ, không phải tên trạng thái được bổ sung vào Backend.

Từ ví dụ trên:

* Tổng số sinh viên đăng ký: 4.
* Số sinh viên được xác nhận: 1.
* Số sinh viên bị từ chối: 1.
* Số sinh viên chưa có quyết định cuối cùng: 2.

Đây là dữ liệu giả lập, không phải kết quả thực tế của một hoạt động tại trường.

<!--
![Participation comparison](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-comparison.png)
-->

#### 3. Kiểm tra kết quả qua REST API

Mở Swagger UI:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

Tìm Endpoint truy xuất kết quả Participation trong phiên bản Backend hiện tại.

Thực hiện:

1. Sử dụng Access Token của ADMIN.
2. Nhập Activity ID cần kiểm tra.
3. Thực hiện Request.
4. Kiểm tra HTTP Status Code.
5. Kiểm tra các bản ghi trong Response.
6. Đối chiếu với dữ liệu hiển thị trên Frontend.

<!--
![Participation API response](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-api-response.png)
-->

Không cần tạo Endpoint mới nếu Backend đã cung cấp chức năng truy xuất kết quả tương ứng.

#### 4. Kiểm tra SQLite Local Persistence

Phiên bản Demo sử dụng SQLite để hỗ trợ lưu trữ và khôi phục trạng thái ứng dụng.

Để kiểm tra khả năng lưu trữ kết quả:

1. Xác nhận hoặc từ chối một sinh viên Demo.
2. Ghi lại Activity ID, MSSV và trạng thái.
3. Kiểm tra kết quả qua REST API.
4. Dừng FastAPI bằng Ctrl + C.
5. Khởi chạy lại Backend với cùng cấu hình.
6. Truy xuất lại bản ghi Participation.

Khởi chạy Backend:

```powershell
cd C:\Projects\student-activity-platform\backend

.\.venv\Scripts\Activate.ps1

$env:SAP_DEMO_MODE="1"

python -m uvicorn app.main:app --reload
```

<!--
![Participation persistence test](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-persistence.png)
-->

Kết quả mong đợi là các dữ liệu thuộc phạm vi persistence được khôi phục sau khi khởi động lại.

Nếu dữ liệu không xuất hiện, kiểm tra:

* Cấu hình SAP_DEMO_MODE.
* Đường dẫn lưu trữ SQLite.
* Module persistence.
* Repository và nguồn dữ liệu đang sử dụng.
* Log khởi tạo Backend.

Không xóa file SQLite trong quá trình kiểm thử.

#### 5. Xác minh Evidence trên Amazon DynamoDB

Nếu AWS Pilot dành cho Evidence được bật:

1. Mở [Amazon DynamoDB Console](https://console.aws.amazon.com/dynamodb/).
2. Chọn Region Singapore - ap-southeast-1.
3. Chọn bảng SAP-Evidence.
4. Kiểm tra trạng thái ACTIVE.
5. Chọn Explore table items.
6. Chọn Query.
7. Nhập activity_id của hoạt động cần kiểm tra.
8. Thực hiện truy vấn.

<!--
![DynamoDB evidence query](/images/5-Workshop/5.7-Evidence-Reconciliation/dynamodb-evidence-query.png)
-->

Kiểm tra các item tương ứng với sinh viên Demo.

Trong bài kiểm thử AWS Pilot của đồ án ngày 06/11/2026, dữ liệu Evidence đã được kiểm tra trên DynamoDB với ba bản ghi thử nghiệm.

Khi thực hiện Workshop, số lượng bản ghi thực tế phụ thuộc vào dữ liệu đã Import.

#### 6. Xác minh Participation trên Amazon DynamoDB

Nếu AWS Pilot dành cho Participation được bật:

1. Quay lại danh sách Tables.
2. Chọn SAP-Participation.
3. Chọn Explore table items.
4. Chuyển sang chế độ Query.
5. Nhập Activity ID của hoạt động đã đối soát.
6. Thực hiện truy vấn.

<!--
![DynamoDB participation query](/images/5-Workshop/5.7-Evidence-Reconciliation/dynamodb-participation-query.png)
-->

Kiểm tra các thuộc tính thực tế:

* activity_id.
* mssv.
* Trạng thái điểm danh.
* Trạng thái minh chứng.
* Kết quả đối soát.
* Trạng thái xác nhận tham gia.

Tên thuộc tính cụ thể phải được đối chiếu với item thực tế và repository hiện tại.

<!--
![DynamoDB participation item](/images/5-Workshop/5.7-Evidence-Reconciliation/dynamodb-participation-item.png)
-->

Trong bài kiểm thử tích hợp AWS trước đây, bảng SAP-Participation đã được truy vấn với ba bản ghi thử nghiệm.

Một số bản ghi chứa thông tin:

```text
NO_ATTENDANCE
REJECTED
evidence_status: YES
```

Đây là ví dụ về trường hợp sinh viên có minh chứng nhưng thiếu dữ liệu điểm danh và không được xác nhận tham gia.

{{% notice note %}}
Số lượng ba bản ghi là kết quả kiểm thử trước đây của đồ án, không phải số lượng bắt buộc của Workshop. Dữ liệu thực hành mới phải được xác minh theo Activity ID và MSSV thực tế.
{{% /notice %}}

#### 7. Kiểm tra dữ liệu bằng boto3

Chúng ta có thể sử dụng Python để truy xuất các bản ghi Evidence và Participation theo cùng một Activity ID.

Tạo file kiểm thử riêng:

```text
backend/test_participation_verification.py
```

Nội dung:

```python
import boto3
from boto3.dynamodb.conditions import Key

session = boto3.Session(
    profile_name="sap-dev",
    region_name="ap-southeast-1"
)

dynamodb = session.resource("dynamodb")

activity_id = input("Activity ID: ").strip()

if not activity_id:
    raise ValueError("Activity ID is required")

tables = [
    "SAP-Evidence",
    "SAP-Participation"
]

for table_name in tables:
    table = dynamodb.Table(table_name)

    records = []

    params = {
        "KeyConditionExpression":
            Key("activity_id").eq(activity_id),
        "ConsistentRead": True
    }

    while True:
        response = table.query(**params)

        records.extend(
            response.get("Items", [])
        )

        last_key = response.get("LastEvaluatedKey")

        if not last_key:
            break

        params["ExclusiveStartKey"] = last_key

    print("\nTable:", table_name)
    print("Total records:", len(records))

    for record in records:
        print("Student ID:", record.get("mssv"))
```

Chạy script:

```powershell
cd C:\Projects\student-activity-platform\backend

.\.venv\Scripts\Activate.ps1

python test_participation_verification.py
```

Nhập Activity ID cần kiểm tra.

<!--
![Python participation verification](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-python-test.png)
-->

Script sử dụng AWS Profile sap-dev và quyền dynamodb:Query đối với hai bảng tương ứng.

Đoạn script có xử lý phân trang thông qua LastEvaluatedKey để đọc tất cả các trang kết quả của hoạt động.

Script chỉ đọc dữ liệu và hiển thị MSSV, không thực hiện cập nhật hoặc xóa bản ghi.

#### 8. Kiểm tra một sinh viên cụ thể

Để xác minh kết quả của một sinh viên, có thể sử dụng GetItem.

Ví dụ:

```python
import boto3
from pprint import pprint

session = boto3.Session(
    profile_name="sap-dev",
    region_name="ap-southeast-1"
)

dynamodb = session.resource("dynamodb")

table = dynamodb.Table("SAP-Participation")

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
    print("Participation record found")
    pprint(item)
else:
    print("Participation record not found")
```

Đoạn code minh họa yêu cầu quyền dynamodb:GetItem.

Cấu trúc khóa phải khớp với Key Schema của bảng SAP-Participation đã kiểm tra tại phần 5.4.

Nếu không tìm thấy item, kiểm tra Activity ID, MSSV, AWS Profile, Region và cấu hình AWS Pilot.

Không xem việc thiếu item trên DynamoDB là bằng chứng xác nhận thất bại nếu Backend đang xử lý dữ liệu theo cơ chế local.

#### 9. Kiểm tra giao diện STUDENT

Đăng xuất tài khoản ADMIN.

Đăng nhập bằng tài khoản STUDENT Demo tương ứng với sinh viên đã được xác nhận.

Kiểm tra:

* Sinh viên có thể xem thông tin tham gia của bản thân.
* Hoạt động hiển thị đúng.
* Trạng thái xác nhận phù hợp với kết quả Backend.
* Không hiển thị chức năng xác nhận quản trị.
* Không truy cập trái quyền dữ liệu của sinh viên khác.

<!--
![Student participation history](/images/5-Workshop/5.7-Evidence-Reconciliation/student-participation-history.png)
-->

Thực hiện tương tự với tài khoản Demo có kết quả REJECTED nếu dữ liệu tài khoản đã được chuẩn bị.

Nếu giao diện chưa hiển thị đầy đủ một trạng thái cụ thể, ghi nhận kết quả thực tế để tiếp tục cải thiện Frontend.

#### 10. Kiểm tra tính nhất quán dữ liệu

Đối chiếu dữ liệu giữa các thành phần:

| Thành phần | Nội dung kiểm tra |
| --- | --- |
| Registration | Sinh viên đã đăng ký hoạt động |
| Attendance | Dữ liệu Check-in và Check-out |
| Evidence | Dữ liệu minh chứng |
| Reconciliation | Kết quả đối chiếu dữ liệu |
| Participation | Kết quả xác nhận cuối cùng |
| Frontend | Thông tin hiển thị theo quyền |
| SQLite | Dữ liệu thuộc phạm vi local persistence |
| DynamoDB | Dữ liệu Cloud khi AWS Pilot được bật |

Nếu phát hiện sự khác biệt:

* Kiểm tra Activity ID.
* Kiểm tra MSSV.
* Kiểm tra dữ liệu nguồn mới nhất.
* Kiểm tra kết quả đối soát đã được cập nhật chưa.
* Kiểm tra cấu hình repository.
* Kiểm tra log Backend.
* Kiểm tra trạng thái lưu trữ trên AWS.

Việc dữ liệu local và DynamoDB trùng khớp trong một bài kiểm thử không chứng minh toàn bộ hệ thống đã được chuyển sang DynamoDB hoặc hỗ trợ đồng bộ hai chiều tự động.

#### 11. Chuẩn bị dữ liệu cho Analytics Dashboard

Sau khi hoàn thành xác minh, Participation sẽ trở thành nguồn dữ liệu quan trọng để xây dựng các chỉ số phân tích.

Ví dụ:

```text
Total Registrations: 4
Confirmed Participants: 1
Rejected Participants: 1
Unconfirmed Students: 2
```

Tỷ lệ xác nhận tham gia trong nhóm đã đăng ký:

```text
Participation Rate
= Confirmed Registered Students / Total Registrations
  x 100

= 1 / 4 x 100

= 25%
```

Đây là số liệu minh họa tại thời điểm chưa hoàn thành mọi quyết định xác nhận.

Khi ADMIN xác nhận các sinh viên còn lại, tỷ lệ có thể thay đổi.

Các chỉ số cần được tính theo quy tắc nghiệp vụ nhất quán, tránh nhầm lẫn giữa:

* Số sinh viên đăng ký.
* Số sinh viên đã Check-in.
* Số sinh viên có đầy đủ điểm danh.
* Số sinh viên được xác nhận tham gia.

Các nội dung Analytics và Export sẽ được thực hành chi tiết trong phần 5.8.

#### 12. Tổng hợp kết quả kiểm thử

| Nội dung | Kết quả mong đợi |
| --- | --- |
| Evidence Import | Dữ liệu minh chứng được xử lý |
| Reconciliation | Đối chiếu đúng ba nguồn dữ liệu |
| CONFIRMED | Lưu đúng kết quả xác nhận |
| REJECTED | Lưu đúng kết quả từ chối |
| ADMIN Authorization | Cho phép thao tác quản trị |
| STUDENT Authorization | Chỉ truy cập dữ liệu được cấp quyền |
| Local Persistence | Khôi phục dữ liệu thuộc phạm vi lưu trữ |
| SAP-Evidence | Truy xuất item khi AWS Pilot được bật |
| SAP-Participation | Truy xuất kết quả khi AWS Pilot được bật |
| Data Consistency | Kết quả khớp với dữ liệu nghiệp vụ |

Người thực hiện Workshop cần ghi nhận kết quả thực tế và bổ sung ảnh minh chứng tương ứng.

{{% notice warning %}}
Không công khai thông tin sinh viên thật hoặc thông tin xác thực AWS trong ảnh chụp DynamoDB Console, Terminal và REST API.
{{% /notice %}}

#### Kết luận

Trong phần này, chúng ta đã hoàn thành quy trình xử lý minh chứng, đối soát dữ liệu và xác nhận kết quả tham gia sinh viên.

Dữ liệu từ University Portal, Attendance và Google Forms/Google Sheets được kết hợp để hỗ trợ quyết định nghiệp vụ của ADMIN.

Thông qua FastAPI REST API, SQLite Local Persistence và Amazon DynamoDB Integration, chúng ta có thể kiểm tra khả năng xử lý và lưu trữ dữ liệu của hệ thống.

Kết quả Participation cung cấp nền tảng để xây dựng Analytics Dashboard, theo dõi mức độ tham gia hoạt động và xuất báo cáo phục vụ công tác quản lý sinh viên.

[Tiếp theo: Xây dựng Analytics Dashboard và Export](../../5.8-Analytics-Export/)
