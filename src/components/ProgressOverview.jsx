import Badge, { STATUS_TONE } from './Badge';
import CategoryDot from './CategoryDot';
import ProgressBar from './ProgressBar';

const STATUS_LABEL = { empty: 'No tasks', 'not-started': 'Not started', 'in-progress': 'In progress', completed: 'Completed' };

export function CategoryStatusBadge({ status }) {
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>;
}

export default function ProgressOverview({ categoryProgress }) {
  return (
    <section className="card h-full p-5" aria-labelledby="progress-title">
      <div className="flex items-baseline justify-between">
        <h2 id="progress-title" className="text-sm font-semibold">Weekly progress</h2>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">By category</span>
      </div>
      <ul className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {categoryProgress.map((c) => (
          <li key={c.id}>
            <div className="flex items-center justify-between gap-2">
              <a href={`#/${c.id}`} className="flex min-w-0 items-center gap-2 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
                <CategoryDot category={c.id} />
                <span className="truncate">{c.shortLabel}</span>
              </a>
              <CategoryStatusBadge status={c.status} />
            </div>
            <ProgressBar value={c.percent} label={`${c.label} progress`} className="mt-2.5" />
            <div className="mt-2 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span className="tabular-nums">{c.completed} of {c.total} done</span>
              <span>Target: {c.target}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
