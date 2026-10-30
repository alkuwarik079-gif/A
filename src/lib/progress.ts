"use client";

import { useSyncExternalStore } from "react";
import type { Lesson, Unit } from "./types";
import { lessonKey } from "./content";

export type LessonProgress = { seen: string[]; quiz?: number; quizTotal?: number };
type Store = Record<string, LessonProgress>;

// Saved on each device separately (localStorage), so every phone/computer has its own score.
// A fresh key means everyone starts this version at 0%.
const KEY = "arabic100-progress";
const OLD_KEY = "lughati-progress-v1";
const listeners = new Set<() => void>();
let cache: Store | null = null;
const EMPTY: Store = {};

function read(): Store {
  if (cache) return cache;
  try {
    localStorage.removeItem(OLD_KEY);
    cache = JSON.parse(localStorage.getItem(KEY) || "{}") as Store;
  } catch {
    cache = {};
  }
  return cache;
}

function write(next: Store) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage may be unavailable (private mode) — progress stays in memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  // keep other open tabs on the same device in sync
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
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
