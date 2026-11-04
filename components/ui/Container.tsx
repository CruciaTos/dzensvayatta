import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

/** min(88vw, 1280px), with a 20px side gutter below 640px. */
export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full px-5 sm:w-[min(88vw,1280px)] sm:px-0", className)}>
      {children}
    </Tag>
  );
}
