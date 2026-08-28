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
// EXAM-15B answered that by covering the dashboard with a fixed overlay
// one viewport tall rather than teaching the shared shell about exam
// routes. That is no longer how it works, see below.
//
// **The overlay is no longer how the chrome is removed** (EXAM-15F, second
// QA pass). A browser test found the flaw in covering it: the sidebar, the
// account pill and the breadcrumb trail were still mounted, still
// focusable and still read by a screen reader, and an overlay only stays
// an overlay for as long as nothing up the tree creates a containing block
// for a fixed element, at which point the test quietly becomes a box
// inside the dashboard content column. So the dashboard shell now checks
// the route and does not render its chrome on an exam route at all. See
// src/features/navigation/exam-mode-routes.ts and AppShellFrame.
//
// What this component owns after that change is the viewport, which is
// still worth owning:
//
// - it is fixed and one window tall, so the frame inside it fills the
//   height exactly and its top and bottom bars stay where they are while a
//   long screen scrolls between them
// - it is full bleed, so the exam reaches all four edges of the window
//   rather than floating in a gutter as a card
// - document scrolling is switched off while this is mounted, so a
//   trackpad flick or a space bar press cannot drag the exam up the screen,
//   and scroll chaining is refused as well so a flick past the end of the
//   canvas cannot bounce the document either
// - it carries data-exam-viewport, which is what tells the shared exam
//   frame to drop its width cap and its card border inside it
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
    const previousRootOverscroll = root.style.overscrollBehavior;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    // overflow hidden stops the document scrolling, and this stops the
    // bounce (EXAM-15C). A trackpad flick or a touch drag that runs past
    // the end of the exam canvas can still rubber band the document on
    // macOS and on mobile Safari, which flashes a strip of the dashboard
    // behind the exam. Refusing the chain here means the only thing that
    // moves on screen is the canvas, and only while it has somewhere to go.
    root.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
      root.style.overscrollBehavior = previousRootOverscroll;
      body.style.overscrollBehavior = previousBodyOverscroll;
    };
  }, []);

  return (
    <div
      // The hook the exam mode rules in globals.css hang off. Inside this
      // element the exam frame drops its width cap, its border and its
      // rounded corners, so the test fills the window instead of drawing
      // itself as a card. Everywhere else the same frame keeps all three,
      // which is what the internal part routes want.
      data-exam-viewport="true"
      className={examViewport.overlay}
      role="region"
      aria-label={label}
    >
      <div className={examViewport.inner}>{children}</div>
    </div>
  );
}
