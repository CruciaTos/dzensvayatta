import Image from "next/image";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MediaRatio = "16/10" | "16/9" | "4/3" | "4/5" | "1/1";

interface MediaFrameProps {
  /** Leave empty to render a placeholder (children only). */
  src?: string;
  alt?: string;
  ratio?: MediaRatio;
  /** Scale the image to 1.035 when the nearest `group` parent is hovered. */
  zoom?: boolean;
  fit?: "cover" | "contain";
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Overlays (tags, badges), positioned absolutely by the caller. */
  children?: ReactNode;
}

const RATIOS: Record<MediaRatio, string> = {
  "16/10": "aspect-[16/10]",
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
};

/** Image in a 16px-radius frame with a hairline border on the surface colour. */
export function MediaFrame({
  src,
  alt = "",
  ratio = "16/10",
  zoom = false,
  fit = "cover",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  className,
  imgClassName,
  children,
}: MediaFrameProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card border border-line bg-surface",
        RATIOS[ratio],
        className
      )}
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            fit === "cover" ? "object-cover" : "object-contain",
            "transition-transform duration-slow ease-expo",
            zoom && "group-hover:scale-[1.035]",
            imgClassName
          )}
        />
      )}
      {children}
    </div>
  );
}
