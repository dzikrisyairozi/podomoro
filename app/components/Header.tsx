"use client";

import DebugToggle from "@/components/DebugToggle";
import ThemeToggle from "@/components/ThemeToggle";

interface HeaderProps {
  debug: boolean;
  onDebugToggle: () => void;
}

export default function Header({ debug, onDebugToggle }: HeaderProps) {
  return (
    <header
      data-testid="header"
      className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 lg:px-8
                 bg-white dark:bg-neutral-900
                 border-b border-neutral-200 dark:border-neutral-800
                 shadow-sm"
    >
      {/* Wordmark */}
      <span
        className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100
                   select-none"
      >
        Podomoro
      </span>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <DebugToggle debug={debug} onToggle={onDebugToggle} />
        <ThemeToggle />
      </div>
    </header>
  );
}
