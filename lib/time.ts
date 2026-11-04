// Studio hours, in IST. Booking uses the same window (lib/discovery/validate.ts).
export const STUDIO_TZ = "Asia/Kolkata";
export const STUDIO_OPEN_HOUR = 10;
export const STUDIO_CLOSE_HOUR = 22;

/** Hour and minute right now (or at `date`) in IST, whatever the server/browser zone is. */
export function istHourMinute(date: Date = new Date()): { hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: STUDIO_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { hour: get("hour"), minute: get("minute") };
}

export function isStudioOpen(date: Date = new Date()): boolean {
  const { hour } = istHourMinute(date);
  return hour >= STUDIO_OPEN_HOUR && hour < STUDIO_CLOSE_HOUR;
}

/** "09:24 PM" in IST. */
export function formatIstTime(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: STUDIO_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}
