"use client";

import { TimerMode } from "@/lib/useTimer";
import { formatMMSS, formatAriaRemaining } from "@/lib/format";

// Ring geometry: r=54, circumference = 2 * π * 54 ≈ 339.29
const CIRCUMFERENCE = 2 * Math.PI * 54; // 339.29

interface TimerDisplayProps {
  mode: TimerMode;
  remaining: number;
  progress: number; // 0.0 (empty) to 1.0 (full)
}

export default function TimerDisplay({ mode, remaining, progress }: TimerDisplayProps) {
  const isFocus = mode === "focus";
  const strokeOffset = CIRCUMFERENCE * (1 - progress);

  const modeLabel = isFocus ? "Focus" : "Break";
  const modeLabelClass = isFocus
    ? "text-rose-600 dark:text-rose-400"
    : "text-teal-600 dark:text-teal-400";
  const strokeClass = isFocus
    ? "stroke-rose-600 dark:stroke-rose-400"
    : "stroke-teal-600 dark:stroke-teal-400";

  return (
    <section className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* Mode label — live region for screen readers */}
      <p
        data-testid="mode-label"
        aria-live="polite"
        aria-atomic="true"
        className={`text-sm font-semibold uppercase tracking-widest ${modeLabelClass}`}
      >
        {modeLabel}
      </p>

      {/* Progress ring + timer digits */}
      <div
        data-testid="timer-ring"
        className="relative flex items-center justify-center w-64 h-64 lg:w-72 lg:h-72"
      >
        {/* SVG ring (decorative) */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 120 120"
        >
          {/* Track circle */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            strokeWidth="6"
            className="stroke-neutral-200 dark:stroke-neutral-700"
          />
          {/* Progress arc */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className={`${strokeClass} transition-all duration-500 ease-linear`}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeOffset}
          />
        </svg>

        {/* Timer digits */}
        <span
          data-testid="timer-digits"
          aria-label={formatAriaRemaining(remaining)}
          className="relative z-10 tabular-nums font-mono
                     text-7xl lg:text-8xl font-bold
                     text-neutral-900 dark:text-neutral-100
                     tracking-tight leading-none select-none"
        >
          {formatMMSS(remaining)}
        </span>
      </div>
    </section>
  );
}
