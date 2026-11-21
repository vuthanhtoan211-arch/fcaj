
---
title: "Kiểm thử đọc và ghi dữ liệu DynamoDB"
date: 2026-11-09
weight: 3
chapter: false
pre: "<b>5.4.3.</b>"
---

## Kiểm thử đọc và ghi dữ liệu DynamoDB

Trong phần này, chúng ta sẽ kiểm thử khả năng kết nối, truy xuất và lưu trữ dữ liệu giữa FastAPI Backend và Amazon DynamoDB.

Mục tiêu là xác nhận Backend có thể thực hiện các thao tác nghiệp vụ và dữ liệu thuộc phạm vi AWS Pilot có thể được lưu trữ trên AWS.

#### 1. Chuẩn bị môi trường kiểm thử

Mở PowerShell tại thư mục Backend:

```powershell
cd C:\Projects\student-activity-platform\backend

.\.venv\Scripts\Activate.ps1
```

Cấu hình AWS:

```powershell
$env:AWS_PROFILE="sap-dev"
$env:AWS_REGION="ap-southeast-1"
$env:AWS_DEFAULT_REGION="ap-southeast-1"
```

Kiểm tra tài nguyên:

```powershell
.\.venv\Scripts\python.exe .\check_aws_resources.py
```

Đảm bảo năm bảng DynamoDB có trạng thái ACTIVE.

#### 2. Kiểm thử truy xuất dữ liệu bằng boto3

Trong phần này, chúng ta sẽ sử dụng DynamoDB Resource để đọc dữ liệu từ bảng SAP-Activities.

Tạo một file Python thử nghiệm trong thư mục backend:

```text
test_dynamodb_read.py
```

Thêm nội dung:

```python
import boto3
from pprint import pprint

session = boto3.Session(
    profile_name="sap-dev",
    region_name="ap-southeast-1"
)

dynamodb = session.resource("dynamodb")

table = dynamodb.Table("SAP-Activities")

response = table.scan(Limit=5)

print("DynamoDB connection successful")
print("Returned items:", response.get("Count", 0))

for item in response.get("Items", []):
    pprint(item)
```

Chạy script:

```powershell
python test_dynamodb_read.py
```

Kết quả mong đợi:

* Kết nối DynamoDB thành công.
* Có thể đọc dữ liệu từ SAP-Activities.
* Hiển thị các item nếu bảng đã có dữ liệu.

<!--
![DynamoDB Read Test](/images/5-Workshop/5.4-DynamoDB/dynamodb-read-test.png)
-->

Nếu bảng chưa có dữ liệu, số item trả về có thể bằng 0. Điều đó không đồng nghĩa với lỗi kết nối.

{{% notice note %}}
Scan được sử dụng ở đây để kiểm thử một số bản ghi. Trong ứng dụng thực tế, nên sử dụng GetItem hoặc Query khi đã biết khóa dữ liệu để tránh quét bảng không cần thiết. Limit giới hạn số item được đánh giá trong một lần gọi, không phải tổng số item của bảng.
{{% /notice %}}

#### 3. Kiểm thử tạo Activity từ Backend

Khởi chạy FastAPI:

```powershell
$env:SAP_DEMO_MODE="1"

python -m uvicorn app.main:app --reload
```

Trước khi chạy, kiểm tra cấu hình AWS Pilot hoặc repository của nhóm Activities trong source code hiện tại để bảo đảm thao tác tạo Activity có sử dụng DynamoDB.

Mở Swagger UI:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

##### Bước 1: Đăng nhập ADMIN

1. Tìm API POST /auth/login.
2. Chọn **Try it out**.
3. Nhập thông tin tài khoản ADMIN Demo.
4. Chọn **Execute**.
5. Lấy Access Token được trả về.

Sử dụng Access Token để xác thực các API quản trị theo cấu hình Backend.

##### Bước 2: Tạo hoạt động thử nghiệm

Tìm API tạo hoạt động trong nhóm Activities.

Thông thường, Endpoint sử dụng:

```text
POST /activities
```

