import * as THREE from "three";
import type { BlockType } from "./islandGenerator";
import type { QualityTier } from "@/lib/quality";

export type BlockFace = "top" | "side" | "bottom";
export type MaterialVariant = "pbr" | "flat";

export interface PaintBlockOptions {
  /** Surface micro-grain & relief intensity multiplier (default 1.0). */
  grainIntensity?: number;
}

export interface MaterialOptions extends PaintBlockOptions {
  /** "pbr" includes normal, roughness & height cavity maps; "flat" renders legacy albedo-only baseline. */
  variant?: MaterialVariant;
}

export interface PaintedBlockBuffers {
  albedo: Uint8Array;
  normal: Uint8Array;
  emissive: Uint8Array;
  roughness: Uint8Array;
  heightMap: Uint8Array;
  height: Float32Array;
}

const SIZE = 64;

function hash(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

function hash2(x: number, y: number, seed: number): [number, number] {
  return [hash(x, y, seed), hash(x + 19.3, y + 47.1, seed + 93)];
}

function vnoise(x: number, y: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy, seed);
  const b = hash(ix + 1, iy, seed);
  const c = hash(ix, iy + 1, seed);
  const d = hash(ix + 1, iy + 1, seed);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x: number, y: number, seed: number, octaves = 4): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += vnoise(x * freq, y * freq, seed + i * 17) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.02;
  }
  return sum / norm;
}

/**
 * Periodic Worley cellular distance (F1, F2, edge distance, cell ID)
 * for seamless tileable stone fractures, bark plates, soil clods, and water caustics.
 */
function worley(
  x: number,
  y: number,
  period: number,
  seed: number,
): { f1: number; f2: number; edge: number; id: number } {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  let f1 = 99;
  let f2 = 99;
  let bestId = 0;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const cx = ix + dx;
      const cy = iy + dy;
      const wx = ((cx % period) + period) % period;
      const wy = ((cy % period) + period) % period;
      const [ox, oy] = hash2(wx, wy, seed);
      const px = cx + 0.16 + ox * 0.68;
      const py = cy + 0.16 + oy * 0.68;
      const dist = Math.hypot(x - px, y - py);
      if (dist < f1) {
        f2 = f1;
        f1 = dist;
        bestId = hash(wx, wy, seed + 51);
      } else if (dist < f2) {
        f2 = dist;
      }
    }
  }

  return { f1, f2, edge: f2 - f1, id: bestId };
}

function hexRgb(hex: number): [number, number, number] {
  return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
}

function mixRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  const k = Math.max(0, Math.min(1, t));
  return [
    Math.round(a[0] + (b[0] - a[0]) * k),
    Math.round(a[1] + (b[1] - a[1]) * k),
    Math.round(a[2] + (b[2] - a[2]) * k),
  ];
}

function shadeRgb(
  rgb: [number, number, number],
  factor: number,
): [number, number, number] {
  return [
    clampByte(rgb[0] * factor),
    clampByte(rgb[1] * factor),
    clampByte(rgb[2] * factor),
  ];
}

