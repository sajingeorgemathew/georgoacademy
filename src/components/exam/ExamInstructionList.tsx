import { cx } from "@/features/design/design-tokens";
import { examInstruction, examText } from "@/features/exam-engine/exam-theme";
import type { ExamInstruction } from "@/features/exam-engine/instruction-screen-types";

// Bulleted instruction list for an instruction screen (EXAM-02).
//
// One idea per line with a faint rule between lines, which is how part
// instructions read in a test engine. The list is the body of screen type
// 1 in docs/product/exam-engine-screen-types.md.
//
// An item is a plain string for the common case, or an object with a
// heading when a line needs a bold lead in. The circled information glyph
// belongs to ExamInstructionRow above the list, not to every bullet.

export type ExamInstructionListProps = {
  items: ExamInstruction[];
  className?: string;
};

export function ExamInstructionList({
  items,
  className,
}: ExamInstructionListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul className={cx(examText.bulletList, className)}>
      {items.map((item) => {
        const heading = typeof item === "string" ? undefined : item.heading;
        const body = typeof item === "string" ? item : item.text;

        return (
          <li key={body} className={examText.bulletItem}>
            {heading ? (
              <span className={cx(examInstruction.heading, "mr-1")}>
                {heading}
              </span>
            ) : null}
            <span className="min-w-0">{body}</span>
          </li>
        );
      })}
    </ul>
  );
}
