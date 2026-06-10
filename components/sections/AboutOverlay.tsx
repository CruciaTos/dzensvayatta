"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useScroll,
  useInView,
} from "framer-motion";
import { LogoMark } from "@/components/ui/Icons";

interface AboutOverlayProps {
  open: boolean;
  onClose: () => void;
}

const COMPANY_META = [
  { label: "Founded", value: "2025" },
  { label: "Focus", value: "Enterprise AI Integration" },
  { label: "Engagement model", value: "Fixed-scope, milestoned" },
  { label: "Standard", value: "SOC 2 · ISO 27001 · GDPR" },
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
      }, 38);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <span>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.55 }}
          className="inline-block w-[2px] h-[10px] bg-accent align-middle ml-[2px]"
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
  const isInView = useInView(cardRef, { once: true, margin: "0px 0px -60px 0px" });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 10);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 6);
  }
  function onMouseLeave() {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative overflow-hidden flex flex-col justify-center min-h-screen px-16 py-14 max-md:px-6 max-md:py-12"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(143,120,96,0.04)", transformOrigin: "bottom" }}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      <AnimatePresence>
        {hovered && (
          <motion.div
            key="scan"
            className="absolute top-0 h-full w-[1px] pointer-events-none z-20"
            style={{ background: "rgba(143,120,96,0.4)", left: 0 }}
            initial={{ x: 0 }}
            animate={{ x: cardRef.current?.offsetWidth ?? 1200 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      <motion.span
        className="absolute right-[-12px] top-[-16px] font-serif font-normal leading-none pointer-events-none select-none tracking-[-0.04em]"
        style={{ fontSize: "180px", color: "rgba(143,120,96,0.055)" }}
        aria-hidden="true"
        initial={{ opacity: 0, y: 40, scale: 0.85 }}
        animate={open ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.85 }}
        transition={{ duration: 0.9, delay: delay + 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {num}
      </motion.span>

      <div className="relative z-10">
        <motion.h3
          style={{ x: sx, y: sy }}
          className="font-serif text-[44px] font-normal text-stone-100 leading-[1.1] tracking-[-0.02em] mb-3 cursor-default"
        >
          {name}
        </motion.h3>

        <div className="overflow-hidden mb-8">
          <motion.div
            className="font-mono text-[11px] tracking-[0.12em] uppercase"
            style={{ color: "rgba(191,168,138,0.7)" }}
            initial={{ y: "100%", opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Founder
          </motion.div>
        </div>

        <div className="space-y-4 mb-8">
          <motion.a
            href={`mailto:${email}`}
            className="block font-mono text-[15px] tracking-[0.06em] text-accent no-underline"
            whileHover={{ x: 6, color: "#c4a882" }}
            transition={{ duration: 0.2 }}
          >
            {email}
          </motion.a>
          <motion.a
            href={linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-stone-500 no-underline"
            whileHover={{ color: "#121416", x: 4 }}
            transition={{ duration: 0.2 }}
          >
            LinkedIn ↗
          </motion.a>
        </div>

        <motion.div
          className="border-l-2 pl-5 py-1 max-w-xl"
          style={{ borderColor: "rgba(143,120,96,0.35)" }}
          initial={{ opacity: 0, x: -16 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: delay + 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-sans text-[13px] font-light text-stone-300 leading-relaxed italic">
            {quote}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Main overlay ─────────────────────────────────────────────────────────────
export function AboutOverlay({ open, onClose }: AboutOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as number[] },
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[99] bg-bg-primary/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.div
            ref={scrollRef}
            key="about-overlay"
            className="fixed inset-0 z-[100] bg-bg-primary overflow-y-auto flex flex-col"
            initial={{ y: "5%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "4%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="fixed top-0 left-0 right-0 h-[2px] bg-accent z-[101] origin-left"
              style={{ scaleX }}
            />

            <motion.div
              className="h-16 flex items-center justify-between px-12 max-md:px-6 border-b border-border flex-shrink-0 sticky top-0 bg-bg-primary/95 backdrop-blur-[20px] z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <Link
                href="/"
                aria-label="DZen home"
                className="flex items-center gap-[10px] no-underline"
                onClick={onClose}
              >
                <div className="w-7 h-7 bg-accent flex items-center justify-center flex-shrink-0">
                  <LogoMark className="w-[14px] h-[14px]" />
                </div>
                <span className="font-sans text-[15px] font-medium tracking-[0.06em] uppercase text-stone-100">
                  DZen
                </span>
              </Link>

              <motion.button
                onClick={onClose}
                className="font-mono text-[10px] tracking-[0.14em] uppercase text-stone-500 border border-border px-4 py-2"
                aria-label="Close about overlay"
                whileHover={{
                  color: "#121416",
                  borderColor: "rgba(18,20,22,0.22)",
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15 }}
              >
                Close ✕
              </motion.button>
            </motion.div>

            <motion.div
              className="flex flex-col"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {/* Company section */}
              <motion.div
                variants={fadeUp}
                className="flex flex-col px-12 py-20 max-md:px-6 max-md:py-12 border-b border-border"
              >
                <div className="flex items-center gap-3 mb-12">
                  <motion.div
                    className="h-px bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: 32 }}
                    transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-accent">
                    {open && <Typewriter text="About DZen" delay={550} />}
                  </span>
                </div>

                <h2 className="font-serif text-[clamp(32px,4vw,60px)] font-normal leading-[1.0] tracking-[-0.025em] text-stone-100 mb-10">
                  {(
                    [
                      "Intelligence built",
                      "into the <fabric>",
                      "of operations.",
                    ] as const
                  ).map((line, i) => (
                    <div key={i} className="overflow-hidden">
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{
                          duration: 0.65,
                          delay: 0.35 + i * 0.1,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {i === 1 ? (
                          <>
                            into the{" "}
                            <em className="not-italic text-stone-400">fabric</em>
                          </>
                        ) : (
                          line
                        )}
                      </motion.div>
                    </div>
                  ))}
                </h2>

                <motion.p
                  className="font-sans text-[15px] font-light text-stone-400 leading-[1.75] max-w-[720px] mb-6"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  DZen was founded on a single conviction: the gap between your
                  systems is where operational value goes to die. We build the
                  integration layer that closes that gap — connecting the tools
                  you already run, automating the decisions you already make,
                  and making the intelligence latent in your data finally
                  visible and useful.
                </motion.p>
                <motion.p
                  className="font-sans text-[15px] font-light text-stone-400 leading-[1.75] max-w-[720px]"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  We work exclusively with mid-market and enterprise operators.
                  No demos. No pilots. Production-grade from day one.
                </motion.p>

                <motion.div
                  className="mt-16"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <div className="grid grid-cols-2 max-[500px]:grid-cols-1 border border-border">
                    {COMPANY_META.map((meta, i) => (
                      <motion.div
                        key={meta.label}
                        className={[
                          "px-6 py-5",
                          i % 2 === 0
                            ? "border-r border-border max-[500px]:border-r-0"
                            : "",
                          i >= 2 ? "border-t border-border" : "",
                          "max-[500px]:border-b",
                          i === COMPANY_META.length - 1
                            ? "max-[500px]:border-b-0"
                            : "",
                        ].join(" ")}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.95 + i * 0.07,
                        }}
                      >
                        <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-stone-600 mb-1">
                          {meta.label}
                        </div>
                        <div className="font-sans text-[13px] font-light text-stone-400">
                          {meta.value}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-border">
                    <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-stone-600 mb-2">
                      General enquiries
                    </div>
                    <motion.a
                      href="mailto:hello@DZen.io"
                      className="font-mono text-[12px] tracking-[0.06em] text-accent no-underline"
                      whileHover={{ x: 4, color: "#c4a882" }}
                      transition={{ duration: 0.2 }}
                    >
                      hello@DZen.io
                    </motion.a>
                  </div>
                </motion.div>
              </motion.div>

              <FounderCard
                num="01"
                name="Soham Boridkar"
                email="sohamboridkar@gmail.com"
                linkedIn="https://linkedin.com/in/sohamboridkar"
                quote="サーバーの向こう側と、目の前の現実。その境界を、もっと薄くできると思っています。気づかれないほど自然に機能する技術が、いちばん良い技術だと信じています。"
                delay={0.1}
                open={open}
              />
              <FounderCard
                num="02"
                name="Smit Mhatre"
                email="smit2004mhatre@gmail.com"
                linkedIn="https://linkedin.com/in/smit-mhatre"
                quote="運営の摩擦をなくすことが生産性の鍵です。AIを派手に見せるのではなく、必要な瞬間に必要な情報を届ける。それこそが本当の価値です。"
                delay={0.18}
                open={open}
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}