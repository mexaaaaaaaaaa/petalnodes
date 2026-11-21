import * as React from "react";
import { WashiTape } from "./WashiTape";
import { cn } from "@/lib/utils";

export function PolaroidFrame({
  caption,
  rotation = -3,
  children,
  className,
}: {
  caption: string;
  rotation?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "group relative bg-white border-2 border-ink p-3 pb-5 shadow-[5px_6px_0_var(--color-ink)] transition-transform duration-200 hover:-rotate-1",
        className,
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 transition-transform duration-200 group-hover:rotate-3">
        <WashiTape rotation={-3} length={92} />
      </div>
      <div className="relative overflow-hidden border border-ink/20 bg-paper-shade aspect-[4/3]">
        {children}
      </div>
      <figcaption className="mt-3 text-center font-handwriting text-base md:text-lg font-medium text-ink">
        {caption}
      </figcaption>
    </figure>
  );
}
