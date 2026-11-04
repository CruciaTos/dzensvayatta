"use client";

import { unstable_ViewTransition as ViewTransition, type ReactNode } from "react";

/**
 * Wraps each page so every navigation runs as a view transition (needs
 * `experimental.viewTransition` in next.config.ts). The old page fades out
 * and the new one rises in over one 250ms leg; elements that share a
 * view-transition-name (see NavigationEffects) grow from one box into the
 * other instead. Styles live in app/globals.css ("Page transitions").
 * Browsers without the API simply navigate.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return <ViewTransition default="page">{children}</ViewTransition>;
}
