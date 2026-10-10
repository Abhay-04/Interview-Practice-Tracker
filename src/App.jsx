import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskFormModal from './components/TaskFormModal';
import TaskDetailsModal from './components/TaskDetailsModal';
import ConfirmDialog from './components/ConfirmDialog';
import ToastStack from './components/Toast';
import { EMPTY_REVIEW, sanitizeReview } from './components/WeeklyReview';
import Dashboard from './pages/Dashboard';
import CategoryPage from './pages/CategoryPage';
import SettingsPage from './pages/SettingsPage';
import { useTasks } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useHashRoute } from './hooks/useHashRoute';
import { useToast } from './hooks/useToast';
import { CATEGORY_MAP, STATUS_MAP, STORAGE_KEYS } from './data/constants';
import { getCategoryProgress, getStats, getTasksDueInWeek, percent } from './utils/taskHelpers';
import { describeDeadline, formatWeekRange, getWeekRange } from './utils/dateHelpers';

const DEFAULT_PROFILE = { name: 'Student' };
const sanitizeProfile = (value) =>
  value && typeof value.name === 'string' && value.name.trim() ? { name: value.name.trim().slice(0, 40) } : undefined;

const PAGE_META = {
  overview: { title: 'Overview', description: 'Your interview preparation at a glance.' },
  settings: { title: 'Settings', description: 'Theme, profile and data management.' },
};

