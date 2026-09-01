"use client";

import { Fragment, useMemo, useState } from "react";
import { WritingSectionCompleteScreen } from "./WritingSectionCompleteScreen";
import { WritingSectionIntroScreen } from "./WritingSectionIntroScreen";
import { WritingTaskScreen } from "./WritingTaskScreen";
import { WritingTaskTransitionScreen } from "./WritingTaskTransitionScreen";
import {
  formatWritingSectionMeta,
  formatWritingTaskMeta,
  writingMockCopy,
} from "@/features/exam-engine/writing-mock-copy";
import {
  buildWritingSectionFlow,
  countWritingTaskWords,
  getWritingChoice,
  getWritingResponse,
  setWritingChoice,
  setWritingResponse,
  summarizeWritingSection,
} from "@/features/exam-engine/writing-mock-flow";
import type { WritingMockCopy } from "@/features/exam-engine/writing-mock-copy";
import type {
  WritingChoiceMap,
  WritingResponseMap,
  WritingSectionContent,
} from "@/features/exam-engine/writing-mock-types";

// Mock Test 1 Writing section prototype (EXAM-25).
//
// The whole Writing section as one run: the section intro, Task 1, a
// short transition, Task 2, and a completion screen. Five screens, built
// by buildWritingSectionFlow from the content rather than typed out here.
//
// It owns two pieces of state and nothing else:
//
// - the responses, as one { taskId: text } map
// - the chosen positions, as one { taskId: optionId } map
//
// Both live in local component state. Nothing is written to a database,
// to localStorage or to a cookie, no Supabase client is imported, no
// server action is called, and a page reload starts the section again.
// That is what the ticket asks for and it is recorded in
// docs/product/writing-mock-test-prototype.md.
//
// Why responses survive navigation. They are keyed by task id rather than
// by screen position, and this component stays mounted for the whole
// section, so moving to the transition and back, or to Task 2 and back to
// Task 1, does not touch the map at all. The task screen below is
// remounted by that navigation and the text is not, which is the whole
// reason the state lives here rather than inside the editor.
//
// Why the two maps are separate. A choice and an essay are different
// answers to different questions, and only Task 2 has both. Keeping them
// apart means changing a position cannot disturb a response, which
// matters: a learner who clicks the other option halfway through Task 2
// keeps every word they have written.
//
// What this component deliberately does not do:
//
// - it does not mark anything, so there is no marking state, no request
//   id and no server action prop, all of which the Reading section
//   prototype needs and this one has no use for
// - it does not call an AI reviewer, and imports nothing that could
// - it does not gate Next on an empty response or an unmade choice. A
//   learner can walk the whole section without typing a word and reach a
//   completion screen that says 0 words, twice, which is the honest
//   reading of what they did
// - it does not act on a timer reaching zero. No onTimeExpire is passed
//   to either task screen, so a closed window shows "Time is up" and
//   nothing else happens: nothing submits, nothing advances, and nothing
//   is erased
//
// Back is enabled throughout, which the official-style flow would not
// allow, so the sequence can be walked through repeatedly during review.
// This is the prototype behaviour the Reading routes already have.
// Strict Writing timing, with a forward only run, is a later ticket.
//
// Every screen title, instruction, prompt and option comes from the
// content object passed in, so this component carries no Mock Test 1 text
// of its own.
//
// House style: normal hyphens only, no long hyphens or em dashes.

export type WritingSectionPrototypeProps = {
  content: WritingSectionContent;
  copy?: WritingMockCopy;
  // Where Return to dashboard goes from the completion screen.
  dashboardHref?: string;
};

