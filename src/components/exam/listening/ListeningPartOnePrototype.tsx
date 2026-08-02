"use client";

import { useMemo, useState } from "react";
import { ListeningAnswerReviewScreen } from "./ListeningAnswerReviewScreen";
import { ListeningAudioScreen } from "./ListeningAudioScreen";
import { ListeningPartEndScreen } from "./ListeningPartEndScreen";
import { ListeningPartIntroScreen } from "./ListeningPartIntroScreen";
import { ListeningQuestionScreen } from "./ListeningQuestionScreen";
import { ListeningScenarioScreen } from "./ListeningScenarioScreen";
import { ListeningScoreScreen } from "./ListeningScoreScreen";
import { ListeningSectionBreakScreen } from "./ListeningSectionBreakScreen";
import {
  buildListeningFlow,
  countListeningQuestions,
  getListeningQuestion,
  setListeningAnswer,
} from "@/features/exam-engine/listening-flow";
import {
  buildListeningReviewRows,
  buildListeningScoreSummary,
} from "@/features/exam-engine/listening-score";
import {
  formatListeningScreenPosition,
  formatListeningSectionBreak,
  formatListeningSectionLabel,
  listeningCopy,
} from "@/features/exam-engine/listening-copy";
import type {
  ListeningAnswerMap,
  ListeningPartContent,
} from "@/features/exam-engine/listening-types";

// Listening Part 1 prototype (EXAM-03, closing screens added by EXAM-04).
//
// The only stateful piece of the Listening flow. It owns two things:
//
// - which screen is showing, an index into the flow built by
//   buildListeningFlow
// - the answers, as { questionId: optionId }, which is the shape the
//   answer review and the practice score read
//
// Both live in local component state. Nothing is written to a database,
// and a page reload starts the part again. That is deliberate for a
// prototype and is recorded in
// docs/product/listening-part-1-prototype.md and
// docs/product/listening-part-1-review-score.md.
//
// EXAM-04 added the last three screens: answer review, practice score,
// and end of part. They read the same local answer map through the pure
// helpers in listening-score.ts, so this component still holds no derived
// state and nothing is stored anywhere. The review rows and the summary
// are recomputed from the answers whenever they change, which is cheap at
// eight questions and removes any chance of a stale score.
//
// Back is enabled throughout, which the official-style flow would not
// allow, so the sequence can be walked through repeatedly during review.
// Answers survive going back and forward because they are keyed by
// question id rather than by screen position.
//
// Next is disabled on a question screen until an option is selected. It
// is not gated on audio finishing anywhere in this ticket.
//
// Every screen title, bullet, option and clip URL comes from the content
// object passed in, so this component carries no Mock Test 1 text.

export type ListeningPartOnePrototypeProps = {
  content: ListeningPartContent;
};

export function ListeningPartOnePrototype({
  content,
}: ListeningPartOnePrototypeProps) {
  const screens = useMemo(() => buildListeningFlow(content), [content]);
  const questionCount = useMemo(
    () => countListeningQuestions(content),
    [content],
  );

  const [screenIndex, setScreenIndex] = useState(0);
  const [answers, setAnswers] = useState<ListeningAnswerMap>({});

  // Review rows and the practice summary are derived, never stored, so
  // they cannot disagree with the answers they came from.
  const reviewRows = useMemo(
    () => buildListeningReviewRows(content, answers),
    [content, answers],
  );
  const scoreSummary = useMemo(
    () => buildListeningScoreSummary(content, answers),
    [content, answers],
  );

  const screen = screens[screenIndex];
  const totalScreens = screens.length;

  const goNext = () => {
    setScreenIndex((current) => Math.min(current + 1, totalScreens - 1));
  };

  const goBack = () => {
    setScreenIndex((current) => Math.max(current - 1, 0));
  };

  const selectAnswer = (questionId: string, optionId: string) => {
    setAnswers((current) => setListeningAnswer(current, questionId, optionId));
  };

  // Start the part again from the first screen with an empty answer map.
  // Nothing was saved, so there is nothing else to clear.
  const restart = () => {
    setScreenIndex(0);
    setAnswers({});
  };

  // Shared chrome props. Back is hidden on the first screen only, because
  // there is nothing behind it inside the part.
  const metaText = formatListeningScreenPosition(screenIndex + 1, totalScreens);
  const showBack = screenIndex > 0;
  const sectionCount = content.sections.length;

  if (!screen) {
    return null;
  }

  if (screen.kind === "part-intro") {
    return (
      <ListeningPartIntroScreen
        content={content}
        questionCount={questionCount}
        metaText={metaText}
        onNext={goNext}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  if (screen.kind === "scenario") {
    return (
      <ListeningScenarioScreen
        title={content.title}
        scenario={content.scenario}
        metaText={metaText}
        onNext={goNext}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  if (screen.kind === "section-break") {
    return (
      <ListeningSectionBreakScreen
        title={content.title}
        message={formatListeningSectionBreak(screen.sectionIndex)}
        sectionLabel={formatListeningSectionLabel(
          screen.sectionIndex,
          sectionCount,
        )}
        metaText={metaText}
        onNext={goNext}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  if (screen.kind === "conversation") {
    const section = content.sections[screen.sectionIndex];

    if (!section) {
      return null;
    }

    return (
      <ListeningAudioScreen
        title={content.title}
        audioSrc={section.conversationAudioUrl}
        audioTitle={`${listeningCopy.conversationPlayerTitle} ${
          screen.sectionIndex + 1
        }`}
        durationLabel={section.durationLabel}
        sectionLabel={formatListeningSectionLabel(
          screen.sectionIndex,
          sectionCount,
        )}
        metaText={metaText}
        onNext={goNext}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  if (screen.kind === "question") {
    const question = getListeningQuestion(content, screen);

    if (!question) {
      return null;
    }

    return (
      <ListeningQuestionScreen
        title={content.title}
        question={question}
        questionNumber={screen.questionNumber}
        questionCount={questionCount}
        selectedOptionId={answers[question.id]}
        onSelectOption={(optionId) => selectAnswer(question.id, optionId)}
        metaText={metaText}
        onNext={goNext}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  if (screen.kind === "answer-review") {
    return (
      <ListeningAnswerReviewScreen
        title={content.title}
        rows={reviewRows}
        explanationImageUrl={content.answerExplanationImageUrl}
        explanationImageAlt={content.answerExplanationImageAlt}
        metaText={metaText}
        onNext={goNext}
        // Back lands on the last question, which is the prototype
        // affordance the ticket asks for.
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  if (screen.kind === "score") {
    return (
      <ListeningScoreScreen
        title={content.title}
        summary={scoreSummary}
        onEndPart={goNext}
        onReviewAnswers={goBack}
        metaText={metaText}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  // End of part screen. The last screen in the flow, so there is no Next.
  return (
    <ListeningPartEndScreen
      title={content.title}
      onRestart={restart}
      metaText={metaText}
      onBack={goBack}
      showBack={showBack}
    />
  );
}
