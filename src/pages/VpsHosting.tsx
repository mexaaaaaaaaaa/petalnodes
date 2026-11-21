import * as React from "react";
import { Check, MapPin } from "lucide-react";
import { isTodo, links, vpsPlans, vpsSection } from "@/content";
import {
  RoughBox,
  RoughUnderline,
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

const VPS_TILTS = [-0.6, 0.5, 0, -0.5, 0.7];

export default function VpsHosting() {
  const parts = vpsSection.heading.split(vpsSection.highlightWord);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <header className="max-w-3xl mb-14">
        <p className="font-handwriting text-lg font-semibold text-blossom-600 mb-2">
          {vpsSection.eyebrow}
        </p>
        <h1 className="font-display-tight text-4xl sm:text-5xl md:text-6xl text-ink">
          {parts[0]}
          <RoughUnderline drawIn>{vpsSection.highlightWord}</RoughUnderline>
          {parts.slice(1).join(vpsSection.highlightWord)}
        </h1>
        <p className="mt-5 text-lg text-ink-soft leading-relaxed">
          {vpsSection.sub}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <StickerButton href={links.store} external variant="primary" size="md">
            Open Billing Store
          </StickerButton>
          <StickerButton to="/locations" variant="outline" size="md">
            View Server Locations
          </StickerButton>
          <a
            href="#vps-compare-heading"
            className="text-sm font-bold text-ink underline decoration-wavy decoration-blossom-400 underline-offset-4 hover:text-blossom-600 px-2"
          >
            Compare all 5 nodes ↓
          </a>
        </div>
      </header>

      {/* 5 Cherry Blossom VPS Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-7 items-stretch">
        {vpsPlans.map((plan, idx) => {
          const directTodo = isTodo(plan.paymenterUrl);
          const ctaHref = directTodo ? links.store : plan.paymenterUrl;
          const ctaLabel = directTodo ? "Order via Billing Store →" : vpsSection.cardCta;

          return (
            <article
              key={plan.id}
              data-vps-plan={plan.id}
              style={{ transform: `rotate(${VPS_TILTS[idx % VPS_TILTS.length]}deg)` }}
              className="relative flex flex-col transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                <WashiTape rotation={idx % 2 === 0 ? -3 : 4} length={82} />
              </div>

              <RoughBox
                seed={801 + idx}
                bgClassName="bg-paper-shade"
                padding="p-6 pt-7"
                className="flex-1 flex flex-col shadow-[4px_5px_0_var(--color-ink)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-display-tight text-2xl text-ink">{plan.name}</h2>
                    <p className="mt-1 font-pixel text-4xl leading-none text-blossom-600 tabular-nums">
                      {plan.ramGb} GB
                      <span className="ml-1.5 font-sans text-xs font-bold uppercase tracking-wider text-ink-soft">
                        RAM
                      </span>
                    </p>
                  </div>
                  <span className="font-handwriting text-xs font-bold border border-ink/40 bg-paper px-2 py-0.5 rounded-sm text-ink">
                    KVM Linux
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-ink-soft min-h-[2.6rem]">
                  {plan.cardLine}
                </p>

                <dl className="mt-4 space-y-2 border-y border-dashed border-paper-line py-3 text-sm tabular-nums">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-ink-soft font-semibold">Compute</dt>
                    <dd className="font-pixel text-base text-ink">{plan.vcpu}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-ink-soft font-semibold">Storage</dt>
                    <dd className="font-pixel text-base text-ink">{plan.storage}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-ink-soft font-semibold">Access</dt>
                    <dd className="font-semibold text-ink">Full Root KVM</dd>
                  </div>
                </dl>

                <ul className="mt-4 space-y-1.5 text-xs text-ink-soft">
                  {vpsSection.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-moss shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-5">
                  <div className="mb-3 font-pixel text-2xl text-ink tabular-nums">
                    {plan.priceMonthly}
                    <span className="text-sm text-ink-soft">/mo</span>
                  </div>
                  <StickerButton
                    href={ctaHref}
                    external
                    variant={idx === 0 ? "primary" : "outline"}
                    size="md"
                    className="w-full"
                  >
                    {ctaLabel}
                  </StickerButton>
                  {directTodo && (
                    <p className="mt-2 text-center font-mono text-[11px] text-ink-soft">
                      Direct plan link pending · select {plan.name} at billing.petalnodes.cloud
                    </p>
                  )}
                </div>
              </RoughBox>
            </article>
          );
        })}
      </div>

      {/* VPS Comparison Table */}
      <section aria-labelledby="vps-compare-heading" className="mt-20">
        <h2
          id="vps-compare-heading"
          className="font-display-tight text-3xl md:text-4xl text-ink mb-6"
        >
          Compare every VPS node
        </h2>
        <RoughBox
          seed={820}
          bgClassName="bg-paper"
          padding="p-0"
          className="overflow-hidden shadow-[4px_5px_0_var(--color-ink)]"
        >
          <div className="notebook-ruled overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm tabular-nums">
              <thead>
                <tr className="border-b-2 border-ink bg-paper-shade/85">
                  <th scope="col" className="sticky left-0 z-20 bg-paper-shade px-4 py-4 font-display-tight text-base text-ink border-r-2 border-blossom-200 min-w-[155px]">
                    Specification
                  </th>
                  {vpsPlans.map((p) => (
                    <th key={p.id} scope="col" className="px-4 py-4 font-display-tight text-lg text-ink">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-line/80">
                <tr>
                  <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">RAM</th>
                  {vpsPlans.map((p) => (
                    <td key={p.id} className="px-4 py-3.5 font-pixel text-xl text-blossom-600">{p.ramGb} GB</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">vCPU</th>
                  {vpsPlans.map((p) => (
                    <td key={p.id} className="px-4 py-3.5 font-pixel text-base text-ink">{p.vcpu}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">NVMe Storage</th>
                  {vpsPlans.map((p) => (
                    <td key={p.id} className="px-4 py-3.5 font-pixel text-base text-ink">{p.storage}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">Virtualization</th>
                  {vpsPlans.map((p) => (
                    <td key={p.id} className="px-4 py-3.5 text-ink">KVM · Linux OS · Root</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">Protection &amp; Backups</th>
                  {vpsPlans.map((p) => (
                    <td key={p.id} className="px-4 py-3.5 text-ink-soft">IPv4 Subject to Availability · Daily Backups</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">Price</th>
                  {vpsPlans.map((p) => (
                    <td key={p.id} className="px-4 py-3.5 font-pixel text-lg text-ink">{p.priceMonthly}/mo</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-4 font-bold text-ink border-r-2 border-blossom-200">Deploy</th>
                  {vpsPlans.map((p) => {
                    const href = isTodo(p.paymenterUrl) ? links.store : p.paymenterUrl;
                    return (
                      <td key={p.id} className="px-4 py-4">
                        <StickerButton href={href} external variant="outline" size="sm">
                          {p.name}
                        </StickerButton>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </RoughBox>
      </section>

      {/* Recommended KVM Use Cases */}
      <section aria-labelledby="vps-usecases-heading" className="mt-20">
        <h2 id="vps-usecases-heading" className="font-display-tight text-3xl text-ink mb-6">
          What People Build on Cherry Blossom VPS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {vpsSection.useCases.map((uc, idx) => (
            <RoughBox
              key={uc.title}
              seed={830 + idx}
              bgClassName="bg-paper-shade"
              padding="p-6"
              className="shadow-[3px_4px_0_var(--color-ink)]"
            >
              <p className="font-handwriting text-sm font-bold text-blossom-600">
                Suggested: {uc.recommendedTier}
              </p>
              <h3 className="mt-1 font-display-tight text-xl text-ink">{uc.title}</h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{uc.detail}</p>
            </RoughBox>
          ))}
        </div>
      </section>

      {/* Infrastructure & Location Availability */}
      <section aria-labelledby="vps-infra-heading" className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-7">
        <RoughBox
          seed={840}
          bgClassName="bg-paper-shade"
          padding="p-6 sm:p-8"
          className="lg:col-span-8 shadow-[4px_5px_0_var(--color-ink)]"
        >
          <h2 id="vps-infra-heading" className="font-display-tight text-2xl md:text-3xl text-ink">
            {vpsSection.infrastructureHeading}
          </h2>
          <p className="mt-2 text-base text-ink-soft max-w-3xl leading-relaxed">
            {vpsSection.infrastructureNote}
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {vpsSection.infrastructureItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5 border border-ink/25 bg-paper rounded-sm px-4 py-3 font-semibold text-sm text-ink"
              >
                <Check className="h-4 w-4 text-moss shrink-0" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </RoughBox>

        <RoughBox
          seed={845}
          bgClassName="bg-paper"
          padding="p-6 sm:p-8"
          className="lg:col-span-4 shadow-[4px_5px_0_var(--color-ink)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-blossom-600 mb-2">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="font-handwriting text-sm font-bold">
                global nodes
              </span>
            </div>
            <h2 className="font-display-tight text-2xl text-ink">
              {vpsSection.locationAvailability.heading}
            </h2>
            <ul className="mt-4 space-y-2 text-sm font-bold text-ink">
              {vpsSection.locationAvailability.regions.map((r) => (
                <li key={r} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-moss shrink-0" aria-hidden="true" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-ink-soft leading-relaxed">
              {vpsSection.locationAvailability.note}
            </p>
          </div>
          <div className="mt-5">
            <StickerButton to="/locations" variant="outline" size="sm" className="w-full">
              Explore Network Regions →
            </StickerButton>
          </div>
        </RoughBox>
      </section>

      {/* Cross-Category Comparison */}
      <HostingComparison headingId="vps-service-compare" />

      {/* VPS FAQs */}
      <section aria-labelledby="vps-faq-heading" className="mt-20 mx-auto max-w-3xl">
        <h2 id="vps-faq-heading" className="font-display-tight text-3xl text-ink mb-6">
          VPS Hosting Questions
        </h2>
        <Accordion type="single" collapsible className="space-y-3">
          {vpsSection.faqs.map((item, idx) => (
            <AccordionItem key={item.question} value={`vps-faq-${idx}`}>
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
