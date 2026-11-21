import test from "node:test";
import assert from "node:assert/strict";
import { generateRoughRectPaths } from "./roughPaths";

test("roughjs rect produces identical path data for the same seed", () => {
  const a = generateRoughRectPaths({ x: 2, y: 2, width: 200, height: 100, seed: 77 });
  const b = generateRoughRectPaths({ x: 2, y: 2, width: 200, height: 100, seed: 77 });
  assert.deepEqual(a, b);
  assert.ok(a.length > 0);
});

test("roughjs rect produces different path data for different seeds", () => {
  const a = generateRoughRectPaths({ x: 2, y: 2, width: 200, height: 100, seed: 77 });
  const b = generateRoughRectPaths({ x: 2, y: 2, width: 200, height: 100, seed: 78 });
  assert.notDeepEqual(a, b);
});
