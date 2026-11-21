
---
title: "Xác nhận kết quả tham gia"
date: 2026-11-09
weight: 3
chapter: false
pre: "<b>5.7.3.</b>"
---

## Xác nhận kết quả tham gia

Trong phần này, chúng ta sẽ thực hiện xác nhận kết quả tham gia của sinh viên dựa trên dữ liệu đã được đối soát.

Sau khi kết hợp Registration, Attendance và Evidence, ADMIN cần kiểm tra các điều kiện nghiệp vụ để xác định sinh viên có được công nhận tham gia hoạt động hay không.

Kết quả xác nhận được lưu trong nhóm dữ liệu Participation và sử dụng cho Analytics Dashboard, lịch sử hoạt động của sinh viên và các báo cáo tổng hợp.

#### 1. Phân biệt Reconciliation và Participation

**Reconciliation**

Là quá trình kiểm tra và đối chiếu dữ liệu từ các nguồn:

* Registration.
* Attendance.
* Evidence.

Kết quả đối soát giúp xác định các trường hợp đầy đủ hoặc thiếu dữ liệu.

**Participation Confirmation**

Là quá trình xác nhận kết quả tham gia dựa trên quy tắc nghiệp vụ và quyết định của ADMIN.

Các trạng thái kết quả trong đồ án bao gồm:

* CONFIRMED: Sinh viên được xác nhận tham gia.
* REJECTED: Sinh viên không được xác nhận tham gia.

Trước khi có quyết định cuối cùng, bản ghi có thể ở trạng thái chưa xác nhận theo cơ chế hiện tại của hệ thống.

{{% notice note %}}
Có dữ liệu đối soát không đồng nghĩa với việc Participation đã được xác nhận. Cần kiểm tra trạng thái xác nhận thực tế được lưu bởi Backend.
{{% /notice %}}

#### 2. Chuẩn bị dữ liệu và môi trường

Đảm bảo đã hoàn thành:

* Phần 5.6 - Quản lý đăng ký và điểm danh.
* Phần 5.7.1 - Nhập minh chứng tham gia.
* Phần 5.7.2 - Đối soát dữ liệu sinh viên.

Các thành phần cần hoạt động:

* FastAPI Backend.
* React/Vite Frontend.
* Tài khoản ADMIN Demo.
* Hoạt động có kết quả đối soát.

Sử dụng cùng Activity ID đã thực hành ở các phần trước.

#### 3. Tìm hiểu luồng xác nhận

```text
Reconciliation Result
          |
          v
      ADMIN Review
          |
          v
Validate Activity Requirements
          |
          v
Participation Decision
          |
          +-- CONFIRMED
          |
          +-- REJECTED
          |
          v
FastAPI Participation Processing
          |
          v
Store Participation Result
          |
          v
Analytics / Student History / Export
```

Backend kiểm tra quyền ADMIN, hoạt động, sinh viên và dữ liệu nghiệp vụ trước khi lưu kết quả xác nhận.

#### 4. Mở giao diện xác nhận tham gia

1. Mở Web Application.
2. Đăng nhập bằng tài khoản ADMIN.
3. Chọn hoạt động đã thực hiện đối soát.
4. Mở chức năng Reconciliation hoặc Participation.
5. Kiểm tra danh sách sinh viên và kết quả đối soát.

<!--
![Participation management interface](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-interface.png)
-->

Kiểm tra các thông tin của từng sinh viên:

* MSSV.
* Họ và tên nếu được hiển thị.
* Trạng thái đăng ký.
* Dữ liệu Check-in.
* Dữ liệu Check-out.
* Trạng thái minh chứng.
* Kết quả đối soát.
* Trạng thái xác nhận hiện tại.

#### 5. Xem xét điều kiện xác nhận

Sử dụng bộ dữ liệu giả lập từ phần 5.7.2:

| MSSV | Check-in | Check-out | Evidence |
| --- | --- | --- | --- |
| 0818000001 | Có | Có | Có |
| 0818000002 | Có | Không | Có |
| 0818000003 | Không | Không | Có |
| 0818000004 | Có | Có | Không |

