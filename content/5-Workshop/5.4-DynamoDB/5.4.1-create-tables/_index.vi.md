
---
title: "Tạo các bảng Amazon DynamoDB"
date: 2026-11-09
weight: 1
chapter: false
pre: "<b>5.4.1.</b>"
---

## Tạo các bảng Amazon DynamoDB

Trong phần này, chúng ta sẽ chuẩn bị các bảng Amazon DynamoDB để lưu trữ dữ liệu nghiệp vụ của hệ thống Student Activity Management & Engagement Analytics Platform.

Để hoàn thành bài thực hành, bạn cần:

* Hoàn thành phần 5.2 - Các bước chuẩn bị.
* Hoàn thành phần 5.3 - Backend FastAPI.
* Có tài khoản AWS được cấp quyền sử dụng DynamoDB.
* Cấu hình AWS CLI với Profile sap-dev.

#### 1. Thiết kế cấu trúc bảng

Trong Amazon DynamoDB, mỗi bảng cần có một Primary Key để xác định các item.

Primary Key có thể gồm:

* **Partition Key:** Khóa chính dùng để phân vùng và xác định dữ liệu.
* **Sort Key:** Khóa sắp xếp dùng để phân biệt nhiều item có cùng Partition Key.

Trong đồ án, chúng ta sử dụng năm bảng sau:

| Table Name | Partition Key | Sort Key |
| --- | --- | --- |
| SAP-Activities | activity_id | Không sử dụng |
| SAP-Registrations | activity_id | mssv |
| SAP-Attendance | activity_id | mssv |
| SAP-Evidence | activity_id | mssv |
| SAP-Participation | activity_id | mssv |

Các khóa activity_id và mssv được biểu diễn dưới dạng String để lưu mã định danh và giữ nguyên các chữ số 0 ở đầu MSSV.

Ví dụ:

```text
activity_id: ACT#DEMO001
mssv: 0818000001
```

Cách thiết kế này cho phép truy xuất thông tin của một hoạt động hoặc tìm dữ liệu của một sinh viên trong hoạt động đó.

{{% notice note %}}
Nếu đang sử dụng các bảng đã được tạo trong đồ án, hãy kiểm tra Key Schema trước khi thực hiện. Không tạo lại hoặc thay đổi khóa của bảng hiện có. Cấu trúc khóa phải tương thích với repository trong source code Backend.
{{% /notice %}}

#### 2. Mở Amazon DynamoDB Console

