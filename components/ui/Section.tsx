import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

export type SectionTone = "paper" | "surface" | "night";

interface SectionProps extends Omit<ComponentPropsWithoutRef<"section">, "children"> {
  tone?: SectionTone;
  /** Wrap children in <Container>. Turn off for full-bleed content. */
  contained?: boolean;
  /** Vertical padding (64px mobile, 96px desktop). */
  padded?: boolean;
  containerClassName?: string;
  children: ReactNode;
}

const TONES: Record<SectionTone, string> = {
  paper: "bg-paper text-ink",
  surface: "bg-surface text-ink",
  night: "on-night",
};

export function Section({
  tone = "paper",
  contained = true,
  padded = true,
  className,
  containerClassName,
  children,
  ...rest
}: SectionProps) {
  return (
    <section className={cn("relative", padded && "section", TONES[tone], className)} {...rest}>
      {contained ? <Container className={containerClassName}>{children}</Container> : children}
    </section>
  );
}
