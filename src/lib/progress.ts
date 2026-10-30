"use client";

import { useSyncExternalStore } from "react";
import type { Lesson, Unit } from "./types";
import { lessonKey } from "./content";

export type LessonProgress = { seen: string[]; quiz?: number; quizTotal?: number };
type Store = Record<string, LessonProgress>;

const KEY = "lughati-progress-v1";
const listeners = new Set<() => void>();
let cache: Store | null = null;
const EMPTY: Store = {};

// Progress lasts only for the current visit (this tab): every new visit starts from 0%.
function read(): Store {
  if (cache) return cache;
  try {
    localStorage.removeItem(KEY); // clear progress saved by earlier versions of the site
    cache = JSON.parse(sessionStorage.getItem(KEY) || "{}") as Store;
  } catch {
    cache = {};
  }
  return cache;
}

function write(next: Store) {
  cache = next;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage may be unavailable (private mode) — progress stays in memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useProgress(): Store {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function markSeen(unit: string, lesson: string, section: string) {
  const s = read();
  const k = lessonKey(unit, lesson);
  const cur = s[k] ?? { seen: [] };
  if (cur.seen.includes(section)) return;
  write({ ...s, [k]: { ...cur, seen: [...cur.seen, section] } });
}

export function saveQuiz(unit: string, lesson: string, score: number, total: number) {
  const s = read();
  const k = lessonKey(unit, lesson);
  const cur = s[k] ?? { seen: [] };
  write({ ...s, [k]: { ...cur, quiz: Math.max(score, cur.quiz ?? 0), quizTotal: total } });
}

export function resetProgress() {
  write({});
}

/** 70% weight on sections read, 30% on having taken the quiz. */
export function lessonPercent(store: Store, unit: string, lesson: Lesson) {
  const p = store[lessonKey(unit, lesson.slug)];
  if (!p) return 0;
  const seen = lesson.sections.filter((s) => p.seen.includes(s.id)).length;
  const read = seen / lesson.sections.length;
  return Math.round((read * 0.7 + (p.quizTotal ? 0.3 : 0)) * 100);
}

export function unitPercent(store: Store, unit: Unit) {
  if (!unit.lessons.length) return 0;
  const sum = unit.lessons.reduce((a, l) => a + lessonPercent(store, unit.slug, l), 0);
  return Math.round(sum / unit.lessons.length);
}
