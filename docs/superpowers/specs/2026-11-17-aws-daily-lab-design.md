# AWS Daily Lab — bản thiết kế đề xuất

Trạng thái: Tran Kim Dat đã duyệt thiết kế, repo public và GitHub Pages. Người dùng tự tạo rồi cung cấp repo `https://github.com/dattk2002/aws-daily-lab`. Lộ trình có sẵn, không phát hành tự động hằng ngày. Xem kế hoạch và ledger để biết trạng thái triển khai.

## Mục đích

Tạo một repository GitHub mới thuộc tài khoản `dattk2002`, có bài học AWS tiếng Việt được chia theo nhịp 5 bài nhỏ mỗi ngày và giao diện web để đọc bài, thực hành, làm quiz, theo dõi tiến độ. Người dùng đã cho phép tạo repo, commit và push kết quả. Việc triển khai website công khai và thiết lập lịch ghi tự động chưa được quyết định.

## Căn cứ đã kiểm tra

- Nguồn: https://github.com/jamezmca/aws-full-course
- Phiên bản tham khảo: `9268801e6d687edaa77259bc561e415a1d8ec5ae`.
- Đã đọc README và INSTRUCTIONS: dự án URL shortener Node.js/PostgreSQL, triển khai EC2 + RDS, Nginx, ALB; phần mở rộng đề cập S3, backup, Lambda, CloudWatch, CodeDeploy, Auto Scaling và JavaScript SDK.
- Không tìm thấy license trong cây repository hoặc metadata GitHub lúc kiểm tra. Viết nội dung và mã minh họa mới, ghi nguồn tham khảo, không sao chép toàn bộ tài liệu hoặc mã upstream và không gán license cho upstream. Nếu học với chính app upstream, hướng dẫn người học lấy từ repository tác giả.
- Đối chiếu tài liệu AWS hiện hành về tài khoản Free/Paid và IAM; tránh mặc định mọi tài khoản đều được 12 tháng EC2/RDS miễn phí hoặc hướng dẫn dùng root hằng ngày.

## Các lựa chọn do người triển khai đề xuất

Những lựa chọn dưới đây chưa phải lựa chọn người dùng đã xác nhận:

- Tên repo: `aws-daily-lab`, dưới `dattk2002`; nếu tên đã tồn tại, kiểm tra trước rồi chọn tên tương đương không đụng repo cũ.
- Public để dễ đọc bài trên GitHub và hỗ trợ GitHub Pages; xác nhận trong lần duyệt bản thiết kế.
- React + TypeScript + Vite; nội dung Markdown, metadata có schema; build website tĩnh. Cài GSAP cho chuyển cảnh nhẹ, có cleanup và reduced motion. Chưa cài package khi bản thiết kế chưa được duyệt.
- Không backend, không đăng nhập. Tiến độ/đáp án/ghi chú được lưu trên trình duyệt; có export/import JSON và giải thích rõ dữ liệu chưa đồng bộ giữa thiết bị.
- Lộ trình đầu tiên: 20 ngày × 5 bài = 100 bài; khoảng 45–75 phút/ngày, là thời gian dự kiến, lab thực tế có thể kéo dài vì chờ provisioning hoặc xử lý lỗi.
- Học theo ngày bắt đầu do người học chọn, múi giờ hiển thị Asia/Ho_Chi_Minh. Có thể đọc trước hoặc học bù; không khóa cứng bài tương lai.
- Nội dung tách rõ bài dựa theo phần chính của khóa gốc và bài mở rộng do repo mới bổ sung.
- Chuẩn bị cấu hình build/CI; chỉ kích hoạt hosting hoặc lịch ghi tự động khi đã được người dùng cho phép cụ thể.

## Quyết định đã chốt về nhịp học

Người dùng đã trả lời “lịch trình có sẵn”. Thực hiện phương án 1 dưới đây, không triển khai phương án 2:

1. **Có sẵn toàn bộ lộ trình**: biên soạn và commit/push toàn bộ nội dung đã kiểm tra ngay trong đợt xây dựng này; giao diện gợi ý nhóm 5 bài tiếp theo. Không tạo lịch ghi GitHub hằng ngày.
2. **Phát hành thêm mỗi ngày**: biên soạn và kiểm tra trước kho bài, sau đó quy trình theo lịch phát hành 5 bài/ngày với commit tự động. Đây là phát hành nội dung đã duyệt, không tuyên bố AI tự nghiên cứu/viết bài mới hoặc người dùng đã hoàn thành bài. Trước khi bật cần chốt giờ bắt đầu và ngày bắt đầu; workflow hữu hạn, idempotent, giới hạn quyền và không cần AWS credentials. Không tạo các commit giả thể hiện hoạt động học của người dùng.

