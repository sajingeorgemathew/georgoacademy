// Types for the Mock Test 1 Speaking section prototype (EXAM-27).
//
// The Speaking counterpart of writing-mock-types.ts. A Speaking task is
// not answered by typing, so almost nothing carries over: there is no
// editor, no word target, no typed response and no answer key. What a
// Speaking task has instead is a prompt to read, sometimes a picture to
// speak about, two windows rather than one, and a recording.
//
// What a Speaking task carries that a Writing task does not:
//
// - two timers rather than one. Every CELPIP Speaking task is a
//   preparation window followed by a recording window, which
//   docs/product/celpip-exam-rules-research.md section 13 records, so the
//   task holds two SpeakingTaskTimer values rather than one
// - a visual prompt on the tasks that have one. Mock Test 1 Speaking
//   Tasks 3, 4, 5 and 8 print pictures, and on Tasks 3, 4 and 8 the
//   picture is the thing being described, so it is content and not
//   decoration
// - option cards, on Task 5. The two summer camps are a labelled picture
//   and a list of facts each, which is a different shape from the two
//   sentences Writing Task 2 offers as positions
//
// What it deliberately does not carry: a transcript, a score, a band, a
// criterion level, an upload path, a storage bucket or a database row.
// None of those exist in this ticket. EXAM-28 adds the review, and the
// note at the foot of docs/product/speaking-mock-test-prototype.md says
// where each of them goes.
//
// Types only, no runtime values, so this can be imported from a server
// component or a client component without pulling behaviour along with
// it. The same rule reading-types.ts and writing-mock-types.ts follow.
// The helpers live in speaking-mock-flow.ts, the windows in
// speaking-mock-timing.ts and the wording in speaking-mock-copy.ts.
//
// House style: normal hyphens only, no long hyphens or em dashes.

import type {
  ExamInstruction,
  ExamSectionIntroDetail,
} from "./instruction-screen-types";

// Where a timing figure came from.
//
// Three values rather than the WritingTimerSource three, because the
// Speaking evidence is shaped differently. Writing has a figure printed
// in the Mock Test 1 document itself and a second worked out from it.
// Speaking has one section total in that document and eight pairs of
// per-task windows that come from the official Speaking overview, read
// and recorded in docs/product/celpip-exam-rules-research.md section 5.
//
// - "published" means the figure is printed in the Mock Test 1 source
//   document or visible in one of its own prompt images
// - "reference" means it comes from the official Speaking overview as
//   transcribed into the research document. That is a real source and
//   not a guess, but it is a transcription of a scanned PDF rather than
//   something printed in the Mock Test 1 file, so it is labelled
//   differently
// - "placeholder" means there is no source at all and the number is a
//   documented stand in. Nothing in Mock Test 1 needs one
export type SpeakingTimerSource = "published" | "reference" | "placeholder";

// One window on a Speaking task, either the preparation one or the
// recording one.
//
// The same shape as WritingTaskTimer, and for the same reason: a screen
// with a clock on it has to be able to say whether the number is
// published, taken from a reference, or a stand in.
export type SpeakingTaskTimer = {
  seconds: number;
  // When the reading turns amber, and then red.
  warningAtSeconds: number;
  urgentAtSeconds: number;
  source: SpeakingTimerSource;
  // Where the number came from. Printed nowhere: it is here so a reader
  // of the content file does not have to go looking.
  note: string;
};

