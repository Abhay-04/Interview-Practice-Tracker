import { CalendarDays, Menu, Plus } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import ProgressBar from './ProgressBar';

function WeekChips({ weekLabel, deadlineLabel, weeklyRate }) {
  return (
    <>
      <div className="flex shrink-0 items-center gap-2 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs dark:border-zinc-800">
        <CalendarDays className="size-3.5 text-zinc-500" aria-hidden="true" />
        <span className="whitespace-nowrap font-medium">{weekLabel}</span>
        <span className="text-zinc-300 dark:text-zinc-700" aria-hidden="true">|</span>
        <span className="whitespace-nowrap text-zinc-500 dark:text-zinc-400">Sat deadline · {deadlineLabel}</span>
      </div>
      <div className="flex shrink-0 items-center gap-2 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs dark:border-zinc-800">
        <ProgressBar value={weeklyRate} label="Weekly completion" size="sm" className="w-14" />
        <span className="font-medium tabular-nums">{weeklyRate}%</span>
        <span className="whitespace-nowrap text-zinc-500 dark:text-zinc-400">this week</span>
      </div>
    </>
  );
}

export default function Header({ title, description, week, onOpenMenu, onAddTask, resolvedTheme, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/85 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={onOpenMenu} className="icon-btn -ml-1 size-9 lg:hidden" aria-label="Open navigation">
          <Menu className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">{title}</h1>
          <p className="hidden truncate text-sm text-zinc-500 sm:block dark:text-zinc-400">{description}</p>
        </div>
        <div className="hidden items-center gap-2 xl:flex">
          <WeekChips {...week} />
        </div>
        <ThemeToggle resolvedTheme={resolvedTheme} onToggle={onToggleTheme} />
        <button type="button" onClick={onAddTask} className="btn-primary" aria-label="Add task">
          <Plus className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 sm:px-6 lg:px-8 xl:hidden">
        <WeekChips {...week} />
      </div>
    </header>
  );
}
