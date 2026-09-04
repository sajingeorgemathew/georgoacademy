// Class recipes for the Mock Test 1 player chrome (EXAM-UI-02).
//
// Same idea as exam-theme.ts beside this file: every value is a Tailwind
// class string and the raw colours live in src/app/globals.css. What is
// different is the job.
//
// exam-theme.ts holds the recipes a screen body is built from, which is
// question lists, passages, editors, review tables and score cards.
// This file holds the recipes the window around them is built from, which
// is the desk, the frame, the two bars, the content pane, the buttons, the
// timer badge and the split pane.
//
// Why the split matters. The player chrome is the part of the test that a
// learner never reads and always sees, so it has to be the part that
// stops looking like a product. Keeping it in its own file means the
// question of "how wide is the exam window" has exactly one answer, in one
// place, rather than being an emergent property of forty screen recipes.
//
// The palette is the player ramp, not the CELPIP Decoded brand:
//
//   player-desk         the grey the exam window sits on
//   player-chrome       the compact top and bottom bars
//   player-line         the window border and internal rules
//   player-paper        the white content area
//   player-ink          body text
//   player-blue         the primary exam action
//
// Legal note. Nothing here is taken from any official test provider. The
// window is a plain grey and white application frame, there is no official
// logo anywhere in it, the primary action is an ordinary interface blue
// rather than an official blue-red pairing, and no footer carries anyone
// else's copyright line. This is an original practice simulator skin.
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

// The desk, the centred container, and the exam window itself.
//
// Three levels, and each one is answering a specific complaint from the
// EXAM-UI-02 brief.
//
// **desk** is the grey the window sits on. It grows to fill whatever
// height its parent has, which inside the locked player viewport is the
// browser window and on an ordinary page is nothing at all. That is the
// same deliberately inert height request the old frame made, and it is
// what lets one set of classes serve both places.
//
// **container** is the width cap and the margins. max-w-[1100px] is the
// middle of the 1040 to 1120 band the brief asks for, and it is the whole
// answer to the test feeling stretched: on a wide monitor the window stops
// growing and the desk takes the rest. 40 pixels of desk above and 32
// below, which is the band the brief asks for.
//
// It grows rather than asking for a percentage of the desk, so the height
// chain from the viewport to the content pane is pure flex and nothing in
// it depends on a percentage resolving against a stretched parent.
//
// **window** is the frame. A light grey border, small corners, a hairline
// shadow, and overflow-hidden so the two bars clip the content pane rather
// than the content pane pushing past them. min-h-[34rem] is a floor, not a
// height: on a very short window the desk scrolls instead of the bars
// being crushed.
export const playerFrame = {
  desk: "flex min-h-0 w-full grow flex-col bg-player-desk",
  container:
    "mx-auto flex min-h-0 w-full min-w-0 max-w-[1100px] grow flex-col px-3 py-8 sm:px-4 sm:pt-10 sm:pb-8",
  window:
    "flex min-h-[34rem] w-full min-w-0 grow flex-col overflow-hidden rounded-md border border-player-line bg-player-paper shadow-[0_1px_2px_rgba(15,23,42,0.08)]",
} as const;

// The locked player viewport.
//
// The desk is what fills the browser, so this is the only element on the
// screen with a document level scrollbar, and it only ever uses it when
// the window will not fit. overscroll-none stops a flick past the end
// bouncing the page behind it.
export const playerViewport = {
  overlay:
    "fixed inset-0 z-[100] overflow-y-auto overscroll-none bg-player-desk",
  // h-full, not min-h-full. A minimum height still lets the box grow with
  // its content, which meant the exam window grew with the screen inside
  // it and the content pane never had a reason to scroll: a long screen
  // pushed the bottom bar below the fold instead. A definite height is
  // what makes the pane the thing that gives, which is the whole scroll
  // rule of the player. When the window's own minimum will not fit, it
  // overflows and the desk above takes the scrollbar.
  inner: "flex h-full w-full min-w-0 flex-col",
} as const;

