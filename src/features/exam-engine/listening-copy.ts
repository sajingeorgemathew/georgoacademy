// Learner facing wording for the Listening screens (EXAM-03).
//
// Same rule as exam-copy.ts: all Listening chrome copy lives in one file
// so the screens say the same thing everywhere, and so a wording change
// is one edit rather than six.
//
// Two things this file deliberately does not copy from the source
// document:
//
// - "You will hear the conversation only once" and "You will hear it only
//   once". This prototype lets a clip be replayed, so printing the
//   official-style sentence would be a promise the screen does not keep.
//   The one time playback rule arrives with a later ticket, and the
//   sentence comes back with it.
// - The source break line for the third section reads "second" in both
//   places, which mock-tests/mock-test-1/extracted-content-outline.md
//   records as a copy and paste slip in the document. The ordinal is
//   generated here instead, so the third break reads "third".
//
// Strings and pure helpers only, no side effects, so this file is safe to
// import from a client component.
//
// House style: normal hyphens only, no long hyphens or em dashes.

// Shown under a one screen question list while questions are
// outstanding, explaining why Next is not available yet.
//
// Held as a module constant because two entries below read it: the
// dropdown parts and the video discussion part say the same sentence, and
// two literals would be two things to keep in step. Named per screen kind
// rather than shared under one key so a later wording change can be made
// for one and not the other without a rename.
const ANSWER_ALL_QUESTIONS_HINT = "Answer every question to continue.";

