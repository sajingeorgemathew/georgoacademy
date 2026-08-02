import { ExamInstructionScreen } from "../ExamInstructionScreen";
import { ExamSectionIntroCard } from "../ExamSectionIntroCard";
import { examCopy } from "@/features/exam-engine/exam-copy";
import { listeningCopy } from "@/features/exam-engine/listening-copy";
import type { ListeningPartContent } from "@/features/exam-engine/listening-types";

// Part intro screen for a Listening part (EXAM-03).
//
// Screen type 1 from docs/product/exam-engine-screen-types.md, so it is
// the EXAM-02 ExamInstructionScreen with the part content filled in
// rather than a new layout. The part name, the bullets and the counts all
// come from the content object, so this component holds no Mock Test 1
// text of its own.
//
// The intro card carries the two facts a learner wants before they start:
// how many conversation sections there are, and how many questions.
//
// No timer. The part intro screen carries no countdown.

export type ListeningPartIntroScreenProps = {
  content: ListeningPartContent;
  questionCount: number;
  metaText?: string;
  onNext?: () => void;
  onBack?: () => void;
  showBack?: boolean;
};

export function ListeningPartIntroScreen({
  content,
  questionCount,
  metaText,
  onNext,
  onBack,
  showBack = true,
}: ListeningPartIntroScreenProps) {
  return (
    <ExamInstructionScreen
      title={content.title}
      subtitle={content.subtitle ?? listeningCopy.partIntroSubtitle}
      instructions={content.instructions}
      noticeText={listeningCopy.partIntroNotice}
      metaText={metaText}
      onNext={onNext}
      onBack={onBack}
      showBack={showBack}
      intro={
        <ExamSectionIntroCard
          label={examCopy.practiceLabel}
          title={content.partTitle}
          summary={content.scenario.text}
          details={[
            { label: "Sections", value: String(content.sections.length) },
            { label: "Questions", value: String(questionCount) },
            { label: "Format", value: "Audio and questions" },
          ]}
        />
      }
    />
  );
}
