import Link from "next/link";
import { writingHistoryCopy } from "@/features/writing/writing-attempt-history";

// Shown on the writing history page when the user has no writing
// attempts yet. The button returns to the writing task library, where
// the first practice response starts.
export function WritingEmptyAttemptsState() {
  return (
    <section className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-ink/5">
      <h2 className="font-serif text-xl font-semibold tracking-tight text-ink">
        {writingHistoryCopy.emptyHeading}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/70">
        {writingHistoryCopy.emptyText}
      </p>
      <div className="mt-6">
        <Link
          href="/dashboard/writing"
          className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-colors hover:bg-brand-dark"
        >
          {writingHistoryCopy.emptyButton}
        </Link>
      </div>
    </section>
  );
}
