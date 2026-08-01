import type { ReactNode } from "react";
import { cx } from "@/features/design/design-tokens";
import { examInstruction } from "@/features/exam-engine/exam-theme";
import { examCopy } from "@/features/exam-engine/exam-copy";

// Instruction line with a circled information glyph.
//
// Used wherever a screen tells the learner what to do, for example
// "Read the following message" or "Listen to the question".
//
// The glyph is a bordered span with a letter i in it, not an icon
// package. No icon dependency is installed for the exam engine.
//
// Pass heading for the bold lead line, then text or children for the
// instruction body.

export type ExamInstructionRowProps = {
  heading?: string;
  text?: string;
  children?: ReactNode;
  className?: string;
};

export function ExamInstructionRow({
  heading,
  text,
  children,
  className,
}: ExamInstructionRowProps) {
  return (
    <div className={cx(examInstruction.row, className)}>
      <span className={examInstruction.icon} aria-hidden="true">
        i
      </span>
      <span className="sr-only">{examCopy.infoIconLabel}</span>

      <div className="min-w-0">
        {heading ? <p className={examInstruction.heading}>{heading}</p> : null}
        {text ? <p className={examInstruction.text}>{text}</p> : null}
        {children ? <div className={examInstruction.text}>{children}</div> : null}
      </div>
    </div>
  );
}
