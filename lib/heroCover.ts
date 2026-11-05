"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether the home hero is fully covered by the sheet that slides over it
 * (HeroDepth). The hero stays pinned in the viewport underneath, so its WebGL
 * animations still count as "on screen" to an IntersectionObserver; they read
 * this instead and stop drawing while nobody can see them.
 */
let covered = false;
const listeners = new Set<() => void>();

export function setHeroCovered(next: boolean) {
  if (next === covered) return;
  covered = next;
  listeners.forEach((fn) => fn());
}

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

export function useHeroCovered() {
  return useSyncExternalStore(
    subscribe,
    () => covered,
    () => false
  );
}
