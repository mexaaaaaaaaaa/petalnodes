import * as React from "react";
import { faq, plansSection } from "@/content";
import { RoughUnderline } from "@/components/sketch";
import { PlanGrid } from "@/sections/plans/PlanGrid";
import { CompareTable } from "@/sections/plans/CompareTable";
import { RewardsSection } from "@/sections/plans/RewardsSection";
import { FAQ } from "@/sections/home/FAQ";

function renderHeadingWithGrow(heading: string, word: string) {
  if (!heading.includes(word)) return heading;
  const parts = heading.split(word);
  return (
    <>
      {parts[0]}
      <RoughUnderline drawIn>{word}</RoughUnderline>
      {parts.slice(1).join(word)}
    </>
  );
}

export default function Plans() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-12">
      <header className="max-w-2xl mb-14">
        <p className="font-handwriting text-lg font-semibold text-blossom-600 mb-2">
          cherry blossom minecraft hosting
        </p>
        <h1 className="font-display-tight text-4xl sm:text-5xl md:text-6xl text-ink">
          {renderHeadingWithGrow(
            plansSection.pageHeading,
            plansSection.pageHighlightWord,
          )}
        </h1>
        <p className="mt-5 text-lg text-ink-soft leading-relaxed">
          {plansSection.pageSub}
        </p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-ink">
          <a
            href="#compare-heading"
            className="underline decoration-wavy decoration-blossom-400 underline-offset-4 hover:text-blossom-600"
          >
            Compare tiers ↓
          </a>
          <a
            href="#free-rewards"
            className="underline decoration-wavy decoration-blossom-400 underline-offset-4 hover:text-blossom-600"
          >
            Free invite servers ↓
          </a>
          <a
            href="#boost-rewards"
            className="underline decoration-wavy decoration-blossom-400 underline-offset-4 hover:text-blossom-600"
          >
            Discord boost rewards ↓
          </a>
        </div>
      </header>

      <PlanGrid />
      <CompareTable />
      <RewardsSection />

      <div className="mt-20">
        <FAQ
          filterIds={faq.plansPageIds}
          className="mx-auto max-w-3xl py-8"
        />
      </div>
    </div>
  );
}
