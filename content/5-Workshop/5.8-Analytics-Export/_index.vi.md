
---
title: "Xây dựng Analytics Dashboard và Export"
date: 2026-11-09
weight: 8
chapter: false
pre: "<b>5.8.</b>"
---

## Xây dựng Analytics Dashboard và Export

Trong phần này, chúng ta sẽ xây dựng và tìm hiểu chức năng phân tích dữ liệu, hiển thị Dashboard và xuất báo cáo của hệ thống Student Activity Management & Engagement Analytics Platform.

Sau khi hoàn thành quá trình quản lý đăng ký, điểm danh, nhập minh chứng và đối soát, hệ thống đã có các nhóm dữ liệu nghiệp vụ cần thiết để phân tích mức độ tham gia hoạt động của sinh viên.

Trong thực tế, Ban Tổ chức cần biết số lượng sinh viên đăng ký, số lượng sinh viên thực tế tham gia, số sinh viên hoàn thành điểm danh và kết quả xác nhận tham gia của từng hoạt động.

Nếu tổng hợp thủ công bằng nhiều file Excel, quá trình thống kê có thể mất nhiều thời gian và khó đảm bảo tính nhất quán giữa các báo cáo.

Analytics Dashboard được xây dựng nhằm hỗ trợ ADMIN theo dõi các chỉ số quan trọng, kiểm tra kết quả hoạt động và sử dụng dữ liệu phục vụ công tác quản lý.

#### Nguồn dữ liệu phân tích

Hệ thống sử dụng các nhóm dữ liệu sau:

* **Activities:** Thông tin các hoạt động được tổ chức.
* **Registrations:** Danh sách sinh viên đăng ký tham gia.
* **Attendance:** Dữ liệu Check-in và Check-out được ghi nhận theo thời gian thực.
* **Evidence:** Dữ liệu minh chứng tham gia được nhập từ CSV/XLSX.
* **Participation:** Kết quả đối soát và xác nhận tham gia của sinh viên.

Các nhóm dữ liệu được liên kết theo Activity ID và MSSV để hỗ trợ tính toán chỉ số chính xác.

#### Kiến trúc Analytics và Export

```text
Registration Data
        +
Attendance Data
        +
Evidence Data
        +
Participation Results
        |
        v
Python / FastAPI Backend
        |
        v
Data Aggregation & Analytics
        |
        +----------------------+
        |                      |
        v                      v
REST API Response        Report Generation
        |                      |
        v                      v
React / Vite Dashboard     CSV / XLSX
        |                      |
        v                      v
ADMIN / STUDENT          ADMIN Download
```

Backend Python/FastAPI chịu trách nhiệm truy xuất, tổng hợp và xử lý dữ liệu nghiệp vụ.

Frontend React/Vite tiếp nhận kết quả thông qua REST API và hiển thị các chỉ số thống kê phù hợp với quyền người dùng.

SQLite hỗ trợ lưu trữ và khôi phục dữ liệu trong môi trường Demo. Amazon DynamoDB được tích hợp và kiểm thử để lưu trữ các nhóm dữ liệu nghiệp vụ trên AWS.

![System Architecture](/images/2-Proposal/student_activity_architectur.drawio.png)

#### Các chỉ số phân tích

Analytics Dashboard có thể sử dụng các nhóm chỉ số:

* Tổng số hoạt động.
* Tổng số lượt đăng ký.
* Số sinh viên đã Check-in.
* Số sinh viên đã Check-out.
* Số sinh viên có đầy đủ dữ liệu điểm danh.
* Số sinh viên có minh chứng.
* Số sinh viên được xác nhận tham gia.
* Số sinh viên không được xác nhận tham gia.
* Tỷ lệ xác nhận tham gia hoạt động.

Các chỉ số thực tế được hiển thị phụ thuộc vào chức năng Analytics trong phiên bản hiện tại của đồ án.

#### Quy trình nghiệp vụ

1. Chuẩn bị dữ liệu Registration, Attendance, Evidence và Participation.
2. Xác định phạm vi hoạt động cần phân tích.
3. Backend tổng hợp và tính toán các chỉ số.
4. Frontend hiển thị kết quả trên Analytics Dashboard.
5. ADMIN kiểm tra và sử dụng các bộ lọc được hỗ trợ.
6. Xuất báo cáo từ dữ liệu nghiệp vụ.
7. Kiểm tra tính nhất quán giữa Dashboard, Backend và file báo cáo.

#### Nội dung

1. [Chuẩn bị dữ liệu và chỉ số phân tích](5.8.1-prepare-analytics/)
2. [Xây dựng Analytics Dashboard](5.8.2-build-dashboard/)
3. [Xuất báo cáo CSV/XLSX](5.8.3-export-reports/)
4. [Kiểm thử Dashboard và báo cáo](5.8.4-verify-analytics/)

#### Mục tiêu

Sau khi hoàn thành phần này, bạn sẽ có thể:

* Hiểu cách sử dụng dữ liệu nghiệp vụ để xây dựng Analytics Dashboard.
* Phân biệt dữ liệu đăng ký, điểm danh và xác nhận tham gia.
* Tính toán các chỉ số thống kê bằng Python.
* Hiển thị kết quả phân tích trên React/Vite.
* Kiểm tra dữ liệu Dashboard thông qua REST API.
* Xuất báo cáo phục vụ công tác quản lý.
* Kiểm tra tính chính xác của dữ liệu giữa các thành phần.
* Hiểu cách áp dụng phân quyền ADMIN và STUDENT cho chức năng phân tích.

{{% notice note %}}
Analytics Dashboard trong đồ án được xây dựng bằng React/Vite và FastAPI. Workshop không sử dụng Amazon QuickSight, AWS Glue hoặc Amazon Athena làm thành phần phân tích chính.
{{% /notice %}}

#### Kết luận

Thông qua phần này, người học sẽ hiểu cách chuyển đổi dữ liệu nghiệp vụ thành các chỉ số có ý nghĩa, hỗ trợ Ban Tổ chức đánh giá kết quả hoạt động và theo dõi mức độ tham gia của sinh viên.

Đây là bước kết nối giữa hệ thống quản lý dữ liệu và chức năng phân tích, giúp hoàn thiện Student Activity Management & Engagement Analytics Platform.
