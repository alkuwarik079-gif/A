"use client";

import type { WidgetId } from "@/lib/types";
import StylesCompare from "./StylesCompare";
import SummarySlider from "./SummarySlider";
import EvidenceGame from "./EvidenceGame";
import RhetoricTree from "./RhetoricTree";
import HamzaCalc from "./HamzaCalc";
import PunctuationGame from "./PunctuationGame";
import { CommentaryModel, EssayModel, ParagraphAnnotate } from "./docs";

const MAP: Record<WidgetId, () => React.JSX.Element> = {
  "styles-compare": StylesCompare,
  "essay-model": EssayModel,
  "paragraph-annotate": ParagraphAnnotate,
  "summary-slider": SummarySlider,
  "commentary-model": CommentaryModel,
  "evidence-game": EvidenceGame,
  "rhetoric-tree": RhetoricTree,
  "hamza-calc": HamzaCalc,
  "punctuation-game": PunctuationGame,
};

export default function Widget({ id }: { id: WidgetId }) {
  const C = MAP[id];
  return <C />;
}
