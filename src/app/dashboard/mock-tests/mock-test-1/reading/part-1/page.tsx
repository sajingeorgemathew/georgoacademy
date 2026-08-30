import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ExamModeViewport } from "@/components/exam/ExamModeViewport";
import { ReadingPartOnePrototype } from "@/components/exam/reading/ReadingPartOnePrototype";
import { readingCopy } from "@/features/exam-engine/reading-copy";
import { withoutReadingAnswerKey } from "@/features/exam-engine/reading-flow";
import { readingPart1 } from "@/features/exam-engine/mock-tests/mock-test-1/reading-part-1";

export const metadata: Metadata = {
  title: readingCopy.part1PageTitle,
  description: readingCopy.part1PageDescription,
  robots: { index: false, follow: false },
};

// Mock Test 1 Reading Part 1 prototype (EXAM-16).
//
// The three screen sequence for Reading Part 1: the part intro, the split
// screen holding the message and all 11 questions, and the completion
// screen.
//
// This route runs in exam mode. It is listed in
// src/features/navigation/exam-mode-routes.ts, so the dashboard shell
// does not render its sidebar, header, breadcrumb trail or footer here,
// and ExamModeViewport gives the frame a fixed, one window tall viewport
// with document scrolling switched off. That is what the ticket's visual
// requirements ask for: a neutral exam background, a fixed top bar, fixed
// bottom navigation, and internal scrolling confined to the passage and
// the question column.
//
// It is the first exam mode route that is not the full Listening test.
// The six Listening part routes deliberately stay outside exam mode: they
// are development routes that keep their dashboard chrome and their
// preview notices. Reading Part 1 does not, because a split screen is
// most of the thing being reviewed here and it cannot be judged inside a
// dashboard content column.
//
// Because the exam surface carries no preview label, the caveats are said
// where a learner meets them. The part intro screen's notice says answers
// are held on the screen, nothing is saved, and no score is produced, and
// the completion screen repeats it.
//
// The route is not linked from anywhere. The Mock Test 1 dashboard card
// is untouched and still points at Listening only, so Reading Part 1 is
// reachable from a typed URL and nothing else until it is ready to be
// offered.
//
// The content is licensed Toronto Academy material, so the route sits
// under /dashboard where the layout auth guard covers it, and the page
// verifies the session again close to the content. No API route, no
// service role, and no write. Answers are held in the browser for the
// length of the visit and nothing is saved, to a database, to
// localStorage or to a cookie. The page carries robots noindex.
//
// withoutReadingAnswerKey is the same precaution every Listening route
// takes, and for the same reason. Reading Part 1 has a complete answer
// key printed in the source document and the prototype is a client
// component, so handing it the content object whole would ship 11 answers
// to the browser where anyone could read them out of the flight data. The
// key is stripped here, on the server, before the content crosses the
// boundary.
//
// There is no actions.ts beside this file, because EXAM-16 marks nothing.
// EXAM-17 adds one, and the key must be read there, on the server, the
// way markListeningPartSix reads the Part 6 key.

export default async function MockTest1ReadingPartOnePage() {
  const supabase = await createSupabaseServerClient();

  // The dashboard layout already checks the session, but layouts do not
  // re-render on client navigation, so the page verifies it again.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const learnerContent = withoutReadingAnswerKey(readingPart1);

  return (
    <ExamModeViewport label={readingCopy.part1ExamRegionLabel}>
      <ReadingPartOnePrototype content={learnerContent} />
    </ExamModeViewport>
  );
}
