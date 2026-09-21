"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { FadeIn } from "@/components/ui/FadeIn";
import { DeviceMockup, type MockupSlide, type MockupTheme } from "@/components/ui/DeviceMockup";
import { useIsMobile } from "@/hooks/useIsMobile";

const C = {
  accent: "#7EC3E2",
  accentSoft: "#B2D5E5",
  textPrimary: "#e5f3e5",
  textMuted: "rgba(229,243,229,0.65)",
  textFaint: "rgba(178,213,229,0.35)",
  divider: "rgba(178,213,229,0.10)",
  hairline: "rgba(178,213,229,0.18)",
  chipBg: "rgba(126,195,226,0.08)",
  chipBorder: "rgba(178,213,229,0.16)",
  cardBg: "rgba(9,9,9,0.55)",
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

/** A pre-rendered mockup image, or a device layout drawn in code. */
export type ProjectSlide = string | MockupSlide;

export interface Project {
  id: string;
  name: string;
  tag: string;
  domain: string;
  headline: string;
  body: string;
  stack: string[];
  status: "Live" | "In Development";
  slides: ProjectSlide[];
}

export const CRUSAM_PROJECT: Project = {
  id: "01",
  name: "CruSam",
  tag: " Deployed - Aarti Enterprises",
  domain: "Windows Desktop · Flutter",
  headline: "An unified ERP for employee records, payroll, and finance.",
  body: "Designed to replace scattered spreadsheets and disconnected tools, CruSam helps businesses manage employee records, process salaries, create invoices and vouchers, organize documents, and generate reports from a single platform. An integrated AI assistant further streamlines daily operations by helping users find information, automate routine tasks, and work more efficiently.",
  stack: [
    "Agentic AI Assistant",
    "Semantic Search Engine",
    "Multimodal AI Input",
    "Self-Updating Desktop App",
    "Automated Cloud Backup",
    "Deduplicated Sync",
    "Email Integration",
    "Versioned Local Database",
    "Encrypted Local Storage",
    "Usage & Cost Governance",
  ],
  status: "Live",
  slides: [
    "/images/Crusam_Mockups/Dashboard_MD.png",
    "/images/Crusam_Mockups/Invoice Creation.png",
    "/images/Crusam_Mockups/invoice-snapshot.png",
    "/images/Crusam_Mockups/salaryentry-analytics.png",
  ],
};

// Growmont's own palette (the CRM's green sidebar and navy primary), so the
// sketched screens read like the app until real screenshots replace them.
const GROWMONT_THEME: MockupTheme = {
  glow: ["rgba(45,138,78,0.85)", "rgba(0,51,124,0.9)"],
  sidebar: ["#0F4A31", "#092E1E"],
  accent: "#2D8A4E",
  accentAlt: "#00337C",
};

// Screenshots: put them in public/images/Growmont_CRM/ and set `src` on the
// matching screen. A screen without `src` draws a sketch of the app.
export const GROWMONT_CRM_PROJECT: Project = {
  id: "02",
  name: "Growmont CRM",
  tag: " Deployed - Growmont",
  domain: "Windows Desktop · Android · Flutter",
  headline: "A local-first CRM for a wealth management team's clients, sales, and follow-ups.",
  body: "Built for Growmont's advisors and admins, Growmont CRM brings client records, sales across every investment product the firm offers, client interactions, and follow-up reminders into one app for Windows desktops and Android phones. On desktop every change is saved locally first and synced to the cloud in the background, so the team keeps working without a connection. Role-based access keeps admin tools like team management and the combined info portal separate from each advisor's own book, and reminders reach the right person by email on schedule.",
  stack: [
    "Local-First Offline Mode",
    "Background Cloud Sync",
    "Role-Based Access",
    "Admin-Approved Onboarding",
    "Google Sign-In",
    "Scheduled Email Reminders",
    "Excel Import & Export",
    "Revenue Analytics",
    "Self-Updating Desktop App",
    "Automatic Local Backups",
  ],
  status: "Live",
  slides: [
    {
      layout: "overlap",
      theme: GROWMONT_THEME,
      screens: [
        { label: "Dashboard", sketch: "dashboard" },
        { label: "Sales", sketch: "table" },
      ],
    },
    {
      layout: "staggered",
      theme: GROWMONT_THEME,
      screens: [
        { label: "Interactions", sketch: "table" },
        { label: "Revenue Analytics", sketch: "analytics" },
      ],
    },
    {
      layout: "desktop-phone",
      theme: GROWMONT_THEME,
      screens: [
        { label: "Clients", sketch: "table" },
        { label: "Dashboard" },
      ],
    },
    {
      layout: "single",
      theme: GROWMONT_THEME,
      screens: [{ label: "Info Portal", sketch: "table" }],
    },
  ],
};

// Screenshots: public/images/Growmont_PMS/, wired the same way as the CRM.
export const GROWMONT_PMS_PROJECT: Project = {
  id: "03",
  name: "Growmont PMS",
  tag: " In Development",
  domain: "Web Platform · Python · DuckDB",
  headline: "Fund analysis for wealth managers: performance, risk, and peer ranking for every mutual fund.",
  body: "Growmont PMS is an analysis platform for wealth managers and investment professionals, built to replace hours of manual research per client with a faster, data-driven view. It turns twenty years of AMFI NAV history across 8,500+ active Indian mutual funds into trailing returns, risk metrics such as Sharpe, Sortino, drawdown, and VaR, and a configurable score that ranks each fund against its SEBI category peers. Benchmark comparison, portfolio-level analysis, and AI-driven insights are next on the roadmap.",
  stack: [
    "20-Year NAV History",
    "8,500+ Active Funds",
    "Returns & CAGR Engine",
    "Risk Metrics Engine",
    "Peer-Group Scoring",
    "Configurable Weights",
    "SEBI Category Mapping",
    "Searchable Fund Explorer",
    "Auditable Calculations",
  ],
  status: "In Development",
  slides: [
    {
      layout: "overlap",
      theme: GROWMONT_THEME,
      screens: [
        { label: "Fund Explorer", sketch: "table" },
        { label: "Fund Detail", sketch: "analytics" },
      ],
    },
    {
      layout: "single",
      theme: GROWMONT_THEME,
      screens: [{ label: "Peer Ranking", sketch: "dashboard" }],
    },
  ],
};

function SlideCarousel({ slides }: { slides: ProjectSlide[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0 }}
        >
          {typeof slide === "string" ? (
            <Image
              src={slide}
              alt={`Slide ${current + 1}`}
              fill
              sizes="(max-width: 1600px) 50vw, 800px"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          ) : (
            <DeviceMockup slide={slide} />
          )}
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            right: "24px",
            display: "flex",
            gap: "8px",
            zIndex: 2,
          }}
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: idx === current ? C.accent : "rgba(229,243,229,0.3)",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  index,
  action,
}: {
  project: Project;
  index: number;
  action?: ReactNode;
}) {
  const reduce = useReducedMotion();
  // Mobile: card appears directly, no fade/slide-up or stagger delay.
  // Desktop keeps the exact original whileInView animation.
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={isMobile ? false : reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={isMobile ? { duration: 0 } : { duration: 0.65, delay: index * 0.08, ease: EASE }}
      className="project-card"
      style={{
        position: "relative",
        borderRadius: "24px",
        border: `1px solid ${C.hairline}`,
        backgroundColor: "#000000",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        overflow: "hidden",
        width: "100%",
        maxWidth: "1600px",
        minHeight: "800px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* LEFT CONTENT */}
      <div
        className="project-card-left"
        style={{
          flex: "1 1 55%",
          padding: "clamp(100px, 10vw, 120px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          aria-hidden="true"
          className="project-card-ghost-num"
          style={{
            position: "absolute",
            top: "-50px",
            left: "50px",
            fontSize: "260px",
            fontFamily: "serif",
            lineHeight: 1,
            color: "rgba(178,213,229,0.04)",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
          }}
        >
          {project.id}
        </div>

        <div className="flex items-center gap-3 mb-7 flex-wrap" style={{ position: "relative", zIndex: 1 }}>
          <span
            className="font-mono text-[13px] uppercase tracking-[0.16em] px-4 py-2 rounded-full"
            style={{
              color: C.accentSoft,
              backgroundColor: C.chipBg,
              border: `1px solid ${C.chipBorder}`,
            }}
          >
            {project.tag}
          </span>
        </div>

        {/* h1, not h3: with the page-level "What we've built so far" heading
            removed, the product name is the page's top-level heading and was
            the only one left. Purely structural — the size here is set by the
            inline style, so nothing changes visually. */}
        <h1
          className="font-sans font-bold mb-5"
          style={{
            fontSize: "clamp(60px, 7vw, 84px)",
            color: C.textPrimary,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          {project.name}
        </h1>

        <p
          className="font-sans font-light mb-6"
          style={{
            fontSize: "clamp(18px, 1.8vw, 22px)",
            color: C.accentSoft,
            lineHeight: 1.5,
          }}
        >
          {project.headline}
        </p>

        <p
          className="font-sans font-light mb-8"
          style={{
            fontSize: "14px",
            color: C.textMuted,
            lineHeight: 1.8,
            maxWidth: "850px",
          }}
        >
          {project.body}
        </p>

        {/* Smaller tech stack tags */}
        <div className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="font-mono text-[10px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-md"
              style={{
                color: C.textFaint,
                border: `1px solid ${C.divider}`,
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Optional per-product action (e.g. Growmont's gated download),
            closing out the left column under a hairline. */}
        {action && (
          <div
            className="mt-10 pt-8"
            style={{ borderTop: `1px solid ${C.divider}`, position: "relative", zIndex: 1 }}
          >
            {action}
          </div>
        )}
      </div>

      {/* RIGHT IMAGE CAROUSEL with rounded black border */}
      <div
        className="project-card-right"
        style={{
          flex: "1 1 45%",
          position: "relative",
          minHeight: "100%",
          padding: "24px",
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <div
          className="project-card-media"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            border: "1px solid #000000",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <SlideCarousel slides={project.slides} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(9,9,9,0.25)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsShowcase({
  project = CRUSAM_PROJECT,
  action,
}: {
  project?: Project;
  action?: ReactNode;
}) {
  return (
    <section
      id="products"
      aria-label="Our products"
      style={{
        paddingTop: "clamp(140px, 14vw, 180px)",
        paddingBottom: "clamp(88px, 10vw, 140px)",
      }}
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:gap-12">
          <ProjectCard project={project} index={0} action={action} />
        </div>

        {/* More products coming soon indicator */}
        <FadeIn delay={0.3} className="mt-12 flex justify-center">
          <div
            className="flex items-center gap-3 px-5 py-2 rounded-full"
            style={{
              backgroundColor: "rgba(126,195,226,0.05)",
              border: `1px solid ${C.divider}`,
              color: C.textFaint,
              fontSize: "14px",
              fontFamily: "monospace",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{
                backgroundColor: C.accent,
                animation: "pulse 2s infinite",
              }}
            />
            More products coming soon
          </div>
        </FadeIn>

        <FadeIn delay={0.2} className="mt-20 flex justify-center">
          <Link
            href="/discovery"
            className="group inline-flex items-center gap-2 font-mono text-[13px] tracking-[0.15em] uppercase pb-1 border-b transition-colors duration-300"
            style={{ color: C.accentSoft, borderColor: "rgba(178,213,229,0.25)" }}
          >
            Start your own project with us
            <span
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </FadeIn>
      </div>

      {/* Mobile-only overrides — desktop (>900px) is completely untouched.
          On mobile the 55/45 row layout squeezes both the copy and the
          image into unreadably narrow columns, so we stack them instead. */}
      <style>{`
        @media (max-width: 900px) {
          .project-card {
            flex-direction: column !important;
            min-height: auto !important;
          }
          .project-card-left {
            flex: 1 1 auto !important;
            padding: 48px 24px 40px !important;
          }
          .project-card-ghost-num {
            font-size: 140px !important;
            top: -20px !important;
          }
          .project-card-right {
            flex: 1 1 auto !important;
            min-height: 320px !important;
            padding: 0 16px 24px !important;
          }
          /* Stacked, the column's height comes from min-height alone, which
             a percentage can't resolve against: height: 100% collapsed the
             media box to its 2px border. Auto lets the column stretch it. */
          .project-card-media {
            height: auto !important;
          }
          .projects-heading {
            white-space: normal !important;
            font-size: clamp(36px, 10vw, 64px) !important;
          }
        }
        @media (max-width: 480px) {
          .project-card-left {
            padding: 40px 18px 32px !important;
          }
          .project-card-right {
            min-height: 260px !important;
          }
        }
      `}</style>
    </section>
  );
}