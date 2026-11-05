"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { useNavPending } from "@/lib/nav-progress";
import { PillButton } from "@/components/ui/PillButton";
import LatticeLoader from "@/components/reactbits/LatticeLoader";
import { SiteMenu } from "./SiteMenu";
import { ContactPill } from "./ContactPill";

/** Shows the loader only if a navigation takes longer than this. */
const LOADER_DELAY_MS = 220;

/**
 * The floating white island (§5.1): logo, email, "Book a call", MENU.
 * Always on screen, on a fully solid fill so nothing shows through from behind. While a page is loading, the lattice loader takes
 * the email's place. It keeps the same
 * view-transition-name on every page, so page transitions never touch it.
 */
export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pending = useNavPending();
  const [showLoader, setShowLoader] = useState(false);

  // Close the menu whenever the page changes.
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!pending) {
      setShowLoader(false);
      return;
    }
    const id = window.setTimeout(() => setShowLoader(true), LOADER_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [pending]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 md:top-5"
        style={{ viewTransitionName: "site-nav" }}
      >
        <nav
          aria-label="Main"
          className={cn(
            "flex w-full max-w-[1360px] items-center justify-between rounded-[12px] py-2 pl-4 pr-2 shadow-[0_28px_64px_-14px_rgba(6,26,61,0.42),0_8px_20px_-6px_rgba(6,26,61,0.26),inset_0_1px_0_rgba(255,255,255,0.9)] bg-paper md:w-[min(92vw,1360px)] md:rounded-island md:pl-6",
          )}
        >
          <Link href="/" aria-label={`${SITE.name}, home`} data-intro-target className="flex items-center gap-2.5">
            <Image src="/images/logo.png" alt="" width={30} height={30} priority className="size-[30px]" />
            <span data-intro-wordmark className="font-display text-[15px] font-semibold tracking-[0.2em] text-ink">
              SVAYATTA
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 justify-center min-[900px]:flex">
            {showLoader && pending ? (
              <LatticeLoader
                label={`Opening ${pending.label}`}
                pattern="orbit"
                cellSize={4}
                gap={2}
                fontSize={12}
                showTimer={false}
                color="var(--accent)"
                className="font-mono uppercase tracking-[0.14em] text-ink"
              />
            ) : (
              <a
                href={`mailto:${SITE.email}`}
                className="group/mail inline-flex items-center gap-2 font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-ink transition-colors duration-fast hover:text-accent"
              >
                {SITE.email}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-fast group-hover/mail:-translate-y-0.5 group-hover/mail:translate-x-0.5"
                >
                  ↗
                </span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showLoader && pending && (
              <span className="min-[900px]:hidden">
                <LatticeLoader
                  label=""
                  pattern="orbit"
                  cellSize={4}
                  gap={2}
                  showTimer={false}
                  color="var(--accent)"
                />
              </span>
            )}
            <PillButton href="/discovery" variant="dark" size="sm" className="hidden lg:inline-flex">
              Book a call
            </PillButton>
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="group/menu flex h-10 items-center gap-3 rounded-pill pl-3 pr-2.5 font-mono text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-fast hover:bg-surface"
            >
              <span>{menuOpen ? "Close" : "Menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-[22px]">
                <span
                  className={cn(
                    "absolute left-0 block h-[2px] w-full rounded-full bg-ink transition-transform duration-med ease-expo",
                    menuOpen ? "top-[5px] rotate-45" : "top-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-[2px] w-full rounded-full bg-ink transition-transform duration-med ease-expo",
                    menuOpen ? "top-[5px] -rotate-45" : "top-[10px]"
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <SiteMenu open={menuOpen} onClose={() => setMenuOpen(false)} anchorRef={menuButtonRef} />
      <ContactPill menuOpen={menuOpen} />
    </>
  );
}
