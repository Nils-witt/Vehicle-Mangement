import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { updateUser } from "../../actions";
import { AccessDenied } from "@/app/access-denied";
import { UserForm } from "../../user-form";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.canEditUsers) {
    return <AccessDenied message="You don't have permission to edit users." />;
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    notFound();
  }

  const updateUserWithId = updateUser.bind(null, user.id);

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit user</h1>
        <Link href="/users" className="text-sm underline">
          Back to users
        </Link>
      </div>
      <UserForm
        action={updateUserWithId}
        defaultValues={{
          email: user.email,
          name: user.name ?? "",
          canViewUsers: user.canViewUsers,
          canCreateUsers: user.canCreateUsers,
          canEditUsers: user.canEditUsers,
          canDeleteUsers: user.canDeleteUsers,
          canViewVehicles: user.canViewVehicles,
          canCreateVehicles: user.canCreateVehicles,
          canEditVehicles: user.canEditVehicles,
          canDeleteVehicles: user.canDeleteVehicles,
        }}
        submitLabel="Save changes"
        passwordHint="Leave blank to keep the current password."
      />
    </div>
  );
}
