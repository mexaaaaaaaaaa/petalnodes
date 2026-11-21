import test from "node:test";
import assert from "node:assert/strict";
import { buildIsland, isBlockVisible } from "./islandGenerator";
import { CHAPTER_RANGES } from "@/lib/storyStore";

test("same options give an identical block list", () => {
  const a = buildIsland({ sizeFactor: 1, seed: 42 });
  const b = buildIsland({ sizeFactor: 1, seed: 42 });
  assert.deepEqual(a, b);
});

test("no two blocks share a position", () => {
  const island = buildIsland({ sizeFactor: 1, seed: 42 });
  const seen = new Set<string>();
  for (const b of island.blocks) {
    const k = `${b.x},${b.y},${b.z}`;
    assert.equal(seen.has(k), false, `Duplicate block at ${k}`);
    seen.add(k);
  }
});

test("block count is between 4000 and 6000 at size 1 and ~60% at size 0.6", () => {
  const full = buildIsland({ sizeFactor: 1, seed: 42 });
  const small = buildIsland({ sizeFactor: 0.6, seed: 42 });
  assert.ok(
    full.blocks.length >= 4000 && full.blocks.length <= 6000,
    `Expected 4000..6000 blocks, got ${full.blocks.length}`,
  );
  const ratio = small.blocks.length / full.blocks.length;
  assert.ok(
    ratio >= 0.45 && ratio <= 0.75,
    `Expected ~0.60 ratio, got ${ratio.toFixed(2)} (${small.blocks.length}/${full.blocks.length})`,
  );
});

test("every block appearAt lies inside its chapter range and seed appears at 0", () => {
  const island = buildIsland({ sizeFactor: 1, seed: 42 });
  const rangeMap = new Map(CHAPTER_RANGES.map((r) => [r.id, r]));

  const seedBlocks = island.blocks.filter((b) => b.chapter === "seed");
  assert.ok(seedBlocks.length >= 2);
  for (const sb of seedBlocks) {
    assert.equal(sb.appearAt, 0);
  }

  for (const b of island.blocks) {
    const r = rangeMap.get(b.chapter);
    assert.ok(r, `Unknown chapter ${b.chapter}`);
    assert.ok(
      b.appearAt >= r.start - 1e-9 && b.appearAt <= r.end,
      `Block ${b.type} (${b.chapter}) appearAt=${b.appearAt} outside [${r.start}, ${r.end}]`,
    );
  }
});

test("roots blocks are ordered by distance from seed and tree groups appear tightly", () => {
  const island = buildIsland({ sizeFactor: 1, seed: 42 });
  const roots = island.blocks.filter((b) => b.chapter === "roots");
  assert.ok(roots.length > 500);
  // Check monotonicity of appearAt vs distance
  for (let i = 1; i < roots.length; i++) {
    const prevD = Math.hypot(roots[i - 1].x, roots[i - 1].y, roots[i - 1].z);
    const currD = Math.hypot(roots[i].x, roots[i].y, roots[i].z);
    if (currD > prevD + 0.01) {
      assert.ok(roots[i].appearAt >= roots[i - 1].appearAt);
    }
  }

  const tree1 = island.blocks.filter((b) => b.groupId === "tree_1");
  assert.ok(tree1.length > 10);
  const minA = Math.min(...tree1.map((b) => b.appearAt));
  const maxA = Math.max(...tree1.map((b) => b.appearAt));
  assert.ok(maxA - minA < 0.03, `Tree1 span too wide: ${maxA - minA}`);
});

test("all named anchors exist", () => {
  const island = buildIsland({ sizeFactor: 1, seed: 42 });
  assert.ok(island.anchors.seed);
  assert.ok(island.anchors.ore);
  assert.ok(island.anchors.domeRim);
  assert.ok(island.anchors.house);
  assert.ok(island.anchors.mascots);
});

test("reveal is a pure function of progress across 200 random jumps", () => {
  const island = buildIsland({ sizeFactor: 1, seed: 42 });
  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 200; i++) {
    const p = rand();
    const passA = island.blocks.map((b) => isBlockVisible(b, p));
    const passB = island.blocks.map((b) => isBlockVisible(b, p));
    assert.deepEqual(passA, passB);
  }
});
