import TaskList from '../components/TaskList';
import ProgressBar from '../components/ProgressBar';
import CategoryDot from '../components/CategoryDot';
import { CategoryStatusBadge } from '../components/ProgressOverview';

export default function CategoryPage({ category, tasks, actions, onAddTask }) {
  const isChecklist = category.id === 'machine-coding';

  return (
    <div className="space-y-6">
      <section className="card p-5" aria-label={`${category.label} summary`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <CategoryDot category={category.id} className="size-2.5" />
              <h2 className="text-sm font-semibold">{category.label}</h2>
              <CategoryStatusBadge status={category.status} />
            </div>
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">{category.description}</p>
          </div>
          <div className="shrink-0 sm:text-right">
            <p className="text-3xl font-semibold tabular-nums tracking-tight">{category.percent}%</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {category.completed} of {category.total} {isChecklist ? 'checklist items' : 'done'} · Target {category.target}
            </p>
          </div>
        </div>
        <ProgressBar value={category.percent} label={`${category.label} progress`} className="mt-5" />
      </section>

      <TaskList
        tasks={tasks}
        title={isChecklist ? 'Project checklist' : 'Tasks'}
        showCategoryFilter={false}
        actions={actions}
        onAddTask={onAddTask}
      />
    </div>
  );
}
