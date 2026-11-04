"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";

type RevealTag = "div" | "li" | "section" | "article" | "p" | "span";

interface RevealProps {
  children: ReactNode;
  /** Seconds. Stagger siblings by 0.06–0.08. */
  delay?: number;
  /** Starting offset in px. */
  y?: number;
  as?: RevealTag;
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Fades content up once, when 10% of it is on screen. Under
 * prefers-reduced-motion it appears without moving.
 */
export function Reveal({ children, delay = 0, y = 24, as = "div", className }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      // Same initial state on server and client, so hydration always matches.
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={reduce ? { duration: 0 } : { duration: 1, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}
