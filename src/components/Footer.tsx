"use client";

import Image from "next/image";
import quLogo from "../../public/qu-logo.webp";
import Link from "next/link";
import { units } from "@/lib/content";
import { resetProgress } from "@/lib/progress";

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-cream/10">
      <div className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <span className="mb-8 inline-block rounded-2xl bg-cream p-3">
            <Image src={quLogo} alt="جامعة قطر" className="h-24 w-auto" />
          </span>
          <p className="font-display text-5xl font-black leading-none sm:text-7xl">
            للغة <span className="text-outline">العربية</span>
          </p>
          <p className="mt-5 max-w-md text-cream/60">منصة مراجعة تفاعلية لمهارات اللغة العربية للمرحلة الثانوية (الصفان العاشر والحادي عشر).</p>
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
          <p className="text-sm text-cream/60">يُحفظ تقدمك في هذا المتصفح فقط.</p>
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
    </footer>
  );
}
