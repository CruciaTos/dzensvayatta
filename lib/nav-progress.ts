// A tiny store for "a page navigation is in flight", read by the nav loader.
import { useSyncExternalStore } from "react";

export interface NavPending {
  href: string;
  label: string;
  since: number;
}

let pending: NavPending | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function startNav(href: string, label: string) {
  pending = { href, label, since: Date.now() };
  emit();
}

export function endNav() {
  if (!pending) return;
  pending = null;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useNavPending(): NavPending | null {
  return useSyncExternalStore(
    subscribe,
    () => pending,
    () => null
  );
}

const LABELS: [RegExp, string][] = [
  [/^\/$/, "Home"],
  [/^\/about/, "About"],
  [/^\/services/, "Services"],
  [/^\/projects\/crusam/, "CruSam"],
  [/^\/projects\/growmont-pms/, "Growmont PMS"],
  [/^\/projects\/growmont/, "Growmont CRM"],
  [/^\/projects/, "Work"],
  [/^\/discovery/, "Discovery call"],
  [/^\/insights/, "Insights"],
  [/^\/privacy/, "Privacy"],
  [/^\/terms/, "Terms"],
];

/** "Opening Work", "Opening About"… */
export function labelFor(pathname: string) {
  return LABELS.find(([rx]) => rx.test(pathname))?.[1] ?? "page";
}
