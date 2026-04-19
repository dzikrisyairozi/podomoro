"use client";

import { useCallback } from "react";
import { useTimer } from "@/lib/useTimer";
import { useSessions } from "@/lib/useSessions";
import TimerDisplay from "@/components/TimerDisplay";
import TimerControls from "@/components/TimerControls";
import SessionList from "@/components/SessionList";

interface TimerProps {
  debug: boolean;
}

export default function Timer({ debug }: TimerProps) {
  const { sessions, loading, error, postSession } = useSessions();

  const handleComplete = useCallback(
    async (mode: "focus" | "break", durationSeconds: number) => {
      // Request browser notification if permission granted
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Podomoro", {
            body: `${mode === "focus" ? "Focus" : "Break"} session complete!`,
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((perm) => {
            if (perm === "granted") {
              new Notification("Podomoro", {
                body: `${mode === "focus" ? "Focus" : "Break"} session complete!`,
              });
            }
          });
        }
      }

      // POST the completed session
      await postSession(mode, durationSeconds);
    },
    [postSession],
  );

  const timer = useTimer({ debug, onComplete: handleComplete });

  return (
    <>
      {/* Timer section — left column on desktop */}
      <div className="flex flex-col items-center gap-8 flex-1">
        <TimerDisplay
          mode={timer.mode}
          remaining={timer.remaining}
          progress={timer.progress}
        />
        <TimerControls
          mode={timer.mode}
          status={timer.status}
          debug={debug}
          onSwitchMode={timer.switchMode}
          onStart={timer.start}
          onPause={timer.pause}
          onReset={timer.reset}
        />
      </div>

      {/* Session list — right column on desktop */}
      <SessionList sessions={sessions} loading={loading} error={error} />
    </>
  );
}
