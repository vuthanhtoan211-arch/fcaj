
---
title: "Blog 2 - Upload file lên Amazon S3 bằng Pre-signed URL"
date: 2026-09-18
weight: 2
chapter: false
pre: "<b>3.2.</b>"
---

# UPLOAD FILE CSV/XLSX LÊN AWS MÀ KHÔNG ĐỂ LỘ QUYỀN S3: PRE-SIGNED URL HOẠT ĐỘNG NHƯ THẾ NÀO?

## Tìm hiểu cách xây dựng quy trình Upload File an toàn trên AWS

### 1. Bắt đầu từ một bài toán quen thuộc

Trong quá trình thực hiện đồ án Student Activity Management & Engagement Analytics Platform, tôi cần xây dựng chức năng nhập dữ liệu từ các file CSV và Excel.

Các file này có thể bao gồm:

* Danh sách sinh viên đăng ký từ University Portal.
* Dữ liệu minh chứng tham gia từ Google Forms.
* Danh sách sinh viên cần đối soát.
* Các file phục vụ báo cáo và phân tích dữ liệu.

Trong phiên bản hiện tại, các file Registration và Evidence được gửi đến FastAPI Backend để kiểm tra và xử lý.

Tuy nhiên, khi nghiên cứu cách mở rộng hệ thống trên AWS, tôi đặt ra một câu hỏi:

**Làm thế nào để người dùng có thể upload file trực tiếp lên Amazon S3 mà không cần biết AWS Access Key và Secret Access Key?**

Một trong những giải pháp tôi tìm hiểu được là Amazon S3 Pre-signed URL.

### 2. Tại sao không nên lưu AWS Credentials trong Frontend?

Giả sử tôi xây dựng một ứng dụng React và muốn upload file trực tiếp lên Amazon S3.

Một cách tiếp cận không an toàn là đưa AWS Access Key và Secret Access Key vào source code của Frontend.

```text
React Frontend
    |
    | AWS Credentials
    v
Amazon S3
```

Vấn đề là mã JavaScript chạy trong trình duyệt có thể được người dùng kiểm tra.

Nếu Credentials được đưa vào mã nguồn Frontend, chúng có thể bị phát hiện thông qua Developer Tools hoặc các file JavaScript đã được build.

Điều này tạo ra nguy cơ:

* Truy cập tài nguyên AWS trái phép.
* Đọc dữ liệu ngoài phạm vi cho phép.
* Upload hoặc xóa dữ liệu không mong muốn.
* Làm phát sinh chi phí AWS.
* Rò rỉ dữ liệu sinh viên.

Biến môi trường được đưa vào JavaScript Frontend cũng không phải nơi lưu bí mật an toàn nếu giá trị của chúng xuất hiện trong bản build.

Vì vậy, một ứng dụng Web không nên cung cấp AWS Credentials dài hạn trực tiếp cho trình duyệt.

### 3. Pre-signed URL là gì?

Pre-signed URL là một URL được ký bằng thông tin xác thực AWS, cho phép người sở hữu URL thực hiện một thao tác cụ thể trên tài nguyên S3 trong một khoảng thời gian giới hạn.

Ví dụ:

* Upload một object bằng HTTP PUT.
* Download một object bằng HTTP GET.

Backend có thể tạo URL đã ký và gửi URL này cho người dùng.

Người dùng không cần AWS Access Key hoặc Secret Access Key để thực hiện thao tác được cấp phép.

Một Pre-signed URL thường chứa các thông tin liên quan đến:

* S3 Bucket.
* Object Key.
* HTTP Method.
* Thời gian hết hạn.
* Chữ ký AWS.

URL được tạo dựa trên quyền của IAM Principal thực hiện việc ký.

Nếu Principal không có quyền upload object vào S3, việc tạo URL không thể giúp người dùng vượt qua giới hạn quyền đó.

Pre-signed URL cũng không yêu cầu S3 Bucket phải được mở Public.

### 4. Pre-signed URL hoạt động như thế nào?

Giả sử ADMIN cần upload file đăng ký sinh viên lên Amazon S3.

Luồng xử lý đề xuất:

```text
ADMIN / React Frontend
          |
          | 1. Request Upload URL
          v
FastAPI Backend
          |
          | 2. Generate Pre-signed URL
          v
AWS SDK / IAM Permissions
          |
          | 3. Return Signed URL
          v
ADMIN / React Frontend
          |
          | 4. HTTP PUT File
          v
Amazon S3
```

Các bước thực hiện:

