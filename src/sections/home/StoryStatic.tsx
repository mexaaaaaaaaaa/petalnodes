import * as React from "react";
import { Link } from "react-router-dom";
import { links, story } from "@/content";
import {
  InkArrow,
  IslandSketchSvg,
  PolaroidFrame,
  RoughUnderline,
  StickerButton,
} from "@/components/sketch";
import { ChapterCard } from "./ChapterCard";
import { useSmoothScroll } from "@/app/SmoothScroll";

function renderHeroHeading(heading: string, highlightWord?: string) {
  if (!highlightWord || !heading.includes(highlightWord)) return heading;
  const parts = heading.split(highlightWord);
  return (
    <>
      {parts[0]}
      <RoughUnderline drawIn={false}>{highlightWord}</RoughUnderline>
      {parts.slice(1).join(highlightWord)}
    </>
  );
}

const STATIC_ARROW_COORDS: {
  from: [number, number];
  to: [number, number];
  posClass: string;
}[] = [
  { from: [120, 48], to: [192, 92], posClass: "top-2 left-2" },
  { from: [110, 44], to: [176, 118], posClass: "bottom-6 left-2" },
  { from: [118, 42], to: [184, 88], posClass: "top-2 left-2" },
  { from: [110, 46], to: [195, 100], posClass: "top-2 left-2" },
  { from: [108, 44], to: [215, 110], posClass: "bottom-8 right-2" },
  { from: [105, 42], to: [176, 94], posClass: "top-2 left-2" },
];

export function StoryStatic() {
  const { scrollToTarget } = useSmoothScroll();
  const seedChapter = story.chapters[0];
  const restChapters = story.chapters.slice(1);

  return (
    <div id="story" data-story-mode="static" className="pt-28 pb-8">
      {/* Chapter 0: Hero */}
      <section
        id="chapter-seed"
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 border-b border-dashed border-paper-line"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            {seedChapter.eyebrow && (
              <p className="font-handwriting text-lg text-blossom-600 font-semibold mb-2">
                {seedChapter.eyebrow}
              </p>
            )}
            <h1 className="font-display-tight text-4xl sm:text-5xl lg:text-6xl text-ink">
              {renderHeroHeading(seedChapter.heading, seedChapter.highlightWord)}
            </h1>
            <p className="mt-5 text-lg text-ink-soft leading-relaxed max-w-xl">
              {seedChapter.body}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <StickerButton
                href={links.store}
                external
                variant="primary"
                size="lg"
              >
                {story.heroPrimaryCta}
              </StickerButton>
              <Link
                to="/plans"
                className="sticker-btn rounded-sm font-display font-bold bg-paper text-ink hover:bg-blossom-50 h-13 px-7 text-base md:text-lg"
              >
                {story.heroSecondaryCta}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md">
              <IslandSketchSvg stage={0} />
              <div className="mt-2 inline-flex items-center gap-2 font-handwriting text-base text-ink-soft">
                <InkArrow
                  from={[16, 26]}
                  to={[76, 8]}
                  curvature={-0.25}
                  seed={51}
                  className="w-16 h-8"
                />
                <span>{seedChapter.annotation}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters 1..5 stacked cleanly with cumulative SVG island illustrations */}
      {restChapters.map((chapter, idx) => {
        const stage = (idx + 1) as 1 | 2 | 3 | 4 | 5;
        const side: "left" | "right" = idx % 2 === 0 ? "left" : "right";
        const arrowSpec = STATIC_ARROW_COORDS[stage];
        const isBloom = chapter.id === "bloom";

        return (
          <section
            key={chapter.id}
            id={`chapter-${chapter.id}`}
            className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 md:py-20 border-b border-dashed border-paper-line last:border-b-0"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div
                className={
                  side === "left"
                    ? "lg:col-span-5 order-2 lg:order-1"
                    : "lg:col-span-5 order-2 lg:order-2"
                }
              >
                <ChapterCard
                  chapter={chapter}
                  side={side}
                  staticMode
                  onPickPlanClick={() => scrollToTarget("#plans-highlight", -24)}
                />
              </div>

              <div
                className={
                  side === "left"
                    ? "lg:col-span-7 order-1 lg:order-2 relative"
                    : "lg:col-span-7 order-1 lg:order-1 relative"
                }
              >
                <div className="relative mx-auto max-w-lg">
                  {isBloom ? (
                    <PolaroidFrame
                      caption={
                        chapter.polaroidCaption ?? "your world, day 1 of forever"
                      }
                      rotation={-2}
                    >
                      <div className="h-full w-full flex items-center justify-center bg-paper p-2">
                        <IslandSketchSvg stage={5} />
                      </div>
                    </PolaroidFrame>
                  ) : (
                    <IslandSketchSvg stage={stage} />
                  )}

                  {/* Static handwritten annotation */}
                  <div
                    className={`mt-2 flex items-center gap-2 font-handwriting text-base text-ink bg-paper/90 border border-dashed border-ink/35 px-2.5 py-1 rounded-sm w-fit ${arrowSpec.posClass}`}
                  >
                    <InkArrow
                      from={[0, 12]}
                      to={[38, 4]}
                      curvature={-0.2}
                      seed={70 + stage}
                      className="w-10 h-5"
                    />
                    <span>{chapter.annotation}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
