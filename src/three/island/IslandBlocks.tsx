import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { BlockType, IslandBlock } from "./islandGenerator";
import { getBlockMaterial, islandShaderUniforms } from "./textures";
import type { QualityTier } from "@/lib/quality";
import { chapterProgress, storyStore } from "@/lib/storyStore";

interface BlockGroupData {
  type: BlockType;
  blocks: IslandBlock[];
  geometry: THREE.BoxGeometry;
  material: THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[];
}

export function IslandBlocks({
  blocks,
  tier,
}: {
  blocks: IslandBlock[];
  tier: QualityTier;
}) {
  const seedGroupRef = React.useRef<THREE.Group | null>(null);
  const meshRefs = React.useRef<Record<string, THREE.InstancedMesh | null>>({});

  // Separate the single hero seed sapling + grass block when at progress ~0 so it can gently idle-rotate in the hero
  const { seedBlocks, mainGroups } = React.useMemo(() => {
    const byType = new Map<BlockType, IslandBlock[]>();
    const seeds: IslandBlock[] = [];
    for (const b of blocks) {
      if (b.chapter === "seed") {
        seeds.push(b);
        continue;
      }
      const list = byType.get(b.type);
      if (list) list.push(b);
      else byType.set(b.type, [b]);
    }

    const groups: BlockGroupData[] = [];
    for (const [type, list] of byType.entries()) {
      const geo =
        type === "moss_carpet"
          ? new THREE.BoxGeometry(0.98, 0.16, 0.98)
          : type === "flower" || type === "sapling"
            ? new THREE.BoxGeometry(0.65, 0.85, 0.65)
            : type === "paper_lantern"
              ? new THREE.BoxGeometry(0.58, 0.72, 0.58)
              : new THREE.BoxGeometry(1, 1, 1);

      const appearArr = new Float32Array(list.length);
      for (let i = 0; i < list.length; i++) {
        appearArr[i] = list[i].appearAt;
      }
      geo.setAttribute("aAppearAt", new THREE.InstancedBufferAttribute(appearArr, 1));
      const material = getBlockMaterial(type, tier, true);
      groups.push({ type, blocks: list, geometry: geo, material });
    }

    return { seedBlocks: seeds, mainGroups: groups };
  }, [blocks, tier]);

  // Populate instance matrices & subtle per-block color variation once per island build
  React.useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    const tint = new THREE.Color();
    const supportsTint = new Set<BlockType>([
      "cherry_leaves",
      "grass",
      "dirt",
      "stone",
      "deep_stone",
      "cherry_planks",
      "moss_carpet",
    ]);

    for (const group of mainGroups) {
      const mesh = meshRefs.current[group.type];
      if (!mesh) continue;
      const doTint = supportsTint.has(group.type);
      for (let i = 0; i < group.blocks.length; i++) {
        const b = group.blocks[i];
        const yOffset =
          group.type === "moss_carpet"
            ? -0.42
            : group.type === "flower" || group.type === "sapling"
              ? -0.08
              : 0;
        dummy.position.set(b.x, b.y + yOffset, b.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);

        if (doTint) {
          const h = Math.sin(b.x * 12.9898 + b.y * 78.233 + b.z * 37.719) * 43758.5453;
          const rand = h - Math.floor(h);
          if (group.type === "cherry_leaves") {
            // Subtle sakura blossom tinting: pale cream -> blush pink -> rosy petal
            const l = 0.94 + rand * 0.08;
            tint.setRGB(l, l - 0.03 * (1 - rand), l - 0.01 * (1 - rand));
          } else {
            const v = 0.93 + rand * 0.09;
            tint.setRGB(v, v, v);
          }
          mesh.setColorAt(i, tint);
        }
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (doTint && mesh.instanceColor) {
        mesh.instanceColor.needsUpdate = true;
      }
      mesh.computeBoundingSphere();
    }
  }, [mainGroups]);

  // Cleanup geometries on unmount
  React.useEffect(() => {
    return () => {
      for (const g of mainGroups) {
        g.geometry.dispose();
      }
    };
  }, [mainGroups]);

  // Update shared GPU uniforms once per frame (zero JS loops over blocks!)
  useFrame(({ clock }) => {
    const p = storyStore.progress;
    islandShaderUniforms.uProgress.value = p;
    islandShaderUniforms.uTime.value = clock.getElapsedTime();

    // Cutaway active during Roots chapter (0.10 .. 0.28), closes cleanly before Shield
    const rootsP = chapterProgress(p, "roots");
    const cutaway =
      rootsP > 0.04 && rootsP < 0.96
        ? Math.sin(Math.min(1, rootsP / 0.15) * (Math.PI / 2)) *
          (rootsP > 0.85 ? (1 - rootsP) / 0.15 : 1)
        : 0;
    islandShaderUniforms.uCutaway.value = cutaway > 0.2 ? 1.0 : 0.0;

    // Dusk progression during Neighbors chapter (0.66 .. 0.86) and Bloom
    const neighP = chapterProgress(p, "neighbors");
    islandShaderUniforms.uDusk.value = THREE.MathUtils.smoothstep(neighP, 0.05, 0.65);

    // Gentle idle rotation on the lone seed block during the Hero chapter only
    if (seedGroupRef.current) {
      const heroBlend = 1 - THREE.MathUtils.smoothstep(p, 0.02, 0.1);
      seedGroupRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() * 0.55) * 0.35 * heroBlend;
    }
  });

  // Materials for the hero seed block & sapling (plain, always visible at p=0)
  const seedGrassMat = React.useMemo(() => getBlockMaterial("grass", tier, false), [tier]);
  const seedSaplingMat = React.useMemo(() => getBlockMaterial("sapling", tier, false), [tier]);

  return (
    <group>
      {/* Hero seed blocks */}
      <group ref={seedGroupRef}>
        {seedBlocks.map((sb) => (
          <mesh
            key={`${sb.x},${sb.y},${sb.z}`}
            position={[sb.x, sb.type === "sapling" ? sb.y - 0.08 : sb.y, sb.z]}
            material={sb.type === "sapling" ? seedSaplingMat : seedGrassMat}
            castShadow={tier !== "low"}
            receiveShadow={tier !== "low"}
          >
            <boxGeometry
              args={sb.type === "sapling" ? [0.65, 0.85, 0.65] : [1, 1, 1]}
            />
          </mesh>
        ))}
      </group>

      {/* GPU-animated instanced block layers */}
      {mainGroups.map((g) => (
        <instancedMesh
          key={g.type}
          ref={(el) => {
            meshRefs.current[g.type] = el;
          }}
          args={[g.geometry, g.material, g.blocks.length]}
          castShadow={tier !== "low" && g.type !== "water"}
          receiveShadow={tier !== "low"}
          frustumCulled={false}
        />
      ))}
    </group>
  );
}