// The two bars.
//
// Compact by intent: the brief asks for 46 to 56 pixels on the top bar and
// 52 to 64 on the bottom, so both carry a min height rather than relying
// on their padding, and both refuse to shrink. A bar that can be squeezed
// is a bar that can hide the Next control on a short window, which is one
// of the navigation problems this ticket exists to fix.
//
// The title is plain text at exam weight. No logo, no wordmark, no product
// name: there is nothing in this bar that says which company built the
// simulator, because a test window does not advertise.
export const playerBar = {
  top: "flex min-h-[3rem] w-full min-w-0 shrink-0 flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-player-line bg-player-chrome px-3 py-2 sm:px-4",
  bottom:
    "flex min-h-[3.5rem] w-full min-w-0 shrink-0 flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-player-line bg-player-chrome px-3 py-2 sm:px-4",
  title:
    "min-w-0 basis-full truncate text-[15px] font-semibold leading-6 text-player-ink sm:basis-auto sm:flex-1",
  meta: "min-w-0 truncate text-[12px] leading-4 text-player-ink/60",
  readings: "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0.5",
  actions: "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 sm:ml-auto",
  back: "flex min-w-0 items-center gap-2",
  secondary: "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 sm:ml-auto",
} as const;

// The white content area between the bars.
//
// One scrolling region, and this is the fix for trapped content. The pane
// grows into whatever height the window has left after the two bars, and
// anything taller scrolls inside it. The bars do not move, so Next and
// Back are reachable from every screen no matter how long a passage, an
// image or a question list turns out to be.
//
// min-h-0 on a flex child is what makes that work at all: without it the
// pane refuses to shrink below its content and pushes the bottom bar off
// the window instead of scrolling.
//
// The old canvas drew a grey gutter with a bordered white sheet floating
// inside it. That is one border too many now that the window itself has
// one, so the pane is simply white to its edges.
//
// fill is for a screen that manages its own internal scrolling, which is
// the reading split pane: the pane stops scrolling and hands the job to
// the two columns, so a learner never scrolls a scrollbar inside a
// scrollbar.
export const playerContent = {
  region:
    "flex min-h-0 min-w-0 grow flex-col overflow-y-auto overscroll-contain bg-player-paper",
  regionFill:
    "flex min-h-0 min-w-0 grow flex-col overflow-y-auto overscroll-contain bg-player-paper lg:overflow-hidden",
  body: "flex min-w-0 shrink-0 grow flex-col",
  bodyFill: "flex min-h-0 min-w-0 grow flex-col",
  padded: "px-4 py-5 sm:px-6 sm:py-6",
} as const;

// Buttons.
//
// Square cornered, compact, uppercase for the two navigation labels. The
// sizes are a step up from the old chrome buttons, which were 24 and 28
// pixels tall and read as toolbar affordances rather than as the two
// controls a learner uses on every screen.
export const playerButtonBase = `inline-flex items-center justify-center gap-2 rounded-sm border text-center font-semibold leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${focus.ring}`;

export const playerButtonCase = "uppercase tracking-[0.06em]";

export const playerButtonVariants: Record<ExamButtonVariant, string> = {
  primary:
    "border-player-blue bg-player-blue text-white hover:border-player-blue-dark hover:bg-player-blue-dark",
  secondary:
    "border-player-line bg-player-paper text-player-ink hover:bg-player-chrome-soft",
  dark: "border-player-ink bg-player-ink text-white hover:border-black hover:bg-black",
};

export const playerButtonSizes: Record<ExamButtonSize, string> = {
  xs: "h-8 px-3 text-[12px]",
  sm: "h-9 px-4 text-[12px]",
  md: "h-9 px-5 text-[13px]",
};

// Timer badge in the top bar.
//
// A quiet bordered pill rather than the loose line of text the old bar
// carried. The brief asks for a timer that is prominent but not huge, and
// a badge is readable at a glance without taking a size that would set the
// height of the bar around it.
//
// tabular-nums is load bearing: a live countdown pads to 00:30 and every
// digit is the same width, so a second ticking over moves nothing beside
// it.
export const playerTimer = {
  base: "inline-flex min-w-0 items-baseline gap-1.5 whitespace-nowrap rounded-sm border border-player-line bg-player-paper px-2 py-1 text-[13px] leading-4",
  label: "shrink-0 text-[11px] font-semibold uppercase tracking-[0.06em] opacity-70",
  value: "font-semibold tabular-nums",
} as const;

