import type { ReactNode } from "react";
import { cx } from "@/features/design/design-tokens";
import {
  examPanel,
  examPanelTones,
  examScrollHeights,
} from "@/features/exam-engine/exam-theme";
import type {
  ExamPanelScroll,
  ExamPanelTone,
} from "@/features/exam-engine/exam-shell-types";

// A bordered region inside the exam canvas.
//
// Panels are the building block of the split screens: a passage panel, a
// question panel, an answer panel. A panel can scroll on its own so a
// long passage never pushes the frame out of shape, and never makes the
// page scroll sideways.
//
// Tones follow the reference layouts: plain for a passage, muted for a
// supporting block, accent for the light blue answer side of a split
// screen. The tone sets the border colour as well as the background, and
// the header and footer rules inherit it, so an accent panel is bordered
// blue throughout.
//
// A panel inside an already tinted split screen column should usually be
// plain, or left out entirely. Two blues on top of each other read as a
// mistake.

export type ExamPanelProps = {
  // Small uppercase label in the panel header.
  title?: string;
  tone?: ExamPanelTone;
  scroll?: ExamPanelScroll;
  footer?: ReactNode;
  padded?: boolean;
  children: ReactNode;
  className?: string;
};

export function ExamPanel({
  title,
  tone = "plain",
  scroll = "none",
  footer,
  padded = true,
  children,
  className,
}: ExamPanelProps) {
  return (
    <div className={cx(examPanel.base, examPanelTones[tone], className)}>
      {title ? <div className={examPanel.header}>{title}</div> : null}

      <div
        className={cx(
          padded ? examPanel.body : "min-w-0",
          examScrollHeights[scroll],
        )}
      >
        {children}
      </div>

      {footer ? <div className={examPanel.footer}>{footer}</div> : null}
    </div>
  );
}
