// Learner facing wording for the Mock Test 1 Speaking section (EXAM-27).
//
// Same rule as exam-copy.ts, listening-copy.ts, reading-copy.ts and
// writing-mock-copy.ts: all Speaking mock test chrome copy lives in one
// file so the screens say the same thing everywhere, and so a wording
// change is one edit rather than seventeen.
//
// Three wording rules this file exists to hold the line on:
//
// - Nothing here promises a score. This ticket builds no transcription,
//   no AI review, no Speaking score and no estimated Speaking level, so
//   no screen may imply one has been produced. The words "official CELPIP
//   score", "official result", "guaranteed score" and "pass guarantee"
//   appear nowhere in this file except in the sentence that denies them.
// - Nothing here says a recording has been saved. It has not. Every
//   recording lives in the browser tab and is lost on a reload, and three
//   separate screens say so: the intro notice, the line under the
//   recorder, and the completion notice.
// - Nothing here names the official test as the thing the learner is
//   sitting. This is Toronto Academy practice software, which is the rule
//   docs/product/exam-engine-reference-audit.md section 9 sets out.
//
// What is deliberately not copied from the source document. The Mock Test
// 1 Speaking instructions are five sentences, and three of them describe
// software that behaves differently from ours:
//
//   "In this practice test, no score will be provided for any of the
//   Speaking tasks. However, you can refer to the Performance Standards
//   for Speaking or listen to sample speaking responses at the end of the
//   Speaking Test."
//   "For this practice test, you should use a timer to make sure that you
//   complete each task within the given time."
//   "The practice test will not record your answers. If you wish to
//   record your own answers, record and save your responses using your
//   computer microphone or your own recording device."
//
// This engine has its own preparation and recording countdowns, so the
// learner does not need a timer of their own. It records in the browser,
// so the third sentence is not true here. And it has no sample responses
// screen and no Performance Standards link, so the first sentence points
// at something that does not exist in this product.
//
// docs/product/mock-test-1-content-map.md already flagged this as work to
// do: "Rewrite the Speaking instruction copy so it describes Toronto
// Academy behaviour". The instruction lines below are that rewrite. The
// two facts in the source instructions that are true here, that you move
// forward by pressing Next and that the Speaking Test is about 15
// minutes, are both kept.
//
// The eight task prompts are not in this file. Those are source content
// and live in
// src/features/exam-engine/mock-tests/mock-test-1/speaking-section.ts.
//
// Strings and pure helpers only, no side effects, so this file is safe to
// import from a client component.
//
// House style: normal hyphens only, no long hyphens or em dashes.

