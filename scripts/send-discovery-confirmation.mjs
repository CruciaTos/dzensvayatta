
import { randomUUID } from 'crypto';
import { createEvent } from 'ics';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'info@svayatta.in';
const FROM_NAME = process.env.RESEND_FROM_NAME || 'Svayatta';
const NOTIFY_EMAIL = process.env.DZEN_NOTIFICATION_EMAIL;
const DURATION_MINUTES = Number(process.env.CALENDAR_EVENT_DURATION_MINUTES || 30);

/**
 * @param {Object} formData
 * @param {string} formData.companyName
 * @param {string} [formData.industry]
 * @param {string} [formData.description]
 * @param {string} formData.email
 * @param {string} [formData.contactNumber]
 * @param {string} formData.preferredDate  - 'YYYY-MM-DD'
 * @param {string} formData.preferredTime  - 'HH:mm' (24h)
 */
export async function sendDiscoveryCallConfirmation(formData) {
  const { companyName, industry, description, email, contactNumber, preferredDate, preferredTime } = formData;

  if (!companyName || !email || !preferredDate || !preferredTime) {
    throw new Error('Missing required fields: companyName, email, preferredDate, preferredTime');
  }

  const [year, month, day] = preferredDate.split('-').map(Number);
  const [hour, minute] = preferredTime.split(':').map(Number);

  // Note: this creates a "floating time" event (no TZID attached), which
  // most calendar apps render using the viewer's own local clock. That's
  // fine as long as you and your clients are in the same timezone. If you
  // start booking across timezones, switch to UTC-based start/end instead.
  const { error: icsError, value: icsContent } = createEvent({
    uid: `${randomUUID()}@svayatta.in`,
    title: `Discovery Call with ${companyName}`,
    description: [
      industry ? `Industry: ${industry}` : null,
      description ? `About: ${description}` : null,
      contactNumber ? `Contact: ${contactNumber}` : null,
    ].filter(Boolean).join('\n'),
    start: [year, month, day, hour, minute],
    duration: { minutes: DURATION_MINUTES },
    organizer: { name: FROM_NAME, email: FROM_EMAIL },
    attendees: [{ name: companyName, email, rsvp: true }],
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
  });

  if (icsError) {
    throw icsError;
  }

  const readableDate = `${preferredDate} at ${preferredTime}`;

  const { data, error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [email],
    ...(NOTIFY_EMAIL ? { bcc: [NOTIFY_EMAIL] } : {}),
    subject: `Discovery Call Confirmed — ${readableDate}`,
    html: `
      <p>Hi there,</p>
      <p>Your discovery call for <strong>${companyName}</strong> is confirmed for <strong>${readableDate}</strong>.</p>
      <p>A calendar invite is attached — just open it to add the event to your calendar.</p>
      <p>Looking forward to speaking with you.</p>
      <p>— ${FROM_NAME}</p>
    `,
    attachments: [
      {
        filename: 'discovery-call.ics',
        content: Buffer.from(icsContent).toString('base64'),
      },
    ],
  });

  if (error) {
    throw error;
  }

  return data;
}