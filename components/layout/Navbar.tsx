"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Navbar as NavbarShell,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarButton,
} from "../ui/resizable-navbar";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrolled } from "@/hooks/useScrolled";
import { AboutOverlay } from "@/components/sections/AboutOverlay";
import { NAV_LINKS, PROJECTS_LINK, PROJECTS_SUBLINKS } from "@/lib/data";

// Derived from NAV_LINKS so the tracked ids can never drift out of sync
// with the hrefs actually rendered below (previously hand-typed here as
// ["hero", "areas", "capabilities", "cases", "contact"] — "areas" did not
// match any element's id, it is "target-areas", so that link never lit up
// and the observer for it silently never attached).
const SECTION_IDS = NAV_LINKS.map(({ href }) => href.replace("#", ""));
const EASE = [0.22, 1, 0.36, 1] as const;

const BLUE = {
  logo: "#B2D5E5",
  active: "#B2D5E5",
  idle: "rgba(178, 213, 229, 0.58)",
} as const;

// Ivory, not pure white — a warm off-white so the dropdown reads as paper
// rather than as a blown-out #fff rectangle, and fully opaque by design.
// The panel borrows the bar's geometry, shadow and inset-highlight language
// but deliberately not its translucency: solid ivory is what makes it read
// as paper, and letting the dark page show through only drags the warm
// off-white toward grey. Every ink value is a tint of the site near-black
// (#000b12) rather than neutral grey, and the accent is the nav blue
// darkened enough to carry on ivory.
const IVORY = {
  top: "#FBF8F1",
  bottom: "#F1ECE0",
  ink: "#0B1A24",
  inkMuted: "rgba(11, 26, 36, 0.58)",
  hairline: "rgba(11, 26, 36, 0.10)",
  accent: "#2F6178",
  live: "#3F7A5E",
  wip: "#8F7860",
} as const;

// Ivory twin of the nav pill: same spring, same inset highlight, same idea
// of a lit surface sliding between items — just dark-on-light instead of
// light-on-dark. Radius matches the nav trigger's own (~17px) so a menu row
// and a nav link are visibly cut from the same shape.
const MENU_PILL: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(11,26,36,0.085) 0%, rgba(11,26,36,0.04) 100%)",
  border: "1px solid rgba(11,26,36,0.08)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)",
};

const PILL_SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.7 } as const;

// The two surface states the bar animates between. Everything here is
// transitionable (no display/position swaps), so `transition-all` on the
// element carries the whole full-bleed-bar to floating-pill change.
const GLASS: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(10,28,40,0.72) 0%, rgba(3,12,18,0.68) 100%)",
  backdropFilter: "blur(22px) saturate(180%)",
  WebkitBackdropFilter: "blur(22px) saturate(180%)",
  borderColor: "rgba(178,213,229,0.13)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.28), 0 18px 46px -14px rgba(0,0,0,0.72)",
};

// Same material as GLASS, but denser. An open mobile sheet covers a large
// area of the page, and at the bar's own opacity big display type behind it
// reads straight through the links — blur alone does not defeat a headline
// set at 40px. Everything else about the surface is unchanged.
const GLASS_SHEET: CSSProperties = {
  ...GLASS,
  background:
    "linear-gradient(180deg, rgba(8,24,34,0.94) 0%, rgba(2,10,15,0.93) 100%)",
};

const CLEAR: CSSProperties = {
  background: "transparent",
  backdropFilter: "blur(0px)",
  WebkitBackdropFilter: "blur(0px)",
  borderColor: "transparent",
  boxShadow: "none",
};

type NavItem = {
  key: string;
  label: string;
  active: boolean;
  href?: string;
  onClick?: () => void;
  dropdown?: boolean;
};

