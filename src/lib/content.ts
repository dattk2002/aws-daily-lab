import type { Day, Lesson } from "./types";

const manifests = import.meta.glob<Day>("/content/day-*/day.json", {
  eager: true,
  import: "default",
});
export const days: Day[] = Object.values(manifests)
  .sort((a, b) => a.day - b.day)
  .map((day) => ({
    ...day,
    lessons: day.lessons.map((l) => ({ ...l, day: day.day })),
  }));
export const lessons = days.flatMap((day) => day.lessons);
export const lessonMap = new Map(lessons.map((lesson) => [lesson.id, lesson]));
export const answerChoices = Object.fromEntries(
  lessons.map((l) => [l.id, l.quiz.options.length]),
);
const bodies = import.meta.glob<string>("/content/day-*/*.md", {
  query: "?raw",
  import: "default",
});
export async function loadLesson(lesson: Lesson): Promise<string> {
  const [day, index] = lesson.id.split("-");
  const loader = bodies[`/content/day-${day}/${index}.md`];
  if (!loader) throw new Error("Không tìm thấy nội dung bài học.");
  return loader();
}
export const kindLabels = {
  concept: "Nền tảng",
  lab: "Thực hành",
  challenge: "Thử thách",
};
