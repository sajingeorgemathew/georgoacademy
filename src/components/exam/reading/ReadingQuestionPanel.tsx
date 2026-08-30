"use client";

import { Fragment } from "react";
import { ReadingQuestionList } from "./ReadingQuestionList";
import { cx } from "@/features/design/design-tokens";
import { examReading } from "@/features/exam-engine/exam-theme";
import { findReadingAnswerText } from "@/features/exam-engine/reading-flow";
import { readingCopy } from "@/features/exam-engine/reading-copy";
import type {
  ReadingAnswerMap,
  ReadingQuestionGroup,
  ReadingResponseParagraph,
} from "@/features/exam-engine/reading-types";

// One panel on the answer side of a Reading split screen (EXAM-16).
//
// Screen type 8 calls these the right hand panels. Reading Part 1 has
// two, and so do Parts 2 and 4: a set of questions about the passage,
// then a written response with blanks in it. This component draws either,
// because the only difference between them is whether the group carries a
// response.
//
// A panel is a label, an instruction line from the source document, the
// response if there is one, and the question list. It is not an ExamPanel:
// the answer column is already a tinted pane, and a bordered box drawn
// inside it would be a second border around the same content. The one
// bordered thing here is the reply itself, which is a document rather
// than a container.
//
// The reply echoes an answered blank back into its own text. Once a
// learner chooses an option for question 7, the reply reads "I've been
// wondering what my 7. best employee has been up to" rather than keeping
// the underscores, which is what makes a completion group readable as a
// letter and lets a learner check a choice against the sentence it lands
// in. The control stays in the list below: option text here runs to
// several words, so a select sitting inside the sentence would push the
// rest of the paragraph around every time the value changed.
//
// A client component, because the list under it is one. It holds no
// state: the answers are owned by the prototype at the top of the part.

export type ReadingQuestionPanelProps = {
  group: ReadingQuestionGroup;
  answers: ReadingAnswerMap;
  onSelectOption: (questionId: string, optionId: string) => void;
};

export function ReadingQuestionPanel({
  group,
  answers,
  onSelectOption,
}: ReadingQuestionPanelProps) {
  return (
    <section className={examReading.panel} aria-label={group.label}>
      {group.label ? (
        <p className={examReading.panelLabel}>{group.label}</p>
      ) : null}

      {group.instruction ? (
        <p className={examReading.panelInstruction}>{group.instruction}</p>
      ) : null}

      {group.response ? (
        <div className={examReading.response}>
          {group.response.heading ? (
            <p className={examReading.passageHeading}>
              {group.response.heading}
            </p>
          ) : null}

          {group.response.paragraphs.map((paragraph, index) => (
            <p
              // Paragraphs have no ids of their own and never reorder, so
              // the index is the stable key here.
              key={`${group.id}-response-paragraph-${index}`}
              className={examReading.passageParagraph}
            >
              <ResponseParagraph
                paragraph={paragraph}
                group={group}
                answers={answers}
              />
            </p>
          ))}

          {group.response.signOff ? (
            <div className={examReading.passageSignOff}>
              {group.response.signOff.map((line) => (
                <span key={line} className={examReading.passageSignOffLine}>
                  {line}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <ReadingQuestionList
        questions={group.questions}
        answers={answers}
        onSelectOption={onSelectOption}
      />
    </section>
  );
}

// One paragraph of a reply, with its blanks resolved against the answers.
//
// The paragraph arrives already split into text and blank segments, so
// there is nothing to parse here. A blank draws its number either way;
// what changes is whether the underscores or the chosen option text
// follow it.
function ResponseParagraph({
  paragraph,
  group,
  answers,
}: {
  paragraph: ReadingResponseParagraph;
  group: ReadingQuestionGroup;
  answers: ReadingAnswerMap;
}) {
  return (
    <>
      {paragraph.segments.map((segment, index) => {
        const key = `${group.id}-segment-${index}`;

        if (segment.kind === "text") {
          return <Fragment key={key}>{segment.text}</Fragment>;
        }

        const answerText = findReadingAnswerText(
          group.questions,
          answers,
          segment.questionId,
        );

        return (
          <Fragment key={key}>
            <span className={examReading.responseBlankNumber}>
              {segment.number}.
            </span>{" "}
            <span
              className={cx(
                answerText
                  ? examReading.responseBlankFilled
                  : examReading.responseBlank,
              )}
            >
              {answerText ?? (
                <>
                  <span aria-hidden="true">_______</span>
                  <span className="sr-only">{readingCopy.blankLabel}</span>
                </>
              )}
            </span>
          </Fragment>
        );
      })}
    </>
  );
}
