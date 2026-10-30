"use client";

import Image from "next/image";
import quLogo from "../../public/qu-logo.webp";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { units } from "@/lib/content";
import { unitPercent, useProgress } from "@/lib/progress";

function Ring({ value }: { value: number }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90" aria-hidden>
      <circle cx="12" cy="12" r={r} stroke="rgba(42,16,24,.15)" strokeWidth="2.5" fill="none" />
      <circle
        cx="12"
        cy="12"
        r={r}
        stroke="#8A1538"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (c * value) / 100}
        style={{ transition: "stroke-dashoffset .8s cubic-bezier(.16,1,.3,1)" }}
      />
    </svg>
  );
}

export default function Nav() {
  const path = usePathname();
  const store = useProgress();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [path]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-leaf/15 bg-ink/80 backdrop-blur-xl" : "bg-transparent"
      }`}
      style={{ height: "var(--nav-h)" }}
    >
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="الوحدات">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="الصفحة الرئيسة">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-lime/15 bg-white p-1 shadow-[0_0_30px_-8px_#A8405C] transition-transform duration-500 group-hover:-rotate-3">
            <Image src={quLogo} alt="جامعة قطر" priority className="h-full w-auto" />
          </span>
          <span className="font-display text-lg font-black tracking-tight">
            للغة <span className="text-leaf">العربية</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {units.map((u) => {
            const active = path?.startsWith(`/${u.slug}`);
            return (
              <li key={u.slug}>
                <Link
                  href={`/${u.slug}`}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2 font-display text-[15px] font-bold transition-colors ${
                    active ? "text-ink" : "text-cream/80 hover:text-lime"
                  }`}
                >
                  {active && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 -z-0 rounded-full bg-lime" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  <span className="relative z-10">{u.short}</span>
                  <span className="relative z-10">
                    <Ring value={unitPercent(store, u)} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-xl border border-cream/15 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-5">
            <span className={`absolute right-0 h-0.5 w-5 bg-cream transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute right-0 h-0.5 bg-cream transition-all ${open ? "top-1.5 w-5 -rotate-45" : "top-3 w-3"}`} />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass mx-4 mt-2 rounded-3xl p-3 lg:hidden"
          >
            {units.map((u, i) => (
              <Link
                key={u.slug}
                href={`/${u.slug}`}
                className="flex items-center justify-between rounded-2xl px-4 py-4 transition-colors hover:bg-emerald-deep/40"
              >
                <span className="flex items-center gap-3">
                  <span className="font-display text-xs text-leaf">0{i + 1}</span>
                  <span className="font-display text-xl font-black">{u.title}</span>
                </span>
                <Ring value={unitPercent(store, u)} />
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
