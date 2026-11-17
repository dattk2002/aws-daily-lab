import type { Progress } from "./types.ts";
export const emptyProgress = (): Progress => ({
  version: 1,
  completed: [],
  answers: {},
  notes: {},
});
export function parseProgress(
  raw: string,
  choices: Record<string, number>,
): Progress {
  if (raw.length > 2_000_000) throw new Error("Tệp quá lớn (tối đa 2 MB).");
  const value: unknown = JSON.parse(raw);
  const record = (v: unknown): v is Record<string, unknown> =>
    !!v && typeof v === "object" && !Array.isArray(v);
  const known = (id: unknown): id is string =>
    typeof id === "string" && Object.hasOwn(choices, id);
  if (
    !record(value) ||
    value.version !== 1 ||
    !Array.isArray(value.completed) ||
    !record(value.answers) ||
    !record(value.notes)
  )
    throw new Error(
      "Định dạng tiến độ không hợp lệ hoặc phiên bản chưa hỗ trợ.",
    );
  if (
    !value.completed.every(known) ||
    new Set(value.completed).size !== value.completed.length
  )
    throw new Error("Danh sách hoàn thành có bài lạ hoặc trùng lặp.");
  for (const [id, answer] of Object.entries(value.answers)) {
    if (
      !known(id) ||
      typeof answer !== "number" ||
      !Number.isInteger(answer) ||
      answer < 0 ||
      answer >= choices[id]
    )
      throw new Error("Đáp án lưu không hợp lệ.");
  }
  for (const [id, note] of Object.entries(value.notes)) {
    if (!known(id) || typeof note !== "string" || note.length > 10_000)
      throw new Error("Ghi chú không hợp lệ hoặc quá 10.000 ký tự.");
  }
  if (
    value.startDate !== undefined &&
    (typeof value.startDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(value.startDate) ||
      !Number.isFinite(Date.parse(value.startDate)) ||
      new Date(value.startDate).toISOString().slice(0, 10) !== value.startDate)
  )
    throw new Error("Ngày bắt đầu không hợp lệ.");
  return {
    version: 1,
    completed: [...value.completed],
    answers: { ...value.answers } as Record<string, number>,
    notes: { ...value.notes } as Record<string, string>,
    ...(typeof value.startDate === "string"
      ? { startDate: value.startDate }
      : {}),
  };
}
export function toggleCompleted(progress: Progress, id: string): Progress {
  return {
    ...progress,
    completed: progress.completed.includes(id)
      ? progress.completed.filter((v) => v !== id)
      : [...progress.completed, id],
  };
}
export function getCurrentDay<
  T extends { day: number; lessons: { id: string }[] },
>(days: T[], completed: string[]): T {
  const done = new Set(completed);
  return (
    days.find((day) => day.lessons.some((lesson) => !done.has(lesson.id))) ??
    days[days.length - 1]
  );
}
