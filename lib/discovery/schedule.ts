import { randomUUID } from "crypto";
import { createEvent } from "ics";
import { Resend } from "resend";
import type { DiscoveryPayload, DiscoveryResult } from "./types";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "info@svayatta.in";
const FROM_NAME = process.env.RESEND_FROM_NAME || "Svayatta";
const NOTIFY_EMAIL = process.env.DZEN_NOTIFICATION_EMAIL;
const DURATION_MINUTES = Number(process.env.CALENDAR_EVENT_DURATION_MINUTES || 30);

function buildConfirmationHtml(payload: DiscoveryPayload) {
  const when = `${payload.meetDate} at ${payload.meetTime}`;
  return `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
      <p>Hi,</p>
      <p>Your discovery call for <strong>${payload.companyName}</strong> is confirmed for <strong>${when}</strong>.</p>
      ${payload.companyField ? `<p><strong>Industry:</strong> ${payload.companyField}</p>` : ""}
      <p>A calendar invite (.ics) is attached — open it to add the event to your calendar.</p>
      <p>If you need to reschedule, simply reply to this email.</p>
      <p>— ${FROM_NAME}</p>
    </div>
  `.trim();
}

function buildTeamNotificationText(payload: DiscoveryPayload) {
  return [
    "New discovery call request from the DZen website.",
    "",
    `Company:  ${payload.companyName}`,
    `Industry: ${payload.companyField || "Not provided"}`,
    `Email:    ${payload.email}`,
    `Contact:  ${payload.contactNo || "Not provided"}`,
    `Date:     ${payload.meetDate} at ${payload.meetTime}`,
    "",
    "About:",
    payload.description || "Not provided",
  ].join("\n");
}

export async function scheduleDiscoveryCall(
  payload: DiscoveryPayload
): Promise<DiscoveryResult> {
  const [year, month, day] = payload.meetDate.split("-").map(Number);
  const [hour, minute] = payload.meetTime.split(":").map(Number);

  // Build ICS calendar invite
  const { error: icsError, value: icsContent } = createEvent({
    uid: `${randomUUID()}@svayatta.in`,
    title: `Discovery Call with ${payload.companyName}`,
    description: buildTeamNotificationText(payload),
    start: [year, month, day, hour, minute],
    duration: { minutes: DURATION_MINUTES },
    organizer: { name: FROM_NAME, email: FROM_EMAIL },
    attendees: [{ name: payload.companyName, email: payload.email, rsvp: true }],
    status: "CONFIRMED",
    busyStatus: "BUSY",
  });

  if (icsError || !icsContent) {
    throw icsError ?? new Error("Failed to generate calendar invite.");
  }

  const icsAttachment = [
    {
      filename: "discovery-call.ics",
      content: Buffer.from(icsContent).toString("base64"),
    },
  ];

  // Send confirmation email to the client + BCC the team
  const { error: sendError } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [payload.email],
    ...(NOTIFY_EMAIL ? { bcc: [NOTIFY_EMAIL] } : {}),
    subject: `Discovery Call Confirmed — ${payload.meetDate} at ${payload.meetTime}`,
    html: buildConfirmationHtml(payload),
    attachments: icsAttachment,
  });

  if (sendError) {
    throw sendError;
  }

  // If a separate notification email is configured, send a plain-text
  // briefing to the team as well (in addition to the BCC above).
  if (NOTIFY_EMAIL) {
    await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [NOTIFY_EMAIL],
      subject: `[Discovery Call] ${payload.companyName} | ${payload.meetDate} ${payload.meetTime}`,
      text: buildTeamNotificationText(payload),
      attachments: icsAttachment,
    });
  }

  // No Google Calendar event ID — return a deterministic placeholder so the
  // API response shape stays the same.
  return { eventId: `resend-${Date.now()}`, eventLink: null };
}
