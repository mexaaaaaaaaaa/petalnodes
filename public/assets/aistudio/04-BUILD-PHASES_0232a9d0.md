# Petalnode Website: Build Plan (for Emergent)

> **For the builder:** work through these tasks **in order**, one at a time. Every task ends with checks. Don't start the next task until the current task's checks pass. Steps use checkboxes (`- [ ]`) for tracking. Read `01-MASTER-BRIEF.md`, `02-ART-DIRECTION.md` and `03-STORYBOARD.md` first. This plan says *what* to build and *how to prove it*. Those files hold the exact values. **Look-and-feel checks** (e.g. "reads as a high-res pack", "looks like a real ink drawing") are signed off by the site owner: show the result and wait for their OK before the next task.

**Goal:** a two-page marketing site for Petalnode. A scroll-told home page grows a sketched seed into a shader-lit cherry-blossom voxel island, and a Plans page follows. Every purchase links to Paymenter.

**Architecture:**
- React + TypeScript single-page app with two routes. All copy and data come from one content module.
- A pinned GSAP ScrollTrigger timeline writes one `progress` number into a mutable store. A lazy-loaded React Three Fiber scene reads it every frame.
- A custom post-process "SketchEffect" turns the render from ink sketch to full color as progress grows.
- Reduced motion and no-WebGL get a complete static version.

**Tech stack:** React 19, TypeScript, Tailwind, shadcn structure, GSAP (+ @gsap/react, ScrollTrigger, SplitText, DrawSVGPlugin), Lenis, three, @react-three/fiber v9, @react-three/drei, @react-three/postprocessing, roughjs, react-router-dom, Vitest + Testing Library.

**Spec:** `01-MASTER-BRIEF.md`, `02-ART-DIRECTION.md`, `03-STORYBOARD.md`.

## Global Constraints

These apply to every task.

- **No Mojang assets.** All textures are generated in code from `02-ART-DIRECTION.md §7`, and all characters are originals. Footer disclaimer: "Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft."
- **Forbidden visuals:**
  - No purple/indigo gradients, no glassmorphism, no generic three-icon-card grids, no emoji icons, no stock images.
  - lucide-react is allowed only for menu, close, chevron, external-link and check.
- **Forbidden copy words:** unleash, elevate, seamless, next-level, cutting-edge, supercharge, revolutionize, empower.
- **No invented facts.** Unknowns are shown exactly as `TODO` from `03-STORYBOARD.md`.
- **One content module.** All copy, links and plan data live in `src/content/`. No hard-coded strings or URLs in components.
- **Story is a pure function of `progress`.** Nothing inside the pinned story may depend on scroll direction or history.
- **Text in the DOM.** Every chapter heading and body is real HTML text.
- **Animation hygiene:**
  - GSAP in components only via `useGSAP` with a `scope`.
  - Plugins are registered once in one module.
  - Lenis is driven by the GSAP ticker (`autoRaf: false`, `lagSmoothing(0)`, ScrollTrigger updated on Lenis scroll).
- **Footer file.** Copy `doodle-crew-footer.tsx` (uploaded with this pack) byte-for-byte. Only the four additive edits from `03-STORYBOARD.md §8` are allowed.
- **Performance budget:**
  - The 3D chunk is lazy-loaded and ≤ ~350 KB gzipped.
  - Lighthouse mobile scores: Performance ≥ 80, Accessibility ≥ 95, SEO ≥ 95.

## Review Focus

These are the failure modes most likely to bite real visitors. Each is pinned by a check in the owning task.

