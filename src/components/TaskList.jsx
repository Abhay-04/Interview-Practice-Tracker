import { useMemo, useState } from 'react';
import { ClipboardList, Plus, Search, SearchX, X } from 'lucide-react';
import { CATEGORIES, SORT_OPTIONS, STATUSES } from '../data/constants';
import { filterTasks, sortTasks } from '../utils/taskHelpers';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';

const DEFAULT_FILTERS = { search: '', category: 'all', status: 'all', sortBy: 'dueDate' };

function FilterSelect({ id, label, value, onChange, options, allLabel }) {
  return (
    <div className="min-w-0 odd:last:col-span-2">
      <label htmlFor={id} className="sr-only">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="input cursor-pointer pr-8 sm:w-auto">
        {allLabel && <option value="all">{allLabel}</option>}
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function TaskList({ tasks, title = 'Tasks', showCategoryFilter = true, actions, onAddTask }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const setFilter = (key) => (value) => setFilters((prev) => ({ ...prev, [key]: value }));

  // Derived data: recomputed only when tasks or filters change.
  const visibleTasks = useMemo(() => sortTasks(filterTasks(tasks, filters), filters.sortBy), [tasks, filters]);

  const isFiltered = filters.search || filters.category !== 'all' || filters.status !== 'all';
  const clearFilters = () => setFilters((prev) => ({ ...DEFAULT_FILTERS, sortBy: prev.sortBy }));

  return (
    <section className="card" aria-labelledby="task-list-title">
      <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 sm:px-5 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-3">
          <h2 id="task-list-title" className="text-sm font-semibold">
            {title}
            <span className="ml-2 font-normal text-zinc-500 tabular-nums dark:text-zinc-400">
              {isFiltered ? `${visibleTasks.length} of ${tasks.length}` : tasks.length}
            </span>
          </h2>
          {isFiltered && (
            <button type="button" onClick={clearFilters} className="btn-ghost h-7 px-2 text-xs">
              <X className="size-3.5" aria-hidden="true" /> Clear filters
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <div className="relative flex-1 sm:min-w-56">
            <label htmlFor="task-search" className="sr-only">Search tasks by title</label>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input
              id="task-search"
              type="search"
              value={filters.search}
              onChange={(e) => setFilter('search')(e.target.value)}
              placeholder="Search tasks…"
              className="input pl-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            {showCategoryFilter && (
              <FilterSelect id="filter-category" label="Filter by category" value={filters.category} onChange={setFilter('category')}
                options={CATEGORIES.map((c) => ({ id: c.id, label: c.shortLabel }))} allLabel="All categories" />
            )}
            <FilterSelect id="filter-status" label="Filter by status" value={filters.status} onChange={setFilter('status')}
              options={STATUSES} allLabel="All statuses" />
            <FilterSelect id="sort-by" label="Sort tasks" value={filters.sortBy} onChange={setFilter('sortBy')}
              options={SORT_OPTIONS.map((o) => ({ ...o, label: `Sort: ${o.label}` }))} />
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No tasks yet"
          description="Add your first task to start tracking this week's preparation."
          action={<button type="button" onClick={onAddTask} className="btn-primary"><Plus className="size-4" aria-hidden="true" /> Add Task</button>}
        />
      ) : visibleTasks.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No matching tasks"
          description="Try a different search term or clear your filters."
          action={<button type="button" onClick={clearFilters} className="btn-secondary">Clear filters</button>}
        />
      ) : (
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {visibleTasks.map((task) => (
            <TaskCard key={task.id} task={task} showCategory={showCategoryFilter} actions={actions} />
          ))}
        </ul>
      )}
    </section>
  );
}
