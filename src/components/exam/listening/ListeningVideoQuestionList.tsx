"use client";

import { cx } from "@/features/design/design-tokens";
import {
  examListening,
  examListeningChoice,
} from "@/features/exam-engine/exam-theme";
import type {
  ListeningVideoAnswerMap,
  ListeningVideoQuestion,
} from "@/features/exam-engine/listening-video-types";

// The numbered list of multiple-choice questions on a video discussion
// question screen (EXAM-11).
//
// Split out from ListeningVideoQuestionScreen for the same reason
// ListeningDropdownQuestionList is split out from its screen: the list is
// the piece that knows how a question and its options are drawn, and the
// screen is the piece that knows about the shell, the timer and Next.
//
// A client component, because choosing an option is an event handler. It
// holds no state itself: the answers are owned by the prototype above it,
// so leaving the screen and coming back shows what was chosen before.
//
// Layout decisions worth keeping:
//
// - Each question is one row of an ordered list, ruled apart, with the
//   number as a small tabular label at the head of the question. Eight
//   questions read as one form rather than as eight widgets.
// - Each question is its own fieldset and its own radio group, named from
//   the question id, so no two groups on this screen can share a name and
//   answering question 2 cannot clear question 1.
// - The question is the group's legend, so a screen reader announces it
//   when an option takes focus rather than reading four bare fragments.
// - The option rows are the examListening recipes the Parts 1 to 3
//   question screen uses, so an option here is the same control a learner
//   has already met. The whole row is the click target, so nobody has to
//   hit the small circle itself.
//
// Nothing here knows which option is correct. The answer key is stripped
// on the server before the content reaches the browser.

export type ListeningVideoQuestionListProps = {
  questions: ListeningVideoQuestion[];
  answers: ListeningVideoAnswerMap;
  onSelectOption: (questionId: string, optionId: string) => void;
};

export function ListeningVideoQuestionList({
  questions,
  answers,
  onSelectOption,
}: ListeningVideoQuestionListProps) {
  return (
    <ol className={examListeningChoice.list}>
      {questions.map((question) => {
        const selectedOptionId = answers[question.id];
        const groupName = `${question.id}-options`;

        return (
          <li key={question.id} className={examListeningChoice.item}>
            <fieldset className="min-w-0">
              <legend className={examListeningChoice.prompt}>
                <span className={examListeningChoice.number}>
                  {question.number}.
                </span>
                {question.prompt}
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
