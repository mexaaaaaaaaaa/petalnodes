# 01 · Master Brief: Petalnode website

> Read this file first. Every later prompt assumes it. If anything in a later file seems to conflict with the **Non-negotiables** here, the Non-negotiables win.

## This pack (5 files)

| File | What it is |
|---|---|
| `01-MASTER-BRIEF.md` | This file: intent, decisions, rules, stack, hosting, definition of done, what the owner fills in before launch |
| `02-ART-DIRECTION.md` | Colors, fonts, the hand-drawn sketch kit, motion style, the 3D "shader" look, block texture recipes, the SketchEffect, quality tiers, the anti-slop checklist |
| `03-STORYBOARD.md` | **Every word, link and number on the site.** The scroll story chapter by chapter, plans, FAQ, nav, footer setup, the static version |
| `04-BUILD-PHASES.md` | The 13 build tasks, in order, each with checks to pass before moving on |
| `doodle-crew-footer.tsx` | The owner's footer component. Copy it in byte-for-byte (see Non-negotiable 6). |

**How we'll work:** set up the project from this brief, read `02` and `03` in full, then build **one task from `04` at a time**. Stop after each task's checks pass and show the result. The owner reviews the look-and-feel before the next task starts.

## Why this site exists

Petalnode's billing already runs on Paymenter. This site is the brand's front door, and it has to:

- **Tell the story while you scroll.** Visitors should understand what Petalnode gives them without reading a wall of text: "the object opens up and explains itself".
- **Build trust.** Specs, protection and real humans come across as solid and honest, never hype.
- **Feel like nothing else in hosting:** a cute sketchbook meets cherry-blossom voxel worlds.
- **Send buyers to Paymenter.**

**The build fails** if it looks like generic AI output, uses Mojang assets, invents facts, or hides the story text inside the 3D canvas, even if everything technically works.

## Decisions already made (don't revisit)

| Topic | Decision |
|---|---|
| Brand | **Petalnode** (working name; wordmark `PETALNODE`). Renaming must only require changing the content module. |
| Buy flow | Links to the existing Paymenter. No backend on this site. |
| Story | **Seed → Island**: one pencil-sketched sapling block grows into a full cherry-blossom island, and the sketch "colors in" to a shader-lit render |
| Chapters | The four selling points: **fast hardware**, **DDoS protection**, **easy panel + 1-click installs**, **support + price** |
| Island tech | **Live 3D in code** (React Three Fiber + GSAP). No pre-rendered frames, no outside artist. |
| Plan data | Placeholder tiers kept in one place; unknowns stay `TODO` |
| Footer | The owner's DoodleCrewFooter, re-themed via props + four additive edits |
| Color reveal | **World space**: a growing sphere around the seed, measured in blocks |
| Bloom polaroid | A **frozen snapshot** of the final 3D frame, not a second live canvas |
| Plan badge | "OUR PICK" on Sapling, not "MOST PICKED" (that would need real data) |

**Left to you:** the exact island layout within the block budget, exact easing curves within the motion language, micro-interactions the pack doesn't specify, and responsive details beyond what it states.

## What you're building

The marketing site for **Petalnode**, a Minecraft server hosting brand. It is **frontend only**:

- Billing, checkout and accounts already exist on **Paymenter**. Every "buy" action is a plain link to a Paymenter URL.
- Build **no backend, auth, database or payment code.**

The site has two pages:

1. **Home (`/`):** a scroll-told story in which a hand-sketched seed grows into a cherry-blossom voxel island in 3D. Each chapter explains one selling point. Then plan highlights, trust, FAQ and the footer.
2. **Plans (`/plans`):** every hosting tier, a comparison table, FAQ and the footer.

**The feeling:** a cute, aesthetic **sketchbook** (paper, ink, doodles, washi tape) meets **cherry-blossom voxel worlds** with a rich, high-quality shader look. It is warm and trustworthy, never corporate, and never generic.

## Non-negotiables

1. **No Mojang assets, ever.**
   - No vanilla Minecraft textures, the Minecraft logo, the Minecraft font or recognisable mob designs.
   - All block textures are **generated in code** from the recipes in `02-ART-DIRECTION.md`. All characters are our own originals.
   - The footer must show: *"Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft."*
