"use client";

// Error boundary for the dashboard route.
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-ink/5">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink/70">
          {error.message ||
            "We could not load your dashboard. Please try again."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-colors hover:bg-brand-dark"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
