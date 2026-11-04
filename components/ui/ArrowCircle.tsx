import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ArrowCircleVariant = "filled" | "outline" | "sky" | "paper" | "night";

interface ArrowCircleProps {
  variant?: ArrowCircleVariant;
  /** Diameter in px. The arrow is half of it. */
  size?: number;
  /**
   * What makes the arrow rotate 45°:
   * "group" = hovering/focusing the nearest `group` parent (cards, cells),
   * "pill"  = hovering/focusing a `group/pill` parent (PillButton),
   * "none"  = never.
   */
  trigger?: "group" | "pill" | "none";
  className?: string;
}

const VARIANTS: Record<ArrowCircleVariant, string> = {
  filled: "bg-ink text-paper",
  outline: "border border-current",
  sky: "bg-sky text-night",
  paper: "bg-paper text-ink",
  night: "bg-night text-sky",
};

const TRIGGERS = {
  group: "group-hover:rotate-45 group-focus-visible:rotate-45",
  pill: "group-hover/pill:rotate-45 group-focus-visible/pill:rotate-45",
  none: "",
};

/** The signature icon: a circle holding a ↗ that turns 45° on hover. */
export function ArrowCircle({
  variant = "filled",
  size = 24,
  trigger = "group",
  className,
}: ArrowCircleProps) {
  const icon = Math.round(size * 0.5);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full transition-[background-color,color,border-color] duration-med ease-expo",
        VARIANTS[variant],
        className
      )}
      style={{ width: size, height: size }}
    >
      <ArrowUpRight
        width={icon}
        height={icon}
        strokeWidth={1.75}
        className={cn("transition-transform duration-med ease-expo", TRIGGERS[trigger])}
      />
    </span>
  );
}