Trong bài thực hành minh họa, giả sử hoạt động yêu cầu sinh viên phải đăng ký, có đầy đủ Check-in/Check-out và minh chứng hợp lệ.

Theo giả định này:

* Sinh viên 0818000001 có đầy đủ dữ liệu để xem xét xác nhận.
* Sinh viên 0818000002 cần kiểm tra trường hợp thiếu Check-out.
* Sinh viên 0818000003 không có dữ liệu Attendance.
* Sinh viên 0818000004 cần kiểm tra yêu cầu minh chứng.

Đây là quy tắc giả định phục vụ Workshop. Điều kiện xác nhận thực tế phải tuân theo cấu hình và quy định của hoạt động.

#### 6. Thực hiện xác nhận CONFIRMED

Chọn sinh viên Demo có đầy đủ dữ liệu:

```text
MSSV: 0818000001
```

Thực hiện:

1. Mở chi tiết kết quả đối soát của sinh viên.
2. Kiểm tra Registration, Attendance và Evidence.
3. Chọn chức năng xác nhận tham gia.
4. Kiểm tra thông tin trước khi lưu.
5. Xác nhận thao tác.

<!--
![Confirm student participation](/images/5-Workshop/5.7-Evidence-Reconciliation/confirm-participation.png)
-->

Frontend gửi yêu cầu xác nhận đến FastAPI.

Backend kiểm tra quyền và điều kiện nghiệp vụ, sau đó lưu kết quả nếu thao tác hợp lệ.

Kết quả mong đợi:

```text
Student ID: 0818000001
Participation Status: CONFIRMED
```

<!--
![Confirmed participation result](/images/5-Workshop/5.7-Evidence-Reconciliation/confirmed-result.png)
-->

Kiểm tra lại trạng thái sau khi tải lại dữ liệu từ Backend.

#### 7. Thực hiện xác nhận REJECTED

Chọn sinh viên Demo không đáp ứng điều kiện tham gia trong ví dụ:

```text
MSSV: 0818000003
```

Sinh viên này có minh chứng nhưng không có Check-in và Check-out.

Thực hiện:

1. Kiểm tra kết quả đối soát.
2. Xác định lý do không đủ điều kiện.
3. Chọn chức năng từ chối xác nhận.
4. Nhập lý do nếu giao diện và API hỗ trợ.
5. Lưu kết quả.

<!--
![Reject student participation](/images/5-Workshop/5.7-Evidence-Reconciliation/reject-participation.png)
-->

Kết quả mong đợi:

```text
Student ID: 0818000003
Participation Status: REJECTED
```

<!--
![Rejected participation result](/images/5-Workshop/5.7-Evidence-Reconciliation/rejected-result.png)
-->

Trong lịch sử kiểm thử AWS Pilot của đồ án, đã có những bản ghi thể hiện thông tin NO_ATTENDANCE, REJECTED và evidence_status: YES.

Điều này minh họa rằng có minh chứng không đồng nghĩa với việc sinh viên đã đáp ứng điều kiện điểm danh.

#### 8. Kiểm tra các trường hợp cần xem xét

Không phải mọi bản ghi thiếu dữ liệu đều cần bị từ chối ngay lập tức.

Ví dụ:

* Sinh viên thiếu Check-out do cần kiểm tra lại dữ liệu.
* Sinh viên chưa nộp minh chứng tại thời điểm đối soát.
* Dữ liệu Registration chưa được cập nhật đầy đủ.
* Minh chứng đã nhập nhưng chưa được xem xét.

ADMIN cần kiểm tra theo quy định của hoạt động trước khi đưa ra quyết định.

Nếu dữ liệu nguồn được cập nhật hợp lệ, thực hiện đối soát lại theo chức năng của hệ thống.

Nếu cần thay đổi một kết quả đã xác nhận, sử dụng quy trình cập nhật mà Backend hỗ trợ, không tự ý sửa trực tiếp dữ liệu trong SQLite hoặc DynamoDB.

