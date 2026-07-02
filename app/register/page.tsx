import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  console.log("RegisterPage rendered");
  console.log(process.env.DATABASE_URL);
  return (
    <div className="mx-auto w-full max-w-xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Create an account</h1>
      <RegisterForm />
      <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in {process.env.DATABASE_URL}
        </Link>
      </p>
    </div>
  );
}
