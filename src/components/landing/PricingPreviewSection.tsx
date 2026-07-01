import { Container, SectionHeading } from "./primitives";

const tiers = [
  {
    name: "Try it free",
    price: "3 free attempts",
    description: "Start with 3 free attempts to test it and see how it feels.",
    highlight: false,
  },
  {
    name: "Planned pricing",
    price: "$5 for 10 attempts",
    description:
      "Or go with $20/month unlimited once the full practice app launches.",
    highlight: true,
  },
  {
    name: "Founding users",
    price: "Early access perks",
    description:
      "Early users may receive founding-user access as a thank you for helping us build.",
    highlight: false,
  },
];

export function PricingPreviewSection() {
  return (
    <section className="bg-background">
      <Container className="py-20 sm:py-24">
        <SectionHeading
          eyebrow="Pricing preview"
          title="Simple pricing, planned for launch"
          subtitle="Pricing is not final and no payment is collected yet. Here is what we are planning."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-6 shadow-sm ${
                tier.highlight
                  ? "border-brand bg-brand text-white"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p
                className={`text-sm font-semibold uppercase tracking-wide ${
                  tier.highlight ? "text-blue-100" : "text-brand"
                }`}
              >
                {tier.name}
              </p>
              <p
                className={`mt-3 text-2xl font-bold ${
                  tier.highlight ? "text-white" : "text-slate-900"
                }`}
              >
                {tier.price}
              </p>
              <p
                className={`mt-3 text-sm leading-6 ${
                  tier.highlight ? "text-blue-50" : "text-slate-600"
                }`}
              >
                {tier.description}
              </p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate-500">
          Pricing shown is planned and may change before launch.
        </p>
      </Container>
    </section>
  );
}
