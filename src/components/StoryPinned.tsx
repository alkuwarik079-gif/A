"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  { label: "الحرف", big: "ض", body: "تبدأ الحكاية بحرفٍ تفرّدت به العربية حتى سُمّيت «لغة الضاد»." },
  { label: "الكلمة", big: "كَلِمة", body: "يجتمع الحرف إلى الحرف فتولد الكلمة: اسمٌ أو فعلٌ أو حرف." },
  { label: "الجملة", big: "العلمُ نورٌ", body: "تتآلف الكلمات وفق قواعد النحو فتصنع جملةً تامة المعنى." },
  { label: "الفقرة", big: "فكرةٌ + دليل", body: "تتماسك الجمل حول فكرة واحدة تدعمها الأدلة فتصير فقرة." },
  { label: "النص", big: "لغتي هويتي", body: "وتتلاقى الفقرات في نصٍّ يحمل الفكر والجمال والهوية." },
];

export default function StoryPinned() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const layers = gsap.utils.toArray<HTMLElement>(".story-layer", el);
      const dots = gsap.utils.toArray<HTMLElement>(".story-dot", el);
      gsap.set(layers.slice(1), { autoAlpha: 0, yPercent: 30, scale: 0.9, filter: "blur(12px)" });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${window.innerHeight * (STAGES.length - 0.5)}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const i = Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length));
            dots.forEach((d, k) => d.classList.toggle("is-on", k <= i));
          },
        },
      });
      layers.forEach((layer, i) => {
        if (i === 0) return;
        tl.to(layers[i - 1], { autoAlpha: 0, yPercent: -30, scale: 1.08, filter: "blur(12px)", duration: 1 }, i)
          .to(layer, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)", duration: 1 }, i)
          .to(".story-bar", { scaleX: i / (STAGES.length - 1), duration: 1 }, i);
      });
      tl.to({}, { duration: 0.5 });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden bg-ink-2 motion-safe:h-[100svh]" aria-label="من الحرف إلى النص">
      <div className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-6">
        <div className="mb-10 flex items-center gap-4">
          <span className="font-display text-sm font-bold text-leaf">رحلة المعنى</span>
          <span className="h-px flex-1 origin-right bg-cream/10">
            <span className="story-bar block h-full origin-right scale-x-0 bg-lime" />
          </span>
          <ol className="flex gap-2" aria-hidden>
            {STAGES.map((s, i) => (
              <li key={s.label} className={`story-dot h-2 w-2 rounded-full bg-cream/20 transition-colors [&.is-on]:bg-lime ${i === 0 ? "is-on" : ""}`} />
            ))}
          </ol>
        </div>

        {/* With motion: layers stack and crossfade. Reduced motion: they flow as a list. */}
        <div className="relative grid motion-safe:min-h-[55svh] motion-reduce:gap-16">
          {STAGES.map((s, i) => (
            <div key={s.label} className="story-layer motion-safe:col-start-1 motion-safe:row-start-1 grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <p className="font-display text-[clamp(4rem,14vw,12rem)] font-black leading-none">
                <span className={i === STAGES.length - 1 ? "gradient-text" : "text-cream"}>{s.big}</span>
              </p>
              <div>
                <p className="font-display text-sm font-bold text-lime">
                  0{i + 1} — {s.label}
                </p>
                <p className="mt-3 text-2xl leading-relaxed text-cream/80">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