export function Navbar() {
  const scrolled = useScrolled(40);
  const activeSection = useActiveSection(SECTION_IDS);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projectsMenuOpen, setProjectsMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isProjectsActive =
    pathname === PROJECTS_LINK.href || pathname.startsWith(`${PROJECTS_LINK.href}/`);

  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 100) {
        setHidden(false);
        lastScrollY.current = currentY;
        return;
      }
      if (currentY > lastScrollY.current + 5) {
        setHidden(true);
      } else if (currentY < lastScrollY.current - 5) {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Any open surface closes on navigation — otherwise the mobile sheet
  // stays open on top of the page it just navigated to.
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setProjectsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setProjectsMenuOpen(false);
      setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Closing the dropdown is deferred so the pointer can cross the gap
  // between the trigger and the panel without the menu flickering shut.
  const closeTimer = useRef<number | null>(null);
  const openProjects = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setProjectsMenuOpen(true);
  }, []);
  const closeProjects = useCallback((delay = 140) => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setProjectsMenuOpen(false), delay);
  }, []);
  useEffect(
    () => () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  const scrollToCta = () => {
    router.push("/discovery");
  };

  // One flat list instead of slice(0,3) / Projects / slice(3) / Founders
  // rendered four separate ways — the sliding indicator below needs every
  // item to go through the same markup to hand off between them.
  const anchorItem = (link: { label: string; href: string }): NavItem => {
    const sectionId = link.href.replace("#", "");
    return {
      key: link.href,
      label: link.label,
      href: isHome ? link.href : `/${link.href}`,
      active: !isProjectsActive && !aboutOpen && activeSection === sectionId,
    };
  };

  const items: NavItem[] = [
    ...NAV_LINKS.slice(0, 3).map(anchorItem),
    {
      key: "projects",
      label: PROJECTS_LINK.label,
      href: PROJECTS_LINK.href,
      active: isProjectsActive,
      dropdown: true,
    },
    ...NAV_LINKS.slice(3).map(anchorItem),
    {
      key: "founders",
      label: "Founders",
      onClick: () => setAboutOpen(true),
      active: aboutOpen,
    },
  ];

  // The indicator follows the pointer while hovering, and otherwise rests
  // on whatever section is actually current.
  const activeKey = items.find((item) => item.active)?.key ?? null;
  const litKey = hovered ?? activeKey;

  const surface = scrolled ? GLASS : CLEAR;
  const shouldHide = hidden && !isMobileMenuOpen && !projectsMenuOpen;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ opacity: 0, y: -12 }}
        animate={{
          opacity: shouldHide ? 0 : 1,
          y: shouldHide ? -80 : 0,
        }}
        transition={{ duration: 1.0, ease: EASE }}
      >
        <NavbarShell>
          {/* Over the hero the bar has no surface of its own, so a short
              scrim keeps the links legible against whatever is painted
              underneath. It fades out once the glass takes over. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-24 transition-opacity duration-500"
            style={{
              opacity: scrolled ? 0 : 1,
              background:
                "linear-gradient(180deg, rgba(0,11,18,0.55) 0%, rgba(0,11,18,0.20) 45%, transparent 100%)",
            }}
          />

          {/* Desktop */}
          <NavBody
            className={`mx-auto border border-solid transition-all duration-500 ease-out ${
              scrolled
                ? "mt-3 max-w-[1180px] rounded-full px-5 py-2"
                : "mt-0 max-w-[1440px] rounded-none px-8 py-4"
            }`}
            style={surface}
          >
            <Link
              href="/"
              aria-label="Svayatta home"
              className="flex items-center no-underline"
            >
              <Image
                src="/images/logo.png"
                alt="Svayatta logo"
                width={44}
                height={44}
                priority
                className={`w-auto flex-shrink-0 bg-transparent object-contain transition-all duration-500 ${
                  scrolled ? "h-9" : "h-11"
                }`}
                style={{ backgroundColor: "transparent" }}
              />
              <span
                className={`font-zaslia leading-none tracking-[-0.01em] transition-all duration-500 ${
                  scrolled ? "text-[19px]" : "text-[22px]"
                }`}
                style={{ color: BLUE.logo, fontWeight: 500 }}
              >
                SVAYATTA
              </span>
            </Link>

            <ul className="m-0 flex list-none items-center gap-1 p-0">
              {items.map((item) => {
                const lit = litKey === item.key;
                const tone = item.active || hovered === item.key ? BLUE.active : BLUE.idle;

                const content = (
                  <>
                    {lit && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(178,213,229,0.16) 0%, rgba(178,213,229,0.06) 100%)",
                          border: "1px solid rgba(178,213,229,0.15)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                        }}
                        transition={PILL_SPRING}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                    {item.dropdown && (
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 10 6"
                        fill="none"
                        aria-hidden="true"
                        className="relative z-10"
                        style={{
                          transition: "transform 0.25s ease",
                          transform: projectsMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        <path
                          d="M1 1L5 5L9 1"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </>
                );

                const triggerClass =
                  "relative flex cursor-pointer items-center gap-[7px] rounded-full border-none bg-transparent px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] no-underline transition-colors duration-200";

                return (
                  <li
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => {
                      setHovered(item.key);
                      if (item.dropdown) openProjects();
                    }}
                    onMouseLeave={() => {
                      setHovered(null);
                      if (item.dropdown) closeProjects();
                    }}
                  >
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={triggerClass}
                        style={{ color: tone }}
                        aria-current={item.active ? "page" : undefined}
                        aria-haspopup={item.dropdown ? "menu" : undefined}
                        aria-expanded={item.dropdown ? projectsMenuOpen : undefined}
                        onFocus={item.dropdown ? openProjects : undefined}
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={item.onClick}
                        className={triggerClass}
                        style={{ color: tone }}
                        aria-haspopup="dialog"
                        aria-expanded={aboutOpen}
                      >
                        {content}
                      </button>
                    )}

                    {item.dropdown && (
                      <ProjectsDropdown
                        open={projectsMenuOpen}
                        pathname={pathname}
                        onMouseEnter={openProjects}
                        onMouseLeave={() => closeProjects()}
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            <NavbarButton
              variant="primary"
              onClick={scrollToCta}
              className={`hidden transition-all duration-500 md:inline-flex ${
                scrolled ? "px-4 py-2" : "px-5 py-2.5"
              }`}
              style={{ background: "linear-gradient(180deg, #C6E1EE 0%, #A5CCDE 100%)" }}
            >
              <span>Get Started</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </NavbarButton>
          </NavBody>

          {/* Mobile — header and sheet share one glass container so an open
              menu reads as part of the bar rather than a panel floating
              underneath it. */}
          <MobileNav>
            <div
              className={`overflow-hidden border border-solid transition-all duration-500 ease-out ${
                scrolled || isMobileMenuOpen
                  ? "mx-4 mt-3 rounded-[22px]"
                  : "mx-0 mt-0 rounded-none"
              }`}
              style={isMobileMenuOpen ? GLASS_SHEET : scrolled ? GLASS : CLEAR}
            >
              <MobileNavHeader className="px-4 py-3">
                <Link
                  href="/"
                  aria-label="Svayatta home"
                  className="flex items-center gap-1 no-underline"
                >
                  <Image
                    src="/images/logo.png"
                    alt="Svayatta logo"
                    width={44}
                    height={44}
                    priority
                    className="h-10 w-auto flex-shrink-0 bg-transparent object-contain"
                    style={{ backgroundColor: "transparent" }}
                  />
                  <span
                    className="font-zaslia text-[19px] leading-none tracking-[-0.01em]"
                    style={{ color: BLUE.logo, fontWeight: 500 }}
                  >
                    Svayatta
                  </span>
                </Link>
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
              </MobileNavHeader>

              <MobileNavMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                className="px-4 pb-5 pt-4"
                style={{ borderTop: "1px solid rgba(178,213,229,0.10)" }}
              >
                {NAV_LINKS.slice(0, 3).map((link, index) => (
                  <MobileItem key={link.href} index={index}>
                    <MobileLink
                      href={isHome ? link.href : `/${link.href}`}
                      label={link.label}
                      active={!isProjectsActive && activeSection === link.href.replace("#", "")}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  </MobileItem>
                ))}

                {/* Projects — a full standalone route; hover dropdowns do not
                    apply on touch, so its sub-links are listed directly, on
                    an ivory-tinted card that echoes the desktop dropdown. */}
                <MobileItem index={3}>
                  <div className="flex flex-col gap-3">
                    <Link
                      href={PROJECTS_LINK.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.18em] no-underline"
                      style={{ color: isProjectsActive ? BLUE.active : BLUE.idle }}
                    >
                      <span
                        className="h-[3px] w-[3px] rounded-full"
                        style={{
                          backgroundColor: BLUE.active,
                          opacity: isProjectsActive ? 1 : 0,
                        }}
                        aria-hidden="true"
                      />
                      {PROJECTS_LINK.label}
                    </Link>
                    <div
                      className="ml-[13px] flex flex-col gap-1 rounded-[22px] p-1.5"
                      style={{
                        backgroundColor: "rgba(251,248,241,0.05)",
                        border: "1px solid rgba(251,248,241,0.09)",
                      }}
                    >
                      {PROJECTS_SUBLINKS.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-current={isSubActive ? "page" : undefined}
                            className="flex items-center justify-between gap-3 rounded-[16px] px-3.5 py-2.5 no-underline"
                            style={
                              isSubActive
                                ? {
                                    background:
                                      "linear-gradient(180deg, rgba(178,213,229,0.16) 0%, rgba(178,213,229,0.06) 100%)",
                                    border: "1px solid rgba(178,213,229,0.15)",
                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                                  }
                                : { border: "1px solid transparent" }
                            }
                          >
                            <span className="flex min-w-0 flex-col gap-1">
                              <span
                                className="font-mono text-[11.5px] uppercase tracking-[0.16em]"
                                style={{
                                  color: isSubActive
                                    ? BLUE.active
                                    : "rgba(178, 213, 229, 0.78)",
                                  fontWeight: 600,
                                }}
                              >
                                {sub.label}
                              </span>
                              {sub.description && (
                                <span
                                  className="font-sans text-[10.5px] leading-[1.4]"
                                  style={{ color: "rgba(178, 213, 229, 0.38)" }}
                                >
                                  {sub.description}
                                </span>
                              )}
                            </span>
                            {sub.badge && (
                              <StatusChip label={sub.badge} tone={sub.badgeTone} onDark />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </MobileItem>

                {NAV_LINKS.slice(3).map((link, index) => (
                  <MobileItem key={link.href} index={4 + index}>
                    <MobileLink
                      href={isHome ? link.href : `/${link.href}`}
                      label={link.label}
                      active={!isProjectsActive && activeSection === link.href.replace("#", "")}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  </MobileItem>
                ))}

                <MobileItem index={5}>
                  <button
                    type="button"
                    onClick={() => {
                      setAboutOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="cursor-pointer border-none bg-transparent p-0 pl-[13px] text-left font-mono text-[12px] uppercase tracking-[0.18em]"
                    style={{ color: BLUE.idle }}
                  >
                    Founders
                  </button>
                </MobileItem>

                <MobileItem index={6}>
                  <NavbarButton
                    variant="primary"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      scrollToCta();
                    }}
                    className="mt-2 w-full px-5 py-3"
                    style={{ background: "linear-gradient(180deg, #C6E1EE 0%, #A5CCDE 100%)" }}
                  >
                    <span>Get Started</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </NavbarButton>
                </MobileItem>
              </MobileNavMenu>
            </div>
          </MobileNav>
        </NavbarShell>
      </motion.div>

      <AboutOverlay open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Projects dropdown — ivory panel                                   */
/* ------------------------------------------------------------------ */
function ProjectsDropdown({
  open,
  pathname,
  onMouseEnter,
  onMouseLeave,
}: {
  open: boolean;
  pathname: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  // Same rule as the bar above: the lit surface tracks the pointer, and
  // falls back to whatever is actually current when nothing is hovered.
  const [hoveredSub, setHoveredSub] = useState<string | null>(null);
  const activeSub = PROJECTS_SUBLINKS.find((sub) => sub.href === pathname)?.href ?? null;
  const litSub = hoveredSub ?? activeSub;

  return (
    // The wrapper carries the offset as padding rather than as a `top` gap,
    // so the space between trigger and panel is still part of the hover
    // target — a real gap is empty space the pointer falls through.
    <div
      className="absolute left-1/2 top-full z-[60] -translate-x-1/2 pt-3.5"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Products"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="relative p-1.5"
            style={{
              minWidth: 322,
              transformOrigin: "top center",
              // Nested-radius rule: 16px rows + 6px padding = 22px panel, and
              // the 16px matches the nav trigger's own corner exactly.
              borderRadius: 22,
              background: `linear-gradient(180deg, ${IVORY.top} 0%, ${IVORY.bottom} 100%)`,
              border: `1px solid ${IVORY.hairline}`,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(11,26,36,0.05), 0 28px 54px -18px rgba(0,0,0,0.62), 0 4px 12px -4px rgba(0,0,0,0.3)",
            }}
          >
            {/* Notch, so the panel points back at its trigger. */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 h-2.5 w-2.5"
              style={{
                top: -6,
                transform: "translateX(-50%) rotate(45deg)",
                background: IVORY.top,
                borderLeft: `1px solid ${IVORY.hairline}`,
                borderTop: `1px solid ${IVORY.hairline}`,
                borderTopLeftRadius: 3,
              }}
            />

            {PROJECTS_SUBLINKS.map((sub) => {
              const isSubActive = pathname === sub.href;
              const lit = litSub === sub.href;
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  role="menuitem"
                  aria-current={isSubActive ? "page" : undefined}
                  onMouseEnter={() => setHoveredSub(sub.href)}
                  onMouseLeave={() => setHoveredSub(null)}
                  className="group/item relative flex items-center gap-3 rounded-[16px] px-3.5 py-2.5 no-underline"
                >
                  {lit && (
                    <motion.span
                      layoutId="projects-menu-pill"
                      className="absolute inset-0 rounded-[16px]"
                      style={MENU_PILL}
                      transition={PILL_SPRING}
                    />
                  )}

                  <span className="relative z-10 flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex items-center gap-2">
                      <span
                        className="font-mono text-[11.5px] uppercase tracking-[0.16em] transition-colors duration-200"
                        style={{
                          color: isSubActive ? IVORY.accent : IVORY.ink,
                          fontWeight: 600,
                        }}
                      >
                        {sub.label}
                      </span>
                      {sub.badge && <StatusChip label={sub.badge} tone={sub.badgeTone} />}
                    </span>
                    {sub.description && (
                      <span
                        className="font-sans text-[11px] leading-[1.45]"
                        style={{ color: IVORY.inkMuted }}
                      >
                        {sub.description}
                      </span>
                    )}
                  </span>

                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                    className="relative z-10 flex-shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100"
                    style={{ color: isSubActive ? IVORY.accent : IVORY.ink }}
                  >
                    <path
                      d="M2.5 6h7M6.5 3l3 3-3 3"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small shared bits                                                 */
/* ------------------------------------------------------------------ */
function StatusChip({
  label,
  tone = "wip",
  onDark = false,
}: {
  label: string;
  tone?: "live" | "wip";
  onDark?: boolean;
}) {
  const color = tone === "live" ? IVORY.live : IVORY.wip;
  return (
    <span
      className="inline-flex flex-shrink-0 items-center gap-1 rounded-full px-1.5 py-[2px] font-mono text-[8.5px] uppercase tracking-[0.14em]"
      style={{
        color,
        backgroundColor: onDark ? "rgba(251,248,241,0.08)" : "rgba(11,26,36,0.05)",
        border: `1px solid ${onDark ? "rgba(251,248,241,0.12)" : "rgba(11,26,36,0.09)"}`,
      }}
    >
      <span
        className="h-1 w-1 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

function MobileItem({ index, children }: { index: number; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE, delay: 0.05 + index * 0.04 }}
    >
      {children}
    </motion.div>
  );
}

function MobileLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className="flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.18em] no-underline"
      style={{ color: active ? BLUE.active : BLUE.idle }}
    >
      <span
        className="h-[3px] w-[3px] rounded-full transition-opacity duration-200"
        style={{ backgroundColor: BLUE.active, opacity: active ? 1 : 0 }}
        aria-hidden="true"
      />
      {label}
    </Link>
  );
}
