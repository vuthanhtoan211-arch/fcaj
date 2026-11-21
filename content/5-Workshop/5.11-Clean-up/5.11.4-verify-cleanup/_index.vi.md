
---
title: "Xác minh và tổng kết Workshop"
date: 2026-11-09
weight: 4
chapter: false
pre: "<b>5.11.4.</b>"
---

## Xác minh và tổng kết Workshop

Trong phần cuối cùng, chúng ta sẽ kiểm tra kết quả quản lý tài nguyên và tổng kết những kiến thức đã áp dụng trong Workshop Student Activity Management & Engagement Analytics Platform.

Mục tiêu là xác định môi trường Demo đã được dừng đúng cách, tài nguyên cần thiết vẫn được bảo toàn và những minh chứng thực hành đã được chuẩn bị đầy đủ.

#### 1. Kiểm tra trạng thái môi trường local

Mở PowerShell và kiểm tra port 8001:

```powershell
Get-NetTCPConnection -LocalPort 8001 -State Listen -ErrorAction SilentlyContinue
```

Kiểm tra:

* FastAPI Demo đã dừng nếu không còn sử dụng.
* Cloudflare Quick Tunnel đã dừng.
* Vite Development Server đã dừng nếu không cần.
* Source code vẫn được lưu trữ.
* SQLite Demo được bảo toàn nếu còn cần.

<!--
![Local cleanup verification](/images/5-Workshop/5.11-Clean-up/local-verification.png)
-->

Nếu Backend vẫn cần cho một buổi Demo khác, ghi nhận trạng thái đang sử dụng thay vì dừng bắt buộc.

#### 2. Kiểm tra AWS Amplify

Mở AWS Amplify Console.

Kiểm tra:

* Amplify App vẫn tồn tại nếu cần sử dụng.
* Branch main vẫn được triển khai.
* Build History vẫn có thể truy cập.
* Website URL được ghi lại trong tài liệu.
* Cấu hình kết nối Backend được ghi chú là URL tạm thời.

<!--
![Amplify final verification](/images/5-Workshop/5.11-Clean-up/amplify-final.png)
-->

Nếu Tunnel đã dừng, Frontend có thể vẫn tải được nhưng các thao tác cần Backend không hoạt động.

Đây là hành vi phù hợp với kiến trúc Demo hiện tại.

#### 3. Kiểm tra Amazon DynamoDB

Mở DynamoDB Console tại Region ap-southeast-1.

Đảm bảo năm bảng được giữ lại nếu còn cần:

```text
SAP-Activities
SAP-Registrations
SAP-Attendance
SAP-Evidence
SAP-Participation
```

<!--
![DynamoDB final verification](/images/5-Workshop/5.11-Clean-up/dynamodb-final.png)
-->

Kiểm tra trạng thái từng bảng và các bản sao lưu quan trọng.

Không cần xóa dữ liệu Demo nếu dữ liệu đó vẫn được sử dụng trong báo cáo thực tập.

#### 4. Kiểm tra Amazon S3

Mở S3 Console và chọn:

```text
sap-data-project-2026-huflit01
```

Kiểm tra dữ liệu cần lưu.

Nếu tiếp tục sử dụng Lambda Demo, giữ lại các Object:

```text
lambda-demo/input/registrations.csv
lambda-demo/processed/registrations-result.json
```

<!--
![S3 final verification](/images/5-Workshop/5.11-Clean-up/s3-final.png)
-->

Xác nhận không có dữ liệu quan trọng bị xóa nhầm.

#### 5. Kiểm tra AWS Lambda và IAM

Nếu Function còn được giữ:

```text
sap-csv-processor-demo
```

Kiểm tra:

* Function tồn tại.
* Execution Role được cấu hình đúng.
* IAM Policy còn được gắn.
* Function không bị thay đổi ngoài ý muốn.
* Test Event vẫn có thể sử dụng khi cần thực hành lại.

<!--
![Lambda final verification](/images/5-Workshop/5.11-Clean-up/lambda-final.png)
-->

Không cần thực thi Lambda thêm một lần nếu chỉ muốn xác minh cấu hình và tài nguyên.

#### 6. Kiểm tra Amazon CloudWatch

Kiểm tra Log Group:

```text
/aws/lambda/sap-csv-processor-demo
```

Nếu giữ lại:

* Xác nhận Log Retention phù hợp.
* Kiểm tra Log Events cần dùng làm minh chứng.
* Lưu ảnh chụp kết quả trước khi Log hết hạn.

<!--
![CloudWatch final verification](/images/5-Workshop/5.11-Clean-up/cloudwatch-final.png)
-->

Trong bài thực hành, Retention là 7 ngày. Các Log cũ có thể không còn tồn tại khi kiểm tra vào thời điểm khác.

#### 7. Kiểm tra kết quả Billing

Mở AWS Billing and Cost Management.

Kiểm tra:

* Chi phí theo dịch vụ.
* Tài nguyên còn được giữ lại.
* Khoảng thời gian đang xem.
* Những khoản phí cần tiếp tục theo dõi.

<!--
![Final billing review](/images/5-Workshop/5.11-Clean-up/billing-final.png)
-->

Không khẳng định tài khoản không phát sinh chi phí chỉ vì đã dừng môi trường local.

#### 8. Tổng hợp các dịch vụ AWS đã sử dụng

Trong phạm vi đồ án và Workshop, chúng ta đã thực hành sáu dịch vụ AWS chính.

