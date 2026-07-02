export function AccessDenied({ message }: { message: string }) {
  return (
    <div className="mx-auto w-full max-w-xl px-6 py-12">
      <h1 className="mb-2 text-2xl font-semibold">Access denied</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
    </div>
  );
}
