"use client";

import { useMemo, useState } from "react";
import { ListeningAudioScreen } from "./ListeningAudioScreen";
import { ListeningPartCompleteScreen } from "./ListeningPartCompleteScreen";
import { ListeningPartIntroScreen } from "./ListeningPartIntroScreen";
import { ListeningQuestionScreen } from "./ListeningQuestionScreen";
import { ListeningScenarioScreen } from "./ListeningScenarioScreen";
import {
  buildListeningFlow,
  countAnsweredListeningQuestions,
  countListeningQuestions,
  getListeningQuestion,
  setListeningAnswer,
} from "@/features/exam-engine/listening-flow";
import {
  formatListeningAnsweredMessage,
  formatListeningScreenPosition,
  listeningCopy,
} from "@/features/exam-engine/listening-copy";
import type {
  ListeningAnswerMap,
  ListeningPartContent,
} from "@/features/exam-engine/listening-types";

// Listening Part 2 prototype (EXAM-05).
//
// Same shape as ListeningPartOnePrototype, and deliberately not merged
// with it. The two parts end differently: Part 1 closes on the answer
// review, the practice score and the end of part screen, while Part 2 has
// none of those yet and closes on a single completion screen. Folding
// both into one component would mean a component that renders screens its
// caller has to prove it will never reach.
//
// It owns two pieces of state and nothing else:
//
// - which screen is showing, an index into the flow built by
//   buildListeningFlow with the "complete" ending
// - the answers, as { questionId: optionId }, which is the shape EXAM-06
//   will read for the answer review and the practice score
//
// Both live in local component state. Nothing is written to a database
// and a page reload starts the part again. That is deliberate for a
// prototype and is recorded in
// docs/product/listening-part-2-prototype.md.
//
// Part 2 has one conversation section, so the flow is nine screens: part
// intro, scenario, conversation, five questions, completion. No section
// break screen appears, because a break only sits before a section that
// is not the first.
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
// object passed in, so this component carries no Mock Test 1 text. The
// answer key is not read here at all, and the route strips it from the
// content before it reaches this component.

export type ListeningPartTwoPrototypeProps = {
  content: ListeningPartContent;
};

export function ListeningPartTwoPrototype({
  content,
}: ListeningPartTwoPrototypeProps) {
  const screens = useMemo(
    () => buildListeningFlow(content, { ending: "complete" }),
    [content],
  );
  const questionCount = useMemo(
    () => countListeningQuestions(content),
    [content],
  );

  const [screenIndex, setScreenIndex] = useState(0);
  const [answers, setAnswers] = useState<ListeningAnswerMap>({});

  // Derived, never stored, so the completion count cannot disagree with
  // the answers it came from.
  const answeredCount = useMemo(
    () => countAnsweredListeningQuestions(content, answers),
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

  if (screen.kind === "conversation") {
    const section = content.sections[screen.sectionIndex];

    if (!section) {
      return null;
    }

    return (
      <ListeningAudioScreen
        title={content.title}
        audioSrc={section.conversationAudioUrl}
        // One conversation clip in this part, so the player title carries
        // no section number.
        audioTitle={listeningCopy.conversationPlayerTitle}
        durationLabel={section.durationLabel}
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

  // Completion screen. The last screen in the flow, so there is no Next.
  //
  // Every other screen kind in the union belongs to the Part 1 ending,
  // which this flow never builds, so they land here rather than in
  // branches that could not be reached.
  return (
    <ListeningPartCompleteScreen
      title={content.title}
      heading={listeningCopy.part2CompleteHeading}
      message={formatListeningAnsweredMessage(answeredCount, questionCount)}
      onRestart={restart}
      restartLabel={listeningCopy.part2RestartLabel}
      metaText={metaText}
      onBack={goBack}
      showBack={showBack}
    />
  );
}
