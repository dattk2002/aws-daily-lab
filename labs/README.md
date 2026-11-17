# Lab URL shortener tự viết

Ứng dụng nhỏ dùng HTTP gốc của Node.js và PostgreSQL, phục vụ lộ trình ngày 3–12. Thư mục này độc lập với giao diện học React ở gốc repository. Chạy các lệnh dưới đây chỉ khi đang ở đúng thư mục. Đây là demo học tập: chưa có authentication, rate limiting, chống lạm dụng link, quản trị dữ liệu hay đầy đủ production hardening. Server không tải nội dung URL đích; trình duyệt nhận redirect.

## Chạy local

Cần Linux/macOS hoặc WSL2, Node.js **22.12 trở lên**, npm, Docker Engine/Desktop và Compose v2. Các ví dụ dùng Bash. PostgreSQL local dùng tài khoản giả `lab:lab`, DB `lab`, chỉ bind `127.0.0.1:5432`; tuyệt đối không dùng mật khẩu này cho RDS.

Từ gốc repository:

```bash
cd labs/url-shortener
cp .env.example .env
npm ci
docker compose up -d --wait
npm run db:init
npm test
npm start
```

`db:init` in `{"event":"schema_initialized"}` và chạy lại được. `npm start` tự nạp `.env` nếu có; biến đã export trong process có ưu tiên cao hơn. Schema ở `sql/init.sql`: `links(code TEXT PRIMARY KEY, url TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`. `CREATE TABLE IF NOT EXISTS` không phải cơ chế migration cho thay đổi schema về sau.

Terminal khác:

```bash
curl -i http://127.0.0.1:3000/health
curl -i http://127.0.0.1:3000/ready
curl -i -X POST http://127.0.0.1:3000/shorten \
  -H 'Content-Type: application/json' \
  --data '{"url":"https://example.com"}'
```

Hai GET trả 200. POST trả 201 cùng `{"code":"<8 ký tự>","shortUrl":"http://localhost:3000/r/<code>"}`. Dùng code thực từ response:

```bash
curl -i http://127.0.0.1:3000/r/REPLACE_CODE
```

Mong đợi 302 với `Location: https://example.com/`. GET `/r/unknown1` trả 404. API chỉ nhận URL tuyệt đối `http:` hoặc `https:` và chuẩn hóa URL trước khi lưu để ký tự Unicode trở thành header redirect hợp lệ; JSON sai, `null`, thiếu `url` hoặc scheme khác trả 400; body quá 8 KiB trả 413; media type không phải `application/json` trả 415. Code random trùng được thử lại tối đa năm lần, không ghi đè link trước.

`GET /health` chỉ kiểm tra process và trả `{"status":"ok"}`. `GET /ready` thực hiện `SELECT 1`, trả 200 khi DB dùng được, 503 khi lỗi. Nó không thay thế bài kiểm tra schema: sau khi tạo DB mới luôn chạy `db:init`, rồi POST/redirect. Có thể tạm `docker compose stop db`: `/health` vẫn 200, `/ready` 503; dùng `docker compose start db` để khôi phục.

## Test và cấu hình

`npm test` dùng HTTP thật trên port ngẫu nhiên với repository bộ nhớ; test còn kiểm tra lỗi DB, collision, body limit, cấu hình TLS và vòng đời process. Mặc định integration PostgreSQL được **skip** khi `DATABASE_URL` chưa có trong environment. `.env` không tự nạp vào test để tránh vô tình dùng DB thật. Để kiểm tra PostgreSQL local đang chạy:

```bash
node --env-file=.env --test test/*.test.mjs
```

Integration tạo schema idempotently và xóa đúng code test sau khi chạy; chỉ dùng database lab riêng. CI có thể export `DATABASE_URL` vào process, chạy `npm run db:init`, rồi `npm test`.

| Biến | Ý nghĩa |
| --- | --- |
| `DATABASE_URL` | Bắt buộc; chuỗi PostgreSQL với thông tin kết nối. Không log hoặc commit giá trị thật. |
| `HOST` | Mặc định `127.0.0.1`; giữ loopback khi Nginx ở cùng máy. |
| `PORT` | Mặc định `3000`. |
| `PUBLIC_BASE_URL` | Origin công khai, ví dụ `https://links.example.com`, dùng tạo `shortUrl`; không lấy từ Host header người gửi. Đặt lại khi chuyển local → ALB/domain. |
| `PGSSLROOTCERT` | Đường dẫn CA bundle tin cậy, bắt buộc trong hướng dẫn RDS; bỏ trống chỉ cho PostgreSQL local không TLS. |