export const listeningCopy = {
  // Part intro screen.
  partIntroSubtitle:
    "Read the following information before this part of the practice test begins.",
  partIntroNotice:
    "Internal prototype. Answers are held on this screen only, nothing is saved, and no score is produced.",

  // Scenario screen.
  scenarioHeading: "Instructions:",
  scenarioImageCaption: "The setting for the conversation.",

  // Conversation audio screens.
  conversationInstruction: "Listen to the conversation.",
  conversationPlayerTitle: "Conversation audio",
  conversationHint:
    "Play the clip when you are ready, then continue to the questions.",

  // Section break screens.
  sectionBreakHeading: "Next section",
  sectionBreakHint:
    "Take a moment to get ready. Continue when you want the next section.",
  // Small inert strip on the break screen, standing in for the pause the
  // official-style flow plays between sections.
  sectionBreakPlaceholderLabel: "Preparation pause",
  sectionBreakPlaceholderHelper:
    "The timed preparation pause between sections is added in a later ticket.",

  // Question screens.
  questionInstruction: "Listen to the question.",
  questionPlayerTitle: "Question audio",
  chooseAnswerInstruction: "Choose the best answer to each question.",
  answerPanelLabel: "Answer",
  audioPanelLabel: "Question audio",
  // Shown under the options while nothing is selected, explaining why
  // Next is not available yet.
  selectAnswerHint: "Select an answer to continue.",

  // Shown in the player's place when a question has no clip (EXAM-07).
  //
  // Different from audioFallbackHeading, which covers a clip that exists
  // and would not load. This one covers a clip that is not in the source
  // material at all, so there is nothing to reload and no point telling
  // anyone to check their connection. Mock Test 1 Listening Part 3
  // Question 1 is the only place it appears.
  questionAudioMissingHeading: "This question has no audio yet",
  questionAudioMissingText:
    "The recording for this question is missing from the source practice test and is added once it is supplied. The answer options below are the ones from the practice test.",

  // Static timer on the question screens. Nothing counts down in this
  // ticket, so the reading is shown in the muted state that the shell
  // reserves for a fixed label rather than a live value.
  questionTimerLabel: "Time remaining",
  questionTimerValue: "30 seconds",

  // Closing screens.
  //
  // The EXAM-03 completion placeholder and its "Coming soon" review
  // control are gone. EXAM-04 put the answer review, the practice score
  // and the end of part screen in their place, and their wording lives in
  // listening-review-copy.ts.

  // Completion screen for a part whose review and score are not built yet
  // (EXAM-05). Listening Part 2 closes on this.
  //
  // The review line is a plain sentence, not a greyed out button, for the
  // same reason ListeningPartEndScreen gives: there is nothing to press,
  // and a disabled control implies there will be in a moment.
  partCompletePendingReview:
    "The answer review and the practice score for this part are added in the next ticket.",
  partCompleteNotice:
    "Nothing from this run has been saved. Restarting clears the answers held on this page.",
  partCompleteBackToDashboardLabel: "Back to dashboard",

  // Audio player.
  audioPlayerLabel: "Practice test audio player",
  audioFallbackHeading: "This audio cannot be played right now",
  audioFallbackText:
    "Check your connection and reload the page to try again. You can continue when you are ready.",
  audioUnsupportedText:
    "Your browser cannot play this audio clip. You can continue when you are ready.",

  // Dashboard internal preview card.
  previewTitle: "Mock Test 1 Listening Part 1 Prototype",
  previewSummary:
    "Internal preview of the first Listening part built from Mock Test 1 content. Answers are held on the page only, nothing is saved, and the practice score waits on the answer key.",
  previewDescription:
    "Prototype of Mock Test 1 Listening Part 1, with the conversation audio, the eight question screens, local answer selection, and the answer review and practice score screens.",

  // Listening Part 2 (EXAM-05).
  //
  // Part specific wording lives here rather than being derived from the
  // content object, because "Listening Part 2" is not any field on it:
  // partTitle is the section name, "Listening to a Daily Life
  // Conversation", and title is the full practice test heading.
  part2CompleteHeading: "Listening Part 2 complete",
  part2RestartLabel: "Restart Listening Part 2",
  part2PreviewTitle: "Mock Test 1 Listening Part 2 Prototype",
  part2PreviewSummary:
    "Internal preview of Listening Part 2, Listening to a Daily Life Conversation, built from Mock Test 1 content. Answers are held on the page only and nothing is saved.",
  part2PreviewDescription:
    "Prototype of Mock Test 1 Listening Part 2, with the telephone conversation audio, the five question screens, local answer selection, and the answer review and practice score screens.",

  // Marking screen, shown between the last question and the answer
  // review while a part's answers are checked (EXAM-06, renamed from the
  // part2 prefix by EXAM-08).
  //
  // A part that keeps its answer key on the server has its review rows
  // and its practice score fetched rather than calculated in the browser.
  // That is normally too fast to read, but it can fail, and a failure
  // needs a screen that says so and offers another go.
  //
  // Not one of these strings ever named a part, so EXAM-08 dropped the
  // part2 prefix rather than adding an identical part3 copy of each.
  // Listening Parts 2 and 3 both read them.
  //
  // The wording is about the check, never about the answers. Nothing
  // here implies a result before one exists.
  markingHeading: "Checking your answers",
  markingText:
    "Your answers are being checked. This takes a moment, and nothing is saved.",
  markingFailedHeading: "Your answers could not be checked",
  markingFailedText:
    "The answer review could not be loaded. Check your connection, confirm you are still signed in, and try again. Your answers are still held on this page.",
  markingRetryLabel: "Try again",

  // Listening Part 3 (EXAM-07, closing screens added by EXAM-08).
  //
  // Same reason Part 2 has its own block: "Listening Part 3" is not any
  // field on the content object. partTitle is the section name,
  // "Listening for Information", and title is the full practice test
  // heading.
  //
  // part3CompleteHeading and part3RestartLabel are gone. Part 3 closed on
  // the EXAM-05 completion screen for one ticket, and now ends on the
  // answer review, the practice score and the end of part screen, whose
  // wording is built by listening-review-copy.ts. Retiring the pair was
  // follow up item 6 in docs/product/listening-part-3-prototype.md. The
  // part2 pair above is left in place as the template for the first cut
  // of a part that has no review yet.
  part3PreviewTitle: "Mock Test 1 Listening Part 3 Prototype",
  part3PreviewSummary:
    "Internal preview of Listening Part 3, Listening for Information, built from Mock Test 1 content. Answers are held on the page only and nothing is saved.",
  part3PreviewDescription:
    "Prototype of Mock Test 1 Listening Part 3, with the university workplace conversation audio, the six question screens, local answer selection, and the answer review and practice score screens.",

  // Dropdown completion screens (EXAM-09).
  //
  // Screen type 7, used by Listening Parts 4, 5 and 6: one media item,
  // then every question in the part on a single screen. None of these
  // strings names a part, so Parts 5 and 6 read the same ones.
  //
  // dropdownInstruction is the fallback for a part whose content object
  // does not carry its own question instruction. Mock Test 1 Part 4 does
  // carry one, taken from the source document, so this is the default
  // rather than the value in use.
  dropdownInstruction:
    "Choose the best way to complete each statement from the drop-down menu.",
  // Placeholder option, selected until the learner chooses. It is a real
  // option in the list with an empty value, so a select that has not been
  // answered shows something rather than defaulting to the first choice.
  dropdownPlaceholder: "Select answer",
  // Read in place of the underscores by a screen reader, so the statement
  // announces as a sentence with a gap rather than as punctuation.
  dropdownBlankLabel: "blank",
  // Shown under the list while questions are outstanding, explaining why
  // Next is not available yet.
  dropdownAnswerAllHint: ANSWER_ALL_QUESTIONS_HINT,

  // News item screens (EXAM-09).
  newsItemInstruction: "Listen to the following news item.",
  newsItemPlayerTitle: "News item audio",

  // Listening Part 4 (EXAM-09, closing screens added by EXAM-10).
  //
  // Same reason Parts 2 and 3 have their own blocks: "Listening Part 4"
  // is not any field on the content object. partTitle is the section
  // name, "Listening to a News Item", and title is the full practice test
  // heading.
  //
  // part4CompleteHeading and part4RestartLabel are gone, for the same
  // reason the part3 pair went in EXAM-08. Part 4 closed on the EXAM-09
  // completion screen for one ticket, and now ends on the answer review,
  // the practice score and the end of part screen, whose wording is built
  // by listening-review-copy.ts. The part2 pair above is still the
  // template for the first cut of a part that has no review yet.
  part4PreviewTitle: "Mock Test 1 Listening Part 4 Prototype",
  part4PreviewSummary:
    "Internal preview of Listening Part 4, Listening to a News Item, built from Mock Test 1 content. Answers are held on the page only and nothing is saved.",
  part4PreviewDescription:
    "Prototype of Mock Test 1 Listening Part 4, with the news item audio and the five dropdown completion questions on one screen, local answer selection, and the answer review and practice score screens.",

  // Video discussion screens (EXAM-11).
  //
  // Screen type 5 followed by screen type 7, used by Listening Part 5,
  // which is the only Listening part with a video. None of these strings
  // names a part.
  discussionInstruction: "Watch the discussion.",
  discussionVideoTitle: "Discussion video",
  discussionVideoHint:
    "Play the video when you are ready, then continue to the questions.",
  // Accessible name for the Part 5 player. The shell default names an
  // instructional video, which this is not: it is practice test material,
  // so a screen reader should not announce it as a walkthrough.
  discussionVideoPlayerLabel: "Practice test video player",
  discussionVideoUnsupportedText:
    "Your browser cannot play this video. You can continue when you are ready.",

  // One screen multiple-choice question list (EXAM-11).
  //
  // Separate from chooseAnswerInstruction above, which reads "Choose the
  // best answer to each question." and belongs to the Parts 1 to 3
  // question screens. This is the source document's own wording for Part
  // 5, kept as written.
  chooseBestWayInstruction: "Choose the best way to answer each question.",
  // Same sentence the dropdown list shows, and the same reason. See
  // ANSWER_ALL_QUESTIONS_HINT above.
  choiceAnswerAllHint: ANSWER_ALL_QUESTIONS_HINT,

  // Listening Part 5 (EXAM-11, closing screens added by EXAM-12).
  //
  // Same reason Parts 2, 3 and 4 have their own blocks: "Listening Part
  // 5" is not any field on the content object. partTitle is the section
  // name, "Listening to a Discussion", and title is the full practice
  // test heading.
  //
  // part5CompleteHeading and part5RestartLabel are gone, for the same
  // reason the part3 and part4 pairs went. Part 5 closed on the EXAM-11
  // completion screen for one ticket, and now ends on the answer review,
  // the practice score and the end of part screen, whose wording is built
  // by listening-review-copy.ts. The part2 pair above is still the
  // template for the first cut of a part that has no review yet.
  part5PreviewTitle: "Mock Test 1 Listening Part 5 Prototype",
  part5PreviewSummary:
    "Internal preview of Listening Part 5, Listening to a Discussion, built from Mock Test 1 content. Answers are held on the page only and nothing is saved.",
  part5PreviewDescription:
    "Prototype of Mock Test 1 Listening Part 5, with the workplace discussion video and the eight multiple-choice questions on one screen, local answer selection, and the answer review and practice score screens.",
} as const;

