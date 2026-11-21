import * as React from "react";
import {
  generateRoughCirclePaths,
  generateRoughUnderlinePaths,
} from "@/lib/roughPaths";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/app/QualityProvider";
import { cn } from "@/lib/utils";

export function RoughUnderline({
  children,
  seed = 19,
  drawIn = true,
  className,
}: {
  children: React.ReactNode;
  seed?: number;
  drawIn?: boolean;
  className?: string;
}) {
  const wrapRef = React.useRef<HTMLSpanElement | null>(null);
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const reducedMotion = useReducedMotion();

  const paths = React.useMemo(
    () =>
      generateRoughUnderlinePaths({
        width: 140,
        y: 8,
        seed,
        stroke: "#E2557B",
        strokeWidth: 3.4,
      }),
    [seed],
  );

  useGSAP(
    () => {
      if (!drawIn || reducedMotion || !svgRef.current) return;
      const strokes = svgRef.current.querySelectorAll("path");
      gsap.fromTo(
        strokes,
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 92%",
            once: true,
          },
        },
      );
    },
    { scope: wrapRef, dependencies: [drawIn, reducedMotion] },
  );

  return (
    <span ref={wrapRef} className={cn("relative inline-block whitespace-nowrap", className)}>
      <span className="relative z-10">{children}</span>
      <svg
        ref={svgRef}
        aria-hidden="true"
        viewBox="0 0 140 16"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-1.5 left-0 h-3.5 w-full overflow-visible"
      >
        {paths.map((p, idx) => (
          <path
            key={idx}
            d={p.d}
            stroke={p.stroke}
            strokeWidth={p.strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </svg>
    </span>
  );
}

export function RoughCircle({
  children,
  seed = 23,
  drawIn = true,
  className,
}: {
  children: React.ReactNode;
  seed?: number;
  drawIn?: boolean;
  className?: string;
}) {
  const wrapRef = React.useRef<HTMLSpanElement | null>(null);
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const reducedMotion = useReducedMotion();

  const paths = React.useMemo(
    () =>
      generateRoughCirclePaths({
        cx: 60,
        cy: 26,
        width: 112,
        height: 44,
        seed,
        stroke: "#E2557B",
        strokeWidth: 2.6,
      }),
    [seed],
  );

  useGSAP(
    () => {
      if (!drawIn || reducedMotion || !svgRef.current) return;
      const strokes = svgRef.current.querySelectorAll("path");
      gsap.fromTo(
        strokes,
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          duration: 0.65,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 92%",
            once: true,
          },
        },
      );
    },
    { scope: wrapRef, dependencies: [drawIn, reducedMotion] },
  );

  return (
    <span ref={wrapRef} className={cn("relative inline-block px-1.5 whitespace-nowrap", className)}>
      <span className="relative z-10">{children}</span>
      <svg
        ref={svgRef}
        aria-hidden="true"
        viewBox="0 0 120 52"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-x-1.5 -inset-y-1 h-[calc(100%+8px)] w-[calc(100%+12px)] overflow-visible"
      >
        {paths.map((p, idx) => (
          <path
            key={idx}
            d={p.d}
            stroke={p.stroke}
            strokeWidth={p.strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </svg>
    </span>
  );
}
