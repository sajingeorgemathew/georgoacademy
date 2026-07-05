import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SpeakingHero } from "@/components/speaking/SpeakingHero";
import { SpeakingTaskGrid } from "@/components/speaking/SpeakingTaskGrid";
import { SpeakingEmptyState } from "@/components/speaking/SpeakingEmptyState";
import type { SpeakingTaskRow } from "@/features/speaking/task-types";
import { normalizeSpeakingTask } from "@/features/speaking/task-utils";

export const metadata: Metadata = {
  title: "CELPIP Speaking Practice - Toronto Academy CELPIP Practice",
  description:
    "Choose a CELPIP speaking task type and practice with Toronto Academy prompts.",
};

// Speaking module task library. Lists the 8 CELPIP speaking task types
// from Supabase. Recording, timing, and AI feedback arrive in later
// tickets.
export default async function SpeakingPage() {
  const supabase = await createSupabaseServerClient();

  // The dashboard layout already checks the session, but layouts do not
  // re-render on client navigation, so the page verifies it again close
  // to the data.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select(
      "id, task_type, title, prompt, status, sort_order, modules!inner(slug), speaking_task_details(task_number, prep_seconds, speaking_seconds, scoring_focus)",
    )
    .eq("modules.slug", "celpip-speaking")
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error("Could not load speaking tasks. Please try again.");
  }

  const taskList = ((tasks ?? []) as unknown as SpeakingTaskRow[]).map(
    normalizeSpeakingTask,
  );

  return (
    <>
      <SpeakingHero />
      {taskList.length === 0 ? (
        <SpeakingEmptyState />
      ) : (
        <SpeakingTaskGrid tasks={taskList} />
      )}
    </>
  );
}