function clampByte(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

const TYPE_SEEDS: Record<BlockType, number> = {
  cherry_leaves: 101,
  cherry_log: 202,
  cherry_planks: 303,
  grass: 404,
  dirt: 505,
  stone: 606,
  deep_stone: 707,
  glow_ore: 808,
  path: 909,
  paper_lantern: 1010,
  moss_carpet: 1111,
  water: 1212,
  flower: 1313,
  sapling: 1414,
};

export function usesHeightMapRelief(type: BlockType): boolean {
  return type === "stone" || type === "deep_stone" || type === "cherry_log";
}

export function paintBlockBuffers(
  type: BlockType,
  face: BlockFace = "side",
  options: PaintBlockOptions = {},
): PaintedBlockBuffers {
  const grain = Math.max(0, Math.min(2.5, options.grainIntensity ?? 1.0));
  const albedo = new Uint8Array(SIZE * SIZE * 4);
  const emissive = new Uint8Array(SIZE * SIZE * 4);
  const roughness = new Uint8Array(SIZE * SIZE * 4);
  const heightMap = new Uint8Array(SIZE * SIZE * 4);
  const height = new Float32Array(SIZE * SIZE);
  const normal = new Uint8Array(SIZE * SIZE * 4);
  const baseSeed = TYPE_SEEDS[type] + (face === "top" ? 11 : face === "bottom" ? 29 : 0);

  // Harmonized Petalnodes sketchbook palette
  const cBlossomHi = hexRgb(0xfff6f9);
  const cBlossom100 = hexRgb(0xffe1ea);
  const cBlossom200 = hexRgb(0xffc9d6);
  const cBlossom400 = hexRgb(0xff8fab);
  const cBlossomDeep = hexRgb(0xe26890);
  const cBlossomShadow = hexRgb(0xbf4d75);

  const cMoss = hexRgb(0x6faf5b);
  const cMossLight = hexRgb(0x90d076);
  const cMossDark = hexRgb(0x528d44);
  const cMossDeep = hexRgb(0x3f6e33);

  const cBark = hexRgb(0x7c5444);
  const cBarkDark = hexRgb(0x4c3025);
  const cBarkLight = hexRgb(0xa47563);
  const cBarkStrip = hexRgb(0xc69684);
  const cRingLight = hexRgb(0xf3d0c1);
  const cRingMid = hexRgb(0xd79f8c);
  const cHeartwood = hexRgb(0xb87664);

  const cPlank = hexRgb(0xe7b9a6);
  const cPlankLight = hexRgb(0xf5d6c9);
  const cPlankWarm = hexRgb(0xdca28d);
  const cPlankSeam = hexRgb(0x946253);
  const cPlankPeg = hexRgb(0x5a3b31);

  const cDirt = hexRgb(0x88624a);
  const cDirtDark = hexRgb(0x5c3e2c);
  const cDirtLight = hexRgb(0xa87e61);
  const cPebbleWarm = hexRgb(0x8d7c73);
  const cPebbleDark = hexRgb(0x695952);

  const cStone = hexRgb(0x9c96a4);
  const cStoneLight = hexRgb(0xc2bccb);
  const cStoneDark = hexRgb(0x706978);
  const cStoneCrevice = hexRgb(0x524b59);

  const cDeepStone = hexRgb(0x63586c);
  const cDeepDark = hexRgb(0x43394c);
  const cDeepLight = hexRgb(0x847890);

  const cLantern = hexRgb(0xffc75a);
  const cLanternWarm = hexRgb(0xffe8ab);
  const cPaper = hexRgb(0xfbf6ee);
  const cPath = hexRgb(0xcbb497);
  const cPathDark = hexRgb(0x9d8468);
  const cPathStone = hexRgb(0xa6a0aa);
  const cWater = hexRgb(0x66b8e8);
  const cWaterDeep = hexRgb(0x4592c6);
  const cWaterFoam = hexRgb(0xe4f6ff);

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const idx = y * SIZE + x;
      const p4 = idx * 4;
      let rgb: [number, number, number] = [180, 180, 180];
      let alpha = 255;
      let h = 0.5;
      let rough = 0.85;
      let em: [number, number, number] = [0, 0, 0];

      // Subtle baked bevel / edge occlusion consistent with hand-inked block outlines
      const edgeDist = Math.min(x, y, SIZE - 1 - x, SIZE - 1 - y);
      const edgeDarken = edgeDist < 3 ? 0.91 + edgeDist * 0.03 : 1.0;

      // Fine-scale deterministic micro-grain imperfection
      const microGrain = (hash(x, y, baseSeed + 99) - 0.5) * 0.09 * grain;

      if (type === "cherry_leaves") {
        // Layered cherry petal rosettes with translucent foliage pockets
        const warpX = x + fbm(x * 0.09, y * 0.09, baseSeed + 3, 2) * 3.2;
        const warpY = y + fbm(x * 0.09 + 7, y * 0.09 + 5, baseSeed + 7, 2) * 3.2;
        const canopy = fbm(warpX * 0.13, warpY * 0.13, baseSeed, 4);
        const cells = worley(warpX * 0.14, warpY * 0.14, 9, baseSeed + 23);
        const micro = hash(x, y, baseSeed + 5);

        if (canopy < 0.42 && !(y > SIZE - 5 && micro > 0.72)) {
          alpha = 0;
          rgb = cBlossom200;
          h = 0.1;
        } else {
          const tlSample = fbm((warpX - 2) * 0.13, (warpY - 2) * 0.13, baseSeed, 3);
          const sunBias = canopy - tlSample;
          const petalDome = clamp01(1 - cells.f1 * 1.15);

          if (sunBias > 0.042 || canopy > 0.68 || petalDome > 0.74) {
            rgb = mixRgb(cBlossom100, cBlossomHi, 0.45 + petalDome * 0.42);
            h = 0.78 + petalDome * 0.2;
            rough = 0.68;
          } else if (canopy > 0.53) {
            rgb = mixRgb(cBlossom400, cBlossom200, (canopy - 0.53) * 5.2);
            h = 0.58 + petalDome * 0.16;
            rough = 0.75;
          } else if (canopy > 0.46) {
            rgb = mixRgb(cBlossomDeep, cBlossom400, (canopy - 0.46) * 11);
            h = 0.44;
            rough = 0.82;
          } else {
            rgb = cBlossomShadow;
            h = 0.3;
            rough = 0.88;
          }

          if (micro > 0.91) {
            rgb = mixRgb(rgb, cBlossomHi, 0.48);
          } else if (micro < 0.08) {
            rgb = mixRgb(rgb, cBlossomDeep, 0.25);
          }
          h = clamp01(h + microGrain * 0.5);
        }
      } else if (type === "cherry_log") {
        if (face === "top" || face === "bottom") {
          const dx = x - SIZE / 2 + 0.5;
          const dy = y - SIZE / 2 + 0.5;
          const angle = Math.atan2(dy, dx);
          const warp = fbm(x * 0.13, y * 0.13, baseSeed, 3) * 3.0;
          const radial = Math.hypot(dx, dy) + warp;
          const ray = vnoise(Math.cos(angle) * 6 + 10, Math.sin(angle) * 6 + 10, baseSeed + 31);

          if (radial > 27.5) {
            const barkGroove = vnoise(x * 0.4, y * 0.4, baseSeed + 5);
            rgb = mixRgb(cBarkDark, cBark, barkGroove);
            h = 0.76 - barkGroove * 0.24;
            rough = 0.9;
          } else if (radial > 25) {
            rgb = cBarkLight;
            h = 0.68;
            rough = 0.84;
          } else {
            const ring = Math.sin(radial * 1.28) * 0.5 + 0.5;
            const heartBlend = clamp01(1 - radial / 15);
            const sap = mixRgb(cRingMid, cRingLight, ring);
            rgb = mixRgb(sap, cHeartwood, heartBlend * 0.55 * (1 - ring * 0.38));
            if (ray < 0.24 && radial > 4) {
              rgb = shadeRgb(rgb, 0.86);
            }
            h = 0.42 + ring * 0.28;
            rough = 0.7 + (1 - ring) * 0.14;
          }
          h = clamp01(h + microGrain * 0.65);
        } else {
          // Warm cinnamon cherry bark with deep multi-scale furrows, horizontal lenticel ridges & fiber grain
          const furrow = fbm(x * 0.36, y * 0.075, baseSeed, 4);
          const crack = vnoise(x * 0.66, y * 0.11, baseSeed + 41);
          const fiberDetail = fbm(x * 0.85, y * 0.2, baseSeed + 123, 2);
          const lenticel =
            vnoise(x * 0.09, y * 0.54, baseSeed + 77) > 0.72 &&
            vnoise(x * 0.34, y * 0.58, baseSeed + 89) > 0.45;

          if (crack < 0.24) {
            rgb = cBarkDark;
            h = 0.12;
            rough = 0.95;
          } else if (lenticel) {
            rgb = mixRgb(cBarkLight, cBarkStrip, 0.72);
            h = 0.9;
            rough = 0.7;
          } else if (furrow > 0.6) {
            rgb = cBarkLight;
            h = 0.78;
            rough = 0.8;
          } else {
            rgb = mixRgb(cBarkDark, cBark, 0.25 + furrow * 1.15);
            h = 0.36 + furrow * 0.34;
            rough = 0.86;
          }
          const barkGrainShift = (fiberDetail - 0.5) * 0.14 * grain;
          rgb = shadeRgb(rgb, 1 + barkGrainShift);
          h = clamp01(h + barkGrainShift * 0.9 + microGrain);
        }
      } else if (type === "cherry_planks") {
        const boardIndex = Math.floor(y / 16);
        const boardRow = y % 16;
        const vertSeamX = (boardIndex * 29 + 17) % SIZE;
        const isSeamY = boardRow === 0;
        const isBevelTop = boardRow === 1;
        const isBevelBottom = boardRow === 15;
        const isSeamX = x === vertSeamX;
        const isPeg =
          (boardRow === 4 || boardRow === 12) &&
          (Math.abs(x - ((vertSeamX + 3) % SIZE)) === 0 ||
            Math.abs(x - ((vertSeamX - 3 + SIZE) % SIZE)) === 0);

        if (isSeamY || isSeamX) {
          rgb = cPlankSeam;
          h = 0.14;
          rough = 0.94;
        } else if (isPeg) {
          rgb = cPlankPeg;
          h = 0.42;
          rough = 0.62;
        } else {
          const warp = fbm(x * 0.06 + boardIndex * 7, y * 0.18, baseSeed + 9, 2) * 1.8;
          const woodGrain = fbm(x * 0.07 + boardIndex * 5, (y + warp) * 0.55, baseSeed, 3);
          const knotDist = Math.hypot(
            ((x + boardIndex * 21) % SIZE) - 24,
            boardRow - 8,
          );
          const toneBias = hash(boardIndex, 3, baseSeed + 15) * 0.35;
          const baseColor = mixRgb(cPlank, cPlankWarm, toneBias);
          rgb = mixRgb(baseColor, cPlankLight, woodGrain);
          if (knotDist < 3.2) {
            rgb = mixRgb(rgb, cPlankSeam, clamp01(1 - knotDist / 3.5) * 0.35);
          }
          if (isBevelTop) rgb = shadeRgb(rgb, 1.07);
          if (isBevelBottom) rgb = shadeRgb(rgb, 0.89);
          h = isBevelTop ? 0.72 : isBevelBottom ? 0.42 : 0.54 + woodGrain * 0.22;
          rough = 0.58 + woodGrain * 0.2;
          h = clamp01(h + microGrain * 0.5);
        }
      } else if (type === "grass") {
        if (face === "top") {
          const turf = fbm(x * 0.15, y * 0.15, baseSeed, 4);
          const blades = vnoise(x * 0.62, y * 0.62, baseSeed + 31);
          const petals = hash(x, y, baseSeed + 71);
          if (turf > 0.62 || blades > 0.78) rgb = cMossLight;
          else if (turf > 0.43) rgb = cMoss;
          else if (turf > 0.27) rgb = cMossDark;
          else rgb = cMossDeep;

          if (petals > 0.984) {
            rgb = petals > 0.993 ? cBlossomHi : cBlossom400;
            h = 0.9;
            rough = 0.68;
          } else {
            h = clamp01(0.42 + turf * 0.34 + blades * 0.18 + microGrain * 0.6);
            rough = 0.86;
          }
        } else if (face === "bottom") {
          const dn = fbm(x * 0.22, y * 0.22, baseSeed + 5, 4);
          const clods = worley(x * 0.15, y * 0.15, 9, baseSeed + 21);
          rgb = mixRgb(cDirtDark, cDirt, dn * 0.8 + (1 - clods.f1) * 0.2);
          h = clamp01(0.3 + dn * 0.35 + microGrain * 0.6);
          rough = 0.93;
        } else {
          const wave =
            12 +
            Math.round(
              Math.sin(x * 0.34) * 2.4 +
                fbm(x * 0.34, 1.5, baseSeed, 3) * 3.8,
            );
          if (y < wave) {
            const gn = fbm(x * 0.22, y * 0.28, baseSeed, 3);
            const tip = y >= wave - 2;
            rgb = tip
              ? cMossDark
              : gn > 0.56
                ? cMossLight
                : gn > 0.34
                  ? cMoss
                  : cMossDark;
            h = clamp01((tip ? 0.74 : 0.82 + gn * 0.16) + microGrain * 0.4);
            rough = 0.84;
          } else if (y === wave) {
            rgb = cDirtDark;
            h = 0.32;
            rough = 0.95;
          } else {
            const dn = fbm(x * 0.19, y * 0.24, baseSeed + 9, 4);
            const clods = worley(x * 0.14, y * 0.14, 9, baseSeed + 31);
            const strata = Math.sin(y * 0.38 + dn * 2.2) * 0.5 + 0.5;
            if (clods.f1 < 0.17 && clods.id > 0.72) {
              rgb = mixRgb(cPebbleDark, cPebbleWarm, 1 - clods.f1 * 3.5);
              h = 0.66;
              rough = 0.76;
            } else {
              rgb = mixRgb(cDirtDark, cDirtLight, dn * 0.72 + strata * 0.28);
              if (clods.edge < 0.05) rgb = shadeRgb(rgb, 0.88);
              h = clamp01(0.28 + dn * 0.32 + microGrain * 0.6);
              rough = 0.93;
            }
          }
        }
      } else if (type === "dirt") {
        const dn = fbm(x * 0.19, y * 0.19, baseSeed, 4);
        const clods = worley(x * 0.14, y * 0.14, 9, baseSeed + 22);
        const rootlet =
          Math.abs(fbm(x * 0.14 + 4, y * 0.32, baseSeed + 63, 2) - 0.5) < 0.025 && y < 38;
        const isPebble = clods.f1 < 0.18 && clods.id > 0.74;
        if (isPebble) {
          rgb = mixRgb(cPebbleDark, cPebbleWarm, 1 - clods.f1 * 3.5);
          h = 0.72;
          rough = 0.74;
        } else if (rootlet) {
          rgb = cBarkLight;
          h = 0.62;
          rough = 0.85;
        } else {
          rgb = mixRgb(cDirtDark, cDirtLight, dn * 0.78 + (1 - clods.f1) * 0.22);
          if (clods.edge < 0.05) rgb = shadeRgb(rgb, 0.88);
          h = clamp01(0.3 + dn * 0.38 + microGrain * 0.8);
          rough = 0.93;
        }
      } else if (type === "stone") {
        // Multi-scale stone relief: sedimentary strata, chiseled Worley plates, crevice fissures & grain pitting
        const strata = fbm(x * 0.09, y * 0.18, baseSeed, 4);
        const cells = worley(x * 0.095 + strata * 0.35, y * 0.095, 6, baseSeed + 19);
        const micro = vnoise(x * 0.52, y * 0.52, baseSeed + 41);
        const pit = vnoise(x * 0.88, y * 0.88, baseSeed + 73) < 0.22 ? -0.1 : 0;

        if (cells.edge < 0.048) {
          rgb = cStoneCrevice;
          h = 0.1;
          rough = 0.96;
        } else {
          const facet = 0.88 + cells.id * 0.22;
          const base = mixRgb(cStoneDark, cStoneLight, strata * 0.7 + micro * 0.3);
          rgb = shadeRgb(base, facet + (micro - 0.5) * 0.12 * grain);
          if (cells.edge < 0.1) {
            rgb = mixRgb(rgb, cStoneLight, 0.3);
          }
          h = clamp01(
            0.38 +
              strata * 0.32 +
              (cells.edge < 0.11 ? 0.22 : 0.1 * cells.id) +
              (pit + microGrain) * grain,
          );
          rough = clamp01(0.62 + strata * 0.22 + (micro - 0.5) * 0.12 * grain);
        }
      } else if (type === "deep_stone") {
        const strata = fbm(x * 0.12, y * 0.2, baseSeed, 4);
        const cells = worley(x * 0.13 + strata * 0.25, y * 0.13, 8, baseSeed + 14);
        const micro = vnoise(x * 0.65, y * 0.65, baseSeed + 52);
        if (cells.edge < 0.055) {
          rgb = cDeepDark;
          h = 0.1;
          rough = 0.94;
        } else {
          rgb = mixRgb(cDeepDark, cDeepLight, strata * 0.62 + cells.id * 0.38);
          rgb = shadeRgb(rgb, 1 + (micro - 0.5) * 0.12 * grain);
          if (cells.edge < 0.11) rgb = mixRgb(rgb, cDeepLight, 0.25);
          h = clamp01(0.32 + strata * 0.38 + cells.id * 0.2 + microGrain * 0.85);
          rough = clamp01(0.58 + (1 - cells.id) * 0.24 + (micro - 0.5) * 0.1 * grain);
        }
      } else if (type === "glow_ore") {
        const strata = fbm(x * 0.14, y * 0.2, baseSeed, 4);
        const slate = worley(x * 0.14, y * 0.14, 9, baseSeed + 14);
        rgb = mixRgb(cDeepDark, cDeepStone, strata * 0.65 + slate.id * 0.35);
        h = 0.32 + strata * 0.32;
        rough = 0.78;

        const crystalField = fbm(x * 0.15 + 2, y * 0.15 + 4, baseSeed + 55, 3);
        const crystalCells = worley(x * 0.22, y * 0.22, 14, baseSeed + 66);
        if (crystalField > 0.62) {
          const isGold = crystalCells.id > 0.48;
          const crystalBase = isGold ? cLantern : cBlossom400;
          const crystalCore = isGold ? cLanternWarm : cBlossomHi;
          const facetBright = clamp01(1 - crystalCells.f1 * 1.5);
          rgb = mixRgb(crystalBase, crystalCore, facetBright * 0.62);
          em = mixRgb(crystalBase, crystalCore, facetBright * 0.35);
          h = 0.8 + facetBright * 0.2;
          rough = 0.18;
        } else if (crystalField > 0.58) {
          rgb = cDeepDark;
          h = 0.2;
          rough = 0.9;
        }
      } else if (type === "path") {
        const n = fbm(x * 0.17, y * 0.17, baseSeed, 4);
        const cobble = worley(x * 0.15, y * 0.15, 9, baseSeed + 88);
        if (cobble.f1 < 0.23 && cobble.id > 0.45) {
          rgb = mixRgb(cStoneDark, cPathStone, cobble.id * 0.7 + n * 0.3);
          h = clamp01(0.68 + (0.23 - cobble.f1) * 0.65 + microGrain * 0.5);
          rough = 0.7;
        } else {
          rgb = mixRgb(cPathDark, cPath, n);
          h = clamp01(0.36 + n * 0.2 + microGrain * 0.5);
          rough = 0.9;
        }
      } else if (type === "paper_lantern") {
        const isFrame =
          x < 6 ||
          x >= SIZE - 6 ||
          y < 7 ||
          y >= SIZE - 7 ||
          y === 23 ||
          y === 24 ||
          y === 40 ||
          y === 41 ||
          x === 31 ||
          x === 32;
        if (isFrame) {
          const woodGrain = vnoise(x * 0.45, y * 0.15, baseSeed + 12);
          rgb = mixRgb(cBarkDark, cBark, woodGrain);
          h = 0.78 + woodGrain * 0.1;
          rough = 0.84;
        } else {
          const fiberX = vnoise(x * 0.8, y * 0.12, baseSeed + 3);
          const fiberY = vnoise(x * 0.12, y * 0.8, baseSeed + 9);
          const centerDist = Math.hypot((x - 31.5) / 26, (y - 31.5) / 24);
          const innerGlow = clamp01(1 - centerDist * 0.74);
          const paperTex = (fiberX + fiberY) * 0.5;
          rgb = mixRgb(cPaper, cLanternWarm, 0.28 + innerGlow * 0.52 + paperTex * 0.12);
          em = mixRgb(cLantern, cLanternWarm, innerGlow * 0.75);
          h = 0.44 + paperTex * 0.08;
          rough = 0.9;
        }
      } else if (type === "moss_carpet") {
        const n = fbm(x * 0.2, y * 0.2, baseSeed, 4);
        const tuft = worley(x * 0.22, y * 0.22, 14, baseSeed + 12);
        const petal = hash(x, y, baseSeed + 91) > 0.986;
        if (petal) {
          rgb = cBlossom200;
          h = 0.86;
          rough = 0.72;
        } else {
          rgb = mixRgb(cMossDark, cMossLight, n * 0.7 + (1 - tuft.f1) * 0.3);
          if (tuft.edge < 0.06) rgb = cMossDeep;
          h = clamp01(0.4 + n * 0.4 + (1 - tuft.f1) * 0.12 + microGrain * 0.5);
          rough = 0.9;
        }
      } else if (type === "water") {
        const caustic = worley(x * 0.11, y * 0.11, 7, baseSeed + 17);
        const ripple = fbm(x * 0.14, y * 0.2, baseSeed, 3);
        const shimmer = clamp01(caustic.edge < 0.075 ? 1 : ripple);
        rgb =
          caustic.edge < 0.072 && ripple > 0.45
            ? cWaterFoam
            : mixRgb(cWaterDeep, cWater, shimmer);
        alpha = 216;
        h = 0.42 + ripple * 0.2 + (caustic.edge < 0.08 ? 0.14 : 0);
        rough = 0.1;
      } else if (type === "flower") {
        const dx = x - 32;
        const dy = y - 32;
        const r = Math.hypot(dx, dy);
        const a = Math.atan2(dy, dx);
        const petalLobe = Math.sin(a * 5);
        if (r < 6) {
          rgb = mixRgb(cLantern, cLanternWarm, 1 - r / 6);
          h = 0.9;
          rough = 0.52;
        } else if (r < 22 && petalLobe > -0.22) {
          const vein = clamp01(petalLobe * 0.5 + 0.5);
          rgb = r < 13
            ? mixRgb(cBlossom200, cBlossomHi, vein * 0.55)
            : mixRgb(cBlossom400, cBlossom200, vein * 0.45);
          h = 0.76 + (1 - r / 24) * 0.14;
          rough = 0.7;
        } else if (y > 38 && Math.abs(dx) < 3) {
          rgb = Math.abs(dx) < 1.5 ? cMossLight : cMossDark;
          h = 0.6;
          rough = 0.84;
        } else {
          alpha = 0;
          rgb = cBlossom200;
        }
      } else if (type === "sapling") {
        const dx = x - 32;
        const isStem = Math.abs(dx) < 3 && y > 26;
        const leafL = Math.hypot(x - 22, y - 24);
        const leafR = Math.hypot(x - 42, y - 20);
        const blossomTop = Math.hypot(x - 32, y - 15);
        if (blossomTop < 9.5) {
          const rim = blossomTop < 5.5;
          rgb = rim || (x + y) % 3 === 0 ? cBlossom100 : cBlossom400;
          h = 0.88;
          rough = 0.68;
        } else if (leafL < 11 || leafR < 11) {
          const n = vnoise(x * 0.4, y * 0.4, baseSeed + 4);
          rgb = n > 0.55 ? cMossLight : cMoss;
          h = 0.76;
          rough = 0.82;
        } else if (isStem) {
          rgb = dx < 0 ? cBarkLight : cBark;
          h = 0.65;
          rough = 0.86;
        } else {
          alpha = 0;
          rgb = cMoss;
        }
      }

      albedo[p4] = clampByte(rgb[0] * edgeDarken);
      albedo[p4 + 1] = clampByte(rgb[1] * edgeDarken);
      albedo[p4 + 2] = clampByte(rgb[2] * edgeDarken);
      albedo[p4 + 3] = alpha;

      emissive[p4] = em[0];
      emissive[p4 + 1] = em[1];
      emissive[p4 + 2] = em[2];
      emissive[p4 + 3] = 255;

      const roughByte = clampByte(rough * 255);
      roughness[p4] = roughByte;
      roughness[p4 + 1] = roughByte;
      roughness[p4 + 2] = roughByte;
      roughness[p4 + 3] = 255;

      const hByte = clampByte(h * 255);
      heightMap[p4] = hByte;
      heightMap[p4 + 1] = hByte;
      heightMap[p4 + 2] = hByte;
      heightMap[p4 + 3] = 255;

      height[idx] = h;
    }
  }

  // Derive seamless tangent-space normal map from height field using a 3x3 Sobel filter.
  // Because textures use flipY = true (y = 0 maps to v = 1 / top), +v aligns with -y.
  // Therefore ny = -dh/dv = +dh/dy (+sobelY) so overhead directional light catches top ridges.
  const baseStrength =
    type === "stone" || type === "deep_stone" || type === "glow_ore"
      ? 3.2
      : type === "cherry_log" || type === "cherry_planks"
        ? 2.85
        : 2.5;
  const strength = baseStrength * (0.45 + 0.55 * grain);

  const sampleH = (sx: number, sy: number) =>
    height[((sy + SIZE) % SIZE) * SIZE + ((sx + SIZE) % SIZE)];

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const tl = sampleH(x - 1, y - 1);
      const tc = sampleH(x, y - 1);
      const tr = sampleH(x + 1, y - 1);
      const ml = sampleH(x - 1, y);
      const mr = sampleH(x + 1, y);
      const bl = sampleH(x - 1, y + 1);
      const bc = sampleH(x, y + 1);
      const br = sampleH(x + 1, y + 1);

      const sobelX = (tr + 2 * mr + br - (tl + 2 * ml + bl)) * 0.25 * strength;
      const sobelY = (bl + 2 * bc + br - (tl + 2 * tc + tr)) * 0.25 * strength;

      const nx = -sobelX;
      const ny = sobelY;
      const nz = 1.0;
      const invLen = 1 / Math.hypot(nx, ny, nz);
      const p4 = (y * SIZE + x) * 4;
      normal[p4] = clampByte((nx * invLen * 0.5 + 0.5) * 255);
      normal[p4 + 1] = clampByte((ny * invLen * 0.5 + 0.5) * 255);
      normal[p4 + 2] = clampByte((nz * invLen * 0.5 + 0.5) * 255);
      normal[p4 + 3] = 255;
    }
  }

  return { albedo, normal, emissive, roughness, heightMap, height };
}

