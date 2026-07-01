import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "max-w-content mx-auto px-12 max-md:px-6",
        className
      )}
    >
      {children}
    </div>
  );
}
