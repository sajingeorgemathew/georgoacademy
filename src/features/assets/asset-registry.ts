// Central registry of static image assets served from public/.
//
// Paths point at the optimized WebP copies created by
// scripts/audit-and-optimize-assets.mjs when one exists, and at the
// original file when conversion is unsafe (favicon, app icon) or no
// optimized copy was needed.
//
// Regenerate optimized copies with: npm run assets:optimize
// Inventory and warnings: docs/product/asset-inventory.md

export const brandingAssets = {
  // Browser and app icons stay as the original PNG on purpose.
  favicon: "/favicon.png",
  taeFavicon: "/assets/branding/tae-favicon.png",
  // Logos keep their original raster form, they are already small.
  logoPrimary: "/assets/branding/tae-logo-primary.jpg",
  logoHorizontal: "/assets/branding/tae-logo-horizontal.jpg",
  logoWithSlogan: "/assets/branding/logo_final_Tslogan.png",
  // Header and footer lockup used on the landing page.
  landingLogo: "/taelogo.jpg",
  poweredBy: "/assets/optimized/branding/georgo-powered-by.webp",
  poweredByOriginal: "/assets/branding/georgo-powered-by.png",
} as const;

export const dashboardAssets = {
  studyHero: "/assets/optimized/illustrations/dashboard-study-hero.webp",
  practiceJourney: "/assets/optimized/illustrations/dashboard-practice-journey.webp",
  progressOverview: "/assets/optimized/illustrations/dashboard-progress-overview.webp",
  liveClasses: "/assets/optimized/illustrations/dashboard-live-classes.webp",
} as const;

export const emptyStateAssets = {
  noBadges: "/assets/optimized/empty-states/empty-no-badges.webp",
  noFeedback: "/assets/optimized/empty-states/empty-no-feedback.webp",
  noProgress: "/assets/optimized/empty-states/empty-no-progress.webp",
  speakingHistory: "/assets/optimized/empty-states/empty-speaking-history.webp",
  writingHistory: "/assets/optimized/empty-states/empty-writing-history.webp",
} as const;

export const skillAssets = {
  speaking: "/assets/optimized/skills/skill-speaking.webp",
  writing: "/assets/optimized/skills/skill-writing.webp",
  reading: "/assets/optimized/skills/skill-reading.webp",
  listening: "/assets/optimized/skills/skill-listening.webp",
} as const;

export const badgeAssets = {
  advancedCommunicator: "/assets/optimized/badges/badge-advanced-communicator.webp",
  confidentCommunicator: "/assets/optimized/badges/badge-confident-communicator.webp",
  testReadyBuilder: "/assets/optimized/badges/badge-test-ready-builder.webp",
  consistentLearner: "/assets/optimized/badges/badge-consistent-learner.webp",
  feedbackFinisher: "/assets/optimized/badges/badge-feedback-finisher.webp",
  firstSpeaking: "/assets/optimized/badges/badge-first-speaking.webp",
  firstWriting: "/assets/optimized/badges/badge-first-writing.webp",
  speakingImprover: "/assets/optimized/badges/badge-speaking-improver.webp",
  writingImprover: "/assets/optimized/badges/badge-writing-improver.webp",
} as const;

export type BrandingAssetKey = keyof typeof brandingAssets;
export type DashboardAssetKey = keyof typeof dashboardAssets;
export type EmptyStateAssetKey = keyof typeof emptyStateAssets;
export type SkillAssetKey = keyof typeof skillAssets;
export type BadgeAssetKey = keyof typeof badgeAssets;