1. **Fast fling, scrolling back up, or jumping** (vine click or "How it works" link): the island must show exactly the state for the current progress, never half-built leftovers. *Pinned in Task 6 (reveal is a pure function) and Task 9 (jump check).*
2. **Window resize, phone rotation or late font load in the middle of the story:** the pin and canvas re-measure with no jump, gap or overlapping cards. *Pinned in Task 5.*
3. **WebGL missing or the GPU context lost mid-scroll:** the page switches to the static version in place, with no blank hole and the scroll position kept. *Pinned in Task 13.*
4. **Placeholder leakage into a release:** a buy button whose link is still `TODO` must never ship as a dead link. A release check lists every remaining TODO, and linking TODOs block release. *Pinned in Task 1.*
5. **Route hopping** (Home → Plans → browser Back → Home): no stale pinned spacer, duplicate Lenis instance or orphaned ScrollTriggers, and the story works again. *Pinned in Task 4.*

---

### Task 1: Project setup, tokens, fonts, content module, TODO tooling

**Files:** project config (TypeScript, `@/` alias, Tailwind theme), `src/app/` (global styles, fonts), `src/content/` (brand, links, plans, copy, FAQ), `src/components/layout/DevTodoBadge`, `scripts/` (release TODO check), tests for the content module.

**Interfaces:**
- **Produces:**
  - The content module exports `brand`, `links`, `plans` (an ordered list of the six tiers with id, name, ramGb, cpu, storage, goodFor, priceMonthly or TODO, paymenterUrl or TODO, cardLine, ourPick flag), `highlightPlanIds`, `planIncludes`, `nav`, `story` (copy per chapter), `trust`, `faq`, `footer` (the props from `03 §8`) and `notFound`.
  - A helper `isTodo(value)` and a helper `listTodos()` that returns every TODO with its path in the content.
  - Tailwind colors named exactly as the tokens in `02 §2`.

**Steps:**
- [ ] Ensure TypeScript, the `@/` alias, Tailwind and the shadcn `components/ui` folder exist. Install Vitest + Testing Library.
- [ ] Add the color tokens as CSS variables and Tailwind colors. Add the type scale and the five fonts with `display=swap`. Add the PaperBackground base color on `body`.
- [ ] Enter **all** content from `03-STORYBOARD.md §1–§8, §10` into the content module, word for word.
- [ ] Write tests:
  - `plans has six tiers in order seed, sprout, sapling, blossom, grove, orchard`
  - `exactly one plan is ourPick and it is sapling`
  - `highlightPlanIds are sprout, sapling, blossom and all exist`
  - `every plan ram matches 2, 4, 6, 8, 12, 16`
  - `listTodos finds the store URL, discord URL and every plan price` (they are TODO right now)
  - `no content string contains a forbidden copy word`
- [ ] Add the release check script, run as e.g. `npm run check:release`. It prints `listTodos()` and **fails if any link-type value (any URL) is still TODO**. While it fails it should list the URLs to fill in.
- [ ] Build the dev-only **DevTodoBadge** (`TODO × N`, click to list). Verify it is absent from a production build.
- [ ] **Check:** tests pass. `check:release` currently fails and lists the TODO URLs (expected for now). The dev server shows a cream page in the right fonts.
- [ ] Checkpoint/commit: "setup, tokens, content".

### Task 2: Sketch kit

**Files:** `src/components/sketch/` (PaperBackground, RoughBox, RoughUnderline, RoughCircle, InkArrow, WashiTape, PolaroidFrame, Stamp, HandIcon set, Mascots: Nodey and Sprout, the line-boil filter), a dev-only `/dev/sketch` preview route.

**Interfaces:**
- **Produces:**
  - `RoughBox`: props for seed, fill on/off, padding, children.
  - `RoughUnderline` / `RoughCircle`: wrap one word.
  - `InkArrow`: props for a from-point, a to-point and a curvature.
  - `WashiTape`: rotation, length.
  - `PolaroidFrame`: caption, children.
  - `Stamp`: text, rotation.
  - `HandIcon`: a `name` prop from the list in `02 §4`.
  - `Nodey` / `Sprout`: a size prop and a `boil` on/off prop.
  - Each piece accepts a `drawIn` flag; when set, its strokes draw in once on entering the viewport.

