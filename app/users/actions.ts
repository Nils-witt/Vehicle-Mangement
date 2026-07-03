"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/app/generated/prisma/client";
import { getCurrentUser, hasPermission } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export type UserFormState = {
  error?: string;
};

const MIN_PASSWORD_LENGTH = 8;

type ParsedUserData = {
  email: string;
  name: string | null;
  password: string | null;
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewVehicles: boolean;
  canCreateVehicles: boolean;
  canEditVehicles: boolean;
  canDeleteVehicles: boolean;
};

function parseUserForm(
  formData: FormData,
  { requirePassword }: { requirePassword: boolean },
): UserFormState & { data?: ParsedUserData } {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !email.includes("@")) {
    return { error: "A valid email is required." };
  }

  const passwordProvided = password.length > 0;
  if (
    (requirePassword || passwordProvided) &&
    password.length < MIN_PASSWORD_LENGTH
  ) {
    return {
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  return {
    data: {
      email,
      name: name.length > 0 ? name : null,
      password: password.length > 0 ? password : null,
      canViewUsers: formData.get("canViewUsers") === "on",
      canCreateUsers: formData.get("canCreateUsers") === "on",
      canEditUsers: formData.get("canEditUsers") === "on",
      canDeleteUsers: formData.get("canDeleteUsers") === "on",
      canViewVehicles: formData.get("canViewVehicles") === "on",
      canCreateVehicles: formData.get("canCreateVehicles") === "on",
      canEditVehicles: formData.get("canEditVehicles") === "on",
      canDeleteVehicles: formData.get("canDeleteVehicles") === "on",
    },
  };
}

export async function createUser(
  _prevState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  if (!(await hasPermission("canCreateUsers"))) {
    return { error: "You don't have permission to create users." };
  }

  const parsed = parseUserForm(formData, { requirePassword: true });
  if (!parsed.data) {
    return { error: parsed.error };
  }

  const { email, name, password, ...permissions } = parsed.data;
  const hashedPassword = await bcrypt.hash(password!, 10);

  try {
    await prisma.user.create({
      data: { email, name, password: hashedPassword, ...permissions },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "A user with this email already exists." };
    }
    throw error;
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function updateUser(
  userId: string,
  _prevState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  if (!(await hasPermission("canEditUsers"))) {
    return { error: "You don't have permission to edit users." };
  }

  const parsed = parseUserForm(formData, { requirePassword: false });
  if (!parsed.data) {
    return { error: parsed.error };
  }

  const { email, name, password, ...permissions } = parsed.data;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        name,
        ...permissions,
        ...(password ? { password: await bcrypt.hash(password, 10) } : {}),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { error: "A user with this email already exists." };
      }
      if (error.code === "P2025") {
        return { error: "This user no longer exists." };
      }
    }
    throw error;
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function deleteUser(userId: string): Promise<void> {
  if (!(await hasPermission("canDeleteUsers"))) {
    throw new Error("You don't have permission to delete users.");
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/users");
}

export async function setUserActive(
  userId: string,
  isActive: boolean,
): Promise<void> {
  if (!(await hasPermission("canEditUsers"))) {
    throw new Error("You don't have permission to edit users.");
  }

  if (!isActive) {
    const currentUser = await getCurrentUser();
    if (currentUser?.id === userId) {
      throw new Error("You can't deactivate your own account.");
    }
  }

  await prisma.user.update({ where: { id: userId }, data: { isActive } });
  revalidatePath("/users");
}
