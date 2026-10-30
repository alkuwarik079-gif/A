"use client";

import Image from "next/image";
import quLogo from "../../public/qu-logo.webp";
import Link from "next/link";
import { units } from "@/lib/content";
import { resetProgress } from "@/lib/progress";

const TEAM = [
  { name: "آمنة الكواري", id: "202602114" },
  { name: "موزة الكواري", id: "202601803" },
  { name: "شيخة النعيمي", id: "202602137" },
  { name: "الريم اليافعي", id: "202601889" },
  { name: "شيخة فخرو", id: "202602704" },
  { name: "مريم عادل", id: "202602465" },
  { name: "مريم الأحمد", id: "202601720" },
];

export default function Footer() {
  return (
    <footer className="snap-end relative mt-24 overflow-hidden border-t border-cream/10">
      <div className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <span className="mb-8 inline-block rounded-2xl border border-lime/15 bg-white p-3">
            <Image src={quLogo} alt="جامعة قطر" className="h-24 w-auto" />
          </span>
          <p className="font-display text-5xl font-black leading-none sm:text-7xl">
            للغة <span className="text-outline">العربية</span>
          </p>
          <p className="mt-5 max-w-md text-cream/60">منصة مراجعة تفاعلية لمهارات اللغة العربية.</p>
        </div>
        <div>
          <h2 className="mb-4 font-display text-sm font-bold text-leaf">الوحدات</h2>
          <ul className="space-y-2">
            {units.map((u) => (
              <li key={u.slug}>
                <Link href={`/${u.slug}`} className="text-cream/75 transition-colors hover:text-lime">
                  {u.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 font-display text-sm font-bold text-leaf">تقدّمك</h2>
          <p className="text-sm text-cream/60">يبدأ تقدمك من الصفر في كل زيارة جديدة.</p>
          <button
            type="button"
            onClick={() => {
              if (confirm("هل تريد مسح تقدمك في جميع الوحدات؟")) resetProgress();
            }}
            className="mt-4 rounded-full border border-cream/20 px-5 py-2 text-sm transition-colors hover:border-rose hover:text-rose"
          >
            إعادة ضبط التقدم
          </button>
        </div>
      </div>
      <section className="relative mx-auto max-w-7xl border-t border-cream/10 px-4 py-12 sm:px-6" aria-labelledby="team-h">
        <h2 id="team-h" className="mb-6 font-display text-sm font-bold text-leaf">فريق العمل</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <li key={m.id} className="glow-hover flex items-center justify-between gap-3 rounded-2xl border border-cream/10 bg-ink-2 px-5 py-4">
              <span className="font-display text-lg font-bold">{m.name}</span>
              <span dir="ltr" className="font-display text-sm tabular-nums text-lime">{m.id}</span>
            </li>
          ))}
        </ul>
      </section>
    </footer>
  );
}
