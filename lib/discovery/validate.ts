import type { DiscoveryPayload } from "./types";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RX = /^\d{2}:\d{2}$/;

/** Working hours (IST) — 10:00 to 22:00 */
const WORK_START_HOUR = 10;
const WORK_END_HOUR = 22; // 10 PM

/** Minimum lead time: 30 minutes */
const MIN_LEAD_MS = 30 * 60 * 1000;

function wordCount(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function validateDiscoveryPayload(
  body: unknown
): { ok: true; data: DiscoveryPayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const raw = body as Record<string, unknown>;
  const companyName = String(raw.companyName ?? "").trim();
  const companyField = String(raw.companyField ?? "").trim();
  const description = String(raw.description ?? "").trim();
  const email = String(raw.email ?? "").trim().toLowerCase();
  const contactNo = String(raw.contactNo ?? "").trim();
  const meetDate = String(raw.meetDate ?? "").trim();
  const meetTime = String(raw.meetTime ?? "").trim();

  if (!companyName) {
    return { ok: false, error: "Company name is required." };
  }
  if (!email || !EMAIL_RX.test(email)) {
    return { ok: false, error: "A valid email address is required." };
  }
  if (!meetDate || !DATE_RX.test(meetDate)) {
    return { ok: false, error: "A valid preferred date is required." };
  }
  if (!meetTime || !TIME_RX.test(meetTime)) {
    return { ok: false, error: "A valid preferred time is required." };
  }
  if (wordCount(description) > 120) {
    return { ok: false, error: "Description must be 120 words or fewer." };
  }

  // ── Working-hours check (10:00 AM – 10:00 PM) ──────────────────────────────
  const [hourStr, minStr] = meetTime.split(":");
  const meetHour = parseInt(hourStr, 10);
  const meetMin  = parseInt(minStr, 10);

  // meetTime must be >= 10:00 and the meeting must END by or at 22:00,
  // i.e. start time <= 22:00 exactly (we treat 22:00 as last allowed slot).
  if (
    meetHour < WORK_START_HOUR ||
    meetHour > WORK_END_HOUR ||
    (meetHour === WORK_END_HOUR && meetMin > 0)
  ) {
    return {
      ok: false,
      error: `Meetings can only be scheduled between 10:00 AM and 10:00 PM.`,
    };
  }

  // ── Minimum 30-minute lead time ────────────────────────────────────────────
  const now = Date.now();
  // Build a JS Date from the submitted date + time (treated as local / IST).
  const meetDateTime = new Date(`${meetDate}T${meetTime}:00`);

  if (isNaN(meetDateTime.getTime())) {
    return { ok: false, error: "Invalid date/time combination." };
  }

  if (meetDateTime.getTime() - now < MIN_LEAD_MS) {
    return {
      ok: false,
      error: "Please schedule your meeting at least 30 minutes from now.",
    };
  }

  return {
    ok: true,
    data: {
      companyName,
      companyField,
      description,
      email,
      contactNo,
      meetDate,
      meetTime,
    },
  };
}

