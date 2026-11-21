import * as React from "react";
import { cn } from "@/lib/utils";

export function PaperBackground({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("paper-surface min-h-screen text-ink relative overflow-x-clip", className)}>
      {children}
    </div>
  );
}
