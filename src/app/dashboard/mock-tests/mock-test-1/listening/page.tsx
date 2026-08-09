import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AppPageShell } from "@/components/app/AppPageShell";
import { ListeningSectionPrototype } from "@/components/exam/listening/ListeningSectionPrototype";
import { examCopy } from "@/features/exam-engine/exam-copy";
import { listeningCopy } from "@/features/exam-engine/listening-copy";
import { withoutListeningSectionAnswerKeys } from "@/features/exam-engine/listening-section-flow";
import { mockTest1ListeningSection } from "@/features/exam-engine/mock-tests/mock-test-1/full-listening-section";
import { markListeningSection } from "./actions";

export const metadata: Metadata = {
  title:
    "Mock Test 1 full Listening section - Toronto Academy of Education",
  description:
    "Internal preview of the complete Mock Test 1 Listening section, Parts 1 to 6 in one run.",
  robots: { index: false, follow: false },
};

// Mock Test 1 full Listening section (EXAM-15).
//
// The six Listening parts assembled into one complete section run: the
// Listening instructions, the Listening instructional video, Parts 1 to 6
// back to back with a short transition between them, then one answer
// review over all 38 questions, one practice score with the part
// breakdown, and the end of section screen.
//
// The six part level prototype routes under this one are unchanged and
// still work. They remain the internal way to check a single part, and
// they still show their own review and score. This route is the one that
// does not: inside the full section a part hands straight over to the next
// one, and the only result appears at the end.
//
// This is an internal preview. Answers are held in the browser for the
// length of the visit and nothing is saved, to a database, to localStorage
// or to a cookie. The standing notice above the frame says so, and the
// page carries robots noindex.
//
// The content is licensed Toronto Academy material and the clips are
// served from Cloudinary, so the route sits under /dashboard where the
// layout auth guard covers it, and the page verifies the session again
// close to the content. No API route, no service role, and no write.
//
// withoutListeningSectionAnswerKeys is the same precaution the Part 2 to
// Part 6 routes take, applied to all six parts at once, and for the same
// reason. Every Listening part has a complete, confirmed answer key and
// the prototype is a client component, so handing it the content whole
// would ship 38 answers to the browser where anyone could read them out of
// the flight data. The keys are stripped here, on the server, before the
// content crosses the boundary.
//
// The marking that goes with that stripping lives in actions.ts beside
// this file, next to the keys, the way markListeningPartSix does for Part
// 6. The learner's answers stay in local React state in the browser and
// only the finished review rows and practice score come back.

export default async function MockTest1ListeningSectionPage() {
  const supabase = await createSupabaseServerClient();

  // The dashboard layout already checks the session, but layouts do not
  // re-render on client navigation, so the page verifies it again.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const learnerContent = withoutListeningSectionAnswerKeys(
    mockTest1ListeningSection,
  );

  return (
    <AppPageShell
      title={listeningCopy.fullSectionPreviewTitle}
      eyebrow={examCopy.previewBadge}
      description={listeningCopy.fullSectionPreviewSummary}
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
          review and the practice score run for this visit only and are not an
          official CELPIP score, and no CELPIP level is shown. Audio and video
          can be replayed, Next does not wait for a clip to finish, and the
          timer does not count down yet.
        </p>

        <ListeningSectionPrototype
          content={learnerContent}
          markAnswers={markListeningSection}
        />
      </div>
    </AppPageShell>
  );
}
