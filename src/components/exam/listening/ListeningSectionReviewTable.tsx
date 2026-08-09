import { ListeningAnswerReviewTable } from "./ListeningAnswerReviewTable";
import { examSectionReview } from "@/features/exam-engine/exam-theme";
import { buildListeningReviewCopy } from "@/features/exam-engine/listening-review-copy";
import { formatListeningSectionAnswered } from "@/features/exam-engine/listening-section-copy";
import type { ListeningSectionPartResult } from "@/features/exam-engine/listening-section-types";

// Answer review, grouped by part, for the full Listening section
// (EXAM-15).
//
// Six groups in one scroll. Each group is a heading naming the part and
// the EXAM-04 review table under it, so a row here is the same row the
// part level review screen prints: question number, the option the learner
// chose, the correct option, and a status word.
//
// The table itself is reused rather than rewritten. Its caption is the one
// part specific string it carries, and the caption is read out loud by a
// screen reader, so each group builds the Part N wording with the same
// helper the part routes use. Nothing else about the table changes, which
// is why a dropdown part's printed statement and a Parts 1 to 3 row with
// no statement both render here exactly as they do in their own routes.
//
// The heading carries the answered count for the part rather than a
// correct count. The score comes one screen later, and putting a part
// result here would be the part level score this ticket exists to remove.
//
// Presentational only. It receives results already marked on the server
// and looks nothing up itself.

export type ListeningSectionReviewTableProps = {
  parts: ListeningSectionPartResult[];
};

export function ListeningSectionReviewTable({
  parts,
}: ListeningSectionReviewTableProps) {
  return (
    <div className={examSectionReview.groupStack}>
      {parts.map((part) => (
        <section key={part.partNumber} className={examSectionReview.group}>
          <div className={examSectionReview.groupHeading}>
            <h3 className={examSectionReview.groupLabel}>{part.partLabel}</h3>
            <p className={examSectionReview.groupTitle}>{part.partTitle}</p>
            <p className={examSectionReview.groupMeta}>
              {formatListeningSectionAnswered(
                part.summary.answeredCount,
                part.summary.totalQuestions,
              )}
            </p>
          </div>

          <ListeningAnswerReviewTable
            rows={part.rows}
            // Only the caption differs per part, and it names the part out
            // loud to a screen reader, so it has to say the right one.
            copy={buildListeningReviewCopy({ partLabel: part.partLabel })}
          />
        </section>
      ))}
    </div>
  );
}
