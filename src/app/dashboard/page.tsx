import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/app/DashboardShell";
import { ModuleCard, type Module } from "@/components/app/ModuleCard";

export const metadata: Metadata = {
  title: "Dashboard - Toronto Academy CELPIP Practice",
  description: "Your CELPIP practice dashboard.",
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  // Server side session check. getUser validates the session against
  // Supabase instead of trusting the cookie contents.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: modules, error } = await supabase
    .from("modules")
    .select("id, slug, title, description, status, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error("Could not load practice modules. Please try again.");
  }

  const moduleList = (modules ?? []) as Module[];

  return (
    <DashboardShell userEmail={user.email ?? "Signed in"}>
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Welcome to your CELPIP practice dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70 sm:text-base">
          Start with CELPIP Speaking Practice. More practice modules are
          coming soon.
        </p>
      </section>

      <section className="mt-8" aria-label="Practice modules">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/50">
          Practice modules
        </h2>

        {moduleList.length === 0 ? (
          <p className="mt-4 text-sm text-ink/70">
            No modules are available yet. Please check back soon.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {moduleList.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
