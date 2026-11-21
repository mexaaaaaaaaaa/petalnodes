import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { IslandAnchors } from "@/three/island/islandGenerator";
import { chapterProgress, storyStore } from "@/lib/storyStore";
import type { QualityTier } from "@/lib/quality";

const _dummy = new THREE.Object3D();
const _c1 = new THREE.Color();
const _c2 = new THREE.Color();

const SKY_DAY_TOP = new THREE.Color("#CFE6FF");
const SKY_DAY_HORIZON = new THREE.Color("#FFE9DE");
const SKY_DUSK_TOP = new THREE.Color("#2E2440");
const SKY_DUSK_HORIZON = new THREE.Color("#F7A38B");

/**
 * Sky gradient dome + lighting rig that smoothly shifts from warm day to golden dusk.
 */
export function SkyAndLights({ tier }: { tier: QualityTier }) {
  const skyMatRef = React.useRef<THREE.ShaderMaterial | null>(null);
  const sunRef = React.useRef<THREE.DirectionalLight | null>(null);
  const hemiRef = React.useRef<THREE.HemisphereLight | null>(null);

  const skyUniforms = React.useMemo(
    () => ({
      uTopColor: { value: SKY_DAY_TOP.clone() },
      uHorizonColor: { value: SKY_DAY_HORIZON.clone() },
    }),
    [],
  );

  useFrame(({ scene }) => {
    const p = storyStore.progress;
    const dusk = THREE.MathUtils.smoothstep(chapterProgress(p, "neighbors"), 0.05, 0.7);

    _c1.copy(SKY_DAY_TOP).lerp(SKY_DUSK_TOP, dusk);
    _c2.copy(SKY_DAY_HORIZON).lerp(SKY_DUSK_HORIZON, dusk);
    skyUniforms.uTopColor.value.copy(_c1);
    skyUniforms.uHorizonColor.value.copy(_c2);

    if (scene.fog && scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(_c2);
    }

    if (sunRef.current) {
      sunRef.current.position.set(
        22,
        THREE.MathUtils.lerp(20, 9, dusk),
        THREE.MathUtils.lerp(16, -12, dusk),
      );
      sunRef.current.color.set("#FFE2C4").lerp(new THREE.Color("#FFAA75"), dusk);
      sunRef.current.intensity = THREE.MathUtils.lerp(2.2, 1.35, dusk);
    }

    if (hemiRef.current) {
      hemiRef.current.color.copy(_c1);
      hemiRef.current.intensity = THREE.MathUtils.lerp(0.68, 0.42, dusk);
    }
  });

  const shadowRes = tier === "high" ? 2048 : 1024;

  return (
    <>
      <fogExp2 attach="fog" args={["#FFE9DE", 0.011]} />
      <hemisphereLight
        ref={hemiRef}
        args={["#CFE6FF", "#C9B79C", 0.65]}
      />
      <directionalLight
        ref={sunRef}
        position={[22, 20, 16]}
        intensity={2.2}
        color="#FFE2C4"
        castShadow={tier !== "low"}
        shadow-mapSize={[shadowRes, shadowRes]}
        shadow-camera-near={5}
        shadow-camera-far={75}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />

      {/* Gradient Sky Dome */}
      <mesh scale={140}>
        <sphereGeometry args={[1, 24, 16]} />
        <shaderMaterial
          ref={skyMatRef}
          side={THREE.BackSide}
          depthWrite={false}
          uniforms={skyUniforms}
          vertexShader={`
            varying vec3 vWorldPos;
            void main() {
              vec4 wp = modelMatrix * vec4(position, 1.0);
              vWorldPos = wp.xyz;
              gl_Position = projectionMatrix * viewMatrix * wp;
            }
          `}
          fragmentShader={`
            uniform vec3 uTopColor;
            uniform vec3 uHorizonColor;
            varying vec3 vWorldPos;
            void main() {
              float h = normalize(vWorldPos).y;
              float t = smoothstep(-0.1, 0.55, h);
              gl_FragColor = vec4(mix(uHorizonColor, uTopColor, t), 1.0);
            }
          `}
        />
      </mesh>
    </>
  );
}

