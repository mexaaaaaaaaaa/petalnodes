import * as React from "react";
import { plans } from "@/content";
import { PlanCard } from "./PlanCard";
import { cn } from "@/lib/utils";

const GRID_TILTS = [-0.8, 0.6, 0, -0.5, 0.7, -0.6, 0.4];

export function PlanGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-7 items-stretch">
      {plans.map((plan, idx) => {
        const isLastSeventh = plans.length === 7 && idx === 6;
        return (
          <PlanCard
            key={plan.id}
            plan={plan}
            variant="full"
            tiltDeg={plan.ourPick ? 0 : GRID_TILTS[idx % GRID_TILTS.length]}
            className={cn(
              plan.ourPick && "lg:-translate-y-2",
              isLastSeventh && "md:col-span-2 lg:col-span-1 lg:col-start-2",
            )}
          />
        );
      })}
    </div>
  );
}
