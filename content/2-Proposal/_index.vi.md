---
title: "Bản đề xuất"
date: 2026-09-11
weight: 2
chapter: false
pre: "<b>2.</b>"
---

Tại phần này, nội dung trình bày đề xuất xây dựng hệ thống quản lý, đối soát và phân tích mức độ tham gia hoạt động của sinh viên. Dự án được phát triển trong chương trình thực tập tại First Cloud AI Journey (FCAJ), kết hợp ứng dụng Web với các dịch vụ AWS theo phạm vi triển khai thực tế.

# Student Activity Management & Engagement Analytics Platform
## Hệ thống quản lý và phân tích mức độ tham gia hoạt động của sinh viên
### 1. Tóm tắt điều hành
Student Activity Management & Engagement Analytics Platform là hệ thống được xây dựng nhằm hỗ trợ Ban Tổ chức quản lý thông tin hoạt động, theo dõi điểm danh, đối soát dữ liệu và phân tích mức độ tham gia của sinh viên tại trường đại học.

Hệ thống hướng đến các hoạt động như workshop, hội thảo, sinh hoạt chính trị, cuộc thi học thuật, hoạt động ngoại khóa và các chương trình thường niên như IT Day hoặc TechConnect. Một hoạt động thông thường có thể có khoảng 100–200 sinh viên, trong khi các chương trình lớn có thể có hơn 1.000 người tham gia. Đây là bối cảnh nghiệp vụ đặt ra cho dự án, không phải kết quả kiểm thử tải đã được xác nhận.

Hiện nay, dữ liệu hoạt động được tạo ra từ nhiều công cụ khác nhau. Sinh viên đăng ký trên University Portal, Ban Tổ chức ghi nhận điểm danh bằng mã QR trên thẻ sinh viên và thu thập minh chứng qua Google Forms hoặc Google Sheets. Sau chương trình, cán bộ phải tổng hợp các file Excel/CSV, kiểm tra MSSV và đối chiếu thủ công để xác định danh sách sinh viên được công nhận tham gia.

Dự án đề xuất một nền tảng quản lý tập trung để kết nối các bước nghiệp vụ: quản lý hoạt động, nhập danh sách đăng ký, ghi nhận Check-in/Check-out theo thời gian thực, nhập minh chứng, đối soát, xác nhận kết quả, phân tích và xuất báo cáo.

Phiên bản MVP sử dụng **React/Vite** cho Frontend, **Python/FastAPI** cho Backend và **SQLite** cho cơ chế lưu trữ trạng thái, khôi phục dữ liệu trong môi trường Demo. **Amazon DynamoDB** đã được tích hợp và kiểm thử để lưu trữ dữ liệu nghiệp vụ trên AWS. Hai vai trò người dùng chính là `ADMIN` và `STUDENT`.

Frontend được triển khai trên AWS Amplify Hosting. Backend FastAPI trong môi trường Demo chạy trên máy tính local và được truy cập thông qua Cloudflare Quick Tunnel. Bên cạnh ứng dụng chính, dự án có một quy trình Serverless CSV Processing Demo sử dụng Amazon S3, AWS Lambda, AWS IAM và Amazon CloudWatch.

Sáu dịch vụ AWS được sử dụng trong phạm vi triển khai và thử nghiệm của đồ án gồm:

* AWS Amplify.

* Amazon DynamoDB.

* Amazon S3.

* AWS Lambda.

* AWS IAM.

* Amazon CloudWatch.

Mục tiêu của dự án là giảm các thao tác Excel thủ công, tăng tính nhất quán của dữ liệu, hỗ trợ Ban Tổ chức xác nhận kết quả tham gia và cung cấp thông tin thống kê phục vụ quản lý hoạt động sinh viên. Kiến trúc được phát triển theo từng giai đoạn, không giả định toàn bộ ứng dụng đã chuyển sang hạ tầng AWS Serverless Production.

### 2. Tuyên bố vấn đề
#### 2.1. Quy trình hiện tại
1. Ban Tổ chức xây dựng và công bố thông tin hoạt động.

2. Sinh viên đăng ký thông qua University Portal.

3. Ban Tổ chức xuất danh sách đăng ký dưới dạng Excel/CSV.

4. Khi sinh viên đến địa điểm tổ chức, Ban Tổ chức quét QR trên thẻ sinh viên hoặc ghi nhận MSSV để Check-in.

