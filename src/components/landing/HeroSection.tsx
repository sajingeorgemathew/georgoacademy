import Image from "next/image";
import { Container, Eyebrow } from "./primitives";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-cream">
      {/* Full bleed Canadian city hero image with a dark editorial overlay. */}
      <Image
        src="/canada-city-hero.jpg"
        alt="A Canadian city skyline"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/40" />

      <Container className="relative flex min-h-[92vh] flex-col justify-between py-8 sm:py-10">
        <div className="flex items-center gap-3">
          <Image
            src="/georgo-logo.png"
            alt="Georgo Academy"
            width={48}
            height={48}
            className="h-11 w-11 rounded-xl object-contain"
          />
          <span className="text-lg font-semibold tracking-tight text-cream">
            Georgo Academy
          </span>
        </div>

        <div className="max-w-3xl">
          <Eyebrow className="text-brand">CELPIP Speaking Practice</Eyebrow>

          <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.02] tracking-tight text-cream sm:text-6xl lg:text-7xl">
            Walk into CELPIP speaking with more confidence.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-cream/80">
            Answer a few quick questions and get early access to a timed CELPIP
            speaking practice experience with AI feedback.
          </p>

          <div className="mt-9">
            <a
              href="#early-access"
              className="inline-flex h-14 items-center justify-center rounded-full bg-brand px-9 text-base font-semibold text-white shadow-lg shadow-brand/20 transition-colors hover:bg-brand-dark"
            >
              Start the quick form
            </a>
          </div>

          <p className="mt-8 max-w-md text-sm leading-6 text-cream/70">
            3 free practice attempts planned. Then expected pricing: $5 for 10
            attempts or $20/month unlimited.
          </p>
        </div>

        <div aria-hidden className="h-2" />
      </Container>
    </section>
  );
}
