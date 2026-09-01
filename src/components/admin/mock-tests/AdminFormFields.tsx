"use client";

import type { ReactNode } from "react";
import { cx, text } from "@/features/design/design-tokens";
import type { AdminActionState } from "@/features/admin/admin-action-state";

// Form primitives shared by the three builder forms.
//
// Not one of the components the ticket lists, but the alternative is the
// same label, input, hint and error markup pasted three times, and the
// error wiring is the part that has to be right everywhere: an input
// that fails validation needs aria-invalid and aria-describedby pointing
// at its own message, or a screen reader user gets a form that refuses
// to submit and never says why.
//
// Every field is uncontrolled with a defaultValue. The forms post to a
// server action, so the browser holds the value and React does not need
// to.

const controlClasses =
  "mt-1.5 block w-full rounded-xl border border-academy-navy/15 bg-white px-3.5 py-2.5 text-sm text-academy-navy shadow-sm outline-none transition focus:border-academy-blue focus:ring-2 focus:ring-academy-blue/30 disabled:cursor-not-allowed disabled:bg-academy-navy/5";

const invalidClasses = "border-academy-red focus:border-academy-red focus:ring-academy-red/30";

type BaseFieldProps = {
  id: string;
  name: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
};

// Label, hint, error and the aria wiring between them. The control
// itself is passed in, so the same block serves an input, a textarea and
// a select.
function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
}: Omit<BaseFieldProps, "name"> & { children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-academy-navy">
        {label}
        {required ? (
          <span aria-hidden className={cx("ml-1", text.danger)}>
            *
          </span>
        ) : null}
      </label>

      {children}

      {hint ? (
        <p id={`${id}-hint`} className={cx("mt-1.5 text-xs leading-5", text.muted)}>
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={`${id}-error`} className={cx("mt-1.5 text-xs font-medium", text.danger)}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(
    Boolean,
  );

  return ids.length > 0 ? ids.join(" ") : undefined;
}

export type TextFieldProps = BaseFieldProps & {
  defaultValue?: string | null;
  // Pass value and onChange together to control the input. Only the two
  // fields that talk to each other need this, so everything else stays
  // uncontrolled with a defaultValue.
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  min?: number;
  max?: number;
  maxLength?: number;
};

export function TextField({
  id,
  name,
  label,
  hint,
  error,
  required,
  defaultValue,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  max,
  maxLength,
}: TextFieldProps) {
  const isControlled = value !== undefined && onChange !== undefined;

  return (
    <Field id={id} label={label} hint={hint} error={error} required={required}>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={type === "number" ? "numeric" : undefined}
        min={min}
        max={max}
        maxLength={maxLength}
        required={required}
        {...(isControlled
          ? { value, onChange: (event) => onChange(event.target.value) }
          : { defaultValue: defaultValue ?? "" })}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cx(controlClasses, error ? invalidClasses : "")}
      />
    </Field>
  );
}

export type TextAreaFieldProps = BaseFieldProps & {
  defaultValue?: string | null;
  placeholder?: string;
  rows?: number;
};

export function TextAreaField({
  id,
  name,
  label,
  hint,
  error,
  required,
  defaultValue,
  placeholder,
  rows = 4,
}: TextAreaFieldProps) {
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cx(controlClasses, error ? invalidClasses : "")}
      />
    </Field>
  );
}

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectFieldProps = BaseFieldProps & {
  options: SelectOption[];
  defaultValue?: string | null;
  // Pass value and onChange together when another field depends on this
  // one. Otherwise leave the select uncontrolled.
  value?: string;
  onChange?: (value: string) => void;
  // Wording for the empty option. Omit to make the select required.
  emptyLabel?: string;
};

export function SelectField({
  id,
  name,
  label,
  hint,
  error,
  required,
  options,
  defaultValue,
  value,
  onChange,
  emptyLabel,
}: SelectFieldProps) {
  const isControlled = value !== undefined && onChange !== undefined;

  return (
    <Field id={id} label={label} hint={hint} error={error} required={required}>
      <select
        id={id}
        name={name}
        required={required}
        {...(isControlled
          ? { value, onChange: (event) => onChange(event.target.value) }
          : { defaultValue: defaultValue ?? "" })}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cx(controlClasses, error ? invalidClasses : "")}
      >
        {emptyLabel ? <option value="">{emptyLabel}</option> : null}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

// The banner a form shows after a server action returns. role="status"
// rather than role="alert" for a success, so a save confirmation does
// not interrupt what a screen reader is reading.
export function AdminFormMessage({ state }: { state: AdminActionState }) {
  if (state.status === "idle" || state.message.length === 0) {
    return null;
  }

  const isError = state.status === "error";

  return (
    <p
      role={isError ? "alert" : "status"}
      className={cx(
        "rounded-xl px-4 py-3 text-sm leading-6",
        isError
          ? "bg-academy-red-soft text-academy-red"
          : "bg-emerald-50 text-emerald-800",
      )}
    >
      {state.message}
    </p>
  );
}
