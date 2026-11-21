import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { ExternalLink, Menu } from "lucide-react";
import { brand, isTodo, links, nav } from "@/content";
import { Nodey, StickerButton, WashiTape } from "@/components/sketch";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Nav() {
  const location = useLocation();
  const [scrolled, setScrolled] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const lastYRef = React.useRef(0);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastYRef.current;
      setScrolled(y > 80);

      const storyEl = document.getElementById("story");
      let inStoryPin = false;
      if (storyEl && location.pathname === "/") {
        const rect = storyEl.getBoundingClientRect();
        inStoryPin = rect.top <= 0 && rect.bottom > window.innerHeight * 0.6;
      }

      if (y <= 40) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      } else if (inStoryPin && delta >= 0) {
        setHidden(true);
      }
      lastYRef.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  const isDev = Boolean(import.meta.env?.DEV);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-transform duration-300",
        hidden ? "-translate-y-[125%]" : "translate-y-0",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3">
        <div
          className={cn(
            "relative flex items-center justify-between gap-3 xl:gap-5 px-3.5 xl:px-4 py-2.5 transition-all duration-200",
            scrolled
              ? "bg-paper border-2 border-ink shadow-[4px_4px_0_var(--color-ink)] rounded-sm"
              : "bg-transparent border-2 border-transparent",
          )}
        >
          {scrolled && (
            <div className="pointer-events-none absolute -top-3 right-10 hidden sm:block">
              <WashiTape rotation={5} length={72} />
            </div>
          )}

          {/* Zone 1: Brand logo */}
          <Link
            to="/"
            onClick={() => setSheetOpen(false)}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-ink focus-visible:outline-offset-4 rounded-sm"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-paper shadow-[2px_2px_0_var(--color-ink)] transition-transform duration-200 group-hover:-rotate-6">
              <Nodey size={26} boil={false} />
            </span>
            <span className="font-display-tight text-xl text-ink lowercase">
              {brand.logoText}
            </span>
          </Link>

          {/* Zone 2: Desktop nav links */}
          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center gap-3.5 xl:gap-6 text-[13px] xl:text-[15px] font-bold text-ink"
          >
            {nav.routeItems.map((item) => {
              const active =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "whitespace-nowrap shrink-0 hover:text-blossom-600 transition-colors underline-offset-4 hover:underline decoration-wavy decoration-blossom-600",
                    active && "text-blossom-600 underline",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            {nav.externalItems.map((item) => {
              const todo = isTodo(item.href);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (todo) e.preventDefault();
                  }}
                  title={todo && isDev ? "TODO: link" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1 whitespace-nowrap shrink-0 hover:text-blossom-600 transition-colors underline-offset-4 hover:underline decoration-wavy decoration-blossom-600",
                    todo && isDev && "border-b border-dashed border-blossom-600/60",
                  )}
                >
                  <span>{item.label}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Client Area CTA + Mobile Sheet */}
          <div className="flex items-center gap-3 shrink-0">
            <StickerButton
              href={nav.ctaHref}
              external
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex"
            >
              {nav.ctaLabel}
            </StickerButton>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-sm border-2 border-ink bg-paper text-ink shadow-[2px_2px_0_var(--color-ink)] hover:bg-blossom-50 cursor-pointer"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </button>
              </SheetTrigger>
              <SheetContent>
                <SheetTitle className="font-handwriting text-2xl font-bold text-ink mb-6">
                  {brand.logoText} notebook
                </SheetTitle>
                <nav aria-label="Mobile" className="flex flex-col gap-3 flex-1 overflow-y-auto">
                  {nav.routeItems.map((item) => {
                    const active =
                      item.to === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setSheetOpen(false)}
                        className={cn(
                          "font-handwriting text-xl font-semibold text-ink hover:text-blossom-600 py-1",
                          active && "text-blossom-600 underline decoration-wavy",
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                  {nav.externalItems.map((item) => {
                    const todo = isTodo(item.href);
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (todo) e.preventDefault();
                          setSheetOpen(false);
                        }}
                        title={todo && isDev ? "TODO: link" : undefined}
                        className="inline-flex items-center gap-2 font-handwriting text-xl font-semibold text-ink hover:text-blossom-600 py-1"
                      >
                        <span>{item.label}</span>
                        <ExternalLink className="h-4 w-4 opacity-70" aria-hidden="true" />
                      </a>
                    );
                  })}
                </nav>
                <div className="pt-5 border-t border-dashed border-paper-line space-y-2.5">
                  <StickerButton
                    href={nav.ctaHref}
                    external
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => setSheetOpen(false)}
                  >
                    {nav.ctaLabel}
                  </StickerButton>
                  <StickerButton
                    href={links.gamePanel}
                    external
                    variant="outline"
                    size="md"
                    className="w-full"
                    onClick={() => setSheetOpen(false)}
                  >
                    Game Panel
                  </StickerButton>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
