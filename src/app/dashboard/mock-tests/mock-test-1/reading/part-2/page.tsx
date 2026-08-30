import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ExamModeViewport } from "@/components/exam/ExamModeViewport";
import { ReadingPartTwoPrototype } from "@/components/exam/reading/ReadingPartTwoPrototype";
import { readingCopy } from "@/features/exam-engine/reading-copy";
import { withoutReadingAnswerKey } from "@/features/exam-engine/reading-flow";
import { readingPart2 } from "@/features/exam-engine/mock-tests/mock-test-1/reading-part-2";

export const metadata: Metadata = {
  title: readingCopy.part2PageTitle,
  description: readingCopy.part2PageDescription,
  robots: { index: false, follow: false },
};

// Mock Test 1 Reading Part 2 prototype (EXAM-18).
//
// The three screen sequence for Reading Part 2: the part intro, the split
// screen holding the course brochure and all 8 questions, and the
// completion screen. There is no score screen and no answer review on
// this route, which is where it stops short of the Reading Part 1 route
// beside it. Those are the next ticket.
//
// This route runs in exam mode. It is listed in
// src/features/navigation/exam-mode-routes.ts, so the dashboard shell
// does not render its sidebar, header, breadcrumb trail or footer here,
// and ExamModeViewport gives the frame a fixed, one window tall viewport
// with document scrolling switched off. That is what the ticket's visual
// requirements ask for: a neutral exam background, a fixed top bar, fixed
// bottom navigation, and internal scrolling confined to the diagram and
// the question column.
//
// It joins Reading Part 1 as an exam mode route for the same reason. A
// Reading part is a split screen with a scrolling passage on one side and
// a scrolling question column on the other, and that screen cannot be
// judged, or used, inside the dashboard content column. It is more true
// of Part 2 than of Part 1, because Part 2's left column is a tall
// brochure that has to be read at a usable size.
//
// Because the exam surface carries no preview label, the caveats are said
// where a learner meets them. The part intro screen's notice says answers
// are held on the screen and nothing is saved, and the completion screen
// repeats it and says plainly that the review and the score are not built
// yet. No score, no CELPIP level and no estimated Reading band appears
// anywhere on this route, because none of them exists for this part.
//
// The route is not in navigation. EXAM-18 gave it one link, an Internal
// preview card in the Mock tests section of the dashboard, because an
// exam mode route carries no preview label of its own and pasting the URL
// was the only way in. That card is dressed as an internal build link and
// says so: dashed tinted panel, Internal preview badge, secondary button,
// and a description that states the review and the score are not built.
// The student facing Mock Test 1 card beside it is untouched and still
// offers Listening only. Nothing anywhere offers a Reading test.
//
// The content is licensed Toronto Academy material, so the route sits
// under /dashboard where the layout auth guard covers it, and the page
// verifies the session again close to the content. No API route, no
// server action, no service role, and no write. Answers are held in the
// browser for the length of the visit and nothing is saved, to a
// database, to localStorage or to a cookie. The page carries robots
// noindex.
//
// withoutReadingAnswerKey is the same precaution the Reading Part 1 route
// and every Listening route take, and for the same reason. Reading Part 2
// has a complete answer key printed in the source document and the
// prototype is a client component, so handing it the content object whole
// would ship 8 answers to the browser where anyone could read them out of
// the flight data. The key is stripped here, on the server, before the
// content crosses the boundary.
//
// There is no actions.ts beside this file, unlike the Reading Part 1
// route. Nothing marks a Part 2 attempt in this ticket, so there is
// nothing for the browser to send and nothing for a server action to
// return. The next ticket adds one, and it should read the key the way
// markReadingPartOne does: on the server, importing the content module
// directly, returning finished review rows rather than the key itself.

export default async function MockTest1ReadingPartTwoPage() {
  const supabase = await createSupabaseServerClient();

  // The dashboard layout already checks the session, but layouts do not
  // re-render on client navigation, so the page verifies it again.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const learnerContent = withoutReadingAnswerKey(readingPart2);

  return (
    <ExamModeViewport label={readingCopy.part2ExamRegionLabel}>
      <ReadingPartTwoPrototype content={learnerContent} />
    </ExamModeViewport>
  );
}
