"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { LogoMark } from "@/components/ui/Icons";

interface AboutOverlayProps {
  open: boolean;
  onClose: () => void;
}

const COMPANY_META = [
  { label: "Established", value: "2025" },
  { label: "Operation Scope", value: "Enterprise System Orchestration" },
  { label: "Model Architecture", value: "Fixed-Scope, Human-in-the-Loop Integrations" },
  { label: "Compliance Standard", value: "SOC 2 Compatible · ISO 27001 Ready" },
];

// ─── Typewriter ───────────────────────────────────────────────────────────────
function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(id);
          setDone(true);
        }
      }, 40);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-accent font-bold">
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.55 }}
          className="inline-block w-[1.5px] h-[10px] bg-accent align-middle ml-[2px]"
        />
      )}
    </span>
  );
}

// ─── Founder card with scan‑line + magnetic name ──────────────────────────────
function FounderCard({
  num,
  name,
  email,
  linkedIn,
  quote,
  delay,
  open,
}: {
  num: string;
  name: string;
  email: string;
  linkedIn: string;
  quote: string;
  delay: number;
  open: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 12);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 8);
  }

  function onMouseLeave() {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative overflow-hidden flex flex-col justify-center min-h-[460px] px-12 py-12 border border-stone-900 bg-stone-950/30 rounded-[2px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 30 }}
      animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Magnetic overlay tint */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-stone-900/10"
        style={{ transformOrigin: "bottom" }}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Sweeping Laser Scan Line texture */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="scan"
            className="absolute top-0 h-full w-[1.5px] pointer-events-none z-20 bg-gradient-to-b from-accent/40 to-transparent"
            style={{ left: 0 }}
            initial={{ x: 0 }}
            animate={{ x: cardRef.current?.offsetWidth ?? 400 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Background numeral */}
      <motion.span
        className="absolute right-[-10px] top-[-10px] font-serif font-black leading-none pointer-events-none select-none tracking-tighter text-[130px] text-stone-900/10"
        aria-hidden="true"
        animate={hovered ? { scale: 1.05, y: -5, opacity: 0.15 } : { scale: 1, y: 0, opacity: 0.1 }}
        transition={{ duration: 0.4 }}
      >
        {num}
      </motion.span>

      <div className="relative z-10">
        {/* Magnetised subtle header shift */}
        <motion.h3
          style={{ x: sx, y: sy }}
          className="font-serif text-[clamp(2rem,3vw,2.75rem)] font-bold text-stone-100 leading-[1.1] tracking-[-0.02em] mb-2 cursor-pointer select-none"
        >
          {name}
        </motion.h3>

        <div className="font-mono text-[9px] tracking-[2px] uppercase text-accent font-bold mb-6">
          Co-Founder & Operator
        </div>

        <div className="space-y-3 mb-8">
          <a
            href={`mailto:${email}`}
            className="block font-mono text-[13px] tracking-wide text-stone-400 hover:text-accent transition-colors no-underline"
          >
            {email}
          </a>
          <a
            href={linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[10px] tracking-widest text-accent/75 hover:text-accent transition-colors uppercase"
          >
            LinkedIn Profile ↗
          </a>
        </div>

        <div
          className="border-l-2 pl-4 py-1"
          style={{ borderColor: "rgba(143,120,96,0.25)" }}
        >
          <p className="font-sans text-[13px] font-normal leading-relaxed text-stone-400 italic">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main overlay (drawer version) ────────────────────────────────────────────
export function AboutOverlay({ open, onClose }: AboutOverlayProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handler);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-stone-950/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="about-overlay"
            className="fixed inset-y-0 right-0 w-full max-w-[640px] z-[101] bg-bg-secondary border-l border-stone-900 shadow-2xl flex flex-col h-full overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Top Bar inside Drawer */}
            <div className="h-18 flex items-center justify-between px-10 border-b border-stone-900 sticky top-0 bg-bg-secondary/95 backdrop-blur-md z-30">
              <div className="flex items-center gap-[8px]">
                <div className="w-6 h-6 bg-accent flex items-center justify-center flex-shrink-0 rounded-[1px]">
                  <LogoMark className="w-[12px] h-[12px] text-stone-950" />
                </div>
                <span className="font-mono text-[13px] font-bold tracking-[0.1em] uppercase text-stone-200">
                  DZen Context
                </span>
              </div>

              <button
                onClick={onClose}
                className="font-mono text-[9px] tracking-widest uppercase text-stone-500 hover:text-stone-200 border border-stone-800 hover:border-stone-500 px-4 py-2 hover:bg-stone-900/40 transition-all rounded-[1px] cursor-pointer"
                aria-label="Close details block"
              >
                Close ✕
              </button>
            </div>

            {/* Immersive details bodies */}
            <div className="flex-1 px-10 py-12 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-accent rounded-full" />
                  {open && <Typewriter text="Operating Philosophy" delay={200} />}
                </div>

                <h2 className="font-serif text-[clamp(2.2rem,4vw,3.2rem)] font-bold leading-[1.05] tracking-[-0.03em] text-stone-100">
                  Enterprise systems need <span className="italic text-stone-400">soul</span> and <span className="italic text-stone-400">symmetry</span>.
                </h2>

                <p className="font-sans text-[14px] font-normal text-stone-400 leading-relaxed max-w-xl">
                  DZen was pioneered to close the silent operational gaps that drain corporate focus, time, and revenue. We build the secure, custom AI-native orchestrator layer that connects ERP layouts with communications channels seamlessly.
                </p>

                <p className="font-sans text-[14px] font-normal text-stone-400 leading-relaxed max-w-xl">
                  We believe technology works best when it is quiet, robust, and completely responsive. No fluff. No fragile mockups. We deploy production-grade software that is governed step-by-step.
                </p>
              </div>

              {/* Company statistics block */}
              <div className="grid grid-cols-2 max-[480px]:grid-cols-1 border border-stone-900 bg-stone-950/20 rounded-[2px] overflow-hidden">
                {COMPANY_META.map((meta, i) => (
                  <div
                    key={meta.label}
                    className="p-5 border-b border-r border-stone-900 last:border-b-0 last:border-r-0 max-[480px]:border-r-0 max-[480px]:border-b"
                  >
                    <div className="font-mono text-[8px] tracking-widest uppercase text-stone-600 font-bold mb-1">
                      {meta.label}
                    </div>
                    <div className="font-sans text-[13px] font-semibold text-stone-300">
                      {meta.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Co-founders section */}
              <div className="space-y-6 pt-6">
                <div className="font-mono text-[9px] tracking-widest uppercase text-stone-500 font-bold">
                  Active Operators
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <FounderCard
                    num="I"
                    name="Soham Boridkar"
                    email="boridkar24@gmail.com"
                    linkedIn="https://linkedin.com/in/sohamboridkar"
                    quote="The true test of a system is silence. If a pipeline requires excessive alerts and corrections, it lacks soul. We build models that run invisibly so managers can focus purely on outcomes."
                    delay={0.1}
                    open={open}
                  />
                  <FounderCard
                    num="II"
                    name="Smit Mhatre"
                    email="smit2004mhatre@gmail.com"
                    linkedIn="https://linkedin.com/in/smit-mhatre"
                    quote="We map the exact heuristics your top specialists apply when matching spreadsheets or vetting invoices, then translate those steps into robust, auditable decision pipelines."
                    delay={0.2}
                    open={open}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}