"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { QuizQ } from "@/lib/types";
import { saveQuiz } from "@/lib/progress";

const LETTERS = ["أ", "ب", "ج", "د"];

export default function Quiz({ unit, lesson, questions }: { unit: string; lesson: string; questions: QuizQ[] }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[i];

  const choose = (k: number) => {
    if (picked !== null) return;
    setPicked(k);
    if (k === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (i + 1 < questions.length) {
      setI(i + 1);
      setPicked(null);
    } else {
      setDone(true);
      saveQuiz(unit, lesson, score, questions.length);
    }
  };

  const restart = () => {
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  const pct = Math.round((score / questions.length) * 100);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-leaf/25 bg-gradient-to-br from-emerald-deep/40 to-ink-2 p-6 sm:p-10">
      <div className="pattern-girih pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-display text-sm font-black text-lime">
            {done ? "النتيجة" : `السؤال ${i + 1} من ${questions.length}`}
          </span>
          <div className="flex flex-1 gap-1.5">
            {questions.map((_, k) => (
              <span key={k} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${k < i || done ? "bg-lime" : k === i ? "bg-leaf/60" : "bg-cream/10"}`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              <h3 className="font-display text-2xl font-black leading-relaxed sm:text-3xl">{q.q}</h3>
              <div className="mt-7 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={q.q}>
                {q.options.map((o, k) => {
                  const state = picked === null ? "idle" : k === q.answer ? "right" : k === picked ? "wrong" : "dim";
                  return (
                    <motion.button
                      key={o}
                      type="button"
                      role="radio"
                      aria-checked={picked === k}
                      onClick={() => choose(k)}
                      whileTap={{ scale: 0.98 }}
                      animate={state === "wrong" ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                      className={`flex items-center gap-4 rounded-2xl border px-5 py-4 text-right text-lg transition-all duration-300 ${
                        state === "right"
                          ? "border-leaf bg-leaf/15 text-cream shadow-[0_0_40px_-10px_#22C55E]"
                          : state === "wrong"
                          ? "border-rose bg-rose/10 text-cream"
                          : state === "dim"
                          ? "border-cream/5 text-cream/40"
                          : "border-cream/15 bg-ink/60 hover:border-leaf/60 hover:bg-emerald-deep/30"
                      }`}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl font-display text-sm font-black ${
                          state === "right" ? "bg-leaf text-ink" : state === "wrong" ? "bg-rose text-ink" : "bg-cream/10 text-cream/70"
                        }`}
                      >
                        {state === "right" ? "✓" : state === "wrong" ? "✕" : LETTERS[k]}
                      </span>
                      {o}
                    </motion.button>
                  );
                })}
              </div>

              <div aria-live="polite" className="mt-6 min-h-[3.5rem]">
                {picked !== null && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4">
                    <p className={picked === q.answer ? "text-leaf" : "text-rose"}>
                      <span className="font-display font-black">{picked === q.answer ? "أحسنت! " : "ليست الإجابة الصحيحة. "}</span>
                      {q.why ?? (picked === q.answer ? "إجابة دقيقة." : `الصواب: ${q.options[q.answer]}`)}
                    </p>
                    <button type="button" onClick={next} className="rounded-full bg-lime px-7 py-3 font-display font-black text-ink transition-shadow hover:shadow-[0_0_40px_-5px_#A3E635]">
                      {i + 1 < questions.length ? "التالي ←" : "اعرض النتيجة"}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <p className="font-display text-[clamp(5rem,18vw,9rem)] font-black leading-none text-lime text-glow">{pct}%</p>
              <p className="mt-4 font-display text-2xl font-black">
                {pct === 100 ? "ممتاز! إتقان تام." : pct >= 60 ? "جيد جدًا، واصل التقدم." : "راجع الدرس وحاول مرة أخرى."}
              </p>
              <p className="mt-2 text-cream/60">
                أجبت إجابة صحيحة عن {score} من {questions.length} أسئلة، وحُفظت نتيجتك.
              </p>
              <button type="button" onClick={restart} className="mt-8 rounded-full border border-lime/50 px-7 py-3 font-display font-black text-lime transition-colors hover:bg-lime hover:text-ink">
                أعد المحاولة ↺
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
