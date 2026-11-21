import * as React from "react";
import { cn } from "@/lib/utils";

export function Stamp({
  text,
  rotation = -6,
  size = "md",
  className,
}: {
  text: string;
  rotation?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block font-handwriting font-bold uppercase tracking-wider text-blossom-600 border-2 border-blossom-600 rounded-[3px] select-none stamp-animate",
        size === "sm" ? "px-1.5 py-0.5 text-[11px] leading-none" : "px-2.5 py-1 text-xs leading-none",
        className,
      )}
      style={
        {
          "--stamp-rot": `${rotation}deg`,
          transform: `rotate(${rotation}deg)`,
          boxShadow: "inset 0 0 0 1px rgba(226, 85, 123, 0.25)",
        } as React.CSSProperties
      }
    >
      {text}
    </span>
  );
}
