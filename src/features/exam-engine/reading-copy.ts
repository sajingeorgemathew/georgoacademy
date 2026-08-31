// Learner facing wording for the Reading screens (EXAM-16, score and
// review wording added by EXAM-17).
//
// Same rule as exam-copy.ts and listening-copy.ts: all Reading chrome
// copy lives in one file so the screens say the same thing everywhere,
// and so a wording change is one edit rather than four. The closing
// screen wording sits in its own object at the foot of the file,
// readingReviewCopy, rather than in readingCopy below.
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

import type { ReadingReviewStatus } from "./reading-types";

export const readingCopy = {
  // Part intro screen.
  partIntroSubtitle:
    "Read the following information before this part of the practice test begins.",
  partIntroNotice:
    "Internal prototype. Answers are held on this screen only and nothing is saved. A practice score is shown at the end of the part and is lost when you leave. You can move back and forward between screens and your answers stay as you left them.",
  // What the learner is given, shown on the intro card.
  partIntroFormatLabel: "Message, response and drop-down questions",

  // Split screen column labels.
  passageColumnLabel: "Reading passage",
  questionsColumnLabel: "Questions",
  // Left column label on the diagram part (EXAM-18). Reading Part 2 is
  // answered from a picture rather than from prose, so calling that
  // column "Reading passage" would describe the wrong thing.
  diagramColumnLabel: "Diagram",
  // Left column label on the paragraph matching part (EXAM-20). Reading
  // Part 3's left column is a set of labelled paragraphs a learner scans
  // rather than a passage read straight through, and the source document
  // names the part "Reading for Information", so the column says
  // Information.
  informationColumnLabel: "Information",
  // Left column label on the viewpoints part (EXAM-22). Reading Part 4's
  // left column is a website article carrying several people's views on
  // one proposal, and the second panel on the right is a body of prose
  // too, so naming this column "Reading passage" would not say which of
  // the two a learner is being pointed at.
  articleColumnLabel: "Article",

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
  // Shown under the question column while questions are outstanding.
  //
  // EXAM-17 replaced "Answer every question to continue.", which was the
  // wording of a gate that no longer exists. Next is always available, so
  // the line says what a blank costs rather than what it blocks.
  blanksAllowedHint:
    "You can continue with questions unanswered. Any question left blank is counted as incorrect.",

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

  // Marking states, shown while the server marks the part and if it
  // could not.
  //
  // The failure wording names both causes, a lost session and a request
  // that did not arrive, because they leave the learner in the same place
  // with the same thing to do.
  markingHeading: "Marking your answers",
  markingText:
    "Your answers are being checked. This takes a moment and nothing is saved.",
  markingFailedHeading: "Your answers could not be marked",
  markingFailedText:
    "The check did not complete. Your answers are still held on this page, so you can try again, or go back and change them first. You may need to sign in again.",
  markingRetryLabel: "Try again",

  // Page metadata and the exam region name, for the route.
  part1PageTitle: "Mock Test 1 - Reading Part 1 - Toronto Academy of Education",
  part1PageDescription:
    "Internal prototype of Mock Test 1 Reading Part 1, Reading Correspondence.",
  part1ExamRegionLabel: "Mock Test 1 - Reading Part 1",

  // Reading Part 2 (EXAM-18).
  //
  // Part 2 closes on the EXAM-16 completion screen rather than on a score,
  // because its review and its score are the next ticket. So it needs its
  // own heading and its own restart label, and it reuses
  // partCompletePendingReview and partCompleteNotice above unchanged: both
  // say what is true of this part too.
  partTwoIntroFormatLabel: "Diagram, email and drop-down questions",
  partTwoCompleteHeading: "Reading Part 2 complete",
  partTwoRestartLabel: "Restart Reading Part 2",
  part2PageTitle: "Mock Test 1 - Reading Part 2 - Toronto Academy of Education",
  part2PageDescription:
    "Internal prototype of Mock Test 1 Reading Part 2, Reading to Apply a Diagram.",
  part2ExamRegionLabel: "Mock Test 1 - Reading Part 2",

  // Reading Part 3 (EXAM-20, closing screens added by EXAM-21).
  //
  // Part 3 closed on the EXAM-16 completion screen until EXAM-21 gave it
  // a practice score and an answer review, the way EXAM-19 gave Part 2
  // its own. The completion heading and the restart label below both
  // stay: the restart label is what the score screen's restart button
  // says, and the heading still names the screen buildReadingFlow can
  // build for this part on request.
  //
  // The format label names what the learner is given rather than the
  // part title, the way the Part 1 and Part 2 labels do. Nine statements
  // are matched to lettered paragraphs, so it says so.
  partThreeIntroFormatLabel: "Labelled paragraphs and paragraph matching",
  partThreeCompleteHeading: "Reading Part 3 complete",
  partThreeRestartLabel: "Restart Reading Part 3",
  part3PageTitle: "Mock Test 1 - Reading Part 3 - Toronto Academy of Education",
  part3PageDescription:
    "Internal prototype of Mock Test 1 Reading Part 3, Reading for Information.",
  part3ExamRegionLabel: "Mock Test 1 - Reading Part 3",

  // Reading Part 4 (EXAM-22).
  //
  // Part 4 closes on the EXAM-16 completion screen rather than on a
  // score, because its review and its score are the next ticket. That is
  // where Parts 2 and 3 both started. So it needs its own heading and its
  // own restart label, and it reuses partCompletePendingReview and
  // partCompleteNotice above unchanged: both say what is true of this
  // part too.
  //
  // The format label names what the learner is given rather than the part
  // title, the way the three labels above do. Part 4 is an article, a
  // reader comment with blanks in it, and drop-downs against both, so it
  // says so.
  partFourIntroFormatLabel: "Article, reader comment and drop-down questions",
  partFourCompleteHeading: "Reading Part 4 complete",
  partFourRestartLabel: "Restart Reading Part 4",
  part4PageTitle: "Mock Test 1 - Reading Part 4 - Toronto Academy of Education",
  part4PageDescription:
    "Internal prototype of Mock Test 1 Reading Part 4, Reading for Viewpoints.",
  part4ExamRegionLabel: "Mock Test 1 - Reading Part 4",

  // Dashboard internal preview cards (EXAM-18).
  //
  // Wording for the two temporary cards that sit beside the Listening
  // test card on the dashboard, so a Reading route can be opened without
  // typing its URL. These are internal build links and the wording has to
  // keep saying so, which is why every one of them carries the badge and
  // why neither description offers a Reading test:
  //
  // - The badge is the first thing on the card, and it says the word
  //   prototype rather than a status a learner could read as a release.
  // - Each description names what the part is and what it does not do
  //   yet. Part 2 says its review and its score are not built.
  // - Neither line mentions a score, a CELPIP level or a Reading band,
  //   and nothing here claims a full Reading section exists. It does not.
  //   One part of four is built, plus one more without its review.
  //
  // EXAM-20 added a third card, for Reading Part 3, on the same terms.
  // EXAM-21 gave that part its review and its score, so its description
  // now reads like the other two rather than naming what is missing.
  // EXAM-22 added a fourth card, for Reading Part 4, and its description
  // does name what is missing, because that part has no review and no
  // score yet.
  //
  // These strings go when the real Reading entry point ships, along with
  // the cards themselves.
  dashboardPreviewBadgeLabel: "Internal preview",
  dashboardPartOneCardTitle: "Mock Test 1 - Reading Part 1",
  dashboardPartOneCardDescription:
    "Reading Correspondence prototype with local answers and practice review.",
  dashboardPartOneCardSectionLabel: "Reading",
  dashboardPartOneCardPartLabel: "Part 1",
  dashboardPartOneCardQuestionsLabel: "11 questions",
  dashboardPartOneCardCtaLabel: "Open Reading Part 1",
  dashboardPartTwoCardTitle: "Mock Test 1 - Reading Part 2",
  dashboardPartTwoCardDescription:
    "Reading to Apply a Diagram prototype with local answers and practice review.",
  dashboardPartTwoCardSectionLabel: "Reading",
  dashboardPartTwoCardPartLabel: "Part 2",
  dashboardPartTwoCardQuestionsLabel: "8 questions",
  dashboardPartTwoCardCtaLabel: "Open Reading Part 2",

  // Reading Part 3's card (EXAM-20, description updated by EXAM-21).
  // Same shape as the two above, and now the same claim: the part
  // answers and it marks, locally, with no CELPIP level and no Reading
  // band anywhere behind it.
  dashboardPartThreeCardTitle: "Mock Test 1 - Reading Part 3",
  dashboardPartThreeCardDescription:
    "Reading for Information prototype with local answers and practice review.",
  dashboardPartThreeCardSectionLabel: "Reading",
  dashboardPartThreeCardPartLabel: "Part 3",
  dashboardPartThreeCardQuestionsLabel: "9 questions",
  dashboardPartThreeCardCtaLabel: "Open Reading Part 3",

  // Reading Part 4's card (EXAM-22). Same shape as the three above, and
  // the description says what is missing rather than implying it is
  // there: the part answers locally and its review and its score are the
  // next ticket, which is exactly what the Part 2 and Part 3 descriptions
  // said before those parts got theirs.
  dashboardPartFourCardTitle: "Mock Test 1 - Reading Part 4",
  dashboardPartFourCardDescription:
    "Reading for Viewpoints prototype with local answers. No review and no score yet.",
  dashboardPartFourCardSectionLabel: "Reading",
  dashboardPartFourCardPartLabel: "Part 4",
  dashboardPartFourCardQuestionsLabel: "10 questions",
  dashboardPartFourCardCtaLabel: "Open Reading Part 4",
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

// Wording for the Reading Part 1 score and answer review screens
// (EXAM-17).
//
// A second object rather than more keys on readingCopy above, so the
// closing screens can be reworded without reading past the question
// screen wording, and so it is obvious at a glance which strings are the
// ones that must never claim an official result.
//
// Two rules this object exists to hold the line on, the same two
// listening-review-copy.ts holds:
//
// - Nothing here claims an official CELPIP score or an official CELPIP
//   level. The result is named a Toronto Academy practice score every
//   time it appears, and the note under it says in a full sentence that
//   it is not an official CELPIP score.
// - Nothing here estimates a CELPIP Reading band. A band needs the full
//   Reading section and this is one part of four, so there is no wording
//   for one and no screen that could print one.
//
// It is written out for Reading Part 1 rather than built from a part
// label the way buildListeningReviewCopy is. There is one Reading part,
// so a builder now would be a builder with one caller; the moment Reading
// Part 2 reaches its own review, this becomes buildReadingReviewCopy and
// the Part 1 export becomes one call to it, which is exactly the move
// EXAM-06 made for Listening.
export const readingReviewCopy = {
  // Score screen.
  scoreTitle: "Reading Part 1 practice score",
  scoreSubtitle: "Your result for this part. Nothing has been saved.",
  totalQuestionsLabel: "Total questions",
  answeredLabel: "Answered",
  blankLabel: "Left blank",
  correctLabel: "Correct",
  scoreLabel: "Practice score",
  // The one sentence that stops the percentage above it being read as an
  // official result. It sits with the number rather than elsewhere on the
  // screen, so the two are never separated.
  practiceResultNote:
    "This is a Toronto Academy practice score, not an official CELPIP score. No CELPIP Reading level is estimated from one part.",
  // Said out loud on the score screen, because a blank is counted as a
  // wrong answer and a learner should not have to work that out from the
  // numbers.
  blankNote:
    "Questions left blank are counted as incorrect in this score. The correct answer for each of them is shown in the review.",
  reviewAnswersLabel: "Review answers",
  restartLabel: "Restart Reading Part 1",
  backToDashboardLabel: "Back to dashboard",
  scoreNotice:
    "Nothing from this run has been saved. Leaving or restarting clears the answers and the score held on this page.",

  // Answer review screen.
  reviewTitle: "Reading Part 1 answer review",
  reviewSubtitle:
    "Every question in this part, with the answer you chose and the correct answer.",
  backToScoreLabel: "Back to score",
  // Column labels inside a review card.
  yourAnswerLabel: "Your answer",
  correctAnswerLabel: "Correct answer",
  // Printed in place of a selected answer on a blank.
  noAnswerText: "No answer selected",
  // Printed in place of a correct answer where a part has no usable key
  // for the question. Mock Test 1 Reading Part 1 never reaches it: its
  // key is complete and confirmed.
  missingAnswerText: "Answer key not available",
  // Said under the cards, so the review is not read as an explanation.
  reviewNotice:
    "This review is held on this screen only. Nothing is saved, no explanations are written for these answers, and this is not an official CELPIP result.",
  // Shown in the unreachable case of a review with no rows in it, rather
  // than an empty screen with no account of itself.
  reviewEmptyText: "There are no questions to review for this part.",

  // The question text a reply blank prints in the review. Questions 7 to
  // 11 have no stem of their own, so the row names the blank instead of
  // inventing a sentence the source does not have.
  responseBlankQuestionText: "Blank in the written response.",

  // The same line for a Reading Part 2 blank (EXAM-19). Questions 1 to 5
  // sit inside the email on the right rather than a written reply, so
  // the neutral line above would point a learner at the wrong text. The
  // marking action passes this one in, the way the Part 2 screens pass
  // their own titles in below.
  emailBlankQuestionText: "Blank in the email message.",

  // Titles for the Reading Part 2 closing screens (EXAM-19). Everything
  // else on those screens is part neutral and reused as it stands: the
  // subtitles, the four summary labels, the practice result note, the
  // blank note, the two answer labels, both notices and the status
  // words. Only the three lines that name the part are written twice.
  partTwoScoreTitle: "Reading Part 2 practice score",
  partTwoReviewTitle: "Reading Part 2 answer review",

  // Titles for the Reading Part 3 closing screens (EXAM-21). Two lines
  // again, and nothing else, for the same reason: everything else on
  // those screens is part neutral and reused as it stands.
  //
  // Part 3 needs no blank question text beside these, unlike Part 2. Its
  // nine questions are whole statements that each carry their own text,
  // so formatReadingQuestionText prints the statement and never falls
  // through to a line naming a blank.
  partThreeScoreTitle: "Reading Part 3 practice score",
  partThreeReviewTitle: "Reading Part 3 answer review",
} as const;

// Status labels for a review card. Short, plain, and not a badge.
export const readingReviewStatusLabels: Record<ReadingReviewStatus, string> = {
  correct: "Correct",
  incorrect: "Incorrect",
  blank: "Blank",
};

// Question heading on a review card, for example "Question 7".
export function formatReadingQuestionLabel(questionNumber: number): string {
  return `Question ${questionNumber}`;
}

// A count against the part total, for example "9 of 11".
export function formatReadingCountOfTotal(
  count: number,
  total: number,
): string {
  return `${count} of ${total}`;
}

// Practice score, for example "82%".
export function formatReadingScorePercent(percent: number): string {
  return `${percent}%`;
}

// Headline line on the score card, for example
// "You answered 9 of 11 questions correctly."
export function formatReadingScoreMessage(
  correct: number,
  total: number,
): string {
  return `You answered ${correct} of ${total} questions correctly.`;
}