export const playerTimerStates: Record<ExamTimerState, string> = {
  normal: "text-player-ink",
  warning: "border-academy-amber/45 text-academy-amber",
  urgent: "border-academy-red/45 text-academy-red",
  expired: "border-academy-red/45 font-semibold text-academy-red",
  muted: "text-player-ink/55",
};

// Instruction list on an instructions screen.
//
// Instruction copy runs a size up from question copy, because it is the
// one block on the screen a learner reads as prose rather than scans. The
// brief asks for 16 to 18 pixels here and 15 to 17 for body, so this is 16
// and the rest of the exam sits at 15.
//
// The heading is player blue, which the brief allows, and it is the only
// colour on the screen.
export const playerInstruction = {
  list: "flex min-w-0 flex-col",
  item: "flex min-w-0 items-start gap-2.5 border-b border-player-line/60 py-1.5 last:border-b-0",
  marker: "mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-player-blue",
  heading: "font-semibold text-player-blue",
  text: "min-w-0 text-[15px] leading-6 text-player-ink",
} as const;

// The circled information glyph (EXAM-UI-03).
//
// One recipe, read by MockTestInfoIcon, so the glyph beside "Listening
// Test Instructions" and the glyph beside "Listen to the question" are
// provably the same mark at the same size. It is a bordered circle with a
// letter i drawn in it, not an icon package: no icon dependency is
// installed for the exam engine, and a two element glyph cannot be
// mistaken for anyone's proprietary asset.
//
// The nudge is a top margin rather than items-center, because the icon
// aligns to the first line of the text beside it and that text can run to
// several lines.
export const playerInfoIcon = {
  base: "flex shrink-0 items-center justify-center rounded-full border border-player-blue font-bold leading-none text-player-blue",
  md: "mt-1 h-[18px] w-[18px] text-[11px]",
  sm: "mt-[3px] h-4 w-4 text-[10px]",
} as const;

// Audio visual card (EXAM-UI-03).
//
// The block a Listening clip plays inside. An original speaker mark, a
// status word, a progress bar, the browser's own controls, and a line
// saying the playbar is a practice aid. Compact and centred, because the
// clip is the only thing on the screen while it runs.
//
// The bar is a plain div whose width is set from the clip's own
// currentTime. It drives nothing: seeking, playing and pausing all still
// happen through the native control below it, so the visual can never
// disagree with what is actually playing.
export const playerAudioVisual = {
  card: "mx-auto flex w-full min-w-0 max-w-md flex-col items-center gap-2.5 rounded-sm border border-player-line bg-player-chrome-soft px-4 py-4",
  speaker:
    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-player-line bg-player-paper text-player-blue",
  speakerIcon: "h-6 w-6",
  status:
    "text-[12px] font-semibold uppercase tracking-[0.08em] text-player-ink/70",
  title: "max-w-full truncate text-[13px] leading-5 text-player-ink/70",
  track: "h-1.5 w-full min-w-0 overflow-hidden rounded-full bg-player-ink/12",
  fill: "h-full rounded-full bg-player-blue transition-[width] duration-200",
  times:
    "flex w-full min-w-0 items-center justify-between text-[11px] leading-4 tabular-nums text-player-ink/55",
  controls: "w-full min-w-0",
  element: "block h-9 w-full min-w-0",
  note: "text-center text-[11px] leading-4 text-player-ink/55",
  // Shown in place of the card body when the clip will not load.
  fallback: "flex min-w-0 flex-col items-center gap-1 text-center",
  fallbackTitle: "text-[15px] font-semibold leading-5 text-player-ink",
  fallbackText: "max-w-sm text-[12px] leading-4 text-player-ink/60",
  // Shown under the controls when the browser refused to start the clip.
  notice: "text-center text-[12px] leading-4 text-player-ink",
} as const;

