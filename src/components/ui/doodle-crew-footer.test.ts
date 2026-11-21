import test from "node:test";
import assert from "node:assert/strict";
import { layoutWord, lookAt, seatPoint, timeline } from "./doodle-crew-footer";

test("layoutWord treats a negative or non-finite advance as zero", () => {
  const res = layoutWord([100, -50, Number.NaN, 80], 0.1, 200);
  assert.deepEqual(res.w, [100, 0, 0, 80]);
  assert.equal(res.width, 100 + 20 + 0 + 20 + 0 + 20 + 80);
});

test("seatPoint top returns y equal to minus cap", () => {
  const pt = seatPoint("top", 50, 100, 146, 0, 1);
  assert.equal(pt.x, 100);
  assert.equal(pt.y, -146);
});

test("lookAt never exceeds max", () => {
  const o = lookAt(0, 0, 10000, 10000, 3.6, 220);
  assert.ok(Math.hypot(o.x, o.y) <= 3.6 + 1e-6);
});

test("timeline total is at least the last letter time plus 560", () => {
  const tl = timeline(9, 6, 6, 2);
  assert.ok(tl.total >= tl.letter(8) + 560);
});
