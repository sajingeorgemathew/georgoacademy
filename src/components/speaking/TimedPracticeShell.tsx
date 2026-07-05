"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  practiceCopy,
  type PracticePhase,
  type PracticeTask,
} from "@/features/speaking/practice-flow";
import {
  getDeadline,
  getRemainingSeconds,
} from "@/features/speaking/timer-utils";
import { PracticeCompletionCard } from "./PracticeCompletionCard";
import { PracticeControls } from "./PracticeControls";
import { PracticePhaseCard } from "./PracticePhaseCard";
import { PracticePromptCard } from "./PracticePromptCard";
import { PracticeTimer } from "./PracticeTimer";

// Client shell for the timed practice flow. Owns the phase state and
// the countdown, and receives only safe task data from the server page.
export function TimedPracticeShell({ task }: { task: PracticeTask }) {
  const [phase, setPhase] = useState<PracticePhase>("intro");
  const [remaining, setRemaining] = useState(task.prepSeconds);

  // Starting a timed phase resets the countdown in the same click, so
  // the effect below only has to run the interval.
  const startPreparation = () => {
    setRemaining(task.prepSeconds);
    setPhase("preparation");
  };

  const startSpeaking = () => {
    setRemaining(task.speakingSeconds);
    setPhase("speaking");
  };

  const finishPractice = () => {
    setPhase("complete");
  };

  // Runs the countdown for the two timed phases. The deadline is an
  // absolute timestamp so the timer stays accurate even when interval
  // ticks are delayed, for example on a backgrounded mobile browser.
  useEffect(() => {
    if (phase !== "preparation" && phase !== "speaking") {
      return;
    }

    const total =
      phase === "preparation" ? task.prepSeconds : task.speakingSeconds;
    const deadline = getDeadline(Date.now(), total);

    const id = window.setInterval(() => {
      const left = getRemainingSeconds(deadline, Date.now());
      setRemaining(left);
      if (left <= 0) {
        window.clearInterval(id);
        setPhase(phase === "preparation" ? "ready_to_speak" : "complete");
      }
    }, 250);

    return () => window.clearInterval(id);
  }, [phase, task.prepSeconds, task.speakingSeconds]);

  // Timer display for phases without a running countdown: intro shows
  // the full preparation time, ready_to_speak the full speaking time.
  const timerIsRunning = phase === "preparation" || phase === "speaking";
  const showsSpeakingTime = phase === "ready_to_speak" || phase === "speaking";
  const timerLabel = showsSpeakingTime
    ? practiceCopy.speakingTimerLabel
    : practiceCopy.prepTimerLabel;
  const timerTotal = showsSpeakingTime
    ? task.speakingSeconds
    : task.prepSeconds;
  const timerSeconds = timerIsRunning ? remaining : timerTotal;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <nav
        aria-label="Practice navigation"
        className="flex flex-wrap items-center gap-x-5 gap-y-2"
      >
        <Link
          href={`/dashboard/speaking/tasks/${task.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
        >
          <span aria-hidden>&larr;</span>
          {practiceCopy.backToTask}
        </Link>
        <Link
          href="/dashboard/speaking"
          className="text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
        >
          {practiceCopy.backToTasks}
        </Link>
      </nav>

      <article className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink/5 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
          {practiceCopy.screenBadge} - Task {task.taskNumber}
        </p>
        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {task.title}
        </h1>

        <div className="mt-6 space-y-5">
          <PracticePhaseCard phase={phase} />

          {phase === "complete" ? (
            <PracticeCompletionCard taskId={task.id} />
          ) : (
            <>
              <PracticeTimer
                label={timerLabel}
                seconds={timerSeconds}
                totalSeconds={timerTotal}
                running={timerIsRunning}
              />
              <PracticePromptCard prompt={task.prompt} />
              <PracticeControls
                phase={phase}
                onStartPreparation={startPreparation}
                onStartSpeaking={startSpeaking}
                onFinishPractice={finishPractice}
              />
            </>
          )}
        </div>
      </article>
    </div>
  );
}
