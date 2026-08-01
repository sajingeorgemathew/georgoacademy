import { cx } from "@/features/design/design-tokens";
import { examTimer, examTimerStates } from "@/features/exam-engine/exam-theme";
import type { ExamTimerState } from "@/features/exam-engine/exam-shell-types";

// One timer reading in the exam top bar.
//
// The reading is bar text, not a chip. It has no background, no ring and
// no box of its own, so it sits inside the grey bar the way a status
// readout does in test software. State is carried by colour and weight:
// neutral navy while there is time, red as the window closes, red and
// bold once it has gone, and a soft grey for a fixed label.
//
// This component only renders a value. It owns no clock. EXAM-01 keeps
// timing out of the shell on purpose: the flow tickets decide when a
// countdown starts, when it stops, and what happens at zero, and they
// pass the formatted value and the state down.
//
// Examples:
//   Time remaining: 10 minutes   normal
//   Time remaining: 30 seconds   warning
//   Time is up                   expired
//   Preparation: 30 seconds      muted
//
// The reading is announced politely so a learner using a screen reader
// hears a change without losing their place in the question.

export type ExamTimerDisplayProps = {
  label?: string;
  value: string;
  state?: ExamTimerState;
  className?: string;
};

export function ExamTimerDisplay({
  label,
  value,
  state = "normal",
  className,
}: ExamTimerDisplayProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cx(examTimer.base, examTimerStates[state], className)}
    >
      {label ? <span className={examTimer.label}>{label}:</span> : null}
      <span className={examTimer.value}>{value}</span>
    </span>
  );
}
