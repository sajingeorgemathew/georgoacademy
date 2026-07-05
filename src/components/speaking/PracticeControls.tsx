import {
  practiceCopy,
  type PracticePhase,
} from "@/features/speaking/practice-flow";

const primaryButtonClasses =
  "inline-flex h-12 w-full items-center justify-center rounded-full bg-brand px-8 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-colors hover:bg-brand-dark sm:w-auto";

// The single primary action for the current phase. The complete phase
// has no button here because PracticeCompletionCard owns its actions.
export function PracticeControls({
  phase,
  onStartPreparation,
  onStartSpeaking,
  onFinishPractice,
}: {
  phase: PracticePhase;
  onStartPreparation: () => void;
  onStartSpeaking: () => void;
  onFinishPractice: () => void;
}) {
  if (phase === "complete") {
    return null;
  }

  if (phase === "preparation") {
    return (
      <p className="text-center text-sm leading-6 text-ink/60">
        {practiceCopy.preparationWaitNote}
      </p>
    );
  }

  if (phase === "intro") {
    return (
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onStartPreparation}
          className={primaryButtonClasses}
        >
          {practiceCopy.startPreparation}
        </button>
        <p className="text-xs leading-5 text-ink/50">
          {practiceCopy.noRecordingNote}
        </p>
      </div>
    );
  }

  if (phase === "ready_to_speak") {
    return (
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onStartSpeaking}
          className={primaryButtonClasses}
        >
          {practiceCopy.startSpeaking}
        </button>
      </div>
    );
  }

  // speaking: the timer auto-completes, but the student can end early.
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={onFinishPractice}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-brand ring-1 ring-brand/30 transition-colors hover:bg-brand/5 sm:w-auto"
      >
        {practiceCopy.finishPractice}
      </button>
    </div>
  );
}
