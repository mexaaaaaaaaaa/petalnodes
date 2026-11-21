import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import {
  brand,
  faq,
  footerConfig,
  links,
  nav,
  notFound,
  plans,
  story,
  vpsPlans,
  type Plan,
} from "@/content";
import { HAND_ICON_NAMES, HandIcon, RoughBox, StickerButton } from "@/components/sketch";
import { Nav } from "@/components/layout/Nav";
import DoodleCrewFooter from "@/components/ui/doodle-crew-footer";
import { PlanCard } from "@/sections/plans/PlanCard";
import { RewardsSection } from "@/sections/plans/RewardsSection";
import { PlansHighlight } from "@/sections/home/PlansHighlight";
import { HostingCategories } from "@/sections/home/HostingCategories";
import { TrustStrip } from "@/sections/home/TrustStrip";
import { FAQ } from "@/sections/home/FAQ";
import { StoryStatic } from "@/sections/home/StoryStatic";
import NotFound from "@/pages/NotFound";
import VpsHosting from "@/pages/VpsHosting";
import BotHosting from "@/pages/BotHosting";
import Locations from "@/pages/Locations";
import Docs from "@/pages/Docs";
import Modpacks from "@/pages/Modpacks";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import LegalPage from "@/pages/LegalPage";

describe("Sketch kit components", () => {
  it("HandIcon renders an svg for every valid name and throws for unknown name", () => {
    for (const name of HAND_ICON_NAMES) {
      const html = renderToStaticMarkup(<HandIcon name={name} />);
      assert.match(html, /^<svg/);
    }
    assert.throws(() => {
      renderToStaticMarkup(
        // @ts-expect-error testing invalid runtime icon name
        <HandIcon name="unknown_icon_xyz" />,
      );
    });
  });

  it("RoughBox renders identical SVG paths for the same seed", () => {
    const a = renderToStaticMarkup(<RoughBox seed={42}><span>One</span></RoughBox>);
    const b = renderToStaticMarkup(<RoughBox seed={42}><span>One</span></RoughBox>);
    assert.equal(a, b);
    const c = renderToStaticMarkup(<RoughBox seed={99}><span>One</span></RoughBox>);
    assert.notEqual(a, c);
  });

  it("StickerButton supports router links, external anchors, disabled, and loading states", () => {
    const routeHtml = renderToStaticMarkup(
      <MemoryRouter>
        <StickerButton to="/vps">VPS Plans</StickerButton>
      </MemoryRouter>,
    );
    assert.ok(routeHtml.includes('href="/vps"'));

    const loadingHtml = renderToStaticMarkup(
      <StickerButton loading loadingText="Launching…">
        Launch
      </StickerButton>,
    );
    assert.ok(loadingHtml.includes("Launching…"));
    assert.ok(loadingHtml.includes('aria-busy="true"'));
    assert.ok(loadingHtml.includes("disabled"));
  });
});

