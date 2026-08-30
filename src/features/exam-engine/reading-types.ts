// Types for the Reading part content and the Reading screen flow
// (EXAM-16).
//
// This file holds types only, no runtime values, so it can be imported
// from a server component or a client component without pulling any
// behaviour along with it. Same rule the EXAM-01 shell types, the EXAM-02
// instruction screen types and the four Listening type files follow.
//
// The shapes here describe one Reading part, which is the unit the
// prototype renders. A full Reading section is four of these, and neither
// the section nor the review that closes it is built yet.
//
// What is different about Reading, and why this is a new shape rather
// than a Listening shape reused:
//
// - A Reading part has no media at all. There is no clip, no poster and
//   no running time, so every media field in the Listening shapes would
//   be dead here.
// - A Reading part is one screen, not a sequence. Screen type 8 in
//   docs/product/exam-engine-screen-types.md is a split screen: the
//   passage on the left with its own scrollbar, the questions on the
//   right with theirs. Everything a learner needs is on it at once.
// - A Reading part's questions arrive in groups. Reading Part 1 has two:
//   six questions about the message, then five blanks inside a written
//   reply to it. The groups carry their own instruction line and the
//   second one carries the reply text, so a group is a real part of the
//   content rather than a display grouping.
// - A Reading part is timed once, for the whole part. Listening times a
//   screen because Listening screens are handed out one at a time. See
//   ReadingPartTimer below.
//
// What is shared is imported rather than copied: the instruction bullet
// shape comes from instruction-screen-types.ts, the same way every
// Listening content type takes it.
//
// House style: normal hyphens only, no long hyphens or em dashes.

import type { ExamInstruction } from "./instruction-screen-types";

// One answer choice under a Reading question.
//
// The id is what the answer map stores, never the option text, so the
// wording can be corrected later without invalidating a stored answer.
// Same rule as ListeningOption and its three siblings.
export type ReadingOption = {
  id: string;
  text: string;
};

// One Reading question.
//
// Reading Part 1 has two kinds of question and this one type covers both,
// because the only difference between them is whether the question prints
// a stem:
//
// - A stem question, questions 1 to 6 in Part 1, is an incomplete
//   sentence answered from a drop-down. The stem is stored split around
//   its blank as textBefore and textAfter, the way
//   ListeningDropdownQuestion stores one, so the screen decides how the
//   blank is drawn and no component has to parse a sentence.
// - A response blank, questions 7 to 11 in Part 1, has no stem of its
//   own. The sentence it completes is in the reply text above the list,
//   and the source document prints nothing beside the number but the four
//   options. textBefore is unset for those, and the list draws the number
//   alone.
//
// The two are not separate types because they are marked identically, sit
// in the same answer map, and would otherwise force every consumer to
// switch on a discriminator that changes nothing but one line of layout.
export type ReadingQuestion = {
  id: string;
  // Position inside the part, counting from 1 and continuous across the
  // groups. Reading Part 1 runs 1 to 11, so its second group starts at 7.
  // Display only, and it is also what the reply text points at.
  number: number;
  // Stem text up to the blank. Unset for a question whose sentence lives
  // in the response text rather than in the question.
  textBefore?: string;
  // Stem text after the blank. Unset when the blank ends the stem, which
  // is every stem question in Mock Test 1 Reading Part 1.
  textAfter?: string;
  options: ReadingOption[];
  // Correct option id, for a part whose key is written question by
  // question. The part level answerKey list wins where both exist. Mock
  // Test 1 Reading Part 1 uses the list, so this stays unset there.
  correctOptionId?: string;
};

// One paragraph of a passage.
//
// A plain string. Passages are prose and carry no inline controls, so
// nothing more structured is needed on the left hand side.
export type ReadingPassageParagraph = string;

// The passage on the left of the split screen.
//
// heading and signOff exist because Reading Part 1 is correspondence: a
// letter opens with a salutation and closes with a sign off, and folding
// either into the first or last paragraph would print them as running
// prose. Both are optional, so a Reading part whose passage is an article
// rather than a letter simply omits them.
export type ReadingPassage = {
  // Small label above the passage, for example "Message".
  label?: string;
  // Salutation line, for example "Dear Scott,".
  heading?: string;
  paragraphs: ReadingPassageParagraph[];
  // Closing lines, for example ["Cheers,", "Jim"]. One line each, so the
  // name sits under the sign off rather than beside it.
  signOff?: string[];
};

// One piece of a response paragraph.
//
// The reply on the right of a correspondence part has numbered blanks in
// it, so its paragraphs cannot be plain strings. They are stored already
// split, as a run of text and blank segments, for the same reason a stem
// is stored split around its blank: the screen decides how a blank is
// drawn, and nothing has to parse a sentence at render time.
//
// A blank segment points at a question by id rather than carrying the
// options itself, so the reply text and the question list cannot drift
// apart, and so an answered blank can show what was chosen.
export type ReadingResponseSegment =
  | { kind: "text"; text: string }
  | { kind: "blank"; questionId: string; number: number };

export type ReadingResponseParagraph = {
  segments: ReadingResponseSegment[];
};

