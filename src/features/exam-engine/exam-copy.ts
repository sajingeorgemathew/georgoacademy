// Learner facing wording for the practice test engine shell (EXAM-01).
//
// All exam chrome copy lives here so the frame, the timers, and the
// placeholders say the same thing everywhere. Wording follows the rules
// in docs/product/exam-engine-reference-audit.md section 9: this is
// Toronto Academy practice software, never the official CELPIP test.
//
// Strings and pure helpers only, no side effects, so this file is safe to
// import from a client component.
//
// House style: normal hyphens only, no long hyphens or em dashes.

import { PRACTICE_ESTIMATE_DISCLAIMER } from "@/features/dashboard/dashboard-copy";
import type { ExamMediaKind } from "./exam-shell-types";

export const examCopy = {
  // Approved product wording. Screen titles are built from these, never
  // from official test wording.
  engineName: "Toronto Academy practice test engine",
  practiceLabel: "CELPIP-style practice",
  practiceTestName: "Toronto Academy practice test",

  // Frame controls.
  nextLabel: "Next",
  backLabel: "Back",
  nextAriaLabel: "Go to the next screen",
  backAriaLabel: "Go back to the previous screen",

  // Timer labels used in the top bar.
  timeRemainingLabel: "Time remaining",
  preparationLabel: "Preparation",
  recordingLabel: "Recording",
  timeExpiredValue: "Time is up",

  // Instruction row.
  infoIconLabel: "Information",
  instructionsHeading: "Instructions:",

  // Media placeholder. A fixed duration on an inert transport strip, so
  // the grey audio and video boxes look like the real thing without any
  // player behind them.
  mediaPlaceholderTime: "0:00",

  // Internal preview route. This wording marks the shell preview as a
  // staff facing page, so nobody mistakes it for a practice test.
  previewBadge: "Internal preview",
  previewTitle: "Practice test shell preview",
  previewSummary:
    "Internal preview of the practice test screen shell. Layout only, with placeholder text in every sample. No practice test content, no official screenshot, and no CELPIP branding appears here.",

  // The one estimate disclaimer used across the app. Reused, not
  // rewritten, so the exam engine and the dashboard cannot drift.
  practiceEstimateDisclaimer: PRACTICE_ESTIMATE_DISCLAIMER,
} as const;

// Default label and helper text per placeholder media kind. A screen can
// override either one.
export const examMediaCopy: Record<
  ExamMediaKind,
  { label: string; helper: string }
> = {
  audio: {
    label: "Audio clip",
    helper:
      "Audio placeholder. The practice test player is added in a later ticket.",
  },
  video: {
    label: "Video clip",
    helper:
      "Video placeholder. The practice test player is added in a later ticket.",
  },
  image: {
    label: "Image",
    helper:
      "Image placeholder. Practice test images are added in a later ticket.",
  },
};

// Question position line, for example Question 3 of 8.
export function formatExamProgress(current: number, total: number): string {
  return `Question ${current} of ${total}`;
}

// Timer reading, for example Time remaining: 9 minutes.
export function formatExamTimerReading(label: string, value: string): string {
  return `${label}: ${value}`;
}
