// Class recipes for the practice test engine shell (EXAM-01).
//
// Same idea as src/features/design/design-tokens.ts: every value is a
// Tailwind class string, and the raw colours stay in src/app/globals.css.
// No new colour token was added for the exam engine. The frame is built
// from the existing academy palette:
//
// - academy-navy-soft and academy-line for the grey bars and rules
// - academy-paper for the white exam canvas
// - academy-blue for the primary Next action
// - academy-blue-soft for the answer side of a split screen
// - academy-red for a closing or expired timer
//
// The exam surface intentionally looks different from the dashboard. It
// uses square corners instead of pill controls, tight chrome, and no
// cards or badges, so it reads as a focused test environment.
//
// EXAM-01 review feedback: the first pass still read as a modern web app.
// This pass moves it towards utility test software. The bars are thin and
// hold small controls, the timer is plain text in the bar rather than a
// chip, the canvas is a bordered white sheet sitting in a grey gutter,
// and the split screen is a real divided grid rather than two floating
// blocks.
//
// House style: normal hyphens only, no long hyphens or em dashes.

import { focus } from "@/features/design/design-tokens";
import type {
  ExamButtonSize,
  ExamButtonVariant,
  ExamPanelScroll,
  ExamPanelTone,
  ExamTimerState,
} from "./exam-shell-types";

// Outer page, centred container, and the framed test window.
//
// The frame carries a grey body colour so the gutter around the white
// canvas reads as part of the machine, not as a gap in the page.
export const examFrame = {
  page: "w-full bg-academy-paper-warm",
  container: "mx-auto w-full max-w-5xl",
  frame:
    "flex w-full min-w-0 flex-col overflow-hidden rounded-sm border border-academy-line bg-academy-navy-soft/45",
} as const;

// Grey title bar and grey footer bar.
//
// Both are deliberately thin. A test engine bar is chrome, so it holds a
// line of small text and small controls and gives the rest of the height
// to the canvas.
export const examBar = {
  top: "flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-academy-line bg-linear-to-b from-academy-navy-soft to-academy-navy-soft/65 px-3 py-1.5 sm:px-4",
  bottom:
    "flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-academy-line bg-linear-to-b from-academy-navy-soft/65 to-academy-navy-soft px-3 py-1.5 sm:px-4",
  title:
    "min-w-0 basis-full truncate text-[13px] font-semibold leading-5 text-academy-navy sm:basis-auto sm:flex-1",
  meta: "min-w-0 truncate text-[11px] leading-4 text-academy-navy/60",
  // Timer readings sit together, just left of Next.
  readings: "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0.5",
  // Right hand group in the top bar, holding the readings and Next.
  actions: "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 sm:ml-auto",
  // Bottom bar: Back on the left, anything else pushed to the right.
  back: "flex min-w-0 items-center gap-2",
  secondary: "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 sm:ml-auto",
} as const;

// White exam canvas between the two bars.
//
// region is the grey gutter, sheet is the bordered white page inside it.
// The border is what makes the canvas read as a document the engine is
// displaying rather than as the page background.
export const examCanvas = {
  region: "min-w-0 bg-academy-navy-soft/30 p-2 sm:p-3",
  sheet: "min-w-0 border border-academy-line bg-academy-paper text-academy-navy",
  padded: "px-4 py-5 sm:px-6 sm:py-6",
  minHeight: "min-h-[20rem]",
} as const;

// Buttons. Uppercase is applied by the component so an in canvas action
// can opt out of the shouty test engine label style.
export const examButtonBase = `inline-flex items-center justify-center gap-2 rounded-sm border text-center font-semibold leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${focus.ring}`;

export const examButtonCase = "uppercase tracking-[0.06em]";

export const examButtonVariants: Record<ExamButtonVariant, string> = {
  primary:
    "border-academy-blue bg-academy-blue text-white hover:bg-academy-navy hover:border-academy-navy",
  secondary:
    "border-academy-line bg-academy-paper text-academy-navy hover:bg-academy-navy-soft",
  dark:
    "border-academy-navy bg-academy-navy text-white hover:bg-academy-navy-dark hover:border-academy-navy-dark",
};

// Chrome controls stay small. Next in the top bar is xs, Back in the
// footer is sm, and md is for an action inside the canvas.
export const examButtonSizes: Record<ExamButtonSize, string> = {
  xs: "h-6 px-2.5 text-[11px]",
  sm: "h-7 px-3 text-[11px]",
  md: "h-8 px-4 text-xs",
};

