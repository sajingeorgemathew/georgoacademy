"use client";

import { ExamInstructionRow } from "../ExamInstructionRow";
import { ExamShell } from "../ExamShell";
import { ExamCountdownTimer } from "../timer/ExamCountdownTimer";
import { ListeningDropdownQuestionList } from "./ListeningDropdownQuestionList";
import {
  examListening,
  examListeningDropdown,
  examScreenBody,
} from "@/features/exam-engine/exam-theme";
import { EXAM_QUESTION_TIMER_SECONDS } from "@/features/exam-engine/exam-timer-utils";
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
// - grey top bar with a live "Time remaining: 00:30" countdown
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
// The timer is real from EXAM-15D, and it belongs to the screen rather
// than to any one question on it: this part answers all five questions in
// one window, so the window is keyed to the screen and answering a
// question does not restart it. Reaching zero changes the reading to
// "Time is up" and nothing else. No answer is cleared, the list is not
// disabled, and Next still waits on every question being answered. See
// docs/product/exam-timer-foundation.md.

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
  // Label in front of the countdown in the top bar.
  timerLabel?: string;
  // How long the answering window runs. Defaults to the standard question
  // window, which is the 30 seconds this screen has always shown.
  timerSeconds?: number;
  // What the countdown resets on. Defaults to the first question's id,
  // which is stable for as long as this screen is showing. A caller with a
  // flow screen id can pass that instead.
  timerScreenKey?: string;
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
  timerSeconds = EXAM_QUESTION_TIMER_SECONDS,
  timerScreenKey,
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
      timerSlot={
        <ExamCountdownTimer
          // Keyed on the screen rather than on a question, because every
          // question in this part is answered inside one window.
          screenKey={timerScreenKey ?? questions[0]?.id ?? title}
          durationSeconds={timerSeconds}
          label={timerLabel}
        />
      }
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
