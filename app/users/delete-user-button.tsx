"use client";

import { useTransition } from "react";
import { deleteUser } from "./actions";

export function DeleteUserButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this user?")) return;
        startTransition(() => {
          deleteUser(userId);
        });
      }}
      className="text-sm text-red-600 underline disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
