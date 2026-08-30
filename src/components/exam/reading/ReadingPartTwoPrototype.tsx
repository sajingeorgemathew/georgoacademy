"use client";

import { useMemo, useState } from "react";
import { ReadingPartCompleteScreen } from "./ReadingPartCompleteScreen";
import { ReadingPartTwoInformationScreen } from "./ReadingPartTwoInformationScreen";
import { ReadingPartTwoIntroScreen } from "./ReadingPartTwoIntroScreen";
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

// Reading Part 2 prototype (EXAM-18).
//
// The second Reading part built, and the first one answered from a
// picture rather than from prose. It follows the shape
// ReadingPartOnePrototype set rather than reinventing it, and it is
// deliberately the smaller of the two, because Part 2 stops where Part 1
// now goes on.
//
// It owns two pieces of state:
//
// - which screen is showing, an index into the flow built by
//   buildReadingFlow
// - the answers, as { questionId: optionId }
//
// Both live in local component state. Nothing is written to a database,
// to localStorage or to a cookie, and a page reload starts the part
// again. That is deliberate for a prototype and is recorded in
// docs/product/reading-part-2-prototype.md.
//
// There is no marking state machine here, which is the one real
// difference from the Part 1 prototype. Part 1 has a score and a review,
// so it holds a request id, a four state marking machine and a screen for
// each of the states it can be in. EXAM-18 builds none of that for Part
// 2: the part closes on the completion screen, no answers are sent
// anywhere, and no server action exists for this route. The answer key
// for Part 2 is complete and is stored in the content module, but the
// route strips it before the content reaches this component, so this
// component cannot mark anything and must not be able to.
//
// The flow is three screens: the part intro, the diagram split holding
// all 8 questions, and the completion screen. That is the EXAM-16 ending,
// asked for by name through { ending: "complete" }, together with the
// diagram working screen asked for through { taskScreen: "diagram" }.
// Both options already existed on buildReadingFlow, so nothing about the
// flow builder had to change shape for a second part to use it.
//
// Back is enabled throughout, which the official-style flow would not
// allow, so the sequence can be walked through repeatedly during review.
// Answers survive going back and forward because they are keyed by
// question id rather than by screen position, and because this component
// stays mounted across the whole part. Back from the completion screen
// lands on the split screen with all 8 selections still in place.
//
// Nothing gates Next on the split screen. A learner can finish the part
// with any number of questions left blank, which is the EXAM-17 rule this
// part inherits: a blank travels as a missing key in the answer map, and
// the completion screen reports how many of the eight were answered
// without treating the shortfall as a failure to finish.
//
// The timer does not gate Next either and does not move it: the countdown
// runs, reaches "Time is up", and stops, with every answer still
// selected. Nothing auto-submits, which is what the ticket asks for at
// this stage.
//
// Every screen title, question, option, instruction line and the diagram
// itself come from the content object passed in, so this component
// carries no Mock Test 1 text of its own. The answer key is not among
// them: the route strips it before the content reaches this component.

export type ReadingPartTwoPrototypeProps = {
  content: ReadingPartContent;
  // Where Back to dashboard goes from the completion screen.
  dashboardHref?: string;
};

export function ReadingPartTwoPrototype({
  content,
  dashboardHref,
}: ReadingPartTwoPrototypeProps) {
  // The diagram working screen and the EXAM-16 ending. Reading Part 2 has
  // no review and no score in this ticket, so it asks for the completion
  // screen by name rather than falling into the Part 1 default.
  const screens = useMemo(
    () => buildReadingFlow(content, { taskScreen: "diagram", ending: "complete" }),
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
      <ReadingPartTwoIntroScreen
        content={content}
        questionCount={questionCount}
        metaText={metaText}
        onNext={goNext}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  if (screen.kind === "diagram") {
    return (
      <ReadingPartTwoInformationScreen
        content={content}
        answers={answers}
        onSelectOption={selectAnswer}
        // The flow screen id, so the part window belongs to this screen
        // and is not restarted by any of the 8 selections made on it.
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
  // It reports how many of the eight questions were answered and says
  // that the review and the score are the next ticket. It shows no score,
  // no correct answers and no CELPIP level, because none of those are
  // built for this part and the answer key never reached the browser.
  return (
    <ReadingPartCompleteScreen
      title={content.title}
      heading={readingCopy.partTwoCompleteHeading}
      message={formatReadingCompletionMessage(
        countAnsweredReadingQuestions(content, answers),
        questionCount,
      )}
      restartLabel={readingCopy.partTwoRestartLabel}
      dashboardHref={dashboardHref}
      onRestart={restart}
      metaText={metaText}
      onBack={goBack}
      showBack={showBack}
    />
  );
}