export function WritingSectionPrototype({
  content,
  copy = writingMockCopy,
  dashboardHref,
}: WritingSectionPrototypeProps) {
  const screens = useMemo(() => buildWritingSectionFlow(content), [content]);

  const [screenIndex, setScreenIndex] = useState(0);
  const [responses, setResponses] = useState<WritingResponseMap>({});
  const [choices, setChoices] = useState<WritingChoiceMap>({});

  const screen = screens[screenIndex];
  const totalScreens = screens.length;
  const totalTasks = content.tasks.length;

  const goNext = () => {
    setScreenIndex((current) => Math.min(current + 1, totalScreens - 1));
  };

  const goBack = () => {
    setScreenIndex((current) => Math.max(current - 1, 0));
  };

  const changeResponse = (taskId: string, text: string) => {
    setResponses((current) => setWritingResponse(current, taskId, text));
  };

  const chooseOption = (taskId: string, optionId: string) => {
    setChoices((current) => setWritingChoice(current, taskId, optionId));
  };

  // Start the section again from the first screen with nothing typed and
  // nothing chosen. Both maps go, because everything the run produced is
  // in them. Nothing was saved, so there is nothing else to clear.
  const restart = () => {
    setScreenIndex(0);
    setResponses({});
    setChoices({});
  };

  // Back is hidden on the first screen only, because there is nothing
  // behind it inside the section.
  const showBack = screenIndex > 0;

  if (!screen) {
    return null;
  }

  // The screen at the current position.
  //
  // Wrapped in a function so the whole flow can be given one key below.
  const renderCurrentScreen = () => {
    if (screen.kind === "task") {
      const task = content.tasks[screen.taskIndex];

      if (!task) {
        return null;
      }

      return (
        <WritingTaskScreen
          task={task}
          response={getWritingResponse(responses, task.taskId)}
          onChangeResponse={(text) => changeResponse(task.taskId, text)}
          selectedOptionId={getWritingChoice(choices, task.taskId)}
          // Passed only where the task has positions to choose between,
          // so the prompt panel draws no radio group for a task that has
          // none.
          onSelectOption={
            task.options
              ? (optionId) => chooseOption(task.taskId, optionId)
              : undefined
          }
          // The flow screen id, so the window belongs to the screen and
          // typing does not restart it.
          timerScreenKey={screen.id}
          // No onTimeExpire. See the note at the top of this file.
          copy={copy}
          // The last task closes the section, so its forward control
          // says so. Every other task keeps the shell's own Next.
          nextLabel={
            screen.taskIndex === totalTasks - 1
              ? copy.finishWritingLabel
              : undefined
          }
          metaText={formatWritingTaskMeta(
            task.taskNumber,
            totalTasks,
            screenIndex + 1,
            totalScreens,
          )}
          onNext={goNext}
          onBack={goBack}
          showBack={showBack}
        />
      );
    }

    const metaText = formatWritingSectionMeta(screenIndex + 1, totalScreens);

    if (screen.kind === "section-intro") {
      return (
        <WritingSectionIntroScreen
          content={content}
          copy={copy}
          metaText={metaText}
          onNext={goNext}
          onBack={goBack}
          showBack={showBack}
        />
      );
    }

    if (screen.kind === "task-transition") {
      const nextTask = content.tasks[screen.taskIndex];
      const completedTask = content.tasks[screen.taskIndex - 1];

      if (!nextTask || !completedTask) {
        return null;
      }

      return (
        <WritingTaskTransitionScreen
          title={content.title}
          completedTaskLabel={completedTask.taskLabel}
          nextTaskLabel={nextTask.taskLabel}
          completedWordCount={countWritingTaskWords(
            responses,
            completedTask.taskId,
          )}
          copy={copy}
          metaText={metaText}
          onNext={goNext}
          onBack={goBack}
          showBack={showBack}
        />
      );
    }

    // The completion screen. The last screen in the flow, so there is no
    // Next, and Back returns to Task 2 with every word still there.
    return (
      <WritingSectionCompleteScreen
        title={content.title}
        tasks={summarizeWritingSection(content, responses, choices)}
        dashboardHref={dashboardHref}
        onRestart={restart}
        copy={copy}
        metaText={metaText}
        onBack={goBack}
        showBack={showBack}
      />
    );
  };

  // One keyed fragment around the whole flow, for the reason the Reading
  // and Listening section prototypes have one.
  //
  // Inside the locked viewport the exam canvas is the only region that
  // scrolls, and it is the same DOM element on every screen, so its
  // scroll offset would otherwise carry over: pressing Next at the bottom
  // of a task would land on the next screen already scrolled halfway down
  // it. Keying on the screen id remounts the frame when the screen
  // changes, so every screen opens at the top of the canvas.
  //
  // It does not disturb the responses. They are held in this component's
  // state, which is above the key, so remounting the frame below rebuilds
  // the screen and leaves every word where it was.
  return <Fragment key={screen.id}>{renderCurrentScreen()}</Fragment>;
}