// A picture on a Speaking screen.
//
// Referenced from Cloudinary, not downloaded and not re-hosted, which is
// the rule mock-tests/mock-test-1/extracted-links.md sets for every Mock
// Test 1 asset, and which the Reading Part 2 brochure already follows.
//
// width and height are the intrinsic pixel size of the delivered file, so
// the browser can reserve the right box from the ratio before the file
// arrives and the screen does not jump when it lands.
export type SpeakingPromptImage = {
  url: string;
  // What is in the picture, for a learner who cannot see it.
  //
  // Unlike the Writing prompt images, this one cannot be a description of
  // text that is also on the screen: on Tasks 3, 4 and 8 the picture is
  // the thing being described, so there is no text form of it. The alt
  // text is written from the picture itself and describes only what is
  // visibly in it.
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

// One of the choices on a task that presents choices as cards.
//
// Mock Test 1 Speaking Task 5 is the only one: two summer camps, each a
// photograph, a name and a short list of facts. label is the heading the
// source prints above a card where it prints one, for example
// "Your Choice", and is unset where it does not.
export type SpeakingOptionCard = {
  id: string;
  label?: string;
  // The name of the option, for example "Music camp".
  heading: string;
  // The facts under the name, one per line as the source prints them.
  details: string[];
  image?: SpeakingPromptImage;
};

// A single picture the learner is asked to speak about.
//
// Tasks 3, 4 and 8. The picture is the prompt, so it is never decorative
// and is never hidden on a small screen.
export type SpeakingSceneVisual = {
  kind: "scene";
  id: string;
  image: SpeakingPromptImage;
  // Short line under the picture. Descriptive, not a source reference.
  caption?: string;
};

// A row of option cards.
//
// Task 5 only, which prints two of these rows: the two camps to choose
// between, and then the comparison between the chosen camp and the
// sister's camp.
export type SpeakingOptionCardsVisual = {
  kind: "option-cards";
  id: string;
  caption?: string;
  cards: SpeakingOptionCard[];
};

// Anything a task shows the learner besides the prompt text.
//
// A discriminated union rather than an image plus a flag, so adding a
// third kind is a compile error everywhere it matters rather than a
// silently unrendered field.
export type SpeakingVisualPrompt =
  | SpeakingSceneVisual
  | SpeakingOptionCardsVisual;

// One of the alternatives on a task that prints an either or pair.
//
// Mock Test 1 Speaking Task 6 is the only one: "Choose ONE:", then
// "EITHER", a sentence, "OR", a second sentence. connector is the source
// word above the sentence, kept apart from the sentence itself so the
// screen can weight the two the way the source does.
//
// This is not a control. Nothing is selected, nothing is stored, and
// nothing is gated on it: the learner picks one in their head and speaks.
// That is what the source asks for, and it is why this is not modelled as
// the Writing radio group.
export type SpeakingPromptAlternative = {
  connector: string;
  text: string;
};

// One Speaking task, as the engine consumes it.
export type SpeakingTaskContent = {
  // For example "mock-test-1-speaking-task-1". Also the key the recording
  // is held under.
  taskId: string;
  // Position in the section, counting from 1.
  taskNumber: number;
  // The task as a learner names it, for example "Speaking Task 1".
  taskLabel: string;
  // Full title for the exam top bar.
  title: string;
  // Short task name from the source, for example "Giving Advice".
  taskTitle: string;

  // Text the source prints above the prompt instruction, where it prints
  // any. Mock Test 1 uses it on Task 5 only, for the paragraph that sets
  // the situation up before the instruction to persuade.
  situationParagraphs?: string[];

  // The source's own instruction sentence, the blue line at the top of
  // the prompt image.
  promptInstruction: string;
  // Further source paragraphs under it. Task 7 prints its question this
  // way, on its own line under "Answer the following question."
  promptParagraphs?: string[];

  // The either or pair, on a task that prints one. Task 6 only.
  alternativesLead?: string;
  alternatives?: SpeakingPromptAlternative[];

  // Pictures and option cards, in the order the source prints them. Empty
  // on a task with none, which is Tasks 1, 2, 6 and 7.
  visuals: SpeakingVisualPrompt[];

  // A quiet line under the prompt, where this prototype has to say
  // something about how the task differs from the source screens. Task 5
  // is the only one that needs it: the source splits it across a choice
  // screen and a comparison screen, and this prototype has one screen per
  // task. Unset everywhere else, and never a substitute for source
  // wording.
  promptNote?: string;

  // The two windows. Preparation first, then recording, which is the
  // order every Speaking task runs in.
  prepTimer: SpeakingTaskTimer;
  responseTimer: SpeakingTaskTimer;
};

// The instruction screen the section opens with (screen type 1).
//
// The same shape as WritingSectionInstructionContent. There is no
// Speaking instructional video screen in this ticket: a Speaking clip is
// registered in instructional-video-assets.ts and the source document
// notes that a Speaking instructions video appears at this point, but
// adding a video screen would change the screen count the ticket sets out
// and is a separate decision. It is recorded as a follow up in
// docs/product/speaking-mock-test-prototype.md.
export type SpeakingSectionInstructionContent = {
  // Top bar title.
  title: string;
  // Sentence under the instructions heading.
  subtitle?: string;
  instructions: ExamInstruction[];
  // Quiet note under the list.
  noticeText?: string;
  // Intro card above the instructions.
  introTitle: string;
  introSummary: string;
  // Optional fixed detail rows. When unset the intro screen counts the
  // tasks and sums the windows off the content itself, so no total is
  // written down twice.
  introDetails?: ExamSectionIntroDetail[];
};

// One complete Speaking section, as the engine consumes it.
export type SpeakingSectionContent = {
  // For example "mock-test-1".
  testId: string;
  // For example "mock-test-1-speaking-section".
  sectionId: string;
  // Top bar title for the screens the section owns rather than a task:
  // the intro, the transitions and the completion screen. A task screen
  // keeps its own content.title.
  title: string;
  instructionScreen: SpeakingSectionInstructionContent;
  tasks: SpeakingTaskContent[];
};

// One recorded answer, held in the browser and nowhere else.
//
// This is the shape the ticket suggests, and every field in it is a
// browser object or a string made from one:
//
// - audioBlob is the Blob the MediaRecorder produced
// - audioUrl is a blob: URL made from it with URL.createObjectURL, which
//   is what the preview player plays. It is local to this document and
//   means nothing anywhere else
// - durationSeconds is measured from when recording started to when it
//   stopped
// - recordedAt is an ISO timestamp, shown on the completion screen so a
//   learner can tell two takes apart
//
// Nothing here is uploaded, written to a database, put in localStorage or
// put in a cookie. A reload loses all of it, which is stated on the
// screens themselves rather than only here.
export type SpeakingResponse = {
  audioUrl: string | null;
  audioBlob: Blob | null;
  durationSeconds: number;
  recordedAt: string | null;
  // The container the browser actually recorded in, for example
  // "audio/webm". Kept because the browser picks it rather than us, and
  // because EXAM-28 will need it the moment audio leaves the page.
  mimeType: string | null;
};

// The recordings, keyed by task id.
//
// { taskId: SpeakingResponse }, exactly the shape the ticket suggests.
// Keyed by task id rather than by screen position, which is what makes a
// recording survive moving forward to the next task and back again: the
// map is not touched by navigation at all.
export type SpeakingResponseMap = Readonly<Record<string, SpeakingResponse>>;

// What the recorder on a task screen is doing right now.
//
// Only one task can be recording at a time, so this is one value held by
// the section rather than a field on every response.
//
// - "idle" means nothing has been asked for yet on this task
// - "requesting" means the microphone permission prompt is open. It
//   exists so the button can say what it is waiting for, because the
//   prompt can sit unanswered for a long time
// - "recording" means the MediaRecorder is running
// - "stopping" means stop has been called and the final blob has not
//   arrived yet. It is brief, and it stops a second click producing a
//   second stop
export type SpeakingRecordingStatus =
  | "idle"
  | "requesting"
  | "recording"
  | "stopping";

// Why a recording could not be made.
//
// A kind rather than a message, so a screen can decide what to show and
// what to offer. The wording for each lives in speaking-mock-copy.ts.
//
// - "unsupported" means this browser has no MediaRecorder or no
//   getUserMedia. Trying again cannot help, so the screen says so and
//   offers no retry
// - "permission-denied" means the learner or the browser refused the
//   microphone. Trying again can help, because a learner can change the
//   setting and press the button again
// - "failed" is everything else: no device, a device in use, a recorder
//   error, or an empty recording
export type SpeakingRecordingErrorKind =
  | "unsupported"
  | "permission-denied"
  | "failed";

// One screen in the Speaking section flow.
//
// A discriminated union rather than a screen index, for the same reason
// every other flow in the engine is one: adding a screen kind should be a
// compile error everywhere it matters.
//
// taskIndex points into SpeakingSectionContent.tasks rather than copying
// the task, so there is one copy of the content and the flow stays cheap
// to build.
export type SpeakingSectionScreen =
  // 1. Speaking section intro.
  | { kind: "section-intro"; id: string }
  // The eight tasks, one working screen each.
  | { kind: "task"; id: string; taskIndex: number }
  // Shown before a task that is not the first one, so seven of them. It
  // carries no score, because Speaking produces none in this ticket.
  | { kind: "task-transition"; id: string; taskIndex: number }
  // The last screen. Speaking section complete.
  | { kind: "section-complete"; id: string };

// Narrowed screen kind, for a component that only handles one of them.
export type SpeakingTaskScreenRef = Extract<
  SpeakingSectionScreen,
  { kind: "task" }
>;

// A finished task as the completion screen reports it.
//
// Recorded or not, and how long the recording ran. There is no score, no
// band, no transcript and no feedback in this ticket, and this type is
// deliberately the shape of what the prototype can honestly say: this
// task, recorded or missing, this many seconds.
export type SpeakingTaskSummary = {
  taskId: string;
  taskLabel: string;
  taskTitle: string;
  recorded: boolean;
  durationSeconds: number;
  recordedAt: string | null;
};