// The written reply a completion group is built around.
//
// Same three fields as ReadingPassage, because it is the same kind of
// object, a letter, with the one difference that its paragraphs carry
// blanks.
export type ReadingResponse = {
  heading?: string;
  paragraphs: ReadingResponseParagraph[];
  signOff?: string[];
};

// One group of questions on the answer side of the split screen.
//
// Reading Part 1 has two: the six questions about the message, and the
// five blanks inside the reply. Screen type 8 calls these the right hand
// panels, and Parts 2 and 4 have two of them as well, so the group is the
// unit the answer column is built from.
export type ReadingQuestionGroup = {
  id: string;
  // Small label above the panel, for example "Questions 1 to 6".
  label?: string;
  // Instruction line above the group, taken from the source document.
  instruction?: string;
  // The reply the group's blanks sit inside. Set on a completion group,
  // unset on a group of stem questions.
  response?: ReadingResponse;
  questions: ReadingQuestion[];
};

// Where a timing figure came from.
//
// The same distinction listening-timing.ts draws and the timer rule in
// docs/product/admin-mock-test-builder-blueprint.md carries, with one
// value added:
//
// - published: printed as a number in an official source
// - derived: worked out from published figures, with the arithmetic in
//   the note
// - placeholder: a working number chosen so the screen has a clock, to be
//   replaced once a real figure is confirmed
export type ReadingTimerSource = "published" | "derived" | "placeholder";

// The answering window for a whole Reading part.
//
// Reading is timed per part, not per screen and not per question:
// docs/product/celpip-exam-rules-research.md section 11 records that no
// source we hold gives Reading a per-question timer, and that the
// published figures are per-part allowances.
//
// The window travels with the content rather than living in a timing
// module, because unlike Listening there is one number per part and it is
// a property of that part. A part whose figure is not published says so
// through source and note rather than hiding a guess behind a constant.
export type ReadingPartTimer = {
  seconds: number;
  // When the reading turns amber, and then red.
  warningAtSeconds: number;
  urgentAtSeconds: number;
  source: ReadingTimerSource;
  // How the number was arrived at, in one line. Read by a person, never
  // rendered.
  note: string;
};

// One answer key entry for one question.
//
// The Reading counterpart of ListeningAnswerKeyEntry, declared here
// rather than imported from listening-review-types.ts because the two
// sections disagree about where a key can come from, and a shared type
// would have to allow both everywhere.
//
// correctOptionId is null, not undefined, when the key is known to be
// missing. Null says "we looked and it is not in the source", which is a
// different thing from a part nobody has checked.
//
// source records where a value came from. Reading keys are printed as
// text in the source document, which is what "document" means, and is why
// Reading has a usable key where Listening needed six screenshots
// transcribed by hand.
export type ReadingAnswerKeyEntry = {
  questionId: string;
  correctOptionId: string | null;
  // Short reason the option is correct, when the source gives one. Mock
  // Test 1 gives none for Reading, so this is unset throughout.
  explanation?: string;
  source: "document" | "manual";
};

// One Reading part, as the engine consumes it.
export type ReadingPartContent = {
  // For example "mock-test-1".
  testId: string;
  // For example "reading-part-1".
  sectionId: string;
  // Full title for the exam top bar.
  title: string;
  // Short part name, for example "Reading Correspondence".
  partTitle: string;
  // Sentence under the instructions heading on the part intro screen.
  subtitle?: string;
  instructions: ExamInstruction[];
  // One or two sentences describing the part, shown on the intro card.
  summary?: string;
  // Instruction line above the passage, for example "Read the following
  // message."
  passageInstruction?: string;
  passage: ReadingPassage;
  questionGroups: ReadingQuestionGroup[];
  // The answering window for the whole part.
  timer: ReadingPartTimer;

  // Answer key for the whole part, one entry per question.
  //
  // Optional, because a part can be built and walked through before its
  // key exists. An entry with correctOptionId null is a question whose
  // key is known to be missing.
  //
  // A complete key must never reach the browser. See
  // withoutReadingAnswerKey in reading-flow.ts.
  answerKey?: ReadingAnswerKeyEntry[];
};

// Answers held while a learner works through a Reading part.
//
// Keyed by question id, valued by the selected option id, which is the
// { questionId: selectedOptionId } shape the ticket asks for and the
// review ticket will read. Nothing here is written to a database.
export type ReadingAnswerMap = Readonly<Record<string, string>>;

// One screen in a Reading part flow.
//
// A discriminated union rather than a screen index, for the same reason
// the four Listening screen unions are: adding a screen kind should be a
// compile error everywhere it matters.
//
// Three kinds, and that is the whole prototype. The split screen is one
// screen however many questions the part holds, which is what makes a
// Reading part so much shorter a flow than a Listening one.
//
// answer-review, score and part-end are deliberately absent. EXAM-16 does
// not build a Reading review or a Reading score, so there is no kind here
// that nothing can render. EXAM-17 adds them, the way EXAM-14 added them
// to the viewpoints union.
export type ReadingScreen =
  | { kind: "part-intro"; id: string }
  // The split screen: passage on the left, question groups on the right.
  | { kind: "correspondence"; id: string }
  // Closing screen for a part whose review and score are not built yet.
  | { kind: "part-complete"; id: string };
