import type { DiscoveryPayload } from "./types";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RX = /^\d{2}:\d{2}$/;

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

  const today = new Date().toISOString().slice(0, 10);
  if (meetDate < today) {
    return { ok: false, error: "Preferred date cannot be in the past." };
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
