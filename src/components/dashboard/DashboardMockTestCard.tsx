import { AppButtonLink } from "@/components/app/AppButtonLink";
import { AppCard } from "@/components/app/AppCard";
import { AppSectionHeader } from "@/components/app/AppSectionHeader";
import { AppStatusBadge } from "@/components/app/AppStatusBadge";
import { cx, text } from "@/features/design/design-tokens";
import { listeningCopy } from "@/features/exam-engine/listening-copy";
import { readingCopy } from "@/features/exam-engine/reading-copy";

// Mock test entry point on the learner dashboard (EXAM-15A, Reading
// internal preview cards added by EXAM-18).
//
// This replaces ExamShellPreviewLink, which grew one dashed "Internal
// preview" card per ticket until nine of them sat on the dashboard: the
// shell preview, the instruction preview, the six Listening part
// prototypes, and the full Listening section. Eight of the nine were
// internal build steps that a learner had no reason to see, and the one
// that mattered was last in the list and dressed the same as the rest.
//
// So the dashboard shows one student facing card, for the route that
// runs the whole Listening section:
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
// The Listening card is deliberately styled as a real practice module
// card rather than an internal note: solid panel, a plain Available pill,
// and no Internal preview badge. The wording is the student facing entry
// point wording the product will keep. The prototype caveats did not go
// away, they moved to where they belong, which is the standing notice on
// the route itself: nothing is saved, media can be replayed, the timer is
// static, and the practice score is not an official CELPIP score.
//
// EXAM-18 added the Reading cards beside it, and EXAM-20 added a third
// for Reading Part 3, because every Reading route runs in exam mode, an
// exam mode route carries no dashboard chrome and no preview label, and
// so the only way to open one was to paste its URL. They are internal build links and they are dressed as internal
// build links, following the rule ExamShellPreviewLink set: a tinted
// panel with a dashed rule rather than the solid one, an Internal preview
// badge where the Available pill sits, and a secondary button rather than
// the navy call to action. The layout underneath is the Listening card's
// layout, so the three read as one section rather than as two designs.
//
// What these cards deliberately do not say, because none of it is true
// yet: that a Reading test exists, that a full Reading section exists, or
// that any part produces a CELPIP level or a Reading band. Three of the
// four Reading parts are built and one of those three has no review and
// no score yet, which its own description says. Remove these cards, and
// their wording in reading-copy.ts, once the assembled Reading section
// has its own student facing card.

const LISTENING_TEST_HREF = "/dashboard/mock-tests/mock-test-1/listening";

// Short facts under the description. Plain text, not controls.
const CARD_META = [
  listeningCopy.fullSectionCardSectionLabel,
  listeningCopy.fullSectionCardPartsLabel,
  listeningCopy.fullSectionCardQuestionsLabel,
];

// The three Reading preview cards differ only in their wording and their
// href, so they are one list and one renderer rather than three near
// identical blocks of markup.
//
// The question counts are read off the built parts rather than invented:
// Reading Part 1 asks 11 questions, Part 2 asks 8, and Part 3 asks 9.
const READING_PREVIEW_CARDS = [
  {
    href: "/dashboard/mock-tests/mock-test-1/reading/part-1",
    title: readingCopy.dashboardPartOneCardTitle,
    description: readingCopy.dashboardPartOneCardDescription,
    meta: [
      readingCopy.dashboardPartOneCardSectionLabel,
      readingCopy.dashboardPartOneCardPartLabel,
      readingCopy.dashboardPartOneCardQuestionsLabel,
    ],
    ctaLabel: readingCopy.dashboardPartOneCardCtaLabel,
  },
  {
    href: "/dashboard/mock-tests/mock-test-1/reading/part-2",
    title: readingCopy.dashboardPartTwoCardTitle,
    description: readingCopy.dashboardPartTwoCardDescription,
    meta: [
      readingCopy.dashboardPartTwoCardSectionLabel,
      readingCopy.dashboardPartTwoCardPartLabel,
      readingCopy.dashboardPartTwoCardQuestionsLabel,
    ],
    ctaLabel: readingCopy.dashboardPartTwoCardCtaLabel,
  },
  {
    href: "/dashboard/mock-tests/mock-test-1/reading/part-3",
    title: readingCopy.dashboardPartThreeCardTitle,
    description: readingCopy.dashboardPartThreeCardDescription,
    meta: [
      readingCopy.dashboardPartThreeCardSectionLabel,
      readingCopy.dashboardPartThreeCardPartLabel,
      readingCopy.dashboardPartThreeCardQuestionsLabel,
    ],
    ctaLabel: readingCopy.dashboardPartThreeCardCtaLabel,
  },
];

// The slash separated facts line, shared by both kinds of card so the
// Reading cards read the same way as the Listening one.
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

        {READING_PREVIEW_CARDS.map((card) => (
          <AppCard
            key={card.href}
            as="article"
            variant="subtle"
            padding="compact"
            className="flex flex-col border-dashed border-academy-navy/25"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className={cx(text.heading, "min-w-0 text-lg")}>
                {card.title}
              </h3>

              <AppStatusBadge tone="neutral" className="shrink-0">
                {readingCopy.dashboardPreviewBadgeLabel}
              </AppStatusBadge>
            </div>

            <p className={cx("mt-3 text-sm leading-6", text.secondary)}>
              {card.description}
            </p>

            <CardMetaList items={card.meta} />

            <div className="mt-auto pt-5">
              <AppButtonLink href={card.href} variant="secondary" size="md">
                {card.ctaLabel}
              </AppButtonLink>
            </div>
          </AppCard>
        ))}
      </div>
    </section>
  );
}
