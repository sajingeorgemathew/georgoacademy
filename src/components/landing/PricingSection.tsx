import { Container, Eyebrow } from "./primitives";

const plans = [
  {
    title: "3 free practice attempts",
    note: "Planned",
  },
  {
    title: "$5 for 10 attempts",
    note: "Expected",
  },
  {
    title: "$20/month unlimited",
    note: "Expected",
  },
];

export function PricingSection() {
  return (
    <section className="bg-brand text-white">
      <Container className="py-20 sm:py-28">
        <Eyebrow className="text-white/80">Pricing</Eyebrow>
        <h2 className="mt-5 max-w-2xl font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Early access plan
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className="rounded-3xl bg-white/10 p-8 ring-1 ring-white/20 backdrop-blur-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                {plan.note}
              </p>
              <p className="mt-4 text-2xl font-semibold leading-snug">
                {plan.title}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-2xl text-lg leading-8 text-white/85">
          Early users may receive founding-user access while the practice
          experience is being tested.
        </p>
      </Container>
    </section>
  );
}
