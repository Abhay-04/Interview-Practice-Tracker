export default function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
        <span className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>}
    </div>
  );
}
