---
title: "Nhập minh chứng và đối soát kết quả tham gia"
date: 2026-11-09
weight: 7
chapter: false
pre: "<b>5.7.</b>"
---

## Nhập minh chứng và đối soát kết quả tham gia

Phần này trình bày cách **Student Activity Management & Engagement Analytics Platform** nhập dữ liệu minh chứng, đối chiếu với đăng ký và điểm danh theo thời gian thực, sau đó hỗ trợ ADMIN xác nhận kết quả tham gia hoạt động.

Có tên trong danh sách đăng ký chưa đủ để chứng minh sinh viên đã tham gia; một bản ghi điểm danh cũng có thể chưa đáp ứng đầy đủ điều kiện của chương trình. Vì vậy, hệ thống cần đối soát nhiều nguồn dữ liệu trước khi người có quyền đưa ra quyết định.

### 1. Các nguồn dữ liệu dùng để đối soát

| Nhóm dữ liệu | Cách thu thập | Thông tin chính |
| --- | --- | --- |
| Registration | Nhập CSV/XLSX xuất từ University Portal | MSSV và hoạt động đăng ký |
| Attendance | Check-in/Check-out theo thời gian thực qua FastAPI | Bản ghi thời điểm điểm danh |
| Evidence | Nhập CSV/XLSX xuất từ Google Forms hoặc Google Sheets | Dữ liệu minh chứng tham gia |

Ứng dụng hiện tại nhập minh chứng bằng file đã xuất, **chưa khẳng định đã tích hợp trực tiếp Google Forms/Sheets API**. Dữ liệu được ghép theo **Activity ID và MSSV** để tránh nhầm thông tin giữa các hoạt động khác nhau.

### 2. Nhập dữ liệu minh chứng

ADMIN chọn đúng hoạt động và tải lên file minh chứng được xuất từ biểu mẫu hoặc bảng tính bên ngoài. Backend kiểm tra định dạng được hỗ trợ, trường cần thiết, MSSV và dữ liệu trùng, sau đó đưa các bản ghi hợp lệ vào bước đối soát.

![Giao diện nhập minh chứng thực tế](/fcaj/images/5-Workshop/5.7-Evidence-Reconciliation/evidence-import.png)

*Hình 5.7.1. Giao diện nhập minh chứng trong Web Application.*

### 3. Đối soát Registration, Attendance và Evidence

FastAPI Backend đối chiếu các bản ghi thuộc hoạt động đã chọn, kiểm tra tình trạng có hoặc thiếu dữ liệu đăng ký, Check-in, Check-out và minh chứng. Kết quả giúp ADMIN nhận biết hồ sơ đầy đủ hoặc những trường hợp cần xem xét thêm.

| Tình huống minh họa | Nội dung cần kiểm tra |
| --- | --- |
| Có Registration, Check-in, Check-out và Evidence | Kiểm tra những điều kiện còn lại của hoạt động |
| Thiếu Check-out | Xem xét dữ liệu điểm danh chưa đầy đủ |
| Có minh chứng nhưng không có điểm danh | Kiểm tra quy định hoạt động và dữ liệu nguồn |
| Có điểm danh nhưng thiếu minh chứng | Xác định hoạt động có bắt buộc minh chứng hay không |
| Dữ liệu thuộc hoạt động khác | Kiểm tra liên kết Activity ID trước khi xác nhận |

Các trường hợp trên dùng để giải thích quy tắc nghiệp vụ, **không phải các mã trạng thái Backend mới** và cũng không có nghĩa hệ thống tự động duyệt hay từ chối sinh viên.

![Kết quả đối soát thực tế](/fcaj/images/5-Workshop/5.7-Evidence-Reconciliation/reconciliation-result.png)

*Hình 5.7.2. Kết quả đối soát dữ liệu trong ứng dụng.*

### 4. Xem xét và xác nhận kết quả tham gia

Sau khi kiểm tra dữ liệu tổng hợp, ADMIN được phân quyền áp dụng quy định của hoạt động và thực hiện thao tác xác nhận kết quả mà hệ thống hỗ trợ. Các trường hợp thiếu hoặc mâu thuẫn dữ liệu cần được đối chiếu với nguồn chính xác, không tự ý chỉnh sửa để tạo kết quả hợp lệ.

![Giao diện xác nhận tham gia thực tế](/fcaj/images/5-Workshop/5.7-Evidence-Reconciliation/participation-confirmation.png)

*Hình 5.7.3. ADMIN kiểm tra và xác nhận kết quả tham gia.*

### 5. Kiến trúc và phạm vi triển khai

- **Frontend:** React/Vite hiển thị giao diện nhập minh chứng, đối soát và xác nhận.
- **Backend:** FastAPI xử lý đối chiếu dữ liệu và quy tắc tham gia.
- **Môi trường Demo:** SQLite lưu dữ liệu chính của ứng dụng chạy local.
- **Thử nghiệm AWS:** Amazon DynamoDB được dùng để kiểm thử nhóm dữ liệu `SAP-Evidence` và `SAP-Participation`.

Chức năng này do Web Application hiện tại xử lý. **AWS Glue, Amazon Athena và Amazon QuickSight chưa phải thành phần triển khai trong dịch vụ đối soát của đồ án.**

### 6. Nội dung thực hành

1. [Nhập dữ liệu minh chứng](5.7.1-import-evidence/)
2. [Đối soát dữ liệu tham gia](5.7.2-reconciliation/)
3. [Xác nhận kết quả tham gia](5.7.3-confirm-participation/)
4. [Kiểm tra bản ghi kết quả cuối cùng](5.7.4-verify-participation/)

### 7. Kết quả đạt được

Sau phần này, người học có thể nhập dữ liệu minh chứng, hiểu cách Backend đối chiếu theo Activity ID và MSSV, kiểm tra các trường hợp thiếu dữ liệu, thực hiện bước xác nhận bằng quyền ADMIN và chuẩn bị dữ liệu tham gia cho Analytics và Export tại mục 5.8.

> **Lưu ý về phạm vi:** Các hình trong mục này là ảnh chụp từ đồ án. Những bảng tình huống dùng để giải thích cách kiểm tra nghiệp vụ, không phải kết quả kiểm thử dữ liệu Production hay quy tắc tự động duyệt sinh viên.
