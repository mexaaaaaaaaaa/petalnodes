import rough from "roughjs";

export interface RoughStrokePath {
  d: string;
  stroke: string;
  strokeWidth: number;
  fill?: string;
}

const gen = rough.generator();

function opsToD(ops: Array<{ op: string; data: number[] }>): string {
  let d = "";
  for (const item of ops) {
    const p = item.data;
    if (item.op === "move") {
      d += `M${p[0].toFixed(2)} ${p[1].toFixed(2)} `;
    } else if (item.op === "lineTo") {
      d += `L${p[0].toFixed(2)} ${p[1].toFixed(2)} `;
    } else if (item.op === "bcurveTo") {
      d += `C${p[0].toFixed(2)} ${p[1].toFixed(2)},${p[2].toFixed(2)} ${p[3].toFixed(2)},${p[4].toFixed(2)} ${p[5].toFixed(2)} `;
    }
  }
  return d.trim();
}

export function generateRoughRectPaths(opts: {
  x: number;
  y: number;
  width: number;
  height: number;
  seed: number;
  roughness?: number;
  strokeWidth?: number;
  stroke?: string;
  fill?: string;
  fillStyle?: "hachure" | "solid" | "zigzag";
}): RoughStrokePath[] {
  const drawable = gen.rectangle(opts.x, opts.y, opts.width, opts.height, {
    seed: opts.seed,
    roughness: opts.roughness ?? 1.2,
    strokeWidth: opts.strokeWidth ?? 1.8,
    stroke: opts.stroke ?? "#2B2230",
    fill: opts.fill,
    fillStyle: opts.fillStyle ?? "hachure",
    hachureGap: 6,
    hachureAngle: -41,
  });

  const paths: RoughStrokePath[] = [];
  for (const set of drawable.sets) {
    const d = opsToD(set.ops);
    if (!d) continue;
    if (set.type === "fillPath") {
      paths.push({
        d,
        stroke: "none",
        strokeWidth: 0,
        fill: opts.fill ?? "none",
      });
    } else if (set.type === "fillSketch") {
      paths.push({
        d,
        stroke: opts.fill ?? "#FFC9D6",
        strokeWidth: 1.4,
        fill: "none",
      });
    } else {
      paths.push({
        d,
        stroke: opts.stroke ?? "#2B2230",
        strokeWidth: opts.strokeWidth ?? 1.8,
        fill: "none",
      });
    }
  }
  return paths;
}

export function generateRoughUnderlinePaths(opts: {
  width: number;
  y: number;
  seed: number;
  stroke?: string;
  strokeWidth?: number;
}): RoughStrokePath[] {
  const d1 = gen.line(2, opts.y, opts.width - 2, opts.y - 1.5, {
    seed: opts.seed,
    roughness: 1.4,
    strokeWidth: opts.strokeWidth ?? 3.2,
    stroke: opts.stroke ?? "#E2557B",
    bowing: 1.5,
  });
  const d2 = gen.line(6, opts.y + 4, opts.width - 6, opts.y + 2.5, {
    seed: opts.seed + 17,
    roughness: 1.2,
    strokeWidth: (opts.strokeWidth ?? 3.2) * 0.65,
    stroke: opts.stroke ?? "#E2557B",
    bowing: 1.2,
  });

  const out: RoughStrokePath[] = [];
  for (const drw of [d1, d2]) {
    for (const set of drw.sets) {
      const d = opsToD(set.ops);
      if (d) {
        out.push({
          d,
          stroke: opts.stroke ?? "#E2557B",
          strokeWidth: drw === d1 ? (opts.strokeWidth ?? 3.2) : (opts.strokeWidth ?? 3.2) * 0.65,
          fill: "none",
        });
      }
    }
  }
  return out;
}

export function generateRoughCirclePaths(opts: {
  cx: number;
  cy: number;
  width: number;
  height: number;
  seed: number;
  stroke?: string;
  strokeWidth?: number;
}): RoughStrokePath[] {
  const drawable = gen.ellipse(opts.cx, opts.cy, opts.width, opts.height, {
    seed: opts.seed,
    roughness: 1.5,
    strokeWidth: opts.strokeWidth ?? 2.6,
    stroke: opts.stroke ?? "#E2557B",
    curveStepCount: 14,
  });
  const out: RoughStrokePath[] = [];
  for (const set of drawable.sets) {
    const d = opsToD(set.ops);
    if (d) {
      out.push({
        d,
        stroke: opts.stroke ?? "#E2557B",
        strokeWidth: opts.strokeWidth ?? 2.6,
        fill: "none",
      });
    }
  }
  return out;
}

export function generateRoughArrowPaths(opts: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  curvature?: number;
  seed: number;
  stroke?: string;
  strokeWidth?: number;
}): { shaft: RoughStrokePath[]; head: RoughStrokePath[] } {
  const { x1, y1, x2, y2, curvature = 0.25, seed, stroke = "#2B2230", strokeWidth = 2.2 } = opts;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = (x1 + x2) / 2 + nx * len * curvature;
  const cy = (y1 + y2) / 2 + ny * len * curvature;

  const curveDrawable = gen.curve(
    [
      [x1, y1],
      [cx, cy],
      [x2, y2],
    ],
    {
      seed,
      roughness: 1.1,
      strokeWidth,
      stroke,
    },
  );

  // Tangent near end
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const headLen = Math.min(13, Math.max(8, len * 0.16));
  const spread1 = 0.46;
  const spread2 = 0.39; // slightly uneven hand-drawn head

  const hx1 = x2 - headLen * Math.cos(ang - spread1);
  const hy1 = y2 - headLen * Math.sin(ang - spread1);
  const hx2 = x2 - headLen * 0.92 * Math.cos(ang + spread2);
  const hy2 = y2 - headLen * 0.92 * Math.sin(ang + spread2);

  const headA = gen.line(x2, y2, hx1, hy1, { seed: seed + 3, roughness: 0.9, strokeWidth, stroke });
  const headB = gen.line(x2, y2, hx2, hy2, { seed: seed + 7, roughness: 0.9, strokeWidth, stroke });

  const extract = (drw: typeof curveDrawable): RoughStrokePath[] =>
    drw.sets
      .map((s) => ({
        d: opsToD(s.ops),
        stroke,
        strokeWidth,
        fill: "none",
      }))
      .filter((p) => p.d.length > 0);

  return {
    shaft: extract(curveDrawable),
    head: [...extract(headA), ...extract(headB)],
  };
}
