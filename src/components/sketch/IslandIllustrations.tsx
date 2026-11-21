import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Hand-drawn ink sketch of the single grass block + cherry sapling shown in the hero
 * while the lazy-loaded 3D IslandCanvas boots, and crossfaded out on first frame.
 */
export function SeedSketchSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 360"
      aria-hidden="true"
      className={cn("select-none overflow-visible", className)}
    >
      <g stroke="#2B2230" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {/* Soft paper shadow under block */}
        <ellipse cx="182" cy="288" rx="76" ry="16" fill="#2B2230" stroke="none" opacity="0.1" />

        {/* Block right face (hatched) */}
        <path
          d="M180 206 L254 166 L253 242 L180 282 Z"
          fill="#F1E7D6"
        />
        <path
          d="M192 214 L244 186 M192 231 L244 203 M192 248 L244 220 M192 265 L244 237"
          strokeWidth="1.4"
          opacity="0.45"
        />

        {/* Block left face */}
        <path
          d="M106 166 L180 206 L180 282 L107 242 Z"
          fill="#FBF6EE"
        />
        <path
          d="M116 196 L142 210 M130 226 L168 246 M118 238 L148 254"
          strokeWidth="1.3"
          opacity="0.32"
        />

        {/* Grass overhang drip line */}
        <path
          d="M106 166 L124 184 L138 176 L154 196 L166 190 L180 206 L196 192 L212 199 L228 178 L242 184 L254 166"
          fill="none"
          strokeWidth="2.4"
        />

        {/* Block top face */}
        <path
          d="M180 126 L254 166 L180 206 L106 166 Z"
          fill="#FBF6EE"
        />
        {/* Tiny grass blades on top */}
        <path d="M138 164 L135 154 M142 164 L145 156 M218 166 L216 157 M222 166 L226 158" strokeWidth="1.7" />

        {/* Cherry sapling */}
        <path d="M180 168 C179 144 182 122 180 96" fill="none" strokeWidth="3" />
        {/* Side twig */}
        <path d="M180 132 C194 126 202 118 208 109" fill="none" strokeWidth="2.2" />
        {/* Sapling leaves (ink outline + light hatch) */}
        <path
          d="M180 126 C158 118 144 123 142 135 C154 142 170 137 180 126 Z"
          fill="#FFF1F4"
        />
        <path d="M150 131 L172 127" strokeWidth="1.4" opacity="0.55" />
        <path
          d="M206 111 C216 97 230 96 234 106 C228 116 216 117 206 111 Z"
          fill="#FFF1F4"
        />
        {/* Crown blossom bud */}
        <path
          d="M180 96 C167 91 164 76 175 70 C180 65 186 67 190 72 C200 78 194 94 180 96 Z"
          fill="#FFC9D6"
        />
        <circle cx="180" cy="82" r="3" fill="#2B2230" stroke="none" />

        {/* Drifting petals */}
        <path
          d="M114 108 C122 103 128 109 124 117 C118 119 112 114 114 108 Z"
          fill="#FFC9D6"
          strokeWidth="1.8"
        />
        <path
          d="M248 92 C256 88 261 95 256 102 C250 103 245 97 248 92 Z"
          fill="#FFC9D6"
          strokeWidth="1.8"
        />
      </g>
    </svg>
  );
}

/**
 * Layered static island sketch SVG for StoryStatic (03-STORYBOARD §9).
 * Stages 0..2: ink-only.
 * Stages 3..5: flat watercolor-style fills appear, echoing color reveal.
 */
