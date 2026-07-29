import type { ReactNode } from "react";
import { cx, surface, text } from "@/features/design/design-tokens";
import { AppBreadcrumbs } from "./AppBreadcrumbs";
import { AppSideNav } from "./AppSideNav";
import { AppTopNav } from "./AppTopNav";

// Frame for every signed in screen.
//
// It replaces DashboardShell, which had a single header row and no
// navigation. The layout is a two column grid on desktop, sidebar plus
// content, and a single column with a drawer on mobile.
//
// The content column carries min-w-0 so a wide table or a long
// transcript scrolls inside its own container instead of pushing the
// page sideways.

export function AppShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: ReactNode;
}) {
  return (
    <div className={cx("flex min-h-screen", surface.page)}>
      <AppSideNav />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopNav userEmail={userEmail} />

        <main className="w-full flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <AppBreadcrumbs />
            {children}
          </div>
        </main>

        <footer className="border-t border-academy-line bg-academy-paper">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            <p className={cx("text-xs leading-5", text.muted)}>
              Toronto Academy of Education
            </p>
            <p className={cx("mt-1 text-xs leading-5", text.muted)}>
              Practice estimates and AI feedback are for preparation only
              and are not official CELPIP scores.
            </p>
            <p className="mt-1 text-xs leading-5 text-academy-navy/40">
              Powered by Georgo Analytics and Automation
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
