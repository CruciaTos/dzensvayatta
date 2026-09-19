"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Navbar – top-level wrapper                                        */
/*                                                                    */
/*  These primitives are deliberately layout-only: they own structure */
/*  (which row is desktop, which is mobile, how the sheet animates)   */
/*  and nothing else. All surface styling — the glass, the radius,    */
/*  the width it collapses to on scroll — is passed down from         */
/*  components/layout/Navbar.tsx, so the "resize" is a single source  */
/*  of truth there instead of being split across two files.           */
/* ------------------------------------------------------------------ */
interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Navbar({ children, className, style, ...rest }: NavbarProps) {
  return (
    <nav className={cn("relative w-full", className)} style={style} {...rest}>
      {children}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  NavBody – desktop nav content row                                 */
/* ------------------------------------------------------------------ */
interface NavBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function NavBody({ children, className, ...rest }: NavBodyProps) {
  return (
    <div
      className={cn("relative hidden w-full items-center justify-between md:flex", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MobileNav – mobile wrapper                                        */
/* ------------------------------------------------------------------ */
interface MobileNavProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MobileNav({ children, className, ...rest }: MobileNavProps) {
  return (
    <div className={cn("w-full md:hidden", className)} {...rest}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MobileNavHeader – logo + toggle row                               */
/* ------------------------------------------------------------------ */
interface MobileNavHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MobileNavHeader({ children, className, ...rest }: MobileNavHeaderProps) {
  return (
    <div className={cn("flex w-full items-center justify-between", className)} {...rest}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MobileNavToggle – hamburger / close button                        */
/* ------------------------------------------------------------------ */
interface MobileNavToggleProps {
  isOpen: boolean;
  onClick: () => void;
  color?: string;
}

export function MobileNavToggle({ isOpen, onClick, color = "#B2D5E5" }: MobileNavToggleProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border p-0 transition-colors duration-200"
      style={{
        borderColor: "rgba(178,213,229,0.16)",
        backgroundColor: isOpen ? "rgba(178,213,229,0.10)" : "rgba(178,213,229,0.04)",
      }}
    >
      <span className="relative flex h-[13px] w-[18px] flex-col justify-between">
        <motion.span
          className="block h-[1.5px] w-full origin-center rounded-full"
          style={{ backgroundColor: color }}
          animate={isOpen ? { rotate: 45, y: 5.75 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="block h-[1.5px] w-full origin-center rounded-full"
          style={{ backgroundColor: color }}
          animate={isOpen ? { opacity: 0, scaleX: 0.4 } : { opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.18 }}
        />
        <motion.span
          className="block h-[1.5px] w-full origin-center rounded-full"
          style={{ backgroundColor: color }}
          animate={isOpen ? { rotate: -45, y: -5.75 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  MobileNavMenu – collapsible link sheet                            */
/* ------------------------------------------------------------------ */
interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function MobileNavMenu({ isOpen, children, className, style }: MobileNavMenuProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={cn("flex flex-col gap-4", className)} style={style}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  NavbarButton – CTA / action button                                */
/* ------------------------------------------------------------------ */
interface NavbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function NavbarButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: NavbarButtonProps) {
  const baseClasses =
    "group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full border font-sans text-[12px] uppercase tracking-[0.1em] transition-all duration-300";
  const primaryClasses =
    "border-transparent text-[#04131c] shadow-[0_6px_18px_-6px_rgba(178,213,229,0.55)] hover:shadow-[0_10px_26px_-6px_rgba(178,213,229,0.7)]";
  const secondaryClasses =
    "border-[rgba(178,213,229,0.22)] bg-transparent text-[rgba(178,213,229,0.75)] hover:border-[rgba(178,213,229,0.45)] hover:text-[#B2D5E5]";

  return (
    <button
      className={cn(
        baseClasses,
        variant === "primary" ? primaryClasses : secondaryClasses,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
