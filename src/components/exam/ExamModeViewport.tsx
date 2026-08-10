"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { examViewport } from "@/features/exam-engine/exam-theme";

// Locked exam mode viewport (EXAM-15B).
//
// A test screen is not a web page. It does not scroll, it has no
// breadcrumbs above it, and nothing belonging to the surrounding
// application is visible while it is open. The exam routes live under
// /dashboard so the layout auth guard covers them, which means the
// dashboard layout wraps them in a sidebar, a sticky header, a breadcrumb
// trail and a footer.
//
// Rather than teach the dashboard layout about exam routes, which would
// put test engine rules into the shell every other signed in screen
// shares, the route covers the dashboard with a fixed overlay one viewport
// tall and puts the exam frame inside it. The dashboard is still mounted
// underneath and is still the thing the learner returns to, it is simply
// not on screen while the test is.
//
// Two things make the screen feel locked:
//
// - the overlay is fixed and one viewport tall, so the frame inside it can
//   fill the height exactly and its top and bottom bars stay where they
//   are while a long screen scrolls between them
// - document scrolling is switched off while this is mounted, so a
//   trackpad flick or a space bar press cannot drag the exam up the screen
//   or reveal the dashboard page behind it
//
// The scroll lock is written on the elements themselves rather than
// through a class, and the previous inline values are put back on unmount,
// so leaving the exam by any route, the end of section link, the browser
// back button or a client navigation, returns the document to whatever it
// had before. Nothing else on the page is touched.
//
// This component owns the viewport and nothing else. It has no opinion
// about which test is inside it, so Reading, Writing and Speaking can use
// it unchanged when their flows arrive.

export type ExamModeViewportProps = {
  // The exam frame to show. Normally one section flow component, which
  // renders its own ExamShell per screen.
  children: ReactNode;
  // Names the exam region for assistive technology, for example
  // "Mock Test 1 - Listening Test".
  label: string;
};

export function ExamModeViewport({ children, label }: ExamModeViewportProps) {
  useEffect(() => {
    const root = document.documentElement;
    const { body } = document;

    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

  return (
    <div className={examViewport.overlay} role="region" aria-label={label}>
      <div className={examViewport.inner}>{children}</div>
    </div>
  );
}
