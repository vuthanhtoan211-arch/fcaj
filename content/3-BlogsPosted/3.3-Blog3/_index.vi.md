
---
title: "Blog 3 - Từ Amazon S3 đến Analytics Dashboard"
date: 2026-09-18
weight: 3
chapter: false
pre: "<b>3.3.</b>"
---

# TỪ FILE DỮ LIỆU TRÊN S3 ĐẾN DASHBOARD: XÂY DỰNG DATA ANALYTICS PIPELINE VỚI GLUE, ATHENA VÀ QUICKSIGHT

## Hành trình biến dữ liệu thô thành thông tin có giá trị trên AWS

### 1. Khi dữ liệu không chỉ nằm trong file Excel

Là sinh viên chuyên ngành Khoa học dữ liệu, tôi thường tiếp xúc với các công việc như làm sạch dữ liệu, phân tích dữ liệu và trực quan hóa kết quả.

Tuy nhiên, khi tìm hiểu Cloud Computing tại First Cloud AI Journey (FCAJ), tôi nhận thấy một bài toán khác:

**Làm thế nào để chuyển một tập hợp các file dữ liệu trên Cloud thành một Dashboard có thể hỗ trợ việc ra quyết định?**

Trong đồ án Student Activity Management & Engagement Analytics Platform, dữ liệu được thu thập từ nhiều nguồn:

* Registration từ University Portal.
* Attendance từ quá trình Check-in/Check-out.
* Evidence từ Google Forms hoặc Google Sheets.
* Participation từ quá trình đối soát và xác nhận.

Sau khi xử lý, hệ thống có thể trả lời những câu hỏi như:

* Có bao nhiêu sinh viên đăng ký hoạt động?
* Có bao nhiêu sinh viên được xác nhận tham gia?
* Tỷ lệ tham gia là bao nhiêu?
* Có bao nhiêu sinh viên thiếu Check-in hoặc Check-out?
* Hoạt động nào có mức độ tham gia cao?
* Xu hướng tham gia thay đổi như thế nào theo từng học kỳ?

Những câu hỏi này giúp tôi hiểu rằng giá trị của dữ liệu không chỉ nằm ở việc lưu trữ mà còn nằm ở khả năng khai thác và phân tích.

### 2. Một kiến trúc Data Analytics trên AWS

Trong quá trình nghiên cứu kiến trúc ban đầu của đồ án, tôi tìm hiểu một mô hình phân tích dữ liệu kết hợp:

* Amazon S3.
* AWS Glue.
* Amazon Athena.
* Amazon QuickSight.


Mỗi dịch vụ đảm nhiệm một nhiệm vụ khác nhau trong quá trình chuyển đổi dữ liệu thô thành thông tin phân tích.

Đây là kiến trúc nghiên cứu và đề xuất mở rộng. Phiên bản MVP hiện tại của đồ án vẫn sử dụng Analytics Dashboard được phát triển trực tiếp bằng React/Vite và FastAPI.

### 3. Amazon S3: Nơi bắt đầu của dữ liệu

Amazon S3 là dịch vụ Object Storage có thể lưu trữ nhiều loại dữ liệu, bao gồm CSV, JSON, hình ảnh, tài liệu và các định dạng phân tích như Parquet.

Trong kiến trúc Analytics, S3 có thể đóng vai trò nền tảng lưu trữ dữ liệu.

Ví dụ, dữ liệu hoạt động sinh viên được tổ chức theo cấu trúc:

```text
s3://student-activity-analytics-demo/

  raw/
    registrations/
    attendance/
    evidence/

  curated/
    participation/
      year=2026/
        semester=1/
          activity_id=ACT001/

  query-results/
```

Ý nghĩa:

* raw/: Dữ liệu gốc từ các hệ thống.
* curated/: Dữ liệu đã được kiểm tra, chuẩn hóa và xử lý.
* query-results/: Kết quả truy vấn Athena.

Việc tổ chức dữ liệu theo từng lớp giúp phân biệt dữ liệu gốc với dữ liệu đã sẵn sàng cho phân tích.

Đối với dữ liệu lớn, có thể sử dụng định dạng Parquet và phân vùng theo năm, học kỳ hoặc Activity ID để giảm khối lượng dữ liệu cần truy vấn.

