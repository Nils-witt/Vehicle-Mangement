"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { resetPassword } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
    >
      {pending ? "Saving..." : "Reset password"}
    </button>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useActionState(resetPassword, {});

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          New password
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
          Confirm new password
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
