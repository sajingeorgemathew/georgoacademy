import { writingResultCopy } from "@/features/writing/task-copy";

// Badge information shown with a writing feedback report.
export type EarnedWritingBadge = {
  title: string;
  description: string | null;
};

// Practice badge section for the writing result page. Shows the earned
// badge title and description, or a subtle note when no badge exists
// yet for the attempt.
export function WritingBadgeDisplayCard({
  badge,
}: {
  badge: EarnedWritingBadge | null;
}) {
  return (
    <section
      aria-label={writingResultCopy.badgeHeading}
      className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8"
    >
      <h2 className="font-serif text-xl font-semibold tracking-tight text-ink">
        {writingResultCopy.badgeHeading}
      </h2>

      {badge ? (
        <div className="mt-4 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10 ring-1 ring-brand/20">
            <span aria-hidden className="font-serif text-xl text-brand">
              &#9733;
            </span>
          </div>
          <div>
            <p className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand">
              {badge.title}
            </p>
            {badge.description && (
              <p className="mt-2 text-sm leading-6 text-ink/70">
                {badge.description}
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 text-ink/60">
          {writingResultCopy.badgeEmptyText}
        </p>
      )}
    </section>
  );
}
