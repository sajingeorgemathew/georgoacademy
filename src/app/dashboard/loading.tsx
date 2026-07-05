// Skeleton shown while the dashboard loads its session and modules.
export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <div className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="h-5 w-64 animate-pulse rounded-full bg-cream-soft" />
          <div className="h-9 w-24 animate-pulse rounded-full bg-cream-soft" />
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
        <div className="h-36 animate-pulse rounded-3xl bg-white ring-1 ring-ink/5" />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-52 animate-pulse rounded-3xl bg-white ring-1 ring-ink/5"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
