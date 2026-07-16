// Centralized UI copy for the writing module. Keep all student facing
// wording here so it can be edited in one place.

export const writingCopy = {
  moduleTitle: "CELPIP Writing Practice",
  moduleSubtext:
    "Choose a writing task type and practice with a timed writing editor and a live word count.",
  progressNote: "AI-supported evaluation will be added next.",
  promptDisclaimer:
    "These are Toronto Academy practice prompts designed to help you prepare for the CELPIP writing format.",
  practiceBadge: "Practice prompt",
  viewTaskButton: "View task",
  backToDashboard: "Back to dashboard",
  backToTasks: "Back to writing tasks",
  emptyStateMessage: "No writing tasks are available yet.",
  startWritingButton: "Start timed writing",
  startWritingNote:
    "You will see the prompt again with a timer, a word target, and a writing editor. AI-supported evaluation will be added next.",
  timingCardTitle: "Timing and word target",
  timeLimitLabel: "Time limit",
  wordTargetLabel: "Word target",
  evaluationFocusTitle: "Evaluation focus",
  evaluationFocusSubtext:
    "When AI-supported evaluation is added, your response will be reviewed in these areas.",
  practicePromptTitle: "Practice prompt",
} as const;

// Copy for the timed writing practice screen and its API errors.
export const writingPracticeCopy = {
  screenBadge: "Timed writing",
  backToTask: "Back to task",
  backToTasks: "Back to writing tasks",
  timerLabel: "Time remaining",
  startCardTitle: "Ready to write?",
  startCardNote:
    "The timer starts when you click Start writing. You can submit your response at any time.",
  startWriting: "Start writing",
  timeLimitLabel: "Time limit",
  wordTargetLabel: "Word target",
  evaluationFocusTitle: "Evaluation focus",
  timeEndedWarning:
    "Time is up. Your response was not submitted automatically. Review it and submit when you are ready.",
  editorLabel: "Your response",
  editorPlaceholder: "Type your response here.",
  wordsLabel: "Words",
  targetLabel: "Target",
  belowTarget: "Below target",
  withinTarget: "Within target",
  aboveTarget: "Above target",
  targetGuidanceNote: "The word target is guidance only.",
  submitResponse: "Submit response",
  submitting: "Saving response...",
  tooShortMessage: "Please write a longer response before submitting.",
  savedHeading: "Writing response saved",
  savedBody:
    "Your writing response has been saved. In the next step, AI-supported evaluation will review your task fulfillment, organization, vocabulary, grammar, tone, and clarity.",
  tryAnotherTask: "Try another writing task",
  errors: {
    invalidRequest: "That request could not be processed. Please try again.",
    sessionExpired: "Your session has expired. Please log in again.",
    taskNotFound: "This writing task is not available.",
    saveFailed: "Could not save your writing response. Please try again.",
  },
} as const;

// Default evaluation focus areas shown when a task has none stored.
export const DEFAULT_EVALUATION_FOCUS = [
  "Task fulfillment",
  "Organization and coherence",
  "Vocabulary",
  "Grammar and sentence control",
  "Tone and clarity",
] as const;

// Group headings and short card descriptions per stable task_type value.
export const taskTypeGroupTitles: Record<string, string> = {
  writing_email: "Task 1 - Writing an Email",
  writing_survey_response: "Task 2 - Responding to Survey Questions",
};

export const taskShortDescriptions: Record<string, string> = {
  writing_email:
    "Write a clear, well organized email in response to an everyday situation.",
  writing_survey_response:
    "Choose a position on a survey question and support it with reasons and examples.",
};
