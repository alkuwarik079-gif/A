"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import SplitText from "./SplitText";
import Magnetic from "./Magnetic";
import ShootingLetters from "./ShootingLetters";



export default function Hero() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // wait for the opening curtain only when it is actually playing (first page of a visit)
  const [d] = useState(() => (typeof document !== "undefined" && document.documentElement.classList.contains("no-intro") ? 0 : 3.9));
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="snap-start relative min-h-[100svh] overflow-hidden pt-[var(--nav-h)]">
      {/* backdrop */}
      <div className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.07] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[45%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-leaf/20 blur-[120px]" />
      <ShootingLetters />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative mx-auto grid min-h-[calc(100svh-var(--nav-h))] max-w-7xl items-center gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <motion.div style={reduce ? undefined : { y: textY, opacity: fade }} className="relative z-10 order-2 pb-16 lg:order-1 lg:pb-0">
          <h1 className="font-display font-black leading-[0.95] tracking-tight">
            <span dir="ltr" className="block whitespace-nowrap text-right">
              <SplitText text="Arabic 100" className="block text-[clamp(3.2rem,11vw,7.5rem)] text-cream" delay={d + 0.5} />
            </span>
            <span className="relative block text-[clamp(4.2rem,15vw,11rem)]">
              <SplitText text="عربي١٠٠" className="block text-lime" delay={d + 0.85} stagger={0.08} />
              {/* gold shine that glides across the letters only */}
              <span aria-hidden className="sheen pointer-events-none absolute inset-0 block" style={{ animationDelay: `${d + 2}s` }}>
                عربي١٠٠
              </span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d + 1.2, duration: 0.9 }}
            className="mt-10 max-w-lg text-lg leading-loose text-cream/75 sm:mt-16 sm:text-xl"
          >
            رحلةٌ من الحرف إلى النص: اكتب بثقة، وتذوّق البيان، وأتقن القواعد والإملاء، واقرأ بفهمٍ واستيعاب.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d + 1.5 }} className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic
              href="/writing"
              className="rounded-full bg-lime px-9 py-4 font-display text-lg font-black text-ink shadow-[0_0_0_0_#A8405C] transition-shadow duration-500 hover:shadow-[0_0_60px_-5px_#A8405C]"
            >
              ابدأ التعلم
              <span aria-hidden className="transition-transform duration-500 group-hover:-translate-x-1.5">←</span>
            </Magnetic>
            <a href="#units" className="font-display font-bold text-cream/70 underline decoration-leaf/50 underline-offset-8 transition-colors hover:text-lime">
              استكشف الوحدات
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          style={reduce ? undefined : { y: sceneY, scale: sceneScale }}
          className="relative order-1 h-[28svh] lg:order-2 lg:h-[82svh]"
        >
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        style={reduce ? undefined : { opacity: fade }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-cream/50 sm:flex"
      >
        <span className="font-display">مرّر للأسفل</span>
        <span className="relative h-10 w-[1px] overflow-hidden bg-cream/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-lime" />
        </span>
      </motion.div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
