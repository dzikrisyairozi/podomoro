"use client";

import { useState, useEffect, useCallback } from "react";

export interface Session {
  id: string;
  mode: "focus" | "break";
  durationSeconds: number;
  completedAt: string;
}

export interface UseSessionsReturn {
  sessions: Session[];
  loading: boolean;
  error: string | null;
  postSession: (mode: "focus" | "break", durationSeconds: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useSessions(): UseSessionsReturn {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sessions", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { sessions: Session[] };
      setSessions(data.sessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const postSession = useCallback(
    async (mode: "focus" | "break", durationSeconds: number) => {
      try {
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode, durationSeconds }),
        });
        if (!res.ok) {
          const err = await res.json() as { error: string };
          throw new Error(err.error ?? `HTTP ${res.status}`);
        }
        const newSession = await res.json() as Session;
        // Optimistically prepend the new session (API returns newest first)
        setSessions((prev) => [newSession, ...prev]);
      } catch (err) {
        // Don't surface post errors to the user as a blocking error —
        // the session will still appear on next reload.
        console.error("Failed to post session:", err);
      }
    },
    [],
  );

  return {
    sessions,
    loading,
    error,
    postSession,
    refetch: fetchSessions,
  };
}