5. Sinh viên cung cấp minh chứng hoặc phản hồi qua Google Forms.

6. Ban Tổ chức thực hiện Check-out khi có yêu cầu của hoạt động.

7. Sau chương trình, cán bộ tổng hợp, lọc và đối chiếu các nguồn dữ liệu.

8. Danh sách kết quả cuối cùng được gửi đến đơn vị phụ trách theo quy trình hiện hành.

Các khó khăn chính gồm dữ liệu phân tán, MSSV sai hoặc trùng lặp, sinh viên đăng ký nhưng không có dữ liệu điểm danh, thiếu Check-in/Check-out, thiếu minh chứng và khó xác định kết quả tham gia nhanh chóng. Khi số lượng sinh viên tăng, việc đối soát bằng Excel trở nên tốn thời gian và dễ sai sót hơn.

#### 2.2. Giải pháp đề xuất
Hệ thống Web Application cung cấp một quy trình quản lý và đối soát tập trung. University Portal và Google Forms/Google Sheets vẫn là các nguồn dữ liệu bên ngoài; phiên bản hiện tại chưa kết nối trực tiếp với các hệ thống này qua API.

| Nguồn dữ liệu | Cách tiếp nhận trong hệ thống |
| --- | --- |
| University Portal | ADMIN xuất và nhập danh sách đăng ký CSV/XLSX. |
| Student Card QR / MSSV | ADMIN ghi nhận Check-in/Check-out theo thời gian thực thông qua API; hỗ trợ luồng nhập MSSV hoặc thiết bị quét hoạt động như bàn phím. |
| Google Forms / Google Sheets | ADMIN xuất và nhập dữ liệu minh chứng CSV/XLSX. |

Backend FastAPI xử lý các yêu cầu nhập dữ liệu, kiểm tra định dạng, trường bắt buộc, MSSV và bản ghi trùng lặp. Dữ liệu đăng ký, điểm danh và minh chứng được liên kết với hoạt động tương ứng để phục vụ Reconciliation.

Điểm khác biệt quan trọng là **Attendance được ghi nhận trực tiếp tại thời điểm Check-in/Check-out**, không phụ thuộc vào việc xuất và nhập file điểm danh sau chương trình. Việc tích hợp Camera QR Scanner hoàn chỉnh vẫn cần được xác nhận bằng kiểm thử trên thiết bị thực tế.

Sau khi đối soát, hệ thống hỗ trợ ADMIN xem các trường hợp đầy đủ dữ liệu, thiếu điểm danh, thiếu minh chứng hoặc cần xem xét thêm. Kết quả cuối cùng được xác nhận theo quy định của hoạt động, sau đó sử dụng cho Analytics Dashboard và Export.

#### 2.3. Mục tiêu dự án
* Tập trung hóa dữ liệu hoạt động và thông tin tham gia của sinh viên.

* Giảm công việc nhập liệu và đối chiếu Excel thủ công.

* Hỗ trợ ghi nhận Check-in/Check-out theo thời gian thực.

* Chuẩn hóa và kiểm tra dữ liệu Registration và Evidence.

* Đối soát dữ liệu bằng Activity ID và MSSV.

* Hỗ trợ ADMIN xác nhận kết quả tham gia và sinh viên theo dõi dữ liệu cá nhân.

* Xây dựng Analytics Dashboard và chức năng xuất dữ liệu.

* Áp dụng kiến thức phát triển Web, REST API, xử lý dữ liệu và Cloud Computing.

* Tích hợp và kiểm thử lưu trữ dữ liệu nghiệp vụ trên Amazon DynamoDB.

* Thử nghiệm xử lý CSV theo mô hình Serverless trên AWS.

#### 2.4. Phạm vi dự án
**Trong phạm vi MVP:**

* Authentication, Authorization và quản lý tài khoản ADMIN/STUDENT.

* Quản lý hoạt động và hồ sơ người dùng theo quyền được cấp.

* Registration Import và Evidence Import từ CSV/XLSX.

* Check-in/Check-out API theo thời gian thực.

* Reconciliation, Participation Confirmation, Analytics và Export.

* Frontend Hosting bằng AWS Amplify và Backend Demo qua Cloudflare Quick Tunnel.

* Local Persistence bằng SQLite và tích hợp lưu trữ dữ liệu trên Amazon DynamoDB.

