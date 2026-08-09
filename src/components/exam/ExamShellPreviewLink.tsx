import Link from "next/link";
import { cx, focus } from "@/features/design/design-tokens";
import { examCopy } from "@/features/exam-engine/exam-copy";
import { listeningCopy } from "@/features/exam-engine/listening-copy";

// Temporary dashboard entry point for the exam engine previews.
//
// EXAM-01 added the shell preview link. EXAM-02 added the instruction
// screens preview beside it, EXAM-03 added the Listening Part 1
// prototype, EXAM-05 added the Listening Part 2 prototype, EXAM-07 added
// the Listening Part 3 prototype, EXAM-09 added the Listening Part 4
// prototype, EXAM-11 added the Listening Part 5 prototype, and EXAM-13
// added the Listening Part 6 prototype, so all eight internal routes are
// reachable from one place.
//
// The six Listening entries are prototypes built on real Mock Test 1
// content, not placeholder text, which is why their descriptions say so.
// They are still internal previews and not student facing mock test
// entries.
//
// The preview routes are not in navigation and never should be, so
// without these cards the only way to reach them is by typing the URL.
// They are deliberately styled as internal notes rather than practice
// module cards: dashed rule, no artwork, and the words Internal preview
// first, so a learner who sees one cannot mistake it for a practice test.
//
// The exported name is unchanged so src/app/dashboard/page.tsx does not
// need editing. Remove this component, and its call in that page, once
// the real practice test entry points ship.

const PREVIEW_LINKS = [
  {
    href: "/dashboard/mock-tests/shell-preview",
    title: examCopy.previewTitle,
    description:
      "Layout preview of the practice test screen shell, using placeholder text only.",
  },
  {
    href: "/dashboard/mock-tests/instruction-preview",
    title: examCopy.instructionPreviewTitle,
    description:
      "Layout preview of the instruction and instructional video screens, using placeholder instruction text.",
  },
  {
    href: "/dashboard/mock-tests/mock-test-1/listening/part-1",
    title: listeningCopy.previewTitle,
    description: listeningCopy.previewDescription,
  },
  {
    href: "/dashboard/mock-tests/mock-test-1/listening/part-2",
    title: listeningCopy.part2PreviewTitle,
    description: listeningCopy.part2PreviewDescription,
  },
  {
    href: "/dashboard/mock-tests/mock-test-1/listening/part-3",
    title: listeningCopy.part3PreviewTitle,
    description: listeningCopy.part3PreviewDescription,
  },
  {
    href: "/dashboard/mock-tests/mock-test-1/listening/part-4",
    title: listeningCopy.part4PreviewTitle,
    description: listeningCopy.part4PreviewDescription,
  },
  {
    href: "/dashboard/mock-tests/mock-test-1/listening/part-5",
    title: listeningCopy.part5PreviewTitle,
    description: listeningCopy.part5PreviewDescription,
  },
  {
    href: "/dashboard/mock-tests/mock-test-1/listening/part-6",
    title: listeningCopy.part6PreviewTitle,
    description: listeningCopy.part6PreviewDescription,
  },
];

export function ExamShellPreviewLink() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {PREVIEW_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cx(
            "block rounded-lg border border-dashed border-academy-navy/30 bg-academy-navy-soft/30 px-5 py-4 transition-colors hover:border-academy-blue hover:bg-academy-blue-soft",
            focus.ring,
          )}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-academy-navy/60">
            {examCopy.previewBadge}
          </p>
          <p className="mt-1 text-sm font-semibold text-academy-navy">
            {link.title}
          </p>
          <p className="mt-1 text-sm leading-6 text-academy-navy/70">
            {link.description} Temporary link for internal review.
          </p>
        </Link>
      ))}
    </div>
  );
}
