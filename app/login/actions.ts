"use server";

import { AuthError } from "next-auth";
import { AccountDeactivatedError, EmailNotVerifiedError, signIn } from "@/auth";
import { sendVerificationEmail } from "@/lib/mailer";
import { prisma } from "@/lib/prisma";
import { createVerificationToken } from "@/lib/verification-token";

export type LoginState = {
  error?: string;
  unverifiedEmail?: string;
};

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") || "/");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AccountDeactivatedError) {
      return { error: "This account has been deactivated." };
    }
    if (error instanceof EmailNotVerifiedError) {
      return {
        error: "Please verify your email address before signing in.",
        unverifiedEmail: email,
      };
    }
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }

  return {};
}

export type ResendState = {
  message?: string;
};

export async function resendVerificationEmail(
  _prevState: ResendState,
  formData: FormData,
): Promise<ResendState> {
  const email = String(formData.get("email") ?? "").trim();
  const confirmation = {
    message:
      "If that account exists and isn't verified yet, we've sent a new verification link.",
  };

  if (!email) return confirmation;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.emailVerified) return confirmation;

  const { token, expiresAt } = createVerificationToken();
  await prisma.user.update({
    where: { id: user.id },
    data: { verificationToken: token, verificationTokenExpiresAt: expiresAt },
  });

  try {
    await sendVerificationEmail(email, token);
  } catch {
    return {
      message: "Something went wrong sending the email. Please try again.",
    };
  }

  return confirmation;
}
