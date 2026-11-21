import * as React from "react";
import { isTodo, type StoryChapterContent } from "@/content";
import {
  RoughBox,
  Stamp,
  StickerButton,
  WashiTape,
} from "@/components/sketch";
import { PanelSketch } from "./PanelSketch";
import { cn } from "@/lib/utils";

const CHAPTER_SEEDS: Record<string, number> = {
  roots: 201,
  shield: 202,
  build: 203,
  neighbors: 204,
  bloom: 205,
};

export interface ChapterCardProps {
  chapter: StoryChapterContent;
  side: "left" | "right";
  onPickPlanClick?: () => void;
  staticMode?: boolean;
  className?: string;
}

export function ChapterCard({
  chapter,
  side,
  onPickPlanClick,
  staticMode = false,
  className,
}: ChapterCardProps) {
  return (
    <div
      data-chapter-card={chapter.id}
      className={cn(
        "relative w-full max-w-[420px]",
        side === "right" ? "md:ml-auto" : "md:mr-auto",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -top-3 z-20",
          side === "left" ? "left-6" : "right-6",
        )}
      >
        <WashiTape
          rotation={side === "left" ? -5 : 5}
          length={84}
          color={chapter.id === "bloom" ? "#FF8FAB" : "#FFC9D6"}
        />
      </div>

      <RoughBox
        seed={CHAPTER_SEEDS[chapter.id] ?? 210}
        bgClassName="bg-paper-shade"
        padding="p-5 sm:p-6 pt-6"
        className="shadow-[5px_6px_0_var(--color-ink)]"
      >
        {chapter.kicker && (
          <p className="font-handwriting text-sm font-bold uppercase tracking-wider text-blossom-600 mb-1">
            {chapter.kicker}
          </p>
        )}

        <h2 className="font-display-tight text-2xl sm:text-3xl text-ink leading-tight">
          {chapter.heading}
        </h2>

        <p className="mt-2.5 text-sm sm:text-[15px] leading-relaxed text-ink-soft">
          {chapter.body}
        </p>

        {chapter.todoNote && isTodo(chapter.todoNote) && import.meta.env && import.meta.env.DEV && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-sm border border-dashed border-blossom-600/60 bg-blossom-50/70 px-2 py-0.5 text-[11px] font-handwriting text-blossom-600">
            {chapter.todoNote}
          </div>
        )}

        {chapter.specs && chapter.specs.length > 0 && (
          <dl className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-dashed border-paper-line pt-3">
            {chapter.specs.map((spec) => (
              <div key={spec.label}>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                  {spec.label}
                </dt>
                <dd className="flex items-center gap-1.5 font-pixel text-sm sm:text-base text-ink">
                  <span>{spec.value}</span>
                  {isTodo(spec.value) && spec.value === "TODO" && (
                    <Stamp text="TODO" rotation={-3} size="sm" />
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {chapter.id === "build" && (
          <PanelSketch staticComplete={staticMode} />
        )}

        {chapter.ctaLabel && (
          <div className="mt-4">
            <StickerButton
              variant="primary"
              size="md"
              onClick={onPickPlanClick}
            >
              {chapter.ctaLabel}
            </StickerButton>
          </div>
        )}
      </RoughBox>
    </div>
  );
}
