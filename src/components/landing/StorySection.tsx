import { Container, Eyebrow } from "./primitives";

export function StorySection() {
  return (
    <section className="bg-cream text-foreground">
      <Container className="py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow className="text-brand">Our story</Eyebrow>
            <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
              Why this practice tool exists
            </h2>
          </div>

          <div className="lg:pt-2">
            <p className="text-lg leading-8 text-foreground/70">
              CELPIP speaking can feel stressful because you have limited time,
              unfamiliar prompts, and pressure to organize your answer quickly.
              This early access page helps us understand what test-takers
              actually need before the full practice app is released.
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-foreground/10 pt-12">
          <p className="font-serif text-2xl italic leading-relaxed text-foreground/80 sm:text-3xl">
            &ldquo;Practice the format. Build confidence. Know what to
            improve.&rdquo;
          </p>
        </div>
      </Container>
    </section>
  );
}