* Serverless CSV Processing Demo bằng S3, Lambda, IAM và CloudWatch.

**Ngoài phạm vi hiện tại hoặc cần tiếp tục hoàn thiện:**

* Tích hợp trực tiếp với University Portal và Google Sheets API.

* Xác nhận hoàn chỉnh Camera QR Scanner trên thiết bị thực tế.

* Tự động cộng điểm rèn luyện chính thức vào tài khoản sinh viên của trường.

* Triển khai Backend trên hạ tầng Cloud Production ổn định.

* Hoàn tất chuyển đổi tất cả các luồng lưu trữ và truy xuất dữ liệu sang DynamoDB.

* Tự động hóa toàn bộ pipeline import bằng S3 Event Notifications và Lambda.

* Amazon Cognito, API Gateway, AWS Glue, Amazon Athena và Amazon QuickSight.

* Kiểm thử tải Production quy mô lớn và phân tích nâng cao bằng Machine Learning.

#### 2.5. Đối tượng sử dụng
| Vai trò | Chức năng chính |
| --- | --- |
| ADMIN | Quản lý hoạt động, quản lý tài khoản sinh viên, import dữ liệu, ghi nhận điểm danh, đối soát, xác nhận tham gia, xem Dashboard và xuất báo cáo. |
| STUDENT | Đăng nhập, xem hoặc cập nhật hồ sơ theo quyền, thay đổi mật khẩu, xem thông tin hoạt động và theo dõi kết quả tham gia của bản thân. |

Ban Tổ chức sử dụng quyền ADMIN. Hệ thống không sử dụng STAFF như một vai trò nghiệp vụ độc lập trong phiên bản hiện tại.

### 3. Kiến trúc giải pháp
#### 3.1. Tổng quan kiến trúc
Sơ đồ kiến trúc dưới đây thể hiện các thành phần đang được sử dụng và phạm vi tích hợp AWS của đồ án.

![Student Activity Management & Engagement Analytics Platform Architecture](/fcaj/images/2-Proposal/student_activity_architectur.drawio.png)

Kiến trúc được chia thành ba khu vực chính:

**1. Web Application và Local Demo Environment**

* ADMIN/STUDENT truy cập ứng dụng bằng trình duyệt Web.

* AWS Amplify Hosting phục vụ giao diện React/Vite.

* Sau khi tải giao diện, trình duyệt gửi REST API Request đến Cloudflare Quick Tunnel, kèm Access Token đối với các API cần xác thực.

* Cloudflare Quick Tunnel chuyển tiếp yêu cầu đến FastAPI Backend đang chạy local.

* FastAPI thực hiện Authentication, Authorization, các nghiệp vụ quản lý hoạt động, tài khoản, nhập dữ liệu, điểm danh, đối soát, xác nhận, Analytics và Export.

* SQLite hỗ trợ lưu trữ và khôi phục trạng thái của ứng dụng Demo.

**2. AWS Cloud Data Storage**

* Amazon DynamoDB đã được tích hợp thông qua AWS SDK for Python (boto3).

* Các nhóm dữ liệu Activities, Registrations, Attendance, Evidence và Participation đã nằm trong phạm vi tích hợp hoặc kiểm thử lưu trữ trên DynamoDB.

* Việc tồn tại các bảng và kết quả đọc/ghi trên AWS không đồng nghĩa toàn bộ ứng dụng đã loại bỏ SQLite. Sơ đồ thể hiện riêng hai thành phần để phản ánh đúng phạm vi hiện tại.

**3. AWS Serverless CSV Processing Demo**

* Amazon S3 lưu file CSV đầu vào.

* AWS Lambda đọc, kiểm tra và xử lý CSV, phân loại bản ghi hợp lệ, trùng lặp hoặc không hợp lệ.

* Kết quả JSON được ghi lại vào Amazon S3.

* AWS IAM cung cấp quyền thực thi Lambda, quyền truy cập S3 và quyền ghi log cần thiết.

* Amazon CloudWatch theo dõi log và các chỉ số thực thi.

Quy trình CSV Processor được kiểm thử độc lập với luồng Registration Import/Evidence Import của ứng dụng chính. Sơ đồ không thể hiện S3 Event Notification đã được tự động hóa, cũng không mô tả Lambda ghi kết quả trực tiếp vào DynamoDB nếu chưa có bằng chứng triển khai tương ứng.

