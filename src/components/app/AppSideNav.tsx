import Link from "next/link";
import { AppAssetImage } from "./AppAssetImage";
import { AppNavLink } from "./AppNavLink";
import { brandingAssets } from "@/features/assets/asset-registry";
import { cx, focus, text } from "@/features/design/design-tokens";
import { APP_NAV_ITEMS } from "@/features/navigation/app-nav-items";

// Desktop sidebar. Hidden below the lg breakpoint, where AppMobileNav
// takes over.
//
// It sticks to the viewport so the learner keeps the same navigation
// while a long attempt history scrolls next to it. Only the nav list
// scrolls if it ever outgrows the screen, the brand stays put.

export function AppSideNav() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-academy-line bg-academy-paper lg:block xl:w-72">
      <div className="sticky top-0 flex h-screen flex-col gap-6 px-4 py-6">
        <Link
          href="/dashboard"
          className={cx(
            "flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-academy-navy-soft",
            focus.ring,
          )}
        >
          <AppAssetImage
            src={brandingAssets.favicon}
            alt="Toronto Academy of Education"
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-xl"
          />
          <span className="min-w-0">
            <span
              className={cx(
                "block text-sm font-semibold leading-tight",
                text.primary,
              )}
            >
              Toronto Academy of Education
            </span>
            <span className={cx("mt-0.5 block text-xs", text.muted)}>
              CELPIP Preparation
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="min-h-0 flex-1 overflow-y-auto">
          <ul className="space-y-1.5">
            {APP_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <AppNavLink item={item} />
              </li>
            ))}
          </ul>
        </nav>

        <p className={cx("px-2 text-xs leading-5", text.muted)}>
          Practice feedback supports your preparation. It is not an
          official CELPIP score.
        </p>
      </div>
    </aside>
  );
}
