import * as React from "react";
import { serviceComparison } from "@/content";
import { RoughBox } from "@/components/sketch";

export interface HostingComparisonProps {
  className?: string;
  headingId?: string;
}

export function HostingComparison({
  className = "mt-20",
  headingId = "service-compare-heading",
}: HostingComparisonProps) {
  return (
    <section aria-labelledby={headingId} className={className}>
      <div className="max-w-2xl mb-6">
        <h2
          id={headingId}
          className="font-display-tight text-3xl md:text-4xl text-ink"
        >
          {serviceComparison.heading}
        </h2>
        <p className="mt-2 text-base text-ink-soft leading-relaxed">
          {serviceComparison.sub}
        </p>
      </div>

      <RoughBox
        seed={870}
        bgClassName="bg-paper"
        padding="p-0"
        className="overflow-hidden shadow-[4px_5px_0_var(--color-ink)]"
      >
        <div className="notebook-ruled overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink bg-paper-shade/85">
                <th
                  scope="col"
                  className="sticky left-0 z-20 bg-paper-shade px-4 py-4 font-display-tight text-base text-ink border-r-2 border-blossom-200 min-w-[155px]"
                >
                  Dimension
                </th>
                <th scope="col" className="px-4 py-4 font-display-tight text-lg text-ink">
                  Minecraft Hosting
                </th>
                <th scope="col" className="px-4 py-4 font-display-tight text-lg text-ink">
                  KVM VPS Hosting
                </th>
                <th scope="col" className="px-4 py-4 font-display-tight text-lg text-blossom-600">
                  Bot Hosting (Draft)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-line/80">
              {serviceComparison.rows.map((row) => (
                <tr key={row.feature}>
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-paper px-4 py-3.5 font-bold text-ink border-r-2 border-blossom-200"
                  >
                    {row.feature}
                  </th>
                  <td className="px-4 py-3.5 text-ink">{row.minecraft}</td>
                  <td className="px-4 py-3.5 text-ink">{row.vps}</td>
                  <td className="px-4 py-3.5 text-ink-soft">{row.bots}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RoughBox>
    </section>
  );
}
