import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "CELPIP Speaking Practice - Toronto Academy CELPIP Practice",
  description: "CELPIP speaking practice module.",
};

// Placeholder for the speaking module. Timed tasks, recording, and AI
// feedback arrive in a later ticket.
export default async function SpeakingPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
      >
        <span aria-hidden>&larr;</span>
        Back to dashboard
      </Link>

      <h1 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        CELPIP Speaking Practice
      </h1>

      <span className="mt-3 inline-flex rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
        Module in progress
      </span>

      <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/70 sm:text-base">
        You are in the right place. Timed speaking tasks, voice recording, and
        AI feedback will be added here next. Check back soon to start your
        first practice attempt.
      </p>

      <div className="mt-8">
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-colors hover:bg-brand-dark"
        >
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}
