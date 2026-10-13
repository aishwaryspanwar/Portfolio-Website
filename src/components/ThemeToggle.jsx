import { useTheme } from '../context/theme';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="pointer-events-auto mt-2 inline-flex items-center gap-1.5 opacity-70 transition-opacity hover:opacity-100"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <circle cx="5" cy="5" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 0.75a4.25 4.25 0 0 1 0 8.5z" fill="currentColor" />
      </svg>
      {isDark ? 'Light' : 'Dark'}
    </button>
  );
}

export default ThemeToggle;
