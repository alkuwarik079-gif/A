"use client";

import { useEffect } from "react";

/** Maroon ripple that blooms wherever a link or button is tapped. */
export default function TapRipple() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onDown = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("a, button, [role=button]");
      if (!target) return;
      const dot = document.createElement("span");
      dot.className = "tap-ripple";
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      document.body.appendChild(dot);
      dot.addEventListener("animationend", () => dot.remove());
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}