export function IslandSketchSvg({
  stage,
  className,
}: {
  stage: 0 | 1 | 2 | 3 | 4 | 5;
  className?: string;
}) {
  const colored = stage >= 3;
  const dusk = stage >= 4;
  const bloom = stage >= 5;

  const mossFill = colored ? "#6FAF5B" : "#FBF6EE";
  const dirtFill = colored ? "#8B5E3C" : "#F1E7D6";
  const stoneFill = colored ? "#8A7F8D" : "#E6DEC8";
  const woodFill = colored ? "#C68B6B" : "#FBF6EE";
  const barkFill = colored ? "#6B4A3A" : "#E6DEC8";
  const leafFill = colored ? "#FF8FAB" : "#FBF6EE";
  const leafLight = colored ? "#FFC9D6" : "#FFF1F4";
  const waterFill = colored ? "#A6C8EB" : "#FBF6EE";
  const lanternFill = dusk ? "#FFC75A" : "#FFF1F4";

  return (
    <svg
      viewBox="0 0 420 340"
      aria-hidden="true"
      className={cn("w-full h-auto select-none overflow-visible", className)}
    >
      {/* Sky backdrop (stage 4+ dusk-to-night wash) */}
      {dusk && (
        <defs>
          <linearGradient id={`dusk-bg-${stage}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={bloom ? "#281E37" : "#3B2D4B"} />
            <stop offset="65%" stopColor="#844D73" />
            <stop offset="100%" stopColor="#FFC9D6" />
          </linearGradient>
        </defs>
      )}
      {dusk && (
        <rect
          x="6"
          y="6"
          width="408"
          height="328"
          rx="8"
          fill={`url(#dusk-bg-${stage})`}
          opacity={bloom ? 0.92 : 0.72}
        />
      )}
      {bloom && (
        <g fill="#FFF7D6" opacity="0.85">
          <circle cx="52" cy="42" r="2" />
          <circle cx="96" cy="26" r="1.5" />
          <circle cx="322" cy="34" r="2.2" />
          <circle cx="372" cy="64" r="1.6" />
          <circle cx="268" cy="22" r="1.4" />
          <circle cx="148" cy="48" r="1.4" />
        </g>
      )}

      <g stroke="#2B2230" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Stage 0 only: standalone seed block */}
        {stage === 0 && (
          <g transform="translate(30 -8)">
            <ellipse cx="180" cy="262" rx="68" ry="12" fill="#2B2230" stroke="none" opacity="0.1" />
            <path d="M180 182 L242 150 L242 214 L180 246 Z" fill="#F1E7D6" />
            <path d="M190 190 L232 168 M190 206 L232 184 M190 222 L232 200" strokeWidth="1.3" opacity="0.45" />
            <path d="M118 150 L180 182 L180 246 L118 214 Z" fill="#FBF6EE" />
            <path d="M180 118 L242 150 L180 182 L118 150 Z" fill="#FBF6EE" />
            <path d="M180 152 C179 130 181 112 180 90" fill="none" strokeWidth="2.8" />
            <path d="M180 120 C162 112 150 118 148 128 C160 134 172 129 180 120 Z" fill="#FFF1F4" />
            <path d="M180 92 C169 86 168 74 177 69 C185 66 193 74 189 85 Z" fill="#FFC9D6" />
          </g>
        )}

        {/* Stage 1+: Inverted-cone underside stone & ore */}
        {stage >= 1 && (
          <g>
            {/* Outer underside cone */}
            <path
              d="M72 178 L112 246 L158 294 L208 312 L258 292 L308 242 L348 178 Z"
              fill={stoneFill}
            />
            {/* Cutaway stone facets & hatching */}
            <path
              d="M112 246 L166 218 L208 248 L252 216 L308 242"
              fill="none"
              opacity="0.45"
            />
            <path
              d="M166 218 L158 294 M208 248 L208 312 M252 216 L258 292"
              fill="none"
              opacity="0.45"
            />
            {!colored && (
              <path
                d="M270 218 L314 198 M258 244 L296 226 M230 278 L266 260"
                strokeWidth="1.4"
                opacity="0.4"
              />
            )}
            {/* Glow ore veins in underside */}
            <g fill={stage === 1 ? "#FFC9D6" : "#FF8FAB"}>
              <rect x="148" y="218" width="14" height="12" rx="2" />
              <rect x="196" y="232" width="16" height="14" rx="2" />
              <rect x="234" y="210" width="13" height="12" rx="2" />
              <rect x="182" y="264" width="14" height="12" rx="2" />
            </g>
            {/* Cutaway rim block lip for stage 1 */}
            {stage === 1 && (
              <path
                d="M72 178 C120 162 300 162 348 178 C300 194 120 194 72 178 Z"
                fill="#F1E7D6"
              />
            )}
          </g>
        )}

        {/* Stage 2+: Top grass & dirt island plateau */}
        {stage >= 2 && (
          <g>
            {/* Dirt skirt */}
            <path
              d="M66 168 L74 186 C125 204 295 204 346 186 L354 168 Z"
              fill={dirtFill}
            />
            {/* Grass top */}
            <path
              d="M66 168 C118 134 302 134 354 168 C302 200 118 200 66 168 Z"
              fill={mossFill}
            />
            {/* Stone path */}
            <path
              d="M174 180 C184 172 198 166 218 163"
              fill="none"
              strokeWidth="6"
              stroke={colored ? "#D4C6D2" : "#2B2230"}
              opacity={colored ? 0.9 : 0.35}
            />
          </g>
        )}

        {/* Stage 3+: Pond + Waterfall, House, 3 Cherry Trees */}
        {stage >= 3 && (
          <g>
            {/* Pond + Waterfall spilling off left-front edge */}
            <ellipse cx="128" cy="170" rx="24" ry="8" fill={waterFill} />
            <path
              d="M112 175 C106 196 105 244 108 292 L124 292 C121 244 123 196 128 177 Z"
              fill={waterFill}
            />
            <path d="M115 190 L114 265 M120 200 L119 278" strokeWidth="1.3" opacity="0.5" />

            {/* Cozy cherry-plank house on right-center */}
            <g transform="translate(212 106)">
              <rect x="0" y="24" width="54" height="36" fill={woodFill} />
              <polygon points="-6,24 27,2 60,24" fill={leafFill} />
              {/* Door */}
              <rect x="20" y="38" width="13" height="22" fill={barkFill} />
              {/* Warm window */}
              <rect x="6" y="34" width="10" height="10" fill={dusk ? "#FFC75A" : "#FFF1F4"} />
              <rect x="38" y="34" width="10" height="10" fill={dusk ? "#FFC75A" : "#FFF1F4"} />
              {/* Porch lantern */}
              <rect x="50" y="32" width="7" height="10" fill={lanternFill} />
            </g>

            {/* 3 Cherry Trees */}
            {/* Tree 1 (back left) */}
            <g transform="translate(154 78)">
              <rect x="-5" y="32" width="10" height="44" fill={barkFill} />
              <circle cx="-12" cy="24" r="18" fill={leafFill} />
              <circle cx="12" cy="22" r="16" fill={leafLight} />
              <circle cx="0" cy="8" r="18" fill={leafFill} />
            </g>
            {/* Tree 2 (back right) */}
            <g transform="translate(302 92)">
              <rect x="-4" y="28" width="8" height="38" fill={barkFill} />
              <circle cx="-10" cy="20" r="15" fill={leafLight} />
              <circle cx="10" cy="18" r="14" fill={leafFill} />
              <circle cx="0" cy="6" r="15" fill={leafFill} />
            </g>
            {/* Tree 3 (front left small) */}
            <g transform="translate(96 108)">
              <rect x="-3.5" y="22" width="7" height="30" fill={barkFill} />
              <circle cx="-6" cy="14" r="12" fill={leafFill} />
              <circle cx="8" cy="14" r="11" fill={leafLight} />
              <circle cx="1" cy="4" r="12" fill={leafFill} />
            </g>
          </g>
        )}

        {/* Stage 2 only: Shield dome + bouncing attack bolts */}
        {stage === 2 && (
          <g>
            <path
              d="M52 174 C52 72 368 72 368 174"
              fill="#FFC9D6"
              fillOpacity="0.22"
              stroke="#E2557B"
              strokeWidth="2.4"
              strokeDasharray="6 5"
            />
            <path d="M126 112 L152 104 L178 112 L178 134 L152 142 L126 134 Z" fill="none" stroke="#E2557B" strokeWidth="1.4" opacity="0.6" />
            <path d="M238 110 L264 102 L290 110 L290 132 L264 140 L238 132 Z" fill="none" stroke="#E2557B" strokeWidth="1.4" opacity="0.6" />
            {/* Attack bolts bouncing */}
            <g stroke="#E2557B" strokeWidth="2.2">
              <path d="M26 98 L62 114 L46 126" fill="none" />
              <circle cx="66" cy="115" r="4" fill="#E2557B" />
              <path d="M388 84 L348 106 L364 122" fill="none" />
              <circle cx="344" cy="108" r="4" fill="#E2557B" />
            </g>
          </g>
        )}

        {/* Stage 4+: Lanterns, flowers, voxel mascots, fireflies */}
        {dusk && (
          <g>
            {/* Path lanterns */}
            <rect x="174" y="160" width="6" height="9" fill="#FFC75A" />
            <rect x="196" y="154" width="6" height="9" fill="#FFC75A" />
            {/* Voxel Nodey & Sprout on porch */}
            <g transform="translate(268 156)">
              <rect x="0" y="0" width="12" height="12" fill="#FBF6EE" />
              <circle cx="6" cy="-3" r="3.5" fill="#FF8FAB" />
              <rect x="18" y="4" width="8" height="8" fill="#6FAF5B" />
            </g>
            {/* Fireflies */}
            <g fill="#FFE58F" stroke="none">
              <circle cx="144" cy="128" r="2.5" />
              <circle cx="204" cy="96" r="2.2" />
              <circle cx="292" cy="134" r="2.6" />
              <circle cx="170" cy="148" r="2" />
            </g>
          </g>
        )}

        {/* Stage 5: Intensified drifting petals */}
        {bloom && (
          <g fill="#FF8FAB" stroke="#2B2230" strokeWidth="1.2">
            <ellipse cx="82" cy="74" rx="5" ry="2.5" transform="rotate(-24 82 74)" />
            <ellipse cx="212" cy="54" rx="5" ry="2.5" transform="rotate(18 212 54)" />
            <ellipse cx="332" cy="96" rx="5" ry="2.5" transform="rotate(-35 332 96)" />
            <ellipse cx="146" cy="196" rx="4.5" ry="2.2" transform="rotate(28 146 196)" />
            <ellipse cx="288" cy="212" rx="4.5" ry="2.2" transform="rotate(-14 288 212)" />
          </g>
        )}
      </g>
    </svg>
  );
}
