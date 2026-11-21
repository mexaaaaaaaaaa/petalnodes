import * as React from "react";
import { contactPage, links } from "@/content";
import {
  RoughBox,
  RoughUnderline,
  Stamp,
  StickerButton,
  WashiTape,
} from "@/components/sketch";

export default function Contact() {
  const parts = contactPage.heading.split(contactPage.highlightWord);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <header className="max-w-2xl mb-12">
        <p className="font-handwriting text-lg font-semibold text-blossom-600 mb-2">
          {contactPage.eyebrow}
        </p>
        <h1 className="font-display-tight text-4xl sm:text-5xl md:text-6xl text-ink">
          {parts[0]}
          <RoughUnderline drawIn>{contactPage.highlightWord}</RoughUnderline>
          {parts.slice(1).join(contactPage.highlightWord)}
        </h1>
        <p className="mt-5 text-lg text-ink-soft leading-relaxed">
          {contactPage.sub}
        </p>
      </header>

      {/* Support Channel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-12">
        {contactPage.channels.map((ch, idx) => (
          <div key={ch.id} className="relative">
            <div className="pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
              <WashiTape rotation={idx === 1 ? 0 : idx === 0 ? -4 : 4} length={78} />
            </div>
            <RoughBox
              seed={1310 + idx}
              bgClassName="bg-paper-shade"
              padding="p-6 pt-7"
              className="h-full flex flex-col shadow-[4px_5px_0_var(--color-ink)]"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display-tight text-2xl text-ink">{ch.title}</h2>
                <Stamp text={ch.stamp} rotation={5} size="sm" />
              </div>
              <p className="mt-3 text-sm text-ink-soft leading-relaxed flex-1">
                {ch.description}
              </p>
              <div className="mt-6">
                <StickerButton
                  href={links[ch.hrefKey]}
                  external
                  variant={idx === 0 ? "primary" : "outline"}
                  size="md"
                  className="w-full"
                >
                  {ch.ctaLabel}
                </StickerButton>
              </div>
            </RoughBox>
          </div>
        ))}
      </div>

      {/* Honest TODO Notice for Email & Hours */}
      <RoughBox
        seed={1330}
        bgClassName="bg-blossom-50"
        padding="p-6"
        className="shadow-[4px_4px_0_var(--color-ink)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h2 className="font-display-tight text-xl text-ink">
              Email &amp; Support Hours (Awaiting Confirmation)
            </h2>
            <p className="text-sm text-ink-soft">{contactPage.emailTodo}</p>
            <p className="text-sm text-ink-soft">{contactPage.hoursTodo}</p>
          </div>
          <Stamp text="TODO" rotation={-4} size="md" className="shrink-0 bg-paper" />
        </div>
      </RoughBox>
    </div>
  );
}
