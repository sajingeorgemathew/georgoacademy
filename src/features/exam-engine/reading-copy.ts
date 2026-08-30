// Learner facing wording for the Reading screens (EXAM-16).
//
// Same rule as exam-copy.ts and listening-copy.ts: all Reading chrome
// copy lives in one file so the screens say the same thing everywhere,
// and so a wording change is one edit rather than four.
//
// What this file deliberately does not copy from the source document:
//
// - "On the official test, once you leave a page, you cannot go back to
//   it to change your answers. However, in this practice test, you can."
//   That is a Reading Test instruction, not a Part 1 instruction, and the
//   Reading instructions screen is not built in this ticket. The half of
//   it that is true of this prototype is said plainly instead, in
//   partIntroNotice.
// - Any wording naming the official test as the thing the learner is
//   sitting. This is Toronto Academy practice software, which is the rule
//   docs/product/exam-engine-reference-audit.md section 9 sets out.
//
// Strings and pure helpers only, no side effects, so this file is safe to
// import from a client component.
//
// House style: normal hyphens only, no long hyphens or em dashes.

export const readingCopy = {
  // Part intro screen.
  partIntroSubtitle:
    "Read the following information before this part of the practice test begins.",
  partIntroNotice:
    "Internal prototype. Answers are held on this screen only, nothing is saved, and no score is produced. You can move back and forward between screens and your answers stay as you left them.",
  // What the learner is given, shown on the intro card.
  partIntroFormatLabel: "Message, response and drop-down questions",

  // Split screen column labels.
  passageColumnLabel: "Reading passage",
  questionsColumnLabel: "Questions",

  // Question list.
  //
  // The placeholder is a real option with an empty value rather than a
  // disabled first choice, so an unanswered select reads "Select answer"
  // instead of silently defaulting to the first option. Same decision
  // ListeningDropdownQuestionList made and for the same reason.
  dropdownPlaceholder: "Select answer",
  // Read in place of the drawn underscores, which are decorative.
  blankLabel: "blank",
  // Accessible name for a numbered blank that prints no stem, for example
  // question 7 inside the reply. Screen readers get "Question 7" rather
  // than a bare number.
  questionNumberLabel: "Question",
  // Shown under the question column while questions are outstanding,
  // explaining why Next is not available yet.
  answerAllHint: "Answer every question to continue.",

  // Timer label in the top bar. The same sentence as
  // examCopy.timeRemainingLabel, kept separate so Reading can be reworded
  // without touching the other three sections.
  partTimerLabel: "Time remaining",

  // Completion screen.
  //
  // The pending review line is a plain sentence rather than a disabled
  // button, following the rule ListeningPartCompleteScreen sets out: a
  // greyed out control says "press this in a moment", and there is
  // nothing behind it.
  partCompletePendingReview:
    "The answer review and the practice score for this part are added in the next ticket.",
  partCompleteNotice:
    "Nothing from this run has been saved. Restarting clears the answers held on this page.",
  partCompleteBackToDashboardLabel: "Back to dashboard",
  partCompleteRestartLabel: "Restart Reading Part 1",
  partCompleteHeading: "Reading Part 1 complete",

  // Page metadata and the exam region name, for the route.
  part1PageTitle: "Mock Test 1 - Reading Part 1 - Toronto Academy of Education",
  part1PageDescription:
    "Internal prototype of Mock Test 1 Reading Part 1, Reading Correspondence.",
  part1ExamRegionLabel: "Mock Test 1 - Reading Part 1",
} as const;

// Screen position line, for example Screen 2 of 3.
//
// The Reading counterpart of formatListeningScreenPosition. It is not
// shared with Listening because the two sections are worded separately by
// design, and a shared helper would be one import away from making a
// Reading change a Listening change.
export function formatReadingScreenPosition(
  current: number,
  total: number,
): string {
  return `Screen ${current} of ${total}`;
}

// Answered count under the question column, for example
// "8 of 11 questions answered."
export function formatReadingAnsweredCount(
  answered: number,
  total: number,
): string {
  return `${answered} of ${total} questions answered.`;
}

// Completion line, for example "You answered 8 of 11 questions."
export function formatReadingCompletionMessage(
  answered: number,
  total: number,
): string {
  return `You answered ${answered} of ${total} questions.`;
}