export function buildSpeakingMockCopy({ testLabel }: { testLabel: string }) {
  return {
    // 1. Speaking section intro.
    introScreenTitle: testLabel + " - Speaking Test",
    introSubtitle:
      "Read the following information before the Speaking section begins.",
    introLines: [
      {
        heading: "Eight tasks",
        text: "You will speak on eight tasks, one after the other. Each task has its own prompt, its own preparation time and its own recording time.",
      },
      {
        heading: "Preparation, then recording",
        text: "The preparation countdown starts when the task screen opens. The recording countdown starts when you press Start recording, and your microphone is only asked for at that moment.",
      },
      {
        heading: "Moving forward",
        text: "Press Next to move to the next screen. You can move back and forward, and any recording you have made stays as you left it.",
      },
      {
        heading: "Your recordings",
        text: "Recordings are held in this browser tab only. You can play them back and record again as many times as you like. Nothing is uploaded, nothing is saved, and leaving or reloading the page clears them.",
      },
      {
        heading: "No review yet",
        text: "This section does not produce feedback, a transcript or a level. AI review of your Speaking recordings will be added in the next build.",
      },
    ],
    introNotice:
      "This is Toronto Academy speaking practice, not an official CELPIP test. No score is produced here and nothing you record is saved or uploaded.",
    introCardTitle: "Speaking section",
    introCardSummary:
      "All eight Speaking tasks in one run, each with a preparation countdown, a recording countdown and a local playback of what you recorded. AI review will be added next.",
    introTasksLabel: "Tasks",
    introPrepLabel: "Preparation time",
    introSpeakingLabel: "Speaking time",

    // 2. The task screens.
    promptColumnLabel: "Your task",
    // The column heading and the preview heading below it are
    // deliberately different words. Both said "Your recording" in the
    // first pass and the screen printed the same label twice, once over
    // the whole answer column and once over the player inside it.
    recordColumnLabel: "Your answer",
    // Heading above the source prompt.
    promptHeading: "Read the task",
    // Heading above the pictures on a task that has them.
    visualHeading: "Look at the picture",
    // Heading above the two option cards on Task 5.
    optionCardsHeading: "Compare the options",

    // The two clocks in the top bar. examCopy already carries
    // "Preparation" and "Recording" for exactly this pair, and these
    // repeat them under Speaking names so the section can be reworded on
    // its own later.
    prepTimerLabel: "Preparation",
    responseTimerLabel: "Recording",
    // Shown beside the recording clock before recording has started, in
    // place of a countdown that is not running yet.
    responseTimerIdleLabel: "Speaking time",
    // Quiet line under each clock, saying what the window is for.
    prepTimerNote: "Time to plan what you will say.",
    // Shown in place of the preparation reading once recording has
    // started, because the preparation window is over at that point
    // whether or not it had run out.
    prepTimerDoneValue: "Complete",
    prepTimerDoneNote: "Preparation ended when recording started.",
    responseTimerIdleNote: "Starts when you press Start recording.",
    responseTimerRunningNote: "Recording. Press Stop recording when you finish.",
    // Shown under either clock once it has run out. The reading itself
    // already says "Time is up", so this says what that does and does not
    // mean here.
    timerExpiredNote:
      "Nothing stops or is deleted. Finish what you are saying, then continue when you are ready.",

    // The recorder.
    recorderHeading: "Record your answer",
    recorderIdleHint:
      "Use the preparation time to plan what you will say. Press Start recording when you are ready. Your browser will ask for microphone access the first time.",
    recorderRecordingHint:
      "Recording. Speak until you have finished, then press Stop recording.",
    recorderRecordedHint:
      "Play your answer back below. You can record again, and only your most recent take is kept.",
    startRecordingLabel: "Start recording",
    requestingMicrophoneLabel: "Waiting for microphone",
    stopRecordingLabel: "Stop recording",
    reRecordLabel: "Re-record",
    // Live status line beside the controls.
    statusIdleLabel: "Not recorded yet",
    statusRequestingLabel:
      "Waiting for microphone access. Allow microphone use in your browser to start recording.",
    statusRecordingLabel: "Recording in progress",
    statusStoppingLabel: "Finishing your recording",
    statusRecordedLabel: "Recorded",
    // Quiet line under the recorder, on every task.
    recorderPrivacyNote:
      "Your recording stays in this browser tab. It is not uploaded, not saved and not sent anywhere.",

    // Audio preview.
    previewHeading: "Your recording",
    previewLengthLabel: "Length",
    previewRecordedAtLabel: "Recorded",
    previewEmptyText:
      "Nothing recorded for this task yet. Press Start recording to record an answer.",
    previewUnsupportedText:
      "This browser cannot play the recording back. The recording was still made and is still held on this page.",

    // Recording problems. One heading and one sentence per kind, so the
    // screen can say what happened and offer only what can help.
    errorUnsupportedHeading: "Recording is not available in this browser",
    errorUnsupportedText:
      "This browser does not support microphone recording. Open the Speaking Test in an up to date browser such as Chrome, Edge, Firefox or Safari. You can still read every task and move through the section.",
    errorPermissionHeading: "Microphone access was blocked",
    errorPermissionText:
      "Your browser blocked microphone access. Allow the microphone for this site in your browser settings, then press Start recording again.",
    errorFailedHeading: "The recording could not be completed",
    errorFailedText:
      "Something went wrong while recording. Check that a microphone is connected and not in use by another application, then try again.",
    errorRetryLabel: "Try recording again",
    // Shown under an error, so a learner knows the run is not stuck.
    errorContinueHint:
      "You can continue to the next task. A task with no recording is reported as missing on the completion screen and nothing else happens.",

    // Next label on the last task, which closes the section.
    finishSpeakingLabel: "Finish Speaking",

    // 3. Task transition.
    transitionHeading: "Task complete",
    transitionRecordedLabel: "Recorded",
    transitionMissingLabel: "No recording",
    transitionHint:
      "Take a moment to get ready. Continue when you want the next task. Your recording is kept and you can go back to it.",

    // 4. Speaking section complete.
    completeHeading: "Speaking section complete",
    completeMessage:
      "You have reached the end of the Speaking section. Here is what you recorded for each task.",
    completeTasksHeading: "Your recordings",
    completeTaskColumn: "Task",
    completeStatusColumn: "Status",
    completeLengthColumn: "Length",
    completeRecordedValue: "Recorded",
    completeMissingValue: "No recording",
    completeNoLengthValue: "-",
    completeNextStepHeading: "What comes next",
    completeNextStepText:
      "AI review of your Speaking recordings, with task feedback and an estimated Speaking level for practice, will be added in the next build. Nothing on this screen has been scored.",
    completeNotice:
      "Nothing from this run has been saved or uploaded. Leaving or restarting clears the recordings held on this page.",
    restartLabel: "Restart Speaking section",
    backToDashboardLabel: "Return to dashboard",

    // Page metadata and the exam region name, for the route.
    pageTitle: testLabel + " - Speaking Test - Toronto Academy of Education",
    pageDescription:
      "Internal prototype of the " +
      testLabel +
      " Speaking section, with all eight tasks, a preparation countdown, a recording countdown and local browser recordings. No transcription, no review and no score.",
    examRegionLabel: testLabel + " - Speaking Test",

    // Dashboard internal preview card.
    //
    // Dressed as an internal build link, the way the Reading and Writing
    // cards are. What it deliberately does not say: that a full
    // all-skills Mock Test 1 exists, or that this section produces a
    // result of any kind. Four sections of four now have a route, and
    // this one cannot review, score or save anything yet.
    dashboardCardTitle: testLabel + " - Speaking Test",
    dashboardCardDescription:
      "Speaking section prototype with Tasks 1-8, preparation timer, and local recordings. AI review will be added next.",
    dashboardCardSectionLabel: "Speaking",
    dashboardCardTasksLabel: "Tasks 1-8",
    dashboardCardCtaLabel: "Open Speaking Test",
    dashboardPreviewBadgeLabel: "Internal preview",
  } as const;
}

