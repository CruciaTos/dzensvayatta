"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const FOUNDERS = [
  {
    num: "I",
    name: "Soham Boridkar",
    email: "sohamboridkar@svayatta.in",
    linkedIn: "https://www.linkedin.com/in/soham-boridkar/",
    delay: 0.1,
  },
  {
    num: "II",
    name: "Smit Mhatre",
    email: "smitmhatre@svayatta.in",
    linkedIn: "https://linkedin.com/in/smit-mhatre",
    delay: 0.2,
  },
  {
    num: "III",
    name: "Varun Pal",
    email: "varunpal@svayatta.in",
    linkedIn: "https://www.linkedin.com/in/b777varunpal/",
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
  delay,
  open,
}: {
  num: string;
  name: string;
  email: string;
  linkedIn: string;
  delay: number;
  open: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      className="relative overflow-hidden flex flex-col justify-center min-h-[180px] px-8 py-9 rounded-[2px]"
      style={{
        border: `1px solid ${hovered ? "rgba(126,195,226,0.28)" : C.cardBorder}`,
        backgroundColor: C.cardBg,
        transition: "border-color 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        <h3
          className="font-sans font-bold leading-[1.1] tracking-[-0.02em] mb-2 cursor-pointer select-none text-[clamp(2.8rem,4.5vw,3.8rem)] -ml-[0.375rem]"
          style={{ color: C.textPrimary }}
        >
          {name}
        </h3>

        <div
          className="font-mono text-[9px] tracking-[2px] uppercase font-bold mb-6"
          style={{ color: C.accent }}
        >
          Co-Founder
        </div>

        <div className="space-y-3">
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
            LinkedIn ↗
          </a>
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
            className="fixed inset-0 z-[100] backdrop-blur-3xl"
            style={{ 
              backgroundColor: "rgba(0, 11, 18, 0.55)",
              border: "1px solid rgba(255,255,255,0.05)"
            }}
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
            className="fixed inset-y-0 right-0 w-full max-w-[884px] z-[101] shadow-2xl flex flex-col h-[100dvh] overflow-hidden"
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
                  Our Ambitions & Us
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
              {/* ── Operating Philosophy section REMOVED ── */}

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: C.accent }}
                  />
                  {open && <Typewriter text="DZen & Svayatta" delay={260} />}
                </div>

                <h2
                  className="font-sans font-bold leading-[1.05] tracking-[-0.03em] text-[clamp(2.5rem,5vw,3.8rem)]"
                  style={{ color: C.textPrimary }}
                >
                  DZen is us. <span style={{ color: C.accentSoft }}>Svayatta</span> is how we build.
                </h2>

                <p
                  className="font-sans text-[14px] font-normal leading-relaxed max-w-[740px]"
                  style={{ color: C.textMuted }}
                >
                  Dzen is the name that sits over everything we do. It&rsquo;s simply us, the founders and the standards behind the work.
                </p>

                <p
                  className="font-sans text-[14px] font-normal leading-relaxed max-w-[740px]"
                  style={{ color: C.textMuted }}
                >
                  Svayatta is the division inside DZen specifically for tech upscalings. The software, the workflow integrations, all applied intelligence is handled here.{" "}
                  <span style={{ color: C.accentSoft }}>स्वयत्ता</span> means self-governance and that&rsquo;s not for just a gimmik name. It&rsquo;s our Standard: Its the systems that upscales you; the systems that break the tranditional workflow redundancies and hold to their own limits.
                </p>

                <p
                  className="font-sans text-[14px] font-normal leading-relaxed max-w-[740px]"
                  style={{ color: C.textMuted }}
                >
                  It&rsquo;s the same idea behind everything else here. Providing remarkable Quality with uncompromised Clarity
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: C.accent }}
                  />
                  {open && <Typewriter text="Where We're Headed" delay={320} />}
                </div>

                <h2
                  className="font-sans font-bold leading-[1.05] tracking-[-0.03em] text-[clamp(2.5rem,5vw,3.8rem)]"
                  style={{ color: C.textPrimary }}
                >
                  This isn&rsquo;t a <span style={{ color: C.accentSoft }}>side project</span>.
                </h2>

                <p
                  className="font-sans text-[14px] font-normal leading-relaxed max-w-[740px]"
                  style={{ color: C.textMuted }}
                >
                  We are here to go beyond just delivering projects. DZEN grows by building alongside ambitious people, not by collecting clients.We see every partnership as opportunities to build something bigger; whether that's new products, new companies, or entirely new ventures. The goal is real infrastructure and reach behind what we build, and a long-term operation you can rely on for years, not a landing page and a pitch deck.
                </p>

                <p
                  className="font-sans text-[14px] font-normal leading-relaxed max-w-[740px]"
                  style={{ color: C.textMuted }}
                >
                  If you&rsquo;re passionate for growth, shared ambitions and building something meaningful, that&rsquo;s exactly the conversation we&rsquo;re looking to have.
                </p>
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