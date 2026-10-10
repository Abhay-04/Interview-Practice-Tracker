import { useMemo } from 'react';
import { CheckCircle2, CircleDashed, ListTodo, PartyPopper, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import ProgressOverview from '../components/ProgressOverview';
import ProgressRing from '../components/ProgressRing';
import TaskList from '../components/TaskList';
import WeeklyReview from '../components/WeeklyReview';
import CategoryDot from '../components/CategoryDot';
import { sortTasks } from '../utils/taskHelpers';
import { formatShortDate, isOverdue } from '../utils/dateHelpers';

function ThisWeekCard({ tasks, week, onOpenTask }) {
  const upNext = useMemo(
    () => sortTasks(tasks.filter((t) => t.status !== 'completed'), 'dueDate').slice(0, 4),
    [tasks],
  );

  return (
    <section className="card flex flex-col p-5" aria-labelledby="this-week-title">
      <h2 id="this-week-title" className="text-sm font-semibold">This week</h2>
      <div className="mt-4 flex items-center gap-5">
        <ProgressRing value={week.weeklyRate} label="complete" size={112} />
        <div className="space-y-1 text-sm">
          <p className="font-medium tabular-nums">
            {week.weekCompleted} of {week.weekTotal} tasks done
          </p>
          <p className="text-zinc-500 dark:text-zinc-400">{week.weekLabel}</p>
          <p className="text-zinc-500 dark:text-zinc-400">Saturday · {week.deadlineLabel}</p>
        </div>
      </div>

      <h3 className="mt-6 text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">Up next</h3>
      {upNext.length === 0 ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
          <PartyPopper className="size-4" aria-hidden="true" /> Everything is done. Great work!
        </p>
      ) : (
        <ul className="mt-2 -mx-2">
          {upNext.map((task) => (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => onOpenTask(task)}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <CategoryDot category={task.category} />
                <span className="flex-1 truncate">{task.title}</span>
                <span className={`shrink-0 text-xs tabular-nums ${isOverdue(task.dueDate) ? 'text-red-600 dark:text-red-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                  {formatShortDate(task.dueDate)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function Dashboard({ tasks, stats, categoryProgress, week, actions, onAddTask, review, onSaveReview }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Total tasks" value={stats.total} icon={ListTodo} hint="Across all categories" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} hint={`${stats.completed === 1 ? '1 task' : `${stats.completed} tasks`} checked off`} />
        <StatCard label="Pending" value={stats.pending} icon={CircleDashed} hint={`${stats.inProgress} in progress`} />
        <StatCard label="Completion rate" value={`${stats.rate}%`} icon={TrendingUp} hint="Overall, all tasks" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressOverview categoryProgress={categoryProgress} />
        </div>
        <ThisWeekCard tasks={tasks} week={week} onOpenTask={actions.onOpen} />
      </div>

      <TaskList tasks={tasks} title="All tasks" actions={actions} onAddTask={onAddTask} />

      <WeeklyReview review={review} onSave={onSaveReview} />
    </div>
  );
}
