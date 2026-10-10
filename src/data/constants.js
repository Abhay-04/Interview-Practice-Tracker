export const STORAGE_KEYS = {
  tasks: 'ipt:tasks',
  review: 'ipt:review',
  theme: 'ipt:theme',
  profile: 'ipt:profile',
};

export const CATEGORIES = [
  {
    id: 'dsa',
    label: 'DSA Practice',
    shortLabel: 'DSA',
    target: '5 problems',
    description: 'Array problems on LeetCode. Solve each one, submit it, and save the submission link.',
    urlLabel: 'LeetCode submission URL',
    notesLabel: 'Approach & complexity notes',
  },
  {
    id: 'git',
    label: 'Git & GitHub',
    shortLabel: 'Git & GitHub',
    target: '5 scenarios',
    description: 'Real-world Git scenarios you should be able to explain and fix under interview pressure.',
    urlLabel: 'Reference URL',
    notesLabel: 'Interview notes (commands, reasoning)',
  },
  {
    id: 'fullstack',
    label: 'Full Stack Technical',
    shortLabel: 'Full Stack',
    target: '5 questions',
    description: 'Conceptual questions across JavaScript, React, Express, MongoDB and auth.',
    urlLabel: 'Reference URL',
    notesLabel: 'Revision notes',
  },
  {
    id: 'machine-coding',
    label: 'Machine Coding',
    shortLabel: 'Machine Coding',
    target: '1 project',
    description: 'Build, ship, and document one complete project. Each step is tracked as a checklist item.',
    urlLabel: 'Repository / live URL',
    notesLabel: 'Notes',
  },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export const STATUSES = [
  { id: 'not-started', label: 'Not Started' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
];

export const STATUS_MAP = Object.fromEntries(STATUSES.map((s) => [s.id, s]));

export const PRIORITIES = [
  { id: 'high', label: 'High', rank: 3 },
  { id: 'medium', label: 'Medium', rank: 2 },
  { id: 'low', label: 'Low', rank: 1 },
];

export const PRIORITY_MAP = Object.fromEntries(PRIORITIES.map((p) => [p.id, p]));

export const SORT_OPTIONS = [
  { id: 'dueDate', label: 'Due date' },
  { id: 'priority', label: 'Priority' },
  { id: 'recent', label: 'Recently added' },
];
