import { useEffect } from 'react';
import { CheckCheck, Code2, GitBranch, Hammer, LayoutDashboard, Layers, Settings, X } from 'lucide-react';

export const NAV_ITEMS = [
  { route: 'overview', label: 'Overview', icon: LayoutDashboard },
  { route: 'dsa', label: 'DSA Practice', icon: Code2 },
  { route: 'git', label: 'Git & GitHub', icon: GitBranch },
  { route: 'fullstack', label: 'Full Stack Technical', icon: Layers },
  { route: 'machine-coding', label: 'Machine Coding', icon: Hammer },
  { route: 'settings', label: 'Settings', icon: Settings },
];

function getInitials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'S';
}

function SidebarContent({ route, categoryProgress, profileName, overallRate, onNavigate }) {
  const progressById = Object.fromEntries(categoryProgress.map((c) => [c.id, c]));

  return (
    <div className="flex h-full flex-col">
      <a href="#/" onClick={onNavigate} className="flex h-16 items-center gap-2.5 px-5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white dark:bg-indigo-500">
          <CheckCheck className="size-4.5" aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold tracking-tight">Interview Tracker</span>
      </a>

      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ route: itemRoute, label, icon: Icon }) => {
            const active = route === itemRoute;
            const progress = progressById[itemRoute];
            return (
              <li key={itemRoute}>
                <a
                  href={itemRoute === 'overview' ? '#/' : `#/${itemRoute}`}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                      : 'text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100'
                  }`}
                >
                  <Icon className={`size-4 shrink-0 ${active ? 'text-indigo-600 dark:text-indigo-400' : ''}`} aria-hidden="true" />
                  <span className="flex-1 truncate">{label}</span>
                  {progress && (
                    <span className="text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
                      {progress.completed}/{progress.total}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <a
        href="#/settings"
        onClick={onNavigate}
        className="m-3 flex items-center gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
          {getInitials(profileName)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{profileName}</span>
          <span className="block text-xs text-zinc-500 dark:text-zinc-400">{overallRate}% of all tasks done</span>
        </span>
      </a>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onCloseMobile, ...props }) {
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKeyDown = (event) => event.key === 'Escape' && onCloseMobile();
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen, onCloseMobile]);

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-zinc-200 bg-white lg:block dark:border-zinc-800 dark:bg-zinc-900">
        <SidebarContent {...props} />
      </aside>

      {/* Mobile / tablet: slide-in drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-zinc-950/50 motion-safe:animate-fade-in" onClick={onCloseMobile} aria-hidden="true" />
          <aside className="relative h-full w-72 max-w-[85vw] border-r border-zinc-200 bg-white shadow-xl motion-safe:animate-slide-in-left dark:border-zinc-800 dark:bg-zinc-900">
            <button type="button" onClick={onCloseMobile} className="icon-btn absolute top-4 right-3" aria-label="Close navigation">
              <X className="size-4" />
            </button>
            <SidebarContent {...props} onNavigate={onCloseMobile} />
          </aside>
        </div>
      )}
    </>
  );
}
