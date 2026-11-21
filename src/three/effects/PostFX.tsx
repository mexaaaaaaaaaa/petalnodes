import * as React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  N8AO,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { useQualityTier } from "@/app/QualityProvider";
import { chapterProgress, revealRadiusFor, storyStore } from "@/lib/storyStore";
import { SketchEffectImpl } from "./SketchEffect";

const SEED_CENTER = new THREE.Vector3(0, 0.5, 0);

export function PostFX() {
  const { tier, isSoftwareGl } = useQualityTier();
  const { camera } = useThree();

  const sketchEffect = React.useMemo(() => new SketchEffectImpl(), []);

  React.useEffect(() => {
    sketchEffect.setCamera(camera);
  }, [sketchEffect, camera]);

  useFrame(() => {
    const p = storyStore.progress;
    const radius = revealRadiusFor(p);
    const bloomP = chapterProgress(p, "bloom");
    // Sky reveals smoothly during the Bloom chapter
    const skyReveal = THREE.MathUtils.smoothstep(bloomP, 0.05, 0.55);
    sketchEffect.setReveal(radius, skyReveal, SEED_CENTER, 1.0);
  });

  const useHeavyPasses = tier === "high" && !isSoftwareGl;
  const useBloom = tier !== "low" && !isSoftwareGl;

  if (useHeavyPasses) {
    return (
      <EffectComposer multisampling={0}>
        <N8AO aoRadius={1.4} intensity={1.6} distanceFalloff={0.8} quality="medium" />
        <Bloom
          mipmapBlur
          luminanceThreshold={0.95}
          intensity={0.55}
          radius={0.55}
        />
        <DepthOfField focusDistance={0.02} focalLength={0.04} bokehScale={1.6} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette offset={0.35} darkness={0.28} />
        <primitive object={sketchEffect} />
      </EffectComposer>
    );
  }

  if (useBloom) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          luminanceThreshold={0.95}
          intensity={0.48}
          radius={0.5}
        />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette offset={0.35} darkness={0.22} />
        <primitive object={sketchEffect} />
      </EffectComposer>
    );
  }

  // Low tier or software WebGL: ToneMapping + SketchEffect only
  return (
    <EffectComposer multisampling={0}>
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <primitive object={sketchEffect} />
    </EffectComposer>
  );
}