#### 3.2. Luồng kết nối ứng dụng
Sơ đồ kiến trúc thực tế đã được trình bày tại mục 3.1. Trình duyệt tải Frontend React/Vite từ AWS Amplify, sau đó gửi API Request đến FastAPI chạy local thông qua Cloudflare Quick Tunnel. SQLite lưu trạng thái Demo; DynamoDB là phần tích hợp và kiểm thử lưu trữ Cloud riêng biệt.
AWS Amplify phục vụ tài nguyên Frontend. Trình duyệt là thành phần gửi các API Request đến Cloudflare Tunnel; Amplify không được mô tả là API Gateway hay Backend Proxy.

#### 3.3. Công nghệ và dịch vụ sử dụng
| Thành phần | Công nghệ / dịch vụ | Vai trò |
| --- | --- | --- |
| Frontend | React/Vite | Giao diện ADMIN/STUDENT và Analytics Dashboard. |
| Backend | Python/FastAPI | REST API, xác thực, phân quyền và xử lý nghiệp vụ. |
| Local Persistence | SQLite | Lưu trữ và khôi phục trạng thái Demo. |
| Cloud Database | Amazon DynamoDB | Tích hợp và kiểm thử lưu trữ dữ liệu nghiệp vụ trên AWS. |
| Frontend Hosting | AWS Amplify | Build và triển khai ứng dụng Web. |
| Connectivity | Cloudflare Quick Tunnel | HTTPS endpoint tạm thời kết nối Backend local. |
| File Storage | Amazon S3 | Lưu CSV đầu vào và JSON kết quả của Serverless Demo. |
| Serverless Processing | AWS Lambda | Kiểm tra và xử lý CSV độc lập. |
| AWS Permissions | AWS IAM | Execution Role và quyền truy cập tài nguyên. |
| Monitoring | Amazon CloudWatch | Logs, metrics và thời gian thực thi Lambda. |
| Version Control | Git/GitHub | Quản lý mã nguồn và lịch sử phát triển. |
| Documentation | Hugo/Markdown | Website báo cáo thực tập và tài liệu dự án. |

#### 3.4. Thiết kế dữ liệu
| Nhóm dữ liệu | Nội dung |
| --- | --- |
| Users / Students | Tài khoản, MSSV, hồ sơ, quyền và trạng thái tài khoản. |
| Activities | Mã, tên, loại, thời gian, địa điểm và trạng thái hoạt động. |
| Registrations | Dữ liệu đăng ký của sinh viên theo hoạt động. |
| Attendance | Thời gian và trạng thái Check-in/Check-out. |
| Evidence | Minh chứng tham gia theo sinh viên và hoạt động. |
| Participation | Kết quả đối soát và xác nhận tham gia. |

MSSV được dùng để nhận diện sinh viên, kết hợp Activity ID để xác định dữ liệu theo từng hoạt động. Cơ chế dữ liệu cần hạn chế trùng lặp, đảm bảo dữ liệu đúng hoạt động và hỗ trợ truy xuất lịch sử.

#### 3.5. Luồng nghiệp vụ
Quy trình nghiệp vụ đã triển khai được minh chứng bằng ảnh chụp giao diện thực tế, không sử dụng sơ đồ giả định:

![Giao diện danh sách hoạt động](/fcaj/images/5-Workshop/5.6-Registration-Attendance/activities-list.png)

![Giao diện Check-in thực tế](/fcaj/images/5-Workshop/5.6-Registration-Attendance/check-in.png)

![Kết quả đối soát dữ liệu](/fcaj/images/5-Workshop/5.7-Evidence-Reconciliation/reconciliation-result.png)

![Analytics Dashboard đã triển khai](/fcaj/images/5-Workshop/5.8-Analytics-Export/analytics-dashboard.png)
Luồng này được xử lý bởi ứng dụng React/Vite và FastAPI. Analytics Dashboard không sử dụng Glue, Athena hoặc QuickSight trong phiên bản hiện tại.

#### 3.6. Bảo mật và giám sát
Authentication và Authorization được thực hiện tại FastAPI. Các API được bảo vệ bằng Access Token và kiểm tra quyền ADMIN/STUDENT tại Backend. AWS IAM được dùng cho quyền truy cập tài nguyên AWS, không thay thế cơ chế đăng nhập của người dùng ứng dụng.

