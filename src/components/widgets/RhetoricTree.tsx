"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

type Node = { id: string; label: string; def: string; ex?: string; children?: Node[] };

const TREE: Node = {
  id: "root",
  label: "المحسنات",
  def: "أساليب تزيّن الكلام لفظًا أو معنى، فتقوّيه وتمنحه جمالًا وتأثيرًا.",
  children: [
    {
      id: "tadad",
      label: "التضاد",
      def: "الجمع بين المعنى وضده لتوضيحه وتقويته.",
      children: [
        { id: "tibaq-ij", label: "طباق إيجاب", def: "الجمع بين الكلمة وضدها.", ex: "﴿وَتَحْسَبُهُمْ أَيْقَاظًا وَهُمْ رُقُودٌ﴾" },
        { id: "tibaq-salb", label: "طباق سلب", def: "فعلان من مصدر واحد أحدهما مثبت والآخر منفي.", ex: "يعلمون / لا يعلمون" },
        { id: "muqabala", label: "مقابلة", def: "مقابلة معنيين أو أكثر بأضدادها على الترتيب.", ex: "فليضحكوا قليلًا وليبكوا كثيرًا" },
      ],
    },
    {
      id: "lafzi",
      label: "الإيقاع اللفظي",
      def: "محسنات تقوم على تشابه الأصوات فتمنح الكلام جرسًا موسيقيًا.",
      children: [
        { id: "jinas-tam", label: "جناس تام", def: "اتفاق الكلمتين في الحروف نوعًا وعددًا وترتيبًا وشكلًا مع اختلاف المعنى.", ex: "تقوم الساعة… ما لبثوا غير ساعة" },
        { id: "jinas-naqis", label: "جناس ناقص", def: "اختلاف الكلمتين في أمر واحد من الأمور الأربعة.", ex: "الخيل / الخير" },
        { id: "saja", label: "سجع", def: "توافق الفاصلتين في الحرف الأخير في النثر.", ex: "أعطِ منفقًا خلفًا، وأعطِ ممسكًا تلفًا" },
      ],
    },
    {
      id: "maana",
      label: "المعنى",
      def: "تكرار المعنى بألفاظ مختلفة لتأكيده.",
      children: [{ id: "taraduf", label: "ترادف", def: "لفظان مختلفان بمعنى واحد.", ex: "الحزن والأسى" }],
    },
    {
      id: "tartib",
      label: "الترتيب",
      def: "طريقة تنظيم المعنى بين الإيجاز والبسط.",
      children: [
        { id: "ijmal", label: "إجمال ← تفصيل", def: "ذكر المعنى مجملًا ثم تفصيله؛ للتشويق والتمكين.", ex: "اغتنم خمسًا قبل خمس: شبابك قبل هرمك…" },
        { id: "tafsil", label: "تفصيل ← إجمال", def: "ذكر التفاصيل ثم جمعها في عبارة؛ للتأكيد والتلخيص.", ex: "الصدق والأمانة والوفاء… تلك أخلاق المؤمن" },
      ],
    },
  ],
};

// layout: 9 leaves spread across a 1000-wide canvas, RTL (first leaf on the right)
const leaves = TREE.children!.flatMap((b) => b.children!);
const LEAF_X: Record<string, number> = {};
leaves.forEach((l, i) => (LEAF_X[l.id] = 1000 - (i + 0.5) * (1000 / leaves.length)));
const BRANCH_X: Record<string, number> = {};
TREE.children!.forEach((b) => {
  const xs = b.children!.map((c) => LEAF_X[c.id]);
  BRANCH_X[b.id] = xs.reduce((a, x) => a + x, 0) / xs.length;
});

const Y = { root: 50, branch: 210, leaf: 390 };
const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const my = (y1 + y2) / 2;
  return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
};

const ALL: Node[] = [TREE, ...TREE.children!, ...leaves];

