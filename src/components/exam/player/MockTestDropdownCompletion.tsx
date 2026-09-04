"use client";

import { cx } from "@/features/design/design-tokens";
import { playerDropdown } from "@/features/exam-engine/mock-test-player-theme";
import { examCopy } from "@/features/exam-engine/exam-copy";

// The dropdown completion question list (EXAM-UI-03).
//
// Screen type 7: every question in the part on one screen, each answered
// from a drop-down menu. Listening Parts 4, 5 and 6 are all this screen,
// and before this ticket only two of them drew it.
//
// **Why Part 5 moved here.** EXAM-11 built Part 5 as eight radio groups,
// on the reading that its items are full interrogatives rather than
// sentence stems, so there was no blank for a select to sit in. The
// format is the format either way: the source document instructs the part
// with "Choose the best way to complete each statement from the drop-down
// menu", the part answers a whole set on one screen the way Parts 4 and 6
// do, and eight radio groups of four is thirty two controls stacked down
// a page a learner has to scroll three times. This component answers both
// item shapes from the same control, so all three one screen parts are
// now one screen type.
//
// An item is drawn one of two ways, decided by the item itself and not by
// a flag the caller has to remember:
//
// - **a question**, when prompt is set: the question is printed whole in
//   the strip and the select under it is unlabelled apart from it
// - **a statement**, when textBefore is set: the statement is printed
//   with the blank drawn where the source document put underscores, and
//   the select finishes it
//
// Either way the strip is the select's label, wired with htmlFor, so a
// screen reader announces the question when the control takes focus. The
// control sits under the strip rather than inline in it: option text here
// is a sentence fragment several words long, so an inline control would
// push the tail of a statement around every time the value changed.
//
// The placeholder is a real option with an empty value rather than a
// disabled first choice, so an unanswered question shows "Select answer"
// instead of silently reading as the first option.
//
// **Nothing here knows which option is correct.** The answer key is
// stripped on the server before the content reaches the browser, the
// option ids are the content's own ids, and the value stored is the
// option id rather than its text. So moving a part onto this control
// changes what a learner clicks and nothing about what is marked.

export type MockTestDropdownOption = {
  id: string;
  text: string;
};

export type MockTestDropdownItem = {
  id: string;
  // Position inside the part, counting from 1. Display only.
  number: number;
  // The whole question, for a part whose items are questions.
  prompt?: string;
  // Statement text up to the blank, for a completion part.
  textBefore?: string;
  // Statement text after the blank. Unset when the blank ends it.
  textAfter?: string;
  options: MockTestDropdownOption[];
};

export type MockTestDropdownCompletionProps = {
  items: MockTestDropdownItem[];
  // { questionId: selectedOptionId }. The same shape the marking action
  // and the review screens already read.
  answers: Readonly<Record<string, string>>;
  onSelectOption: (questionId: string, optionId: string) => void;
  placeholderLabel?: string;
  // Read in place of the drawn underscores.
  blankLabel?: string;
  className?: string;
};

export function MockTestDropdownCompletion({
  items,
  answers,
  onSelectOption,
  placeholderLabel = examCopy.selectAnswerLabel,
  blankLabel = examCopy.dropdownBlankLabel,
  className,
}: MockTestDropdownCompletionProps) {
  return (
    <ol className={cx(playerDropdown.list, className)}>
      {items.map((item) => {
        const selectId = `${item.id}-select`;
        const selectedOptionId = answers[item.id] ?? "";

        return (
          <li key={item.id} className={playerDropdown.item}>
            <label htmlFor={selectId} className={playerDropdown.statement}>
              <span className={playerDropdown.number}>{item.number}.</span>

              {item.prompt ? (
                item.prompt
              ) : (
                <>
                  {item.textBefore}{" "}
                  <span className={playerDropdown.blank} aria-hidden="true">
                    ___________
                  </span>
                  <span className="sr-only">{blankLabel}</span>
                  {item.textAfter ? ` ${item.textAfter}` : null}
                </>
              )}
            </label>

            <div className={playerDropdown.control}>
              <select
                id={selectId}
                className={cx(
                  playerDropdown.select,
                  selectedOptionId ? "" : playerDropdown.selectEmpty,
                )}
                value={selectedOptionId}
                onChange={(event) =>
                  onSelectOption(item.id, event.target.value)
                }
              >
                <option value="">{placeholderLabel}</option>

                {item.options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.text}
                  </option>
                ))}
              </select>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
