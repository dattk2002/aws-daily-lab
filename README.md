# AWS Daily Lab

**100 bài AWS bằng tiếng Việt · 20 ngày · mỗi ngày 5 bài nhỏ.**

[Học trên website](https://dattk2002.github.io/aws-daily-lab/) · [100 bài chi tiết](docs/CURRICULUM.md) · [Cách học](docs/LEARNING.md) · [Mã lab](labs/README.md)

Đi từ request đầu tiên ở localhost đến ứng dụng Node.js/PostgreSQL trên EC2, RDS, Nginx và ALB. Sau tuyến chính, thực hành S3, backup/restore, CI/CD, Auto Scaling, Lambda và xử lý sự cố. Bài học và mã lab được viết riêng, lấy cảm hứng từ [AWS Full Course của James McArthur](https://github.com/jamezmca/aws-full-course); xem [nguồn và phạm vi biên soạn](docs/SOURCES.md).

## Bắt đầu

1. Mở website, chọn **Bắt đầu ngày đầu tiên**.
2. Học 5 bài của nhóm ngày, thực hành và kiểm tra kết quả. Mỗi bài có quiz, mục lỗi thường gặp và dọn dẹp.
3. Đánh dấu hoàn thành khi đã tự kiểm tra, ghi lại điều cần nhớ. Trang Hôm nay tự chọn ngày đầu tiên còn bài dang dở.
4. Xuất tiến độ định kỳ trong mục **Tiến độ**. Ghi chú và đáp án lưu trên trình duyệt hiện tại, chưa đồng bộ giữa thiết bị.

Toàn bộ lộ trình có sẵn. Có thể học trước/học bù, không khóa bài theo ngày và không có tác vụ tự commit hằng ngày. Dự kiến 45–75 phút/ngày; một số lab mở rộng cần nhiều phiên và điều kiện chuẩn bị riêng.

## Lộ trình

| Ngày | Chủ đề | Tuyến |
| --- | --- | --- |
| [01](content/day-01/1.md) | Hiểu hệ thống cần xây | Tuyến chính |
| [02](content/day-02/1.md) | Tài khoản, quyền, chi phí | Tuyến chính |
| [03](content/day-03/1.md) | Chạy ứng dụng local | Tuyến chính |
| [04](content/day-04/1.md) | Mạng AWS | Tuyến chính |
| [05](content/day-05/1.md) | EC2 với quyền truy cập có giới hạn | Tuyến chính |
| [06](content/day-06/1.md) | RDS PostgreSQL private và TLS | Tuyến chính |
| [07](content/day-07/1.md) | Triển khai Node.js và phục hồi sau reboot | Tuyến chính |
| [08](content/day-08/1.md) | Nginx và chẩn đoán reverse proxy | Tuyến chính |
| [09](content/day-09/1.md) | ALB và đường vào có kiểm soát | Tuyến chính |
| [10](content/day-10/1.md) | HTTPS với domain có quyền kiểm soát | Tuyến chính |
| [11](content/day-11/1.md) | Quan sát để tìm đúng lớp lỗi | Tuyến chính |
| [12](content/day-12/1.md) | Nghiệm thu tuyến chính và đóng lab | Tuyến chính |
| [13](content/day-13/1.md) | S3 và SDK: lưu dữ liệu riêng tư | Mở rộng |
| [14](content/day-14/1.md) | Backup và restore có bằng chứng | Mở rộng |
| [15](content/day-15/1.md) | CI kiểm tra ứng dụng cùng PostgreSQL | Mở rộng |
| [16](content/day-16/1.md) | CD qua OIDC và SSM có phạm vi | Mở rộng |
| [17](content/day-17/1.md) | Mở rộng capacity mà không giữ trạng thái trên EC2 | Mở rộng |
| [18](content/day-18/1.md) | Tác vụ Lambda nhỏ và lịch có kiểm soát | Mở rộng |
| [19](content/day-19/1.md) | Năm tình huống sự cố có bằng chứng | Mở rộng |
| [20](content/day-20/1.md) | Capstone, bằng chứng và kết thúc tài nguyên | Mở rộng |

## Giao diện học

- **Hôm nay:** 5 bài tiếp theo, trạng thái từng bài và tiến độ thật.
- **Lộ trình:** tìm không dấu, lọc tuyến/tiến độ, xem từng nhóm ngày.
- **Bài học:** mục lục, code copy, nguồn, quiz có giải thích, ghi chú và chuyển bài.
- **Thực chiến:** các lab theo giai đoạn, dẫn vào đúng bài cần làm.
- **Tiến độ:** lịch dự kiến theo ngày bắt đầu, export/import JSON có kiểm tra và reset có xác nhận.
- Điều hướng bàn phím, reduced motion và bố cục mobile/tablet/desktop. Deep link dùng hash để mở và refresh trên GitHub Pages.

Khi browser không lưu được dữ liệu, website thông báo và giữ tiến độ trong phiên để bạn xuất bản sao. Dùng một tab khi cập nhật tiến độ; các tab không tự hợp nhất dữ liệu.

## Chạy website local

Cần Node.js **>=22.18** (khuyến nghị Node 24), npm và Git. Website không cần AWS credentials, database hoặc API key.

```bash
git clone https://github.com/dattk2002/aws-daily-lab.git
cd aws-daily-lab
npm ci
npm run dev
```

Mở URL Vite in ra, mặc định `http://127.0.0.1:5173/aws-daily-lab/`.

```bash
npm test                 # Logic tiến độ và validator
npm run check:content    # 20 ngày, 100 bài, quiz, prerequisites, cấu trúc, nguồn
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e          # Luồng học, sao lưu, dữ liệu lỗi, responsive, accessibility
```

`npm run preview` phục vụ bản build để kiểm tra local. Markdown bài học được tải theo bài; font được host cùng website.

## Chạy app lab

Xem [labs/README.md](labs/README.md). App demo có package/lock riêng trong `labs/url-shortener/`; cần PostgreSQL hoặc Docker Compose. UI của website và backend demo phục vụ hai mục đích riêng.

- `GET /health`: liveness.
- `GET /ready`: kiểm tra kết nối database.
- `POST /shorten` với `{ "url": "https://example.com" }`: tạo link.
- `GET /r/:code`: redirect.

Lab minh họa cách triển khai và vận hành. Những giới hạn như rate limiting và authentication được ghi trong runbook; không coi bản demo là một dịch vụ public đã đủ mọi điều kiện production.

## Chi phí và bảo mật khi học

Website tĩnh không tạo tài nguyên AWS. Các lab cloud có thể phát sinh phí; đọc điều kiện tài khoản/region và **Dọn dẹp** trước khi thực hành. AWS Budgets là cảnh báo, không phải trần chi tiêu. Một số bài giữ tài nguyên cho bài sau; ghi lại ID và dọn đúng phạm vi lab.

Không commit secrets, private key hoặc `.env` production. Dùng MFA, credentials tạm/role phù hợp và giữ RDS private. Các bước AWS là hướng dẫn để người học tự chạy; chúng chưa được xác minh trên một tài khoản AWS thật khi xây repository.

## Cấu trúc và xuất bản

```text
content/day-DD/    day.json + 1.md ... 5.md
src/              React UI, học tập và tiến độ
labs/             App URL shortener, PostgreSQL và Nginx mẫu
scripts/          Validator bài học
tests/            Luồng kiểm tra trình duyệt
docs/             Cách học, nguồn và lộ trình chi tiết
```

Workflow `.github/workflows/pages.yml` kiểm tra nội dung, unit tests, TypeScript/build, lab với PostgreSQL và browser tests trước khi deploy Pages. Pull request chạy kiểm tra; push vào `main` kiểm tra rồi xuất bản. Không dùng AWS keys hoặc workflow phát hành bài theo lịch.
