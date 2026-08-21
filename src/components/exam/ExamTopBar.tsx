import type { ReactNode } from "react";
import { cx } from "@/features/design/design-tokens";
import { ExamButton } from "./ExamButton";
import { ExamTimerDisplay } from "./ExamTimerDisplay";
import { examBar } from "@/features/exam-engine/exam-theme";
import { examCopy } from "@/features/exam-engine/exam-copy";
import type { ExamTimerReading } from "@/features/exam-engine/exam-shell-types";

// Grey title bar at the top of the exam frame.
//
// Layout, left to right: the screen title, then any timer readings, then
// optional meta text, then the blue Next action on the far right.
//
// The bar is thin and everything in it is small. The timer readings are
// plain bar text rather than chips, and Next is the compact xs control,
// because in test software the chrome is a strip and the canvas gets the
// height.
//
// Timers are a list because Speaking shows two readings at once, the
// preparation window and the recording window. Listening, Reading and
// Writing pass a single reading.
//
// A reading can also be live (EXAM-15D). timerSlot takes a component that
// owns its own clock, ExamCountdownTimer, and renders it in the same strip
// the fixed readings sit in, so a counting timer and a static one look
// identical and sit in the same place. The bar still owns no clock: it
// owns the strip, and whatever is put in it draws itself.
//
// On a narrow screen the title takes the first row on its own and the
// controls wrap underneath, so the bar never scrolls sideways.

export type ExamTopBarProps = {
  title: string;
  timers?: ExamTimerReading[];
  // A live timer to render alongside any fixed readings.
  timerSlot?: ReactNode;
  // Small note beside the timers, for example a part label.
  metaText?: string;
  showNext?: boolean;
  nextLabel?: string;
  nextHref?: string;
  onNext?: () => void;
  nextDisabled?: boolean;
  // Extra controls between the meta text and Next.
  children?: ReactNode;
  className?: string;
};

export function ExamTopBar({
  title,
  timers,
  timerSlot,
  metaText,
  showNext = true,
  nextLabel = examCopy.nextLabel,
  nextHref,
  onNext,
  nextDisabled = false,
  children,
  className,
}: ExamTopBarProps) {
  const readings = timers ?? [];

  return (
    <header className={cx(examBar.top, className)}>
      <h2 className={examBar.title} title={title}>
        {title}
      </h2>

      <div className={examBar.actions}>
        {readings.length > 0 || timerSlot ? (
          <div className={examBar.readings}>
            {readings.map((reading, index) => (
              <ExamTimerDisplay
                key={`${reading.label ?? "timer"}-${index}`}
                label={reading.label}
                value={reading.value}
                state={reading.state}
              />
            ))}

            {timerSlot}
          </div>
        ) : null}

        {metaText ? <span className={examBar.meta}>{metaText}</span> : null}

        {children}

        {showNext ? (
          <ExamButton
            variant="primary"
            size="xs"
            href={nextHref}
            onClick={onNext}
            disabled={nextDisabled}
            ariaLabel={examCopy.nextAriaLabel}
          >
            {nextLabel}
          </ExamButton>
        ) : null}
      </div>
    </header>
  );
}
