"use client";

import { useTransition } from "react";
import { setUserActive } from "./actions";

export function DeactivateUserButton({
  userId,
  isActive,
}: {
  userId: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (isActive && !confirm("Deactivate this user?")) return;
        startTransition(() => {
          setUserActive(userId, !isActive);
        });
      }}
      className="text-sm underline disabled:opacity-50"
    >
      {isPending ? "Saving..." : isActive ? "Deactivate" : "Activate"}
    </button>
  );
}
