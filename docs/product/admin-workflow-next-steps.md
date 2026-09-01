# Admin workflow next steps (ADMIN-00)

What ADMIN-01 should build, what it should not, and how to tell when it
is done.

ADMIN-00 produced four design documents and no code. This document turns
them into the next ticket.

**Status: ADMIN-01 has shipped.** What it actually built, and how that
differs from the recommendation below, is recorded in
`docs/admin/admin-01-mock-test-builder-mvp.md`. The short version: it
built items 1 to 6 and item 10 of the table in section 1, as a structure
builder, and left items 7 to 9, the question, option and answer key
editors, to ADMIN-02. Section 7 below is the ADMIN-02 scope.

Design documents:

- `docs/admin/mock-test-builder-workflow.md`
- `docs/admin/mock-test-builder-database-blueprint.md`
- `docs/admin/mock-test-builder-draft-schema.sql` (draft, not a
  migration, not applied)
- `docs/admin/mock-test-1-manual-to-admin-map.md`

House style: normal hyphens only, no long hyphens or em dashes, straight
quotes only.

---

## 1. The recommended ADMIN-01 MVP

Build the smallest admin panel that can produce real, previewable
objective content and nothing else.

| # | Scope item | What it means concretely |
| --- | --- | --- |
| 1 | Admin route protection | Every route under `/admin` checks the session role server-side. A non-staff session gets a redirect, not a hidden link. |
| 2 | Admin mock test list | One table of tests with title, status, sections and updated date. |
| 3 | Create mock test draft | Title, slug, description, internal notes. Always created as `draft`. |
| 4 | Edit basic details | The same fields, editable. Status stays `draft`. |
| 5 | Create sections | Pick a skill, set a title, set instruction text, set the order. |
| 6 | Create parts | Pick a part type, set a title, instructions and scenario text, set the order. |
| 7 | Add objective questions | Prompt, or the text either side of a blank, per question type. |
| 8 | Add answer options | Text and display order, normally four per question. |
| 9 | Add answer key | Select the correct option, record its source, add an optional explanation. |
| 10 | Preview draft content | Render a part through the real learner screens with keys stripped. |

That is ten items and it is deliberately one vertical slice: an authored
question you can see, answer and preview, with a key that never reaches
the browser.

### Why this is the right cut

**It proves the two hard things and skips the easy ones.** The two things
that could be wrong in the blueprint are the answer key separation and
the part type template. Everything on the list above exercises both.
Media, rubrics, timers and attempts are additive once those two hold.

**It produces something usable, not a demo.** After ADMIN-01 a staff
member can type a Listening or Reading part into a form and look at it.
That is not a whole mock test, but it is the first content in the system
that no developer touched.

**It is testable against known data.** Mock Test 1 Reading Part 1 is 11
questions with 44 options and 11 keys, all recorded and all checkable.
Re-entering one existing part through the new forms and comparing it to
the content file is a complete acceptance test that needs no new source
document.

---

## 2. Explicitly out of scope for ADMIN-01

| Excluded | Why |
| --- | --- |
| Drag and drop ordering | A position number field works. Reordering is a UI nicety with real complexity behind it. |
| Analytics | No attempts are saved, so there is nothing to analyse. |
| File uploads | Media stays a pasted Cloudinary URL, which is how all 46 Mock Test 1 assets already work. |
| Complex permissions | Two staff roles, checked in one place. No per-test grants, no delegation, no audit UI. |
| Bulk import | The highest value and highest risk feature. It belongs after the model is proven, not during. |
| AI rubric editor | Rubric changes affect every learner result. They stay in code until the builder is trusted. |
| Student attempt history | A separate concern from authoring, and the four attempt tables are new construction. |
| Payments | Unrelated. |
| Live classes | Unrelated. |
| Writing and Speaking authoring | Same shape as objective authoring but with rubrics attached. Follows once the objective path works. |
| Versioning a published test | ADMIN-01 never publishes anything, so nothing needs a version yet. |
| Media library browsing | Assets are attached by URL. Search and reuse come with the second test. |

Two of these deserve a sentence each, because they will be argued for.

**Media in ADMIN-01.** The MVP above can author a Reading part end to end
without touching a media asset, because Reading passages are text and
only Part 2 has an image. Listening cannot: every Listening part needs at
least one clip. If ADMIN-01 wants Listening authoring, add the media URL
field, the format check and the HEAD verification to the scope. If it
targets Reading first, media can wait. The recommendation is to target
Reading first for exactly that reason.

**Publishing in ADMIN-01.** Not on the list. Publishing requires the full
validation set, and the full validation set requires timers, scoring
rules and rubrics that ADMIN-01 does not build. A test authored in
ADMIN-01 stays `draft` and is previewed, which is enough to prove the
model.

---

## 3. Suggested ticket sequence after ADMIN-01

Each of these is a ticket sized like ADMIN-01, adding one capability to a
builder that already works.

| Ticket | Adds |
| --- | --- |
| ADMIN-02 | Questions, options, answer keys, media links, and the first dynamic preview of objective questions. Scope in section 7. |
| ADMIN-03 | Timer rules with `source`, `source_note` and `on_expire`. Unblocks a part that runs at exam pace. |
| ADMIN-04 | Scoring rules and band maps, including the overlapping rows. Unblocks a preview that shows an estimated level. |
| ADMIN-05 | Validation engine and the issues list. Unblocks `ready_for_review`. |
| ADMIN-06 | Publishing, unpublishing and archiving, gated on validation. First learner-visible authored test. |
| ADMIN-07 | Writing and Speaking authoring with rubric attachment. |
| ADMIN-08 | Student attempt persistence, the four attempt tables. Separate from authoring throughout. |