**Steps:**
- [ ] Build each piece per `02-ART-DIRECTION.md §4`. Every roughjs drawing uses a fixed seed, and the same seed always gives the same drawing.
- [ ] Write tests:
  - `RoughBox renders the same path data for the same seed across two renders`
  - `RoughBox renders different path data for different seeds`
  - `HandIcon renders an svg for every name in the list and throws for an unknown name`
  - `drawIn pieces render fully drawn when reduced motion is on`
- [ ] Build `/dev/sketch` showing every piece on paper (dev only).
- [ ] **Check:** tests pass. On `/dev/sketch`, every piece looks hand-drawn, strokes draw in once, and the mascots' lines "boil". With OS reduced motion on, nothing animates.
- [ ] Checkpoint/commit: "sketch kit".

### Task 3: Motion shell: GSAP, Lenis, reduced motion, quality tier

**Files:** `src/lib/` (gsap registration module, quality-tier module, reduced-motion hook), `src/app/` (SmoothScroll provider wrapping the app).

**Interfaces:**
- **Produces:**
  - One module that registers ScrollTrigger, SplitText, DrawSVGPlugin and useGSAP, imported once at app start.
  - A `SmoothScroll` provider, plus a way to get the Lenis instance (for programmatic scroll-to).
  - `useReducedMotion()` returning a boolean.
  - `pickInitialTier(signals)`, a pure function. Its signals are: webgl available, reduced motion, device memory, cpu cores, coarse pointer, viewport width, renderer string. It returns `"high" | "medium" | "low" | "static"`.
  - `useQualityTier()`, which exposes the current tier and a `stepDown()` that never steps back up.

**Steps:**
- [ ] Write tests for `pickInitialTier`:
  - no WebGL → `static`
  - reduced motion → `static`
  - coarse pointer + the screen's shortest side < 768 → `low` (phones, small tablets)
  - coarse pointer + shortest side ≥ 768 → `medium` (larger tablets)
  - deviceMemory ≤ 4 or a known-weak renderer string → `medium`
  - otherwise a desktop → `high`
- [ ] Write a test that `stepDown` goes high → medium → low and stops at low (it never returns static on its own and never goes up).
- [ ] Implement the provider. When the tier is `static` or reduced motion is on, Lenis is **not** created and native scrolling is used.
- [ ] **Check:** tests pass. A long dummy page scrolls smoothly. Toggling OS reduced motion and reloading gives native scrolling.
- [ ] Checkpoint/commit: "motion shell".

### Task 4: App chrome and routing

**Files:** `src/app/` router, `src/components/layout/` (Nav, MobileMenu, PageShell), `src/pages/` (Home, Plans and NotFound stubs).

**Interfaces:**
- **Consumes:** content `nav`, `links`, `notFound`; the sketch kit; the SmoothScroll provider.
- **Produces:** `PageShell` (paper background + nav + children + footer slot). The nav exposes a "How it works" action that smooth-scrolls to the start of chapter 1 (Roots): the scroll position of `chapterStart(roots)` from Task 5. Until Task 5 exists, it targets the element with id `story`.

**Steps:**
- [ ] Build the Nav per `03 §3`: top state, taped-strip state after 80px, hide on scroll down and show on scroll up, external links marked ↗ and opening in a new tab. Build the mobile Sheet menu as a notebook page.
- [ ] Build the 404 page per `03 §10`.
- [ ] Write tests:
  - `nav renders every item from content and the CTA href equals links.store`
  - `external nav links have target _blank and rel noopener`
  - `unknown route renders the 404 with a link home`
- [ ] **Route-hopping check (Review Focus 5):** add a dummy pinned ScrollTrigger to Home. Go Home → Plans → browser Back → Home. Then:
  - Only one Lenis instance exists.
  - `ScrollTrigger.getAll()` has the same count as on first load.
  - There is no leftover pin spacer in the DOM.
  - Scroll position starts at the top of the page you land on.
