"use client";

import { ExamInstructionRow } from "../ExamInstructionRow";
import { ExamShell } from "../ExamShell";
import { ExamCountdownTimer } from "../timer/ExamCountdownTimer";
import { ListeningVideoQuestionList } from "./ListeningVideoQuestionList";
import {
  examListening,
  examListeningChoice,
  examScreenBody,
} from "@/features/exam-engine/exam-theme";
import { LISTENING_QUESTION_TIMER } from "@/features/exam-engine/listening-timing";
import {
  formatListeningAnsweredCount,
  listeningCopy,
} from "@/features/exam-engine/listening-copy";
import type {
  ListeningVideoAnswerMap,
  ListeningVideoQuestion,
} from "@/features/exam-engine/listening-video-types";

// Multiple-choice question screen for a video discussion Listening part
// (EXAM-11).
//
// Screen type 7 from docs/product/exam-engine-screen-types.md, in its
// radio option form, and the screen the reference layout matters most for
// in this part:
//
// - grey top bar with a live "Time remaining: 00:30" countdown
// - white exam canvas, single column, no split
// - compact instruction row at the top
// - left aligned numbered questions, ruled apart
// - four radio options under each question
// - blue Next in the top bar, Back in the bottom bar
//
// Single column, unlike the Parts 1 to 3 question screen. There is no
// question audio in this part, so there is nothing to put in a second
// column, and a split would leave half the canvas empty. Same reason
// ListeningDropdownQuestionScreen is single column.
//
// A client component, because choosing an option is an event handler. It
// holds no state: the answers are owned by the prototype above it, so
// leaving the screen and coming back shows what was chosen before.
//
// The control is a radio group rather than a select, and EXAM-15F left it
// that way deliberately. Part 6 moved to a select in that ticket because
// its six items are sentence stems and its source instructs it with the
// drop-down wording twice. Part 5 is the opposite case: all eight items in
// the Mock Test 1 source are whole interrogatives ending in a question
// mark, so there is no blank for a select to sit in, and building one
// would mean inventing eight stems the source does not contain. The
// reasoning is in section 7 of
// docs/product/listening-format-audit-and-correction-plan.md and the
// decision is recorded in
// docs/product/listening-format-strict-timing-polish.md.
//
// Next is gated on every question having an answer by default, which is
// what allAnswered carries. The count under the list says how many are
// left, so a learner scrolling an eight question form can see why Next is
// not available without hunting for the empty control.
//
// The full Listening route turns that gate off through requireAllAnswered
// (EXAM-15F): a window that expires has to advance whether or not the form
// is finished, and an official-style test lets a learner leave a question
// blank and take the zero for it. The individual Part 5 route keeps the
// gate, because it is a development route.
//
// The timer is real from EXAM-15D, and it belongs to the screen rather
// than to any one question on it: this part answers all eight questions in
// one window, so the window is keyed to the screen and answering a
// question does not restart it.
//
// What happens at zero is the caller's decision (EXAM-15F). Passing
// onTimeExpire, which the full route does and the part route does not,
// advances the flow; with no handler the reading simply becomes "Time is
// up" and the screen stays put. Either way no answer is cleared, no
// question is disabled and nothing is submitted. See
// docs/product/listening-format-strict-timing-polish.md.

export type ListeningVideoQuestionScreenProps = {
  title: string;
  questions: ListeningVideoQuestion[];
  answers: ListeningVideoAnswerMap;
  onSelectOption: (questionId: string, optionId: string) => void;
  // Whether every question has an answer. Passed in rather than worked
  // out here, so the rule that gates Next lives in one place.
  allAnswered: boolean;
  // Whether Next waits for every question to be answered. False on the
  // full Listening route, where a blank is a legal answer worth zero.
  requireAllAnswered?: boolean;
  // Instruction line above the list. Defaults to the source document's
  // wording for this part when a part's content does not carry its own.
  instructionText?: string;
  // Label in front of the countdown in the top bar.
  timerLabel?: string;
  // How long the answering window runs. Defaults to the per question
  // window, which is wrong for an eight question screen, so every caller
  // passes the Part 5 screen window from listening-timing.ts.
  timerSeconds?: number;
  timerWarningAtSeconds?: number;
  timerUrgentAtSeconds?: number;
  // What the countdown resets on. Defaults to the first question's id,
  // which is stable for as long as this screen is showing. A caller with a
  // flow screen id can pass that instead.
  timerScreenKey?: string;
  // Fired once when the window reaches zero. Only the full Listening route
  // passes one.
  onTimeExpire?: () => void;
  metaText?: string;
  onNext?: () => void;
  onBack?: () => void;
  showBack?: boolean;
};

export function ListeningVideoQuestionScreen({
  title,
  questions,
  answers,
  onSelectOption,
  allAnswered,
  requireAllAnswered = true,
  instructionText = listeningCopy.chooseBestWayInstruction,
  timerLabel = listeningCopy.questionTimerLabel,
  timerSeconds = LISTENING_QUESTION_TIMER.seconds,
  timerWarningAtSeconds,
  timerUrgentAtSeconds,
  timerScreenKey,
  onTimeExpire,
  metaText,
  onNext,
  onBack,
  showBack = true,
}: ListeningVideoQuestionScreenProps) {
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
          warningAtSeconds={timerWarningAtSeconds}
          urgentAtSeconds={timerUrgentAtSeconds}
          label={timerLabel}
          onExpire={onTimeExpire}
        />
      }
      metaText={metaText}
      onNext={onNext}
      nextDisabled={requireAllAnswered && !allAnswered}
      onBack={onBack}
      showBack={showBack}
    >
      <div className={examScreenBody.stack}>
        <ExamInstructionRow text={instructionText} />

        <div className={examListening.columnStack}>
          <ListeningVideoQuestionList
            questions={questions}
            answers={answers}
            onSelectOption={onSelectOption}
          />

          <p className={examListeningChoice.progressNote}>
            {formatListeningAnsweredCount(answeredCount, questions.length)}
            {requireAllAnswered && !allAnswered
              ? ` ${listeningCopy.choiceAnswerAllHint}`
              : null}
          </p>
        </div>
      </div>
    </ExamShell>
  );
}
