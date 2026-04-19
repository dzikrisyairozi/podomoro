"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "podomoro:debug";

/**
 * Custom hook for debug mode state.
 * Persists to localStorage under 'podomoro:debug' ("1" | "0").
 * When debug is on, timers run for 5 seconds instead of 25m/5m.
 */
export function useDebugMode() {
  const [debug, setDebugState] = useState(false);

  // Read from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setDebugState(stored === "1");
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const toggleDebug = useCallback(() => {
    setDebugState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // Ignore localStorage errors
      }
      return next;
    });
  }, []);

  return { debug, toggleDebug };
}