| Dịch vụ | Vai trò trong đồ án |
| --- | --- |
| AWS Amplify Hosting | Triển khai Frontend React/Vite |
| Amazon DynamoDB | Kiểm thử lưu trữ dữ liệu nghiệp vụ |
| Amazon S3 | Lưu trữ dữ liệu CSV/JSON |
| AWS Lambda | Xử lý CSV theo mô hình Serverless |
| AWS IAM | Quản lý quyền truy cập tài nguyên |
| Amazon CloudWatch | Giám sát và ghi nhật ký Lambda |

Các thành phần bổ trợ:

* FastAPI Backend.
* React/Vite Frontend.
* SQLite Local Persistence.
* Cloudflare Quick Tunnel.
* GitHub.
* Python và boto3.

#### 9. Tổng kết các chức năng đã xây dựng

Workshop đã trình bày các nhóm chức năng:

1. Quản lý hoạt động sinh viên.
2. Đăng nhập và phân quyền ADMIN/STUDENT.
3. Nhập danh sách đăng ký CSV/XLSX.
4. Ghi nhận Check-in/Check-out theo thời gian thực.
5. Nhập minh chứng từ Google Forms/Google Sheets.
6. Đối soát Registration, Attendance và Evidence.
7. Xác nhận kết quả Participation.
8. Analytics Dashboard.
9. Export báo cáo.
10. Triển khai Frontend và kết nối Backend Demo.
11. Xử lý CSV bằng AWS Lambda và Amazon S3.

Các chức năng được triển khai và kiểm thử ở những phạm vi khác nhau. Không xem toàn bộ hệ thống đã chuyển sang Production trên AWS.

#### 10. Tổng kết kết quả kiểm thử

| Hạng mục | Phạm vi đã ghi nhận |
| --- | --- |
| Frontend Deployment | Amplify Hosting |
| Backend Connectivity | Cloudflare Quick Tunnel |
| ADMIN/STUDENT Login | Đã kiểm thử |
| Activity Creation | Đã kiểm thử trên môi trường Demo |
| DynamoDB Integration | AWS Pilot |
| S3 CSV Processing | Lambda Test Event |
| CSV Processing Result | 4 bản ghi: 2 hợp lệ, 1 trùng, 1 lỗi |
| Output Storage | S3 JSON Object |
| Monitoring | CloudWatch Logs |

Các kết quả này phản ánh phạm vi kiểm thử đã ghi nhận trong quá trình phát triển đồ án.

Chưa có minh chứng đầy đủ về Load Testing, triển khai Backend Production hay kiểm thử hệ thống với số lượng người dùng đồng thời lớn.

#### 11. Đánh giá kết quả học tập

Thông qua Workshop, người học có thể thực hành:

* Thiết kế kiến trúc ứng dụng Web kết hợp Cloud.
* Phát triển REST API bằng Python/FastAPI.
* Xây dựng giao diện với React/Vite.
* Tổ chức và xử lý dữ liệu sinh viên.
* Tích hợp Amazon DynamoDB.
* Triển khai Frontend bằng AWS Amplify Hosting.
* Xây dựng Lambda Function xử lý dữ liệu.
* Quản lý quyền truy cập bằng IAM.
* Theo dõi nhật ký với CloudWatch.
* Quản lý chi phí và vòng đời tài nguyên AWS.

Đây là những kỹ năng nền tảng trong định hướng Cloud Computing và Data Engineering.

#### 12. Hướng phát triển tiếp theo

Một số hướng mở rộng của đồ án:

* Triển khai FastAPI Backend trên Cloud với Endpoint ổn định.
* Hoàn thiện việc sử dụng DynamoDB cho các nghiệp vụ cần thiết.
* Tích hợp tự động giữa Amazon S3 và AWS Lambda.
* Hoàn thiện hệ thống giám sát và cảnh báo.
* Tăng cường bảo mật và quản lý Secret.
* Kiểm thử hiệu năng và tải đồng thời.
* Bổ sung quy trình triển khai tự động.
* Hoàn thiện tài liệu vận hành và phục hồi dữ liệu.

Các nội dung trên là định hướng phát triển, không phải thành phần đã hoàn thành trong phiên bản Demo hiện tại.

#### 13. Bảng kiểm tra hoàn thành Workshop

| Nội dung | Trạng thái cần xác nhận |
| --- | --- |
| Source code được lưu trữ | Kiểm tra |
| Tài liệu Workshop hoàn chỉnh | Kiểm tra |
| Ảnh minh chứng đã chuẩn bị | Kiểm tra |
| Môi trường Demo được dừng phù hợp | Kiểm tra |
| Tài nguyên AWS được kiểm kê | Kiểm tra |
| Dữ liệu cần thiết được bảo toàn | Kiểm tra |
| Chi phí AWS được rà soát | Kiểm tra |
| Tài nguyên thử nghiệm được quản lý | Kiểm tra |

Người thực hiện cần cập nhật trạng thái thực tế sau khi hoàn thành từng bước.

#### Kết luận

Workshop Student Activity Management & Engagement Analytics Platform đã cung cấp một quy trình thực hành từ phát triển ứng dụng Web đến tích hợp dịch vụ AWS.

Thông qua các dịch vụ Amplify Hosting, DynamoDB, S3, Lambda, IAM và CloudWatch, người học có cơ hội tìm hiểu cách triển khai, lưu trữ, xử lý và giám sát dữ liệu trong môi trường Cloud.

Quá trình kết hợp Registration, Attendance, Evidence, Reconciliation và Participation cho thấy cách xây dựng một hệ thống xử lý dữ liệu phục vụ bài toán thực tế trong môi trường giáo dục.

Việc quản lý và dọn dẹp tài nguyên ở cuối Workshop giúp đảm bảo quá trình thực hành được kết thúc an toàn, hạn chế chi phí không cần thiết và bảo toàn dữ liệu quan trọng.

**Workshop Completed – Student Activity Management & Engagement Analytics Platform.**
