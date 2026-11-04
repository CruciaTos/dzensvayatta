"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { endNav, labelFor, startNav } from "@/lib/nav-progress";

/**
 * Page-transition plumbing (docs/redesign/MOTION.md §3). Renders nothing.
 *
 * 1. Shared boxes. The thing you click becomes the next page's card: right
 *    before an internal navigation, the clicked element gets a
 *    view-transition-name that the destination also uses, and the browser
 *    grows one box into the other.
 *      - any link to /discovery          → the booking card ("booking-card")
 *      - a work card's link to a project → the case-study hero ("work-media"),
 *        using the card's [data-vt-media] element
 *    Names are set only on the clicked element, so a page with many such
 *    links never has duplicates.
 * 2. Direction. Sibling pages (one product to the next) swipe sideways;
 *    everything else zooms (the old page sinks back, the new one zooms in).
 *    Set as <html data-vt> for the CSS in globals.css, cleared after.
 * 3. Pending state. Marks a navigation as in flight so the nav can show the
 *    loader if the next page takes more than a moment.
 */
// Sibling pages, in order: moving along this list swipes left, back swipes right.
const SIBLINGS = ["/projects/crusam", "/projects/growmont", "/projects/growmont-pms"];

function directionFor(from: string, to: string) {
  const a = SIBLINGS.indexOf(from);
  const b = SIBLINGS.indexOf(to);
  if (a >= 0 && b >= 0) return b > a ? "swipe-next" : "swipe-prev";
  return "zoom";
}

export function NavigationEffects() {
  const pathname = usePathname();
  const named = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const clear = () => {
      named.current.forEach((el) => el.style.removeProperty("view-transition-name"));
      named.current = [];
    };

    // The clicked element may outlive the navigation (the nav's "Book a call"
    // is still there on the next page). Its name must only exist in the OLD
    // snapshot, so drop it the moment the browser starts the update (after
    // the old state is captured, before the new one is).
    type Start = (arg?: unknown) => ViewTransition;
    const doc = document as Document & { startViewTransition?: Start; __svWrapped?: boolean };
    const original = doc.startViewTransition?.bind(document);
    if (original && !doc.__svWrapped) {
      doc.__svWrapped = true;
      doc.startViewTransition = (arg?: unknown) => {
        const update =
          typeof arg === "function" ? (arg as () => unknown) : (arg as { update?: () => unknown } | undefined)?.update;
        const wrapped = () => {
          clear();
          return update?.();
        };
        return typeof arg === "function" || !arg
          ? original(wrapped)
          : original({ ...(arg as object), update: wrapped });
      };
    }

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page (or a #hash)

      clear();
      if (url.pathname === "/discovery" && !anchor.closest("[data-vt-skip]")) {
        anchor.style.setProperty("view-transition-name", "booking-card");
        named.current.push(anchor);
      } else if (/^\/projects\/[^/]+$/.test(url.pathname)) {
        const media =
          anchor.querySelector<HTMLElement>("[data-vt-media]") ??
          anchor.closest("article")?.querySelector<HTMLElement>("[data-vt-media]");
        if (media) {
          media.style.setProperty("view-transition-name", "work-media");
          named.current.push(media);
        }
      }
      document.documentElement.dataset.vt = directionFor(window.location.pathname, url.pathname);
      startNav(url.pathname, labelFor(url.pathname));
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clear();
    };
  }, []);

  // The new page has committed: the navigation is over.
  useEffect(() => {
    endNav();
    const id = window.setTimeout(() => {
      named.current.forEach((el) => el.style.removeProperty("view-transition-name"));
      named.current = [];
      delete document.documentElement.dataset.vt;
    }, 900);
    return () => window.clearTimeout(id);
  }, [pathname]);

  // Never leave the loader spinning (an aborted or failed navigation).
  useEffect(() => {
    const id = window.setInterval(() => endNav(), 12_000);
    return () => window.clearInterval(id);
  }, []);

  return null;
}
