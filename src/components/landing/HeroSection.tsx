import { Container } from "./primitives";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-blue-50/40 to-background">
      <Container className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-brand-dark">
            Georgo Academy CELPIP Speaking Practice
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Walk into your CELPIP speaking test knowing exactly what to expect.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Practice CELPIP-style speaking tasks on a timer, get instant AI
            feedback, and see what is costing you points before test day.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#early-access"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand px-8 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark sm:w-auto"
            >
              Get early access
            </a>
            <a
              href="#how-it-works"
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-slate-300 bg-white px-8 text-base font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
            >
              See how it works
            </a>
          </div>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-slate-500">
            Built for CELPIP test-takers who want realistic speaking practice
            between classes, tutoring, or self-study.
          </p>
        </div>
      </Container>
    </section>
  );
}
