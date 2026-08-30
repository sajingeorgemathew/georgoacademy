import type { ReactNode } from "react";
import { ExamTwoColumnLayout } from "../ExamTwoColumnLayout";
import { readingCopy } from "@/features/exam-engine/reading-copy";
import type { ExamPanelScroll } from "@/features/exam-engine/exam-shell-types";

// The Reading split, with the decisions a Reading part always makes
// (EXAM-16).
//
// A thin wrapper over the shared ExamTwoColumnLayout rather than a new
// layout, because the shared one already draws the divider, the answer
// side wash and the stacked fallback on a narrow window. What it does not
// carry is what every Reading part wants and no Listening screen does:
//
// - both columns scroll on their own, so a long passage never pushes the
//   questions off the screen and neither column can make the page scroll
// - the labels are the Reading labels, in one place instead of on each of
//   the four part screens
// - no outer rule, because the split fills an unpadded canvas and the
//   canvas border is already drawing one
//
// It exists so Reading Parts 2, 3 and 4 inherit those decisions rather
// than each restating them, which is how the four parts stay one screen
// type. Part 2 is the diagram variant and will pass an image as left; it
// needs nothing else from this component that Part 1 does not.
//
// Both columns scroll at the same fixed height rather than filling
// whatever the window has left. A height that tracks the viewport reads
// better on a large monitor, but it depends on every ancestor between
// here and the exam frame having a definite height, and the frame is
// rendered both inside the locked exam viewport and, on a development
// route, inside an ordinary page. A fixed limit behaves identically in
// both, and the exam canvas already scrolls whatever is left over on a
// short window.

export type ReadingTwoColumnLayoutProps = {
  // The passage, the diagram, or the article.
  passage: ReactNode;
  // The question panels.
  questions: ReactNode;
  passageLabel?: string;
  questionsLabel?: string;
  // How tall each column runs before it scrolls. Both default to the
  // tallest step, which is what a Reading part wants.
  passageScroll?: ExamPanelScroll;
  questionsScroll?: ExamPanelScroll;
  className?: string;
};

export function ReadingTwoColumnLayout({
  passage,
  questions,
  passageLabel = readingCopy.passageColumnLabel,
  questionsLabel = readingCopy.questionsColumnLabel,
  passageScroll = "tall",
  questionsScroll = "tall",
  className,
}: ReadingTwoColumnLayoutProps) {
  return (
    <ExamTwoColumnLayout
      left={passage}
      right={questions}
      leftLabel={passageLabel}
      rightLabel={questionsLabel}
      leftScroll={passageScroll}
      rightScroll={questionsScroll}
      bordered={false}
      className={className}
    />
  );
}
