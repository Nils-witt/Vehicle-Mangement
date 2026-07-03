"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export type ResetPasswordState = {
  error?: string;
};

const MIN_PASSWORD_LENGTH = 8;

export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token) {
    return { error: "This link is invalid or has expired." };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const user = await prisma.user.findUnique({
    where: { passwordResetToken: token },
  });

  if (
    !user ||
    !user.passwordResetTokenExpiresAt ||
    user.passwordResetTokenExpiresAt < new Date()
  ) {
    return { error: "This link is invalid or has expired." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordChangedAt: new Date(),
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
    },
  });

  redirect("/login?passwordReset=1");
}
