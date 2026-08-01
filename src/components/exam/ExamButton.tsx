import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/features/design/design-tokens";
import {
  examButtonBase,
  examButtonCase,
  examButtonSizes,
  examButtonVariants,
} from "@/features/exam-engine/exam-theme";
import type {
  ExamButtonSize,
  ExamButtonVariant,
} from "@/features/exam-engine/exam-shell-types";

// Button used by the exam chrome.
//
// The dashboard uses pill shaped AppButton. The exam frame uses a square
// cornered, uppercase control instead, because the exam surface is a test
// engine and not a marketing page. Recipes live in exam-theme.ts.
//
// Pass href for navigation so the control stays a link and keeps middle
// click and open in new tab. A disabled link renders as a non
// interactive span, since an anchor cannot be disabled.
//
// This component holds no state, so it works both inside a server
// component that only navigates and inside a client component that
// passes onClick.

export type ExamButtonProps = {
  variant?: ExamButtonVariant;
  size?: ExamButtonSize;
  // Renders a link instead of a button.
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  // Uppercase suits Next and Back. Set false for a sentence case action
  // inside the canvas.
  uppercase?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
};

export function ExamButton({
  variant = "primary",
  size = "md",
  href,
  onClick,
  disabled = false,
  type = "button",
  uppercase = true,
  fullWidth = false,
  ariaLabel,
  className,
  children,
}: ExamButtonProps) {
  const classes = cx(
    examButtonBase,
    examButtonVariants[variant],
    examButtonSizes[size],
    uppercase ? examButtonCase : "",
    fullWidth ? "w-full" : "",
    className,
  );

  if (href && !disabled) {
    return (
      <Link href={href} aria-label={ariaLabel} className={classes}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <span
        aria-disabled="true"
        aria-label={ariaLabel}
        className={cx(classes, "cursor-not-allowed opacity-55")}
      >
        {children}
      </span>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classes}
    >
      {children}
    </button>
  );
}
