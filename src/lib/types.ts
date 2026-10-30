export type WidgetId =
  | "styles-compare"
  | "essay-model"
  | "paragraph-annotate"
  | "summary-slider"
  | "commentary-model"
  | "evidence-game"
  | "rhetoric-tree"
  | "hamza-calc"
  | "punctuation-game";

export type Block =
  | { t: "p"; text: string }
  | { t: "list"; items: string[]; ordered?: boolean }
  | { t: "example"; title?: string; text: string }
  | { t: "note"; text: string }
  | { t: "cards"; items: { title: string; body: string; tag?: string }[] }
  | { t: "steps"; title?: string; items: { title: string; body: string }[] }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "phrases"; tone: "agree" | "disagree" | "neutral"; title: string; items: string[] }
  | { t: "flips"; items: { name: string; tools: string; example: string; note?: string }[] }
  | { t: "widget"; id: WidgetId };

export type Section = {
  id: string;
  title: string;
  kicker?: string;
  blocks: Block[];
};

export type QuizQ = {
  q: string;
  options: string[];
  answer: number;
  why?: string;
};

export type Lesson = {
  slug: string;
  num: number;
  title: string;
  summary: string;
  author?: string;
  sections: Section[];
  quiz: QuizQ[];
};

export type Unit = {
  slug: "writing" | "rhetoric" | "grammar" | "texts";
  num: number;
  title: string;
  short: string;
  english: string;
  tagline: string;
  glyph: string;
  lessons: Lesson[];
};