Nhập dữ liệu thử nghiệm theo Request Body được Swagger UI cung cấp.

Ví dụ thông tin:

```text
Activity Name: AWS DynamoDB Integration Test
Location: University Hall
Description: Testing cloud data storage
```

Bổ sung thời gian, trạng thái và các trường bắt buộc theo API Schema thực tế.

Chọn **Execute**.

<!--
![Create Activity API](/images/5-Workshop/5.4-DynamoDB/create-activity-api.png)
-->

Kết quả mong đợi:

* Backend tạo hoạt động thành công.
* Response chứa Activity ID của hoạt động mới.
* Nếu AWS Pilot cho Activities được bật và cấu hình đúng, dữ liệu sẽ xuất hiện trong SAP-Activities.

Ghi lại Activity ID thực tế để sử dụng ở bước tiếp theo.

#### 4. Kiểm tra Activity bằng GetItem

DynamoDB GetItem cho phép truy xuất một item khi biết đầy đủ Primary Key.

Trong đợt kiểm thử trước đây, đồ án đã sử dụng Activity ID:

```text
ACT#AWSTEST-9198ABC48900
```

Khi thực hiện workshop mới, sử dụng Activity ID được trả về từ API thay vì phụ thuộc vào bản ghi cũ.

Tạo file kiểm thử:

```text
test_dynamodb_activity.py
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

table = dynamodb.Table("SAP-Activities")

activity_id = input("Enter Activity ID: ").strip()

response = table.get_item(
    Key={
        "activity_id": activity_id
    },
    ConsistentRead=True
)

item = response.get("Item")

if item:
    print("Activity found in DynamoDB")
    pprint(item)
else:
    print("Activity not found in DynamoDB")
```

Chạy script:

```powershell
python test_dynamodb_activity.py
```

Nhập Activity ID vừa được tạo từ Backend.

<!--
![DynamoDB GetItem Test](/images/5-Workshop/5.4-DynamoDB/dynamodb-getitem.png)
-->

Nếu item được tìm thấy, điều này xác nhận dữ liệu Activity đã tồn tại trên DynamoDB.

Nếu không tìm thấy item, kiểm tra:

* Activity ID đã nhập chính xác chưa.
* Region và AWS Profile có đúng không.
* Backend đã bật chế độ tích hợp AWS cho Activities chưa.
* Repository đang sử dụng SQLite hay DynamoDB.
* Log Backend có lỗi IAM hoặc AWS Connectivity không.

#### 5. Kiểm thử Registration, Attendance và Evidence

Sử dụng một Activity Demo cùng các tài khoản sinh viên giả lập để thực hiện:

##### Registration

* Nhập danh sách sinh viên đăng ký theo CSV/XLSX Template.
* Kiểm tra dữ liệu Registration trên Backend.
* Xác minh bản ghi tương ứng trong SAP-Registrations khi AWS Pilot được bật.

##### Attendance

* Ghi nhận Check-in và Check-out bằng các API điểm danh.
* Sử dụng Activity đang ở trạng thái và khung thời gian hợp lệ.
* Kiểm tra dữ liệu tương ứng trong SAP-Attendance.

Các Endpoint điểm danh:

```text
POST /activities/{activity_id}/check-in
POST /activities/{activity_id}/check-out
```

##### Evidence

* Nhập minh chứng tham gia từ file CSV/XLSX.
* Kiểm tra thông tin MSSV và dữ liệu minh chứng.
* Xác minh item tương ứng trong SAP-Evidence.

<!--
![Registration AWS Pilot](/images/5-Workshop/5.4-DynamoDB/registration-pilot.png)

![Attendance AWS Pilot](/images/5-Workshop/5.4-DynamoDB/attendance-pilot.png)

![Evidence AWS Pilot](/images/5-Workshop/5.4-DynamoDB/evidence-pilot.png)
-->

Trong đồ án, mỗi nhóm dữ liệu có thể có cấu hình AWS Pilot riêng. Cần kiểm tra và bật đúng cấu hình trước khi thực hiện từng bài kiểm thử.

#### 6. Truy vấn dữ liệu theo Activity ID

