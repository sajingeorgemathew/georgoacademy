import type { ReactNode } from "react";
import { cx } from "@/features/design/design-tokens";
import {
  examColumnTones,
  examScrollHeights,
  examTwoColumn,
} from "@/features/exam-engine/exam-theme";
import type {
  ExamPanelScroll,
  ExamPanelTone,
} from "@/features/exam-engine/exam-shell-types";

// Split screen layout.
//
// Left is the content side: a passage, a diagram, an audio panel, or a
// source information block. Right is the answer side: a question set, an
// editor, or a radio list.
//
// The split is a single divided work area, not two blocks with a gap
// between them. The layout draws its own outer rule and its own divider,
// and the answer side carries a light blue wash, so it is obvious at a
// glance which half is read and which half is answered.
//
// Each column can scroll on its own, which is what the Reading part
// screens need. On a narrow screen the columns stack, the divider turns
// horizontal, and the scroll limits still apply so a long passage does
// not bury the questions.

export type ExamTwoColumnLayoutProps = {
  left: ReactNode;
  right: ReactNode;
  // Small uppercase labels above each column.
  leftLabel?: string;
  rightLabel?: string;
  leftScroll?: ExamPanelScroll;
  rightScroll?: ExamPanelScroll;
  // Column washes. The answer side defaults to the light blue accent.
  leftTone?: ExamPanelTone;
  rightTone?: ExamPanelTone;
  // Set false when the split fills an unpadded canvas, so the canvas
  // border is the only rule around it.
  bordered?: boolean;
  className?: string;
};

export function ExamTwoColumnLayout({
  left,
  right,
  leftLabel,
  rightLabel,
  leftScroll = "none",
  rightScroll = "none",
  leftTone = "plain",
  rightTone = "accent",
  bordered = true,
  className,
}: ExamTwoColumnLayoutProps) {
  return (
    <div
      className={cx(
        examTwoColumn.grid,
        bordered ? examTwoColumn.bordered : "",
        className,
      )}
    >
      <div className={cx(examTwoColumn.column, examColumnTones[leftTone])}>
        {leftLabel ? (
          <p className={examTwoColumn.columnLabel}>{leftLabel}</p>
        ) : null}
        <div className={cx("min-w-0", examScrollHeights[leftScroll])}>
          {left}
        </div>
      </div>

      <div className={cx(examTwoColumn.column, examColumnTones[rightTone])}>
        {rightLabel ? (
          <p className={examTwoColumn.columnLabel}>{rightLabel}</p>
        ) : null}
        <div className={cx("min-w-0", examScrollHeights[rightScroll])}>
          {right}
        </div>
      </div>
    </div>
  );
}
