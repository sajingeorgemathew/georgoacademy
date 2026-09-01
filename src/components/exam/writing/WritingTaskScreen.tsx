import { ExamShell } from "../ExamShell";
import { ExamTwoColumnLayout } from "../ExamTwoColumnLayout";
import { ExamCountdownTimer } from "../timer/ExamCountdownTimer";
import { WritingPromptPanel } from "./WritingPromptPanel";
import { WritingResponseEditor } from "./WritingResponseEditor";
import { examWriting } from "@/features/exam-engine/exam-theme";
import { writingMockCopy } from "@/features/exam-engine/writing-mock-copy";
import type { WritingMockCopy } from "@/features/exam-engine/writing-mock-copy";
import type { WritingTaskContent } from "@/features/exam-engine/writing-mock-types";

// The working screen for one Writing task (EXAM-25).
//
// Screen type 9 from docs/product/exam-engine-screen-types.md: the
// situation on the left, and on the right the prompt, the positions where
// the task has them, and the editor. Both Mock Test 1 tasks use this one
// screen, which is why there is no WritingTaskOneScreen and no
// WritingTaskTwoScreen: the two differ only in what their content object
// holds, and the differences are already expressed there as an empty
// requirement list or an unset options list.
//
// The split is the shared ExamTwoColumnLayout rather than the Reading
// wrapper over it. Reading passes both columns a fixed scroll height,
// which is right when both halves are things to read and wrong here: an
// editor inside a column capped at 28rem would put the writing area in a
// box inside a box, with two scrollbars over the same text. So the
// situation column scrolls on its own and the response column does not.
// The canvas scrolls whatever is left, which for a 150 to 200 word
// response is very little.
//
// The timer belongs to the task rather than to anything on it. Writing is
// timed per task in the source document, which gives 27 minutes for Task
// 1 and 53 minutes for the section, so the window is keyed to the flow
// screen id: typing, choosing a position and every re-render that follows
// keep the same key and therefore the same window.
//
// What happens at zero is the caller's decision, and EXAM-25 passes no
// onTimeExpire. The reading becomes "Time is up", the screen stays put,
// every word stays on it, and the learner continues by pressing Next when
// they are ready. Nothing auto-submits, nothing advances and nothing is
// erased. Strict Writing timing is a later ticket.
//
// The screen holds no state. The response text and the chosen position
// are owned by the prototype above it, so leaving the task and coming
// back shows exactly what was there before.
//
// Presentational, so no "use client" of its own: it is rendered by the
// prototype, which is the client component, and ExamCountdownTimer
// carries its own.
//
// House style: normal hyphens only, no long hyphens or em dashes.

export type WritingTaskScreenProps = {
  task: WritingTaskContent;
  response: string;
  onChangeResponse: (text: string) => void;
  // The chosen position on a task that offers one.
  selectedOptionId?: string;
  onSelectOption?: (optionId: string) => void;
  // What the countdown resets on. Pass the flow screen id, so the window
  // belongs to the screen and nothing typed on it starts a new one.
  timerScreenKey?: string;
  // Fired once when the window reaches zero. Nothing passes one in
  // EXAM-25.
  onTimeExpire?: () => void;
  copy?: WritingMockCopy;
  metaText?: string;
  nextLabel?: string;
  onNext?: () => void;
  onBack?: () => void;
  showBack?: boolean;
};

export function WritingTaskScreen({
  task,
  response,
  onChangeResponse,
  selectedOptionId,
  onSelectOption,
  timerScreenKey,
  onTimeExpire,
  copy = writingMockCopy,
  metaText,
  nextLabel,
  onNext,
  onBack,
  showBack = true,
}: WritingTaskScreenProps) {
  return (
    <ExamShell
      title={task.title}
      timerSlot={
        <ExamCountdownTimer
          // Keyed on the screen, because the whole task is written
          // inside one window.
          screenKey={timerScreenKey ?? task.taskId}
          durationSeconds={task.timer.seconds}
          warningAtSeconds={task.timer.warningAtSeconds}
          urgentAtSeconds={task.timer.urgentAtSeconds}
          label={copy.taskTimerLabel}
          onExpire={onTimeExpire}
        />
      }
      metaText={metaText}
      nextLabel={nextLabel}
      onNext={onNext}
      onBack={onBack}
      showBack={showBack}
      // The split manages its own edges and fills the canvas.
      padded={false}
    >
      <ExamTwoColumnLayout
        leftLabel={copy.situationColumnLabel}
        rightLabel={copy.responseColumnLabel}
        // The situation scrolls on its own so a long one never pushes the
        // editor off the screen. The response side does not, because an
        // editor inside a capped column would scroll twice.
        leftScroll="tall"
        rightScroll="none"
        bordered={false}
        left={
          <div className={examWriting.situation}>
            <p className={examWriting.situationInstruction}>
              {task.situationInstruction}
            </p>

            {task.situationHeading ? (
              <p className={examWriting.situationHeading}>
                {task.situationHeading}
              </p>
            ) : null}

            {task.situationParagraphs.map((paragraph, index) => (
              <p
                // Paragraphs have no ids of their own and never reorder,
                // so the index is the stable key here. Same rule the
                // Reading passage follows.
                key={`${task.taskId}-situation-${index}`}
                className={examWriting.situationParagraph}
              >
                {paragraph}
              </p>
            ))}
          </div>
        }
        right={
          <div className={examWriting.taskColumn}>
            <WritingPromptPanel
              task={task}
              selectedOptionId={selectedOptionId}
              onSelectOption={onSelectOption}
              copy={copy}
            />

            <WritingResponseEditor
              editorId={`${task.taskId}-response`}
              value={response}
              onChange={onChangeResponse}
              placeholder={task.editorPlaceholder}
              targetMin={task.wordTarget.min}
              targetMax={task.wordTarget.max}
              copy={copy}
            />
          </div>
        }
      />
    </ExamShell>
  );
}
