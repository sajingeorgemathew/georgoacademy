"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { writingPracticeCopy } from "@/features/writing/task-copy";
import type { WritingPracticeTask } from "@/features/writing/task-types";
import { submitWritingAttempt } from "@/features/writing/submit-writing-attempt";
import {
  getDeadline,
  getElapsedSeconds,
  getRemainingSeconds,
} from "@/features/writing/writing-timer";
import {
  countWords,
  MIN_SUBMIT_WORD_COUNT,
} from "@/features/writing/word-count";
import { WordCountCard } from "./WordCountCard";
import { WritingEditor } from "./WritingEditor";
import { WritingPromptCard } from "./WritingPromptCard";
import { WritingSavedCard } from "./WritingSavedCard";
import { WritingStartCard } from "./WritingStartCard";
import { WritingSubmitButton } from "./WritingSubmitButton";
import { WritingTimer } from "./WritingTimer";

type WritingPhase = "intro" | "writing" | "saved";

// Client shell for the timed writing flow. Owns the phase state, the
// countdown, the response text, and the submit request, and receives
// only safe task data from the server page. The timer starts when the
// student clicks Start writing, and reaching zero never auto-submits.
export function TimedWritingShell({ task }: { task: WritingPracticeTask }) {
  const [phase, setPhase] = useState<WritingPhase>("intro");
  const [remaining, setRemaining] = useState(task.timeSeconds);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Wall clock start of the session, used to report time spent on
  // submit even after the countdown has reached zero.
  const startedAtRef = useRef<number | null>(null);

  const startWriting = () => {
    startedAtRef.current = Date.now();
    setRemaining(task.timeSeconds);
    setPhase("writing");
  };

  // Runs the countdown while the student writes. The deadline is an
  // absolute timestamp so the timer stays accurate even when interval
  // ticks are delayed, for example on a backgrounded mobile browser.
  useEffect(() => {
    if (phase !== "writing") {
      return;
    }

    const deadline = getDeadline(Date.now(), task.timeSeconds);

    const id = window.setInterval(() => {
      const left = getRemainingSeconds(deadline, Date.now());
      setRemaining(left);
      if (left <= 0) {
        // Time is up: stop ticking, keep the editor open, and let the
        // student submit manually. Nothing is auto-submitted.
        window.clearInterval(id);
      }
    }, 250);

    return () => window.clearInterval(id);
  }, [phase, task.timeSeconds]);

  const wordCount = countWords(responseText);
  const timeExpired = phase === "writing" && remaining <= 0;

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    if (wordCount < MIN_SUBMIT_WORD_COUNT) {
      setSubmitError(writingPracticeCopy.tooShortMessage);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const timeSpentSeconds = startedAtRef.current
      ? getElapsedSeconds(startedAtRef.current, Date.now())
      : 0;

    const result = await submitWritingAttempt({
      taskId: task.id,
      responseText,
      wordCount,
      timeSpentSeconds,
    });

    setSubmitting(false);

    if (result.ok) {
      setPhase("saved");
    } else {
      setSubmitError(result.message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <nav
        aria-label="Writing practice navigation"
        className="flex flex-wrap items-center gap-x-5 gap-y-2"
      >
        <Link
          href={`/dashboard/writing/tasks/${task.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
        >
          <span aria-hidden>&larr;</span>
          {writingPracticeCopy.backToTask}
        </Link>
        <Link
          href="/dashboard/writing"
          className="text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
        >
          {writingPracticeCopy.backToTasks}
        </Link>
      </nav>

      <article className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink/5 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
          {writingPracticeCopy.screenBadge} - Task {task.taskNumber}
        </p>
        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {task.title}
        </h1>

        <div className="mt-6 space-y-5">
          {phase === "saved" ? (
            <WritingSavedCard />
          ) : phase === "intro" ? (
            <>
              <WritingPromptCard prompt={task.prompt} />
              <WritingStartCard
                timeSeconds={task.timeSeconds}
                wordMin={task.wordMin}
                wordMax={task.wordMax}
                evaluationFocus={task.evaluationFocus}
                onStart={startWriting}
              />
            </>
          ) : (
            <>
              <WritingTimer
                seconds={remaining}
                totalSeconds={task.timeSeconds}
                running={!timeExpired}
                expired={timeExpired}
              />
              {timeExpired && (
                <p
                  role="alert"
                  className="rounded-2xl bg-amber-50 p-4 text-center text-sm leading-6 text-amber-900 ring-1 ring-amber-200"
                >
                  {writingPracticeCopy.timeEndedWarning}
                </p>
              )}
              <WritingPromptCard prompt={task.prompt} />
              <WritingEditor
                value={responseText}
                onChange={setResponseText}
                disabled={submitting}
              />
              <WordCountCard
                wordCount={wordCount}
                wordMin={task.wordMin}
                wordMax={task.wordMax}
              />
              {submitError && (
                <p
                  role="alert"
                  className="rounded-2xl bg-red-50 p-4 text-center text-sm leading-6 text-red-800 ring-1 ring-red-200"
                >
                  {submitError}
                </p>
              )}
              <div className="flex flex-col items-center gap-3">
                <WritingSubmitButton
                  submitting={submitting}
                  onSubmit={() => void handleSubmit()}
                />
                <p className="text-xs leading-5 text-ink/50">
                  {writingPracticeCopy.targetGuidanceNote}
                </p>
              </div>
            </>
          )}
        </div>
      </article>
    </div>
  );
}
