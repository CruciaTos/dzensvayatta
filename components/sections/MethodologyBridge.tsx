// components/sections/MethodologyBridge.tsx
"use client";

import { useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    type MotionValue,
} from "motion/react";

/* ─────────────────────────────────────────────────────────────────
   MethodologyBridge
   Scroll-pinned transition between CaseStudies and CapabilitiesSection.

   A single bordered panel persists on screen as one continuous object:
   it starts as a small "seed" carrying the section's own index number
   (03 — the same digit CapabilitiesSection labels itself with), then
   scales open into a full frame. As it opens, a row of six phase ticks
   — collapsed into the centre at first — spreads out into the spaced
   grid that previews the methodology section sitting right beneath it.
───────────────────────────────────────────────────────────────────*/

const SCROLL_DISTANCE_VH = 180;

const PHASE_PREVIEW = [
    { index: "01", label: "Audit" },
    { index: "02", label: "Blueprint" },
    { index: "03", label: "Build" },
    { index: "04", label: "Deploy" },
    { index: "05", label: "Support" },
    { index: "06", label: "Scale" },
] as const;

function PhaseTick({
    progress,
    index,
    total,
    num,
    label,
}: {
    progress: MotionValue<number>;
    index: number;
    total: number;
    num: string;
    label: string;
}) {
    // Staggered window for this tick within the broader "grid expansion" beat.
    const start = 0.46 + index * 0.04;
    const end = start + 0.13;

    const spread = useTransform(progress, [start, end], [0, 1]);
    const opacity = useTransform(progress, [start, start + 0.06], [0, 1]);

    // Pulled toward the centre column at rest=0, released to its natural
    // flex slot at rest=1 — a collapsed cluster opening into a row.
    const centerOffset = (index - (total - 1) / 2) * 78;
    const x = useTransform(spread, [0, 1], [-centerOffset, 0]);
    const scale = useTransform(spread, [0, 1], [0.35, 1]);

    return (
        <motion.div
            style={{ x, scale, opacity }}
            className="flex flex-col items-center gap-2"
        >
            <span className="font-mono text-[10px] tracking-[2px] text-stone-50/80">
                {num}
            </span>
            <span className="font-mono text-[8px] tracking-[2px] uppercase text-stone-500">
                {label}
            </span>
        </motion.div>
    );
}

export function MethodologyBridge() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const progress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 22,
        restDelta: 0.0001,
    });

    // Ambient backdrop glow, blue (Case Studies) bleeding into accent (Methodology).
    const glowOpacity = useTransform(progress, [0, 0.15, 0.85, 1], [0, 0.5, 0.5, 0]);

    // The persistent seed panel — one object, scaling open.
    const panelScale = useTransform(progress, [0, 0.46], [0.16, 1]);
    const panelOpacity = useTransform(progress, [0, 0.05], [0, 1]);
    const panelRadius = useTransform(progress, [0, 0.46], [999, 6]);
    const panelBorder = useTransform(
        progress,
        [0, 0.46],
        ["rgba(126,195,226,0.45)", "rgba(143,120,96,0.35)"]
    );

    // Seed numeral, visible only while the panel still reads as a small badge.
    const seedOpacity = useTransform(progress, [0.02, 0.1, 0.22], [1, 1, 0]);

    // Wipe line — echoes the same motif used at the Hero → Case Studies handoff.
    const wipeOpacity = useTransform(
        progress,
        [0.42, 0.46, 0.78, 0.84],
        [0, 1, 1, 0]
    );

    // Full-resolution overlay content, independent of the panel's own scale
    // so the type stays crisp regardless of how small the seed started.
    const overlayOpacity = useTransform(progress, [0.3, 0.46], [0, 1]);
    const overlayY = useTransform(progress, [0.3, 0.46], [18, 0]);

    // Whole stage exits just before the pin releases into CapabilitiesSection.
    const exitOpacity = useTransform(progress, [0.84, 1], [1, 0]);
    const exitY = useTransform(progress, [0.84, 1], ["0%", "-4%"]);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            style={{ position: "relative", height: `${SCROLL_DISTANCE_VH}vh` }}
        >
            <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
                <motion.div
                    style={{ opacity: exitOpacity, y: exitY }}
                    className="relative w-full h-full flex items-center justify-center"
                >
                    {/* Ambient glow */}
                    <motion.div style={{ opacity: glowOpacity }} className="absolute inset-0 pointer-events-none">
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(143,120,96,0.10) 0%, rgba(126,195,226,0.05) 45%, transparent 75%)",
                            }}
                        />
                    </motion.div>

                    {/* Wipe line */}
                    <motion.div
                        style={{
                            opacity: wipeOpacity,
                            background:
                                "linear-gradient(90deg, transparent 0%, rgba(143,120,96,0.5) 20%, rgba(178,213,229,0.7) 50%, rgba(143,120,96,0.5) 80%, transparent 100%)",
                        }}
                        className="absolute top-1/2 left-0 right-0 h-[1.5px] -translate-y-1/2 pointer-events-none"
                    />

                    {/* Seed panel — single persistent object that scales open */}
                    <motion.div
                        style={{
                            width: "clamp(220px, 56vw, 640px)",
                            height: "clamp(170px, 40vh, 400px)",
                            scale: panelScale,
                            opacity: panelOpacity,
                            borderRadius: panelRadius,
                            borderColor: panelBorder,
                        }}
                        className="relative flex items-center justify-center border bg-[rgba(8,7,6,0.55)] backdrop-blur-sm"
                    >
                        <motion.span
                            style={{ opacity: seedOpacity }}
                            className="font-mono text-[13px] tracking-[6px] text-stone-300"
                        >
                            03
                        </motion.span>
                    </motion.div>

                    {/* Full-resolution overlay content */}
                    <motion.div
                        style={{ opacity: overlayOpacity, y: overlayY }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-6 pointer-events-none"
                    >
                        <div className="flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                            <span className="font-mono text-[10px] tracking-[3px] uppercase text-accent">
                                Initializing Methodology
                            </span>
                        </div>

                        <div className="flex items-center gap-[clamp(20px,4vw,44px)]">
                            {PHASE_PREVIEW.map((p, i) => (
                                <PhaseTick
                                    key={p.index}
                                    progress={progress}
                                    index={i}
                                    total={PHASE_PREVIEW.length}
                                    num={p.index}
                                    label={p.label}
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}