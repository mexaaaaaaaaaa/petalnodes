import * as React from "react";
import { generateRoughRectPaths } from "@/lib/roughPaths";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/app/QualityProvider";
import { cn } from "@/lib/utils";

export interface RoughBoxProps {
  seed: number;
  fill?: boolean;
  fillColor?: string;
  bgClassName?: string;
  padding?: string;
  roughness?: number;
  strokeWidth?: number;
  drawIn?: boolean;
  /** Optional ref-friendly class on stroke paths so an external scrubbed timeline can animate them. */
  strokeClassName?: string;
  className?: string;
  children: React.ReactNode;
}

export function RoughBox({
  seed,
  fill = false,
  fillColor = "#FFC9D6",
  bgClassName = "bg-paper-shade",
  padding = "p-6",
  roughness = 1.2,
  strokeWidth = 1.9,
  drawIn = false,
  strokeClassName,
  className,
  children,
}: RoughBoxProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [size, setSize] = React.useState({ w: 320, h: 180 });

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSize((prev) =>
          Math.abs(prev.w - rect.width) < 1 && Math.abs(prev.h - rect.height) < 1
            ? prev
            : { w: Math.round(rect.width), h: Math.round(rect.height) },
        );
      }
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const paths = React.useMemo(
    () =>
      generateRoughRectPaths({
        x: 3,
        y: 3,
        width: Math.max(20, size.w - 6),
        height: Math.max(20, size.h - 6),
        seed,
        roughness,
        strokeWidth,
        stroke: "#2B2230",
        fill: fill ? fillColor : undefined,
        fillStyle: "hachure",
      }),
    [size.w, size.h, seed, roughness, strokeWidth, fill, fillColor],
  );

  useGSAP(
    () => {
      if (!drawIn || reducedMotion || !svgRef.current) return;
      const strokeNodes = svgRef.current.querySelectorAll(".rough-draw-stroke");
      if (!strokeNodes.length) return;
      gsap.fromTo(
        strokeNodes,
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          duration: 0.75,
          stagger: 0.08,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 88%",
            once: true,
          },
        },
      );
    },
    { scope: containerRef, dependencies: [drawIn, reducedMotion, paths.length] },
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative rounded-sm", bgClassName, padding, className)}
    >
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${size.w} ${size.h}`}
        preserveAspectRatio="none"
      >
        {paths.map((p, idx) => (
          <path
            key={idx}
            d={p.d}
            stroke={p.stroke}
            strokeWidth={p.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={p.fill ?? "none"}
            className={cn(
              p.stroke !== "none" ? "rough-draw-stroke" : "",
              p.stroke !== "none" ? strokeClassName : "",
            )}
          />
        ))}
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
