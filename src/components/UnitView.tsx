"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getUnit, lessonKey } from "@/lib/content";
import { lessonPercent, unitPercent, useProgress } from "@/lib/progress";
import SplitText from "./SplitText";
import TextsShelf from "./TextsShelf";

export default function UnitView({ slug }: { slug: string }) {
  const unit = getUnit(slug)!;
  const store = useProgress();
  const pct = unitPercent(store, unit);

  return (
    <div>
      <header className="relative overflow-hidden pb-16 pt-[calc(var(--nav-h)+4rem)]">
        <div className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.07] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <span aria-hidden className="pointer-events-none absolute -left-10 -top-10 font-kufi text-[24rem] leading-none text-emerald-deep/40 sm:text-[34rem]">
          {unit.glyph}
        </span>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="font-display text-sm font-black text-leaf">
            الوحدة 0{unit.num} · <span dir="ltr">{unit.english}</span>
          </p>
          <h1 className="mt-3 font-display text-[clamp(3.4rem,12vw,9.5rem)] font-black leading-[0.95]">
            <SplitText text={unit.title} />
          </h1>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-xl text-xl text-cream/70">{unit.tagline}</p>
            <div className="w-full max-w-xs">
              <div className="mb-2 flex justify-between font-display text-sm">
                <span className="text-cream/60">تقدّم الوحدة</span>
                <span className="font-black text-lime">{pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-cream/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="تقدّم الوحدة">
                <motion.div className="h-full rounded-full bg-gradient-to-l from-lime to-leaf" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {unit.slug === "texts" ? (
        <TextsShelf />
      ) : (
        <section className="mx-auto max-w-7xl px-4 sm:px-6" aria-label="الدروس">
          <ul className="grid gap-4 md:grid-cols-2">
            {unit.lessons.map((l, i) => {
              const lp = lessonPercent(store, unit.slug, l);
              const q = store[lessonKey(unit.slug, l.slug)];
              return (
                <motion.li
                  key={l.slug}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.8, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={i === 0 && unit.lessons.length % 2 === 1 ? "md:col-span-2" : ""}
                >
                  <Link
                    href={`/${unit.slug}/${l.slug}`}
                    className="glow-hover group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[2rem] border border-cream/10 bg-ink-2 p-7 sm:p-9"
                  >
                    <div className="pattern-girih pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-30" />
                    <div className="relative flex items-start justify-between gap-4">
                      <span className="font-display text-6xl font-black leading-none text-emerald-deep transition-colors duration-500 group-hover:text-leaf sm:text-7xl">
                        {String(l.num).padStart(2, "0")}
                      </span>
                      <span className="flex flex-col items-end gap-1 font-display text-xs text-cream/50">
                        <span>{l.sections.length} أقسام · اختبار</span>
                        {q?.quizTotal ? (
                          <span className="rounded-full bg-lime/15 px-2 py-0.5 text-lime">
                            الاختبار: {q.quiz}/{q.quizTotal}
                          </span>
                        ) : null}
                      </span>
                    </div>
                    <div className="relative">
                      <h2 className="font-display text-3xl font-black leading-snug transition-colors group-hover:text-lime sm:text-4xl">{l.title}</h2>
                      <p className="mt-3 max-w-xl text-cream/65">{l.summary}</p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {l.sections.map((s) => (
                          <li key={s.id} className={`rounded-full border px-3 py-1 font-display text-xs ${q?.seen.includes(s.id) ? "border-leaf/50 text-leaf" : "border-cream/10 text-cream/50"}`}>
                            {s.title.replace(/[«»]/g, "")}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 flex items-center gap-3">
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-cream/10">
                          <div className="h-full rounded-full bg-lime transition-[width] duration-700" style={{ width: `${lp}%` }} />
                        </div>
                        <span className="font-display text-sm font-black tabular-nums text-lime">{lp}%</span>
                        <span aria-hidden className="grid h-10 w-10 place-items-center rounded-full bg-cream text-ink transition-all duration-500 group-hover:-translate-x-1 group-hover:bg-lime">
                          ←
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
