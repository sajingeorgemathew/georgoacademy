"use client";

import { useState } from "react";
import Link from "next/link";
import {
  practiceCopy,
  recordingCopy,
  transcriptCopy,
} from "@/features/speaking/practice-flow";
import { requestTranscript } from "@/features/speaking/transcription-client";
import { GenerateTranscriptButton } from "./GenerateTranscriptButton";
import { TranscriptCard } from "./TranscriptCard";

type TranscriptionState = "idle" | "working" | "success" | "error";

// Success state after the recording has uploaded. From here the student
// generates a transcript of their answer, then follows clear paths back
// to the task detail page or the speaking task library.
export function RecordingSuccessCard({
  taskId,
  attemptId,
}: {
  taskId: string;
  attemptId: string;
}) {
  const [state, setState] = useState<TranscriptionState>("idle");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (state === "working") {
      return;
    }
    setState("working");
    setErrorMessage(null);

    const result = await requestTranscript(attemptId);

    if (result.ok) {
      setTranscript(result.transcript);
      setState("success");
    } else {
      setErrorMessage(result.message);
      setState("error");
    }
  };

  const showTranscript = state === "success" && transcript !== null;

  return (
    <section
      aria-label={recordingCopy.successHeading}
      className="rounded-3xl bg-white p-6 text-center ring-1 ring-ink/5 sm:p-8"
    >
      <span
        aria-hidden
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-xl text-brand"
      >
        &#10003;
      </span>
      <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-ink">
        {recordingCopy.successHeading}
      </h2>

      {showTranscript ? (
        <div className="mt-5">
          <TranscriptCard transcript={transcript} />
        </div>
      ) : (
        <div className="mt-3 space-y-5">
          <p className="mx-auto max-w-md text-sm leading-6 text-ink/70">
            {recordingCopy.successText}
          </p>
          {errorMessage && (
            <p
              role="alert"
              className="mx-auto max-w-md rounded-2xl bg-red-50 p-4 text-sm leading-6 text-red-800 ring-1 ring-red-200"
            >
              {errorMessage}
            </p>
          )}
          <div className="flex justify-center">
            <GenerateTranscriptButton
              working={state === "working"}
              retry={state === "error"}
              onGenerate={handleGenerate}
            />
          </div>
          {state === "working" && (
            <p
              role="status"
              className="mx-auto max-w-md text-sm leading-6 text-ink/60"
            >
              {transcriptCopy.generatingNote}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href={`/dashboard/speaking/tasks/${taskId}`}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-brand ring-1 ring-brand/30 transition-colors hover:bg-brand/5 sm:w-auto"
        >
          {practiceCopy.backToTask}
        </Link>
        <Link
          href="/dashboard/speaking"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-brand ring-1 ring-brand/30 transition-colors hover:bg-brand/5 sm:w-auto"
        >
          {practiceCopy.practiceAnotherTask}
        </Link>
      </div>
    </section>
  );
}
