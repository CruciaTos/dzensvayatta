"use client";

/**
 * SectionFlow — page-level "object persistence" transition system.
 *
 * Replaces the idea of nesting HeroSlideTransition-style sticky/cover
 * wrappers between every section (which would stack competing sticky
 * contexts and scroll spacers). Instead, a single small glowing node
 * lives in a fixed overlay above the whole page. One page-level
 * useScroll progress value drives:
 *
 *   1. The orb's vertical position, interpolated across registered
 *      section anchors (one entry per section boundary in page.tsx).
 *   2. The orb's "form" at each boundary — circle -> thin grid-line
 *      bridge -> small split nodes -> reforms to a circle — using
 *      opacity/scale/clipPath, not layout, so it never affects
 *      document flow or section heights.
 *
 * HeroSlideTransition is untouched; this system starts visually
 * "handing off" once CaseStudies is on screen and continues for
 * every subsequent section boundary.
 *
 * Usage: mount once in app/layout.tsx (sibling to GlobalVideoBackground),
 * then call useRegisterSection(id) inside each section's wrapper — or,
 * simpler, just drop <SectionAnchor id="capabilities" /> as the first
 * child of a section. See bottom of file for the zero-edit alternative.
 */

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "motion/react";

// ─── Section registry (id -> top offset in px, relative to document) ──────────
interface FlowContextValue {
    registerAnchor: (id: string, el: HTMLElement | null) => void;
}

const FlowContext = createContext<FlowContextValue | null>(null);

export function useSectionFlow() {
    return useContext(FlowContext);
}

/**
 * Drop this as the very first element inside any section you want the
 * orb to treat as a waypoint. It renders nothing visible — just a 1px
 * sentinel used to read scroll position.
 */
export function SectionAnchor({ id }: { id: string }) {
    const ctx = useContext(FlowContext);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        ctx?.registerAnchor(id, ref.current);
        return () => ctx?.registerAnchor(id, null);
    }, [ctx, id]);

    // No positioning here on purpose — getBoundingClientRect() works
    // regardless of the parent's position context, and a plain in-flow
    // 0-height element is the least likely to disturb section layout.
    return <div ref={ref} aria-hidden="true" style={{ width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }} />;
}

// ─── Visual orb ─────────────────────────────────────────────────────────────
const ACCENT = "#7ec3e2";
const ACCENT_SOFT = "rgba(178,213,229,0.85)";

function OrbVisual({ formIndex }: { progress: MotionValue<number>; formIndex: MotionValue<number> }) {
    // formIndex cycles 0..1 within each inter-anchor span:
    // 0.00–0.15  -> circle (resting)
    // 0.15–0.45  -> stretches into a thin horizontal grid-line bridge
    // 0.45–0.55  -> bridge peak (full width line, low opacity)
    // 0.55–0.85  -> contracts, splits into two small flanking nodes
    // 0.85–1.00  -> nodes reconverge into circle for the next section

    const coreScale = useTransform(formIndex, [0, 0.15, 0.45, 0.55, 0.85, 1], [1, 1, 0.3, 0.3, 1, 1]);
    const coreOpacity = useTransform(formIndex, [0, 0.15, 0.4, 0.6, 0.85, 1], [1, 1, 0.35, 0.35, 1, 1]);

    const lineScaleX = useTransform(formIndex, [0.15, 0.45, 0.55, 0.85], [0, 1, 1, 0]);
    const lineOpacity = useTransform(formIndex, [0.15, 0.3, 0.5, 0.7, 0.85], [0, 0.5, 0.65, 0.5, 0]);

    const satelliteOpacity = useTransform(formIndex, [0.5, 0.62, 0.78, 0.9], [0, 1, 1, 0]);
    const satelliteSpread = useTransform(formIndex, [0.5, 0.85], [0, 1]);

    return (
        <>
            {/* Grid-line bridge — extends from the orb left/right as it passes a boundary */}
            <motion.div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "min(60vw, 640px)",
                    height: "1px",
                    x: "-50%",
                    y: "-50%",
                    scaleX: lineScaleX,
                    opacity: lineOpacity,
                    background: `linear-gradient(90deg, transparent 0%, ${ACCENT_SOFT} 20%, ${ACCENT} 50%, ${ACCENT_SOFT} 80%, transparent 100%)`,
                    transformOrigin: "center",
                }}
            />

            {/* Two flanking satellite nodes */}
            <motion.div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: ACCENT,
                    opacity: satelliteOpacity,
                    x: useTransform(satelliteSpread, (v) => `calc(-50% - ${v * 46}px)`),
                    y: "-50%",
                    boxShadow: `0 0 8px 1px ${ACCENT}`,
                }}
            />
            <motion.div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: ACCENT,
                    opacity: satelliteOpacity,
                    x: useTransform(satelliteSpread, (v) => `calc(-50% + ${v * 46}px)`),
                    y: "-50%",
                    boxShadow: `0 0 8px 1px ${ACCENT}`,
                }}
            />

            {/* Core orb */}
            <motion.div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    x: "-50%",
                    y: "-50%",
                    scale: coreScale,
                    opacity: coreOpacity,
                    background: ACCENT,
                    boxShadow: `0 0 16px 3px rgba(126,195,226,0.55), 0 0 4px 1px ${ACCENT}`,
                }}
            />
        </>
    );
}

