import type { ReactNode } from "react";
import { cx } from "@/features/design/design-tokens";
import { ExamButton } from "./ExamButton";
import { examBar } from "@/features/exam-engine/exam-theme";
import { examCopy } from "@/features/exam-engine/exam-copy";

// Grey footer bar at the bottom of the exam frame.
//
// Back sits on the left, secondary actions on the right. Bottom left is
// the corner diagonally opposite the Next control in the top bar, which
// is both the placement test software uses and the placement that makes a
// mis-click least likely to throw away an answer.
//
// The bar is thin and its controls are small, matching the top bar.
//
// On a narrow screen the two groups wrap onto separate rows rather than
// shrinking, so the bar never scrolls sideways.

export type ExamBottomBarProps = {
  showBack?: boolean;
  backLabel?: string;
  backHref?: string;
  onBack?: () => void;
  backDisabled?: boolean;
  // Optional action on the right, for example a review control.
  secondaryAction?: ReactNode;
  // Extra content on the right, beside the secondary action.
  children?: ReactNode;
  className?: string;
};

export function ExamBottomBar({
  showBack = true,
  backLabel = examCopy.backLabel,
  backHref,
  onBack,
  backDisabled = false,
  secondaryAction,
  children,
  className,
}: ExamBottomBarProps) {
  return (
    <footer className={cx(examBar.bottom, className)}>
      <div className={examBar.back}>
        {showBack ? (
          <ExamButton
            variant="secondary"
            size="sm"
            href={backHref}
            onClick={onBack}
            disabled={backDisabled}
            ariaLabel={examCopy.backAriaLabel}
          >
            {backLabel}
          </ExamButton>
        ) : null}
      </div>

      <div className={examBar.secondary}>
        {secondaryAction}
        {children}
      </div>
    </footer>
  );
}
