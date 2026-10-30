"use client";

import { useState } from "react";

export default function FlipCard({ name, tools, example, note }: { name: string; tools: string; example: string; note?: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      aria-pressed={flipped}
      aria-label={`${name}: ${flipped ? "المثال" : "الأدوات"} — اضغط للقلب`}
      className={`flip group block h-72 w-full text-right ${flipped ? "is-flipped" : ""}`}
    >
      <span className="flip-inner block">
        <span className="flip-face glow-hover flex flex-col justify-between rounded-[1.75rem] border border-cream/10 bg-ink-2 p-6">
          <span className="flex items-center justify-between">
            <span className="font-display text-xs font-bold text-leaf">الأدوات</span>
            {note && <span className="rounded-full bg-emerald-deep/60 px-3 py-1 font-display text-[11px] text-lime">{note}</span>}
          </span>
          <span>
            <span className="block font-display text-3xl font-black">{name}</span>
            <span className="mt-3 block text-[15px] leading-loose text-cream/70">{tools}</span>
          </span>
          <span className="font-display text-xs text-cream/40">اضغط لترى المثال ↺</span>
        </span>
        <span className="flip-face flip-back paper flex flex-col justify-between rounded-[1.75rem] p-6">
          <span className="font-display text-xs font-bold text-emerald-deep">مثال · {name}</span>
          <span className="font-body text-2xl font-bold leading-loose text-ink">{example}</span>
          <span className="font-display text-xs text-ink/50">اضغط للعودة ↺</span>
        </span>
      </span>
    </button>
  );
}
