# للغة العربية — Arabic Language Skills

Next.js 16 · Tailwind CSS 4 · React Three Fiber · GSAP ScrollTrigger · Framer Motion

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Structure
- `src/lib/content/*.ts` — all curriculum content (writing, rhetoric, grammar, texts). Edit lessons, sections, and quizzes here.
- `src/lib/progress.ts` — per-lesson progress in localStorage (70% sections read + 30% quiz taken).
- `src/components/three/BookScene.tsx` — the hero's 3D book: procedural paper textures, curling pages, floating glyph sprites.
- `src/components/SplitText.tsx` — GSAP per-letter reveal that keeps Arabic letters joined (zero-width joiners).
- `src/components/lesson/` — lesson page: sticky tabs, reading progress, pinned step builder, flip cards, quiz.
- `src/components/widgets/` — the interactive pieces: style comparison, colour-coded essay/paragraph/commentary, summary before/after slider, evidence drag-and-drop, rhetoric tree, hamza calculator, punctuation exercise.
- `src/components/TextsShelf.tsx` — scroll-driven 3D bookshelf for Unit 4.
