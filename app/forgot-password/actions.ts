"use server";

import { sendPasswordResetEmail } from "@/lib/mailer";
import { prisma } from "@/lib/prisma";
import { createPasswordResetToken } from "@/lib/verification-token";

export type ForgotPasswordState = {
  message?: string;
};

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim();
  const confirmation = {
    message:
      "If that email address is registered, we've sent a link to reset your password.",
  };

  if (!email) return confirmation;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return confirmation;

  const { token, expiresAt } = createPasswordResetToken();
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken: token, passwordResetTokenExpiresAt: expiresAt },
  });

  try {
    await sendPasswordResetEmail(email, token);
  } catch {
    return {
      message: "Something went wrong sending the email. Please try again.",
    };
  }

  return confirmation;
}