- [ ] **Check:** tests pass, and the route-hopping check passes.
- [ ] Checkpoint/commit: "chrome and routing".

### Task 5: Hero + pinned story skeleton (no 3D yet)

**Files:** `src/lib/` (story store), `src/sections/home/` (Hero, Story, ChapterCard, StoryVine), with a placeholder colored box where the canvas will go.

**Interfaces:**
- **Consumes:** content `story`; sketch kit; motion shell.
- **Produces:**
  - The **story store**: an object holding `progress` (0–1) that the timeline writes.
  - `chapterAt(progress)`, which returns the chapter id (`seed | roots | shield | build | neighbors | bloom`) using the ranges in `03 §5`.
  - `chapterProgress(progress, id)`, which returns 0–1 within that chapter, clamped.
  - `chapterStart(id)`, the global progress where a chapter begins (used by the vine and by jumps).
  - The pinned section has id `story`.

**Steps:**
- [ ] Write tests:
  - `chapterAt returns seed at 0, roots at 0.10, shield at 0.28, build at 0.46, neighbors at 0.66, bloom at 0.86 and bloom at 1`
  - `chapterProgress is 0 at a chapter's start, 1 at its end, and clamped outside`
  - `chapterStart(roots) is 0.10`
- [ ] Build the Hero DOM per `03 §5 chapter 0`: SplitText headline by words, RoughUnderline on **world**, both buttons, and the annotation pointing at where the seed will be. Show the SVG sketch of the seed block in the canvas spot.
- [ ] Build the pinned section: about 600vh (450vh when the **starting** tier is low; fixed at load and never changed by a runtime step-down), one master timeline with `scrub: 1` that writes `progress` to the store. Card entrances and their RoughBox draw-ins are part of this scrubbed timeline. Only the hero intro plays once on load (see `03 §5 Mechanics`). ChapterCards enter and leave per chapter (alternating sides on desktop; bottom 42% on mobile).
- [ ] Build the StoryVine per `03 §3`. Clicking a leaf scrolls through Lenis to `chapterStart`.
- [ ] Call `ScrollTrigger.refresh()` after `document.fonts.ready`.
- [ ] **Resize check (Review Focus 2):** scroll to the middle of chapter 2, then:
  - Resize the window from 1440 to 900 wide and back.
  - Rotate a phone emulator.
  - Throttle the fonts so they load late.

  Each time, the same chapter card stays on screen, nothing overlaps, and there's no jump larger than a few pixels.
- [ ] **Check:** tests pass. Scrolling down and up drives the cards and vine smoothly, and a debug readout of `progress` moves monotonically with scroll.
- [ ] Checkpoint/commit: "story skeleton".

### Task 6: Island data: layout and reveal schedule

**Files:** `src/three/island/` (layout generation and reveal schedule; pure data, no rendering), tests.

**Interfaces:**
- **Produces:**
  - `buildIsland(options)`. Options: size factor (1 for high/medium, 0.6 for low) and a seed.
  - It returns a list of blocks, each with: integer x, y, z; a block type (one of the types in `02 §7`); a chapter id; an `appearAt` progress value.
  - It also returns named **anchors**: seed, brightest ore, dome rim point, house, mascots. These are the 3D points the annotations and camera use.
- **Produces:** `isBlockVisible(block, progress)`, which returns the reveal amount 0–1 using the ~0.02 drop-in window from `03 §5`.

**Steps:**
- [ ] Write tests:
  - `same options give an identical block list` (deterministic)
  - `no two blocks share a position`
  - `block count is between 4000 and 6000 at size 1 and about 60 percent of that at size 0.6`
  - `every block's appearAt lies inside its chapter's range`
  - `the seed block appears at progress 0` (visible in the hero)
  - `roots blocks are ordered by distance from the seed`
  - `structures in the build chapter appear as groups`: all blocks of one tree fall within a short window
  - `all named anchors exist`
