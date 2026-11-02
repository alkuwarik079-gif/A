"use client";

const LETTERS = "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي".split(" ");

// deterministic pseudo-random so server and client render the same field
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const STREAKS = Array.from({ length: 16 }, (_, i) => ({
  letter: LETTERS[(i * 7) % LETTERS.length],
  top: rand(i + 1) * 70 - 5, // %
  left: 35 + rand(i + 11) * 75, // %
  size: 1.2 + rand(i + 21) * 1.8, // rem
  dur: 2.6 + rand(i + 31) * 2.4, // s
  delay: rand(i + 41) * 5, // s
  tail: 90 + rand(i + 51) * 160, // px
  angle: -(22 + rand(i + 61) * 14), // deg
}));

/** Arabic letters streaking across the sky like shooting stars, each trailing a maroon tail. */
export default function ShootingLetters() {
  return (
    // Kept clear of the headline: above it on phones, in the empty left half on desktop.
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[42%] overflow-hidden lg:right-auto lg:h-full lg:w-[52%]" aria-hidden>
      <style>{`
        @keyframes shoot {
          0% { transform: translateX(0); opacity: 0; }
          8% { opacity: .5; }
          70% { opacity: .5; }
          100% { transform: translateX(-120vmax); opacity: 0; }
        }
        .shoot-run { animation: shoot var(--dur) cubic-bezier(.35,.1,.6,1) var(--delay) infinite; opacity: 0; }
        @media (prefers-reduced-motion: reduce) { .shoot-run { animation: none; opacity: .5; } }
      `}</style>
      {STREAKS.map((s, i) => (
        <div key={i} className="absolute" style={{ top: `${s.top}%`, left: `${s.left}%`, transform: `rotate(${s.angle}deg)` }}>
          <div
            dir="ltr"
            className="shoot-run flex items-center will-change-transform"
            style={{ ["--dur" as string]: `${s.dur}s`, ["--delay" as string]: `${s.delay}s` }}
          >
            <span
              className="font-display font-bold leading-none text-lime"
              style={{ fontSize: `${s.size}rem`, transform: `rotate(${-s.angle}deg)`, display: "inline-block" }}
            >
              {s.letter}
            </span>
            <span
              className="-ml-1 h-[2px] rounded-full"
              style={{ width: s.tail, background: "linear-gradient(90deg, rgba(138,21,56,.7), rgba(184,146,90,.35) 40%, transparent)" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