export function paintBlockTexture(
  type: BlockType,
  face: BlockFace = "side",
  options?: PaintBlockOptions,
): Uint8Array {
  return paintBlockBuffers(type, face, options).albedo;
}

export function paintNormalMap(
  type: BlockType,
  face: BlockFace = "side",
  options?: PaintBlockOptions,
): Uint8Array {
  return paintBlockBuffers(type, face, options).normal;
}

export function paintHeightMap(
  type: BlockType,
  face: BlockFace = "side",
  options?: PaintBlockOptions,
): Uint8Array {
  return paintBlockBuffers(type, face, options).heightMap;
}

/**
 * Converts a normalized [0,1] height field into a crevice-only AO map:
 * midtones and ridges (h >= 0.56) stay at full 1.0 brightness while
 * cracks, pits, and bark furrows (h < 0.56) smoothly occlude down to ~0.22.
 */
function deriveCavityAoFromHeight(height: Float32Array): Uint8Array {
  const out = new Uint8Array(SIZE * SIZE * 4);
  for (let i = 0; i < SIZE * SIZE; i++) {
    const h = height[i];
    const t = clamp01((h - 0.08) / 0.48);
    const smooth = t * t * (3 - 2 * t);
    const ao = clampByte((0.22 + 0.78 * smooth) * 255);
    const p4 = i * 4;
    out[p4] = ao;
    out[p4 + 1] = ao;
    out[p4 + 2] = ao;
    out[p4 + 3] = 255;
  }
  return out;
}

