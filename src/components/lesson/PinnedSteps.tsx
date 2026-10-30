"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ORD = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨"];

/**
 * Ordered steps that fade in one by one as they scroll into view.
 */
export default function PinnedSteps({ items }: { items: { title: string; body: string }[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".pstep", el).forEach((row) =>
        gsap.from(row, { opacity: 0, y: 24, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 90%", once: true } })
      );
    });
    return () => mm.revert();
  }, [items]);

  return (
    <div ref={root} className="grid gap-8 rounded-[2rem] border border-cream/10 bg-ink-2/80 p-6 sm:p-10 ">
      <ol className="space-y-5">
        {items.map((s, i) => (
          <li key={s.title} className="pstep flex gap-4 border-b border-cream/10 pb-5 last:border-none last:pb-0">
            <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-deep font-display text-sm font-black text-lime">{ORD[i]}</span>
            <div>
              <h4 className="font-display text-xl font-black text-cream sm:text-2xl">{s.title}</h4>
              <p className="mt-1 text-cream/70">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
