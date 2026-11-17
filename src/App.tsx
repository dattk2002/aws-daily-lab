import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { days, answerChoices, lessonMap, lessons } from "./lib/content";
import { emptyProgress, getCurrentDay, parseProgress } from "./lib/progress";
import type { Progress } from "./lib/types";
import { Roadmap } from "./components/Roadmap";
import { Labs } from "./components/Labs";
import { Sources } from "./components/Sources";
import { Settings } from "./components/Settings";
import {
  ArrowUpRight,
  BookOpen,
  Cloud,
  FlaskConical,
  GitFork,
  Map,
  Menu,
  Settings2,
  X,
} from "./components/Icons";

const storageKey = "aws-daily-lab:progress:v1";
const Dashboard = lazy(() =>
  import("./components/Dashboard").then((module) => ({
    default: module.Dashboard,
  })),
);
const LessonReader = lazy(() =>
  import("./components/LessonReader").then((module) => ({
    default: module.LessonReader,
  })),
);
function readSaved(): { progress: Progress; notice: string } {
  try {
    const raw = localStorage.getItem(storageKey);
    return {
      progress: raw ? parseProgress(raw, answerChoices) : emptyProgress(),
      notice: "",
    };
  } catch {
    return {
      progress: emptyProgress(),
      notice:
        "Không đọc được dữ liệu đã lưu. Bạn vẫn có thể học; hãy nhập bản sao hoặc lưu tiến độ mới trong mục Tiến độ.",
    };
  }
}
const getRoute = () => window.location.hash.slice(2) || "today";
const navigation = [
  { path: "today", title: "Hôm nay", icon: BookOpen },
  { path: "roadmap", title: "Lộ trình", icon: Map },
  { path: "labs", title: "Thực chiến", icon: FlaskConical },
  { path: "sources", title: "Nguồn", icon: GitFork },
];

export default function App() {
  const [initial] = useState(readSaved);
  const [progress, setProgress] = useState(initial.progress);
  const [notice, setNotice] = useState(initial.notice);
  const [route, setRoute] = useState(getRoute);
  const [menu, setMenu] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const handler = () => {
      setRoute(getRoute());
      setMenu(false);
      window.scrollTo(0, 0);
      mainRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  useEffect(() => {
    if (progress === initial.progress) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
      setNotice("");
    } catch {
      setNotice(
        "Trình duyệt không lưu được dữ liệu. Tiến độ vẫn dùng được trong phiên này; hãy xuất bản sao ở mục Tiến độ trước khi đóng trang.",
      );
    }
  }, [progress, initial.progress]);
  const path = route.split("?")[0];
  const lesson = path.startsWith("lesson/")
    ? lessonMap.get(path.slice(7))
    : undefined;
  useEffect(() => {
    document.title = `${lesson?.title ?? navigation.find((n) => n.path === path)?.title ?? "Tiến độ"} · AWS Daily Lab`;
  }, [path, lesson]);
  const currentDay = days.length
    ? getCurrentDay(days, progress.completed)
    : null;
  let scheduled = "";
  if (progress.startDate && currentDay) {
    const date = new Date(`${progress.startDate}T00:00:00+07:00`);
    date.setUTCDate(date.getUTCDate() + currentDay.day - 1);
    scheduled = date.toLocaleDateString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
    });
  }
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Đến nội dung chính
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href="#/today"
            aria-label="AWS Daily Lab — Hôm nay"
          >
            <span className="brand-mark">
              <Cloud size={22} strokeWidth={2} aria-hidden="true" />
            </span>
            <span>
              aws<span className="brand-separator">/</span>
              <strong>daily lab</strong>
              <span className="brand-dot">.</span>
            </span>
          </a>
          <nav
            id="main-navigation"
            className={`main-navigation ${menu ? "menu-open" : ""}`}
            aria-label="Điều hướng chính"
          >
            {navigation.map((item) => (
              <a
                key={item.path}
                href={`#/${item.path}`}
                aria-current={path === item.path ? "page" : undefined}
                className={path === item.path ? "active" : ""}
              >
                <item.icon size={15} aria-hidden="true" />
                {item.title}
              </a>
            ))}
          </nav>
          <div className="header-right">
            <a
              className={`header-progress ${path === "settings" ? "active" : ""}`}
              href="#/settings"
              aria-label={`Tiến độ: ${progress.completed.length} trên ${lessons.length} bài`}
            >
              <span className="header-progress-dot" />
              {progress.completed.length}/{lessons.length}
              <Settings2 size={15} aria-hidden="true" />
            </a>
            <a
              className="github-link"
              href="https://github.com/dattk2002/aws-daily-lab"
              target="_blank"
              rel="noreferrer"
              aria-label="Repository GitHub"
            >
              <GitFork size={20} aria-hidden="true" />
            </a>
            <button
              className="mobile-menu"
              aria-label={menu ? "Đóng điều hướng" : "Mở điều hướng"}
              aria-expanded={menu}
              aria-controls="main-navigation"
              onClick={() => setMenu(!menu)}
            >
              {menu ? (
                <X size={20} aria-hidden="true" />
              ) : (
                <Menu size={20} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>
      <div className="workspace-caption">
        <span>NHẬT KÝ LÊN CLOUD</span>
        <span>
          {scheduled ? `Lịch dự kiến ${scheduled} · ` : ""}Từng bước nhỏ, mỗi
          ngày.
        </span>
      </div>
      <main id="main" ref={mainRef} tabIndex={-1} className="main-container">
        {notice && (
          <div className="notice" role="alert">
            {notice}
            <a href="#/settings">Mở Tiến độ</a>
            <button aria-label="Ẩn thông báo" onClick={() => setNotice("")}>
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        )}
        <Suspense
          fallback={
            <p className="loading-state" role="status">
              Đang tải không gian học…
            </p>
          }
        >
          {!days.length ? (
            <div className="empty-state">
              <h1>Chưa có bài học</h1>
              <p>Hãy kiểm tra các manifest trong thư mục content.</p>
            </div>
          ) : path === "today" ? (
            <Dashboard progress={progress} />
          ) : path === "roadmap" ? (
            <Roadmap key={route} progress={progress} />
          ) : path === "labs" ? (
            <Labs />
          ) : path === "sources" ? (
            <Sources />
          ) : path === "settings" ? (
            <Settings progress={progress} setProgress={setProgress} />
          ) : lesson ? (
            <LessonReader
              key={lesson.id}
              lesson={lesson}
              progress={progress}
              setProgress={setProgress}
            />
          ) : (
            <div className="empty-state">
              <h1>Không tìm thấy trang này</h1>
              <p>
                Đường dẫn có thể chưa đúng. Bạn có thể quay lại lộ trình để chọn
                bài.
              </p>
              <a className="button primary" href="#/roadmap">
                Về lộ trình
              </a>
            </div>
          )}
        </Suspense>
      </main>
      <footer className="site-footer">
        <div>
          <a className="brand footer-brand" href="#/today">
            <Cloud size={18} aria-hidden="true" />
            <span>
              aws / <strong>daily lab.</strong>
            </span>
          </a>
          <span>Học một chút. Xây được nhiều hơn.</span>
        </div>
        <a
          href="https://github.com/jamezmca/aws-full-course"
          target="_blank"
          rel="noreferrer"
        >
          Lấy cảm hứng từ AWS Full Course
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </footer>
    </>
  );
}