Các bảng Registration, Attendance, Evidence và Participation sử dụng activity_id làm Partition Key và mssv làm Sort Key.

Chúng ta có thể truy xuất các bản ghi thuộc cùng một hoạt động bằng Query.

Tạo file:

```text
test_dynamodb_query.py
```

Nội dung:

```python
import boto3
from boto3.dynamodb.conditions import Key
from pprint import pprint

session = boto3.Session(
    profile_name="sap-dev",
    region_name="ap-southeast-1"
)

dynamodb = session.resource("dynamodb")

activity_id = input("Enter Activity ID: ").strip()

tables = [
    "SAP-Registrations",
    "SAP-Attendance",
    "SAP-Evidence",
    "SAP-Participation"
]

for table_name in tables:
    table = dynamodb.Table(table_name)

    items = []

    params = {
        "KeyConditionExpression":
            Key("activity_id").eq(activity_id),
        "ConsistentRead": True
    }

    while True:
        response = table.query(**params)

        items.extend(response.get("Items", []))

        last_key = response.get("LastEvaluatedKey")

        if not last_key:
            break

        params["ExclusiveStartKey"] = last_key

    print("\nTable:", table_name)
    print("Total items:", len(items))

    for item in items:
        pprint(item)
```

Chạy:

```powershell
python test_dynamodb_query.py
```

Nhập Activity ID cần kiểm tra.

Script sẽ truy vấn bốn bảng và hiển thị các item thuộc hoạt động tương ứng.

<!--
![DynamoDB Query Results](/images/5-Workshop/5.4-DynamoDB/dynamodb-query.png)
-->

#### 7. Kiểm thử Participation

Sau khi có dữ liệu Registration, Attendance và Evidence:

* Thực hiện chức năng đối soát trong Backend.
* Kiểm tra các trường hợp đủ hoặc thiếu dữ liệu.
* Thực hiện xác nhận kết quả bằng quyền ADMIN.
* Kiểm tra dữ liệu trong SAP-Participation khi AWS Pilot tương ứng được bật.

Các trạng thái cần kiểm tra có thể bao gồm:

* CONFIRMED: Đã được xác nhận tham gia.
* REJECTED: Không được xác nhận tham gia.

Kết quả cụ thể phụ thuộc vào dữ liệu đầu vào, quy tắc nghiệp vụ và quyết định của ADMIN.

<!--
![Participation AWS Pilot](/images/5-Workshop/5.4-DynamoDB/participation-pilot.png)
-->

#### 8. Tổng hợp kết quả kiểm thử

| Nội dung | Kết quả mong đợi |
| --- | --- |
| AWS Connectivity | Kết nối AWS thành công |
| Scan | Đọc được dữ liệu Activities |
| Create Activity | Backend tạo hoạt động thành công |
| GetItem | Tìm được Activity đã lưu trên DynamoDB |
| Registration | Dữ liệu đăng ký xuất hiện trong bảng tương ứng khi bật Pilot |
| Attendance | Dữ liệu điểm danh được ghi nhận đúng nghiệp vụ |
| Evidence | Dữ liệu minh chứng được lưu theo Activity ID và MSSV |
| Participation | Kết quả đối soát và xác nhận được lưu khi bật Pilot |
| Query | Truy xuất được các item theo Activity ID |

Các kết quả trên là tiêu chí kiểm thử của Workshop.

Người thực hiện cần đối chiếu Response của API với các item trên DynamoDB để xác nhận việc lưu trữ Cloud thực tế.

#### Kết luận

Trong phần này, chúng ta đã tìm hiểu cách kiểm tra kết nối DynamoDB, thực hiện Scan, GetItem và Query, đồng thời kiểm thử quá trình ghi dữ liệu nghiệp vụ từ Backend.

Điểm quan trọng là API thành công không tự động chứng minh dữ liệu đã được lưu trên AWS. Cần kiểm tra trực tiếp item trên DynamoDB để xác nhận luồng tích hợp.

[Tiếp theo: Xác minh dữ liệu trên AWS Console](../5.4.4-verify-data/)
