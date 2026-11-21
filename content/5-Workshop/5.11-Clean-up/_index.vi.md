
---
title: "Dọn dẹp tài nguyên AWS"
date: 2026-11-09
weight: 11
chapter: false
pre: "<b>5.11.</b>"
---

## Dọn dẹp tài nguyên AWS

Trong phần cuối của Workshop, chúng ta sẽ kiểm tra, quản lý và dọn dẹp các tài nguyên đã sử dụng trong quá trình xây dựng Student Activity Management & Engagement Analytics Platform.

Khi thực hành trên AWS, những tài nguyên như S3 Bucket, Lambda Function, DynamoDB Table, Amplify App và CloudWatch Log Group có thể tiếp tục tồn tại sau khi kết thúc buổi thực hành.

Việc quản lý vòng đời tài nguyên giúp hạn chế chi phí không cần thiết và đảm bảo tài nguyên được sử dụng đúng mục đích.

### Mục tiêu

Sau khi hoàn thành phần này, bạn sẽ có thể:

* Kiểm kê tài nguyên AWS đã sử dụng.
* Kiểm tra chi phí bằng AWS Billing và Cost Explorer.
* Dừng FastAPI Backend và Cloudflare Quick Tunnel.
* Phân biệt tài nguyên cần giữ lại và tài nguyên có thể dọn dẹp.
* Sao lưu dữ liệu cần thiết trước khi xóa.
* Kiểm tra tài nguyên sau quá trình Clean-up.
* Hoàn thành báo cáo và minh chứng Workshop.

### Các tài nguyên cần kiểm tra

| Dịch vụ | Tài nguyên |
| --- | --- |
| AWS Amplify | React/Vite Frontend Hosting |
| Amazon DynamoDB | 5 bảng dữ liệu SAP |
| Amazon S3 | Bucket lưu trữ dữ liệu dự án |
| AWS Lambda | sap-csv-processor-demo |
| AWS IAM | Execution Role và S3 Access Policy |
| Amazon CloudWatch | Lambda Logs và Metrics |
| Cloudflare | Quick Tunnel |
| Local Environment | FastAPI và SQLite Demo |

### Nguyên tắc Clean-up

Trước khi xóa bất kỳ tài nguyên nào:

1. Xác định tài nguyên còn được sử dụng hay không.
2. Kiểm tra tài nguyên có chứa dữ liệu quan trọng hay không.
3. Kiểm tra các dịch vụ phụ thuộc.
4. Sao lưu dữ liệu cần giữ lại.
5. Chỉ xóa tài nguyên được xác nhận không còn cần thiết.
6. Kiểm tra kết quả sau khi dọn dẹp.

{{% notice warning %}}
Không xóa các bảng SAP-Activities, SAP-Registrations, SAP-Attendance, SAP-Evidence hoặc SAP-Participation nếu chúng vẫn được dùng trong Demo hoặc kiểm thử tích hợp AWS.

Không xóa S3 Bucket chứa dữ liệu dự án khi chưa kiểm tra toàn bộ Object bên trong.
{{% /notice %}}

### Nội dung

1. [Kiểm kê tài nguyên và chi phí](5.11.1-review-resources/)
2. [Dừng môi trường Demo](5.11.2-stop-demo/)
3. [Dọn dẹp tài nguyên thử nghiệm AWS](5.11.3-clean-aws/)
4. [Xác minh và tổng kết Workshop](5.11.4-verify-cleanup/)

### Kết quả mong đợi

Sau khi hoàn thành, những tiến trình Demo không cần thiết sẽ được dừng, các tài nguyên AWS được rà soát và những dữ liệu quan trọng vẫn được bảo toàn.

Đối với tài nguyên cần tiếp tục sử dụng, người thực hiện ghi nhận trạng thái giữ lại để phục vụ Demo, bảo trì hoặc phát triển đồ án.

Clean-up không bắt buộc phải xóa toàn bộ môi trường AWS. Mục tiêu chính là quản lý tài nguyên an toàn và có kiểm soát.
