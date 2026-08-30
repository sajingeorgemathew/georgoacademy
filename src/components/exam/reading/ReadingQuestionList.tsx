"use client";

import { cx } from "@/features/design/design-tokens";
import { examReadingQuestion } from "@/features/exam-engine/exam-theme";
import { readingCopy } from "@/features/exam-engine/reading-copy";
import type {
  ReadingAnswerMap,
  ReadingQuestion,
} from "@/features/exam-engine/reading-types";

// The numbered list of drop-down questions on a Reading panel (EXAM-16).
//
// Split out from ReadingQuestionPanel so the list is the piece that knows
// how a question and its control are drawn, and the panel is the piece
// that knows about the instruction line and the reply above it. The two
// Reading Part 1 panels are the same list with different questions in it,
// and Parts 2 and 4 have the same pair.
//
// A client component, because choosing an option is an event handler. It
// holds no state itself: the answers are owned by the prototype at the
// top of the part, so leaving the screen and coming back shows what was
// chosen before.
//
// It draws two shapes of question, which is the one thing that makes it
// more than the Listening dropdown list:
//
// - A stem question prints its sentence in the header strip, with the
//   blank drawn where the source document's underscores fall.
// - A blank inside a reply prints nothing but "Question 7". Its sentence
//   is in the reply above the list, so repeating anything here would be
//   inventing a stem the source does not have.
//
// Layout decisions carried over from ListeningDropdownQuestionList,
// because they were right there for the same reasons:
//
// - The header strip is the select's label, wired with htmlFor. Option
//   text here is a sentence fragment several words long, so a control
//   sitting inside the sentence would push its tail around as the value
//   changed. The control sits under the statement instead.
// - The blank keeps the underscores from the source document, quieted
//   rather than replaced, with the word "blank" read in their place.
// - The placeholder is a real option with an empty value rather than a
//   disabled first choice, so an unanswered select shows "Select answer"
//   instead of silently defaulting to the first answer.
//
// Nothing here knows which option is correct. The answer key is stripped
// on the server before the content reaches the browser.

export type ReadingQuestionListProps = {
  questions: ReadingQuestion[];
  answers: ReadingAnswerMap;
  onSelectOption: (questionId: string, optionId: string) => void;
  placeholderLabel?: string;
};

export function ReadingQuestionList({
  questions,
  answers,
  onSelectOption,
  placeholderLabel = readingCopy.dropdownPlaceholder,
}: ReadingQuestionListProps) {
  return (
    <ol className={examReadingQuestion.list}>
      {questions.map((question) => {
        const selectId = `${question.id}-select`;
        const selectedOptionId = answers[question.id] ?? "";

        return (
          <li key={question.id} className={examReadingQuestion.item}>
            <label htmlFor={selectId} className={examReadingQuestion.statement}>
              <span className={examReadingQuestion.number}>
                {question.number}.
              </span>

              {question.textBefore ? (
                <>
                  {question.textBefore}{" "}
                  <span
                    className={examReadingQuestion.blank}
                    aria-hidden="true"
                  >
                    ___________
                  </span>
                  <span className="sr-only">{readingCopy.blankLabel}</span>
                  {question.textAfter ? ` ${question.textAfter}` : null}
                </>
              ) : (
                // A blank inside the reply. The number above is decorative
                // on its own, so the label says which question this is.
                <span className="sr-only">
                  {`${readingCopy.questionNumberLabel} ${question.number}`}
                </span>
              )}
            </label>

            <div className={examReadingQuestion.control}>
              <select
                id={selectId}
                className={cx(
                  examReadingQuestion.select,
                  selectedOptionId ? "" : examReadingQuestion.selectEmpty,
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
