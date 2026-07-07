"use client";

import { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { LogoMark } from "@/components/ui/Icons";
import { useLenis } from "@/components/providers/SmoothScroll";

interface AboutOverlayProps {
  open: boolean;
  onClose: () => void;
}

const C = {
  bg: "#000b12",
  accent: "#7EC3E2",
  accentSoft: "#B2D5E5",
  textPrimary: "#e5f3e5",
  textMuted: "rgba(229,243,229,0.65)",
  cardBg: "#0d0d0c",
  cardBorder: "rgba(178,213,229,0.10)",
  divider: "rgba(178,213,229,0.10)",
  panelBg: "#000b12",
  headerBg: "rgba(0, 11, 18, 0.95)",
} as const;

const COMPANY_META = [
  { label: "Established", value: "2025" },
  { label: "Operation Scope", value: "Enterprise Workflow Integration" },
  { label: "Model Architecture", value: "Fixed-Scope, Human-in-the-Loop Integrations" },
  { label: "Compliance Standard", value: "SOC 2 Compatible · ISO 27001 Ready" },
];

const FOUNDERS = [
  {
    num: "I",
    name: "Soham Boridkar",
    email: "boridkar24@gmail.com",
    linkedIn: "https://linkedin.com/in/sohamboridkar",
    quote:
      "The real test is when nobody notices the system running. If a pipeline needs constant alerts and fixes, something is wrong. We build things that stay out of the way so managers can focus on outcomes.",
    delay: 0.1,
  },
  {
    num: "II",
    name: "Smit Mhatre",
    email: "smit2004mhatre@gmail.com",
    linkedIn: "https://linkedin.com/in/smit-mhatre",
    quote:
      "We document how your best people match spreadsheets or vet invoices, then turn those steps into pipelines your team can audit.",
    delay: 0.2,
  },
  {
    num: "III",
    name: "Varun Pal",
    email: "varun.pal@dzen.io",
    linkedIn: "https://www.linkedin.com/in/b777varunpal/",
    quote:
      "Integration is half the job. The other half is trust: systems that explain what they did, stay within their limits, and earn a place in daily operations.",
    delay: 0.3,
  },
] as const;

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
    <span
      className="font-mono text-[9px] tracking-[0.16em] uppercase font-bold"
      style={{ color: C.accent }}
    >
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.55 }}
          className="inline-block w-[1.5px] h-[10px] align-middle ml-[2px]"
          style={{ backgroundColor: C.accent }}
        />
      )}
    </span>
  );
}

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
      className="relative overflow-hidden flex flex-col justify-center min-h-[340px] px-8 py-10 rounded-[2px]"
      style={{
        border: `1px solid ${hovered ? "rgba(126,195,226,0.28)" : C.cardBorder}`,
        backgroundColor: C.cardBg,
        transition: "border-color 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 30 }}
      animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: "rgba(126,195,226,0.04)", transformOrigin: "bottom" }}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      <AnimatePresence>
        {hovered && (
          <motion.div
            key="scan"
            className="absolute top-0 h-full w-[1.5px] pointer-events-none z-20"
            style={{
              left: 0,
              background: "linear-gradient(to bottom, rgba(126,195,226,0.45), transparent)",
            }}
            initial={{ x: 0 }}
            animate={{ x: cardRef.current?.offsetWidth ?? 400 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      <motion.span
        className="absolute right-[-10px] top-[-10px] font-serif font-black leading-none pointer-events-none select-none tracking-tighter text-[130px]"
        style={{ color: "rgba(178,213,229,0.06)" }}
        aria-hidden="true"
        animate={hovered ? { scale: 1.05, y: -5, opacity: 0.12 } : { scale: 1, y: 0, opacity: 0.06 }}
        transition={{ duration: 0.4 }}
      >
        {num}
      </motion.span>

      <div className="relative z-10">
        <motion.h3
          style={{ x: sx, y: sy, color: C.textPrimary }}
          className="font-sans text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-2 cursor-pointer select-none"
        >
          {name}
        </motion.h3>

        <div
          className="font-mono text-[9px] tracking-[2px] uppercase font-bold mb-6"
          style={{ color: C.accent }}
        >
          Co-Founder & Operator
        </div>

        <div className="space-y-3 mb-8">
          <a
            href={`mailto:${email}`}
            className="block font-mono text-[13px] tracking-wide no-underline transition-colors duration-200"
            style={{ color: C.textMuted }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.accentSoft; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
          >
            {email}
          </a>
          <a
            href={linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase transition-colors duration-200"
            style={{ color: "rgba(178,213,229,0.65)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(178,213,229,0.65)"; }}
          >
            LinkedIn Profile ↗
          </a>
        </div>

        <div
          className="border-l-2 pl-4 py-1"
          style={{ borderColor: "rgba(126,195,226,0.28)" }}
        >
          <p
            className="font-sans text-[13px] font-normal leading-relaxed italic"
            style={{ color: C.textMuted }}
          >
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function AboutOverlay({ open, onClose }: AboutOverlayProps) {
  const lenis = useLenis();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handler);
      lenis?.stop();
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handler);
      lenis?.start();
    };
  }, [open, onClose, lenis]);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll <= 0) return;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop >= maxScroll - 1;

      if ((scrollingUp && atTop) || (scrollingDown && atBottom)) return;

      e.preventDefault();
      e.stopPropagation();
      el.scrollTop += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] backdrop-blur-md"
            style={{ backgroundColor: "rgba(0, 11, 18, 0.82)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          <motion.div
            key="about-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Founders and company context"
            className="fixed inset-y-0 right-0 w-full max-w-[680px] z-[101] shadow-2xl flex flex-col h-[100dvh] overflow-hidden"
            style={{
              backgroundColor: C.panelBg,
              borderLeft: `1px solid ${C.divider}`,
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="flex-shrink-0 flex items-center justify-between px-8 sm:px-10 py-5 z-30"
              style={{
                borderBottom: `1px solid ${C.divider}`,
                backgroundColor: C.headerBg,
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-center gap-[8px]">
                <div
                  className="w-6 h-6 flex items-center justify-center flex-shrink-0 rounded-[1px]"
                  style={{ backgroundColor: C.accent }}
                >
                  <LogoMark className="w-[12px] h-[12px] text-[#000b12]" />
                </div>
                <span
                  className="font-mono text-[13px] font-bold tracking-[0.1em] uppercase"
                  style={{ color: C.accentSoft }}
                >
                  DZen Context
                </span>
              </div>

              <button
                onClick={onClose}
                className="font-mono text-[9px] tracking-widest uppercase px-4 py-2 transition-all rounded-[1px] cursor-pointer"
                style={{
                  color: C.textMuted,
                  border: `1px solid ${C.cardBorder}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.accentSoft;
                  e.currentTarget.style.borderColor = "rgba(126,195,226,0.28)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.textMuted;
                  e.currentTarget.style.borderColor = C.cardBorder;
                }}
                aria-label="Close founders panel"
              >
                Close ✕
              </button>
            </div>

            <div
              ref={scrollRef}
              data-lenis-prevent
              className="founders-scroll flex-1 min-h-0 overflow-y-auto overscroll-y-contain scrollbar-thin px-8 sm:px-10 py-10 sm:py-12 space-y-12"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: C.accent }}
                  />
                  {open && <Typewriter text="Operating Philosophy" delay={200} />}
                </div>

                <h2
                  className="font-sans text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em]"
                  style={{ color: C.textPrimary }}
                >
                  Enterprise systems need{" "}
                  <span style={{ color: C.accentSoft }}>clarity</span> and{" "}
                  <span style={{ color: C.accentSoft }}>control</span>.
                </h2>

                <p
                  className="font-sans text-[14px] font-normal leading-relaxed max-w-xl"
                  style={{ color: C.textMuted }}
                >
                  DZen was built to close the operational gaps that drain focus, time, and revenue. We build secure, custom integrations that connect your ERP, comms tools, and the systems you already run.
                </p>

                <p
                  className="font-sans text-[14px] font-normal leading-relaxed max-w-xl"
                  style={{ color: C.textMuted }}
                >
                  We believe technology works best when it is quiet, robust, and completely responsive. No fluff. No fragile mockups. We deploy production-grade software that is governed step-by-step.
                </p>
              </div>

              <div
                className="grid grid-cols-2 max-[480px]:grid-cols-1 rounded-[2px] overflow-hidden"
                style={{ border: `1px solid ${C.divider}`, backgroundColor: "rgba(13,13,12,0.5)" }}
              >
                {COMPANY_META.map((meta) => (
                  <div
                    key={meta.label}
                    className="p-5 max-[480px]:border-r-0 max-[480px]:border-b"
                    style={{ borderBottom: `1px solid ${C.divider}`, borderRight: `1px solid ${C.divider}` }}
                  >
                    <div
                      className="font-mono text-[8px] tracking-widest uppercase font-bold mb-1"
                      style={{ color: "rgba(178,213,229,0.45)" }}
                    >
                      {meta.label}
                    </div>
                    <div
                      className="font-sans text-[13px] font-semibold"
                      style={{ color: C.accentSoft }}
                    >
                      {meta.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pb-4">
                <div
                  className="font-mono text-[9px] tracking-widest uppercase font-bold"
                  style={{ color: "rgba(178,213,229,0.45)" }}
                >
                  Active Operators
                </div>
                <div className="grid grid-cols-1 gap-5">
                  {FOUNDERS.map((founder) => (
                    <FounderCard
                      key={founder.name}
                      {...founder}
                      open={open}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