export default function App() {
  const route = useHashRoute();
  const { tasks, corrupted: tasksCorrupted, addTask, updateTask, deleteTask, toggleComplete, resetTasks, clearTasks } = useTasks();
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [review, setReview, reviewCorrupted] = useLocalStorage(STORAGE_KEYS.review, EMPTY_REVIEW, sanitizeReview);
  const [profile, setProfile] = useLocalStorage(STORAGE_KEYS.profile, DEFAULT_PROFILE, sanitizeProfile);
  const { toasts, notify, dismiss } = useToast();

  // UI state: which overlay is open. Only ids/flags are stored; task data always comes from `tasks`.
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [form, setForm] = useState(null); // null | { task?, defaultCategory? }
  const [detailsId, setDetailsId] = useState(null);
  const [confirm, setConfirm] = useState(null); // null | { title, message, confirmLabel, onConfirm }

  const category = CATEGORY_MAP[route];
  const page = route === 'settings' ? 'settings' : category ? 'category' : 'overview';
  const meta = category ? { title: category.label, description: category.description } : PAGE_META[page];

  useEffect(() => {
    document.title = `${meta.title} · Interview Practice Tracker`;
  }, [meta.title]);

  // Tell the user once if saved data was unreadable and defaults were restored.
  const warnedRef = useRef(false);
  useEffect(() => {
    if (warnedRef.current) return;
    warnedRef.current = true;
    if (tasksCorrupted) notify('Saved tasks could not be read, so sample data was restored.', 'error');
    if (reviewCorrupted) notify('Saved weekly review could not be read and was reset.', 'error');
  }, [tasksCorrupted, reviewCorrupted, notify]);

  // ---------- Derived data (computed from tasks, never stored) ----------
  const stats = useMemo(() => getStats(tasks), [tasks]);
  const categoryProgress = useMemo(() => getCategoryProgress(tasks), [tasks]);
  const week = useMemo(() => {
    const range = getWeekRange();
    const weekTasks = getTasksDueInWeek(tasks, range);
    const weekCompleted = weekTasks.filter((t) => t.status === 'completed').length;
    return {
      weekLabel: formatWeekRange(range),
      deadlineLabel: describeDeadline(range.end),
      weekTotal: weekTasks.length,
      weekCompleted,
      weeklyRate: percent(weekCompleted, weekTasks.length),
    };
  }, [tasks]);

  const detailsTask = tasks.find((t) => t.id === detailsId) ?? null;

  // ---------- Task actions (stable references so memoized rows don't re-render) ----------
  const actions = useMemo(() => ({
    onToggle: (task) => {
      toggleComplete(task.id);
      notify(task.status === 'completed' ? `Reopened “${task.title}”` : `Completed “${task.title}”`);
    },
    onStatusChange: (task, status) => {
      updateTask(task.id, { status });
      notify(`“${task.title}” moved to ${STATUS_MAP[status].label}`);
    },
    onOpen: (task) => setDetailsId(task.id),
    onEdit: (task) => {
      setDetailsId(null);
      setForm({ task });
    },
    onDelete: (task) => {
      setDetailsId(null);
      setConfirm({
        title: 'Delete task?',
        message: `“${task.title}” and all of its notes will be permanently deleted.`,
        confirmLabel: 'Delete task',
        onConfirm: () => {
          deleteTask(task.id);
          notify('Task deleted');
        },
      });
    },
  }), [toggleComplete, updateTask, deleteTask, notify]);

  const openAddTask = useCallback(() => setForm({ defaultCategory: category?.id }), [category]);
  const closeForm = useCallback(() => setForm(null), []);
  const closeDetails = useCallback(() => setDetailsId(null), []);
  const closeConfirm = useCallback(() => setConfirm(null), []);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  const handleFormSubmit = (values) => {
    if (form.task) {
      updateTask(form.task.id, values);
      notify('Task updated');
    } else {
      addTask(values);
      notify('Task added');
    }
    setForm(null);
  };

  const handleDetailsSave = (id, changes) => {
    updateTask(id, changes);
    setDetailsId(null);
    notify('Task details saved');
  };

  const handleConfirm = () => {
    confirm.onConfirm();
    setConfirm(null);
  };

  const dataActions = {
    resetTasks: () => { resetTasks(); notify('Tasks reset to sample data'); },
    clearTasks: () => { clearTasks(); notify('All tasks cleared'); },
    clearReview: () => { setReview(EMPTY_REVIEW); notify('Weekly review cleared'); },
  };

  const renderPage = () => {
    if (page === 'settings') {
      return (
        <SettingsPage
          theme={theme}
          onThemeChange={setTheme}
          profile={profile}
          onSaveProfile={(next) => { setProfile(next); notify('Profile updated'); }}
          taskCount={tasks.length}
          onConfirm={setConfirm}
          dataActions={dataActions}
        />
      );
    }
    if (page === 'category') {
      return (
        <CategoryPage
          key={category.id} // reset filters when switching category
          category={categoryProgress.find((c) => c.id === category.id)}
          tasks={tasks.filter((t) => t.category === category.id)}
          actions={actions}
          onAddTask={openAddTask}
        />
      );
    }
    return (
      <Dashboard
        tasks={tasks}
        stats={stats}
        categoryProgress={categoryProgress}
        week={week}
        actions={actions}
        onAddTask={openAddTask}
        review={review}
        onSaveReview={(next) => { setReview(next); notify('Weekly review saved'); }}
      />
    );
  };

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow">
        Skip to content
      </a>

      <Sidebar
        route={page === 'overview' ? 'overview' : route}
        categoryProgress={categoryProgress}
        profileName={profile.name}
        overallRate={stats.rate}
        mobileOpen={mobileNavOpen}
        onCloseMobile={closeMobileNav}
      />

      <div className="lg:pl-64">
        <Header
          title={meta.title}
          description={meta.description}
          week={week}
          onOpenMenu={() => setMobileNavOpen(true)}
          onAddTask={openAddTask}
          resolvedTheme={resolvedTheme}
          onToggleTheme={toggleTheme}
        />
        <main id="main" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {renderPage()}
        </main>
      </div>

      {form && (
        <TaskFormModal
          task={form.task}
          defaultCategory={form.defaultCategory}
          existingTasks={tasks}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
        />
      )}
      {detailsTask && (
        <TaskDetailsModal
          key={detailsTask.id}
          task={detailsTask}
          onSave={handleDetailsSave}
          onEdit={actions.onEdit}
          onDelete={actions.onDelete}
          onClose={closeDetails}
        />
      )}
      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          onConfirm={handleConfirm}
          onCancel={closeConfirm}
        />
      )}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
