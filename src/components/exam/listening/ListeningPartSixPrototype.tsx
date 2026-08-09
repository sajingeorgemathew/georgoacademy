"use client";

import { useMemo, useState } from "react";
import { ListeningPartCompleteScreen } from "./ListeningPartCompleteScreen";
import { ListeningPartIntroScreen } from "./ListeningPartIntroScreen";
import { ListeningScenarioScreen } from "./ListeningScenarioScreen";
import { ListeningViewpointsQuestionScreen } from "./ListeningViewpointsQuestionScreen";
import { ListeningViewpointsScreen } from "./ListeningViewpointsScreen";
import {
  formatListeningAnsweredMessage,
  formatListeningScreenPosition,
  listeningCopy,
} from "@/features/exam-engine/listening-copy";
import {
  areAllListeningViewpointsQuestionsAnswered,
  buildListeningViewpointsFlow,
  countAnsweredListeningViewpointsQuestions,
  countListeningViewpointsQuestions,
  setListeningViewpointsAnswer,
} from "@/features/exam-engine/listening-viewpoints-flow";
import type {
  ListeningViewpointsAnswerMap,
  ListeningViewpointsPartContent,
} from "@/features/exam-engine/listening-viewpoints-types";

// Listening Part 6 prototype (EXAM-13).
//
// The last Listening part, and the only one that completes statements from
// radio options. It is deliberately not merged with the Part 4 or Part 5
// prototypes: Part 4 completes the same kind of statement from a select,
// and Part 5 answers whole questions from radio options over a video. The
// content shapes differ for the same reason. See the header of
// listening-viewpoints-types.ts.
//
// It owns two pieces of state:
//
// - which screen is showing, an index into the flow built by
//   buildListeningViewpointsFlow
// - the answers, as { questionId: optionId }
//
// Both live in local component state. Nothing is written to a database and
// a page reload starts the part again. That is deliberate for a prototype
// and is recorded in docs/product/listening-part-6-prototype.md.
//
// There is no marking state machine here, unlike the Part 2 to Part 5
// prototypes. Part 6's answer review and practice score are the next
// ticket, so this part closes on the completion screen, which is where
// Parts 2 to 5 each closed for one ticket. The answer map is already the
// { questionId: selectedOptionId } shape that ticket needs.
//
// Part 6 has one clip and six questions, so the flow is five screens: part
// intro, scenario, report audio, the question screen, and the completion
// screen.
//
// Back is enabled throughout, which the official-style flow would not
// allow, so the sequence can be walked through repeatedly during review.
// Answers survive going back and forward because they are keyed by
// question id rather than by screen position, and because this component
// stays mounted across the whole part. Back from the completion screen
// lands on the question screen with all six options still selected, which
// is the prototype affordance the ticket asks for.
//
// Next on the question screen is disabled until all six questions have an
// answer. It is not gated on the clip finishing anywhere yet.
//
// Every screen title, statement, option and media URL comes from the
// content object passed in, so this component carries no Mock Test 1 text
// of its own. The answer key is not among them: the route strips it before
// the content reaches this component, and nothing here ever reads a
// correct option.

export type ListeningPartSixPrototypeProps = {
  content: ListeningViewpointsPartContent;
};

export function ListeningPartSixPrototype({
  content,
}: ListeningPartSixPrototypeProps) {
  const screens = useMemo(
    () => buildListeningViewpointsFlow(content),
    [content],
  );
  const questionCount = useMemo(
    () => countListeningViewpointsQuestions(content),
    [content],
  );

  const [screenIndex, setScreenIndex] = useState(0);
  const [answers, setAnswers] = useState<ListeningViewpointsAnswerMap>({});

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
      setListeningViewpointsAnswer(current, questionId, optionId),
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
        // No sectionCount. Part 6 is one report, not a part built from
        // conversation sections, so the row is left out rather than
        // reading "Sections 1".
        formatLabel="Report audio and viewpoints questions"
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
      <ListeningViewpointsScreen
        title={content.title}
        media={content.media}
        instructionText={content.mediaInstruction}
        metaText={metaText}
        onNext={goNext}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  if (screen.kind === "questions") {
    return (
      <ListeningViewpointsQuestionScreen
        title={content.title}
        questions={content.questions}
        answers={answers}
        onSelectOption={selectAnswer}
        allAnswered={areAllListeningViewpointsQuestionsAnswered(
          content,
          answers,
        )}
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
  // The answered count is worked out here rather than assumed to be the
  // full six. Next on the question screen gates on every question being
  // answered, but Back is open in this prototype, so a learner can answer
  // all six, walk forward, walk back and clear nothing. The count says
  // what is actually held.
  return (
    <ListeningPartCompleteScreen
      title={content.title}
      heading={listeningCopy.part6CompleteHeading}
      message={formatListeningAnsweredMessage(
        countAnsweredListeningViewpointsQuestions(content, answers),
        questionCount,
      )}
      onRestart={restart}
      restartLabel={listeningCopy.part6RestartLabel}
      metaText={metaText}
      onBack={goBack}
      showBack={showBack}
    />
  );
}
