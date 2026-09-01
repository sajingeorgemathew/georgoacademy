// Learner facing wording for the Mock Test 1 Writing section prototype
// (EXAM-25).
//
// Same rule as exam-copy.ts, listening-copy.ts and reading-copy.ts: all
// Writing mock test chrome copy lives in one file so the screens say the
// same thing everywhere, and so a wording change is one edit rather than
// eight.
//
// Two wording rules this file exists to hold the line on:
//
// - Nothing here promises a score. This prototype produces no score, no
//   estimated band and no AI feedback, so every screen that could imply
//   one says instead that the review is added next. A screen that said
//   "your result" with nothing behind it would be a worse prototype than
//   one that says plainly what it does not do.
// - Nothing here names the official test as the thing the learner is
//   sitting. This is Toronto Academy practice software, which is the rule
//   docs/product/exam-engine-reference-audit.md section 9 sets out.
//
// What is deliberately not copied from the source document: the Writing
// instruction sentence that begins "On the official test, if you do not
// finish Task 1 in 27 minutes, the screen will move to Task 2." Half of
// it describes the official test rather than this one, and the half that
// is true here, that you move forward by pressing Next, is said plainly
// in the section instructions instead. The 27 minute figure it carries is
// used, as the Task 1 window: see writing-section.ts.
//
// Strings and pure helpers only, no side effects, so this file is safe to
// import from a client component.
//
// House style: normal hyphens only, no long hyphens or em dashes.

export function buildWritingMockCopy({ testLabel }: { testLabel: string }) {
  return {
    // 1. Writing section intro.
    introScreenTitle: testLabel + " - Writing Test",
    introSubtitle:
      "Read the following information before the Writing section begins.",
    introLines: [
      {
        heading: "Two tasks",
        text: "You will write one email and one survey response. Each one has its own prompt and its own writing time.",
      },
      {
        heading: "Moving forward",
        text: "Press Next to move to the next screen. You can move back and forward, and everything you have typed stays as you left it.",
      },
      {
        heading: "Your writing",
        text: "Your responses are held on this screen only. Nothing is saved, and leaving or reloading the page clears them.",
      },
      {
        heading: "No review yet",
        text: "This prototype does not check your writing. There is no AI review, no score and no estimated band in this version.",
      },
    ],
    introNotice:
      "This is Toronto Academy writing practice, not an official CELPIP test. Nothing you type here is saved or scored, and the AI review is added in the next build.",
    introCardTitle: "Writing section",
    introCardSummary:
      "Both Writing tasks in one run, with a live word count and a countdown on each task. The AI review and the estimated Writing band are added next.",
    introTasksLabel: "Tasks",
    introTimeLabel: "Writing time",
    introWordsLabel: "Each response",

    // 2 and 4. The task screens.
    taskIntroSubtitle:
      "Read the information on the left, then write your response on the right.",
    // Column labels on the task split screen.
    situationColumnLabel: "Information",
    responseColumnLabel: "Your response",
    // Heading above the two positions on the survey task.
    choiceLegendLabel: "Choose one option",
    // Shown under the positions while none has been chosen. It states
    // what a blank costs rather than what it blocks, because nothing is
    // blocked.
    choiceHint:
      "Choose the option you prefer. You can change your choice at any time, and your writing is kept when you do.",
    // Timer label in the top bar. The same sentence as
    // examCopy.timeRemainingLabel, kept separate so Writing can be
    // reworded without touching the other three sections.
    taskTimerLabel: "Time remaining",
    // Quiet line under the editor.
    editorHint:
      "Your writing is held on this screen only. It is not saved, not checked and not sent anywhere.",
    // Accessible name for the editor, and the visible label above it.
    editorLabel: "Your response",
    // Next label on the last task, which the ticket asks to read Finish
    // Writing rather than Next. It closes the section rather than moving
    // to another task, and a control that says what it does is worth the
    // one extra string.
    finishWritingLabel: "Finish Writing",
    // Word count block beside the editor.
    wordCountLabel: "Word count",
    wordTargetLabel: "Target",

    // 3. Task transition.
    transitionHeading: "Task complete",
    transitionHint:
      "Take a moment to get ready. Continue when you want the next task. Your Task 1 writing is kept and you can go back to it.",

    // 5. Writing section complete.
    completeHeading: "Writing section complete",
    completeMessage:
      "You have reached the end of the Writing section. Here is what you typed for each task.",
    completeTasksHeading: "Your responses",
    completeWordsColumn: "Words",
    completeTaskColumn: "Task",
    completeChoiceColumn: "Option chosen",
    completeNoChoiceValue: "No option chosen",
    // The pending review line. A plain sentence rather than a disabled
    // button, following the rule ListeningPartCompleteScreen sets out: a
    // greyed out control says "press this in a moment", and there is
    // nothing behind it.
    completePendingReview:
      "The AI review and the estimated Writing band are added in the next build. No score is produced for this run.",
    completeNotice:
      "Nothing from this run has been saved. Leaving or restarting clears the writing held on this page.",
    restartLabel: "Restart Writing section",
    backToDashboardLabel: "Return to dashboard",

    // Page metadata and the exam region name, for the route.
    pageTitle: testLabel + " - Writing Test - Toronto Academy of Education",
    pageDescription:
      "Internal prototype of the " +
      testLabel +
      " Writing section, with the Task 1 email and the Task 2 survey response in one run. No AI review and no score.",
    examRegionLabel: testLabel + " - Writing Test",

    // Dashboard internal preview card.
    //
    // Dressed as an internal build link, the way the Reading card is.
    // What it deliberately does not say: that a full all-skills Mock Test
    // 1 exists, or that any of this produces a CELPIP result. Three
    // sections of four are built, and this one has no review yet.
    dashboardCardTitle: testLabel + " - Writing Test",
    dashboardCardDescription:
      "Writing section prototype with Task 1 and Task 2 editors. AI review will be added next.",
    dashboardCardSectionLabel: "Writing",
    dashboardCardTasksLabel: "Tasks 1-2",
    dashboardCardCtaLabel: "Open Writing Test",
    dashboardPreviewBadgeLabel: "Internal preview",
  } as const;
}

