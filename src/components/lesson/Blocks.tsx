"use client";

import type { Block } from "@/lib/types";
import RichText from "../RichText";
import Reveal from "../Reveal";
import PinnedSteps from "./PinnedSteps";
import FlipCard from "./FlipCard";
import Widget from "../widgets";

const TONE = {
  agree: { ring: "border-leaf/40", chip: "bg-leaf text-ink", label: "تأييد" },
  disagree: { ring: "border-rose/40", chip: "bg-rose text-ink", label: "معارضة" },
  neutral: { ring: "border-lime/30", chip: "bg-lime text-ink", label: "شرح" },
};

function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case "p":
      return (
        <p className="max-w-3xl text-lg leading-[2.1] text-cream/85 sm:text-xl">
          <RichText text={b.text} />
        </p>
      );
    case "list": {
      const Tag = b.ordered ? "ol" : "ul";
      return (
        <Tag className="max-w-3xl space-y-3">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-4 text-lg leading-loose text-cream/85">
              <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-deep/70 font-display text-sm font-black text-lime">
                {b.ordered ? i + 1 : "◆"}
              </span>
              <span>
                <RichText text={it} />
              </span>
            </li>
          ))}
        </Tag>
      );
    }
    case "example":
      return (
        <figure className="paper relative max-w-4xl overflow-hidden rounded-[1.75rem] p-7 shadow-[0_30px_80px_-30px_rgba(92,14,37,.22)] sm:p-10">
          <span aria-hidden className="absolute -top-6 left-6 font-display text-[9rem] leading-none text-emerald-deep/15">
            ”
          </span>
          {b.title && <figcaption className="mb-3 font-display text-sm font-black text-emerald-deep">{b.title}</figcaption>}
          <blockquote className="relative text-xl leading-[2.2] text-ink sm:text-2xl">
            <RichText text={b.text} />
          </blockquote>
        </figure>
      );
    case "note":
      return (
        <aside className="flex max-w-3xl gap-4 rounded-2xl border border-lime/25 bg-lime/[0.06] p-5">
          <span aria-hidden className="font-display text-2xl text-lime">✦</span>
          <p className="leading-loose text-cream/85">
            <RichText text={b.text} />
          </p>
        </aside>
      );
    case "cards":
      return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {b.items.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <div className="glow-hover group h-full rounded-[1.5rem] border border-cream/10 bg-ink-2 p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-display text-xl font-black transition-colors group-hover:text-lime">{c.title}</h4>
                  {c.tag && (
                    <span className={`grid h-8 min-w-8 place-items-center rounded-full px-2 font-display text-sm font-black ${c.tag === "✕" ? "bg-rose/15 text-rose" : "bg-leaf/15 text-leaf"}`}>
                      {c.tag}
                    </span>
                  )}
                </div>
                <p className="leading-loose text-cream/70">
                  <RichText text={c.body} />
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      );
    case "steps":
      return <PinnedSteps items={b.items} />;
    case "table":
      return (
        <div className="max-w-full overflow-x-auto rounded-[1.5rem] border border-cream/10">
          <table className="w-full min-w-[560px] border-collapse text-right">
            <thead>
              <tr className="bg-emerald-deep/50">
                {b.head.map((h) => (
                  <th key={h} scope="col" className="px-5 py-4 font-display text-sm font-black text-lime">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="border-t border-cream/10 transition-colors hover:bg-leaf/[0.06]">
                  {r.map((c, j) => (
                    <td key={j} className={`px-5 py-4 align-top leading-loose ${j === 0 ? "font-display font-bold text-cream" : "text-cream/75"}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "phrases": {
      const tone = TONE[b.tone];
      return (
        <div className={`rounded-[1.75rem] border ${tone.ring} bg-ink-2 p-6 sm:p-8`}>
          <div className="mb-5 flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 font-display text-xs font-black ${tone.chip}`}>{tone.label}</span>
            <h4 className="font-display text-xl font-black">{b.title}</h4>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {b.items.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => navigator.clipboard?.writeText(p)}
                title="انسخ العبارة"
                className="glow-hover rounded-2xl border border-cream/10 bg-ink px-5 py-4 text-right text-lg leading-loose text-cream/85 active:scale-[0.98]"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      );
    }
    case "flips":
      return (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {b.items.map((f) => (
            <FlipCard key={f.name} {...f} />
          ))}
        </div>
      );
    case "widget":
      return <Widget id={b.id} />;
  }
}

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((b, i) => (
        <BlockView key={i} b={b} />
      ))}
    </div>
  );
}
