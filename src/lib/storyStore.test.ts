import test from "node:test";
import assert from "node:assert/strict";
import {
  chapterAt,
  chapterProgress,
  chapterStart,
  revealRadiusFor,
} from "./storyStore";

test("chapterAt returns expected chapters at boundary progress values", () => {
  assert.equal(chapterAt(0), "seed");
  assert.equal(chapterAt(0.1), "roots");
  assert.equal(chapterAt(0.28), "shield");
  assert.equal(chapterAt(0.46), "build");
  assert.equal(chapterAt(0.66), "neighbors");
  assert.equal(chapterAt(0.86), "bloom");
  assert.equal(chapterAt(1), "bloom");
});

test("chapterProgress is 0 at start, 1 at end, and clamped outside", () => {
  assert.equal(chapterProgress(0.05, "roots"), 0);
  assert.equal(chapterProgress(0.1, "roots"), 0);
  assert.ok(Math.abs(chapterProgress(0.19, "roots") - 0.5) < 1e-6);
  assert.equal(chapterProgress(0.28, "roots"), 1);
  assert.equal(chapterProgress(0.5, "roots"), 1);
});

test("chapterStart(roots) is 0.10", () => {
  assert.equal(chapterStart("roots"), 0.1);
});

test("revealRadiusFor matches world-space storyboard checkpoints and is monotonic", () => {
  assert.equal(revealRadiusFor(0), 0);
  assert.ok(Math.abs(revealRadiusFor(0.28) - 8) < 0.5);
  assert.ok(Math.abs(revealRadiusFor(0.46) - 16) < 0.5);
  assert.ok(Math.abs(revealRadiusFor(0.66) - 26) < 0.5);
  assert.ok(Math.abs(revealRadiusFor(1) - 60) < 0.5);

  let prev = 0;
  for (let i = 0; i <= 100; i++) {
    const r = revealRadiusFor(i / 100);
    assert.ok(r >= prev);
    prev = r;
  }
});
