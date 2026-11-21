import * as React from "react";
import { Check, Clock, MapPin, Shield } from "lucide-react";
import { botHosting, links } from "@/content";
import {
  RoughBox,
  RoughUnderline,
  Stamp,
  StickerButton,
  WashiTape,
} from "@/components/sketch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HostingComparison } from "@/sections/shared/HostingComparison";
import { cn } from "@/lib/utils";

export default function BotHosting() {
  const parts = botHosting.heading.split(botHosting.highlightWord);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <header className="max-w-3xl mb-12">
        <p className="font-handwriting text-lg font-semibold text-blossom-600 mb-2">
          {botHosting.eyebrow}
        </p>
        <h1 className="font-display-tight text-4xl sm:text-5xl md:text-6xl text-ink">
          {parts[0]}
          <RoughUnderline drawIn>{botHosting.highlightWord}</RoughUnderline>
          {parts.slice(1).join(botHosting.highlightWord)}
        </h1>
        <p className="mt-5 text-lg text-ink-soft leading-relaxed">
          {botHosting.sub}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <StickerButton href={links.discord} external variant="primary" size="md">
            Register Interest on Discord
          </StickerButton>
          <StickerButton to="/vps" variant="outline" size="md">
            Need Full Root Now? View VPS Plans →
          </StickerButton>
        </div>
      </header>

      {/* Owner confirmation banner + Miami Infrastructure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14">
        <RoughBox
          seed={901}
          bgClassName="bg-blossom-50"
          padding="p-5 sm:p-6"
          className="lg:col-span-7 shadow-[4px_4px_0_var(--color-ink)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <h2 className="font-display-tight text-xl text-ink">
                Proposed Botanical Lineup — Pending Owner Approval
              </h2>
              <p className="text-sm text-ink-soft leading-relaxed">
                {botHosting.draftNotice}
              </p>
              <p className="text-xs font-handwriting text-blossom-600 pt-1">
                {botHosting.proposedNamingNote}
              </p>
            </div>
            <Stamp text="DRAFT / TODO" rotation={-4} size="md" className="shrink-0 bg-paper" />
          </div>
        </RoughBox>

        <RoughBox
          seed={904}
          bgClassName="bg-paper"
          padding="p-5 sm:p-6"
          className="lg:col-span-5 shadow-[4px_4px_0_var(--color-ink)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-blossom-600">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="font-handwriting text-sm font-bold">
                {botHosting.infrastructureLocation}
              </span>
            </div>
            <h2 className="mt-1 font-display-tight text-xl text-ink">
              Miami VPS Infrastructure
            </h2>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">
              {botHosting.infrastructureNote}
            </p>
          </div>
          <p className="mt-3 pt-2.5 border-t border-dashed border-paper-line text-xs text-ink-soft">
            {botHosting.fairUseNote}
          </p>
        </RoughBox>
      </div>

      {/* 5 Proposed Botanical Plans */}
      <section aria-labelledby="bot-plans-heading" className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 id="bot-plans-heading" className="font-display-tight text-3xl md:text-4xl text-ink">
              Proposed Bot Hosting Tiers (Pollen → Blossom)
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Guaranteed container RAM paired with shared fair-use vCPU limits on NVMe storage.
            </p>
          </div>
          <span className="font-handwriting text-sm text-blossom-600">
            {botHosting.supportedRuntimesTodo}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 items-stretch">
          {botHosting.plans.map((tier, idx) => (
            <article
              key={tier.id}
              data-bot-plan={tier.id}
              className="relative flex flex-col"
            >
              <div className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                <WashiTape
                  rotation={idx % 2 === 0 ? -3 : 4}
                  length={80}
                  color={tier.recommended ? "#FF8FAB" : "#FFC9D6"}
                />
              </div>

              <RoughBox
                seed={920 + idx}
                bgClassName={tier.recommended ? "bg-paper" : "bg-paper-shade"}
                padding="p-6 pt-7"
                strokeWidth={tier.recommended ? 2.4 : 1.9}
                className={cn(
                  "shadow-[4px_5px_0_var(--color-ink)] flex-1 flex flex-col",
                  tier.recommended && "ring-2 ring-blossom-400/50 ring-offset-4 ring-offset-paper",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display-tight text-2xl text-ink">
                      {tier.proposedName}
                    </h3>
                    <p className="mt-1 font-pixel text-2xl text-blossom-600">
                      {tier.ram}
                    </p>
                  </div>
                  <Stamp
                    text={tier.recommended ? "PROPOSED PICK" : "DRAFT"}
                    rotation={5}
                    size="sm"
                  />
                </div>

                <p className="mt-2.5 text-sm text-ink-soft leading-relaxed min-h-[2.6rem]">
                  {tier.useCase}
                </p>

                <dl className="mt-4 space-y-2 border-y border-dashed border-paper-line py-3 text-sm tabular-nums">
                  <div className="flex justify-between gap-2">
                    <dt className="text-ink-soft font-semibold">CPU Limit</dt>
                    <dd className="font-pixel text-ink text-right">{tier.cpu}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-ink-soft font-semibold">Storage</dt>
                    <dd className="font-pixel text-ink">{tier.storage}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-ink-soft font-semibold">Location</dt>
                    <dd className="font-semibold text-ink">Miami, USA</dd>
                  </div>
                </dl>

                <div className="mt-auto pt-5">
                  <div className="mb-3 flex items-baseline justify-between gap-2">
                    <div>
                      <span className="font-pixel text-2xl text-ink tabular-nums">
                        {tier.priceMonthly}
                      </span>
                      <span className="text-xs text-ink-soft">/mo (proposed)</span>
                    </div>
                  </div>
                  <StickerButton
                    disabled
                    variant="outline"
                    size="md"
                    className="w-full"
                    aria-label={`${tier.proposedName} awaiting owner launch approval`}
                  >
                    Draft — Awaiting Approval
                  </StickerButton>
                </div>
              </RoughBox>
            </article>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section aria-labelledby="bot-compare-heading" className="mb-16">
        <h2 id="bot-compare-heading" className="font-display-tight text-3xl text-ink mb-6">
          Bot Hosting Tier Progression (Draft)
        </h2>
        <RoughBox
          seed={935}
          bgClassName="bg-paper"
          padding="p-0"
          className="overflow-hidden shadow-[4px_5px_0_var(--color-ink)]"
        >
          <div className="notebook-ruled overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse text-left text-sm tabular-nums">
              <thead>
                <tr className="border-b-2 border-ink bg-paper-shade/85">
                  <th scope="col" className="sticky left-0 z-20 bg-paper-shade px-4 py-4 font-display-tight text-base text-ink border-r-2 border-blossom-200 min-w-[165px]">
                    Specification
                  </th>
                  {botHosting.plans.map((p) => (
                    <th key={p.id} scope="col" className="px-4 py-4 font-display-tight text-lg text-ink">
                      {p.proposedName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-line/80">
                <tr>
                  <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">Guaranteed RAM</th>
                  {botHosting.plans.map((p) => <td key={p.id} className="px-4 py-3.5 font-pixel text-blossom-600">{p.ram}</td>)}
                </tr>
                <tr>
                  <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">Shared CPU (Fair-Use)</th>
                  {botHosting.plans.map((p) => <td key={p.id} className="px-4 py-3.5 font-pixel text-ink">{p.cpu}</td>)}
                </tr>
                <tr>
                  <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">NVMe Storage</th>
                  {botHosting.plans.map((p) => <td key={p.id} className="px-4 py-3.5 font-pixel text-ink">{p.storage}</td>)}
                </tr>
                <tr>
                  <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">Infrastructure</th>
                  {botHosting.plans.map((p) => <td key={p.id} className="px-4 py-3.5 text-ink-soft">Miami, USA · DDoS Protection</td>)}
                </tr>
                <tr>
                  <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">Use Case</th>
                  {botHosting.plans.map((p) => <td key={p.id} className="px-4 py-3.5 text-ink-soft">{p.useCase}</td>)}
                </tr>
                <tr>
                  <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">Proposed Price</th>
                  {botHosting.plans.map((p) => <td key={p.id} className="px-4 py-3.5 font-pixel text-ink">{p.priceMonthly}/mo (Draft)</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </RoughBox>
      </section>

      {/* Confirmed Platform Capabilities vs Proposed Launch Capabilities */}
      <section aria-labelledby="bot-capabilities-heading" className="mb-16">
        <h2 id="bot-capabilities-heading" className="font-display-tight text-3xl text-ink mb-6">
          Confirmed Infrastructure vs. Proposed Bot Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <RoughBox
            seed={945}
            bgClassName="bg-paper"
            padding="p-6"
            className="shadow-[4px_4px_0_var(--color-ink)]"
          >
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-moss shrink-0" aria-hidden="true" />
                <h3 className="font-display-tight text-xl text-ink">
                  Verified Platform Capabilities
                </h3>
              </div>
              <Stamp text="VERIFIED" rotation={3} size="sm" />
            </div>
            <ul className="space-y-2 text-sm text-ink">
              {botHosting.capabilitiesConfirmed.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-moss shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </RoughBox>

          <RoughBox
            seed={948}
            bgClassName="bg-paper-shade"
            padding="p-6"
            className="shadow-[4px_4px_0_var(--color-ink)]"
          >
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blossom-600 shrink-0" aria-hidden="true" />
                <h3 className="font-display-tight text-xl text-ink">
                  Proposed Launch Features
                </h3>
              </div>
              <Stamp text="PROPOSED" rotation={-3} size="sm" />
            </div>
            <ul className="space-y-2 text-sm text-ink-soft">
              {botHosting.capabilitiesProposed.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-blossom-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </RoughBox>
        </div>
      </section>

      {/* Common Bot Hosting Workloads */}
      <section aria-labelledby="bot-usecases-heading" className="mb-16">
        <h2 id="bot-usecases-heading" className="font-display-tight text-3xl text-ink mb-6">
          Workloads Designed for Botanical Containers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {botHosting.useCases.map((uc, i) => (
            <RoughBox
              key={uc.title}
              seed={960 + i}
              bgClassName="bg-paper-shade"
              padding="p-6"
              className="shadow-[3px_4px_0_var(--color-ink)]"
            >
              <p className="font-handwriting text-sm font-bold text-blossom-600">
                {uc.tierHint}
              </p>
              <h3 className="mt-1 font-display-tight text-xl text-ink">{uc.title}</h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{uc.detail}</p>
            </RoughBox>
          ))}
        </div>
      </section>

      {/* Cross-Category Comparison */}
      <HostingComparison headingId="bot-service-compare" className="mb-16" />

      {/* Bot Hosting FAQs */}
      <section aria-labelledby="bot-faq-heading" className="mx-auto max-w-3xl pt-4">
        <h2 id="bot-faq-heading" className="font-display-tight text-3xl text-ink mb-6">
          Bot Hosting Questions
        </h2>
        <Accordion type="single" collapsible className="space-y-3">
          {botHosting.faqs.map((item, idx) => (
            <AccordionItem key={item.question} value={`bot-faq-${idx}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                <p>{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
