"use client";

import { useState } from "react";
import Link from "next/link";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrolled } from "@/hooks/useScrolled";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Icons";
import { AboutOverlay } from "@/components/sections/AboutOverlay";
import { NAV_LINKS } from "@/lib/data";
import { cn } from "@/lib/utils";

const SECTION_IDS = ["workflow", "services", "process", "security"];

export function Navbar() {
  const scrolled      = useScrolled(40);
  const activeSection = useActiveSection(SECTION_IDS);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "h-16 flex items-center justify-between px-12 max-md:px-6",
          "bg-bg-primary/92 backdrop-blur-[20px]",
          "border-b transition-[border-color] duration-300 ease-out-expo",
          scrolled ? "border-stone-100/[0.14]" : "border-stone-100/[0.08]"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="DZen home"
          className="flex items-center gap-[10px] no-underline group"
        >
          <div className="w-7 h-7 bg-accent flex items-center justify-center flex-shrink-0">
            <LogoMark className="w-[14px] h-[14px]" />
          </div>
          <span className="font-sans text-[15px] font-medium tracking-[0.06em] uppercase text-stone-100">
            DZen
          </span>
        </Link>

        {/* Nav links */}
        <ul
          className="flex items-center gap-10 list-none max-md:hidden"
          role="list"
        >
          {NAV_LINKS.map(({ label, href }) => {
            const sectionId = href.replace("#", "");
            const isActive  = activeSection === sectionId;
            return (
              <li key={href}>
                <a
                  href={href}
                  className={cn(
                    "font-sans text-[13px] font-normal tracking-[0.02em] no-underline",
                    "transition-colors duration-200",
                    isActive ? "text-stone-100" : "text-stone-400 hover:text-stone-100"
                  )}
                >
                  {label}
                </a>
              </li>
            );
          })}

          {/* About — opens overlay */}
          <li>
            <button
              onClick={() => setAboutOpen(true)}
              className={cn(
                "font-sans text-[13px] font-normal tracking-[0.02em]",
                "text-stone-400 hover:text-stone-100 transition-colors duration-200",
                "bg-transparent border-none cursor-pointer p-0"
              )}
              aria-haspopup="dialog"
              aria-expanded={aboutOpen}
            >
              About
            </button>
          </li>
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Button
            as="a"
            href="#"
            variant="ghost"
            size="sm"
            className="max-md:hidden"
          >
            Schedule a Briefing
          </Button>
          <Button as="a" href="#cta" variant="primary" size="sm">
            Get Started →
          </Button>
        </div>
      </nav>

      <AboutOverlay open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}