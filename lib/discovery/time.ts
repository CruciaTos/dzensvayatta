// Booking times are always picked and shown in IST (UTC+5:30, no daylight
// saving). Never parse "YYYY-MM-DD" + "HH:MM" with new Date() alone: that uses
// the runtime's own zone, which is UTC on Vercel.

/** One call length, used by the booking page, the invite and the CTA copy. */
export const DISCOVERY_CALL_MINUTES = 30;

/** Booking window, IST. A slot may start at 22:00 at the latest. */
export const BOOKING_START_HOUR = 10;
export const BOOKING_END_HOUR = 22;
export const SLOT_STEP_MINUTES = 30;
export const MIN_LEAD_MINUTES = 30;

const IST_OFFSET = "+05:30";

/** The exact instant of an IST date ("2026-11-04") and time ("10:00"). */
export function istToInstant(date: string, time: string): Date {
  return new Date(`${date}T${time}:00${IST_OFFSET}`);
}

/** Today's date in IST as "YYYY-MM-DD". */
export function istToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
}

/** "Wed, 4 Nov 2026 at 10:00 AM IST" */
export function formatIstSlot(date: string, time: string): string {
  const instant = istToInstant(date, time);
  const day = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(instant);
  const clock = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(instant);
  return `${day} at ${clock} IST`;
}

/** All slot start times in the booking window: "10:00", "10:30" … "22:00". */
export function bookingSlots(): string[] {
  const slots: string[] = [];
  for (let m = BOOKING_START_HOUR * 60; m <= BOOKING_END_HOUR * 60; m += SLOT_STEP_MINUTES) {
    slots.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return slots;
}

/** True when the slot starts at least MIN_LEAD_MINUTES from now. */
export function isSlotBookable(date: string, time: string, now: Date = new Date()): boolean {
  return istToInstant(date, time).getTime() - now.getTime() >= MIN_LEAD_MINUTES * 60 * 1000;
}
