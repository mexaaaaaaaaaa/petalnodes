export type QualityTier = "high" | "medium" | "low" | "static";

export interface QualitySignals {
  webglAvailable: boolean;
  reducedMotion: boolean;
  deviceMemory?: number;
  cpuCores?: number;
  coarsePointer: boolean;
  shortestScreenSide: number;
  rendererString?: string;
  forceStaticParam?: boolean;
}

const WEAK_RENDERER_RE =
  /SwiftShader|llvmpipe|softpipe|Software|Basic Render|Apple A8|Apple A9|Mali-4|Mali-T|Adreno \(TM\) 3|Adreno \(TM\) 4|Intel\(R\) HD Graphics [345]/i;

export function isSoftwareGlRenderer(rendererString?: string): boolean {
  if (!rendererString) return false;
  return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererString);
}

export function pickInitialTier(signals: QualitySignals): QualityTier {
  if (signals.forceStaticParam || !signals.webglAvailable || signals.reducedMotion) {
    return "static";
  }

  if (signals.coarsePointer && signals.shortestScreenSide < 768) {
    return "low";
  }

  if (signals.coarsePointer && signals.shortestScreenSide >= 768) {
    return "medium";
  }

  if (
    (signals.deviceMemory !== undefined && signals.deviceMemory <= 4) ||
    (signals.cpuCores !== undefined && signals.cpuCores <= 4) ||
    (signals.rendererString !== undefined && WEAK_RENDERER_RE.test(signals.rendererString))
  ) {
    return "medium";
  }

  return "high";
}

export function stepDownTier(current: QualityTier): QualityTier {
  if (current === "static") return "static";
  if (current === "high") return "medium";
  if (current === "medium") return "low";
  return "low";
}

export function detectBrowserSignals(): QualitySignals {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return {
      webglAvailable: false,
      reducedMotion: true,
      coarsePointer: false,
      shortestScreenSide: 1080,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const forceStaticParam = params.get("static") === "1";

  const reducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const coarsePointer =
    window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const shortestScreenSide = Math.min(window.innerWidth, window.innerHeight);

  let webglAvailable = false;
  let rendererString = "";

  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl2") as WebGL2RenderingContext | null) ||
      (canvas.getContext("webgl") as WebGLRenderingContext | null);
    if (gl) {
      webglAvailable = true;
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      rendererString = String(gl.getParameter(param) ?? "");
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    webglAvailable = false;
  }

  const nav = navigator as Navigator & { deviceMemory?: number };

  return {
    webglAvailable,
    reducedMotion,
    deviceMemory: nav.deviceMemory,
    cpuCores: nav.hardwareConcurrency,
    coarsePointer,
    shortestScreenSide,
    rendererString,
    forceStaticParam,
  };
}