function makeDataTexture(data: Uint8Array, isColor: boolean): THREE.DataTexture {
  const tex = new THREE.DataTexture(data, SIZE, SIZE, THREE.RGBAFormat);
  tex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.flipY = true;
  tex.channel = 0;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

const materialCache = new Map<string, THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[]>();

/**
 * Shared uniform object updated per frame by IslandBlocks without triggering shader recompiles.
 */
export const islandShaderUniforms = {
  uProgress: { value: 0 },
  uTime: { value: 0 },
  uCutaway: { value: 0 },
  uDusk: { value: 0 },
};

function attachStoryShader(
  mat: THREE.MeshStandardMaterial,
  options: { sway?: boolean; cutawayEligible?: boolean; emissiveDuskBoost?: boolean },
) {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uProgress = islandShaderUniforms.uProgress;
    shader.uniforms.uTime = islandShaderUniforms.uTime;
    shader.uniforms.uCutaway = islandShaderUniforms.uCutaway;
    shader.uniforms.uDusk = islandShaderUniforms.uDusk;

    shader.vertexShader =
      `
      attribute float aAppearAt;
      uniform float uProgress;
      uniform float uTime;
      uniform float uCutaway;
      varying float vCutClip;
      ` + shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `
      #include <begin_vertex>
      float dropWindow = 0.02;
      float reveal = aAppearAt <= 0.0001
        ? 1.0
        : clamp((uProgress - aAppearAt) / dropWindow, 0.0, 1.0);

      // Tiny overshoot bounce
      float bounce = reveal < 1.0
        ? (reveal < 0.7 ? (reveal / 0.7) * 1.08 : 1.08 - ((reveal - 0.7) / 0.3) * 0.08)
        : 1.0;

      float sc = reveal <= 0.0 ? 0.0 : bounce;
      transformed *= sc;
      transformed.y += (1.0 - reveal) * 1.5;

      ${
        options.sway
          ? `
      vec4 instPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
      float phase = instPos.x * 0.7 + instPos.z * 0.9 + instPos.y * 0.4;
      transformed.x += sin(uTime * 1.6 + phase) * 0.045 * reveal;
      transformed.z += cos(uTime * 1.3 + phase * 1.2) * 0.035 * reveal;
      `
          : ""
      }

      vCutClip = 0.0;
      ${
        options.cutawayEligible
          ? `
      #ifdef USE_INSTANCING
        vec3 centerPos = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        if (uCutaway > 0.01 && centerPos.z > 0.6 && centerPos.y < -0.5) {
          vCutClip = uCutaway;
        }
      #endif
      `
          : ""
      }
      `,
    );

    shader.fragmentShader =
      `
      varying float vCutClip;
      uniform float uDusk;
      ` + shader.fragmentShader;

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <clipping_planes_fragment>",
      `
      #include <clipping_planes_fragment>
      if (vCutClip > 0.5) discard;
      `,
    );

    if (options.emissiveDuskBoost) {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <emissivemap_fragment>",
        `
        #include <emissivemap_fragment>
        totalEmissiveRadiance *= (0.35 + uDusk * 2.2);
        `,
      );
    }
  };
  mat.customProgramCacheKey = () =>
    `petalnode-${options.sway ? 1 : 0}-${options.cutawayEligible ? 1 : 0}-${options.emissiveDuskBoost ? 1 : 0}`;
}

