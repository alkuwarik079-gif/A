import type { Unit } from "../types";
import { writing } from "./writing";
import { rhetoric } from "./rhetoric";
import { grammar } from "./grammar";
import { texts } from "./texts";

export const units: Unit[] = [writing, rhetoric, grammar, texts];

export function getUnit(slug: string) {
  return units.find((u) => u.slug === slug);
}

export function getLesson(unitSlug: string, lessonSlug: string) {
  const unit = getUnit(unitSlug);
  if (!unit) return undefined;
  const idx = unit.lessons.findIndex((l) => l.slug === lessonSlug);
  if (idx < 0) return undefined;
  return {
    unit,
    lesson: unit.lessons[idx],
    prev: unit.lessons[idx - 1],
    next: unit.lessons[idx + 1],
  };
}

export const lessonKey = (unit: string, lesson: string) => `${unit}/${lesson}`;
