import * as React from "react";
import { Check } from "lucide-react";
import {
  isTodo,
  links,
  planIncludes,
  plansSection,
  type Plan,
  type PlanId,
} from "@/content";
import {
  RoughBox,
  Stamp,
  StickerButton,
  WashiTape,
} from "@/components/sketch";
import { cn } from "@/lib/utils";

function PlanGrowthIllustration({ planId }: { planId: PlanId }) {
  return (
    <svg
      viewBox="0 0 64 56"
      width={56}
      height={48}
      aria-hidden="true"
      className="shrink-0 overflow-visible"
    >
      <g
        stroke="#2B2230"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M10 48 Q32 46 54 48" />
        {planId === "seed" && (
          <>
            <path d="M32 47 C32 41 33 36 32 32" />
            <ellipse cx="32" cy="44" rx="5" ry="3.5" fill="#8B5E3C" />
            <path d="M32 34 C26 31 24 34 26 37 C29 38 31 36 32 34 Z" fill="#6FAF5B" />
          </>
        )}
        {planId === "sprout" && (
          <>
            <path d="M32 47 C31 37 33 29 32 23" />
            <path d="M32 32 C22 27 17 30 18 36 C24 38 29 36 32 32 Z" fill="#6FAF5B" />
            <path d="M32 27 C41 21 47 24 46 31 C40 33 35 31 32 27 Z" fill="#6FAF5B" />
          </>
        )}
        {planId === "sapling" && (
          <>
            <path d="M32 47 C31 34 32 24 32 15" stroke="#6B4A3A" strokeWidth="2.6" />
            <path d="M32 34 C21 29 17 32 18 38 C24 39 29 37 32 34 Z" fill="#6FAF5B" />
            <path d="M32 26 C42 20 47 23 46 29 C40 31 35 29 32 26 Z" fill="#6FAF5B" />
            <circle cx="32" cy="14" r="6" fill="#FFC9D6" />
            <circle cx="32" cy="14" r="2" fill="#E2557B" stroke="none" />
          </>
        )}
        {planId === "blossom" && (
          <>
            <path d="M32 47 L32 22 M32 28 L22 21 M32 26 L42 20" stroke="#6B4A3A" strokeWidth="3" />
            <circle cx="22" cy="19" r="8" fill="#FFC9D6" />
            <circle cx="41" cy="18" r="8" fill="#FF8FAB" />
            <circle cx="32" cy="12" r="9.5" fill="#FF8FAB" />
          </>
        )}
        {planId === "grove" && (
          <>
            <path d="M22 47 L22 26 M42 47 L42 24" stroke="#6B4A3A" strokeWidth="2.8" />
            <circle cx="17" cy="24" r="8" fill="#FFC9D6" />
            <circle cx="27" cy="20" r="8.5" fill="#FF8FAB" />
            <circle cx="37" cy="21" r="8" fill="#FF8FAB" />
            <circle cx="47" cy="23" r="8" fill="#FFC9D6" />
            <circle cx="32" cy="14" r="9" fill="#FF8FAB" />
          </>
        )}
        {planId === "orchard" && (
          <>
            <path d="M16 47 L16 28 M32 47 L32 20 M48 47 L48 28" stroke="#6B4A3A" strokeWidth="2.6" />
            <circle cx="15" cy="24" r="8" fill="#FFC9D6" />
            <circle cx="49" cy="24" r="8" fill="#FFC9D6" />
            <circle cx="24" cy="18" r="8.5" fill="#FF8FAB" />
            <circle cx="40" cy="18" r="8.5" fill="#FF8FAB" />
            <circle cx="32" cy="11" r="10" fill="#FF8FAB" />
          </>
        )}
        {planId === "sakura" && (
          <>
            <path d="M32 47 L32 18 M32 30 L17 22 M32 27 L47 21" stroke="#6B4A3A" strokeWidth="3.2" />
            <circle cx="15" cy="20" r="9" fill="#FFC9D6" />
            <circle cx="49" cy="19" r="9" fill="#FFC9D6" />
            <circle cx="24" cy="14" r="9.5" fill="#FF8FAB" />
            <circle cx="40" cy="14" r="9.5" fill="#FF8FAB" />
            <circle cx="32" cy="10" r="10.5" fill="#E2557B" fillOpacity="0.35" />
            <circle cx="26" cy="36" r="1.8" fill="#FF8FAB" stroke="none" />
            <circle cx="42" cy="35" r="1.8" fill="#FFC9D6" stroke="none" />
          </>
        )}
      </g>
    </svg>
  );
}

