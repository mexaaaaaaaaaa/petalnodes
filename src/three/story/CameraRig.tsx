import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import type { IslandAnchors } from "@/three/island/islandGenerator";
import { storyStore } from "@/lib/storyStore";

interface CameraKeyframe {
  p: number;
  pos: THREE.Vector3;
  look: THREE.Vector3;
}

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();
const _proj = new THREE.Vector3();

export type AnchorScreenCallback = (
  projected: Record<keyof IslandAnchors, { x: number; y: number; visible: boolean }>,
) => void;

export function CameraRig({
  anchors,
  isMobile,
  onProjectAnchors,
}: {
  anchors: IslandAnchors;
  isMobile: boolean;
  onProjectAnchors?: AnchorScreenCallback;
}) {
  const { camera, size } = useThree();

  const keyframes = React.useMemo<CameraKeyframe[]>(() => {
    const xOffset = isMobile ? 0 : -1.35; // Desktop: seed sits right of center, text on left
    const yMobile = isMobile ? -0.35 : 0.1;

    return [
      // 0: Seed (Hero) — close three-quarter view
      {
        p: 0.0,
        pos: new THREE.Vector3(3.1 + xOffset, 2.7 + yMobile, 3.6),
        look: new THREE.Vector3(xOffset * 0.85, 0.55 + yMobile * 0.4, 0),
      },
      {
        p: 0.1,
        pos: new THREE.Vector3(4.5 + xOffset, 2.3, 4.8),
        look: new THREE.Vector3(xOffset * 0.6, 0.2, 0),
      },
      // 1: Roots — lowers and pulls back to underground side view
      {
        p: 0.2,
        pos: new THREE.Vector3(4.2, -3.6, 20.5),
        look: new THREE.Vector3(0.5, -3.5, 0),
      },
      // 2: Shield — rises to eye level wider so whole dome is visible
      {
        p: 0.37,
        pos: new THREE.Vector3(18.0, 9.2, 26.5),
        look: new THREE.Vector3(0, 2.8, 0),
      },
      // 3: Build — high three-quarter aerial view
      {
        p: 0.56,
        pos: new THREE.Vector3(-16.5, 19.5, 22.0),
        look: new THREE.Vector3(0, 1.5, 0),
      },
      // 4: Neighbors — lower and closer to the house & mascots
      {
        p: 0.76,
        pos: new THREE.Vector3(anchors.house.x + 7.5, anchors.house.y + 1.8, anchors.house.z - 12.5),
        look: new THREE.Vector3(anchors.mascots.x - 1.0, anchors.mascots.y + 0.2, anchors.mascots.z + 1.5),
      },
      // 5: Bloom — pull far back and orbit ~30deg
      {
        p: 1.0,
        pos: new THREE.Vector3(24.0, 16.5, 28.0),
        look: new THREE.Vector3(0, 0.2, 0),
      },
    ];
  }, [anchors, isMobile]);

  const anchorVecs = React.useMemo(
    () => ({
      seed: new THREE.Vector3(anchors.seed.x, anchors.seed.y, anchors.seed.z),
      ore: new THREE.Vector3(anchors.ore.x, anchors.ore.y, anchors.ore.z),
      domeRim: new THREE.Vector3(anchors.domeRim.x, anchors.domeRim.y, anchors.domeRim.z),
      house: new THREE.Vector3(anchors.house.x, anchors.house.y, anchors.house.z),
      mascots: new THREE.Vector3(anchors.mascots.x, anchors.mascots.y, anchors.mascots.z),
    }),
    [anchors],
  );

  useFrame(({ clock }) => {
    const p = storyStore.progress;
    const t = clock.getElapsedTime();

    let k0 = keyframes[0];
    let k1 = keyframes[keyframes.length - 1];
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (p >= keyframes[i].p && p <= keyframes[i + 1].p) {
        k0 = keyframes[i];
        k1 = keyframes[i + 1];
        break;
      }
    }

    const span = Math.max(1e-5, k1.p - k0.p);
    const localT = THREE.MathUtils.smoothstep((p - k0.p) / span, 0, 1);

    _pos.copy(k0.pos).lerp(k1.pos, localT);
    _look.copy(k0.look).lerp(k1.look, localT);

    // Subtle slow orbit in Neighbors and Bloom
    if (p > 0.65) {
      const orbitAmp = THREE.MathUtils.smoothstep(p, 0.66, 0.9) * 1.4;
      _pos.x += Math.sin(t * 0.3) * orbitAmp;
      _pos.z += Math.cos(t * 0.3) * orbitAmp * 0.5;
    }

    camera.position.copy(_pos);
    camera.lookAt(_look);
    camera.updateMatrixWorld();

    if (onProjectAnchors) {
      const projected = {} as Record<
        keyof IslandAnchors,
        { x: number; y: number; visible: boolean }
      >;
      (Object.keys(anchorVecs) as (keyof IslandAnchors)[]).forEach((key) => {
        _proj.copy(anchorVecs[key]).project(camera);
        projected[key] = {
          x: ((_proj.x + 1) * 0.5) * size.width,
          y: ((1 - _proj.y) * 0.5) * size.height,
          visible: _proj.z < 1 && _proj.z > -1,
        };
      });
      onProjectAnchors(projected);
    }
  });

  return null;
}
