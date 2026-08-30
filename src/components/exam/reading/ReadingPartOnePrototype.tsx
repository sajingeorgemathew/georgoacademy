"use client";

import { useMemo, useState } from "react";
import { ReadingCorrespondenceScreen } from "./ReadingCorrespondenceScreen";
import { ReadingPartCompleteScreen } from "./ReadingPartCompleteScreen";
import { ReadingPartIntroScreen } from "./ReadingPartIntroScreen";
import {
  formatReadingCompletionMessage,
  formatReadingScreenPosition,
  readingCopy,
} from "@/features/exam-engine/reading-copy";
import {
  areAllReadingQuestionsAnswered,
  buildReadingFlow,
  countAnsweredReadingQuestions,
  countReadingQuestions,
  setReadingAnswer,
} from "@/features/exam-engine/reading-flow";
import type {
  ReadingAnswerMap,
  ReadingPartContent,
} from "@/features/exam-engine/reading-types";

// Reading Part 1 prototype (EXAM-16).
//
// The first Reading part built, and the first screen in the engine that
// is a split screen rather than a sequence of media and question screens.
// It follows the Listening prototypes in how it is put together and not
// in what it assumes: there is no clip to play, no scenario screen, no
// section to break between, and the whole part is answered on one screen.
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
// docs/product/reading-part-1-prototype.md.
//
// There is no marking state, which is the one structural difference from
// the Listening prototypes. EXAM-16 does not build a Reading review or a
// Reading score, so nothing is sent anywhere and no server action sits
// beside the route. EXAM-17 adds the marking, and it should follow the
// Listening pattern exactly: the key stays on the server, the browser
// sends its answers, and only finished review rows come back.
//
// The flow is three screens: the part intro, the split screen, and the
// completion screen. Back is enabled throughout, which the official-style
// flow would not allow, so the sequence can be walked through repeatedly
// during review. Answers survive going back and forward because they are
// keyed by question id rather than by screen position, and because this
// component stays mounted across the whole part.
//
// Next on the split screen is disabled until all 11 questions have an
// answer. The timer does not gate it and does not move it: the countdown
// runs, reaches "Time is up", and stops, with every answer still
// selected. Nothing auto-submits.
//
// Every screen title, passage paragraph, question, option and instruction
// line comes from the content object passed in, so this component carries
// no Mock Test 1 text of its own. The answer key is not among them: the
// route strips it before the content reaches this component.

export type ReadingPartOnePrototypeProps = {
  content: ReadingPartContent;
  // Where Back to dashboard goes from the completion screen.
  dashboardHref?: string;
};

export function ReadingPartOnePrototype({
  content,
  dashboardHref,
}: ReadingPartOnePrototypeProps) {
  const screens = useMemo(() => buildReadingFlow(content), [content]);
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
      <ReadingPartIntroScreen
        content={content}
        questionCount={questionCount}
        metaText={metaText}
        onNext={goNext}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  if (screen.kind === "correspondence") {
    return (
      <ReadingCorrespondenceScreen
        content={content}
        answers={answers}
        onSelectOption={selectAnswer}
        allAnswered={areAllReadingQuestionsAnswered(content, answers)}
        // The flow screen id, so the part window belongs to this screen
        // and is not restarted by any of the 11 selections made on it.
        timerScreenKey={screen.id}
        // No onTimeExpire. Nothing auto-submits and nothing advances in
        // this prototype, which is what the ticket asks for.
        metaText={metaText}
        onNext={goNext}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  // Completion screen. The last screen in the flow, so there is no Next.
  return (
    <ReadingPartCompleteScreen
      title={content.title}
      heading={readingCopy.partCompleteHeading}
      message={formatReadingCompletionMessage(
        countAnsweredReadingQuestions(content, answers),
        questionCount,
      )}
      dashboardHref={dashboardHref}
      onRestart={restart}
      metaText={metaText}
      onBack={goBack}
      showBack={showBack}
    />
  );
}
