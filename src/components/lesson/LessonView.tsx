"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLesson } from "@/lib/content";
import { lessonPercent, markSeen, useProgress } from "@/lib/progress";
import SplitText from "../SplitText";
import Blocks from "./Blocks";
import Quiz from "./Quiz";
import SectionReveal from "../SectionReveal";

export default function LessonView({ unitSlug, lessonSlug }: { unitSlug: string; lessonSlug: string }) {
  const data = getLesson(unitSlug, lessonSlug)!;
  const { unit, lesson, prev, next } = data;
  const store = useProgress();
  const pct = lessonPercent(store, unit.slug, lesson);
  const [active, setActive] = useState(lesson.sections[0].id);
  const tabsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const tabs = [...lesson.sections.map((s) => ({ id: s.id, title: s.title })), { id: "quiz", title: "اختبار قصير" }];

  // Track the section in view: highlight its tab and record it as read.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = e.target.id;
          setActive(id);
          if (id !== "quiz") markSeen(unit.slug, lesson.slug, id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    tabs.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit.slug, lesson.slug]);

  // keep the active tab visible in the horizontal strip
  useEffect(() => {
    const strip = tabsRef.current;
    const btn = strip?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    if (!strip || !btn) return;
    const target = btn.offsetLeft - (strip.clientWidth - btn.offsetWidth) / 2;
    strip.scrollTo({ left: target, behavior: "smooth" });
  }, [active]);

  // pinned sections measure before fonts/transitions settle — re-measure once things land
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 1100);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => clearTimeout(t);
  }, []);

  const isText = unit.slug === "texts";

  return (
    <article className="snap-lesson relative">
      {/* header */}
      <header className="relative overflow-hidden pb-14 pt-[calc(var(--nav-h)+3.5rem)]">
        <div className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.06] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-leaf/15 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <nav aria-label="مسار التنقل" className="mb-8 flex flex-wrap items-center gap-2 font-display text-sm text-cream/50">
            <Link href="/" className="hover:text-lime">الرئيسة</Link>
            <span aria-hidden>/</span>
            <Link href={`/${unit.slug}`} className="hover:text-lime">{unit.title}</Link>
            <span aria-hidden>/</span>
            <span className="text-cream/80">{lesson.title}</span>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-display text-sm font-black text-leaf">{isText ? `${lesson.summary} · ${lesson.author}` : `الدرس ${lesson.num}`}</p>
              <h1 className="mt-3 font-display text-[clamp(2.6rem,8vw,6rem)] font-black leading-[1.05]">
                <SplitText text={lesson.title} />
              </h1>
              {!isText && <p className="mt-5 max-w-2xl text-lg text-cream/70 sm:text-xl">{lesson.summary}</p>}
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-cream/10 bg-ink-2/70 px-5 py-4">
              <div>
                <p className="font-display text-xs text-cream/50">إنجازك في الدرس</p>
                <p className="font-display text-3xl font-black tabular-nums text-lime">{pct}%</p>
              </div>
              <div className="h-12 w-1.5 overflow-hidden rounded-full bg-cream/10">
                <div className="w-full rounded-full bg-lime transition-all duration-700" style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* sticky tabs + reading progress */}
      <div className="sticky z-40 border-y border-cream/10 bg-ink/95" style={{ top: "var(--nav-h)" }}>
        <div ref={tabsRef} className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6" role="tablist" aria-label="أقسام الدرس">
          {tabs.map((t, i) => {
            const on = active === t.id;
            const seen = store[`${unit.slug}/${lesson.slug}`]?.seen.includes(t.id);
            return (
              <a
                key={t.id}
                href={`#${t.id}`}
                data-tab={t.id}
                role="tab"
                aria-selected={on}
                className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-display text-sm font-bold transition-colors ${
                  on ? "text-ink" : "text-cream/65 hover:text-lime"
                }`}
              >
                {on && <motion.span layoutId="lesson-tab" className="absolute inset-0 rounded-full bg-lime" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <span className="relative z-10 tabular-nums opacity-60">{t.id === "quiz" ? "✦" : i + 1}</span>
                <span className="relative z-10 max-w-[14rem] truncate">{t.title.replace(/[«»]/g, "")}</span>
                {seen && !on && <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-leaf" aria-label="تمت القراءة" />}
              </a>
            );
          })}
        </div>
        <motion.div className="h-[2px] origin-right bg-gradient-to-l from-lime via-leaf to-emerald-deep" style={{ scaleX: bar }} />
      </div>

      {/* sections */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {lesson.sections.map((s, i) => (
          <section key={s.id} id={s.id} className="snap-start relative border-b border-cream/[0.07] py-20 sm:py-28" aria-labelledby={`${s.id}-h`}>
            <SectionReveal>
            <div className="mb-10 flex items-start gap-5">
              <span aria-hidden className="font-display text-[4.5rem] font-black leading-[0.8] text-emerald-deep sm:text-[7rem]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pt-1">
                {s.kicker && <p className="font-display text-sm font-black text-leaf">{s.kicker}</p>}
                <h2 id={`${s.id}-h`} className="mt-1 font-display text-3xl font-black leading-tight sm:text-5xl">
                  <SplitText text={s.title} onScroll stagger={0.02} />
                </h2>
              </div>
            </div>
            <Blocks blocks={s.blocks} />
            </SectionReveal>
          </section>
        ))}

        <section id="quiz" className="snap-start py-20 sm:py-28" aria-labelledby="quiz-h">
          <p className="font-display text-sm font-black text-leaf">ختام الدرس</p>
          <h2 id="quiz-h" className="mb-10 mt-1 font-display text-3xl font-black sm:text-5xl">اختبر فهمك</h2>
          <SectionReveal>
            <Quiz unit={unit.slug} lesson={lesson.slug} questions={lesson.quiz} />
          </SectionReveal>
        </section>

        {/* prev / next */}
        <nav className="grid gap-4 pb-10 sm:grid-cols-2" aria-label="التنقل بين الدروس">
          {prev ? (
            <Link href={`/${unit.slug}/${prev.slug}`} className="glow-hover group rounded-[1.5rem] border border-cream/10 bg-ink-2 p-6">
              <span className="font-display text-xs text-cream/50">→ السابق</span>
              <span className="mt-2 block font-display text-2xl font-black group-hover:text-lime">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/${unit.slug}/${next.slug}`} className="glow-hover group rounded-[1.5rem] border border-cream/10 bg-ink-2 p-6 text-left">
              <span className="font-display text-xs text-cream/50">التالي ←</span>
              <span className="mt-2 block font-display text-2xl font-black group-hover:text-lime">{next.title}</span>
            </Link>
          ) : (
            <Link href={`/${unit.slug}`} className="glow-hover group rounded-[1.5rem] border border-cream/10 bg-ink-2 p-6 text-left">
              <span className="font-display text-xs text-cream/50">نهاية الوحدة</span>
              <span className="mt-2 block font-display text-2xl font-black group-hover:text-lime">العودة إلى {unit.title} ←</span>
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}
