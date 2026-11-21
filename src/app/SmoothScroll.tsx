import * as React from "react";
import { ReactLenis, useLenis } from "lenis/react";
import type Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useQualityTier } from "./QualityProvider";

interface SmoothScrollContextValue {
  getLenis: () => Lenis | null;
  scrollToTarget: (target: string | number | HTMLElement, offset?: number) => void;
  scrollToStoryProgress: (progress: number) => void;
}

const SmoothScrollContext = React.createContext<SmoothScrollContextValue>({
  getLenis: () => null,
  scrollToTarget: () => {},
  scrollToStoryProgress: () => {},
});

function LenisGsapBridge({
  lenisRef,
}: {
  lenisRef: React.MutableRefObject<Lenis | null>;
}) {
  const lenis = useLenis(() => {
    ScrollTrigger.update();
  });

  React.useEffect(() => {
    lenisRef.current = lenis ?? null;
    if (!lenis) return;

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenisRef.current = null;
    };
  }, [lenis, lenisRef]);

  return null;
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tier, reducedMotion } = useQualityTier();
  const isStatic = tier === "static" || reducedMotion;
  const lenisRef = React.useRef<Lenis | null>(null);

  const getLenis = React.useCallback(() => lenisRef.current, []);

  const scrollToTarget = React.useCallback(
    (target: string | number | HTMLElement, offset = 0) => {
      const l = lenisRef.current;
      if (l && !isStatic) {
        l.scrollTo(target, { offset, duration: 1.05 });
        return;
      }
      if (typeof target === "number") {
        window.scrollTo({ top: target + offset, behavior: reducedMotion ? "auto" : "smooth" });
      } else if (typeof target === "string") {
        const el = document.querySelector(target);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
        }
      } else if (target instanceof HTMLElement) {
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
      }
    },
    [isStatic, reducedMotion],
  );

  const scrollToStoryProgress = React.useCallback(
    (progress: number) => {
      const clamped = Math.max(0, Math.min(1, progress));
      const st = ScrollTrigger.getById("petalnode-story");
      if (st) {
        const targetY = st.start + (st.end - st.start) * clamped;
        scrollToTarget(targetY);
        return;
      }
      const storyEl = document.getElementById("story");
      if (storyEl) {
        scrollToTarget(storyEl);
      }
    },
    [scrollToTarget],
  );

  const value = React.useMemo(
    () => ({ getLenis, scrollToTarget, scrollToStoryProgress }),
    [getLenis, scrollToTarget, scrollToStoryProgress],
  );

  if (isStatic) {
    return (
      <SmoothScrollContext.Provider value={value}>
        {children}
      </SmoothScrollContext.Provider>
    );
  }

  return (
    <SmoothScrollContext.Provider value={value}>
      <ReactLenis root options={{ autoRaf: false, lerp: 0.1 }}>
        <LenisGsapBridge lenisRef={lenisRef} />
        {children}
      </ReactLenis>
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  return React.useContext(SmoothScrollContext);
}
