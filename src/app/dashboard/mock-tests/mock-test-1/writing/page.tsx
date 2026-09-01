import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ExamModeViewport } from "@/components/exam/ExamModeViewport";
import { WritingSectionPrototype } from "@/components/exam/writing/WritingSectionPrototype";
import { writingMockCopy } from "@/features/exam-engine/writing-mock-copy";
import { mockTest1WritingSection } from "@/features/exam-engine/mock-tests/mock-test-1/writing-section";

export const metadata: Metadata = {
  title: writingMockCopy.pageTitle,
  description: writingMockCopy.pageDescription,
  robots: { index: false, follow: false },
};

// Mock Test 1 Writing test prototype (EXAM-25).
//
// The Writing section as one run: the section instructions, Task 1 with
// its email prompt and editor, a short transition, Task 2 with its survey
// prompt, its two positions and its editor, and a completion screen
// reporting the two word counts.
//
// This route runs in exam mode. It is listed in
// src/features/navigation/exam-mode-routes.ts, so the dashboard shell
// does not render its sidebar, header, breadcrumb trail or footer here,
// and ExamModeViewport gives the frame a fixed, one window tall viewport
// with document scrolling switched off. That is what the ticket's visual
// requirements ask for: a neutral exam background, no dashboard chrome,
// no internal preview label on the exam surface, a fixed top bar, fixed
// bottom navigation, and internal scrolling confined to the situation
// column.
//
// Because the exam surface carries no preview label, the caveats are said
// where a learner meets them. The section intro notice says the writing
// is held on the screen and nothing is saved or scored, the editor hint
// repeats it beside the field, and the completion screen states that the
// AI review and the estimated band are the next build.
//
// What this route does not do, and this is the shape of the ticket rather
// than an omission:
//
// - it writes nothing. There is no server action beside this page, no
//   attempt row, no migration and no Supabase write. The responses live
//   in React state in the browser for the length of the visit
// - it calls no AI. The standalone Writing Practice evaluator is
//   untouched and is not imported here, and no OpenAI client is
//   constructed anywhere in this flow
// - it produces no score and no estimated Writing band. Writing is judged
//   against descriptors rather than an answer key, so there is nothing to
//   mark against and nothing is invented to stand in for it
//
// There is therefore no actions.ts beside this page, which is the one
// structural difference from the Listening and Reading section routes.
// Those two have one because they mark answers against keys held on the
// server. Writing has no key to hold and nothing to mark, so the content
// crosses to the client whole and no request goes back.
//
// The content is licensed Toronto Academy material, so the route sits
// under /dashboard where the layout auth guard covers it, and the page
// verifies the session again close to the content. No API route, no
// service role, and no write. The page carries robots noindex.
//
// EXAM-26 is where the AI review goes: a server action beside this file,
// taking the responses and the chosen position, reusing the existing
// Writing scoring prompt, and returning feedback and an estimated band
// for a result screen after the completion screen. The continuation note
// in docs/product/writing-mock-test-prototype.md sets out how.

export default async function MockTest1WritingSectionPage() {
  const supabase = await createSupabaseServerClient();

  // The dashboard layout already checks the session, but layouts do not
  // re-render on client navigation, so the page verifies it again.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // The content is handed over whole. There is no
  // withoutWritingAnswerKeys step to match the Reading route's, because a
  // Writing task has no answer key: nothing in this content object is
  // something a learner could be given an unfair advantage by reading.
  return (
    <ExamModeViewport label={writingMockCopy.examRegionLabel}>
      <WritingSectionPrototype content={mockTest1WritingSection} />
    </ExamModeViewport>
  );
}
