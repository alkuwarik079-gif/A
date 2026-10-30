"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const MARKS = ["،", "؛", ".", "؟", "!", ":"];
const NAMES: Record<string, string> = { "،": "فاصلة", "؛": "فاصلة منقوطة", ".": "نقطة", "؟": "استفهام", "!": "تأثر", ":": "نقطتان" };

// string = text, { a } = a blank whose answer is `a`
type Piece = string | { a: string };
const SENTENCES: { parts: Piece[]; why: string }[] = [
  { parts: ["متى تبدأ الامتحانات", { a: "؟" }], why: "جملة استفهامية تنتهي بعلامة الاستفهام." },
  { parts: ["ما أجملَ الصدقَ", { a: "!" }], why: "أسلوب تعجب ← علامة التأثر." },
  { parts: ["نجح خالد", { a: "؛" }, " لأنه اجتهد", { a: "." }], why: "الثانية سبب للأولى ← فاصلة منقوطة، ثم نقطة لتمام المعنى." },
  { parts: ["قال الحكيم", { a: ":" }, " «من جدّ وجد»", { a: "." }], why: "النقطتان بعد القول، والنقطة في نهاية الجملة." },
  { parts: ["يا أحمد", { a: "،" }, " أغلق الباب", { a: "." }], why: "الفاصلة بعد المنادى." },
  { parts: ["أقسام الكلام ثلاثة", { a: ":" }, " اسم", { a: "،" }, " وفعل", { a: "،" }, " وحرف", { a: "." }], why: "النقطتان قبل التقسيم، والفاصلة بين الأقسام." },
];

export default function PunctuationGame() {
  // answers keyed by "sentence-blankIndex"
  const [ans, setAns] = useState<Record<string, string>>({});
  const [focus, setFocus] = useState<string>("0-1");

  const blanks = SENTENCES.flatMap((s, si) => s.parts.map((p, pi) => (typeof p === "string" ? null : { key: `${si}-${pi}`, a: p.a })).filter(Boolean)) as { key: string; a: string }[];
  const correct = blanks.filter((b) => ans[b.key] === b.a).length;

  const put = (m: string) => {
    if (!focus) return;
    setAns((s) => ({ ...s, [focus]: m }));
    const b = blanks.find((x) => x.key === focus);
    if (b && b.a === m) {
      // advance to the next unanswered blank
      const next = blanks.find((x) => x.key !== focus && ans[x.key] !== x.a);
      if (next) setFocus(next.key);
    }
  };

  return (
    <div className="rounded-[2rem] border border-cream/10 bg-ink-2 p-5 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="font-display text-sm font-bold">
          صحيح <span className="text-lime">{correct}</span> من {blanks.length}
        </p>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream/10">
          <motion.div className="h-full rounded-full bg-gradient-to-l from-lime to-leaf" animate={{ width: `${(correct / blanks.length) * 100}%` }} />
        </div>
        <button type="button" onClick={() => { setAns({}); setFocus("0-1"); }} className="font-display text-sm text-cream/60 hover:text-lime">
          إعادة ↺
        </button>
      </div>

      <ol className="space-y-4">
        {SENTENCES.map((s, si) => {
          const allRight = s.parts.every((p, pi) => typeof p === "string" || ans[`${si}-${pi}`] === p.a);
          return (
            <li key={si} className={`rounded-2xl border p-4 transition-colors sm:p-5 ${allRight ? "border-leaf/50 bg-leaf/[0.06]" : "border-cream/10"}`}>
              <p className="text-xl leading-[2.4] sm:text-2xl">
                {s.parts.map((p, pi) => {
                  if (typeof p === "string") return <span key={pi}>{p}</span>;
                  const k = `${si}-${pi}`;
                  const v = ans[k];
                  const state = !v ? "empty" : v === p.a ? "right" : "wrong";
                  return (
                    <motion.button
                      key={pi}
                      type="button"
                      onClick={() => setFocus(k)}
                      animate={state === "wrong" ? { x: [0, -5, 5, -3, 3, 0] } : {}}
                      aria-label={`فراغ ${state === "empty" ? "فارغ" : `فيه ${NAMES[v]}`}${state === "wrong" ? "، خطأ" : state === "right" ? "، صحيح" : ""}`}
                      className={`mx-1 inline-grid h-11 w-11 place-items-center rounded-xl border-2 align-middle font-body text-2xl font-black transition-all ${
                        state === "right" ? "border-leaf bg-leaf text-ink" : state === "wrong" ? "border-rose bg-rose/15 text-rose" : "border-dashed border-cream/30"
                      } ${focus === k ? "ring-2 ring-lime ring-offset-2 ring-offset-ink-2" : ""}`}
                    >
                      {v ?? ""}
                    </motion.button>
                  );
                })}
              </p>
              {allRight && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2 text-sm text-leaf">
                  ✓ {s.why}
                </motion.p>
              )}
            </li>
          );
        })}
      </ol>

      {/* palette */}
      <div className="sticky bottom-4 z-10 mt-6 flex flex-wrap justify-center gap-2 rounded-2xl border border-lime/20 bg-ink/90 p-3 backdrop-blur-xl">
        {MARKS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => put(m)}
            className="glow-hover flex min-w-[4.5rem] flex-col items-center rounded-xl border border-cream/15 px-3 py-2 hover:text-lime"
            aria-label={NAMES[m]}
          >
            <span className="font-body text-3xl font-black leading-none">{m}</span>
            <span className="mt-1 font-display text-[10px] text-cream/50">{NAMES[m]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
