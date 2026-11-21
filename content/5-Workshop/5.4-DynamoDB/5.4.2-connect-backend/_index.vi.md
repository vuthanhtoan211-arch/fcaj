
---
title: "Kết nối Backend với Amazon DynamoDB"
date: 2026-11-09
weight: 2
chapter: false
pre: "<b>5.4.2.</b>"
---

## Kết nối Backend với Amazon DynamoDB

Trong phần này, chúng ta sẽ cấu hình AWS SDK for Python (boto3) để Backend FastAPI có thể kết nối và tương tác với Amazon DynamoDB.

#### 1. Mở Backend trong Visual Studio Code

Mở thư mục source code:

```text
C:\Projects\student-activity-platform
```

Mở Terminal PowerShell và chuyển đến thư mục Backend:

```powershell
cd C:\Projects\student-activity-platform\backend
```

Kích hoạt Python Virtual Environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

Nếu PowerShell chặn script:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

.\.venv\Scripts\Activate.ps1
```

<!--
![Backend Environment](/images/5-Workshop/5.4-DynamoDB/backend-environment.png)
-->

#### 2. Cài đặt và kiểm tra boto3

boto3 là AWS SDK dành cho Python, cho phép ứng dụng tương tác với các dịch vụ AWS thông qua API.

Cài đặt thư viện:

```powershell
python -m pip install boto3
```

Kiểm tra:

```powershell
python -c "import boto3; print(boto3.__version__)"
```

Nếu boto3 đã được cài đặt từ requirements.txt, bạn không cần cài đặt lại.

<!--
![Install Boto3](/images/5-Workshop/5.4-DynamoDB/install-boto3.png)
-->

#### 3. Cấu hình AWS Profile

Trong đồ án, chúng ta sử dụng AWS Profile:

```text
sap-dev
```

Kiểm tra danh sách Profile:

```powershell
aws configure list-profiles
```

Nếu chưa có Profile sap-dev, thực hiện cấu hình theo phần 5.2 - Các bước chuẩn bị.

Thiết lập các biến môi trường:

```powershell
$env:AWS_PROFILE="sap-dev"
$env:AWS_REGION="ap-southeast-1"
$env:AWS_DEFAULT_REGION="ap-southeast-1"
```

Kiểm tra AWS Identity:

```powershell
aws sts get-caller-identity --profile sap-dev
```

Kiểm tra Region:

```powershell
aws configure get region --profile sap-dev
```

Các lệnh AWS trong phần này sẽ sử dụng Region Singapore.

{{% notice warning %}}
Không đưa AWS Access Key và Secret Access Key trực tiếp vào mã nguồn Backend hoặc Frontend. Không upload file Credentials lên GitHub. Chỉ sử dụng tài khoản và quyền truy cập đã được cấp phép.
{{% /notice %}}

<!--
![AWS Profile Configuration](/images/5-Workshop/5.4-DynamoDB/aws-profile.png)
-->

#### 4. Tìm hiểu cấu hình kết nối DynamoDB

boto3 hỗ trợ tạo Session và Client để thực hiện các thao tác với DynamoDB.

Ví dụ minh họa:

```python
import boto3

session = boto3.Session(
    profile_name="sap-dev",
    region_name="ap-southeast-1"
)

dynamodb = session.client("dynamodb")

response = dynamodb.list_tables()

print(response["TableNames"])
```

Giải thích:

* boto3.Session: Tạo phiên kết nối AWS.
* profile_name: Sử dụng thông tin xác thực của Profile sap-dev.
* region_name: Xác định Region chứa bảng DynamoDB.
* session.client: Khởi tạo DynamoDB Client.
* list_tables: Truy xuất danh sách bảng trong Region.

Trong đồ án thực tế, các thông tin Profile, Region và tên bảng có thể được quản lý thông qua các biến môi trường và module cấu hình để tránh lặp lại thông tin trong nhiều file.

Không cần thay thế toàn bộ cấu hình Backend bằng đoạn code minh họa trên.

#### 5. Chuẩn bị quyền DynamoDB cho Backend

Backend cần có quyền phù hợp để đọc và ghi các bảng nghiệp vụ.

Các thao tác thường được sử dụng:

* dynamodb:DescribeTable.
* dynamodb:GetItem.
* dynamodb:PutItem.
* dynamodb:UpdateItem.
* dynamodb:Query.
* dynamodb:Scan.

Ví dụ IAM Policy cho phần tích hợp dữ liệu:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AccessSAPTables",
            "Effect": "Allow",
            "Action": [
                "dynamodb:DescribeTable",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:Query",
                "dynamodb:Scan"
            ],
            "Resource": [
                "arn:aws:dynamodb:ap-southeast-1:YOUR_ACCOUNT_ID:table/SAP-Activities",
                "arn:aws:dynamodb:ap-southeast-1:YOUR_ACCOUNT_ID:table/SAP-Registrations",
                "arn:aws:dynamodb:ap-southeast-1:YOUR_ACCOUNT_ID:table/SAP-Attendance",
                "arn:aws:dynamodb:ap-southeast-1:YOUR_ACCOUNT_ID:table/SAP-Evidence",
                "arn:aws:dynamodb:ap-southeast-1:YOUR_ACCOUNT_ID:table/SAP-Participation"
            ]
        },
        {
            "Sid": "ListTables",
            "Effect": "Allow",
            "Action": "dynamodb:ListTables",
            "Resource": "*"
        }
    ]
}
```

