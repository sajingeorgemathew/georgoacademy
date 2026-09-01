"use client";

import { useExamCountdown } from "../timer/useExamCountdown";
import { cx } from "@/features/design/design-tokens";
import { examCopy } from "@/features/exam-engine/exam-copy";
import {
  examSpeaking,
  examSpeakingTimerStates,
} from "@/features/exam-engine/exam-theme";
import {
  examTimerStatusTones,
  formatExamClock,
} from "@/features/exam-engine/exam-timer-utils";
import { speakingMockCopy } from "@/features/exam-engine/speaking-mock-copy";
import type { SpeakingMockCopy } from "@/features/exam-engine/speaking-mock-copy";
import type { SpeakingTaskTimer } from "@/features/exam-engine/speaking-mock-types";

// The preparation countdown on a Speaking task screen (EXAM-27).
//
// Why this is a card in the canvas rather than a reading in the top bar
// ---------------------------------------------------------------------
//
// Every other section puts its clock in the thin top bar strip, because
// in Listening, Reading and Writing the clock is a constraint on work the
// learner is already doing. In Speaking the clock is the instruction:
// there is a window to plan in and then a window to speak in, and the
// change from one to the other is the whole structure of the task. The
// source screens agree, and they are the reference this engine is built
// against: the Mock Test 1 Task 3, Task 4 and Task 8 prompt images all
// show a large "Preparation Time" panel sitting beside the picture, not a
// line of small text above it.
//
// So the two Speaking clocks are cards in the answer column, at a size a
// speaker can read at a glance, and the top bar carries no timer on a
// Speaking task screen. There is one clock per window and it is drawn
// once, which is the other half of the reason: two components counting
// the same window would open two deadlines and fire two expiry callbacks.
//
// It still owns no arithmetic. useExamCountdown is the one clock in the
// engine and this is a caller of it, exactly as ExamCountdownTimer in the
// top bar is. Its own note says it was written for this pair.
//
// Resetting is a remount, which is why the exported component wraps an
// inner one keyed on screenKey. That is the pattern ExamCountdownTimer
// established and the reason useExamCountdown gives for it: the project's
// lint rules refuse both a clock read in a hook body and a state push
// from an effect, so a new window has to arrive as a new mount.
//
// What happens at zero: the reading becomes "Time is up" and a quiet line
// underneath says that nothing stops and nothing is deleted. Nothing else
// happens. No recording starts, no screen advances and nothing is
// submitted, which is what the ticket asks a prototype timer to do.
//
// The preparation window ends early when recording starts, because at
// that point the learner is speaking rather than preparing. The card then
// reads "Complete" and stops counting: the inner component is unmounted,
// so no interval is left running behind a card nobody is reading.
//
// House style: normal hyphens only, no long hyphens or em dashes.

export type SpeakingPrepTimerProps = {
  // Which window this is. Pass the flow screen id, so the window belongs
  // to the screen and nothing that happens on it starts a new one.
  screenKey: string;
  timer: SpeakingTaskTimer;
  // False once recording has started, which ends the preparation window
  // whether or not it had run out.
  active: boolean;
  copy?: SpeakingMockCopy;
};

export function SpeakingPrepTimer(props: SpeakingPrepTimerProps) {
  const copy = props.copy ?? speakingMockCopy;

  // Preparation is over. A static card, and no clock mounted behind it.
  if (!props.active) {
    return (
      <div className={examSpeaking.timerCard}>
        <p className={examSpeaking.timerCardLabel}>{copy.prepTimerLabel}</p>

        <p
          className={cx(
            examSpeaking.timerCardValue,
            examSpeakingTimerStates.muted,
          )}
        >
          {copy.prepTimerDoneValue}
        </p>

        <p className={examSpeaking.timerCardNote}>{copy.prepTimerDoneNote}</p>
      </div>
    );
  }

  return <SpeakingPrepTimerWindow key={props.screenKey} {...props} />;
}

function SpeakingPrepTimerWindow({
  screenKey,
  timer,
  copy = speakingMockCopy,
}: SpeakingPrepTimerProps) {
  // No onExpire. Reaching zero changes the words on the card and does
  // nothing else, which is the rule every other timed screen in the
  // engine already follows.
  const countdown = useExamCountdown({
    screenKey,
    durationSeconds: timer.seconds,
    warningAtSeconds: timer.warningAtSeconds,
    urgentAtSeconds: timer.urgentAtSeconds,
    // The preparation window opens with the screen, which is what the
    // source screens do.
    autoStart: true,
    label: copy.prepTimerLabel,
  });

  const tone = examTimerStatusTones[countdown.status];

  return (
    <div className={examSpeaking.timerCard}>
      <p className={examSpeaking.timerCardLabel}>{copy.prepTimerLabel}</p>

      <p
        // Silent on purpose. A reading that refreshes four times a second
        // cannot also be a polite live region, which is the rule
        // ExamTimerDisplay and ExamTimerStatusText settled. The one
        // announcement worth making is in the region below.
        role="status"
        aria-live="off"
        className={cx(examSpeaking.timerCardValue, examSpeakingTimerStates[tone])}
      >
        {countdown.isExpired
          ? examCopy.timeExpiredValue
          : formatExamClock(countdown.remainingSeconds)}
      </p>

      <p className={examSpeaking.timerCardNote}>
        {countdown.isExpired ? copy.timerExpiredNote : copy.prepTimerNote}
      </p>

      {/* The spoken half. Empty until the window closes, and in the
          document from the start so the change is announced when it
          happens. */}
      <span role="status" aria-live="polite" className="sr-only">
        {countdown.isExpired
          ? `${copy.prepTimerLabel}: ${examCopy.timeExpiredValue}`
          : ""}
      </span>
    </div>
  );
}
