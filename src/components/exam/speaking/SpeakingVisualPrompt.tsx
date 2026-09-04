import {
  MockTestMediaFrame,
  mockTestMediaImageClass,
} from "../player/MockTestMediaFrame";
import { examSpeaking } from "@/features/exam-engine/exam-theme";
import { speakingMockCopy } from "@/features/exam-engine/speaking-mock-copy";
import type { SpeakingMockCopy } from "@/features/exam-engine/speaking-mock-copy";
import type {
  SpeakingOptionCard,
  SpeakingPromptImage,
  SpeakingVisualPrompt as SpeakingVisualPromptContent,
} from "@/features/exam-engine/speaking-mock-types";

// The pictures on a Speaking task screen (EXAM-27).
//
// Two shapes, from one discriminated union:
//
// - "scene" is one picture the learner is asked to speak about, which is
//   Tasks 3, 4 and 8
// - "option-cards" is a row of labelled cards, each a picture and a short
//   list of facts, which is Task 5 and only Task 5
//
// A task with no visuals renders nothing at all, which is Tasks 1, 2, 6
// and 7. Nothing is special cased for that: an empty list is an empty
// list.
//
// The picture is content, not decoration. On Task 3 the learner is asked
// to describe what is in it, on Task 4 to predict what happens next in
// it, and on Task 8 to describe it in detail, so there is no text form of
// it anywhere and the alt text is written from the picture itself. It is
// never hidden at a small width and it is never deferred: these screens
// are unusable until the picture is on them.
//
// Each picture is a plain img rather than next/image, for the reason
// ReadingPartTwoInformationScreen and ListeningScenarioScreen both
// record: the file is a remote Cloudinary asset, so next/image would need
// an images.remotePatterns entry in next.config.ts and would route
// licensed practice test artwork through the Next image optimizer. A
// plain element keeps both out of scope.
//
// Two things keep a picture behaving inside the exam canvas. Its
// intrinsic width and height go on the element, so the browser reserves
// the right box from the ratio and the column does not jump when the file
// arrives. And the class recipe sets the width and leaves the height
// automatic, so the drawing fills its column and keeps its shape.
//
// Presentational only. It holds no state and reads no content object of
// its own.
//
// House style: normal hyphens only, no long hyphens or em dashes.

export type SpeakingVisualPromptProps = {
  visual: SpeakingVisualPromptContent;
  copy?: SpeakingMockCopy;
};

// One picture, with its caption where it has one.
function SpeakingPromptFigure({
  image,
  caption,
}: {
  image: SpeakingPromptImage;
  caption?: string;
}) {
  const captionText = caption ?? image.caption;

  // The shared player media frame (EXAM-UI-02) caps the picture against
  // the viewport height and letterboxes rather than cropping, so a tall
  // drawing cannot push the recorder, the two clocks or the Next control
  // out of reach on a laptop. The prompt column scrolls instead.
  return (
    // The 34rem cap is kept from the recipe this replaced. It is the width
    // of the largest picture in the section as the source delivers it, so
    // the two cafe scenes draw at their own size and the smaller Task 8
    // drawing is scaled up by about half rather than by more than twice.
    <MockTestMediaFrame caption={captionText} className="max-w-[34rem]">
      {/* eslint-disable-next-line @next/next/no-img-element --
          remote Cloudinary asset, see the note at the top of this
          file. */}
      <img
        src={image.url}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className={mockTestMediaImageClass}
        // Not deferred. The picture is the prompt on Tasks 3, 4 and 8, so
        // the screen is unusable until it is on the page.
        decoding="async"
      />
    </MockTestMediaFrame>
  );
}

// One option card: its heading, its picture where it has one, and the
// facts under it.
function SpeakingOptionCardBlock({ card }: { card: SpeakingOptionCard }) {
  return (
    <div className={examSpeaking.card}>
      {card.label ? (
        <p className={examSpeaking.cardLabel}>{card.label}</p>
      ) : null}

      {card.image ? <SpeakingPromptFigure image={card.image} /> : null}

      <p className={examSpeaking.cardHeading}>{card.heading}</p>

      {card.details.length > 0 ? (
        <ul className={examSpeaking.cardDetailList}>
          {card.details.map((detail) => (
            // The detail text is the key. Each line is a distinct fact
            // from the source card and they never reorder.
            <li key={detail} className={examSpeaking.cardDetailItem}>
              {detail}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function SpeakingVisualPrompt({
  visual,
  copy = speakingMockCopy,
}: SpeakingVisualPromptProps) {
  if (visual.kind === "scene") {
    return (
      <div className={examSpeaking.prompt}>
        <p className={examSpeaking.promptLabel}>{copy.visualHeading}</p>

        <SpeakingPromptFigure image={visual.image} caption={visual.caption} />
      </div>
    );
  }

  return (
    <div className={examSpeaking.prompt}>
      <p className={examSpeaking.promptLabel}>
        {visual.caption ?? copy.optionCardsHeading}
      </p>

      <div className={examSpeaking.cardGrid}>
        {visual.cards.map((card) => (
          <SpeakingOptionCardBlock key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
