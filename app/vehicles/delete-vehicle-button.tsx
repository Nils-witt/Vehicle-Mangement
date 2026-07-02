"use client";

import { useTransition } from "react";
import { deleteVehicle } from "./actions";

export function DeleteVehicleButton({ vehicleId }: { vehicleId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this vehicle?")) return;
        startTransition(() => {
          deleteVehicle(vehicleId);
        });
      }}
      className="text-sm text-red-600 underline disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
