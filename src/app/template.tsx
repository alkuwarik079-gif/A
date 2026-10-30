"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Re-mounts on every navigation, giving each page an enter transition with a sweeping green curtain. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[55] origin-left bg-emerald-deep"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="pattern-khatam absolute inset-0 opacity-30" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
        {children}
      </motion.div>
    </>
  );
}
