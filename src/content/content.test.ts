import test from "node:test";
import assert from "node:assert/strict";
import {
  aboutPage,
  boostRewards,
  botHosting,
  brand,
  contactPage,
  docsPage,
  faq,
  footerConfig,
  freeRewards,
  highlightPlanIds,
  hostingCategories,
  legalDocs,
  links,
  listTodos,
  locationsPage,
  modpacksPage,
  nav,
  planIncludes,
  plans,
  plansSection,
  serviceComparison,
  story,
  trust,
  vpsPlans,
  vpsSection,
} from "./index";

test("plans has seven Cherry Blossom tiers in exact order seed..sakura", () => {
  assert.deepEqual(
    plans.map((p) => p.id),
    ["seed", "sprout", "sapling", "blossom", "grove", "orchard", "sakura"],
  );
  assert.deepEqual(
    plans.map((p) => p.ramGb),
    [2, 4, 8, 12, 16, 20, 24],
  );
  assert.deepEqual(
    plans.map((p) => p.priceMonthly),
    ["₹59", "₹99", "₹169", "₹239", "₹299", "₹369", "₹449"],
  );
});

test("exactly one plan is ourPick and it is sapling", () => {
  const picks = plans.filter((p) => p.ourPick);
  assert.equal(picks.length, 1);
  assert.equal(picks[0].id, "sapling");
});

test("highlightPlanIds are sprout, sapling, blossom and all exist", () => {
  assert.deepEqual(highlightPlanIds, ["sprout", "sapling", "blossom"]);
  const ids = new Set(plans.map((p) => p.id));
  for (const id of highlightPlanIds) {
    assert.ok(ids.has(id));
  }
});

test("vpsPlans has five tiers root..evergrove with confirmed specs and INR pricing", () => {
  assert.deepEqual(
    vpsPlans.map((p) => p.id),
    ["root", "branch", "trunk", "canopy", "evergrove"],
  );
  assert.deepEqual(
    vpsPlans.map((p) => p.ramGb),
    [4, 6, 8, 12, 16],
  );
  assert.deepEqual(
    vpsPlans.map((p) => p.priceMonthly),
    ["₹300", "₹500", "₹800", "₹1,200", "₹1,600"],
  );
});

test("freeRewards and boostRewards match confirmed Petal and Bloom tiers", () => {
  assert.deepEqual(
    freeRewards.tiers.map((t) => [t.name, t.invitesRequired, t.ramGb]),
    [
      ["Petal I", 6, 2],
      ["Petal II", 8, 5],
      ["Petal III", 12, 7],
      ["Petal IV", 16, 9],
      ["Petal V", 20, 13],
      ["Petal VI", 30, 17],
    ],
  );
  assert.deepEqual(
    boostRewards.tiers.map((t) => [t.name, t.boostsRequired, t.ramGb]),
    [
      ["Bloom I", 1, 3],
      ["Bloom II", 2, 6],
      ["Bloom III", 3, 9],
      ["Bloom IV", 4, 12],
    ],
  );
});

test("confirmed URLs are set, TikTok is absent, and unverified loaders are excluded", () => {
  assert.equal(links.siteUrl, "https://petalnodes.cloud");
  assert.equal(links.store, "https://billing.petalnodes.cloud");
  assert.equal(links.clientArea, "https://billing.petalnodes.cloud");
  assert.equal(links.gamePanel, "https://panel.petalnodes.cloud");
  assert.equal(links.discord, "https://discord.gg/GS3wuc4HGk");
  assert.equal(links.status, "https://status.petalnodes.cloud");

  const socialLabels = links.socials.map((s) => s.label.toLowerCase());
  assert.ok(!socialLabels.includes("tiktok"));

  const planIncludesText = planIncludes.join(" ");
  assert.ok(!/\b(forge|neoforge)\b/i.test(planIncludesText));
});

test("listTodos tracks remaining unconfirmed URLs, bot draft specs, and legal review markers", () => {
  const todos = listTodos();
  const paths = new Set(todos.map((t) => t.path));
  assert.ok(paths.has("links.socials[0].href"));
  assert.ok(paths.has("botHosting.supportedRuntimesTodo"));
  assert.ok(paths.has("botHosting.miamiLatencyTodo"));
  assert.ok(paths.has("legalDocs.terms.lastUpdated"));
});

test("botHosting has 5 botanical draft plans on Miami-only infrastructure with no unlimited CPU or 2ms ping claim", () => {
  assert.deepEqual(
    botHosting.plans.map((p) => p.id),
    ["pollen", "dewdrop", "nectar", "petal", "blossom"],
  );
  assert.deepEqual(
    botHosting.plans.map((p) => p.priceMonthly),
    ["₹39", "₹69", "₹119", "₹199", "₹279"],
  );
  assert.ok(botHosting.plans.every((p) => p.isDraft));
  assert.match(botHosting.infrastructureLocation, /Miami/i);
  const botText = JSON.stringify(botHosting);
  assert.ok(!/unlimited\s+cpu/i.test(botText));
  assert.ok(!/singapore|india/i.test(botHosting.infrastructureLocation));
  assert.equal(hostingCategories.length, 3);
  assert.equal(serviceComparison.rows.length, 5);
  assert.equal(docsPage.categories.length, 12);
  assert.ok(docsPage.categories.some((c) => c.id === "vps-getting-started"));
  assert.ok(docsPage.categories.some((c) => c.id === "bot-hosting-getting-started"));
});

test("no content string contains a forbidden copy word", () => {
  const forbidden =
    /\b(unleash|elevate|seamless|next-level|cutting-edge|supercharge|revolutionize|empower)\b/i;
  const serialized = JSON.stringify({
    brand,
    hostingCategories,
    serviceComparison,
    planIncludes,
    plans,
    vpsPlans,
    vpsSection,
    freeRewards,
    boostRewards,
    botHosting,
    nav,
    story,
    plansSection,
    trust,
    faq,
    footerColumns: footerConfig.columns,
    locationsPage,
    docsPage,
    modpacksPage,
    aboutPage,
    contactPage,
    legalDocs,
  });
  assert.equal(forbidden.test(serialized), false);
});