export default function RhetoricTree() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();
  const [sel, setSel] = useState("root");
  const show = inView || !!reduce;
  const node = ALL.find((n) => n.id === sel)!;

  const nodeBox = (n: Node, x: number, y: number, w: number, level: number, delay: number) => {
    const on = sel === n.id;
    return (
      <motion.g
        key={n.id}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={show ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: reduce ? 0 : delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: `${x}px ${y}px`, cursor: "pointer" }}
        onClick={() => setSel(n.id)}
        role="button"
        tabIndex={0}
        aria-label={n.label}
        aria-pressed={on}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(n.id)}
      >
        <rect
          x={x - w / 2}
          y={y - 22}
          width={w}
          height={44}
          rx={22}
          fill={on ? "#A3E635" : level === 0 ? "#0F5132" : "#121914"}
          stroke={on ? "#A3E635" : level === 2 ? "rgba(245,241,230,.2)" : "#22C55E"}
          strokeWidth={1.5}
          style={{ filter: on ? "drop-shadow(0 0 14px #22C55E)" : undefined, transition: "fill .3s" }}
        />
        <text x={x} y={y + 6} textAnchor="middle" direction="rtl" fontFamily="var(--font-display)" fontWeight={800} fontSize={level === 0 ? 20 : level === 1 ? 17 : 15} fill={on ? "#0B0F0C" : "#F5F1E6"}>
          {n.label}
        </text>
      </motion.g>
    );
  };

  return (
    <div ref={ref} className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="overflow-hidden rounded-[2rem] border border-cream/10 bg-ink-2 p-3 sm:p-6">
        {/* desktop/tablet: SVG tree */}
        <svg viewBox="0 0 1000 430" className="hidden w-full md:block" role="group" aria-label="شجرة المحسنات البديعية">
          {TREE.children!.map((b, bi) => (
            <g key={b.id}>
              <motion.path
                d={curve(500, Y.root + 22, BRANCH_X[b.id], Y.branch - 22)}
                fill="none"
                stroke="#22C55E"
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={show ? { pathLength: 1 } : {}}
                transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.2 + bi * 0.1 }}
              />
              {b.children!.map((l, li) => (
                <motion.path
                  key={l.id}
                  d={curve(BRANCH_X[b.id], Y.branch + 22, LEAF_X[l.id], Y.leaf - 22)}
                  fill="none"
                  stroke="rgba(163,230,53,.55)"
                  strokeWidth={1.5}
                  initial={{ pathLength: 0 }}
                  animate={show ? { pathLength: 1 } : {}}
                  transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.9 + bi * 0.12 + li * 0.08 }}
                />
              ))}
            </g>
          ))}
          {nodeBox(TREE, 500, Y.root, 170, 0, 0)}
          {TREE.children!.map((b, bi) => (
            nodeBox(b, BRANCH_X[b.id], Y.branch, 150, 1, 0.7 + bi * 0.1)
          ))}
          {leaves.map((l, i) => (
            nodeBox(l, LEAF_X[l.id], Y.leaf, 104, 2, 1.4 + i * 0.06)
          ))}
        </svg>

        {/* mobile: indented branching list */}
        <ul className="space-y-3 p-2 md:hidden" aria-label="شجرة المحسنات البديعية">
          <li>
            <button type="button" onClick={() => setSel("root")} className={`rounded-full px-5 py-2 font-display font-black ${sel === "root" ? "bg-lime text-ink" : "bg-emerald-deep"}`}>
              المحسنات
            </button>
            <ul className="mr-5 mt-3 space-y-4 border-r-2 border-leaf/50 pr-4">
              {TREE.children!.map((b, bi) => (
                <motion.li key={b.id} initial={{ opacity: 0, x: 20 }} animate={show ? { opacity: 1, x: 0 } : {}} transition={{ delay: reduce ? 0 : bi * 0.12 }}>
                  <button type="button" onClick={() => setSel(b.id)} className={`rounded-full border px-4 py-1.5 font-display font-bold ${sel === b.id ? "border-lime bg-lime text-ink" : "border-leaf/50"}`}>
                    {b.label}
                  </button>
                  <ul className="mr-4 mt-2 flex flex-wrap gap-2 border-r border-lime/30 pr-3">
                    {b.children!.map((l) => (
                      <li key={l.id}>
                        <button type="button" onClick={() => setSel(l.id)} className={`rounded-full border px-3 py-1 text-sm ${sel === l.id ? "border-lime bg-lime text-ink" : "border-cream/20"}`}>
                          {l.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.li>
              ))}
            </ul>
          </li>
        </ul>
      </div>

      <AnimatePresence mode="wait">
        <motion.aside
          key={node.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="paper self-start rounded-[1.75rem] p-6"
          aria-live="polite"
        >
          <p className="font-display text-xs font-black text-emerald-deep">التعريف</p>
          <h4 className="mt-1 font-display text-3xl font-black text-ink">{node.label}</h4>
          <p className="mt-3 leading-loose text-ink/80">{node.def}</p>
          {node.ex && (
            <p className="mt-4 rounded-xl bg-emerald-deep px-4 py-3 text-lg leading-loose text-cream">
              <span className="block font-display text-xs text-lime">مثال</span>
              {node.ex}
            </p>
          )}
          {node.children && <p className="mt-4 font-display text-sm text-ink/50">يتفرع إلى: {node.children.map((c) => c.label).join("، ")}</p>}
        </motion.aside>
      </AnimatePresence>
    </div>
  );
}
