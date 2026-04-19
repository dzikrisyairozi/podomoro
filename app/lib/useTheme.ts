"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "podomoro:theme";

type Theme = "light" | "dark";

/**
 * Custom hook for theme state.
 * Persists to localStorage under 'podomoro:theme' ("light" | "dark").
 * Syncs with the 'dark' class on <html>.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");

  // Read the current actual theme from the DOM on mount
  // (the inline flash-prevention script already set it)
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore localStorage errors
      }
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
