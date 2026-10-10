import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../data/constants';
import { useLocalStorage } from './useLocalStorage';

const THEMES = ['light', 'dark', 'system'];
const validateTheme = (value) => (THEMES.includes(value) ? value : undefined);
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

/** Theme preference ('light' | 'dark' | 'system') persisted, plus the resolved theme applied to <html>. */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.theme, 'system', validateTheme);
  const [systemDark, setSystemDark] = useState(() => darkQuery().matches);

  useEffect(() => {
    const query = darkQuery();
    const onChange = (event) => setSystemDark(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const resolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  return { theme, resolvedTheme, setTheme, toggleTheme };
}
