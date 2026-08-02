import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AppPageShell } from "@/components/app/AppPageShell";
import { ListeningPartOnePrototype } from "@/components/exam/listening/ListeningPartOnePrototype";
import { examCopy } from "@/features/exam-engine/exam-copy";
import { listeningCopy } from "@/features/exam-engine/listening-copy";
import { listeningPart1 } from "@/features/exam-engine/mock-tests/mock-test-1/listening-part-1";

export const metadata: Metadata = {
  title: "Mock Test 1 Listening Part 1 prototype - Toronto Academy of Education",
  description:
    "Internal prototype of Mock Test 1 Listening Part 1, Listening to Problem Solving.",
  robots: { index: false, follow: false },
};

// Mock Test 1 Listening Part 1 prototype (EXAM-03, closing screens from
// EXAM-04).
//
// The first practice test screen built on real content rather than
// placeholder text. It runs the eighteen screen sequence for Listening
// Part 1: the part intro, the scenario, three conversation clips, eight
// question screens, two section breaks, then the answer review, the
// practice score, and the end of part screen.
//
// This is an internal preview. Answers are held in the browser for the
// length of the visit and nothing is saved. The practice score is a
// simple correct out of total, and it is withheld entirely while the
// Listening answer key is untranscribed. The standing notice above the
// frame says so, and the page carries robots noindex.
//
// The content is licensed Toronto Academy material and the clips are
// served from Cloudinary, so the route sits under /dashboard where the
// layout auth guard covers it, and the page verifies the session again
// close to the content. No API route, no service role, and no write.
//
// The prototype itself is a client component because the screen sequence
// and the selected answers are local state. The content object is plain
// data, so passing it across the boundary costs one serialization and no
// answer key: every entry in its answerKey list is pending, and no
// correctOptionId is set anywhere in it. Once the real key is
// transcribed, the key stops being safe to hand to the browser and has to
// be split off, which is the first note in
// docs/product/listening-part-1-review-score.md section 9.

export default async function ListeningPartOnePrototypePage() {
  const supabase = await createSupabaseServerClient();

  // The dashboard layout already checks the session, but layouts do not
  // re-render on client navigation, so the page verifies it again.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppPageShell
      title={listeningCopy.previewTitle}
      eyebrow={examCopy.previewBadge}
      description={listeningCopy.previewSummary}
    >
      <div className="space-y-6">
        {/* Standing notice, so the page is unmistakable even to someone
            who lands on it from a shared link. */}
        <p className="rounded-md border border-dashed border-academy-navy/30 bg-academy-navy-soft/40 px-4 py-3 text-sm leading-6 text-academy-navy/80">
          <span className="font-semibold text-academy-navy">
            {examCopy.previewBadge}:
          </span>{" "}
          this is a Toronto Academy practice prototype, not the official CELPIP
          test. Your answers stay on this page and nothing is saved. The answer
          review and the practice score run on this page only, the practice
          score is not an official CELPIP score, and it stays pending until the
          answer key for this part is transcribed. Audio can be replayed and the
          timer does not count down yet.
        </p>

        <ListeningPartOnePrototype content={listeningPart1} />
      </div>
    </AppPageShell>
  );
}