Các nguyên tắc bảo mật gồm kiểm tra dữ liệu đầu vào, hạn chế truy cập dữ liệu cá nhân của người khác, không công khai Credentials trong GitHub hoặc hình ảnh báo cáo, sử dụng dữ liệu giả lập hoặc ẩn danh và giới hạn quyền theo nguyên tắc Least Privilege.

Amazon CloudWatch phục vụ giám sát Lambda CSV Processor, bao gồm Execution Logs, Invocation/Error Metrics, Execution Duration và Log Retention. Trong phạm vi minh chứng hiện có, log retention là 7 ngày. Không ghi nhận API Gateway Logs, CloudWatch Alarms hoặc việc chuyển log FastAPI lên CloudWatch như chức năng đã triển khai nếu chưa có minh chứng.

### 4. Triển khai kỹ thuật
#### 4.1. Các chức năng chính
| Chức năng | Nội dung xử lý |
| --- | --- |
| Authentication | Đăng nhập, đăng xuất, xác thực Access Token và thay đổi mật khẩu. |
| Authorization | Kiểm soát quyền ADMIN/STUDENT ở giao diện và Backend. |
| Activity Management | Tạo, xem, cập nhật, quản lý trạng thái và thông tin hoạt động. |
| Student Account Management | ADMIN xem danh sách, khóa/mở khóa, reset mật khẩu và đồng bộ tài khoản sinh viên. |
| Personal Profile | Xem và cập nhật thông tin cá nhân trong phạm vi được phép. |
| Registration Import | Nhập CSV/XLSX, kiểm tra cấu trúc, MSSV, dữ liệu thiếu và trùng lặp. |
| Attendance | Ghi nhận Check-in/Check-out theo thời gian thực, kiểm tra hoạt động, thời gian và bản ghi đã tồn tại. |
| Evidence Import | Nhập và kiểm tra dữ liệu minh chứng từ CSV/XLSX. |
| Reconciliation | Đối chiếu Registration, Attendance và Evidence theo Activity ID và MSSV. |
| Participation Confirmation | ADMIN kiểm tra và xác nhận hoặc từ chối kết quả tham gia theo quy định nghiệp vụ. |
| Analytics Dashboard | Tổng hợp số liệu hoạt động, đăng ký, điểm danh và kết quả tham gia. |
| Export | Xuất dữ liệu và danh sách phục vụ quản lý theo định dạng được hỗ trợ. |

STUDENT không được truy cập chức năng quản lý tài khoản sinh viên, nhập dữ liệu quản trị hoặc xác nhận tham gia của ADMIN. Thời gian nghiệp vụ được xử lý theo múi giờ Asia/Ho_Chi_Minh.

#### 4.2. Quy tắc đối soát
| Registration | Check-in | Check-out | Evidence | Phân loại minh họa |
| --- | --- | --- | --- | --- |
| Có | Có | Có | Có | Đầy đủ dữ liệu. |
| Có | Có | Không | Có | Thiếu Check-out. |
| Có | Không | Có | Có | Thiếu Check-in. |
| Có | Không | Không | Không | Đăng ký nhưng chưa có dữ liệu tham gia. |
| Có | Có | Có | Không | Thiếu minh chứng. |
| Có | Không | Không | Có | Có minh chứng nhưng thiếu điểm danh. |
| Không | Có | Có | Có | Cần kiểm tra dữ liệu đăng ký. |

Các trường hợp thiếu dữ liệu không mặc định đồng nghĩa với việc sinh viên không tham gia. ADMIN xem xét kết quả và áp dụng quy định của từng hoạt động. Các trạng thái kết quả gồm `CONFIRMED`, `REJECTED` và trường hợp chưa được xác nhận, tùy luồng nghiệp vụ.

#### 4.3. Serverless CSV Processing Demo
Các ảnh sau minh chứng bài thử nghiệm xử lý CSV độc lập bằng Amazon S3 và AWS Lambda:

![Kết quả kiểm thử AWS Lambda CSV Processor](/fcaj/images/5-Workshop/5.10-Serverless-Processing/lambda-test-success.png)

