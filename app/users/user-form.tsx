"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { UserFormState } from "./actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

const PERMISSION_FIELDS = [
  { name: "canViewUsers", label: "Can view users" },
  { name: "canCreateUsers", label: "Can create users" },
  { name: "canEditUsers", label: "Can edit users" },
  { name: "canDeleteUsers", label: "Can delete users" },
  { name: "canViewVehicles", label: "Can view vehicles" },
  { name: "canCreateVehicles", label: "Can create vehicles" },
  { name: "canEditVehicles", label: "Can edit vehicles" },
  { name: "canDeleteVehicles", label: "Can delete vehicles" },
] as const;

export function UserForm({
  action,
  defaultValues,
  submitLabel,
  passwordHint,
}: {
  action: (state: UserFormState, formData: FormData) => Promise<UserFormState>;
  defaultValues?: {
    email: string;
    name: string;
    canViewUsers?: boolean;
    canCreateUsers?: boolean;
    canEditUsers?: boolean;
    canDeleteUsers?: boolean;
    canViewVehicles?: boolean;
    canCreateVehicles?: boolean;
    canEditVehicles?: boolean;
    canDeleteVehicles?: boolean;
  };
  submitLabel: string;
  passwordHint?: string;
}) {
  const [state, formAction] = useActionState(action, {});

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
          defaultValue={defaultValues?.email}
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
          defaultValue={defaultValues?.name}
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
          autoComplete="new-password"
          className="rounded border border-black/10 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
        />
        {passwordHint && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {passwordHint}
          </p>
        )}
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">Permissions</legend>
        {PERMISSION_FIELDS.map(({ name, label }) => (
          <label key={name} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name={name}
              defaultChecked={defaultValues?.[name] ?? false}
              className="h-4 w-4"
            />
            {label}
          </label>
        ))}
      </fieldset>
      {state.error && (
        <p className="text-sm text-red-600" aria-live="polite">
          {state.error}
        </p>
      )}
      <SubmitButton label={submitLabel} />
    </form>
  );
}
