import {
  getWritingStatusLabel,
  getWritingStatusTone,
  type WritingStatusTone,
} from "@/features/writing/writing-status-labels";

// Pill colors per status tone. Ready uses the brand accent, working
// states stay warm, and failed states use a soft alert red.
const TONE_CLASSES: Record<WritingStatusTone, string> = {
  ready: "bg-brand/10 text-brand",
  working: "bg-amber-100/70 text-amber-800",
  failed: "bg-red-100/70 text-red-700",
  neutral: "bg-ink/5 text-ink/60",
};

// Small status pill for a writing attempt, shown in history rows and
// recent attempt cards.
export function WritingAttemptStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${TONE_CLASSES[getWritingStatusTone(status)]}`}
    >
      {getWritingStatusLabel(status)}
    </span>
  );
}
