# 02 · Art Direction: Petalnode

> **One-line rule:** *The page is a sketchbook. The world grows out of it.* Paper and ink are the canvas. The rich 3D render is what the sketch becomes. When the two styles meet, the 3D is always framed by the sketchbook (a pencil sketch coloring in, a polaroid taped on a page, an ink annotation pointing into the scene). It never floats in a dark void.

## 1. Feeling

**Cozy · handmade · trustworthy.** Think of a player's notebook where they planned their dream base, with doodles in the margins and pressed petals, that then comes alive. It is cute but competent: the specs are drawn neatly, like someone who knows what they're doing took care.

## 2. Color tokens

Expose these as CSS variables on `:root` and as Tailwind theme colors.

| Token | Hex | Use |
|---|---|---|
| `paper` | `#FBF6EE` | Page background (warm cream) |
| `paper-shade` | `#F1E7D6` | Cards, alternate sections, folded-note backs |
| `paper-line` | `#E4D6C1` | Dot grid, rule lines, dashed dividers |
| `ink` | `#2B2230` | All text and line art (plum-black, **never pure black**) |
| `ink-soft` | `#6B5E6E` | Secondary text |
| `blossom-50` | `#FFF1F4` | Tinted highlights |
| `blossom-200` | `#FFC9D6` | Washi tape, soft fills, highlighter swipes |
| `blossom-400` | `#FF8FAB` | Illustrations, petals |
| `blossom-600` | `#E2557B` | **Primary CTA**, links on hover, the accent ink |
| `moss` | `#6FAF5B` | Grass, "online" status dots |
| `bark` | `#6B4A3A` | Wood, logs |
| `lantern` | `#FFC75A` | Glows, stars, highlights in chapter 4 |
| `sky-day` | `#CFE6FF → #FFE9DE` | 3D sky gradient by day (top → horizon) |
| `sky-dusk` | `#2E2440 → #F7A38B` | 3D sky gradient at dusk (chapter 4) |
| `alert` | `#D94A3A` | Attack particles in chapter 2 only |

**Contrast rules:**
- Body text is always `ink` on `paper` or `paper-shade`.
- White text only appears on `blossom-600` or `ink` fills.
- Never place pink text on paper for body copy.

## 3. Typography

Load from Google Fonts with `display=swap`. Preload the two display weights used above the fold.

| Role | Font | Settings |
|---|---|---|
| Display headings, footer wordmark | **Bricolage Grotesque** | 800, tight tracking (−0.02em), optical size large |
| Handwritten notes, annotations, stamps | **Shantell Sans** | 500–700, use its *informal/bounce* variable axes for a natural hand |
| Body | **Nunito** | 400/600/800, 17–18px base, line-height 1.6 |
| Specs, numbers, labels, prices | **Pixelify Sans** | 500–700; numbers use tabular figures where available |
| Footer tagline, pull quotes | **Fraunces** | Italic 400, soft optical axis |

**Type scale (desktop → mobile):**

| Style | Desktop | Mobile |
|---|---|---|
| Hero | 112px | 54px |
| H2 | 64 | 38 |
| H3 | 32 | 24 |
| Note | 22 | 18 |
| Body | 18 | 17 |
| Label | 14 | 13 |

Headlines may have **one** word picked out with a hand-drawn underline or circle (roughjs, in `blossom-600`). Never more than one per heading.

## 4. Sketch kit (`components/sketch/`)

All are hand-drawn-looking, deterministic (fixed seed per instance) and themeable via tokens.

