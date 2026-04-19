import { NextRequest, NextResponse } from "next/server";
import { appendSession, getSessionsForToday } from "@/lib/storage";

// ---------------------------------------------------------------------------
// GET /api/sessions
// Returns today's sessions (server-local day), newest first.
// ---------------------------------------------------------------------------

export async function GET(): Promise<NextResponse> {
  try {
    const sessions = await getSessionsForToday();
    return NextResponse.json(
      { sessions },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch {
    return NextResponse.json({ error: "storage_error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/sessions
// Validates request body, appends a new session, and returns 201.
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;

  // Validate mode
  if (raw.mode !== "focus" && raw.mode !== "break") {
    return NextResponse.json({ error: "invalid_mode" }, { status: 400 });
  }

  // Validate durationSeconds: must be a positive integer <= 3600
  const dur = raw.durationSeconds;
  if (
    typeof dur !== "number" ||
    !Number.isInteger(dur) ||
    dur <= 0 ||
    dur > 3600
  ) {
    return NextResponse.json({ error: "invalid_duration" }, { status: 400 });
  }

  try {
    // id and completedAt are always generated server-side; client values ignored.
    const session = await appendSession({
      mode: raw.mode,
      durationSeconds: dur,
    });
    return NextResponse.json(session, { status: 201 });
  } catch {
    return NextResponse.json({ error: "storage_error" }, { status: 500 });
  }
}
