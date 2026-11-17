# Cách học 5 bài mỗi ngày

1. Mở [website](https://dattk2002.github.io/aws-daily-lab/) và chọn **Bắt đầu ngày đầu tiên**. Trang Hôm nay gợi ý ngày đầu tiên còn bài chưa hoàn thành.
2. Học đủ 5 bài theo thứ tự trong nhóm ngày. Mỗi bài có mục tiêu, giải thích, thực hành, cách xác minh, lỗi thường gặp và dọn dẹp.
3. Làm quiz, ghi lại bằng chứng hoặc điều chưa hiểu, chỉ đánh dấu hoàn thành sau khi tự kiểm tra. Quiz không khóa bước học; bạn chịu trách nhiệm với đánh dấu của mình.
4. Dành khoảng 45–75 phút/ngày. Một số ngày lab dài hơn vì chờ tài nguyên hoặc xử lý lỗi; có thể tách lab thành nhiều phiên. Không cần chạy 5 lab cloud mỗi ngày.
5. Khi nghỉ vài hôm, tiếp tục từ bài chưa xong. Không có bài bị khóa theo lịch, không có tác vụ tự tạo commit mỗi ngày.

## Lịch và tiến độ

Trong **Tiến độ**, chọn ngày bắt đầu để xem ngày dự kiến cho nhóm bài đang học (giờ Việt Nam). Tiến độ được tính từ số bài bạn đánh dấu, không tự tăng theo ngày hoặc lần mở website.

Ghi chú, đáp án và tiến độ chỉ lưu trên trình duyệt/thiết bị hiện tại. Chế độ riêng tư hoặc xóa dữ liệu trình duyệt có thể làm mất tiến độ. **Xuất tiến độ** ra JSON định kỳ; dùng **Nhập tiến độ** khi đổi máy. Tệp được kiểm tra trước khi hỏi thay thế dữ liệu. Tệp có thể chứa ghi chú cá nhân; không đưa vào Git nếu không muốn công khai.

Nếu browser chặn localStorage hoặc hết dung lượng, website vẫn cho học trong phiên và hiện thông báo để xuất bản sao. Thay đổi từ nhiều tab cùng lúc không tự hợp nhất; ưu tiên dùng một tab để cập nhật tiến độ.

## Thực hành

- Ngày 01–04 có bài suy luận và demo local để hiểu hệ thống trước khi tạo cloud.
- Ngày 05–12 triển khai EC2/RDS/Nginx/ALB. Ngày HTTPS có nhánh tiếp tục HTTP khi chưa có domain phù hợp.
- Ngày 13–20 học mở rộng. Đọc điều kiện chuẩn bị của bài; nhiều lab phụ thuộc tài nguyên và dữ liệu đã tạo ở giai đoạn trước.
- Đọc **Dọn dẹp** trước khi bắt đầu. Có bài yêu cầu giữ tài nguyên cho bước kế tiếp, nên quyết định thời điểm teardown và ghi lại danh sách tài nguyên theo đúng tên/region.
- Kiểm tra loại tài khoản Free/Paid và giá hiện hành. Không xem nhãn micro, credits hoặc cảnh báo Budget là đảm bảo không phát sinh phí.
- Không lưu access key, password DB, private key hoặc `.env` production vào repo hay ghi chú trên trang công khai.

## Học trực tiếp trên GitHub

Mở thư mục `content/day-DD`, đọc `1.md` đến `5.md`. `day.json` chứa thời lượng và quiz với đáp án; nếu muốn tự kiểm tra, dùng giao diện trước khi mở file JSON.
