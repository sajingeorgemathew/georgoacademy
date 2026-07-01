import { Container, SectionHeading, Card } from "./primitives";

const features = [
  {
    title: "CELPIP speaking task library",
    description:
      "A growing set of speaking tasks that follow the real test styles and topics.",
  },
  {
    title: "Realistic timer flow",
    description:
      "Prep and response timers that mirror the pacing of the actual speaking section.",
  },
  {
    title: "Audio recording",
    description:
      "Record your spoken answers so you can hear yourself and track your progress.",
  },
  {
    title: "AI scoring estimate",
    description:
      "Get an estimated performance level to gauge where you stand before test day.",
  },
  {
    title: "Feedback by skill area",
    description:
      "See feedback broken down by skill area so you know exactly what to work on next.",
  },
  {
    title: "Attempt history later",
    description:
      "Track past attempts over time to watch your speaking improve, coming in a later release.",
  },
];

export function FeaturePreviewSection() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <Container className="py-20 sm:py-24">
        <SectionHeading
          eyebrow="Feature preview"
          title="What you will get inside the practice app"
          subtitle="This is an early access preview. The full practice app is coming soon, and early users help shape what we build first."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-slate-50/60">
              <h3 className="text-base font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
