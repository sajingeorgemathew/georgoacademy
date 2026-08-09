"use client";

import { useMemo, useState } from "react";
import { ListeningAudioScreen } from "./ListeningAudioScreen";
import { ListeningDropdownQuestionScreen } from "./ListeningDropdownQuestionScreen";
import { ListeningPartCompleteScreen } from "./ListeningPartCompleteScreen";
import { ListeningPartIntroScreen } from "./ListeningPartIntroScreen";
import { ListeningScenarioScreen } from "./ListeningScenarioScreen";
import {
  areAllListeningDropdownQuestionsAnswered,
  buildListeningDropdownFlow,
  countAnsweredListeningDropdownQuestions,
  countListeningDropdownQuestions,
  setListeningDropdownAnswer,
} from "@/features/exam-engine/listening-dropdown-flow";
import {
  formatListeningAnsweredMessage,
  formatListeningScreenPosition,
  listeningCopy,
} from "@/features/exam-engine/listening-copy";
import type {
  ListeningDropdownAnswerMap,
  ListeningDropdownPartContent,
} from "@/features/exam-engine/listening-dropdown-types";

// Listening Part 4 prototype (EXAM-09).
//
// The first dropdown completion part. It is deliberately not merged with
// the Parts 1 to 3 prototypes: those walk one question per screen and
// gate Next on that one answer, and this one shows every question at once
// and gates Next on the whole set. The content shapes differ for the same
// reason. See the header of listening-dropdown-types.ts.
//
// It owns two pieces of state:
//
// - which screen is showing, an index into the flow built by
//   buildListeningDropdownFlow
// - the answers, as { questionId: optionId }
//
// Both live in local component state. Nothing is written to a database
// and a page reload starts the part again. That is deliberate for a
// prototype and is recorded in
// docs/product/listening-part-4-prototype.md.
//
// Part 4 has one news item and five questions, so the flow is five
// screens: part intro, scenario, news audio, the question screen, and the
// completion screen. It closes on the completion screen rather than on an
// answer review, because the Part 4 review and practice score are the
// next ticket. That is the same ending Part 2 shipped with first.
//
// Back is enabled throughout, which the official-style flow would not
// allow, so the sequence can be walked through repeatedly during review.
// Answers survive going back and forward because they are keyed by
// question id rather than by screen position, and because this component
// stays mounted across the whole part.
//
// Next on the question screen is disabled until all five dropdowns have
// an answer. It is not gated on audio finishing anywhere in this ticket.
//
// Every screen title, statement, option and clip URL comes from the
// content object passed in, so this component carries no Mock Test 1
// text. The answer key is not among them: the route strips it before the
// content reaches this component, and nothing here marks an answer.

export type ListeningPartFourPrototypeProps = {
  content: ListeningDropdownPartContent;
};

export function ListeningPartFourPrototype({
  content,
}: ListeningPartFourPrototypeProps) {
  const screens = useMemo(
    () => buildListeningDropdownFlow(content),
    [content],
  );
  const questionCount = useMemo(
    () => countListeningDropdownQuestions(content),
    [content],
  );

  const [screenIndex, setScreenIndex] = useState(0);
  const [answers, setAnswers] = useState<ListeningDropdownAnswerMap>({});

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
      setListeningDropdownAnswer(current, questionId, optionId),
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
        // No sectionCount. Part 4 is one news item, not a part built from
        // conversation sections, so the row is left out rather than
        // reading "Sections 1".
        formatLabel="News audio and dropdown questions"
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

  if (screen.kind === "media") {
    return (
      <ListeningAudioScreen
        title={content.title}
        audioSrc={content.media.url}
        audioTitle={content.media.title}
        durationLabel={content.media.durationLabel}
        instructionText={
          content.mediaInstruction ?? listeningCopy.newsItemInstruction
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
      <ListeningDropdownQuestionScreen
        title={content.title}
        questions={content.questions}
        answers={answers}
        onSelectOption={selectAnswer}
        allAnswered={areAllListeningDropdownQuestionsAnswered(content, answers)}
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
  // It states the part is finished, says how many questions were
  // answered, and names what is coming. The pending review is a plain
  // sentence rather than a disabled button, which is the rule
  // ListeningPartCompleteScreen sets out: a greyed out control says
  // "press this in a moment", and there is nothing behind it. The ticket
  // allows either.
  return (
    <ListeningPartCompleteScreen
      title={content.title}
      heading={listeningCopy.part4CompleteHeading}
      message={formatListeningAnsweredMessage(
        countAnsweredListeningDropdownQuestions(content, answers),
        questionCount,
      )}
      onRestart={restart}
      restartLabel={listeningCopy.part4RestartLabel}
      metaText={metaText}
      onBack={goBack}
      showBack={showBack}
    />
  );
}
