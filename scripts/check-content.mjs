import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const sections = [
  "Mục tiêu",
  "Hiểu nhanh",
  "Thực hành",
  "Kiểm tra kết quả",
  "Lỗi thường gặp",
  "Dọn dẹp",
  "Tài liệu",
];
export function validateCurriculum(
  days,
  bodies,
  expected = { days: 20, lessonsPerDay: 5 },
) {
  const errors = [];
  const seen = new Set();
  if (days.length !== expected.days)
    errors.push(`Expected ${expected.days} days, got ${days.length}`);
  for (const [index, day] of days.entries()) {
    if (
      day.day !== index + 1 ||
      !day.title ||
      !day.summary ||
      !["core", "extension"].includes(day.track)
    )
      errors.push(`Invalid day metadata: ${day.day}`);
    if (
      !Array.isArray(day.lessons) ||
      day.lessons.length !== expected.lessonsPerDay
    ) {
      errors.push(`Day ${day.day}: expected ${expected.lessonsPerDay} lessons`);
      continue;
    }
    for (const [i, lesson] of day.lessons.entries()) {
      const id = lesson.id;
      if (seen.has(id)) errors.push(`${id}: duplicate ID`);
      const wanted = `${String(day.day).padStart(2, "0")}-${i + 1}`;
      if (id !== wanted) errors.push(`${id}: expected ordered ID ${wanted}`);
      if (
        !lesson.title ||
        !Number.isInteger(lesson.minutes) ||
        lesson.minutes < 5 ||
        lesson.minutes > 30 ||
        !["concept", "lab", "challenge"].includes(lesson.kind) ||
        !Array.isArray(lesson.services) ||
        !lesson.services.length
      )
        errors.push(`${id}: invalid lesson metadata`);
      if (
        !Array.isArray(lesson.prerequisites) ||
        lesson.prerequisites.some((p) => !seen.has(p))
      )
        errors.push(`${id}: missing or forward prerequisite`);
      const q = lesson.quiz;
      if (
        !q?.question ||
        !q?.explanation ||
        !Array.isArray(q?.options) ||
        q.options.length < 3 ||
        q.options.length > 4 ||
        q.options.some((o) => typeof o !== "string" || !o.trim()) ||
        new Set(q.options).size !== q.options.length ||
        !Number.isInteger(q.answer) ||
        q.answer < 0 ||
        q.answer >= q.options.length
      )
        errors.push(`${id}: invalid quiz`);
      const body = bodies[id];
      if (typeof body !== "string") errors.push(`${id}: missing Markdown`);
      else {
        if (body.length < 1600)
          errors.push(`${id}: Markdown too short (${body.length})`);
        for (const section of sections)
          if (!body.split("\n").some((line) => line.trim() === `## ${section}`))
            errors.push(`${id}: missing ${section}`);
        if (
          !/https:\/\/(docs\.aws\.amazon\.com|aws\.amazon\.com|docs\.github\.com|nodejs\.org|node-postgres\.com|www\.postgresql\.org|docs\.docker\.com|developer\.mozilla\.org|nginx\.org|pm2\.keymetrics\.io)/.test(
            body,
          )
        )
          errors.push(`${id}: missing primary source`);
      }
      seen.add(id);
    }
  }
  return errors;
}

export async function readCurriculum(
  root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
) {
  const dirs = (await readdir(path.join(root, "content")))
    .filter((d) => /^day-\d{2}$/.test(d))
    .sort();
  const days = [];
  const bodies = {};
  for (const dir of dirs) {
    const folder = path.join(root, "content", dir);
    const day = JSON.parse(
      await readFile(path.join(folder, "day.json"), "utf8"),
    );
    days.push(day);
    for (let i = 1; i <= 5; i++) {
      try {
        bodies[`${dir.slice(4)}-${i}`] = await readFile(
          path.join(folder, `${i}.md`),
          "utf8",
        );
      } catch {
        /* Report missing files through the shared validator. */
      }
    }
  }
  return { days, bodies };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const { days, bodies } = await readCurriculum();
  const errors = validateCurriculum(days, bodies);
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      `Content verified: ${days.length} days, ${Object.keys(bodies).length} lessons, quizzes, prerequisites, sections and sources.`,
    );
}
