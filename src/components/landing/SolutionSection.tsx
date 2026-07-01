import { Container, SectionHeading } from "./primitives";

const points = [
  {
    title: "Same task-style flow",
    description:
      "Work through speaking tasks that follow the same style and structure as the real CELPIP test.",
  },
  {
    title: "Timer-based practice",
    description:
      "Every task runs on a timer so you build the pacing and confidence you need for test day.",
  },
  {
    title: "Record your answer",
    description:
      "Speak and record your response, just like you would in the actual speaking section.",
  },
  {
    title: "Get AI feedback on what to improve",
    description:
      "Receive instant AI feedback that points out what is working and what to fix next.",
  },
];

export function SolutionSection() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <Container className="py-20 sm:py-24">
        <SectionHeading
          eyebrow="The solution"
          title="Realistic speaking practice you can do anytime"
          subtitle="Georgo Academy CELPIP Speaking Practice recreates the test experience so you can practice with purpose."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {points.map((point) => (
            <div
              key={point.title}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-6"
            >
              <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
