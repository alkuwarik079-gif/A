"use client";

import { motion } from "framer-motion";

const STAGES = [
  { label: "الحرف", big: "ض", body: "تبدأ الحكاية بحرفٍ تفرّدت به العربية حتى سُمّيت «لغة الضاد»." },
  { label: "الكلمة", big: "كَلِمة", body: "يجتمع الحرف إلى الحرف فتولد الكلمة: اسمٌ أو فعلٌ أو حرف." },
  { label: "الجملة", big: "العلمُ نورٌ", body: "تتآلف الكلمات وفق قواعد النحو فتصنع جملةً تامة المعنى." },
  { label: "الفقرة", big: "فكرةٌ + دليل", body: "تتماسك الجمل حول فكرة واحدة تدعمها الأدلة فتصير فقرة." },
  { label: "النص", big: "عربي١٠٠", body: "وتتلاقى الفقرات في نصٍّ يحمل الفكر والجمال والهوية." },
];

/** "From letter to text": five stages, each a full-height section that opens up every time it scrolls into view. */
export default function StoryPinned() {
  return (
    <section className="relative bg-ink-2" aria-label="من الحرف إلى النص">
      {STAGES.map((s, i) => (
        <div key={s.label} className="snap-start flex min-h-[100svh] items-center border-b border-cream/5">
          <motion.div
            initial={{ opacity: 0, y: 90, scale: 0.94, clipPath: "inset(12% 4% 0% 4% round 48px)" }}
            whileInView={{ opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0% round 0px)", transitionEnd: { clipPath: "none" } }}
            viewport={{ amount: 0.45, once: false }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr]"
          >
            <p className="font-display text-[clamp(4rem,14vw,12rem)] font-black leading-none">
              <span className={i === STAGES.length - 1 ? "gradient-text" : "text-cream"}>{s.big}</span>
            </p>
            <div>
              <div className="mb-4 flex gap-2" aria-hidden>
                {STAGES.map((_, k) => (
                  <span key={k} className={`h-1.5 rounded-full transition-all ${k <= i ? "w-8 bg-lime" : "w-3 bg-cream/15"}`} />
                ))}
              </div>
              <p className="font-display text-sm font-bold text-lime">
                0{i + 1} — {s.label}
              </p>
              <p className="mt-3 text-2xl leading-relaxed text-cream/80">{s.body}</p>
            </div>
          </motion.div>
        </div>
      ))}
    </section>
  );
}
