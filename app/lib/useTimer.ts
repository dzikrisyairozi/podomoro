"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type TimerMode = "focus" | "break";
export type TimerStatus = "idle" | "running" | "paused";

// Normal durations
const NORMAL_FOCUS_SECONDS = 1500; // 25 minutes
const NORMAL_BREAK_SECONDS = 300;  // 5 minutes
// Debug durations
const DEBUG_SECONDS = 5;

export interface UseTimerOptions {
  debug: boolean;
  onComplete: (mode: TimerMode, durationSeconds: number) => void;
}

export interface UseTimerReturn {
  mode: TimerMode;
  status: TimerStatus;
  remaining: number; // seconds remaining
  totalDuration: number; // full configured duration for current mode
  progress: number; // 0.0 (empty) to 1.0 (full)
  switchMode: (newMode: TimerMode) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

function getDuration(mode: TimerMode, debug: boolean): number {
  if (debug) return DEBUG_SECONDS;
  return mode === "focus" ? NORMAL_FOCUS_SECONDS : NORMAL_BREAK_SECONDS;
}

export function useTimer({ debug, onComplete }: UseTimerOptions): UseTimerReturn {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [remaining, setRemaining] = useState(() => getDuration("focus", debug));

  // Track the duration for the current mode
  const totalDuration = getDuration(mode, debug);

  // Refs for accurate tick logic using Date.now() diffing
  const startTimeRef = useRef<number | null>(null); // when the current run started
  const remainingAtStartRef = useRef<number>(remaining); // remaining seconds when run started
  const rafRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Cancel any running animation frame
  const cancelTick = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // Tick function — computes remaining from Date.now() diff
  const tick = useCallback(() => {
    if (startTimeRef.current === null) return;

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const newRemaining = Math.max(0, remainingAtStartRef.current - elapsed);
    const rounded = Math.ceil(newRemaining);

    setRemaining(rounded);

    if (newRemaining <= 0) {
      // Timer completed
      setStatus("idle");
      startTimeRef.current = null;
      return; // don't schedule next frame
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // When debug changes, reset + pause immediately
  useEffect(() => {
    cancelTick();
    setStatus("idle");
    startTimeRef.current = null;
    const dur = getDuration(mode, debug);
    remainingAtStartRef.current = dur;
    setRemaining(dur);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debug]);

  // When remaining hits 0 and status transitions to idle from running, call onComplete
  const prevStatusRef = useRef<TimerStatus>("idle");
  const prevRemainingRef = useRef<number>(remaining);
  useEffect(() => {
    if (
      prevStatusRef.current === "running" &&
      status === "idle" &&
      prevRemainingRef.current > 0 &&
      remaining === 0
    ) {
      // Timer just completed
      const dur = getDuration(mode, debug);
      onCompleteRef.current(mode, dur);
      // Reset to full duration
      const newDur = getDuration(mode, debug);
      remainingAtStartRef.current = newDur;
      setRemaining(newDur);
    }
    prevStatusRef.current = status;
    prevRemainingRef.current = remaining;
  }, [status, remaining, mode, debug]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelTick();
    };
  }, [cancelTick]);

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      cancelTick();
      setStatus("idle");
      setMode(newMode);
      startTimeRef.current = null;
      const dur = getDuration(newMode, debug);
      remainingAtStartRef.current = dur;
      setRemaining(dur);
    },
    [cancelTick, debug],
  );

  const start = useCallback(() => {
    setStatus("running");
    startTimeRef.current = Date.now();
    remainingAtStartRef.current = remaining;
    cancelTick();
    rafRef.current = requestAnimationFrame(tick);
  }, [cancelTick, remaining, tick]);

  const pause = useCallback(() => {
    cancelTick();
    setStatus("paused");
    startTimeRef.current = null;
  }, [cancelTick]);

  const reset = useCallback(() => {
    cancelTick();
    setStatus("idle");
    startTimeRef.current = null;
    const dur = getDuration(mode, debug);
    remainingAtStartRef.current = dur;
    setRemaining(dur);
  }, [cancelTick, mode, debug]);

  const progress = totalDuration > 0 ? remaining / totalDuration : 1;

  return {
    mode,
    status,
    remaining,
    totalDuration,
    progress,
    switchMode,
    start,
    pause,
    reset,
  };
}
