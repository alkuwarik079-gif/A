"use client";

import { useState } from "react";

export type Legend = { key: string; label: string; color: string }[];
export type Seg = [key: string, text: string];

type Props = {
  title?: string;
  legend: Legend;
  paragraphs: Seg[][];
  /** "color": parts are coloured from the start; "reveal": parts stay plain until hovered/focused */
  mode?: "color" | "reveal";
};

/**
 * A document whose sentences are tagged with roles (e.g. تمهيد / فكرة / دليل).
 * Legend chips focus one role at a time; hovering a sentence names its role.
 */
export default function HighlightDoc({ title, legend, paragraphs, mode = "color" }: Props) {
  const [focus, setFocus] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [revealAll, setRevealAll] = useState(false);
  const byKey = Object.fromEntries(legend.map((l) => [l.key, l]));
  const current = hover ?? focus;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      <div className="paper relative overflow-hidden rounded-[1.75rem] p-6 shadow-[0_40px_100px_-40px_rgba(92,14,37,.22)] sm:p-10">
        {title && <h4 className="mb-6 text-center font-display text-2xl font-black text-emerald-deep sm:text-3xl">{title}</h4>}
        <div className="space-y-5 text-[1.15rem] leading-[2.3] text-ink sm:text-xl">
          {paragraphs.map((p, pi) => (
            <p key={pi} className="indent-8">
              {p.map(([k, text], si) => {
                const l = byKey[k];
                const lit = mode === "color" ? !focus || focus === k : revealAll || current === k;
                const dim = focus && focus !== k;
                return (
                  <span
                    key={si}
                    tabIndex={0}
                    onMouseEnter={() => setHover(k)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(k)}
                    onBlur={() => setHover(null)}
                    className="relative cursor-help rounded-md px-0.5 transition-all duration-300 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
                    style={{
                      backgroundColor: lit ? `${l.color}33` : "transparent",
                      boxShadow: lit ? `inset 0 -3px 0 ${l.color}` : "none",
                      opacity: dim ? 0.35 : 1,
                    }}
                    aria-label={`${l.label}: ${text}`}
                  >
                    {text}{" "}
                  </span>
                );
              })}
            </p>
          ))}
        </div>
      </div>

      <aside className="space-y-3 lg:sticky lg:top-[calc(var(--nav-h)+80px)] lg:self-start">
        <div className="rounded-2xl border border-cream/10 bg-ink-2 p-4" aria-live="polite">
          <p className="font-display text-xs text-cream/50">الجزء المحدد</p>
          <p className="mt-1 font-display text-xl font-black" style={{ color: current ? byKey[current].color : undefined }}>
            {current ? byKey[current].label : "مرّر فوق النص"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:flex-col">
          {legend.map((l) => (
            <button
              key={l.key}
              type="button"
              aria-pressed={focus === l.key}
              onClick={() => setFocus((f) => (f === l.key ? null : l.key))}
              className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-right font-display text-sm font-bold transition-all ${
                focus === l.key ? "border-transparent text-ink" : "border-cream/10 text-cream/80 hover:border-cream/30"
              }`}
              style={{ backgroundColor: focus === l.key ? l.color : undefined }}
            >
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: l.color }} />
              {l.label}
            </button>
          ))}
          {mode === "reveal" && (
            <button
              type="button"
              onClick={() => setRevealAll((v) => !v)}
              aria-pressed={revealAll}
              className="rounded-xl border border-lime/40 px-4 py-2.5 font-display text-sm font-bold text-lime transition-colors hover:bg-lime hover:text-ink"
            >
              {revealAll ? "إخفاء الألوان" : "كشف جميع الأجزاء"}
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
