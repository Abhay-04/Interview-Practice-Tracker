import { createTask } from '../utils/taskHelpers';
import { addDays, getWeekRange, toISODate } from '../utils/dateHelpers';

// [title, priority, dayOffset from Sunday, status, extra fields]
const SEED = {
  dsa: [
    ['Two Sum', 'medium', 1, 'completed', { url: 'https://leetcode.com/problems/two-sum/', notes: 'Hash map of value → index. O(n) time, O(n) space.' }],
    ['Remove Duplicates from Sorted Array', 'medium', 2, 'completed'],
    ['Move Zeroes', 'medium', 3, 'in-progress'],
    ['Rotate Array', 'medium', 4, 'not-started'],
    ['3Sum', 'high', 5, 'not-started'],
  ],
  git: [
    ['Wrong Branch, Correct Work', 'medium', 1, 'completed', { notes: 'git stash → git switch correct-branch → git stash pop. If already committed: cherry-pick, then reset the wrong branch.' }],
    ['Merge Conflict During PR', 'high', 2, 'completed'],
    ['Secret Accidentally Committed', 'high', 3, 'in-progress', { notes: 'Rotate the secret first. Then remove it from history (git filter-repo) and force-push.' }],
    ['PR Review With New Changes', 'medium', 4, 'not-started'],
    ['Recovering Lost Local Work', 'medium', 5, 'not-started'],
  ],
  fullstack: [
    ['JavaScript Event Loop and Async Flow', 'high', 2, 'completed'],
    ['React Unnecessary Re-renders', 'high', 3, 'in-progress'],
    ['Express Protected API and 401 Errors', 'medium', 4, 'not-started'],
    ['MongoDB Duplicate Registration', 'medium', 5, 'not-started'],
    ['Authentication, Authorization and ImageKit', 'medium', 5, 'not-started'],
  ],
  'machine-coding': [
    ['Build Interview Practice Tracker', 'high', 6, 'in-progress'],
    ['Push Code to GitHub', 'high', 6, 'not-started'],
    ['Deploy Live Project', 'high', 6, 'not-started'],
    ['Record a 1–2 Minute Demo', 'medium', 6, 'not-started'],
    ['Complete README Documentation', 'medium', 6, 'not-started'],
  ],
};

/** Builds sample tasks with due dates inside the current Sunday → Saturday week. */
export function createInitialTasks(today = new Date()) {
  const { start } = getWeekRange(today);
  return Object.entries(SEED).flatMap(([category, rows]) =>
    rows.map(([title, priority, offset, status, extra = {}]) =>
      createTask({ title, category, priority, status, dueDate: toISODate(addDays(start, offset)), ...extra }),
    ),
  );
}
