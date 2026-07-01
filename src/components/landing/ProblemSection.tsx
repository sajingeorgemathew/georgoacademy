import { Container, SectionHeading, Card } from "./primitives";

const problems = [
  {
    title: "Speaking is stressful",
    description:
      "Speaking is one of the most stressful CELPIP sections. The timer, the prompts, and thinking on the spot can throw you off.",
  },
  {
    title: "Tutors are expensive",
    description:
      "One-on-one tutoring adds up fast, and it is hard to get enough repetitions to feel truly ready.",
  },
  {
    title: "Generic apps miss the mark",
    description:
      "Most general speaking apps do not feel like the real CELPIP test, so they do not prepare you for the format you will actually face.",
  },
];

export function ProblemSection() {
  return (
    <section className="bg-background">
      <Container className="py-20 sm:py-24">
        <SectionHeading
          eyebrow="The problem"
          title="Getting ready for CELPIP speaking is harder than it should be"
          subtitle="Most test-takers struggle to find realistic, affordable speaking practice that actually matches the exam."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {problems.map((problem) => (
            <Card key={problem.title}>
              <h3 className="text-lg font-semibold text-slate-900">
                {problem.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {problem.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
