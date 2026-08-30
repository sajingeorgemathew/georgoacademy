// Class recipes for the practice test engine shell (EXAM-01).
//
// Same idea as src/features/design/design-tokens.ts: every value is a
// Tailwind class string, and the raw colours stay in src/app/globals.css.
// The frame is built from the academy palette:
//
// - academy-exam-surface for the sheet behind the exam frame
// - academy-exam-gutter for the grey the white canvas sits in
// - academy-navy-soft and academy-line for the grey bars and rules
// - academy-paper for the white exam canvas
// - academy-blue for the primary Next action
// - academy-blue-soft for the answer side of a split screen
// - academy-red for a closing or expired timer
//
// EXAM-15F added the first two. Everything in exam mode used to sit on
// academy-paper-warm, which is the warm off white the signed in product
// and the landing page share, and the bars and the gutter were drawn as
// translucent navy over it. The result read as a warm marketing page with
// a test on top of it. The two exam tokens are flat and cool, no alpha is
// laid over anything warm any more, and the two bars are one solid colour
// rather than a gradient. Nothing outside the exam engine uses them.
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
import type { ListeningReviewStatus } from "./listening-review-types";
import type { ReadingReviewStatus } from "./reading-types";

// Outer page, centred container, and the framed test window.
//
// The frame carries a grey body colour so the gutter around the white
// canvas reads as part of the machine, not as a gap in the page.
//
// Both colours are the flat exam neutrals (EXAM-15F) rather than the warm
// paper the rest of the signed in product uses, so an exam screen looks
// the same on the internal part routes as it does inside the locked
// viewport, and neither one picks up the warm cast.
//
// Height (EXAM-15B). All three levels ask for the full height of their
// parent, and that request is deliberately inert on an ordinary page: a
// percentage height resolves to auto when the parent's own height comes
// from its content, which is what happens everywhere the frame sits
// inside a normal dashboard page. It only bites inside a parent with a
// real height, which is what examViewport below gives it, and there it
// makes the frame exactly one viewport tall so the two bars stay put and
// the canvas takes the rest. One set of classes covers both, so no screen
// has to know which one it is in.
export const examFrame = {
  page: "flex h-full min-h-0 w-full flex-col bg-academy-exam-surface",
  container: "mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col",
  frame:
    "flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-sm border border-academy-line bg-academy-exam-gutter",
} as const;

// Locked exam viewport (EXAM-15B).
//
// The full Listening route sits under /dashboard, so the dashboard layout
// wraps it in navigation, a breadcrumb trail and a footer. A real computer
// based test screen has none of that, so the route covers the lot with a
// fixed overlay one viewport tall instead of trying to unpick the layout
// around it.
//
// overlay is the sheet of neutral background pinned over the window. It is
// the flat exam neutral (EXAM-15F): the warm paper it used to carry let a
// strip of marketing colour frame the test from the first screen to the
// last.
//
// Since the second EXAM-15F QA pass the dashboard chrome is not rendered on
// an exam route at all, so the overlay is no longer covering anything. It
// still pins itself to the window rather than flowing in the page, because
// that is what guarantees the two bars stay put while the canvas between
// them scrolls, and z-[100] stays as a floor under it: it is above the app
// header at z-50 and the mobile drawer at z-40, so an exam route added to
// the shell's list before its own page is ready still cannot show chrome
// through the test.
//
// inner is the window tall box the exam frame fills. It never scrolls
// itself: any overflow is handed to the canvas inside the frame, which is
// the only region on the screen with a scrollbar.
//
// Full bleed (second QA pass). Both the padding around the frame and the
// centring of it are gone. The frame used to sit in a 2 or 3 pixel gutter,
// centred and capped at max-w-5xl by examFrame.container, which on a wide
// monitor drew the test as a floating card on a grey field, in roughly the
// same place and at roughly the same width as the dashboard content column
// it had just replaced. Test software fills the screen, so the frame does
// now: the cap is lifted inside the viewport by the exam mode rules in
// globals.css, and the frame's own border and rounded corners are dropped
// there too, because a border drawn along the edge of the window is not a
// frame, it is a stray line.
//
// overscroll-none on the overlay (EXAM-15C). The document scroll lock stops
// the page moving, but a flick that reaches the end of the canvas can still
// chain out to the document and produce the rubber band bounce. Refusing
// the chain at the overlay keeps the screen still.
export const examViewport = {
  overlay:
    "fixed inset-0 z-[100] overflow-hidden overscroll-none bg-academy-exam-surface",
  inner: "flex h-full w-full min-w-0 flex-col overflow-hidden",
} as const;

