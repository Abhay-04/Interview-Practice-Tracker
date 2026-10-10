import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ resolvedTheme, onToggle }) {
  const isDark = resolvedTheme === 'dark';
  return (
    <button
      type="button"
      onClick={onToggle}
      className="icon-btn size-9"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