### 4. Data Cleaning: Vì sao không thể phân tích ngay mọi file?

Dữ liệu từ nhiều nguồn thường có cấu trúc khác nhau.

Ví dụ, file Registration có thể chứa:

```csv
student_id,full_name,activity_id
0818000001,Student A,ACT001
0818000002,Student B,ACT001
0818000003,Student C,ACT001
```

Trong khi dữ liệu Attendance chứa:

```csv
student_id,activity_id,check_in,check_out
0818000001,ACT001,08:05,11:30
0818000002,ACT001,08:10,
```

Dữ liệu Evidence:

```csv
student_id,activity_id,evidence_submitted
0818000001,ACT001,true
0818000002,ACT001,true
```

Nếu chỉ lưu các file này lên S3 mà không xử lý, việc phân tích sẽ gặp nhiều khó khăn.

Các bước xử lý cần thực hiện:

1. Chuẩn hóa tên cột.
2. Giữ MSSV dưới dạng chuỗi.
3. Kiểm tra dữ liệu thiếu.
4. Phát hiện bản ghi trùng lặp.
5. Chuẩn hóa thời gian.
6. Đối chiếu dữ liệu theo MSSV và Activity ID.
7. Tổng hợp trạng thái tham gia.
8. Tạo dataset phục vụ Analytics.

Dữ liệu sau xử lý có thể có cấu trúc như sau:

```csv
student_id,activity_id,registered,checked_in,checked_out,evidence_submitted,participation_status
0818000001,ACT001,true,true,true,true,CONFIRMED
0818000002,ACT001,true,true,false,true,PENDING
0818000003,ACT001,true,false,false,false,REJECTED
```

Đây là dữ liệu giả lập nhằm minh họa kết quả đối soát.

Trạng thái PENDING biểu thị trường hợp chưa được xác nhận trong ví dụ. Quyết định CONFIRMED hoặc REJECTED cần tuân theo quy định nghiệp vụ và kết quả xem xét của ADMIN.

### 5. AWS Glue: Giúp hệ thống hiểu cấu trúc dữ liệu

AWS Glue là dịch vụ hỗ trợ tích hợp dữ liệu, lập danh mục dữ liệu và thực hiện các công việc ETL.

Trong kiến trúc nghiên cứu này, thành phần tôi tập trung tìm hiểu là AWS Glue Data Catalog.

Data Catalog lưu Metadata của dữ liệu, bao gồm:

* Tên Database.
* Tên Table.
* Danh sách cột.
* Kiểu dữ liệu.
* Đường dẫn dữ liệu trên S3.
* Thông tin Partition.

Ví dụ:

```text
Database:
student_activity_analytics

Table:
student_participation

Data Location:
s3://student-activity-analytics-demo/curated/participation/

Columns:
student_id            string
activity_id           string
registered            boolean
checked_in            boolean
checked_out           boolean
evidence_submitted    boolean
participation_status  string
```

AWS Glue Crawler có thể được sử dụng để quét dữ liệu trên S3 và tạo hoặc cập nhật thông tin bảng trong Data Catalog.

Điều quan trọng là:

**AWS Glue Data Catalog lưu thông tin mô tả dữ liệu, không phải toàn bộ các bản ghi dữ liệu trên S3.**

Nếu cần thực hiện ETL phức tạp, AWS Glue Jobs có thể được sử dụng để làm sạch, chuyển đổi hoặc chuyển định dạng dữ liệu.

Tuy nhiên, chỉ chạy Crawler không đồng nghĩa với việc dữ liệu đã được làm sạch.

### 6. Amazon Athena: Phân tích dữ liệu bằng SQL

Amazon Athena là dịch vụ truy vấn dữ liệu trên Amazon S3 bằng SQL mà không cần tự quản lý hệ thống máy chủ cơ sở dữ liệu.

Athena có thể sử dụng thông tin bảng từ AWS Glue Data Catalog để xác định vị trí và cấu trúc dữ liệu.

Sau khi bảng student_participation được tạo, tôi có thể nghiên cứu các câu truy vấn như sau.

#### 6.1. Tổng số lượt đăng ký

```sql
SELECT COUNT(*) AS total_registrations
FROM student_participation
WHERE registered = TRUE;
```

