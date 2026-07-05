// Phase model and copy for the timed speaking practice flow.
// The flow is a simple forward-only state machine:
// intro -> preparation -> ready_to_speak -> speaking -> complete

export const PRACTICE_PHASES = [
  "intro",
  "preparation",
  "ready_to_speak",
  "speaking",
  "complete",
] as const;

export type PracticePhase = (typeof PRACTICE_PHASES)[number];

// Safe task data passed from the server page into the client timer shell.
// This is the only task shape client components should receive.
export type PracticeTask = {
  id: string;
  title: string;
  prompt: string;
  taskType: string;
  taskNumber: number;
  prepSeconds: number;
  speakingSeconds: number;
  scoringFocus: string[];
};

// Fallback timings used only if a task row is missing its details.
// Seeded tasks always have speaking_task_details, so these are a guard.
export const DEFAULT_PREP_SECONDS = 30;
export const DEFAULT_SPEAKING_SECONDS = 60;

// Student facing copy for the practice screen, kept in one place so
// wording can be edited without touching components.
export const practiceCopy = {
  screenBadge: "Timed practice",
  startPreparation: "Start preparation",
  startSpeaking: "Start speaking time",
  finishPractice: "Finish practice",
  backToTask: "Back to task",
  practiceAnotherTask: "Practice another task",
  backToTasks: "Back to speaking tasks",
  completionHeading: "Timed practice complete",
  completionText:
    "Recording and AI-supported feedback will be added in the next step. For now, use this timed flow to get familiar with the pace of the speaking task.",
  prepTimerLabel: "Preparation time",
  speakingTimerLabel: "Speaking time",
  preparationWaitNote:
    "Speaking time will unlock when preparation time ends.",
  noRecordingNote:
    "No audio is recorded in this timed practice session.",
} as const;

// Label and next-step hint shown for each phase.
export type PracticePhaseInfo = {
  label: string;
  hint: string;
};

export const practicePhaseInfo: Record<PracticePhase, PracticePhaseInfo> = {
  intro: {
    label: "Get ready",
    hint: "Read the practice prompt, then start your preparation time.",
  },
  preparation: {
    label: "Preparation time",
    hint: "Plan your answer. The next step starts when the timer ends.",
  },
  ready_to_speak: {
    label: "Ready to speak",
    hint: "Preparation is complete. Start your speaking time when you are ready.",
  },
  speaking: {
    label: "Speaking time",
    hint: "Speak your answer out loud until the timer ends, or finish early.",
  },
  complete: {
    label: "Practice complete",
    hint: "You finished the timed flow for this task.",
  },
};

// Step position for the phase indicator, for example "Step 2 of 4".
// intro and preparation share a step because intro is just the gate
// that starts preparation.
const PHASE_STEPS: Record<PracticePhase, number> = {
  intro: 1,
  preparation: 2,
  ready_to_speak: 3,
  speaking: 4,
  complete: 4,
};

export const PRACTICE_STEP_COUNT = 4;

export function getPhaseStep(phase: PracticePhase): number {
  return PHASE_STEPS[phase];
}

// The phase that follows a finished countdown or a user action.
export function getNextPhase(phase: PracticePhase): PracticePhase | null {
  const index = PRACTICE_PHASES.indexOf(phase);
  if (index < 0 || index >= PRACTICE_PHASES.length - 1) {
    return null;
  }
  return PRACTICE_PHASES[index + 1];
}
