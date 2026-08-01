import Link from "next/link";
import { cx, focus } from "@/features/design/design-tokens";
import { examCopy } from "@/features/exam-engine/exam-copy";

// Temporary dashboard entry point for the exam shell preview (EXAM-01).
//
// The preview route is not linked from navigation and never should be, so
// without this card the only way to reach it is by typing the URL. It is
// deliberately styled as an internal note rather than a practice module
// card: dashed rule, no artwork, and the words Internal preview first, so
// a learner who sees it cannot mistake it for a practice test.
//
// Remove this card, and its call in src/app/dashboard/page.tsx, once the
// real practice test entry points ship.

const PREVIEW_HREF = "/dashboard/mock-tests/shell-preview";

export function ExamShellPreviewLink() {
  return (
    <Link
      href={PREVIEW_HREF}
      className={cx(
        "block rounded-lg border border-dashed border-academy-navy/30 bg-academy-navy-soft/30 px-5 py-4 transition-colors hover:border-academy-blue hover:bg-academy-blue-soft",
        focus.ring,
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-academy-navy/60">
        {examCopy.previewBadge}
      </p>
      <p className="mt-1 text-sm font-semibold text-academy-navy">
        {examCopy.previewTitle}
      </p>
      <p className="mt-1 text-sm leading-6 text-academy-navy/70">
        Layout preview of the practice test screen shell, using placeholder
        text only. Temporary link for internal review.
      </p>
    </Link>
  );
}
