import * as React from "react";
import { story, type ChapterId } from "@/content";
import { chapterAt, chapterStart } from "@/lib/storyStore";
import { useSmoothScroll } from "@/app/SmoothScroll";

const VINE_PATH_LENGTH = 260;

/**
 * Pure imperative updater called from the master ScrollTrigger onUpdate.
 * Updates the vine stroke length and active leaf dot without any React re-renders.
 */
export function updateStoryVineDOM(
  root: HTMLElement | null,
  progress: number,
) {
  if (!root) return;
  const p = Math.max(0, Math.min(1, progress));
  const activeId = chapterAt(p);

  const stemFill = root.querySelector<SVGPathElement>("[data-vine-stem]");
  if (stemFill) {
    stemFill.style.strokeDashoffset = `${(VINE_PATH_LENGTH * (1 - p)).toFixed(1)}`;
  }

  const leaves = root.querySelectorAll<HTMLElement>("[data-vine-chapter]");
  leaves.forEach((btn) => {
    const isActive = btn.dataset.vineChapter === activeId;
    btn.dataset.active = isActive ? "true" : "false";
    const leafShape = btn.querySelector<SVGPathElement>("[data-vine-leaf]");
    const label = btn.querySelector<HTMLElement>("[data-vine-label]");
    if (leafShape) {
      leafShape.setAttribute("fill", isActive ? "#E2557B" : "#6FAF5B");
      leafShape.setAttribute(
        "transform",
        isActive ? "scale(1.22)" : "scale(1)",
      );
    }
    if (label) {
      label.style.opacity = isActive ? "1" : "0.62";
      label.style.color = isActive ? "#E2557B" : "#2B2230";
      label.style.fontWeight = isActive ? "800" : "600";
    }
  });
}

export const StoryVine = React.forwardRef<HTMLElement, { className?: string }>(
  function StoryVine({ className }, ref) {
    const { scrollToStoryProgress } = useSmoothScroll();

    const CHAPTER_JUMPS: Record<ChapterId, number> = {
      seed: 0,
      roots: 0.19,
      shield: 0.37,
      build: 0.56,
      neighbors: 0.76,
      bloom: 0.91,
    };

    const handleJump = (id: ChapterId) => {
      scrollToStoryProgress(CHAPTER_JUMPS[id] ?? chapterStart(id) + 0.06);
    };

    return (
      <aside
        ref={ref}
        aria-label="Story progress navigation"
        className={
          className ??
          "hidden lg:flex absolute right-5 top-1/2 -translate-y-1/2 z-30 flex-col items-end pointer-events-auto"
        }
      >
        <div className="relative flex flex-col justify-between h-[280px] pr-2">
          {/* Background guide + growing ink/green vine */}
          <svg
            viewBox="0 0 24 260"
            width={24}
            height={260}
            aria-hidden="true"
            className="pointer-events-none absolute right-2 top-3 h-[256px] w-6 overflow-visible"
          >
            <path
              d="M12 4 C8 55 16 105 12 155 C9 195 15 230 12 256"
              fill="none"
              stroke="#E6DEC8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              data-vine-stem
              d="M12 4 C8 55 16 105 12 155 C9 195 15 230 12 256"
              fill="none"
              stroke="#6FAF5B"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={VINE_PATH_LENGTH}
              strokeDashoffset={VINE_PATH_LENGTH}
            />
          </svg>

          {story.chapters.map((chapter, idx) => (
            <button
              key={chapter.id}
              type="button"
              data-vine-chapter={chapter.id}
              data-active={idx === 0 ? "true" : "false"}
              onClick={() => handleJump(chapter.id)}
              aria-label={`Jump to chapter: ${chapter.vineLabel}`}
              className="group relative flex items-center gap-2.5 py-1 pr-0.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-ink rounded-sm"
            >
              <span
                data-vine-label
                className="font-handwriting text-xs tracking-wide transition-opacity group-hover:opacity-100"
                style={{
                  opacity: idx === 0 ? 1 : 0.62,
                  color: idx === 0 ? "#E2557B" : "#2B2230",
                  fontWeight: idx === 0 ? 800 : 600,
                }}
              >
                {chapter.vineLabel}
              </span>
              <svg
                viewBox="0 0 20 20"
                width={18}
                height={18}
                aria-hidden="true"
                className="relative z-10 overflow-visible"
              >
                <path
                  data-vine-leaf
                  d="M10 3 C15 4 17 8 15 13 C12 16 7 15 4 11 C3 7 6 3 10 3 Z"
                  fill={idx === 0 ? "#E2557B" : "#6FAF5B"}
                  stroke="#2B2230"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                  style={{ transformOrigin: "10px 10px" }}
                />
              </svg>
            </button>
          ))}
        </div>
      </aside>
    );
  },
);
