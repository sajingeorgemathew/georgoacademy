import { Container } from "./primitives";

const values = [
  {
    title: "Real test-style practice",
    description:
      "Speaking tasks modeled on the real CELPIP format so practice feels like the actual test.",
  },
  {
    title: "Timed speaking tasks",
    description:
      "Answer under the clock, just like test day, so timing stops being a surprise.",
  },
  {
    title: "AI feedback after each answer",
    description:
      "Get instant, structured feedback on what to improve after every attempt.",
  },
];

export function TrustStrip() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <Container className="py-12">
        <div className="grid gap-6 sm:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6"
            >
              <h3 className="text-base font-semibold text-slate-900">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
