// Learner facing wording for the Listening review, score and end screens
// (EXAM-04).
//
// Same rule as listening-copy.ts: the closing screens share one wording
// file, so a change lands in one place rather than in five components.
//
// Two wording rules this file exists to hold the line on:
//
// - Nothing here claims an official CELPIP score or an official CELPIP
//   level. The result is named a Toronto Academy practice result every
//   time it appears, and the note under it says so in a full sentence.
// - Nothing here says an answer is wrong when the answer key is missing.
//   The pending wording is about the key, never about the learner.
//
// Strings and pure helpers only, no side effects, so this file is safe to
// import from a client component.
//
// House style: normal hyphens only, no long hyphens or em dashes.

import type { ListeningReviewStatus } from "./listening-review-types";

export const listeningReviewCopy = {
  // Answer review screen.
  reviewTitle: "Listening Part 1 Answer Review",
  reviewSubtitle: "Review your answers before viewing the score.",
  viewScoreLabel: "View score",
  backToQuestionsLabel: "Back",
  // Sits under the table, explaining what the review is and is not.
  reviewNotice:
    "This review is held on this screen only. Nothing is saved and this is not an official CELPIP result.",

  // Review table headers.
  tableCaption: "Your answers for Listening Part 1",
  columnQuestion: "Question",
  columnSelected: "Your answer",
  columnCorrect: "Correct answer",
  columnStatus: "Status",

  // Cell fallbacks.
  noAnswerText: "No answer selected",
  pendingAnswerText: "Answer key pending",

  // Answer explanation reference panel.
  explanationPanelTitle: "Answer key reference",
  explanationPanelIntro:
    "The answers and explanations for this part are published as an image. Open it to check your answers by hand while the answer key is being transcribed.",
  explanationToggleLabel: "Show the answer and explanation sheet",
  explanationImageCaption:
    "Answer and explanation sheet for Listening Part 1, from the practice test source material.",

  // Score screen.
  scoreTitle: "Listening Part 1 Score",
  scoreSubtitle: "Your practice result for this part.",
  totalQuestionsLabel: "Total questions",
  answeredLabel: "Answered",
  correctLabel: "Correct",
  scoreLabel: "Practice score",
  pendingValue: "Pending",
  // Shown in place of a score when the key is incomplete.
  pendingScoreHeading: "Answer key pending",
  pendingScoreText:
    "The answer key for this part is not available yet, so no practice score is calculated. Your answers are shown in the review table, and none of them are marked wrong.",
  practiceResultNote:
    "This is a Toronto Academy practice result, not an official CELPIP score.",
  endPartLabel: "End Listening Part 1",
  reviewAnswersLabel: "Review answers",

  // End of part screen.
  endTitle: "End of Listening Part 1",
  endMessage: "You have completed Listening Part 1 of Mock Test 1.",
  backToDashboardLabel: "Back to dashboard",
  restartLabel: "Restart Listening Part 1",
  nextPartPlaceholder: "Listening Part 2 will be added in the next ticket.",
  // Standing reminder on the last screen of a prototype run.
  endNotice:
    "Nothing from this run has been saved. Restarting clears the answers held on this page.",
} as const;

// Status labels for the review table. Short, plain, and not a badge.
export const listeningReviewStatusLabels: Record<
  ListeningReviewStatus,
  string
> = {
  correct: "Correct",
  incorrect: "Incorrect",
  unanswered: "Unanswered",
  "answer-key-pending": "Answer key pending",
};

// Question label for a part that does not print its question stems, for
// example "Question 3".
export function formatListeningQuestionLabel(questionNumber: number): string {
  return `Question ${questionNumber}`;
}

// Answered line, for example "5 of 8".
export function formatListeningCountOfTotal(
  count: number,
  total: number,
): string {
  return `${count} of ${total}`;
}

// Practice score, for example "63%".
export function formatListeningScorePercent(percent: number): string {
  return `${percent}%`;
}

// Line about how many keys are still missing, for example
// "8 of 8 answer keys are not transcribed yet."
export function formatListeningMissingKeyCount(
  missing: number,
  total: number,
): string {
  return missing === 1
    ? `1 of ${total} answer keys is not transcribed yet.`
    : `${missing} of ${total} answer keys are not transcribed yet.`;
}
