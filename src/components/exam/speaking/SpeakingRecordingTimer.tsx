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
import {
  formatSpeakingClock,
  speakingMockCopy,
} from "@/features/exam-engine/speaking-mock-copy";
import type { SpeakingMockCopy } from "@/features/exam-engine/speaking-mock-copy";
import type { SpeakingTaskTimer } from "@/features/exam-engine/speaking-mock-types";

// The recording countdown on a Speaking task screen (EXAM-27).
//
// The twin of SpeakingPrepTimer, and the note at the top of that file
// covers why both are cards in the canvas rather than readings in the top
// bar, and why each window is drawn exactly once.
//
// What is different here is when the window opens. A preparation window
// opens with the screen. A recording window opens when the learner
// presses Start recording, which is the case useExamCountdown was written
// for and named in its own comments.
//
// How it opens, without an imperative handle
// ------------------------------------------
//
// The hook exposes start(), and a caller could hold a ref to this
// component and call it. This component does something simpler: it takes
// a runKey, which is null while nothing is recording and a fresh string
// for each take. A new take is therefore a new key, a new key is a new
// mount, and a new mount opens a new window during the first render of
// the take rather than a tick into it.
//
// That also settles what happens when a take ends. runKey goes back to
// null, the counting component unmounts, and the card returns to a static
// reading of the full window length, ready for the next take. No interval
// is left running behind a stopped recorder, and nothing has to remember
// to freeze a clock.
//
// What happens at zero: the reading becomes "Time is up" and a quiet line
// says nothing stops and nothing is deleted. That is exactly true here.
// The recorder is not stopped, the audio already captured is not
// discarded, nothing is submitted anywhere, and the learner finishes their
// sentence and presses Stop recording when they are ready. Strict
// Speaking timing, where the window closes the recorder, is a later
// ticket.
//
// House style: normal hyphens only, no long hyphens or em dashes.

export type SpeakingRecordingTimerProps = {
  timer: SpeakingTaskTimer;
  // A fresh value for each take, or null when nothing is recording.
  // Changing it opens a new window; setting it to null closes the card
  // back to its idle reading.
  runKey: string | null;
  copy?: SpeakingMockCopy;
};

export function SpeakingRecordingTimer({
  timer,
  runKey,
  copy = speakingMockCopy,
}: SpeakingRecordingTimerProps) {
  // Nothing is recording. Show what the window will be, in the muted
  // tone a reading that is not counting gets everywhere else in the
  // engine.
  if (runKey === null) {
    return (
      <div className={examSpeaking.timerCard}>
        <p className={examSpeaking.timerCardLabel}>
          {copy.responseTimerIdleLabel}
        </p>

        <p
          className={cx(
            examSpeaking.timerCardValue,
            examSpeakingTimerStates.muted,
          )}
        >
          {formatSpeakingClock(timer.seconds)}
        </p>

        <p className={examSpeaking.timerCardNote}>
          {copy.responseTimerIdleNote}
        </p>
      </div>
    );
  }

  return <SpeakingRecordingTimerWindow key={runKey} timer={timer} copy={copy} />;
}

function SpeakingRecordingTimerWindow({
  timer,
  copy = speakingMockCopy,
}: Omit<SpeakingRecordingTimerProps, "runKey">) {
  // No onExpire. The recorder is not stopped by the clock, which is the
  // ticket's own rule: time up is a change of reading and nothing else.
  const countdown = useExamCountdown({
    // This component is already keyed on the take, so the window is
    // opened by the mount and this value only has to be stable within
    // it.
    screenKey: "speaking-recording-window",
    durationSeconds: timer.seconds,
    warningAtSeconds: timer.warningAtSeconds,
    urgentAtSeconds: timer.urgentAtSeconds,
    autoStart: true,
    label: copy.responseTimerLabel,
  });

  const tone = examTimerStatusTones[countdown.status];

  return (
    <div className={examSpeaking.timerCard}>
      <p className={examSpeaking.timerCardLabel}>{copy.responseTimerLabel}</p>

      <p
        // Silent for the reason SpeakingPrepTimer gives: a reading that
        // ticks four times a second cannot be a polite live region.
        role="status"
        aria-live="off"
        className={cx(examSpeaking.timerCardValue, examSpeakingTimerStates[tone])}
      >
        {countdown.isExpired
          ? examCopy.timeExpiredValue
          : formatExamClock(countdown.remainingSeconds)}
      </p>

      <p className={examSpeaking.timerCardNote}>
        {countdown.isExpired
          ? copy.timerExpiredNote
          : copy.responseTimerRunningNote}
      </p>

      <span role="status" aria-live="polite" className="sr-only">
        {countdown.isExpired
          ? `${copy.responseTimerLabel}: ${examCopy.timeExpiredValue}`
          : ""}
      </span>
    </div>
  );
}
