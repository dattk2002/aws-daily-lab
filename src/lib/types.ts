export type Quiz = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};
export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  kind: "concept" | "lab" | "challenge";
  services: string[];
  prerequisites: string[];
  quiz: Quiz;
  day: number;
};
export type Day = {
  day: number;
  title: string;
  summary: string;
  track: "core" | "extension";
  lessons: Lesson[];
};
export type Progress = {
  version: 1;
  completed: string[];
  answers: Record<string, number>;
  notes: Record<string, string>;
  startDate?: string;
};