Khi có `PGSSLROOTCERT`, app đọc file CA rõ ràng và dùng `ssl: { ca, rejectUnauthorized: true }`. Các query parameter `sslmode`, `sslrootcert`, `sslcert`, `sslkey` bị bỏ khỏi connection URL trước khi đưa vào `pg`, để parser không ghi đè cấu hình kiểm chứng TLS. Không dùng `rejectUnauthorized: false`, `NODE_TLS_REJECT_UNAUTHORIZED=0` hay `sslmode=no-verify`. File CA thiếu làm process khởi động thất bại. Khi không có CA, ứng dụng tắt TLS rõ ràng: đó là cấu hình local, không phải cấu hình phù hợp RDS.

App ghi sự kiện JSON ra stdout/stderr, không ghi SQL, URL đích, chuỗi kết nối hoặc raw driver error. Ví dụ lỗi readiness: `{"event":"request_failed","operation":"readiness"}`. Diagnostic an toàn chỉ xác định nhóm lỗi; kiểm tra network, quyền, CA và trạng thái DB trên máy riêng thay vì đưa secret lên issue công khai. SIGINT/SIGTERM đóng HTTP và pool; sau 10 giây chưa thoát, process kết thúc lỗi để process manager xử lý.

Port 5432 đang dùng: sửa **cả** host port trong Compose và port trong `.env`, ví dụ `127.0.0.1:5455:5432` cùng URL `...:5455/lab`. `ECONNREFUSED`: kiểm tra `docker compose ps` và DB healthy; không mở PostgreSQL ra Internet để chữa lỗi. `relation links does not exist`: chạy `npm run db:init` với cùng environment của server. Giữ `.env` ngoài Git.

## Dọn local

Dừng app bằng Ctrl+C. Từ `labs/url-shortener`:

```bash
docker compose down
```

Lệnh trên giữ volume để học tiếp. **Chỉ khi muốn xóa toàn bộ dữ liệu lab local của Compose project hiện tại**, chạy `docker compose down --volumes`. Không dùng lệnh prune rộng, không chạy vào project khác. PostgreSQL volume này không liên quan tới RDS backup.

## EC2/RDS: runbook để người học tự chạy

Các bước dưới đây là mẫu thao tác trên **Amazon Linux 2023**, không tự tạo AWS resources và không được thực thi khi build website. EC2, EBS, RDS, ALB, log và data transfer có thể phát sinh phí; Budget chỉ cảnh báo, không chặn chi tiêu. Chuẩn bị trước: EC2 riêng cho lab, Node/npm >=22.12 ở `/usr/bin/node` và `/usr/bin/npm`, Nginx, Git; DB RDS private tên `lab`; PostgreSQL login `labapp` có quyền tạo bảng trong DB này; SG RDS cho TCP5432 từ SG EC2, không từ `0.0.0.0/0`. EC2 chỉ nhận HTTP từ nguồn đã định hoặc SG ALB. SSH/SSM và IAM cần được chuẩn bị theo bài, không dùng root AWS hằng ngày.

Các lệnh quản trị sau cần sudo trên EC2. Nếu đường dẫn Node/npm khác, sửa wrapper và PM2 startup tương ứng trước khi chạy. Không cài repo hoặc package bằng tài khoản root khi không cần.

### 1. Tài khoản và thư mục

```bash
sudo useradd --create-home --shell /bin/bash labapp
sudo install -d -o root -g root -m 755 /opt/aws-daily-lab/labs
sudo install -d -o labapp -g labapp -m 755 /opt/aws-daily-lab/labs/url-shortener
sudo install -d -o root -g labapp -m 750 /etc/aws-daily-lab
sudo install -d -o labapp -g labapp -m 750 /home/labapp/bin
```

Nếu user đã tồn tại, kiểm tra bằng `id labapp` rồi bỏ qua `useradd`. Đưa **các file trong `labs/url-shortener/`** của release đã kiểm tra vào `/opt/aws-daily-lab/labs/url-shortener` bằng quy trình tải code của bài 7. Không mang theo `node_modules`, `.env`, log hoặc credentials local. Chỉ cấp ownership thư mục app cho `labapp`; không `chown -R /opt` hoặc cấp quyền root cho user ứng dụng. Kiểm tra `/usr/bin/node --version` và `/usr/bin/npm --version`, rồi:

