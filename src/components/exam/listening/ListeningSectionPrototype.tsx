"use client";

import { useMemo, useRef, useState } from "react";
import { ExamButton } from "../ExamButton";
import { ExamInstructionRow } from "../ExamInstructionRow";
import { ExamShell } from "../ExamShell";
import { ListeningAudioScreen } from "./ListeningAudioScreen";
import { ListeningDropdownQuestionScreen } from "./ListeningDropdownQuestionScreen";
import { ListeningPartIntroScreen } from "./ListeningPartIntroScreen";
import { ListeningQuestionScreen } from "./ListeningQuestionScreen";
import { ListeningScenarioScreen } from "./ListeningScenarioScreen";
import { ListeningSectionBreakScreen } from "./ListeningSectionBreakScreen";
import { ListeningSectionEndScreen } from "./ListeningSectionEndScreen";
import { ListeningSectionInstructionScreen } from "./ListeningSectionInstructionScreen";
import { ListeningSectionPartTransitionScreen } from "./ListeningSectionPartTransitionScreen";
import { ListeningSectionReviewScreen } from "./ListeningSectionReviewScreen";
import { ListeningSectionScoreScreen } from "./ListeningSectionScoreScreen";
import { ListeningSectionVideoScreen } from "./ListeningSectionVideoScreen";
import { ListeningVideoQuestionScreen } from "./ListeningVideoQuestionScreen";
import { ListeningVideoScreen } from "./ListeningVideoScreen";
import { ListeningViewpointsQuestionScreen } from "./ListeningViewpointsQuestionScreen";
import { ListeningViewpointsScreen } from "./ListeningViewpointsScreen";
import { examScreenBody } from "@/features/exam-engine/exam-theme";
import { getListeningQuestion } from "@/features/exam-engine/listening-flow";
import {
  formatListeningSectionBreak,
  formatListeningSectionLabel,
  listeningCopy,
} from "@/features/exam-engine/listening-copy";
import {
  areAllListeningSectionPartQuestionsAnswered,
  buildListeningSectionFlow,
  countAnsweredListeningSectionQuestions,
  countListeningSectionPartQuestions,
  countListeningSectionQuestions,
  setListeningSectionAnswer,
} from "@/features/exam-engine/listening-section-flow";
import {
  formatListeningSectionMeta,
  formatListeningSectionPartMeta,
  listeningSectionCopy,
} from "@/features/exam-engine/listening-section-copy";
import type { ListeningSectionCopy } from "@/features/exam-engine/listening-section-copy";
import type {
  ListeningSectionAnswerMap,
  ListeningSectionContent,
  ListeningSectionMarkedResult,
  ListeningSectionPartScreenRef,
} from "@/features/exam-engine/listening-section-types";

// Full Listening section prototype (EXAM-15).
//
// The whole Listening section as one run: the section instructions, the
// Listening instructional video, Parts 1 to 6 back to back, then one
// answer review, one practice score, and the end of section screen.
//
// It replaces nothing. The six part level prototypes still exist and their
// routes are unchanged, and this component renders the same screen
// components they do, with the same content objects. What it does not
// render is their closing screens: inside the full section a part hands
// straight over to the next one, so no part level review, no part level
// score and no part level end screen appears anywhere in this flow. That
// rule is enforced one level down, in buildListeningSectionFlow, rather
// than by this component remembering not to draw them.
//
// It owns three pieces of state:
//
// - which screen is showing, an index into the flow built by
//   buildListeningSectionFlow
// - the answers for all six parts, as one { questionId: optionId } map
// - the marking result, once the server has returned one
//
// All three live in local component state. Nothing is written to a
// database, to localStorage or to a cookie, and a page reload starts the
// section again. That is deliberate for a prototype and is recorded in
// docs/product/full-listening-section-flow.md.
//
// One answer map carries all 38 answers because the question ids are
// unique across the six Mock Test 1 content files, so no part prefix and
// no nesting is needed. Answers survive going back and forward, and across
// a part boundary in either direction, because they are keyed by question
// id rather than by screen position and because this component stays
// mounted for the whole section. Restart clears all 38 and returns to the
// instruction screen.
//
// Back is enabled throughout, which the official-style flow would not
// allow, so the sequence can be walked through repeatedly during review.
// Next on a question screen is gated on that question, or on that part's
// whole question list for the one screen parts, exactly as it is in the
// part routes. It is not gated on media finishing anywhere yet.
//
// Every screen title, question, option and media URL comes from the
// section content object passed in, so this component carries no Mock Test
// 1 text of its own. The answer keys are not among them: the route strips
// all six before the content reaches this component, and this component
// never sees a correct option until the learner has finished Part 6 and
// the server sends the review rows back.

