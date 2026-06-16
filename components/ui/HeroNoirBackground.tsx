import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeroNoirBackgroundProps {
  children?: ReactNode;
  className?: string;
}

export function HeroNoirBackground({ children, className }: HeroNoirBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden hero-noir-bg", className)}>
      <div className="hero-noir-folds" aria-hidden="true">
        <div className="hero-noir-fold hero-noir-fold-a" />
        <div className="hero-noir-fold hero-noir-fold-b" />
        <div className="hero-noir-fold hero-noir-fold-c" />
        <div className="hero-noir-fold hero-noir-fold-d" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.03] hero-noir-grid pointer-events-none"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 opacity-[0.05] noise-overlay mix-blend-overlay pointer-events-none"
        aria-hidden="true"
      />

      <div className="hero-noir-vignette" aria-hidden="true" />

      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, rgba(201,169,110,0.16) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {children}
    </div>
  );
}