Thay YOUR_ACCOUNT_ID bằng AWS Account ID thực tế của bạn.

Policy trên là ví dụ dành cho các thao tác tích hợp và kiểm tra trong Workshop. Đây không phải toàn bộ policy triển khai hệ thống.

Nếu repository sử dụng BatchWriteItem, DeleteItem hoặc các thao tác khác, cần bổ sung quyền phù hợp theo mã nguồn và phạm vi nghiệp vụ thực tế.

Không cấp quyền truy cập vào các bảng ngoài phạm vi đồ án nếu không cần thiết.

#### 6. Kiểm tra tài nguyên bằng script của đồ án

Trong source code Backend, chúng ta đã chuẩn bị file:

```text
backend/check_aws_resources.py
```

Script này giúp kiểm tra khả năng kết nối AWS và trạng thái các tài nguyên của đồ án.

Từ thư mục backend, chạy:

```powershell
$env:AWS_PROFILE="sap-dev"
$env:AWS_DEFAULT_REGION="ap-southeast-1"

.\.venv\Scripts\python.exe .\check_aws_resources.py
```

Script sử dụng boto3 để thực hiện các thao tác kiểm tra tài nguyên.

Các bảng cần kiểm tra:

```text
SAP-Activities
SAP-Registrations
SAP-Attendance
SAP-Evidence
SAP-Participation
```

Kết quả mong đợi là các bảng được tìm thấy và có trạng thái ACTIVE.

<!--
![AWS Resource Check](/images/5-Workshop/5.4-DynamoDB/aws-resource-check.png)
-->

{{% notice note %}}
check_aws_resources.py là script kiểm tra chỉ đọc. Script không tạo bảng, không sửa item và không xóa dữ liệu DynamoDB. Nếu script có kiểm tra S3, cần bảo đảm tên Bucket và quyền truy cập S3 đã được cấu hình đúng.
{{% /notice %}}

#### 7. Tìm hiểu cách Backend truy cập DynamoDB

Trong kiến trúc của đồ án, FastAPI sử dụng các thành phần repository và cấu hình AWS để thực hiện những thao tác lưu trữ nghiệp vụ.

Luồng tích hợp:

```text
FastAPI Router
      |
      v
Business Service
      |
      v
DynamoDB Repository
      |
      | boto3
      v
Amazon DynamoDB
```

Các thành phần có nhiệm vụ:

* Router: Tiếp nhận REST API Request.
* Business Service: Kiểm tra và xử lý nghiệp vụ.
* Repository: Đóng gói thao tác truy cập dữ liệu.
* boto3: Gửi AWS API Request đến DynamoDB.
* DynamoDB: Lưu trữ và truy xuất dữ liệu nghiệp vụ.

Cách tổ chức này giúp tách logic nghiệp vụ khỏi logic truy cập tài nguyên Cloud.

#### 8. Khởi chạy Backend

Thiết lập môi trường Demo:

```powershell
$env:SAP_DEMO_MODE="1"
$env:AWS_PROFILE="sap-dev"
$env:AWS_REGION="ap-southeast-1"
$env:AWS_DEFAULT_REGION="ap-southeast-1"
```

Kiểm tra các thiết lập AWS Pilot trong source code hiện tại trước khi thực hiện kiểm thử ghi dữ liệu.

Khởi chạy Backend:

```powershell
python -m uvicorn app.main:app --reload
```

Mở Swagger UI:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

<!--
![FastAPI AWS Integration](/images/5-Workshop/5.4-DynamoDB/backend-aws-running.png)
-->

{{% notice note %}}
Việc cấu hình AWS Profile và Region chỉ chuẩn bị kết nối AWS. Các API nghiệp vụ có sử dụng DynamoDB hay không còn phụ thuộc vào cấu hình repository và AWS Pilot của phiên bản Backend. Không mặc định rằng SAP_DEMO_MODE=1 sẽ bật toàn bộ thao tác DynamoDB.
{{% /notice %}}

#### Kết quả

Sau khi hoàn thành phần này:

* boto3 đã được cài đặt.
* AWS Profile sap-dev đã được cấu hình.
* Backend có thông tin kết nối Region Singapore.
* Script check_aws_resources.py có thể kiểm tra tài nguyên AWS.
* Các bảng DynamoDB đã sẵn sàng cho các thao tác kiểm thử.

Trong phần tiếp theo, chúng ta sẽ kiểm thử quá trình đọc và ghi dữ liệu của Backend với DynamoDB.

[Tiếp theo: Kiểm thử đọc và ghi dữ liệu](../5.4.3-test-dynamodb/)
