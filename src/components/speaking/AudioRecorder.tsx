"use client";

import { useEffect, useRef, useState } from "react";
import {
  getBaseMimeType,
  getElapsedSeconds,
  isRecordingSupported,
  pickRecordingMimeType,
  type RecordingState,
} from "@/features/speaking/audio-utils";
import { recordingCopy } from "@/features/speaking/practice-flow";
import { RecordingStatusCard } from "./RecordingStatusCard";

const startButtonClasses =
  "inline-flex h-12 w-full items-center justify-center rounded-full bg-brand px-8 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-colors hover:bg-brand-dark sm:w-auto";

const stopButtonClasses =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-8 text-sm font-semibold text-white transition-colors hover:bg-ink/90 sm:w-auto";

// Owns the MediaRecorder lifecycle for the speaking phase. The parent
// shell owns the recording state so it can drive the review and upload
// steps after this component unmounts.
export function AudioRecorder({
  canRecord,
  recordingState,
  errorMessage,
  onStateChange,
  onError,
  onRecorded,
}: {
  canRecord: boolean;
  recordingState: RecordingState;
  errorMessage: string | null;
  onStateChange: (state: RecordingState) => void;
  onError: (message: string) => void;
  onRecorded: (blob: Blob, mimeType: string, durationSeconds: number) => void;
}) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const canRecordRef = useRef(canRecord);
  const mountedRef = useRef(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    canRecordRef.current = canRecord;
  }, [canRecord]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Elapsed time display while recording. The counter is reset in the
  // start handler, so this effect only runs the interval.
  useEffect(() => {
    if (recordingState !== "recording") {
      return;
    }
    const id = window.setInterval(() => {
      setElapsedSeconds(getElapsedSeconds(startedAtRef.current, Date.now()));
    }, 250);
    return () => window.clearInterval(id);
  }, [recordingState]);

  // Stops the recorder when speaking time ends while still recording.
  useEffect(() => {
    if (canRecord || recordingState !== "recording") {
      return;
    }
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  }, [canRecord, recordingState]);

  // Unmount safety: stop the recorder and release the microphone. The
  // onstop handler still delivers the final blob to the parent shell.
  useEffect(() => {
    return () => {
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      } else {
        streamRef.current?.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const handleStop = () => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  };

  const handleStart = async () => {
    if (!isRecordingSupported()) {
      onError(recordingCopy.errors.notSupported);
      return;
    }

    onStateChange("requesting_permission");

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (cause) {
      const denied =
        cause instanceof DOMException &&
        (cause.name === "NotAllowedError" || cause.name === "SecurityError");
      onError(
        denied
          ? recordingCopy.errors.permissionDenied
          : recordingCopy.errors.recordingFailed,
      );
      return;
    }

    // Speaking time may have ended, or this recorder may have been
    // unmounted, while the permission prompt was open. Release the
    // microphone instead of starting an unmanaged recording.
    if (!mountedRef.current || !canRecordRef.current) {
      stream.getTracks().forEach((track) => track.stop());
      onStateChange("idle");
      return;
    }

    try {
      const preferredType = pickRecordingMimeType();
      const recorder = preferredType
        ? new MediaRecorder(stream, { mimeType: preferredType })
        : new MediaRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        stopStream();
        onError(recordingCopy.errors.recordingFailed);
      };

      recorder.onstop = () => {
        stopStream();
        const mimeType = getBaseMimeType(
          recorder.mimeType || preferredType || "audio/webm",
        );
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];
        if (blob.size === 0) {
          onError(recordingCopy.errors.recordingFailed);
          return;
        }
        const durationSeconds = Math.max(
          1,
          Math.round((Date.now() - startedAtRef.current) / 1000),
        );
        onRecorded(blob, mimeType, durationSeconds);
      };

      recorderRef.current = recorder;
      streamRef.current = stream;
      startedAtRef.current = Date.now();
      setElapsedSeconds(0);
      recorder.start();
      onStateChange("recording");
    } catch {
      stream.getTracks().forEach((track) => track.stop());
      onError(recordingCopy.errors.recordingFailed);
    }
  };

  const showStart =
    canRecord && (recordingState === "idle" || recordingState === "error");
  const showStop = canRecord && recordingState === "recording";

  return (
    <section aria-label={recordingCopy.sectionLabel} className="space-y-3">
      <RecordingStatusCard
        state={recordingState}
        errorMessage={errorMessage}
        elapsedSeconds={elapsedSeconds}
        finishing={!canRecord}
      />
      {showStart && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleStart}
            className={startButtonClasses}
          >
            {recordingState === "error"
              ? recordingCopy.tryRecordingAgain
              : recordingCopy.startRecording}
          </button>
        </div>
      )}
      {showStop && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleStop}
            className={stopButtonClasses}
          >
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-sm bg-red-400"
            />
            {recordingCopy.stopRecording}
          </button>
        </div>
      )}
    </section>
  );
}
