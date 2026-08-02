import { ExamInstructionRow } from "../ExamInstructionRow";
import { ExamPanel } from "../ExamPanel";
import { ExamShell } from "../ExamShell";
import { ListeningAnswerReviewTable } from "./ListeningAnswerReviewTable";
import { examReview, examScreenBody } from "@/features/exam-engine/exam-theme";
import { listeningReviewCopy } from "@/features/exam-engine/listening-review-copy";
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
// The answer and explanation sheet is optional and collapsed. For Mock
// Test 1 the Listening answer key exists only as that image, so a learner
// can check by hand while the key is untranscribed, but it is behind a
// disclosure so opening the review does not put the answers on screen
// unasked. The image is referenced from Cloudinary and never downloaded,
// and it is a plain img rather than next/image for the reason recorded in
// ListeningScenarioScreen.
//
// No state of its own. The rows arrive already built.

export type ListeningAnswerReviewScreenProps = {
  // Exam frame title, normally the part title from the content object.
  title: string;
  rows: ListeningReviewRow[];
  // Answer and explanation sheet, when the source publishes one.
  explanationImageUrl?: string;
  explanationImageAlt?: string;
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
  metaText,
  onNext,
  onBack,
  showBack = true,
}: ListeningAnswerReviewScreenProps) {
  return (
    <ExamShell
      title={title}
      metaText={metaText}
      nextLabel={listeningReviewCopy.viewScoreLabel}
      onNext={onNext}
      onBack={onBack}
      showBack={showBack}
      backLabel={listeningReviewCopy.backToQuestionsLabel}
    >
      <div className={examScreenBody.stack}>
        <ExamInstructionRow
          heading={listeningReviewCopy.reviewTitle}
          text={listeningReviewCopy.reviewSubtitle}
        />

        <ListeningAnswerReviewTable rows={rows} />

        {explanationImageUrl ? (
          <ExamPanel
            title={listeningReviewCopy.explanationPanelTitle}
            tone="muted"
          >
            <div className={examReview.referenceStack}>
              <p>{listeningReviewCopy.explanationPanelIntro}</p>

              <details>
                <summary className={examReview.referenceToggle}>
                  {listeningReviewCopy.explanationToggleLabel}
                </summary>

                <figure className={examReview.referenceFigure}>
                  {/* eslint-disable-next-line @next/next/no-img-element --
                      remote Cloudinary asset, referenced and never
                      downloaded. See ListeningScenarioScreen. */}
                  <img
                    src={explanationImageUrl}
                    alt={
                      explanationImageAlt ??
                      listeningReviewCopy.explanationImageCaption
                    }
                    className={examReview.referenceImage}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className={examReview.referenceCaption}>
                    {listeningReviewCopy.explanationImageCaption}
                  </figcaption>
                </figure>
              </details>
            </div>
          </ExamPanel>
        ) : null}

        <p className={examScreenBody.notice}>
          {listeningReviewCopy.reviewNotice}
        </p>
      </div>
    </ExamShell>
  );
}
