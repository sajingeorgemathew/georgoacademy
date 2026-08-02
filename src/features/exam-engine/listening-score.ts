// Answer review rows and practice scoring for a Listening part (EXAM-04).
//
// Pure functions over ListeningPartContent and the local answer map. No
// React, no side effects, no storage, so the same helpers work on the
// server when review moves off the client later.
//
// The one rule the whole file is built around: a missing answer key must
// never make a learner look wrong. Every path here treats an absent or
// unusable key as "not checkable yet" rather than as a mismatch, and the
// score is withheld entirely until every question in the part has a
// usable key.
//
// Key resolution order per question:
//
//   1. content.answerKey entry for the question, when its correctOptionId
//      is set
//   2. question.correctOptionId, for a part whose key is written question
//      by question
//   3. nothing, which is "answer key pending"
//
// A key that names an option the question does not have is discarded and
// counts as missing. A stale id in the key is a content bug, and marking
// every learner wrong because of it would be the worst possible answer.
//
// House style: normal hyphens only, no long hyphens or em dashes.

import {
  countAnsweredListeningQuestions,
  countListeningQuestions,
  listListeningQuestions,
} from "./listening-flow";
import { formatListeningQuestionLabel } from "./listening-review-copy";
import type {
  ListeningAnswerMap,
  ListeningPartContent,
  ListeningQuestion,
} from "./listening-types";
import type {
  ListeningAnswerKeyEntry,
  ListeningReviewRow,
  ListeningReviewStatus,
  ListeningScoreSummary,
} from "./listening-review-types";

// Answer key entries by question id, built once per call rather than
// searched per question.
function indexAnswerKey(
  content: ListeningPartContent,
): Map<string, ListeningAnswerKeyEntry> {
  const index = new Map<string, ListeningAnswerKeyEntry>();

  content.answerKey?.forEach((entry) => {
    index.set(entry.questionId, entry);
  });

  return index;
}

// The correct option for a question, or undefined when there is no
// usable key for it.
function resolveCorrectOptionId(
  question: ListeningQuestion,
  entry?: ListeningAnswerKeyEntry,
): string | undefined {
  const candidate = entry?.correctOptionId ?? question.correctOptionId;

  if (!candidate) {
    return undefined;
  }

  // Discard a key that does not name one of this question's options.
  return question.options.some((option) => option.id === candidate)
    ? candidate
    : undefined;
}

// How many questions the part has, for example 8.
export function getTotalQuestions(content: ListeningPartContent): number {
  return countListeningQuestions(content);
}

// How many of them have an option selected.
export function getAnsweredCount(
  content: ListeningPartContent,
  answers: ListeningAnswerMap,
): number {
  return countAnsweredListeningQuestions(content, answers);
}

// Whether every question in the part has a usable correct option.
//
// An empty part returns false. There is nothing to score, so there is no
// score to show.
export function hasCompleteAnswerKey(content: ListeningPartContent): boolean {
  const questions = listListeningQuestions(content);

  if (questions.length === 0) {
    return false;
  }

  const keyIndex = indexAnswerKey(content);

  return questions.every((question) =>
    Boolean(resolveCorrectOptionId(question, keyIndex.get(question.id))),
  );
}

// How many questions have no usable key yet.
export function countMissingAnswerKeys(content: ListeningPartContent): number {
  const keyIndex = indexAnswerKey(content);

  return listListeningQuestions(content).filter(
    (question) => !resolveCorrectOptionId(question, keyIndex.get(question.id)),
  ).length;
}

// How many selected answers match a known correct option.
//
// Questions with no key are skipped rather than counted as wrong, so this
// undercounts while the key is incomplete. Gate any learner facing use of
// it on hasCompleteAnswerKey, which is what buildListeningScoreSummary
// does.
export function getCorrectCount(
  content: ListeningPartContent,
  answers: ListeningAnswerMap,
): number {
  const keyIndex = indexAnswerKey(content);

  return listListeningQuestions(content).filter((question) => {
    const correctOptionId = resolveCorrectOptionId(
      question,
      keyIndex.get(question.id),
    );

    return Boolean(correctOptionId) && answers[question.id] === correctOptionId;
  }).length;
}

// Practice score as a whole percentage, or null when it cannot be
// calculated honestly.
//
// Null means one of two things: the part has no questions, or the answer
// key is incomplete. Both are cases where a number would be a guess.
export function getScorePercent(
  content: ListeningPartContent,
  answers: ListeningAnswerMap,
): number | null {
  const total = getTotalQuestions(content);

  if (total === 0 || !hasCompleteAnswerKey(content)) {
    return null;
  }

  return Math.round((getCorrectCount(content, answers) / total) * 100);
}

// Status of one question.
//
// Order matters. An unanswered question reads as unanswered whether or
// not a key exists, because that fact is true either way and is the more
// useful thing to tell the learner.
function resolveStatus(
  selectedOptionId: string | undefined,
  correctOptionId: string | undefined,
): ListeningReviewStatus {
  if (!selectedOptionId) {
    return "unanswered";
  }

  if (!correctOptionId) {
    return "answer-key-pending";
  }

  return selectedOptionId === correctOptionId ? "correct" : "incorrect";
}

// One review row per question, in part order.
//
// Option text is resolved here rather than in the table, so the table
// renders strings and never has to look anything up.
export function buildListeningReviewRows(
  content: ListeningPartContent,
  answers: ListeningAnswerMap,
): ListeningReviewRow[] {
  const keyIndex = indexAnswerKey(content);

  return listListeningQuestions(content).map((question, index) => {
    const entry = keyIndex.get(question.id);
    const correctOptionId = resolveCorrectOptionId(question, entry);
    const selectedOptionId = answers[question.id];

    const findText = (optionId?: string) =>
      optionId
        ? question.options.find((option) => option.id === optionId)?.text
        : undefined;

    // number is display data from the content. Fall back to the position
    // in the part so a row is never numbered zero.
    const questionNumber = question.number || index + 1;

    return {
      questionId: question.id,
      questionNumber,
      label: question.prompt ?? formatListeningQuestionLabel(questionNumber),
      selectedOptionId,
      selectedOptionText: findText(selectedOptionId),
      correctOptionId,
      correctOptionText: findText(correctOptionId),
      explanation: entry?.explanation,
      status: resolveStatus(selectedOptionId, correctOptionId),
    };
  });
}

// Everything the score screen needs, in one pass.
//
// correctCount and scorePercent stay null while the key is incomplete, so
// the screen cannot print a partial result by accident.
export function buildListeningScoreSummary(
  content: ListeningPartContent,
  answers: ListeningAnswerMap,
): ListeningScoreSummary {
  const complete = hasCompleteAnswerKey(content);

  return {
    totalQuestions: getTotalQuestions(content),
    answeredCount: getAnsweredCount(content, answers),
    correctCount: complete ? getCorrectCount(content, answers) : null,
    scorePercent: complete ? getScorePercent(content, answers) : null,
    hasCompleteAnswerKey: complete,
    missingKeyCount: countMissingAnswerKeys(content),
  };
}