1. ADMIN đăng nhập vào Web Application.
2. ADMIN chọn file CSV hoặc XLSX.
3. Frontend gửi yêu cầu tạo Upload URL đến FastAPI.
4. Backend kiểm tra Access Token và quyền ADMIN.
5. Backend kiểm tra loại file, tên file và thông tin hoạt động.
6. Backend sử dụng boto3 để tạo Pre-signed URL.
7. Frontend nhận URL đã ký.
8. Trình duyệt upload file trực tiếp lên Amazon S3.
9. Hệ thống xác nhận kết quả upload trước khi bắt đầu xử lý dữ liệu.

Ưu điểm của kiến trúc này là file không cần đi qua FastAPI Backend trong suốt quá trình upload.

Backend chỉ chịu trách nhiệm xác thực người dùng, kiểm tra nghiệp vụ và cấp URL phù hợp.

### 5. Ví dụ tạo Pre-signed URL bằng Python

Dưới đây là ví dụ minh họa sử dụng Python và boto3.

```python
import boto3
from uuid import uuid4

s3 = boto3.client("s3")

bucket_name = "your-private-demo-bucket"

object_key = f"uploads/{uuid4()}.csv"

upload_url = s3.generate_presigned_url(
    ClientMethod="put_object",
    Params={
        "Bucket": bucket_name,
        "Key": object_key,
        "ContentType": "text/csv"
    },
    ExpiresIn=300
)

print(upload_url)
```

Giải thích:

* put_object: Thao tác upload object.
* Bucket: Tên S3 Bucket đích.
* Key: Đường dẫn object trong Bucket.
* ContentType: Kiểu nội dung được sử dụng khi upload.
* ExpiresIn: Thời gian hiệu lực của URL, tính bằng giây.

Trong ví dụ trên, URL có thời gian hiệu lực dự kiến là 300 giây.

Backend cần có thông tin xác thực AWS hợp lệ và quyền s3:PutObject đối với object được chỉ định.

Nếu sử dụng thông tin xác thực tạm thời, URL cũng có thể hết hiệu lực sớm hơn khi thông tin xác thực dùng để ký hết hạn.

**Lưu ý:** Đây là ví dụ minh họa để học cách tạo URL. Không sử dụng print URL đã ký trong hệ thống Production vì người có URL có thể sử dụng quyền được cấp trong thời gian còn hiệu lực.

### 6. Upload file từ React Frontend

Sau khi nhận Pre-signed URL, Frontend có thể upload file bằng Fetch API.

```javascript
async function uploadFile(file, uploadUrl) {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "text/csv",
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return true;
}
```

Trong ví dụ này, Content-Type phải phù hợp với thông tin đã được sử dụng khi tạo URL.

Đối với file XLSX, Backend và Frontend cần sử dụng kiểu nội dung phù hợp:

```text
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

Khi Frontend và S3 sử dụng các origin khác nhau, S3 Bucket cần được cấu hình CORS để cho phép yêu cầu upload từ origin của ứng dụng.

CORS không thay thế IAM hoặc cơ chế xác thực. Nó chỉ kiểm soát những yêu cầu cross-origin được trình duyệt cho phép.

### 7. IAM Policy cần những quyền gì?

Backend chỉ cần được cấp quyền upload trong phạm vi cần thiết.

Ví dụ minh họa một IAM Policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::your-private-demo-bucket/uploads/*"
    }
  ]
}
```

Policy trên cho phép upload object trong prefix uploads/ của Bucket được chỉ định.

Nó không tự động cấp quyền đọc, xóa hoặc quản lý toàn bộ Bucket.

Đây là một ví dụ áp dụng Least Privilege:

* Backend chỉ có quyền cần thiết cho việc tạo Upload URL.
* Người dùng chỉ nhận URL dành cho object cụ thể.
* Bucket vẫn có thể giữ trạng thái Private.

### 8. Những vấn đề bảo mật cần lưu ý

Pre-signed URL là một công cụ hữu ích nhưng không tự động giải quyết mọi vấn đề bảo mật.

**Thời gian hết hạn**

Nên sử dụng thời gian hiệu lực ngắn, phù hợp với kích thước file và nhu cầu upload.

**Quyền truy cập**

Chỉ tạo URL sau khi Backend xác thực người dùng và kiểm tra quyền đối với hoạt động tương ứng.

**Object Key**

Backend nên tự tạo Object Key thay vì cho phép người dùng quyết định tùy ý đường dẫn lưu trữ.

Có thể tổ chức theo cấu trúc:

