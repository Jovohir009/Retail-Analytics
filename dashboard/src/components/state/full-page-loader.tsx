export function FullPageLoader({ label }: { label: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <div className="rounded-2xl bg-white px-6 py-5 text-sm font-medium text-slate-600 shadow-card ring-1 ring-slate-200/70">
        <span className="mr-3 inline-block h-2 w-2 animate-pulse rounded-full bg-primary-600" />
        {label}
      </div>
    </main>
  );
}
