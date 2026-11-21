import type { ChapterId } from "@/content";

export interface ChapterRange {
  id: ChapterId;
  start: number;
  end: number;
}

export const CHAPTER_RANGES: ChapterRange[] = [
  { id: "seed", start: 0.0, end: 0.1 },
  { id: "roots", start: 0.1, end: 0.28 },
  { id: "shield", start: 0.28, end: 0.46 },
  { id: "build", start: 0.46, end: 0.66 },
  { id: "neighbors", start: 0.66, end: 0.86 },
  { id: "bloom", start: 0.86, end: 1.0 },
];

export const storyStore = {
  progress: 0,
  snapshotDataUrl: null as string | null,
  snapshotCaptured: false,
  onSnapshot: null as ((url: string) => void) | null,
};

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

export function chapterAt(progress: number): ChapterId {
  const p = clamp01(progress);
  for (let i = 0; i < CHAPTER_RANGES.length; i++) {
    const r = CHAPTER_RANGES[i];
    if (i === CHAPTER_RANGES.length - 1) return r.id;
    if (p < r.end) return r.id;
  }
  return "bloom";
}

export function chapterStart(id: ChapterId): number {
  const found = CHAPTER_RANGES.find((r) => r.id === id);
  return found ? found.start : 0;
}

export function chapterProgress(progress: number, id: ChapterId): number {
  const found = CHAPTER_RANGES.find((r) => r.id === id);
  if (!found) return 0;
  const p = clamp01(progress);
  if (p <= found.start) return 0;
  if (p >= found.end) return 1;
  return (p - found.start) / (found.end - found.start);
}

/**
 * Pure mapping from global story progress (0..1) to world-space color reveal
 * radius in blocks around the seed anchor.
 * - Hero (0..0.10): 0 (fully sketch)
 * - End of Roots (0.28): ~8 blocks
 * - End of Shield (0.46): ~16 blocks
 * - End of Build (0.66): ~26 blocks
 * - Bloom (1.00): ~60 blocks (also reveals the sky)
 */
export function revealRadiusFor(progress: number): number {
  const p = clamp01(progress);
  if (p <= 0.08) return 0;
  if (p <= 0.28) {
    const t = (p - 0.08) / 0.2;
    return 8 * t;
  }
  if (p <= 0.46) {
    const t = (p - 0.28) / 0.18;
    return 8 + 8 * t;
  }
  if (p <= 0.66) {
    const t = (p - 0.46) / 0.2;
    return 16 + 10 * t;
  }
  if (p <= 0.86) {
    const t = (p - 0.66) / 0.2;
    return 26 + 8 * t;
  }
  const t = (p - 0.86) / 0.14;
  return 34 + 26 * t;
}
