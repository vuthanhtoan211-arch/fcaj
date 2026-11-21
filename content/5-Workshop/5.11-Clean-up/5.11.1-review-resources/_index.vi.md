
---
title: "Kiểm kê tài nguyên và chi phí"
date: 2026-11-09
weight: 1
chapter: false
pre: "<b>5.11.1.</b>"
---

## Kiểm kê tài nguyên và chi phí

Trước khi thực hiện Clean-up, chúng ta cần kiểm tra toàn bộ tài nguyên AWS đang được sử dụng trong đồ án.

Việc kiểm kê giúp tránh xóa nhầm tài nguyên quan trọng và xác định những dịch vụ có thể phát sinh chi phí.

#### 1. Kiểm tra AWS Account và Region

1. Đăng nhập [AWS Management Console](https://console.aws.amazon.com/).
2. Kiểm tra AWS Account đang sử dụng.
3. Chọn Region:

```text
Asia Pacific (Singapore)
ap-southeast-1
```

4. Đảm bảo tài khoản và Region phù hợp với đồ án.

<!--
![AWS region verification](/images/5-Workshop/5.11-Clean-up/aws-region.png)
-->

{{% notice note %}}
AWS IAM là dịch vụ có phạm vi toàn cục đối với các IAM Role và Policy thông thường. AWS Billing cũng có phạm vi quản lý tài khoản. Vì vậy, không giới hạn toàn bộ quá trình kiểm kê chỉ trong danh sách tài nguyên của một Region.
{{% /notice %}}

#### 2. Kiểm tra AWS Amplify Hosting

1. Mở [AWS Amplify Console](https://console.aws.amazon.com/amplify/).
2. Tìm ứng dụng Frontend của đồ án.
3. Kiểm tra branch main.
4. Kiểm tra Deployment Status.
5. Ghi lại Website URL.

Địa chỉ đã sử dụng trong Demo:

```text
https://main.d2p96elhe5x6se.amplifyapp.com
```

<!--
![Amplify resource inventory](/images/5-Workshop/5.11-Clean-up/amplify-review.png)
-->

Kiểm tra xem Website còn cần cho việc trình diễn hoặc nộp báo cáo hay không.

#### 3. Kiểm tra Amazon DynamoDB

Mở [Amazon DynamoDB Console](https://console.aws.amazon.com/dynamodb/).

Chọn Tables và kiểm tra năm bảng:

```text
SAP-Activities
SAP-Registrations
SAP-Attendance
SAP-Evidence
SAP-Participation
```

Với mỗi bảng, ghi nhận:

* Table name.
* Trạng thái.
* Billing mode.
* Dung lượng lưu trữ.
* Số lượng item nếu có.
* Cấu hình Backup hoặc Point-in-time recovery nếu có.

<!--
![DynamoDB table inventory](/images/5-Workshop/5.11-Clean-up/dynamodb-review.png)
-->

{{% notice warning %}}
Năm bảng trên là tài nguyên dữ liệu nghiệp vụ chính trong phạm vi AWS Integration. Giữ lại nếu còn sử dụng cho Workshop, Demo hoặc kiểm thử tiếp theo.
{{% /notice %}}

#### 4. Kiểm tra Amazon S3

Mở [Amazon S3 Console](https://console.aws.amazon.com/s3/).

Chọn Bucket:

```text
sap-data-project-2026-huflit01
```

Kiểm tra các Object dưới Prefix:

```text
lambda-demo/input/
lambda-demo/processed/
```

Đồng thời xem các Prefix và Object khác có trong Bucket.

<!--
![S3 resource review](/images/5-Workshop/5.11-Clean-up/s3-review.png)
-->

Không kết luận rằng Bucket chỉ chứa hai file thuộc Lambda Demo.

Cần kiểm tra toàn bộ dữ liệu trước khi quyết định xóa Object hoặc Bucket.

#### 5. Kiểm tra AWS Lambda

Mở [AWS Lambda Console](https://console.aws.amazon.com/lambda/).

Chọn Function:

```text
sap-csv-processor-demo
```

Kiểm tra:

* Function State.
* Runtime.
* Memory.
* Timeout.
* Execution Role.
* Triggers.
* Cấu hình Environment variables.
* Thời điểm cập nhật gần nhất.

<!--
![Lambda resource review](/images/5-Workshop/5.11-Clean-up/lambda-review.png)
-->

Kiểm tra Function còn cần để trình diễn quy trình S3 – Lambda – S3 hay không.

#### 6. Kiểm tra AWS IAM

Mở [AWS IAM Console](https://console.aws.amazon.com/iam/).

Kiểm tra Execution Role:

```text
sap-csv-processor-demo-role-9ui2ib5d
```

Kiểm tra Policy:

```text
SAP-Lambda-S3-Demo-Access
```

Xác định Role đang được Function nào sử dụng.

Nếu một Role hoặc Policy được dùng bởi nhiều tài nguyên, không xóa khi chưa kiểm tra các phụ thuộc.

<!--
![IAM resource review](/images/5-Workshop/5.11-Clean-up/iam-review.png)
-->

#### 7. Kiểm tra Amazon CloudWatch

Mở [Amazon CloudWatch Console](https://console.aws.amazon.com/cloudwatch/).

Truy cập Logs → Log groups.

Tìm:

```text
/aws/lambda/sap-csv-processor-demo
```

Kiểm tra:

* Log Retention.
* Log Streams.
* Lần thực thi gần nhất.
* Dung lượng Log.
* Thông tin lỗi nếu có.

<!--
![CloudWatch resource review](/images/5-Workshop/5.11-Clean-up/cloudwatch-review.png)
-->

Trong bài thực hành trước, Log Retention được cấu hình là 7 ngày.

#### 8. Kiểm tra AWS Billing

Mở [AWS Billing and Cost Management](https://console.aws.amazon.com/costmanagement/).

Kiểm tra:

1. Bills.
2. Cost Explorer.
3. Chi phí theo dịch vụ.
4. Khoảng thời gian cần theo dõi.
5. Các khoản phí đang phát sinh.

<!--
![AWS billing overview](/images/5-Workshop/5.11-Clean-up/billing-overview.png)
-->

Những dịch vụ cần quan tâm:

* AWS Amplify Hosting.
* Amazon DynamoDB.
* Amazon S3.
* AWS Lambda.
* Amazon CloudWatch.

Chi phí phụ thuộc vào mức sử dụng, cấu hình và chính sách giá tại thời điểm kiểm tra.

Không mặc định toàn bộ tài nguyên đều miễn phí.

#### 9. Kiểm tra AWS Cost Explorer

Trong Billing and Cost Management:

1. Chọn Cost Explorer.
2. Chọn khoảng thời gian theo tháng hoặc khoảng thời gian thực hành.
3. Chọn Group by Service.
4. Kiểm tra chi phí của từng dịch vụ.
5. Ghi lại các khoản phí cần theo dõi.

<!--
![AWS cost explorer](/images/5-Workshop/5.11-Clean-up/cost-explorer.png)
-->

Dữ liệu chi phí có thể được cập nhật trễ nên không sử dụng một lần kiểm tra duy nhất để khẳng định không còn phát sinh chi phí.

#### 10. Lập bảng kiểm kê

| Tài nguyên | Đề xuất | Lý do |
| --- | --- | --- |
| Amplify Frontend | Giữ lại | Phục vụ Demo |
| 5 DynamoDB Tables | Giữ lại | Dữ liệu AWS Integration |
| S3 Bucket | Giữ lại | Có thể chứa dữ liệu dự án |
| Lambda Function | Giữ lại nếu còn Demo | CSV Processing |
| IAM Execution Role | Giữ nếu Lambda còn sử dụng | Quyền thực thi |
| CloudWatch Log Group | Giữ theo nhu cầu | Minh chứng và Debug |
| Cloudflare Quick Tunnel | Dừng khi kết thúc Demo | Endpoint tạm thời |
| Local FastAPI | Dừng khi không sử dụng | Backend Demo |

Đây là bảng đề xuất, không phải xác nhận rằng các tài nguyên đã được dọn dẹp.

#### Kết quả

Sau khi hoàn thành phần này, chúng ta đã xác định những tài nguyên AWS cần giữ lại, những tài nguyên thử nghiệm có thể xem xét dọn dẹp và các khoản chi phí cần theo dõi.

[Tiếp theo: Dừng môi trường Demo](../5.11.2-stop-demo/)
