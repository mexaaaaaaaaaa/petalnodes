import * as React from "react";
import { useBoilFilter } from "./LineBoilFilters";
import { cn } from "@/lib/utils";

export function Nodey({
  size = 64,
  boil = true,
  holdingSapling = false,
  className,
}: {
  size?: number;
  boil?: boolean;
  holdingSapling?: boolean;
  className?: string;
}) {
  const filter = useBoilFilter(boil);

  return (
    <svg
      viewBox="-50 -132 110 140"
      width={size}
      height={size * 1.2}
      aria-label="Nodey mascot"
      className={cn("overflow-visible select-none", className)}
    >
      <g
        filter={filter}
        stroke="#2B2230"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Ground shadow */}
        <ellipse cx="2" cy="3" rx="34" ry="4" fill="#2B2230" stroke="none" opacity="0.14" />
        {/* Stubby legs */}
        <path d="M-18 -18 L-19 -3 C-19 1 -8 1 -8 -3 L-8 -18 Z" fill="#FBF6EE" />
        <path d="M6 -18 L7 -3 C7 1 18 1 18 -3 L18 -18 Z" fill="#FBF6EE" />
        {/* Cube right face */}
        <path
          d="M22 -16 C28 -18 35 -21 42 -26 C43 -44 43 -62 42 -80 C35 -75 28 -72 22 -70 Z"
          fill="#F1E7D6"
        />
        <path
          d="M26 -24 L38 -31 M26 -35 L38 -42 M26 -46 L38 -53 M26 -57 L38 -64"
          strokeWidth="1.6"
          opacity="0.45"
        />
        {/* Cube top parallelogram */}
        <path
          d="M-36 -70 C-29 -77 -21 -83 -13 -88 C6 -89 24 -86 42 -80 C35 -75 28 -71 22 -70 C2 -69 -17 -69 -36 -70 Z"
          fill="#FFF1F4"
        />
        {/* Cube front face */}
        <path
          d="M-36 -70 C-37 -52 -37 -34 -35 -17 C-16 -15 3 -15 22 -16 C23 -34 23 -52 22 -70 C3 -71 -17 -71 -36 -70 Z"
          fill="#FBF6EE"
        />
        {/* Eyes */}
        <circle cx="-13" cy="-49" r="3.6" fill="#2B2230" stroke="none" />
        <circle cx="8" cy="-49" r="3.6" fill="#2B2230" stroke="none" />
        <circle cx="-11.8" cy="-50.3" r="1.2" fill="#FBF6EE" stroke="none" />
        <circle cx="9.2" cy="-50.3" r="1.2" fill="#FBF6EE" stroke="none" />
        {/* Smile */}
        <path d="M-8 -37 C-3 -32 3 -32 8 -38" fill="none" />
        {/* Blossom on top */}
        <path d="M3 -79 C3 -88 5 -94 7 -100" fill="none" />
        <g transform="translate(7 -103)">
          <circle cx="0" cy="-9" r="6" fill="#FF8FAB" />
          <circle cx="8.5" cy="-2.8" r="6" fill="#FF8FAB" />
          <circle cx="5.2" cy="7.3" r="6" fill="#FF8FAB" />
          <circle cx="-5.2" cy="7.3" r="6" fill="#FF8FAB" />
          <circle cx="-8.5" cy="-2.8" r="6" fill="#FF8FAB" />
          <circle cx="0" cy="0" r="3.4" fill="#FFC75A" />
        </g>
        {holdingSapling && (
          <g transform="translate(36 -28)">
            <path d="M0 10 C0 -2 1 -14 0 -24" fill="none" stroke="#6B4A3A" />
            <path d="M0 -8 C-10 -14 -16 -12 -17 -4 C-11 -1 -5 -3 0 -8 Z" fill="#6FAF5B" />
            <path d="M0 -14 C10 -22 18 -19 18 -10 C12 -6 5 -8 0 -14 Z" fill="#6FAF5B" />
            <circle cx="0" cy="-26" r="5" fill="#FFC9D6" />
          </g>
        )}
      </g>
    </svg>
  );
}

export function Sprout({
  size = 64,
  boil = true,
  wilted = false,
  className,
}: {
  size?: number;
  boil?: boolean;
  wilted?: boolean;
  className?: string;
}) {
  const filter = useBoilFilter(boil);

  return (
    <svg
      viewBox="-36 -96 72 104"
      width={size}
      height={size * 1.35}
      aria-label={wilted ? "Wilted sapling" : "Sprout mascot"}
      className={cn("overflow-visible select-none", className)}
    >
      <g
        filter={filter}
        stroke="#2B2230"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="0" cy="3" rx="20" ry="3.5" fill="#2B2230" stroke="none" opacity="0.14" />
        {wilted ? (
          <>
            <path d="M0 2 C-1 -16 5 -32 14 -38 C20 -41 24 -35 23 -28" fill="none" />
            <path
              d="M11 -36 C2 -39 -5 -33 -6 -25 C1 -24 7 -29 11 -36 Z"
              fill="#E4D6C1"
            />
            <path
              d="M22 -28 C29 -24 30 -15 24 -10 C19 -15 18 -22 22 -28 Z"
              fill="#E4D6C1"
            />
          </>
        ) : (
          <>
            <path d="M0 2 C-2 -14 2 -30 0 -46" fill="none" />
            <path
              d="M-1 -24 C-14 -32 -28 -30 -30 -18 C-22 -12 -10 -14 -1 -22 Z"
              fill="#6FAF5B"
            />
            <path
              d="M1 -30 C14 -40 28 -38 31 -25 C22 -18 10 -20 1 -28 Z"
              fill="#6FAF5B"
            />
            <path
              d="M-1 -72 C-5 -82 3 -88 7 -79 C5 -74 2 -72 -1 -72 Z"
              fill="#FF8FAB"
            />
            <path
              d="M-14 -56 C-15 -68 -8 -74 0 -74 C8 -74 15 -68 14 -56 C13 -45 7 -41 0 -41 C-7 -41 -13 -45 -14 -56 Z"
              fill="#FBF6EE"
            />
            <circle cx="-4.5" cy="-58" r="2.1" fill="#2B2230" stroke="none" />
            <circle cx="4.5" cy="-58" r="2.1" fill="#2B2230" stroke="none" />
            <path d="M-4 -50 C-1 -47 2 -47 4 -50" fill="none" />
          </>
        )}
      </g>
    </svg>
  );
}
