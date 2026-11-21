import * as React from "react";
import { BookOpen, Check, Search } from "lucide-react";
import { docsPage, isTodo, links } from "@/content";
import {
  RoughBox,
  RoughUnderline,
  Stamp,
  StickerButton,
  WashiTape,
} from "@/components/sketch";
import { cn } from "@/lib/utils";

export default function Docs() {
  const [activeCategoryId, setActiveCategoryId] = React.useState<string>(
    docsPage.categories[0]?.id ?? "getting-started",
  );
  const [query, setQuery] = React.useState("");

  const parts = docsPage.heading.split(docsPage.highlightWord);
  const normalizedQuery = query.trim().toLowerCase();

  const matchingCategories = React.useMemo(() => {
    if (!normalizedQuery) {
      return docsPage.categories.filter((c) => c.id === activeCategoryId);
    }
    return docsPage.categories
      .map((cat) => ({
        ...cat,
        articles: cat.articles.filter(
          (art) =>
            cat.title.toLowerCase().includes(normalizedQuery) ||
            cat.description.toLowerCase().includes(normalizedQuery) ||
            art.title.toLowerCase().includes(normalizedQuery) ||
            art.summary.toLowerCase().includes(normalizedQuery) ||
            (art.note?.toLowerCase().includes(normalizedQuery) ?? false) ||
            art.steps.some((s) => s.toLowerCase().includes(normalizedQuery)),
        ),
      }))
      .filter((cat) => cat.articles.length > 0);
  }, [activeCategoryId, normalizedQuery]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <header className="max-w-2xl mb-10">
        <p className="font-handwriting text-lg font-semibold text-blossom-600 mb-2">
          {docsPage.eyebrow}
        </p>
        <h1 className="font-display-tight text-4xl sm:text-5xl md:text-6xl text-ink">
          {parts[0]}
          <RoughUnderline drawIn>{docsPage.highlightWord}</RoughUnderline>
          {parts.slice(1).join(docsPage.highlightWord)}
        </h1>
        <p className="mt-5 text-lg text-ink-soft leading-relaxed">
          {docsPage.sub}
        </p>
      </header>

      {/* Search bar + quick links */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:max-w-md">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft"
            aria-hidden="true"
          />
          <label htmlFor="docs-search" className="sr-only">
            Search documentation
          </label>
          <input
            id="docs-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides (Paper, Fabric, VPS, Bot, backups...)"
            className="w-full rounded-sm border-2 border-ink bg-paper px-10 py-2.5 text-sm font-semibold text-ink placeholder:text-ink-soft/70 shadow-[3px_3px_0_var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-blossom-400"
          />
        </div>

        <div className="flex flex-wrap gap-2.5">
          <StickerButton href={links.gamePanel} external variant="outline" size="sm">
            Game Panel
          </StickerButton>
          <StickerButton href={links.clientArea} external variant="outline" size="sm">
            Client Area
          </StickerButton>
          <StickerButton href={links.status} external variant="outline" size="sm">
            Status
          </StickerButton>
        </div>
      </div>

      {/* Sidebar + Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside aria-label="Documentation categories" className="lg:col-span-4">
          <RoughBox
            seed={1010}
            bgClassName="bg-paper-shade"
            padding="p-4"
            className="shadow-[4px_5px_0_var(--color-ink)]"
          >
            <p className="font-handwriting text-sm font-bold text-blossom-600 px-2 mb-3">
              {docsPage.categories.length} topics · pick a chapter
            </p>
            <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {docsPage.categories.map((cat, idx) => {
                const active = !normalizedQuery && cat.id === activeCategoryId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setQuery("");
                      setActiveCategoryId(cat.id);
                    }}
                    className={cn(
                      "w-full text-left px-3.5 py-2.5 rounded-sm border-2 transition-colors cursor-pointer flex items-center justify-between gap-2",
                      active
                        ? "border-ink bg-blossom-100 text-ink shadow-[2px_2px_0_var(--color-ink)] font-bold"
                        : "border-ink/25 bg-paper text-ink-soft hover:border-ink hover:text-ink font-semibold",
                    )}
                  >
                    <span className="text-sm">
                      <span className="font-pixel text-xs text-blossom-600 mr-2 tabular-nums">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      {cat.title}
                    </span>
                    <BookOpen className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
                  </button>
                );
              })}
            </nav>
          </RoughBox>
        </aside>

        <div className="lg:col-span-8 space-y-8">
          {matchingCategories.length === 0 ? (
            <RoughBox
              seed={1030}
              bgClassName="bg-paper"
              padding="p-8"
              className="shadow-[4px_4px_0_var(--color-ink)] text-center"
            >
              <p className="font-display-tight text-2xl text-ink">
                No matching guide found
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                Try clearing your search or ask our support team on Discord.
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <StickerButton onClick={() => setQuery("")} variant="outline" size="sm">
                  Clear search
                </StickerButton>
                <StickerButton href={links.discord} external variant="primary" size="sm">
                  Ask on Discord
                </StickerButton>
              </div>
            </RoughBox>
          ) : (
            matchingCategories.map((cat, cIdx) => (
              <section key={cat.id} aria-labelledby={`doc-cat-${cat.id}`} className="space-y-5">
                <div className="border-b-2 border-dashed border-paper-line pb-3">
                  <h2
                    id={`doc-cat-${cat.id}`}
                    className="font-display-tight text-3xl text-ink"
                  >
                    {cat.title}
                  </h2>
                  <p className="mt-1 text-sm text-ink-soft">{cat.description}</p>
                </div>

                {cat.articles.map((article, aIdx) => (
                  <article key={article.id} className="relative">
                    <div className="pointer-events-none absolute -top-2.5 left-6 z-20">
                      <WashiTape
                        rotation={(cIdx + aIdx) % 2 === 0 ? -3 : 3}
                        length={74}
                      />
                    </div>
                    <RoughBox
                      seed={1050 + cIdx * 10 + aIdx}
                      bgClassName="bg-paper"
                      padding="p-6 pt-7"
                      className="shadow-[4px_5px_0_var(--color-ink)]"
                    >
                      <h3 className="font-display-tight text-2xl text-ink">
                        {article.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-ink-soft">{article.summary}</p>

                      <ol className="mt-5 space-y-3 border-t border-dashed border-paper-line pt-4">
                        {article.steps.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-3 text-sm text-ink">
                            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-ink bg-moss/15 font-pixel text-xs text-ink">
                              {sIdx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>

                      {article.note && (
                        <div className="mt-5 flex items-center justify-between gap-3 rounded-sm border border-ink/40 bg-blossom-50 px-4 py-3 text-xs text-ink">
                          <div className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-blossom-600 shrink-0 mt-0.5" aria-hidden="true" />
                            <span>{article.note}</span>
                          </div>
                          {isTodo(article.note) && (
                            <Stamp text="TODO" rotation={-4} size="sm" className="shrink-0 bg-paper" />
                          )}
                        </div>
                      )}
                    </RoughBox>
                  </article>
                ))}
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
