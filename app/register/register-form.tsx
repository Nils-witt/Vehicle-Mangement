"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { register } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
    >
      {pending ? "Creating account..." : "Create account"}
    </button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(register, {});

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded border border-black/10 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          className="rounded border border-black/10 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          className="rounded border border-black/10 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          At least 8 characters.
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          className="rounded border border-black/10 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
        />
      </div>
      {state.error && (
        <p className="text-sm text-red-600" aria-live="polite">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
