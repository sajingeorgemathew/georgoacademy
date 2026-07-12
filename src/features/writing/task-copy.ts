// Centralized UI copy for the writing module. Keep all student facing
// wording here so it can be edited in one place.

export const writingCopy = {
  moduleTitle: "CELPIP Writing Practice",
  moduleSubtext:
    "Choose a writing task type and get familiar with the format before the timed writing editor and AI-supported evaluation are added.",
  progressNote:
    "Timed writing and AI-supported evaluation will be added in the next build stages.",
  promptDisclaimer:
    "These are Toronto Academy practice prompts designed to help you prepare for the CELPIP writing format.",
  practiceBadge: "Practice prompt",
  viewTaskButton: "View task",
  backToDashboard: "Back to dashboard",
  backToTasks: "Back to writing tasks",
  emptyStateMessage: "No writing tasks are available yet.",
  startWritingButton: "Timed writing coming next",
  comingSoonNote:
    "In the next step, this page will include a timed writing editor and AI-supported practice feedback.",
  timingCardTitle: "Timing and word target",
  timeLimitLabel: "Time limit",
  wordTargetLabel: "Word target",
  evaluationFocusTitle: "Evaluation focus",
  evaluationFocusSubtext:
    "When AI-supported evaluation is added, your response will be reviewed in these areas.",
  practicePromptTitle: "Practice prompt",
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
