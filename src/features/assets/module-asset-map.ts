// Maps module slugs to their skill icon and card illustration.
//
// Slugs match the modules table used by the dashboard, see
// src/components/app/ModuleCard.tsx. Live classes is not a practice module
// but it appears on the dashboard, so it is mapped here too.

import { dashboardAssets, skillAssets } from "./asset-registry";

export type ModuleAsset = {
  // Square-ish skill icon for module tiles.
  icon: string;
  // Wider illustration for hero and card headers.
  illustration: string;
};

// Used when a module slug has no artwork of its own.
export const FALLBACK_MODULE_ASSET: ModuleAsset = {
  icon: skillAssets.speaking,
  illustration: dashboardAssets.practiceJourney,
};

export const MODULE_ASSET_MAP = {
  "celpip-speaking": {
    icon: skillAssets.speaking,
    illustration: dashboardAssets.practiceJourney,
  },
  "celpip-writing": {
    icon: skillAssets.writing,
    illustration: dashboardAssets.practiceJourney,
  },
  "celpip-reading": {
    icon: skillAssets.reading,
    // No reading specific illustration yet, progress overview is neutral.
    illustration: dashboardAssets.progressOverview,
  },
  "celpip-listening": {
    icon: skillAssets.listening,
    // No listening specific illustration yet.
    illustration: dashboardAssets.progressOverview,
  },
  "live-classes": {
    // No dedicated live classes icon yet, speaking is the closest fit.
    icon: skillAssets.speaking,
    illustration: dashboardAssets.liveClasses,
  },
} as const satisfies Record<string, ModuleAsset>;

export type MappedModuleSlug = keyof typeof MODULE_ASSET_MAP;

// Resolves any module slug to artwork, falling back so the UI never
// renders a broken image.
export function getModuleAsset(slug: string | null | undefined): ModuleAsset {
  if (!slug) return FALLBACK_MODULE_ASSET;
  return MODULE_ASSET_MAP[slug as MappedModuleSlug] ?? FALLBACK_MODULE_ASSET;
}