![Kết quả JSON lưu trên Amazon S3](/fcaj/images/5-Workshop/5.10-Serverless-Processing/s3-processed-result.png)
Lambda sử dụng IAM Execution Role để đọc file CSV từ S3, kiểm tra các trường bắt buộc, phát hiện bản ghi trùng hoặc không hợp lệ và tạo kết quả JSON. CloudWatch hỗ trợ kiểm tra log và thông tin thực thi. Luồng này được chạy thử bằng Test Event; việc tự động kích hoạt bằng S3 Event Notifications là hướng mở rộng khi có cấu hình và kiểm thử phù hợp.

Kết quả bài kiểm thử CSV Processor được ghi nhận trong phạm vi Demo:

| Chỉ số | Kết quả |
| --- | --- |
| Total Records | 4 |
| Valid Records | 2 |
| Duplicate Records | 1 |
| Invalid Records | 1 |
| Status Code trong kết quả Lambda | 200 |
| Output File | registrations-result.json |

Đây là minh chứng cho việc xử lý dữ liệu bằng Lambda và lưu kết quả trên S3, không phải kết quả kiểm thử tải lớn hoặc chứng minh toàn bộ quy trình import của Website đã chuyển sang Serverless.

#### 4.4. Yêu cầu phi chức năng
* **Usability:** Giao diện rõ ràng, phân chia chức năng theo vai trò và thông báo lỗi dễ hiểu.

* **Security:** Kiểm tra xác thực, phân quyền Backend, bảo vệ Credentials và dữ liệu sinh viên.

* **Reliability:** Kiểm tra dữ liệu trước khi lưu, xử lý lỗi, hạn chế bản ghi trùng và hỗ trợ sao lưu phù hợp.

* **Maintainability:** Tách Frontend/Backend, tổ chức mã nguồn theo module, quản lý Git/GitHub và cung cấp tài liệu kỹ thuật.

* **Performance:** Đáp ứng yêu cầu Demo và hướng đến mở rộng; cần kiểm thử tải trước khi vận hành Production.

#### 4.5. Chiến lược kiểm thử
Kiểm thử tập trung vào đăng nhập đúng/sai, tài khoản bị khóa, STUDENT truy cập API ADMIN, import thiếu cột hoặc trùng MSSV, Check-in/Check-out không hợp lệ hoặc ngoài thời gian, thiếu Evidence, đối soát, xác nhận và xuất dữ liệu. Bên cạnh đó, dự án kiểm thử tích hợp Frontend/Backend, kết nối DynamoDB và quy trình Lambda CSV Processor với S3/CloudWatch.

Test Report cần ghi rõ dữ liệu đầu vào, kết quả mong đợi, kết quả thực tế, trạng thái PASS/FAIL và những hạn chế chưa được kiểm thử. Các mục tiêu kiểm thử không tự động được xem là đã hoàn thành.

### 5. Lộ trình và mốc triển khai
Dự án được xây dựng theo kế hoạch thực tập 12 tuần, từ 07/09/2026 đến 27/11/2026. Nội dung dưới đây đồng nhất với Worklog tổng hợp; các mốc cuối kỳ được cập nhật theo kết quả và minh chứng thực tế.

| Tuần | Nội dung |
| --- | --- |
| 1 | AWS Fundamentals, Cloud Computing, AWS CLI và Amazon EC2. |
| 2 | Phân tích yêu cầu, Project Proposal và thiết kế kiến trúc. |
| 3 | Phát triển Python/FastAPI, SQLite và các REST API cốt lõi. |
| 4 | Nghiên cứu và tích hợp Amazon DynamoDB, Amazon S3 trong phạm vi Data Pilot. |
| 5 | Phát triển React/Vite, Authentication, Authorization và ADMIN/STUDENT. |
| 6 | Registration Import, Evidence Import, CSV/XLSX và Export. |
| 7 | Reconciliation, Participation Status và Analytics Dashboard. |
| 8 | Kiểm thử tích hợp, sửa lỗi và tối ưu giao diện. |
| 9 | AWS Amplify Hosting, FastAPI Demo và Cloudflare Tunnel. |
| 10 | S3, Lambda, IAM, CloudWatch và tổng hợp minh chứng 6 dịch vụ AWS. |
| 11 | Chuẩn bị Demo, tiếp nhận Feedback nếu có và hoàn thiện tài liệu kỹ thuật. |
| 12 | Hoàn thiện báo cáo, kiểm tra website Hugo, lưu trữ và chuẩn bị bàn giao. |

