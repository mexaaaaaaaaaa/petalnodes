import * as React from "react";
import { finalCta } from "@/content";
import { Nodey, RoughBox, StickerButton } from "@/components/sketch";

export function FinalCTA() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 md:py-24"
    >
      <RoughBox
        seed={512}
        bgClassName="bg-paper-shade"
        padding="p-8 md:p-12"
        drawIn
        className="shadow-[5px_6px_0_var(--color-ink)]"
      >
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="shrink-0 flex justify-center">
            <Nodey size={104} holdingSapling boil />
          </div>

          <div className="text-center md:text-left flex-1">
            <h2
              id="final-cta-heading"
              className="font-display-tight text-3xl md:text-5xl text-ink"
            >
              {finalCta.heading}
            </h2>
            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <StickerButton
                href={finalCta.primaryHref}
                external
                variant="primary"
                size="lg"
              >
                {finalCta.primaryLabel}
              </StickerButton>
              <StickerButton
                href={finalCta.secondaryHref}
                external
                variant="outline"
                size="lg"
              >
                {finalCta.secondaryLabel}
              </StickerButton>
            </div>
          </div>
        </div>
      </RoughBox>
    </section>
  );
}
