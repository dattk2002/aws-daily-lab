import { useState } from "react";
import { days } from "../lib/content";
import type { Progress } from "../lib/types";
import { LessonList } from "./LessonList";
import { Search, CheckCircle2, ChevronDown } from "./Icons";

export function Roadmap({ progress }: { progress: Progress }) {
  const [search, setSearch] = useState("");
  const [track, setTrack] = useState("all");
  const [status, setStatus] = useState("all");
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .toLowerCase();
  const visible = days.filter(
    (day) =>
      (track === "all" || day.track === track) &&
      (status === "all" ||
        (status === "done"
          ? day.lessons.every((l) => progress.completed.includes(l.id))
          : day.lessons.some((l) => !progress.completed.includes(l.id)))) &&
      normalize(
        [
          day.title,
          day.summary,
          ...day.lessons.flatMap((l) => [l.title, ...l.services]),
        ].join(" "),
      ).includes(normalize(search)),
  );
  const startDay = Number(
    new URLSearchParams(window.location.hash.split("?")[1]).get("day"),
  );
  return (
    <>
      <header className="page-heading">
        <div className="eyebrow">BẢN ĐỒ HỌC TẬP</div>
        <h1>
          Những bước nhỏ.
          <br />
          <span>Một hành trình rõ ràng.</span>
        </h1>
        <p>
          20 ngày, 100 bài học. Học tuần tự, quay lại ôn tập, hoặc tìm đúng điều
          bạn đang cần.
        </p>
      </header>
      <div className="filter-bar">
        <label className="search-field">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            aria-label="Tìm bài học hoặc dịch vụ"
            placeholder="Tìm bài học, EC2, RDS, CI/CD..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="select-field">
          <span className="sr-only">Lọc theo tiến độ</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">Mọi tiến độ</option>
            <option value="todo">Chưa hoàn thành</option>
            <option value="done">Đã hoàn thành</option>
          </select>
        </label>
      </div>
      <div className="filter-tabs" role="group" aria-label="Lọc theo tuyến">
        <div>
          {[
            ["all", "Toàn bộ lộ trình"],
            ["core", "Tuyến chính"],
            ["extension", "Mở rộng"],
          ].map(([value, label]) => (
            <button
              key={value}
              aria-pressed={track === value}
              className={track === value ? "selected" : ""}
              onClick={() => setTrack(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <span>{visible.length} ngày học</span>
      </div>
      {visible.length ? (
        <div className="roadmap-grid">
          {visible.map((day) => {
            const complete = day.lessons.filter((l) =>
              progress.completed.includes(l.id),
            ).length;
            return (
              <details
                className="roadmap-day"
                key={day.day}
                open={search.length > 0 || day.day === (startDay || 1)}
              >
                <summary>
                  <span className="roadmap-number mono">
                    {String(day.day).padStart(2, "0")}
                  </span>
                  <span className="roadmap-day-info">
                    <span className="tiny-label">
                      {day.track === "core" ? "Tuyến chính" : "Mở rộng"}
                    </span>
                    <strong>{day.title}</strong>
                    <span>{day.summary}</span>
                  </span>
                  <span className="roadmap-count">
                    {complete === 5 && (
                      <CheckCircle2 size={16} aria-label="Hoàn thành" />
                    )}
                    {complete}/5
                  </span>
                  <ChevronDown
                    className="details-chevron"
                    size={18}
                    aria-hidden="true"
                  />
                </summary>
                <LessonList day={day} progress={progress} />
              </details>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={32} aria-hidden="true" />
          <h2>Chưa tìm thấy bài phù hợp</h2>
          <p>Thử từ khóa khác hoặc mở rộng bộ lọc.</p>
          <button
            className="button secondary"
            onClick={() => {
              setSearch("");
              setTrack("all");
              setStatus("all");
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </>
  );
}
