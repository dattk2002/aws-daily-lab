import { useEffect, useRef, useState } from "react";
import type {
  ComponentProps,
  Dispatch,
  ReactNode,
  SetStateAction,
} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  days,
  kindLabels,
  lessonMap,
  lessons,
  loadLesson,
} from "../lib/content";
import { toggleCompleted } from "../lib/progress";
import type { Lesson, Progress } from "../lib/types";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Copy,
} from "./Icons";

const slug = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
function CodeBlock({ children }: ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState("Sao chép");
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span className="mono">CODE</span>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                ref.current?.textContent ?? "",
              );
              setCopied("Đã sao chép");
            } catch {
              setCopied("Hãy chọn và sao chép thủ công");
            }
          }}
        >
          <Copy size={13} aria-hidden="true" />
          {copied}
        </button>
      </div>
      <pre ref={ref}>{children}</pre>
    </div>
  );
}
function Quiz({
  lesson,
  progress,
  setProgress,
}: {
  lesson: Lesson;
  progress: Progress;
  setProgress: Dispatch<SetStateAction<Progress>>;
}) {
  const saved = progress.answers[lesson.id];
  const [selected, setSelected] = useState<number | undefined>(saved);
  const [submitted, setSubmitted] = useState<number | undefined>(saved);
  return (
    <section className="quiz-card" aria-labelledby="quiz-title">
      <div className="eyebrow">
        <BookOpen size={14} aria-hidden="true" /> DỪNG LẠI MỘT CHÚT
      </div>
      <h2 id="quiz-title">Tự kiểm tra</h2>
      <fieldset>
        <legend>{lesson.quiz.question}</legend>
        {lesson.quiz.options.map((option, i) => (
          <label
            key={i}
            className={`quiz-option ${selected === i ? "selected" : ""}`}
          >
            <input
              type="radio"
              name={`quiz-${lesson.id}`}
              checked={selected === i}
              onChange={() => {
                setSelected(i);
                setSubmitted(undefined);
              }}
            />
            <span className="option-letter mono">
              {String.fromCharCode(65 + i)}
            </span>
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
      <button
        className="button primary"
        disabled={selected === undefined}
        onClick={() => {
          if (selected !== undefined) {
            setSubmitted(selected);
            setProgress((p) => ({
              ...p,
              answers: { ...p.answers, [lesson.id]: selected },
            }));
          }
        }}
      >
        Kiểm tra đáp án
        <ArrowRight size={15} aria-hidden="true" />
      </button>
      {submitted !== undefined && (
        <div
          role="status"
          data-testid="quiz-feedback"
          className={`quiz-feedback ${submitted === lesson.quiz.answer ? "correct" : "incorrect"}`}
        >
          <strong>
            {submitted === lesson.quiz.answer
              ? "Chính xác. Bạn đã nắm được ý chính."
              : "Chưa đúng. Cùng xem lại cách giải thích."}
          </strong>
          <p>{lesson.quiz.explanation}</p>
          <p>Đáp án: {lesson.quiz.options[lesson.quiz.answer]}</p>
        </div>
      )}
    </section>
  );
}
function resolveLink(href: string | undefined, lesson: Lesson) {
  if (!href || /^(https?:|mailto:|#)/.test(href)) return href;
  const match = href.match(/day-(\d{2})\/([1-5])\.md/);
  if (match) return `#/lesson/${match[1]}-${match[2]}`;
  return new URL(
    href,
    `https://github.com/dattk2002/aws-daily-lab/blob/main/content/day-${String(lesson.day).padStart(2, "0")}/${lesson.id.split("-")[1]}.md`,
  ).href;
}
export function LessonReader({
  lesson,
  progress,
  setProgress,
}: {
  lesson: Lesson;
  progress: Progress;
  setProgress: Dispatch<SetStateAction<Progress>>;
}) {
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setBody("");
    setError("");
    loadLesson(lesson)
      .then((value) => {
        if (active) setBody(value);
      })
      .catch(() => {
        if (active)
          setError("Chưa tải được nội dung. Kiểm tra kết nối và thử lại.");
      });
    return () => {
      active = false;
    };
  }, [lesson, retry]);
  const day = days.find((d) => d.day === lesson.day)!;
  const index = lessons.findIndex((l) => l.id === lesson.id);
  const done = progress.completed.includes(lesson.id);
  const headings = body
    .split("\n")
    .filter((line) => /^## /.test(line))
    .map((line) => line.slice(3).trim());
  const jump = (title: string) =>
    document
      .getElementById(slug(title))
      ?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
  return (
    <>
      <nav className="breadcrumbs" aria-label="Đường dẫn">
        <a href="#/roadmap">Lộ trình</a>
        <span>/</span>
        <a href={`#/roadmap?day=${day.day}`}>Ngày {day.day}</a>
        <span>/</span>
        <span>Bài {lesson.id.split("-")[1]}</span>
      </nav>
      <div className="reader-layout">
        <article className="reader-article">
          <div className="reader-header">
            <div className="eyebrow">
              NGÀY {String(day.day).padStart(2, "0")} ·{" "}
              {kindLabels[lesson.kind].toUpperCase()}
            </div>
            <h1>{lesson.title}</h1>
            <div className="reader-meta">
              <span>
                <Clock3 size={14} aria-hidden="true" />~{lesson.minutes} phút
              </span>
              <span>{lesson.services.join(" / ")}</span>
              <span>{day.track === "core" ? "Tuyến chính" : "Mở rộng"}</span>
            </div>
            {lesson.prerequisites.length > 0 && (
              <p className="prerequisites">
                Nên học trước:{" "}
                {lesson.prerequisites.map((id, i) => (
                  <span key={id}>
                    {i > 0 && ", "}
                    <a href={`#/lesson/${id}`}>
                      {lessonMap.get(id)?.title ?? id}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </div>
          {error ? (
            <div className="notice" role="alert">
              {error}
              <button
                className="button secondary"
                onClick={() => setRetry((n) => n + 1)}
              >
                Tải lại bài
              </button>
            </div>
          ) : !body ? (
            <p className="loading-state" role="status">
              Đang tải bài học…
            </p>
          ) : (
            <div className="markdown">
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: () => null,
                  h2: ({ children }: { children?: ReactNode }) => (
                    <h2 id={slug(String(children))}>{children}</h2>
                  ),
                  pre: CodeBlock,
                  a: ({ href, children }) =>
                    href?.startsWith("#") && !href.startsWith("#/") ? (
                      <a
                        href={window.location.hash}
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById(href.slice(1))
                            ?.scrollIntoView();
                        }}
                      >
                        {children}
                      </a>
                    ) : (
                      <a
                        href={resolveLink(href, lesson)}
                        {...(href?.startsWith("http")
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                      >
                        {children}
                      </a>
                    ),
                }}
              >
                {body}
              </Markdown>
            </div>
          )}
          {body && (
            <>
              <Quiz
                key={lesson.id}
                lesson={lesson}
                progress={progress}
                setProgress={setProgress}
              />
              <section className="notes-section">
                <label htmlFor="lesson-notes">Ghi chú của bạn</label>
                <p className="text-muted">
                  Lưu trên trình duyệt này. Ghi lại điều đã hiểu hoặc lỗi đã
                  gặp; tránh ghi thông tin bí mật.
                </p>
                <textarea
                  id="lesson-notes"
                  maxLength={10_000}
                  rows={4}
                  placeholder="Mình đã học được gì từ bài này?"
                  value={progress.notes[lesson.id] ?? ""}
                  onChange={(e) =>
                    setProgress((p) => ({
                      ...p,
                      notes: { ...p.notes, [lesson.id]: e.target.value },
                    }))
                  }
                />
              </section>
              <div className="completion-panel">
                <div>
                  <strong>
                    {done
                      ? "Một bước nữa đã hoàn thành."
                      : "Bạn đã hiểu và thử được rồi chứ?"}
                  </strong>
                  <p>
                    {done
                      ? "Bạn có thể quay lại ôn bất cứ lúc nào."
                      : "Đánh dấu khi bạn sẵn sàng đi tiếp."}
                  </p>
                </div>
                <button
                  className={`button ${done ? "completed-button" : "primary"}`}
                  aria-pressed={done}
                  onClick={() =>
                    setProgress((p) => toggleCompleted(p, lesson.id))
                  }
                >
                  {done ? (
                    <CheckCircle2 size={17} aria-hidden="true" />
                  ) : (
                    <Check size={17} aria-hidden="true" />
                  )}
                  {done ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
                </button>
              </div>
            </>
          )}
          <nav className="lesson-navigation" aria-label="Chuyển bài">
            {index > 0 ? (
              <a href={`#/lesson/${lessons[index - 1].id}`}>
                <ChevronLeft size={18} aria-hidden="true" />
                <span>
                  <small>Bài trước</small>
                  {lessons[index - 1].title}
                </span>
              </a>
            ) : (
              <span />
            )}
            {index < lessons.length - 1 ? (
              <a
                className="next-lesson"
                href={`#/lesson/${lessons[index + 1].id}`}
              >
                <span>
                  <small>Bài tiếp theo</small>
                  {lessons[index + 1].title}
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            ) : (
              <a href="#/today">
                Về trang hôm nay
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            )}
          </nav>
        </article>
        <aside className="reader-sidebar">
          <div className="reader-sidebar-inner">
            <span className="eyebrow">TRONG BÀI NÀY</span>
            <nav aria-label="Mục lục bài học">
              {headings.map((title) => (
                <button key={title} onClick={() => jump(title)}>
                  {title}
                </button>
              ))}
              <button
                onClick={() =>
                  document.getElementById("quiz-title")?.scrollIntoView()
                }
              >
                Tự kiểm tra
              </button>
            </nav>
            <div className="sidebar-divider" />
            <span className="eyebrow">
              NGÀY {String(day.day).padStart(2, "0")}
            </span>
            <nav aria-label="Bài học trong ngày">
              {day.lessons.map((l, i) => (
                <a
                  key={l.id}
                  className={l.id === lesson.id ? "active" : ""}
                  href={`#/lesson/${l.id}`}
                  aria-current={l.id === lesson.id ? "page" : undefined}
                >
                  <span>
                    {progress.completed.includes(l.id) ? (
                      <Check size={14} aria-label="Hoàn thành" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  {l.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </>
  );
}
