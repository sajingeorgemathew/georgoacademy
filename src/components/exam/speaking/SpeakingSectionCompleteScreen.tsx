import { ExamButton } from "../ExamButton";
import { ExamInstructionRow } from "../ExamInstructionRow";
import { ExamShell } from "../ExamShell";
import { cx } from "@/features/design/design-tokens";
import {
  examReview,
  examScreenBody,
  examSpeaking,
} from "@/features/exam-engine/exam-theme";
import {
  formatSpeakingClock,
  formatSpeakingRecordedCount,
  speakingMockCopy,
} from "@/features/exam-engine/speaking-mock-copy";
import type { SpeakingMockCopy } from "@/features/exam-engine/speaking-mock-copy";
import type { SpeakingTaskSummary } from "@/features/exam-engine/speaking-mock-types";

// Speaking section completion screen (EXAM-27).
//
// The end of the run. It says the section is finished, reports which of
// the eight tasks were recorded and how long each take was, says what
// comes next, and offers a restart and a way back to the dashboard.
//
// What it reports is recorded or missing, and a length. That is
// everything this screen honestly knows. There is no transcript, because
// nothing was transcribed. There is no score, no band and no criterion
// level, because nothing was reviewed. There is no Submit for AI Review
// button either, and its absence is the point rather than an oversight:
// ListeningPartCompleteScreen set the rule that a greyed out control
// saying "press this in a moment" is worse than a sentence, so this
// screen says the sentence. EXAM-28 is where the control goes, once
// there is something behind it.
//
// A missing recording is reported plainly and is not styled as an error.
// A learner may have skipped a task, may have been reading the section
// rather than sitting it, or may have no working microphone. None of
// those is a failure this screen has any business colouring red.
//
// Return to dashboard is a link so it keeps middle click and open in a
// new tab. Restart is a handler, because throwing away the recordings
// held on the page, and revoking their object URLs, is the prototype's
// business and not the router's.
//
// No timer. Nothing is being timed on a screen with no task on it.
//
// Presentational only. It holds no state.
//
// House style: normal hyphens only, no long hyphens or em dashes.

export type SpeakingSectionCompleteScreenProps = {
  // Exam frame title, normally the section title.
  title: string;
  // One row per task, in task order.
  tasks: SpeakingTaskSummary[];
  // Where Return to dashboard goes.
  dashboardHref?: string;
  // Clears the recordings and returns to the first screen. Omit to hide
  // the control.
  onRestart?: () => void;
  copy?: SpeakingMockCopy;
  metaText?: string;
  onBack?: () => void;
  showBack?: boolean;
};

export function SpeakingSectionCompleteScreen({
  title,
  tasks,
  dashboardHref = "/dashboard",
  onRestart,
  copy = speakingMockCopy,
  metaText,
  onBack,
  showBack = true,
}: SpeakingSectionCompleteScreenProps) {
  const recordedCount = tasks.filter((task) => task.recorded).length;

  return (
    <ExamShell
      title={title}
      metaText={metaText}
      // The last screen in the flow, so there is nowhere for Next to go.
      showNext={false}
      onBack={onBack}
      showBack={showBack}
    >
      <div className={examScreenBody.stack}>
        <ExamInstructionRow
          heading={copy.completeHeading}
          text={copy.completeMessage}
        />

        <div className={examSpeaking.completeStack}>
          <p className={examSpeaking.completeHeading}>
            {copy.completeTasksHeading}
          </p>

          <p className={examSpeaking.completeCount}>
            {formatSpeakingRecordedCount(recordedCount, tasks.length)}
          </p>

          <div className={examReview.wrap}>
            <table className={examReview.table}>
              <caption className={examReview.caption}>
                {copy.completeTasksHeading}
              </caption>

              <thead>
                <tr className={examReview.headRow}>
                  <th scope="col" className={examReview.headCell}>
                    {copy.completeTaskColumn}
                  </th>
                  <th scope="col" className={examReview.headCell}>
                    {copy.completeStatusColumn}
                  </th>
                  <th scope="col" className={examReview.headCell}>
                    {copy.completeLengthColumn}
                  </th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task) => (
                  <tr key={task.taskId} className={examReview.row}>
                    <th scope="row" className={examReview.cell}>
                      {task.taskLabel}
                      <span className={examReview.statement}>
                        {task.taskTitle}
                      </span>
                    </th>

                    <td
                      className={cx(
                        examReview.statusCell,
                        task.recorded
                          ? "text-academy-navy"
                          : "text-academy-navy/55",
                      )}
                    >
                      {task.recorded
                        ? copy.completeRecordedValue
                        : copy.completeMissingValue}
                    </td>

                    {task.recorded ? (
                      <td className={examReview.numberCell}>
                        {formatSpeakingClock(task.durationSeconds)}
                      </td>
                    ) : (
                      <td className={examReview.emptyCell}>
                        {copy.completeNoLengthValue}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section>
            <h3 className={examSpeaking.completeHeading}>
              {copy.completeNextStepHeading}
            </h3>

            <p className={cx("mt-1.5", examSpeaking.completeCount)}>
              {copy.completeNextStepText}
            </p>
          </section>

          <div className={examScreenBody.actions}>
            <ExamButton
              variant="secondary"
              size="md"
              href={dashboardHref}
              uppercase={false}
            >
              {copy.backToDashboardLabel}
            </ExamButton>

            {onRestart ? (
              <ExamButton
                variant="secondary"
                size="md"
                onClick={onRestart}
                uppercase={false}
              >
                {copy.restartLabel}
              </ExamButton>
            ) : null}
          </div>

          <p className={examScreenBody.notice}>{copy.completeNotice}</p>
        </div>
      </div>
    </ExamShell>
  );
}
