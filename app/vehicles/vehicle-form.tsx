"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { VehicleFormState } from "./actions";

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

export function VehicleForm({
  action,
  defaultValues,
  owners,
  submitLabel,
}: {
  action: (
    state: VehicleFormState,
    formData: FormData,
  ) => Promise<VehicleFormState>;
  defaultValues?: {
    plate: string;
    vin: string;
    make: string;
    model: string;
    year: number;
    ownerId: string;
  };
  owners: { id: string; label: string }[];
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="plate" className="text-sm font-medium">
          License plate
        </label>
        <input
          id="plate"
          name="plate"
          type="text"
          required
          defaultValue={defaultValues?.plate}
          className="rounded border border-black/10 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="vin" className="text-sm font-medium">
          VIN
        </label>
        <input
          id="vin"
          name="vin"
          type="text"
          required
          defaultValue={defaultValues?.vin}
          className="rounded border border-black/10 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="make" className="text-sm font-medium">
          Make
        </label>
        <input
          id="make"
          name="make"
          type="text"
          required
          defaultValue={defaultValues?.make}
          className="rounded border border-black/10 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="model" className="text-sm font-medium">
          Model
        </label>
        <input
          id="model"
          name="model"
          type="text"
          required
          defaultValue={defaultValues?.model}
          className="rounded border border-black/10 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="year" className="text-sm font-medium">
          Year
        </label>
        <input
          id="year"
          name="year"
          type="number"
          required
          defaultValue={defaultValues?.year}
          className="rounded border border-black/10 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="ownerId" className="text-sm font-medium">
          Owner
        </label>
        <select
          id="ownerId"
          name="ownerId"
          defaultValue={defaultValues?.ownerId ?? ""}
          className="rounded border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
        >
          <option value="">Unassigned</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.label}
            </option>
          ))}
        </select>
      </div>
      {state.error && (
        <p className="text-sm text-red-600" aria-live="polite">
          {state.error}
        </p>
      )}
      <SubmitButton label={submitLabel} />
    </form>
  );
}