Câu truy vấn đếm số bản ghi đã đăng ký trong dataset.

Dataset cần bảo đảm mỗi bản ghi đại diện cho một cặp sinh viên và hoạt động, tránh đếm trùng.

#### 6.2. Tổng số sinh viên được xác nhận

```sql
SELECT COUNT(*) AS confirmed_participants
FROM student_participation
WHERE participation_status = 'CONFIRMED';
```

Chỉ số này cho biết số lượt tham gia đã được xác nhận.

#### 6.3. Tỷ lệ tham gia theo hoạt động

```sql
SELECT
    activity_id,
    COUNT(*) AS total_registrations,
    SUM(
        CASE
            WHEN participation_status = 'CONFIRMED'
            THEN 1
            ELSE 0
        END
    ) AS confirmed_participants,
    ROUND(
        100.0 * SUM(
            CASE
                WHEN participation_status = 'CONFIRMED'
                THEN 1
                ELSE 0
            END
        ) / NULLIF(COUNT(*), 0),
        2
    ) AS participation_rate
FROM student_participation
WHERE registered = TRUE
GROUP BY activity_id;
```

Tỷ lệ được tính dựa trên số sinh viên đăng ký đã được xác nhận tham gia.

#### 6.4. Tìm các trường hợp thiếu Check-out

```sql
SELECT
    student_id,
    activity_id,
    checked_in,
    checked_out
FROM student_participation
WHERE checked_in = TRUE
  AND checked_out = FALSE;
```

Kết quả giúp Ban Tổ chức xác định những sinh viên cần kiểm tra thêm.

#### 6.5. Tìm các trường hợp cần đối soát minh chứng

```sql
SELECT
    student_id,
    activity_id
FROM student_participation
WHERE checked_in = TRUE
  AND evidence_submitted = FALSE;
```

Câu truy vấn này hỗ trợ phát hiện các trường hợp đã điểm danh nhưng chưa có minh chứng.

Các câu SQL trên là ví dụ nghiên cứu, chưa phải truy vấn đã được triển khai trong Athena của đồ án thực tập.

### 7. Amazon QuickSight: Biến kết quả truy vấn thành Dashboard

Amazon QuickSight là công cụ Business Intelligence trên AWS, hỗ trợ trực quan hóa và phân tích dữ liệu.

Trong kiến trúc này, QuickSight có thể kết nối với Athena để sử dụng dữ liệu phục vụ Dashboard.

Thay vì đọc hàng nghìn dòng Excel, Ban Tổ chức có thể theo dõi các chỉ số qua biểu đồ và bảng tổng hợp.

Dashboard đề xuất bao gồm:

| Thành phần | Mục đích |
| --- | --- |
| KPI Cards | Hiển thị tổng đăng ký, tổng tham gia và tỷ lệ tham gia |
| Bar Chart | So sánh mức độ tham gia giữa các hoạt động |
| Line Chart | Theo dõi xu hướng tham gia theo thời gian |
| Donut Chart | Thể hiện tỷ trọng các trạng thái tham gia |
| Data Table | Xem dữ liệu theo MSSV hoặc hoạt động |
| Filters | Lọc theo học kỳ, hoạt động hoặc nhóm dữ liệu |

Ví dụ minh họa:

```text
Total Registrations: 1,200

Confirmed Registered Participants: 1,050

Participation Rate: 87.5%
```

Participation Rate được tính như sau:

```text
Participation Rate
= Confirmed Registered Participants
  / Total Registrations × 100

= 1,050 / 1,200 × 100

= 87.5%
```

Đây là số liệu giả lập để minh họa Dashboard, không phải kết quả đo lường thực tế của một hoạt động.

### 8. Hướng dẫn xây dựng Analytics Pipeline thử nghiệm

Quy trình tham khảo dành cho người mới học AWS:

#### Bước 1: Chuẩn bị dữ liệu

* Tạo một tập dữ liệu CSV giả lập.
* Chuẩn hóa tên cột.
* Kiểm tra MSSV và dữ liệu trùng lặp.
* Tạo trường Participation Status.
* Không sử dụng dữ liệu cá nhân khi chưa được cấp phép.

#### Bước 2: Tạo Amazon S3 Bucket

