import type { ChapterId } from "@/content";
import { clamp01 } from "@/lib/storyStore";

export const BLOCK_TYPES = [
  "grass",
  "dirt",
  "stone",
  "deep_stone",
  "glow_ore",
  "cherry_log",
  "cherry_leaves",
  "cherry_planks",
  "path",
  "water",
  "paper_lantern",
  "moss_carpet",
  "flower",
  "sapling",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export interface IslandBlock {
  x: number;
  y: number;
  z: number;
  type: BlockType;
  chapter: ChapterId;
  appearAt: number;
  groupId?: string;
}

export interface AnchorPoint {
  x: number;
  y: number;
  z: number;
}

export interface IslandAnchors {
  seed: AnchorPoint;
  ore: AnchorPoint;
  domeRim: AnchorPoint;
  house: AnchorPoint;
  mascots: AnchorPoint;
}

export interface BuildIslandOptions {
  sizeFactor?: number;
  seed?: number;
}

export interface BuiltIsland {
  blocks: IslandBlock[];
  anchors: IslandAnchors;
  seedCenter: AnchorPoint;
}

function hash2(x: number, z: number, seed: number): number {
  const n = Math.sin(x * 127.1 + z * 311.7 + seed * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

function hash3(x: number, y: number, z: number, seed: number): number {
  const n =
    Math.sin(x * 127.1 + y * 269.5 + z * 311.7 + seed * 53.3) * 43758.5453123;
  return n - Math.floor(n);
}

function smoothNoise2D(x: number, z: number, seed: number): number {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx);
  const uz = fz * fz * (3 - 2 * fz);
  const a = hash2(ix, iz, seed);
  const b = hash2(ix + 1, iz, seed);
  const c = hash2(ix, iz + 1, seed);
  const d = hash2(ix + 1, iz + 1, seed);
  return a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz;
}

/**
 * Pure deterministic island layout and reveal schedule.
 * - sizeFactor = 1 produces ~4,500–5,200 blocks (within 4,000–6,000 budget).
 * - sizeFactor = 0.6 produces ~60% of that (~2,700–3,100 blocks).
 */
export function buildIsland(options: BuildIslandOptions = {}): BuiltIsland {
  const sizeFactor = options.sizeFactor ?? 1;
  const seed = options.seed ?? 42;
  const radiusScale = Math.sqrt(sizeFactor);
  const maxRadius = 15.5 * radiusScale;
  const maxDepth = Math.round(13.5 * (0.35 + 0.65 * radiusScale));

  const map = new Map<string, IslandBlock>();
  const key = (x: number, y: number, z: number) => `${x},${y},${z}`;

  const setBlock = (block: IslandBlock) => {
    map.set(key(block.x, block.y, block.z), block);
  };

  // Surface heightmap helper
  const surfaceY = (x: number, z: number): number => {
    const r = Math.hypot(x, z);
    if (r <= 2.2) return 0; // Keep center flat around the seed
    const n1 = smoothNoise2D(x * 0.16 + 10, z * 0.16 + 10, seed);
    const n2 = smoothNoise2D(x * 0.35 - 5, z * 0.35 + 7, seed + 13);
    const hill = (n1 * 0.7 + n2 * 0.3 - 0.45) * 3.2;
    const edgeTaper = Math.max(0, 1 - (r / maxRadius) * 0.45);
    return Math.round(hill * edgeTaper);
  };

  // 1. Seed block + sapling (Chapter 0: seed, appearAt = 0)
  setBlock({
    x: 0,
    y: 0,
    z: 0,
    type: "grass",
    chapter: "seed",
    appearAt: 0,
  });
  setBlock({
    x: 0,
    y: 1,
    z: 0,
    type: "sapling",
    chapter: "seed",
    appearAt: 0,
  });

  // 2. Terrain surface + inverted cone underside
  const rLim = Math.ceil(maxRadius);
  const rootCandidates: { x: number; y: number; z: number; dist: number; bottomY: number }[] = [];
  const surfaceCandidates: { x: number; y: number; z: number; type: BlockType; dist: number }[] = [];

  for (let x = -rLim; x <= rLim; x++) {
    for (let z = -rLim; z <= rLim; z++) {
      const dist2d = Math.hypot(x, z);
      const edgeNoise = (smoothNoise2D(x * 0.25, z * 0.25, seed + 99) - 0.5) * 2.4;
      const localMaxR = maxRadius + edgeNoise;
      if (dist2d > localMaxR) continue;

      const topY = surfaceY(x, z);
      const normR = Math.min(1, dist2d / localMaxR);
      // Inverted cone / tapered underside
      const coneNoise = (smoothNoise2D(x * 0.22 + 3, z * 0.22 - 4, seed + 51) - 0.5) * 2.2;
      const depthHere = Math.max(
        1,
        Math.round((1 - Math.pow(normR, 1.38)) * maxDepth + coneNoise * (1 - normR * 0.5)),
      );
      const bottomY = topY - depthHere;

      // Top grass & subsurface dirt belong to chapter "shield" (except seed 0,0,0)
      if (!(x === 0 && z === 0)) {
        surfaceCandidates.push({
          x,
          y: topY,
          z,
          type: "grass",
          dist: dist2d,
        });
      }

      if (topY - 1 >= bottomY) {
        surfaceCandidates.push({
          x,
          y: topY - 1,
          z,
          type: "dirt",
          dist: dist2d,
        });
      }

      // Underside stone / deep_stone / glow_ore belong to chapter "roots"
      for (let y = topY - 2; y >= bottomY; y--) {
        const d3 = Math.hypot(x, y, z);
        rootCandidates.push({ x, y, z, dist: d3, bottomY });
      }
    }
  }

  // Sort roots strictly by distance from seed (0,0,0)
  rootCandidates.sort((a, b) => a.dist - b.dist || a.y - b.y || a.x - b.x || a.z - b.z);
  const maxRootDist = rootCandidates.length > 0 ? rootCandidates[rootCandidates.length - 1].dist : 1;

  // Pick glow ore vein centers in the visible cutaway interior (near z in [-2, 4], y in [-7, -2])
  const oreCenters = [
    { x: -3, y: -3, z: 0 },
    { x: 2, y: -5, z: -1 },
    { x: -1, y: -6, z: 1 },
    { x: 4, y: -3, z: 1 },
  ];

  let brightestOre: AnchorPoint = { x: 2, y: -4, z: -1 };
  let bestOreScore = -Infinity;

  for (const c of rootCandidates) {
    const t = Math.min(0.96, c.dist / Math.max(1, maxRootDist));
    const appearAt = 0.1 + t * 0.165; // strictly inside [0.10, 0.28)

    // Determine stone vs deep_stone vs glow_ore
    let isOre = false;
    for (const oc of oreCenters) {
      const od = Math.hypot(c.x - oc.x, c.y - oc.y, c.z - oc.z);
      if (od <= 1.65 && hash3(c.x, c.y, c.z, seed + 7) > 0.28) {
        isOre = true;
        break;
      }
    }

    let type: BlockType = "stone";
    if (isOre) {
      type = "glow_ore";
      const score = -Math.hypot(c.x - 1, c.y + 4, c.z + 0.5);
      if (score > bestOreScore) {
        bestOreScore = score;
        brightestOre = { x: c.x, y: c.y, z: c.z };
      }
    } else if (c.y <= -6 || (c.y <= -4 && hash3(c.x, c.y, c.z, seed + 19) > 0.45)) {
      type = "deep_stone";
    }

    setBlock({
      x: c.x,
      y: c.y,
      z: c.z,
      type,
      chapter: "roots",
      appearAt,
    });
  }

  // Place surface grass & dirt in Shield chapter (0.28 .. 0.46)
  surfaceCandidates.sort((a, b) => a.dist - b.dist);
  const maxSurfDist = surfaceCandidates.length > 0 ? surfaceCandidates[surfaceCandidates.length - 1].dist : 1;
  for (const sc of surfaceCandidates) {
    const t = Math.min(0.95, sc.dist / Math.max(1, maxSurfDist));
    const appearAt = 0.28 + t * 0.165; // strictly inside [0.28, 0.46)
    setBlock({
      x: sc.x,
      y: sc.y,
      z: sc.z,
      type: sc.type,
      chapter: "shield",
      appearAt,
    });
  }

  // Helper to get surface Y at (x, z)
  const getGroundY = (x: number, z: number): number => {
    for (let y = 5; y >= -4; y--) {
      const existing = map.get(key(x, y, z));
      if (existing && (existing.type === "grass" || existing.type === "path")) {
        return y;
      }
    }
    return surfaceY(x, z);
  };

  // 3. Hand-placed Build chapter structures (0.46 .. 0.66)
  // Group A: Stone path (0.465 .. 0.495)
  const pathPoints: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 2],
    [1, 3],
    [2, 3],
    [2, 4],
    [3, 4],
    [3, 5],
    [4, 5],
    [4, 6],
    [-1, 0],
    [-2, 0],
    [-2, -1],
    [-3, -1],
    [-3, -2],
    [-4, -2],
  ];
  pathPoints.forEach(([px, pz], idx) => {
    if (Math.hypot(px, pz) > maxRadius - 2) return;
    const py = getGroundY(px, pz);
    const existing = map.get(key(px, py, pz));
    setBlock({
      x: px,
      y: py,
      z: pz,
      type: "path",
      chapter: existing ? existing.chapter : "build",
      appearAt: existing ? existing.appearAt : 0.468 + (idx / pathPoints.length) * 0.02,
      groupId: "path",
    });
  });

  // Group B: Small pond + waterfall spilling off front-right edge (0.495 .. 0.525)
  const pondX = Math.round(7 * radiusScale);
  const pondZ = Math.round(-5 * radiusScale);
  const pondBaseY = getGroundY(pondX, pondZ);
  for (let dx = -2; dx <= 2; dx++) {
    for (let dz = -2; dz <= 2; dz++) {
      if (dx * dx + dz * dz > 5) continue;
      const wx = pondX + dx;
      const wz = pondZ + dz;
      // Carve pond basin slightly
      map.delete(key(wx, pondBaseY + 1, wz));
      setBlock({
        x: wx,
        y: pondBaseY,
        z: wz,
        type: "water",
        chapter: "build",
        appearAt: 0.498 + ((dx + 2) * 0.003),
        groupId: "pond",
      });
    }
  }
  // Waterfall spilling down edge
  const wfX = pondX + 2;
  const wfZ = pondZ - 1;
  for (let wy = pondBaseY; wy >= pondBaseY - 9; wy--) {
    setBlock({
      x: wfX + (wy < pondBaseY - 2 ? 1 : 0),
      y: wy,
      z: wfZ,
      type: "water",
      chapter: "build",
      appearAt: 0.508 + ((pondBaseY - wy) / 10) * 0.014,
      groupId: "pond",
    });
  }

  // Group C: 3 Cherry Blossom Trees (each pops in as a coherent group!)
  const placeCherryTree = (
    cx: number,
    cz: number,
    height: number,
    windowStart: number,
    groupId: string,
  ) => {
    const baseY = getGroundY(cx, cz);
    // Trunk
    for (let h = 1; h <= height; h++) {
      setBlock({
        x: cx,
        y: baseY + h,
        z: cz,
        type: "cherry_log",
        chapter: "build",
        appearAt: windowStart + (h / height) * 0.008,
        groupId,
      });
    }
    // Slight diagonal branch
    const branchDirX = cx < 0 ? 1 : -1;
    setBlock({
      x: cx + branchDirX,
      y: baseY + height,
      z: cz,
      type: "cherry_log",
      chapter: "build",
      appearAt: windowStart + 0.009,
      groupId,
    });

    // Canopy layers
    const topY = baseY + height;
    for (let dy = -1; dy <= 2; dy++) {
      const r = dy === -1 ? 2.1 : dy === 0 ? 2.6 : dy === 1 ? 2.1 : 1.2;
      for (let dx = -3; dx <= 3; dx++) {
        for (let dz = -3; dz <= 3; dz++) {
          const d = Math.hypot(dx - branchDirX * 0.3, dz);
          if (d > r) continue;
          // Skip trunk core
          if (dx === 0 && dz === 0 && dy <= 0) continue;
          if (hash3(cx + dx, topY + dy, cz + dz, seed + 33) < 0.14 && dy !== 2) continue;
          setBlock({
            x: cx + dx,
            y: topY + dy,
            z: cz + dz,
            type: "cherry_leaves",
            chapter: "build",
            appearAt: windowStart + 0.011 + ((dy + 1) / 4) * 0.012,
            groupId,
          });
        }
      }
    }
  };

  placeCherryTree(
    Math.round(-7 * radiusScale),
    Math.round(-4 * radiusScale),
    5,
    0.525,
    "tree_1",
  );
  placeCherryTree(
    Math.round(-5 * radiusScale),
    Math.round(7 * radiusScale),
    4,
    0.555,
    "tree_2",
  );
  placeCherryTree(
    Math.round(7 * radiusScale),
    Math.round(4 * radiusScale),
    4,
    0.585,
    "tree_3",
  );

  // Group D: Cozy Cherry-Plank House with lantern porch (0.615 .. 0.652)
  const hx = Math.round(4 * radiusScale);
  const hz = Math.round(7 * radiusScale);
  const hBaseY = getGroundY(hx, hz);

  // Foundation floor
  for (let dx = -2; dx <= 2; dx++) {
    for (let dz = -2; dz <= 2; dz++) {
      setBlock({
        x: hx + dx,
        y: hBaseY,
        z: hz + dz,
        type: "cherry_planks",
        chapter: "build",
        appearAt: 0.616,
        groupId: "house",
      });
    }
  }
  // Walls (height 3)
  for (let wy = 1; wy <= 3; wy++) {
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -2; dz <= 2; dz++) {
        const isEdge = Math.abs(dx) === 2 || Math.abs(dz) === 2;
        if (!isEdge) continue;
        // Doorway on front (-z facing center path)
        if (dz === -2 && dx === 0 && wy <= 2) continue;
        // Windows on sides
        if (wy === 2 && (dx === 0 || dz === 0)) continue;
        const isCorner = Math.abs(dx) === 2 && Math.abs(dz) === 2;
        setBlock({
          x: hx + dx,
          y: hBaseY + wy,
          z: hz + dz,
          type: isCorner ? "cherry_log" : "cherry_planks",
          chapter: "build",
          appearAt: 0.62 + wy * 0.005,
          groupId: "house",
        });
      }
    }
  }
  // Pitched roof
  for (let dz = -3; dz <= 3; dz++) {
    for (let dx = -3; dx <= 3; dx++) {
      const roofH = 4 + Math.max(0, 2 - Math.abs(dx));
      if (Math.abs(dx) === 3 && Math.abs(dz) === 3) continue;
      setBlock({
        x: hx + dx,
        y: hBaseY + roofH,
        z: hz + dz,
        type: Math.abs(dx) === 0 ? "cherry_log" : "cherry_planks",
        chapter: "build",
        appearAt: 0.638 + (2 - Math.min(2, Math.abs(dx))) * 0.004,
        groupId: "house",
      });
    }
  }
  // Porch lantern
  setBlock({
    x: hx - 1,
    y: hBaseY + 2,
    z: hz - 3,
    type: "paper_lantern",
    chapter: "build",
    appearAt: 0.65,
    groupId: "house",
  });

  // 4. Neighbors chapter details: moss carpet, flowers, path lanterns (0.66 .. 0.86)
  const lanternSpots: [number, number][] = [
    [-2, -2],
    [2, 2],
    [3, 5],
    [-4, 4],
    [5, -2],
  ];
  lanternSpots.forEach(([lx, lz], i) => {
    const sx = Math.round(lx * radiusScale);
    const sz = Math.round(lz * radiusScale);
    if (Math.hypot(sx, sz) > maxRadius - 2) return;
    const ly = getGroundY(sx, sz);
    setBlock({
      x: sx,
      y: ly + 1,
      z: sz,
      type: "paper_lantern",
      chapter: "neighbors",
      appearAt: 0.68 + i * 0.025,
    });
  });

  // Moss carpet & flowers scattered across grass
  for (let x = -rLim + 2; x <= rLim - 2; x++) {
    for (let z = -rLim + 2; z <= rLim - 2; z++) {
      if (Math.hypot(x, z) > maxRadius - 2.5) continue;
      const gy = getGroundY(x, z);
      const ground = map.get(key(x, gy, z));
      if (!ground || ground.type !== "grass") continue;
      if (map.has(key(x, gy + 1, z))) continue;

      const r = hash2(x * 1.3, z * 1.7, seed + 202);
      if (r > 0.86) {
        const appearAt = 0.67 + hash2(x, z, seed + 303) * 0.15;
        setBlock({
          x,
          y: gy + 1,
          z,
          type: r > 0.93 ? "flower" : "moss_carpet",
          chapter: "neighbors",
          appearAt,
        });
      }
    }
  }

  const blocks = Array.from(map.values()).sort((a, b) => a.appearAt - b.appearAt);

  const anchors: IslandAnchors = {
    seed: { x: 0, y: 1.4, z: 0 },
    ore: brightestOre,
    domeRim: { x: 10.5 * radiusScale, y: 5.5, z: 7.5 * radiusScale },
    house: { x: hx, y: hBaseY + 4.5, z: hz },
    mascots: { x: hx + 1.5, y: hBaseY + 1.4, z: hz - 3.2 },
  };

  return {
    blocks,
    anchors,
    seedCenter: { x: 0, y: 0.5, z: 0 },
  };
}

/**
 * Pure visibility / drop-in reveal amount [0..1] for a block at global progress.
 * Matches the ~0.02 drop-in window from 03-STORYBOARD.md.
 */
export function isBlockVisible(block: IslandBlock, progress: number): number {
  const p = clamp01(progress);
  if (block.appearAt === 0) return 1;
  const window = 0.02;
  if (p < block.appearAt) return 0;
  if (p >= block.appearAt + window) return 1;
  return (p - block.appearAt) / window;
}
