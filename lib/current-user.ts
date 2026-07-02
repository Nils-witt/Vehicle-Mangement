import { cache } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({ where: { id: session.user.id } });
});

export type UserPermission =
  | "canViewUsers"
  | "canCreateUsers"
  | "canEditUsers"
  | "canDeleteUsers"
  | "canViewVehicles"
  | "canCreateVehicles"
  | "canEditVehicles"
  | "canDeleteVehicles";

export async function hasPermission(
  permission: UserPermission,
): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.[permission] ?? false;
}
