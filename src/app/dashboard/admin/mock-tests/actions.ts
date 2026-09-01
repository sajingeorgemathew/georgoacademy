"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin, type AdminSession } from "@/lib/admin/require-admin";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  adminActionError,
  adminActionSuccess,
  type AdminActionState,
} from "@/features/admin/admin-action-state";
import {
  logAdminSupabaseError,
  reportAdminReadError,
  withDevelopmentReason,
  type AdminErrorContext,
  type SupabaseErrorLike,
} from "@/features/admin/admin-supabase-error";
import { getMockTestStructure } from "@/features/admin/mock-test-queries";
import {
  MOCK_TEST_STATUSES,
  PART_TYPES,
  PART_TYPES_BY_SECTION,
  PUBLISHABLE_IN_ADMIN_01,
  SCORING_TYPES,
  SECTION_TYPES,
  TIMER_TYPES,
  type MockTestStatus,
} from "@/features/admin/mock-test-types";
import { evaluateMockTestStructure } from "@/features/admin/mock-test-validation";

// Server actions for the ADMIN-01 mock test builder.
//
// Every action starts with requireAdmin. A server action is reachable by
// direct POST, so the check on the page that renders the form protects
// nothing here. See the warning in
// node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md.
//
// After the check, writes go through the service role client. Row level
// security on the four builder tables denies anon and authenticated
// outright, because admin membership is an environment variable that a
// Postgres policy cannot read. The service role key stays on the server:
// this file is a "use server" module and never runs in a browser.
//
// What these actions deliberately do not do:
//   - author questions, options or answer keys (ADMIN-02)
//   - upload or attach media (ADMIN-02)
//   - write timer rules, scoring rules or rubrics (ADMIN-03, ADMIN-04)
//   - save a student attempt (ADMIN-08)
//   - publish anything a learner can see (see PUBLISHABLE_IN_ADMIN_01)
//
// House style: normal hyphens only, straight quotes only.

const LIST_PATH = "/dashboard/admin/mock-tests";

// Postgres unique violation. Only the slug has a unique constraint that
// a staff member can hit by typing, so this maps to one friendly line
// rather than a database error.
const UNIQUE_VIOLATION = "23505";

const REFUSED = "You do not have access to the mock test builder.";

// ---------------------------------------------------------------------
// Field parsing
// ---------------------------------------------------------------------

const uuid = z.uuid("That id is not valid.");

const slugField = z
  .string()
  .trim()
  .min(1, "Enter a slug.")
  .max(120, "Keep the slug under 120 characters.")
  .regex(
    /^[a-z0-9]+(-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and single hyphens, for example mock-test-2.",
  );

// Optional free text. An empty box means null in the database rather
// than an empty string, so a missing value reads the same everywhere.
function optionalText(max: number, label: string) {
  return z
    .string()
    .trim()
    .max(max, `Keep the ${label} under ${max} characters.`)
    .transform((value) => (value.length === 0 ? null : value));
}

// Optional whole number from a text input. An empty box is null.
function optionalInteger(min: number, max: number, label: string) {
  return z
    .string()
    .trim()
    .transform((value) => (value.length === 0 ? null : Number(value)))
    .refine(
      (value) => value === null || Number.isInteger(value),
      `Enter a whole number for the ${label}.`,
    )
    .refine(
      (value) => value === null || (value >= min && value <= max),
      `Enter a ${label} between ${min} and ${max}.`,
    );
}

// An optional select. The empty option means "not decided yet".
function optionalEnum<T extends readonly [string, ...string[]]>(
  values: T,
  message: string,
) {
  return z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || (values as readonly string[]).includes(value),
      message,
    )
    .transform((value) => (value.length === 0 ? null : (value as T[number])));
}

const mockTestFields = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Enter a title.")
    .max(200, "Keep the title under 200 characters."),
  slug: slugField,
  description: optionalText(2000, "description"),
  internal_notes: optionalText(4000, "internal notes"),
  version: z
    .string()
    .trim()
    .transform((value) => (value.length === 0 ? 1 : Number(value)))
    .refine(
      (value) => Number.isInteger(value) && value >= 1 && value <= 999,
      "Enter a version between 1 and 999.",
    ),
});

