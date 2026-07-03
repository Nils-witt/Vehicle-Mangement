"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login, resendVerificationEmail } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

function ResendVerificationForm({ email }: { email: string }) {
  const [state, formAction] = useActionState(resendVerificationEmail, {});

  return (
    <form action={formAction} className="mt-2 flex items-center gap-2">
      <input type="hidden" name="email" value={email} />
      {state.message ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {state.message}
        </p>
      ) : (
        <button type="submit" className="text-sm underline">
          Resend verification email
        </button>
      )}
    </form>
  );
}

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction] = useActionState(login, {});

  return (
    <div className="flex max-w-sm flex-col gap-4">
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
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
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
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
      {state.unverifiedEmail && (
        <ResendVerificationForm email={state.unverifiedEmail} />
      )}
    </div>
  );
}
