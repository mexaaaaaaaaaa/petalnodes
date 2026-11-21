import * as React from "react";
import { isTodo, story } from "@/content";
import { RoughBox, Stamp } from "@/components/sketch";
import { cn } from "@/lib/utils";

const BUILD_CHAPTER = story.chapters.find((c) => c.id === "build")!;
const LOADERS = BUILD_CHAPTER.panelLoaders ?? ["Paper", "Purpur", "Fabric"];
const TARGET_LOADER = LOADERS[LOADERS.length - 1] ?? "Fabric";
const PANEL_NAME = BUILD_CHAPTER.panelName ?? "panel.petalnodes.cloud";

/**
 * Pure imperative DOM updater so the scrubbed ScrollTrigger timeline drives the
 * panel cursor click + progress bar with zero React re-renders per frame.
 */
export function updatePanelSketchDOM(
  root: HTMLElement | null,
  localProgress: number,
) {
  if (!root) return;
  const t = Math.max(0, Math.min(1, localProgress));

  const cursor = root.querySelector<HTMLElement>("[data-panel-cursor]");
  const targetBtn = root.querySelector<HTMLElement>('[data-loader-target="true"]');
  const progressFill = root.querySelector<HTMLElement>("[data-panel-progress]");
  const statusEl = root.querySelector<HTMLElement>("[data-panel-status]");

  if (cursor) {
    const moveT = Math.min(1, t / 0.34);
    const easedMove = 1 - Math.pow(1 - moveT, 2);
    const startX = -110;
    const startY = 28;
    const x = startX * (1 - easedMove);
    const y = startY * (1 - easedMove);
    const pressScale = t >= 0.33 && t <= 0.44 ? 0.84 : 1;
    cursor.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${pressScale})`;
    cursor.style.opacity = t > 0.02 ? "1" : "0.4";
  }

  const clicked = t >= 0.36;
  if (targetBtn) {
    targetBtn.dataset.active = clicked ? "true" : "false";
    targetBtn.style.backgroundColor = clicked ? "#E2557B" : "#FBF6EE";
    targetBtn.style.color = clicked ? "#FFFFFF" : "#2B2230";
  }

  const barT = Math.max(0, Math.min(1, (t - 0.38) / 0.52));
  if (progressFill) {
    progressFill.style.width = `${(barT * 100).toFixed(1)}%`;
  }
  if (statusEl) {
    statusEl.textContent =
      barT >= 0.98
        ? "Ready to join!"
        : clicked
          ? `Preparing ${TARGET_LOADER}…`
          : "Pick a server engine";
  }
}

export function PanelSketch({
  staticComplete = false,
  className,
}: {
  staticComplete?: boolean;
  className?: string;
}) {
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (staticComplete) {
      updatePanelSketchDOM(panelRef.current, 1);
    } else {
      updatePanelSketchDOM(panelRef.current, 0);
    }
  }, [staticComplete]);

  return (
    <div ref={panelRef} data-panel-sketch className={cn("mt-4", className)}>
      <RoughBox
        seed={407}
        bgClassName="bg-paper"
        padding="p-3.5"
        strokeWidth={1.6}
        className="shadow-[2px_3px_0_var(--color-ink)]"
      >
        <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-dashed border-paper-line">
          <span className="font-handwriting text-xs font-bold text-ink-soft">
            {PANEL_NAME}
          </span>
          {isTodo(PANEL_NAME) && <Stamp text="TODO" rotation={-3} size="sm" />}
        </div>

        <div className="relative flex flex-wrap gap-1.5">
          {LOADERS.map((loader) => {
            const isTarget = loader === TARGET_LOADER;
            return (
              <span
                key={loader}
                data-loader={loader}
                data-loader-target={isTarget ? "true" : "false"}
                data-active={staticComplete && isTarget ? "true" : "false"}
                className={cn(
                  "relative inline-flex items-center px-2.5 py-0.5 text-xs font-bold border border-ink rounded-[2px] transition-colors",
                  staticComplete && isTarget
                    ? "bg-blossom-600 text-white"
                    : "bg-paper text-ink",
                )}
              >
                {loader}
                {isTarget && (
                  <svg
                    data-panel-cursor
                    viewBox="0 0 20 20"
                    width={18}
                    height={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-3 -right-2.5 z-20 drop-shadow-[1px_1px_0_#FBF6EE]"
                    style={{
                      transform: staticComplete
                        ? "translate3d(0,0,0) scale(1)"
                        : "translate3d(-110px,28px,0) scale(1)",
                    }}
                  >
                    <path
                      d="M3 2 L16 9 L10 11 L13 17 L10 18 L7 12 L3 15 Z"
                      fill="#FFC75A"
                      stroke="#2B2230"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            );
          })}
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] font-handwriting text-ink-soft mb-1">
            <span data-panel-status>
              {staticComplete ? "Ready to join!" : "Pick a server engine"}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-[2px] border border-ink bg-paper-shade overflow-hidden">
            <div
              data-panel-progress
              className="h-full bg-moss transition-none"
              style={{ width: staticComplete ? "100%" : "0%" }}
            />
          </div>
        </div>
      </RoughBox>
    </div>
  );
}