- [ ] **Review Focus 1 test:** `reveal is a pure function of progress`. Visit a random sequence of 200 progress values (jumps both ways). After each, the set of visible blocks equals the set computed fresh for that progress alone.
- [ ] Implement the generator per `03 §5 The island`: noise surface, radial underside, hand-placed trees, house, path, pond, waterfall, moss and flowers, lanterns.
- [ ] **Check:** all tests pass.
- [ ] Checkpoint/commit: "island data".

### Task 7: Block textures and materials

**Files:** `src/three/island/` (texture painting + materials), a dev-only `/dev/textures` preview route.

**Interfaces:**
- **Produces:**
  - `paintBlockTexture(type, face)`: 64×64 RGBA pixel data, deterministic per type. The face is top, side or bottom where it matters, e.g. grass and logs.
  - `paintNormalMap(type, face)`: a matching normal map.
  - `getBlockMaterial(type, tier)`: a cached material with nearest filtering and mipmaps, normal map applied, alpha cutout for leaves, and emissive for glow ore and lanterns.

**Steps:**
- [ ] Write tests:
  - `each type paints a 64 by 64 RGBA buffer`
  - `painting is deterministic per type`
  - `cherry leaves have between 15 and 35 percent transparent pixels`
  - `glow ore has emissive pixels and stone has none`
  - `grass side top rows are greener than its bottom rows`
- [ ] Implement every recipe in `02-ART-DIRECTION.md §7` with the token colors.
- [ ] Build `/dev/textures`, showing each block as a lit rotating cube on paper (dev only).
- [ ] **Check:** tests pass. Side by side on `/dev/textures`, the blocks read as a rich, painterly **high-res** pack with real relief under light. None of them resembles vanilla Minecraft art.
- [ ] Checkpoint/commit: "textures".

### Task 8: 3D scene: canvas, instanced blocks, light, camera, petals

**Files:** `src/three/` (IslandCanvas, instanced block layers, sky/light/fog, camera rig, petals). The Story section swaps the placeholder box for the lazy-loaded canvas.

**Interfaces:**
- **Consumes:** story store; `buildIsland` and anchors; `getBlockMaterial`; `useQualityTier`.
- **Produces:**
  - `IslandCanvas`, lazy-loaded, which reads `progress` in its frame loop only.
  - **Camera rig:** one keyframe per chapter (position + look target), described in `03 §5`, smoothly interpolated along a curve.
  - `projectAnchor(name)` → the anchor's current screen position, for the DOM annotations.

**Steps:**
- [ ] Render one instanced layer per material. Each instance carries its `appearAt`, and the drop-in (rise + scale + small bounce) happens on the GPU from the current progress, so no per-frame JavaScript loops over blocks.
- [ ] Add the light, sky, fog, wind sway and petal values from `02 §6`, by tier.
- [ ] Add the camera keyframes. Hero framing: the block sits right of center on desktop and centered in the top area on mobile.
- [ ] Crossfade from the hero's SVG seed sketch to the canvas once the first frame renders. Call `ScrollTrigger.refresh()` after mount.
- [ ] Pause rendering when the story section is off-screen.
- [ ] **Check:**
  - No React re-render happens while scrolling (React profiler is flat).
  - Scrolling builds and un-builds the island.
  - The frame rate holds at ≥ 55 fps on a mid laptop at the high or medium tier.
  - The lazy chunk size is within budget.
- [ ] Checkpoint/commit: "3D scene".

### Task 9: Chapter set pieces + annotations

**Files:** `src/three/story/` (cutaway + ore glow, petal dome + attack particles, structure group pop, time-of-day to dusk + lanterns + fireflies, voxel mascots, bloom pull-back), `src/sections/home/` (Annotation overlay, panel-sketch card with the clicking cursor, polaroid landing).

