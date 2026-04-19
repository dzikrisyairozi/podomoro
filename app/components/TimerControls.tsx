"use client";

import { TimerMode, TimerStatus } from "@/lib/useTimer";

interface TimerControlsProps {
  mode: TimerMode;
  status: TimerStatus;
  debug: boolean;
  onSwitchMode: (mode: TimerMode) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function TimerControls({
  mode,
  status,
  debug,
  onSwitchMode,
  onStart,
  onPause,
  onReset,
}: TimerControlsProps) {
  const isFocus = mode === "focus";
  const isRunning = status === "running";

  const focusLabel = debug ? "Focus (5s)" : "Focus (25m)";
  const breakLabel = debug ? "Break (5s)" : "Break (5m)";

  // Active segment styles
  const focusActiveClass = isFocus
    ? "bg-white dark:bg-neutral-700 text-rose-600 dark:text-rose-400 shadow-sm"
    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700/60";
  const breakActiveClass = !isFocus
    ? "bg-white dark:bg-neutral-700 text-teal-600 dark:text-teal-400 shadow-sm"
    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700/60";

  // Primary button styles based on mode
  const primaryButtonClass = isFocus
    ? "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 dark:bg-rose-500 dark:hover:bg-rose-600 dark:active:bg-rose-700 focus-visible:ring-rose-500 dark:focus-visible:ring-rose-400"
    : "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 dark:bg-teal-500 dark:hover:bg-teal-600 dark:active:bg-teal-700 focus-visible:ring-teal-500 dark:focus-visible:ring-teal-400";

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xs mx-auto">
      {/* Mode segmented control */}
      <div
        data-testid="mode-switch"
        role="group"
        aria-label="Timer mode"
        className="flex rounded-lg border border-neutral-200 dark:border-neutral-800
                   bg-neutral-100 dark:bg-neutral-800 p-1 gap-1 w-full"
      >
        <button
          data-testid="mode-focus"
          aria-pressed={isFocus}
          onClick={() => onSwitchMode("focus")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
                      focus-visible:ring-rose-500 dark:focus-visible:ring-rose-400
                      transition-colors duration-150 ${focusActiveClass}`}
        >
          {focusLabel}
        </button>

        <button
          data-testid="mode-break"
          aria-pressed={!isFocus}
          onClick={() => onSwitchMode("break")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
                      focus-visible:ring-rose-500 dark:focus-visible:ring-rose-400
                      transition-colors duration-150 ${breakActiveClass}`}
        >
          {breakLabel}
        </button>
      </div>

      {/* Start / Pause button */}
      <button
        data-testid="start-pause-button"
        aria-label={isRunning ? "Pause timer" : "Start timer"}
        onClick={isRunning ? onPause : onStart}
        className={`inline-flex items-center justify-center gap-2
                    w-full rounded-lg px-6 py-3 text-base font-semibold
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors duration-150 active:scale-[0.98]
                    ${primaryButtonClass}`}
      >
        {isRunning ? (
          <>
            {/* Pause icon */}
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25z"
                clipRule="evenodd"
              />
            </svg>
            Pause
          </>
        ) : (
          <>
            {/* Play icon */}
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
            Start
          </>
        )}
      </button>

      {/* Reset button */}
      <button
        data-testid="reset-button"
        aria-label="Reset timer"
        onClick={onReset}
        className="inline-flex items-center justify-center gap-2
                   w-full rounded-lg px-6 py-3 text-base font-medium
                   bg-transparent text-neutral-500 dark:text-neutral-400
                   border border-neutral-300 dark:border-neutral-700
                   hover:bg-neutral-100 dark:hover:bg-neutral-800
                   hover:text-neutral-700 dark:hover:text-neutral-300
                   active:bg-neutral-200 dark:active:bg-neutral-700
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                   focus-visible:ring-rose-500 dark:focus-visible:ring-rose-400
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-150 active:scale-[0.98]"
      >
        {/* Refresh/reset icon */}
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Reset
      </button>
    </div>
  );
}