const sectionFields = z.object({
  section_type: z.enum(SECTION_TYPES, {
    message: "Choose Listening, Reading, Writing or Speaking.",
  }),
  title: z
    .string()
    .trim()
    .min(1, "Enter a section title.")
    .max(200, "Keep the title under 200 characters."),
  instructions: optionalText(4000, "instructions"),
  section_order: z
    .string()
    .trim()
    .transform((value) => (value.length === 0 ? NaN : Number(value)))
    .refine(
      (value) => Number.isInteger(value) && value >= 1 && value <= 20,
      "Enter a section order between 1 and 20.",
    ),
  estimated_duration_minutes: optionalInteger(1, 600, "estimated duration"),
  scoring_type: optionalEnum(SCORING_TYPES, "Choose a valid scoring type."),
  status: z.enum(["draft", "ready"], {
    message: "Choose Draft or Ready.",
  }),
});

const partFields = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Enter a part title.")
    .max(200, "Keep the title under 200 characters."),
  part_type: optionalEnum(PART_TYPES, "Choose a valid part type."),
  instructions: optionalText(4000, "instructions"),
  part_order: z
    .string()
    .trim()
    .transform((value) => (value.length === 0 ? NaN : Number(value)))
    .refine(
      (value) => Number.isInteger(value) && value >= 1 && value <= 50,
      "Enter a part order between 1 and 50.",
    ),
  timer_type: optionalEnum(TIMER_TYPES, "Choose a valid timer type."),
  prep_time_seconds: optionalInteger(0, 3600, "preparation time"),
  response_time_seconds: optionalInteger(1, 7200, "response time"),
  question_count: optionalInteger(0, 100, "question count"),
  status: z.enum(["draft", "ready"], {
    message: "Choose Draft or Ready.",
  }),
});

// FormData values arrive as string or File. The builder has no file
// inputs, so anything that is not a string is treated as absent.
function readFields(formData: FormData, names: readonly string[]) {
  const values: Record<string, string> = {};

  for (const name of names) {
    const value = formData.get(name);
    values[name] = typeof value === "string" ? value : "";
  }

  return values;
}

// Turns a zod failure into the field map the forms render.
//
// Only the first message per field is kept. A field with two problems
// still only has one place to print them, and the first is the one that
// explains the shape the input wants.
function toFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field !== "string" || field in fieldErrors) {
      continue;
    }

    fieldErrors[field] = issue.message;
  }

  return fieldErrors;
}

// ---------------------------------------------------------------------
// Mock tests
// ---------------------------------------------------------------------

