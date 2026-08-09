"use client";

import { useMemo, useState } from "react";
import { ListeningPartCompleteScreen } from "./ListeningPartCompleteScreen";
import { ListeningPartIntroScreen } from "./ListeningPartIntroScreen";
import { ListeningScenarioScreen } from "./ListeningScenarioScreen";
import { ListeningVideoQuestionScreen } from "./ListeningVideoQuestionScreen";
import { ListeningVideoScreen } from "./ListeningVideoScreen";
import {
  areAllListeningVideoQuestionsAnswered,
  buildListeningVideoFlow,
  countAnsweredListeningVideoQuestions,
  countListeningVideoQuestions,
  setListeningVideoAnswer,
} from "@/features/exam-engine/listening-video-flow";
import {
  formatListeningAnsweredMessage,
  formatListeningScreenPosition,
  listeningCopy,
} from "@/features/exam-engine/listening-copy";
import type {
  ListeningVideoAnswerMap,
  ListeningVideoPartContent,
} from "@/features/exam-engine/listening-video-types";

// Listening Part 5 prototype (EXAM-11).
//
// The only Listening part built around a video, and the only one that
// prints whole questions answered from radio options. It is deliberately
// not merged with the Part 4 prototype: that part plays a clip and
// completes statements from dropdowns, and this one plays a video and
// answers questions from radio groups. The content shapes differ for the
// same reason. See the header of listening-video-types.ts.
//
// It owns two pieces of state:
//
// - which screen is showing, an index into the flow built by
//   buildListeningVideoFlow
// - the answers, as { questionId: optionId }
//
// Both live in local component state. Nothing is written to a database
// and a page reload starts the part again. That is deliberate for a
// prototype and is recorded in
// docs/product/listening-part-5-prototype.md.
//
// There is no marking state machine here, unlike Parts 2, 3 and 4. Those
// parts have an answer review and a practice score, which are fetched
// from a server action because their answer keys stay on the server. Part
// 5 has neither yet, so this component makes no request of any kind and
// takes no action prop. The part closes on the completion screen instead,
// the way Part 2 did before its review was built.
//
// Part 5 has one video and eight questions, so the flow is five screens:
// part intro, scenario, discussion video, the question screen, and the
// completion screen.
//
// Back is enabled throughout, which the official-style flow would not
// allow, so the sequence can be walked through repeatedly during review.
// Answers survive going back and forward because they are keyed by
// question id rather than by screen position, and because this component
// stays mounted across the whole part.
//
// Next on the question screen is disabled until all eight questions have
// an answer. It is not gated on the video finishing anywhere yet.
//
// Every screen title, question, option and media URL comes from the
// content object passed in, so this component carries no Mock Test 1 text
// of its own. The answer key is not among them: the route strips it
// before the content reaches this component, and nothing here ever sees a
// correct option.

export type ListeningPartFivePrototypeProps = {
  content: ListeningVideoPartContent;
};

export function ListeningPartFivePrototype({
  content,
}: ListeningPartFivePrototypeProps) {
  const screens = useMemo(() => buildListeningVideoFlow(content), [content]);
  const questionCount = useMemo(
    () => countListeningVideoQuestions(content),
    [content],
  );

  const [screenIndex, setScreenIndex] = useState(0);
  const [answers, setAnswers] = useState<ListeningVideoAnswerMap>({});

  const screen = screens[screenIndex];
  const totalScreens = screens.length;

  const goNext = () => {
    setScreenIndex((current) => Math.min(current + 1, totalScreens - 1));
  };

  const goBack = () => {
    setScreenIndex((current) => Math.max(current - 1, 0));
  };

  const selectAnswer = (questionId: string, optionId: string) => {
    setAnswers((current) =>
      setListeningVideoAnswer(current, questionId, optionId),
    );
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

  if (!screen) {
    return null;
  }

  if (screen.kind === "part-intro") {
    return (
      <ListeningPartIntroScreen
        content={content}
        questionCount={questionCount}
        // No sectionCount. Part 5 is one video, not a part built from
        // conversation sections, so the row is left out rather than
        // reading "Sections 1".
        formatLabel="Discussion video and multiple-choice questions"
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

  if (screen.kind === "video") {
    return (
      <ListeningVideoScreen
        title={content.title}
        videoSrc={content.media.url}
        videoTitle={content.media.title}
        durationLabel={content.media.durationLabel}
        posterSrc={content.media.posterUrl}
        instructionText={
          content.mediaInstruction ?? listeningCopy.discussionInstruction
        }
        metaText={metaText}
        onNext={goNext}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  if (screen.kind === "questions") {
    return (
      <ListeningVideoQuestionScreen
        title={content.title}
        questions={content.questions}
        answers={answers}
        onSelectOption={selectAnswer}
        allAnswered={areAllListeningVideoQuestionsAnswered(content, answers)}
        instructionText={content.questionInstruction}
        metaText={metaText}
        onNext={goNext}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  // Completion screen. The last screen in the flow, so there is no Next.
  //
  // The pending review line is the shared sentence rather than a greyed
  // out control, following the rule ListeningPartCompleteScreen sets out:
  // a disabled button says "press this in a moment", and the Part 5
  // answer review does not exist yet.
  return (
    <ListeningPartCompleteScreen
      title={content.title}
      heading={listeningCopy.part5CompleteHeading}
      message={formatListeningAnsweredMessage(
        countAnsweredListeningVideoQuestions(content, answers),
        questionCount,
      )}
      onRestart={restart}
      restartLabel={listeningCopy.part5RestartLabel}
      metaText={metaText}
      onBack={goBack}
      showBack={showBack}
    />
  );
}
