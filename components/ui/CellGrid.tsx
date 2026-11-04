import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CellGridProps {
  /** Columns at desktop. 4 → 2 on mobile; 3 → 2 → 1; 2 → 1. */
  cols?: 2 | 3 | 4;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

const COLS = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

/**
 * Hairline cell grid: the grid draws the top and left lines, each cell draws
 * its right and bottom line, so no edge is ever doubled.
 */
export function CellGrid({ cols = 3, as: Tag = "div", className, children }: CellGridProps) {
  return (
    <Tag
      className={cn(
        "grid border-l border-t border-line [&>*]:border-b [&>*]:border-r [&>*]:border-line",
        COLS[cols],
        className
      )}
    >
      {children}
    </Tag>
  );
}