// Answered count under a dropdown question list, for example
// "3 of 5 questions answered."
export function formatListeningAnsweredCount(
  answered: number,
  total: number,
): string {
  return `${answered} of ${total} question${
    total === 1 ? "" : "s"
  } answered.`;
}

// Answered line on the completion screen, for example
// "You answered 5 of 5 questions."
export function formatListeningAnsweredMessage(
  answered: number,
  total: number,
): string {
  return `You answered ${answered} of ${total} question${
    total === 1 ? "" : "s"
  }.`;
}

// Ordinal words for the section labels and the break lines. Part 1 has
// three sections and no Listening part has more, so the list is short on
// purpose and falls back to the number if a longer part ever appears.
const SECTION_ORDINALS = ["first", "second", "third", "fourth", "fifth"];

function sectionOrdinal(sectionIndex: number): string {
  return SECTION_ORDINALS[sectionIndex] ?? `${sectionIndex + 1}th`;
}

// Section position, for example Section 2 of 3.
export function formatListeningSectionLabel(
  sectionIndex: number,
  totalSections: number,
): string {
  return `Section ${sectionIndex + 1} of ${totalSections}`;
}

// Break line before a section, for example
// "You will hear the second section of the conversation shortly."
export function formatListeningSectionBreak(sectionIndex: number): string {
  return `You will hear the ${sectionOrdinal(
    sectionIndex,
  )} section of the conversation shortly.`;
}

// Screen position in the top bar, for example Screen 4 of 16.
export function formatListeningScreenPosition(
  current: number,
  total: number,
): string {
  return `Screen ${current} of ${total}`;
}
