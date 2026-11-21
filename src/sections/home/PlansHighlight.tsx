import * as React from "react";
import { Link } from "react-router-dom";
import { highlightPlanIds, plans, plansSection, story } from "@/content";
import { IslandSketchSvg, PolaroidFrame } from "@/components/sketch";
import { PlanCard } from "@/sections/plans/PlanCard";
import { storyStore } from "@/lib/storyStore";

export function PlansHighlight() {
  const [snapshotUrl, setSnapshotUrl] = React.useState<string | null>(
    storyStore.snapshotDataUrl,
  );

  React.useEffect(() => {
    setSnapshotUrl(storyStore.snapshotDataUrl);
    storyStore.onSnapshot = (url) => {
      setSnapshotUrl(url);
    };
    return () => {
      storyStore.onSnapshot = null;
    };
  }, []);

  const featuredPlans = React.useMemo(
    () =>
      highlightPlanIds
        .map((id) => plans.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [],
  );

  const bloomCaption =
    story.chapters.find((c) => c.id === "bloom")?.polaroidCaption ??
    "your world, day 1 of forever";

  return (
    <section
      id="plans-highlight"
      aria-labelledby="plans-highlight-heading"
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24"
    >
      {/* Desktop: heading + sub left, frozen Bloom polaroid right.
          Mobile: heading, sub, polaroid (~70% width), then cards. */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12 mb-12">
        <div className="max-w-xl">
          <h2
            id="plans-highlight-heading"
            className="font-display-tight text-4xl md:text-5xl text-ink"
          >
            {plansSection.homeHeading}
          </h2>
          <p className="mt-4 text-lg text-ink-soft leading-relaxed">
            {plansSection.homeSub}
          </p>
        </div>

        <div className="w-[70%] sm:w-[56%] md:w-[300px] lg:w-[320px] mx-auto md:mx-0 shrink-0">
          <PolaroidFrame caption={bloomCaption} rotation={-3}>
            {snapshotUrl ? (
              <img
                src={snapshotUrl}
                alt="Your Petalnode cherry-blossom island in full bloom"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-paper p-2">
                <IslandSketchSvg stage={5} />
              </div>
            )}
          </PolaroidFrame>
        </div>
      </div>

      {/* Three taped index cards: Sprout, Sapling (middle, larger & straighter), Blossom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-stretch">
        {featuredPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            variant="compact"
            tiltDeg={plan.ourPick ? 0 : plan.id === "sprout" ? -1.4 : 1.4}
            className={
              plan.ourPick
                ? "md:scale-[1.04] md:-translate-y-2 z-10"
                : "md:translate-y-2"
            }
          />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
        <Link
          to="/plans"
          className="inline-flex items-center gap-2 font-display text-lg font-bold text-ink hover:text-blossom-600 underline decoration-wavy decoration-blossom-400 underline-offset-4 transition-colors"
        >
          {plansSection.seeAllLabel}
        </Link>
        <Link
          to="/vps"
          className="inline-flex items-center gap-2 font-display text-base font-bold text-ink-soft hover:text-blossom-600 underline decoration-dashed underline-offset-4 transition-colors"
        >
          Explore KVM VPS plans →
        </Link>
        <Link
          to="/bots"
          className="inline-flex items-center gap-2 font-display text-base font-bold text-ink-soft hover:text-blossom-600 underline decoration-dashed underline-offset-4 transition-colors"
        >
          Preview Bot Hosting (Miami) →
        </Link>
        <Link
          to="/plans#free-rewards"
          className="inline-flex items-center gap-2 font-display text-base font-bold text-ink-soft hover:text-blossom-600 underline decoration-dashed underline-offset-4 transition-colors"
        >
          Petal &amp; Bloom Discord rewards →
        </Link>
      </div>
    </section>
  );
}
