"use client";

import { ExamInstructionRow } from "../ExamInstructionRow";
import { ExamShell } from "../ExamShell";
import { ListeningDropdownQuestionList } from "./ListeningDropdownQuestionList";
import {
  examListening,
  examListeningDropdown,
  examScreenBody,
} from "@/features/exam-engine/exam-theme";
import {
  formatListeningAnsweredCount,
  listeningCopy,
} from "@/features/exam-engine/listening-copy";
import type {
  ListeningDropdownAnswerMap,
  ListeningDropdownQuestion,
} from "@/features/exam-engine/listening-dropdown-types";

// Dropdown completion question screen for a Listening part (EXAM-09).
//
// Screen type 7 from docs/product/exam-engine-screen-types.md, and the
// screen the reference layout matters most for in this part:
//
// - grey top bar with the static "Time remaining: 30 seconds" reading
// - white exam canvas, single column, no split
// - compact instruction row at the top
// - left aligned numbered statements, ruled apart
// - a dropdown under each statement
// - blue Next in the top bar, Back in the bottom bar
//
// Single column, unlike the Parts 1 to 3 question screen. There is no
// question audio in a dropdown part, so there is nothing to put in a
// second column, and a split would leave half the canvas empty.
//
// A client component, because choosing an option is an event handler. It
// holds no state: the answers are owned by the prototype above it, so
// leaving the screen and coming back shows what was chosen before.
//
// Next is disabled until every question has an answer, which is what
// allAnswered carries. The count under the list says how many are left,
// so a learner scrolling a five question form can see why Next is not
// available without hunting for the empty control.
//
// The timer reading is fixed. Nothing counts down in this ticket, which
// is why it is passed in the shell's muted state.

export type ListeningDropdownQuestionScreenProps = {
  title: string;
  questions: ListeningDropdownQuestion[];
  answers: ListeningDropdownAnswerMap;
  onSelectOption: (questionId: string, optionId: string) => void;
  // Whether every question has an answer. Passed in rather than worked
  // out here, so the rule that gates Next lives in one place.
  allAnswered: boolean;
  // Instruction line above the list. Defaults to the standard dropdown
  // wording when a part's content does not carry its own.
  instructionText?: string;
  // Static reading in the top bar. Nothing counts down in this ticket.
  timerLabel?: string;
  timerValue?: string;
  metaText?: string;
  onNext?: () => void;
  onBack?: () => void;
  showBack?: boolean;
};

export function ListeningDropdownQuestionScreen({
  title,
  questions,
  answers,
  onSelectOption,
  allAnswered,
  instructionText = listeningCopy.dropdownInstruction,
  timerLabel = listeningCopy.questionTimerLabel,
  timerValue = listeningCopy.questionTimerValue,
  metaText,
  onNext,
  onBack,
  showBack = true,
}: ListeningDropdownQuestionScreenProps) {
  const answeredCount = questions.filter((question) =>
    Boolean(answers[question.id]),
  ).length;

  return (
    <ExamShell
      title={title}
      timerLabel={timerLabel}
      timerValue={timerValue}
      // muted, not normal or warning: this is a fixed label rather than a
      // live value, and the shell reserves that state for exactly this
      // case. A countdown arrives with a later ticket.
      timerState="muted"
      metaText={metaText}
      onNext={onNext}
      nextDisabled={!allAnswered}
      onBack={onBack}
      showBack={showBack}
    >
      <div className={examScreenBody.stack}>
        <ExamInstructionRow text={instructionText} />

        <div className={examListening.columnStack}>
          <ListeningDropdownQuestionList
            questions={questions}
            answers={answers}
            onSelectOption={onSelectOption}
          />

          <p className={examListeningDropdown.progressNote}>
            {formatListeningAnsweredCount(answeredCount, questions.length)}
            {allAnswered ? null : ` ${listeningCopy.dropdownAnswerAllHint}`}
          </p>
        </div>
      </div>
    </ExamShell>
  );
}
