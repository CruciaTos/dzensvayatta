"use client";

import { useEffect, useRef } from "react";

interface DotFieldProps {
    /** Base dot color (rgba or hex) */
    dotColor?: string;
    /** Dot color when influenced by the cursor */
    activeColor?: string;
    /** Spacing between dots in px */
    gap?: number;
    /** Base radius of each dot in px */
    radius?: number;
    /** Max radius a dot can grow to under cursor influence */
    maxRadius?: number;
    /** Radius of the cursor influence in px */
    proximity?: number;
    /** How strongly dots are pushed away from the cursor */
    repelStrength?: number;
    /** Spring stiffness (0-1, higher = snappier return) */
    spring?: number;
    /** Damping (0-1, higher = less oscillation) */
    damping?: number;
    className?: string;
}

interface Dot {
    ox: number;
    oy: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export function DotField({
    dotColor = "rgba(18, 20, 22, 0.16)",
    activeColor = "rgba(18, 20, 22, 0.65)",
    gap = 10,
    radius = 1.3,
    maxRadius = 3.4,
    proximity = 130,
    repelStrength = 28,
    spring = 0.08,
    damping = 0.82,
    className,
}: DotFieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({ x: -9999, y: -9999, active: false });
    const dots = useRef<Dot[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let raf = 0;

        function buildGrid() {
            const parent = canvas!.parentElement;
            if (!parent) return;

            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = parent.offsetWidth;
            height = parent.offsetHeight;
            canvas!.width = width * dpr;
            canvas!.height = height * dpr;
            canvas!.style.width = `${width}px`;
            canvas!.style.height = `${height}px`;
            ctx!.setTransform(1, 0, 0, 1, 0, 0);
            ctx!.scale(dpr, dpr);

            const cols = Math.ceil(width / gap) + 1;
            const rows = Math.ceil(height / gap) + 1;

            const next: Dot[] = [];
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const ox = i * gap;
                    const oy = j * gap;
                    next.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0 });
                }
            }
            dots.current = next;
        }

        function step() {
            const m = mouse.current;

            for (const d of dots.current) {
                if (m.active) {
                    const dx = d.x - m.x;
                    const dy = d.y - m.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;

                    if (dist < proximity) {
                        const force = (1 - dist / proximity) * repelStrength;
                        d.vx += (dx / dist) * force * 0.05;
                        d.vy += (dy / dist) * force * 0.05;
                    }
                }

                const sx = (d.ox - d.x) * spring;
                const sy = (d.oy - d.y) * spring;
                d.vx += sx;
                d.vy += sy;

                d.vx *= damping;
                d.vy *= damping;

                d.x += d.vx;
                d.y += d.vy;
            }
        }

        function draw() {
            ctx!.clearRect(0, 0, width, height);

            const m = mouse.current;

            for (const d of dots.current) {
                let r = radius;
                let color = dotColor;

                if (m.active) {
                    const dx = d.ox - m.x;
                    const dy = d.oy - m.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < proximity) {
                        const t = 1 - dist / proximity;
                        r = radius + t * (maxRadius - radius);
                        color = activeColor;
                        ctx!.globalAlpha = 0.4 + t * 0.6;
                    } else {
                        ctx!.globalAlpha = 1;
                    }
                } else {
                    ctx!.globalAlpha = 1;
                }

                ctx!.beginPath();
                ctx!.fillStyle = color;
                ctx!.arc(d.x, d.y, r, 0, Math.PI * 2);
                ctx!.fill();
            }

            ctx!.globalAlpha = 1;
        }

        function loop() {
            step();
            draw();
            raf = requestAnimationFrame(loop);
        }

        function onMouseMove(e: MouseEvent) {
            const rect = canvas!.getBoundingClientRect();
            mouse.current.x = e.clientX - rect.left;
            mouse.current.y = e.clientY - rect.top;
            mouse.current.active = true;
        }

        function onMouseLeave() {
            mouse.current.active = false;
        }

        buildGrid();
        loop();

        const parent = canvas.parentElement;
        window.addEventListener("resize", buildGrid);
        parent?.addEventListener("mousemove", onMouseMove);
        parent?.addEventListener("mouseleave", onMouseLeave);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", buildGrid);
            parent?.removeEventListener("mousemove", onMouseMove);
            parent?.removeEventListener("mouseleave", onMouseLeave);
        };
    }, [dotColor, activeColor, gap, radius, maxRadius, proximity, repelStrength, spring, damping]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={className}
            style={{ position: "absolute", inset: 0, display: "block" }}
        />
    );
}