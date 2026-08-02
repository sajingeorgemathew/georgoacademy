import { ExamInstructionRow } from "../ExamInstructionRow";
import { ExamShell } from "../ExamShell";
import { ListeningAudioPlayer } from "./ListeningAudioPlayer";
import { examListening, examScreenBody } from "@/features/exam-engine/exam-theme";
import { listeningCopy } from "@/features/exam-engine/listening-copy";

// Conversation audio screen for a Listening part (EXAM-03).
//
// Screen type 4 from docs/product/exam-engine-screen-types.md: one clip,
// nothing else on the screen to read while it plays. The instruction row
// sits above the player and the section label goes in the top bar, so the
// canvas stays quiet.
//
// No timer. The ticket hides the timer on the conversation screens,
// because in this prototype nothing is counting down and the clip can be
// replayed.
//
// The prototype does not gate Next on the clip finishing. When that
// arrives, pass onAudioEnded and hold nextDisabled until it fires. The
// prop is here already so that change does not need a new component.

export type ListeningAudioScreenProps = {
  title: string;
  audioSrc: string;
  // Learner facing clip name, for example "Conversation audio".
  audioTitle?: string;
  durationLabel?: string;
  // Section position, for example "Section 2 of 3".
  sectionLabel?: string;
  metaText?: string;
  onAudioEnded?: () => void;
  onNext?: () => void;
  onBack?: () => void;
  showBack?: boolean;
  nextDisabled?: boolean;
};

export function ListeningAudioScreen({
  title,
  audioSrc,
  audioTitle = listeningCopy.conversationPlayerTitle,
  durationLabel,
  sectionLabel,
  metaText,
  onAudioEnded,
  onNext,
  onBack,
  showBack = true,
  nextDisabled = false,
}: ListeningAudioScreenProps) {
  return (
    <ExamShell
      title={title}
      metaText={metaText}
      onNext={onNext}
      onBack={onBack}
      showBack={showBack}
      nextDisabled={nextDisabled}
    >
      <div className={examScreenBody.stack}>
        <ExamInstructionRow
          heading={sectionLabel}
          text={listeningCopy.conversationInstruction}
        />

        <div className={examListening.mediaStack}>
          <ListeningAudioPlayer
            src={audioSrc}
            title={audioTitle}
            durationLabel={durationLabel}
            onEnded={onAudioEnded}
          />

          <p className={examScreenBody.hint}>
            {listeningCopy.conversationHint}
          </p>
        </div>
      </div>
    </ExamShell>
  );
}
