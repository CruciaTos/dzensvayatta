"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Clock, MapPin, Video } from "lucide-react";
import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  DISCOVERY_CALL_MINUTES,
  bookingSlots,
  formatIstSlot,
  isSlotBookable,
  istToInstant,
  istToday,
} from "@/lib/discovery/time";
import { PillButton } from "@/components/ui/PillButton";
import { TextLink } from "@/components/ui/TextLink";
import { MonthCalendar, addIsoDays } from "./MonthCalendar";
import LatticeLoader from "@/components/reactbits/LatticeLoader";

type Step = "slot" | "details" | "done";

interface Details {
  companyName: string;
  companyField: string;
  description: string;
  email: string;
  contactNo: string;
}

const EMPTY: Details = { companyName: "", companyField: "", description: "", email: "", contactNo: "" };
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_WORDS = 120;
const BOOKING_WINDOW_DAYS = 60;
const SLOTS = bookingSlots();

const wordCount = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

/** "10:00" → "10:00 AM" */
function slotLabel(time: string) {
  const [h, m] = time.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

export function BookingCard() {
  const [today] = useState(istToday);
  const [now, setNow] = useState<Date | null>(null); // null until mounted
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("slot");
  const [details, setDetails] = useState<Details>(EMPTY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [visitorZone, setVisitorZone] = useState<string | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (zone && zone !== "Asia/Kolkata" && zone !== "Asia/Calcutta") setVisitorZone(zone);
    return () => window.clearInterval(id);
  }, []);

  const bookable = (d: string, t: string) => (now ? isSlotBookable(d, t, now) : true);
  // A slot that was free when picked can expire while the visitor types.
  useEffect(() => {
    if (date && time && !bookable(date, time)) setTime(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  const stepIndex = step === "slot" ? (date ? 1 : 0) : 2;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!date || !time) return setStep("slot");
    if (!details.companyName.trim() || !EMAIL_RX.test(details.email.trim())) {
      setError("Please add your company name and a valid email address.");
      return;
    }
    if (!isSlotBookable(date, time)) {
      setTime(null);
      setStep("slot");
      setError("That time has just passed. Please pick another one.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...details, meetDate: date, meetTime: time }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "We couldn't book the call. Please try again.");
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    // "booking-card": any "Book a call" button that links here grows into this
    // card during the page transition (components/motion/NavigationEffects.tsx).
    <div
      className="mx-auto flex max-w-[1080px] flex-col overflow-hidden rounded-[20px] border border-line bg-paper lg:flex-row"
      style={{ viewTransitionName: "booking-card" }}
    >
      <InfoPanel stepIndex={stepIndex} done={step === "done"} />

      <div className="min-w-0 flex-1 p-6 md:p-10">
        {step === "slot" && (
          <div>
            {error && <ErrorNote>{error}</ErrorNote>}
            <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
              <div>
                <StepLabel n={1}>Select a date</StepLabel>
                <MonthCalendar
                  today={today}
                  maxDate={addIsoDays(today, BOOKING_WINDOW_DAYS)}
                  value={date}
                  onChange={(d) => {
                    setDate(d);
                    if (time && !bookable(d, time)) setTime(null);
                    setError("");
                  }}
                  isDisabled={(d) => (now ? !SLOTS.some((t) => isSlotBookable(d, t, now)) : false)}
                />
              </div>

              <div>
                <StepLabel n={2}>Select a time</StepLabel>
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">
                  Times in IST (UTC+5:30)
                </p>
                {date ? (
                  <div role="group" aria-label="Available times" className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-3">
                    {SLOTS.map((t) => {
                      const off = !bookable(date, t);
                      const selected = t === time;
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={off}
                          aria-pressed={selected}
                          onClick={() => setTime(t)}
                          className={cn(
                            "h-11 rounded-pill border text-[13px] font-medium tabular-nums transition-colors duration-fast",
                            selected
                              ? "border-ink bg-ink text-paper"
                              : "border-line text-ink hover:border-ink",
                            "disabled:cursor-not-allowed disabled:border-line-soft disabled:text-ink-3/40 disabled:line-through"
                          )}
                        >
                          {slotLabel(t)}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="rounded-media bg-surface px-4 py-6 text-small text-ink-3">
                    Pick a date to see open times.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-10 flex flex-col-reverse items-start gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-small text-ink-2" aria-live="polite">
                {date && time ? formatIstSlot(date, time) : "No time selected yet."}
              </p>
              <PillButton variant="dark" disabled={!date || !time} onClick={() => setStep("details")}>
                Continue
              </PillButton>
            </div>
          </div>
        )}

        {step === "details" && date && time && (
          <form onSubmit={submit} noValidate>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-media bg-surface px-4 py-3">
              <div>
                <p className="text-[15px] font-medium text-ink">{formatIstSlot(date, time)}</p>
                {visitorZone && (
                  <p className="mt-0.5 text-[13px] text-ink-3">
                    That&apos;s {localTime(date, time)} where you are ({visitorZone.replace(/_/g, " ")}).
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setStep("slot")}
                className="text-[14px] font-medium text-ink underline decoration-line-strong underline-offset-[5px] hover:decoration-ink"
              >
                Change
              </button>
            </div>

            <StepLabel n={3}>Your details</StepLabel>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Company name" required>
                {(id) => (
                  <input
                    id={id}
                    required
                    autoComplete="organization"
                    value={details.companyName}
                    onChange={(e) => setDetails({ ...details, companyName: e.target.value })}
                    className={INPUT}
                  />
                )}
              </Field>
              <Field label="Industry">
                {(id) => (
                  <input
                    id={id}
                    placeholder="e.g. Manufacturing, healthcare"
                    value={details.companyField}
                    onChange={(e) => setDetails({ ...details, companyField: e.target.value })}
                    className={INPUT}
                  />
                )}
              </Field>
              <Field
                label="What does your business do?"
                hint={`${wordCount(details.description)} / ${MAX_WORDS} words`}
                className="sm:col-span-2"
              >
                {(id) => (
                  <textarea
                    id={id}
                    rows={4}
                    placeholder="A few lines on your team, how you work today and what you'd like to fix."
                    value={details.description}
                    onChange={(e) => {
                      if (wordCount(e.target.value) <= MAX_WORDS) setDetails({ ...details, description: e.target.value });
                    }}
                    className={cn(INPUT, "h-auto resize-none py-3 leading-relaxed")}
                  />
                )}
              </Field>
              <Field label="Email" required>
                {(id) => (
                  <input
                    id={id}
                    type="email"
                    required
                    autoComplete="email"
                    value={details.email}
                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                    className={INPUT}
                  />
                )}
              </Field>
              <Field label="Phone">
                {(id) => (
                  <input
                    id={id}
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91"
                    value={details.contactNo}
                    onChange={(e) => setDetails({ ...details, contactNo: e.target.value })}
                    className={INPUT}
                  />
                )}
              </Field>
            </div>

            {error && <ErrorNote className="mt-6">{error}</ErrorNote>}

            <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13px] text-ink-3">
                By booking, you agree to our{" "}
                <Link href="/privacy" className="text-accent underline underline-offset-4">
                  Privacy Policy
                </Link>
                . You&apos;ll get an email confirmation with a calendar invite.
              </p>
              <PillButton type="submit" variant="dark" disabled={sending} className="shrink-0">
                {sending ? (
                  <LatticeLoader label="Booking" pattern="orbit" cellSize={4} gap={2} fontSize={14} showTimer={false} />
                ) : (
                  "Book the call"
                )}
              </PillButton>
            </div>
          </form>
        )}

        {step === "done" && date && time && (
          <div role="status" className="flex flex-col items-start py-6 md:py-12">
            <span className="flex size-14 items-center justify-center rounded-full bg-tint text-accent">
              <Check className="size-6" strokeWidth={2} />
            </span>
            <h2 className="mt-6 text-display-m text-ink">
              You&apos;re <em>booked.</em>
            </h2>
            <p className="mt-4 text-[20px] font-light text-ink">{formatIstSlot(date, time)}</p>
            <p className="mt-3 max-w-[460px] text-body text-ink-2">
              We&apos;ve emailed a confirmation with a calendar invite to{" "}
              <strong className="font-medium text-ink">{details.email}</strong>. Need to change the time? Just
              reply to that email.
            </p>
            <TextLink href="/" className="mt-8">
              Back to home
            </TextLink>
          </div>
        )}
      </div>
    </div>
  );
}

const INPUT =
  "h-12 w-full rounded-media border border-line bg-paper px-4 text-[15px] text-ink transition-colors duration-fast placeholder:text-ink-3/70 hover:border-line-strong focus:border-ink focus:outline-none focus-visible:outline-none";

function localTime(date: string, time: string) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", weekday: "short" }).format(
    istToInstant(date, time)
  );
}

function StepLabel({ n, children }: { n: number; children: ReactNode }) {
  return (
    <p className="mb-5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
      Step {n} · <span className="text-ink">{children}</span>
    </p>
  );
}

function Field({
  label,
  required,
  hint,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: (id: string) => ReactNode;
}) {
  const id = useId();
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={id} className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-2">
          {label}
          {required && (
            <>
              <span aria-hidden="true" className="text-accent"> *</span>
              <span className="sr-only"> (required)</span>
            </>
          )}
        </label>
        {hint && <span className="font-mono text-[11px] text-ink-3">{hint}</span>}
      </div>
      {children(id)}
    </div>
  );
}

function ErrorNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p role="alert" className={cn("mb-6 rounded-media border border-danger/25 bg-danger/5 px-4 py-3 text-small text-danger", className)}>
      {children}
    </p>
  );
}

const COVER = [
  "How work moves through your business today",
  "Where software or AI would save the most time",
  "What we'd build first, and roughly what it takes",
];

const STEPS = ["Pick a date", "Pick a time", "Your details"];

function InfoPanel({ stepIndex, done }: { stepIndex: number; done: boolean }) {
  return (
    <aside className="border-b border-line bg-paper p-6 md:p-10 lg:w-[38%] lg:shrink-0 lg:border-b-0 lg:border-r">
      <span className="flex size-14 items-center justify-center rounded-media border border-line bg-surface">
        <Image src="/images/Svayatta.svg" alt="" width={18} height={34} />
      </span>
      <p className="mt-6 font-serif text-[17px] font-light italic text-accent">Svayatta</p>
      <h2 className="mt-1 text-title-l text-ink">
        Discovery <em>call</em>
      </h2>

      <ul className="mt-6 space-y-3 text-small text-ink-2">
        <li className="flex items-center gap-3">
          <Clock className="size-4 shrink-0 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
          {DISCOVERY_CALL_MINUTES} minutes, one to one
        </li>
        <li className="flex items-center gap-3">
          <Video className="size-4 shrink-0 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
          {/* [confirm] how calls happen: the invite has no meeting link yet */}
          Google Meet or phone
        </li>
        <li className="flex items-center gap-3">
          <MapPin className="size-4 shrink-0 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
          Mumbai, serving businesses across India
        </li>
      </ul>

      <p className="mt-8 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
        What we&apos;ll cover
      </p>
      <ul className="mt-3 space-y-2 text-small text-ink-2">
        {COVER.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden="true" className="mt-[9px] size-1 shrink-0 rounded-full bg-ink-3" />
            {item}
          </li>
        ))}
      </ul>

      <ol className="mt-8 space-y-1 rounded-media bg-surface p-4">
        {STEPS.map((label, i) => {
          const complete = done || i < stepIndex;
          const current = !done && i === stepIndex;
          return (
            <li
              key={label}
              aria-current={current ? "step" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-[8px] px-2 py-1.5 text-[14px]",
                current ? "bg-paper font-medium text-ink" : complete ? "text-ink-2" : "text-ink-3"
              )}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px]",
                  complete ? "bg-ink text-paper" : current ? "border border-ink text-ink" : "border border-line-strong"
                )}
              >
                {complete ? <Check className="size-3" strokeWidth={2.5} aria-hidden="true" /> : i + 1}
              </span>
              {label}
              {complete && <span className="sr-only"> (done)</span>}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
