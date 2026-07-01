"use client";

import { useState, type FormEvent } from "react";
import { Container, SectionHeading } from "./primitives";
import {
  earlyAccessSchema,
  willingnessToPayValues,
  type EarlyAccessInput,
} from "@/lib/validation/earlyAccess";

type Status = "idle" | "submitting" | "success" | "error";

const preparingOptions = [
  "Yes, actively preparing",
  "Just getting started",
  "Planning to start soon",
  "Not sure yet",
];

const testDateOptions = [
  "Within 1 month",
  "1 to 3 months away",
  "3 to 6 months away",
  "No date set yet",
];

const labelClass = "block text-sm font-medium text-slate-800";
const inputClass =
  "mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20";

export function EarlyAccessForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const raw: Record<string, string> = {};
    formData.forEach((value, key) => {
      raw[key] = typeof value === "string" ? value : "";
    });

    const parsed = earlyAccessSchema.safeParse(raw);
    if (!parsed.success) {
      setStatus("error");
      setErrorMessage(
        parsed.error.issues[0]?.message ??
          "Please check the form and try again.",
      );
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data satisfies EarlyAccessInput),
      });

      const result = (await response.json()) as {
        ok: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setStatus("error");
        setErrorMessage(
          result.error ?? "Something went wrong. Please try again shortly.",
        );
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(
        "We could not reach the server. Please check your connection and try again.",
      );
    }
  }

  return (
    <section
      id="early-access"
      className="scroll-mt-16 border-t border-slate-200 bg-white"
    >
      <Container className="py-20 sm:py-24">
        <SectionHeading
          eyebrow="Early access"
          title="Get early access to CELPIP speaking practice"
          subtitle="Tell us a little about your CELPIP journey and we will add you to the early access list."
        />

        <div className="mx-auto mt-12 max-w-2xl">
          {status === "success" ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                Thank you. You are on the early access list.
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                We will be in touch as the full practice app gets closer to
                launch.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 shadow-sm sm:p-8"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="full_name" className={labelClass}>
                    Your name
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    autoComplete="name"
                    required
                    className={inputClass}
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="preparing_status" className={labelClass}>
                    Are you currently preparing for CELPIP?
                  </label>
                  <select
                    id="preparing_status"
                    name="preparing_status"
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="">Select an option</option>
                    {preparingOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="test_date" className={labelClass}>
                    When is your test?
                  </label>
                  <select
                    id="test_date"
                    name="test_date"
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="">Select an option</option>
                    {testDateOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="current_practice_method" className={labelClass}>
                  How do you currently practice speaking?
                </label>
                <input
                  id="current_practice_method"
                  name="current_practice_method"
                  type="text"
                  className={inputClass}
                  placeholder="Tutoring, self-study, classes, or not yet"
                />
              </div>

              <div className="mt-6">
                <label htmlFor="hardest_part" className={labelClass}>
                  What is the hardest part of CELPIP speaking for you?
                </label>
                <textarea
                  id="hardest_part"
                  name="hardest_part"
                  rows={3}
                  className={inputClass}
                  placeholder="For example, timing, confidence, or organizing your answer"
                />
              </div>

              <fieldset className="mt-6">
                <legend className={labelClass}>
                  Would you pay around $20/month for realistic speaking practice
                  with AI feedback?
                </legend>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:gap-6">
                  {willingnessToPayValues.map((option) => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-2 text-sm text-slate-800"
                    >
                      <input
                        type="radio"
                        name="willingness_to_pay"
                        value={option}
                        required
                        className="h-4 w-4 border-slate-300 text-brand focus:ring-brand"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-6">
                <label htmlFor="notes" className={labelClass}>
                  Anything else you want to share?
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className={inputClass}
                  placeholder="Optional"
                />
              </div>

              {status === "error" && errorMessage ? (
                <p
                  role="alert"
                  className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand px-8 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "submitting" ? "Submitting..." : "Get early access"}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                We will only use your details to contact you about early access.
              </p>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