Phương án 1 đã được chọn. Các lựa chọn còn lại của người triển khai vẫn là đề xuất cho tới khi người dùng duyệt toàn bộ bản thiết kế.

## Lộ trình đề xuất

| Ngày | Chủ đề | 5 bài nhỏ |
| --- | --- | --- |
| 1 | Hiểu hệ thống cần xây | AWS trong một request; client/server/database; sơ đồ URL shortener; Region và AZ; chọn kết quả cần chứng minh |
| 2 | Tài khoản, quyền, chi phí | Root và MFA; quyền làm việc và credentials tạm; đọc Free/Paid plan; Budget và giới hạn cảnh báo; CLI và kiểm tra identity |
| 3 | Chạy ứng dụng local | Chuẩn bị Node/PostgreSQL; biến môi trường; tạo schema; API tạo link; kiểm tra redirect và test |
| 4 | Mạng AWS | VPC và CIDR; subnet và AZ; route/Internet Gateway; Security Group; lần theo đường đi request |
| 5 | EC2 | AMI/kiến trúc/instance; tạo máy với EBS mã hóa; SSH hoặc SSM phù hợp; cập nhật máy và Node; xác minh ingress có giới hạn |
| 6 | RDS PostgreSQL | DB subnet group; tạo DB private; SG từ EC2; kết nối TLS; schema và truy vấn xác minh |
| 7 | Deploy Node.js | Lấy code; cấu hình secrets ngoài Git; cài production dependencies; quản lý process và reboot; smoke test |
| 8 | Nginx | Vai trò reverse proxy; cấu hình upstream; headers/timeouts; access/error logs; chẩn đoán 502 |
| 9 | ALB | Hai AZ và subnets; target group; health endpoint; listener/routing; giới hạn EC2 nhận từ ALB |
| 10 | HTTPS | DNS và quyền sở hữu domain; ACM và vùng; DNS validation; HTTPS listener/redirect; kiểm tra TLS và phương án khi chưa có domain |
| 11 | Quan sát và gỡ lỗi | Metrics; log có cấu trúc; CloudWatch agent/log group; alarms; lần theo lỗi 5xx |
| 12 | Hoàn thành tuyến chính | Test toàn đường đi; thử DB mất kết nối; kiểm tra reboot; ghi lại bằng chứng; dọn tài nguyên hoặc lưu kế hoạch tiếp tục |
| 13 | S3 và SDK, mở rộng | Bucket/private access; object/key; instance role; upload bằng AWS SDK; lifecycle và kiểm tra quyền |
| 14 | Backup/restore, mở rộng | RDS automated backup; snapshot/PITR; logical dump; lưu backup riêng trên S3; restore và xác minh dữ liệu |
| 15 | CI, mở rộng | Workflow; PostgreSQL service cho test; lint/typecheck/test; build artifact; đọc và sửa CI thất bại |
| 16 | CD, mở rộng | OIDC/trust có giới hạn; triển khai qua SSM hoặc CodeDeploy với hạ tầng chuẩn bị rõ; secrets runtime; smoke test release; rollback |
| 17 | Scale, mở rộng | Stateless và session; launch template; Auto Scaling Group; scaling policy; quan sát và dọn capacity |
| 18 | Lambda và lịch, mở rộng | Event-driven model; role tối thiểu; một tác vụ nhỏ không có credentials dài hạn; EventBridge schedule; logs/retry và tắt lịch |
| 19 | Tình huống sự cố, mở rộng | SSH timeout; RDS timeout/TLS; ALB unhealthy; deploy regression; hóa đơn/tài nguyên bị bỏ quên |
| 20 | Capstone và tổng kết | Thiết kế lại hệ thống; chạy checklist triển khai; đo và giải thích lỗi; tập hợp bằng chứng; teardown và kiểm tra tài nguyên còn lại |

Không đặt mục tiêu học hết mọi dịch vụ AWS hoặc ôn chứng chỉ trong lộ trình này. Không trình bày bản demo cơ bản như hệ thống đã đạt mọi yêu cầu production.

## Hợp đồng nội dung

Mỗi bài cần có nội dung riêng, đủ để học được, không chỉ là tiêu đề hoặc cùng một template thay tên:

- ID, ngày/thứ tự, chủ đề/dịch vụ, loại bài, thời lượng dự kiến, prerequisites, nguồn và đánh dấu core/extension.
- Mục tiêu có thể kiểm tra; giải thích ngắn gắn với app xuyên suốt.
- Thao tác cụ thể hoặc bài suy luận có đầu ra; lệnh mẫu có placeholder rõ.
- Kết quả mong đợi và cách xác minh; lỗi thường gặp liên quan đúng bài.
- Câu tự kiểm tra/quiz có đáp án và giải thích.
- Với thao tác tạo tài nguyên: ảnh hưởng chi phí, những gì cần giữ cho bài tiếp theo và teardown theo thứ tự; không hứa miễn phí. Cảnh báo Budget không được gọi là cơ chế chặn chi tiêu.
- Link tài liệu AWS chính thức cho tính năng liên quan và link bài nguồn khi phù hợp.

