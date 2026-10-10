import { CATEGORIES, CATEGORY_MAP, PRIORITY_MAP, STATUS_MAP } from '../data/constants';
import { parseISODate } from './dateHelpers';

export function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const asString = (value) => (typeof value === 'string' ? value : '');

export function createTask(fields) {
  const now = Date.now();
  return {
    id: createId(),
    title: fields.title.trim(),
    category: fields.category,
    priority: fields.priority || 'medium',
    status: fields.status || 'not-started',
    dueDate: fields.dueDate || '',
    url: asString(fields.url).trim(),
    notes: asString(fields.notes),
    learned: asString(fields.learned),
    revise: asString(fields.revise),
    createdAt: now,
    updatedAt: now,
  };
}

/** Coerce one stored task into a valid shape, or return null if it is unusable. */
export function sanitizeTask(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (typeof raw.title !== 'string' || !raw.title.trim()) return null;
  if (!CATEGORY_MAP[raw.category]) return null;

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : createId(),
    title: raw.title.trim(),
    category: raw.category,
    priority: PRIORITY_MAP[raw.priority] ? raw.priority : 'medium',
    status: STATUS_MAP[raw.status] ? raw.status : 'not-started',
    dueDate: parseISODate(raw.dueDate) ? raw.dueDate : '',
    url: asString(raw.url),
    notes: asString(raw.notes),
    learned: asString(raw.learned),
    revise: asString(raw.revise),
    createdAt: Number.isFinite(raw.createdAt) ? raw.createdAt : Date.now(),
    updatedAt: Number.isFinite(raw.updatedAt) ? raw.updatedAt : Date.now(),
  };
}

/** Validator for useLocalStorage: returns undefined when the stored value is not a task array. */
export function sanitizeTasks(value) {
  if (!Array.isArray(value)) return undefined;
  return value.map(sanitizeTask).filter(Boolean);
}

export function isValidUrl(value) {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateTask(values, existingTasks = [], editingId = null) {
  const errors = {};
  const title = values.title.trim();

  if (!title) errors.title = 'Title is required.';
  else if (title.length < 3) errors.title = 'Title must be at least 3 characters.';
  else if (title.length > 120) errors.title = 'Title must be 120 characters or fewer.';
  else {
    const duplicate = existingTasks.some(
      (t) => t.id !== editingId && t.category === values.category && t.title.toLowerCase() === title.toLowerCase(),
    );
    if (duplicate) errors.title = 'A task with this title already exists in this category.';
  }

  if (!CATEGORY_MAP[values.category]) errors.category = 'Choose a category.';
  if (!values.dueDate) errors.dueDate = 'Due date is required.';
  else if (!parseISODate(values.dueDate)) errors.dueDate = 'Enter a valid date.';
  if (values.url?.trim() && !isValidUrl(values.url.trim())) errors.url = 'Enter a full URL starting with http:// or https://';

  return errors;
}

// ---------- Derived statistics (never stored, always computed from tasks) ----------

export function percent(part, whole) {
  return whole === 0 ? 0 : Math.round((part / whole) * 100);
}

export function getStats(tasks) {
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  return {
    total: tasks.length,
    completed,
    inProgress,
    pending: tasks.length - completed,
    rate: percent(completed, tasks.length),
  };
}

export function getProgressStatus(items) {
  if (items.length === 0) return 'empty';
  const completed = items.filter((t) => t.status === 'completed').length;
  if (completed === items.length) return 'completed';
  if (completed > 0 || items.some((t) => t.status === 'in-progress')) return 'in-progress';
  return 'not-started';
}

export function getCategoryProgress(tasks) {
  return CATEGORIES.map((category) => {
    const items = tasks.filter((t) => t.category === category.id);
    const completed = items.filter((t) => t.status === 'completed').length;
    return {
      ...category,
      total: items.length,
      completed,
      percent: percent(completed, items.length),
      status: getProgressStatus(items),
    };
  });
}

export function getTasksDueInWeek(tasks, { start, end }) {
  return tasks.filter((t) => {
    const due = parseISODate(t.dueDate);
    return due && due >= start && due <= end;
  });
}

// ---------- Filtering & sorting ----------

export function filterTasks(tasks, { search = '', category = 'all', status = 'all' }) {
  const query = search.trim().toLowerCase();
  return tasks.filter(
    (t) =>
      (category === 'all' || t.category === category) &&
      (status === 'all' || t.status === status) &&
      (!query || t.title.toLowerCase().includes(query)),
  );
}

// Tasks without a due date sort last.
const dueValue = (t) => parseISODate(t.dueDate)?.getTime() ?? Infinity;
const priorityValue = (t) => PRIORITY_MAP[t.priority]?.rank ?? 0;

const completedLast = (a, b) => (a.status === 'completed') - (b.status === 'completed');

const COMPARATORS = {
  dueDate: (a, b) => dueValue(a) - dueValue(b) || priorityValue(b) - priorityValue(a),
  priority: (a, b) => priorityValue(b) - priorityValue(a) || dueValue(a) - dueValue(b),
  recent: (a, b) => b.createdAt - a.createdAt,
};

export function sortTasks(tasks, sortBy = 'dueDate') {
  const compare = COMPARATORS[sortBy] ?? COMPARATORS.dueDate;
  // Copy first: Array.prototype.sort mutates, and React state must never be mutated.
  // Open work stays on top; completed tasks sink to the bottom.
  return [...tasks].sort((a, b) => completedLast(a, b) || compare(a, b));
}