**Interfaces:**
- **Consumes:** `chapterProgress`, anchors, `projectAnchor`, the sketch kit.
- **Produces:** each set piece is a pure function of `chapterProgress` for its chapter.

**Steps:**
- [ ] Build each chapter exactly as `03 §5` describes:
  - **Roots:** cutaway clip + ore glow.
  - **Shield:** a dome forming bottom-up, a fresnel rim, red particles bouncing with sparks.
  - **Build:** structure groups popping, the dome fading, the panel-sketch cursor clicking Modpacks in sync.
  - **Neighbors:** day → dusk blend, lanterns on with bloom, fireflies, mascots waving.
  - **Bloom:** pull-back + orbit, then the canvas wrapper shrinking into a taped polaroid that lands beside the Plans highlight heading.
- [ ] Bloom snapshot: when progress first reaches about 0.94, capture the canvas frame to an image once. The polaroid in the Plans highlight shows that image, and the live canvas stays in the story section (`03 §5 chapter 5`, `§6`).
- [ ] Wire the five annotations (seed, ore, dome rim, house, mascots) to their anchors. Arrow tips follow the projected point every frame (in the same frame loop, without React state).
- [ ] **Jump check (Review Focus 1):** from the hero, click the vine's Neighbors leaf. Then click Roots. Then fling to the bottom and back to the top. Each time:
  - The scene matches a slow scroll to the same point: dusk only in Neighbors, the dome only in Shield and Build, the cutaway only in Roots.
  - The polaroid only appears at the very end.
- [ ] **Check:** every chapter reads clearly with sound off and no prior context. A first-time viewer can say what each chapter is selling.
- [ ] Checkpoint/commit: "chapter set pieces".

### Task 10: SketchEffect and the post-processing stack

**Files:** `src/three/effects/` (SketchEffect, PostFX per tier).

**Interfaces:**
- **Consumes:** story store; quality tier; the seed anchor's screen position.
- **Produces:**
  - `SketchEffect` with sketch amount, reveal center and reveal radius.
  - `revealRadiusFor(progress)`, a pure function returning the radius **in blocks (world units)**, implementing the mapping in `02 §8`. The reveal is world-space: depth is turned back into a world position and compared with the seed anchor.

**Steps:**
- [ ] Write tests for `revealRadiusFor`:
  - 0 at progress 0
  - never decreases as progress grows
  - about 8 at the end of Roots
  - about 16 at the end of Shield
  - about 26 at the end of Build
  - about 60 at progress 1
- [ ] Implement the SketchEffect per `02 §8`: ink edges from depth + normals, cross-hatching by luminance, paper grain, and a noise-wobbled watercolor-like reveal edge.
- [ ] Add the PostFX stack per tier from `02 §6` and `§9` (N8AO, Bloom, DepthOfField, ACES tone mapping, Vignette, then SketchEffect last).
- [ ] **Check:**
  - The hero looks like a real ink drawing on paper (not a toon shader).
  - The color visibly paints outward from the seed while scrolling, and paints back in reverse when scrolling up.
  - At the end, the render looks like a beautiful shader screenshot.
  - Medium and low tiers stay within their frame budgets.
- [ ] Checkpoint/commit: "sketch effect".

### Task 11: After-story sections and the Plans page

**Files:** `src/sections/home/` (PlansHighlight, TrustStrip, FAQ, FinalCTA), `src/sections/plans/` (PlanGrid, PlanCard, CompareTable), `src/pages/Plans`.

**Interfaces:**
- **Consumes:** content `plans`, `highlightPlanIds`, `planIncludes`, `trust`, `faq`; the sketch kit.
- **Produces:** a `PlanCard` with a compact and a full variant, used by both pages.

