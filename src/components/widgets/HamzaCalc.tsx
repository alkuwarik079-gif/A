"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type V = "kasra" | "damma" | "fatha" | "sukun";

const VOWELS: { v: V; label: string; mark: string; rank: number }[] = [
  { v: "kasra", label: "كسرة", mark: "ـِـ", rank: 4 },
  { v: "damma", label: "ضمة", mark: "ـُـ", rank: 3 },
  { v: "fatha", label: "فتحة", mark: "ـَـ", rank: 2 },
  { v: "sukun", label: "سكون", mark: "ـْـ", rank: 1 },
];

const SEAT: Record<Exclude<V, "sukun">, { glyph: string; name: string }> = {
  kasra: { glyph: "ئ", name: "على نبرة (ياء غير منقوطة)" },
  damma: { glyph: "ؤ", name: "على واو" },
  fatha: { glyph: "أ", name: "على ألف" },
};

// [before, seat, after] — keyed by `${hamzaVowel}-${prevVowel}`
const EXAMPLES: Record<string, [string, string, string]> = {
  "fatha-fatha": ["سَ", "أَ", "لَ"],
  "fatha-damma": ["سُ", "ؤَ", "ال"],
  "fatha-kasra": ["فِ", "ئَ", "ة"],
  "fatha-sukun": ["مَسْ", "أَ", "لة"],
  "damma-fatha": ["يَ", "ؤُ", "مُّ"],
  "damma-damma": ["شُ", "ؤُ", "ون"],
  "damma-kasra": ["يُنشِ", "ئُ", "ون"],
  "damma-sukun": ["مَسْ", "ؤُ", "ول"],
  "kasra-fatha": ["سَ", "ئِ", "مَ"],
  "kasra-damma": ["سُ", "ئِ", "لَ"],
  "kasra-kasra": ["مُتَّكِ", "ئِ", "ين"],
  "kasra-sukun": ["أَفْ", "ئِ", "دة"],
  "sukun-fatha": ["رَ", "أْ", "س"],
  "sukun-damma": ["مُ", "ؤْ", "من"],
  "sukun-kasra": ["بِ", "ئْ", "ر"],
};

function Picker({ title, value, onChange }: { title: string; value: V; onChange: (v: V) => void }) {
  return (
    <fieldset>
      <legend className="mb-3 font-display text-sm font-black text-cream/70">{title}</legend>
      <div className="grid grid-cols-4 gap-2">
        {VOWELS.map((o) => (
          <button
            key={o.v}
            type="button"
            aria-pressed={value === o.v}
            onClick={() => onChange(o.v)}
            className={`rounded-2xl border py-3 font-display transition-all ${
              value === o.v ? "border-lime bg-lime text-ink shadow-[0_0_30px_-8px_#8A1538]" : "border-cream/15 hover:border-leaf/60"
            }`}
          >
            <span className="block text-2xl leading-none">{o.mark}</span>
            <span className="mt-1 block text-xs font-bold">{o.label}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function HamzaCalc() {
  const [h, setH] = useState<V>("fatha");
  const [p, setP] = useState<V>("damma");
  const hv = VOWELS.find((x) => x.v === h)!;
  const pv = VOWELS.find((x) => x.v === p)!;
  const impossible = h === "sukun" && p === "sukun";
  const strongest = hv.rank >= pv.rank ? hv : pv;
  const seat = impossible ? null : SEAT[strongest.v as Exclude<V, "sukun">];
  const ex = EXAMPLES[`${h}-${p}`];
  const key = `${h}-${p}`;

  return (
    <div className="mt-4 overflow-hidden rounded-[2rem] border border-leaf/25 bg-gradient-to-bl from-emerald-deep/40 to-ink-2 p-5 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime font-kufi text-2xl text-ink">ء</span>
        <div>
          <h4 className="font-display text-2xl font-black">حاسبة الهمزة المتوسطة</h4>
          <p className="text-sm text-cream/60">اختر الحركتين، وشاهد الهمزة تجلس على كرسيها.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6">
          <Picker title="١ · حركة الهمزة نفسها" value={h} onChange={setH} />
          <Picker title="٢ · حركة الحرف الذي قبلها" value={p} onChange={setP} />
          <div className="flex flex-wrap items-center gap-2 font-display text-sm" aria-hidden>
            {VOWELS.map((v, i) => (
              <span key={v.v} className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 ${!impossible && strongest.v === v.v ? "bg-lime font-black text-ink" : "bg-cream/10 text-cream/60"}`}>{v.label}</span>
                {i < 3 && <span className="text-cream/30">&gt;</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="paper relative grid min-h-[300px] place-items-center overflow-hidden rounded-[1.75rem] p-6 text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            {impossible ? (
              <motion.div key="no" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <p className="font-display text-6xl font-black text-rose">✕</p>
                <p className="mt-3 font-display text-xl font-black text-ink">لا يلتقي ساكنان في العربية</p>
                <p className="mt-1 text-ink/60">غيّر إحدى الحركتين.</p>
              </motion.div>
            ) : (
              <motion.div key={key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                <div className="relative mx-auto h-36 w-36">
                  {/* the seat rises, then the hamza drops onto it */}
                  <motion.span
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 16 }}
                    className="absolute inset-0 grid place-items-center font-body text-[7.5rem] font-bold leading-none text-emerald-deep"
                  >
                    {seat!.glyph}
                  </motion.span>
                  <motion.span
                    initial={{ y: -90, opacity: 0, scale: 1.6 }}
                    animate={{ y: 0, opacity: [0, 1, 1, 0], scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.7, times: [0, 0.2, 0.85, 1], ease: "easeIn" }}
                    className="absolute inset-x-0 top-0 grid place-items-center font-body text-6xl text-leaf"
                    aria-hidden
                  >
                    ء
                  </motion.span>
                </div>
                <p className="mt-2 font-display text-lg font-black text-ink">
                  الأقوى: <span className="text-emerald-deep">{strongest.label}</span> ← تُكتب {seat!.name}
                </p>
                {ex && (
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-4 font-body text-4xl font-bold text-ink">
                    {/* the word stays one text run so its letters join on every browser */}
                    {ex.join("")}
                    <span className="mt-2 block font-display text-sm font-bold text-ink/60">
                      الهمزة فيها: <span className="text-xl text-lime">{ex[1]}</span>
                    </span>
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