#### 9. Kiểm tra REST API xác nhận

Mở Developer Tools bằng phím F12.

1. Chọn tab Network.
2. Chọn Fetch/XHR.
3. Thực hiện xác nhận một bản ghi Demo.
4. Kiểm tra Request tương ứng.
5. Kiểm tra Activity ID, MSSV và trạng thái xác nhận.
6. Kiểm tra HTTP Status Code và Response.

<!--
![Participation confirmation API](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-api.png)
-->

Mở Swagger UI để xác định chính xác Endpoint xác nhận trong nhóm Participation:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

Ví dụ cấu trúc dữ liệu nghiệp vụ:

```json
{
    "activity_id": "ACT-DEMO-001",
    "mssv": "0818000001",
    "participation_status": "CONFIRMED"
}
```

Đây là mô hình dữ liệu minh họa. Không sử dụng trực tiếp như Request Body nếu chưa đối chiếu với API Schema thực tế.

#### 10. Kiểm tra phân quyền xác nhận

Hệ thống chỉ sử dụng hai Role:

* ADMIN.
* STUDENT.

ADMIN thực hiện kiểm tra và xác nhận kết quả tham gia.

STUDENT chỉ có thể truy cập thông tin tham gia của bản thân trong phạm vi được cấp quyền.

Kiểm thử:

1. Đăng nhập bằng tài khoản STUDENT Demo.
2. Kiểm tra giao diện không cung cấp chức năng xác nhận quản trị.
3. Sử dụng Access Token của STUDENT để kiểm thử Endpoint xác nhận đã xác định trong Swagger UI.
4. Kiểm tra Backend từ chối thao tác trái quyền.

Kết quả mong đợi là HTTP 403 Forbidden đối với tài khoản đã xác thực nhưng không đủ quyền.

<!--
![Participation authorization test](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-authorization.png)
-->

#### 11. Kiểm tra kết quả sau khi xác nhận

Quay lại danh sách Participation của hoạt động.

Kiểm tra:

* Trạng thái CONFIRMED được lưu đúng sinh viên.
* Trạng thái REJECTED được lưu đúng sinh viên.
* Kết quả của sinh viên khác không bị thay đổi.
* Activity ID không bị sai lệch.
* Các bản ghi điểm danh và minh chứng vẫn được giữ đúng dữ liệu nguồn.

Ví dụ:

| MSSV | Participation Status |
| --- | --- |
| 0818000001 | CONFIRMED |
| 0818000003 | REJECTED |

<!--
![Participation results list](/images/5-Workshop/5.7-Evidence-Reconciliation/participation-results.png)
-->

Không mặc định các sinh viên còn lại đã được xác nhận nếu chưa có quyết định tương ứng.

#### 12. Tổng hợp kết quả kiểm thử

| Test Case | Kết quả mong đợi |
| --- | --- |
| Xác nhận bản ghi đủ điều kiện | Lưu CONFIRMED |
| Từ chối bản ghi không đủ điều kiện | Lưu REJECTED |
| Sai Activity ID | Không cập nhật hoạt động khác |
| MSSV không hợp lệ | Không cập nhật sai sinh viên |
| STUDENT thực hiện xác nhận | Bị từ chối nếu không đủ quyền |
| Tải lại trang | Hiển thị kết quả đã lưu |
| Cập nhật dữ liệu nguồn | Xử lý theo quy trình đối soát hiện tại |

#### Kết luận

Trong phần này, chúng ta đã thực hành xác nhận và từ chối kết quả tham gia bằng quyền ADMIN.

Participation là kết quả nghiệp vụ được xây dựng dựa trên dữ liệu đối soát, không phải chỉ là trạng thái đăng ký hoặc điểm danh.

Kết quả này sẽ được sử dụng cho lịch sử hoạt động, Analytics Dashboard và Export.

Việc xác nhận Participation trong đồ án không đồng nghĩa với việc tự động cập nhật điểm rèn luyện trên University Portal của trường.

[Tiếp theo: Xác minh kết quả tham gia](../5.7.4-verify-participation/)
