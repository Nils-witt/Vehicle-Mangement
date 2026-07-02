"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { Prisma } from "@/app/generated/prisma/client";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

export type RegisterState = {
  error?: string;
};

const MIN_PASSWORD_LENGTH = 8;

export async function register(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !email.includes("@")) {
    return { error: "A valid email is required." };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.$transaction(async (tx) => {
      const isFirstUser = (await tx.user.count()) === 0;

      await tx.user.create({
        data: {
          email,
          name: name.length > 0 ? name : null,
          password: hashedPassword,
          ...(isFirstUser
            ? {
                canViewUsers: true,
                canCreateUsers: true,
                canEditUsers: true,
                canDeleteUsers: true,
                canViewVehicles: true,
                canCreateVehicles: true,
                canEditVehicles: true,
                canDeleteVehicles: true,
              }
            : {}),
        },
      });
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "An account with this email already exists." };
    }
    throw error;
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created. Please sign in." };
    }
    throw error;
  }

  return {};
}
