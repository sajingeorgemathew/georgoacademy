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

// Listening Part 3 prototype (EXAM-07).
//
// Same shape as ListeningPartOnePrototype and ListeningPartTwoPrototype,
// and still deliberately not merged with either. Part 1 and Part 2 both
// end on an answer review, a practice score and an end of part screen.
// Part 3 has neither yet, so it closes on the single completion screen,
// which is where Part 2 stopped at the end of EXAM-05.
//
// It owns two pieces of state:
//
// - which screen is showing, an index into the flow built by
//   buildListeningFlow
// - the answers, as { questionId: optionId }
//
// Both live in local component state. Nothing is written to a database,
// no answer is checked, and a page reload starts the part again. That is
// deliberate for a prototype and is recorded in
// docs/product/listening-part-3-prototype.md.
//
// Part 3 has one conversation section and six questions, so the flow is
// ten screens: part intro, scenario, conversation, six questions, part
// complete. No section break screen appears, because a break only sits
// before a section that is not the first.
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
// answer key is not among them: the route strips it before the content
// reaches this component, and nothing here compares an answer to
// anything.

export type ListeningPartThreePrototypeProps = {
  content: ListeningPartContent;
};

export function ListeningPartThreePrototype({
  content,
}: ListeningPartThreePrototypeProps) {
  // "complete" ending, because Part 3 review and scoring are the next
  // ticket. Swap to the default once they exist.
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
  // The answered count is worked out here rather than held in state, so
  // it cannot drift from the answer map it describes.
  return (
    <ListeningPartCompleteScreen
      title={content.title}
      heading={listeningCopy.part3CompleteHeading}
      message={formatListeningAnsweredMessage(
        countAnsweredListeningQuestions(content, answers),
        questionCount,
      )}
      onRestart={restart}
      restartLabel={listeningCopy.part3RestartLabel}
      metaText={metaText}
      onBack={goBack}
      showBack={showBack}
    />
  );
}