// ─── Provider + fixed overlay ───────────────────────────────────────────────
export function SectionFlowProvider({ children }: { children: ReactNode }) {
    const anchorsRef = useRef<Map<string, HTMLElement>>(new Map());
    const [positions, setPositions] = useState<{ id: string; top: number }[]>([]);
    const [docHeight, setDocHeight] = useState(0);
    const [viewportH, setViewportH] = useState(0);

    const registerAnchor = useCallback((id: string, el: HTMLElement | null) => {
        if (el) anchorsRef.current.set(id, el);
        else anchorsRef.current.delete(id);
    }, []);

    // Recompute anchor offsets after layout settles (fonts, images, etc).
    useEffect(() => {
        let raf = 0;
        const measure = () => {
            const entries = Array.from(anchorsRef.current.entries())
                .map(([id, el]) => ({ id, top: el.getBoundingClientRect().top + window.scrollY }))
                .sort((a, b) => a.top - b.top);
            setPositions(entries);
            setDocHeight(document.documentElement.scrollHeight);
            setViewportH(window.innerHeight);
        };

        raf = requestAnimationFrame(() => requestAnimationFrame(measure));
        window.addEventListener("resize", measure);
        window.addEventListener("load", measure);

        const ro = new ResizeObserver(measure);
        ro.observe(document.body);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", measure);
            window.removeEventListener("load", measure);
            ro.disconnect();
        };
    }, []);

    const { scrollY } = useScroll();
    const smoothScrollY = useSpring(scrollY, { stiffness: 120, damping: 26, restDelta: 0.5 });

    // Orb Y position: piecewise-interpolated across registered anchors,
    // each offset to roughly the vertical center of its section's opening.
    const orbY = useTransform(smoothScrollY, (y) => {
        if (positions.length < 2 || !viewportH) return y + viewportH * 0.5;

        const targetY = y + viewportH * 0.5;
        // Clamp before first / after last anchor
        if (targetY <= positions[0].top) return positions[0].top;
        const last = positions[positions.length - 1];
        if (targetY >= last.top) return last.top;

        for (let i = 0; i < positions.length - 1; i++) {
            const a = positions[i];
            const b = positions[i + 1];
            if (targetY >= a.top && targetY <= b.top) {
                const span = b.top - a.top || 1;
                const t = (targetY - a.top) / span;
                return a.top + t * span;
            }
        }
        return targetY;
    });

    // formIndex: 0..1 progress *within* the current inter-anchor span —
    // drives the morph (circle -> line -> nodes -> circle) independent of
    // absolute scroll distance, so each boundary morphs identically.
    const formIndex = useTransform(smoothScrollY, (y) => {
        if (positions.length < 2 || !viewportH) return 0;
        const targetY = y + viewportH * 0.5;
        if (targetY <= positions[0].top) return 0;
        const last = positions[positions.length - 1];
        if (targetY >= last.top) return 0;

        for (let i = 0; i < positions.length - 1; i++) {
            const a = positions[i];
            const b = positions[i + 1];
            if (targetY >= a.top && targetY <= b.top) {
                const span = b.top - a.top || 1;
                return (targetY - a.top) / span;
            }
        }
        return 0;
    });

    // Fade the whole orb out near the very top (inside Hero, where
    // HeroSlideTransition already owns the cinematic moment) and near
    // the very bottom (Footer).
    const globalOpacity = useTransform(smoothScrollY, (y) => {
        if (!docHeight || !viewportH || positions.length === 0) return 0;
        const firstAnchor = positions[0]?.top ?? 0;
        const fadeInStart = Math.max(firstAnchor - viewportH * 0.6, 0);
        const fadeInEnd = firstAnchor;
        const lastAnchor = positions[positions.length - 1]?.top ?? docHeight;
        const fadeOutStart = lastAnchor;
        const fadeOutEnd = lastAnchor + viewportH * 0.4;

        if (y < fadeInStart) return 0;
        if (y < fadeInEnd) return (y - fadeInStart) / Math.max(fadeInEnd - fadeInStart, 1);
        if (y < fadeOutStart) return 1;
        if (y < fadeOutEnd) return 1 - (y - fadeOutStart) / Math.max(fadeOutEnd - fadeOutStart, 1);
        return 0;
    });

    const contextValue = useMemo(() => ({ registerAnchor }), [registerAnchor]);

    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return (
        <FlowContext.Provider value={contextValue}>
            {children}
            {!prefersReducedMotion && (
                <motion.div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        width: 1,
                        height: 1,
                        y: orbY,
                        opacity: globalOpacity,
                        zIndex: 5,
                        pointerEvents: "none",
                    }}
                >
                    <OrbVisual progress={smoothScrollY} formIndex={formIndex} />
                </motion.div>
            )}
        </FlowContext.Provider>
    );
}