1. Truy cập [AWS Management Console](https://console.aws.amazon.com/).

2. Tại thanh tìm kiếm, nhập **DynamoDB**.

3. Chọn **Amazon DynamoDB**.

4. Tại góc trên bên phải, chọn Region:

```text
Asia Pacific (Singapore)
ap-southeast-1
```

5. Tại thanh điều hướng bên trái, chọn **Tables**.

<!--
![Amazon DynamoDB Console](/images/5-Workshop/5.4-DynamoDB/dynamodb-console.png)
-->

Nếu năm bảng SAP đã tồn tại, bạn có thể kiểm tra trạng thái và Key Schema, sau đó chuyển đến bước kiểm tra cuối cùng.

#### 3. Tạo bảng SAP-Activities

Bảng SAP-Activities được sử dụng để lưu thông tin các hoạt động sinh viên.

1. Trong DynamoDB Console, chọn **Create table**.

2. Nhập Table name:

```text
SAP-Activities
```

3. Tại Partition key, nhập:

```text
activity_id
```

4. Chọn Data type là **String**.

5. Không cấu hình Sort key cho bảng này.

<!--
![Create Activities Table](/images/5-Workshop/5.4-DynamoDB/create-activities.png)
-->

6. Tại Table settings, có thể chọn **Customize settings** để cấu hình Capacity mode.

7. Chọn **On-demand** cho môi trường thực hành nếu phù hợp với nhu cầu và ngân sách.

8. Giữ cấu hình mã hóa mặc định phù hợp.

9. Chọn **Create table**.

<!--
![Activities Table Created](/images/5-Workshop/5.4-DynamoDB/activities-created.png)
-->

Sau khi tạo thành công, kiểm tra trạng thái của bảng là ACTIVE.

Các thuộc tính nghiệp vụ có thể được lưu trong bảng bao gồm:

* activity_id.
* Tên hoạt động.
* Mô tả.
* Địa điểm.
* Thời gian tổ chức.
* Trạng thái hoạt động.

DynamoDB không yêu cầu khai báo trước toàn bộ các thuộc tính không phải khóa khi tạo bảng.

#### 4. Tạo bảng SAP-Registrations

Bảng này lưu dữ liệu sinh viên đăng ký tham gia từng hoạt động.

1. Chọn **Create table**.

2. Nhập Table name:

```text
SAP-Registrations
```

3. Cấu hình Partition key:

```text
activity_id
String
```

4. Cấu hình Sort key:

```text
mssv
String
```

5. Chọn Capacity mode phù hợp với môi trường thực hành.

6. Chọn **Create table**.

<!--
![Create Registrations Table](/images/5-Workshop/5.4-DynamoDB/create-registrations.png)
-->

Cấu trúc khóa này giúp lưu nhiều sinh viên đăng ký cùng một hoạt động, trong đó mỗi sinh viên được phân biệt bằng MSSV.

#### 5. Tạo bảng SAP-Attendance

Bảng SAP-Attendance được sử dụng để lưu thông tin Check-in và Check-out của sinh viên.

Cấu hình bảng:

```text
Table name: SAP-Attendance
Partition key: activity_id (String)
Sort key: mssv (String)
```

Thực hiện các bước tạo bảng tương tự SAP-Registrations.

Các item có thể chứa:

* Mã hoạt động.
* MSSV.
* Thời gian Check-in.
* Thời gian Check-out.
* Thông tin trạng thái điểm danh.

<!--
![Create Attendance Table](/images/5-Workshop/5.4-DynamoDB/create-attendance.png)
-->

Dữ liệu điểm danh của hệ thống được ghi nhận thông qua REST API theo thời gian thực, thay vì nhập danh sách điểm danh từ file Excel sau hoạt động.

#### 6. Tạo bảng SAP-Evidence

Bảng SAP-Evidence được sử dụng để lưu dữ liệu minh chứng tham gia của sinh viên.

Cấu hình bảng:

```text
Table name: SAP-Evidence
Partition key: activity_id (String)
Sort key: mssv (String)
```

Chọn **Create table** và kiểm tra trạng thái bảng sau khi tạo.

<!--
![Create Evidence Table](/images/5-Workshop/5.4-DynamoDB/create-evidence.png)
-->

Dữ liệu minh chứng có thể được nhập từ Google Forms hoặc Google Sheets thông qua file CSV/XLSX và xử lý bởi Backend.

#### 7. Tạo bảng SAP-Participation

Bảng SAP-Participation lưu kết quả đối soát và xác nhận tham gia hoạt động.

Cấu hình bảng:

```text
Table name: SAP-Participation
Partition key: activity_id (String)
Sort key: mssv (String)
```

Các dữ liệu nghiệp vụ liên quan có thể bao gồm:

* Trạng thái đăng ký.
* Trạng thái điểm danh.
* Trạng thái minh chứng.
* Kết quả đối soát.
* Kết quả xác nhận tham gia.

<!--
![Create Participation Table](/images/5-Workshop/5.4-DynamoDB/create-participation.png)
-->

#### 8. Kiểm tra danh sách bảng

Sau khi tạo hoặc chuẩn bị các bảng, quay lại DynamoDB Console.

Chọn **Tables** và kiểm tra năm bảng:

* SAP-Activities.
* SAP-Registrations.
* SAP-Attendance.
* SAP-Evidence.
* SAP-Participation.

Các bảng cần ở trạng thái ACTIVE.

<!--
![DynamoDB Tables](/images/5-Workshop/5.4-DynamoDB/dynamodb-tables.png)
-->

Có thể kiểm tra bằng AWS CLI:

```powershell
aws dynamodb list-tables --region ap-southeast-1 --profile sap-dev
```

Kết quả cần chứa năm bảng nghiệp vụ của hệ thống:

```json
{
    "TableNames": [
        "SAP-Activities",
        "SAP-Attendance",
        "SAP-Evidence",
        "SAP-Participation",
        "SAP-Registrations"
    ]
}
```

Danh sách thực tế có thể chứa thêm các bảng khác trong tài khoản AWS.

Kiểm tra thông tin bảng SAP-Evidence:

```powershell
aws dynamodb describe-table --table-name SAP-Evidence --region ap-southeast-1 --profile sap-dev --query "Table.{Status:TableStatus,KeySchema:KeySchema,Attributes:AttributeDefinitions}"
```

Kết quả Key Schema cần có:

```text
activity_id: HASH
mssv: RANGE
```

Trong đó HASH là Partition Key và RANGE là Sort Key.

Thực hiện tương tự với các bảng còn lại để kiểm tra cấu hình.

#### Kết quả

Sau khi hoàn thành phần này:

* Năm bảng DynamoDB đã được tạo hoặc xác minh trong Region Singapore.
* Partition Key và Sort Key đã được kiểm tra.
* Các bảng ở trạng thái ACTIVE.
* AWS CLI có thể truy cập thông tin bảng.

Trong phần tiếp theo, chúng ta sẽ sử dụng boto3 để kết nối Backend FastAPI với các bảng DynamoDB.

[Tiếp theo: Kết nối Backend với Amazon DynamoDB](../5.4.2-connect-backend/)
