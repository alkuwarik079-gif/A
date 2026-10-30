"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Part = string | [string]; // [x] = marker phrase that signals the style

const STYLES: { name: string; tag: string; color: string; parts: Part[]; traits: string[] }[] = [
  {
    name: "العلمي",
    tag: "يخاطب العقل",
    color: "#B8925A",
    parts: ["الشمس ", ["نجمٌ متوسط الحجم"], " يقع في مركز المجموعة الشمسية، ويبعد عن الأرض نحو ", ["150 مليون كيلومتر"], "، وتبلغ درجة حرارة سطحها قرابة ", ["5500 درجة مئوية"], "، وتنتج طاقتها من ", ["تفاعلات الاندماج النووي"], "."],
    traits: ["أرقام دقيقة", "مصطلحات علمية", "لا خيال"],
  },
  {
    name: "الأدبي",
    tag: "يخاطب الوجدان",
    color: "#C26B85",
    parts: ["أطلّت الشمس من خدرها ", ["عروسًا ذهبية"], "، ", ["تنثر ضفائرها"], " على الحقول، فتستيقظ ", ["الأزهار مبتسمة"], "، وتغسل الدنيا وجهها بنورٍ دافئٍ ", ["كحضن أمٍّ رؤوم"], "."],
    traits: ["تشبيه واستعارة", "تشخيص", "عاطفة"],
  },
  {
    name: "العلمي المتأدب",
    tag: "يجمع بينهما",
    color: "#8A1538",
    parts: ["الشمس ", ["ذلك الفرن النووي الهائل"], " الذي يتربع في قلب مجموعتنا، ", ["يحوّل الهيدروجين إلى هيليوم"], " في كل ثانية، فيرسل إلينا -على بعد ", ["150 مليون كيلومتر"], "- ", ["دفئًا هو سرّ الحياة"], " على كوكبنا."],
    traits: ["حقيقة + صورة", "اعتدال", "تبسيط"],
  },
];

export default function StylesCompare() {
  const [reveal, setReveal] = useState(false);
  return (
    <div>
      <div className="mb-5 flex justify-end">
        <button
          type="button"
          aria-pressed={reveal}
          onClick={() => setReveal((v) => !v)}
          className={`rounded-full px-6 py-2.5 font-display font-black transition-all ${reveal ? "bg-lime text-ink shadow-[0_0_40px_-8px_#8A1538]" : "border border-lime/50 text-lime hover:bg-lime/10"}`}
        >
          {reveal ? "إخفاء السمات" : "كشف السمات ✦"}
        </button>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {STYLES.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 40, rotate: i === 1 ? 0 : i === 0 ? 1.5 : -1.5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="paper flex flex-col rounded-[1.75rem] p-6 sm:p-8"
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-display text-2xl font-black text-ink">{s.name}</h4>
              <span className="rounded-full px-3 py-1 font-display text-xs font-black text-ink" style={{ backgroundColor: s.color }}>
                {s.tag}
              </span>
            </div>
            <p className="flex-1 text-lg leading-[2.2] text-ink/90">
              {s.parts.map((p, k) =>
                typeof p === "string" ? (
                  <span key={k}>{p}</span>
                ) : (
                  <mark
                    key={k}
                    className="rounded px-0.5 text-ink transition-all duration-500 [box-decoration-break:clone]"
                    style={{ backgroundColor: reveal ? `${s.color}66` : "transparent", boxShadow: reveal ? `inset 0 -3px 0 ${s.color}` : "none" }}
                  >
                    {p[0]}
                  </mark>
                )
              )}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-ink/10 pt-4">
              {s.traits.map((t) => (
                <span key={t} className="rounded-full bg-ink/90 px-3 py-1 font-display text-xs font-bold text-cream">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
