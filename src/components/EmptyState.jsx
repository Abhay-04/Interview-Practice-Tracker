export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <span className="flex size-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
