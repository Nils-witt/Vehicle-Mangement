import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { AccessDenied } from "@/app/access-denied";
import { DeleteUserButton } from "./delete-user-button";

export default async function UsersPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.canViewUsers) {
    return <AccessDenied message="You don't have permission to view users." />;
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        {currentUser.canCreateUsers && (
          <Link
            href="/users/new"
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            New user
          </Link>
        )}
      </div>

      {users.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No users yet.
        </p>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Email</th>
              <th className="py-2 pr-4 font-medium">Created</th>
              <th className="py-2 pr-4 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-black/5 dark:border-white/5"
              >
                <td className="py-2 pr-4">{user.name ?? "—"}</td>
                <td className="py-2 pr-4">{user.email}</td>
                <td className="py-2 pr-4">
                  {user.createdAt.toLocaleDateString()}
                </td>
                <td className="py-2 pr-4">
                  <div className="flex items-center gap-3">
                    {currentUser.canEditUsers && (
                      <Link
                        href={`/users/${user.id}/edit`}
                        className="underline"
                      >
                        Edit
                      </Link>
                    )}
                    {currentUser.canDeleteUsers && (
                      <DeleteUserButton userId={user.id} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
