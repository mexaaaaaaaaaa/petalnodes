import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { BLOCK_TYPES, type BlockType } from "@/three/island/islandGenerator";
import {
  getBlockMaterial,
  paintBlockBuffers,
  usesHeightMapRelief,
  type BlockFace,
  type MaterialVariant,
} from "@/three/island/textures";
import type { QualityTier } from "@/lib/quality";
import { cn } from "@/lib/utils";

type LightMode = "daylight" | "sunset" | "lantern";

const GRAIN_PRESETS = [
  { id: "subtle", label: "Subtle 0.5×", value: 0.5 },
  { id: "balanced", label: "Balanced 1.0×", value: 1.0 },
  { id: "rich", label: "Rich 1.8×", value: 1.8 },
] as const;

function SpinningBlock({
  type,
  tier,
  variant,
  grainIntensity,
  position = [0, 0, 0],
  size = 1.38,
}: {
  type: BlockType;
  tier: QualityTier;
  variant: MaterialVariant;
  grainIntensity: number;
  position?: [number, number, number];
  size?: number;
}) {
  const meshRef = React.useRef<THREE.Mesh | null>(null);
  const materials = React.useMemo(() => {
    return getBlockMaterial(type, tier, false, { variant, grainIntensity });
  }, [type, tier, variant, grainIntensity]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.65;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[0.42, 0.65, 0]}
      material={materials}
    >
      <boxGeometry args={[size, size, size]} />
    </mesh>
  );
}

function TextureSwatch({
  type,
  face,
  channel,
  label,
  grainIntensity,
}: {
  type: BlockType;
  face: BlockFace;
  channel: "albedo" | "normal" | "roughness" | "heightMap";
  label: string;
  grainIntensity: number;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufs = paintBlockBuffers(type, face, { grainIntensity });
    const data = bufs[channel];
    const img = ctx.createImageData(64, 64);
    img.data.set(data);
    ctx.putImageData(img, 0, 0);
  }, [type, face, channel, grainIntensity]);

  return (
    <div className="flex flex-col items-center gap-1">
      <canvas
        ref={canvasRef}
        width={64}
        height={64}
        style={{ imageRendering: "pixelated" }}
        className="h-10 w-10 border border-ink/40 bg-paper rounded-sm"
      />
      <span className="font-mono text-[10px] text-ink-soft">{label}</span>
    </div>
  );
}

