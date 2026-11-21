import test from "node:test";
import assert from "node:assert/strict";
import { pickInitialTier, stepDownTier } from "./quality";

test("pickInitialTier returns static when WebGL unavailable or reduced motion is on", () => {
  assert.equal(
    pickInitialTier({
      webglAvailable: false,
      reducedMotion: false,
      coarsePointer: false,
      shortestScreenSide: 1080,
    }),
    "static",
  );
  assert.equal(
    pickInitialTier({
      webglAvailable: true,
      reducedMotion: true,
      coarsePointer: false,
      shortestScreenSide: 1080,
    }),
    "static",
  );
});

test("pickInitialTier picks low on phones/small tablets and medium on larger tablets", () => {
  assert.equal(
    pickInitialTier({
      webglAvailable: true,
      reducedMotion: false,
      coarsePointer: true,
      shortestScreenSide: 390,
    }),
    "low",
  );
  assert.equal(
    pickInitialTier({
      webglAvailable: true,
      reducedMotion: false,
      coarsePointer: true,
      shortestScreenSide: 820,
    }),
    "medium",
  );
});

test("pickInitialTier picks medium for low memory or weak renderer, else high on desktop", () => {
  assert.equal(
    pickInitialTier({
      webglAvailable: true,
      reducedMotion: false,
      deviceMemory: 4,
      cpuCores: 8,
      coarsePointer: false,
      shortestScreenSide: 1080,
    }),
    "medium",
  );
  assert.equal(
    pickInitialTier({
      webglAvailable: true,
      reducedMotion: false,
      deviceMemory: 16,
      cpuCores: 8,
      coarsePointer: false,
      shortestScreenSide: 1080,
      rendererString: "Google SwiftShader",
    }),
    "medium",
  );
  assert.equal(
    pickInitialTier({
      webglAvailable: true,
      reducedMotion: false,
      deviceMemory: 16,
      cpuCores: 8,
      coarsePointer: false,
      shortestScreenSide: 1080,
      rendererString: "ANGLE (Apple, Apple M2 Pro, OpenGL)",
    }),
    "high",
  );
});

test("stepDownTier goes high -> medium -> low and stops at low", () => {
  assert.equal(stepDownTier("high"), "medium");
  assert.equal(stepDownTier("medium"), "low");
  assert.equal(stepDownTier("low"), "low");
  assert.equal(stepDownTier("static"), "static");
});
