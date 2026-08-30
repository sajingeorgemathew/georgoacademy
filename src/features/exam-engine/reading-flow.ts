// Screen order and answer helpers for a Reading part (EXAM-16).
//
// The Reading counterpart of listening-flow.ts and its three siblings.
// Pure functions over ReadingPartContent, no React and no side effects,
// so the flow can be built on the server, rendered on the client, and
// tested on its own later.
//
// The flow is very short, because a Reading part is one working screen.
// For Mock Test 1 Reading Part 1 it produces three screens:
//
//   1  part intro
//   2  the split screen, message on the left and all 11 questions on the
//      right
//   3  end of part
//
// It is still built rather than typed out inline, so the ids come from
// the content object and the prototype cannot drift from the flow. It is
// also what EXAM-17 extends: the answer review, the practice score and
// the end of part screen go in behind an ending option, the way
// buildListeningViewpointsFlow grew from EXAM-13 to EXAM-14, rather than
// by rewriting this function.
//
// House style: normal hyphens only, no long hyphens or em dashes.

import type {
  ReadingAnswerMap,
  ReadingPartContent,
  ReadingQuestion,
  ReadingScreen,
} from "./reading-types";

// Build the screen order for a Reading part.
//
// No options yet. EXAM-16 builds one ending, the completion screen, so an
// ending parameter now would be a parameter with one legal value.
export function buildReadingFlow(content: ReadingPartContent): ReadingScreen[] {
  return [
    { kind: "part-intro", id: `${content.sectionId}-intro` },
    { kind: "correspondence", id: `${content.sectionId}-questions` },
    { kind: "part-complete", id: `${content.sectionId}-complete` },
  ];
}

// Every question in the part, in order, flattened across the groups.
//
// The groups are how the answer column is laid out; the flat list is how
// the part is counted, gated and marked. Both views are needed and only
// one of them is stored, so this is the conversion and there is one of
// it.
export function listReadingQuestions(
  content: ReadingPartContent,
): ReadingQuestion[] {
  return content.questionGroups.flatMap((group) => group.questions);
}

// The same content with the answer key removed.
//
// The Reading counterpart of withoutListeningAnswerKey and its three
// siblings, and it exists for the same reason. A complete answer key is
// fine on the server and wrong in the browser: a client component
// receives its props as serialized data, so a key handed down that way is
// readable by anyone who opens the network panel. Mock Test 1 Reading
// Part 1 has a complete key printed in the source document, so its route
// strips it here before rendering.
//
// This is not a substitute for marking on the server. It keeps the
// answers off the page, which is why the screen that marks answers has to
// do the comparison where the key lives. EXAM-16 marks nothing at all, so
// there is no server action beside the route yet; EXAM-17 adds one, and
// it must read the key from the content module rather than from anything
// the browser sends back.
export function withoutReadingAnswerKey(
  content: ReadingPartContent,
): ReadingPartContent {
  const stripped: ReadingPartContent = {
    ...content,
    // A per question key would leak the same way, so it goes too.
    questionGroups: content.questionGroups.map((group) => ({
      ...group,
      questions: group.questions.map((question) => {
        const copy = { ...question };
        delete copy.correctOptionId;
        return copy;
      }),
    })),
  };

  delete stripped.answerKey;

  return stripped;
}

// How many questions the part has, for example 11.
export function countReadingQuestions(content: ReadingPartContent): number {
  return listReadingQuestions(content).length;
}

// How many questions have an answer selected.
//
// This is what the completion screen prints. It counts across both
// groups, because the learner answered one part, not two panels.
export function countAnsweredReadingQuestions(
  content: ReadingPartContent,
  answers: ReadingAnswerMap,
): number {
  return listReadingQuestions(content).filter((question) =>
    Boolean(answers[question.id]),
  ).length;
}

// Whether every question in the part has an answer.
//
// An empty question list would make this trivially true, so that case is
// excluded rather than letting a content mistake open the gate.
export function areAllReadingQuestionsAnswered(
  content: ReadingPartContent,
  answers: ReadingAnswerMap,
): boolean {
  const questions = listReadingQuestions(content);

  return (
    questions.length > 0 &&
    questions.every((question) => Boolean(answers[question.id]))
  );
}

// Store a selection, leaving the other answers alone.
//
// A new object every time, so React sees a changed reference. Keep the
// shape as { questionId: optionId }: it is what EXAM-17 reads, and it is
// why an answer survives moving back and forward, since it is keyed by
// question rather than by screen position or by group.
export function setReadingAnswer(
  answers: ReadingAnswerMap,
  questionId: string,
  optionId: string,
): ReadingAnswerMap {
  return { ...answers, [questionId]: optionId };
}

// The text of the option chosen for one question, or undefined.
//
// The reply on a completion group echoes a filled blank back into the
// letter so it reads as a finished response, which needs the option text
// rather than the id. The lookup lives here rather than in the component
// so the reply and the question list read the answer map the same way.
//
// It takes a question list rather than the whole part, because the panel
// that draws a reply holds one group and has no reason to see the other.
export function findReadingAnswerText(
  questions: ReadingQuestion[],
  answers: ReadingAnswerMap,
  questionId: string,
): string | undefined {
  const selectedOptionId = answers[questionId];

  if (!selectedOptionId) {
    return undefined;
  }

  return questions
    .find((candidate) => candidate.id === questionId)
    ?.options.find((option) => option.id === selectedOptionId)?.text;
}
