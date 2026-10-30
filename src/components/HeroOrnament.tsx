"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const C = 250; // centre of the 500×500 drawing
const MAROON = "#8A1538";
const GOLD = "#B8925A";
const LETTERS = "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي".split(" ");
const CENTRE = ["ع", "ر", "ب", "ي", "ض"]; // spells عربي, then the letter of ض

const pt = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
};
const poly = (r: number, n: number, rot = 0) =>
  Array.from({ length: n }, (_, i) => pt(r, rot + (360 / n) * i))
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ") + " Z";
// star polygon {n/k}: join every k-th vertex
const star = (r: number, n: number, k: number, rot = 0) => {
  const pts = Array.from({ length: n }, (_, i) => pt(r, rot + (360 / n) * ((i * k) % n)));
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ") + " Z";
};

function Draw({ d, delay, width = 1, opacity = 1, color = MAROON, reduce }: { d: string; delay: number; width?: number; opacity?: number; color?: string; reduce: boolean }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinejoin="round"
      initial={reduce ? false : { pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity }}
      transition={{ pathLength: { duration: 2.4, delay, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.4, delay } }}
    />
  );
}

/** Layer that turns slowly forever (CSS keeps it cheap and pausable for reduced motion). */
function Spin({ seconds, reverse, children }: { seconds: number; reverse?: boolean; children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 motion-safe:animate-[orn-spin_var(--t)_linear_infinite]"
      style={{ ["--t" as string]: `${seconds}s`, animationDirection: reverse ? "reverse" : "normal" }}
    >
      <svg viewBox="0 0 500 500" className="h-full w-full overflow-visible">
        {children}
      </svg>
    </div>
  );
}

export default function HeroOrnament() {
  const reduce = !!useReducedMotion();
  const [i, setI] = useState(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [6, -6]), { stiffness: 60, damping: 20 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-8, 8]), { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % CENTRE.length), 2600);
    const move = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move);
    return () => {
      clearInterval(t);
      window.removeEventListener("pointermove", move);
    };
  }, [reduce, mx, my]);

  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden style={{ perspective: 1200 }}>
      <style>{`@keyframes orn-spin{to{transform:rotate(360deg)}}`}</style>
      <motion.div style={reduce ? undefined : { rotateX: rx, rotateY: ry }} className="relative aspect-square w-[min(88%,560px)]">
        {/* soft halo */}
        <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(138,21,56,.10),transparent_70%)]" />

        {/* outer lattice: sixteen-point rosette, turning very slowly */}
        <Spin seconds={180}>
          <Draw d={poly(232, 64)} delay={0} width={0.8} opacity={0.5} reduce={reduce} />
          {[0, 22.5, 45, 67.5].map((r, k) => (
            <Draw key={r} d={poly(212, 4, r)} delay={0.3 + k * 0.15} width={0.8} opacity={0.45} reduce={reduce} />
          ))}
          <Draw d={poly(150, 64)} delay={0.9} width={0.6} opacity={0.35} reduce={reduce} />
        </Spin>

        {/* alphabet ring, counter-rotating */}
        <Spin seconds={120} reverse>
          {LETTERS.map((l, k) => {
            const deg = (360 / LETTERS.length) * k;
            const [x, y] = pt(186, deg);
            return (
              <motion.text
                key={l}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                transform={`rotate(${deg} ${x} ${y})`}
                fontFamily="var(--font-display)"
                fontWeight={700}
                fontSize={17}
                fill={MAROON}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 0.55 }}
                transition={{ delay: 1.2 + k * 0.04, duration: 0.6 }}
              >
                {l}
              </motion.text>
            );
          })}
        </Spin>

        {/* inner eight-point star (khatam), turning the other way */}
        <Spin seconds={90}>
          <Draw d={star(140, 8, 3)} delay={1.0} width={1.1} opacity={0.85} reduce={reduce} />
          <Draw d={poly(140, 8, 22.5)} delay={1.4} width={0.6} opacity={0.4} reduce={reduce} />
          <Draw d={star(98, 8, 3, 22.5)} delay={1.6} width={1} opacity={0.7} color={GOLD} reduce={reduce} />
          {Array.from({ length: 8 }, (_, k) => {
            const [x, y] = pt(140, k * 45);
            return (
              <motion.circle
                key={k}
                cx={x}
                cy={y}
                r={3.2}
                fill={GOLD}
                initial={reduce ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2.2 + k * 0.06, type: "spring", stiffness: 300, damping: 15 }}
                style={{ transformOrigin: `${x}px ${y}px` }}
              />
            );
          })}
        </Spin>

        {/* centre medallion with cycling letter */}
        <div className="absolute inset-0 grid place-items-center">
          <motion.div
            initial={reduce ? false : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative grid aspect-square w-[24%] place-items-center rounded-full bg-lime shadow-[0_30px_60px_-20px_rgba(92,14,37,.55)] ring-1 ring-[#B8925A]/60 ring-offset-4 ring-offset-white"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={CENTRE[i]}
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="-translate-y-[6%] font-display text-[clamp(3rem,8vw,5.4rem)] font-bold leading-none text-white"
              >
                {CENTRE[i]}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
