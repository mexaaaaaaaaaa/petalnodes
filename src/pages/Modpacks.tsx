import * as React from "react";
import { Check } from "lucide-react";
import { links, modpacksPage } from "@/content";
import {
  RoughBox,
  RoughUnderline,
  Stamp,
  StickerButton,
  WashiTape,
} from "@/components/sketch";

export default function Modpacks() {
  const parts = modpacksPage.heading.split(modpacksPage.highlightWord);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <header className="max-w-2xl mb-12">
        <p className="font-handwriting text-lg font-semibold text-blossom-600 mb-2">
          {modpacksPage.eyebrow}
        </p>
        <h1 className="font-display-tight text-4xl sm:text-5xl md:text-6xl text-ink">
          {parts[0]}
          <RoughUnderline drawIn>{modpacksPage.highlightWord}</RoughUnderline>
          {parts.slice(1).join(modpacksPage.highlightWord)}
        </h1>
        <p className="mt-5 text-lg text-ink-soft leading-relaxed">
          {modpacksPage.sub}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <StickerButton to="/plans" variant="primary" size="md">
            View Minecraft Plans
          </StickerButton>
          <StickerButton href={links.gamePanel} external variant="outline" size="md">
            Open Game Panel
          </StickerButton>
        </div>
      </header>

      {/* Verified Software Engines */}
      <section aria-labelledby="software-heading" className="mb-14">
        <h2 id="software-heading" className="font-display-tight text-3xl text-ink mb-6">
          Confirmed Server Software
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {modpacksPage.verifiedSoftware.map((soft, idx) => (
            <div key={soft.name} className="relative">
              <div className="pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
                <WashiTape rotation={idx === 1 ? 0 : idx === 0 ? -4 : 4} length={78} />
              </div>
              <RoughBox
                seed={1110 + idx}
                bgClassName="bg-paper-shade"
                padding="p-6 pt-7"
                className="h-full shadow-[4px_5px_0_var(--color-ink)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display-tight text-2xl text-ink">{soft.name}</h3>
                  <span className="inline-flex items-center gap-1 border border-ink/30 bg-paper px-2 py-0.5 text-xs font-bold rounded-sm text-moss">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" /> Verified
                  </span>
                </div>
                <p className="mt-1 font-handwriting text-sm font-bold text-blossom-600">
                  {soft.role}
                </p>
                <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                  {soft.detail}
                </p>
              </RoughBox>
            </div>
          ))}
        </div>
      </section>

      {/* 3-Step Setup Workflow */}
      <section aria-labelledby="workflow-heading" className="mb-14">
        <h2 id="workflow-heading" className="font-display-tight text-3xl text-ink mb-6">
          How to set up plugins or Fabric modpacks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modpacksPage.workflowSteps.map((ws, idx) => (
            <RoughBox
              key={ws.step}
              seed={1130 + idx}
              bgClassName="bg-paper"
              padding="p-6"
              className="shadow-[3px_4px_0_var(--color-ink)]"
            >
              <span className="font-pixel text-2xl text-blossom-600">{ws.step}</span>
              <h3 className="mt-2 font-display-tight text-xl text-ink">{ws.title}</h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{ws.detail}</p>
            </RoughBox>
          ))}
        </div>
      </section>

      {/* Honest TODO Notice for Unverified Loaders / Pre-installed Packs */}
      <RoughBox
        seed={1150}
        bgClassName="bg-blossom-50"
        padding="p-6"
        className="shadow-[4px_4px_0_var(--color-ink)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display-tight text-xl text-ink">
              Additional Loaders &amp; Pack Installer Notice
            </h2>
            <p className="text-sm text-ink-soft">{modpacksPage.catalogNotice}</p>
          </div>
          <Stamp text="TODO" rotation={-4} size="md" className="shrink-0 bg-paper" />
        </div>
      </RoughBox>
    </div>
  );
}
