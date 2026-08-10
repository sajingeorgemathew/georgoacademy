import { AppButtonLink } from "@/components/app/AppButtonLink";
import { AppCard } from "@/components/app/AppCard";
import { AppSectionHeader } from "@/components/app/AppSectionHeader";
import { AppStatusBadge } from "@/components/app/AppStatusBadge";
import { cx, text } from "@/features/design/design-tokens";
import { listeningCopy } from "@/features/exam-engine/listening-copy";

// Mock test entry point on the learner dashboard (EXAM-15A).
//
// This replaces ExamShellPreviewLink, which grew one dashed "Internal
// preview" card per ticket until nine of them sat on the dashboard: the
// shell preview, the instruction preview, the six Listening part
// prototypes, and the full Listening section. Eight of the nine were
// internal build steps that a learner had no reason to see, and the one
// that mattered was last in the list and dressed the same as the rest.
//
// So the dashboard now shows one card, for the route that runs the whole
// Listening section:
//
//   /dashboard/mock-tests/mock-test-1/listening
//
// These routes lost their card and kept working. They are the way to
// check a single part during development, and they open normally when
// the URL is typed:
//
//   /dashboard/mock-tests/shell-preview
//   /dashboard/mock-tests/instruction-preview
//   /dashboard/mock-tests/mock-test-1/listening/part-1
//   /dashboard/mock-tests/mock-test-1/listening/part-2
//   /dashboard/mock-tests/mock-test-1/listening/part-3
//   /dashboard/mock-tests/mock-test-1/listening/part-4
//   /dashboard/mock-tests/mock-test-1/listening/part-5
//   /dashboard/mock-tests/mock-test-1/listening/part-6
//
// Nothing was deleted to hide them. They are simply not linked from
// anywhere, and they all carry robots noindex already.
//
// The card is deliberately styled as a real practice module card rather
// than an internal note: solid panel, a plain Available pill, and no
// Internal preview badge. The wording is the student facing entry point
// wording the product will keep. The prototype caveats did not go away,
// they moved to where they belong, which is the standing notice on the
// route itself: nothing is saved, media can be replayed, the timer is
// static, and the practice score is not an official CELPIP score.

const LISTENING_TEST_HREF = "/dashboard/mock-tests/mock-test-1/listening";

// Short facts under the description. Plain text, not controls.
const CARD_META = [
  listeningCopy.fullSectionCardSectionLabel,
  listeningCopy.fullSectionCardPartsLabel,
  listeningCopy.fullSectionCardQuestionsLabel,
];

export function DashboardMockTestCard() {
  return (
    <section aria-label={listeningCopy.mockTestsHeading}>
      <AppSectionHeader
        title={listeningCopy.mockTestsHeading}
        description={listeningCopy.mockTestsDescription}
      />

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <AppCard as="article" padding="compact" className="flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <h3 className={cx(text.heading, "min-w-0 text-lg")}>
              {listeningCopy.fullSectionCardTitle}
            </h3>

            <AppStatusBadge tone="success" className="shrink-0">
              {listeningCopy.fullSectionCardStatusLabel}
            </AppStatusBadge>
          </div>

          <p className={cx("mt-3 text-sm leading-6", text.secondary)}>
            {listeningCopy.fullSectionCardDescription}
          </p>

          <ul
            className={cx(
              "mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold",
              text.muted,
            )}
          >
            {CARD_META.map((item, index) => (
              <li key={item} className="flex items-center gap-2">
                {index > 0 ? (
                  <span aria-hidden className="text-academy-navy/30">
                    /
                  </span>
                ) : null}
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-5">
            <AppButtonLink href={LISTENING_TEST_HREF} size="md">
              {listeningCopy.fullSectionCardCtaLabel}
            </AppButtonLink>
          </div>
        </AppCard>
      </div>
    </section>
  );
}
