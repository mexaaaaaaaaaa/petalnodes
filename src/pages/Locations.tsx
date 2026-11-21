import * as React from "react";
import { Check, MapPin } from "lucide-react";
import { links, locationsPage } from "@/content";
import {
  RoughBox,
  RoughUnderline,
  StickerButton,
  WashiTape,
} from "@/components/sketch";
import { cn } from "@/lib/utils";

export default function Locations() {
  const [selectedId, setSelectedId] = React.useState<"sg" | "miami" | "in">("miami");
  const parts = locationsPage.heading.split(locationsPage.highlightWord);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <header className="max-w-2xl mb-12">
        <p className="font-handwriting text-lg font-semibold text-blossom-600 mb-2">
          {locationsPage.eyebrow}
        </p>
        <h1 className="font-display-tight text-4xl sm:text-5xl md:text-6xl text-ink">
          {parts[0]}
          <RoughUnderline drawIn>{locationsPage.highlightWord}</RoughUnderline>
          {parts.slice(1).join(locationsPage.highlightWord)}
        </h1>
        <p className="mt-5 text-lg text-ink-soft leading-relaxed">
          {locationsPage.sub}
        </p>
      </header>

      {/* Hand-drawn World Map SVG */}
      <RoughBox
        seed={950}
        bgClassName="bg-paper"
        padding="p-5 sm:p-8"
        className="mb-12 shadow-[4px_5px_0_var(--color-ink)]"
      >
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-full lg:w-2/3">
            <svg
              viewBox="0 0 540 260"
              className="w-full h-auto overflow-visible"
              role="img"
              aria-label="Petalnodes regions map: Miami, India, Singapore"
            >
              {/* Subtle notebook latitude / longitude grid */}
              <g stroke="#E4D6C1" strokeWidth="1" strokeDasharray="4 4">
                <line x1="20" y1="65" x2="520" y2="65" />
                <line x1="20" y1="130" x2="520" y2="130" />
                <line x1="20" y1="195" x2="520" y2="195" />
                <line x1="135" y1="20" x2="135" y2="240" />
                <line x1="270" y1="20" x2="270" y2="240" />
                <line x1="405" y1="20" x2="405" y2="240" />
              </g>

              {/* Sketch continent silhouettes */}
              <g fill="#F1E7D6" stroke="#2B2230" strokeWidth="2" strokeLinejoin="round">
                {/* Americas */}
                <path d="M52 54 C85 38 148 44 176 74 C180 96 164 114 156 132 C164 146 196 156 192 192 C180 222 152 240 138 228 C132 204 134 176 122 146 C94 134 62 104 52 54 Z" />
                {/* Europe / Africa / Eurasia */}
                <path d="M226 54 C264 36 364 38 438 66 C458 84 446 122 414 148 C394 168 386 184 368 176 C352 162 344 144 326 142 C308 158 312 198 292 216 C272 208 262 170 258 146 C238 134 220 96 226 54 Z" />
                {/* Maritime SE Asia / Oceania */}
                <path d="M396 174 C412 166 432 172 440 184 C424 190 404 186 396 174 Z" />
                <path d="M412 196 C444 188 476 202 472 224 C452 234 416 224 412 196 Z" />
              </g>

              {/* Soft dashed links */}
              <path
                d="M146 132 Q250 86 356 140 Q378 154 396 170"
                fill="none"
                stroke="#E2557B"
                strokeWidth="2"
                strokeDasharray="5 5"
              />

              {/* Pins */}
              {locationsPage.locations.map((loc) => {
                const active = selectedId === loc.id;
                return (
                  <g
                    key={loc.id}
                    transform={`translate(${loc.pinX}, ${loc.pinY})`}
                    onClick={() => setSelectedId(loc.id)}
                    className="cursor-pointer"
                  >
                    <circle
                      r={active ? 14 : 9}
                      fill="#FF8FAB"
                      fillOpacity={active ? 0.38 : 0.2}
                    />
                    <circle
                      r={active ? 7 : 5.5}
                      fill={active ? "#E2557B" : "#6FAF5B"}
                      stroke="#2B2230"
                      strokeWidth="2"
                    />
                    <g
                      transform={
                        loc.id === "in"
                          ? "translate(-106, -32)"
                          : loc.id === "sg"
                            ? "translate(10, -8)"
                            : "translate(10, -14)"
                      }
                    >
                      <rect
                        x="0"
                        y="0"
                        width={loc.city.length * 8 + 42}
                        height="24"
                        rx="3"
                        fill="#FBF6EE"
                        stroke="#2B2230"
                        strokeWidth="1.6"
                      />
                      <text
                        x="8"
                        y="16"
                        fill="#2B2230"
                        fontSize="12"
                        fontWeight="800"
                        fontFamily="Shantell Sans, sans-serif"
                      >
                        {loc.city} ({loc.code})
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Active Location Spotlight */}
          <div className="w-full lg:w-1/3 space-y-4">
            <p className="font-handwriting text-sm font-bold uppercase tracking-wider text-blossom-600">
              click a pin or card
            </p>
            {locationsPage.locations
              .filter((l) => l.id === selectedId)
              .map((loc) => (
                <div key={loc.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blossom-600" aria-hidden="true" />
                    <h2 className="font-display-tight text-3xl text-ink">
                      {loc.city}{" "}
                      <span className="font-pixel text-xl text-blossom-600">
                        ({loc.code})
                      </span>
                    </h2>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                    {loc.regionLabel} · {loc.country}
                  </p>
                  <p className="text-sm text-ink-soft leading-relaxed">{loc.summary}</p>
                  {loc.botInfraNote && (
                    <p className="text-xs font-semibold text-blossom-600">
                      {loc.botInfraNote}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {loc.services.map((srv) => (
                      <span
                        key={srv}
                        className="border border-ink bg-paper-shade px-2.5 py-1 text-xs font-bold rounded-sm text-ink"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </RoughBox>

      {/* Accessible Interactive Location Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-16">
        {locationsPage.locations.map((loc, idx) => {
          const active = loc.id === selectedId;
          return (
            <button
              key={loc.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedId(loc.id)}
              className="relative text-left w-full h-full cursor-pointer focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-ink focus-visible:outline-offset-4 rounded-sm"
            >
              <div className="pointer-events-none absolute -top-2.5 left-6 z-20">
                <WashiTape
                  rotation={idx % 2 === 0 ? -4 : 4}
                  length={78}
                  color={active ? "#FF8FAB" : "#FFC9D6"}
                />
              </div>
              <RoughBox
                seed={960 + idx}
                bgClassName={active ? "bg-paper" : "bg-paper-shade"}
                padding="p-6 pt-7"
                className={cn(
                  "h-full shadow-[4px_5px_0_var(--color-ink)] transition-transform hover:-translate-y-1",
                  active && "ring-2 ring-blossom-400/60 ring-offset-4 ring-offset-paper",
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-display-tight text-2xl text-ink">{loc.city}</h2>
                  <span className="font-pixel text-xl text-blossom-600">{loc.code}</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-soft mt-1">
                  {loc.regionLabel}
                </p>
                <p className="mt-3 text-sm text-ink-soft leading-relaxed">{loc.summary}</p>
                <ul className="mt-4 pt-3 border-t border-dashed border-paper-line space-y-1.5 text-xs text-ink">
                  {loc.services.map((srv) => (
                    <li key={srv} className="flex items-center gap-2 font-semibold">
                      <Check className="h-3.5 w-3.5 text-moss shrink-0" aria-hidden="true" />
                      <span>{srv}</span>
                    </li>
                  ))}
                </ul>
              </RoughBox>
            </button>
          );
        })}
      </div>

      {/* Infrastructure & Status */}
      <RoughBox
        seed={980}
        bgClassName="bg-paper-shade"
        padding="p-6 sm:p-8"
        className="shadow-[4px_5px_0_var(--color-ink)]"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display-tight text-2xl text-ink">
              {locationsPage.infraHeading}
            </h2>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">
              {locationsPage.infraNote}
            </p>
            <p className="mt-2 text-xs font-semibold text-blossom-600 leading-relaxed">
              {locationsPage.botLocationNote}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {locationsPage.infraBadges.map((b) => (
                <span
                  key={b}
                  className="border border-ink/30 bg-paper px-3 py-1 text-xs font-bold rounded-sm text-ink"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <StickerButton href={links.status} external variant="primary" size="md">
              Live Status Page
            </StickerButton>
            <StickerButton to="/plans" variant="outline" size="md">
              Minecraft Plans
            </StickerButton>
            <StickerButton to="/bots" variant="outline" size="md">
              Bot Hosting (Miami)
            </StickerButton>
          </div>
        </div>
      </RoughBox>
    </div>
  );
}
