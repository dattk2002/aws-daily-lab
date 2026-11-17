import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptyProgress,
  parseProgress,
  toggleCompleted,
  getCurrentDay,
} from "./progress.ts";

const choices = { "01-1": 3, "01-2": 3, "02-1": 4 };
test("corrupt JSON and unsupported exports fail without a partial result", () => {
  assert.throws(() => parseProgress("{", choices));
  assert.throws(() => parseProgress('{"version":2}', choices));
});
test("a valid export preserves completion, answer and Unicode notes", () => {
  assert.deepEqual(
    parseProgress(
      JSON.stringify({
        version: 1,
        completed: ["01-1"],
        answers: { "01-1": 2 },
        notes: { "01-2": "Cần ôn lại TLS" },
      }),
      choices,
    ),
    {
      version: 1,
      completed: ["01-1"],
      answers: { "01-1": 2 },
      notes: { "01-2": "Cần ôn lại TLS" },
    },
  );
});
test("rejects unknown or duplicate completions and invalid quiz options", () => {
  const base = { version: 1, completed: [], answers: {}, notes: {} };
  for (const changes of [
    { completed: ["99-1"] },
    { completed: ["01-1", "01-1"] },
    { answers: { "01-1": 3 } },
    { answers: { "01-1": -1 } },
    { notes: { "02-1": 5 } },
    { answers: { "99-1": 0 } },
  ]) {
    assert.throws(() =>
      parseProgress(JSON.stringify({ ...base, ...changes }), choices),
    );
  }
});
test("completion toggles immutably without changing other learning data", () => {
  const previous = emptyProgress();
  const next = toggleCompleted(previous, "01-1");
  assert.deepEqual(previous.completed, []);
  assert.deepEqual(next.completed, ["01-1"]);
  assert.deepEqual(toggleCompleted(next, "01-1").completed, []);
});
test("resume picks earliest incomplete day, including holes in later completion", () => {
  const days = [
    { day: 1, lessons: [{ id: "01-1" }, { id: "01-2" }] },
    { day: 2, lessons: [{ id: "02-1" }] },
  ];
  assert.equal(getCurrentDay(days, ["01-1", "02-1"]).day, 1);
  assert.equal(getCurrentDay(days, ["01-1", "01-2"]).day, 2);
  assert.equal(getCurrentDay(days, ["01-1", "01-2", "02-1"]).day, 2);
});
