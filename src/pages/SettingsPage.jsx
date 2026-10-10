import { useState } from 'react';
import { Eraser, Monitor, Moon, RotateCcw, Sun, Trash2 } from 'lucide-react';

const THEME_OPTIONS = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

function SettingsSection({ title, description, children }) {
  return (
    <section className="card">
      <div className="border-b border-zinc-200 p-5 dark:border-zinc-800">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function DangerRow({ title, description, buttonLabel, icon: Icon, onClick }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
      <button type="button" onClick={onClick} className="btn-secondary shrink-0 text-red-600 hover:text-red-700 dark:text-red-400">
        <Icon className="size-4" aria-hidden="true" /> {buttonLabel}
      </button>
    </div>
  );
}

export default function SettingsPage({ theme, onThemeChange, profile, onSaveProfile, taskCount, onConfirm, dataActions }) {
  const [name, setName] = useState(profile.name);
  const [nameError, setNameError] = useState('');

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setNameError('Name cannot be empty.');
    if (trimmed.length > 40) return setNameError('Name must be 40 characters or fewer.');
    setNameError('');
    onSaveProfile({ name: trimmed });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <SettingsSection title="Appearance" description="Choose a theme. System follows your device setting.">
        <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-2 sm:max-w-md">
          {THEME_OPTIONS.map(({ id, label, icon: Icon }) => {
            const selected = theme === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onThemeChange(id)}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                  selected
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-300'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </SettingsSection>

      <SettingsSection title="Profile" description="Shown in the sidebar. Stored only in this browser.">
        <form onSubmit={handleProfileSubmit} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1 sm:max-w-sm">
            <label htmlFor="profile-name" className="sr-only">Display name</label>
            <input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`input ${nameError ? 'input-error' : ''}`}
              placeholder="Your name"
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? 'profile-name-error' : undefined}
            />
            {nameError && <p id="profile-name-error" className="field-error">{nameError}</p>}
          </div>
          <button type="submit" className="btn-primary" disabled={name.trim() === profile.name}>Save name</button>
        </form>
      </SettingsSection>

      <SettingsSection
        title="Data"
        description={`Everything is saved in this browser’s localStorage. You currently have ${taskCount} ${taskCount === 1 ? 'task' : 'tasks'}.`}
      >
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          <DangerRow
            title="Reset to sample data"
            description="Replace all tasks with the original weekly assignment. Your task notes will be lost."
            buttonLabel="Reset tasks"
            icon={RotateCcw}
            onClick={() => onConfirm({
              title: 'Reset to sample data?',
              message: 'All current tasks, statuses and task notes will be replaced with the sample weekly assignment. This cannot be undone.',
              confirmLabel: 'Reset tasks',
              onConfirm: dataActions.resetTasks,
            })}
          />
          <DangerRow
            title="Clear all tasks"
            description="Remove every task, including sample data, and start from an empty board."
            buttonLabel="Clear tasks"
            icon={Trash2}
            onClick={() => onConfirm({
              title: 'Clear all tasks?',
              message: `This permanently deletes all ${taskCount} tasks. This cannot be undone.`,
              confirmLabel: 'Clear tasks',
              onConfirm: dataActions.clearTasks,
            })}
          />
          <DangerRow
            title="Clear weekly review"
            description="Erase your weekly reflection answers and confidence level."
            buttonLabel="Clear review"
            icon={Eraser}
            onClick={() => onConfirm({
              title: 'Clear weekly review?',
              message: 'Your weekly review answers will be erased. This cannot be undone.',
              confirmLabel: 'Clear review',
              onConfirm: dataActions.clearReview,
            })}
          />
        </div>
      </SettingsSection>
    </div>
  );
}
