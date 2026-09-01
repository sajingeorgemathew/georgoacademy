import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ExamModeViewport } from "@/components/exam/ExamModeViewport";
import { SpeakingSectionPrototype } from "@/components/exam/speaking/SpeakingSectionPrototype";
import { speakingMockCopy } from "@/features/exam-engine/speaking-mock-copy";
import { mockTest1SpeakingSection } from "@/features/exam-engine/mock-tests/mock-test-1/speaking-section";

export const metadata: Metadata = {
  title: speakingMockCopy.pageTitle,
  description: speakingMockCopy.pageDescription,
  robots: { index: false, follow: false },
};

// Mock Test 1 Speaking test (EXAM-27).
//
// The Speaking section as one run: the section instructions, eight task
// screens with their prompts, pictures, preparation countdown, recording
// countdown and browser recorder, a short transition before each task
// after the first, and a completion screen reporting which tasks were
// recorded.
//
// This route runs in exam mode. It is listed in
// src/features/navigation/exam-mode-routes.ts, so the dashboard shell
// does not render its sidebar, header, breadcrumb trail or footer here,
// and ExamModeViewport gives the frame a fixed, one window tall viewport
// with document scrolling switched off. That is what the ticket's visual
// requirements ask for: a neutral exam background, no dashboard chrome,
// no internal preview label on the exam surface, a fixed top bar, fixed
// bottom navigation, and internal scrolling confined to the prompt
// column.
//
// Because the exam surface carries no preview label, the caveats are said
// where a learner meets them. The section intro notice says no score is
// produced and nothing is saved or uploaded, the line under every
// recorder says the audio stays in the browser tab, and the completion
// screen says the same again beside the sentence about what comes next.
//
// There is deliberately no actions.ts beside this file, and its absence
// is the shape of the ticket. The Listening and Reading routes have one
// to keep answer keys off the client, and Speaking has no key. The
// Writing route has one to keep an OpenAI key off the client, and this
// ticket calls no model. Nothing in this section needs a server, which is
// why nothing in it has one:
//
// - it writes nothing. No attempt row, no migration, no Supabase write
//   and no usage event
// - it uploads nothing. No audio reaches Supabase Storage or any other
//   destination. Every recording is a Blob and a blob: URL held in React
//   state in the browser for the length of the visit
// - it produces no result. No transcript, no AI review, no Speaking score
//   and no estimated Speaking level. The completion screen says so rather
//   than showing an empty result
// - it does not touch the standalone Speaking Practice pipeline. That
//   flow has its own recorder, its own upload, its own transcription and
//   its own scoring prompt, none of which are modified here. The only
//   thing shared with it is the pure feature detection and mime type
//   helpers in src/features/speaking/audio-utils.ts, which are read and
//   not edited
//
// The content is licensed Toronto Academy material, so the route sits
// under /dashboard where the layout auth guard covers it, and the page
// verifies the session again close to the content. No API route, no
// service role, and no write. The page carries robots noindex.

export default async function MockTest1SpeakingSectionPage() {
  const supabase = await createSupabaseServerClient();

  // The dashboard layout already checks the session, but layouts do not
  // re-render on client navigation, so the page verifies it again.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // The content is handed over whole. There is no answer key stripping
  // step to match the Reading route's, because a Speaking task has no
  // answer key: nothing in this content object is something a learner
  // could be given an unfair advantage by reading.
  return (
    <ExamModeViewport label={speakingMockCopy.examRegionLabel}>
      <SpeakingSectionPrototype content={mockTest1SpeakingSection} />
    </ExamModeViewport>
  );
}
