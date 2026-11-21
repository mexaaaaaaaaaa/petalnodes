import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useQualityTier } from "@/app/QualityProvider";
import { buildIsland, type IslandAnchors } from "./island/islandGenerator";
import { IslandBlocks } from "./island/IslandBlocks";
import {
  PetalsAndFireflies,
  ShieldDomeAndAttacks,
  SkyAndLights,
  VoxelMascots,
} from "./story/StorySetPieces";
import { CameraRig, type AnchorScreenCallback } from "./story/CameraRig";
import { PostFX } from "./effects/PostFX";
import { storyStore } from "@/lib/storyStore";

function RoomEnvSetup() {
  const { gl, scene } = useThree();
  React.useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.35;
    pmrem.dispose();
    return () => {
      envTex.dispose();
    };
  }, [gl, scene]);
  return null;
}

function SnapshotWatcher() {
  const { gl, scene, camera } = useThree();
  useFrame(() => {
    const p = storyStore.progress;
    if (p >= 0.94 && !storyStore.snapshotCaptured) {
      storyStore.snapshotCaptured = true;
      try {
        gl.render(scene, camera);
        const url = gl.domElement.toDataURL("image/png");
        storyStore.snapshotDataUrl = url;
        storyStore.onSnapshot?.(url);
      } catch {
        // Ignore security/context read failures gracefully
      }
    }
  });
  return null;
}

function SoftwareGlPacer({ inView }: { inView: boolean }) {
  const { invalidate, gl } = useThree();
  const { isSoftwareGl } = useQualityTier();

  React.useEffect(() => {
    if (!isSoftwareGl || !inView) return;
    let alive = true;
    let timerId = 0;

    const scheduleNext = () => {
      if (!alive) return;
      const ctx = gl.getContext() as WebGL2RenderingContext | null;
      const sync = ctx && typeof ctx.fenceSync === "function"
        ? ctx.fenceSync(ctx.SYNC_GPU_COMMANDS_COMPLETE, 0)
        : null;
      if (ctx && sync) {
        ctx.flush();
        const poll = () => {
          if (!alive) {
            ctx.deleteSync(sync);
            return;
          }
          const status = ctx.getSyncParameter(sync, ctx.SYNC_STATUS);
          if (status === ctx.UNSIGNALED) {
            timerId = window.setTimeout(poll, 10);
          } else {
            ctx.deleteSync(sync);
            timerId = window.setTimeout(() => {
              if (!alive) return;
              invalidate();
              scheduleNext();
            }, 90);
          }
        };
        timerId = window.setTimeout(poll, 10);
      } else {
        timerId = window.setTimeout(() => {
          if (!alive) return;
          invalidate();
          scheduleNext();
        }, 120);
      }
    };

    invalidate();
    scheduleNext();

    const onScroll = () => {
      invalidate();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      alive = false;
      window.clearTimeout(timerId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isSoftwareGl, inView, invalidate, gl]);

  return null;
}

export interface IslandCanvasProps {
  inView: boolean;
  onReady?: () => void;
  onProjectAnchors?: AnchorScreenCallback;
}

export default function IslandCanvas({
  inView,
  onReady,
  onProjectAnchors,
}: IslandCanvasProps) {
  const { tier, isSoftwareGl, stepDown, forceStatic } = useQualityTier();
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const island = React.useMemo(
    () => buildIsland({ sizeFactor: tier === "low" ? 0.6 : 1, seed: 42 }),
    [tier],
  );

  const dpr: [number, number] = isSoftwareGl
    ? [1, 1]
    : tier === "high"
      ? [1, 2]
      : tier === "medium"
        ? [1, 1.25]
        : [1, 1];

  return (
    <Canvas
      shadows={tier !== "low" && !isSoftwareGl}
      dpr={dpr}
      frameloop={isSoftwareGl ? "demand" : inView ? "always" : "demand"}
      camera={{ fov: isMobile ? 48 : 38, near: 0.1, far: 260, position: [3.1, 2.7, 3.6] }}
      gl={{
        antialias: !isSoftwareGl && tier === "high",
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault();
            forceStatic();
          },
          false,
        );
        onReady?.();
      }}
    >
      <PerformanceMonitor
        onDecline={() => {
          if (!isSoftwareGl) stepDown();
        }}
      />
      <AdaptiveDpr pixelated />
      <RoomEnvSetup />
      <SkyAndLights tier={tier} />
      <IslandBlocks blocks={island.blocks} tier={tier} />
      <ShieldDomeAndAttacks />
      <PetalsAndFireflies tier={tier} />
      <VoxelMascots anchors={island.anchors as IslandAnchors} />
      <CameraRig
        anchors={island.anchors}
        isMobile={isMobile}
        onProjectAnchors={onProjectAnchors}
      />
      <SnapshotWatcher />
      <SoftwareGlPacer inView={inView} />
      <PostFX />
    </Canvas>
  );
}
