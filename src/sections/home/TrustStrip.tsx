import * as React from "react";
import { isTodo, trust } from "@/content";
import { HandIcon, Stamp } from "@/components/sketch";
import { cn } from "@/lib/utils";

function TinyWorldMap() {
  return (
    <svg
      viewBox="0 0 120 56"
      width={116}
      height={54}
      aria-hidden="true"
      className="mt-2 overflow-visible"
    >
      <g
        stroke="#2B2230"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M12 18 C20 12 34 12 38 22 C35 30 30 34 36 44 C26 42 20 34 15 26 Z"
          fill="#F1E7D6"
        />
        <path
          d="M52 14 C64 10 86 12 102 20 C106 28 96 36 86 38 C76 36 68 44 62 42 C54 34 48 22 52 14 Z"
          fill="#F1E7D6"
        />
        <path
          d="M88 40 C96 40 104 44 102 50 C94 52 86 48 88 40 Z"
          fill="#F1E7D6"
        />
        {/* Pins: Miami (USA), India (IN), Singapore (SG) */}
        <circle cx="29" cy="24" r="3" fill="#E2557B" />
        <circle cx="80" cy="26" r="3" fill="#E2557B" />
        <circle cx="91" cy="31" r="3" fill="#E2557B" />
      </g>
    </svg>
  );
}

const ITEM_LAYOUT = [
  { rot: "-2deg", sizeClass: "md:pt-1" },
  { rot: "1.8deg", sizeClass: "md:-mt-2" },
  { rot: "-1.2deg", sizeClass: "md:pt-2" },
  { rot: "2.4deg", sizeClass: "md:-mt-1" },
];

export function TrustStrip() {
  const isDev = Boolean(import.meta.env && import.meta.env.DEV);
  const hasReviews = trust.reviews.length > 0;

  return (
    <section aria-labelledby="trust-heading" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="mb-10">
        <h2
          id="trust-heading"
          className="font-display-tight text-3xl md:text-4xl text-ink"
        >
          {trust.heading}
        </h2>
      </div>

      {/* Four varied-rotation hand-drawn items in a loose row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 items-start">
        {trust.items.map((item, idx) => {
          const layout = ITEM_LAYOUT[idx % ITEM_LAYOUT.length];
          const valueIsTodo = isTodo(item.value);
          return (
            <div
              key={item.id}
              style={{ transform: `rotate(${layout.rot})` }}
              className={cn(
                "flex flex-col items-start gap-2 border-l-2 border-dashed border-ink/25 pl-4 py-1",
                layout.sizeClass,
              )}
            >
              <div className="flex items-center gap-2.5">
                <HandIcon name={item.icon} size={28} drawIn />
                <span className="font-handwriting text-xl font-bold text-ink">
                  {item.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="font-pixel text-xl text-ink leading-snug">
                  {valueIsTodo ? "TODO" : item.value}
                </span>
                {valueIsTodo && item.value !== "TODO" && (
                  <span className="text-xs text-ink-soft">
                    ({item.value.replace(/^TODO:\s*/i, "")})
                  </span>
                )}
                {valueIsTodo && <Stamp text="TODO" rotation={-5} size="sm" />}
              </div>

              {item.id === "locations" && <TinyWorldMap />}
            </div>
          );
        })}
      </div>

      {/* Reviews slot: NOTHING in production while empty; dashed box in DEV */}
      {hasReviews ? (
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {trust.reviews.map((rev, i) => (
            <blockquote
              key={`${rev.author}-${i}`}
              className="border-2 border-ink bg-paper-shade p-5 rounded-sm shadow-[3px_3px_0_var(--color-ink)]"
            >
              <p className="font-serif italic text-ink text-base">“{rev.quote}”</p>
              <footer className="mt-3 text-xs font-bold text-ink-soft">
                — {rev.author}, {rev.role}
              </footer>
            </blockquote>
          ))}
        </div>
      ) : isDev ? (
        <div
          data-testid="reviews-todo-slot"
          className="mt-12 border-2 border-dashed border-blossom-600/60 bg-blossom-50/40 px-5 py-4 rounded-sm font-handwriting text-base text-blossom-600"
        >
          {trust.reviewsTodoNotice}
        </div>
      ) : null}
    </section>
  );
}
