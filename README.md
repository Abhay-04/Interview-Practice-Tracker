# Interview Practice Tracker

A responsive dashboard for students tracking their weekly interview preparation across four areas: **DSA**, **Git & GitHub**, **Full Stack Technical**, and **Machine Coding**. Built as a frontend machine coding challenge (2.5 hours, no backend).

## Features

- **Dashboard overview**: live stats (total, completed, pending, completion rate), per-category progress bars, a weekly completion ring, and an "Up next" list of the most urgent open tasks.
- **Task management**: add, edit, delete (with confirmation), and complete tasks. Change status inline (Not Started / In Progress / Completed).
- **Search, filter, sort**: search by title, filter by category and status, sort by due date, priority, or recently added. Completed tasks always sink to the bottom.
- **Category pages**: one page per category with its own progress summary and pre-filtered task list. Machine Coding is presented as a 5-item project checklist.
- **Task details**: open any task to update status, save a URL (e.g. LeetCode submission), and write notes, "what I learned", and "concepts to revise".
- **Weekly review**: reflect on what you learned, topics to revise, biggest challenge, a 1–5 confidence level, and free-form notes.
- **Week awareness**: the prep week runs Sunday → Saturday. The header shows the current week, days left until the Saturday deadline, and this week's completion %. Overdue tasks are highlighted.
- **Light / dark / system theme**: toggle in the header, or choose in Settings. No flash of the wrong theme on load.
- **Settings**: display name, theme, reset to sample data, clear all tasks, clear weekly review. Every destructive action asks for confirmation.
- **Feedback states**: inline form validation, success/error toasts, empty states (no tasks / no search results), and a warning when saved data is corrupted.
- **Responsive and accessible**: fixed sidebar on desktop, slide-in drawer on mobile/tablet, semantic landmarks, labelled controls, keyboard support (Esc closes dialogs), and a skip link.

## Tech stack

| Concern     | Choice                                      |
| ----------- | ------------------------------------------- |
| UI          | React 19 (JavaScript, hooks)                |
| Build tool  | Vite                                        |
| Styling     | Tailwind CSS v4 (`@tailwindcss/vite`)       |
| Icons       | lucide-react                                |
| Persistence | Browser `localStorage`                      |
| Routing     | Tiny custom hash router (`useHashRoute`)    |

No backend, no state library, no chart library. Progress visuals are CSS bars and an SVG ring.

## Getting started

Requires Node.js 18+.

```bash
npm install       # install dependencies
npm run dev       # start dev server at http://localhost:5173
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

### Deploying

The app is a static site. On **Vercel** or **Netlify**, choose the Vite preset (build command `npm run build`, output directory `dist`). Routing uses URL hashes (`#/dsa`), so no rewrite rules are needed.

## Project structure

```
src/
  App.jsx                  # Root: wires hooks, derived stats, routing, and modals
  main.jsx                 # React entry
  index.css                # Tailwind import, theme tokens, shared utilities (card, btn, input…)
  hooks/
    useLocalStorage.js     # useState + safe localStorage read/validate/write
    useTasks.js            # Task state and the only functions that mutate it
    useTheme.js            # light/dark/system preference → <html class="dark">
    useHashRoute.js        # '#/dsa' → 'dsa'
    useToast.js            # Toast queue with auto-dismiss
  data/
    constants.js           # Categories, statuses, priorities, storage keys
    initialTasks.js        # Sample weekly assignment (due dates relative to the current week)
  utils/
    taskHelpers.js         # Create/validate/sanitize tasks, stats, filtering, sorting
    dateHelpers.js         # Week range, deadline text, overdue checks, formatting
  components/              # Reusable UI: Sidebar, Header, StatCard, ProgressBar, ProgressRing,
                           # ProgressOverview, TaskList, TaskCard, TaskFormModal,
                           # TaskDetailsModal, WeeklyReview, Modal, ConfirmDialog, Toast, …
  pages/
    Dashboard.jsx          # Overview page
    CategoryPage.jsx       # One page per category
    SettingsPage.jsx       # Theme, profile, data reset
```

## How persistence works

Four keys are stored in `localStorage`:

| Key           | Contents                                   |
| ------------- | ------------------------------------------ |
| `ipt:tasks`   | Array of task objects                      |
| `ipt:review`  | Weekly review answers                      |
| `ipt:theme`   | `"light"`, `"dark"` or `"system"`          |
| `ipt:profile` | `{ name }`                                 |

`useLocalStorage(key, initialValue, validate)` works like `useState`:

1. **Read once**, in a lazy `useState` initializer, on the first render.
2. **Validate** the parsed JSON. Each store has a sanitizer (`sanitizeTasks`, `sanitizeReview`, …) that repairs fields where it can and drops unusable items.
3. **Fall back** to defaults if the data is missing, unparseable, or the wrong shape. If the data was corrupted, the app shows an error toast instead of crashing.
4. **Write** on every change via `useEffect`. Write failures (quota exceeded, private mode) are caught, and the app keeps working in memory.

Statistics are **never stored**. They are always derived from the tasks array with `useMemo`, so they can't drift out of sync.

## Assumptions and limitations

- Single user, single browser. Data does not sync across devices or tabs, and clearing site data erases it.
- The prep week runs Sunday → Saturday, and Saturday is the deadline.
- Category progress is measured against the tasks currently in that category. The assignment targets (5 problems / 5 scenarios / 5 questions / 1 project) appear as labels.
- Sample due dates are generated relative to the week in which the data was first created (or last reset).
- Unchecking a completed task returns it to "Not Started".

## Future improvements

- Backend + auth for cross-device sync.
- Week history: archive each week's tasks and reviews and show trends over time.
- Export/import data as JSON.
- Drag-and-drop ordering and a Kanban view by status.
- Unit tests for `taskHelpers` / `dateHelpers` (Vitest) and component tests (React Testing Library).
- Reminder notifications before the Saturday deadline.
