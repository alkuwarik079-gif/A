"use client";

import { useEffect, useRef, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ZWJ = "‍";
const isArabicLetter = (c: string) => /[ؠ-يٱ-ۓـ]/.test(c);
const isMark = (c: string) => /[ً-ٰٟۖ-ۭ]/.test(c);
// letters that never connect to the following letter
const RIGHT_JOINING = new Set("اأإآٱدذرزوؤةى");
const NON_JOINING = new Set("ء");

const joinsForward = (c: string) => isArabicLetter(c) && !RIGHT_JOINING.has(c) && !NON_JOINING.has(c);
const joinsBackward = (c: string) => isArabicLetter(c) && !NON_JOINING.has(c);

/**
 * Splits Arabic text into per-letter spans while keeping cursive joins:
 * each span carries zero-width joiners on the sides where its neighbours connect,
 * so the browser still picks initial/medial/final forms.
 */
function splitWord(word: string) {
  const clusters: string[] = [];
  for (const ch of word) {
    if (isMark(ch) && clusters.length) clusters[clusters.length - 1] += ch;
    else clusters.push(ch);
  }
  return clusters.map((cl, i) => {
    const base = cl[0];
    const prev = clusters[i - 1]?.[0];
    const next = clusters[i + 1]?.[0];
    const before = prev && joinsForward(prev) && joinsBackward(base) ? ZWJ : "";
    const after = next && joinsForward(base) && joinsBackward(next) ? ZWJ : "";
    return before + cl + after;
  });
}

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  onScroll?: boolean;
};

export default function SplitText({ text, as: Tag = "span", className, delay = 0, stagger = 0.035, onScroll = false }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chars = el.querySelectorAll<HTMLElement>(".split-char");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "expo.out",
          stagger,
          delay,
          scrollTrigger: onScroll ? { trigger: el, start: "top 85%", once: true } : undefined,
        }
      );
    }, el);
    return () => ctx.revert();
  }, [text, delay, stagger, onScroll]);

  const words = text.split(" ");
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden className="split-word">
          {splitWord(w).map((c, ci) => (
            <span key={ci} className="split-char">
              {c}
            </span>
          ))}
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
