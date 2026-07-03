import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Reset your password</h1>
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>
      <ForgotPasswordForm />
      <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
        <Link href="/login" className="underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
