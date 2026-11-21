import * as React from "react";
import { Link } from "react-router-dom";
import { links, story, type ChapterId } from "@/content";
import { useQualityTier, useReducedMotion } from "@/app/QualityProvider";
import { useSmoothScroll } from "@/app/SmoothScroll";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import {
  chapterAt,
  chapterProgress,
  storyStore,
} from "@/lib/storyStore";
import {
  RoughUnderline,
  SeedSketchSvg,
  StickerButton,
  WashiTape,
} from "@/components/sketch";
import type { IslandAnchors } from "@/three/island/islandGenerator";
import { ChapterCard } from "./ChapterCard";
import { updatePanelSketchDOM } from "./PanelSketch";
import { StoryStatic } from "./StoryStatic";
import { StoryVine, updateStoryVineDOM } from "./StoryVine";

const IslandCanvasLazy = React.lazy(() => import("@/three/IslandCanvas"));

function renderHeroHeading(heading: string, highlightWord?: string) {
  if (!highlightWord || !heading.includes(highlightWord)) return heading;
  const parts = heading.split(highlightWord);
  return (
    <>
      {parts[0]}
      <RoughUnderline drawIn>{highlightWord}</RoughUnderline>
      {parts.slice(1).join(highlightWord)}
    </>
  );
}

const CHAPTER_WINDOWS: {
  id: Exclude<ChapterId, "seed">;
  start: number;
  end: number;
  side: "left" | "right";
}[] = [
  { id: "roots", start: 0.1, end: 0.28, side: "left" },
  { id: "shield", start: 0.28, end: 0.46, side: "right" },
  { id: "build", start: 0.46, end: 0.66, side: "left" },
  { id: "neighbors", start: 0.66, end: 0.86, side: "right" },
  { id: "bloom", start: 0.86, end: 1.0, side: "left" },
];

function computeCardVisibility(p: number, start: number, end: number, isBloom: boolean): number {
  const fadeIn = 0.035;
  const fadeOut = 0.03;
  if (p < start) return 0;
  if (p < start + fadeIn) return (p - start) / fadeIn;
  if (isBloom) {
    if (p > 0.96) return Math.max(0, (1.0 - p) / 0.04);
    return 1;
  }
  if (p > end) return 0;
  if (p > end - fadeOut) return Math.max(0, (end - p) / fadeOut);
  return 1;
}

export function Story() {
  const { tier } = useQualityTier();
  const reducedMotion = useReducedMotion();

  if (tier === "static" || reducedMotion) {
    return <StoryStatic />;
  }

  return <StoryInteractive />;
}

