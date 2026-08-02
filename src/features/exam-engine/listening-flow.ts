// Screen order and answer helpers for a Listening part (EXAM-03).
//
// Pure functions over ListeningPartContent, no React and no side effects,
// so the flow can be built on the server, rendered on the client, and
// tested on its own later.
//
// The order is derived from the content rather than typed out, so adding
// a fourth conversation section or a ninth question changes the data and
// nothing else. For Mock Test 1 Listening Part 1 it produces 18 screens:
//
//   1  part intro
//   2  scenario
//   3  conversation section 1
//   4  question 1
//   5  question 2
//   6  section break before section 2
//   7  conversation section 2
//   8  question 3
//   9  question 4
//  10  question 5
//  11  section break before section 3
//  12  conversation section 3
//  13  question 6
//  14  question 7
//  15  question 8
//  16  answer review
//  17  practice score
//  18  end of part
//
// Screens 16 to 18 were added by EXAM-04. They took the place of the
// EXAM-03 completion placeholder, which announced an answer review that
// did not exist yet.
//
// House style: normal hyphens only, no long hyphens or em dashes.

import type {
  ListeningAnswerMap,
  ListeningPartContent,
  ListeningQuestion,
  ListeningQuestionScreenRef,
  ListeningScreen,
} from "./listening-types";

// Build the screen order for a part.
//
// A break screen is inserted before every section except the first, which
// is what the source document does between the conversation sections.
export function buildListeningFlow(
  content: ListeningPartContent,
): ListeningScreen[] {
  const screens: ListeningScreen[] = [
    { kind: "part-intro", id: `${content.sectionId}-intro` },
    { kind: "scenario", id: `${content.sectionId}-scenario` },
  ];

  // Questions are numbered across the whole part, not per section, so the
  // count carries over from one section to the next.
  let questionNumber = 0;

  content.sections.forEach((section, sectionIndex) => {
    if (sectionIndex > 0) {
      screens.push({
        kind: "section-break",
        id: `${section.id}-break`,
        sectionIndex,
      });
    }

    screens.push({
      kind: "conversation",
      id: `${section.id}-audio`,
      sectionIndex,
    });

    section.questions.forEach((question, questionIndex) => {
      questionNumber += 1;

      screens.push({
        kind: "question",
        id: `${question.id}-screen`,
        sectionIndex,
        questionIndex,
        questionNumber,
      });
    });
  });

  screens.push(
    { kind: "answer-review", id: `${content.sectionId}-review` },
    { kind: "score", id: `${content.sectionId}-score` },
    { kind: "part-end", id: `${content.sectionId}-end` },
  );

  return screens;
}

// Every question in the part, in order.
export function listListeningQuestions(
  content: ListeningPartContent,
): ListeningQuestion[] {
  return content.sections.flatMap((section) => section.questions);
}

// How many questions the part has, for example 8.
export function countListeningQuestions(
  content: ListeningPartContent,
): number {
  return content.sections.reduce(
    (total, section) => total + section.questions.length,
    0,
  );
}

// The question a question screen points at.
//
// Returns undefined rather than throwing when the indexes do not resolve,
// so a content edit that removes a question shows an empty screen instead
// of crashing a learner out of the part.
export function getListeningQuestion(
  content: ListeningPartContent,
  screen: ListeningQuestionScreenRef,
): ListeningQuestion | undefined {
  return content.sections[screen.sectionIndex]?.questions[screen.questionIndex];
}

// Whether a question has a selected option.
export function isListeningQuestionAnswered(
  answers: ListeningAnswerMap,
  questionId: string,
): boolean {
  return Boolean(answers[questionId]);
}

// How many questions in the part have an answer selected.
export function countAnsweredListeningQuestions(
  content: ListeningPartContent,
  answers: ListeningAnswerMap,
): number {
  return listListeningQuestions(content).filter((question) =>
    isListeningQuestionAnswered(answers, question.id),
  ).length;
}

// Store a selection, leaving the other answers alone.
//
// A new object every time, so React sees a changed reference. This is the
// shape EXAM-04 reads for answer review, so keep it as
// { questionId: optionId } even when a save path is added.
export function setListeningAnswer(
  answers: ListeningAnswerMap,
  questionId: string,
  optionId: string,
): ListeningAnswerMap {
  return { ...answers, [questionId]: optionId };
}
