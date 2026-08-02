import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AppPageShell } from "@/components/app/AppPageShell";
import { ListeningPartTwoPrototype } from "@/components/exam/listening/ListeningPartTwoPrototype";
import { examCopy } from "@/features/exam-engine/exam-copy";
import { withoutListeningAnswerKey } from "@/features/exam-engine/listening-flow";
import { listeningCopy } from "@/features/exam-engine/listening-copy";
import { listeningPart2 } from "@/features/exam-engine/mock-tests/mock-test-1/listening-part-2";

export const metadata: Metadata = {
  title: "Mock Test 1 Listening Part 2 prototype - Toronto Academy of Education",
  description:
    "Internal prototype of Mock Test 1 Listening Part 2, Listening to a Daily Life Conversation.",
  robots: { index: false, follow: false },
};

// Mock Test 1 Listening Part 2 prototype (EXAM-05).
//
// The nine screen sequence for Listening Part 2: the part intro, the
// scenario, one telephone conversation clip, five question screens, then
// a completion screen. There is no answer review and no practice score in
// this ticket; EXAM-06 adds both.
//
// This is an internal preview. Answers are held in the browser for the
// length of the visit and nothing is saved. The standing notice above the
// frame says so, and the page carries robots noindex.
//
// The content is licensed Toronto Academy material and the clips are
// served from Cloudinary, so the route sits under /dashboard where the
// layout auth guard covers it, and the page verifies the session again
// close to the content. No API route, no service role, and no write.
//
// One difference from the Part 1 route, and it is the important one.
// Part 2 has a complete, confirmed answer key, and the prototype is a
// client component, so handing it the content object whole would ship the
// answers to the browser where anyone could read them out of the flight
// data. withoutListeningAnswerKey strips the key here, on the server,
// before the content crosses the boundary. Part 1 does not do this
// because every entry in its key is still pending, and its own route file
// records that the day the key lands is the day it has to change.
//
// The consequence for EXAM-06: the answer review and the score cannot be
// computed inside the prototype component. They need the key, and the key
// stays on this side of the boundary.

export default async function ListeningPartTwoPrototypePage() {
  const supabase = await createSupabaseServerClient();

  // The dashboard layout already checks the session, but layouts do not
  // re-render on client navigation, so the page verifies it again.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const learnerContent = withoutListeningAnswerKey(listeningPart2);

  return (
    <AppPageShell
      title={listeningCopy.part2PreviewTitle}
      eyebrow={examCopy.previewBadge}
      description={listeningCopy.part2PreviewSummary}
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
          review and the practice score for this part are not built yet. Audio
          can be replayed and the timer does not count down yet.
        </p>

        <ListeningPartTwoPrototype content={learnerContent} />
      </div>
    </AppPageShell>
  );
}
