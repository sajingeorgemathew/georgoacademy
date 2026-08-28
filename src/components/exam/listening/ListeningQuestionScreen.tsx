"use client";

import { ExamInstructionRow } from "../ExamInstructionRow";
import { ExamProgressIndicator } from "../ExamProgressIndicator";
import { ExamShell } from "../ExamShell";
import { ExamTwoColumnLayout } from "../ExamTwoColumnLayout";
import { ExamCountdownTimer } from "../timer/ExamCountdownTimer";
import { ListeningAudioPlayer } from "./ListeningAudioPlayer";
import { cx } from "@/features/design/design-tokens";
import {
  examAudio,
  examListening,
  examText,
} from "@/features/exam-engine/exam-theme";
import { LISTENING_QUESTION_TIMER } from "@/features/exam-engine/listening-timing";
import { listeningCopy } from "@/features/exam-engine/listening-copy";
import type {
  ListeningQuestion,
  ListeningQuestionAudio,
} from "@/features/exam-engine/listening-types";

// Question screen for a Listening part (EXAM-03).
//
// Screen type 6 from docs/product/exam-engine-screen-types.md, and the
// screen the reference layout matters most for:
//
// - grey top bar with a live "Time remaining: 00:30" countdown
// - left column holding the question audio and its instruction
// - right column on the light blue answer wash
// - question number at the top of the answer panel
// - compact radio options with a rule between them
// - blue Next in the top bar, Back in the bottom bar
//
// The split is the EXAM-01 ExamTwoColumnLayout, whose answer side already
// carries the accent wash, so no new layout is introduced here.
//
// A client component, because selecting an option is an event handler.
// It holds no state itself: the selection is owned by the prototype above
// it, so moving back to a question shows the answer that was chosen
// before.
//
// Next is gated on an option being selected by default. The full Listening
// route turns that gate off through requireAnswer (EXAM-15F): a window
// that expires has to advance whether or not the question was answered,
// and the official-style test lets a learner leave a question blank and
// take the zero for it. The individual part routes keep the gate, because
// they are development routes.
//
// The question stem is spoken, not printed, in this part. prompt is
// rendered when a part has one, which is what Parts 4 to 6 will need.
//
// What plays in the left column is not decided here. The caller passes the
// result of resolveListeningQuestionAudio, which is the one place the rule
// lives, and this screen draws one of its two states (EXAM-15C):
//
// - "question", the normal case and the only one any shipped content is
//   in: the question clip, captioned as question audio
// - "missing", no clip at all: a notice in the player's place, so a screen
//   with nothing to play says so instead of showing an empty player
//
// The timer is real from EXAM-15D. The bar used to print a fixed
// "Time remaining: 30 seconds", which looked like a clock and was not one.
// It now runs a countdown keyed to the question, so moving to the next
// question starts a fresh window and choosing an option does not. The
// window is 30 seconds, which is the one Listening duration published
// directly, and it comes from listening-timing.ts with the rest of them.
//
// What happens at zero is the caller's decision (EXAM-15F). Passing
// onTimeExpire, which the full route does and the part routes do not,
// advances to the next question or the next transition; with no handler
// the reading simply becomes "Time is up" and the screen stays put. Either
// way the selection stays selected, no option is disabled and nothing is
// submitted. See docs/product/listening-format-strict-timing-polish.md.
//
// The question clip can be asked to start on its own (EXAM-15F). The full
// route passes autoPlayAudio, because the official test speaks the
// question as the screen opens rather than waiting to be asked. It is an
// attempt, not a guarantee: a browser that refuses autoplay leaves the
// controls exactly where they were and the player prints a short line
// saying to press play. The part routes pass nothing and behave as they
// always did.
//
// This screen used to draw a third state, a labelled conversation replay,
// for Mock Test 1 Listening Part 3 Question 1 while that question had no
// recording of its own. The corrected source document supplied it, so the
// replay branch and its copy are gone and Question 1 renders like any
// other question.

