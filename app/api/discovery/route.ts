import { NextResponse } from "next/server";
import { scheduleDiscoveryCall } from "@/lib/discovery/schedule";
import { validateDiscoveryPayload } from "@/lib/discovery/validate";
import { isGoogleConfigured } from "@/lib/google/oauth";

export async function POST(request: Request) {
  try {
    if (!isGoogleConfigured()) {
      return NextResponse.json(
        {
          error:
            "Booking is not configured yet. Add Google API credentials to .env.local on the server.",
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
