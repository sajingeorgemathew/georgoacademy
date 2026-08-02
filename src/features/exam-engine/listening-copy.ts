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
} as const;

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