/**
 * Chapter 2 (Shield) + Chapter 3 (Build) fade: translucent hexagon-patterned petal dome
 * that grows bottom-up, blooms at its rim, and bounces red attack particles off.
 */
export function ShieldDomeAndAttacks({
  domeRadius = 16.5,
}: {
  domeRadius?: number;
}) {
  const domeRef = React.useRef<THREE.Mesh | null>(null);
  const attackMeshRef = React.useRef<THREE.InstancedMesh | null>(null);
  const sparkMeshRef = React.useRef<THREE.InstancedMesh | null>(null);

  const domeUniforms = React.useMemo(
    () => ({
      uReveal: { value: 0 },
      uFade: { value: 1 },
      uShimmer: { value: 0 },
      uTime: { value: 0 },
    }),
    [],
  );

  // Deterministic attack particle trajectories
  const attacks = React.useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * Math.PI * 2 + (i % 3) * 0.25;
      const elev = 0.22 + ((i * 7) % 10) * 0.055;
      const dir = new THREE.Vector3(
        Math.cos(angle) * Math.cos(elev),
        Math.sin(elev),
        Math.sin(angle) * Math.cos(elev),
      ).normalize();
      return {
        dir,
        phaseOffset: (i * 0.13) % 1,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    const p = storyStore.progress;
    const shieldP = chapterProgress(p, "shield");
    const buildP = chapterProgress(p, "build");
    const t = clock.getElapsedTime();

    // Dome grows bottom-up during Shield and fades with a shimmer in Build
    const reveal = THREE.MathUtils.smoothstep(shieldP, 0.05, 0.65);
    const fade = 1 - THREE.MathUtils.smoothstep(buildP, 0.25, 0.78);
    const shimmer = buildP > 0.1 && buildP < 0.85 ? buildP : 0;

    domeUniforms.uReveal.value = reveal;
    domeUniforms.uFade.value = fade;
    domeUniforms.uShimmer.value = shimmer;
    domeUniforms.uTime.value = t;

    const active = reveal > 0.02 && fade > 0.02;
    if (domeRef.current) {
      domeRef.current.visible = active;
    }

    // Attack cubes fly in and bounce off the dome during Shield
    if (attackMeshRef.current && sparkMeshRef.current) {
      const showAttacks = shieldP > 0.18 && shieldP < 0.98 && fade > 0.2;
      attackMeshRef.current.visible = showAttacks;
      sparkMeshRef.current.visible = showAttacks;

      if (showAttacks) {
        for (let i = 0; i < attacks.length; i++) {
          const a = attacks[i];
          const cycle = (t * 0.62 + a.phaseOffset) % 1;
          let r = domeRadius;
          let scale = 0.42;
          let sparkScale = 0;

          if (cycle < 0.48) {
            // Flying inward
            const k = cycle / 0.48;
            r = THREE.MathUtils.lerp(domeRadius + 14, domeRadius + 0.3, k);
          } else {
            // Boing! Bouncing outward and fading
            const k = (cycle - 0.48) / 0.52;
            r = domeRadius + 0.3 + Math.sin(k * Math.PI * 0.5) * 6.5;
            scale = 0.42 * (1 - k);
            sparkScale = Math.sin(Math.min(1, k * 2.5) * Math.PI) * 0.75;
          }

          _dummy.position.copy(a.dir).multiplyScalar(r);
          _dummy.position.y += 1.0;
          _dummy.rotation.set(t * 2 + i, t * 1.5, 0);
          _dummy.scale.setScalar(Math.max(0.001, scale));
          _dummy.updateMatrix();
          attackMeshRef.current.setMatrixAt(i, _dummy.matrix);

          // Impact spark on dome surface
          _dummy.position.copy(a.dir).multiplyScalar(domeRadius + 0.15);
          _dummy.position.y += 1.0;
          _dummy.scale.setScalar(Math.max(0.001, sparkScale));
          _dummy.updateMatrix();
          sparkMeshRef.current.setMatrixAt(i, _dummy.matrix);
        }
        attackMeshRef.current.instanceMatrix.needsUpdate = true;
        sparkMeshRef.current.instanceMatrix.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      <mesh ref={domeRef} position={[0, 0.5, 0]}>
        <icosahedronGeometry args={[domeRadius, 2]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          uniforms={domeUniforms}
          vertexShader={`
            varying vec3 vNormalDir;
            varying vec3 vViewDir;
            varying vec3 vLocalPos;
            void main() {
              vLocalPos = position;
              vec4 wp = modelMatrix * vec4(position, 1.0);
              vNormalDir = normalize(mat3(modelMatrix) * normal);
              vViewDir = normalize(cameraPosition - wp.xyz);
              gl_Position = projectionMatrix * viewMatrix * wp;
            }
          `}
          fragmentShader={`
            uniform float uReveal;
            uniform float uFade;
            uniform float uShimmer;
            uniform float uTime;
            varying vec3 vNormalDir;
            varying vec3 vViewDir;
            varying vec3 vLocalPos;
            void main() {
              // Hemisphere from base (-2) to top (+domeRadius)
              float hNorm = clamp((vLocalPos.y + 3.0) / 19.0, 0.0, 1.0);
              if (vLocalPos.y < -3.0) discard;
              float growMask = 1.0 - smoothstep(uReveal - 0.14, uReveal + 0.02, hNorm);
              if (growMask <= 0.01) discard;

              float fresnel = pow(1.0 - abs(dot(vNormalDir, vViewDir)), 2.2);
              // Subtle petal-hex cell shimmer
              float cell = sin(vLocalPos.x * 2.2) * cos(vLocalPos.y * 2.2) * sin(vLocalPos.z * 2.2);
              float shimmerBand = exp(-pow((hNorm - uShimmer) * 7.0, 2.0)) * step(0.01, uShimmer);

              vec3 basePink = vec3(1.0, 0.788, 0.839); // #FFC9D6
              vec3 rimPink  = vec3(1.45, 0.62, 0.85);  // Emissive bloom rim
              vec3 col = mix(basePink, rimPink, clamp(fresnel + shimmerBand * 0.9, 0.0, 1.0));
              float alpha = (0.14 + fresnel * 0.52 + abs(cell) * 0.08 + shimmerBand * 0.45) * growMask * uFade;
              gl_FragColor = vec4(col, alpha);
            }
          `}
        />
      </mesh>

      {/* Red attack particles */}
      <instancedMesh ref={attackMeshRef} args={[undefined, undefined, attacks.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#D94A3A" emissive="#D94A3A" emissiveIntensity={1.4} roughness={0.4} />
      </instancedMesh>

      {/* Bounce sparks */}
      <instancedMesh ref={sparkMeshRef} args={[undefined, undefined, attacks.length]}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshBasicMaterial color="#FFC75A" transparent opacity={0.9} />
      </instancedMesh>
    </group>
  );
}

/**
 * Falling cherry petals (instanced curved quads in 3 pinks) + Neighbors fireflies.
 */
export function PetalsAndFireflies({ tier }: { tier: QualityTier }) {
  const petalCount = tier === "high" ? 600 : tier === "medium" ? 250 : 80;
  const fireflyCount = tier === "low" ? 18 : 36;
  const petalRef = React.useRef<THREE.InstancedMesh | null>(null);
  const fireflyRef = React.useRef<THREE.InstancedMesh | null>(null);

  const petalSeeds = React.useMemo(() => {
    return Array.from({ length: petalCount }, (_, i) => ({
      x: ((Math.sin(i * 12.9898) * 43758.5453) % 1) * 28,
      y: Math.abs((Math.sin(i * 78.233) * 19341.123) % 1) * 18 - 2,
      z: ((Math.sin(i * 45.164) * 29311.71) % 1) * 28,
      speed: 0.7 + (i % 7) * 0.15,
      sway: 0.6 + (i % 5) * 0.25,
      phase: i * 0.73,
      pinkVariant: i % 3,
    }));
  }, [petalCount]);

  React.useLayoutEffect(() => {
    if (!petalRef.current) return;
    const colors = [
      new THREE.Color("#FFC9D6"),
      new THREE.Color("#FF8FAB"),
      new THREE.Color("#FFF1F4"),
    ];
    for (let i = 0; i < petalSeeds.length; i++) {
      petalRef.current.setColorAt(i, colors[petalSeeds[i].pinkVariant]);
    }
    if (petalRef.current.instanceColor) {
      petalRef.current.instanceColor.needsUpdate = true;
    }
  }, [petalSeeds]);

  useFrame(({ clock }) => {
    const p = storyStore.progress;
    const t = clock.getElapsedTime();
    // Few petals in hero, ramp up in Build/Bloom
    const activeRatio =
      p < 0.1 ? 0.12 : p < 0.5 ? 0.35 : p < 0.86 ? 0.65 : 1.0;
    const activeCount = Math.max(12, Math.floor(petalCount * activeRatio));

    if (petalRef.current) {
      for (let i = 0; i < petalCount; i++) {
        if (i >= activeCount) {
          _dummy.scale.setScalar(0);
          _dummy.updateMatrix();
          petalRef.current.setMatrixAt(i, _dummy.matrix);
          continue;
        }
        const s = petalSeeds[i];
        const yRange = 18;
        const y = (((s.y - t * s.speed) % yRange) + yRange) % yRange - 3;
        const x = s.x + Math.sin(t * s.sway + s.phase) * 1.4;
        const z = s.z + Math.cos(t * s.sway * 0.8 + s.phase) * 1.2;
        _dummy.position.set(x, y, z);
        _dummy.rotation.set(t * 1.2 + s.phase, t * 0.9, Math.sin(t + s.phase) * 0.6);
        _dummy.scale.set(0.18, 0.12, 0.04);
        _dummy.updateMatrix();
        petalRef.current.setMatrixAt(i, _dummy.matrix);
      }
      petalRef.current.instanceMatrix.needsUpdate = true;
    }

    if (fireflyRef.current) {
      const neighP = chapterProgress(p, "neighbors");
      const ffReveal = THREE.MathUtils.smoothstep(neighP, 0.15, 0.55);
      fireflyRef.current.visible = ffReveal > 0.02;
      if (ffReveal > 0.02) {
        for (let i = 0; i < fireflyCount; i++) {
          const angle = i * 0.9 + t * 0.25;
          const r = 4 + (i % 9) * 1.25;
          const x = Math.cos(angle) * r;
          const z = Math.sin(angle) * r;
          const y = 1.5 + Math.sin(t * 1.8 + i * 1.3) * 1.4 + (i % 3) * 0.8;
          const pulse = (0.5 + 0.5 * Math.sin(t * 3.4 + i * 2.1)) * ffReveal;
          _dummy.position.set(x, y, z);
          _dummy.rotation.set(0, 0, 0);
          _dummy.scale.setScalar(0.11 * pulse);
          _dummy.updateMatrix();
          fireflyRef.current.setMatrixAt(i, _dummy.matrix);
        }
        fireflyRef.current.instanceMatrix.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      <instancedMesh ref={petalRef} args={[undefined, undefined, petalCount]} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          side={THREE.DoubleSide}
          roughness={0.5}
          emissive="#FF8FAB"
          emissiveIntensity={0.18}
        />
      </instancedMesh>

      <instancedMesh ref={fireflyRef} args={[undefined, undefined, fireflyCount]} frustumCulled={false}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#FFC75A" />
      </instancedMesh>
    </group>
  );
}

/**
 * Chapter 4 (Neighbors): Simple voxel Nodey & Sprout mascots waving on the house porch.
 */
export function VoxelMascots({ anchors }: { anchors: IslandAnchors }) {
  const groupRef = React.useRef<THREE.Group | null>(null);
  const nodeyArmRef = React.useRef<THREE.Mesh | null>(null);
  const sproutRef = React.useRef<THREE.Group | null>(null);

  useFrame(({ clock }) => {
    const p = storyStore.progress;
    const neighP = chapterProgress(p, "neighbors");
    const scale = THREE.MathUtils.smoothstep(neighP, 0.1, 0.32);

    if (groupRef.current) {
      groupRef.current.visible = scale > 0.01;
      groupRef.current.scale.setScalar(Math.max(0.001, scale));
    }
    const t = clock.getElapsedTime();
    if (nodeyArmRef.current) {
      nodeyArmRef.current.rotation.z = 0.6 + Math.sin(t * 6.0) * 0.45;
    }
    if (sproutRef.current) {
      sproutRef.current.rotation.z = Math.sin(t * 3.5) * 0.12;
      sproutRef.current.position.y = Math.abs(Math.sin(t * 4.0)) * 0.1;
    }
  });

  const pos = anchors.mascots;

  return (
    <group ref={groupRef} position={[pos.x, pos.y - 0.6, pos.z]}>
      {/* Voxel Nodey */}
      <group position={[-0.45, 0, 0]}>
        {/* Legs */}
        <mesh position={[-0.18, 0.15, 0]}>
          <boxGeometry args={[0.2, 0.3, 0.2]} />
          <meshStandardMaterial color="#FBF6EE" roughness={0.8} />
        </mesh>
        <mesh position={[0.18, 0.15, 0]}>
          <boxGeometry args={[0.2, 0.3, 0.2]} />
          <meshStandardMaterial color="#FBF6EE" roughness={0.8} />
        </mesh>
        {/* Cube body */}
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[0.78, 0.72, 0.72]} />
          <meshStandardMaterial color="#FBF6EE" roughness={0.7} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.16, 0.72, -0.37]}>
          <boxGeometry args={[0.1, 0.12, 0.04]} />
          <meshBasicMaterial color="#2B2230" />
        </mesh>
        <mesh position={[0.16, 0.72, -0.37]}>
          <boxGeometry args={[0.1, 0.12, 0.04]} />
          <meshBasicMaterial color="#2B2230" />
        </mesh>
        {/* Waving arm */}
        <mesh ref={nodeyArmRef} position={[0.48, 0.72, 0]}>
          <boxGeometry args={[0.22, 0.42, 0.2]} />
          <meshStandardMaterial color="#F1E7D6" roughness={0.7} />
        </mesh>
        {/* Blossom on top */}
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[0.36, 0.18, 0.36]} />
          <meshStandardMaterial color="#FF8FAB" emissive="#FF8FAB" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Voxel Sprout */}
      <group ref={sproutRef} position={[0.6, 0, 0.15]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.18, 0.5, 0.18]} />
          <meshStandardMaterial color="#6B4A3A" roughness={0.85} />
        </mesh>
        <mesh position={[-0.25, 0.35, 0]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.38, 0.14, 0.22]} />
          <meshStandardMaterial color="#6FAF5B" roughness={0.75} />
        </mesh>
        <mesh position={[0.25, 0.42, 0]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.38, 0.14, 0.22]} />
          <meshStandardMaterial color="#6FAF5B" roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.68, 0]}>
          <boxGeometry args={[0.48, 0.44, 0.44]} />
          <meshStandardMaterial color="#FBF6EE" roughness={0.7} />
        </mesh>
        <mesh position={[-0.1, 0.72, -0.23]}>
          <boxGeometry args={[0.08, 0.08, 0.04]} />
          <meshBasicMaterial color="#2B2230" />
        </mesh>
        <mesh position={[0.1, 0.72, -0.23]}>
          <boxGeometry args={[0.08, 0.08, 0.04]} />
          <meshBasicMaterial color="#2B2230" />
        </mesh>
      </group>
    </group>
  );
}