function StoryInteractive() {
  const { tier } = useQualityTier();
  const { scrollToTarget } = useSmoothScroll();

  // Fixed at initial mount so a runtime stepDown never jumps scroll geometry.
  const startingTierRef = React.useRef(tier);

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const canvasWrapRef = React.useRef<HTMLDivElement | null>(null);
  const polaroidFrameRef = React.useRef<HTMLDivElement | null>(null);
  const heroOverlayRef = React.useRef<HTMLDivElement | null>(null);
  const heroTitleRef = React.useRef<HTMLHeadingElement | null>(null);
  const vineRef = React.useRef<HTMLElement | null>(null);
  const annotationRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  const [canvasReady, setCanvasReady] = React.useState(false);
  const [inView, setInView] = React.useState(true);

  const seedChapter = story.chapters[0];
  const restChapters = story.chapters.slice(1);
  const bloomChapter = story.chapters.find((c) => c.id === "bloom")!;

  // Imperative DOM sync driven strictly from storyStore.progress (zero React re-renders)
  const applyProgressToDom = React.useCallback((p: number) => {
    const root = rootRef.current;
    if (!root) return;

    // 1. Hero overlay (0.00..0.10)
    if (heroOverlayRef.current) {
      const heroAlpha = p <= 0.06 ? 1 : p >= 0.105 ? 0 : 1 - (p - 0.06) / 0.045;
      const shiftY = p <= 0.06 ? 0 : Math.min(24, ((p - 0.06) / 0.045) * 24);
      heroOverlayRef.current.style.opacity = heroAlpha.toFixed(3);
      heroOverlayRef.current.style.transform = `translate3d(0, ${(-shiftY).toFixed(1)}px, 0)`;
      heroOverlayRef.current.style.pointerEvents = heroAlpha > 0.15 ? "auto" : "none";
    }

    // 2. Chapter cards (roots, shield, build, neighbors, bloom)
    CHAPTER_WINDOWS.forEach((win) => {
      const card = root.querySelector<HTMLElement>(`[data-chapter-card="${win.id}"]`);
      if (!card) return;
      const isBloom = win.id === "bloom";
      const vis = computeCardVisibility(p, win.start, win.end, isBloom);
      const localT = chapterProgress(p, win.id);
      const slideOffset = (1 - vis) * 20;
      const tilt = win.side === "left" ? -1.1 * vis : 1.1 * vis;
      card.style.opacity = vis.toFixed(3);
      card.style.transform = `translate3d(0, ${slideOffset.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
      card.style.pointerEvents = vis > 0.25 ? "auto" : "none";

      if (win.id === "build") {
        const panel = card.querySelector<HTMLElement>("[data-panel-sketch]");
        updatePanelSketchDOM(panel, localT);
      }
    });

    // 3. StoryVine progress & active leaf
    updateStoryVineDOM(vineRef.current, p);

    // 4. Bloom Polaroid shrink in final 6% (0.94..1.00)
    if (canvasWrapRef.current && polaroidFrameRef.current) {
      const shrinkT = p <= 0.94 ? 0 : Math.min(1, (p - 0.94) / 0.06);
      const eased = shrinkT * shrinkT * (3 - 2 * shrinkT);
      const scale = 1 - eased * 0.64;
      const isMobile = window.innerWidth < 768;
      const tx = isMobile ? 0 : eased * 18;
      const ty = isMobile ? eased * 10 : -eased * 3;
      const rot = -3 * eased;

      canvasWrapRef.current.style.transform =
        eased > 0.001
          ? `translate3d(${tx.toFixed(2)}%, ${ty.toFixed(2)}%, 0) scale(${scale.toFixed(3)}) rotate(${rot.toFixed(2)}deg)`
          : "none";

      polaroidFrameRef.current.style.opacity = eased.toFixed(3);
    }
  }, []);

  // Live 3D anchor -> DOM annotation positioning (called inside R3F useFrame)
  const handleProjectAnchors = React.useCallback(
    (projected: Record<keyof IslandAnchors, { x: number; y: number; visible: boolean }>) => {
      const p = storyStore.progress;
      const activeId = chapterAt(p);
      const wrap = canvasWrapRef.current;
      const width = wrap ? wrap.clientWidth : window.innerWidth;
      const height = wrap ? wrap.clientHeight : window.innerHeight;

      const chapterToAnchor: Record<ChapterId, keyof IslandAnchors> = {
        seed: "seed",
        roots: "ore",
        shield: "domeRim",
        build: "house",
        neighbors: "mascots",
        bloom: "house",
      };

      story.chapters.forEach((ch) => {
        const el = annotationRefs.current[ch.id];
        if (!el) return;

        // Bloom uses polaroid caption instead of floating arrow
        if (ch.id === "bloom" || p > 0.92) {
          el.style.opacity = "0";
          return;
        }

        const isCurrent = ch.id === activeId;
        const anchorKey = chapterToAnchor[ch.id];
        const pt = projected[anchorKey];
        if (!isCurrent || !pt || !pt.visible) {
          el.style.opacity = "0";
          return;
        }

        const boxW = el.offsetWidth || 185;
        const boxH = el.offsetHeight || 44;

        const ax = Math.max(40, Math.min(width - 40, pt.x));
        const ay = Math.max(56, Math.min(height - 56, pt.y));

        const isDesktop = width >= 768;
        const cardSide: "left" | "right" | null =
          ch.id === "roots" || ch.id === "build"
            ? "left"
            : ch.id === "shield" || ch.id === "neighbors"
              ? "right"
              : null;

        const containerSideMargin = Math.max(24, (width - 1280) / 2 + 32);
        const vineReserve = width >= 1024 ? 112 : 0;

        let minLx = 16;
        let maxLx = Math.max(minLx, width - boxW - 24);
        if (isDesktop && cardSide === "left") {
          minLx = Math.min(maxLx, containerSideMargin + 436);
          maxLx = Math.max(minLx, width - boxW - vineReserve - 24);
        } else if (isDesktop && cardSide === "right") {
          const rightCardLeft = width - containerSideMargin - vineReserve - 420;
          maxLx = Math.max(minLx, rightCardLeft - boxW - 24);
        }

        const preferLeft =
          isDesktop && cardSide === "right"
            ? true
            : isDesktop && cardSide === "left"
              ? false
              : ax > width * 0.54;
        const preferAbove = ay > height * 0.48;

        const lx = preferLeft ? ax - boxW - 44 : ax + 48;
        const ly = preferAbove ? ay - boxH - 42 : ay + 42;

        const clampedLx = Math.max(minLx, Math.min(maxLx, lx));
        const clampedLy = Math.max(68, Math.min(height - boxH - 24, ly));

        el.style.opacity = "1";
        el.style.transform = `translate3d(${clampedLx.toFixed(1)}px, ${clampedLy.toFixed(1)}px, 0)`;

        const arrowPath = el.querySelector<SVGPathElement>("[data-ann-arrow]");
        if (arrowPath) {
          const startX = preferLeft ? boxW - 10 : 10;
          const startY = preferAbove ? boxH : 0;
          const dx = ax - clampedLx;
          const dy = ay - clampedLy;
          const midX = (startX + dx) * 0.5 + (preferLeft ? 14 : -14);
          const midY = (startY + dy) * 0.5 + (preferAbove ? -12 : 12);
          arrowPath.setAttribute(
            "d",
            `M ${startX.toFixed(1)} ${startY.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${dx.toFixed(1)} ${dy.toFixed(1)}`,
          );
        }
      });
    },
    [],
  );

  // One-time SplitText hero entrance + master scrubbed ScrollTrigger
  useGSAP(
    () => {
      if (!stageRef.current) return;

      // 1. Hero intro plays once at load (progress 0)
      if (heroTitleRef.current) {
        const split = SplitText.create(heroTitleRef.current, { type: "words" });
        gsap.from(split.words, {
          y: 20,
          opacity: 0,
          duration: 0.65,
          stagger: 0.06,
          ease: "power2.out",
          clearProps: "transform",
        });
      }

      // 2. Master scrubbed timeline driving progress 0 -> 1
      const scrollMultiplier = startingTierRef.current === "low" ? 3.5 : 5.0;
      ScrollTrigger.create({
        id: "petalnode-story",
        trigger: stageRef.current,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * scrollMultiplier)}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          storyStore.progress = self.progress;
          applyProgressToDom(self.progress);
        },
        onToggle: (self) => {
          setInView(self.isActive || window.scrollY < (self.end || 9999));
        },
      });

      applyProgressToDom(storyStore.progress);

      // Refresh once web fonts finish loading so pin geometry & SplitText settle cleanly
      if (typeof document !== "undefined" && document.fonts?.ready) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      }
    },
    { scope: rootRef, dependencies: [applyProgressToDom] },
  );

  // Pause 3D render loop once story scrolled cleanly past viewport
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  React.useEffect(() => {
    if (canvasReady) {
      ScrollTrigger.refresh();
    }
  }, [canvasReady]);

  return (
    <section
      ref={rootRef}
      id="story"
      data-story-mode="interactive"
      aria-label="Petalnode server hosting story"
      className="relative w-full"
    >
      {/* Debug/E2E hook for monotonic progress check without React re-render */}
      <div
        ref={stageRef}
        className="relative h-screen w-full overflow-hidden bg-paper"
      >
        {/* 3D Canvas wrapper: desktop full viewport; mobile top 58%.
            Shrinks into taped Polaroid at end of Bloom (0.94..1.00). */}
        <div
          ref={canvasWrapRef}
          className="absolute top-0 left-0 right-0 h-[58vh] md:h-full will-change-transform origin-[78%_84%]"
        >
          {/* SVG Seed sketch shown immediately before 3D first frame, crossfades out */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center md:justify-end md:pr-[16%] transition-opacity duration-500 z-10"
            style={{ opacity: canvasReady ? 0 : 1 }}
          >
            <SeedSketchSvg className="w-[240px] sm:w-[290px] md:w-[340px]" />
          </div>

          <React.Suspense fallback={null}>
            <IslandCanvasLazy
              inView={inView}
              onReady={() => setCanvasReady(true)}
              onProjectAnchors={handleProjectAnchors}
            />
          </React.Suspense>

          {/* Live projected annotations overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
          >
            {story.chapters.map((ch) => (
              <div
                key={`ann-${ch.id}`}
                ref={(el) => {
                  annotationRefs.current[ch.id] = el;
                }}
                style={{ opacity: 0 }}
                className="absolute top-0 left-0 transition-opacity duration-150 will-change-transform"
              >
                <div className="relative bg-paper/90 border border-dashed border-ink/40 px-2.5 py-1 rounded-sm shadow-[2px_2px_0_rgba(43,34,48,0.15)] max-w-[195px]">
                  <span className="font-handwriting text-xs sm:text-sm font-semibold text-ink leading-snug block">
                    {ch.annotation}
                  </span>
                  <svg
                    className="pointer-events-none absolute top-0 left-0 overflow-visible"
                    width="4"
                    height="4"
                  >
                    <path
                      data-ann-arrow
                      d="M 0 0 L 24 24"
                      fill="none"
                      stroke="#2B2230"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Polaroid bezel & caption that fades in during final 6% shrink */}
          <div
            ref={polaroidFrameRef}
            style={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-30 border-[14px] border-b-[52px] border-white ring-2 ring-ink shadow-[8px_10px_0_var(--color-ink)]"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <WashiTape rotation={-3} length={110} />
            </div>
            <p className="absolute -bottom-10 inset-x-0 text-center font-handwriting text-2xl text-ink font-semibold">
              {bloomChapter.polaroidCaption}
            </p>
          </div>
        </div>

        {/* Hero DOM overlay (Chapter 0: Seed) */}
        <div
          ref={heroOverlayRef}
          className="absolute inset-x-0 bottom-0 h-[42vh] md:inset-y-0 md:h-auto z-20 flex items-center pointer-events-auto"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 md:pt-12">
            <div className="max-w-lg lg:max-w-xl bg-paper/85 md:bg-transparent backdrop-blur-[1px] md:backdrop-blur-none p-4 md:p-0 rounded-sm">
              {seedChapter.eyebrow && (
                <p className="font-handwriting text-base sm:text-lg font-semibold text-blossom-600 mb-2">
                  {seedChapter.eyebrow}
                </p>
              )}
              <h1
                ref={heroTitleRef}
                className="font-display-tight text-3xl sm:text-5xl lg:text-6xl text-ink leading-[1.06]"
              >
                {renderHeroHeading(seedChapter.heading, seedChapter.highlightWord)}
              </h1>
              <p className="mt-3 sm:mt-5 text-sm sm:text-lg text-ink-soft leading-relaxed">
                {seedChapter.body}
              </p>
              <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
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
                  className="sticker-btn rounded-sm font-display font-bold bg-paper text-ink hover:bg-blossom-50 h-11 sm:h-13 px-5 sm:px-7 text-sm sm:text-base md:text-lg"
                >
                  {story.heroSecondaryCta}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scrubbed ChapterCards layer: bottom 42% on mobile, alternating left/right on desktop (lg:right-28 clears StoryVine) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42vh] md:inset-0 md:h-full z-20 flex items-end md:items-center">
          <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-4 md:pb-0 h-full">
            {restChapters.map((chapter, idx) => {
              const side: "left" | "right" = idx % 2 === 0 ? "left" : "right";
              return (
                <div
                  key={chapter.id}
                  className="absolute inset-x-4 sm:inset-x-6 lg:inset-x-8 lg:pr-28 bottom-3 md:bottom-auto md:top-1/2 md:-translate-y-1/2"
                >
                  <ChapterCard
                    chapter={chapter}
                    side={side}
                    onPickPlanClick={() => scrollToTarget("#plans-highlight", -24)}
                    className="opacity-0"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right-edge StoryVine (desktop only) */}
        <StoryVine ref={vineRef} />
      </div>
    </section>
  );
}
