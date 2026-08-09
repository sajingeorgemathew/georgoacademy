"use client";

import { cx } from "@/features/design/design-tokens";
import { examListeningDropdown } from "@/features/exam-engine/exam-theme";
import { listeningCopy } from "@/features/exam-engine/listening-copy";
import type {
  ListeningDropdownAnswerMap,
  ListeningDropdownQuestion,
} from "@/features/exam-engine/listening-dropdown-types";

// The numbered list of completion questions on a dropdown screen
// (EXAM-09).
//
// Split out from ListeningDropdownQuestionScreen so the list is the piece
// that knows how a statement and its control are drawn, and the screen is
// the piece that knows about the shell, the timer and Next. Listening
// Parts 5 and 6 are the same list under a different media screen.
//
// A client component, because choosing an option is an event handler. It
// holds no state itself: the answers are owned by the prototype above it,
// so leaving the screen and coming back shows what was chosen before.
//
// Layout decisions worth keeping:
//
// - The statement is the select's label, wired with htmlFor. Screen type
//   7 puts the control where the blank falls, but the option text here is
//   a sentence fragment several words long, so an inline control would
//   push the tail of the statement around as the value changed. The
//   control sits under the statement instead, indented, which the ticket
//   allows and which keeps the reading order intact.
// - The blank keeps the underscores from the source document, quieted
//   rather than replaced, with the word "blank" read in their place.
// - The placeholder is a real option with an empty value rather than a
//   disabled first choice, so an unanswered select shows "Select answer"
//   instead of silently defaulting to the first answer.
//
// Nothing here knows which option is correct. The answer key is stripped
// on the server before the content reaches the browser.

export type ListeningDropdownQuestionListProps = {
  questions: ListeningDropdownQuestion[];
  answers: ListeningDropdownAnswerMap;
  onSelectOption: (questionId: string, optionId: string) => void;
  placeholderLabel?: string;
};

export function ListeningDropdownQuestionList({
  questions,
  answers,
  onSelectOption,
  placeholderLabel = listeningCopy.dropdownPlaceholder,
}: ListeningDropdownQuestionListProps) {
  return (
    <ol className={examListeningDropdown.list}>
      {questions.map((question) => {
        const selectId = `${question.id}-select`;
        const selectedOptionId = answers[question.id] ?? "";

        return (
          <li key={question.id} className={examListeningDropdown.item}>
            <label htmlFor={selectId} className={examListeningDropdown.statement}>
              <span className={examListeningDropdown.number}>
                {question.number}.
              </span>
              {question.textBefore}{" "}
              <span className={examListeningDropdown.blank} aria-hidden="true">
                ___________
              </span>
              <span className="sr-only">
                {listeningCopy.dropdownBlankLabel}
              </span>
              {question.textAfter ? ` ${question.textAfter}` : null}
            </label>

            <div className={examListeningDropdown.control}>
              <select
                id={selectId}
                className={cx(
                  examListeningDropdown.select,
                  selectedOptionId ? "" : examListeningDropdown.selectEmpty,
                )}
                value={selectedOptionId}
                onChange={(event) =>
                  onSelectOption(question.id, event.target.value)
                }
              >
                <option value="">{placeholderLabel}</option>

                {question.options.map((option) => (
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
