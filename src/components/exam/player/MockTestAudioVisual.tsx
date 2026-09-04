import type { ReactNode } from "react";
import { cx } from "@/features/design/design-tokens";
import { playerAudioVisual } from "@/features/exam-engine/mock-test-player-theme";
import { examCopy } from "@/features/exam-engine/exam-copy";

// The card a Listening clip plays inside (EXAM-UI-03).
//
// Before this ticket an audio screen was a bare browser control bar in a
// bordered box with a caption strip under it. It worked and it said
// nothing: on a screen whose only job is "a clip is playing, listen to
// it", the one thing the learner needed to know was the one thing the
// screen did not show.
//
// So the card carries four things, in the order a learner reads them:
//
// - **a speaker mark**, so the screen announces itself as audio before
//   any text is read
// - **a status word**, Ready to play, Playing..., Paused or Finished
// - **a progress bar**, with the elapsed and total time under it
// - **the browser's own control**, unchanged
//
// **This component is a picture and nothing else.** It holds no audio
// element, calls no play or pause, and owns no clock. It is handed a
// status and a fraction and it draws them. Everything that actually makes
// sound stays in ListeningAudioPlayer, which passes its native control in
// as children. That separation is deliberate: the EXAM-UI-03 brief asks
// for the audio screen to look right and explicitly asks for playback
// behaviour not to change, and a presentational component cannot change
// it by accident.
//
// **The speaker mark is ours.** An inline SVG of a rounded speaker body
// with two arcs beside it, drawn in this file from four path commands. No
// icon package is installed for the exam engine and nothing here is taken
// from any test provider's interface.
//
// **The note under the card is deliberate.** A practice simulator that
// shows a scrub bar has to say the real thing does not, or a learner will
// practise expecting one. It is our own sentence and it names no test
// provider.

export type MockTestAudioStatus = "idle" | "playing" | "paused" | "ended";

const STATUS_LABELS: Record<MockTestAudioStatus, string> = {
  idle: examCopy.audioReadyLabel,
  playing: examCopy.audioPlayingLabel,
  paused: examCopy.audioPausedLabel,
  ended: examCopy.audioEndedLabel,
};

// mm:ss from a number of seconds. Returns a dash for a duration the
// browser has not worked out yet, which is what a clip streamed from a
// remote host reports until its metadata arrives.
export function formatMockTestAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "--:--";
  }

  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;

  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export type MockTestAudioVisualProps = {
  status: MockTestAudioStatus;
  // How far through the clip is, from 0 to 1. Anything outside that is
  // clamped rather than allowed to draw a bar past its track.
  progress: number;
  currentSeconds?: number;
  durationSeconds?: number;
  // Learner facing clip name, for example "News item audio".
  title?: string;
  // The native control. Passed in rather than built here, so nothing in
  // this file can change how a clip plays.
  children?: ReactNode;
  // Quiet line under the card. Defaults to the practice playbar note.
  note?: string;
  showNote?: boolean;
  // Replaces the card body when the clip will not load.
  fallbackHeading?: string;
  fallbackText?: string;
  hasError?: boolean;
  // Shown under the control when the browser refused to start the clip.
  noticeText?: string;
  className?: string;
};

export function MockTestAudioVisual({
  status,
  progress,
  currentSeconds,
  durationSeconds,
  title,
  children,
  note = examCopy.audioPlaybarNote,
  showNote = true,
  fallbackHeading,
  fallbackText,
  hasError = false,
  noticeText,
  className,
}: MockTestAudioVisualProps) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const percent = `${(clamped * 100).toFixed(1)}%`;

  return (
    <div className={cx(playerAudioVisual.card, className)}>
      <span className={playerAudioVisual.speaker} aria-hidden="true">
        <SpeakerMark />
      </span>

      {hasError ? (
        <div className={playerAudioVisual.fallback} role="status">
          <p className={playerAudioVisual.fallbackTitle}>{fallbackHeading}</p>
          <p className={playerAudioVisual.fallbackText}>{fallbackText}</p>
        </div>
      ) : (
        <>
          <p className={playerAudioVisual.status} role="status">
            {STATUS_LABELS[status]}
          </p>

          {title ? <p className={playerAudioVisual.title}>{title}</p> : null}

          <div className={playerAudioVisual.track} aria-hidden="true">
            <div
              className={playerAudioVisual.fill}
              style={{ width: percent }}
            />
          </div>

          <div className={playerAudioVisual.times} aria-hidden="true">
            <span>{formatMockTestAudioTime(currentSeconds ?? 0)}</span>
            <span>
              {durationSeconds === undefined
                ? "--:--"
                : formatMockTestAudioTime(durationSeconds)}
            </span>
          </div>
        </>
      )}

      {children ? (
        <div className={playerAudioVisual.controls}>{children}</div>
      ) : null}

      {noticeText ? (
        <p className={playerAudioVisual.notice} role="status">
          {noticeText}
        </p>
      ) : null}

      {showNote && note ? (
        <p className={playerAudioVisual.note}>{note}</p>
      ) : null}
    </div>
  );
}

// The speaker mark. A rounded cabinet on the left, then two arcs, drawn
// from scratch rather than taken from an icon set.
function SpeakerMark() {
  return (
    <svg
      className={playerAudioVisual.speakerIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z" />
      <path d="M15.5 9.2a4 4 0 0 1 0 5.6" />
      <path d="M18.2 6.8a7.5 7.5 0 0 1 0 10.4" />
    </svg>
  );
}
