// Screen order and recording helpers for the Mock Test 1 Speaking section
// (EXAM-27).
//
// The Speaking counterpart of writing-mock-flow.ts. Pure functions over
// SpeakingSectionContent, no React and no side effects, so the flow can
// be built on the server, rendered on the client, and tested on its own
// later.
//
// The order is derived from the content rather than typed out, so a
// section with a different number of tasks needs no edit here. For Mock
// Test 1 it produces 17 screens:
//
//     1  Speaking section intro
//     2  Speaking Task 1
//     3  Task 1 to Task 2 transition
//     4  Speaking Task 2
//   ...  and so on, a transition before every task after the first
//    16  Speaking Task 8
//    17  Speaking section complete
//
// There is no score screen, no review screen and no transcript screen,
// which is the whole shape of this ticket: nothing is transcribed,
// nothing is sent to an AI reviewer, no band is estimated and no audio
// leaves the browser. The section closes on a completion screen that
// reports which tasks were recorded and says the review is next. EXAM-28
// is where a result screen goes, and the note at the foot of
// docs/product/speaking-mock-test-prototype.md says how.
//
// There is no answer key helper here and no withoutSpeakingAnswerKey to
// match the Reading one. A Speaking task has no key: it is judged against
// descriptors rather than compared to a correct option, so there is
// nothing in the content that has to be kept out of the browser. The
// whole section content is safe to hand to the client component.
//
// One thing this file does not do, and it is worth saying because a Blob
// is not a string: it never creates or revokes an object URL. Both are
// browser calls, so they belong in the component that owns the state, and
// this file only ever moves an already made response around a map. See
// SpeakingSectionPrototype.
//
// House style: normal hyphens only, no long hyphens or em dashes.

import type {
  SpeakingResponse,
  SpeakingResponseMap,
  SpeakingSectionContent,
  SpeakingSectionScreen,
  SpeakingTaskContent,
  SpeakingTaskSummary,
} from "./speaking-mock-types";

// An empty answer. The shape a task starts in and returns to.
//
// A frozen constant rather than a factory, because nothing ever mutates a
// response: setSpeakingResponse replaces the whole entry.
export const EMPTY_SPEAKING_RESPONSE: SpeakingResponse = Object.freeze({
  audioUrl: null,
  audioBlob: null,
  durationSeconds: 0,
  recordedAt: null,
  mimeType: null,
});

// Build the screen order for the whole Speaking section.
//
// A transition screen is inserted before every task except the first,
// which is what turns eight recorders into one run. A one task section
// therefore gets no transition screen at all.
export function buildSpeakingSectionFlow(
  content: SpeakingSectionContent,
): SpeakingSectionScreen[] {
  const screens: SpeakingSectionScreen[] = [
    { kind: "section-intro", id: `${content.sectionId}-intro` },
  ];

  content.tasks.forEach((task, taskIndex) => {
    if (taskIndex > 0) {
      screens.push({
        kind: "task-transition",
        id: `${task.taskId}-transition`,
        taskIndex,
      });
    }

    screens.push({
      kind: "task",
      id: `${task.taskId}-screen`,
      taskIndex,
    });
  });

  screens.push({
    kind: "section-complete",
    id: `${content.sectionId}-complete`,
  });

  return screens;
}

// The recording held for one task, or the empty response when none has
// been made.
//
// Always an object, never undefined, so every caller can read
// response.audioUrl without a guard and a screen cannot half render
// because a task has not been reached yet.
export function getSpeakingResponse(
  responses: SpeakingResponseMap,
  taskId: string,
): SpeakingResponse {
  return responses[taskId] ?? EMPTY_SPEAKING_RESPONSE;
}

// Store a recording, leaving the other tasks alone.
//
// A new object every time, so React sees a changed reference. Keyed by
// task id rather than by screen position, which is what makes a recording
// survive moving forward to the next task and back again: the map is not
// touched by navigation at all.
//
// Recording again replaces the entry. The caller is responsible for
// revoking the object URL this one displaces, because revoking is a
// browser call and this file makes none. See SpeakingSectionPrototype.
export function setSpeakingResponse(
  responses: SpeakingResponseMap,
  taskId: string,
  response: SpeakingResponse,
): SpeakingResponseMap {
  return { ...responses, [taskId]: response };
}

// Whether a task has a recording that can be played.
//
// Both fields are checked rather than one. A response with a blob and no
// URL cannot be played, and a response with a URL and no blob is one
// EXAM-28 could not upload, so a task counts as recorded only when it has
// both.
export function hasSpeakingRecording(
  responses: SpeakingResponseMap,
  taskId: string,
): boolean {
  const response = getSpeakingResponse(responses, taskId);

  return response.audioBlob !== null && response.audioUrl !== null;
}

// How many tasks in the section have a recording.
export function countSpeakingRecordings(
  content: SpeakingSectionContent,
  responses: SpeakingResponseMap,
): number {
  return content.tasks.filter((task) =>
    hasSpeakingRecording(responses, task.taskId),
  ).length;
}

// Every object URL currently held in the map.
//
// Used when the run is thrown away, so the caller can revoke all of them
// in one pass. Returning the list rather than revoking it keeps this file
// free of browser calls.
export function listSpeakingAudioUrls(
  responses: SpeakingResponseMap,
): string[] {
  return Object.values(responses)
    .map((response) => response.audioUrl)
    .filter((url): url is string => url !== null);
}

// What the completion screen reports for one task.
//
// Recorded or not, and how long. No score, no band, no transcript and no
// feedback, because none of those exist yet and a summary type with empty
// fields waiting for them would be an invitation to fill them with
// something invented.
export function summarizeSpeakingTask(
  task: SpeakingTaskContent,
  responses: SpeakingResponseMap,
): SpeakingTaskSummary {
  const response = getSpeakingResponse(responses, task.taskId);

  return {
    taskId: task.taskId,
    taskLabel: task.taskLabel,
    taskTitle: task.taskTitle,
    recorded: hasSpeakingRecording(responses, task.taskId),
    durationSeconds: response.durationSeconds,
    recordedAt: response.recordedAt,
  };
}

// What the completion screen reports for the whole section, in task
// order.
export function summarizeSpeakingSection(
  content: SpeakingSectionContent,
  responses: SpeakingResponseMap,
): SpeakingTaskSummary[] {
  return content.tasks.map((task) => summarizeSpeakingTask(task, responses));
}

// There is deliberately no areAllSpeakingTasksRecorded here.
//
// Nothing in the Speaking flow blocks Next on a missing recording. The
// ticket asks for missing recordings not to crash the flow, and a gate
// would do worse than crash: it would trap a learner whose microphone is
// broken on a screen they cannot leave. A task with no recording travels
// as the empty response, counts nothing, and is reported as missing on
// the completion screen.
