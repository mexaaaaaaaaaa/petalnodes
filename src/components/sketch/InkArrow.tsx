import * as React from "react";
import { generateRoughArrowPaths } from "@/lib/roughPaths";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/app/QualityProvider";
import { cn } from "@/lib/utils";

export interface InkArrowProps {
  from: [number, number];
  to: [number, number];
  curvature?: number;
  seed?: number;
  stroke?: string;
  strokeWidth?: number;
  drawIn?: boolean;
  className?: string;
}

export function InkArrow({
  from,
  to,
  curvature = 0.24,
  seed = 31,
  stroke = "#2B2230",
  strokeWidth = 2.2,
  drawIn = false,
  className,
}: InkArrowProps) {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const reducedMotion = useReducedMotion();

  const { shaft, head, viewBox } = React.useMemo(() => {
    const pad = 16;
    const minX = Math.min(from[0], to[0]) - pad;
    const minY = Math.min(from[1], to[1]) - pad;
    const maxX = Math.max(from[0], to[0]) + pad;
    const maxY = Math.max(from[1], to[1]) + pad;
    const paths = generateRoughArrowPaths({
      x1: from[0],
      y1: from[1],
      x2: to[0],
      y2: to[1],
      curvature,
      seed,
      stroke,
      strokeWidth,
    });
    return {
      ...paths,
      viewBox: `${minX} ${minY} ${Math.max(30, maxX - minX)} ${Math.max(30, maxY - minY)}`,
    };
  }, [from, to, curvature, seed, stroke, strokeWidth]);

  useGSAP(
    () => {
      if (!drawIn || reducedMotion || !svgRef.current) return;
      const paths = svgRef.current.querySelectorAll("path");
      gsap.fromTo(
        paths,
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          duration: 0.6,
          stagger: 0.14,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: svgRef.current,
            start: "top 92%",
            once: true,
          },
        },
      );
    },
    { scope: svgRef, dependencies: [drawIn, reducedMotion] },
  );

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={viewBox}
      className={cn("overflow-visible pointer-events-none", className)}
    >
      {shaft.map((p, idx) => (
        <path
          key={`s-${idx}`}
          d={p.d}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
      ))}
      {head.map((p, idx) => (
        <path
          key={`h-${idx}`}
          d={p.d}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </svg>
  );
}
