import { days } from "../lib/content";
import { ArrowUpRight, Code2, FlaskConical, ShieldCheck } from "./Icons";

const phases = [
  {
    title: "Từ localhost đến EC2",
    description:
      "Chạy URL shortener, kiểm tra API và đưa ứng dụng lên máy chủ đầu tiên.",
    days: [3, 5, 6, 7, 8],
    label: "Compute & database",
    icon: Code2,
  },
  {
    title: "Một hệ thống có thể vận hành",
    description:
      "Thêm load balancer, HTTPS, log và cách xác minh toàn bộ đường đi của request.",
    days: [9, 10, 11, 12],
    label: "Networking & observability",
    icon: ShieldCheck,
  },
  {
    title: "Tự động hóa & phục hồi",
    description:
      "Lưu trữ, kiểm tra backup, triển khai có rollback và xử lý sự cố có phương pháp.",
    days: [13, 14, 15, 16, 17, 18, 19, 20],
    label: "Delivery & resilience",
    icon: FlaskConical,
  },
];
export function Labs() {
  return (
    <>
      <header className="page-heading">
        <div className="eyebrow">PHÒNG THỰC HÀNH</div>
        <h1>
          Tự tay xây.
          <br />
          <span>Tự tin giải thích.</span>
        </h1>
        <p>
          Một ứng dụng xuyên suốt, nhiều tình huống thực tế. Mỗi lab có điều
          kiện bắt đầu, cách kiểm tra và bước dọn dẹp.
        </p>
      </header>
      <div className="lab-intro">
        <Code2 size={22} aria-hidden="true" />
        <div>
          <strong>Ứng dụng mẫu: URL shortener</strong>
          <p>
            Node.js + PostgreSQL, với health/readiness endpoint riêng. Chạy và
            thử local trước khi tạo tài nguyên cloud.
          </p>
        </div>
        <a
          className="text-link"
          href="https://github.com/dattk2002/aws-daily-lab/tree/main/labs"
          target="_blank"
          rel="noreferrer"
        >
          Mở mã nguồn
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
      <p className="lab-cost-note">
        Lab AWS có thể phát sinh phí. Kiểm tra gói tài khoản, region và phần
        “Dọn dẹp” trong từng bài. Website này không tạo tài nguyên AWS thay bạn.
      </p>
      <div className="lab-phases">
        {phases.map((phase) => (
          <section key={phase.title} className="lab-phase">
            <div className="phase-heading">
              <span className="phase-icon">
                <phase.icon size={24} aria-hidden="true" />
              </span>
              <div>
                <span className="eyebrow">{phase.label}</span>
                <h2>{phase.title}</h2>
                <p>{phase.description}</p>
              </div>
            </div>
            <div className="lab-grid">
              {days
                .filter((d) => phase.days.includes(d.day))
                .map((day) => {
                  const first =
                    day.lessons.find((l) => l.kind !== "concept") ??
                    day.lessons[0];
                  return (
                    <a
                      className="lab-card"
                      key={day.day}
                      href={`#/lesson/${first.id}`}
                    >
                      <div>
                        <span className="mono">
                          NGÀY {String(day.day).padStart(2, "0")}
                        </span>
                        <ArrowUpRight size={17} aria-hidden="true" />
                      </div>
                      <h3>{day.title}</h3>
                      <p>{day.summary}</p>
                      <span className="text-muted">
                        {day.track === "core" ? "Tuyến chính" : "Mở rộng"} · Đọc
                        điều kiện trong bài
                      </span>
                    </a>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
