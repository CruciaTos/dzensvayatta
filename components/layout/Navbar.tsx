"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
import { NAV_LINKS, PROJECTS_LINK } from "@/lib/data";

const SECTION_IDS = ["hero", "areas", "capabilities", "cases", "contact"];
const EASE = [0.22, 1, 0.36, 1] as const;

const BLUE = {
  logo: "#B2D5E5",
  active: "#B2D5E5",
  idle: "rgba(178, 213, 229, 0.5)",
  dot: "rgba(178, 213, 229, 0.55)",
} as const;

export function Navbar() {
  const scrolled = useScrolled(40);
  const activeSection = useActiveSection(SECTION_IDS);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isProjectsActive = pathname === PROJECTS_LINK.href;

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

  const scrollToCta = () => {
    router.push("/discovery");
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ opacity: 0, y: -12 }}
        animate={{
          opacity: hidden ? 0 : 1,
          y: hidden ? -80 : 0,
        }}
        transition={{ duration: 1.0, ease: EASE }}
      >
        <NavbarShell
          className={`
            w-full transition-all duration-500
            ${
              scrolled
                ? "bg-[#000b12]/75 backdrop-blur-xl border-b border-[rgba(178,213,229,0.12)] shadow-sm shadow-black/20"
                : "bg-transparent border-b border-transparent"
            }
          `}
        >
          {/* Desktop */}
          <NavBody>
            <Link
              href="/"
              aria-label="Svayatta home"
              className="flex items-center gap-0 no-underline"
              style={{ transform: 'translateY(-5px)' }}
            >
              <Image
                src="/images/logo.png"
                alt="Svayatta logo"
                width={44}
                height={44}
                priority
                className="h-11 w-auto object-contain flex-shrink-0 bg-transparent"
                style={{ backgroundColor: "transparent" }}
              />
              <span
                className="font-zaslia text-[22px] leading-none tracking-[-0.01em]"
                style={{ color: BLUE.logo, fontWeight: 500 }}
              >
                SVAYATTA
              </span>
            </Link>

            <ul className="flex items-center gap-9 list-none">
              {NAV_LINKS.slice(0, 3).map(({ label, href }) => {
                const sectionId = href.replace("#", "");
                const isActive = !isProjectsActive && activeSection === sectionId;
                return (
                  <li key={href}>
                    <Link
                      href={isHome ? href : `/${href}`}
                      className="font-mono text-[11px] uppercase tracking-[0.18em] no-underline transition-colors duration-200 flex items-center gap-[7px] py-1"
                      style={{
                        color: isActive ? BLUE.active : BLUE.idle,
                        transform: 'translateY(-3px)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.color = BLUE.active;
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.color = BLUE.idle;
                      }}
                    >
                      <span
                        className="w-[3px] h-[3px] rounded-full transition-opacity duration-200"
                        style={{
                          backgroundColor: BLUE.active,
                          opacity: isActive ? 1 : 0,
                        }}
                        aria-hidden="true"
                      />
                      {label}
                    </Link>
                  </li>
                );
              })}

              {/* Projects — a full standalone route, not a same-page anchor */}
              <li>
                <Link
                  href={PROJECTS_LINK.href}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] no-underline transition-colors duration-200 flex items-center gap-[7px] py-1"
                  style={{
                    color: isProjectsActive ? BLUE.active : BLUE.idle,
                    transform: 'translateY(-3px)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isProjectsActive) e.currentTarget.style.color = BLUE.active;
                  }}
                  onMouseLeave={(e) => {
                    if (!isProjectsActive) e.currentTarget.style.color = BLUE.idle;
                  }}
                >
                  <span
                    className="w-[3px] h-[3px] rounded-full transition-opacity duration-200"
                    style={{
                      backgroundColor: BLUE.active,
                      opacity: isProjectsActive ? 1 : 0,
                    }}
                    aria-hidden="true"
                  />
                  {PROJECTS_LINK.label}
                </Link>
              </li>

              {NAV_LINKS.slice(3).map(({ label, href }) => {
                const sectionId = href.replace("#", "");
                const isActive = !isProjectsActive && activeSection === sectionId;
                return (
                  <li key={href}>
                    <Link
                      href={isHome ? href : `/${href}`}
                      className="font-mono text-[11px] uppercase tracking-[0.18em] no-underline transition-colors duration-200 flex items-center gap-[7px] py-1"
                      style={{
                        color: isActive ? BLUE.active : BLUE.idle,
                        transform: 'translateY(-3px)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.color = BLUE.active;
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.color = BLUE.idle;
                      }}
                    >
                      <span
                        className="w-[3px] h-[3px] rounded-full transition-opacity duration-200"
                        style={{
                          backgroundColor: BLUE.active,
                          opacity: isActive ? 1 : 0,
                        }}
                        aria-hidden="true"
                      />
                      {label}
                    </Link>
                  </li>
                );
              })}

              <li>
                <button
                  type="button"
                  onClick={() => setAboutOpen(true)}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-200 bg-transparent border-none cursor-pointer p-0 py-1"
                  style={{
                    color: BLUE.idle,
                    transform: 'translateY(-3px)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = BLUE.active)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = BLUE.idle)}
                  aria-haspopup="dialog"
                  aria-expanded={aboutOpen}
                >
                  Founders
                </button>
              </li>
            </ul>

            <NavbarButton
              variant="primary"
              onClick={scrollToCta}
              className="hidden md:inline-flex"
              style={{
                transform: 'translateY(-3px)',
                backgroundColor: '#B2D5E5',
                color: '#000b12',
                borderColor: '#B2D5E5',
              }}
            >
              Get Started →
            </NavbarButton>
          </NavBody>

          {/* Mobile */}
          <MobileNav>
            <MobileNavHeader>
              <Link
                href="/"
                aria-label="Svayatta home"
                className="flex items-center gap-2.5 no-underline"
                style={{ transform: 'translateY(-2px)' }}
              >
                <Image
                  src="/images/logo.png"
                  alt="Svayatta logo"
                  width={44}
                  height={44}
                  priority
                  className="h-11 w-auto object-contain flex-shrink-0 bg-transparent"
                  style={{ backgroundColor: "transparent" }}
                />
                <span
                  className="font-zaslia text-[19px] leading-none tracking-[-0.01em]"
                  style={{ color: BLUE.logo, fontWeight: 500 }}
                >
                  DZEN
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
            >
              {NAV_LINKS.slice(0, 3).map(({ label, href }) => {
                const sectionId = href.replace("#", "");
                const isActive = !isProjectsActive && activeSection === sectionId;
                return (
                  <Link
                    key={href}
                    href={isHome ? href : `/${href}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block font-mono text-[12px] uppercase tracking-[0.18em] no-underline"
                    style={{
                      color: isActive ? BLUE.active : "rgba(178, 213, 229, 0.55)",
                    }}
                  >
                    {label}
                  </Link>
                );
              })}

              {/* Projects — a full standalone route, not a same-page anchor */}
              <Link
                href={PROJECTS_LINK.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block font-mono text-[12px] uppercase tracking-[0.18em] no-underline"
                style={{
                  color: isProjectsActive ? BLUE.active : "rgba(178, 213, 229, 0.55)",
                }}
              >
                {PROJECTS_LINK.label}
              </Link>

              {NAV_LINKS.slice(3).map(({ label, href }) => {
                const sectionId = href.replace("#", "");
                const isActive = !isProjectsActive && activeSection === sectionId;
                return (
                  <Link
                    key={href}
                    href={isHome ? href : `/${href}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block font-mono text-[12px] uppercase tracking-[0.18em] no-underline"
                    style={{
                      color: isActive ? BLUE.active : "rgba(178, 213, 229, 0.55)",
                    }}
                  >
                    {label}
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setAboutOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="font-mono text-[12px] uppercase tracking-[0.18em] text-left bg-transparent border-none cursor-pointer p-0"
                style={{ color: "rgba(178, 213, 229, 0.55)" }}
              >
                Founders
              </button>

              <div className="flex w-full flex-col gap-4 mt-4">
                <NavbarButton
                  variant="primary"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToCta();
                  }}
                  className="w-full"
                  style={{
                    backgroundColor: '#B2D5E5',
                    color: '#000b12',
                    borderColor: '#B2D5E5',
                  }}
                >
                  Get Started →
                </NavbarButton>
              </div>
            </MobileNavMenu>
          </MobileNav>
        </NavbarShell>
      </motion.div>

      <AboutOverlay open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}