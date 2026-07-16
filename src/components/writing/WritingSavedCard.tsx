import Link from "next/link";
import { writingPracticeCopy } from "@/features/writing/task-copy";

// Success state after a writing response is saved. No score is shown:
// AI-supported evaluation arrives in a later build stage.
export function WritingSavedCard() {
  return (
    <section
      aria-label={writingPracticeCopy.savedHeading}
      className="rounded-3xl bg-cream-soft p-6 text-center ring-1 ring-ink/5 sm:p-8"
    >
      <span
        aria-hidden
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700"
      >
        &#10003;
      </span>
      <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-ink">
        {writingPracticeCopy.savedHeading}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/70">
        {writingPracticeCopy.savedBody}
      </p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/dashboard/writing"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand px-8 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-colors hover:bg-brand-dark sm:w-auto"
        >
          {writingPracticeCopy.tryAnotherTask}
        </Link>
        <Link
          href="/dashboard/writing"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-brand ring-1 ring-brand/30 transition-colors hover:bg-brand/5 sm:w-auto"
        >
          {writingPracticeCopy.backToTasks}
        </Link>
      </div>
    </section>
  );
}
