import * as React from "react";
import { Check } from "lucide-react";
import { aboutPage, links, locationsPage } from "@/content";
import {
  RoughBox,
  RoughUnderline,
  Stamp,
  StickerButton,
  WashiTape,
} from "@/components/sketch";

export default function About() {
  const parts = aboutPage.heading.split(aboutPage.highlightWord);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <header className="max-w-2xl mb-12">
        <p className="font-handwriting text-lg font-semibold text-blossom-600 mb-2">
          {aboutPage.eyebrow}
        </p>
        <h1 className="font-display-tight text-4xl sm:text-5xl md:text-6xl text-ink">
          {parts[0]}
          <RoughUnderline drawIn>{aboutPage.highlightWord}</RoughUnderline>
          {parts.slice(1).join(aboutPage.highlightWord)}
        </h1>
        <p className="mt-5 text-lg text-ink-soft leading-relaxed">
          {aboutPage.intro}
        </p>
      </header>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-14">
        {aboutPage.pillars.map((pillar, idx) => (
          <div key={pillar.title} className="relative">
            <div className="pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
              <WashiTape rotation={idx === 1 ? 0 : idx === 0 ? -3 : 3} length={76} />
            </div>
            <RoughBox
              seed={1210 + idx}
              bgClassName="bg-paper-shade"
              padding="p-6 pt-7"
              className="h-full shadow-[4px_5px_0_var(--color-ink)]"
            >
              <h2 className="font-display-tight text-2xl text-ink">{pillar.title}</h2>
              <p className="mt-3 text-sm text-ink-soft leading-relaxed">{pillar.body}</p>
            </RoughBox>
          </div>
        ))}
      </div>

      {/* Confirmed Infrastructure & Regions */}
      <RoughBox
        seed={1230}
        bgClassName="bg-paper"
        padding="p-6 sm:p-8"
        className="mb-10 shadow-[4px_5px_0_var(--color-ink)]"
      >
        <h2 className="font-display-tight text-2xl text-ink">
          Verified Infrastructure Stack
        </h2>
        <p className="mt-2 text-sm text-ink-soft max-w-3xl leading-relaxed">
          {locationsPage.infraNote}
        </p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {locationsPage.infraBadges.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 border border-ink/25 bg-paper-shade px-4 py-2.5 rounded-sm text-sm font-semibold text-ink"
            >
              <Check className="h-4 w-4 text-moss shrink-0" aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <StickerButton to="/plans" variant="primary" size="md">
            Explore Minecraft Plans
          </StickerButton>
          <StickerButton to="/vps" variant="outline" size="md">
            Explore VPS Plans
          </StickerButton>
          <StickerButton href={links.discord} external variant="outline" size="md">
            Join Discord
          </StickerButton>
        </div>
      </RoughBox>

      {/* Owner Details TODO Notice */}
      <RoughBox
        seed={1250}
        bgClassName="bg-blossom-50"
        padding="p-5 sm:p-6"
        className="shadow-[4px_4px_0_var(--color-ink)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display-tight text-lg text-ink">
              Company Story &amp; Registration Details
            </h2>
            <p className="text-sm text-ink-soft">{aboutPage.ownerDetailsTodo}</p>
          </div>
          <Stamp text="TODO" rotation={-3} size="sm" className="shrink-0 bg-paper" />
        </div>
      </RoughBox>
    </div>
  );
}
