import { google } from "googleapis";
import type { DiscoveryPayload, DiscoveryResult } from "./types";
import { getGoogleOAuthClient } from "@/lib/google/oauth";

const TIMEZONE = process.env.GOOGLE_CALENDAR_TIMEZONE || "Asia/Kolkata";
const MEETING_MINUTES = 45;

function addMinutes(time: string, minutes: number) {
  const [hours, mins] = time.split(":").map(Number);
  const total = hours * 60 + mins + minutes;
  const nextHours = Math.floor(total / 60) % 24;
  const nextMins = total % 60;
  return `${String(nextHours).padStart(2, "0")}:${String(nextMins).padStart(2, "0")}`;
}

function buildDetails(payload: DiscoveryPayload) {
  return [
    "Discovery call request from the DZen website.",
    "",
    `Company: ${payload.companyName}`,
    `Industry: ${payload.companyField || "Not provided"}`,
    `Email: ${payload.email}`,
    `Contact: ${payload.contactNo || "Not provided"}`,
    "",
    "What they do:",
    payload.description || "Not provided",
  ].join("\n");
}

function buildConfirmationHtml(payload: DiscoveryPayload, eventLink?: string | null) {
  const when = `${payload.meetDate} at ${payload.meetTime} (${TIMEZONE})`;

  return `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
      <p>Hi,</p>
      <p>Your discovery call with DZen is booked for <strong>${when}</strong>.</p>
      <p><strong>Company:</strong> ${payload.companyName}<br/>
      <strong>Industry:</strong> ${payload.companyField || "Not provided"}</p>
      ${
        eventLink
          ? `<p><a href="${eventLink}">Open the calendar event</a></p>`
          : "<p>A Google Calendar invite is on its way to this inbox.</p>"
      }
      <p>If you need to reschedule, reply to this email.</p>
      <p>— DZen</p>
    </div>
  `.trim();
}

async function sendConfirmationEmail(
  auth: ReturnType<typeof getGoogleOAuthClient>,
  payload: DiscoveryPayload,
  eventLink?: string | null
) {
  const gmail = google.gmail({ version: "v1", auth });
  const from = process.env.GOOGLE_SENDER_EMAIL || process.env.DZEN_NOTIFICATION_EMAIL;
  if (!from) return;

  const subject = `Discovery call confirmed: ${payload.companyName}`;
  const html = buildConfirmationHtml(payload, eventLink);
  const message = [
    `From: DZen <${from}>`,
    `To: ${payload.email}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    html,
  ].join("\r\n");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: Buffer.from(message).toString("base64url"),
    },
  });
}

async function notifyTeam(
  auth: ReturnType<typeof getGoogleOAuthClient>,
  payload: DiscoveryPayload,
  eventLink?: string | null
) {
  const gmail = google.gmail({ version: "v1", auth });
  const to = process.env.DZEN_NOTIFICATION_EMAIL || "dzen.ai.platform@gmail.com";
  const from = process.env.GOOGLE_SENDER_EMAIL || to;
  const subject = `[Discovery Call] ${payload.companyName} | ${payload.meetDate} ${payload.meetTime}`;
  const body = `${buildDetails(payload)}\n\nCalendar: ${eventLink ?? "Created on primary calendar"}`;

  const message = [
    `From: DZen Website <${from}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    body,
  ].join("\r\n");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: Buffer.from(message).toString("base64url"),
    },
  });
}

export async function scheduleDiscoveryCall(
  payload: DiscoveryPayload
): Promise<DiscoveryResult> {
  const auth = getGoogleOAuthClient();
  const calendar = google.calendar({ version: "v3", auth });
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
  const teamEmail = process.env.DZEN_NOTIFICATION_EMAIL || "dzen.ai.platform@gmail.com";

  const startDateTime = `${payload.meetDate}T${payload.meetTime}:00`;
  const endDateTime = `${payload.meetDate}T${addMinutes(payload.meetTime, MEETING_MINUTES)}:00`;

  const event = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 0,
    sendUpdates: "all",
    requestBody: {
      summary: `Discovery Call: ${payload.companyName}`,
      description: buildDetails(payload),
      start: {
        dateTime: startDateTime,
        timeZone: TIMEZONE,
      },
      end: {
        dateTime: endDateTime,
        timeZone: TIMEZONE,
      },
      attendees: [
        { email: payload.email },
        { email: teamEmail },
      ],
      reminders: {
        useDefault: true,
      },
    },
  });

  const eventId = event.data.id;
  if (!eventId) {
    throw new Error("Calendar event was created without an event id.");
  }

  const eventLink = event.data.htmlLink;

  await Promise.all([
    sendConfirmationEmail(auth, payload, eventLink),
    notifyTeam(auth, payload, eventLink),
  ]);

  return { eventId, eventLink };
}
