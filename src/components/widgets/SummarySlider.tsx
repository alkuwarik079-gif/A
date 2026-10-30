"use client";

import { useRef, useState } from "react";

const ORIGINAL = [
  "عرفت الحضارة العربية الإسلامية المكتبات منذ وقت مبكر، فقد أدرك المسلمون أن العلم لا يزدهر إلا بحفظ الكتب وتيسيرها للدارسين، فانتشرت المكتبات في المساجد والمدارس وقصور الخلفاء، وأصبحت جزءًا أصيلًا من الحياة الثقافية.",
  "ومن أشهر هذه المكتبات «بيت الحكمة» في بغداد، الذي ازدهر في عهد الخليفة المأمون، وكان مكتبةً ومركزًا للترجمة والبحث، يجتمع فيه العلماء والمترجمون من شتى الأجناس، فنُقلت فيه علوم اليونان والفرس والهند إلى العربية.",
  "ولم تكن المكتبات حكرًا على بغداد؛ ففي القاهرة أُنشئت «دار العلم» في العصر الفاطمي، وفي قرطبة جمع الخليفة الحكم المستنصر مكتبةً ضخمة قيل إنها ضمّت مئات الآلاف من المجلدات، فكانت منارةً لطلاب العلم في الأندلس وأوروبا.",
  "وقد تميزت هذه المكتبات بتنظيم دقيق؛ إذ كانت لها فهارس تصنّف الكتب حسب موضوعاتها، ويقوم عليها خزّانٌ ونسّاخٌ ومجلّدون، وكانت تتيح القراءة والاستعارة لعامة الناس، بل كان بعضها يقدم الورق والحبر للنسّاخ والباحثين.",
  "وهكذا أسهمت المكتبات العربية في حفظ التراث الإنساني ونقله، ومهّدت الطريق للنهضة العلمية التي شهدتها أوروبا فيما بعد، وهي شاهدٌ على أن الأمة التي تقدّر الكتاب تصنع الحضارة.",
];

const SUMMARY =
  "اهتم العرب المسلمون بالمكتبات مبكرًا إدراكًا لدورها في ازدهار العلم، فانتشرت في المساجد والمدارس والقصور. وكان أشهرها بيت الحكمة ببغداد الذي جمع بين حفظ الكتب وترجمتها، إلى جانب دار العلم بالقاهرة ومكتبة قرطبة بالأندلس. وتميزت تلك المكتبات بتنظيم دقيق وخدمات متاحة للجميع، فأسهمت في حفظ التراث الإنساني ونقله، ومهّدت للنهضة العلمية الأوروبية.";

const count = (s: string) => s.split(/\s+/).filter(Boolean).length;

export default function SummarySlider() {
  const [v, setV] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const before = ORIGINAL.reduce((a, p) => a + count(p), 0);
  const after = count(SUMMARY);

  const drag = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    // RTL: "before" sits on the right; dragging leftward reveals more of it
    setV(Math.max(0, Math.min(100, ((r.right - clientX) / r.width) * 100)));
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 font-display text-sm">
        <span className="rounded-full bg-cream/10 px-4 py-1.5 font-bold">قبل: {before} كلمة · 5 فقرات</span>
        <span className="text-cream/50">نسبة الملخص ≈ {Math.round((after / before) * 100)}%</span>
        <span className="rounded-full bg-lime px-4 py-1.5 font-bold text-ink">بعد: {after} كلمة · فقرة واحدة</span>
      </div>

      <div
        ref={box}
        className="relative grid touch-pan-y select-none overflow-hidden rounded-[1.75rem] shadow-[0_40px_100px_-40px_rgba(92,14,37,.22)]"
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          drag(e.clientX);
        }}
        onPointerMove={(e) => e.buttons === 1 && drag(e.clientX)}
      >
        {/* after (base layer) */}
        <div className="col-start-1 row-start-1 flex min-h-[460px] flex-col justify-center bg-emerald-deep p-6 sm:p-12">
          <p className="mb-4 font-display text-sm font-black text-lime">الملخص النهائي</p>
          <p className="text-xl leading-[2.3] text-cream sm:text-2xl">{SUMMARY}</p>
        </div>
        {/* before (clipped overlay from the right) */}
        <div
          className="paper col-start-1 row-start-1 overflow-hidden p-6 sm:p-12"
          style={{ clipPath: `inset(0 0 0 ${100 - v}%)` }}
          aria-hidden={v < 5}
        >
          <p className="mb-3 font-display text-sm font-black text-emerald-deep">النص الأصلي: المكتبات العربية</p>
          <div className="space-y-2 text-[15px] leading-[2] text-ink/85 sm:text-base">
            {ORIGINAL.map((p, i) => (
              <p key={i} className="indent-6">
                <span className="ml-1 font-display text-xs font-black text-emerald-deep">({i + 1})</span>
                {p}
              </p>
            ))}
          </div>
        </div>
        {/* handle */}
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-lime shadow-[0_0_20px_#8A1538]" style={{ right: `${v}%` }}>
          <span className="absolute top-1/2 grid h-12 w-12 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-lime font-display font-black text-ink shadow-[0_0_30px_#A8405C]" style={{ right: 0 }}>
            ⇆
          </span>
        </div>
      </div>

      <label className="mt-5 flex items-center gap-4 font-display text-sm text-cream/60">
        <span>بعد</span>
        <input
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => setV(Number(e.target.value))}
          className="flex-1 accent-[#8A1538]"
          aria-label="مقدار عرض النص الأصلي مقابل الملخص"
        />
        <span>قبل</span>
      </label>
    </div>
  );
}