// Option row on a question screen (EXAM-UI-03).
//
// The fix for the option list the QA pass reported as feeling like a web
// quiz. Three rules:
//
// - **hover is a neutral grey**, player-chrome-soft, not a colour. An
//   option a learner is only passing the pointer over must not read as
//   an option they have chosen, and a saturated wash on hover reads as
//   feedback about the answer, which a test must never give.
// - **selected is a controlled pale blue**, player-blue-soft, which is
//   the same tint the split screen answer column uses. It is legible at a
//   glance across a screen of thirty two options and it is still quiet.
// - **rows are ruled, not spaced**. A hairline between options is what
//   keeps four options compact enough that a whole question fits above
//   the fold, and it is what the reference exam layout does.
//
// The whole row is the click target, so nobody has to hit the circle.
// The circle itself is nudged to sit on the centre of the first line of
// its label rather than on the top of it.
export const playerOption = {
  list: "flex min-w-0 flex-col divide-y divide-player-line/60",
  row: "flex min-w-0 cursor-pointer items-start gap-2.5 rounded-sm px-2 py-1.5 transition-colors hover:bg-player-chrome-soft",
  // The selected row carries a wash and a hairline ring, not just a wash.
  // The Parts 1 to 3 answer column is itself pale blue, so a pale blue
  // fill alone is invisible there and the only cue left is the radio dot.
  // The ring reads on the tinted column and the fill reads on the white
  // one screen parts, so one recipe works on both surfaces.
  rowSelected:
    "bg-player-blue-soft ring-1 ring-inset ring-player-blue/40 hover:bg-player-blue-soft",
  input:
    "mt-[5px] h-3.5 w-3.5 shrink-0 accent-player-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-player-blue",
  text: "min-w-0 text-[15px] leading-6 text-player-ink",
} as const;

// Dropdown completion list (EXAM-UI-03).
//
// The control Listening Parts 4, 5 and 6 are answered with. Each item is
// a bordered block: a tinted strip carrying the number and the question
// or the statement, and the select under it in the body of the block.
//
// The select is capped rather than full width. Option text here is a
// sentence fragment, so a control stretched across an 1100 pixel window
// would put its value a long way from the words it completes.
export const playerDropdown = {
  list: "flex min-w-0 flex-col gap-2",
  item: "min-w-0 overflow-hidden rounded-sm border border-player-line bg-player-paper",
  statement:
    "block w-full min-w-0 border-b border-player-line bg-player-chrome-soft px-3 py-2 text-[15px] leading-6 text-player-ink",
  number: "mr-2 font-semibold tabular-nums text-player-ink/55",
  // The blank in a statement. Underscores come from the source document,
  // so they are drawn rather than replaced, just quieted.
  blank: "px-0.5 tracking-tight text-player-ink/45",
  control: "min-w-0 px-3 py-2.5",
  select: `h-9 w-full min-w-0 max-w-lg rounded-sm border border-player-line bg-player-paper px-2 text-[15px] leading-6 text-player-ink ${focus.ring}`,
  // Shown while the question has no answer.
  selectEmpty: "text-player-ink/55",
  // Answered count under the list.
  note: "text-[12px] leading-4 text-player-ink/60",
} as const;

// Media frame: the box an image, an audio player or a video sits in.
//
// The height cap is the fix for the oversized images the brief calls out.
// A scenario drawing served at its intrinsic size could be taller than the
// content pane on a laptop, which pushed the questions under it out of
// sight and made the screen feel bottomless. Capping the picture at a
// share of the viewport and letting it letterbox inside the frame keeps
// the whole screen on one page.
//
// object-contain rather than cover, because a test image is information
// and cropping it would remove some.
export const playerMedia = {
  frame:
    "mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-1.5 overflow-hidden",
  surface:
    "flex min-w-0 items-center justify-center overflow-hidden rounded-sm border border-player-line bg-player-chrome-soft",
  image: "block h-auto max-h-[46vh] w-auto max-w-full object-contain",
  imageTall: "block h-auto max-h-[62vh] w-auto max-w-full object-contain",
  caption: "text-[12px] leading-4 text-player-ink/60",
  audioWrap:
    "mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-1.5 rounded-sm border border-player-line bg-player-chrome-soft px-3 py-2.5",
  audioElement: "block h-10 w-full min-w-0",
} as const;

