/**
 * Format helpers for the Podomoro timer app.
 */

/**
 * Formats seconds into MM:SS display string.
 * e.g. 1500 -> "25:00", 65 -> "01:05"
 */
export function formatMMSS(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Formats a duration in seconds to a human-readable label.
 * e.g. 1500 -> "25m", 300 -> "5m", 5 -> "5s"
 */
export function formatDurationLabel(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const m = Math.round(seconds / 60);
  return `${m}m`;
}

/**
 * Formats an ISO date string to HH:MM in the user's local timezone.
 * e.g. "2024-01-15T09:12:00.000Z" -> "09:12"
 */
export function formatHHMM(isoString: string): string {
  const date = new Date(isoString);
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Formats remaining seconds into an aria-label string.
 * e.g. 1500 -> "25 minutes 0 seconds remaining"
 */
export function formatAriaRemaining(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const parts: string[] = [];
  if (m > 0) parts.push(`${m} ${m === 1 ? "minute" : "minutes"}`);
  parts.push(`${s} ${s === 1 ? "second" : "seconds"}`);
  return `${parts.join(" ")} remaining`;
}
