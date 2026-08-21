import type { ReactNode } from "react";
import { cx } from "@/features/design/design-tokens";
import { ExamBottomBar } from "./ExamBottomBar";
import { ExamCanvas } from "./ExamCanvas";
import { ExamTopBar } from "./ExamTopBar";
import { examFrame } from "@/features/exam-engine/exam-theme";
import type {
  ExamTimerReading,
  ExamTimerState,
} from "@/features/exam-engine/exam-shell-types";

// The frame every practice test screen sits inside.
//
// It composes the grey top bar, the white canvas, and the grey bottom
// bar, and it is the only place that knows about the title, the timer,
// and the navigation controls. A screen type renders its body and
// nothing else.
//
// Timers can be passed two ways:
//
// - timerLabel, timerValue and timerState for a single reading, which
//   covers Listening, Reading and Writing
// - timers for a list, which covers the Speaking pair of preparation and
//   recording. When timers is set it wins.
// - timerSlot for a live reading that owns its own clock, which is what
//   EXAM-15D added and what every timed Listening screen now passes. It
//   renders in the same strip as the fixed readings and can sit beside
//   them, so a screen can show one of each.
//
// The shell still owns no clock. It is handed either a formatted value or
// a component that formats its own, and it renders whichever it gets in
// the same place.
//
// Navigation takes either an href or a handler. Use an href where the
// next screen is a route, and a handler where the sequence is held in
// client state.

export type ExamShellProps = {
  title: string;

  // Single timer reading.
  timerLabel?: string;
  timerValue?: string;
  timerState?: ExamTimerState;
  // Two or more readings, for example the Speaking pair. Overrides the
  // single reading props above.
  timers?: ExamTimerReading[];
  // A live timer component, normally ExamCountdownTimer. Rendered in the
  // top bar beside any fixed readings.
  timerSlot?: ReactNode;
  // Small note in the top bar beside the timers.
  metaText?: string;

  showNext?: boolean;
  nextLabel?: string;
  nextHref?: string;
  onNext?: () => void;
  nextDisabled?: boolean;

  showBack?: boolean;
  backLabel?: string;
  backHref?: string;
  onBack?: () => void;
  backDisabled?: boolean;

  // Optional action on the right of the bottom bar, opposite Back.
  secondaryAction?: ReactNode;
  // Extra content in the bottom bar, beside the secondary action.
  bottomContent?: ReactNode;
  // Hide the bottom bar entirely, for a screen with no controls at all.
  showBottomBar?: boolean;

  // Screen body.
  children: ReactNode;
  // Set false when the body manages its own edges.
  padded?: boolean;
  className?: string;
};

export function ExamShell({
  title,
  timerLabel,
  timerValue,
  timerState = "normal",
  timers,
  timerSlot,
  metaText,
  showNext = true,
  nextLabel,
  nextHref,
  onNext,
  nextDisabled = false,
  showBack = true,
  backLabel,
  backHref,
  onBack,
  backDisabled = false,
  secondaryAction,
  bottomContent,
  showBottomBar = true,
  children,
  padded = true,
  className,
}: ExamShellProps) {
  const readings: ExamTimerReading[] =
    timers ??
    (timerValue
      ? [{ label: timerLabel, value: timerValue, state: timerState }]
      : []);

  return (
    <div className={cx(examFrame.page, className)}>
      <div className={examFrame.container}>
        <section className={examFrame.frame} aria-label={title}>
          <ExamTopBar
            title={title}
            timers={readings}
            timerSlot={timerSlot}
            metaText={metaText}
            showNext={showNext}
            nextLabel={nextLabel}
            nextHref={nextHref}
            onNext={onNext}
            nextDisabled={nextDisabled}
          />

          <ExamCanvas padded={padded}>{children}</ExamCanvas>

          {showBottomBar ? (
            <ExamBottomBar
              showBack={showBack}
              backLabel={backLabel}
              backHref={backHref}
              onBack={onBack}
              backDisabled={backDisabled}
              secondaryAction={secondaryAction}
            >
              {bottomContent}
            </ExamBottomBar>
          ) : null}
        </section>
      </div>
    </div>
  );
}
