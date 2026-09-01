"use client";

import { Fragment, useMemo, useState } from "react";
import { SpeakingSectionCompleteScreen } from "./SpeakingSectionCompleteScreen";
import { SpeakingSectionIntroScreen } from "./SpeakingSectionIntroScreen";
import { SpeakingTaskScreen } from "./SpeakingTaskScreen";
import { SpeakingTaskTransitionScreen } from "./SpeakingTaskTransitionScreen";
import {
  formatSpeakingSectionMeta,
  formatSpeakingTaskMeta,
  speakingMockCopy,
} from "@/features/exam-engine/speaking-mock-copy";
import {
  buildSpeakingSectionFlow,
  getSpeakingResponse,
  listSpeakingAudioUrls,
  setSpeakingResponse,
  summarizeSpeakingSection,
} from "@/features/exam-engine/speaking-mock-flow";
import type { SpeakingMockRecording } from "./useSpeakingMockRecorder";
import type { SpeakingMockCopy } from "@/features/exam-engine/speaking-mock-copy";
import type {
  SpeakingResponseMap,
  SpeakingSectionContent,
} from "@/features/exam-engine/speaking-mock-types";

// Mock Test 1 Speaking section (EXAM-27).
//
// The whole Speaking section as one run: the section intro, eight task
// screens, a short transition before each task after the first, and a
// completion screen. Seventeen screens, built by buildSpeakingSectionFlow
// from the content rather than typed out here.
//
// It owns two pieces of state and nothing else: which screen is showing,
// and the recordings as one { taskId: SpeakingResponse } map. Both live
// in local component state. Nothing is written to a database, to
// localStorage or to a cookie, no Supabase client is imported here, no
// server action is called, and a page reload starts the section again
// with nothing recorded.
//
// Nothing leaves the browser at all. That is the difference between this
// component and its Writing counterpart, which sends two strings to a
// server action for review. This one sends nothing anywhere: there is no
// fetch, no upload, no transcription and no model call in this ticket,
// and the completion screen says in words that the review is the next
// build rather than offering a control with nothing behind it.
//
// Why recordings survive navigation. They are keyed by task id rather
// than by screen position, and this component stays mounted for the whole
// section, so moving to the transition and back, or to Task 8 and back to
// Task 3, does not touch the map at all. The task screen below is
// remounted by that navigation and the audio is not, which is the whole
// reason the state lives here rather than inside the recorder.
//
// The object URLs, which are the one piece of housekeeping
// -------------------------------------------------------
//
// A recording arrives as a Blob. A Blob cannot be put in an audio element
// directly, so URL.createObjectURL turns it into a blob: URL that
// resolves inside this document. That URL is a handle the browser holds
// open until it is revoked or the document goes away, so this component
// revokes every one it displaces:
//
// - recording again over a take revokes the take it replaced, in the same
//   handler that creates the new one
// - restarting the section revokes every URL in the map before clearing
//   it
//
// The URL is created in an event handler rather than during render or in
// an effect, which is deliberate. Creating one during render would leak a
// handle on every re-render, and this project's lint rules refuse both a
// browser call in a hook body and a state push from an effect. An event
// handler is where both the creation and the revoke belong, and it is
// also the only place that knows which URL is being displaced.
//
// Leaving the page needs no cleanup of its own, because a blob: URL is
// scoped to the document that made it and the browser reclaims all of
// them when that document goes away. What is handled here is the case the
// browser cannot see: a URL displaced while the page stays open.
//
// What this component deliberately does not do:
//
// - it does not transcribe, review, score or estimate anything. None of
//   those exist in this ticket
// - it does not upload. No audio reaches Supabase Storage, an API route
//   or a server action
// - it does not gate Next on a missing recording. A learner can walk the
//   whole section without recording a word and reach a completion screen
//   that says 0 of 8 tasks recorded, which is the honest reading of what
//   they did
// - it does not act on a timer reaching zero. Neither clock is given an
//   expiry handler, so a closed window shows "Time is up" and nothing
//   else happens: nothing stops, nothing advances and nothing is erased
//
// Back is enabled throughout, which the official-style flow would not
// allow, so the sequence can be walked through repeatedly during review.
// This is the prototype behaviour the Reading and Writing routes already
// have. Strict Speaking timing, with a forward only run, is a later
// ticket.
//
// Every screen title, instruction, prompt and picture comes from the
// content object passed in, so this component carries no Mock Test 1 text
// of its own.
//
// House style: normal hyphens only, no long hyphens or em dashes.

export type SpeakingSectionPrototypeProps = {
  content: SpeakingSectionContent;
  copy?: SpeakingMockCopy;
  // Where Return to dashboard goes from the completion screen.
  dashboardHref?: string;
};

