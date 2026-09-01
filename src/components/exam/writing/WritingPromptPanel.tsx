import { cx } from "@/features/design/design-tokens";
import { examWriting } from "@/features/exam-engine/exam-theme";
import { writingMockCopy } from "@/features/exam-engine/writing-mock-copy";
import type { WritingMockCopy } from "@/features/exam-engine/writing-mock-copy";
import type { WritingTaskContent } from "@/features/exam-engine/writing-mock-types";

// The prompt above the editor, and the positions where a task has them
// (EXAM-25).
//
// Everything the learner is asked to do, in the order the source prints
// it: the instruction sentence, the requirement bullets under it, and on
// the survey task the two positions to choose between.
//
// All of it comes from the content object, so this component carries no
// Mock Test 1 wording of its own. Task 1 prints three bullets and no
// choice; Task 2 prints a choice and no bullets, because that is what the
// source images show. Neither case is special-cased here: an empty
// requirement list renders nothing and an unset options list renders
// nothing.
//
// The choice is a real radio group in a fieldset with a legend, rather
// than two styled buttons, so a keyboard user gets arrow key selection
// and a screen reader hears the group and its name. The whole row is the
// click target, which is the pattern the Listening option rows already
// use.
//
// Choosing a position gates nothing. The official screens open the
// writing space only after a choice is made, which
// docs/product/celpip-exam-rules-research.md section 12 records, but this
// prototype leaves the editor open throughout: the ticket asks for empty
// responses to be allowed and for nothing to block, and an editor that
// appears halfway down the screen after a click is a worse thing to
// review than one that is simply there. The difference is written up in
// docs/product/writing-mock-test-prototype.md.
//
// Presentational only. It holds no state: the chosen option id is owned
// by the prototype and passed down, so a choice survives leaving the task
// and coming back.
//
// House style: normal hyphens only, no long hyphens or em dashes.

export type WritingPromptPanelProps = {
  task: WritingTaskContent;
  // The chosen position, or undefined while none has been chosen.
  selectedOptionId?: string;
  // Omit on a task with no positions to choose between.
  onSelectOption?: (optionId: string) => void;
  copy?: WritingMockCopy;
};

export function WritingPromptPanel({
  task,
  selectedOptionId,
  onSelectOption,
  copy = writingMockCopy,
}: WritingPromptPanelProps) {
  const options = task.options ?? [];

  return (
    <div className={examWriting.prompt}>
      <p className={examWriting.promptInstruction}>{task.promptInstruction}</p>

      {task.promptRequirements.length > 0 ? (
        <ul className={examWriting.requirementList}>
          {task.promptRequirements.map((requirement) => (
            // The requirement text is the key. The three lines are
            // distinct sentences from the source and never reorder.
            <li key={requirement} className={examWriting.requirementItem}>
              {requirement}
            </li>
          ))}
        </ul>
      ) : null}

      {options.length > 0 ? (
        <div className={examWriting.choice}>
          <fieldset className={examWriting.choiceFieldset}>
            <legend className={examWriting.choiceLegend}>
              {task.optionInstruction ?? copy.choiceLegendLabel}
            </legend>

            <div className={examWriting.choiceList}>
              {options.map((option) => {
                const selected = selectedOptionId === option.id;

                return (
                  <label
                    key={option.id}
                    className={cx(
                      examWriting.choiceRow,
                      selected ? examWriting.choiceRowSelected : "",
                    )}
                  >
                    <input
                      type="radio"
                      name={`${task.taskId}-option`}
                      value={option.id}
                      checked={selected}
                      onChange={() => onSelectOption?.(option.id)}
                      className={examWriting.choiceInput}
                    />

                    <span className={examWriting.choiceText}>
                      <span className={examWriting.choiceLabel}>
                        {option.label}:
                      </span>{" "}
                      {option.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <p className={examWriting.choiceHint}>{copy.choiceHint}</p>
        </div>
      ) : null}
    </div>
  );
}
