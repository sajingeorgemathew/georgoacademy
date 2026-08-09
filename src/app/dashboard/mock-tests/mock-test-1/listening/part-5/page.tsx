import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AppPageShell } from "@/components/app/AppPageShell";
import { ListeningPartFivePrototype } from "@/components/exam/listening/ListeningPartFivePrototype";
import { examCopy } from "@/features/exam-engine/exam-copy";
import { listeningCopy } from "@/features/exam-engine/listening-copy";
import { withoutListeningVideoAnswerKey } from "@/features/exam-engine/listening-video-flow";
import { listeningPart5 } from "@/features/exam-engine/mock-tests/mock-test-1/listening-part-5";

export const metadata: Metadata = {
  title: "Mock Test 1 Listening Part 5 prototype - Toronto Academy of Education",
  description:
    "Internal prototype of Mock Test 1 Listening Part 5, Listening to a Discussion.",
  robots: { index: false, follow: false },
};

// Mock Test 1 Listening Part 5 prototype (EXAM-11).
//
// The five screen sequence for Listening Part 5: the part intro, the
// scenario, the discussion video, one screen holding all eight
// multiple-choice questions, and the completion screen.
//
// This is an internal preview. Answers are held in the browser for the
// length of the visit and nothing is saved. The standing notice above the
// frame says so, and the page carries robots noindex.
//
// The content is licensed Toronto Academy material and the video is
// served from Cloudinary, so the route sits under /dashboard where the
// layout auth guard covers it, and the page verifies the session again
// close to the content. No API route, no service role, and no write.
//
// withoutListeningVideoAnswerKey is the same precaution the Part 2, Part
// 3 and Part 4 routes take, and for the same reason. Part 5 has a
// complete, confirmed answer key and the prototype is a client component,
// so handing it the content object whole would ship the answers to the
// browser where anyone could read them out of the flight data. The key is
// stripped here, on the server, before the content crosses the boundary.
//
// There is no actions.ts beside this file. The Part 5 answer review and
// practice score are the next ticket's work, so nothing marks anything
// yet and this page passes no action down.

export default async function ListeningPartFivePrototypePage() {
  const supabase = await createSupabaseServerClient();

  // The dashboard layout already checks the session, but layouts do not
  // re-render on client navigation, so the page verifies it again.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const learnerContent = withoutListeningVideoAnswerKey(listeningPart5);

  return (
    <AppPageShell
      title={listeningCopy.part5PreviewTitle}
      eyebrow={examCopy.previewBadge}
      description={listeningCopy.part5PreviewSummary}
    >
      <div className="space-y-6">
        {/* Standing notice, so the page is unmistakable even to someone
            who lands on it from a shared link. */}
        <p className="rounded-md border border-dashed border-academy-navy/30 bg-academy-navy-soft/40 px-4 py-3 text-sm leading-6 text-academy-navy/80">
          <span className="font-semibold text-academy-navy">
            {examCopy.previewBadge}:
          </span>{" "}
          this is a Toronto Academy practice prototype, not the official CELPIP
          test. Your answers stay on this page and nothing is saved. The
          discussion video can be replayed and Next does not wait for it to
          finish, the timer does not count down yet, and the answer review and
          the practice score for this part are not built yet.
        </p>

        <ListeningPartFivePrototype content={learnerContent} />
      </div>
    </AppPageShell>
  );
}
