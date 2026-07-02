import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { createUser } from "../actions";
import { AccessDenied } from "@/app/access-denied";
import { UserForm } from "../user-form";

export default async function NewUserPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.canCreateUsers) {
    return (
      <AccessDenied message="You don't have permission to create users." />
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New user</h1>
        <Link href="/users" className="text-sm underline">
          Back to users
        </Link>
      </div>
      <UserForm
        action={createUser}
        submitLabel="Create user"
        passwordHint="At least 8 characters. The user will sign in with this password."
      />
    </div>
  );
}