**Steps:**
- [ ] Write tests:
  - `PlanCard shows "$— /mo" and a TODO stamp when the price is TODO`
  - `PlanCard button href equals that plan's paymenterUrl`
  - `only sapling shows the OUR PICK stamp`
  - `home highlight renders sprout, sapling, blossom in that order`
  - `the reviews slot renders nothing in production when the list is empty`
  - `the plans page FAQ shows items 2, 3, 5, 6 and 8`
- [ ] Build everything per `03 §6–§7`: taped index cards, the trust strip with varied hand-drawn items (not identical cards), the folded-note FAQ (shadcn Accordion), and the notebook-paper compare table with a mobile swipe layout and a sticky first column.
- [ ] **Check:** tests pass. Run the anti-slop checklist (`02 §10`) on both pages.
- [ ] Checkpoint/commit: "plans and sections".

### Task 12: Footer integration

**Files:** `src/components/ui/doodle-crew-footer.tsx` (copied, then the additive edits), `src/components/layout/PageShell` (footer slot).

**Interfaces:**
- **Consumes:** content `footer`; the Nodey drawing for the new `logo` prop.

**Steps:**
- [ ] Copy the owner's file byte-for-byte. **Before any edits**, confirm with a diff against the uploaded `doodle-crew-footer.tsx` that it is identical.
- [ ] Write tests against the **unmodified** exported pure helpers. These must still pass after the edits:
  - `layoutWord treats a negative or non-finite advance as zero`
  - `seatPoint top returns y equal to minus cap`
  - `lookAt never exceeds max`
  - `timeline total is at least the last letter time plus 560`
- [ ] Make the four additive edits from `03-STORYBOARD.md §8`: the `nodey` and `sapling` crew kinds, the `petal` and `cube` doodles, and the optional `logo` prop.
- [ ] Write tests:
  - `footer renders the PETALNODE heading for screen readers`
  - `footer shows the Mojang disclaimer`
  - `rendering with no crew prop still shows the original default crew` (backward compatible)
  - `rendering without a logo prop still shows the default badge`
- [ ] Render the footer on both pages with the props from `03 §8`, full width.
- [ ] **Check:** tests pass. Scrolling to the footer plays the stamp storyboard, and all six crew members appear on the right letters. Clicking each shows its line. Eyes follow the cursor. Reduced motion shows it all static.
- [ ] Checkpoint/commit: "footer".

### Task 13: Static version, runtime tiers, performance and SEO pass

**Files:** `src/sections/home/StoryStatic` (and the layered sketch-SVG island illustration), the tier switch in Story, WebGL context-loss handling, meta tags.

**Interfaces:**
- **Consumes:** `useQualityTier`, `useReducedMotion`, content `story`.

**Steps:**
- [ ] Build `StoryStatic` per `03 §9`: six stacked sections, the layered SVG island shown cumulatively per stage (ink-only for stages 0–2, flat watercolor fills from stage 3), the final polaroid, and static annotations.
- [ ] Write tests:
  - `StoryStatic renders every chapter heading and body from content`
  - `with reduced motion the home page renders StoryStatic and no canvas`
  - `with tier static no Lenis instance is created`
- [ ] Wire PerformanceMonitor to `stepDown()` on sustained drops below ~45 fps.
- [ ] **Context-loss check (Review Focus 3):** in the middle of chapter 3, force a WebGL context loss (devtools, or the lose-context extension). The page must swap to StoryStatic in place:
  - No blank area.
  - The reader stays at the same chapter's static section.
  - There are no console errors.

  Repeat with WebGL disabled from the start.
- [ ] Add the SEO meta tags from `03 §1/§10`. Add Open Graph tags, with the image left as `TODO` until a Bloom screenshot exists.
- [ ] **Final checks:**
  - Every item in the Definition of Done in `01-MASTER-BRIEF.md` passes.
  - Lighthouse mobile meets Performance ≥ 80, Accessibility ≥ 95, SEO ≥ 95.
  - `check:release` lists only the owner's TODOs, nothing structural.
- [ ] Checkpoint/commit: "static version, tiers, polish".