2. **No AI slop.** Forbidden:
   - Purple/indigo/violet gradients, glassmorphism or frosted cards, neon glows on dark UI.
   - Generic "three icon cards in a row" feature grids.
   - Emoji used as icons, stock photos or Unsplash images.
   - Copy containing *unleash, elevate, seamless, next-level, cutting-edge, supercharge, revolutionize, empower*.
   - Lucide icons as decoration. lucide-react is allowed **only** for utility glyphs: menu, close, chevron, external-link, check. Every other icon is a hand-drawn SVG from the sketch kit.
3. **No invented facts.**
   - Never invent testimonials, customer counts, uptime numbers, hardware models or prices.
   - Every unknown value is shown exactly as written in `03-STORYBOARD.md` with its `TODO` marker. In development a small dev-only badge lists how many `TODO`s remain.
4. **Text lives in the DOM.** Every chapter's heading and copy is real HTML text (SEO and screen readers). The 3D canvas is decoration plus storytelling, never the only carrier of information.
5. **Graceful versions are required, not optional:**
   - `prefers-reduced-motion: reduce` and devices without WebGL get the complete **static version** described in `03-STORYBOARD.md`.
   - Weak devices get the lower quality tiers from `02-ART-DIRECTION.md`.
6. **The owner's footer component is used as delivered.**
   - Copy `doodle-crew-footer.tsx` (uploaded with this pack) byte-for-byte to `src/components/ui/doodle-crew-footer.tsx`.
   - Only make the **additive** edits listed in `03-STORYBOARD.md § Footer`. Never restyle or remove its existing behaviour.

## Stack

Use Emergent's React frontend. Ensure the following before feature work:

- **React 19 + TypeScript** (`.tsx`). If the template is JavaScript, enable TypeScript first.
- **Tailwind CSS** with the design tokens from `02-ART-DIRECTION.md` exposed as CSS variables and Tailwind theme colors.
- **shadcn project structure:** components in `src/components/ui`, and the `@/` import alias pointing to `src/`. Use the shadcn **Accordion** (FAQ) and **Sheet** (mobile menu) primitives. Restyle them fully to the sketch look.

**Libraries** (latest stable versions; current APIs verified):

| Package | Used for | Notes |
|---|---|---|
| `gsap` + `@gsap/react` | All DOM motion, scroll-scrubbed story timeline | Register plugins **once** in one module: `ScrollTrigger`, `SplitText`, `DrawSVGPlugin` (all free since GSAP 3.13). In components always use `useGSAP(() => …, { scope: ref })` so animations and ScrollTriggers clean up on unmount. Wrap event-handler animations in `contextSafe`. |
| `lenis` | Smooth scrolling | Use `ReactLenis` with `root` and `options={{ autoRaf: false }}`. Drive it from GSAP's ticker (`gsap.ticker.add(t => lenis.raf(t * 1000))`), call `ScrollTrigger.update` on every Lenis scroll event, and set `gsap.ticker.lagSmoothing(0)`. Disable Lenis entirely in the static version. |
| `three`, `@react-three/fiber` (v9), `@react-three/drei` | The 3D island | Use drei's `PerformanceMonitor` and `AdaptiveDpr` for quality tiers. |
| `@react-three/postprocessing` + `postprocessing` | The "shader" finish + the custom SketchEffect | N8AO, Bloom, DepthOfField, ToneMapping (ACES Filmic), Vignette, plus one custom Effect. |
| `roughjs` | Hand-drawn boxes, underlines, arrows, circles | Use a fixed seed per element so drawings don't change on every render. |
| `react-router-dom` | `/` and `/plans` | |
| `clsx`, `tailwind-merge` | Class helpers (shadcn standard) | |

## Hosting

- **Static build only.** If the Emergent template comes with a backend (e.g. an API server or database), leave it unused; nothing on this site talks to a server.
- **Routing:** `/plans` and unknown URLs must work on a hard refresh. Configure the host's single-page-app fallback to `index.html`. The router's base is `/`.
- **Domain:** the final domain is `TODO` (`03 §1`, Site URL). Canonical and Open Graph URLs read it from the content module.
- **Prerendering:** if the host supports it, prerender `/` and `/plans` so search engines get the full text without running JavaScript. If it doesn't, the story text is still in the DOM after hydration, which is acceptable.