Lab xuyên suốt đi từ local → EC2/RDS → Nginx → ALB → HTTPS. Bài mở rộng có prerequisites cụ thể. Không yêu cầu người học mở PostgreSQL ra Internet hoặc commit secrets. Demo local chạy độc lập bằng cấu hình mẫu, không tự tạo hoặc xóa hạ tầng AWS.

## Giao diện

Thiết kế ưu tiên việc học, với nền mực xanh đậm, chữ sáng, điểm nhấn cam gợi AWS; font Geist hỗ trợ tiếng Việt, font monospace cho lệnh. Tránh landing page dài gây cản trở bài học.

- Thanh điều hướng: Hôm nay, Lộ trình, Thực chiến, Nguồn.
- Trang Hôm nay: tên ngày/chủ đề, 5 bài của nhóm đang học, thời lượng, tiến độ thật và nút tiếp tục.
- Lộ trình: 20 nhóm ngày, tìm theo từ khóa/dịch vụ, lọc core/extension/hoàn thành, trạng thái rỗng và nút xóa lọc.
- Trang đọc bài: breadcrumb, mục lục, Markdown/code block và copy, liên kết nguồn, quiz có phản hồi, đánh dấu hoàn thành, trước/sau. URL hash/deep link hoạt động trên hosting tĩnh.
- Thực chiến: tập hợp các lab theo giai đoạn và tình huống sự cố, link tới đúng bài; thể hiện prerequisites, tài nguyên có thể phát sinh phí và bước dọn.
- Tiến độ: theo bài và ngày, chỉ tăng khi người dùng hoàn thành; export/import với kiểm tra schema; reset cần xác nhận trong app.
- Dữ liệu lỗi/hỏng trong localStorage không làm trắng trang; thông báo có hướng phục hồi. Không hiện tiến độ mẫu, testimonial giả hoặc thành tích chưa đạt.
- Semantic links cho bài học, card pointer target toàn mặt với secondary controls độc lập; keyboard/focus, contrast, touch target, reduced motion, responsive được kiểm tra.
- GSAP chỉ dùng chuyển cảnh/tiết lộ nội dung có ý nghĩa và được cleanup. Không ép scroll pinning hoặc đoạn quảng cáo dài vào trang đọc bài.

## Cấu trúc dự kiến

`content/` chứa Markdown bài học và metadata; `src/` giao diện; `labs/` chứa demo/config minh họa tự viết và runbook; `scripts/` kiểm tra nội dung; `docs/` nguồn, lộ trình và hướng dẫn; `.github/workflows/` chứa CI và có thể thêm hosting/release khi được cho phép.

Metadata có một nguồn sự thật. README link tới nội dung Markdown và hướng dẫn chạy web local, mô tả rõ phần nào lấy ý tưởng từ khóa nguồn. Không cần API key/AI service để đọc bài hay build.

## Kiểm tra trước khi giao và push

- Kiểm tra đủ 20 ngày, mỗi ngày đúng 5 bài, ID duy nhất, prerequisites hợp lệ, mọi bài có nội dung/quiz/nguồn; kiểm tra link nội bộ và tương ứng content/UI.
- Unit test có ý nghĩa cho tiến độ, gợi ý 5 bài, nhập dữ liệu và quiz.
- Typecheck, build và kiểm tra CI thích hợp.
- Browser kiểm tra đọc một bài → làm quiz → hoàn thành → reload giữ tiến độ; tìm/lọc, deep link, export/import, lỗi dữ liệu lưu.
- Visual kiểm tra mobile, tablet, desktop; keyboard, reduced motion và console errors.
- Rà soát diff, file bị ignore, secrets, source attribution trước commit. GitHub write dùng `gh`, Git dùng native `git`; kiểm tra repo/remote/branch/state trước khi ghi.
- Sau push: xác minh SHA remote trùng local và xem kết quả CI nếu đã chạy. Không nói lab AWS chạy thành công khi chưa thực hiện trên tài khoản AWS thực.

## Ngoài phạm vi hiện tại

Không dùng credentials AWS của người dùng, tạo tài nguyên cloud hoặc phát sinh phí; không đăng nhập hoặc đồng bộ đa thiết bị; không tự gửi email/thông báo; không mặc định dựng tác vụ chạy vĩnh viễn; không tự publish website công khai trước khi được cho phép. GitHub Pages có thể triển khai sau khi chốt public hosting.
