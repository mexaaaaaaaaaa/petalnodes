import * as React from "react";
import { isTodo, plans, plansSection } from "@/content";
import { RoughBox, Stamp, StickerButton } from "@/components/sketch";
import { cn } from "@/lib/utils";

export function CompareTable() {
  return (
    <section aria-labelledby="compare-heading" className="mt-20">
      <h2
        id="compare-heading"
        className="font-display-tight text-3xl md:text-4xl text-ink mb-6"
      >
        {plansSection.compareHeading}
      </h2>

      <RoughBox
        seed={304}
        bgClassName="bg-paper"
        padding="p-0"
        className="overflow-hidden shadow-[4px_5px_0_var(--color-ink)]"
      >
        <div className="notebook-ruled overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink bg-paper-shade/85">
                <th
                  scope="col"
                  className="sticky left-0 z-20 bg-paper-shade px-4 py-4 font-display-tight text-base text-ink border-r-2 border-blossom-200 min-w-[155px]"
                >
                  Feature
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    scope="col"
                    className={cn(
                      "px-4 py-4 font-display-tight text-lg text-ink align-bottom",
                      plan.ourPick && "bg-blossom-50/70",
                    )}
                  >
                    <div className="flex flex-col items-start gap-1">
                      {plan.ourPick && (
                        <Stamp text={plansSection.ourPickLabel} rotation={-4} size="sm" />
                      )}
                      <span>{plan.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-line/80">
              <tr>
                <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">
                  RAM
                </th>
                {plans.map((plan) => (
                  <td
                    key={plan.id}
                    className={cn("px-4 py-3.5 font-pixel text-xl text-blossom-600", plan.ourPick && "bg-blossom-50/50")}
                  >
                    {plan.ramGb} GB
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">
                  CPU
                </th>
                {plans.map((plan) => (
                  <td
                    key={plan.id}
                    className={cn("px-4 py-3.5 font-pixel text-base text-ink", plan.ourPick && "bg-blossom-50/50")}
                  >
                    {plan.cpu}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">
                  Storage
                </th>
                {plans.map((plan) => (
                  <td
                    key={plan.id}
                    className={cn("px-4 py-3.5 font-pixel text-base text-ink", plan.ourPick && "bg-blossom-50/50")}
                  >
                    {plan.storage}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">
                  Editions
                </th>
                {plans.map((plan) => (
                  <td
                    key={plan.id}
                    className={cn("px-4 py-3.5 text-ink font-semibold", plan.ourPick && "bg-blossom-50/50")}
                  >
                    Java &amp; Bedrock
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">
                  Software
                </th>
                {plans.map((plan) => (
                  <td
                    key={plan.id}
                    className={cn("px-4 py-3.5 text-ink-soft", plan.ourPick && "bg-blossom-50/50")}
                  >
                    Paper, Purpur, Fabric
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">
                  Allocations / DBs
                </th>
                {plans.map((plan) => (
                  <td
                    key={plan.id}
                    className={cn("px-4 py-3.5 text-ink-soft", plan.ourPick && "bg-blossom-50/50")}
                  >
                    2 Allocations · 2 DBs
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">
                  DDoS Protection
                </th>
                {plans.map((plan) => (
                  <td
                    key={plan.id}
                    className={cn("px-4 py-3.5 font-semibold text-moss", plan.ourPick && "bg-blossom-50/50")}
                  >
                    Included
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">
                  Backups
                </th>
                {plans.map((plan) => (
                  <td
                    key={plan.id}
                    className={cn("px-4 py-3.5 text-ink-soft", plan.ourPick && "bg-blossom-50/50")}
                  >
                    Daily Backups Included
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200">
                  Price
                </th>
                {plans.map((plan) => (
                  <td
                    key={plan.id}
                    className={cn("px-4 py-3.5", plan.ourPick && "bg-blossom-50/50")}
                  >
                    {isTodo(plan.priceMonthly) ? (
                      <div className="inline-flex items-center gap-1.5">
                        <span className="font-pixel text-lg text-ink">$— /mo</span>
                        <Stamp text="TODO" rotation={-4} size="sm" />
                      </div>
                    ) : (
                      <span className="font-pixel text-lg text-ink">
                        {plan.priceMonthly}/mo
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-4 font-bold text-ink border-r-2 border-blossom-200">
                  Plant
                </th>
                {plans.map((plan) => (
                  <td
                    key={plan.id}
                    className={cn("px-4 py-4", plan.ourPick && "bg-blossom-50/50")}
                  >
                    <StickerButton
                      href={plan.paymenterUrl}
                      external
                      variant={plan.ourPick ? "primary" : "outline"}
                      size="sm"
                    >
                      {plan.name}
                    </StickerButton>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </RoughBox>
    </section>
  );
}
