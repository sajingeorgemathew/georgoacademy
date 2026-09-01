import { ExamButton } from "../ExamButton";
import { ExamInstructionRow } from "../ExamInstructionRow";
import { ExamShell } from "../ExamShell";
import {
  examReview,
  examScreenBody,
  examText,
  examWriting,
} from "@/features/exam-engine/exam-theme";
import {
  formatWritingWordCount,
  writingMockCopy,
} from "@/features/exam-engine/writing-mock-copy";
import type { WritingMockCopy } from "@/features/exam-engine/writing-mock-copy";
import type { WritingTaskSummary } from "@/features/exam-engine/writing-mock-types";

// Writing section completion screen (EXAM-25).
//
// The last screen of the run. It says the section is finished, reports
// what was typed for each task, states plainly that the AI review and the
// estimated band are the next build, and offers a restart and a way back
// to the dashboard.
//
// What it reports is word counts and, for the survey task, the position
// that was chosen. That is everything this prototype honestly knows about
// a response. There is no score, no band, no feedback and no percentage,
// because Writing is judged against descriptors rather than a key and
// nothing has judged it. A pending block with a greyed out number in it
// would suggest a result is a moment away, and it is a ticket away.
//
// The pending review line is a plain sentence rather than a disabled
// button, which is the rule ListeningPartCompleteScreen set: a greyed out
// control says "press this in a moment", and there is nothing behind it.
//
// Return to dashboard is a link so it keeps middle click and open in a
// new tab. Restart is a handler, because clearing the writing held on the
// page is the prototype's business and not the router's.
//
// No timer. Nothing is being timed on a screen with no task on it.
//
// Presentational only. It holds no state.
//
// House style: normal hyphens only, no long hyphens or em dashes.

export type WritingSectionCompleteScreenProps = {
  // Exam frame title, normally the section title.
  title: string;
  // One row per task, in task order.
  tasks: WritingTaskSummary[];
  // Where Return to dashboard goes.
  dashboardHref?: string;
  // Clears the writing and returns to the first screen. Omit to hide the
  // control.
  onRestart?: () => void;
  copy?: WritingMockCopy;
  metaText?: string;
  onBack?: () => void;
  showBack?: boolean;
};

export function WritingSectionCompleteScreen({
  title,
  tasks,
  dashboardHref = "/dashboard",
  onRestart,
  copy = writingMockCopy,
  metaText,
  onBack,
  showBack = true,
}: WritingSectionCompleteScreenProps) {
  // The choice column is drawn only when a task in the section offers a
  // choice, so a section of plain writing tasks gets a two column table
  // rather than a column of dashes.
  const showChoiceColumn = tasks.some(
    (task) => task.choiceLabel !== undefined || task.choiceText !== undefined,
  );

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

        <div className={examWriting.completeStack}>
          <p className={examWriting.completeHeading}>
            {copy.completeTasksHeading}
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
                    {copy.completeWordsColumn}
                  </th>
                  {showChoiceColumn ? (
                    <th scope="col" className={examReview.headCell}>
                      {copy.completeChoiceColumn}
                    </th>
                  ) : null}
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

                    <td className={examReview.numberCell}>
                      {formatWritingWordCount(task.wordCount)}
                    </td>

                    {showChoiceColumn ? (
                      task.choiceLabel ? (
                        <td className={examReview.cell}>
                          {task.choiceLabel}
                          {task.choiceText ? (
                            <span className={examReview.statement}>
                              {task.choiceText}
                            </span>
                          ) : null}
                        </td>
                      ) : (
                        <td className={examReview.emptyCell}>
                          {copy.completeNoChoiceValue}
                        </td>
                      )
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={examScreenBody.actions}>
            <ExamButton variant="primary" size="md" href={dashboardHref}>
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

          <p className={examText.muted}>{copy.completePendingReview}</p>

          <p className={examScreenBody.notice}>{copy.completeNotice}</p>
        </div>
      </div>
    </ExamShell>
  );
}
