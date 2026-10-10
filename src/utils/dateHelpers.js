// Dates are stored as local 'YYYY-MM-DD' strings so they never shift with time zones.

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  // Reject impossible dates like 2026-02-31 (JS would roll them over).
  return date.getMonth() === m - 1 ? date : null;
}

export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** The prep week runs Sunday → Saturday, with Saturday as the deadline. */
export function getWeekRange(today = new Date()) {
  const start = addDays(startOfDay(today), -today.getDay());
  return { start, end: addDays(start, 6) };
}

export function daysBetween(from, to) {
  return Math.round((startOfDay(to) - startOfDay(from)) / 86_400_000);
}

export function formatShortDate(dateOrIso) {
  const date = typeof dateOrIso === 'string' ? parseISODate(dateOrIso) : dateOrIso;
  if (!date) return '';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatWeekRange({ start, end }) {
  return `${formatShortDate(start)} – ${formatShortDate(end)}`;
}

export function describeDeadline(deadline, today = new Date()) {
  const days = daysBetween(today, deadline);
  if (days < 0) return 'Deadline passed';
  if (days === 0) return 'Due today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}

export function isOverdue(isoDate, today = new Date()) {
  const date = parseISODate(isoDate);
  return Boolean(date) && daysBetween(today, date) < 0;
}