// Split pane: passage on the left, questions on the right.
//
// The brief asks for each side to scroll on its own, and the fill mode
// below is what delivers it. The grid is one row at the height of the
// content pane, both cells are min-h-0 flex columns, and each cell's body
// takes the scrollbar. So a long passage and a long question list scroll
// past each other independently and neither one moves the bars.
//
// Below the large breakpoint the split stacks and the fill mode is
// dropped, because two short scroll boxes stacked on a phone is worse than
// one page that scrolls.
export const playerSplit = {
  grid: "grid min-w-0 grid-cols-1 divide-y divide-player-line lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:divide-x lg:divide-y-0",
  gridFill: "lg:min-h-0 lg:grow lg:grid-rows-[minmax(0,1fr)]",
  bordered: "overflow-hidden rounded-sm border border-player-line",
  column: "flex min-w-0 flex-col gap-2 p-3 sm:p-4",
  columnFill: "lg:min-h-0 lg:overflow-hidden",
  columnLabel:
    "shrink-0 text-[12px] font-semibold uppercase tracking-[0.06em] text-player-ink/55",
  columnBody: "min-w-0",
  columnBodyFill:
    "min-w-0 lg:min-h-0 lg:grow lg:overflow-y-auto lg:overscroll-contain lg:pr-1",
} as const;

export const playerColumnTones: Record<ExamPanelTone, string> = {
  plain: "bg-player-paper",
  muted: "bg-player-chrome-soft",
  accent: "bg-player-blue-soft",
};

// Fixed scroll heights, kept for the screens that ask for one, plus the
// fill mode the split pane uses.
export const playerScrollHeights: Record<ExamPanelScroll, string> = {
  none: "",
  short: "max-h-64 overflow-y-auto overscroll-contain",
  medium: "max-h-[22rem] overflow-y-auto overscroll-contain",
  tall: "max-h-[30rem] overflow-y-auto overscroll-contain",
};

// Question panel: the bordered box a question set sits in.
export const playerPanel = {
  base: "flex min-w-0 flex-col overflow-hidden rounded-sm border",
  header:
    "shrink-0 border-b border-inherit px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-player-ink/65",
  body: "min-w-0 px-3 py-3 text-[15px] leading-6 text-player-ink",
  footer:
    "shrink-0 border-t border-inherit px-3 py-2 text-[12px] leading-4 text-player-ink/65",
} as const;

export const playerPanelTones: Record<ExamPanelTone, string> = {
  plain: "border-player-line bg-player-paper",
  muted: "border-player-line bg-player-chrome-soft",
  accent: "border-player-blue/25 bg-player-blue-soft",
};

// Review panel: the block a review or a result screen is built from.
//
// Capped and centred, because a review is a document to read rather than a
// screen to work on, and a 1100 pixel measure is too wide for one.
export const playerReview = {
  stack: "mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-4",
  heading: "text-[18px] font-semibold leading-7 text-player-ink",
  summary: "text-[15px] leading-6 text-player-ink/80",
  panel:
    "flex min-w-0 flex-col overflow-hidden rounded-sm border border-player-line bg-player-paper",
  panelHeader:
    "flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-player-line bg-player-chrome-soft px-3 py-2",
  panelTitle:
    "text-[12px] font-semibold uppercase tracking-[0.06em] text-player-ink/65",
  panelMeta: "text-[12px] leading-4 tabular-nums text-player-ink/60",
  panelBody: "min-w-0",
  panelBodyPadded: "min-w-0 px-3 py-3",
  panelFooter:
    "border-t border-player-line px-3 py-2 text-[12px] leading-4 text-player-ink/65",
  // Long review lists scroll inside the panel rather than the pane, so
  // the bottom bar stays put on a 38 question Listening review.
  scroll: "max-h-[26rem] overflow-y-auto overscroll-contain",
} as const;
