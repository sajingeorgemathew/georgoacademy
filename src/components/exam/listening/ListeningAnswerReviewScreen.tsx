import { ExamInstructionRow } from "../ExamInstructionRow";
import { ExamPanel } from "../ExamPanel";
import { ExamShell } from "../ExamShell";
import { ListeningAnswerReviewTable } from "./ListeningAnswerReviewTable";
import { examReview, examScreenBody } from "@/features/exam-engine/exam-theme";
import { listeningReviewCopy } from "@/features/exam-engine/listening-review-copy";
import type { ListeningReviewCopy } from "@/features/exam-engine/listening-review-copy";
import type { ListeningReviewRow } from "@/features/exam-engine/listening-review-types";

// Answer review screen for a Listening part (EXAM-04).
//
// The first screen after the last question. It lists every question in
// the part with the option the learner chose, the correct option when one
// is known, and a status word, then sends them on to the score screen
// with Next.
//
// Back goes to the last question rather than out of the part. That is
// prototype behaviour, kept for the same reason Back is enabled on every
// EXAM-03 screen: the sequence has to be walkable during review.
//
// The answer and explanation sheet is optional and collapsed. It is the
// source the transcribed key was read off, so a learner can check the
// correct answer column against it, but it is behind a disclosure so
// opening the review does not put the sheet on screen unasked. The image
// is referenced from Cloudinary and never downloaded, and it is a plain
// img rather than next/image for the reason recorded in
// ListeningScenarioScreen.
//
// No state of its own. The rows arrive already built, from wherever the
// answer key happens to live: Part 1 builds them in the browser, Part 2
// builds them on the server and sends the finished rows down.

export type ListeningAnswerReviewScreenProps = {
  // Exam frame title, normally the part title from the content object.
  title: string;
  rows: ListeningReviewRow[];
  // Answer and explanation sheet, when the source publishes one.
  explanationImageUrl?: string;
  explanationImageAlt?: string;
  // Wording for the part. Defaults to Listening Part 1.
  copy?: ListeningReviewCopy;
  metaText?: string;
  onNext?: () => void;
  onBack?: () => void;
  showBack?: boolean;
};

export function ListeningAnswerReviewScreen({
  title,
  rows,
  explanationImageUrl,
  explanationImageAlt,
  copy = listeningReviewCopy,
  metaText,
  onNext,
  onBack,
  showBack = true,
}: ListeningAnswerReviewScreenProps) {
  return (
    <ExamShell
      title={title}
      metaText={metaText}
      nextLabel={copy.viewScoreLabel}
      onNext={onNext}
      onBack={onBack}
      showBack={showBack}
      backLabel={copy.backToQuestionsLabel}
    >
      <div className={examScreenBody.stack}>
        <ExamInstructionRow
          heading={copy.reviewTitle}
          text={copy.reviewSubtitle}
        />

        <ListeningAnswerReviewTable rows={rows} copy={copy} />

        {explanationImageUrl ? (
          <ExamPanel title={copy.explanationPanelTitle} tone="muted">
            <div className={examReview.referenceStack}>
              <p>{copy.explanationPanelIntro}</p>

              <details>
                <summary className={examReview.referenceToggle}>
                  {copy.explanationToggleLabel}
                </summary>

                <figure className={examReview.referenceFigure}>
                  {/* eslint-disable-next-line @next/next/no-img-element --
                      remote Cloudinary asset, referenced and never
                      downloaded. See ListeningScenarioScreen. */}
                  <img
                    src={explanationImageUrl}
                    alt={explanationImageAlt ?? copy.explanationImageCaption}
                    className={examReview.referenceImage}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className={examReview.referenceCaption}>
                    {copy.explanationImageCaption}
                  </figcaption>
                </figure>
              </details>
            </div>
          </ExamPanel>
        ) : null}

        <p className={examScreenBody.notice}>{copy.reviewNotice}</p>
      </div>
    </ExamShell>
  );
}
