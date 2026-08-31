import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ExamModeViewport } from "@/components/exam/ExamModeViewport";
import { ReadingPartThreePrototype } from "@/components/exam/reading/ReadingPartThreePrototype";
import { readingCopy } from "@/features/exam-engine/reading-copy";
import { withoutReadingAnswerKey } from "@/features/exam-engine/reading-flow";
import { readingPart3 } from "@/features/exam-engine/mock-tests/mock-test-1/reading-part-3";

export const metadata: Metadata = {
  title: readingCopy.part3PageTitle,
  description: readingCopy.part3PageDescription,
  robots: { index: false, follow: false },
};

// Mock Test 1 Reading Part 3 prototype (EXAM-20).
//
// The three screen sequence for Reading Part 3: the part intro, the split
// screen holding the lettered paragraphs and all 9 statements, and the
// completion screen. It stops where the EXAM-18 Reading Part 2 route
// stopped rather than where the Reading Part 1 route beside it stops:
// there is no Part 3 practice score and no Part 3 answer review in this
// ticket.
//
// This route runs in exam mode. It is listed in
// src/features/navigation/exam-mode-routes.ts, so the dashboard shell
// does not render its sidebar, header, breadcrumb trail or footer here,
// and ExamModeViewport gives the frame a fixed, one window tall viewport
// with document scrolling switched off. That is what the ticket's visual
// requirements ask for: a neutral exam background, a fixed top bar, fixed
// bottom navigation, and internal scrolling confined to the paragraph
// column and the question column.
//
// It joins Reading Parts 1 and 2 as an exam mode route for the same
// reason, and with one of its own. A Reading part is a split screen with
// a scrolling passage on one side and a scrolling question column on the
// other, and that screen cannot be judged, or used, inside the dashboard
// content column. Part 3 is the part where that matters most: it is
// answered by scanning back and forth between five lettered paragraphs
// and nine statements, so both columns have to be on screen together.
//
// Because the exam surface carries no preview label, the caveats are said
// where a learner meets them. The part intro screen's notice says answers
// are held on the screen and nothing is saved, and the completion screen
// repeats it and says plainly that the review and the score are the next
// ticket. Nothing here shows a score, a CELPIP level or an estimated
// Reading band.
//
// The route is not in navigation. It has one link, an Internal preview
// card in the Mock tests section of the dashboard, beside the Part 1 and
// Part 2 cards, because an exam mode route carries no preview label of
// its own and pasting the URL was otherwise the only way in. The student
// facing Mock Test 1 card is untouched and still offers Listening only.
// Nothing anywhere offers a Reading test.
//
// The content is licensed Toronto Academy material, so the route sits
// under /dashboard where the layout auth guard covers it, and the page
// verifies the session again close to the content. No API route, no
// service role, and no write. Answers are held in the browser for the
// length of the visit and nothing is saved, to a database, to
// localStorage or to a cookie. The page carries robots noindex.
//
// There is no actions.ts beside this route, as there was none beside the
// EXAM-18 Reading Part 2 route. Nothing marks a Part 3 attempt in this
// ticket, so there is nothing for the browser to send and no server
// action to return anything.
//
// withoutReadingAnswerKey is the same precaution the Reading Part 1 and
// Part 2 routes and every Listening route take, and for the same reason.
// Reading Part 3 has a complete answer key printed in the source document
// and the prototype is a client component, so handing it the content
// object whole would ship 9 answers to the browser where anyone could
// read them out of the flight data. The key is stripped here, on the
// server, before the content crosses the boundary.
//
// EXAM-21 is where the key should be read, and it should be read the way
// markReadingPartOne and markReadingPartTwo read theirs: in a server
// action beside this route, importing the content module directly rather
// than trusting anything the browser sends, and returning finished review
// rows rather than the key itself.

export default async function MockTest1ReadingPartThreePage() {
  const supabase = await createSupabaseServerClient();

  // The dashboard layout already checks the session, but layouts do not
  // re-render on client navigation, so the page verifies it again.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const learnerContent = withoutReadingAnswerKey(readingPart3);

  return (
    <ExamModeViewport label={readingCopy.part3ExamRegionLabel}>
      <ReadingPartThreePrototype content={learnerContent} />
    </ExamModeViewport>
  );
}