// Timer readings in the top bar.
//
// No chip, no ring, no rounded box. The reading is a line of text that
// belongs to the bar, and state is carried by colour and weight only.
export const examTimer = {
  base: "inline-flex min-w-0 items-baseline gap-1 whitespace-nowrap text-[11px] leading-4 sm:text-xs",
  label: "shrink-0 opacity-75",
  value: "font-semibold tabular-nums",
} as const;

export const examTimerStates: Record<ExamTimerState, string> = {
  normal: "text-academy-navy",
  warning: "text-academy-red",
  expired: "font-semibold text-academy-red",
  muted: "text-academy-navy/55",
};

// Instruction row: small circled information glyph, then the
// instruction. Instruction text in a test engine is dense, so this is a
// step down from body copy rather than a heading.
export const examInstruction = {
  row: "flex min-w-0 items-start gap-2",
  icon: "mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-academy-blue text-[10px] font-bold leading-none text-academy-blue",
  text: "min-w-0 text-[13px] leading-5 text-academy-navy",
  heading: "text-[13px] font-semibold leading-5 text-academy-navy",
} as const;

// Panels used for question sets, passages, and answer areas.
//
// Border colour lives on the tone, and the header and footer rules
// inherit it, so an accent panel is bordered blue and a plain panel is
// bordered grey without either rule fighting the other.
export const examPanel = {
  base: "flex min-w-0 flex-col overflow-hidden rounded-sm border",
  header:
    "shrink-0 border-b border-inherit px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-academy-navy/65",
  body: "min-w-0 px-3 py-3 text-[13px] leading-5 text-academy-navy/85",
  footer:
    "shrink-0 border-t border-inherit px-3 py-1.5 text-[11px] leading-4 text-academy-navy/65",
} as const;

export const examPanelTones: Record<ExamPanelTone, string> = {
  plain: "border-academy-line bg-academy-paper",
  muted: "border-academy-line bg-academy-navy-soft/45",
  accent: "border-academy-blue/25 bg-academy-blue-soft",
};

// Background wash for a split screen column. The answer side uses accent,
// which is the light blue answer panel from the reference layouts.
export const examColumnTones: Record<ExamPanelTone, string> = {
  plain: "bg-academy-paper",
  muted: "bg-academy-navy-soft/40",
  accent: "bg-academy-blue-soft",
};

// Scroll heights. A scrolling region owns its own scrollbar so the page
// never scrolls sideways on a small screen.
export const examScrollHeights: Record<ExamPanelScroll, string> = {
  none: "",
  short: "max-h-56 overflow-y-auto",
  medium: "max-h-80 overflow-y-auto",
  tall: "max-h-[28rem] overflow-y-auto",
};

// Two column split.
//
// The grid draws the divider itself rather than leaving a gap between two
// blocks, so the split reads as one divided work area. On a narrow screen
// the rule turns horizontal and the columns stack.
export const examTwoColumn = {
  grid: "grid min-w-0 grid-cols-1 divide-y divide-academy-line lg:grid-cols-2 lg:divide-x lg:divide-y-0",
  // Outer rule, dropped when the split fills an unpadded canvas and the
  // canvas border is already doing the job.
  bordered: "overflow-hidden rounded-sm border border-academy-line",
  column: "flex min-w-0 flex-col gap-2 p-3 sm:p-4",
  columnLabel:
    "text-[11px] font-semibold uppercase tracking-[0.06em] text-academy-navy/55",
} as const;

// Media placeholder.
//
// A flat grey box with a solid rule and a small inert transport strip,
// which is how an audio or video area reads in test software. No player
// is built in this ticket, this is the area a later ticket drops one
// into.
export const examMedia = {
  base: "flex min-w-0 flex-col items-center justify-center gap-2 rounded-sm border border-academy-line bg-academy-navy-soft px-4 py-4 text-center",
  video: "aspect-video justify-center",
  glyph: "text-academy-navy/40",
  label: "text-[13px] font-semibold leading-5 text-academy-navy",
  helper: "max-w-md text-[11px] leading-4 text-academy-navy/60",
  // Inert transport strip: play glyph, track, time. Nothing is seekable.
  transport:
    "mt-1 flex w-full max-w-sm min-w-0 items-center gap-2 rounded-sm border border-academy-line bg-academy-paper px-2 py-1",
  transportButton:
    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-academy-navy/40 text-academy-paper",
  track: "h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-academy-navy/12",
  trackFill: "h-full w-1/3 rounded-full bg-academy-navy/35",
  time: "shrink-0 text-[10px] leading-4 tabular-nums text-academy-navy/55",
} as const;