// Create a practice test. Always created as a draft: the status select
// is not on the create form, so there is no path from an empty test to
// anything a learner could reach.
export async function createMockTest(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireAdmin();

  if (!session) {
    return adminActionError(REFUSED);
  }

  const parsed = mockTestFields.safeParse(
    readFields(formData, [
      "title",
      "slug",
      "description",
      "internal_notes",
      "version",
    ]),
  );

  if (!parsed.success) {
    return adminActionError(
      "Check the highlighted fields.",
      toFieldErrors(parsed.error),
    );
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("mock_tests")
    .insert({
      ...parsed.data,
      status: "draft",
      created_by: session.userId,
      updated_by: session.userId,
    })
    .select("id")
    .single();

  if (error) {
    return adminActionError(
      ...describeWriteError("createMockTest", error, "practice test", {
        slug: parsed.data.slug,
      }),
    );
  }

  revalidatePath(LIST_PATH);

  // redirect throws a control flow exception, so it stays outside the
  // error handling above and nothing runs after it.
  redirect(`${LIST_PATH}/${data.id}`);
}

// Edit the basic details of a practice test, including its status.
//
// Status is the only field here that can change what a learner sees, so
// it goes through guardMockTestStatusChange rather than straight into
// the update.
export async function updateMockTest(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireAdmin();

  if (!session) {
    return adminActionError(REFUSED);
  }

  const idResult = uuid.safeParse(formData.get("mock_test_id"));

  if (!idResult.success) {
    return adminActionError("That practice test could not be found.");
  }

  const mockTestId = idResult.data;

  const parsed = mockTestFields
    .extend({
      status: z.enum(MOCK_TEST_STATUSES, {
        message: "Choose a valid status.",
      }),
    })
    .safeParse(
      readFields(formData, [
        "title",
        "slug",
        "description",
        "internal_notes",
        "version",
        "status",
      ]),
    );

  if (!parsed.success) {
    return adminActionError(
      "Check the highlighted fields.",
      toFieldErrors(parsed.error),
    );
  }

  const guard = await guardMockTestStatusChange(
    session,
    mockTestId,
    parsed.data.status,
  );

  if (guard) {
    return guard;
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("mock_tests")
    .update({
      ...parsed.data,
      updated_by: session.userId,
    })
    .eq("id", mockTestId);

  if (error) {
    return adminActionError(
      ...describeWriteError("updateMockTest", error, "practice test", {
        id: mockTestId,
        slug: parsed.data.slug,
      }),
    );
  }

  revalidatePath(LIST_PATH);
  revalidatePath(`${LIST_PATH}/${mockTestId}`);
  revalidatePath(`${LIST_PATH}/${mockTestId}/preview`);

  return adminActionSuccess("Saved.");
}

// Refuses a status change that would be unsafe, and returns null when
// the change is allowed.
//
// Two separate refusals, on purpose:
//
//  1. Moving to internal_preview is blocked while the structure has
//     errors, so an incomplete test cannot be circulated for review.
//  2. published is blocked outright in ADMIN-01. A published test would
//     need questions, answer keys, timers and scoring rules, none of
//     which this ticket builds, and there is no learner route that could
//     render one. The status exists so the vocabulary is settled.
//
// draft and archived are never gated. Both only ever narrow who can see
// a test, and refusing to archive a test because its structure is
// incomplete would leave the incomplete ones as the only ones that
// cannot be put away.
async function guardMockTestStatusChange(
  session: AdminSession,
  mockTestId: string,
  nextStatus: MockTestStatus,
): Promise<AdminActionState | null> {
  if (nextStatus === "draft" || nextStatus === "archived") {
    return null;
  }

  const summary = await refreshValidationIssues(session, mockTestId);

  if (!summary) {
    return adminActionError("That practice test could not be found.");
  }

  if (nextStatus === "published" && !PUBLISHABLE_IN_ADMIN_01) {
    return adminActionError(
      "Publishing is not available yet. A published practice test needs questions, answer keys, timers and scoring rules, which arrive in a later ticket. The status stays available so the wording is settled.",
      { status: "Publishing is blocked in this version of the builder." },
    );
  }

  if (!summary.canAdvanceStatus) {
    const noun = summary.errorCount === 1 ? "problem" : "problems";

    return adminActionError(
      `The structure has ${summary.errorCount} ${noun} to fix before this practice test can leave draft. Open the structure preview to see the list.`,
      { status: "Fix the structure problems first." },
    );
  }

  return null;
}

// ---------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------

export async function createMockTestSection(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireAdmin();

  if (!session) {
    return adminActionError(REFUSED);
  }

  const idResult = uuid.safeParse(formData.get("mock_test_id"));

  if (!idResult.success) {
    return adminActionError("That practice test could not be found.");
  }

  const mockTestId = idResult.data;

  const parsed = sectionFields.safeParse(
    readFields(formData, [
      "section_type",
      "title",
      "instructions",
      "section_order",
      "estimated_duration_minutes",
      "scoring_type",
      "status",
    ]),
  );

  if (!parsed.success) {
    return adminActionError(
      "Check the highlighted fields.",
      toFieldErrors(parsed.error),
    );
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("mock_test_sections").insert({
    ...parsed.data,
    mock_test_id: mockTestId,
    created_by: session.userId,
    updated_by: session.userId,
  });

  if (error) {
    // A duplicate skill is an ordinary outcome rather than a fault, so
    // it gets its own wording. It is still logged, because a run of them
    // usually means the form is offering a skill the test already has.
    if (error.code === UNIQUE_VIOLATION) {
      logAdminSupabaseError("createMockTestSection", error, { id: mockTestId });

      return adminActionError(
        "That practice test already has a section for this skill. A test holds one Listening, one Reading, one Writing and one Speaking section.",
        { section_type: "This skill is already on the test." },
      );
    }

    return adminActionError(
      ...describeWriteError("createMockTestSection", error, "section", {
        id: mockTestId,
      }),
    );
  }

  revalidatePath(LIST_PATH);
  revalidatePath(`${LIST_PATH}/${mockTestId}`);
  revalidatePath(`${LIST_PATH}/${mockTestId}/preview`);

  redirect(`${LIST_PATH}/${mockTestId}`);
}

export async function updateMockTestSection(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireAdmin();

  if (!session) {
    return adminActionError(REFUSED);
  }

  const idResult = uuid.safeParse(formData.get("mock_test_id"));
  const sectionResult = uuid.safeParse(formData.get("section_id"));

  if (!idResult.success || !sectionResult.success) {
    return adminActionError("That section could not be found.");
  }

  const mockTestId = idResult.data;
  const sectionId = sectionResult.data;

  const parsed = sectionFields.safeParse(
    readFields(formData, [
      "section_type",
      "title",
      "instructions",
      "section_order",
      "estimated_duration_minutes",
      "scoring_type",
      "status",
    ]),
  );

  if (!parsed.success) {
    return adminActionError(
      "Check the highlighted fields.",
      toFieldErrors(parsed.error),
    );
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("mock_test_sections")
    .update({
      ...parsed.data,
      updated_by: session.userId,
    })
    .eq("id", sectionId)
    // Scoped to the test from the URL as well, so a section id belonging
    // to another test cannot be edited through this form.
    .eq("mock_test_id", mockTestId);

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      logAdminSupabaseError("updateMockTestSection", error, { id: sectionId });

      return adminActionError(
        "That practice test already has a section for this skill.",
        { section_type: "This skill is already on the test." },
      );
    }

    return adminActionError(
      ...describeWriteError("updateMockTestSection", error, "section", {
        id: sectionId,
      }),
    );
  }

  revalidatePath(`${LIST_PATH}/${mockTestId}`);
  revalidatePath(`${LIST_PATH}/${mockTestId}/preview`);

  return adminActionSuccess("Section saved.");
}

// ---------------------------------------------------------------------
// Parts
// ---------------------------------------------------------------------

export async function createMockTestPart(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireAdmin();

  if (!session) {
    return adminActionError(REFUSED);
  }

  const idResult = uuid.safeParse(formData.get("mock_test_id"));
  const sectionResult = uuid.safeParse(formData.get("section_id"));

  if (!idResult.success || !sectionResult.success) {
    return adminActionError("That section could not be found.");
  }

  const mockTestId = idResult.data;
  const sectionId = sectionResult.data;

  const parsed = partFields.safeParse(
    readFields(formData, [
      "title",
      "part_type",
      "instructions",
      "part_order",
      "timer_type",
      "prep_time_seconds",
      "response_time_seconds",
      "question_count",
      "status",
    ]),
  );

  if (!parsed.success) {
    return adminActionError(
      "Check the highlighted fields.",
      toFieldErrors(parsed.error),
    );
  }

  const mismatch = await checkPartTypeFitsSection(
    session,
    mockTestId,
    sectionId,
    parsed.data.part_type,
  );

  if (mismatch) {
    return mismatch;
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("mock_test_parts").insert({
    ...parsed.data,
    mock_test_id: mockTestId,
    section_id: sectionId,
    created_by: session.userId,
    updated_by: session.userId,
  });

  if (error) {
    return adminActionError(
      ...describeWriteError("createMockTestPart", error, "part", {
        id: sectionId,
      }),
    );
  }

  revalidatePath(LIST_PATH);
  revalidatePath(`${LIST_PATH}/${mockTestId}`);
  revalidatePath(`${LIST_PATH}/${mockTestId}/preview`);

  redirect(`${LIST_PATH}/${mockTestId}`);
}

export async function updateMockTestPart(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireAdmin();

  if (!session) {
    return adminActionError(REFUSED);
  }

  const idResult = uuid.safeParse(formData.get("mock_test_id"));
  const sectionResult = uuid.safeParse(formData.get("section_id"));
  const partResult = uuid.safeParse(formData.get("part_id"));

  if (!idResult.success || !sectionResult.success || !partResult.success) {
    return adminActionError("That part could not be found.");
  }

  const mockTestId = idResult.data;
  const sectionId = sectionResult.data;
  const partId = partResult.data;

  const parsed = partFields.safeParse(
    readFields(formData, [
      "title",
      "part_type",
      "instructions",
      "part_order",
      "timer_type",
      "prep_time_seconds",
      "response_time_seconds",
      "question_count",
      "status",
    ]),
  );

  if (!parsed.success) {
    return adminActionError(
      "Check the highlighted fields.",
      toFieldErrors(parsed.error),
    );
  }

  const mismatch = await checkPartTypeFitsSection(
    session,
    mockTestId,
    sectionId,
    parsed.data.part_type,
  );

  if (mismatch) {
    return mismatch;
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("mock_test_parts")
    .update({
      ...parsed.data,
      updated_by: session.userId,
    })
    .eq("id", partId)
    .eq("section_id", sectionId)
    .eq("mock_test_id", mockTestId);

  if (error) {
    return adminActionError(
      ...describeWriteError("updateMockTestPart", error, "part", {
        id: partId,
      }),
    );
  }

  revalidatePath(`${LIST_PATH}/${mockTestId}`);
  revalidatePath(`${LIST_PATH}/${mockTestId}/preview`);

  return adminActionSuccess("Part saved.");
}

// A Reading part type in a Listening section is a modelling error the
// database cannot see, because part_type and section_type live on
// different tables. Checked here so it is refused at the point of
// writing rather than only reported by the validator afterwards.
//
// Takes the session it will never read, for the same structural reason
// the query module does: the authorization step becomes an argument a
// future caller cannot drop and still compile.
async function checkPartTypeFitsSection(
  session: AdminSession,
  mockTestId: string,
  sectionId: string,
  partType: string | null,
): Promise<AdminActionState | null> {
  if (partType === null) {
    return null;
  }

  if (!session.userId) {
    return adminActionError(REFUSED);
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("mock_test_sections")
    .select("section_type")
    .eq("id", sectionId)
    .eq("mock_test_id", mockTestId)
    .maybeSingle();

  if (error) {
    logAdminSupabaseError("checkPartTypeFitsSection", error, {
      id: sectionId,
    });

    return adminActionError(
      withDevelopmentReason("That section could not be found.", error),
    );
  }

  if (!data) {
    return adminActionError("That section could not be found.");
  }

  const sectionType = data.section_type as keyof typeof PART_TYPES_BY_SECTION;
  const allowed = PART_TYPES_BY_SECTION[sectionType] ?? [];

  if (!(allowed as readonly string[]).includes(partType)) {
    return adminActionError("That part type does not belong in this section.", {
      part_type: "Choose a part type that fits this section.",
    });
  }

  return null;
}

// ---------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------

// Run every structure rule and refresh the cached issue rows.
//
// The rules themselves live in
// src/features/admin/mock-test-validation.ts and touch no database, so
// the preview screen can show the same findings without writing.
export async function validateMockTestStructure(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireAdmin();

  if (!session) {
    return adminActionError(REFUSED);
  }

  const idResult = uuid.safeParse(formData.get("mock_test_id"));

  if (!idResult.success) {
    return adminActionError("That practice test could not be found.");
  }

  const mockTestId = idResult.data;
  const summary = await refreshValidationIssues(session, mockTestId);

  if (!summary) {
    return adminActionError("That practice test could not be found.");
  }

  revalidatePath(LIST_PATH);
  revalidatePath(`${LIST_PATH}/${mockTestId}`);
  revalidatePath(`${LIST_PATH}/${mockTestId}/preview`);

  if (summary.issues.length === 0) {
    return adminActionSuccess(
      "Structure checks passed. Questions, answer keys, media and timers are checked in later tickets.",
    );
  }

  const parts: string[] = [];

  if (summary.errorCount > 0) {
    parts.push(
      `${summary.errorCount} ${summary.errorCount === 1 ? "problem" : "problems"}`,
    );
  }

  if (summary.warningCount > 0) {
    parts.push(
      `${summary.warningCount} ${summary.warningCount === 1 ? "warning" : "warnings"}`,
    );
  }

  return adminActionSuccess(`Structure checked: ${parts.join(" and ")}.`);
}

// Recomputes the rules and rewrites the cached rows for one test.
// Returns null when the test does not exist.
//
// The rows are a cache of a computation, so a run replaces them outright
// rather than reconciling row by row. resolved stays on the table for a
// later ticket where an author dismisses a warning they have decided to
// live with.
async function refreshValidationIssues(
  session: AdminSession,
  mockTestId: string,
) {
  const structure = await getMockTestStructure(session, mockTestId);

  if (!structure) {
    return null;
  }

  const summary = evaluateMockTestStructure(structure);
  const supabase = getSupabaseAdmin();

  const { error: deleteError } = await supabase
    .from("mock_test_validation_issues")
    .delete()
    .eq("mock_test_id", mockTestId);

  if (deleteError) {
    throw reportAdminReadError(
      "validateMockTestStructure:clear",
      deleteError,
      "The structure checks could not be saved.",
      { id: mockTestId },
    );
  }

  if (summary.issues.length > 0) {
    const { error: insertError } = await supabase
      .from("mock_test_validation_issues")
      .insert(
        summary.issues.map((issue) => ({
          mock_test_id: mockTestId,
          entity_type: issue.entityType,
          entity_id: issue.entityId,
          issue_type: issue.issueType,
          issue_message: issue.message,
          severity: issue.severity,
          resolved: false,
        })),
      );

    if (insertError) {
      throw reportAdminReadError(
        "validateMockTestStructure:record",
        insertError,
        "The structure checks could not be saved.",
        { id: mockTestId },
      );
    }
  }

  return summary;
}

// ---------------------------------------------------------------------
// Error wording
// ---------------------------------------------------------------------

// Turns a PostgREST error into something a staff member can act on, and
// writes the full error to the server log on the way past.
//
// Both halves matter. The raw message is not rendered in production,
// because it can name columns, constraints and sometimes the failing
// row, and a database error string is not a place to be casual about
// what leaks. But it has to go somewhere, and before this it went
// nowhere: a create that failed on a missing column produced the same
// "check the values and try again" as a typo, with nothing in the log to
// tell them apart.
//
// In development the sentence carries a short reason as well, since the
// person reading the screen is the person who can fix the schema.
//
// Only a slug or an id is ever passed as context. Never the row: it can
// hold staff internal notes.
function describeWriteError(
  action: string,
  error: SupabaseErrorLike,
  noun: string,
  context: AdminErrorContext = {},
): [string, Record<string, string>] {
  logAdminSupabaseError(action, error, context);

  if (error.code === UNIQUE_VIOLATION) {
    return [
      "That slug is already taken by another practice test. Choose a different one.",
      { slug: "This slug is already in use." },
    ];
  }

  return [
    withDevelopmentReason(
      `The ${noun} could not be saved. Check the values and try again.`,
      error,
    ),
    {},
  ];
}