export function SpeakingSectionPrototype({
  content,
  copy = speakingMockCopy,
  dashboardHref,
}: SpeakingSectionPrototypeProps) {
  const screens = useMemo(() => buildSpeakingSectionFlow(content), [content]);

  const [screenIndex, setScreenIndex] = useState(0);
  const [responses, setResponses] = useState<SpeakingResponseMap>({});

  const screen = screens[screenIndex];
  const totalScreens = screens.length;
  const totalTasks = content.tasks.length;

  const goNext = () => {
    setScreenIndex((current) => Math.min(current + 1, totalScreens - 1));
  };

  const goBack = () => {
    setScreenIndex((current) => Math.max(current - 1, 0));
  };

  // Store a finished take, replacing whatever the task held before.
  //
  // The object URL is made here, in a handler, and the displaced one is
  // revoked in the same breath. Reading the previous URL out of the
  // updater argument rather than out of the render's copy of the map is
  // what makes that safe under React's batching: the updater always sees
  // the current map, so two takes finishing back to back cannot leave one
  // URL unrevoked.
  const storeRecording = (taskId: string, recording: SpeakingMockRecording) => {
    const audioUrl = URL.createObjectURL(recording.blob);

    setResponses((current) => {
      const previousUrl = getSpeakingResponse(current, taskId).audioUrl;

      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }

      return setSpeakingResponse(current, taskId, {
        audioUrl,
        audioBlob: recording.blob,
        durationSeconds: recording.durationSeconds,
        recordedAt: new Date().toISOString(),
        mimeType: recording.mimeType,
      });
    });
  };

  // Start the section again from the first screen with nothing recorded.
  //
  // Every object URL goes first, because the map is about to stop being
  // the only reference to them. Nothing was saved, so there is nothing
  // else to clear.
  const restart = () => {
    setResponses((current) => {
      listSpeakingAudioUrls(current).forEach((url) => {
        URL.revokeObjectURL(url);
      });

      return {};
    });

    setScreenIndex(0);
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
        <SpeakingTaskScreen
          task={task}
          response={getSpeakingResponse(responses, task.taskId)}
          onRecorded={(recording) => storeRecording(task.taskId, recording)}
          // The flow screen id, so the preparation window belongs to the
          // screen and a re-render does not restart it.
          timerScreenKey={screen.id}
          copy={copy}
          // The last task closes the section, so its forward control says
          // so. Every other task keeps the shell's own Next.
          nextLabel={
            screen.taskIndex === totalTasks - 1
              ? copy.finishSpeakingLabel
              : undefined
          }
          metaText={formatSpeakingTaskMeta(
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

    const metaText = formatSpeakingSectionMeta(screenIndex + 1, totalScreens);

    if (screen.kind === "section-intro") {
      return (
        <SpeakingSectionIntroScreen
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

      const completedResponse = getSpeakingResponse(
        responses,
        completedTask.taskId,
      );

      return (
        <SpeakingTaskTransitionScreen
          title={content.title}
          completedTaskLabel={completedTask.taskLabel}
          nextTaskLabel={nextTask.taskLabel}
          completedRecorded={
            completedResponse.audioUrl !== null &&
            completedResponse.audioBlob !== null
          }
          completedDurationSeconds={completedResponse.durationSeconds}
          copy={copy}
          metaText={metaText}
          onNext={goNext}
          onBack={goBack}
          showBack={showBack}
        />
      );
    }

    return (
      <SpeakingSectionCompleteScreen
        title={content.title}
        tasks={summarizeSpeakingSection(content, responses)}
        dashboardHref={dashboardHref}
        onRestart={restart}
        copy={copy}
        metaText={metaText}
        onBack={goBack}
        showBack={showBack}
      />
    );
  };

  // One keyed fragment around the whole flow, for the reason the Reading,
  // Listening and Writing section prototypes have one.
  //
  // Inside the locked viewport the exam canvas is the only region that
  // scrolls, and it is the same DOM element on every screen, so its
  // scroll offset would otherwise carry over: pressing Next at the bottom
  // of a task would land on the next screen already scrolled halfway down
  // it. Keying on the screen id remounts the frame when the screen
  // changes, so every screen opens at the top of the canvas.
  //
  // It does not disturb the recordings. They are held in this component's
  // state, which is above the key, so remounting the frame below rebuilds
  // the screen and leaves every take where it was.
  //
  // It does end a take in progress, and that is correct. The remount
  // unmounts the recorder, whose cleanup stops the MediaRecorder and
  // releases the microphone, and whose mount guard drops the abandoned
  // audio rather than writing it into a task the learner has left.
  return <Fragment key={screen.id}>{renderCurrentScreen()}</Fragment>;
}