export function getBlockMaterial(
  type: BlockType,
  tier: QualityTier,
  attachStory = true,
  options: MaterialOptions = {},
): THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[] {
  const variant: MaterialVariant = options.variant ?? "pbr";
  const grain = variant === "flat" ? 0 : Math.max(0, Math.min(2.5, options.grainIntensity ?? 1.0));
  const cacheKey = `${type}:${tier}:${attachStory ? "story" : "plain"}:${variant}:${grain.toFixed(2)}`;
  const existing = materialCache.get(cacheKey);
  if (existing) return existing;

  const isLeafOrPlant = type === "cherry_leaves" || type === "flower" || type === "sapling";
  const isCutawayEligible =
    type === "stone" || type === "deep_stone" || type === "dirt" || type === "glow_ore";
  const isLantern = type === "paper_lantern";
  const isOre = type === "glow_ore";
  const isWater = type === "water";

  // Flat baseline renders pure albedo-only texture without normal, roughness, or height relief.
  // Improved PBR pipeline attaches Sobel normal maps, roughness maps, and height-map cavity AO for stone & bark.
  const useNormalMap = variant === "pbr" && tier !== "low";
  const useRoughnessMap = variant === "pbr" && tier === "high";
  const useHeightCavityMap =
    variant === "pbr" && tier !== "low" && usesHeightMapRelief(type);

  const makeOne = (face: BlockFace) => {
    const bufs = paintBlockBuffers(type, face, { grainIntensity: grain });
    const map = makeDataTexture(bufs.albedo, true);
    const normalMap = useNormalMap ? makeDataTexture(bufs.normal, false) : undefined;
    const roughnessMap = useRoughnessMap ? makeDataTexture(bufs.roughness, false) : undefined;
    const heightAoMap = useHeightCavityMap
      ? makeDataTexture(deriveCavityAoFromHeight(bufs.height), false)
      : undefined;
    const hasEmissive = isOre || isLantern;
    const emissiveMap = hasEmissive ? makeDataTexture(bufs.emissive, true) : undefined;

    const baseRoughness = isWater
      ? 0.14
      : isOre
        ? 0.55
        : type === "cherry_planks"
          ? 0.68
          : type === "stone" || type === "deep_stone"
            ? 0.72
            : 0.88;

    const envIntensity =
      variant === "flat"
        ? 0.15
        : isWater
          ? 1.15
          : isOre
            ? 0.72
            : type === "stone" || type === "deep_stone" || type === "cherry_planks"
              ? 0.36
              : 0.18;

    const normalScaleVal = 0.55 + 0.42 * grain;

    const matParams: THREE.MeshStandardMaterialParameters = {
      color: 0xffffff,
      map,
      roughness: useRoughnessMap ? 1.0 : baseRoughness,
      metalness: isOre ? 0.14 : 0.0,
      envMapIntensity: envIntensity,
      alphaTest: isLeafOrPlant ? 0.42 : 0,
      transparent: isWater,
      opacity: isWater ? 0.84 : 1,
      side: isLeafOrPlant ? THREE.DoubleSide : THREE.FrontSide,
      emissive: hasEmissive ? new THREE.Color(0xffffff) : new THREE.Color(0x000000),
      emissiveIntensity: isOre ? 1.35 : isLantern ? 1.55 : 0,
    };
    if (normalMap) {
      matParams.normalMap = normalMap;
      matParams.normalScale = new THREE.Vector2(normalScaleVal, normalScaleVal);
    }
    if (roughnessMap) {
      matParams.roughnessMap = roughnessMap;
    }
    if (heightAoMap) {
      // Height-derived cavity AO deepens stone fissures and bark furrows while keeping ridges bright
      matParams.aoMap = heightAoMap;
      matParams.aoMapIntensity = Math.min(1.05, 0.62 * (0.45 + 0.55 * grain));
    }
    if (emissiveMap) {
      matParams.emissiveMap = emissiveMap;
    }
    const mat = new THREE.MeshStandardMaterial(matParams);

    if (attachStory) {
      attachStoryShader(mat, {
        sway: isLeafOrPlant,
        cutawayEligible: isCutawayEligible,
        emissiveDuskBoost: isLantern,
      });
    }
    return mat;
  };

  let result: THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[];
  if (type === "grass" || type === "cherry_log") {
    const side = makeOne("side");
    const top = makeOne("top");
    const bottom = makeOne("bottom");
    // BoxGeometry face order: +x, -x, +y, -y, +z, -z
    result = [side, side, top, bottom, side, side];
  } else {
    result = makeOne("side");
  }

  materialCache.set(cacheKey, result);
  return result;
}