```bash
sudo -u labapp -H bash -c 'cd /opt/aws-daily-lab/labs/url-shortener && /usr/bin/npm ci --omit=dev'
```

### 2. CA và secrets ngoài repository

Tải [AWS RDS CA bundle chính thức](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html) từ endpoint AWS, kiểm tra theo chính sách của bạn rồi đặt tại `/etc/aws-daily-lab/global-bundle.pem`, owner `root:labapp`, mode 640. Dùng DNS endpoint RDS để hostname verification đúng; không thay bằng IP hoặc tắt kiểm chứng khi lỗi.

```bash
sudo install -o root -g labapp -m 640 /dev/null /etc/aws-daily-lab/app.env
sudoedit /etc/aws-daily-lab/app.env
```

Điền bằng editor, thay các placeholder **trước khi chạy**; không copy mật khẩu vào command line hoặc Git. File dùng cú pháp shell đơn giản; không có khoảng trắng quanh dấu `=`, giá trị nằm trong dấu nháy đơn. Password trong URL cần percent-encode ký tự đặc biệt.

```dotenv
DATABASE_URL='postgresql://labapp:URL_ENCODED_SECRET@RDS_ENDPOINT:5432/lab'
PGSSLROOTCERT='/etc/aws-daily-lab/global-bundle.pem'
HOST='127.0.0.1'
PORT='3000'
PUBLIC_BASE_URL='http://REPLACE_WITH_PUBLIC_HOST'
```

Linux user và PostgreSQL login trong ví dụ cùng tên `labapp`, nhưng là hai tài khoản riêng, cần tạo và cấp quyền riêng. `PUBLIC_BASE_URL` chỉ có scheme và hostname/port; khi có domain và HTTPS thật, đổi thành origin HTTPS đó. ALB hostname mặc định có thể dùng HTTP trong bài chưa có domain; không yêu cầu ACM cấp chứng chỉ cho domain AWS mà bạn không sở hữu. Không dùng local `lab:lab` cho DB thật.

### 3. Wrapper và schema

Tạo `/home/labapp/bin/start-app.sh` bằng editor với nội dung:

```bash
#!/usr/bin/env bash
set -euo pipefail
set -a
. /etc/aws-daily-lab/app.env
set +a
cd /opt/aws-daily-lab/labs/url-shortener
exec /usr/bin/npm start
```

Đặt quyền, xác minh file secrets mà không in nội dung, rồi tạo schema:

```bash
sudo chown labapp:labapp /home/labapp/bin/start-app.sh
sudo chmod 750 /home/labapp/bin/start-app.sh
sudo stat -c '%U:%G %a %n' /etc/aws-daily-lab/app.env
sudo -u labapp -H bash -c 'set -a; . /etc/aws-daily-lab/app.env; set +a; cd /opt/aws-daily-lab/labs/url-shortener; /usr/bin/npm run db:init'
```

Mong đợi `root:labapp 640` và `schema_initialized`. Không đặt `.env` chứa production secrets trong app path. Wrapper nạp file ngoài Git rồi `npm start` dùng environment đó.

### 4. PM2 dưới user ứng dụng

```bash
sudo -u labapp -H /usr/bin/npm install --prefix /home/labapp/.local pm2
sudo -u labapp -H /home/labapp/.local/node_modules/.bin/pm2 start /home/labapp/bin/start-app.sh --name aws-daily-lab --interpreter bash --cwd /opt/aws-daily-lab/labs/url-shortener --kill-timeout 12000
sudo -u labapp -H /home/labapp/.local/node_modules/.bin/pm2 save
sudo -u labapp -H /home/labapp/.local/node_modules/.bin/pm2 startup systemd -u labapp --hp /home/labapp
```

Lệnh `startup` cuối in ra lệnh sudo cần chạy một lần để cài systemd unit; đọc và chạy đúng lệnh đó trên host, không đoán PATH. `pm2 save` lưu danh sách process để phục hồi. Process name là `aws-daily-lab`; PM2 executable nằm dưới `/home/labapp/.local`, state/log mặc định ở `/home/labapp/.pm2`. Dùng `pm2 status`, `pm2 logs aws-daily-lab --lines 30 --nostream` dưới cùng user để kiểm tra. Khi sửa `app.env`, restart wrapper sẽ đọc lại file:

```bash
sudo -u labapp -H /home/labapp/.local/node_modules/.bin/pm2 restart aws-daily-lab
curl -i http://127.0.0.1:3000/health
curl -i http://127.0.0.1:3000/ready
```

Tránh `pm2 restart all` trên máy dùng chung. Sau khi chuẩn bị reboot theo bài 7, xác minh process tự hồi phục và làm lại POST/redirect; việc đọc runbook không chứng minh reboot đã chạy thành công.

### 5. Nginx trên port 80

File mẫu [`nginx/url-shortener.conf`](nginx/url-shortener.conf) proxy tới `127.0.0.1:3000`. Trước khi copy, xem `sudo nginx -T` để xác định cấu hình distro. Mẫu dùng `listen 80 default_server; server_name _;`: `_` không tự biến server thành catch-all; thuộc tính `default_server` của listen mới quyết định request không khớp hostname.

Amazon Linux có thể có server mặc định trong `/etc/nginx/nginx.conf`; distro khác có thể dùng `/etc/nginx/conf.d/default.conf` hoặc `sites-enabled/default`. **Trên host lab riêng**, sao lưu và chỉnh đúng block mặc định đang có để nó không tranh `default_server` hoặc bắt request thay app. Không xóa cả `nginx.conf` hay thay các virtual host khác trên máy dùng chung. Với host có dịch vụ khác, đặt server_name hostname thực của lab và bỏ `default_server` trong mẫu sau khi kiểm tra route.

Sau khi giải quyết default server, copy mẫu tới `/etc/nginx/conf.d/aws-daily-lab.conf` rồi:

```bash
sudo nginx -t
sudo systemctl enable --now nginx
sudo systemctl reload nginx
curl -i http://127.0.0.1/health
curl -i http://127.0.0.1/ready
sudo tail -n 20 /var/log/nginx/aws-daily-lab.access.log
sudo tail -n 20 /var/log/nginx/aws-daily-lab.error.log
```

Chỉ reload khi `nginx -t` thành công. 502 thường do Node chưa listen hoặc sai upstream; 503 ở `/ready` đi được tới Node nhưng DB lỗi. Không mở port3000 ra Internet khi proxy cùng máy. Nếu qua ALB: health path `/health` kiểm tra process, `/ready` kiểm tra DB nhưng có thể rút toàn bộ target khi DB chung bị sự cố; chọn có chủ đích theo bài 9. Giữ port80 chỉ từ ALB SG khi đặt sau ALB. Nginx mẫu không cấu hình TLS; HTTPS termination thuộc bài ALB/ACM, không được chứng minh bởi health check HTTP.

Access log Nginx có request path chứa code link; kiểm soát quyền truy cập, retention và thu thập log. Không thêm request body, secrets hoặc toàn bộ environment vào log để debug. Chính sách log CloudWatch và rotation cần được chuẩn bị trong bài 11.

### 6. Kết thúc bài hoặc dọn AWS

Nếu học tiếp, ghi rõ resource IDs, region, những gì đang chạy và chi phí có thể tiếp diễn. Dừng app bằng `pm2 stop aws-daily-lab` dưới `labapp` chỉ dừng process; EC2, EBS, RDS, ALB, snapshots và logs vẫn có thể tính phí. Xóa đúng resource lab theo hướng dẫn cleanup ngày 12/20; snapshot/PITR cần quyết định retention riêng. Không chạy wildcard deletion hoặc xóa tài nguyên ngoài lab. Không có AWS API nào được gọi tự động bởi mã trong thư mục này.

## Tài liệu chính thức

- [Node.js: nạp file environment](https://nodejs.org/api/cli.html#--env-file-if-existsconfig)
- [node-postgres: TLS và lưu ý connectionString](https://node-postgres.com/features/ssl)
- [PostgreSQL: CREATE TABLE](https://www.postgresql.org/docs/17/sql-createtable.html)
- [PostgreSQL image: cấu hình local](https://hub.docker.com/_/postgres)
- [RDS PostgreSQL: kết nối SSL/TLS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.SSL.html)
- [Nginx: chọn server theo request](https://nginx.org/en/docs/http/request_processing.html)
- [PM2: startup và phục hồi process](https://pm2.keymetrics.io/docs/usage/startup/)