| Piece | What it is | Behaviour |
|---|---|---|
| **PaperBackground** | Site-wide paper: cream base, a very subtle SVG fractal-noise grain (opacity ≈ 0.06) and a faint dot grid (`paper-line`, 24px spacing) | Static. The grain must not shimmer while scrolling (render it once as a background image). |
| **RoughBox** | A roughjs rectangle around any content: ink stroke 1.6–2px, roughness ≈ 1.2, optional hachure fill in `blossom-200` | The stroke draws in (DrawSVG) the first time it enters the viewport. **Inside the pinned story**, the draw-in is scrubbed by the story timeline instead, so it reverses. |
| **RoughUnderline / RoughCircle** | Highlight one word | Draws in on view, 0.6s |
| **InkArrow** | A curvy hand-drawn arrow with a slightly uneven head | Draws from tail to head. Used for "scroll down", annotations and CTA hints. |
| **WashiTape** | A semi-transparent tape strip (`blossom-200` at 85%, torn edges, faint diagonal pattern) | Holds polaroids and cards, rotated ±3–8° |
| **PolaroidFrame** | A white instant-photo frame with a handwritten caption underneath | Used for the final island shot and the plan highlight |
| **Annotation** | A handwritten note (Shantell Sans) + an InkArrow that points at a **3D anchor**. The arrow tip follows that point's projected screen position every frame. | Five in the story, one per anchor: the seed (hero), the brightest ore, the dome rim, the house and the mascots |
| **HandIcon set** | Hand-drawn SVG icons in the footer's ink style: cpu chip, lightning, shield, wrench, chat bubble, coin, clock, globe, heart, sprout, petal, cube, lantern, check, star | 2px ink stroke, round caps, one accent fill max |
| **Stamp** | A rubber-stamp label ("OUR PICK", "TODO"), rotated, in `blossom-600` with an ink-bleed texture | Stamps in with a little squash on view |
| **Mascots** | **Nodey**: a small cube with stubby legs, dot eyes and one blossom on top. **Sprout**: a sapling with two leaves and a face. Both drawn in the footer's ink style. | Used in the hero, the empty states, the 404 page and the footer |

**Living ink:** reuse the footer's "line boil" technique (three SVG turbulence filters swapped at about 8 fps) on mascots and key doodles. Turn it off in reduced motion.

## 5. Motion language

- **Character:** springy, a little squash-and-stretch, like a stamp or a sticker being placed. Nothing floaty or slow-fading.
- **Durations:**
  - Micro: 0.18–0.3s.
  - Reveals: 0.6–0.9s.
  - Text: SplitText by words, 0.04s stagger. Never letter-by-letter for body text.
- **Easing:**
  - Reveals: a soft overshoot (back-out, small amplitude).
  - Draw-ins: ease-in-out.
  - Scrubbed story: linear progress with `scrub: 1` smoothing.
- **Buttons:** a sticker-like 3px offset ink shadow. On hover: lift 2px and rotate −1°. On press: sink.
- **Hover on cards:** a slight tilt, and the washi tape lifts a few degrees.
- **Reduced motion:** no Lenis, no pinning, no scrub, no boil. Things appear in place with at most a 0.2s opacity fade.

## 6. The 3D look ("shader quality")

The island should look like a beautiful shader-pack screenshot *of our own world*: warm low sun, soft shadows, glowing petals, gentle depth of field.

| Element | Spec |
|---|---|
| Renderer | sRGB output, **ACES Filmic** tone mapping, exposure ≈ 1.0, soft shadows (PCF soft) |
| Sun | Warm directional light (≈ `#FFE2C4`), low angle (~35°), shadow map 2048 on high and 1024 on medium |
| Sky light | Hemisphere light: sky color from the sky token, ground ≈ `#C9B79C`, intensity ≈ 0.6 |
| Sky | A gradient dome from the `sky-day` tokens, blended to `sky-dusk` in chapter 4 |
| Fog | Exponential height-style fog tinted to the horizon color, so the island edges dissolve softly |
| Ambient occlusion | N8AO, medium quality, radius tuned so block crevices darken softly |
| Bloom | Threshold set so only emissive things bloom: ore, lanterns, the shield rim, petals catching the sun |
| Depth of field | Subtle. Focus on the island center, bokeh on falling petals near the camera. **High tier only.** |
| Vignette | Very light, warm |
| Leaves | Vertex-shader wind sway (small amplitude, per-instance phase) |
| Petals | Instanced small curved quads in 3 pinks drifting in wind, some catching light. Counts: high 600, medium 250, low 80. |
| Water | A small pond/waterfall: a gradient + fresnel rim + slow normal scroll. Stylised, not realistic. |

## 7. Block textures (generated in code, original)

- **Format:** every texture is **painted procedurally at 64×64** (4× the classic 16×16 density, so it reads as "high-res pack", not vanilla) into pixel data.
- **Sampling:** nearest-neighbour filtering for crisp voxel edges, with mipmaps.
- **Normal maps:** each block also gets a normal map derived from the same height noise, so the sun creates real relief.
- **Determinism:** each block type uses a fixed seed, so it looks identical on every load.

