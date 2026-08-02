import { ExamButton } from "../ExamButton";
import { ExamInstructionRow } from "../ExamInstructionRow";
import { ExamShell } from "../ExamShell";
import { examListening, examScreenBody, examText } from "@/features/exam-engine/exam-theme";
import { listeningReviewCopy } from "@/features/exam-engine/listening-review-copy";

// End of part screen for a Listening part (EXAM-04).
//
// The last screen of the prototype run. One line saying the part is
// finished, a way back to the dashboard, and an optional restart.
//
// Back to dashboard is a link rather than a handler, so it keeps middle
// click and open in a new tab. Restart is a handler, because clearing the
// answers held on the page is the prototype's business, not the router's.
//
// The Part 2 line is a plain sentence, not a disabled control. There is
// nothing to press yet, and a greyed out button would suggest otherwise.

export type ListeningPartEndScreenProps = {
  // Exam frame title, normally the part title from the content object.
  title: string;
  // Where Back to dashboard goes.
  dashboardHref?: string;
  // Clears the answers and returns to the first screen. Omit to hide the
  // control.
  onRestart?: () => void;
  // Set false to drop the "Listening Part 2 will be added..." line.
  showNextPartPlaceholder?: boolean;
  metaText?: string;
  onBack?: () => void;
  showBack?: boolean;
};

export function ListeningPartEndScreen({
  title,
  dashboardHref = "/dashboard",
  onRestart,
  showNextPartPlaceholder = true,
  metaText,
  onBack,
  showBack = true,
}: ListeningPartEndScreenProps) {
  return (
    <ExamShell
      title={title}
      metaText={metaText}
      showNext={false}
      onBack={onBack}
      showBack={showBack}
    >
      <div className={examScreenBody.stack}>
        <ExamInstructionRow
          heading={listeningReviewCopy.endTitle}
          text={listeningReviewCopy.endMessage}
        />

        <div className={examListening.mediaStack}>
          <div className={examScreenBody.actions}>
            <ExamButton variant="primary" size="md" href={dashboardHref}>
              {listeningReviewCopy.backToDashboardLabel}
            </ExamButton>

            {onRestart ? (
              <ExamButton
                variant="secondary"
                size="md"
                onClick={onRestart}
                uppercase={false}
              >
                {listeningReviewCopy.restartLabel}
              </ExamButton>
            ) : null}
          </div>

          {showNextPartPlaceholder ? (
            <p className={examText.muted}>
              {listeningReviewCopy.nextPartPlaceholder}
            </p>
          ) : null}

          <p className={examScreenBody.notice}>
            {listeningReviewCopy.endNotice}
          </p>
        </div>
      </div>
    </ExamShell>
  );
}