export default function DevTextures() {
  const [lightMode, setLightMode] = React.useState<LightMode>("daylight");
  const [tier, setTier] = React.useState<QualityTier>("high");
  const [compareSideBySide, setCompareSideBySide] = React.useState(true);
  const [grainIntensity, setGrainIntensity] = React.useState<number>(1.0);

  const lightConfig = React.useMemo(() => {
    if (lightMode === "sunset") {
      return { ambient: 0.45, ambientColor: "#FFC9D6", dir: 1.9, dirColor: "#FFAA7A" };
    }
    if (lightMode === "lantern") {
      return { ambient: 0.22, ambientColor: "#75697E", dir: 0.75, dirColor: "#FFC75A" };
    }
    return { ambient: 0.68, ambientColor: "#FFF1F4", dir: 1.85, dirColor: "#FFE8C6" };
  }, [lightMode]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <header className="mb-10 flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <p className="font-handwriting text-lg text-blossom-600">dev inspector</p>
            <h1 className="font-display-tight text-4xl text-ink">
              64×64 Procedural PBR Block Materials
            </h1>
            <p className="mt-1.5 text-sm text-ink-soft max-w-2xl">
              Side-by-side comparison of original flat albedo textures versus Sobel normal-mapped
              materials with procedural height-map cavity relief on stone and cherry bark.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-ink-soft mr-1">View:</span>
              <button
                type="button"
                onClick={() => setCompareSideBySide(true)}
                aria-pressed={compareSideBySide}
                className={cn(
                  "px-2.5 py-1 rounded-sm border-2 text-xs font-bold cursor-pointer transition-colors",
                  compareSideBySide
                    ? "border-ink bg-blossom-200 text-ink shadow-[2px_2px_0_var(--color-ink)]"
                    : "border-ink/40 bg-paper text-ink-soft hover:border-ink",
                )}
              >
                Side-by-Side
              </button>
              <button
                type="button"
                onClick={() => setCompareSideBySide(false)}
                aria-pressed={!compareSideBySide}
                className={cn(
                  "px-2.5 py-1 rounded-sm border-2 text-xs font-bold cursor-pointer transition-colors",
                  !compareSideBySide
                    ? "border-ink bg-blossom-200 text-ink shadow-[2px_2px_0_var(--color-ink)]"
                    : "border-ink/40 bg-paper text-ink-soft hover:border-ink",
                )}
              >
                PBR Only
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-ink-soft mr-1">Grain:</span>
              {GRAIN_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setGrainIntensity(preset.value)}
                  aria-pressed={grainIntensity === preset.value}
                  className={cn(
                    "px-2.5 py-1 rounded-sm border-2 text-xs font-bold cursor-pointer transition-colors",
                    grainIntensity === preset.value
                      ? "border-ink bg-amber/30 text-ink shadow-[2px_2px_0_var(--color-ink)]"
                      : "border-ink/40 bg-paper text-ink-soft hover:border-ink",
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-dashed border-paper-line">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-ink-soft mr-1">Tier:</span>
            {(["high", "medium", "low"] as QualityTier[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                aria-pressed={tier === t}
                className={cn(
                  "px-2.5 py-1 rounded-sm border-2 text-xs font-bold capitalize cursor-pointer transition-colors",
                  tier === t
                    ? "border-ink bg-moss/20 text-ink shadow-[2px_2px_0_var(--color-ink)]"
                    : "border-ink/40 bg-paper text-ink-soft hover:border-ink",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-ink-soft mr-1">Light:</span>
            {(["daylight", "sunset", "lantern"] as LightMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setLightMode(mode)}
                aria-pressed={lightMode === mode}
                className={cn(
                  "px-2.5 py-1 rounded-sm border-2 text-xs font-bold capitalize cursor-pointer transition-colors",
                  lightMode === mode
                    ? "border-ink bg-blossom-200 text-ink shadow-[2px_2px_0_var(--color-ink)]"
                    : "border-ink/40 bg-paper text-ink-soft hover:border-ink",
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {BLOCK_TYPES.map((type: BlockType) => {
          const hasMultiFace = type === "grass" || type === "cherry_log";
          const hasHeightRelief = usesHeightMapRelief(type);
          return (
            <div
              key={type}
              className="border-2 border-ink bg-paper-shade rounded-sm p-3.5 shadow-[3px_3px_0_var(--color-ink)]"
            >
              <div
                className={cn(
                  "h-40 w-full border border-ink/20 rounded-sm overflow-hidden",
                  lightMode === "lantern" ? "bg-[#221A28]" : "bg-paper",
                )}
              >
                <Canvas
                  dpr={[1, 1.5]}
                  camera={{
                    position: compareSideBySide ? [0, 0.3, 4.1] : [0, 0.25, 3.1],
                    fov: compareSideBySide ? 38 : 36,
                  }}
                  gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
                >
                  <ambientLight
                    intensity={lightConfig.ambient}
                    color={lightConfig.ambientColor}
                  />
                  <directionalLight
                    position={[4, 6, 4]}
                    intensity={lightConfig.dir}
                    color={lightConfig.dirColor}
                  />
                  {compareSideBySide ? (
                    <>
                      <SpinningBlock
                        type={type}
                        tier={tier}
                        variant="flat"
                        grainIntensity={0}
                        position={[-0.98, 0, 0]}
                        size={1.22}
                      />
                      <SpinningBlock
                        type={type}
                        tier={tier}
                        variant="pbr"
                        grainIntensity={grainIntensity}
                        position={[0.98, 0, 0]}
                        size={1.22}
                      />
                    </>
                  ) : (
                    <SpinningBlock
                      type={type}
                      tier={tier}
                      variant="pbr"
                      grainIntensity={grainIntensity}
                    />
                  )}
                </Canvas>
              </div>

              {compareSideBySide && (
                <div className="mt-1.5 grid grid-cols-2 text-center font-mono text-[10px] text-ink-soft">
                  <span>Original (Flat)</span>
                  <span className="font-bold text-ink">
                    {hasHeightRelief ? "PBR (Normal + Height)" : "PBR (Normal)"}
                  </span>
                </div>
              )}

              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="font-pixel text-base text-ink">{type}</p>
                <span
                  className={cn(
                    "font-mono text-[10px] px-1.5 py-0.5 rounded-sm border",
                    hasHeightRelief
                      ? "border-ink bg-amber/25 text-ink font-bold"
                      : "border-ink/30 bg-paper text-ink-soft",
                  )}
                >
                  {hasHeightRelief ? "normal + height" : "normal + rough"}
                </span>
              </div>

              <div className="mt-3 pt-2.5 border-t border-dashed border-paper-line flex flex-wrap items-center justify-center gap-2">
                <TextureSwatch
                  type={type}
                  face="side"
                  channel="albedo"
                  label="side"
                  grainIntensity={grainIntensity}
                />
                {hasMultiFace && (
                  <TextureSwatch
                    type={type}
                    face="top"
                    channel="albedo"
                    label="top"
                    grainIntensity={grainIntensity}
                  />
                )}
                <TextureSwatch
                  type={type}
                  face="side"
                  channel="normal"
                  label="normal"
                  grainIntensity={grainIntensity}
                />
                <TextureSwatch
                  type={type}
                  face="side"
                  channel="roughness"
                  label="rough"
                  grainIntensity={grainIntensity}
                />
                {hasHeightRelief && (
                  <TextureSwatch
                    type={type}
                    face="side"
                    channel="heightMap"
                    label="height"
                    grainIntensity={grainIntensity}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
