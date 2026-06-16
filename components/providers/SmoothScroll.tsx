"use client";

import Lenis from "lenis";
import { createContext, ReactNode, useContext, useEffect, useRef } from "react";

// ─── Context ──────────────────────────────────────────────────────────────────
const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
    return useContext(LenisContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function SmoothScroll({ children }: { children: ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            // A low lerp value makes the scroll follow the target more lazily,
            // resulting in a very slow, buttery‑smooth inertia.
            lerp: 0.05,         // ← was duration: 1.2 + custom easing
            orientation: "vertical",
            smoothWheel: true,
            touchMultiplier: 2,
            wheelMultiplier: 1,
        });

        lenisRef.current = lenis;

        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    return (
        <LenisContext.Provider value={lenisRef.current}>
            {children}
        </LenisContext.Provider>
    );
}