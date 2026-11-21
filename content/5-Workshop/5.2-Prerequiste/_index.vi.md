
---
title: "Các bước chuẩn bị"
date: 2026-11-09
weight: 2
chapter: false
pre: "<b>5.2.</b>"
---

## Các bước chuẩn bị

Để thực hiện Workshop **Student Activity Management & Engagement Analytics Platform**, chúng ta cần chuẩn bị môi trường phát triển local, tài khoản AWS, quyền truy cập tài nguyên và các công cụ cần thiết để xây dựng, triển khai và kiểm thử hệ thống.

Trong workshop này, chúng ta sẽ sử dụng:

* Python/FastAPI để xây dựng Backend.
* React/Vite để xây dựng Frontend.
* SQLite để lưu trữ dữ liệu trong môi trường Demo.
* Amazon DynamoDB để tích hợp lưu trữ dữ liệu trên AWS.
* AWS Amplify để triển khai Frontend.
* Amazon S3 và AWS Lambda để xử lý dữ liệu CSV.
* AWS IAM để quản lý quyền truy cập.
* Amazon CloudWatch để giám sát quá trình thực thi.
* Cloudflare Quick Tunnel để kết nối Frontend với Backend local.

#### 1. Chuẩn bị tài khoản AWS

Đầu tiên, bạn cần có tài khoản AWS để sử dụng các dịch vụ trong workshop.

