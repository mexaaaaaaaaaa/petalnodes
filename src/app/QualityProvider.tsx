import * as React from "react";
import {
  detectBrowserSignals,
  isSoftwareGlRenderer,
  pickInitialTier,
  stepDownTier,
  type QualityTier,
} from "@/lib/quality";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

interface QualityContextValue {
  startingTier: QualityTier;
  tier: QualityTier;
  isSoftwareGl: boolean;
  reducedMotion: boolean;
  stepDown: () => void;
  forceStatic: () => void;
}

const QualityContext = React.createContext<QualityContextValue | null>(null);

export function QualityProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  const initialSignals = React.useMemo(() => detectBrowserSignals(), []);
  const startingTier = React.useMemo(
    () => pickInitialTier({ ...initialSignals, reducedMotion }),
    [initialSignals, reducedMotion],
  );
  const isSoftwareGl = React.useMemo(
    () => isSoftwareGlRenderer(initialSignals.rendererString),
    [initialSignals.rendererString],
  );

  const [tier, setTier] = React.useState<QualityTier>(startingTier);

  React.useEffect(() => {
    if (reducedMotion) {
      setTier("static");
    }
  }, [reducedMotion]);

  const stepDown = React.useCallback(() => {
    setTier((prev) => stepDownTier(prev));
  }, []);

  const forceStatic = React.useCallback(() => {
    setTier("static");
  }, []);

  const value = React.useMemo(
    () => ({
      startingTier,
      tier,
      isSoftwareGl,
      reducedMotion,
      stepDown,
      forceStatic,
    }),
    [startingTier, tier, isSoftwareGl, reducedMotion, stepDown, forceStatic],
  );

  return (
    <QualityContext.Provider value={value}>{children}</QualityContext.Provider>
  );
}

export function useQualityTier(): QualityContextValue {
  const ctx = React.useContext(QualityContext);
  if (!ctx) {
    throw new Error("useQualityTier must be used inside QualityProvider");
  }
  return ctx;
}
