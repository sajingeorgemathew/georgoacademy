"use client";

import { useMemo, useState } from "react";
import { ReadingPartCompleteScreen } from "./ReadingPartCompleteScreen";
import { ReadingPartFourInformationScreen } from "./ReadingPartFourInformationScreen";
import { ReadingPartFourIntroScreen } from "./ReadingPartFourIntroScreen";
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

// Reading Part 4 prototype (EXAM-22).
//
// The fourth Reading part built, and the last of the four. It follows the
// shape ReadingPartOnePrototype set and the Part 2 and Part 3 prototypes
// followed, and it goes as far as those two did when they were first
// built: the part is answered, the answers are counted, and it closes on
// a completion screen. There is no practice score and no answer review in
// this ticket. EXAM-23 is where those are added, the way EXAM-19 added
// Part 2's and EXAM-21 added Part 3's.
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
// docs/product/reading-part-4-prototype.md.
//
// The answers never leave this component, and the answer key never
// arrives in it. The route strips the key on the server before the
// content crosses the boundary, so this component holds content with no
// correct answers in it and could not mark an attempt if it tried. That
// is why there is no marking state here and no server action prop: there
// is nothing yet for either to talk to.
//
// The flow is three screens: the part intro, the viewpoints split holding
// all 10 questions, and the completion screen. That is
// { taskScreen: "viewpoints", ending: "complete" }, which is the same
// pair EXAM-20 asked for. EXAM-23 should drop the ending option, add a
// markAnswers prop and the marking state around it, and render the score
// and review screens the flow then builds.
//
// Back is enabled throughout, which the official-style flow would not
// allow, so the sequence can be walked through repeatedly during review.
// Answers survive going back and forward because they are keyed by
// question id rather than by screen position, and because this component
// stays mounted across the whole part. Back from the completion screen
// lands on the split screen with all 10 selections still in place.
//
// Nothing gates Next on the split screen. A learner can finish the part
// with any number of questions left blank, which is the EXAM-17 rule this
// part inherits: a blank travels as a missing key in the answer map, and
// the completion screen simply reports how many of the ten were answered.
//
// The timer does not gate Next either and does not move it: the countdown
// runs, reaches "Time is up", and stops, with every answer still
// selected. Nothing auto-submits and nothing is erased, which is what the
// ticket asks for at this stage.
//
// Every screen title, question, option and instruction line comes from
// the content object passed in, so this component carries no Mock Test 1
// text of its own.
//
// House style: normal hyphens only, no long hyphens or em dashes.

export type ReadingPartFourPrototypeProps = {
  content: ReadingPartContent;
  // Where Back to dashboard goes from the completion screen.
  dashboardHref?: string;
};

export function ReadingPartFourPrototype({
  content,
  dashboardHref,
}: ReadingPartFourPrototypeProps) {
  // The viewpoints working screen, and the EXAM-16 ending: intro,
  // questions, complete.
  const screens = useMemo(
    () =>
      buildReadingFlow(content, {
        taskScreen: "viewpoints",
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
      <ReadingPartFourIntroScreen
        content={content}
        questionCount={questionCount}
        metaText={metaText}
        onNext={goNext}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  if (screen.kind === "viewpoints") {
    return (
      <ReadingPartFourInformationScreen
        content={content}
        answers={answers}
        onSelectOption={selectAnswer}
        // The flow screen id, so the part window belongs to this screen
        // and is not restarted by any of the 10 selections made on it.
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

  if (screen.kind === "part-complete") {
    return (
      <ReadingPartCompleteScreen
        title={content.title}
        heading={readingCopy.partFourCompleteHeading}
        message={formatReadingCompletionMessage(
          countAnsweredReadingQuestions(content, answers),
          questionCount,
        )}
        restartLabel={readingCopy.partFourRestartLabel}
        dashboardHref={dashboardHref}
        onRestart={restart}
        metaText={metaText}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  // Unreachable with the flow this part asks for. buildReadingFlow can
  // build a score screen and an answer review, but only under the other
  // ending, and neither is built for Part 4 yet. Rather than render one
  // of the Part 1 screens against a part they were not marked for, this
  // renders nothing, so a flow change that outran the screens shows up as
  // a blank rather than as a wrong score. EXAM-23 replaces this branch
  // with the real screens.
  return null;
}
