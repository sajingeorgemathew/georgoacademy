import { AppButtonLink } from "@/components/app/AppButtonLink";
import { AppCard } from "@/components/app/AppCard";
import { AppSectionHeader } from "@/components/app/AppSectionHeader";
import { AppStatusBadge } from "@/components/app/AppStatusBadge";
import { cx, text } from "@/features/design/design-tokens";
import { listeningCopy } from "@/features/exam-engine/listening-copy";
import {
  formatReadingSectionGroupCount,
  readingCopy,
  readingSectionCopy,
} from "@/features/exam-engine/reading-copy";
import { countReadingSectionQuestions } from "@/features/exam-engine/reading-section-flow";
import { mockTest1ReadingSection } from "@/features/exam-engine/mock-tests/mock-test-1/reading-section";

// Mock test entry point on the learner dashboard (EXAM-15A, Reading
// internal preview cards added by EXAM-18, cut back to one by EXAM-24).
//
// This replaces ExamShellPreviewLink, which grew one dashed "Internal
// preview" card per ticket until nine of them sat on the dashboard: the
// shell preview, the instruction preview, the six Listening part
// prototypes, and the full Listening section. Eight of the nine were
// internal build steps that a learner had no reason to see, and the one
// that mattered was last in the list and dressed the same as the rest.
//
// The Reading cards went the same way. EXAM-18, EXAM-20 and EXAM-22 each
// added a part card, because every Reading route runs in exam mode, an
// exam mode route carries no dashboard chrome and no preview label, and
// so the only way to open one was to paste its URL. By the time the
// fourth arrived there were five Reading cards beside the Listening one,
// and four of the five were internal build steps rather than the thing a
// learner opens.
//
// So the dashboard shows two cards, one per built section, for the two
// routes that run a whole section:
//
//   /dashboard/mock-tests/mock-test-1/listening
//   /dashboard/mock-tests/mock-test-1/reading
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
//   /dashboard/mock-tests/mock-test-1/reading/part-1
//   /dashboard/mock-tests/mock-test-1/reading/part-2
//   /dashboard/mock-tests/mock-test-1/reading/part-3
//   /dashboard/mock-tests/mock-test-1/reading/part-4
//
// Nothing was deleted to hide them. They are simply not linked from
// anywhere, and they all carry robots noindex already. The four Reading
// part routes are still listed in exam-mode-routes.ts, so a typed URL
// still opens the locked exam surface it always did.
//
// The Listening card is deliberately styled as a real practice module
// card rather than an internal note: solid panel, a plain Available pill,
// and no Internal preview badge. The wording is the student facing entry
// point wording the product will keep. The prototype caveats did not go
// away, they moved to where they belong, which is the standing notice on
// the route itself: nothing is saved, media can be replayed, the timer is
// static, and the practice score is not an official CELPIP score.
//
// The Reading card beside it is still dressed as an internal build link,
// following the rule ExamShellPreviewLink set: a tinted panel with a
// dashed rule rather than the solid one, an Internal preview badge where
// the Available pill sits, and a secondary button rather than the navy
// call to action. The layout underneath is the Listening layout, so the
// two read as one section rather than as two designs. It stays a preview
// card because the Reading run keeps the prototype behaviour its ticket
// left in place, no strict section timing and a Back button that works
// throughout, and a card dressed as a released module would be claiming
// otherwise.
//
// What neither card says, because none of it is true yet: that a full
// all-skills Mock Test 1 exists, or that any of this produces an official
// CELPIP result. Two sections of four are built.

const LISTENING_TEST_HREF = "/dashboard/mock-tests/mock-test-1/listening";

// The full Reading section question count, for example "38 questions".
//
// Counted from the four content files at module load rather than written
// down, so the card and the score denominator can never disagree. It is
// safe to read the content here because this is a server component and
// the only thing that crosses to the browser is the finished string: the
// answer keys inside that content object are never rendered and never
// passed as a prop.
const READING_SECTION_QUESTION_COUNT = formatReadingSectionGroupCount(
  countReadingSectionQuestions(mockTest1ReadingSection),
);

// Short facts under the description. Plain text, not controls.
const CARD_META = [
  listeningCopy.fullSectionCardSectionLabel,
  listeningCopy.fullSectionCardPartsLabel,
  listeningCopy.fullSectionCardQuestionsLabel,
];

// The Reading facts line. Parts 1 to 4, and the counted total.
const READING_CARD_META = [
  readingSectionCopy.dashboardCardSectionLabel,
  readingSectionCopy.dashboardCardPartsLabel,
  READING_SECTION_QUESTION_COUNT,
];

const READING_TEST_HREF = "/dashboard/mock-tests/mock-test-1/reading";

// The slash separated facts line, shared by both cards so the Reading one
// reads the same way as the Listening one.
function CardMetaList({ items }: { items: readonly string[] }) {
  return (
    <ul
      className={cx(
        "mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold",
        text.muted,
      )}
    >
      {items.map((item, index) => (
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
  );
}

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

          <CardMetaList items={CARD_META} />

          <div className="mt-auto pt-5">
            <AppButtonLink href={LISTENING_TEST_HREF} size="md">
              {listeningCopy.fullSectionCardCtaLabel}
            </AppButtonLink>
          </div>
        </AppCard>

        <AppCard
          as="article"
          variant="subtle"
          padding="compact"
          className="flex flex-col border-dashed border-academy-navy/25"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className={cx(text.heading, "min-w-0 text-lg")}>
              {readingSectionCopy.dashboardCardTitle}
            </h3>

            <AppStatusBadge tone="neutral" className="shrink-0">
              {readingCopy.dashboardPreviewBadgeLabel}
            </AppStatusBadge>
          </div>

          <p className={cx("mt-3 text-sm leading-6", text.secondary)}>
            {readingSectionCopy.dashboardCardDescription}
          </p>

          <CardMetaList items={READING_CARD_META} />

          <div className="mt-auto pt-5">
            <AppButtonLink
              href={READING_TEST_HREF}
              variant="secondary"
              size="md"
            >
              {readingSectionCopy.dashboardCardCtaLabel}
            </AppButtonLink>
          </div>
        </AppCard>
      </div>
    </section>
  );
}