* Tạo Bucket ở trạng thái Private.
* Giữ Block Public Access phù hợp.
* Tạo prefix curated/participation/.
* Upload file CSV đã được chuẩn hóa.
* Chuẩn bị vị trí lưu kết quả truy vấn Athena.

#### Bước 3: Tạo AWS Glue Data Catalog

* Tạo Glue Database student_activity_analytics.
* Tạo Crawler với nguồn dữ liệu là prefix curated/participation/.
* Cấu hình IAM Role có quyền đọc dữ liệu S3 cần thiết.
* Chạy Crawler.
* Kiểm tra Table và Data Types sau khi tạo.

Đảm bảo các trường student_id và activity_id được nhận diện dưới dạng string để giữ chính xác mã định danh.

#### Bước 4: Truy vấn dữ liệu bằng Amazon Athena

* Mở Athena Query Editor.
* Chọn Database đã tạo.
* Cấu hình vị trí lưu Query Results.
* Thử truy vấn SELECT.
* Kiểm tra kết quả và kiểu dữ liệu.
* Xây dựng truy vấn thống kê và phân tích.

#### Bước 5: Xây dựng Dashboard bằng Amazon QuickSight

* Thiết lập quyền truy cập Athena và S3 cho QuickSight.
* Tạo Data Source kết nối Athena.
* Chọn Database và Table.
* Tạo Dataset.
* Xây dựng Analysis.
* Thêm KPI, biểu đồ và Filters.
* Publish Dashboard nếu có nhu cầu chia sẻ.

QuickSight có thể sử dụng Direct Query hoặc SPICE tùy vào nhu cầu phân tích và cấu hình.

#### Bước 6: Kiểm tra chi phí và dọn dẹp

* Kiểm tra số lần chạy Glue Crawler.
* Kiểm tra lượng dữ liệu được Athena quét.
* Rà soát S3 Storage.
* Kiểm tra QuickSight Subscription và SPICE nếu sử dụng.
* Xóa tài nguyên thử nghiệm không còn cần thiết.
* Kiểm tra AWS Billing.

### 9. Tối ưu hiệu năng và chi phí

Một điểm tôi đặc biệt quan tâm khi học Data Analytics trên AWS là chi phí xử lý dữ liệu.

Các chiến lược có thể áp dụng:

**Sử dụng Parquet**

Parquet là định dạng lưu trữ theo cột, có thể giúp Athena chỉ đọc những cột cần thiết thay vì toàn bộ dữ liệu.

**Partitioning**

Phân vùng dữ liệu theo năm, học kỳ hoặc Activity ID giúp truy vấn chỉ đọc các vùng dữ liệu liên quan khi điều kiện lọc và cấu trúc bảng phù hợp.

**Hạn chế SELECT star**

Thay vì lấy toàn bộ cột, chỉ truy vấn những cột cần sử dụng.

**Kiểm soát Glue**

Chỉ chạy Crawler hoặc ETL Job khi cần cập nhật Metadata hoặc xử lý dữ liệu.

**Quản lý QuickSight**

Lựa chọn phương thức truy vấn, dung lượng SPICE và gói sử dụng phù hợp với nhu cầu thực tế.

Các biện pháp này giúp xây dựng hệ thống phân tích có khả năng mở rộng mà vẫn quan tâm đến chi phí.

### 10. Bảo mật dữ liệu trong Analytics Pipeline

Dữ liệu hoạt động sinh viên có thể chứa thông tin cá nhân như MSSV, họ tên, lớp và lịch sử tham gia.

Vì vậy, hệ thống Analytics cần quan tâm đến:

* Không public S3 Bucket chứa dữ liệu sinh viên.
* Phân quyền IAM theo Least Privilege.
* Chỉ cho phép người được cấp quyền truy vấn dữ liệu.
* Sử dụng mã hóa phù hợp.
* Hạn chế đưa thông tin cá nhân không cần thiết vào Dashboard.
* Sử dụng dữ liệu giả lập khi học tập và Demo.
* Kiểm soát quyền chia sẻ Dashboard.

Không phải mọi người dùng đều cần truy cập dữ liệu chi tiết của từng sinh viên.

Một Dashboard tổng hợp cho người quản lý có thể chỉ cần các chỉ số thống kê thay vì hiển thị toàn bộ dữ liệu gốc.

