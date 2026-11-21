import * as React from "react";
import { Check } from "lucide-react";
import { hostingCategories } from "@/content";
import { RoughBox, Stamp, StickerButton, WashiTape } from "@/components/sketch";
import { cn } from "@/lib/utils";

export function HostingCategories() {
  return (
    <section
      id="hosting-categories"
      aria-labelledby="hosting-categories-heading"
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16"
    >
      <div className="max-w-2xl mb-10">
        <p className="font-handwriting text-lg font-semibold text-blossom-600 mb-1">
          three ways to grow
        </p>
        <h2
          id="hosting-categories-heading"
          className="font-display-tight text-3xl md:text-4xl text-ink"
        >
          Hosting for worlds, root servers, and bots.
        </h2>
        <p className="mt-2.5 text-base text-ink-soft leading-relaxed">
          Start with a managed Minecraft world, deploy full-root KVM Linux nodes, or preview our upcoming Miami Bot Hosting lineup.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
        {hostingCategories.map((cat, idx) => (
          <div key={cat.id} className="relative flex flex-col">
            <div className="pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
              <WashiTape
                rotation={idx === 1 ? 0 : idx === 0 ? -3 : 3}
                length={76}
                color={cat.isDraft ? "#FFE1EA" : "#FFC9D6"}
              />
            </div>

            {cat.isDraft && (
              <div className="absolute -top-3.5 right-3 z-30">
                <Stamp
                  text="DRAFT"
                  rotation={6}
                  size="sm"
                  className="bg-paper shadow-[2px_2px_0_var(--color-ink)]"
                />
              </div>
            )}

            <RoughBox
              seed={610 + idx}
              bgClassName={cat.id === "vps" ? "bg-paper" : "bg-paper-shade"}
              padding="p-6 pt-7"
              className={cn(
                "flex-1 flex flex-col shadow-[4px_5px_0_var(--color-ink)]",
              )}
            >
              <p className="font-handwriting text-sm font-bold text-blossom-600">
                {cat.badge}
              </p>
              <h3 className="mt-1 font-display-tight text-2xl text-ink">
                {cat.title}
              </h3>
              <p className="mt-1 font-pixel text-2xl text-ink tabular-nums">
                {cat.priceLead}
              </p>
              <p className="mt-1 text-xs font-semibold text-ink-soft">
                {cat.locations}
              </p>

              <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                {cat.summary}
              </p>

              <ul className="mt-4 pt-3 border-t border-dashed border-paper-line space-y-1.5 text-xs text-ink">
                {cat.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check
                      className="h-3.5 w-3.5 text-moss shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-5">
                <StickerButton
                  to={cat.to}
                  variant={cat.id === "minecraft" ? "primary" : "outline"}
                  size="md"
                  className="w-full"
                >
                  {cat.ctaLabel}
                </StickerButton>
              </div>
            </RoughBox>
          </div>
        ))}
      </div>
    </section>
  );
}
