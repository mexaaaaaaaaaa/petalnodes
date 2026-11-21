import * as React from "react";
import { useReducedMotion } from "@/app/QualityProvider";

export function LineBoilFilters() {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {[0, 1, 2].map((k) => (
          <filter
            key={k}
            id={`petalnode-boil-${k}`}
            x="-12%"
            y="-12%"
            width="124%"
            height="124%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.032"
              numOctaves="2"
              seed={k * 11 + 5}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.1"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        ))}
      </defs>
    </svg>
  );
}

export function useBoilFilter(enabled = true): string | undefined {
  const reducedMotion = useReducedMotion();
  const [frame, setFrame] = React.useState(0);

  React.useEffect(() => {
    if (!enabled || reducedMotion) return;
    const id = window.setInterval(() => {
      setFrame((f) => (f + 1) % 3);
    }, 125); // ~8 fps
    return () => window.clearInterval(id);
  }, [enabled, reducedMotion]);

  if (!enabled || reducedMotion) return undefined;
  return `url(#petalnode-boil-${frame})`;
}