## Folder structure (target)

```
src/
  app/                 App shell, router, smooth-scroll provider, global styles, fonts
  content/             ONE content module: brand, links, plans, all copy, FAQ (from 03-STORYBOARD.md)
  lib/                 gsap registration, quality-tier detection, story progress store, helpers
  components/
    ui/                shadcn primitives + doodle-crew-footer.tsx
    sketch/            the hand-drawn kit (paper, rough box, ink arrow, washi tape, polaroid, annotation, hand icons, mascots)
    layout/            Nav, MobileMenu, PageShell, DevTodoBadge
  sections/
    home/              Hero, Story (pinned), ChapterCard, PlansHighlight, TrustStrip, FAQ, FinalCTA, StoryStatic
    plans/             PlanGrid, PlanCard, CompareTable
  three/
    IslandCanvas       the lazy-loaded R3F root
    island/            layout generation, texture painting, materials, instanced block layers
    story/             camera rig, shield dome, attack particles, petals, lanterns, mascots, time-of-day
    effects/           SketchEffect + PostFX stack per quality tier
  pages/               Home, Plans, NotFound
```

## Architecture rules

- **One content source.**
  - All text, links, plan data and FAQ come from `src/content/`. Components never hard-code copy or URLs.
  - The values are listed in `03-STORYBOARD.md`. The owner will later replace the `TODO`s and rename the brand **only there**.
- **The story store, not React state, drives the 3D.**
  - The pinned story section owns **one** GSAP timeline with `scrub`. It writes a single number, `progress` (0 → 1), into a tiny mutable store (a plain object, not React state).
  - The 3D scene reads `progress` inside `useFrame`. **No React re-render per scroll frame.**
  - The DOM chapter cards are animated by the same GSAP timeline.
- **Scroll must be reversible.** Everything in the story is a pure function of `progress`. Scrolling back up un-builds the island exactly. No one-shot "play once" animations inside the pinned story. One-shot reveals are fine *outside* it.
- **Lazy 3D.**
  - The hero's DOM and SVG render first; that's the largest paint.
  - The 3D canvas chunk loads with `React.lazy` after first paint.
  - A sketch-SVG version of the seed block shows until the canvas is ready, then crossfades.
- **Refresh discipline.** Call `ScrollTrigger.refresh()` after `document.fonts.ready`, after the 3D chunk mounts, and on route change. Kill all triggers on unmount (useGSAP does this when used correctly).

## Definition of done (whole site)

- [ ] Both pages build and run with no console errors or warnings.
- [ ] Scrolling the home story down and back up rebuilds and un-builds the island cleanly at any speed, including a fast trackpad fling.
- [ ] Reduced motion (OS setting) and a forced no-WebGL mode each show the full static version with every chapter's text.
- [ ] Every buy/CTA link resolves to the Paymenter URLs in the content module. There are no `#` placeholders in production links.
- [ ] Lighthouse (mobile): Performance ≥ 80, Accessibility ≥ 95, SEO ≥ 95.
- [ ] Grep the build output for the forbidden words and patterns in Non-negotiable 2. None found.
- [ ] Nothing visually resembles vanilla Minecraft textures or the Minecraft logo.

## Before launch: what the owner fills in

Every unknown is marked `TODO` in `03-STORYBOARD.md` and lives in the one content module. Keep them visible (TODO stamps, the dev-only `TODO × N` badge and the `check:release` command) until the owner supplies:

- **Paymenter links:** the store, the client area and one link per plan.
- **Other links:** the site domain, Discord invite, status page, docs, Terms / Privacy / SLA, panel URL.
- **Facts:**
  - Plan prices, CPU and storage per plan.
  - Hardware specs (CPU model, storage type, memory, network).
  - DDoS mitigation capacity, typical support reply time, locations.
  - Setup time, supported editions (Java/Bedrock), the loader list, refund policy, uptime, backups, payment methods.
- **Reviews:** real reviews only. The slot stays hidden until real ones exist.
