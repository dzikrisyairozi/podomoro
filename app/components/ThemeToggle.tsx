"use client";

import { useTheme } from "@/lib/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      data-testid="theme-toggle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className="inline-flex items-center justify-center w-9 h-9 rounded-md
                 text-neutral-600 dark:text-neutral-400
                 hover:bg-neutral-100 dark:hover:bg-neutral-800
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                 focus-visible:ring-rose-500 dark:focus-visible:ring-rose-400
                 transition-colors duration-150 cursor-pointer"
    >
      <span className="sr-only">Toggle theme</span>
      {isDark ? (
        // Sun icon — shown in dark mode; clicking switches to light
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        // Moon icon — shown in light mode; clicking switches to dark
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
