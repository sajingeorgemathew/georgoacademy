"use client";

import { ExamInstructionRow } from "../ExamInstructionRow";
import { ExamProgressIndicator } from "../ExamProgressIndicator";
import { ExamShell } from "../ExamShell";
import { ExamTwoColumnLayout } from "../ExamTwoColumnLayout";
import { ListeningAudioPlayer } from "./ListeningAudioPlayer";
import { cx } from "@/features/design/design-tokens";
import {
  examAudio,
  examListening,
  examText,
} from "@/features/exam-engine/exam-theme";
import { listeningCopy } from "@/features/exam-engine/listening-copy";
import type { ListeningQuestion } from "@/features/exam-engine/listening-types";

// Question screen for a Listening part (EXAM-03).
//
// Screen type 6 from docs/product/exam-engine-screen-types.md, and the
// screen the reference layout matters most for:
//
// - grey top bar with the static "Time remaining: 30 seconds" reading
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
// A question with no clip at all shows a notice in the player's place
// (EXAM-07). That is not a normal state: it exists because Mock Test 1
// Listening Part 3 Question 1 has no recording in the source document.

export type ListeningQuestionScreenProps = {
  title: string;
  question: ListeningQuestion;
  // Position in the part, for example 3 of 8.
  questionNumber: number;
  questionCount: number;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  // Static reading in the top bar. Nothing counts down in this ticket.
  timerLabel?: string;
  timerValue?: string;
  metaText?: string;
  onNext?: () => void;
  onBack?: () => void;
  showBack?: boolean;
};

export function ListeningQuestionScreen({
  title,
  question,
  questionNumber,
  questionCount,
  selectedOptionId,
  onSelectOption,
  timerLabel = listeningCopy.questionTimerLabel,
  timerValue = listeningCopy.questionTimerValue,
  metaText,
  onNext,
  onBack,
  showBack = true,
}: ListeningQuestionScreenProps) {
  const hasAnswer = Boolean(selectedOptionId);

  // One radio group per question, so moving between questions never
  // leaves two groups sharing a name.
  const groupName = `${question.id}-options`;

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

            {question.audioUrl ? (
              <ListeningAudioPlayer
                src={question.audioUrl}
                title={`${listeningCopy.questionPlayerTitle} ${questionNumber}`}
              />
            ) : (
              // No clip for this question in the source material. The
              // notice says so plainly instead of playing something else,
              // because the alternative on hand is the conversation
              // recording, which is not the question. See the missing
              // clip note in listening-part-3.ts.
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