// Marks a whole section attempt on the server and returns the per part
// review rows and the practice score. Resolves to null when the caller has
// no session.
//
// Passed in rather than imported, so this component depends on the shape
// of the result and not on one particular route's action.
export type ListeningSectionMarkAction = (
  answers: ListeningSectionAnswerMap,
) => Promise<ListeningSectionMarkedResult | null>;

// Where the marking request has got to.
//
// "failed" covers both a rejected request and a null reply, which is a
// lost session. Both leave the learner in the same place with the same
// thing to do, so they read as one state and the copy names both causes.
type MarkingState =
  | { status: "idle" }
  | { status: "working" }
  | { status: "ready"; marked: ListeningSectionMarkedResult }
  | { status: "failed" };

export type ListeningSectionPrototypeProps = {
  content: ListeningSectionContent;
  markAnswers: ListeningSectionMarkAction;
  copy?: ListeningSectionCopy;
};

export function ListeningSectionPrototype({
  content,
  markAnswers,
  copy = listeningSectionCopy,
}: ListeningSectionPrototypeProps) {
  const screens = useMemo(() => buildListeningSectionFlow(content), [content]);
  const totalQuestions = useMemo(
    () => countListeningSectionQuestions(content),
    [content],
  );

  const [screenIndex, setScreenIndex] = useState(0);
  const [answers, setAnswers] = useState<ListeningSectionAnswerMap>({});
  const [marking, setMarking] = useState<MarkingState>({ status: "idle" });

  // Which marking request is the current one. A learner can leave the
  // review, change an answer and come back faster than a reply arrives,
  // and the older reply would then overwrite the newer one with a score
  // for answers they have already changed. Every request takes a number
  // and a reply is dropped unless its number is still the latest.
  //
  // A ref rather than state on purpose: nothing renders from it, and
  // bumping it must take effect immediately rather than at the next
  // render.
  const markingRequestId = useRef(0);

  const answeredCount = useMemo(
    () => countAnsweredListeningSectionQuestions(content, answers),
    [content, answers],
  );

  const screen = screens[screenIndex];
  const totalScreens = screens.length;
  const totalParts = content.parts.length;

  const requestMarking = async (submitted: ListeningSectionAnswerMap) => {
    markingRequestId.current += 1;
    const requestId = markingRequestId.current;

    setMarking({ status: "working" });

    try {
      const marked = await markAnswers(submitted);

      if (markingRequestId.current !== requestId) {
        return;
      }

      setMarking(marked ? { status: "ready", marked } : { status: "failed" });
    } catch {
      if (markingRequestId.current !== requestId) {
        return;
      }

      setMarking({ status: "failed" });
    }
  };

  // Marking is kicked off from the handler that walks onto the review
  // screen, not from an effect. Answers cannot change while the review is
  // showing without going back into Part 6 first, so entering the review
  // is exactly the moment the result is needed and exactly the moment it
  // is known to be current.
  const goNext = () => {
    const nextIndex = Math.min(screenIndex + 1, totalScreens - 1);

    if (screens[nextIndex]?.kind === "section-review") {
      void requestMarking(answers);
    }

    setScreenIndex(nextIndex);
  };

  const goBack = () => {
    setScreenIndex((current) => Math.max(current - 1, 0));
  };

  const selectAnswer = (questionId: string, optionId: string) => {
    setAnswers((current) =>
      setListeningSectionAnswer(current, questionId, optionId),
    );
  };

  // Start the section again from the first screen with an empty answer map
  // and no result. All 38 answers go, because they are all in that one
  // map. Nothing was saved, so there is nothing else to clear. The request
  // id moves on so a reply still in flight cannot land on the fresh run.
  const restart = () => {
    markingRequestId.current += 1;
    setScreenIndex(0);
    setAnswers({});
    setMarking({ status: "idle" });
  };

  // Shared chrome props. Back is hidden on the first screen only, because
  // there is nothing behind it inside the section.
  const showBack = screenIndex > 0;

  // Stands in for the review and the score while the server is marking,
  // and carries the retry when it could not. Back still works, so a failed
  // check is never a dead end: the learner can walk back into Part 6 with
  // every answer still selected.
  const renderMarkingScreen = (metaText: string) => {
    const failed = marking.status === "failed";

    return (
      <ExamShell
        title={content.title}
        metaText={metaText}
        showNext={false}
        onBack={goBack}
        showBack={showBack}
      >
        <div className={examScreenBody.stack}>
          <ExamInstructionRow
            heading={
              failed ? copy.markingFailedHeading : copy.markingHeading
            }
            text={failed ? copy.markingFailedText : copy.markingText}
          />

          {failed ? (
            <div className={examScreenBody.actions}>
              <ExamButton
                variant="primary"
                size="md"
                onClick={() => void requestMarking(answers)}
              >
                {copy.markingRetryLabel}
              </ExamButton>
            </div>
          ) : null}
        </div>
      </ExamShell>
    );
  };

  // One screen belonging to a part.
  //
  // The dispatch is on the screen kind first and the part kind second,
  // because the section flow union is flat: two parts built from different
  // content shapes can both contribute a "media" screen, and only the part
  // says which player belongs on it. Both discriminants are checked, so a
  // combination that cannot occur returns null instead of rendering a
  // screen against the wrong content.
  const renderPartScreen = (screenRef: ListeningSectionPartScreenRef) => {
    const part = content.parts[screenRef.partIndex];

    if (!part) {
      return null;
    }

    const partScreen = screenRef.screen;
    const questionCount = countListeningSectionPartQuestions(part);
    const metaText = formatListeningSectionPartMeta(
      part.partNumber,
      totalParts,
      screenIndex + 1,
      totalScreens,
    );

    // The three navigation props are written out on every screen below
    // rather than collected into one object and spread. Gathering handlers
    // into a plain object during render is what react-hooks/refs flags,
    // because goNext reads the marking request ref, and the part
    // prototypes pass the same three props the same way.

    if (partScreen.kind === "part-intro") {
      return (
        <ListeningPartIntroScreen
          content={part.content}
          questionCount={questionCount}
          // Only a part built from conversation sections gets the Sections
          // row. The other three are one clip or one video, so the row is
          // left out rather than reading "Sections 1".
          sectionCount={
            part.kind === "sections" ? part.content.sections.length : undefined
          }
          formatLabel={part.formatLabel}
          metaText={metaText}
          onNext={goNext}
          onBack={goBack}
          showBack={showBack}
        />
      );
    }

    if (partScreen.kind === "scenario") {
      return (
        <ListeningScenarioScreen
          title={part.content.title}
          scenario={part.content.scenario}
          metaText={metaText}
          onNext={goNext}
          onBack={goBack}
          showBack={showBack}
        />
      );
    }

    if (partScreen.kind === "section-break") {
      if (part.kind !== "sections") {
        return null;
      }

      return (
        <ListeningSectionBreakScreen
          title={part.content.title}
          message={formatListeningSectionBreak(partScreen.sectionIndex)}
          sectionLabel={formatListeningSectionLabel(
            partScreen.sectionIndex,
            part.content.sections.length,
          )}
          metaText={metaText}
          onNext={goNext}
          onBack={goBack}
          showBack={showBack}
        />
      );
    }

    if (partScreen.kind === "conversation") {
      if (part.kind !== "sections") {
        return null;
      }

      const conversationSection =
        part.content.sections[partScreen.sectionIndex];

      if (!conversationSection) {
        return null;
      }

      return (
        <ListeningAudioScreen
          title={part.content.title}
          audioSrc={conversationSection.conversationAudioUrl}
          audioTitle={`${listeningCopy.conversationPlayerTitle} ${
            partScreen.sectionIndex + 1
          }`}
          durationLabel={conversationSection.durationLabel}
          sectionLabel={formatListeningSectionLabel(
            partScreen.sectionIndex,
            part.content.sections.length,
          )}
          metaText={metaText}
          onNext={goNext}
          onBack={goBack}
          showBack={showBack}
        />
      );
    }

    if (partScreen.kind === "question") {
      if (part.kind !== "sections") {
        return null;
      }

      const question = getListeningQuestion(part.content, partScreen);

      if (!question) {
        return null;
      }

      return (
        <ListeningQuestionScreen
          title={part.content.title}
          question={question}
          questionNumber={partScreen.questionNumber}
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

    if (partScreen.kind === "media") {
      if (part.kind === "dropdown") {
        return (
          <ListeningAudioScreen
            title={part.content.title}
            audioSrc={part.content.media.url}
            audioTitle={part.content.media.title}
            durationLabel={part.content.media.durationLabel}
            instructionText={
              part.content.mediaInstruction ?? listeningCopy.newsItemInstruction
            }
            metaText={metaText}
          onNext={goNext}
          onBack={goBack}
          showBack={showBack}
          />
        );
      }

      if (part.kind === "viewpoints") {
        return (
          <ListeningViewpointsScreen
            title={part.content.title}
            media={part.content.media}
            instructionText={part.content.mediaInstruction}
            metaText={metaText}
          onNext={goNext}
          onBack={goBack}
          showBack={showBack}
          />
        );
      }

      return null;
    }

    if (partScreen.kind === "video") {
      if (part.kind !== "video") {
        return null;
      }

      return (
        <ListeningVideoScreen
          title={part.content.title}
          videoSrc={part.content.media.url}
          videoTitle={part.content.media.title}
          durationLabel={part.content.media.durationLabel}
          posterSrc={part.content.media.posterUrl}
          instructionText={
            part.content.mediaInstruction ?? listeningCopy.discussionInstruction
          }
          metaText={metaText}
          onNext={goNext}
          onBack={goBack}
          showBack={showBack}
        />
      );
    }

    // Every question in the part on one screen, for Parts 4, 5 and 6.
    const allAnswered = areAllListeningSectionPartQuestionsAnswered(
      part,
      answers,
    );

    if (part.kind === "dropdown") {
      return (
        <ListeningDropdownQuestionScreen
          title={part.content.title}
          questions={part.content.questions}
          answers={answers}
          onSelectOption={selectAnswer}
          allAnswered={allAnswered}
          instructionText={part.content.questionInstruction}
          metaText={metaText}
          onNext={goNext}
          onBack={goBack}
          showBack={showBack}
        />
      );
    }

    if (part.kind === "video") {
      return (
        <ListeningVideoQuestionScreen
          title={part.content.title}
          questions={part.content.questions}
          answers={answers}
          onSelectOption={selectAnswer}
          allAnswered={allAnswered}
          instructionText={part.content.questionInstruction}
          metaText={metaText}
          onNext={goNext}
          onBack={goBack}
          showBack={showBack}
        />
      );
    }

    if (part.kind === "viewpoints") {
      return (
        <ListeningViewpointsQuestionScreen
          title={part.content.title}
          questions={part.content.questions}
          answers={answers}
          onSelectOption={selectAnswer}
          allAnswered={allAnswered}
          instructionText={part.content.questionInstruction}
          metaText={metaText}
          onNext={goNext}
          onBack={goBack}
          showBack={showBack}
        />
      );
    }

    return null;
  };

  if (!screen) {
    return null;
  }

  if (screen.kind === "part") {
    return renderPartScreen(screen);
  }

  // Everything below belongs to the section rather than to a part, so it
  // carries the section title and the section meta line.
  const metaText = formatListeningSectionMeta(screenIndex + 1, totalScreens);

  const sectionProgress = {
    totalParts,
    totalQuestions,
    answeredCount,
    copy,
  };

  if (screen.kind === "section-instructions") {
    return (
      <ListeningSectionInstructionScreen
        content={content.instructionScreen}
        {...sectionProgress}
        metaText={metaText}
        onNext={goNext}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  if (screen.kind === "section-video") {
    return (
      <ListeningSectionVideoScreen
        content={content.videoScreen}
        {...sectionProgress}
        metaText={metaText}
        onNext={goNext}
        // Skip goes exactly where Next goes. Nothing here is gated on the
        // clip, so the control is a shortcut past the player rather than a
        // second path through the flow.
        onSkip={goNext}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  if (screen.kind === "part-transition") {
    const nextPart = content.parts[screen.partIndex];
    const completedPart = content.parts[screen.partIndex - 1];

    if (!nextPart || !completedPart) {
      return null;
    }

    return (
      <ListeningSectionPartTransitionScreen
        title={content.title}
        completedPartLabel={completedPart.partLabel}
        nextPartLabel={nextPart.partLabel}
        nextPartNumber={nextPart.partNumber}
        {...sectionProgress}
        metaText={metaText}
        onNext={goNext}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  if (screen.kind === "section-review") {
    if (marking.status !== "ready") {
      return renderMarkingScreen(metaText);
    }

    return (
      <ListeningSectionReviewScreen
        title={content.title}
        parts={marking.marked.parts}
        {...sectionProgress}
        metaText={metaText}
        onNext={goNext}
        // Back lands on the last question screen of Part 6, which is the
        // prototype affordance the ticket asks for.
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  if (screen.kind === "section-score") {
    // Reachable by pressing Back from the end screen, so the result can be
    // missing here even though the review had it, for example after a
    // failed retry. The same screen covers it.
    if (marking.status !== "ready") {
      return renderMarkingScreen(metaText);
    }

    return (
      <ListeningSectionScoreScreen
        title={content.title}
        summary={marking.marked.summary}
        parts={marking.marked.parts}
        copy={copy}
        onEndSection={goNext}
        onReviewAnswers={goBack}
        metaText={metaText}
        onBack={goBack}
        showBack={showBack}
      />
    );
  }

  // End of Listening section screen. The last screen in the flow, so there
  // is no Next.
  return (
    <ListeningSectionEndScreen
      title={content.title}
      onRestart={restart}
      copy={copy}
      metaText={metaText}
      onBack={goBack}
      showBack={showBack}
    />
  );
}