The order is not arbitrary. Each ticket removes one reason a test cannot
be published, and ADMIN-06 is the first one where a learner sees
something a developer did not write.

---

## 4. What ADMIN-01 must decide before it starts

Three questions that ADMIN-00 deliberately left open, because they need
an implementation in front of them.

**How is a staff role asserted?** `profiles.role` exists as a plain
`text` column defaulting to `'student'`, and nothing reads it today. The
recommendation is to keep that column, add a check constraint for
`student`, `staff_admin` and `super_admin`, and read it through one
server-side helper. Every RLS policy in the draft schema assumes such a
helper exists, and none of them can be written until it does.

**Does ADMIN-01 create real tables?** It has to create some. The
recommendation is a real migration for the seven tables the MVP touches
(`mock_tests`, `mock_test_sections`, `mock_test_parts`,
`mock_test_screens`, `mock_test_questions`, `mock_test_options`,
`mock_test_answer_keys`, plus `mock_test_option_sets`), taken from the
draft schema, reviewed as a migration in its own right, and applied with
explicit approval. The remaining tables wait for the tickets that use
them. Creating all sixteen up front would mean shipping nine tables that
nothing reads.

**Reading first or Listening first?** Reading, for the media reason in
section 2. Reading Part 1 is the single best acceptance test in the repo:
11 questions, 44 options, 11 keys, every one recorded in a content file
that can be compared against.

---

## 5. Done criteria for ADMIN-01

Concrete enough to check.

- A non-staff session that visits any `/admin` route is redirected, and
  the check is server-side.
- A staff session sees a list of mock tests.
- A staff member can create a draft, add a Reading section, add a
  correspondence part, add eleven questions with four options each, and
  set a key on every one.
- The preview renders that part through the same components a learner
  uses.
- The preview response contains no answer key. Verified by inspecting the
  payload, not by trusting the code.
- A learner session querying the new tables directly sees nothing for a
  draft test, and nothing at all from `mock_test_answer_keys`.
- `npm run lint` and `npm run build` pass.
- Every existing learner route still builds and still renders from its
  content files. ADMIN-01 changes no learner route.

---

## 6. Status after ADMIN-00

| Item | Status |
| --- | --- |
| Admin workflow document | Written |
| Database blueprint, sixteen entities | Written |
| Draft SQL | Written, marked DRAFT, outside `supabase/migrations/` |
| Mock Test 1 to admin model map | Written |
| ADMIN-01 MVP scope | Defined above |
| Production migration created | Yes, in ADMIN-01: `supabase/migrations/013_mock_test_builder_admin_foundation.sql` |
| SQL applied to hosted Supabase | No, run manually by the user |
| Learner routes changed | No |
| Listening, Reading, Writing, Speaking flows changed | No |
| Admin UI built | Yes, in ADMIN-01: structure builder only |
| Question, option and answer key editors built | No, ADMIN-02 |
| Student attempts saved | No |

---

## 7. ADMIN-02 scope

ADMIN-01 built the structure: practice tests, sections, parts, basic
timing values, a structure preview and structure validation. It
deliberately stopped before anything that carries a right answer.

ADMIN-02 builds that, and it is one vertical slice again.

| # | Scope item | What it means concretely |
| --- | --- | --- |
| 1 | Question editor | Create `mock_test_questions` under a part. Prompt for a whole question, or the text either side of a blank for a completion item. Position contiguous from 1. |
| 2 | Options editor | Create `mock_test_options` under a question, normally four, with text and display order. Plus the shared A to E option set Reading Part 3 needs. |
| 3 | Answer key editor | Create `mock_test_answer_keys`, selecting the correct option, recording its source, and taking an optional explanation. |
| 4 | Media link editor | Paste a Cloudinary URL onto a screen or a question, validate its shape, record alt text, and verify it resolves with a HEAD request. Unblocks Listening authoring. |
| 5 | First dynamic preview of objective questions | Render an authored part through the real learner question components, with the keys stripped before the content leaves the server. |

Tables ADMIN-02 has to create, taken from the ADMIN-00 draft schema:
`mock_test_questions`, `mock_test_options`, `mock_test_option_sets`,
`mock_test_answer_keys`, `mock_test_media_assets`, and
`mock_test_screens` if the dynamic preview needs a materialised screen
run rather than a part level render.

Two rules ADMIN-01 set that ADMIN-02 has to keep:

**The answer key table gets no policy for authenticated users at all.**
Not a filtered policy: none. Row level security denies by default when no
policy matches, so the absence is the enforcement. That is how the four
ADMIN-01 tables are protected, and the answer key table is the one where
a mistake hands a learner the answers.

**The preview response contains no answer key.** Verified by inspecting
the payload, not by trusting the code. The existing Listening section
already works this way: `withoutListeningSectionAnswerKeys` strips the
keys before the content reaches the browser, because a client component
receives its props as serialized data and a key sent that way is readable
in the page payload before a learner has answered anything.

Validation rules ADMIN-02 turns on, listed at the foot of
`src/features/admin/mock-test-validation.ts`:

- every objective question has at least two options, normally four
- no two options on a question share identical text
- every option has non-empty text
- every scored objective question has an answer key row
- every correct option belongs to that question or its shared option set
- no answer key exists for a Writing or Speaking question
- every media screen references an asset with a real URL
- every image asset has non-empty alt text

Still out of scope in ADMIN-02: timer rules (ADMIN-03), scoring rules and
band maps (ADMIN-04), publishing (ADMIN-06), Writing and Speaking rubric
authoring (ADMIN-07), and student attempt persistence (ADMIN-08).