// Grey title bar and grey footer bar.
//
// Both are deliberately thin. A test engine bar is chrome, so it holds a
// line of small text and small controls and gives the rest of the height
// to the canvas.
//
// shrink-0 on both (EXAM-15C). Inside the fixed exam viewport the frame is
// a flex column with a hard height, and a flex item shrinks below its
// content by default. Without this, a screen tall enough to fight for space
// can squeeze the bars: the title bar loses its padding, and on a short
// window the Back and Next controls can be clipped. The two bars keep their
// height and the canvas absorbs the difference, which is the whole point of
// giving it grow and min-h-0.
//
// One flat colour each, no gradient (EXAM-15F). Both bars used to be a
// vertical fade between a solid navy tint and a translucent one, which
// picked up whatever was behind the frame and read as a product header
// rather than test chrome. A bar that never changes shade is also a bar a
// learner stops looking at, which is what chrome is for.
export const examBar = {
  top: "flex w-full min-w-0 shrink-0 flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-academy-line bg-academy-navy-soft px-3 py-1.5 sm:px-4",
  bottom:
    "flex w-full min-w-0 shrink-0 flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-academy-line bg-academy-navy-soft px-3 py-1.5 sm:px-4",
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
//
// The region is the one scrolling area on an exam screen (EXAM-15B). It
// grows into whatever height the frame has left over after the two bars,
// and anything longer than that scrolls inside it rather than moving the
// browser page. On an ordinary page the frame has no fixed height, so
// there is no leftover height to grow into and no overflow to scroll, and
// the region draws exactly as it did before.
//
// The sheet grows to fill the region so a short screen still shows a full
// height white page rather than a band of grey underneath it, and it
// never shrinks below its content, so a long screen pushes the region
// into scrolling instead of being cut off.
//
// overscroll-contain (EXAM-15C): reaching the end of a long question list
// must not hand the scroll on to whatever is behind the exam. The canvas
// keeps it, so the two bars and the dashboard underneath both stay put.
//
// The gutter is the flat exam neutral (EXAM-15F). It used to be navy at
// 30 percent over the warm page colour, so the grey around the white sheet
// carried the warm cast through with it.
export const examCanvas = {
  region:
    "flex min-h-0 min-w-0 grow flex-col overflow-y-auto overscroll-contain bg-academy-exam-gutter p-2 sm:p-3",
  sheet:
    "min-w-0 shrink-0 grow border border-academy-line bg-academy-paper text-academy-navy",
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
//
// tabular-nums on the value is what makes a live countdown safe to put
// here (EXAM-15D). Every digit is the same width, and the countdown pads
// its reading to 00:30, so the number changes four times a second without
// anything beside it moving.
export const examTimer = {
  base: "inline-flex min-w-0 items-baseline gap-1 whitespace-nowrap text-[11px] leading-4 sm:text-xs",
  label: "shrink-0 opacity-75",
  value: "font-semibold tabular-nums",
} as const;

// Colour only, deliberately. Nothing here changes a size, a weight on the
// value, a background or a border, so a reading moving from normal to
// urgent cannot reflow the bar, resize it, or push the Next control. There
// is no animation and no flashing: the ticket rules both out, and a
// blinking timer in a test window is a distraction rather than a warning.
//
// warning is amber and urgent is red (EXAM-15D). warning used to be red,
// which left nothing louder for the final seconds to escalate to.
//
// expired adds weight to the whole reading rather than to the value alone.
// The label is dropped at that point, so there is no label left to grow.
export const examTimerStates: Record<ExamTimerState, string> = {
  normal: "text-academy-navy",
  warning: "text-academy-amber",
  urgent: "text-academy-red",
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
  // Shown under the stage when the browser refused to start the clip on
  // its own (EXAM-15F). Same strip the audio player uses, same reason.
  autoplayNotice:
    "min-w-0 border-t border-academy-line bg-academy-navy-soft px-3 py-1.5 text-[11px] leading-4 text-academy-navy",
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

// Native audio player, added by EXAM-03 for the Listening screens.
//
// Same idea as examVideo above: a bordered box holding the player, and a
// thin caption strip under it carrying the clip name and its running time
// when one is known. There is no dark stage, because an audio element has
// no picture, so the control bar sits on the paper background and gets a
// little breathing room around it.
export const examAudio = {
  wrap: "min-w-0 overflow-hidden rounded-sm border border-academy-line bg-academy-paper",
  stage: "min-w-0 bg-academy-navy-soft/35 px-3 py-3",
  element: "block h-10 w-full min-w-0",
  caption:
    "flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-0.5 border-t border-academy-line px-3 py-1.5",
  captionTitle:
    "min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.06em] text-academy-navy/70",
  captionMeta:
    "shrink-0 text-[11px] leading-4 tabular-nums text-academy-navy/55",
  // Shown in place of the control bar when the clip cannot load.
  fallback:
    "flex min-w-0 flex-col items-center justify-center gap-1 bg-academy-navy-soft px-4 py-6 text-center",
  fallbackTitle: "text-[13px] font-semibold leading-5 text-academy-navy",
  fallbackText: "max-w-md text-[11px] leading-4 text-academy-navy/60",
  // Shown under the controls when the browser refused to start the clip on
  // its own (EXAM-15F). A quiet strip rather than a banner: the controls
  // are right above it and still work, so this is a pointer, not an error.
  autoplayNotice:
    "min-w-0 border-t border-academy-line bg-academy-navy-soft px-3 py-1.5 text-[11px] leading-4 text-academy-navy",
} as const;

// Listening screens (EXAM-03).
//
// The answer side of a question screen is a compact radio list with a
// horizontal rule between rows, matching the reference layout: no card
// per option, no pill, and no icon. The whole row is the click target, so
// a learner never has to hit the small circle itself.
//
// The scenario picture is capped and centred rather than stretched, so a
// wide canvas does not blow the illustration up past its natural size.
export const examListening = {
  optionList: "flex min-w-0 flex-col",
  optionRow:
    "flex min-w-0 cursor-pointer items-start gap-2.5 border-b border-academy-line/70 py-2 last:border-b-0 hover:bg-academy-paper/60",
  optionRowSelected: "bg-academy-paper/80",
  optionInput:
    "mt-0.5 h-3.5 w-3.5 shrink-0 accent-academy-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-blue",
  optionText: "min-w-0 text-[13px] leading-5 text-academy-navy",
  // Question number line at the top of the answer panel.
  answerHeader:
    "flex min-w-0 flex-col gap-1 border-b border-academy-line/70 pb-2",
  scenarioFigure: "mx-auto flex w-full min-w-0 max-w-xl flex-col gap-1.5",
  scenarioImage:
    "block h-auto w-full min-w-0 rounded-sm border border-academy-line bg-academy-navy-soft/35",
  scenarioCaption: "text-[11px] leading-4 text-academy-navy/60",
  // Column stack on the audio and question screens.
  mediaStack: "mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-3",
  columnStack: "flex min-w-0 flex-col gap-3",
} as const;

// Listening dropdown completion question screen (EXAM-09).
//
// Screen type 7: every question in the part on one screen, each an
// incomplete statement with a dropdown where the blank falls. Listening
// Part 4 uses it.
//
// This is a list, not a set of cards. Each question is a row separated by
// a hairline rule, the number is a small tabular label at the head of the
// statement, and the control is a plain select. No panel per question, no
// shadow and no pill, so five questions read as one form rather than as
// five widgets.
//
// The select is capped rather than full width. Option text here is a
// sentence fragment, so a control stretched across a wide canvas would
// put its value a long way from the statement it completes.
// Boxed completion blocks, brought into line with examListeningChoice in
// the second EXAM-15F QA pass. Same box, same tinted header strip carrying
// the number and the statement, and the select in the body of the box
// under it. Parts 4, 5 and 6 all answer a whole question set on one screen,
// so they should look like one screen type with two controls rather than
// two screen types.
export const examListeningDropdown = {
  list: "flex min-w-0 flex-col gap-2",
  item: "min-w-0 overflow-hidden rounded-sm border border-academy-line bg-academy-paper",
  statement:
    "block w-full min-w-0 border-b border-academy-line bg-academy-navy-soft/60 px-3 py-2 text-[13px] leading-6 text-academy-navy",
  number: "mr-2 font-semibold tabular-nums text-academy-navy/55",
  // The blank in the statement. Underscores come from the source
  // document, so they are drawn rather than replaced, just quieted.
  blank: "px-0.5 tracking-tight text-academy-navy/45",
  // The control sits in the body of the box, under the statement strip.
  control: "min-w-0 p-2",
  select: `h-8 w-full min-w-0 max-w-lg rounded-sm border border-academy-line bg-academy-paper px-2 text-[13px] leading-5 text-academy-navy ${focus.ring}`,
  // Shown while the question has no answer.
  selectEmpty: "text-academy-navy/55",
  // Answered count under the list, beside Next being unavailable.
  progressNote: "text-[11px] leading-4 text-academy-navy/60",
} as const;

// Listening multiple-choice question list on one screen (EXAM-11).
//
// Screen type 7 again, but for a part whose questions are whole questions
// answered from radio options rather than statements completed from a
// dropdown. Listening Part 5 uses it.
//
// Same list chrome as examListeningDropdown above, deliberately: each
// question is a row separated by a hairline rule, and the number is a
// small tabular label at the head of the question. What changes is what
// sits under the question. A dropdown part puts one select there, and
// this puts the four options as a radio group, reusing the option row
// recipes from examListening so an option here and an option on the Parts
// 1 to 3 question screen are the same control.
//
// No panel per question, no shadow and no pill, so eight questions read
// as one form rather than as eight widgets.
// Boxed question blocks, rewritten in the second EXAM-15F QA pass.
//
// The list used to be ruled rows: a bold question, four options stacked
// under it in one column, a hairline, repeat. Eight of those on the Part 5
// screen made a page a learner scrolled the way they scroll an article,
// which is what the QA pass reported as feeling like a web quiz rather
// than test software. The content was right; the shape was wrong.
//
// Three changes, and each is doing a specific job:
//
// - **Every question is a box.** A border around the item and a tinted
//   header strip carrying the number and the question turns a run of text
//   into a run of discrete things to answer, which is what a test screen
//   is. It also gives the eye a place to stop between questions without
//   needing white space to do it.
// - **Options sit in two columns from the small breakpoint up.** Four
//   options in one column is four rows; in two columns it is two. Across
//   eight questions that is the difference between a screen a learner
//   scrolls three times and one they scroll once. On a narrow window it
//   falls back to one column, where the extra height is unavoidable and
//   the box is still doing its job.
// - **Selection is a filled row, not a bolder rule.** The option wash is
//   academy-blue-soft, the same accent the split screen answer panel uses,
//   so what is chosen is legible at a glance across a screen of 32
//   options.
//
// The whole row is the click target, so nobody has to hit the small circle
// itself, and the hover wash makes that obvious before the click.
//
// Used by the Part 5 multiple choice list and, through
// examListeningDropdown, by the Part 4 and Part 6 completion lists, so all
// three one screen parts read as one family.
export const examListeningChoice = {
  list: "flex min-w-0 flex-col gap-2",
  item: "min-w-0 overflow-hidden rounded-sm border border-academy-line bg-academy-paper",
  // The fieldset fills the box. Preflight has already stripped its border,
  // padding and margin, so it adds no geometry of its own.
  fieldset: "w-full min-w-0",
  // The question itself, and the radio group's legend.
  //
  // A legend sits in the fieldset's border box by default and shrinks to
  // its content. The fieldset has no border here and this is display block
  // at full width, so it draws as an ordinary header strip. The number is
  // an inline span with a right margin rather than a flex gap, because a
  // legend is not a flex container in every browser.
  prompt:
    "block w-full min-w-0 border-b border-academy-line bg-academy-navy-soft/60 px-3 py-2 text-[13px] font-semibold leading-5 text-academy-navy",
  number: "mr-2 font-semibold tabular-nums text-academy-navy/55",
  // Two columns from sm up, one below it.
  options: "grid min-w-0 grid-cols-1 gap-x-5 gap-y-0.5 p-2 sm:grid-cols-2",
  // One option. Compact, no rule between rows: the box and the two column
  // grid already group them, and a hairline inside a grid cell would draw
  // a line to nowhere.
  optionRow:
    "flex min-w-0 cursor-pointer items-start gap-2 rounded-sm px-2 py-1.5 transition-colors hover:bg-academy-navy-soft/45",
  optionRowSelected: "bg-academy-blue-soft hover:bg-academy-blue-soft",
  optionInput:
    "mt-0.5 h-3.5 w-3.5 shrink-0 accent-academy-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-blue",
  optionText: "min-w-0 text-[13px] leading-5 text-academy-navy",
  // Answered count under the list, beside Next being unavailable.
  progressNote: "text-[11px] leading-4 text-academy-navy/60",
} as const;

// Reading split screen (EXAM-16).
//
// Screen type 8: the passage on the left with its own scrollbar, the
// question panels on the right with theirs. The split itself is
// examTwoColumn above, which already draws the divider and the answer
// side wash, so nothing here repeats it. What is here is what goes
// inside the two columns.
//
// Reading prose runs at leading-6 rather than the leading-5 the rest of
// the exam canvas uses. A Listening screen prints a sentence at a time
// and a Reading screen prints four paragraphs of a letter, and a passage
// set at question density is a passage nobody wants to read.
//
// The passage is a letter, so the salutation and the sign off are their
// own lines rather than being folded into the first and last paragraphs.
export const examReading = {
  // Left column: the passage.
  passage: "flex min-w-0 flex-col gap-3",
  passageHeading: "text-[13px] font-semibold leading-6 text-academy-navy",
  passageParagraph: "text-[13px] leading-6 text-academy-navy/85",
  // Sign off lines sit together with no gap between them, so the name
  // reads as being under the closing rather than as a new paragraph.
  passageSignOff: "flex min-w-0 flex-col",
  passageSignOffLine: "text-[13px] leading-6 text-academy-navy/85",

  // Right column: one or more question panels stacked.
  panelStack: "flex min-w-0 flex-col gap-5",
  panel: "flex min-w-0 flex-col gap-2",
  panelLabel:
    "text-[11px] font-semibold uppercase tracking-[0.06em] text-academy-navy/55",
  panelInstruction: "text-[12px] leading-5 text-academy-navy/70",

  // The written reply a completion group is answered inside. A plain
  // white box on the blue answer column, so the letter reads as a
  // document sitting on the answer side rather than as more chrome.
  response:
    "flex min-w-0 flex-col gap-3 rounded-sm border border-academy-line bg-academy-paper px-3 py-3",

  // A numbered blank inside the reply.
  //
  // Two states. Unanswered draws the number and quieted underscores, the
  // way the question list draws a blank in a stem. Answered replaces the
  // underscores with the chosen option text on the answer column wash, so
  // the letter can be read back as a finished response. Both keep the
  // number, because the number is how the reply and the list below it
  // point at each other.
  responseBlank: "text-academy-navy/45",
  responseBlankFilled:
    "rounded-sm bg-academy-blue-soft px-1 font-semibold text-academy-navy",
  responseBlankNumber: "font-semibold tabular-nums text-academy-navy/70",

  // Answered count under the question column, beside Next being
  // unavailable.
  progressNote: "text-[11px] leading-4 text-academy-navy/60",
} as const;

// Reading question list (EXAM-16).
//
// The same boxed completion block the second EXAM-15F QA pass settled on
// for Listening Parts 4 to 6: a bordered item, a tinted header strip
// carrying the number and the statement, and the select in the body under
// it. Reading and Listening answer the same kind of question here, so
// they should look like one screen type rather than two.
//
// It is written out rather than importing examListeningDropdown, for one
// reason that matters and one that follows from it. Reading has a
// question shape Listening does not: the blanks inside a reply print no
// statement at all, only a number, so the header strip has a second form.
// And a token block named for Listening, read by Reading, is a rename
// away from being wrong in both places.
//
// The select is capped rather than full width, for the same reason as on
// the Listening screens: option text here is a sentence fragment, so a
// control stretched across the column would put its value a long way from
// the statement it completes.
export const examReadingQuestion = {
  list: "flex min-w-0 flex-col gap-2",
  item: "min-w-0 overflow-hidden rounded-sm border border-academy-line bg-academy-paper",
  statement:
    "block w-full min-w-0 border-b border-academy-line bg-academy-navy-soft/60 px-3 py-2 text-[13px] leading-6 text-academy-navy",
  number: "mr-2 font-semibold tabular-nums text-academy-navy/55",
  // The blank in a statement. Underscores come from the source document,
  // so they are drawn rather than replaced, just quieted.
  blank: "px-0.5 tracking-tight text-academy-navy/45",
  // The control sits in the body of the box, under the statement strip.
  control: "min-w-0 p-2",
  select: `h-8 w-full min-w-0 max-w-md rounded-sm border border-academy-line bg-academy-paper px-2 text-[13px] leading-5 text-academy-navy ${focus.ring}`,
  // Shown while the question has no answer.
  selectEmpty: "text-academy-navy/55",
} as const;

// Listening answer review and practice score screens (EXAM-04).
//
// The review table is result table chrome, not a dashboard list: hairline
// rules, a grey header row, tight rows, and tabular figures in the
// question column. Status is a word in its own column, coloured and
// weighted, with no pill, no dot and no badge, so a long table of them
// stays readable.
//
// The table scrolls inside its own wrapper on a narrow screen, so the
// exam frame never scrolls sideways.
export const examReview = {
  wrap: "min-w-0 overflow-x-auto rounded-sm border border-academy-line",
  table: "w-full min-w-[36rem] border-collapse text-left",
  caption: "sr-only",
  headRow: "bg-academy-navy-soft/55",
  headCell:
    "border-b border-academy-line px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-academy-navy/65",
  row: "border-b border-academy-line/70 last:border-b-0 align-top",
  cell: "px-3 py-2 text-[13px] leading-5 text-academy-navy/85",
  numberCell:
    "px-3 py-2 text-[13px] leading-5 font-semibold tabular-nums whitespace-nowrap text-academy-navy",
  // Used for a cell with nothing in it yet, for example a correct answer
  // that has not been transcribed.
  emptyCell: "px-3 py-2 text-[13px] leading-5 text-academy-navy/45",
  statusCell: "px-3 py-2 text-[13px] leading-5 font-semibold whitespace-nowrap",
  // Printed question under the question number, for a part that prints
  // its questions (EXAM-10). The number cell is nowrap and tabular, so
  // this resets both and caps its width, otherwise a five word statement
  // would stretch the column across the table.
  statement:
    "mt-0.5 block max-w-[16rem] text-[11px] font-normal leading-4 whitespace-normal normal-nums text-academy-navy/60",
  // Explanation line under a row, when the source gives one.
  explanation: "mt-0.5 block text-[11px] leading-4 text-academy-navy/60",
  // Reference panel holding the answer and explanation sheet.
  referenceStack: "flex min-w-0 flex-col gap-2",
  referenceToggle:
    "cursor-pointer text-[13px] font-semibold leading-5 text-academy-blue underline underline-offset-2",
  referenceFigure: "mt-2 flex w-full min-w-0 flex-col gap-1.5",
  referenceImage:
    "block h-auto w-full min-w-0 rounded-sm border border-academy-line bg-academy-navy-soft/35",
  referenceCaption: "text-[11px] leading-4 text-academy-navy/60",
} as const;

// Status colours for the review table.
//
// pending is deliberately the same quiet navy as an unanswered row. It is
// a statement about the answer key, not about the learner, so it must not
// read as a red mark.
export const examReviewStatusTones: Record<ListeningReviewStatus, string> = {
  correct: "text-academy-blue",
  incorrect: "text-academy-red",
  unanswered: "text-academy-navy/55",
  "answer-key-pending": "text-academy-navy/55",
};

// Practice score summary.
//
// A bordered strip of readings on the white canvas, not a dashboard card:
// no shadow, no artwork, no rounded pill. The headline reading is larger
// than the rest, and every reading is tabular so the row does not shift
// as numbers change.
export const examScore = {
  card: "flex min-w-0 flex-col gap-3 rounded-sm border border-academy-line bg-academy-navy-soft/35 px-4 py-3.5",
  grid: "grid min-w-0 grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4",
  item: "flex min-w-0 flex-col gap-0.5",
  label: "text-[11px] font-semibold uppercase tracking-[0.06em] text-academy-navy/55",
  value: "text-sm font-semibold leading-5 tabular-nums text-academy-navy",
  headlineValue: "text-xl font-semibold leading-7 tabular-nums text-academy-navy",
  pendingValue: "text-sm font-semibold leading-5 text-academy-navy/45",
  // Pending block shown in place of a score.
  pending:
    "flex min-w-0 flex-col gap-1 rounded-sm border border-academy-line bg-academy-paper px-3 py-2.5",
  pendingHeading: "text-[13px] font-semibold leading-5 text-academy-navy",
  pendingText: "text-[11px] leading-4 text-academy-navy/70",
  // Practice result disclaimer under the readings.
  note: "text-[11px] leading-4 text-academy-navy/60",
} as const;

// Estimated band card on the Listening practice score screen (EXAM-15C).
//
// The same bordered strip as examScore above, on purpose: the estimate is
// one more reading on the same result screen, not a certificate. So there is
// no seal, no ribbon, no coloured band and nothing that could be mistaken
// for an official score report.
//
// The reading itself is the largest thing on the card and the notes under it
// are the smallest, because the notes are what stop the number being read as
// an official result and they have to sit with it rather than somewhere else
// on the screen.
export const examBandCard = {
  card: "flex min-w-0 flex-col gap-1 rounded-sm border border-academy-line bg-academy-navy-soft/35 px-4 py-3.5",
  label:
    "text-[11px] font-semibold uppercase tracking-[0.06em] text-academy-navy/55",
  value: "text-xl font-semibold leading-7 text-academy-navy",
  basis: "text-[13px] leading-5 text-academy-navy/85",
  note: "text-[11px] leading-4 text-academy-navy/60",
} as const;

// Full Listening section review and score screens (EXAM-15).
//
// The section review is six part groups stacked in one scroll, and the
// section score is the summary card plus a part breakdown table. Both are
// built from the EXAM-04 recipes above rather than from new chrome: a
// group here is a small heading over an examReview table, and the
// breakdown is an examReview table with three columns.
//
// What is added is only what stacking six tables needs. A group heading
// has to be quiet enough that six of them do not read as six pages, and
// the part label has to be separable from the section name so the two can
// sit on one line at different weights.
export const examSectionReview = {
  // Column of part groups.
  groupStack: "flex min-w-0 flex-col gap-5",
  group: "flex min-w-0 flex-col gap-2",
  groupHeading:
    "flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5 border-b border-academy-line pb-1.5",
  groupLabel: "text-[13px] font-semibold leading-5 text-academy-navy",
  groupTitle: "text-[11px] leading-4 text-academy-navy/60",
  // Right hand count on the group heading, for example "8 questions".
  groupMeta: "ml-auto shrink-0 text-[11px] leading-4 text-academy-navy/55",
  // Part breakdown block on the score screen.
  breakdown: "flex min-w-0 flex-col gap-2",
  breakdownTitle:
    "text-[11px] font-semibold uppercase tracking-[0.06em] text-academy-navy/55",
} as const;

// Reading practice score card (EXAM-17).
//
// The same bordered strip of readings examScore draws for Listening, with
// one addition the Reading result needs: a headline row carrying the
// percentage at the top of the card, above the four counts, because the
// Reading score screen has no separate score heading of its own to carry
// it.
//
// It is written out rather than importing examScore, for the reason
// examReadingQuestion gives above: the two cards hold different readings,
// and a token block named for Listening, read by Reading, is a rename
// away from being wrong in both places. What they share is the look, and
// the look is four class strings.
//
// No shadow, no artwork, no pill and no seal. This is a practice result,
// and nothing on it should be mistakeable for an official score report.
export const examReadingScore = {
  card: "flex min-w-0 flex-col gap-3 rounded-sm border border-academy-line bg-academy-navy-soft/35 px-4 py-3.5",
  // Percentage on the left, the sentence saying what it means on the
  // right, with a rule under the pair.
  headline:
    "flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-academy-line pb-3",
  headlineBlock: "flex min-w-0 flex-col gap-0.5",
  headlineValue:
    "text-2xl font-semibold leading-8 tabular-nums text-academy-navy",
  headlineMessage:
    "min-w-0 text-[13px] leading-5 text-academy-navy/85 sm:ml-auto sm:text-right",
  grid: "grid min-w-0 grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4",
  item: "flex min-w-0 flex-col gap-0.5",
  label:
    "text-[11px] font-semibold uppercase tracking-[0.06em] text-academy-navy/55",
  value: "text-sm font-semibold leading-5 tabular-nums text-academy-navy",
  // The two notes under the readings: what a blank did to the score, and
  // that this is not an official CELPIP result.
  note: "text-[11px] leading-4 text-academy-navy/60",
} as const;

// Reading answer review card (EXAM-17).
//
// One card per question rather than a row in a table, which is where this
// parts company with the Listening review.
//
// A Listening review row is a number and two short options, so four
// columns fit and a table is the right shape for it. A Reading Part 1 row
// is a full sentence stem plus two option texts that are themselves
// sentences, and 11 of those in a four column table would be a wall of
// wrapped prose with a horizontal scrollbar under it. The card keeps the
// question on its own line at full width and puts the two answers side by
// side underneath, so a long stem costs height instead of legibility.
//
// It is the same boxed block examReadingQuestion draws on the question
// screen: a bordered item, a tinted header strip carrying the number and
// the question, and the content in the body under it. A learner reviewing
// question 7 should recognise the box they answered it in.
export const examReadingReview = {
  list: "flex min-w-0 flex-col gap-2",
  card: "min-w-0 overflow-hidden rounded-sm border border-academy-line bg-academy-paper",
  header:
    "flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-academy-line bg-academy-navy-soft/60 px-3 py-2",
  number:
    "shrink-0 text-[11px] font-semibold uppercase tracking-[0.06em] tabular-nums text-academy-navy/55",
  question: "min-w-0 flex-1 text-[13px] leading-6 text-academy-navy",
  // Status word at the end of the header strip. A word, not a badge, so a
  // column of 11 of them stays quiet.
  status:
    "ml-auto shrink-0 text-[11px] font-semibold uppercase tracking-[0.06em]",
  // The two answers, stacked on a narrow screen and side by side from the
  // small breakpoint up.
  body: "flex min-w-0 flex-col gap-2 px-3 py-2.5 sm:flex-row sm:gap-4",
  answer: "flex min-w-0 flex-1 flex-col gap-0.5",
  answerLabel:
    "text-[11px] font-semibold uppercase tracking-[0.06em] text-academy-navy/55",
  answerText: "text-[13px] leading-5 text-academy-navy/85",
  // Used for "No answer selected", so a blank reads as empty rather than
  // as something the learner chose.
  answerTextEmpty: "text-[13px] leading-5 text-academy-navy/45",
  // The correct answer is the thing being looked up, so it carries a
  // little more weight than the answer beside it.
  answerTextCorrect:
    "text-[13px] font-semibold leading-5 text-academy-navy",
  // Explanation strip under the answers, when the source gives one. Mock
  // Test 1 Reading publishes none, so this draws nothing there.
  explanation:
    "border-t border-academy-line/70 px-3 py-2 text-[11px] leading-4 text-academy-navy/70",
} as const;

// Status colours for a Reading review card.
//
// blank is the same quiet navy as an unanswered Listening row rather than
// the red an incorrect answer carries. A blank is counted as incorrect in
// the score, which the score screen says out loud, but on the card it is
// a statement about what was left empty and does not need a second red
// mark to make the point.
export const examReadingReviewStatusTones: Record<ReadingReviewStatus, string> =
  {
    correct: "text-academy-blue",
    incorrect: "text-academy-red",
    blank: "text-academy-navy/55",
  };

// Shared body text tones inside the canvas. Exam copy runs tighter than
// dashboard copy, so these sit a step below the marketing scale.
export const examText = {
  heading: "text-sm font-semibold text-academy-navy sm:text-base",
  body: "text-[13px] leading-5 text-academy-navy/85",
  muted: "text-[11px] leading-4 text-academy-navy/60",
  bulletList: "space-y-0 text-[13px] leading-5 text-academy-navy/85",
  bulletItem: "border-b border-dotted border-academy-line py-1.5 last:border-b-0",
} as const;
