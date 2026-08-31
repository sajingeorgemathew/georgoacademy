"use client";

import { useMemo, useState } from "react";
import { ReadingPartCompleteScreen } from "./ReadingPartCompleteScreen";
import { ReadingPartThreeInformationScreen } from "./ReadingPartThreeInformationScreen";
import { ReadingPartThreeIntroScreen } from "./ReadingPartThreeIntroScreen";
import {
  formatReadingCompletionMessage,
  formatReadingScreenPosition,
  readingCopy,
} from "@/features/exam-engine/reading-copy";
import {
  buildReadingFlow,
  countAnsweredReadingQuestions,
  countReadingQuestions,
  setReadingAnswer,
} from "@/features/exam-engine/reading-flow";
import type {
  ReadingAnswerMap,
  ReadingPartContent,
} from "@/features/exam-engine/reading-types";

// Reading Part 3 prototype (EXAM-20).
//
// The third Reading part built, and the first one answered by naming a
// paragraph rather than by completing a sentence. It follows the shape
// ReadingPartOnePrototype set and ReadingPartTwoPrototype followed,
// stopping where EXAM-18 stopped rather than where EXAM-19 did: this part
// answers, and it does not mark.
//
// So it owns two pieces of state where the Part 2 prototype owns three:
//
// - which screen is showing, an index into the flow built by
//   buildReadingFlow
// - the answers, as { questionId: optionId }
//
// There is no marking state, because there is no marking. Both pieces
// live in local component state. Nothing is written to a database, to
// localStorage or to a cookie, and a page reload starts the part again.
// That is deliberate for a prototype and is recorded in
// docs/product/reading-part-3-prototype.md.
//
// The answer key never arrives in this component. The route strips it on
// the server before the content crosses the boundary, so what is held
// here is content with no correct answers in it, and nothing on any of
// these screens could show one.
//
// The flow is three screens: the part intro, the information split
// holding all 9 statements, and the completion screen. That is
// buildReadingFlow's "complete" ending, together with the "information"
// working screen. Both are asked for by name below, because a Part 3 that
// silently took the default ending would reach a score screen this ticket
// does not build.
//
// Back is enabled throughout, which the official-style flow would not
// allow, so the sequence can be walked through repeatedly during review.
// Answers survive going back and forward because they are keyed by
// question id rather than by screen position, and because this component
// stays mounted across the whole part. Back from the completion screen
// lands on the split screen with all 9 selections still in place.
//
// Nothing gates Next on the split screen. A learner can finish the part
// with any number of statements left blank, which is the EXAM-17 rule
// this part inherits: a blank travels as a missing key in the answer map,
// the completion screen counts it as unanswered, and no screen here
// blocks on it.
//
// The timer does not gate Next either and does not move it: the countdown
// runs, reaches "Time is up", and stops, with every answer still
// selected. Nothing auto-submits, which is what the ticket asks for at
// this stage.
//
// Every screen title, statement, option and instruction line comes from
// the content object passed in, so this component carries no Mock Test 1
// text of its own.
//
// House style: normal hyphens only, no long hyphens or em dashes.

export type ReadingPartThreePrototypeProps = {
  content: ReadingPartContent;
  // Where Back to dashboard goes from the completion screen.
  dashboardHref?: string;
};

export function ReadingPartThreePrototype({
  content,
  dashboardHref,
}: ReadingPartThreePrototypeProps) {
  // The information working screen, and the EXAM-16 ending: intro,
  // questions, completion. No score and no review are built for this part
  // yet, so the ending is asked for by name rather than defaulted into.
  const screens = useMemo(
    () =>
      buildReadingFlow(content, {
        taskScreen: "information",
        ending: "complete",
      }),
    [content],
  );
  const questionCount = useMemo(
    () => countReadingQuestions(content),
    [content],
  );

  const [screenIndex, setScreenIndex] = useState(0);
  const [answers, setAnswers] = useState<ReadingAnswerMap>({});

  const screen = screens[screenIndex];
  const totalScreens = screens.length;

  const goNext = () => {
    setScreenIndex((current) => Math.min(current + 1, totalScreens - 1));
  };

  const goBack = () => {
    setScreenIndex((current) => Math.max(current - 1, 0));
  };

  const selectAnswer = (questionId: string, optionId: string) => {
    setAnswers((current) => setReadingAnswer(current, questionId, optionId));
  };

  // Start the part again from the first screen with an empty answer map.
  // Nothing was saved, so there is nothing else to clear.
  const restart = () => {
    setScreenIndex(0);
    setAnswers({});
  };

  // Shared chrome props. Back is hidden on the first screen only, because
  // there is nothing behind it inside the part.
  const metaText = formatReadingScreenPosition(screenIndex + 1, totalScreens);
  const showBack = screenIndex > 0;

  if (!screen) {
    return null;
  }

  if (screen.kind === "part-intro") {
    return (
      <ReadingPartThreeIntroScreen
        content={content}
        questionCount={questionCount}
        metaText={metaText}
        onNext={goNext}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  if (screen.kind === "information") {
    return (
      <ReadingPartThreeInformationScreen
        content={content}
        answers={answers}
        onSelectOption={selectAnswer}
        // The flow screen id, so the part window belongs to this screen
        // and is not restarted by any of the 9 selections made on it.
        timerScreenKey={screen.id}
        // No onTimeExpire. Nothing auto-submits and nothing advances in
        // this prototype, which is what the ticket asks for: the reading
        // reaches "Time is up", the answers stay put, and the learner
        // finishes the part by hand.
        metaText={metaText}
        onNext={goNext}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  // Completion screen, the last screen in this flow, so there is no Next.
  //
  // The score and answer-review kinds are unreachable here: this flow is
  // built with the "complete" ending and never contains them. There is no
  // branch for them rather than a branch that renders a placeholder,
  // because a placeholder would be a screen claiming a result that does
  // not exist.
  return (
    <ReadingPartCompleteScreen
      title={content.title}
      heading={readingCopy.partThreeCompleteHeading}
      message={formatReadingCompletionMessage(
        countAnsweredReadingQuestions(content, answers),
        questionCount,
      )}
      restartLabel={readingCopy.partThreeRestartLabel}
      dashboardHref={dashboardHref}
      onRestart={restart}
      metaText={metaText}
      onBack={goBack}
      showBack={showBack}
    />
  );
}
