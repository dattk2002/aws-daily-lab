import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Progress } from "../lib/types";
import { answerChoices } from "../lib/content";
import { emptyProgress, parseProgress } from "../lib/progress";
import { Download, Upload } from "./Icons";

export function Settings({
  progress,
  setProgress,
}: {
  progress: Progress;
  setProgress: Dispatch<SetStateAction<Progress>>;
}) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dateError, setDateError] = useState("");
  function exportProgress() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(progress, null, 2)], {
        type: "application/json",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "aws-daily-lab-progress.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Đã xuất tệp. Hãy giữ bản sao để chuyển sang thiết bị khác.");
    setError("");
  }
  return (
    <>
      <header className="page-heading">
        <div className="eyebrow">HỌC THEO NHỊP CỦA BẠN</div>
        <h1>Tiến độ thuộc về bạn.</h1>
        <p>
          {progress.completed.length}/100 bài đã hoàn thành. Dữ liệu lưu trên
          trình duyệt hiện tại, chưa đồng bộ giữa các thiết bị.
        </p>
      </header>
      <div className="settings-grid">
        <section className="settings-card">
          <h2>Ngày bắt đầu hành trình</h2>
          <p>
            Chọn ngày để xem lịch dự kiến theo giờ Việt Nam. Bạn luôn có thể học
            trước hoặc học bù.
          </p>
          <label htmlFor="start-date">Ngày bắt đầu</label>
          <input
            id="start-date"
            type="date"
            min="2000-01-01"
            max="2100-12-31"
            aria-invalid={!!dateError}
            aria-describedby={dateError ? "start-date-error" : undefined}
            value={progress.startDate ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (
                !e.target.validity.valid ||
                (value && !/^\d{4}-\d{2}-\d{2}$/.test(value))
              ) {
                setDateError(
                  "Ngày bắt đầu không hợp lệ; chọn ngày từ năm 2000 đến 2100.",
                );
                return;
              }
              setDateError("");
              setProgress((p) => {
                const { startDate: _previous, ...rest } = p;
                return value ? { ...rest, startDate: value } : rest;
              });
            }}
          />
          {dateError && (
            <p id="start-date-error" className="error-message" role="alert">
              {dateError}
            </p>
          )}
          <p className="text-muted">
            Giao diện gợi ý ngày đầu tiên còn bài chưa hoàn thành.
          </p>
        </section>
        <section className="settings-card">
          <h2>Sao lưu & chuyển thiết bị</h2>
          <p>
            Xuất tiến độ, đáp án và ghi chú ra JSON. Khi nhập, dữ liệu hiện tại
            chỉ được thay sau khi tệp hợp lệ và bạn xác nhận.
          </p>
          <div className="settings-actions">
            <button className="button secondary" onClick={exportProgress}>
              <Download size={16} aria-hidden="true" />
              Xuất tiến độ
            </button>
            <label className="button secondary file-button">
              <Upload size={16} aria-hidden="true" />
              Nhập tiến độ
              <input
                aria-label="Nhập tệp tiến độ"
                type="file"
                accept="application/json,.json"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  setError("");
                  setMessage("");
                  try {
                    if (file.size > 2_000_000)
                      throw new Error("Tệp quá lớn (tối đa 2 MB).");
                    const imported = parseProgress(
                      await file.text(),
                      answerChoices,
                    );
                    if (
                      window.confirm(
                        "Thay tiến độ trên trình duyệt này bằng dữ liệu trong tệp?",
                      )
                    ) {
                      setProgress(imported);
                      setMessage("Đã nhập tiến độ thành công.");
                    }
                  } catch (err) {
                    setError(
                      err instanceof Error
                        ? err.message
                        : "Không đọc được tệp tiến độ.",
                    );
                  }
                }}
              />
            </label>
          </div>
          {message && (
            <p className="status-message" role="status">
              {message}
            </p>
          )}
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
        </section>
        <section className="settings-card danger-card">
          <h2>Bắt đầu lại</h2>
          <p>
            Xóa tiến độ, đáp án, ghi chú và ngày bắt đầu trên trình duyệt này.
            Bạn nên xuất bản sao trước khi xóa.
          </p>
          <button
            className="button danger-button"
            onClick={() => {
              if (
                window.confirm(
                  "Xóa toàn bộ tiến độ, đáp án và ghi chú trên trình duyệt này? Hành động này không thể hoàn tác nếu chưa xuất bản sao.",
                )
              ) {
                setProgress(emptyProgress());
                setMessage("Đã xóa tiến độ trên trình duyệt này.");
                setError("");
              }
            }}
          >
            Xóa toàn bộ tiến độ
          </button>
        </section>
      </div>
    </>
  );
}
