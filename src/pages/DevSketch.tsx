import * as React from "react";
import {
  HAND_ICON_NAMES,
  HandIcon,
  InkArrow,
  IslandSketchSvg,
  Nodey,
  PolaroidFrame,
  RoughBox,
  RoughCircle,
  RoughUnderline,
  SeedSketchSvg,
  Sprout,
  Stamp,
  StickerButton,
  WashiTape,
} from "@/components/sketch";

export default function DevSketch() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-14">
      <header>
        <p className="font-handwriting text-lg text-blossom-600">dev preview</p>
        <h1 className="font-display-tight text-4xl text-ink">
          Sketch Kit Showcase
        </h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <RoughBox seed={11} drawIn bgClassName="bg-paper-shade" padding="p-6">
          <h2 className="font-display-tight text-2xl text-ink">
            RoughBox + <RoughUnderline>Underline</RoughUnderline> &{" "}
            <RoughCircle>Circle</RoughCircle>
          </h2>
          <p className="mt-3 text-ink-soft">
            Same seed produces deterministic sketchy double-strokes every render.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 items-center">
            <Stamp text="OUR PICK" rotation={-6} />
            <Stamp text="TODO" rotation={4} size="sm" />
            <StickerButton variant="primary">Primary sticker</StickerButton>
            <StickerButton variant="outline">Outline</StickerButton>
          </div>
        </RoughBox>

        <div className="flex flex-col items-center gap-6">
          <div className="flex items-end gap-8">
            <Nodey size={96} holdingSapling boil />
            <Sprout size={78} boil />
            <Sprout size={70} wilted boil />
          </div>
          <InkArrow from={[10, 40]} to={[160, 12]} curvature={-0.3} drawIn className="w-44 h-12" />
        </div>
      </section>

      <section>
        <h2 className="font-display-tight text-2xl text-ink mb-4">
          15 HandIcons
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-4">
          {HAND_ICON_NAMES.map((name) => (
            <div
              key={name}
              className="flex flex-col items-center gap-2 border border-dashed border-paper-line p-3 rounded-sm bg-paper"
            >
              <HandIcon name={name} size={32} drawIn />
              <span className="font-pixel text-xs text-ink-soft">{name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative pt-4">
          <div className="absolute top-0 left-8 z-10">
            <WashiTape rotation={-4} length={88} />
          </div>
          <PolaroidFrame caption="Hero Seed Sketch" rotation={-2}>
            <div className="h-full w-full flex items-center justify-center bg-paper p-2">
              <SeedSketchSvg className="w-48" />
            </div>
          </PolaroidFrame>
        </div>
        <PolaroidFrame caption="Stage 2: Shield Dome" rotation={1.5}>
          <div className="h-full w-full flex items-center justify-center bg-paper p-2">
            <IslandSketchSvg stage={2} />
          </div>
        </PolaroidFrame>
        <PolaroidFrame caption="Stage 5: Full Bloom" rotation={-2.5}>
          <div className="h-full w-full flex items-center justify-center bg-paper p-2">
            <IslandSketchSvg stage={5} />
          </div>
        </PolaroidFrame>
      </section>
    </div>
  );
}
