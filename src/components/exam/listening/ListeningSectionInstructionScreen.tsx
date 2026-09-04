import { ExamInstructionScreen } from "../ExamInstructionScreen";
import { ExamSectionIntroCard } from "../ExamSectionIntroCard";
import { ListeningSectionProgressBar } from "./ListeningSectionProgressBar";
import { examCopy } from "@/features/exam-engine/exam-copy";
import { listeningSectionCopy } from "@/features/exam-engine/listening-section-copy";
import type { ListeningSectionCopy } from "@/features/exam-engine/listening-section-copy";
import type { ListeningSectionInstructionContent } from "@/features/exam-engine/listening-section-types";

// Listening section instruction text screen (EXAM-15).
//
// The first screen of the full Listening run, and screen type 1 from
// docs/product/exam-engine-screen-types.md, so it is the EXAM-02
// ExamInstructionScreen with the section content filled in rather than a
// new layout. It is the section counterpart of ListeningPartIntroScreen:
// that one opens a part, this one opens the whole section.
//
// The five instruction lines, the notice and the intro card summary all
// come from the content object, which builds them from
// listening-section-copy.ts, so this component holds no wording of its
// own.
//
// The progress bar renders under the list rather than above it. The
// learner has not started a part yet, so it draws an empty bar and the
// answered count reads zero, which is the honest state and a useful
// preview of the control they will see on the transitions.
//
// No timer. Instruction screens carry no countdown.

export type ListeningSectionInstructionScreenProps = {
  content: ListeningSectionInstructionContent;
  totalParts: number;
  totalQuestions: number;
  answeredCount: number;
  copy?: ListeningSectionCopy;
  metaText?: string;
  onNext?: () => void;
  onBack?: () => void;
  showBack?: boolean;
};

export function ListeningSectionInstructionScreen({
  content,
  totalParts,
  totalQuestions,
  answeredCount,
  copy = listeningSectionCopy,
  metaText,
  onNext,
  onBack,
  showBack = false,
}: ListeningSectionInstructionScreenProps) {
  return (
    <ExamInstructionScreen
      title={content.title}
      heading={content.heading}
      subtitle={content.subtitle}
      instructions={content.instructions}
      noticeText={content.noticeText}
      metaText={metaText}
      onNext={onNext}
      onBack={onBack}
      showBack={showBack}
      intro={
        <ExamSectionIntroCard
          label={examCopy.practiceLabel}
          title={content.introTitle}
          summary={content.introSummary}
          details={content.introDetails}
        />
      }
    >
      <ListeningSectionProgressBar
        currentPart={0}
        totalParts={totalParts}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        copy={copy}
      />
    </ExamInstructionScreen>
  );
}
