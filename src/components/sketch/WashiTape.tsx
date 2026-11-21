import * as React from "react";
import { cn } from "@/lib/utils";

export function WashiTape({
  rotation = -4,
  length = 84,
  color = "#FFC9D6",
  className,
}: {
  rotation?: number;
  length?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none select-none h-6 transition-transform duration-200",
        className,
      )}
      style={{
        width: `${length}px`,
        transform: `rotate(${rotation}deg)`,
        backgroundColor: color,
        opacity: 0.88,
        backgroundImage:
          "repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(255, 255, 255, 0.28) 6px, rgba(255, 255, 255, 0.28) 10px)",
        clipPath:
          "polygon(0% 8%, 4% 0%, 96% 2%, 100% 14%, 97% 35%, 100% 58%, 96% 85%, 100% 96%, 94% 100%, 4% 98%, 0% 88%, 3% 62%, 0% 34%)",
        boxShadow: "0 1px 2px rgba(43, 34, 48, 0.14)",
      }}
    />
  );
}
