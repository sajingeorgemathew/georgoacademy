"use client";

import { cx } from "@/features/design/design-tokens";
import {
  examListening,
  examListeningChoice,
  examListeningDropdown,
} from "@/features/exam-engine/exam-theme";
import { listeningCopy } from "@/features/exam-engine/listening-copy";
import type {
  ListeningViewpointsAnswerMap,
  ListeningViewpointsQuestion,
} from "@/features/exam-engine/listening-viewpoints-types";

// The numbered list of viewpoints questions on a one screen question
// screen (EXAM-13).
//
// Split out from ListeningViewpointsQuestionScreen for the same reason
// ListeningDropdownQuestionList and ListeningVideoQuestionList are split
// out from theirs: the list is the piece that knows how a question and its
// options are drawn, and the screen is the piece that knows about the
// shell, the timer and Next.
//
// A client component, because choosing an option is an event handler. It
// holds no state itself: the answers are owned by the prototype above it,
// so leaving the screen and coming back shows what was chosen before.
//
// This list is the two existing lists crossed. The item is an incomplete
// statement, drawn the way ListeningDropdownQuestionList draws one, and
// the control under it is the four option radio group
// ListeningVideoQuestionList draws. So both recipes are reused rather than
// a third set of classes being invented:
//
// - The statement uses examListeningDropdown's statement, number and blank
//   recipes, so a stem here and a stem on the Part 4 screen are the same
//   sentence with the same quiet underscores in the same place.
// - The options use examListeningChoice.options with the examListening
//   option rows, so an option here is the same control a learner has
//   already met on every other Listening question screen. The whole row is
//   the click target, so nobody has to hit the small circle itself.
//
// Accessibility decisions worth keeping:
//
// - Each question is its own fieldset and its own radio group, named from
//   the question id, so no two groups on this screen can share a name and
//   answering question 2 cannot clear question 1.
// - The statement is the group's legend, so a screen reader announces the
//   whole stem when an option takes focus rather than reading four bare
//   fragments that only make sense attached to it.
// - The underscores are hidden from assistive technology and the word
//   "blank" is read in their place, so the stem announces as a sentence
//   with a gap rather than as punctuation. Same treatment the dropdown
//   list gives them.
//
// Nothing here knows which option is correct. The answer key is stripped
// on the server before the content reaches the browser.

export type ListeningViewpointsQuestionListProps = {
  questions: ListeningViewpointsQuestion[];
  answers: ListeningViewpointsAnswerMap;
  onSelectOption: (questionId: string, optionId: string) => void;
};

export function ListeningViewpointsQuestionList({
  questions,
  answers,
  onSelectOption,
}: ListeningViewpointsQuestionListProps) {
  return (
    <ol className={examListeningChoice.list}>
      {questions.map((question) => {
        const selectedOptionId = answers[question.id];
        const groupName = `${question.id}-options`;

        return (
          <li key={question.id} className={examListeningChoice.item}>
            <fieldset className="min-w-0">
              <legend className={examListeningDropdown.statement}>
                <span className={examListeningDropdown.number}>
                  {question.number}.
                </span>
                {question.textBefore}{" "}
                <span
                  className={examListeningDropdown.blank}
                  aria-hidden="true"
                >
                  ___________
                </span>
                <span className="sr-only">
                  {listeningCopy.dropdownBlankLabel}
                </span>
                {question.textAfter ? ` ${question.textAfter}` : null}
              </legend>

              <div
                className={cx(
                  examListeningChoice.options,
                  examListening.optionList,
                )}
              >
                {question.options.map((option) => {
                  const isSelected = option.id === selectedOptionId;

                  return (
                    <label
                      key={option.id}
                      className={cx(
                        examListening.optionRow,
                        isSelected ? examListening.optionRowSelected : "",
                      )}
                    >
                      <input
                        type="radio"
                        name={groupName}
                        value={option.id}
                        checked={isSelected}
                        onChange={() => onSelectOption(question.id, option.id)}
                        className={examListening.optionInput}
                      />
                      <span className={examListening.optionText}>
                        {option.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </li>
        );
      })}
    </ol>
  );
}
