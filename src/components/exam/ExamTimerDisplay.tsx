import { cx } from "@/features/design/design-tokens";
import { examTimer, examTimerStates } from "@/features/exam-engine/exam-theme";
import type { ExamTimerState } from "@/features/exam-engine/exam-shell-types";

// One timer reading in the exam top bar.
//
// The reading is bar text, not a chip. It has no background, no ring and
// no box of its own, so it sits inside the grey bar the way a status
// readout does in test software. State is carried by colour and weight:
// neutral navy while there is time, amber as the window closes, red for
// the last few seconds, red and bold once it has gone, and a soft grey for
// a fixed label.
//
// This component only renders a value. It owns no clock, which is still
// true after EXAM-15D: the clock is useExamCountdown, and ExamCountdownTimer
// is the piece that runs it and hands the formatted reading and the tone
// down to here. Anything with a value and a tone can use this directly.
//
// Examples:
//   Time remaining: 10:00        normal
//   Time remaining: 00:09        warning
//   Time remaining: 00:04        urgent
//   Time is up                   expired
//   Preparation: 30 seconds      muted
//
// A static reading is announced politely so a learner using a screen
// reader hears a change without losing their place in the question.
//
// A live reading is not (EXAM-15D). A countdown refreshes four times a
// second, and a polite live region on that reads every number out and
// buries the question underneath it, so ExamCountdownTimer passes
// live="off" and puts the one announcement worth making, that the window
// has closed, in its own region. See ExamTimerStatusText.

export type ExamTimerDisplayProps = {
  label?: string;
  value: string;
  state?: ExamTimerState;
  // Whether a change to the reading is announced. Defaults to polite,
  // which is right for a value that changes when the screen does. Set off
  // for a value that ticks.
  live?: "polite" | "off";
  className?: string;
};

export function ExamTimerDisplay({
  label,
  value,
  state = "normal",
  live = "polite",
  className,
}: ExamTimerDisplayProps) {
  return (
    <span
      role="status"
      aria-live={live}
      className={cx(examTimer.base, examTimerStates[state], className)}
    >
      {label ? <span className={examTimer.label}>{label}:</span> : null}
      <span className={examTimer.value}>{value}</span>
    </span>
  );
}
