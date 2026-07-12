import { NextResponse } from "next/server";
import { scheduleDiscoveryCall } from "@/lib/discovery/schedule";
import { validateDiscoveryPayload } from "@/lib/discovery/validate";


const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 3;

const ipMap = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipMap.get(ip);

  if (!record || now - record.windowStart > WINDOW_MS) {
    ipMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS) return true;

  record.count += 1;
  return false;
}

export async function POST(request: Request) {
  try {

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait 10 minutes before trying again." },
        { status: 429 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Email delivery is not configured yet. Add RESEND_API_KEY to .env.local on the server.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const parsed = validateDiscoveryPayload(body);

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await scheduleDiscoveryCall(parsed.data);

    return NextResponse.json({
      ok: true,
      eventId: result.eventId,
      eventLink: result.eventLink,
    });
  } catch (error) {
    console.error("Discovery booking failed:", error);

    const message =
      error instanceof Error ? error.message : "Unable to schedule the discovery call.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
