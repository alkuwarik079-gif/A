"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { Unit } from "@/lib/types";
import { unitPercent, useProgress } from "@/lib/progress";
import { units } from "@/lib/content";

function UnitCard({ unit, index }: { unit: Unit; index: number }) {
  const store = useProgress();
  const pct = unitPercent(store, unit);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        onMouseMove={(e) => {
          if (reduce) return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onMouseLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="group relative"
      >
        <Link
          href={`/${unit.slug}`}
          className="glow-hover relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-[2rem] border border-cream/10 bg-ink-2 p-7 sm:min-h-[400px] sm:p-9"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: useTransform([glowX, glowY], ([x, y]) => `radial-gradient(400px circle at ${x} ${y}, rgba(34,197,94,.22), transparent 60%)`),
            }}
          />
          <div className="pattern-girih pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-40" />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -left-6 font-kufi text-[15rem] leading-none text-emerald-deep/60 transition-all duration-700 group-hover:-translate-y-4 group-hover:text-leaf/25 sm:text-[19rem]"
          >
            {unit.glyph}
          </span>

          <div className="relative flex items-start justify-between">
            <span className="font-display text-sm font-bold text-leaf">الوحدة 0{unit.num}</span>
            <span className="rounded-full border border-cream/15 px-3 py-1 font-display text-xs text-cream/60">{unit.lessons.length} دروس</span>
          </div>

          <div className="relative" style={{ transform: "translateZ(40px)" }}>
            <p className="mb-2 font-display text-xs uppercase tracking-[0.3em] text-cream/40" dir="ltr">
              {unit.english}
            </p>
            <h3 className="font-display text-4xl font-black leading-tight sm:text-5xl">{unit.title}</h3>
            <p className="mt-3 max-w-sm text-cream/65">{unit.tagline}</p>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`تقدم ${unit.title}`}>
                <div className="h-full rounded-full bg-gradient-to-l from-lime to-leaf transition-[width] duration-1000" style={{ width: `${pct}%` }} />
              </div>
              <span className="font-display text-sm font-bold tabular-nums text-lime">{pct}%</span>
              <span aria-hidden className="grid h-11 w-11 place-items-center rounded-full bg-cream text-ink transition-all duration-500 group-hover:bg-lime group-hover:-translate-x-1">
                ←
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function UnitCards() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {units.map((u, i) => (
        <UnitCard key={u.slug} unit={u} index={i} />
      ))}
    </div>
  );
}
