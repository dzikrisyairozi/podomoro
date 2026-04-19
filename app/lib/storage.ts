/**
 * JSON file-based session storage.
 *
 * All I/O is serialized through a simple in-process mutex (a Promise chain)
 * so that concurrent POST requests cannot interleave reads and writes.
 *
 * Timezone note: `getSessionsForToday` uses the **server's local timezone**
 * to determine "today". This is intentional for MVP — all users are local.
 */

import fs from "fs/promises";
import path from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Session = {
  id: string;
  mode: "focus" | "break";
  durationSeconds: number;
  completedAt: string;
};

type StorageFile = {
  sessions: Session[];
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "sessions.json");
const TMP_PATH = path.join(DATA_DIR, "sessions.json.tmp");

const EMPTY_STORE: StorageFile = { sessions: [] };

// ---------------------------------------------------------------------------
// In-process mutex
// ---------------------------------------------------------------------------

let mutex: Promise<void> = Promise.resolve();

function withMutex<T>(fn: () => Promise<T>): Promise<T> {
  const result = mutex.then(fn);
  // The mutex tail only resolves/rejects after fn resolves/rejects, so
  // subsequent callers always queue behind the current operation.
  mutex = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

// ---------------------------------------------------------------------------
// Low-level helpers (called from within the mutex)
// ---------------------------------------------------------------------------

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readFile(): Promise<StorageFile> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(FILE_PATH, "utf-8");
    return JSON.parse(raw) as StorageFile;
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      // First access — create the file and return empty store.
      await writeFile(EMPTY_STORE);
      return { ...EMPTY_STORE, sessions: [] };
    }
    throw err;
  }
}

async function writeFile(store: StorageFile): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(TMP_PATH, JSON.stringify(store, null, 2), "utf-8");
  await fs.rename(TMP_PATH, FILE_PATH);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns all sessions stored in the JSON file.
 * Creates the file with an empty store if it does not exist.
 */
export async function readAllSessions(): Promise<Session[]> {
  return withMutex(async () => {
    const store = await readFile();
    return store.sessions;
  });
}

/**
 * Appends a new session to the store and returns the persisted session.
 * `id` and `completedAt` are always generated server-side.
 */
export async function appendSession(
  input: Omit<Session, "id" | "completedAt"> & { completedAt?: string },
): Promise<Session> {
  return withMutex(async () => {
    const store = await readFile();

    const session: Session = {
      id: crypto.randomUUID(),
      mode: input.mode,
      durationSeconds: input.durationSeconds,
      completedAt: new Date().toISOString(),
    };

    store.sessions.push(session);
    await writeFile(store);
    return session;
  });
}

/**
 * Returns sessions whose `completedAt` timestamp falls on the same local
 * calendar day as `nowIso` (defaults to `new Date()` if not provided).
 *
 * Uses the **server's local timezone** — acceptable for a single-user MVP.
 */
export async function getSessionsForToday(
  nowIso?: string,
): Promise<Session[]> {
  const now = nowIso ? new Date(nowIso) : new Date();
  // Build a YYYY-MM-DD string in local time for "today".
  const todayLocal = localDateString(now);

  const all = await readAllSessions();
  return all
    .filter((s) => localDateString(new Date(s.completedAt)) === todayLocal)
    .reverse(); // newest first (sessions are appended in chronological order)
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function localDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
