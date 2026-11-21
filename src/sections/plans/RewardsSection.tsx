import * as React from "react";
import { Check, Sparkles } from "lucide-react";
import { boostRewards, freeRewards, links } from "@/content";
import { RoughBox, Stamp, StickerButton, WashiTape } from "@/components/sketch";

export function RewardsSection() {
  return (
    <div className="mt-24 space-y-20">
      {/* Free Minecraft Server Rewards: Petal I – VI */}
      <section id="free-rewards" aria-labelledby="free-rewards-heading">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="font-handwriting text-lg font-semibold text-blossom-600 mb-1">
              invite rewards
            </p>
            <h2
              id="free-rewards-heading"
              className="font-display-tight text-3xl md:text-4xl text-ink"
            >
              {freeRewards.heading}
            </h2>
            <p className="mt-3 text-base text-ink-soft leading-relaxed">
              {freeRewards.sub}
            </p>
          </div>
          <StickerButton href={links.discord} external variant="outline" size="md">
            {freeRewards.claimCta}
          </StickerButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {freeRewards.tiers.map((tier, idx) => (
            <div key={tier.id} className="relative">
              <div className="pointer-events-none absolute -top-2.5 left-6 z-20">
                <WashiTape rotation={idx % 2 === 0 ? -4 : 4} length={72} />
              </div>
              <RoughBox
                seed={710 + idx}
                bgClassName="bg-paper-shade"
                padding="p-5 pt-6"
                className="shadow-[3px_4px_0_var(--color-ink)] h-full"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display-tight text-2xl text-ink">{tier.name}</h3>
                  <span className="font-pixel text-2xl text-blossom-600">
                    {tier.ramGb} GB RAM
                  </span>
                </div>
                <p className="mt-2 font-handwriting text-base text-ink-soft">
                  Requires{" "}
                  <span className="font-bold text-ink">{tier.invitesRequired} Invites</span>
                </p>
                <p className="mt-3 text-xs text-ink-soft border-t border-dashed border-paper-line pt-2.5">
                  Claim through a Discord Support Ticket.
                </p>
              </RoughBox>
            </div>
          ))}
        </div>

        {/* Invite rules card */}
        <RoughBox
          seed={730}
          bgClassName="bg-paper"
          padding="p-5 sm:p-6"
          className="mt-8 shadow-[3px_4px_0_var(--color-ink)]"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-display-tight text-xl text-ink">
                Invite Integrity Rules
              </h3>
              <p className="text-sm text-ink-soft mt-1">
                Verified invites remain subject to automated community tracking rules:
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {freeRewards.rules.map((rule) => (
                <div
                  key={rule.label}
                  className="border border-ink/30 bg-paper-shade rounded-sm px-3 py-2 text-center"
                >
                  <div className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                    {rule.label}
                  </div>
                  <div className="font-pixel text-lg text-blossom-600 mt-0.5">
                    {rule.penalty}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RoughBox>
      </section>

      {/* Discord Boost Rewards: Bloom I – IV */}
      <section id="boost-rewards" aria-labelledby="boost-rewards-heading">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="font-handwriting text-lg font-semibold text-blossom-600 mb-1">
              discord perks
            </p>
            <h2
              id="boost-rewards-heading"
              className="font-display-tight text-3xl md:text-4xl text-ink"
            >
              {boostRewards.heading}
            </h2>
            <p className="mt-3 text-base text-ink-soft leading-relaxed">
              {boostRewards.sub}
            </p>
          </div>
          <StickerButton href={links.discord} external variant="primary" size="md">
            {boostRewards.claimCta}
          </StickerButton>
        </div>

        {/* Active boost requirement callout */}
        <RoughBox
          seed={750}
          bgClassName="bg-blossom-50"
          padding="p-4 sm:p-5"
          className="mb-8 shadow-[3px_3px_0_var(--color-ink)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-blossom-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="font-display font-bold text-ink text-sm sm:text-base">
                {boostRewards.requirementBanner}
              </p>
            </div>
            <Stamp text="ACTIVE BOOST REQUIRED" rotation={-2} size="sm" className="shrink-0 bg-paper" />
          </div>
        </RoughBox>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {boostRewards.tiers.map((tier, idx) => (
            <div key={tier.id} className="relative">
              <div className="pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
                <WashiTape
                  rotation={idx % 2 === 0 ? -3 : 3}
                  length={76}
                  color="#FF8FAB"
                />
              </div>
              <RoughBox
                seed={770 + idx}
                bgClassName="bg-paper"
                padding="p-5 pt-6"
                className="shadow-[3px_4px_0_var(--color-ink)] h-full flex flex-col"
              >
                <h3 className="font-display-tight text-2xl text-ink">{tier.name}</h3>
                <p className="mt-1 font-pixel text-3xl text-blossom-600">
                  {tier.ramGb} GB RAM
                </p>
                <p className="mt-2 font-handwriting text-base font-bold text-ink">
                  {tier.boostsRequired}{" "}
                  {tier.boostsRequired === 1 ? "Active Boost" : "Active Boosts"}
                </p>
                <ul className="mt-4 pt-3 border-t border-dashed border-paper-line space-y-1.5 text-xs text-ink-soft">
                  {boostRewards.specs.map((spec) => (
                    <li key={spec} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-moss shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </RoughBox>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
