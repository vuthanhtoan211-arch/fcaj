
---
title: "Xác minh dữ liệu trên AWS Console"
date: 2026-11-09
weight: 4
chapter: false
pre: "<b>5.4.4.</b>"
---

## Xác minh dữ liệu trên AWS Console

Trong phần này, chúng ta sẽ sử dụng AWS Management Console để kiểm tra dữ liệu đã được lưu trữ trong các bảng Amazon DynamoDB của hệ thống Student Activity Management & Engagement Analytics Platform.

Mục tiêu là đối chiếu dữ liệu giữa Backend FastAPI, môi trường SQLite local và Amazon DynamoDB.

#### 1. Mở Amazon DynamoDB Console

1. Truy cập [Amazon DynamoDB Console](https://console.aws.amazon.com/dynamodb/).

2. Chọn AWS Region:

```text
Asia Pacific (Singapore)
ap-southeast-1
```

3. Trong thanh điều hướng, chọn **Tables**.

4. Kiểm tra năm bảng của đồ án.

<!--
![DynamoDB Tables](/images/5-Workshop/5.4-DynamoDB/dynamodb-tables.png)
-->

Đảm bảo các bảng có trạng thái ACTIVE.

#### 2. Xác minh dữ liệu Activities

1. Chọn bảng **SAP-Activities**.

2. Chọn **Explore table items**.

3. Chuyển sang chế độ Query nếu cần tìm theo Partition Key.

4. Nhập Activity ID được tạo trong phần 5.4.3 vào trường activity_id.

5. Chạy truy vấn.

<!--
![Explore Activities Table](/images/5-Workshop/5.4-DynamoDB/explore-activities.png)
-->

Trong đợt kiểm thử AWS trước đây, đồ án đã tạo Activity thử nghiệm với mã:

```text
ACT#AWSTEST-9198ABC48900
```

Activity ID trên là minh chứng lịch sử của quá trình tích hợp. Đối với workshop mới, sử dụng Activity ID do API trả về tại phần trước.

Kiểm tra:

* Activity ID.
* Tên hoạt động.
* Địa điểm.
* Thông tin thời gian.
* Trạng thái hoạt động.

Đối chiếu các thông tin với Response của Backend.

<!--
![Activity Item Details](/images/5-Workshop/5.4-DynamoDB/activity-item.png)
-->

Nếu dữ liệu trùng khớp, thao tác lưu trữ Activity trên DynamoDB đã được xác minh.

#### 3. Xác minh dữ liệu Registrations

1. Quay lại danh sách Tables.

2. Chọn **SAP-Registrations**.

3. Chọn **Explore table items**.

4. Chọn Query.

5. Nhập activity_id của hoạt động cần kiểm tra.

6. Thực hiện truy vấn.

<!--
![Registration Items](/images/5-Workshop/5.4-DynamoDB/registration-items.png)
-->

Kiểm tra các bản ghi:

* activity_id.
* mssv.
* Thông tin đăng ký.
* Các thuộc tính nghiệp vụ được lưu theo repository hiện tại.

Đối chiếu số lượng sinh viên đăng ký với dữ liệu đã nhập từ CSV/XLSX.

Mỗi sinh viên trong một hoạt động được xác định bởi cặp khóa activity_id và mssv.

#### 4. Xác minh dữ liệu Attendance

1. Chọn bảng **SAP-Attendance**.

2. Chọn **Explore table items**.

3. Sử dụng Query để tìm dữ liệu theo activity_id.

4. Chọn item của sinh viên thử nghiệm.

<!--
![Attendance Items](/images/5-Workshop/5.4-DynamoDB/attendance-items.png)
-->

Kiểm tra dữ liệu Check-in và Check-out được ghi nhận thông qua API.

Đối chiếu:

* MSSV có đúng sinh viên đã điểm danh không.
* Activity ID có đúng hoạt động không.
* Thời gian Check-in/Check-out có phù hợp không.
* Trạng thái điểm danh có nhất quán với Backend không.

Cần chú ý múi giờ được sử dụng khi hiển thị thời gian. Hệ thống sử dụng múi giờ Asia/Ho_Chi_Minh cho nghiệp vụ điểm danh, trong khi dữ liệu lưu trữ có thể được biểu diễn theo định dạng thời gian khác.

{{% notice note %}}
Attendance là dữ liệu được ghi nhận theo thời gian thực. Không cần tạo file Check-in hoặc Check-out để nhập lại sau hoạt động.
{{% /notice %}}

#### 5. Xác minh dữ liệu Evidence

1. Chọn bảng **SAP-Evidence**.

2. Chọn **Explore table items**.

3. Truy vấn theo activity_id.

4. Kiểm tra các item có Sort Key mssv.

<!--
![Evidence Items](/images/5-Workshop/5.4-DynamoDB/evidence-items.png)
-->

Đối chiếu dữ liệu với file minh chứng đã được nhập vào Backend.

Trong quá trình kiểm thử AWS Pilot của đồ án ngày 06/11/2026, dữ liệu minh chứng thử nghiệm đã được kiểm tra trên DynamoDB với ba bản ghi.

Kết quả này minh họa khả năng lưu trữ dữ liệu Evidence theo Activity ID và MSSV.

Khi thực hiện workshop, số lượng bản ghi cần được xác định theo bộ dữ liệu đầu vào thực tế.

#### 6. Xác minh dữ liệu Participation

1. Chọn bảng **SAP-Participation**.

2. Chọn **Explore table items**.

3. Chọn Query.

4. Nhập activity_id của hoạt động đã thực hiện đối soát.

5. Kiểm tra các item được trả về.

<!--
![Participation Items](/images/5-Workshop/5.4-DynamoDB/participation-items.png)
-->

Các thuộc tính cần đối chiếu bao gồm:

* activity_id.
* mssv.
* Trạng thái điểm danh.
* Trạng thái minh chứng.
* Kết quả đối soát.
* Trạng thái xác nhận tham gia.

Trong bài kiểm thử AWS Pilot trước đây, SAP-Participation đã được truy vấn với ba bản ghi thử nghiệm.

Một số bản ghi thể hiện thông tin như:

```text
NO_ATTENDANCE
REJECTED
evidence_status: YES
```

Điều này cho thấy một sinh viên có thể có minh chứng tham gia nhưng vẫn thiếu dữ liệu điểm danh, dẫn đến kết quả không được xác nhận theo quy tắc nghiệp vụ hoặc quyết định của ADMIN.

Không mặc định rằng chỉ có minh chứng là đủ điều kiện xác nhận tham gia.

<!--
![Participation Item Detail](/images/5-Workshop/5.4-DynamoDB/participation-detail.png)
-->

#### 7. Kiểm tra dữ liệu bằng AWS CLI

Ngoài AWS Console, chúng ta có thể sử dụng AWS CLI để truy xuất một Activity từ SAP-Activities.

Thực hiện:

```powershell
aws dynamodb get-item `
  --table-name SAP-Activities `
  --key '{"activity_id":{"S":"ACT#AWSTEST-9198ABC48900"}}' `
  --consistent-read `
  --region ap-southeast-1 `
  --profile sap-dev
```

Thay Activity ID bằng mã hoạt động thực tế cần kiểm tra.

Nếu item tồn tại, Response sẽ chứa trường Item và các thuộc tính tương ứng.

Để kiểm tra dữ liệu Evidence theo hoạt động:

```powershell
aws dynamodb query `
  --table-name SAP-Evidence `
  --key-condition-expression "activity_id = :aid" `
  --expression-attribute-values '{":aid":{"S":"ACT#AWSTEST-9198ABC48900"}}' `
  --consistent-read `
  --region ap-southeast-1 `
  --profile sap-dev
```

Có thể thay SAP-Evidence bằng SAP-Registrations, SAP-Attendance hoặc SAP-Participation để kiểm tra các nhóm dữ liệu khác.

Sử dụng Activity ID có dữ liệu tương ứng trong từng bảng.

<!--
![AWS CLI Verification](/images/5-Workshop/5.4-DynamoDB/cli-verification.png)
-->

#### 8. Đối chiếu SQLite và DynamoDB

Trong phiên bản Demo, SQLite vẫn hỗ trợ lưu trữ và khôi phục trạng thái ứng dụng.

Để kiểm tra tính nhất quán của dữ liệu:

1. Chọn một Activity Demo.
2. Xác định Activity ID.
3. Kiểm tra dữ liệu bằng REST API.
4. Kiểm tra dữ liệu local thuộc cơ chế SQLite Persistence.
5. Truy vấn dữ liệu tương ứng trên DynamoDB.
6. So sánh số lượng và các thuộc tính nghiệp vụ.

Bảng kiểm tra:

| Dữ liệu | Backend/SQLite | DynamoDB |
| --- | --- | --- |
| Activities | Kiểm tra Activity ID và trạng thái | SAP-Activities |
| Registrations | Kiểm tra danh sách đăng ký | SAP-Registrations |
| Attendance | Kiểm tra Check-in/Check-out | SAP-Attendance |
| Evidence | Kiểm tra minh chứng | SAP-Evidence |
| Participation | Kiểm tra kết quả xác nhận | SAP-Participation |

Trong lịch sử kiểm thử của đồ án, dữ liệu Evidence và Participation đã được đối chiếu với các bản ghi local.

Tuy nhiên, sự trùng khớp của các bộ dữ liệu thử nghiệm không đồng nghĩa với việc hệ thống đã chuyển hoàn toàn sang DynamoDB hoặc có cơ chế đồng bộ hai chiều tự động cho mọi nghiệp vụ.

#### 9. Xử lý các lỗi thường gặp

| Lỗi | Nguyên nhân cần kiểm tra |
| --- | --- |
| ResourceNotFoundException | Sai Region hoặc tên bảng |
| AccessDeniedException | IAM Identity không có quyền cần thiết |
| ValidationException | Key Schema hoặc kiểu dữ liệu không phù hợp |
| Không tìm thấy item | Sai Activity ID hoặc chưa ghi dữ liệu lên DynamoDB |
| API thành công nhưng DynamoDB trống | API có thể đang sử dụng SQLite hoặc chưa bật AWS Pilot |
| Số lượng bản ghi không khớp | Kiểm tra dữ liệu đầu vào, bộ lọc và quá trình xử lý |

#### 10. Kết quả hoàn thành

Sau khi hoàn thành phần này, chúng ta đã:

* Kiểm tra trạng thái năm bảng DynamoDB.
* Xác minh dữ liệu Activities.
* Kiểm tra dữ liệu Registrations.
* Kiểm tra dữ liệu Attendance.
* Kiểm tra dữ liệu Evidence.
* Kiểm tra dữ liệu Participation.
* Sử dụng AWS Console và AWS CLI để truy xuất dữ liệu.
* Đối chiếu dữ liệu Cloud với dữ liệu nghiệp vụ của Backend.

<!--
![DynamoDB Integration Complete](/images/5-Workshop/5.4-DynamoDB/integration-complete.png)
-->

#### Kết luận

Amazon DynamoDB giúp đồ án tiếp cận cơ chế lưu trữ dữ liệu NoSQL trên nền tảng AWS.

Thông qua phần này, chúng ta đã tìm hiểu quy trình thiết kế bảng, cấu hình boto3, tích hợp Backend, kiểm thử đọc và ghi dữ liệu, đồng thời xác minh kết quả trên AWS Management Console.

Việc tích hợp DynamoDB là một bước quan trọng trong quá trình phát triển Student Activity Management & Engagement Analytics Platform từ môi trường local đến kiến trúc Cloud.

SQLite vẫn được sử dụng trong phạm vi Demo hiện tại, trong khi DynamoDB đảm nhiệm các luồng lưu trữ Cloud đã được tích hợp và kiểm thử.

Ở phần tiếp theo, chúng ta sẽ xây dựng và cấu hình Frontend React/Vite để kết nối với Backend FastAPI.

[Tiếp theo: Xây dựng Frontend React/Vite](../../5.5-Frontend/)
