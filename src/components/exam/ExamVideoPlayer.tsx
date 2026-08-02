"use client";

import { useState } from "react";
import { cx } from "@/features/design/design-tokens";
import { examVideo } from "@/features/exam-engine/exam-theme";
import { examCopy } from "@/features/exam-engine/exam-copy";
import { resolveExamMediaSrc } from "@/features/exam-engine/instructional-video-assets";

// Native video player for the instructional video screens (EXAM-02).
//
// Native on purpose. The browser control set is keyboard reachable and
// screen reader aware, and it costs no dependency. No player library was
// installed for the exam engine, and none should be.
//
// Behaviour:
//
// - controls on, autoplay off, so nothing plays until the learner asks
// - preload metadata by default, so the control bar shows a real duration
//   without pulling the whole clip down
// - responsive: a fixed aspect stage with the element filling it, so the
//   box keeps its shape at any width and never forces a sideways scroll
// - fallback text in two layers: the message below replaces the stage
//   when the clip fails to load, and the text inside the video element
//   covers a browser that cannot play video at all
//
// This is the only exam component that holds state, which is why it is
// the only one marked "use client". The error flag is set from the media
// error handler, never from an effect.
//
// onEnded is here for the flow tickets, which gate the shell Next control
// until a blocking clip finishes. Passing it from a server component is
// not possible, so a screen that needs it must be a client component.

export type ExamVideoPlayerProps = {
  // Raw public path or absolute URL. Encoded for the browser here, so a
  // file name containing spaces still loads.
  src: string;
  // Learner facing clip name. Used for the accessible label and, unless
  // captionText overrides it, the caption strip.
  title: string;
  poster?: string;
  // Running time as text, shown on the right of the caption strip.
  durationLabel?: string;
  // Overrides the caption strip text.
  captionText?: string;
  showCaption?: boolean;
  // metadata is the default. Drop to none on a page holding several
  // players, so one screen does not open several media connections.
  preload?: "none" | "metadata";
  onEnded?: () => void;
  // Overrides the message shown when the clip cannot load.
  fallbackText?: string;
  className?: string;
};

export function ExamVideoPlayer({
  src,
  title,
  poster,
  durationLabel,
  captionText,
  showCaption = true,
  preload = "metadata",
  onEnded,
  fallbackText,
  className,
}: ExamVideoPlayerProps) {
  const [hasError, setHasError] = useState(false);

  const caption = captionText ?? title;

  return (
    <div className={cx(examVideo.wrap, className)}>
      {hasError ? (
        <div className={examVideo.fallback} role="status">
          <p className={examVideo.fallbackTitle}>
            {examCopy.videoFallbackHeading}
          </p>
          <p className={examVideo.fallbackText}>
            {fallbackText ?? examCopy.videoFallbackText}
          </p>
        </div>
      ) : (
        <div className={examVideo.stage}>
          {/* src sits on the element rather than on a source child, so a
              failed load fires onError here and the fallback can show.
              A source child only fires on itself. */}
          <video
            className={examVideo.element}
            src={resolveExamMediaSrc(src)}
            poster={poster ? resolveExamMediaSrc(poster) : undefined}
            controls
            preload={preload}
            playsInline
            aria-label={`${examCopy.videoPlayerLabel}: ${title}`}
            onError={() => setHasError(true)}
            onEnded={onEnded}
          >
            {examCopy.videoUnsupportedText}
          </video>
        </div>
      )}

      {showCaption ? (
        <div className={examVideo.caption}>
          <p className={examVideo.captionTitle}>{caption}</p>
          {durationLabel ? (
            <p className={examVideo.captionMeta}>{durationLabel}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
