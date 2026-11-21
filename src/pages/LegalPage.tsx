import * as React from "react";
import { Link } from "react-router-dom";
import { legalDocs, links } from "@/content";
import {
  RoughBox,
  Stamp,
  StickerButton,
} from "@/components/sketch";
import { cn } from "@/lib/utils";

export interface LegalPageProps {
  docId: "terms" | "privacy" | "sla";
}

const LEGAL_TABS: Array<{ id: "terms" | "privacy" | "sla"; label: string; to: string }> = [
  { id: "terms", label: "Terms of Service", to: "/terms" },
  { id: "privacy", label: "Privacy Policy", to: "/privacy" },
  { id: "sla", label: "Service Level Agreement", to: "/sla" },
];

export default function LegalPage({ docId }: LegalPageProps) {
  const doc = legalDocs[docId];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <nav aria-label="Legal documents" className="mb-8 flex flex-wrap gap-2">
        {LEGAL_TABS.map((tab) => {
          const active = tab.id === docId;
          return (
            <Link
              key={tab.id}
              to={tab.to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "px-3.5 py-2 rounded-sm border-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors",
                active
                  ? "border-ink bg-blossom-100 text-ink shadow-[2px_2px_0_var(--color-ink)]"
                  : "border-ink/30 bg-paper text-ink-soft hover:border-ink hover:text-ink",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <p className="font-handwriting text-lg font-semibold text-blossom-600">
            {doc.eyebrow}
          </p>
          <Stamp text="DRAFT" rotation={-4} size="sm" />
        </div>
        <h1 className="font-display-tight text-4xl sm:text-5xl text-ink">
          {doc.heading}
        </h1>
        <p className="mt-2 font-pixel text-sm text-ink-soft">
          Last updated: {doc.lastUpdated}
        </p>
      </header>

      {/* Owner Review Banner */}
      <RoughBox
        seed={1401}
        bgClassName="bg-blossom-50"
        padding="p-5 sm:p-6"
        className="mb-8 shadow-[4px_4px_0_var(--color-ink)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm font-semibold text-ink leading-relaxed">
            {doc.draftNotice}
          </p>
          <Stamp text="TODO" rotation={4} size="md" className="shrink-0 bg-paper" />
        </div>
      </RoughBox>

      {/* Quick Clause Table of Contents */}
      <RoughBox
        seed={1405}
        bgClassName="bg-paper-shade"
        padding="p-5"
        className="mb-8 shadow-[3px_3px_0_var(--color-ink)]"
      >
        <p className="font-handwriting text-sm font-bold text-blossom-600 mb-2">
          In this draft
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm">
          {doc.sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="font-semibold text-ink hover:text-blossom-600 underline decoration-dashed underline-offset-4"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </RoughBox>

      {/* Legal Clauses */}
      <RoughBox
        seed={1410}
        bgClassName="bg-paper"
        padding="p-6 sm:p-8"
        className="shadow-[4px_5px_0_var(--color-ink)]"
      >
        <div className="space-y-8 divide-y divide-dashed divide-paper-line">
          {doc.sections.map((section, idx) => (
            <section
              key={section.id}
              id={section.id}
              className={idx > 0 ? "pt-6 scroll-mt-24" : "scroll-mt-24"}
            >
              <h2 className="font-display-tight text-2xl text-ink">
                {section.title}
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-ink-soft leading-relaxed">
                {section.body}
              </p>
              {section.todoMarker && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-sm border border-ink/35 bg-paper-shade px-3.5 py-2.5 text-xs font-semibold text-ink">
                  <span>{section.todoMarker}</span>
                  <Stamp text="TODO" rotation={-3} size="sm" className="shrink-0 bg-paper" />
                </div>
              )}
            </section>
          ))}
        </div>
      </RoughBox>

      <div className="mt-10 flex flex-wrap gap-3">
        <StickerButton to="/contact" variant="outline" size="sm">
          Contact &amp; Support
        </StickerButton>
        <StickerButton href={links.discord} external variant="outline" size="sm">
          Ask on Discord
        </StickerButton>
        <StickerButton href={links.clientArea} external variant="outline" size="sm">
          Client Area
        </StickerButton>
      </div>
    </div>
  );
}