// Mock Test 1. Also the default every Speaking mock screen falls back to
// when no copy is passed.
export const speakingMockCopy = buildSpeakingMockCopy({
  testLabel: "Mock Test 1",
});

export type SpeakingMockCopy = ReturnType<typeof buildSpeakingMockCopy>;

// Transition line between two tasks, for example
// "Speaking Task 1 complete. Continue to Speaking Task 2."
export function formatSpeakingTaskTransition(
  completedTaskLabel: string,
  nextTaskLabel: string,
): string {
  return completedTaskLabel + " complete. Continue to " + nextTaskLabel + ".";
}

// Task position inside the section, for example "Speaking Task 3 of 8".
export function formatSpeakingTaskPosition(
  taskNumber: number,
  totalTasks: number,
): string {
  return "Speaking Task " + taskNumber + " of " + totalTasks;
}

// Top bar note on a task screen, for example
// "Speaking Task 3 of 8 - Screen 6 of 17".
export function formatSpeakingTaskMeta(
  taskNumber: number,
  totalTasks: number,
  screenNumber: number,
  totalScreens: number,
): string {
  return (
    formatSpeakingTaskPosition(taskNumber, totalTasks) +
    " - Screen " +
    screenNumber +
    " of " +
    totalScreens
  );
}

// Top bar note on a screen the section owns rather than a task, for
// example "Speaking section - Screen 1 of 17".
export function formatSpeakingSectionMeta(
  screenNumber: number,
  totalScreens: number,
): string {
  return "Speaking section - Screen " + screenNumber + " of " + totalScreens;
}

// A window as a sentence, for example "30 seconds" or "1 minute
// 30 seconds".
//
// Speaking windows are short and are not all whole minutes, so this
// cannot be the Writing minutes formatter. Under a minute it reads in
// seconds, which is how a 30 second window is spoken about.
export function formatSpeakingDuration(seconds: number): string {
  const safeSeconds = Math.max(0, Math.round(seconds));

  if (safeSeconds < 60) {
    return safeSeconds + (safeSeconds === 1 ? " second" : " seconds");
  }

  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  const minutePart = minutes + (minutes === 1 ? " minute" : " minutes");

  if (remainder === 0) {
    return minutePart;
  }

  return (
    minutePart +
    " " +
    remainder +
    (remainder === 1 ? " second" : " seconds")
  );
}

// A recorded length as a clock reading, for example "0:47".
//
// A length is read rather than counted down, so it is not zero padded on
// the minutes the way the top bar countdown is.
export function formatSpeakingClock(seconds: number): string {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;

  return minutes + ":" + String(remainder).padStart(2, "0");
}

// The time a recording was made, as a short local time, for example
// "14:32".
//
// Formatted from the ISO timestamp held in the response. It is a
// convenience for telling two takes apart within one sitting, so it shows
// the time and not the date: nothing here survives the sitting.
//
// Returns an empty string for a missing or unparseable timestamp, so a
// caller never has to guard it.
export function formatSpeakingRecordedAt(recordedAt: string | null): string {
  if (!recordedAt) {
    return "";
  }

  const stamp = new Date(recordedAt);

  if (Number.isNaN(stamp.getTime())) {
    return "";
  }

  return stamp.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// How many of the section's tasks were recorded, for example
// "6 of 8 tasks recorded".
export function formatSpeakingRecordedCount(
  recordedCount: number,
  totalTasks: number,
): string {
  return (
    recordedCount +
    " of " +
    totalTasks +
    (totalTasks === 1 ? " task recorded" : " tasks recorded")
  );
}
