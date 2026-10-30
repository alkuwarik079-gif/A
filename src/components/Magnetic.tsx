"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
  ariaLabel?: string;
};

/** Button/link that leans toward the cursor and springs back on leave. */
export default function Magnetic({ children, href, onClick, className = "", strength = 0.35, ariaLabel }: Props) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.4 });

  const tx = useTransform(sx, (v) => v * 0.4);
  const ty = useTransform(sy, (v) => v * 0.4);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <motion.span style={{ x: tx, y: ty }} className="relative inline-flex items-center gap-3">
      {children}
    </motion.span>
  );

  const cls = `group relative inline-flex items-center justify-center ${className}`;
  return (
    <motion.span onMouseMove={onMove} onMouseLeave={reset} style={{ x: sx, y: sy }} className="inline-block">
      {href ? (
        <Link href={href} className={cls} aria-label={ariaLabel}>
          {inner}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className={cls} aria-label={ariaLabel}>
          {inner}
        </button>
      )}
    </motion.span>
  );
}