```text
uploads/
  ACT-DEMO-001/
    registration/
      unique-file-id.csv
```

**Kiểm tra file**

Phần mở rộng và Content-Type không đủ để xác nhận file hợp lệ.

Hệ thống vẫn cần kiểm tra nội dung, cấu trúc, kích thước và dữ liệu sau khi upload.

Nếu cần giới hạn kích thước upload bằng policy, có thể nghiên cứu Pre-signed POST với điều kiện content-length-range.

**Bảo vệ URL**

Pre-signed URL có thể được sử dụng nhiều lần trong thời gian còn hiệu lực. URL không mặc định là mã dùng một lần.

Không chia sẻ URL công khai hoặc lưu URL trong log không cần thiết.

**Dữ liệu cá nhân**

Chỉ sử dụng dữ liệu giả lập hoặc dữ liệu được phép xử lý. Không đưa thông tin sinh viên thật lên Bucket công khai.

### 9. Pre-signed URL kết hợp với AWS Lambda

Sau khi file được upload thành công lên S3, có thể xây dựng quy trình xử lý tự động trong tương lai.

```text
React Frontend
      |
      | Pre-signed Upload
      v
Amazon S3 Input
      |
      | S3 Event Notification
      v
AWS Lambda
      |
      | Validate & Process
      v
Amazon S3 Output
```

AWS Lambda có thể:

* Đọc CSV từ S3.
* Kiểm tra MSSV.
* Phát hiện bản ghi trùng lặp.
* Phân loại dữ liệu không hợp lệ.
* Tạo kết quả JSON.

Nếu cần tự động kích hoạt Lambda khi có file mới, có thể cấu hình S3 Event Notification cho prefix đầu vào.

Cần tránh cấu hình trigger trên cả vùng output nếu Lambda ghi kết quả vào cùng Bucket, vì điều đó có thể tạo ra vòng lặp thực thi ngoài ý muốn.

### 10. Liên hệ với đồ án thực tập

Trong phiên bản hiện tại của Student Activity Management & Engagement Analytics Platform:

* Registration và Evidence được nhập thông qua FastAPI.
* Frontend được triển khai trên AWS Amplify.
* DynamoDB được tích hợp và kiểm thử lưu trữ dữ liệu trên AWS.
* Amazon S3 và AWS Lambda được sử dụng trong Serverless CSV Processing Demo độc lập.
* AWS IAM cấp quyền cần thiết cho việc truy cập tài nguyên.

Pre-signed URL là hướng nghiên cứu để mở rộng quy trình upload file trong tương lai.

Nếu được tích hợp, ADMIN có thể upload file trực tiếp lên S3, trong khi FastAPI chỉ quản lý quyền truy cập và thông tin nghiệp vụ.

Hướng phát triển này có thể giảm tải việc truyền file qua Backend và hỗ trợ xây dựng một Data Pipeline linh hoạt hơn.

Tuy nhiên, bài viết không khẳng định rằng Pre-signed URL hoặc S3 Event Notification đã được tích hợp hoàn chỉnh vào phiên bản hiện tại của Website.

### 11. Kết luận

Thông qua việc nghiên cứu Amazon S3 Pre-signed URL, tôi hiểu rằng việc upload file lên Cloud không chỉ liên quan đến lưu trữ dữ liệu mà còn liên quan đến xác thực, phân quyền và bảo mật.

Những kiến thức quan trọng tôi rút ra:

* Không đưa AWS Credentials bí mật vào Frontend.
* Sử dụng Backend để kiểm tra quyền và tạo URL đã ký.
* Giới hạn quyền theo từng Object Key và thao tác.
* Thiết lập thời gian hiệu lực phù hợp.
* Kiểm tra dữ liệu sau khi upload.
* Kết hợp S3 với Lambda khi cần xử lý dữ liệu Serverless.

Đây là một kiến thức hữu ích đối với các hệ thống Web có chức năng upload tài liệu, hình ảnh, file CSV hoặc Excel.

Pre-signed URL cũng là nền tảng quan trọng để tôi tiếp tục tìm hiểu về Cloud Security, Data Engineering và các kiến trúc xử lý dữ liệu trên AWS.

### 12. Tài liệu tham khảo

* [Amazon S3 – Sharing objects with presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)
* [Uploading objects with presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
* [Boto3 – generate_presigned_url](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3/client/generate_presigned_url.html)
* [Amazon S3 CORS](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html)
* [Amazon S3 Event Notifications](https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html)
* [AWS IAM User Guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)