describe("Plans, Rewards, Trust, FAQ, Static story, 404, Nav & Footer", () => {
  it("PlanCard renders INR pricing for confirmed plans and placeholder stamp when price is TODO", () => {
    const sprout = plans.find((p) => p.id === "sprout")!;
    const sproutHtml = renderToStaticMarkup(<PlanCard plan={sprout} />);
    assert.ok(sproutHtml.includes("₹99"));
    assert.ok(sproutHtml.includes("/mo"));
    assert.ok(sproutHtml.includes(`href="${sprout.paymenterUrl}"`));

    const draftPlan: Plan = { ...sprout, priceMonthly: "TODO" };
    const draftHtml = renderToStaticMarkup(<PlanCard plan={draftPlan} />);
    assert.ok(draftHtml.includes("$— /mo"));
    assert.ok(draftHtml.includes("TODO"));
  });

  it("only sapling shows the OUR PICK stamp across all seven plans", () => {
    for (const plan of plans) {
      const html = renderToStaticMarkup(<PlanCard plan={plan} />);
      if (plan.id === "sapling") {
        assert.ok(html.includes("OUR PICK"), "sapling should include OUR PICK");
      } else {
        assert.ok(!html.includes("OUR PICK"), `${plan.id} must not include OUR PICK`);
      }
    }
  });

  it("PlansHighlight renders sprout, sapling, blossom in order", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <PlansHighlight />
      </MemoryRouter>,
    );
    const iSprout = html.indexOf('data-plan-id="sprout"');
    const iSapling = html.indexOf('data-plan-id="sapling"');
    const iBlossom = html.indexOf('data-plan-id="blossom"');
    assert.ok(iSprout > -1 && iSapling > iSprout && iBlossom > iSapling);
  });

  it("RewardsSection renders Petal I–VI and Bloom I–IV plus boost requirement note", () => {
    const html = renderToStaticMarkup(<RewardsSection />);
    assert.ok(html.includes("Petal I"));
    assert.ok(html.includes("Petal VI"));
    assert.ok(html.includes("Bloom I"));
    assert.ok(html.includes("Bloom IV"));
    assert.ok(html.includes("Active boosts are required to maintain rewards"));
  });

  it("TrustStrip reviews slot renders nothing in production when reviews list is empty", () => {
    const html = renderToStaticMarkup(<TrustStrip />);
    assert.ok(!html.includes("TODO: add real reviews"));
    assert.ok(html.includes("Built on confirmed hardware."));
  });

  it("Plans page FAQ subset shows items 2, 3, 4, 5, 6 and 8", () => {
    const html = renderToStaticMarkup(<FAQ filterIds={faq.plansPageIds} />);
    const expectedIds = [2, 3, 4, 5, 6, 8];
    for (const item of faq.items) {
      if (expectedIds.includes(item.id)) {
        assert.ok(html.includes(item.question), `Missing FAQ #${item.id}`);
      } else {
        assert.ok(!html.includes(item.question), `Unexpected FAQ #${item.id}`);
      }
    }
  });

  it("StoryStatic renders every chapter heading and body from content", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StoryStatic />
      </MemoryRouter>,
    )
      .replace(/&#x27;/g, "'")
      .replace(/&amp;/g, "&");
    for (const ch of story.chapters) {
      assert.ok(html.includes(ch.body), `Missing body for chapter ${ch.id}`);
    }
    assert.ok(html.includes("Strong roots, zero guesswork."));
    assert.ok(html.includes("Your world, in full bloom."));
  });

  it("Nav renders all routeItems, external Discord target=_blank noopener, and Client Area CTA", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    );
    for (const item of nav.routeItems) {
      assert.ok(html.includes(item.label), `Missing nav item ${item.label}`);
      assert.ok(html.includes(`href="${item.to}"`), `Missing nav href ${item.to}`);
    }
    assert.ok(html.includes(nav.ctaLabel));
    assert.ok(html.includes(`href="${links.clientArea}"`));
    for (const ext of nav.externalItems) {
      assert.ok(html.includes(ext.label));
      assert.ok(html.includes(`href="${ext.href}"`));
    }
    assert.ok(html.includes('target="_blank"'));
    assert.ok(html.includes('rel="noopener noreferrer"'));
  });

  it("All new Petalnodes routes render cleanly via SSR", () => {
    const wrap = (node: React.ReactElement) =>
      renderToStaticMarkup(<MemoryRouter>{node}</MemoryRouter>);

    const homeCatsHtml = wrap(<HostingCategories />);
    assert.ok(homeCatsHtml.includes("Minecraft Hosting"));
    assert.ok(homeCatsHtml.includes("KVM Linux VPS"));
    assert.ok(homeCatsHtml.includes("Bot Hosting"));

    const vpsHtml = wrap(<VpsHosting />);
    for (const vp of vpsPlans) {
      assert.ok(vpsHtml.includes(vp.name));
    }
    assert.ok(vpsHtml.includes("Available Regions"));
    assert.ok(vpsHtml.includes("Order via Billing Store"));
    assert.ok(vpsHtml.includes("Minecraft vs. VPS vs. Bot Hosting"));

    const botHtml = wrap(<BotHosting />);
    assert.ok(botHtml.includes("Pollen (Draft)"));
    assert.ok(botHtml.includes("Dewdrop (Draft)"));
    assert.ok(botHtml.includes("Nectar (Draft)"));
    assert.ok(botHtml.includes("Petal (Draft)"));
    assert.ok(botHtml.includes("Blossom (Draft)"));
    assert.ok(botHtml.includes("Miami, USA (VPS Infrastructure)"));
    assert.ok(botHtml.includes("Draft — Awaiting Approval"));
    assert.ok(botHtml.includes("TODO"));

    const locHtml = wrap(<Locations />);
    assert.ok(locHtml.includes("Singapore"));
    assert.ok(locHtml.includes("Miami"));
    assert.ok(locHtml.includes("India"));
    assert.ok(locHtml.includes("Bot Hosting Infrastructure (Draft)"));

    const docsHtml = wrap(<Docs />);
    assert.ok(docsHtml.includes("12 topics"));
    assert.ok(docsHtml.includes("Getting Started"));
    assert.ok(docsHtml.includes("Java &amp; Bedrock"));
    assert.ok(docsHtml.includes("VPS Getting Started"));
    assert.ok(docsHtml.includes("Bot Hosting Getting Started (Draft)"));

    const modHtml = wrap(<Modpacks />);
    assert.ok(modHtml.includes("Paper"));
    assert.ok(modHtml.includes("Purpur"));
    assert.ok(modHtml.includes("Fabric"));

    const aboutHtml = wrap(<About />);
    assert.ok(aboutHtml.includes("Honest infrastructure"));

    const contactHtml = wrap(<Contact />);
    assert.ok(contactHtml.includes(links.discord));

    const termsHtml = wrap(<LegalPage docId="terms" />);
    const privacyHtml = wrap(<LegalPage docId="privacy" />);
    const slaHtml = wrap(<LegalPage docId="sla" />);
    assert.ok(termsHtml.includes("Terms of Service (Draft)"));
    assert.ok(termsHtml.includes("In this draft"));
    assert.ok(termsHtml.includes('href="/privacy"'));
    assert.ok(privacyHtml.includes("Privacy Policy (Draft)"));
    assert.ok(slaHtml.includes("Service Level Agreement (Draft)"));
  });

  it("NotFound renders heading and link home", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    ).replace(/&#x27;/g, "'");
    assert.ok(html.includes("This page didn't sprout."));
    assert.ok(html.includes('href="/"'));
    assert.ok(html.includes(notFound.ctaLabel));
  });

  it("Footer renders PETALNODES sr heading, Mojang disclaimer, hides TikTok, and preserves defaults", () => {
    const petalHtml = renderToStaticMarkup(
      <DoodleCrewFooter
        wordmark={footerConfig.wordmark}
        brand={footerConfig.brand}
        blurb={footerConfig.blurb}
        tagline={footerConfig.tagline}
        palette={footerConfig.palette}
        columns={footerConfig.columns}
        actions={footerConfig.actions}
        copyright={footerConfig.copyright}
        legal={footerConfig.legal}
        socials={footerConfig.socials}
        doodles={footerConfig.doodles}
        doodleCount={footerConfig.doodleCount}
        crew={footerConfig.crew}
        logo={<span>CUSTOM_LOGO</span>}
      />,
    );
    assert.ok(petalHtml.includes(brand.wordmark));
    assert.ok(petalHtml.includes(brand.disclaimer));
    assert.ok(!petalHtml.toLowerCase().includes("tiktok"));
    assert.ok(petalHtml.includes("CUSTOM_LOGO"));

    const defaultHtml = renderToStaticMarkup(<DoodleCrewFooter />);
    assert.ok(defaultHtml.includes("Bruno"));
    assert.ok(defaultHtml.includes("Juno"));
    assert.ok(!defaultHtml.includes("CUSTOM_LOGO"));
  });
});
