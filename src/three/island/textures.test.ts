import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import {
  getBlockMaterial,
  paintBlockBuffers,
  paintBlockTexture,
  paintHeightMap,
  paintNormalMap,
  usesHeightMapRelief,
} from "./textures";
import type { BlockType } from "./islandGenerator";

const ALL_TYPES: BlockType[] = [
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
];

test("each type paints 64x64 albedo, normal, roughness, and heightMap buffers deterministically", () => {
  for (const type of ALL_TYPES) {
    const a = paintBlockBuffers(type, "side");
    const b = paintBlockBuffers(type, "side");
    assert.equal(a.albedo.length, 64 * 64 * 4);
    assert.equal(a.normal.length, 64 * 64 * 4);
    assert.equal(a.roughness.length, 64 * 64 * 4);
    assert.equal(a.heightMap.length, 64 * 64 * 4);
    assert.deepEqual(a.albedo, b.albedo);
    assert.deepEqual(a.normal, b.normal);
    assert.deepEqual(a.roughness, b.roughness);
    assert.deepEqual(a.heightMap, b.heightMap);
    assert.deepEqual(paintBlockTexture(type, "side"), a.albedo);
    assert.deepEqual(paintNormalMap(type, "side"), a.normal);
    assert.deepEqual(paintHeightMap(type, "side"), a.heightMap);
  }
});

test("cherry leaves have between 15 and 35 percent transparent pixels", () => {
  const buf = paintBlockTexture("cherry_leaves", "side");
  let transparent = 0;
  const total = 64 * 64;
  for (let i = 0; i < total; i++) {
    if (buf[i * 4 + 3] === 0) transparent++;
  }
  const pct = (transparent / total) * 100;
  assert.ok(
    pct >= 15 && pct <= 35,
    `Expected 15..35% transparent pixels, got ${pct.toFixed(1)}%`,
  );
});

test("glow ore has emissive pixels and stone has none", () => {
  const ore = paintBlockBuffers("glow_ore", "side").emissive;
  const stone = paintBlockBuffers("stone", "side").emissive;

  let oreEmissiveCount = 0;
  let stoneEmissiveCount = 0;
  for (let i = 0; i < 64 * 64; i++) {
    const p = i * 4;
    if (ore[p] + ore[p + 1] + ore[p + 2] > 0) oreEmissiveCount++;
    if (stone[p] + stone[p + 1] + stone[p + 2] > 0) stoneEmissiveCount++;
  }
  assert.ok(oreEmissiveCount > 50);
  assert.equal(stoneEmissiveCount, 0);
});

test("grass side top rows are greener than its bottom rows", () => {
  const buf = paintBlockTexture("grass", "side");
  let topGreenness = 0;
  let bottomGreenness = 0;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 64; x++) {
      const p = (y * 64 + x) * 4;
      topGreenness += buf[p + 1] - buf[p];
    }
  }
  for (let y = 56; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      const p = (y * 64 + x) * 4;
      bottomGreenness += buf[p + 1] - buf[p];
    }
  }
  assert.ok(topGreenness > bottomGreenness);
});

test("normal maps point outward in tangent space (+Z > 128) and have surface relief variation", () => {
  const stoneNormals = paintNormalMap("stone", "side");
  let zSum = 0;
  let xMin = 255;
  let xMax = 0;
  for (let i = 0; i < 64 * 64; i++) {
    const p = i * 4;
    if (stoneNormals[p] < xMin) xMin = stoneNormals[p];
    if (stoneNormals[p] > xMax) xMax = stoneNormals[p];
    zSum += stoneNormals[p + 2];
  }
  const avgZ = zSum / (64 * 64);
  assert.ok(avgZ > 160, `Expected outward tangent normal avgZ > 160, got ${avgZ}`);
  assert.ok(xMax - xMin > 40, "Expected meaningful Sobel normal relief across stone");

  // With flipY=true, row y=0 is top edge (+v). At plank bevel row y=1 (height drops from row 1 to row 0),
  // top bevel normal must point upward (+v, G > 128).
  const plankNormals = paintNormalMap("cherry_planks", "side");
  const topBevelGreen = plankNormals[(1 * 64 + 10) * 4 + 1];
  assert.ok(
    topBevelGreen > 128,
    `Expected plank top bevel normal Y > 128 (+v upward), got ${topBevelGreen}`,
  );
});

test("height map relief is enabled for stone, deep_stone, and cherry_log", () => {
  assert.equal(usesHeightMapRelief("stone"), true);
  assert.equal(usesHeightMapRelief("deep_stone"), true);
  assert.equal(usesHeightMapRelief("cherry_log"), true);
  assert.equal(usesHeightMapRelief("water"), false);
  assert.equal(usesHeightMapRelief("flower"), false);

  const barkHeight = paintHeightMap("cherry_log", "side");
  let minH = 255;
  let maxH = 0;
  for (let i = 0; i < 64 * 64; i++) {
    const v = barkHeight[i * 4];
    if (v < minH) minH = v;
    if (v > maxH) maxH = v;
  }
  assert.ok(maxH - minH > 120, `Expected wide bark height contrast, got ${maxH - minH}`);
});

test("flat vs pbr material variants wire normal, roughness, and height aoMaps properly", () => {
  const flatStone = getBlockMaterial("stone", "high", false, {
    variant: "flat",
  }) as THREE.MeshStandardMaterial;
  assert.equal(flatStone.normalMap, null);
  assert.equal(flatStone.roughnessMap, null);
  assert.equal(flatStone.aoMap, null);

  const pbrStone = getBlockMaterial("stone", "high", false, {
    variant: "pbr",
    grainIntensity: 1.0,
  }) as THREE.MeshStandardMaterial;
  assert.ok(pbrStone.normalMap instanceof THREE.DataTexture);
  assert.ok(pbrStone.roughnessMap instanceof THREE.DataTexture);
  assert.ok(pbrStone.aoMap instanceof THREE.DataTexture);
  assert.equal(pbrStone.aoMap.channel, 0);

  const pbrLogFaces = getBlockMaterial("cherry_log", "high", false, {
    variant: "pbr",
    grainIntensity: 1.0,
  }) as THREE.MeshStandardMaterial[];
  assert.equal(pbrLogFaces.length, 6);
  for (const faceMat of pbrLogFaces) {
    assert.ok(faceMat.normalMap instanceof THREE.DataTexture);
    assert.ok(faceMat.aoMap instanceof THREE.DataTexture);
    assert.equal(faceMat.aoMap.channel, 0);
  }

  const pbrWater = getBlockMaterial("water", "high", false, {
    variant: "pbr",
    grainIntensity: 1.0,
  }) as THREE.MeshStandardMaterial;
  assert.ok(pbrWater.normalMap instanceof THREE.DataTexture);
  assert.equal(pbrWater.aoMap, null);
});

test("increasing grainIntensity increases surface relief variance", () => {
  const subtle = paintBlockBuffers("stone", "side", { grainIntensity: 0.4 });
  const rich = paintBlockBuffers("stone", "side", { grainIntensity: 1.8 });

  const normalSpread = (buf: Uint8Array) => {
    let sum = 0;
    for (let i = 0; i < 64 * 64; i++) {
      const p = i * 4;
      sum += Math.abs(buf[p] - 128) + Math.abs(buf[p + 1] - 128);
    }
    return sum / (64 * 64);
  };

  assert.ok(
    normalSpread(rich.normal) > normalSpread(subtle.normal),
    "Expected richer grain intensity to increase normal map relief amplitude",
  );
});
