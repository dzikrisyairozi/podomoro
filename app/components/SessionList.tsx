"use client";

import { Session } from "@/lib/useSessions";
import { formatHHMM, formatDurationLabel } from "@/lib/format";

interface SessionListProps {
  sessions: Session[];
  loading: boolean;
  error: string | null;
}

export default function SessionList({ sessions, loading, error }: SessionListProps) {
  return (
    <aside
      aria-label="Today's sessions"
      className="w-full lg:w-72 lg:flex-shrink-0"
    >
      <h2
        className="text-sm font-semibold uppercase tracking-widest
                   text-neutral-500 dark:text-neutral-400 mb-3"
      >
        Today&apos;s Sessions
      </h2>

      <ul data-testid="session-list" className="flex flex-col gap-2">
        {loading ? (
          // Loading skeleton — 3 rows
          <>
            {[0, 1, 2].map((i) => (
              <li
                key={i}
                className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg h-12"
                aria-hidden="true"
              />
            ))}
          </>
        ) : error ? (
          // Error state
          <li
            className="flex flex-col items-center justify-center
                       rounded-lg border border-dashed border-red-300 dark:border-red-700
                       bg-transparent px-4 py-8 text-center"
          >
            <p className="text-sm text-red-500 dark:text-red-400">
              Failed to load sessions.
            </p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
              {error}
            </p>
          </li>
        ) : sessions.length === 0 ? (
          // Empty state
          <li
            data-testid="session-empty"
            className="flex flex-col items-center justify-center
                       rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700
                       bg-transparent px-4 py-8 text-center"
          >
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              No sessions yet today.
            </p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
              Start one!
            </p>
          </li>
        ) : (
          // Session items
          sessions.map((session) => {
            const isFocus = session.mode === "focus";
            const badgeClass = isFocus
              ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
              : "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300";
            const badgeLabel = isFocus ? "Focus" : "Break";

            return (
              <li
                key={session.id}
                data-testid="session-item"
                className="flex items-center justify-between
                           rounded-lg border border-neutral-200 dark:border-neutral-800
                           bg-white dark:bg-neutral-900
                           px-4 py-3 text-sm shadow-sm"
              >
                {/* Left: mode badge + time */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5
                                text-xs font-medium ${badgeClass}`}
                  >
                    {badgeLabel}
                  </span>
                  <time
                    dateTime={session.completedAt}
                    className="text-neutral-500 dark:text-neutral-400 tabular-nums"
                  >
                    {formatHHMM(session.completedAt)}
                  </time>
                </div>

                {/* Right: duration */}
                <span className="text-neutral-700 dark:text-neutral-300 tabular-nums font-medium">
                  {formatDurationLabel(session.durationSeconds)}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </aside>
  );
}
