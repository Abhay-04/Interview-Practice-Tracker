import { memo } from 'react';
import { Check, Link2, NotebookPen, Pencil, Trash2 } from 'lucide-react';
import { CATEGORY_MAP, PRIORITY_MAP, STATUSES } from '../data/constants';
import { formatShortDate, isOverdue } from '../utils/dateHelpers';
import Badge, { PRIORITY_TONE } from './Badge';
import CategoryDot from './CategoryDot';

function TaskCard({ task, showCategory, actions }) {
  const completed = task.status === 'completed';
  const overdue = !completed && isOverdue(task.dueDate);
  const hasNotes = Boolean(task.notes || task.learned || task.revise);

  return (
    <li className="group flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-zinc-50 sm:px-5 dark:hover:bg-zinc-800/40">
      <button
        type="button"
        role="checkbox"
        aria-checked={completed}
        aria-label={`Mark "${task.title}" as ${completed ? 'not completed' : 'completed'}`}
        onClick={() => actions.onToggle(task)}
        className={`mt-0.5 flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors ${
          completed
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-zinc-300 bg-white hover:border-indigo-500 dark:border-zinc-600 dark:bg-zinc-900'
        }`}
      >
        {completed && <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />}
      </button>

      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={() => actions.onOpen(task)}
          className={`cursor-pointer text-left text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 ${
            completed ? 'text-zinc-400 line-through dark:text-zinc-500' : ''
          }`}
        >
          {task.title}
        </button>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          {showCategory && (
            <span className="inline-flex items-center gap-1.5">
              <CategoryDot category={task.category} />
              {CATEGORY_MAP[task.category].shortLabel}
            </span>
          )}
          <Badge tone={PRIORITY_TONE[task.priority]}>{PRIORITY_MAP[task.priority].label}</Badge>
          {task.dueDate && (
            <span className={overdue ? 'font-medium text-red-600 dark:text-red-400' : ''}>
              {overdue ? 'Overdue · ' : 'Due '}
              {formatShortDate(task.dueDate)}
            </span>
          )}
          {task.url && (
            <a
              href={task.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400"
              aria-label={`Open saved link for ${task.title}`}
            >
              <Link2 className="size-3.5" aria-hidden="true" /> Link
            </a>
          )}
          {hasNotes && (
            <span className="inline-flex items-center gap-1" title="Has notes">
              <NotebookPen className="size-3.5" aria-hidden="true" /> Notes
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <label className="sr-only" htmlFor={`status-${task.id}`}>Status for {task.title}</label>
        <select
          id={`status-${task.id}`}
          value={task.status}
          onChange={(event) => actions.onStatusChange(task, event.target.value)}
          className="hidden h-8 cursor-pointer rounded-md border border-zinc-200 bg-white px-2 text-xs font-medium text-zinc-700 hover:border-zinc-300 focus:border-indigo-500 focus:outline-none sm:block dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          {STATUSES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <button type="button" onClick={() => actions.onEdit(task)} className="icon-btn" aria-label={`Edit ${task.title}`} title="Edit">
          <Pencil className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => actions.onDelete(task)}
          className="icon-btn hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          aria-label={`Delete ${task.title}`}
          title="Delete"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </li>
  );
}

// Memoized so toggling one task doesn't re-render every row (actions object is stable from App).
export default memo(TaskCard);
