import { ExamInstructionScreen } from "../ExamInstructionScreen";
import { ExamSectionIntroCard } from "../ExamSectionIntroCard";
import { examCopy } from "@/features/exam-engine/exam-copy";
import { readingCopy } from "@/features/exam-engine/reading-copy";
import type { ExamSectionIntroDetail } from "@/features/exam-engine/instruction-screen-types";
import type { ReadingPartContent } from "@/features/exam-engine/reading-types";

// Part intro screen for a Reading part (EXAM-16).
//
// Screen type 1 from docs/product/exam-engine-screen-types.md, so it is
// the EXAM-02 ExamInstructionScreen with the part content filled in
// rather than a new layout, exactly as ListeningPartIntroScreen is. The
// part name, the bullets and the counts all come from the content object,
// so this component holds no Mock Test 1 text of its own.
//
// It is a separate component from the Listening one rather than a shared
// intro screen, because the two read different content types and the
// facts on the card differ: a Listening part states how it is delivered
// and, where it applies, how many conversation sections it has, and a
// Reading part states how long it runs. Merging them would mean a props
// object that is mostly optional and mostly unused by either caller.
//
// The time row is the one place the part allowance is shown to a learner,
// and it is shown as minutes rather than as a clock. It is a plan for the
// part, not a reading of anything.
//
// No timer. The part intro screen carries no countdown: the window starts
// when the passage does.

// Minutes, rounded, for the intro card. A Reading part allowance is a
// whole number of minutes in every source we hold, so nothing here has to
// print seconds.
function formatMinutes(seconds: number): string {
  const minutes = Math.round(seconds / 60);

  return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
}

export type ReadingPartIntroScreenProps = {
  content: ReadingPartContent;
  questionCount: number;
  // What the learner will be given, for example "Message, response and
  // drop-down questions".
  formatLabel?: string;
  // Replaces the whole detail list, for a part whose facts are not the
  // usual three.
  details?: ExamSectionIntroDetail[];
  metaText?: string;
  onNext?: () => void;
  onBack?: () => void;
  showBack?: boolean;
};

export function ReadingPartIntroScreen({
  content,
  questionCount,
  formatLabel = readingCopy.partIntroFormatLabel,
  details,
  metaText,
  onNext,
  onBack,
  showBack = true,
}: ReadingPartIntroScreenProps) {
  const introDetails: ExamSectionIntroDetail[] = details ?? [
    { label: "Questions", value: String(questionCount) },
    { label: "Time", value: formatMinutes(content.timer.seconds) },
    { label: "Format", value: formatLabel },
  ];

  return (
    <ExamInstructionScreen
      title={content.title}
      subtitle={content.subtitle ?? readingCopy.partIntroSubtitle}
      instructions={content.instructions}
      noticeText={readingCopy.partIntroNotice}
      metaText={metaText}
      onNext={onNext}
      onBack={onBack}
      showBack={showBack}
      intro={
        <ExamSectionIntroCard
          label={examCopy.practiceLabel}
          title={content.partTitle}
          summary={content.summary}
          details={introDetails}
        />
      }
    />
  );
}
