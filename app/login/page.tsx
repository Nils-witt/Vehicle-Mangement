import Link from "next/link";
import { LoginForm } from "./login-form";

const VERIFY_ERROR_MESSAGES: Record<string, string> = {
  missing_token: "That verification link is invalid.",
  invalid_token: "That verification link is invalid.",
  expired_token:
    "That verification link has expired. Enter your email below to request a new one.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    callbackUrl?: string;
    verified?: string;
    verifyError?: string;
  }>;
}) {
  const { callbackUrl, verified, verifyError } = await searchParams;
  const notice = verified
    ? "Your email has been verified. You can now sign in."
    : verifyError
      ? VERIFY_ERROR_MESSAGES[verifyError]
      : undefined;

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Sign in</h1>
      {notice && (
        <p
          className="mb-4 text-sm text-zinc-600 dark:text-zinc-400"
          aria-live="polite"
        >
          {notice}
        </p>
      )}
      <LoginForm callbackUrl={callbackUrl ?? "/"} />
      <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline">
          Register
        </Link>
      </p>
    </div>
  );
}
