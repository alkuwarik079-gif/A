import Hero from "@/components/Hero";
import UnitCards from "@/components/UnitCards";
import StoryPinned from "@/components/StoryPinned";
import SplitText from "@/components/SplitText";
import Reveal from "@/components/Reveal";
import SectionReveal from "@/components/SectionReveal";

const MARQUEE = ["ء", "،", "؛", "؟", "!", "«»", "﴿﴾", "ـــ", "…", ":", "ض", "البيان", "الإملاء", "النحو", "البلاغة"];

const FEATURES = [
  { n: "22", t: "درسًا ونصًّا", d: "منهج متكامل في أربع وحدات." },
  { n: "10", t: "تفاعلات حيّة", d: "حاسبة الهمزة، ولعبة الأدلة، وشجرة البلاغة، وغيرها." },
  { n: "∞", t: "اختبارات قصيرة", d: "اختبار في نهاية كل درس، ونتيجتك تُحفظ على جهازك." },
];

export default function Home() {
  return (
    <div className="snap-home">
      <Hero />

      {/* marquee */}
      <div className="relative overflow-hidden border-y border-cream/10 bg-emerald-deep/20 py-5" aria-hidden>
        <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-12 whitespace-nowrap font-kufi text-4xl text-cream/40">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className={i % 3 === 0 ? "text-lime/70" : ""}>
              {m}
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(33.333%)}}`}</style>
      </div>

      <section id="units" className="snap-start relative mx-auto max-w-7xl scroll-mt-24 px-4 py-28 sm:px-6">
        <SectionReveal>
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(2.8rem,8vw,6.5rem)] font-black leading-none">
            <SplitText text="أربع وحدات" onScroll className="block" />
            <SplitText text="رحلة واحدة" onScroll delay={0.2} className="block text-outline" />
          </h2>
          <Reveal>
            <p className="max-w-sm text-lg text-cream/65">كل وحدة بطاقة تُفتح على دروسها؛ وكل درس أقسامٌ متتابعة، وشريط تقدم، واختبار قصير في نهايته.</p>
          </Reveal>
        </div>
        <UnitCards />
        </SectionReveal>
      </section>

      <StoryPinned />

      <section className="snap-start mx-auto max-w-7xl px-4 py-28 sm:px-6">
        <SectionReveal>
        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.t} delay={i * 0.1}>
              <div className="glow-hover h-full rounded-[2rem] border border-cream/10 bg-ink-2 p-8">
                <p className="font-display text-7xl font-black text-lime">{f.n}</p>
                <p className="mt-4 font-display text-2xl font-bold">{f.t}</p>
                <p className="mt-2 text-cream/60">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        </SectionReveal>
      </section>
    </div>
  );
}
