// Screen order and answer helpers for a video discussion Listening part
// (EXAM-11).
//
// The counterpart of listening-flow.ts and listening-dropdown-flow.ts,
// for the part built around a video. Pure functions over
// ListeningVideoPartContent, no React and no side effects, so the flow
// can be built on the server, rendered on the client, and tested on its
// own later.
//
// The flow is short and fixed, because the shape of the part is fixed:
// one video and one question screen, however many questions the part has.
// For Mock Test 1 Listening Part 5 it produces five screens:
//
//   1  part intro
//   2  scenario
//   3  discussion video
//   4  all eight multiple-choice questions
//   5  part complete
//
// It is still built rather than typed out inline, so the ids come from
// the content object and the prototype cannot drift from the flow.
//
// There is no ending option here yet, unlike buildListeningDropdownFlow.
// Part 5 has exactly one ending in this ticket, the completion screen for
// a part whose review is not built, so an option with one value would be
// a setting nobody can set. The next ticket adds the answer review, the
// practice score and the end of part screen, and adds the option along
// with them, the way EXAM-10 did for the dropdown flow and EXAM-05 did
// for the section flow.
//
// House style: normal hyphens only, no long hyphens or em dashes.

import type {
  ListeningVideoAnswerMap,
  ListeningVideoPartContent,
  ListeningVideoScreen,
} from "./listening-video-types";

// Build the screen order for a video discussion part.
export function buildListeningVideoFlow(
  content: ListeningVideoPartContent,
): ListeningVideoScreen[] {
  return [
    { kind: "part-intro", id: `${content.sectionId}-intro` },
    { kind: "scenario", id: `${content.sectionId}-scenario` },
    { kind: "video", id: `${content.sectionId}-video` },
    { kind: "questions", id: `${content.sectionId}-questions` },
    { kind: "part-complete", id: `${content.sectionId}-complete` },
  ];
}

// The same content with the answer key removed.
//
// The video counterpart of withoutListeningAnswerKey and
// withoutListeningDropdownAnswerKey, and it exists for the same reason. A
// complete answer key is fine on the server and wrong in the browser: a
// client component receives its props as serialized data, so a key handed
// down that way is readable by anyone who opens the network panel. Mock
// Test 1 Listening Part 5 has a complete, confirmed key, so its route
// strips it here before rendering.
//
// Everything else is passed through untouched, including the answer sheet
// image reference, which is a URL rather than a transcribed answer and is
// rendered nowhere in this ticket.
//
// This is not a substitute for marking on the server. It keeps the
// answers off the page for a prototype that does no marking. The screen
// that marks answers has to do the comparison where the key lives, which
// is what the Part 2, Part 3 and Part 4 server actions do and what the
// Part 5 review ticket will do.
export function withoutListeningVideoAnswerKey(
  content: ListeningVideoPartContent,
): ListeningVideoPartContent {
  const stripped: ListeningVideoPartContent = {
    ...content,
    // A per question key would leak the same way, so it goes too.
    questions: content.questions.map((question) => {
      const copy = { ...question };
      delete copy.correctOptionId;
      return copy;
    }),
  };

  delete stripped.answerKey;

  return stripped;
}

// How many questions the part has, for example 8.
export function countListeningVideoQuestions(
  content: ListeningVideoPartContent,
): number {
  return content.questions.length;
}

// How many questions have an answer selected.
export function countAnsweredListeningVideoQuestions(
  content: ListeningVideoPartContent,
  answers: ListeningVideoAnswerMap,
): number {
  return content.questions.filter((question) => Boolean(answers[question.id]))
    .length;
}

// Whether every question in the part has an answer.
//
// This is what gates Next on the question screen. An empty question list
// would make it trivially true, so that case is excluded rather than
// letting a content mistake open the gate.
export function areAllListeningVideoQuestionsAnswered(
  content: ListeningVideoPartContent,
  answers: ListeningVideoAnswerMap,
): boolean {
  return (
    content.questions.length > 0 &&
    content.questions.every((question) => Boolean(answers[question.id]))
  );
}

// Store a selection, leaving the other answers alone.
//
// A new object every time, so React sees a changed reference. Keep the
// shape as { questionId: optionId }: it is what the review ticket reads,
// and it is why an answer survives moving back and forward, since it is
// keyed by question rather than by screen position.
export function setListeningVideoAnswer(
  answers: ListeningVideoAnswerMap,
  questionId: string,
  optionId: string,
): ListeningVideoAnswerMap {
  return { ...answers, [questionId]: optionId };
}
