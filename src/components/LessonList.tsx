import type { Day, Progress } from "../lib/types";
import { kindLabels } from "../lib/content";
import {
  ArrowUpRight,
  Check,
  Clock3,
  Code2,
  BookOpen,
  FlaskConical,
} from "./Icons";

export function LessonList({
  day,
  progress,
}: {
  day: Day;
  progress: Progress;
}) {
  return (
    <ol className="lesson-list">
      {day.lessons.map((lesson, index) => {
        const complete = progress.completed.includes(lesson.id);
        const Icon =
          lesson.kind === "concept"
            ? BookOpen
            : lesson.kind === "lab"
              ? Code2
              : FlaskConical;
        return (
          <li key={lesson.id}>
            <a
              className={`lesson-row ${complete ? "is-complete" : ""}`}
              href={`#/lesson/${lesson.id}`}
            >
              <span className="lesson-number mono">
                {complete ? (
                  <Check size={18} aria-label="Đã hoàn thành" />
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </span>
              <span className="lesson-info">
                <span className="lesson-title">{lesson.title}</span>
                <span className="lesson-meta">
                  <Icon size={13} aria-hidden="true" />
                  {kindLabels[lesson.kind]}
                  <span className="meta-separator">·</span>
                  {lesson.services.join(" / ")}
                </span>
              </span>
              <span className="lesson-duration">
                <Clock3 size={14} aria-hidden="true" />
                {lesson.minutes} phút
              </span>
              <ArrowUpRight
                className="row-arrow"
                size={18}
                aria-hidden="true"
              />
            </a>
          </li>
        );
      })}
    </ol>
  );
}
