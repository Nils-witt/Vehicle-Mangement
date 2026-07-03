import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  const user = token
    ? await prisma.user.findUnique({ where: { passwordResetToken: token } })
    : null;
  const isValid =
    !!user &&
    !!user.passwordResetTokenExpiresAt &&
    user.passwordResetTokenExpiresAt > new Date();

  if (!token || !isValid) {
    return (
      <div className="mx-auto w-full max-w-xl px-6 py-12">
        <h1 className="mb-6 text-2xl font-semibold">Reset your password</h1>
        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          This link is invalid or has expired.
        </p>
        <Link href="/forgot-password" className="text-sm underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Choose a new password</h1>
      <ResetPasswordForm token={token} />
    </div>
  );
}
