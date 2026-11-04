"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

// Dates are "YYYY-MM-DD" strings and all maths uses UTC midnights, so the
// calendar never shifts with the visitor's time zone.

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const fromIso = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const addDays = (iso: string, days: number) => {
  const d = fromIso(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toIso(d);
};
const addMonths = (iso: string, months: number) => {
  const d = fromIso(iso);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, last));
  return toIso(d);
};
const monthKey = (iso: string) => iso.slice(0, 7);

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const longLabel = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const monthLabel = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", month: "long", year: "numeric" });

interface MonthCalendarProps {
  /** IST today, "YYYY-MM-DD". */
  today: string;
  /** Last selectable date. */
  maxDate: string;
  value: string | null;
  onChange: (iso: string) => void;
  /** Extra rule, e.g. "today has no slots left". */
  isDisabled?: (iso: string) => boolean;
}

export function MonthCalendar({ today, maxDate, value, onChange, isDisabled }: MonthCalendarProps) {
  const [view, setView] = useState(() => monthKey(value ?? today));
  const [focused, setFocused] = useState(() => value ?? today);
  const grid = useRef<HTMLDivElement>(null);
  const moveFocus = useRef(false);

  const disabled = (iso: string) => iso < today || iso > maxDate || Boolean(isDisabled?.(iso));

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    grid.current?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)?.focus();
  }, [focused, view]);

  const first = fromIso(`${view}-01`);
  const offset = (first.getUTCDay() + 6) % 7; // Monday first
  const daysInMonth = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  const cells: (string | null)[] = [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${view}-${pad(i + 1)}`),
  ];

  const canPrev = view > monthKey(today);
  const canNext = view < monthKey(maxDate);

  function go(target: string) {
    const clamped = target < today ? today : target > maxDate ? maxDate : target;
    moveFocus.current = true;
    setFocused(clamped);
    setView(monthKey(clamped));
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const map: Record<string, () => string> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -((fromIso(focused).getUTCDay() + 6) % 7)),
      End: () => addDays(focused, 6 - ((fromIso(focused).getUTCDay() + 6) % 7)),
      PageUp: () => addMonths(focused, -1),
      PageDown: () => addMonths(focused, 1),
    };
    const next = map[e.key];
    if (!next) return;
    e.preventDefault();
    go(next());
  }

  // Keep exactly one day in the tab order: the focused one if it's in view,
  // otherwise the first enabled day of the month.
  const tabbable = monthKey(focused) === view ? focused : cells.find((c) => c && !disabled(c)) ?? null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-[24px] font-light italic text-ink" aria-live="polite">
          {monthLabel.format(first)}
        </h3>
        <div className="flex gap-2">
          {[
            { label: "Previous month", icon: ChevronLeft, enabled: canPrev, delta: -1 },
            { label: "Next month", icon: ChevronRight, enabled: canNext, delta: 1 },
          ].map(({ label, icon: Icon, enabled, delta }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              disabled={!enabled}
              onClick={() => {
                const nextView = monthKey(addMonths(`${view}-01`, delta));
                setView(nextView);
                setFocused(`${nextView}-01` < today ? today : `${nextView}-01`);
              }}
              className="flex size-10 items-center justify-center rounded-full border border-line text-ink transition-colors duration-fast hover:border-ink disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line"
            >
              <Icon className="size-4" strokeWidth={1.75} />
            </button>
          ))}
        </div>
      </div>

      <div role="grid" aria-label={monthLabel.format(first)} ref={grid} onKeyDown={onKeyDown} className="mt-5">
        <div role="row" className="grid grid-cols-7">
          {WEEKDAYS.map((d) => (
            <span
              key={d}
              role="columnheader"
              aria-label={d}
              className="pb-2 text-center font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3"
            >
              {d.slice(0, 2)}
            </span>
          ))}
        </div>
        {Array.from({ length: Math.ceil(cells.length / 7) }, (_, row) => (
          <div role="row" key={row} className="grid grid-cols-7">
            {cells.slice(row * 7, row * 7 + 7).map((iso, i) => {
              if (!iso) return <span role="gridcell" key={`e${i}`} />;
              const off = disabled(iso);
              const selected = iso === value;
              const isToday = iso === today;
              return (
                <span role="gridcell" key={iso} className="flex justify-center py-0.5">
                  <button
                    type="button"
                    data-date={iso}
                    tabIndex={iso === tabbable ? 0 : -1}
                    aria-label={`${longLabel.format(fromIso(iso))}${isToday ? ", today" : ""}`}
                    aria-pressed={selected}
                    aria-disabled={off || undefined}
                    onClick={() => {
                      if (off) return;
                      setFocused(iso);
                      onChange(iso);
                    }}
                    onFocus={() => setFocused(iso)}
                    className={cn(
                      "relative flex size-10 items-center justify-center rounded-full text-[15px] tabular-nums transition-colors duration-fast md:size-11",
                      selected
                        ? "bg-ink font-medium text-paper"
                        : off
                          ? "cursor-not-allowed text-ink-3/40"
                          : "text-ink hover:bg-surface"
                    )}
                  >
                    {Number(iso.slice(8))}
                    {isToday && !selected && (
                      <span aria-hidden="true" className="absolute bottom-1.5 size-1 rounded-full bg-accent" />
                    )}
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export { addDays as addIsoDays };
