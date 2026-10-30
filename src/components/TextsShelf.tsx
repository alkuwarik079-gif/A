"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { textMeta } from "@/lib/content/texts";
import { lessonPercent, useProgress } from "@/lib/progress";
import { texts } from "@/lib/content/texts";

gsap.registerPlugin(ScrollTrigger);

const HEIGHTS = [420, 380, 440, 400, 430, 390, 445, 410];
const THICK = [78, 92, 70, 96, 84, 74, 88, 80];
const COVER = 250;

type Meta = (typeof textMeta)[number];

function Book({ m, i, pct }: { m: Meta; i: number; pct: number }) {
  const router = useRouter();
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const H = HEIGHTS[i % HEIGHTS.length];
  const T = THICK[i % THICK.length];

  const open = () => {
    if (stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(`/texts/${m.slug}`);
      return;
    }
    setStage(1); // swing the book to face us
    setTimeout(() => setStage(2), 600); // then lift the cover
    setTimeout(() => router.push(`/texts/${m.slug}`), 1250);
  };

  return (
    <div className="shelf-book group relative shrink-0" style={{ width: stage ? COVER + 20 : T, height: H, transition: "width .6s cubic-bezier(.16,1,.3,1)", perspective: 1600 }}>
      <button
        type="button"
        onClick={open}
        aria-label={`افتح نص «${m.title}» — ${m.author}`}
        className="absolute bottom-0 right-0 block"
        style={{ width: T, height: H, transformStyle: "preserve-3d" }}
      >
        <span
          className="absolute inset-0 block transition-transform duration-[600ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-5"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: `0 50%`,
            transform: stage ? `translateZ(60px) rotateY(90deg)` : undefined,
          }}
        >
          {/* spine */}
          <span
            className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden rounded-[4px] py-5 shadow-[inset_-8px_0_14px_rgba(0,0,0,.35),inset_8px_0_10px_rgba(255,255,255,.06)]"
            style={{ background: `linear-gradient(90deg, ${m.spine} 0%, color-mix(in srgb, ${m.spine} 70%, white) 50%, ${m.spine} 100%)` }}
          >
            <span className="h-px w-3/4 bg-lime/60" />
            <span className="font-kufi text-lg text-lime">۞</span>
            <span className="font-display text-[1.35rem] font-black text-cream [writing-mode:vertical-rl]">{m.title}</span>
            <span className="font-display text-[11px] text-cream/60 [writing-mode:vertical-rl]">{m.author.split("—")[0]}</span>
            <span className="h-px w-3/4 bg-lime/60" />
            {pct > 0 && <span className="absolute inset-x-0 bottom-0 h-1 bg-lime" style={{ width: `${pct}%` }} />}
          </span>
          {/* front cover, hinged on the spine's left edge and folded back into the shelf */}
          <span
            className="absolute top-0 block"
            style={{ width: COVER, height: H, right: "100%", transformOrigin: "100% 50%", transform: "rotateY(-90deg)", transformStyle: "preserve-3d" }}
          >
            {/* first page underneath */}
            <span className="paper absolute inset-0 flex flex-col justify-center rounded-l-md p-6 text-right">
              <span className="font-display text-xs font-black text-emerald-deep">{m.genre}</span>
              <span className="mt-2 font-display text-3xl font-black text-ink">{m.title}</span>
              <span className="mt-2 text-sm text-ink/60">{m.author}</span>
            </span>
            {/* the cover leaf swings open */}
            <span
              className="absolute inset-0 flex flex-col items-center justify-center rounded-l-md p-6 text-center [backface-visibility:hidden]"
              style={{
                background: `radial-gradient(circle at 30% 20%, color-mix(in srgb, ${m.spine} 60%, white), ${m.spine} 70%)`,
                transformOrigin: "100% 50%",
                transform: stage === 2 ? "rotateY(160deg)" : "rotateY(0deg)",
                transition: "transform .65s cubic-bezier(.65,0,.35,1)",
              }}
            >
              <span className="pattern-khatam absolute inset-3 rounded border border-lime/40 opacity-40" />
              <span className="relative font-display text-3xl font-black text-cream">{m.title}</span>
              <span className="relative mt-3 text-sm text-lime">{m.author}</span>
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}

export default function TextsShelf() {
  const store = useProgress();
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".shelf-book", { y: 120, opacity: 0, rotate: -6, stagger: 0.08, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 75%" } });
      const distance = () => Math.max(0, tr.scrollWidth - tr.clientWidth);
      if (distance() < 40) return;
      // RTL row overflows to the left, so slide it rightwards as the user scrolls
      gsap.to(tr.firstElementChild, {
        x: () => distance(),
        ease: "none",
        scrollTrigger: { trigger: el, start: "center center", end: () => `+=${distance() * 1.2}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden py-10" aria-label="رف النصوص">
      <div className="mx-auto mb-6 flex max-w-7xl items-center justify-between px-4 font-display text-sm text-cream/50 sm:px-6">
        <span>اضغط على كعب الكتاب لفتحه</span>
        <span className="hidden sm:inline">مرّر لتتصفح الرف ←</span>
      </div>
      <div ref={track} className="no-scrollbar overflow-x-auto motion-safe:overflow-x-hidden">
        <div className="flex w-max items-end gap-3 px-6 pb-0 sm:px-[8vw]">
          {textMeta.map((m, i) => (
            <Book key={m.slug} m={m} i={i} pct={lessonPercent(store, "texts", texts.lessons[i])} />
          ))}
          {/* bookend */}
          <div aria-hidden className="h-[300px] w-10 shrink-0 rounded-t-md bg-gradient-to-b from-emerald-deep to-ink-3" />
        </div>
      </div>
      {/* shelf plank */}
      <div aria-hidden className="relative mx-auto h-6 max-w-[96vw] rounded-sm bg-gradient-to-b from-[#3B2A1A] to-[#1F150C] shadow-[0_30px_60px_-10px_rgba(0,0,0,.9),0_-1px_0_rgba(255,255,255,.08)_inset]" />
      <div aria-hidden className="mx-auto h-24 max-w-5xl bg-leaf/10 blur-3xl" />

      {/* accessible list */}
      <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {textMeta.map((m, i) => (
            <li key={m.slug}>
              <Link href={`/texts/${m.slug}`} className="glow-hover flex h-full items-center justify-between gap-3 rounded-2xl border border-cream/10 bg-ink-2 px-5 py-4">
                <span>
                  <span className="block font-display font-black">{m.title}</span>
                  <span className="text-sm text-cream/50">{m.author}</span>
                </span>
                <span className="font-display text-sm font-black tabular-nums text-lime">{lessonPercent(store, "texts", texts.lessons[i])}%</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