| Block | Recipe |
|---|---|
| **Cherry leaves** | 3-tone pink clusters (`blossom-200/400` + a deeper `#E9799A`), with white-pink highlights on the top-left of clusters and an alpha cutout of about 25% holes. Some single-pixel petals hang below. |
| **Cherry log** | Vertical bark grooves in `bark` with darker cracks. The top face is rings in a lighter pinkish wood. |
| **Cherry planks** | Horizontal pink-beige boards (`#E7B9A6` base), with darker seams every 16px and subtle grain lines |
| **Grass top** | `moss` base, painterly noise of 4 greens, and a few tiny pink petal pixels scattered on top |
| **Grass side** | Dirt with a wavy grass overhang on the top 12px |
| **Dirt** | Warm brown, soft noise, a few pebbles |
| **Stone** | Cool grey-lavender (`#9C96A3` base), large soft cracks, chunky noise |
| **Deep stone** | Darker plum-grey (`#5E5466`), tighter cracks |
| **Glow ore** | Deep stone plus clusters of pink-gold crystals. The crystal pixels are **emissive** (`lantern` + `blossom-400`), and they bloom. |
| **Path** | Packed light earth with flat stones |
| **Paper lantern** | Cream paper with thin wooden ribs. Emissive warm interior. |
| **Moss carpet** | Soft green with a darker speckle |

**Forbidden:** sampling, tracing or color-picking from vanilla Minecraft textures. The *categories* of blocks are generic. The pixels are ours.

## 8. SketchEffect: the signature moment

One custom postprocessing Effect that runs after the regular stack. It has three inputs:

- **Sketch amount** (0–1).
- **Reveal center:** a **world-space** point, the seed anchor.
- **Reveal radius:** in **world units (blocks)**.

**How the reveal works:**
- For each pixel, rebuild its world position from the depth buffer and the camera matrices.
- The pixel is "revealed" when its distance to the reveal center is less than the radius.
- Pixels with no geometry (the sky) count as revealed only in the Bloom chapter. Until then the background stays paper.
- Because the reveal lives in world space, it stays consistent while the camera moves between chapters. A screen-space circle would jump around.

- **Inside the revealed area:** the normal full-color shader render.
- **Outside the revealed area,** the "sketch" render:
  - The paper color as the base.
  - **Ink outlines** from edge detection on scene depth and normals, in `ink`, about 1.5px.
  - **Pencil cross-hatching** in the darker areas (two hatch directions by luminance bands).
  - A light **paper grain**.
- **The boundary** is a **noise-wobbled, watercolor-like edge**: a soft bleed about 1.5 blocks wide (3D noise on world position), so it reads as paint spreading, not a hard sphere.
- **Story mapping** (radius in blocks; the island is about 32 wide and about 14 deep):
  - Hero: 0, fully sketch.
  - End of Roots: about 8, covering the stone and ore around the seed.
  - End of Shield: about 16, reaching the island's outer surface edge.
  - End of Build: about 26, covering the whole island including the underside tip.
  - Bloom: about 60, which also reveals the sky.

  The radius grows smoothly between these points.
- **Static version:** not used. Show the sketch-SVG island illustration and a final polaroid render instead.

## 9. Quality tiers

| Tier | Who | What changes |
|---|---|---|
| **High** | Desktop with a capable GPU | Everything on. Pixel ratio up to 2. Shadow 2048. 600 petals. |
| **Medium** | Laptops/iGPUs, larger tablets, or when PerformanceMonitor reports drops | No DepthOfField, no N8AO (baked fake AO via darker texture edges instead). Pixel ratio 1.25. Shadow 1024. 250 petals. |
| **Low** | Phones and small tablets (coarse pointer and the screen's shortest side under 768px) | No postprocessing except SketchEffect + tone mapping. Pixel ratio 1. Smaller island (about 60% of the blocks). 80 petals. No shadows (fake contact shadow decal under the island). |
| **Static** | Reduced motion, no WebGL, or a WebGL context loss | No canvas at all. The static version from `03-STORYBOARD.md`. |

- **Picking the starting tier:** decide from WebGL availability, reduced-motion, device memory, hardware concurrency, a coarse pointer plus a small screen, and the renderer string (known weak GPUs → medium).
- **Adjusting at runtime:** PerformanceMonitor steps down one tier on sustained drops below about 45 fps. It never steps back up within the same visit, to avoid flicker.
- **Off-screen:** the canvas pauses rendering once the story section is off-screen.

## 10. Anti-slop checklist (review every screen against this)

- [ ] Is there any gradient that isn't the sky? Remove it.
- [ ] Is there a perfectly straight, perfectly rounded card border? Make it rough, taped or folded.
- [ ] Is there an icon that isn't hand-drawn? Replace it (utility glyphs excepted).
- [ ] Does any sentence sound like a SaaS landing page template? Rewrite it in the friendly, player-to-player voice.
- [ ] Is there a number or claim not from the content module? Remove it.
- [ ] Does anything look like vanilla Minecraft? Redo it from the recipes.
