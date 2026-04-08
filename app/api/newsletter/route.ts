import {
  createServiceClient,
  isSupabaseServiceConfigured,
} from "lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 320;

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const emailRaw = (payload as { email?: unknown }).email;
  const sourceRaw = (payload as { source?: unknown }).source;

  if (typeof emailRaw !== "string") {
    return NextResponse.json(
      { ok: false, error: "Email is required." },
      { status: 400 },
    );
  }

  const email = normalizeEmail(emailRaw);
  if (!email || email.length > MAX_EMAIL_LEN || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  let source: string | null = null;
  if (typeof sourceRaw === "string") {
    const s = sourceRaw.trim();
    if (s === "footer" || s === "welcome") {
      source = s;
    }
  }

  if (!isSupabaseServiceConfigured()) {
    console.error(
      "[api/newsletter] Supabase service not configured — set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.",
    );
    return NextResponse.json(
      {
        ok: false,
        error: "Newsletter signup is not configured on the server.",
      },
      { status: 503 },
    );
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        error: "Newsletter signup is not configured on the server.",
      },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("newsletter_subscribers").insert({
    email,
    source,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    console.error("[api/newsletter] insert failed:", error);
    return NextResponse.json(
      { ok: false, error: "Could not save your signup. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
