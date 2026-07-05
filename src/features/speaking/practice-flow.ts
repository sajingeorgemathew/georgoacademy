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
  moduleId: string;
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
    "This session ended without a saved recording. Run the timed practice again and record your answer during speaking time to save a response.",
  prepTimerLabel: "Preparation time",
  speakingTimerLabel: "Speaking time",
  preparationWaitNote:
    "Speaking time will unlock when preparation time ends.",
  introRecordingNote:
    "You can record your speaking answer during speaking time. Your recording stays private in your practice account.",
} as const;

// Student facing copy for the recording and upload flow.
export const recordingCopy = {
  sectionLabel: "Record your speaking answer",
  privacyNote: "Your recording stays private in your practice account.",
  startRecording: "Start recording",
  stopRecording: "Stop recording",
  tryRecordingAgain: "Try recording again",
  reRecord: "Re-record answer",
  submitRecording: "Submit recording",
  submitting: "Saving your recording",
  playbackHeading: "Review your recording",
  playbackNote:
    "Listen to your answer. You can re-record before you submit.",
  recordedLengthLabel: "Recorded length",
  successHeading: "Recording saved",
  successText:
    "Your speaking response has been saved. In the next step, this recording will be transcribed and used to generate AI-supported practice feedback.",
  statusIdle: "Start recording when you are ready to speak your answer.",
  statusRequesting:
    "Waiting for microphone access. Please allow microphone use in your browser.",
  statusRecording: "Recording in progress",
  statusFinishing: "Finishing your recording.",
  statusRecorded: "Recording complete. Review your answer below.",
  statusUploading: "Saving your recording. Please keep this page open.",
  statusUploaded: "Recording saved.",
  errors: {
    notSupported:
      "Audio recording is not available in this browser. Please open this page in an up to date browser such as Chrome or Safari.",
    permissionDenied:
      "Microphone access was blocked. Please allow microphone access in your browser settings and try again.",
    recordingFailed:
      "We could not complete your recording. Please try again.",
    uploadFailed:
      "We could not upload your recording. Please check your connection and try again.",
    attemptSaveFailed:
      "We could not save your practice attempt. Please try again.",
    sessionExpired:
      "Your session has ended. Please sign in again to submit your recording.",
  },
} as const;

// Student facing copy for the transcription step. Server code reuses
// the error messages so the API and the UI always say the same thing.
export const transcriptCopy = {
  generate: "Generate transcript",
  generating: "Preparing your transcript",
  generatingNote:
    "This usually takes a few seconds. Please keep this page open.",
  readyHeading: "Transcript ready",
  readyText:
    "Your transcript is ready. AI-supported feedback will be added in the next step.",
  transcriptLabel: "Your transcript",
  tryAgain: "Try again",
  errors: {
    invalidRequest:
      "We could not read that request. Please refresh the page and try again.",
    sessionExpired:
      "Your session has ended. Please sign in again to generate your transcript.",
    requestFailed:
      "We could not generate your transcript. Please try again.",
    attemptNotFound:
      "We could not find this practice attempt. Please record a new answer.",
    attemptNotOwned:
      "This practice attempt does not belong to your account.",
    audioMissing:
      "This attempt does not have a saved recording, so it cannot be transcribed. Please record a new answer.",
    audioDownloadFailed:
      "We could not load your saved recording. Please try again.",
    notConfigured:
      "Transcription is not available right now. Please try again later.",
    transcriptionFailed:
      "We could not transcribe your recording. Please try again.",
    transcriptSaveFailed:
      "We could not save your transcript. Please try again.",
  },
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
    hint: "Record your answer out loud before the timer ends, or finish early.",
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