// Real video player, added by EXAM-02 for the instructional video
// screens.
//
// The clip sits in a clean bordered area: a dark stage holding the video
// itself, and a thin caption strip under it carrying the clip title and
// its running time when one is known. The stage is aspect-video and the
// element fills it, so the box keeps its shape on any width and the
// screen never scrolls sideways.
//
// This is the same slot the grey ExamMediaPlaceholder reserves. A screen
// swaps one for the other without changing the layout around it.
export const examVideo = {
  wrap: "min-w-0 overflow-hidden rounded-sm border border-academy-line bg-academy-paper",
  stage: "relative aspect-video w-full min-w-0 bg-academy-navy-dark",
  element: "absolute inset-0 block h-full w-full",
  caption:
    "flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-0.5 border-t border-academy-line px-3 py-1.5",
  captionTitle:
    "min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.06em] text-academy-navy/70",
  captionMeta: "shrink-0 text-[11px] leading-4 tabular-nums text-academy-navy/55",
  // Shown in place of the stage when the clip cannot load.
  fallback:
    "flex min-w-0 flex-col items-center justify-center gap-1 bg-academy-navy-soft px-4 py-8 text-center",
  fallbackTitle: "text-[13px] font-semibold leading-5 text-academy-navy",
  fallbackText: "max-w-md text-[11px] leading-4 text-academy-navy/60",
} as const;

// Section intro block at the top of an instruction screen.
//
// A quiet bordered strip, not a dashboard card: no shadow, no artwork, no
// pill. It states which section the learner is about to start and, when
// they are known, a few facts about it such as the number of parts.
export const examIntroCard = {
  card: "flex min-w-0 flex-col gap-1 rounded-sm border border-academy-line bg-academy-navy-soft/40 px-3 py-2.5",
  label: "text-[11px] font-semibold uppercase tracking-[0.06em] text-academy-navy/55",
  title: "text-sm font-semibold leading-5 text-academy-navy",
  summary: "text-[13px] leading-5 text-academy-navy/80",
  detailList: "mt-1 flex min-w-0 flex-wrap gap-x-4 gap-y-1",
  detailItem: "flex min-w-0 items-baseline gap-1 text-[11px] leading-4",
  detailLabel: "font-semibold uppercase tracking-[0.06em] text-academy-navy/50",
  detailValue: "tabular-nums text-academy-navy/75",
} as const;

// Shared body scaffolding for the instruction and video screens.
export const examScreenBody = {
  stack: "flex min-w-0 flex-col gap-4",
  // The player column is capped, so a wide screen does not stretch the
  // clip across the full canvas.
  videoStack: "mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-3",
  actions: "flex min-w-0 flex-wrap items-center gap-3",
  // Quiet note under the list or the player.
  notice:
    "rounded-sm border border-academy-line bg-academy-navy-soft/35 px-3 py-2 text-[11px] leading-4 text-academy-navy/70",
  hint: "text-[11px] leading-4 text-academy-navy/60",
} as const;

// Question progress line, for example Question 3 of 8.
export const examProgress = {
  wrap: "flex min-w-0 flex-col gap-1.5",
  label: "text-[11px] font-semibold uppercase tracking-[0.06em] text-academy-navy/70",
  track: "h-1 w-full overflow-hidden rounded-full bg-academy-navy/12",
  fill: "h-full rounded-full bg-academy-blue transition-[width] duration-300",
} as const;

// Shared body text tones inside the canvas. Exam copy runs tighter than
// dashboard copy, so these sit a step below the marketing scale.
export const examText = {
  heading: "text-sm font-semibold text-academy-navy sm:text-base",
  body: "text-[13px] leading-5 text-academy-navy/85",
  muted: "text-[11px] leading-4 text-academy-navy/60",
  bulletList: "space-y-0 text-[13px] leading-5 text-academy-navy/85",
  bulletItem: "border-b border-dotted border-academy-line py-1.5 last:border-b-0",
} as const;
