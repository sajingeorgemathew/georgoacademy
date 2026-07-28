// Maps stored badge slugs to badge artwork.
//
// The slugs here must match the badge catalog seeded in Supabase and used
// by src/features/speaking/level-badges.ts. Do not rename them. The UI
// label can say communicator even where the slug says speaker.
//
// Some slugs have no exact artwork yet, so the closest available badge is
// used as a stand-in. Those are marked below so a future design ticket can
// commission the missing pieces.

import { badgeAssets } from "./asset-registry";

export const BADGE_ASSET_MAP = {
  // No dedicated artwork yet, first speaking badge is the closest fit.
  "foundation-speaker": badgeAssets.firstSpeaking,
  // No dedicated artwork yet, speaking improver reads as developing.
  "developing-communicator": badgeAssets.speakingImprover,
  // Exact match.
  "test-ready-builder": badgeAssets.testReadyBuilder,
  // Slug says speaker, artwork and label say communicator.
  "confident-speaker": badgeAssets.confidentCommunicator,
  // Exact match.
  "advanced-communicator": badgeAssets.advancedCommunicator,
} as const;

export type MappedBadgeSlug = keyof typeof BADGE_ASSET_MAP;

// Slugs that still need their own artwork.
export const BADGE_SLUGS_NEEDING_ARTWORK: readonly MappedBadgeSlug[] = [
  "foundation-speaker",
  "developing-communicator",
];

// Shown when a slug has no mapping, for example a practice badge that is
// awarded outside the level ladder.
export const FALLBACK_BADGE_ASSET = badgeAssets.consistentLearner;

// Resolves any badge slug to an image path. Unknown slugs fall back so the
// UI never renders a broken image.
export function getBadgeAsset(slug: string | null | undefined): string {
  if (!slug) return FALLBACK_BADGE_ASSET;
  return BADGE_ASSET_MAP[slug as MappedBadgeSlug] ?? FALLBACK_BADGE_ASSET;
}
