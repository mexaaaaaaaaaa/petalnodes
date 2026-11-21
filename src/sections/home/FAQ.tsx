import * as React from "react";
import { faq, isTodo } from "@/content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Stamp } from "@/components/sketch";

export function FAQ({
  filterIds,
  className,
}: {
  filterIds?: number[];
  className?: string;
}) {
  const items = React.useMemo(() => {
    if (!filterIds || filterIds.length === 0) return faq.items;
    return filterIds
      .map((id) => faq.items.find((item) => item.id === id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [filterIds]);

  return (
    <section
      aria-labelledby="faq-heading"
      className={className ?? "mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 md:py-24"}
    >
      <h2
        id="faq-heading"
        className="font-display-tight text-3xl md:text-4xl text-ink mb-8"
      >
        {faq.heading}
      </h2>

      <Accordion type="single" collapsible className="space-y-3">
        {items.map((item) => (
          <AccordionItem key={item.id} value={`faq-${item.id}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              <p>{item.answer}</p>
              {isTodo(item.answer) && (
                <div className="mt-2">
                  <Stamp text="TODO" rotation={-3} size="sm" />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
