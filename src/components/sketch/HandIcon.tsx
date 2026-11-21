import * as React from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/app/QualityProvider";
import { cn } from "@/lib/utils";

export const HAND_ICON_NAMES = [
  "cpu",
  "lightning",
  "shield",
  "wrench",
  "chat",
  "coin",
  "clock",
  "globe",
  "heart",
  "sprout",
  "petal",
  "cube",
  "lantern",
  "check",
  "star",
] as const;

export type HandIconName = (typeof HAND_ICON_NAMES)[number];

export function HandIcon({
  name,
  size = 24,
  drawIn = false,
  className,
}: {
  name: HandIconName;
  size?: number;
  drawIn?: boolean;
  className?: string;
}) {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const reducedMotion = useReducedMotion();

  if (!HAND_ICON_NAMES.includes(name)) {
    throw new Error(`Unknown HandIcon name: "${String(name)}"`);
  }

  useGSAP(
    () => {
      if (!drawIn || reducedMotion || !svgRef.current) return;
      const paths = svgRef.current.querySelectorAll("path, circle, rect, polygon");
      gsap.fromTo(
        paths,
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          duration: 0.55,
          stagger: 0.05,
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
      viewBox="0 0 28 28"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("shrink-0 text-ink", className)}
    >
      {renderIcon(name)}
    </svg>
  );
}

function renderIcon(name: HandIconName) {
  switch (name) {
    case "cpu":
      return (
        <>
          <rect x="8" y="8" width="12" height="12" rx="2" fill="#FFC9D6" />
          <path d="M11 4v4M17 4v4M11 20v4M17 20v4M4 11h4M4 17h4M20 11h4M20 17h4" />
          <path d="M12 12h4v4h-4z" />
        </>
      );
    case "lightning":
      return (
        <path
          d="M15.5 3.5L7 15h6l-1.5 9.5L21 12.5h-6l.5-9z"
          fill="#FFC75A"
        />
      );
    case "shield":
      return (
        <>
          <path
            d="M14 3.5C10 5 6.5 5.5 5 5.8v7.7c0 5.5 3.8 9.4 9 11 5.2-1.6 9-5.5 9-11V5.8C21.5 5.5 18 5 14 3.5z"
            fill="#FFC9D6"
          />
          <path d="M10.5 13.8l2.5 2.5 4.8-5" />
        </>
      );
    case "wrench":
      return (
        <path
          d="M19.5 4.5a5 5 0 0 0-6.4 6.4L6.2 17.8a2.1 2.1 0 0 0 3 3l6.9-6.9a5 5 0 0 0 6.4-6.4l-2.6 2.6-2.8-.6-.6-2.8 2.6-2.2z"
          fill="#FFC9D6"
        />
      );
    case "chat":
      return (
        <>
          <path
            d="M5 7.5C5 5.8 6.4 4.5 8 4.5h12c1.7 0 3 1.3 3 3v8.5c0 1.7-1.3 3-3 3H12l-5 4v-4H8c-1.6 0-3-1.3-3-3V7.5z"
            fill="#FFF1F4"
          />
          <path d="M10 10.5h8M10 14h5" />
        </>
      );
    case "coin":
      return (
        <>
          <circle cx="14" cy="14" r="9.5" fill="#FFC75A" />
          <path d="M14 9v10M16.5 11.2c-.5-.8-1.5-1.2-2.5-1.2-1.4 0-2.5.8-2.5 1.9 0 2.1 5 1.1 5 3.3 0 1.1-1.1 1.9-2.5 1.9-1.1 0-2.1-.4-2.6-1.2" />
        </>
      );
    case "clock":
      return (
        <>
          <circle cx="14" cy="14" r="9.5" fill="#FFF1F4" />
          <path d="M14 8.5V14l3.8 2.4" />
        </>
      );
    case "globe":
      return (
        <>
          <circle cx="14" cy="14" r="9.5" fill="#CFE6FF" />
          <path d="M4.8 14h18.4M14 4.5c2.8 2.8 4 6.1 4 9.5s-1.2 6.7-4 9.5c-2.8-2.8-4-6.1-4-9.5s1.2-6.7 4-9.5z" />
        </>
      );
    case "heart":
      return (
        <path
          d="M14 23.2C8.5 19 4.5 15 4.5 10.4c0-3 2.3-5.2 5-5.2 1.8 0 3.4.9 4.5 2.4 1.1-1.5 2.7-2.4 4.5-2.4 2.7 0 5 2.2 5 5.2 0 4.6-4 8.6-9.5 12.8z"
          fill="#FF8FAB"
        />
      );
    case "sprout":
      return (
        <>
          <path d="M14 23.5V12.5" />
          <path
            d="M14 14.5C9.5 14.5 6 11.8 5.5 7.5 10 7.2 13.5 9.8 14 14.5z"
            fill="#6FAF5B"
          />
          <path
            d="M14 12.5C14.5 8 18 5.5 22.5 5.8 22 10.2 18.5 12.8 14 12.5z"
            fill="#6FAF5B"
          />
          <path d="M9.5 23.5h9" />
        </>
      );
    case "petal":
      return (
        <path
          d="M14 23.5C8.5 21 6 15.2 7.8 9.8 9 6 11.8 5.2 13.2 7.5L14 9l.8-1.5c1.4-2.3 4.2-1.5 5.4 2.3 1.8 5.4-.7 11.2-6.2 13.7z"
          fill="#FF8FAB"
        />
      );
    case "cube":
      return (
        <>
          <path d="M14 4.5l8.5 4.8-8.5 4.8-8.5-4.8L14 4.5z" fill="#FFC9D6" />
          <path d="M5.5 9.3v9.4L14 23.5v-9.4L5.5 9.3z" fill="#FBF6EE" />
          <path d="M22.5 9.3v9.4L14 23.5v-9.4l8.5-4.8z" fill="#F1E7D6" />
        </>
      );
    case "lantern":
      return (
        <>
          <path d="M11 4.5h6M14 4.5V7" />
          <rect x="8.5" y="7" width="11" height="14" rx="2" fill="#FFC75A" />
          <path d="M8.5 12h11M8.5 16.5h11M11 23.5h6" />
        </>
      );
    case "check":
      return <path d="M6 14.5l5.2 5.2L22 8.5" stroke="#6FAF5B" strokeWidth="2.6" />;
    case "star":
      return (
        <path
          d="M14 4.5l2.7 5.8 6.3.8-4.6 4.4 1.2 6.3-5.6-3-5.6 3 1.2-6.3-4.6-4.4 6.3-.8L14 4.5z"
          fill="#FFC75A"
        />
      );
  }
}
