import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { days, lessons } from "../lib/content";
import { getCurrentDay } from "../lib/progress";
import type { Progress } from "../lib/types";
import { Architecture } from "./Architecture";
import { LessonList } from "./LessonList";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock3,
  FlaskConical,
  Terminal,
} from "./Icons";

gsap.registerPlugin(useGSAP, ScrollTrigger);
export function Dashboard({ progress }: { progress: Progress }) {
  const scope = useRef<HTMLDivElement>(null);
  const day = getCurrentDay(days, progress.completed);
  const next =
    day.lessons.find((l) => !progress.completed.includes(l.id)) ??
    day.lessons[0];
  const doneToday = day.lessons.filter((l) =>
    progress.completed.includes(l.id),
  ).length;
  const allDone = progress.completed.length === lessons.length;
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".architecture", {
          y: 15,
          opacity: 0,
          scale: 0.98,
          duration: 0.65,
          ease: "power2.out",
        });
        gsap.from(".reveal", {
          y: 15,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        });
        gsap.from(".practice-copy", {
          y: 12,
          scrollTrigger: {
            trigger: ".practice-card",
            start: "top 95%",
            end: "top 65%",
            scrub: true,
          },
        });
      });
      return () => media.revert();
    },
    { scope },
  );
  return (
    <div ref={scope}>
      <section className="hero">
        <div className="hero-copy reveal">
          <div className="eyebrow">
            <span className="small-line" /> HỌC NHỎ. LÀM THẬT.
          </div>
          <h1>
            Mỗi ngày một bước.
            <br />
            <span>Tự tin trên AWS.</span>
          </h1>
          <p>
            Biến một khóa học lớn thành những bước vừa sức. Hiểu cách hoạt động,
            tự tay triển khai và biết vì sao hệ thống chạy.
          </p>
          <div className="hero-actions">
            <a className="button primary" href={`#/lesson/${next.id}`}>
              {allDone
                ? "Ôn lại kiến thức"
                : progress.completed.length
                  ? "Tiếp tục học"
                  : "Bắt đầu ngày đầu tiên"}
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a className="button secondary" href="#/roadmap">
              Khám phá lộ trình
            </a>
          </div>
          <span className="hero-footnote">
            Dành cho developer bắt đầu với AWS. Nội dung tiếng Việt.
          </span>
        </div>
        <Architecture />
      </section>
      <div className="facts reveal">
        <div>
          <strong>
            100<span>bài nhỏ</span>
          </strong>
          <p>Mỗi bài một mục tiêu rõ ràng</p>
        </div>
        <div>
          <strong>
            20<span>ngày học</span>
          </strong>
          <p>Từ nền tảng đến vận hành</p>
        </div>
        <div>
          <strong>
            5<span>bài mỗi ngày</span>
          </strong>
          <p>Học theo nhịp của bạn</p>
        </div>
        <div className="facts-progress">
          <span className="text-muted">Hành trình của bạn</span>
          <strong>
            {progress.completed.length}
            <span>/ {lessons.length} bài</span>
          </strong>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Tổng tiến độ"
            aria-valuenow={progress.completed.length}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${progress.completed.length}%` }} />
          </div>
        </div>
      </div>
      <section className="daily-section reveal">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              {allDone ? "BẠN ĐÃ ĐI HẾT LỘ TRÌNH" : "TIẾP TỤC TỪ ĐÂY"}
            </div>
            <h2>
              {allDone
                ? "Sẵn sàng cho dự án tiếp theo."
                : "Một chút AWS cho hôm nay."}
            </h2>
          </div>
          <a className="text-link" href="#/roadmap">
            Toàn bộ lộ trình
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="daily-layout">
          <div className="daily-content">
            <div className="day-heading">
              <span className="day-badge mono">
                NGÀY {String(day.day).padStart(2, "0")}
              </span>
              <span className="tag">
                {day.track === "core" ? "Tuyến chính" : "Mở rộng"}
              </span>
              <span className="day-time">
                <Clock3 size={14} aria-hidden="true" />~
                {day.lessons.reduce((n, l) => n + l.minutes, 0)} phút
              </span>
            </div>
            <h3>{day.title}</h3>
            <p className="text-muted day-summary">{day.summary}</p>
            <LessonList day={day} progress={progress} />
            <div className="day-footer">
              <span>
                {doneToday === 5
                  ? "Đã hoàn thành ngày học này"
                  : `${doneToday}/5 bài đã hoàn thành`}
              </span>
              <span className="completion-dots">
                {day.lessons.map((l) => (
                  <span
                    key={l.id}
                    className={progress.completed.includes(l.id) ? "done" : ""}
                  />
                ))}
              </span>
            </div>
          </div>
          <aside className="journey-panel">
            <div className="journey-title">
              <span className="eyebrow">CHẶNG ĐƯỜNG PHÍA TRƯỚC</span>
              <span className="mono">20D</span>
            </div>
            {[
              {
                range: "01–04",
                title: "Hiểu nền tảng",
                desc: "Cloud, tài khoản, local app & mạng",
                start: 1,
                end: 4,
              },
              {
                range: "05–08",
                title: "Đưa ứng dụng lên cloud",
                desc: "EC2, RDS, Node.js & Nginx",
                start: 5,
                end: 8,
              },
              {
                range: "09–12",
                title: "Kết nối & vận hành",
                desc: "ALB, HTTPS, quan sát & kiểm thử",
                start: 9,
                end: 12,
              },
              {
                range: "13–20",
                title: "Đi xa hơn",
                desc: "S3, CI/CD, scaling & sự cố",
                start: 13,
                end: 20,
              },
            ].map((stage) => (
              <a
                href={`#/roadmap?day=${stage.start}`}
                key={stage.start}
                className={`journey-stage ${day.day >= stage.start && day.day <= stage.end ? "active" : ""}`}
              >
                <span className="stage-dot">
                  {day.day > stage.end ? (
                    <Check size={12} aria-hidden="true" />
                  ) : (
                    ""
                  )}
                </span>
                <div>
                  <span className="stage-range mono">NGÀY {stage.range}</span>
                  <strong>{stage.title}</strong>
                  <p>{stage.desc}</p>
                </div>
                <ChevronRight size={15} aria-hidden="true" />
              </a>
            ))}
            <p className="journey-note">
              Không cần học vội.
              <br />
              Hiểu được rồi hãy đi tiếp.
            </p>
          </aside>
        </div>
      </section>
      <section className="practice-card">
        <div className="practice-copy">
          <div className="eyebrow">
            <FlaskConical size={15} aria-hidden="true" /> TỪ KIẾN THỨC ĐẾN THỰC
            CHIẾN
          </div>
          <h2>
            Không chỉ đọc.
            <br />
            Hãy tự tay làm nó chạy.
          </h2>
          <p>
            Một URL shortener xuyên suốt lộ trình. Từ request đầu tiên ở
            localhost đến hệ thống có load balancer, database và khả năng quan
            sát.
          </p>
          <a className="button secondary" href="#/labs">
            Vào phòng thực hành
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div
          className="terminal-preview"
          aria-label="Ví dụ kiểm tra ứng dụng local"
        >
          <div className="terminal-top">
            <Terminal size={14} aria-hidden="true" />
            <span>local → cloud</span>
            <span className="terminal-lights">● ● ●</span>
          </div>
          <pre>
            <code>
              <span className="terminal-comment">
                # Bắt đầu từ một request nhỏ
              </span>
              {"\n"}
              <span className="terminal-prompt">$</span> curl
              localhost:3000/health{"\n\n"}
              <span className="terminal-response">{'{ "status": "ok" }'}</span>
              {"\n\n"}
              <span className="terminal-comment">
                # Sau đó, hiểu mọi lớp phía sau nó.
              </span>
              {"\n"}
              <span className="terminal-prompt">$</span>{" "}
              <span className="cursor-block">▌</span>
            </code>
          </pre>
          <div className="terminal-caption">
            Minh họa kết quả mong đợi của lab
          </div>
        </div>
      </section>
    </div>
  );
}
