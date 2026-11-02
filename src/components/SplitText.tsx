"use client";

import { useEffect, useRef, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  onScroll?: boolean;
};

/**
 * Headline reveal that animates word by word. Arabic letters must stay inside one
 * text run to join correctly (Safari breaks joins across separate letter spans),
 * so each word is kept whole and rises into place.
 */
export default function SplitText({ text, as: Tag = "span", className, delay = 0, stagger = 0.08, onScroll = false }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const words = el.querySelectorAll<HTMLElement>(".split-char");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { yPercent: 105, opacity: 0 },
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
          <span className="split-char">{w}</span>
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