const PLAN_SEEDS: Record<PlanId, number> = {
  seed: 101,
  sprout: 102,
  sapling: 103,
  blossom: 104,
  grove: 105,
  orchard: 106,
  sakura: 107,
};

export interface PlanCardProps {
  plan: Plan;
  variant?: "compact" | "full";
  tiltDeg?: number;
  className?: string;
}

export function PlanCard({
  plan,
  variant = "compact",
  tiltDeg = 0,
  className,
}: PlanCardProps) {
  const priceIsTodo = isTodo(plan.priceMonthly);
  const urlIsTodo = isTodo(plan.paymenterUrl);

  return (
    <article
      data-plan-id={plan.id}
      style={tiltDeg ? { transform: `rotate(${tiltDeg}deg)` } : undefined}
      className={cn(
        "relative flex flex-col transition-transform duration-200 hover:-translate-y-1",
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 z-20">
        <WashiTape
          rotation={plan.ourPick ? -2 : 4}
          length={plan.ourPick ? 96 : 80}
          color={plan.ourPick ? "#FF8FAB" : "#FFC9D6"}
        />
      </div>

      {plan.ourPick && (
        <div className="absolute -top-4 right-3 z-30">
          <Stamp
            text={plansSection.ourPickLabel}
            rotation={7}
            size="md"
            className="bg-paper shadow-[2px_2px_0_var(--color-ink)]"
          />
        </div>
      )}

      <RoughBox
        seed={PLAN_SEEDS[plan.id]}
        bgClassName={plan.ourPick ? "bg-paper" : "bg-paper-shade"}
        padding="p-6 pt-7"
        strokeWidth={plan.ourPick ? 2.4 : 1.9}
        className={cn(
          "flex-1 flex flex-col shadow-[4px_5px_0_var(--color-ink)]",
          plan.ourPick && "ring-2 ring-blossom-400/50 ring-offset-4 ring-offset-paper",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display-tight text-2xl text-ink">{plan.name}</h3>
            <p className="mt-1 font-pixel text-4xl leading-none text-blossom-600">
              {plan.ramGb} GB
              <span className="ml-1.5 font-sans text-xs font-bold uppercase tracking-wider text-ink-soft">
                RAM
              </span>
            </p>
          </div>
          <PlanGrowthIllustration planId={plan.id} />
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink-soft min-h-[2.6rem]">
          {plan.cardLine}
        </p>

        <dl className="mt-4 space-y-2 border-y border-dashed border-paper-line py-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-ink-soft font-semibold">CPU</dt>
            <dd className="font-pixel text-base text-ink">{plan.cpu}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-ink-soft font-semibold">Storage</dt>
            <dd className="font-pixel text-base text-ink">{plan.storage}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-ink-soft font-semibold">Good for</dt>
            <dd className="text-right font-semibold text-ink">{plan.goodFor}</dd>
          </div>
        </dl>

        {variant === "full" && (
          <ul className="mt-4 space-y-1.5 text-xs text-ink-soft">
            {planIncludes.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-moss shrink-0 mt-0.5" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-5">
          <div className="mb-3 flex items-center gap-2.5">
            {priceIsTodo ? (
              <>
                <span className="font-pixel text-2xl text-ink">$— /mo</span>
                <Stamp text="TODO" rotation={-4} size="sm" />
              </>
            ) : (
              <span className="font-pixel text-2xl text-ink">
                {plan.priceMonthly}
                <span className="text-sm text-ink-soft">/mo</span>
              </span>
            )}
          </div>

          <StickerButton
            href={plan.paymenterUrl}
            external
            variant={plan.ourPick ? "primary" : "outline"}
            size="md"
            className="w-full"
          >
            {plansSection.cardCta}
          </StickerButton>
          {urlIsTodo && (
            <p className="mt-2 text-center text-[11px] font-semibold text-ink-soft">
              Direct checkout link pending ·{" "}
              <a
                href={links.store}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted hover:text-blossom-600"
              >
                Order at billing.petalnodes.cloud →
              </a>
            </p>
          )}
        </div>
      </RoughBox>
    </article>
  );
}
