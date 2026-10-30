"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

type Kind = "naqli" | "waqii" | "mantiqi";

const BINS: { kind: Kind; label: string; hint: string; color: string }[] = [
  { kind: "naqli", label: "نقلي", hint: "آية، حديث، شعر، مثل، قول", color: "#B8925A" },
  { kind: "waqii", label: "واقعي", hint: "إحصاءات، تجارب، أحداث", color: "#7D6A60" },
  { kind: "mantiqi", label: "منطقي", hint: "استنتاج، قياس، سبب ونتيجة", color: "#5C0E25" },
];

const ITEMS: { id: number; text: string; kind: Kind }[] = [
  { id: 1, text: "قال تعالى: ﴿وَقُل رَّبِّ زِدْنِي عِلْمًا﴾", kind: "naqli" },
  { id: 2, text: "تُظهر الإحصاءات أن الوفيات في حوادث السير تقل عند استخدام حزام الأمان", kind: "waqii" },
  { id: 3, text: "إذا كان الجسد يمرض بلا غذاء، فإن العقل يذبل بلا قراءة", kind: "mantiqi" },
  { id: 4, text: "قال الشاعر: العلمُ يرفعُ بيتًا لا عمادَ له", kind: "naqli" },
  { id: 5, text: "نجح إديسون في اختراع المصباح بعد تجارب فاشلة كثيرة", kind: "waqii" },
  { id: 6, text: "من يهدر وقته يهدر عمره؛ لأن العمر ما هو إلا وقت", kind: "mantiqi" },
  { id: 7, text: "المثل: في التأني السلامة وفي العجلة الندامة", kind: "naqli" },
  { id: 8, text: "أثبتت دراسات أن النوم الكافي يحسّن التحصيل الدراسي", kind: "waqii" },
  { id: 9, text: "كلما زاد الجهد زادت فرص النجاح؛ فالجهد سبب والنجاح نتيجة", kind: "mantiqi" },
];

export default function EvidenceGame() {
  const [placed, setPlaced] = useState<Record<number, Kind>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [wrong, setWrong] = useState<{ id: number; bin: Kind } | null>(null);
  const [hoverBin, setHoverBin] = useState<Kind | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const pool = useMemo(() => ITEMS.filter((i) => !placed[i.id]), [placed]);
  const done = pool.length === 0;

  const drop = (id: number, bin: Kind) => {
    const item = ITEMS.find((i) => i.id === id);
    if (!item) return;
    if (item.kind === bin) {
      setPlaced((p) => ({ ...p, [id]: bin }));
      setSelected(null);
    } else {
      setMistakes((m) => m + 1);
      setWrong({ id, bin });
      setTimeout(() => setWrong(null), 700);
    }
  };

  const reset = () => {
    setPlaced({});
    setSelected(null);
    setMistakes(0);
  };

  return (
    <div className="rounded-[2rem] border border-cream/10 bg-ink-2 p-5 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 font-display text-sm">
        <span className="font-bold">
          صُنّف <span className="text-lime">{ITEMS.length - pool.length}</span> من {ITEMS.length}
        </span>
        <span className="text-cream/50">الأخطاء: {mistakes}</span>
        <button type="button" onClick={reset} className="rounded-full border border-cream/20 px-4 py-1.5 hover:border-lime hover:text-lime">
          إعادة ↺
        </button>
      </div>

      {/* pool */}
      <div className="mb-6 flex min-h-[90px] flex-wrap gap-3" aria-label="البطاقات غير المصنفة">
        <AnimatePresence>
          {pool.map((it) => (
            <motion.div
              key={it.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={wrong?.id === it.id ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6, y: 40 }}
            >
              <button
                type="button"
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", String(it.id))}
                onClick={() => setSelected((s) => (s === it.id ? null : it.id))}
                aria-pressed={selected === it.id}
                className={`cursor-grab rounded-2xl border px-4 py-3 text-right leading-relaxed transition-colors active:cursor-grabbing ${
                  wrong?.id === it.id
                    ? "border-rose bg-rose/10"
                    : selected === it.id
                    ? "border-lime bg-lime/10 shadow-[0_0_30px_-8px_#8A1538]"
                    : "border-cream/15 bg-ink hover:border-leaf/60"
                }`}
              >
                {it.text}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {done && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full text-center font-display text-2xl font-black text-lime">
            أحسنت! صنّفت جميع الأدلة {mistakes === 0 ? "دون أي خطأ ✦" : `بـ ${mistakes} محاولة خاطئة`}
          </motion.p>
        )}
      </div>

      {/* bins */}
      <div className="grid gap-4 md:grid-cols-3">
        {BINS.map((b) => (
          <div
            key={b.kind}
            role="button"
            tabIndex={0}
            aria-label={`سلة الدليل ${b.label}${selected ? " — اضغط لوضع البطاقة المختارة" : ""}`}
            onClick={() => selected !== null && drop(selected, b.kind)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && selected !== null && drop(selected, b.kind)}
            onDragOver={(e) => {
              e.preventDefault();
              setHoverBin(b.kind);
            }}
            onDragLeave={() => setHoverBin(null)}
            onDrop={(e) => {
              e.preventDefault();
              setHoverBin(null);
              drop(Number(e.dataTransfer.getData("text/plain")), b.kind);
            }}
            className={`min-h-[200px] rounded-[1.5rem] border-2 border-dashed p-4 transition-all duration-300 ${
              wrong?.bin === b.kind ? "border-rose bg-rose/5" : hoverBin === b.kind || selected !== null ? "scale-[1.01]" : ""
            }`}
            style={{ borderColor: wrong?.bin === b.kind ? undefined : hoverBin === b.kind ? b.color : `${b.color}55`, backgroundColor: hoverBin === b.kind ? `${b.color}14` : undefined }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-xl font-black" style={{ color: b.color }}>
                دليل {b.label}
              </span>
              <span className="text-xs text-cream/45">{b.hint}</span>
            </div>
            <div className="space-y-2">
              {ITEMS.filter((i) => placed[i.id] === b.kind).map((i) => (
                <motion.p
                  key={i.id}
                  layoutId={`ev-${i.id}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl px-3 py-2 text-sm leading-relaxed text-ink"
                  style={{ backgroundColor: b.color }}
                >
                  ✓ {i.text}
                </motion.p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