### 11. So sánh với kiến trúc đồ án hiện tại

| Thành phần | Đồ án hiện tại | Kiến trúc nghiên cứu |
| --- | --- | --- |
| Operational Database | SQLite và DynamoDB Integration | Có thể xuất dữ liệu sang Analytics Storage |
| File Storage | Amazon S3 trong Demo | S3 Raw/Curated Data |
| Data Processing | FastAPI và Lambda CSV Demo | Glue ETL hoặc các công cụ xử lý dữ liệu |
| Metadata | Cấu trúc dữ liệu của ứng dụng | AWS Glue Data Catalog |
| Query | FastAPI xử lý dữ liệu nghiệp vụ | Amazon Athena SQL |
| Dashboard | React/Vite | Amazon QuickSight |

Phiên bản hiện tại của đồ án sử dụng React/Vite và FastAPI để xây dựng Analytics Dashboard.

Kiến trúc Glue, Athena và QuickSight là một hướng mở rộng được nghiên cứu nhằm hỗ trợ:

* Phân tích dữ liệu lịch sử dài hạn.
* Phân tích nhiều hoạt động và học kỳ.
* Truy vấn các dataset lớn hơn.
* Tách Analytics khỏi các chức năng nghiệp vụ hằng ngày.
* Xây dựng báo cáo Business Intelligence.

Ba dịch vụ AWS Glue, Amazon Athena và Amazon QuickSight chưa được xác nhận là đã triển khai trong phiên bản MVP hiện tại.

### 12. Bài học rút ra

Thông qua việc nghiên cứu Data Analytics Pipeline trên AWS, tôi hiểu rõ hơn sự khác biệt giữa các nhóm công việc trong Data Engineering.

* Data Ingestion: Thu thập và đưa dữ liệu vào hệ thống.
* Data Storage: Lưu trữ dữ liệu trên Amazon S3.
* Data Processing: Làm sạch và chuyển đổi dữ liệu.
* Data Catalog: Quản lý Metadata bằng AWS Glue.
* Data Query: Truy vấn dữ liệu bằng Amazon Athena.
* Data Visualization: Trực quan hóa bằng Amazon QuickSight.

Một Dashboard đẹp chỉ là phần cuối của quy trình.

Chất lượng kết quả phân tích còn phụ thuộc vào tính chính xác của dữ liệu, cách thiết kế schema, quy tắc xử lý dữ liệu và cách xác định các chỉ số nghiệp vụ.

### 13. Kết luận

Từ một file CSV trên Amazon S3, tôi có thể hình dung được cách xây dựng một quy trình phân tích dữ liệu hoàn chỉnh trên AWS.

AWS Glue giúp quản lý Metadata và hỗ trợ tích hợp dữ liệu. Amazon Athena cung cấp khả năng truy vấn bằng SQL. Amazon QuickSight giúp chuyển kết quả phân tích thành biểu đồ và Dashboard.

Điều tôi nhận thấy là Data Engineering không chỉ tập trung vào một công cụ hay một dịch vụ.

Đó là quá trình kết nối các thành phần để dữ liệu được thu thập, lưu trữ, chuẩn hóa, xử lý và khai thác một cách hiệu quả.

Kiến thức này giúp tôi liên hệ những gì đã học trong chuyên ngành Khoa học dữ liệu với Cloud Computing, đồng thời định hình rõ hơn hướng phát triển Cloud & Data Engineering trong tương lai.

### 14. Tài liệu tham khảo

* [Amazon S3 Documentation](https://docs.aws.amazon.com/s3/)
* [AWS Glue Documentation](https://docs.aws.amazon.com/glue/)
* [AWS Glue Data Catalog](https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html)
* [Amazon Athena User Guide](https://docs.aws.amazon.com/athena/latest/ug/what-is.html)
* [Amazon Athena Performance Tuning](https://docs.aws.amazon.com/athena/latest/ug/performance-tuning.html)
* [Amazon QuickSight User Guide](https://docs.aws.amazon.com/quicksight/latest/user/welcome.html)
* [AWS Analytics](https://aws.amazon.com/big-data/datalakes-and-analytics/)
* [AWS Pricing Calculator](https://calculator.aws/)
