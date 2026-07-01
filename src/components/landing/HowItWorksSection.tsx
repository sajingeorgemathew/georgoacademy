import { Container, SectionHeading } from "./primitives";

const steps = [
  {
    number: "1",
    title: "Pick a speaking task",
    description:
      "Choose a CELPIP-style speaking task to work on, matched to the format you will see on test day.",
  },
  {
    number: "2",
    title: "Record your answer on a timer",
    description:
      "Speak your response while the timer runs, so you practice under real test conditions.",
  },
  {
    number: "3",
    title: "Get feedback and improve your next attempt",
    description:
      "Review AI feedback on your answer, then try again and see your speaking get stronger.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-16 bg-background">
      <Container className="py-20 sm:py-24">
        <SectionHeading
          eyebrow="How it works"
          title="Three simple steps to better CELPIP speaking"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                {step.number}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