Truy cập [AWS Management Console](https://console.aws.amazon.com/).

* Đăng nhập vào tài khoản AWS.
* Sử dụng IAM User hoặc IAM Role được cấp quyền phù hợp để thực hiện workshop.
* Không sử dụng tài khoản Root cho các thao tác phát triển ứng dụng hằng ngày.
* Kiểm tra AWS Region trước khi tạo tài nguyên.
* Kiểm tra thông tin AWS Billing để theo dõi chi phí phát sinh trong quá trình thực hành.

Trong workshop này, chúng ta sẽ sử dụng AWS Region phù hợp với môi trường triển khai thực tế của đồ án.

Các tài nguyên Amazon DynamoDB, Amazon S3, AWS Lambda và Amazon CloudWatch cần được cấu hình đúng Region để thuận tiện cho việc tích hợp và kiểm thử.

{{% notice note %}}
Hãy sử dụng cùng AWS Region đã lựa chọn trong đồ án. Các tên tài nguyên và thông tin cấu hình trong workshop có thể cần điều chỉnh theo tài khoản AWS của bạn.
{{% /notice %}}

#### 2. Chuẩn bị IAM Permissions

AWS Identity and Access Management (IAM) được sử dụng để quản lý danh tính và quyền truy cập tài nguyên AWS.

Trong workshop này, chúng ta cần phân biệt hai nhóm quyền:

* Quyền của người thực hiện workshop để tạo, cấu hình, kiểm thử và dọn dẹp tài nguyên.
* Quyền thực thi của AWS Lambda và Backend khi truy cập các tài nguyên AWS.

##### 2.1. Quyền của người thực hiện workshop

Tài khoản IAM sử dụng trong workshop cần được cấp các quyền phù hợp để thực hiện những thao tác sau:

| Dịch vụ | Quyền cần thiết |
| --- | --- |
| Amazon DynamoDB | Tạo bảng, kiểm tra bảng, đọc và ghi dữ liệu |
| Amazon S3 | Tạo Bucket, tải lên, tải xuống và quản lý object |
| AWS Lambda | Tạo Function, cập nhật mã nguồn, cấu hình và kiểm thử |
| AWS IAM | Tạo hoặc sử dụng Execution Role, cấu hình Policy và PassRole |
| Amazon CloudWatch | Xem Log Group, Log Stream, Metrics và cấu hình Log Retention |
| AWS Amplify | Tạo ứng dụng, kết nối repository, cấu hình build và deployment |

Trong môi trường học tập, nếu sử dụng tài khoản AWS do đơn vị thực tập cung cấp, bạn cần kiểm tra những quyền đã được cấp trước khi thực hiện.

Không tự ý cấp quyền AdministratorAccess hoặc sử dụng quyền không cần thiết cho các tài nguyên nằm ngoài phạm vi workshop.

##### 2.2. IAM Role dành cho AWS Lambda

AWS Lambda CSV Processor cần được cấp quyền để:

* Đọc file CSV từ Amazon S3.
* Ghi kết quả JSON trở lại Amazon S3.
* Gửi log thực thi đến Amazon CloudWatch.

Truy cập AWS Management Console.

* Tìm kiếm dịch vụ **IAM**.
* Chọn **Roles**.
* Chọn **Create role**.
* Tại Trusted entity type, chọn **AWS service**.
* Tại Use case, chọn **Lambda**.
* Chọn **Next**.
* Gắn policy **AWSLambdaBasicExecutionRole** để hỗ trợ ghi log lên CloudWatch.
* Đặt tên IAM Role, ví dụ:

```text
SAP-Lambda-CSV-Processor-Role
```

* Chọn **Create role**.

Sau đó, bổ sung một Inline Policy cho phép Lambda đọc và ghi dữ liệu trong phạm vi S3 Bucket sử dụng cho workshop.

Ví dụ IAM Permission Policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ReadInputCSV",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::YOUR-SAP-BUCKET/input/*"
        },
        {
            "Sid": "WriteOutputJSON",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::YOUR-SAP-BUCKET/output/*"
        }
    ]
}
```

Trong đó:

* YOUR-SAP-BUCKET: Tên S3 Bucket thực tế sử dụng trong workshop.
* input/: Prefix chứa file CSV đầu vào.
* output/: Prefix chứa file JSON kết quả.

Thay thế YOUR-SAP-BUCKET và các prefix bằng thông tin tài nguyên thực tế của bạn.

{{% notice warning %}}
IAM Policy trên chỉ dành cho Lambda CSV Processor. Đây không phải policy để cấp toàn bộ quyền triển khai workshop cho IAM User. Nếu các prefix hoặc Bucket thực tế khác ví dụ, cần điều chỉnh Resource ARN tương ứng.
{{% /notice %}}

<!--
Thêm ảnh chụp IAM Role sau khi tạo:

![IAM Lambda Role](/images/5-Workshop/5.2-Prerequisite/iam-role.png)

![IAM Permission Policy](/images/5-Workshop/5.2-Prerequisite/iam-policy.png)
-->

#### 3. Cài đặt môi trường phát triển

Trong workshop này, chúng ta sẽ phát triển và kiểm thử ứng dụng trên máy tính local trước khi tích hợp các dịch vụ AWS.

##### 3.1. Visual Studio Code

Visual Studio Code được sử dụng để phát triển mã nguồn Backend và Frontend.

Tải và cài đặt tại:

[Visual Studio Code](https://code.visualstudio.com/)

Có thể cài đặt thêm các Extensions hỗ trợ:

* Python.
* Pylance.
* ESLint.
* Prettier.
* AWS Toolkit.

##### 3.2. Python

Python được sử dụng để xây dựng FastAPI Backend và AWS Lambda CSV Processor.

Tải Python tại:

[Python Downloads](https://www.python.org/downloads/)

Sau khi cài đặt, mở PowerShell và kiểm tra:

```powershell
python --version
pip --version
```

Sử dụng phiên bản Python tương thích với source code và các thư viện trong đồ án.

##### 3.3. Node.js và npm

Node.js và npm được sử dụng để phát triển và chạy Frontend React/Vite.

Tải Node.js tại:

[Node.js Downloads](https://nodejs.org/)

Ưu tiên sử dụng phiên bản Node.js LTS tương thích với Vite và cấu hình package.json của dự án.

Kiểm tra sau khi cài đặt:

```powershell
node --version
npm --version
```

##### 3.4. Git

Git được sử dụng để quản lý mã nguồn và kết nối repository với AWS Amplify Hosting.

Tải Git tại:

[Git Downloads](https://git-scm.com/downloads)

Kiểm tra phiên bản:

```powershell
git --version
```

Ngoài ra, cần chuẩn bị tài khoản GitHub để lưu trữ source code và phục vụ quá trình triển khai Frontend.

##### 3.5. AWS CLI

AWS Command Line Interface (AWS CLI) giúp thực hiện các thao tác AWS trực tiếp từ Terminal.

Hướng dẫn cài đặt:

[AWS CLI Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

Kiểm tra sau khi cài đặt:

```powershell
aws --version
```

<!--
![Development Environment](/images/5-Workshop/5.2-Prerequisite/development-environment.png)
-->

#### 4. Cấu hình AWS CLI và AWS Profile

Trong đồ án, AWS Profile được sử dụng để kết nối Backend Python với các tài nguyên AWS thông qua boto3.

Workshop sử dụng tên Profile:

```text
sap-dev
```

##### 4.1. Cấu hình AWS Credentials

Nếu sử dụng IAM User có Access Key được cấp cho môi trường học tập, mở PowerShell và thực hiện:

```powershell
aws configure --profile sap-dev
```

Nhập các thông tin được yêu cầu:

```text
AWS Access Key ID: <Your Access Key ID>
AWS Secret Access Key: <Your Secret Access Key>
Default region name: <Your AWS Region>
Default output format: json
```

Nếu tài khoản sử dụng AWS IAM Identity Center, hãy cấu hình Profile bằng:

```powershell
aws configure sso --profile sap-dev
aws sso login --profile sap-dev
```

Chỉ cần lựa chọn phương thức xác thực phù hợp với tài khoản AWS của bạn.

##### 4.2. Kiểm tra kết nối AWS

Sau khi cấu hình, kiểm tra Profile:

```powershell
aws sts get-caller-identity --profile sap-dev
```

Nếu cấu hình thành công, AWS CLI sẽ trả về thông tin AWS Account và IAM Identity đang được sử dụng.

Kiểm tra cấu hình Region:

```powershell
aws configure get region --profile sap-dev
```

Có thể kiểm tra khả năng truy cập DynamoDB và S3 nếu tài khoản đã được cấp quyền:

```powershell
aws dynamodb list-tables --profile sap-dev
aws s3 ls --profile sap-dev
```

{{% notice warning %}}
Không đưa AWS Access Key, Secret Access Key, Session Token hoặc thông tin xác thực vào GitHub, source code Frontend hay ảnh chụp báo cáo thực tập.
{{% /notice %}}

<!--
![AWS CLI Profile](/images/5-Workshop/5.2-Prerequisite/aws-cli-profile.png)

![AWS Connection Test](/images/5-Workshop/5.2-Prerequisite/aws-connection-test.png)
-->

#### 5. Chuẩn bị source code đồ án

Trong workshop này, chúng ta sử dụng source code của **Student Activity Management & Engagement Analytics Platform**.

Cấu trúc thư mục chính:

```text
student-activity-platform/
├── backend/
└── frontend/
```

Source code có thể được lưu trữ trên GitHub hoặc trong máy tính local.

Nếu source code đã được tải lên GitHub, thực hiện:

```powershell
cd C:\Projects

git clone <YOUR_GITHUB_REPOSITORY_URL>

cd student-activity-platform
```

Thay YOUR_GITHUB_REPOSITORY_URL bằng đường dẫn repository thực tế của đồ án.

Nếu source code đã có sẵn trên máy tính, chỉ cần mở thư mục dự án bằng VS Code.

#### 6. Chuẩn bị Backend FastAPI

##### 6.1. Tạo Python Virtual Environment

Mở Terminal tại thư mục Backend:

```powershell
cd C:\Projects\student-activity-platform\backend
```

Tạo môi trường Python riêng cho dự án:

```powershell
python -m venv .venv
```

Kích hoạt Virtual Environment trên PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Nếu PowerShell chặn việc chạy script, có thể sử dụng:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

.\.venv\Scripts\Activate.ps1
```

Cấu hình trên chỉ áp dụng cho phiên PowerShell hiện tại.

##### 6.2. Cài đặt các thư viện

Sử dụng file requirements.txt của Backend:

```powershell
python -m pip install --upgrade pip

pip install -r requirements.txt
```

Các thư viện chính được sử dụng trong đồ án bao gồm:

* FastAPI.
* Uvicorn.
* boto3.
* Các thư viện xử lý CSV/XLSX.
* Các thư viện Authentication và Authorization theo requirements.txt của dự án.

##### 6.3. Khởi chạy Backend

Cấu hình môi trường Demo của đồ án:

```powershell
$env:SAP_DEMO_MODE="1"
```

Cấu hình AWS Profile nếu cần kiểm thử tích hợp AWS:

```powershell
$env:AWS_PROFILE="sap-dev"
```

Khởi chạy FastAPI:

```powershell
python -m uvicorn app.main:app --reload
```

Sau khi Backend khởi chạy thành công, truy cập:

```text
http://127.0.0.1:8000
```

Kiểm tra tài liệu REST API tại:

```text
http://127.0.0.1:8000/docs
```

Swagger UI cho phép kiểm tra các API liên quan đến Authentication, Activities, Registration, Attendance, Evidence và Participation.

<!--
![FastAPI Backend Running](/images/5-Workshop/5.2-Prerequisite/backend-running.png)

![Swagger API Documentation](/images/5-Workshop/5.2-Prerequisite/swagger-ui.png)
-->

#### 7. Chuẩn bị Frontend React/Vite

Mở một Terminal mới và chuyển đến thư mục Frontend:

```powershell
cd C:\Projects\student-activity-platform\frontend
```

Cài đặt các thư viện Node.js:

```powershell
npm install
```

Khởi chạy Frontend:

```powershell
npm run dev
```

Vite thường cung cấp địa chỉ local:

```text
http://localhost:5173
```

Nếu cổng 5173 đang được sử dụng, kiểm tra địa chỉ mà Vite hiển thị trong Terminal.

Frontend cần kết nối đến FastAPI Backend tại:

```text
http://127.0.0.1:8000
```

Kiểm tra cấu hình API_BASE_URL trong source code Frontend trước khi sử dụng.

Cần đảm bảo:

* Backend đang chạy.
* Frontend đang chạy.
* Frontend kết nối được với Backend.
* CORS của Backend cho phép origin của Frontend.
* Có thể truy cập giao diện đăng nhập.
* Có tài khoản ADMIN và STUDENT để kiểm thử.

<!--
![Frontend Running](/images/5-Workshop/5.2-Prerequisite/frontend-running.png)

![Application Login Page](/images/5-Workshop/5.2-Prerequisite/login-page.png)
-->

#### 8. Chuẩn bị tài nguyên Amazon DynamoDB

Amazon DynamoDB sẽ được sử dụng để tích hợp và kiểm thử các nhóm dữ liệu nghiệp vụ của hệ thống.

Trong đồ án, các bảng DynamoDB bao gồm:

| Tên bảng | Mục đích |
| --- | --- |
| SAP-Activities | Lưu thông tin hoạt động |
| SAP-Registrations | Lưu dữ liệu đăng ký |
| SAP-Attendance | Lưu dữ liệu Check-in/Check-out |
| SAP-Evidence | Lưu dữ liệu minh chứng |
| SAP-Participation | Lưu kết quả tham gia |

Truy cập [Amazon DynamoDB Console](https://console.aws.amazon.com/dynamodb/).

* Kiểm tra AWS Region.
* Chọn **Tables**.
* Kiểm tra các bảng đã được tạo trong môi trường đồ án.

Nếu thực hiện workshop trên một tài khoản AWS mới, các bảng sẽ được tạo theo cấu trúc khóa Partition Key và Sort Key của source code trong phần Amazon DynamoDB Integration.

Không tự ý thay đổi Key Schema của bảng vì điều này có thể làm các thao tác đọc và ghi từ Backend không hoạt động.

Kiểm tra danh sách bảng bằng AWS CLI:

```powershell
aws dynamodb list-tables --profile sap-dev
```

{{% notice note %}}
SQLite vẫn được sử dụng để hỗ trợ lưu trữ và khôi phục dữ liệu trong môi trường Demo. DynamoDB là phần tích hợp lưu trữ dữ liệu trên AWS đã được kiểm thử. Workshop sẽ không mặc định rằng toàn bộ Backend đã chuyển đổi hoàn toàn sang DynamoDB.
{{% /notice %}}

<!--
![DynamoDB Tables](/images/5-Workshop/5.2-Prerequisite/dynamodb-tables.png)
-->

#### 9. Chuẩn bị Amazon S3 và AWS Lambda

##### 9.1. Amazon S3

Truy cập [Amazon S3 Console](https://s3.console.aws.amazon.com/s3/).

Chuẩn bị S3 Bucket sử dụng cho Serverless CSV Processing Demo.

Cấu trúc lưu trữ minh họa:

```text
YOUR-SAP-BUCKET/
├── input/
│   └── registrations.csv
└── output/
    └── registrations-result.json
```

Trong đó:

* input/: Chứa file CSV cần xử lý.
* output/: Chứa kết quả JSON do Lambda tạo ra.

Sử dụng Bucket và Object Key phù hợp với cấu hình Lambda thực tế.

Khi tạo Bucket:

* Sử dụng tên Bucket hợp lệ và không trùng trên AWS.
* Chọn Region phù hợp.
* Giữ Block Public Access.
* Sử dụng mã hóa mặc định phù hợp.
* Không upload dữ liệu sinh viên thật khi chưa được cấp phép.

##### 9.2. AWS Lambda

Truy cập [AWS Lambda Console](https://console.aws.amazon.com/lambda/).

Chuẩn bị các thông tin để tạo Lambda Function:

* Function name: SAP-CSV-Processor (tên minh họa).
* Runtime: Python, tương thích với mã nguồn Lambda.
* Execution Role: SAP-Lambda-CSV-Processor-Role hoặc Role thực tế đã tạo.
* Input: CSV Object trên S3.
* Output: JSON Object trên S3.

Lambda Function sẽ được cấu hình và kiểm thử chi tiết tại phần Serverless CSV Processing.

##### 9.3. Amazon CloudWatch

Amazon CloudWatch sẽ được sử dụng để kiểm tra log sau khi Lambda được thực thi.

Chuẩn bị:

* Lambda có quyền ghi log thông qua Execution Role.
* Log Group tương ứng với Lambda Function.
* Log Retention phù hợp với môi trường thực hành.

Trong môi trường Demo, thời gian lưu log có thể được cấu hình là 7 ngày để thuận tiện cho việc theo dõi và kiểm thử.

<!--
![S3 Bucket](/images/5-Workshop/5.2-Prerequisite/s3-bucket.png)

![Lambda Function](/images/5-Workshop/5.2-Prerequisite/lambda-function.png)

![CloudWatch Log Group](/images/5-Workshop/5.2-Prerequisite/cloudwatch-log-group.png)
-->

#### 10. Chuẩn bị Cloudflare Quick Tunnel

Trong phiên bản hiện tại của đồ án, Backend FastAPI chạy trên máy tính local. Cloudflare Quick Tunnel được sử dụng để tạo HTTPS Endpoint tạm thời, giúp Frontend trên AWS Amplify gửi REST API Request đến Backend.

Tải và cài đặt cloudflared theo hướng dẫn:

[Cloudflare Tunnel Downloads](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/)

Kiểm tra:

```powershell
cloudflared --version
```

Đảm bảo Backend FastAPI đang chạy tại:

```text
http://127.0.0.1:8000
```

Khởi tạo Quick Tunnel:

```powershell
cloudflared tunnel --url http://127.0.0.1:8000
```

Cloudflare sẽ cung cấp một HTTPS URL tạm thời có dạng:

```text
https://<random-name>.trycloudflare.com
```

URL này sẽ được sử dụng khi cấu hình API Endpoint của Frontend triển khai trên AWS Amplify.

{{% notice warning %}}
Cloudflare Quick Tunnel chỉ phục vụ môi trường phát triển và Demo. URL có thể thay đổi khi khởi động lại Tunnel. Không sử dụng Quick Tunnel như một giải pháp Backend Production. Không đưa dữ liệu cá nhân thật, tài khoản mặc định hoặc API quản trị không được bảo vệ lên Endpoint công khai.
{{% /notice %}}

<!--
![Cloudflare Quick Tunnel](/images/5-Workshop/5.2-Prerequisite/cloudflare-tunnel.png)
-->

#### 11. Chuẩn bị AWS Amplify Hosting

AWS Amplify được sử dụng để triển khai giao diện React/Vite của hệ thống.

Trước khi thực hiện phần triển khai, cần chuẩn bị:

* GitHub Repository chứa mã nguồn Frontend.
* Branch sử dụng cho Deployment.
* File package.json và cấu hình Vite.
* Cấu hình API Endpoint phù hợp với môi trường triển khai.
* Backend FastAPI và Cloudflare Tunnel đang hoạt động khi Demo.

Kiểm tra khả năng build Frontend tại local:

```powershell
cd C:\Projects\student-activity-platform\frontend

npm run build
```

Nếu build thành công, Vite thường tạo thư mục:

```text
dist/
```

Truy cập [AWS Amplify Console](https://console.aws.amazon.com/amplify/).

Việc kết nối GitHub Repository, cấu hình Build Settings và triển khai Website sẽ được thực hiện chi tiết trong phần Application Deployment.

<!--
![Amplify Console](/images/5-Workshop/5.2-Prerequisite/amplify-console.png)
-->

#### 12. Chuẩn bị dữ liệu thực hành

Để kiểm thử các chức năng Registration Import, Attendance, Evidence Import, Reconciliation và Analytics, chúng ta cần chuẩn bị một số bộ dữ liệu mẫu.

Các dữ liệu dưới đây được sử dụng cho mục đích học tập và không chứa thông tin sinh viên thật.

##### 12.1. Registration Data

File đăng ký sinh viên mẫu:

```csv
student_id,full_name,class_name
0818000001,Student A,DS01
0818000002,Student B,DS01
0818000003,Student C,DS02
```

##### 12.2. Attendance Data

Chuẩn bị MSSV mẫu để thực hiện Check-in và Check-out trên Web Application.

```text
Student ID: 0818000001
Student ID: 0818000002
Student ID: 0818000003
```

Dữ liệu điểm danh được ghi nhận theo thời gian thực thông qua REST API, không phải import file Check-in/Check-out sau hoạt động.

##### 12.3. Evidence Data

File minh chứng tham gia mẫu:

```csv
student_id,evidence_url
0818000001,https://example.com/evidence-01
0818000002,https://example.com/evidence-02
```

Tên cột và định dạng file cần được điều chỉnh theo Import Template thực tế của đồ án.

##### 12.4. Lambda CSV Processing Data

Chuẩn bị file CSV gồm 4 bản ghi:

```csv
student_id,full_name
0818000001,Student A
0818000002,Student B
0818000001,Student A
,Student C
```

File này được sử dụng để kiểm tra khả năng phát hiện dữ liệu trùng lặp và dữ liệu thiếu trường bắt buộc của Lambda CSV Processor.

Kết quả dự kiến:

| Chỉ số | Số lượng |
| --- | --- |
| Total Records | 4 |
| Valid Records | 2 |
| Duplicate Records | 1 |
| Invalid Records | 1 |

#### 13. Kiểm tra môi trường trước khi bắt đầu

Sau khi hoàn thành các bước chuẩn bị, kiểm tra các thành phần sau:

| Thành phần | Yêu cầu |
| --- | --- |
| AWS Account | Có thể đăng nhập và được cấp quyền phù hợp |
| Python | Đã cài đặt và hoạt động |
| Node.js/npm | Đã cài đặt và hoạt động |
| Git | Có thể truy cập source code |
| AWS CLI | Profile sap-dev được cấu hình |
| FastAPI | Backend có thể khởi chạy tại port 8000 |
| React/Vite | Frontend có thể chạy local và build thành công |
| SQLite | Sẵn sàng cho môi trường Demo |
| DynamoDB | Có quyền truy cập và chuẩn bị các bảng nghiệp vụ |
| Amazon S3 | Sẵn sàng tạo hoặc sử dụng Bucket thực hành |
| AWS Lambda | Chuẩn bị Runtime và Execution Role |
| Amazon CloudWatch | Có quyền xem log thực thi |
| Cloudflare Tunnel | Có thể tạo HTTPS Endpoint cho Demo |
| AWS Amplify | Có GitHub Repository để triển khai |
| Sample Data | Có dữ liệu Registration, Attendance và Evidence mẫu |

Sau khi hoàn thành, môi trường đã sẵn sàng để tiếp tục các bước phát triển Backend, tích hợp AWS, triển khai Frontend và kiểm thử hệ thống.

#### Tổng kết

Trong phần này, chúng ta đã chuẩn bị môi trường phát triển và các điều kiện cần thiết để thực hiện Workshop Student Activity Management & Engagement Analytics Platform.

Kiến trúc sử dụng React/Vite, FastAPI, SQLite và các dịch vụ AWS được lựa chọn phù hợp với từng nhiệm vụ của hệ thống.

![Student Activity Management & Engagement Analytics Platform Architecture](/images/2-Proposal/student_activity_architectur.drawio.png)

Ở phần tiếp theo, chúng ta sẽ bắt đầu xây dựng và cấu hình FastAPI Backend, làm nền tảng cho việc triển khai các chức năng quản lý hoạt động, điểm danh, xử lý dữ liệu và tích hợp Amazon DynamoDB.
