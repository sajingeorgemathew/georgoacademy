"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/features/design/design-tokens";
import { examAudio } from "@/features/exam-engine/exam-theme";
import { listeningCopy } from "@/features/exam-engine/listening-copy";
import { resolveExamMediaSrc } from "@/features/exam-engine/instructional-video-assets";

// Native audio player for the Listening screens (EXAM-03).
//
// Native on purpose, for the same reasons as ExamVideoPlayer: the browser
// control set is keyboard reachable and screen reader aware, and it costs
// no dependency. No player library was installed for the exam engine, and
// none should be.
//
// Behaviour:
//
// - controls always on, so a learner can always start, pause and scrub
// - autoplay off by default. The full Listening route asks for it and the
//   internal part routes do not, so nothing on a development route starts
//   playing at a person unasked
// - preload metadata by default, so the control bar shows a real duration
//   without pulling the whole clip down
// - fallback text in two layers: the message below replaces the control
//   bar when the clip fails to load, and the text inside the audio
//   element covers a browser that cannot play audio at all
//
// Autoplay is an attempt and never a promise (EXAM-15F). Browser autoplay
// policies refuse a clip with sound unless the page has earned enough of a
// user gesture, and what counts differs between browsers and can be turned
// off by the person using one. So the effect calls play(), and if the
// promise it returns rejects, a short line appears under the controls
// telling the learner to press play. Nothing is muted to get around the
// policy: a muted Listening clip is worse than one that waits for a click.
//
// The play attempt is in an effect because it belongs to the clip
// appearing, not to any handler, and the screen is only ever reached by
// pressing Next, which is the gesture the policy is looking for. The
// blocked flag is set from the rejection rather than in the effect body,
// so no state is written during the effect itself.
//
// Deliberately not built yet: one time playback, and gating Next on the
// clip finishing. Both are official-style behaviours and both are listed
// as known gaps in docs/product/listening-part-1-prototype.md. onEnded is
// here so the ticket that adds the gate has somewhere to hook into
// without reworking the player.
//
// The error flag is set from the media error handler, never from an
// effect. This mirrors ExamVideoPlayer, which is the only other stateful
// component in the exam engine.

export type ListeningAudioPlayerProps = {
  // Absolute URL, normally a Cloudinary link. Local paths work too and
  // are made URL safe by resolveExamMediaSrc.
  src: string;
  // Learner facing clip name, used for the accessible label and, unless
  // captionText overrides it, the caption strip.
  title: string;
  // Running time as text, shown on the right of the caption strip.
  durationLabel?: string;
  captionText?: string;
  showCaption?: boolean;
  // metadata is the default. Drop to none on a screen holding several
  // players, so one screen does not open several media connections.
  preload?: "none" | "metadata";
  // Ask the browser to start the clip when the player appears. It can
  // refuse, in which case the notice under the controls says so.
  autoPlay?: boolean;
  onEnded?: () => void;
  fallbackText?: string;
  className?: string;
};

export function ListeningAudioPlayer({
  src,
  title,
  durationLabel,
  captionText,
  showCaption = true,
  preload = "metadata",
  autoPlay = false,
  onEnded,
  fallbackText,
  className,
}: ListeningAudioPlayerProps) {
  const [hasError, setHasError] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!autoPlay) {
      return;
    }

    const element = audioRef.current;

    if (!element) {
      return;
    }

    // play() resolves when the browser agreed to start and rejects when it
    // refused. Older browsers return undefined instead of a promise, which
    // is the case the optional call covers.
    void element.play()?.catch(() => {
      setAutoplayBlocked(true);
    });
  }, [autoPlay, src]);

  const caption = captionText ?? title;

  return (
    <div className={cx(examAudio.wrap, className)}>
      {hasError ? (
        <div className={examAudio.fallback} role="status">
          <p className={examAudio.fallbackTitle}>
            {listeningCopy.audioFallbackHeading}
          </p>
          <p className={examAudio.fallbackText}>
            {fallbackText ?? listeningCopy.audioFallbackText}
          </p>
        </div>
      ) : (
        <div className={examAudio.stage}>
          {/* src sits on the element rather than on a source child, so a
              failed load fires onError here and the fallback can show.
              A source child only fires on itself. */}
          <audio
            ref={audioRef}
            className={examAudio.element}
            src={resolveExamMediaSrc(src)}
            controls
            preload={preload}
            aria-label={`${listeningCopy.audioPlayerLabel}: ${title}`}
            onError={() => setHasError(true)}
            onEnded={onEnded}
          >
            {listeningCopy.audioUnsupportedText}
          </audio>
        </div>
      )}

      {showCaption ? (
        <div className={examAudio.caption}>
          <p className={examAudio.captionTitle}>{caption}</p>
          {durationLabel ? (
            <p className={examAudio.captionMeta}>{durationLabel}</p>
          ) : null}
        </div>
      ) : null}

      {autoplayBlocked && !hasError ? (
        <p className={examAudio.autoplayNotice} role="status">
          {listeningCopy.audioAutoplayBlockedText}
        </p>
      ) : null}
    </div>
  );
}
