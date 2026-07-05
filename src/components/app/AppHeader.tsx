import Link from "next/link";
import { SignOutButton } from "./SignOutButton";

// App header for signed in screens. Shows the product name, the signed in
// user's email, and a sign out button.
export function AppHeader({ userEmail }: { userEmail: string }) {
  return (
    <header className="border-b border-ink/10 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <Link
          href="/dashboard"
          className="text-base font-semibold tracking-tight text-ink"
        >
          Toronto Academy CELPIP Practice
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-ink/60 sm:inline">
            {userEmail}
          </span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
