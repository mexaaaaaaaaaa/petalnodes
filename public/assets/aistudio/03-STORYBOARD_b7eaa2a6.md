# 03 · Storyboard & Content: Petalnode

> This file is the **single source of truth for every word, link and number** on the site. Put all of it into the one content module (`src/content/`), exactly as written. Anything marked **`TODO`** is unknown. Show it as written with the TODO stamp style, and never replace it with an invented value. The owner fills these in later, in one place.

## 1. Brand & links

| Key | Value |
|---|---|
| Brand name | `Petalnode` (working name; renaming must only require changing this table's values in the content module) |
| Wordmark | `PETALNODE` |
| Logo text | `petalnode` (lowercase, Bricolage Grotesque 800) next to the Nodey mascot |
| Tagline | `Plant a seed. Grow a world.` |
| One-liner | `Minecraft server hosting, grown with care.` |
| Meta title | `Petalnode: Minecraft Server Hosting, Grown With Care` |
| Meta description | `Fast Minecraft servers with always-on DDoS protection, one-click modpacks and real humans on Discord. Plant a seed, grow a world.` |
| Disclaimer | `Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.` |
| Site URL (canonical, Open Graph) | `TODO: final domain` |
| Store (buy) URL | `TODO: Paymenter store URL` |
| Client area URL | `TODO: Paymenter client area URL` |
| Game panel URL | `TODO: panel URL` |
| Discord invite | `TODO: Discord invite URL` |
| Status page | `TODO: status page URL` |
| Knowledge base | `TODO: docs URL` |
| Terms / Privacy / SLA | `TODO: three URLs` |
| Socials | YouTube `TODO`, X `TODO`, TikTok `TODO`. **Only render socials that have a real URL.** |

## 2. Plans

**Shared "every plan includes" list:**
- Always-on DDoS protection
- NVMe storage `TODO: confirm`
- One-click panel with modpacks
- Discord support
- Daily backups `TODO: confirm`

| id | Name | RAM | CPU | Storage | Good for (guide) | Price / month | Paymenter link | Card line |
|---|---|---|---|---|---|---|---|---|
| seed | **Seed** | 2 GB | `TODO` | `TODO` | 2–5 friends, vanilla | `TODO` | `TODO` | "Just you and a couple of friends." |
| sprout | **Sprout** | 4 GB | `TODO` | `TODO` | 5–10 players, light plugins | `TODO` | `TODO` | "A cozy survival world that's starting to grow." |
| sapling | **Sapling** ★ our pick | 6 GB | `TODO` | `TODO` | 10–20 players, plugin servers | `TODO` | `TODO` | "The sweet spot. Room for plugins and friends." |
| blossom | **Blossom** | 8 GB | `TODO` | `TODO` | Light modpacks or 20–40 players | `TODO` | `TODO` | "Modded adventures, in full bloom." |
| grove | **Grove** | 12 GB | `TODO` | `TODO` | Big modpacks | `TODO` | `TODO` | "For the modpack with 300 mods." |
| orchard | **Orchard** | 16 GB | `TODO` | `TODO` | Heavy modpacks, small networks | `TODO` | `TODO` | "A whole orchard of worlds." |

- **Home highlight** shows **Sprout · Sapling · Blossom**. Sapling sits in the middle with the "OUR PICK" stamp. It is an opinion stamp, not a popularity claim; "most picked" would need real data.
- **Price display:**
  - While a price is `TODO`, the price slot shows `$— /mo` with a small TODO stamp.
  - If the Paymenter link is `TODO`, the button still renders, but in development it shows a dashed outline and a tooltip "TODO: link".

## 3. Navigation

- **Desktop:** Nodey + `petalnode` logo (links home) · **How it works** (smooth-scrolls to the **start of chapter 1, Roots**; the hero is already the top of the story, so scrolling to the story's top would do nothing) · **Plans** (`/plans`) · **Discord** ↗ · **Status** ↗ · **Client area** ↗ · CTA button **Get a server** (store URL, `blossom-600`, sticker shadow).
- **Behaviour:**
  - At the top, the nav sits on the paper with no background.
  - After 80px of scroll it becomes a **taped paper strip** (`paper` with a faint shadow and a washi tape corner).
  - It hides on scroll-down and reappears on scroll-up.
  - While the story is pinned it stays hidden unless the user scrolls up.
- **Mobile:** logo + a hand-drawn hamburger. It opens a shadcn Sheet styled as a notebook page (ruled lines, links in handwriting size, CTA at the bottom).
- **Story progress vine (desktop, story section only):** a thin hand-drawn vine on the right edge with 6 leaf nodes (Seed, Roots, Shield, Build, Neighbors, Bloom).
  - The vine "grows" (DrawSVG) with progress, and the leaf of the current chapter turns pink.
  - Clicking a leaf smooth-scrolls to that chapter's start.

## 4. Home page: section order

1. Hero (the start of the pinned story)
2. Story chapters 1–4 + Bloom (pinned, scrubbed)
3. Plans highlight
4. Trust strip
5. FAQ
6. Final CTA
7. Footer

## 5. The pinned story

### Mechanics
- One section, pinned for about **600vh** on desktop and **450vh** on the low tier. `scrub: 1`.
  - The pin length is decided **once, at page load**, from the starting tier.
  - A runtime step-down (e.g. high → low) changes only the rendering, never the pin length, so the page never jumps.
- **What may play once vs. what must be scrubbed:**
  - The hero intro (SplitText headline, RoughUnderline, the hero annotation) plays **once on page load**. That's allowed: it is at progress 0, before any scrolling.
  - Everything else inside the pin is **scrubbed** by the master timeline: chapter card entrances, their RoughBox draw-ins, the panel cursor, spec labels and annotations. Scrolling back reverses all of it.
  - One-shot reveals (stamps, draw-ins on view) are only used **outside** the pinned section.
- One master timeline maps scroll to `progress` 0 → 1 (see `01-MASTER-BRIEF.md § Architecture rules`).
- **Canvas placement:**
  - The 3D canvas fills the viewport behind the chapter cards.
  - On **mobile**: the canvas takes the top 58% of the viewport, and the chapter card sits on paper in the bottom 42%.
- **Chapter cards:**
  - Each is a RoughBox on `paper-shade` with a washi tape corner, about 420px max width, alternating left/right on desktop.
  - It enters with a slide + slight rotation as its chapter begins and leaves as the next begins, both scrubbed.
- **Annotations:** each chapter has one handwritten **Annotation** whose arrow tip tracks a 3D anchor (listed per chapter).

### The island
- **Footprint:** about 32 × 32 blocks across the top surface, with an inverted-cone underside about 14 blocks deep. It is a floating island, so the sky shows all around.
- **Block budget:** about 4–6k blocks on high and medium, about 60% of that on low.
- **Rendering:** one instanced layer per block material.
- **Reveal data:** every block carries the **chapter** it belongs to and an **appear point** (a progress value).
- **Drop-in:** a block appears with a quick drop-in. It starts 1.5 blocks above its spot at scale 0 and settles with a tiny bounce, spread over about 0.02 of progress.
- **Reversibility:** scrolling back reverses this exactly, since it's a pure function of progress.
- **Layout:** procedural (noise heightmap for the surface, radial falloff for the underside) plus a few hand-placed structures: 3 cherry trees, 1 small cherry-plank house with a lantern porch, a stone path, a small pond with a waterfall spilling off the edge, and moss + flower patches. The layout is deterministic, with the same island every load.

### Chapter by chapter

#### 0 · Seed (hero), progress 0.00 – 0.10
- **3D:**
  - A single grass block with a tiny cherry sapling on it, center frame, slowly turning (idle rotation).
  - A few petals drift by.
  - Fully **sketch** mode (ink lines and hatching on paper).
- **Camera:** close three-quarter view, slightly above, the block filling about 25% of the frame height. Desktop framing is right of center; the text sits left.
- **DOM:**
  - Eyebrow (handwriting): `minecraft server hosting, grown with care`
  - H1 (SplitText by words, one word underlined with RoughUnderline: **world**): `Plant a seed. Grow a world.`
  - Sub: `Fast servers, always-on protection and one-click setup, with real humans on Discord when you need them. Every world starts as a little sapling.`
  - Buttons: **Get a server** (store URL) · **See plans** (`/plans`)
  - Annotation (anchor: the sapling): `this is your server ↓ scroll to watch it grow`
- **Before the 3D loads:** an SVG sketch of the same block is shown in the same spot. It crossfades to the canvas when ready.

#### 1 · Roots = Fast hardware, progress 0.10 – 0.28
- **3D:**
  - The underside builds: stone and deep-stone blocks appear outward and downward from beneath the seed (ordered by distance from the seed).
  - A **cutaway**: the front half of the underside is clipped away during this chapter, so we see inside the island. **Glow ore** veins light up inside. The clip closes again as the chapter ends.
  - Color starts spreading from the seed outward through the stone around it, a world-space sphere (see `02 §8`). By the end of the chapter it covers the upper underside and the ore.
- **Camera:** lowers and pulls back to a side view at underground level.
- **Card:**
  - Kicker: `01 · roots`
  - H2: `Strong roots, zero lag.`
  - Body: `Every world grows on hardware picked for one job: keeping Minecraft ticking smoothly. High-clock CPUs that love single-thread work, fast storage so chunks load before you get there, and plenty of quick memory.` `TODO: confirm and name the storage type (e.g. NVMe) once confirmed`
  - Spec labels (Pixelify Sans, pinned beside the ore with small ink arrows):
    - `CPU · TODO`
    - `Storage · NVMe TODO: confirm`
    - `Memory · TODO`
    - `Network · TODO`
- **Annotation** (anchor: the brightest ore vein): `this glowy stuff = your CPU`

#### 2 · Shield = DDoS protection, progress 0.28 – 0.46
- **3D:**
  - The grass and dirt surface spreads out radially from the seed.
  - A translucent **petal dome** forms over the island: hexagon-ish petal-shaped cells fade in from the base up. Its rim gives a soft pink fresnel glow, which blooms.
  - Small red pixel "attack" particles fly in from outside and **bounce off** the dome with a little spark, then fade.
  - The color reveal reaches the surface.
- **Camera:** rises to eye level with the island, wider, so the whole dome is visible.
- **Card:**
  - Kicker: `02 · shield`
  - H2: `A shield that never sleeps.`
  - Body: `Attacks get stopped before they ever reach your world. Protection is always on, on every plan, so a bad day for someone else never becomes downtime for you.`
  - Stats:
    - `Mitigation · TODO`
    - `Included on · every plan`
- **Annotation** (anchor: a point on the dome rim): `boing. not today.`

#### 3 · Instant build = Easy panel + 1-click, progress 0.46 – 0.66
- **3D:**
  - The structures **pop in fast as whole groups**, each with a tiny stagger: trees (log then leaves), the house, the path, the pond and waterfall.
  - It should feel like "one click and it's there".
  - The color reveal covers the whole island. The dome fades away (its job is done). As it fades, a single shimmer passes over it, driven by progress like everything else, so scrolling back plays it in reverse.
- **Camera:** a high three-quarter aerial view of the whole island.
- **Card:**
  - Kicker: `03 · instant build`
  - H2: `Click once. Start building.`
  - Body: `Pick Paper, Fabric, Forge or a whole modpack and your server is ready in about TODO seconds. Plugins, mods, backups and files all live in one friendly panel, no command line needed.` `TODO: confirm the loader list (same list as FAQ 3)`
  - **Panel sketch:** a hand-drawn mini panel card (RoughBox) with buttons `Paper` · `Fabric` · `Forge` · `NeoForge` · `Modpacks` (the same confirmed list). As the chapter scrubs, a hand-drawn cursor "clicks" `Modpacks` and a tiny progress bar fills, timed with the structures popping in. Panel name label: `TODO: panel name`.
- **Annotation** (anchor: the house): `built in one click (well, one scroll)`

#### 4 · Neighbors = Support + price, progress 0.66 – 0.86
- **3D:**
  - The time of day shifts to **golden dusk**: the sky blends to the dusk tokens, the sun lowers and warms, and the lanterns switch on and bloom.
  - Fireflies (a few emissive points) appear.
  - **Nodey** and **Sprout** (simple voxel versions of the mascots) appear on the house porch and wave.
  - Moss, flowers and lanterns along the path appear.
- **Camera:** lower and closer to the house, with a slow small orbit.
- **Card:**
  - Kicker: `04 · neighbors`
  - H2: `Good neighbors, fair prices.`
  - Body: `Stuck at 2 a.m.? Real people (players, not bots) answer on Discord. And pricing stays simple: you pay for the plan you pick, with no surprise fees.`
  - Stats:
    - `Typical reply · TODO`
    - `From · TODO / month`
    - `Locations · TODO`
- **Annotation** (anchor: the mascots): `that's us. hi!`

#### 5 · Bloom, progress 0.86 – 1.00
- **3D:**
  - Petals intensify.
  - The camera pulls far back and orbits about 30°, showing the whole island floating in the dusk-to-night sky.
- **DOM:**
  - **Snapshot:** when progress first reaches about 0.94, capture the current canvas frame into an image, once per visit. The polaroid shows that frozen image. The live canvas stays inside the story section and pauses once it's off-screen. No second canvas lives in the Plans highlight.
  - In the last 6% of progress, the canvas frame **shrinks into a polaroid**: the viewport-sized canvas wrapper scales down to a card size, gains a white polaroid border and a washi tape strip, and rotates −3°.
  - It lands on the paper beside the Plans highlight heading as the pin releases.
  - Polaroid caption (handwriting): `your world, day 1 of forever`
- **Card:**
  - H2: `Your world, in full bloom.`
  - Body: `That's the whole idea. You bring the seed, we keep it growing.`
  - Button: **Pick your plan ↓** (scrolls to the Plans highlight)

## 6. After the story

### Plans highlight
- Heading: `Pick your seed.`
- Sub: `Every plan includes always-on DDoS protection, the one-click panel and Discord support.`
- **Cards:** three taped index cards (Sprout, Sapling, Blossom).
  - Each shows the name (Bricolage), RAM in big Pixelify digits, the card line, 3 specs, the price and the button **Plant this server →** (that tier's Paymenter link).
  - Sapling gets the **OUR PICK** stamp and sits slightly larger and straighter.
- **The Bloom polaroid lives here.**
  - Desktop: the heading and sub sit on the left, and the polaroid (rotated −3°, taped) on the right, above the cards.
  - Mobile: the polaroid sits between the sub and the cards at about 70% width.
  - It is a **frozen image** of the final 3D frame (see chapter 5), not a live canvas.
- Link under the cards: **See all six plans →** (`/plans`).

### Trust strip
- Heading: `The boring stuff, done right.`
- Four hand-drawn items in a loose row. These are **not** identical icon cards; vary rotation and size, each with its own doodle:
  - `Uptime · TODO`
  - `Locations · TODO` (a tiny hand-drawn world map with pins)
  - `Pay your way · TODO: payment methods`
  - `Backups · TODO`
- **Reviews slot:** shows nothing in production while the reviews list is empty. In development it shows a dashed box: "TODO: add real reviews (no invented ones)".

### FAQ (shadcn Accordion, styled as folded notes)
1. **What is Petalnode?** Minecraft server hosting for friends, communities and modded adventures. You pick a plan, we run the server, and you play.
2. **How fast is my server ready?** Usually within about `TODO` after payment. You'll get your panel login by email.
3. **Can I run plugins, mods and modpacks?** Yes. Paper, Fabric, Forge, NeoForge and popular modpacks install with one click from the panel. `TODO: confirm list`
4. **Java or Bedrock?** `TODO: confirm supported editions`
5. **Can I upgrade later?** Yes. Upgrade from your client area at any time and your world comes with you. `TODO: confirm`
6. **Is DDoS protection included?** Always, on every plan, at no extra cost.
7. **Where are your servers?** `TODO: locations`
8. **Do you offer refunds?** `TODO: refund policy`
9. **How do I get help?** Join our Discord, or open a ticket from your client area. Real humans answer.

### Final CTA
- Nodey holds a sapling next to a RoughBox.
- Heading: `Ready to plant yours?`
- Buttons: **Get a server** (store) · **Join the Discord** (outline)

## 7. Plans page (`/plans`)

- **Header:**
  - H1: `Plans that grow with you.` (underline **grow**)
  - Sub: `Start small, upgrade whenever your world outgrows its pot. Every plan includes always-on DDoS protection, the one-click panel and Discord support.`
- **Grid:** all six plans as index cards, three per row on desktop, two on tablet and one on mobile. A little growth illustration on each card goes from seed to tree across the tiers. Sapling is stamped OUR PICK.
- **Compare table:**
  - The table is drawn on ruled notebook paper.
  - Rows: RAM · CPU · Storage · Good for · DDoS protection · Backups · Price · button.
  - On mobile the table becomes a swipeable set of columns, with the first column sticky.
- **Below:** the FAQ items 2, 3, 5, 6 and 8, then the footer.

## 8. Footer (DoodleCrewFooter)

The owner's component is copied byte-for-byte (see `01-MASTER-BRIEF.md`). Use it full width.

**Props to pass:**
- wordmark `PETALNODE` · brand `petalnode`
- blurb `Minecraft server hosting, grown with care. Fast hardware, always-on protection and real humans on Discord.`
- tagline `Plant a seed. Grow a world.`
- palette: background `paper` `#FBF6EE`, ink `#2B2230`, accent `#E2557B`
- fontFamily: Bricolage Grotesque (800) · serifFamily: Fraunces
- **Columns:**
  - **Hosting:** Plans (`/plans`), Modpacks `TODO`, Locations `TODO`, Status (status URL)
  - **Support:** Discord, Knowledge base, Open a ticket (client area), Contact `TODO`
  - **Company:** About `TODO`, Terms, Privacy, SLA
  - **Account:** Client area, Game panel, Billing (client area)
- **Actions:**
  - `Join the Discord` (outline, icon: the new `petal` doodle) → Discord
  - `Get a server` (solid, icon: bolt) → store
- copyright: `© 2026 Petalnode. Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.`
- legal: Terms, Privacy, SLA · socials: only those with real URLs
- doodles: petal, petal, heart, star, petal, sparkle, cube, petal · doodleCount 12

**Crew** (letters: P0 E1 T2 A3 L4 N5 O6 D7 E8):

| Kind | Letter | Seat | Offset | Extra | Name | Says |
|---|---|---|---|---|---|---|
| nodey *(new)* | 0 (P) | front | −0.32 | | Nodey | "Your world's safe with me." |
| bird | 2 (T) | top | 0.02 | | Pip | "Ping? Nice and low." |
| mushroom | 3 (A) | front | 0.12 | scale 0.95 | Morel | "I'm a fun guy. And a fast host." |
| sapling *(new)* | 5 (N) | top | 0 | | Sprout | "Plant me! I grow into islands." |
| ghost | 6 (O) | behind | 0 | | Boo | "Lag? Never heard of her." |
| cat | 8 (E) | front | 0.42 | flip | Patch | "Psst. The middle plan's the good one." |

**Additive component edits.** These are the only edits allowed. Keep every existing kind, preset and behaviour working.

1. **New crew kind `nodey`.** Add it to the CrewKind union and the art map, following the existing art conventions: base center at (0,0), up is negative, about 144 units equal one letter's cap height, eyes listed separately so they track and blink, plus a bounding box.
   - Drawing: a cube about 70 units wide seen in three-quarter view. The front face is drawn with slightly wobbly edges, the top face is a parallelogram, and the right side face is filled with the existing hatch pattern.
   - Two stubby legs, two round eyes with pupils, a small smile.
   - A five-petal blossom on the top face in the accent color.
   - Default seat: front. Size factor about 1.
2. **New crew kind `sapling`.**
   - Drawing: a thin wobbly stem, two leaves (one hatched), a tiny third leaf bud, and a seed-pod head with two pupil-only eyes and a smile.
   - Default seat: top. Size factor about 1.1. It uses the existing gentle-sway idle animation.
3. **New doodle kinds:**
   - `petal`: a single cherry petal with a notch at the tip, filled `#FF8FAB`.
   - `cube`: a tiny three-quarter-view cube, top face `#FFC9D6`, left face paper, right face hatched.
4. **New optional prop `logo`** (any React node). When given, it replaces the default yeti head in the footer's small round brand badge. When omitted, nothing changes. Pass the Nodey mascot drawing.

## 9. Static version (reduced motion · no WebGL · context lost)

- **No pinning, no Lenis, no canvas.** The story becomes six normal stacked sections in the same order.
- Each section shows its card content in full, on paper, next to a **sketch-SVG illustration of the island at that stage**. It is one layered SVG drawing with the layers for stages 0–5 shown cumulatively: seed → underside with ore → surface + dome → structures → dusk lanterns and mascots.
  - Stages 0–2 are ink only.
  - From stage 3, flat watercolor-style fills appear, echoing the "coloring in" idea without motion.
- The Bloom section shows the finished, colored SVG island inside the PolaroidFrame.
- Annotations appear as static notes with arrows pointing at the SVG.
- Everything else (plans, trust, FAQ, footer) is unchanged. The footer already respects reduced motion itself.

## 10. Small pages and states

- **404:** Nodey next to a wilted sapling. `This page didn't sprout.` Button: `Back home`.
- **Dev-only TODO badge:** a small stamp in the bottom-left corner, `TODO × N`, listing the remaining placeholders on click. It is never rendered in production builds.
- **SEO:**
  - Title and description from §1, canonical URL, Open Graph + Twitter card.
  - OG image `TODO`: use a screenshot of the Bloom polaroid once the site is built.
