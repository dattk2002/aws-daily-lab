# Lộ trình chi tiết — 100 bài nhỏ

Mỗi nhóm ngày có 5 bài. Dùng [website](https://dattk2002.github.io/aws-daily-lab/) để làm quiz và lưu tiến độ.

## Ngày 01 — Hiểu hệ thống cần xây

Vẽ và giải thích đường đi tạo link, redirect và bộ bằng chứng cho ứng dụng URL shortener.

- [AWS trong một request](../content/day-01/1.md) · khoảng 10 phút
- [Client, server và database](../content/day-01/2.md) · khoảng 10 phút
- [Vẽ sơ đồ URL shortener](../content/day-01/3.md) · khoảng 15 phút
- [Region và Availability Zone](../content/day-01/4.md) · khoảng 10 phút
- [Chọn kết quả cần chứng minh](../content/day-01/5.md) · khoảng 15 phút

## Ngày 02 — Tài khoản, quyền, chi phí

Chuẩn bị quyền làm việc an toàn, hiểu plan chi phí và xác minh identity trước mọi thao tác AWS.

- [Root và MFA](../content/day-02/1.md) · khoảng 15 phút
- [Quyền làm việc và credentials tạm](../content/day-02/2.md) · khoảng 15 phút
- [Đọc đúng Free plan và Paid plan](../content/day-02/3.md) · khoảng 15 phút
- [Budget là cảnh báo, không phải trần chi tiêu](../content/day-02/4.md) · khoảng 15 phút
- [CLI và kiểm tra identity](../content/day-02/5.md) · khoảng 15 phút

## Ngày 03 — Chạy ứng dụng local

Chạy demo Node.js/PostgreSQL gốc của repository và chứng minh tạo link, redirect cùng readiness.

- [Chuẩn bị Node.js và PostgreSQL local](../content/day-03/1.md) · khoảng 20 phút
- [Biến môi trường và cấu hình local](../content/day-03/2.md) · khoảng 15 phút
- [Tạo schema và xác minh dữ liệu](../content/day-03/3.md) · khoảng 15 phút
- [API tạo link đầu tiên](../content/day-03/4.md) · khoảng 15 phút
- [Redirect, readiness và test](../content/day-03/5.md) · khoảng 20 phút

## Ngày 04 — Mạng AWS

Lập bản thiết kế CIDR, subnet, route và Security Group để lần theo request trước khi tạo tài nguyên.

- [VPC và CIDR](../content/day-04/1.md) · khoảng 15 phút
- [Subnet và ranh giới AZ](../content/day-04/2.md) · khoảng 15 phút
- [Route table và Internet Gateway](../content/day-04/3.md) · khoảng 15 phút
- [Security Group theo nguồn cần thiết](../content/day-04/4.md) · khoảng 15 phút
- [Lần theo đường đi request](../content/day-04/5.md) · khoảng 20 phút

## Ngày 05 — EC2 với quyền truy cập có giới hạn

Tạo và kiểm chứng một EC2 AL2023 có đĩa mã hóa, Node.js 22 và đường quản trị giới hạn.

- [Chọn AMI, kiến trúc và instance có chủ đích](../content/day-05/1.md) · khoảng 10 phút
- [Tạo EC2 với EBS mã hóa](../content/day-05/2.md) · khoảng 20 phút
- [Vào máy bằng SSH hoặc Session Manager](../content/day-05/3.md) · khoảng 15 phút
- [Cập nhật AL2023 và cài Node.js 22](../content/day-05/4.md) · khoảng 15 phút
- [Chứng minh ingress đã được giới hạn](../content/day-05/5.md) · khoảng 10 phút

## Ngày 06 — RDS PostgreSQL private và TLS

Chuẩn bị PostgreSQL private chỉ nhận từ EC2, xác minh TLS và tạo schema của ứng dụng.

- [Chuẩn bị DB subnet group qua hai AZ](../content/day-06/1.md) · khoảng 15 phút
- [Tạo PostgreSQL private có cấu hình rõ](../content/day-06/2.md) · khoảng 20 phút
- [Chỉ cho Security Group của EC2 vào database](../content/day-06/3.md) · khoảng 10 phút
- [Kết nối PostgreSQL bằng TLS xác minh đầy đủ](../content/day-06/4.md) · khoảng 15 phút
- [Tạo user ứng dụng và schema links](../content/day-06/5.md) · khoảng 15 phút

## Ngày 07 — Triển khai Node.js và phục hồi sau reboot

Chạy demo nguyên gốc trên EC2 bằng user riêng, secrets ngoài Git và PM2 có kiểm chứng reboot.

- [Đặt mã nguồn dưới quyền user ứng dụng](../content/day-07/1.md) · khoảng 15 phút
- [Giữ secrets ngoài Git và bật TLS cho app](../content/day-07/2.md) · khoảng 15 phút
- [Cài dependencies và chạy thử foreground](../content/day-07/3.md) · khoảng 15 phút
- [Quản lý process và phục hồi sau reboot bằng PM2](../content/day-07/4.md) · khoảng 20 phút
- [Smoke test từ tạo link đến redirect](../content/day-07/5.md) · khoảng 10 phút

## Ngày 08 — Nginx và chẩn đoán reverse proxy

Đưa request qua Nginx, kiểm chứng headers/logs và phục hồi một lỗi 502 có kiểm soát.

- [Reverse proxy đứng ở đâu trong request](../content/day-08/1.md) · khoảng 10 phút
- [Cấu hình Nginx tới upstream loopback](../content/day-08/2.md) · khoảng 20 phút
- [Headers và timeout phải phản ánh đúng tuyến mạng](../content/day-08/3.md) · khoảng 15 phút
- [Đọc access log và error log theo một request](../content/day-08/4.md) · khoảng 15 phút
- [Tạo một lỗi 502 có kiểm soát rồi phục hồi](../content/day-08/5.md) · khoảng 15 phút

## Ngày 09 — ALB và đường vào có kiểm soát

Đưa app qua ALB hai AZ, kiểm tra readiness và giới hạn Nginx chỉ nhận từ ALB.

- [Hai AZ cho cửa vào ALB](../content/day-09/1.md) · khoảng 10 phút
- [Target group đi qua Nginx](../content/day-09/2.md) · khoảng 15 phút
- [Health khác readiness](../content/day-09/3.md) · khoảng 10 phút
- [Tạo ALB và HTTP listener](../content/day-09/4.md) · khoảng 20 phút
- [Chỉ cho ALB gọi EC2](../content/day-09/5.md) · khoảng 15 phút

## Ngày 10 — HTTPS với domain có quyền kiểm soát

Chuẩn bị DNS, ACM cùng Region và listener HTTPS hoặc ghi rõ nhánh HTTP khi chưa có domain.

- [Domain mình kiểm soát và đường DNS](../content/day-10/1.md) · khoảng 10 phút
- [Xin ACM certificate trong đúng Region](../content/day-10/2.md) · khoảng 10 phút
- [DNS validation có bằng chứng](../content/day-10/3.md) · khoảng 15 phút
- [HTTPS listener và redirect đúng đích](../content/day-10/4.md) · khoảng 20 phút
- [Kiểm tra TLS và nhánh chưa có domain](../content/day-10/5.md) · khoảng 15 phút

## Ngày 11 — Quan sát để tìm đúng lớp lỗi

Thu metrics và log JSON, cấu hình CloudWatch agent cùng alarm rồi lần theo một lỗi upstream.

- [Chọn metrics trả lời câu hỏi](../content/day-11/1.md) · khoảng 10 phút
- [Log có cấu trúc tại Nginx](../content/day-11/2.md) · khoảng 15 phút
- [CloudWatch agent thu log và memory](../content/day-11/3.md) · khoảng 20 phút
- [Alarm có ngưỡng và cách phản ứng](../content/day-11/4.md) · khoảng 15 phút
- [Lần theo một lỗi 502](../content/day-11/5.md) · khoảng 15 phút

## Ngày 12 — Nghiệm thu tuyến chính và đóng lab

Kiểm tra ghi đọc qua ALB, thử DB lỗi và reboot, lưu bằng chứng rồi xử lý toàn bộ tài nguyên lab.

- [Smoke test toàn đường đi](../content/day-12/1.md) · khoảng 15 phút
- [Thử mất kết nối DB có khôi phục](../content/day-12/2.md) · khoảng 20 phút
- [Reboot và dữ liệu tồn tại](../content/day-12/3.md) · khoảng 15 phút
- [Hồ sơ bằng chứng có giới hạn rõ](../content/day-12/4.md) · khoảng 10 phút
- [Teardown hoặc kế hoạch giữ có hạn](../content/day-12/5.md) · khoảng 15 phút

## Ngày 13 — S3 và SDK: lưu dữ liệu riêng tư

Tạo kho S3 riêng tư, upload bằng instance role và giới hạn vòng đời dữ liệu thử nghiệm.

- [Bucket riêng tư cho tài sản của lab](../content/day-13/1.md) · khoảng 15 phút
- [Object key là địa chỉ dữ liệu](../content/day-13/2.md) · khoảng 10 phút
- [Instance role thay cho access key](../content/day-13/3.md) · khoảng 15 phút
- [Upload bằng AWS SDK JavaScript v3](../content/day-13/4.md) · khoảng 20 phút
- [Lifecycle có phạm vi và thử quyền âm](../content/day-13/5.md) · khoảng 15 phút

## Ngày 14 — Backup và restore có bằng chứng

Chọn cơ chế backup phù hợp rồi phục hồi một bản dump đã lưu riêng trên S3 vào database thử nghiệm.

- [Automated backup và mục tiêu phục hồi](../content/day-14/1.md) · khoảng 15 phút
- [Snapshot và PITR tạo DB mới](../content/day-14/2.md) · khoảng 20 phút
- [Logical dump của PostgreSQL](../content/day-14/3.md) · khoảng 15 phút
- [Lưu bản dump riêng trên S3](../content/day-14/4.md) · khoảng 15 phút
- [Restore thử và chứng minh dữ liệu](../content/day-14/5.md) · khoảng 25 phút

## Ngày 15 — CI kiểm tra ứng dụng cùng PostgreSQL

Chạy kiểm tra source và hợp đồng API với database tạm trước khi đóng gói bản phát hành không chứa secrets.

- [Workflow là bằng chứng có thể lặp lại](../content/day-15/1.md) · khoảng 10 phút
- [PostgreSQL service trong CI](../content/day-15/2.md) · khoảng 20 phút
- [Test hợp đồng API bằng native Node](../content/day-15/3.md) · khoảng 25 phút
- [Kiểm tra source và đóng gói artifact](../content/day-15/4.md) · khoảng 20 phút
- [Đọc CI đỏ và tạo bằng chứng sửa lỗi](../content/day-15/5.md) · khoảng 15 phút

## Ngày 16 — CD qua OIDC và SSM có phạm vi

Chuẩn bị EC2, roles, artifact và secrets runtime để triển khai một SHA đã kiểm tra rồi diễn tập rollback.

- [OIDC với repo, branch và audience chính xác](../content/day-16/1.md) · khoảng 20 phút
- [Chuẩn bị EC2 và bộ cài release qua SSM](../content/day-16/2.md) · khoảng 30 phút
- [Secrets runtime và SSM document có giới hạn](../content/day-16/3.md) · khoảng 25 phút
- [Deploy thủ công có kiểm tra và smoke test](../content/day-16/4.md) · khoảng 30 phút
- [Rollback đúng release và giới hạn dữ liệu](../content/day-16/5.md) · khoảng 20 phút

## Ngày 17 — Mở rộng capacity mà không giữ trạng thái trên EC2

Tạo một nhóm EC2 có thể thay thế sau ALB, chọn tín hiệu scale và thu hồi capacity có kiểm chứng.

- [Stateless: thay máy mà link vẫn sống](../content/day-17/1.md) · khoảng 12 phút
- [Launch template và bootstrap có thể lặp lại](../content/day-17/2.md) · khoảng 20 phút
- [Tạo Auto Scaling Group sau ALB](../content/day-17/3.md) · khoảng 15 phút
- [Scaling policy và tín hiệu phù hợp](../content/day-17/4.md) · khoảng 12 phút
- [Quan sát thay máy và thu hồi capacity](../content/day-17/5.md) · khoảng 15 phút

## Ngày 18 — Tác vụ Lambda nhỏ và lịch có kiểm soát

Chạy hàm tổng hợp dữ liệu mẫu bằng role tối thiểu, tạo lịch rõ múi giờ rồi xác minh logs và tắt lịch.

- [Sự kiện, lần gọi và tác vụ nhỏ](../content/day-18/1.md) · khoảng 10 phút
- [Hai role với quyền tối thiểu](../content/day-18/2.md) · khoảng 15 phút
- [Tổng hợp một lô dữ liệu bằng Lambda](../content/day-18/3.md) · khoảng 15 phút
- [Lịch rõ múi giờ và payload](../content/day-18/4.md) · khoảng 15 phút
- [Logs, hai lớp retry và tắt lịch](../content/day-18/5.md) · khoảng 15 phút

## Ngày 19 — Năm tình huống sự cố có bằng chứng

Chẩn đoán SSH, RDS, ALB, release và chi phí theo dấu hiệu từng lớp thay vì sửa đoán.

- [Sự cố 1: SSH timeout sau khi đổi mạng](../content/day-19/1.md) · khoảng 12 phút
- [Sự cố 2: phân biệt RDS timeout với lỗi TLS](../content/day-19/2.md) · khoảng 15 phút
- [Sự cố 3: target unhealthy dù app sống](../content/day-19/3.md) · khoảng 12 phút
- [Sự cố 4: release xanh nhưng nghiệp vụ hỏng](../content/day-19/4.md) · khoảng 15 phút
- [Sự cố 5: phí tiếp tục sau khi đóng lab](../content/day-19/5.md) · khoảng 12 phút

## Ngày 20 — Capstone, bằng chứng và kết thúc tài nguyên

Hoàn thiện thiết kế URL shortener, chạy checklist kiểm thử có bằng chứng và teardown toàn bộ phạm vi lab.

- [Capstone: thiết kế từ yêu cầu và ranh giới](../content/day-20/1.md) · khoảng 12 phút
- [Capstone: checklist triển khai có điểm dừng](../content/day-20/2.md) · khoảng 20 phút
- [Capstone: đo, gây lỗi local và giải thích](../content/day-20/3.md) · khoảng 15 phút
- [Capstone: hồ sơ bằng chứng có thể kiểm tra](../content/day-20/4.md) · khoảng 10 phút
- [Capstone: teardown và kiểm kê cuối](../content/day-20/5.md) · khoảng 20 phút
