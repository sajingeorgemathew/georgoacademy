import { Container, Eyebrow } from "./primitives";

const features = [
  {
    title: "Timed CELPIP-style prompts",
    body: "Practice with the pressure and flow of the real speaking section.",
  },
  {
    title: "AI feedback after each answer",
    body: "See what may be affecting clarity, structure, vocabulary, and task response.",
  },
  {
    title: "Simple improvement guidance",
    body: "Get practical next steps before your next attempt.",
  },
];

export function ExperienceSection() {
  return (
    <section className="bg-ink text-cream">
      <Container className="py-20 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow className="text-brand">The experience</Eyebrow>
            <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight tracking-tight text-cream sm:text-5xl">
              What the practice experience will include
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-cream/10">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={index === 0 ? "pb-8" : "py-8 last:pb-0"}
              >
                <h3 className="text-xl font-semibold text-cream">
                  {feature.title}
                </h3>
                <p className="mt-2 leading-7 text-cream/70">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
