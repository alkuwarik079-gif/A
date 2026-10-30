import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LessonView from "@/components/lesson/LessonView";
import { getLesson, units } from "@/lib/content";

export function generateStaticParams() {
  return units.flatMap((u) => u.lessons.map((l) => ({ unit: u.slug, lesson: l.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ unit: string; lesson: string }> }): Promise<Metadata> {
  const { unit, lesson } = await params;
  const d = getLesson(unit, lesson);
  return { title: d ? `${d.lesson.title} — ${d.unit.title}` : "للغة العربية" };
}

export default async function LessonPage({ params }: { params: Promise<{ unit: string; lesson: string }> }) {
  const { unit, lesson } = await params;
  if (!getLesson(unit, lesson)) notFound();
  return <LessonView key={`${unit}/${lesson}`} unitSlug={unit} lessonSlug={lesson} />;
}