**Hướng phát triển:** Triển khai FastAPI trên hạ tầng Cloud ổn định; hoàn thiện cơ chế lưu trữ Production và mở rộng DynamoDB; kiểm thử QR Scanner; tích hợp University Portal/Google Sheets API; tự động hóa xử lý file bằng S3/Lambda; bổ sung thông báo, Analytics nâng cao, CI/CD, Monitoring, kiểm thử bảo mật và hiệu năng.

### 6. Ước tính ngân sách
Phiên bản MVP hướng đến chi phí phù hợp với môi trường học tập và Demo. FastAPI đang chạy local nên chưa phát sinh yêu cầu duy trì một máy chủ Backend AWS hoạt động liên tục.

| Dịch vụ | Yếu tố chi phí |
| --- | --- |
| AWS Amplify | Build, Hosting, Storage và Data Transfer. |
| Amazon DynamoDB | Storage, Read/Write Requests hoặc Capacity. |
| Amazon S3 | Storage, Requests và Data Transfer. |
| AWS Lambda | Invocation, Execution Duration và Memory. |
| Amazon CloudWatch | Log ingestion, log storage, metrics và các tính năng bổ sung nếu sử dụng. |
| AWS IAM | Không có chi phí trực tiếp cho IAM Roles và Policies. |