export type ListeningQuestionScreenProps = {
  title: string;
  question: ListeningQuestion;
  // What to play, from resolveListeningQuestionAudio. Left optional so a
  // caller that has only the question still renders the right thing: the
  // question clip when it has one, and the missing notice when it does
  // not, which is what this screen did before EXAM-15C.
  audio?: ListeningQuestionAudio;
  // Position in the part, for example 3 of 8.
  questionNumber: number;
  questionCount: number;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  // Whether Next waits for an option to be selected. False on the full
  // Listening route, where a blank is a legal answer worth zero.
  requireAnswer?: boolean;
  // Whether the question clip attempts to start on its own.
  autoPlayAudio?: boolean;
  // Label in front of the countdown in the top bar.
  timerLabel?: string;
  // How long the answering window runs. Defaults to the published 30
  // second per question window.
  timerSeconds?: number;
  timerWarningAtSeconds?: number;
  timerUrgentAtSeconds?: number;
  // What the countdown resets on. Defaults to the question's own id, which
  // is unique across the whole Listening section, so every question screen
  // gets its own window without a caller having to build a key. A caller
  // with a flow screen id can pass that instead.
  timerScreenKey?: string;
  // Fired once when the window reaches zero. Only the full Listening route
  // passes one.
  onTimeExpire?: () => void;
  metaText?: string;
  onNext?: () => void;
  onBack?: () => void;
  showBack?: boolean;
};

export function ListeningQuestionScreen({
  title,
  question,
  audio,
  questionNumber,
  questionCount,
  selectedOptionId,
  onSelectOption,
  requireAnswer = true,
  autoPlayAudio = false,
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
}: ListeningQuestionScreenProps) {
  const hasAnswer = Boolean(selectedOptionId);

  // One radio group per question, so moving between questions never
  // leaves two groups sharing a name.
  const groupName = `${question.id}-options`;

  // Falls back to the question's own clip so a caller that passes nothing
  // gets the pre EXAM-15C behaviour rather than an empty column.
  const resolvedAudio: ListeningQuestionAudio =
    audio ??
    (question.audioUrl
      ? { kind: "question", url: question.audioUrl }
      : { kind: "missing" });

  return (
    <ExamShell
      title={title}
      timerSlot={
        <ExamCountdownTimer
          // Keyed on the question, so the window restarts when the
          // learner moves to another one and survives every re-render
          // caused by choosing an option.
          screenKey={timerScreenKey ?? question.id}
          durationSeconds={timerSeconds}
          warningAtSeconds={timerWarningAtSeconds}
          urgentAtSeconds={timerUrgentAtSeconds}
          label={timerLabel}
          onExpire={onTimeExpire}
        />
      }
      metaText={metaText}
      onNext={onNext}
      nextDisabled={requireAnswer && !hasAnswer}
      onBack={onBack}
      showBack={showBack}
    >
      <ExamTwoColumnLayout
        leftLabel={listeningCopy.audioPanelLabel}
        rightLabel={listeningCopy.answerPanelLabel}
        left={
          <div className={examListening.columnStack}>
            <ExamInstructionRow text={listeningCopy.questionInstruction} />

            {resolvedAudio.kind === "missing" ? (
              // No clip for this question in the source material. The
              // notice says so plainly rather than playing something else.
              // No content in the project reaches this: it is the guard for
              // a future part whose source is short a recording.
              <div className={examAudio.wrap}>
                <div className={examAudio.fallback} role="status">
                  <p className={examAudio.fallbackTitle}>
                    {listeningCopy.questionAudioMissingHeading}
                  </p>
                  <p className={examAudio.fallbackText}>
                    {listeningCopy.questionAudioMissingText}
                  </p>
                </div>
              </div>
            ) : (
              <ListeningAudioPlayer
                src={resolvedAudio.url}
                title={`${listeningCopy.questionPlayerTitle} ${questionNumber}`}
                autoPlay={autoPlayAudio}
              />
            )}

            {question.prompt ? (
              <p className={examText.body}>{question.prompt}</p>
            ) : null}
          </div>
        }
        right={
          <div className={examListening.columnStack}>
            <div className={examListening.answerHeader}>
              <ExamProgressIndicator
                current={questionNumber}
                total={questionCount}
                showBar={false}
              />
              <p className={examText.body}>
                {listeningCopy.chooseAnswerInstruction}
              </p>
            </div>

            <fieldset className="min-w-0">
              <legend className="sr-only">
                {listeningCopy.chooseAnswerInstruction}
              </legend>

              <div className={examListening.optionList}>
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
                        onChange={() => onSelectOption(option.id)}
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

            {requireAnswer && !hasAnswer ? (
              <p className={examText.muted}>{listeningCopy.selectAnswerHint}</p>
            ) : null}
          </div>
        }
      />
    </ExamShell>
  );
}
