import { test } from "node:test";
import assert from "node:assert/strict";
import { validateCurriculum } from "./check-content.mjs";

const body =
  "# Bài học\n" +
  [
    "Mục tiêu",
    "Hiểu nhanh",
    "Thực hành",
    "Kiểm tra kết quả",
    "Lỗi thường gặp",
    "Dọn dẹp",
    "Tài liệu",
  ]
    .map(
      (h) =>
        `## ${h}\n${"Giải thích một tình huống và kiểm tra kết quả. ".repeat(8)}\n`,
    )
    .join("\n") +
  "\nhttps://docs.aws.amazon.com/ec2/";
const lesson = {
  id: "01-1",
  title: "AWS",
  minutes: 10,
  kind: "concept",
  services: ["EC2"],
  prerequisites: [],
  quiz: {
    question: "Q?",
    options: ["A", "B", "C"],
    answer: 0,
    explanation: "Because.",
  },
};
const day = {
  day: 1,
  title: "First",
  summary: "Intro",
  track: "core",
  lessons: [lesson],
};
test("accepts complete content against an explicit small test curriculum", () => {
  assert.deepEqual(
    validateCurriculum([day], { "01-1": body }, { days: 1, lessonsPerDay: 1 }),
    [],
  );
});
test("rejects missing sections, bad prerequisites and invalid quiz options", () => {
  const invalid = {
    ...day,
    lessons: [
      {
        ...lesson,
        prerequisites: ["99-1"],
        quiz: { ...lesson.quiz, answer: 8 },
      },
    ],
  };
  const errors = validateCurriculum(
    [invalid],
    { "01-1": body.replace("## Dọn dẹp", "## Missing") },
    { days: 1, lessonsPerDay: 1 },
  );
  assert.ok(errors.some((e) => e.includes("Dọn dẹp")));
  assert.ok(errors.some((e) => e.includes("prerequisite")));
  assert.ok(errors.some((e) => e.includes("quiz")));
});
test("rejects duplicate IDs and missing lesson files", () => {
  const errors = validateCurriculum(
    [{ ...day, lessons: [lesson, lesson] }],
    {},
    { days: 1, lessonsPerDay: 2 },
  );
  assert.ok(errors.some((e) => e.includes("duplicate")));
  assert.ok(errors.some((e) => e.includes("Markdown")));
});
