"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ORD = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨"];

/**
 * Steps that build one by one while the block is pinned (desktop, motion allowed).
 * On small screens or with reduced motion, it renders as a plain ordered list.
 */
export default function PinnedSteps({ items }: { items: { title: string; body: string }[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const rows = gsap.utils.toArray<HTMLElement>(".pstep", el);
      // too tall to pin comfortably → reveal each step as it enters instead
      if (el.offsetHeight > window.innerHeight * 0.74) {
        rows.forEach((row) =>
          gsap.from(row, { opacity: 0, x: -40, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: row, start: "top 85%", once: true } })
        );
        return;
      }
      const nums = gsap.utils.toArray<HTMLElement>(".pnum", el);
      gsap.set(rows.slice(1), { opacity: 0.12, x: -40 });
      gsap.set(nums.slice(1), { yPercent: 100, opacity: 0 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 22%",
          end: () => `+=${rows.length * 220}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });
      rows.forEach((row, i) => {
        if (i === 0) return;
        tl.to(rows[i - 1], { opacity: 0.45, duration: 0.5 }, i)
          .to(row, { opacity: 1, x: 0, duration: 0.8 }, i)
          .to(nums[i - 1], { yPercent: -100, opacity: 0, duration: 0.6 }, i)
          .to(nums[i], { yPercent: 0, opacity: 1, duration: 0.6 }, i)
          .to(el.querySelector(".pfill"), { scaleY: (i + 1) / rows.length, duration: 0.8 }, i);
      });
      tl.to(rows, { opacity: 1, duration: 0.5 });
    });
    return () => mm.revert();
  }, [items]);

  return (
    <div ref={root} className="grid gap-8 rounded-[2rem] border border-cream/10 bg-ink-2/80 p-6 sm:p-10 lg:grid-cols-[180px_1fr]">
      <div className="relative hidden lg:block">
        <div className="flex gap-5">
          <span className="relative block h-56 w-1 overflow-hidden rounded-full bg-cream/10">
            <span className="pfill absolute inset-x-0 top-0 block h-full origin-top rounded-full bg-gradient-to-b from-lime to-leaf" style={{ transform: `scaleY(${1 / items.length})` }} />
          </span>
          <span className="relative block h-36 w-28 overflow-hidden">
            {items.map((_, i) => (
              <span key={i} className={`pnum absolute inset-0 font-display text-[8rem] font-black leading-none text-lime ${i ? "opacity-0" : ""}`}>
                {ORD[i]}
              </span>
            ))}
          </span>
        </div>
      </div>
      <ol className="space-y-5">
        {items.map((s, i) => (
          <li key={s.title} className="pstep flex gap-4 border-b border-cream/10 pb-5 last:border-none last:pb-0">
            <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-deep font-display text-sm font-black text-lime lg:hidden">{ORD[i]}</span>
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
