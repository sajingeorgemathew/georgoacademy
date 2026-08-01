import type { ReactNode } from "react";
import { cx } from "@/features/design/design-tokens";
import { examCanvas } from "@/features/exam-engine/exam-theme";

// White exam area between the two grey bars.
//
// The canvas holds the screen body and nothing else. It never renders
// chrome, so a screen type can be dropped into it unchanged.
//
// Two elements, not one: a grey gutter and a bordered white sheet inside
// it. The border is what makes the canvas read as a document the engine
// is displaying rather than as the page background running behind the
// bars.
//
// Set padded to false when the screen body manages its own edges, for
// example a full width answer review table.

export type ExamCanvasProps = {
  children: ReactNode;
  padded?: boolean;
  // Keeps short screens the same height as long ones, so the frame does
  // not jump between screens.
  minHeight?: boolean;
  className?: string;
};

export function ExamCanvas({
  children,
  padded = true,
  minHeight = true,
  className,
}: ExamCanvasProps) {
  return (
    <div className={examCanvas.region}>
      <div
        className={cx(
          examCanvas.sheet,
          padded ? examCanvas.padded : "",
          minHeight ? examCanvas.minHeight : "",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
