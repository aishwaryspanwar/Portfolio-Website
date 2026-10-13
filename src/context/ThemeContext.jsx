import { useCallback, useEffect, useState } from 'react';
import { ThemeContext } from './theme';

const STORAGE_KEY = 'theme';
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' || stored === 'light' ? stored : null;
  } catch {
    return null;
  }
}

export function ThemeProvider({ children }) {
  // An explicit choice wins; otherwise follow the operating system.
  const [theme, setTheme] = useState(
    () => readStoredTheme() ?? (darkQuery().matches ? 'dark' : 'light')
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const query = darkQuery();
    const handleChange = (e) => {
      if (!readStoredTheme()) setTheme(e.matches ? 'dark' : 'light');
    };
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Storage unavailable (private mode); the toggle still works for this visit.
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
