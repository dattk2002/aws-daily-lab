# Nguồn và cách biên soạn

## Khóa học tham khảo

[James McArthur — AWS Full Course](https://github.com/jamezmca/aws-full-course), kiểm tra phiên bản `9268801e6d687edaa77259bc561e415a1d8ec5ae`.

Đã tham khảo README và INSTRUCTIONS để xác định trục học: app URL shortener Node.js/PostgreSQL → EC2/RDS → Nginx → ALB. Các chủ đề S3, backup, CI/CD, CloudWatch, Auto Scaling và SDK được khóa gốc nhắc ở phần mở rộng. [Video gốc](https://youtu.be/H93Vhy6pmow) thuộc tác giả.

Ngày 01–12 xây tuyến chính với các phần nền tảng, IAM, mạng, HTTPS và kiểm tra bổ sung. Ngày 13–20 là bài mở rộng do repository này biên soạn: giải thích và thực hành sâu hơn các chủ đề vận hành. Đây không phải bản dịch nguyên văn hoặc bản sao tài liệu khóa gốc, cũng không phải tài liệu do tác giả gốc xác nhận.

Không tìm thấy license ở repository nguồn lúc kiểm tra. Vì vậy không đưa mã nguồn, startup script hoặc toàn bộ văn bản upstream vào đây và không tự gán license cho upstream. Nội dung tiếng Việt, giao diện và demo dưới `labs/` được viết riêng.

## Nguồn kỹ thuật

Mỗi bài có mục **Tài liệu** trỏ tới primary sources liên quan. Các nguồn chung:

- [AWS Documentation](https://docs.aws.amazon.com/).
- [IAM security best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html).
- [Free/Paid account plans](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans.html).
- [VPC security groups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html).
- [RDS PostgreSQL SSL/TLS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.SSL.html).
- [Node.js documentation](https://nodejs.org/api/).
- [PostgreSQL documentation](https://www.postgresql.org/docs/).
- [node-postgres SSL](https://node-postgres.com/features/ssl).
- [GitHub Actions OIDC with AWS](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws).
- [Vite static deployment](https://vite.dev/guide/static-deploy.html#github-pages).

Giá, UI AWS Console, gói tài khoản, phiên bản AMI và điều kiện tài nguyên có thể thay đổi. Nội dung hướng dẫn kiểm tra điều kiện tại thời điểm thực hành, không hứa EC2/RDS/ALB hoặc public IPv4 miễn phí. AWS Budgets gửi cảnh báo, không phải công tắc tự chặn mọi chi phí.

## Giới hạn xác minh

Mã UI, nội dung có cấu trúc, logic tiến độ và demo local được kiểm tra bằng các lệnh ghi trong README. Các bước AWS là hướng dẫn do người học tự thực hiện; quá trình xây website không sử dụng credentials AWS hoặc chạy tạo/xóa tài nguyên cloud. Không suy ra một lab đã chạy trên AWS chỉ vì nội dung qua validator.
