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
import { EXAM_QUESTION_TIMER_SECONDS } from "@/features/exam-engine/exam-timer-utils";
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
// before. Next is disabled until an option is selected.
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
// question starts a fresh window and choosing an option does not. Reaching
// zero changes the reading to "Time is up" and nothing else: the screen
// stays put, the selection stays selected, and Next behaves exactly as it
// did. Auto-submit and auto-advance are later tickets. See
// docs/product/exam-timer-foundation.md.
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
  // Label in front of the countdown in the top bar.
  timerLabel?: string;
  // How long the answering window runs. Defaults to the standard question
  // window, which is the 30 seconds this screen has always shown.
  timerSeconds?: number;
  // What the countdown resets on. Defaults to the question's own id, which
  // is unique across the whole Listening section, so every question screen
  // gets its own window without a caller having to build a key. A caller
  // with a flow screen id can pass that instead.
  timerScreenKey?: string;
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
  timerLabel = listeningCopy.questionTimerLabel,
  timerSeconds = EXAM_QUESTION_TIMER_SECONDS,
  timerScreenKey,
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
          label={timerLabel}
        />
      }
      metaText={metaText}
      onNext={onNext}
      nextDisabled={!hasAnswer}
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

            {hasAnswer ? null : (
              <p className={examText.muted}>{listeningCopy.selectAnswerHint}</p>
            )}
          </div>
        }
      />
    </ExamShell>
  );
}
