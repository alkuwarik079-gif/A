"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Transition played each time a section scrolls into view: the content rises out of a
 * rounded window that opens up, while a maroon hairline sweeps across the top.
 */
export default function SectionReveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={`relative ${className ?? ""}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ amount: 0.12, once: false }}
    >
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 block h-px origin-right bg-gradient-to-l from-lime via-gold to-transparent"
        variants={{ hidden: { scaleX: 0, opacity: 0 }, shown: { scaleX: 1, opacity: 1 } }}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 70, scale: 0.97, clipPath: "inset(10% 3% 0% 3% round 40px)" },
          // clip is removed once open so shadows and sticky panels inside are not cut off
          shown: { opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0% round 0px)", transitionEnd: { clipPath: "none" } },
        }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
