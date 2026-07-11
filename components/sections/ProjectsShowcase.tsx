"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionIndex } from "@/components/ui/SectionIndex";

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
  cardBg: "rgba(9,9,9,0.55)", // kept in constants but no longer used as card background
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

interface Project {
  id: string;
  name: string;
  tag: string;
  domain: string;
  headline: string;
  body: string;
  stack: string[];
  status: "Live" | "In Development";
  images: string[];
}

const PROJECTS: Project[] = [
  {
    id: "01",
    name: "CruSam",
    tag: " Deployed - Aarti Enterprises",
    domain: "Windows Desktop · Flutter",
    headline: "A full operations backbone for employee records, payroll, and finance.",
    body: "Handles employee records, salary processing, voucher and invoice creation, PDF/Excel export, and an embedded AI assistant built on Ollama and Gemini. Includes bidirectional Google Drive sync, a modular AI chat panel, Gmail integration for sending invoices and salary documents, and a self-updating release pipeline via GitHub.",
    stack: ["Flutter", "SQLite", "Gemini"],
    status: "Live",
    images: [
      "/project-mock.jpg",
      "/project-mock-2.jpg",
      "/project-mock-3.jpg",
    ],
  },
];

function ImageCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

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
          <Image
            src={images[current]}
            alt={`Slide ${current + 1}`}
            fill
            sizes="(max-width: 1600px) 50vw, 800px"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
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
          {images.map((_, idx) => (
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

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: EASE }}
      style={{
        position: "relative",
        borderRadius: "24px",
        border: `1px solid ${C.hairline}`,
        backgroundColor: "transparent",
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

        <h3
          className="font-sans font-bold mb-5"
          style={{
            fontSize: "clamp(60px, 7vw, 84px)",
            color: C.textPrimary,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          {project.name}
        </h3>

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

        <div className="flex flex-wrap gap-3">
          {project.stack.map((s) => (
            <span
              key={s}
              className="font-mono text-[13px] uppercase tracking-[0.1em] px-4 py-2 rounded-md"
              style={{
                color: C.textFaint,
                border: `1px solid ${C.divider}`,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* RIGHT IMAGE CAROUSEL */}
      <div
        style={{
          flex: "1 1 45%",
          position: "relative",
          minHeight: "100%",
          overflow: "hidden",
        }}
      >
        <ImageCarousel images={project.images} />
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
    </motion.div>
  );
}

export function ProjectsShowcase() {
  return (
    <section
      id="projects"
      aria-label="Our projects"
      style={{
        paddingTop: "clamp(140px, 14vw, 180px)",
        paddingBottom: "clamp(88px, 10vw, 140px)",
      }}
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-14 md:mb-20">
          <h1
            className="font-sans font-bold mb-5"
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              color: C.textPrimary,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
            }}
          >
            What we&apos;ve
            <br />
            <em className="not-italic" style={{ color: C.textMuted }}>
              actually built.
            </em>
          </h1>
          <p
            className="font-sans font-light max-w-[560px]"
            style={{ fontSize: "17px", color: C.textMuted, lineHeight: 1.7 }}
          >
            No placeholder case studies. These are the systems we&apos;ve shipped
            for real clients, and the platform we run ourselves.
          </p>
        </FadeIn>

        <div className="flex flex-col gap-10 md:gap-12">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* More projects coming soon indicator */}
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
            More projects coming soon
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
    </section>
  );
}