// Mock Test 1. Also the default every Writing mock screen falls back to
// when no copy is passed.
export const writingMockCopy = buildWritingMockCopy({
  testLabel: "Mock Test 1",
});

export type WritingMockCopy = ReturnType<typeof buildWritingMockCopy>;

// Transition line between two tasks, for example
// "Writing Task 1 complete. Continue to Writing Task 2."
export function formatWritingTaskTransition(
  completedTaskLabel: string,
  nextTaskLabel: string,
): string {
  return completedTaskLabel + " complete. Continue to " + nextTaskLabel + ".";
}

// Task position inside the section, for example "Writing Task 2 of 2".
export function formatWritingTaskPosition(
  taskNumber: number,
  totalTasks: number,
): string {
  return "Writing Task " + taskNumber + " of " + totalTasks;
}

// Top bar note on a task screen, for example
// "Writing Task 2 of 2 - Screen 4 of 5".
export function formatWritingTaskMeta(
  taskNumber: number,
  totalTasks: number,
  screenNumber: number,
  totalScreens: number,
): string {
  return (
    formatWritingTaskPosition(taskNumber, totalTasks) +
    " - Screen " +
    screenNumber +
    " of " +
    totalScreens
  );
}

// Top bar note on a screen the section owns rather than a task, for
// example "Writing section - Screen 1 of 5".
export function formatWritingSectionMeta(
  screenNumber: number,
  totalScreens: number,
): string {
  return "Writing section - Screen " + screenNumber + " of " + totalScreens;
}

// Whole minutes, for the intro card, for example "53 minutes".
//
// The Writing allowances are whole numbers of minutes in every source we
// hold, so nothing here has to print seconds.
export function formatWritingMinutes(seconds: number): string {
  const minutes = Math.round(seconds / 60);

  return minutes + (minutes === 1 ? " minute" : " minutes");
}

// A word count reading, for example "0 words" or "1 word".
//
// Singular is handled because a one word response is a real thing a
// learner can produce, and "1 words" beside an editor looks like a bug.
export function formatWritingWordCount(wordCount: number): string {
  return wordCount + (wordCount === 1 ? " word" : " words");
}

// The word target, for example "150-200 words".
export function formatWritingWordTarget(min: number, max: number): string {
  return min + "-" + max + " words";
}
