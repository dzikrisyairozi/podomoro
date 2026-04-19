"use client";

interface DebugToggleProps {
  debug: boolean;
  onToggle: () => void;
}

export default function DebugToggle({ debug, onToggle }: DebugToggleProps) {
  return (
    <button
      data-testid="debug-toggle"
      aria-label="Toggle debug mode"
      aria-pressed={debug}
      onClick={onToggle}
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        "border",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:ring-rose-500 dark:focus-visible:ring-rose-400",
        "transition-colors duration-150 cursor-pointer",
        debug
          ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700"
          : "border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700",
      ].join(" ")}
    >
      {debug ? "Debug: 5s" : "Normal: 25m/5m"}
    </button>
  );
}