Chi phí phụ thuộc vào khu vực AWS, dung lượng dữ liệu, số lượt truy cập, số request, cấu hình tài nguyên và ưu đãi tài khoản. Có thể sử dụng [AWS Pricing Calculator](https://calculator.aws/) để lập dự toán, sau đó đối chiếu AWS Billing.

Chiến lược kiểm soát chi phí gồm lựa chọn cấu hình phù hợp, xem xét DynamoDB On-Demand cho workload không liên tục, giới hạn dữ liệu thử nghiệm và lượt chạy Lambda, sử dụng CloudWatch Log Retention phù hợp, theo dõi Billing và thiết lập AWS Budgets/Alert khi cần. Chỉ xóa tài nguyên không còn cần thiết sau khi đã lưu minh chứng và đảm bảo không ảnh hưởng Demo hoặc bàn giao.

Không mặc định dự án có chi phí bằng 0. Chưa đưa ra tổng ngân sách cố định khi chưa có đầy đủ thông số và dữ liệu Billing thực tế.

### 7. Đánh giá rủi ro
| Rủi ro | Ảnh hưởng dự kiến | Biện pháp giảm thiểu |
| --- | --- | --- |
| File CSV/XLSX không hợp lệ, MSSV sai hoặc trùng | Trung bình–Cao | Kiểm tra cấu trúc, chuẩn hóa MSSV, phát hiện trùng và thông báo lỗi. |
| Thiếu Check-in/Check-out hoặc Evidence | Cao | Đối soát theo Activity ID/MSSV và ADMIN xem xét ngoại lệ. |
| Người dùng truy cập sai quyền | Cao | Xác thực token, kiểm tra quyền tại Backend, kiểm thử API ADMIN. |
| FastAPI local ngừng hoạt động | Cao | Kiểm tra Backend trước Demo, chuẩn bị phương án khởi động lại và Demo local. |
| Cloudflare Quick Tunnel đổi URL | Cao | Cập nhật API Base URL và kiểm tra kết nối trước khi trình diễn. |
| Dữ liệu local và DynamoDB không đồng nhất | Cao | Kiểm tra phạm vi đồng bộ, đọc/ghi và xác định nguồn dữ liệu trước khi mở rộng Production. |
| Lambda CSV Processing lỗi hoặc IAM sai quyền | Trung bình–Cao | Kiểm tra Execution Role, S3 Input/Output và CloudWatch Logs. |
| Rò rỉ dữ liệu sinh viên hoặc Credentials | Cao | Dùng dữ liệu giả/ẩn danh, không công khai bí mật và áp dụng Least Privilege. |
| Chi phí AWS vượt dự kiến | Trung bình | Theo dõi Billing, giới hạn tài nguyên thử nghiệm và cấu hình cảnh báo khi cần. |
| Chưa đáp ứng tải Production | Cao | Kiểm thử hiệu năng, cải thiện hạ tầng và cơ sở dữ liệu trước vận hành thực tế. |

Khi gặp sự cố, ADMIN có thể chỉnh sửa và nhập lại file, kiểm tra các trường hợp bất thường hoặc sử dụng quy trình Excel hiện có làm phương án dự phòng. Backend có thể chạy lại trong môi trường local; Lambda Demo có thể được thực thi lại với file đầu vào còn lưu trên S3. Quy trình sao lưu và đồng bộ cần phù hợp với cơ chế lưu trữ hiện tại, không giả định mọi dữ liệu đã có bản sao hoàn chỉnh trên AWS.

### 8. Kết quả kỳ vọng
#### 8.1. Cải tiến nghiệp vụ
Hệ thống hướng đến một quy trình quản lý tập trung, giảm việc mở nhiều file và tìm kiếm MSSV thủ công. Ban Tổ chức có thể theo dõi Registration, Attendance, Evidence, Reconciliation và Participation trong cùng một ứng dụng; sinh viên có thể theo dõi thông tin cá nhân trong phạm vi được cấp quyền.

#### 8.2. Phân tích và xuất dữ liệu
Analytics Dashboard sử dụng dữ liệu nghiệp vụ của hệ thống để hỗ trợ các chỉ số như tổng hoạt động, tổng đăng ký, Check-in/Check-out, kết quả tham gia, tỷ lệ tham gia và các trường hợp thiếu dữ liệu. Các chỉ số cần được tính theo định nghĩa nhất quán và phù hợp với dữ liệu thực tế.

Ví dụ minh họa: nếu có 1.200 lượt đăng ký và 1.050 lượt đăng ký được xác nhận tham gia, tỷ lệ tham gia là 87,5%. Đây là ví dụ tính toán, không phải kết quả đo lường từ một chương trình đã tổ chức.

Hệ thống hỗ trợ xuất danh sách và dữ liệu phục vụ công tác quản lý theo định dạng của chức năng tương ứng. Việc công nhận hoặc cộng điểm rèn luyện chính thức trên University Portal vẫn thuộc quy trình của nhà trường, ngoài phạm vi MVP.

#### 8.3. Kết quả ứng dụng AWS
* AWS Amplify: triển khai Frontend React/Vite.

* Amazon DynamoDB: tích hợp và kiểm thử lưu trữ các nhóm dữ liệu nghiệp vụ trên AWS.

* Amazon S3: lưu trữ CSV đầu vào và JSON kết quả.

* AWS Lambda: thử nghiệm xử lý CSV theo mô hình Serverless.

* AWS IAM: cấp quyền thực thi và truy cập tài nguyên.

* Amazon CloudWatch: theo dõi log và chỉ số thực thi Lambda.

Các minh chứng cần thể hiện đúng phạm vi triển khai, không ghi nhận dịch vụ chưa sử dụng là kết quả đã hoàn thành.

#### 8.4. Sản phẩm bàn giao dự kiến
* Frontend/Backend Source Code và GitHub Repository.

* Web Application Demo và dữ liệu giả lập.

* Architecture Diagram và Project Proposal.

* README, API Documentation và User Guide.

* Test Report, Demo Script và AWS Configuration Notes.

* AWS Project Evidence, Worklog và website báo cáo Hugo.

#### 8.5. Hạn chế và hướng phát triển
Backend Demo phụ thuộc vào máy tính local và URL tạm thời của Cloudflare Quick Tunnel. SQLite vẫn xuất hiện trong cơ chế lưu trữ Demo; DynamoDB đã được tích hợp nhưng chưa xác nhận chuyển đổi toàn bộ API sang cơ sở dữ liệu Cloud. Lambda CSV Processor là quy trình Demo độc lập. Camera QR Scanner, tích hợp trực tiếp University Portal/Google Sheets, kiểm thử tải lớn và vận hành Production vẫn cần tiếp tục hoàn thiện.

Về lâu dài, dự án có thể phát triển thành nền tảng quản lý hoạt động sinh viên có khả năng mở rộng và kết nối với hệ thống nhà trường. Đây cũng là nền tảng thực hành kiến thức Data Science, Web Development, Cloud Computing, xử lý dữ liệu và định hướng Cloud & Data Engineering.

**Ghi chú:** Proposal được cập nhật theo sơ đồ kiến trúc hiện tại, phạm vi phát triển và các kết quả kiểm thử đã được ghi nhận. Các công việc chưa hoàn thành, đặc biệt là những mốc cuối kỳ thực tập, cần tiếp tục đối chiếu với minh chứng trước khi ghi nhận thành kết quả chính thức.
