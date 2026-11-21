import type { CrewMember, DoodleKind, FooterAction, FooterColumn, FooterLink } from "@/components/ui/doodle-crew-footer";
import {
  aboutPage,
  contactPage,
  docsPage,
  legalDocs,
  locationsPage,
  modpacksPage,
} from "./pages";

export * from "./pages";

export type PlanId =
  | "seed"
  | "sprout"
  | "sapling"
  | "blossom"
  | "grove"
  | "orchard"
  | "sakura";

export interface Plan {
  id: PlanId;
  name: string;
  ramGb: number;
  cpu: string;
  storage: string;
  goodFor: string;
  priceMonthly: string;
  paymenterUrl: string;
  cardLine: string;
  ourPick?: boolean;
}

export type VpsPlanId = "root" | "branch" | "trunk" | "canopy" | "evergrove";

export interface VpsPlan {
  id: VpsPlanId;
  name: string;
  ramGb: number;
  vcpu: string;
  storage: string;
  priceMonthly: string;
  paymenterUrl: string;
  cardLine: string;
}

export interface FreeRewardTier {
  id: string;
  name: string;
  invitesRequired: number;
  ramGb: number;
}

export interface BoostRewardTier {
  id: string;
  name: string;
  boostsRequired: number;
  ramGb: number;
}

export interface BotPlanDraft {
  id: "pollen" | "dewdrop" | "nectar" | "petal" | "blossom";
  proposedName: string;
  shortName: string;
  ram: string;
  cpu: string;
  storage: string;
  priceMonthly: string;
  useCase: string;
  recommended?: boolean;
  isDraft: true;
  paymenterUrl: string;
}

export interface HostingCategorySummary {
  id: "minecraft" | "vps" | "bots";
  title: string;
  badge: string;
  priceLead: string;
  locations: string;
  summary: string;
  highlights: string[];
  to: string;
  ctaLabel: string;
  isDraft?: boolean;
}

export type ChapterId = "seed" | "roots" | "shield" | "build" | "neighbors" | "bloom";

export interface StoryChapterContent {
  id: ChapterId;
  vineLabel: string;
  kicker?: string;
  eyebrow?: string;
  heading: string;
  highlightWord?: string;
  body: string;
  todoNote?: string;
  specs?: { label: string; value: string }[];
  annotation: string;
  anchorName: "seed" | "ore" | "domeRim" | "house" | "mascots";
  panelLoaders?: string[];
  panelName?: string;
  polaroidCaption?: string;
  ctaLabel?: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface ReviewItem {
  author: string;
  role: string;
  quote: string;
}

export const brand = {
  name: "Petalnodes",
  wordmark: "PETALNODES",
  logoText: "petalnodes",
  tagline: "Plant a seed. Grow a world.",
  oneLiner: "Minecraft, VPS & Bot hosting, grown with care.",
  metaTitle: "Petalnodes — Cherry Blossom Minecraft, VPS & Bot Hosting",
  metaDescription:
    "Minecraft, KVM Linux VPS, and upcoming Miami Bot hosting across Singapore, Miami, and India on AMD Ryzen & Intel Xeon Gold hardware with DDR5, NVMe, and daily backups.",
  disclaimer:
    "Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.",
  copyright:
    "© 2026 Petalnodes. Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.",
};

export const links = {
  siteUrl: "https://petalnodes.cloud",
  store: "https://billing.petalnodes.cloud",
  clientArea: "https://billing.petalnodes.cloud",
  gamePanel: "https://panel.petalnodes.cloud",
  discord: "https://discord.gg/GS3wuc4HGk",
  status: "https://status.petalnodes.cloud",
  docs: "/docs",
  terms: "/terms",
  privacy: "/privacy",
  sla: "/sla",
  locations: "/locations",
  modpacks: "/modpacks",
  about: "/about",
  contact: "/contact",
  plans: "/plans",
  vps: "/vps",
  bots: "/bots",
  socials: [
    { label: "YouTube", href: "TODO: verified YouTube URL (Petalnodes)" },
    { label: "X", href: "TODO: verified X URL (@petalnodes)" },
    { label: "Instagram", href: "TODO: verified Instagram URL (@petalnodes)" },
  ] as FooterLink[],
};

export const hostingCategories: HostingCategorySummary[] = [
  {
    id: "minecraft",
    title: "Minecraft Hosting",
    badge: "7 Cherry Blossom Tiers",
    priceLead: "From ₹59/mo",
    locations: "Singapore · Miami · India",
    summary:
      "Managed game panel hosting for friend SMPs and modded worlds with Java & Bedrock support and daily backups.",
    highlights: [
      "2GB Seed to 24GB Sakura tiers",
      "Paper, Purpur, and Fabric ready",
      "2 Allocations · 2 Database Slots",
    ],
    to: "/plans",
    ctaLabel: "Explore Minecraft plans →",
  },
  {
    id: "vps",
    title: "KVM Linux VPS",
    badge: "Full Root Access",
    priceLead: "From ₹300/mo",
    locations: "Singapore · Miami · India",
    summary:
      "Dedicated KVM virtual machines with Linux OS, full root access, NVMe storage, and DDoS protection.",
    highlights: [
      "4GB Root to 16GB Evergrove tiers",
      "2–4 vCPU · 20GB–80GB NVMe",
      "Daily backups · IPv4 subject to availability",
    ],
    to: "/vps",
    ctaLabel: "Explore VPS plans →",
  },
  {
    id: "bots",
    title: "Bot Hosting",
    badge: "Draft Proposal · Miami",
    priceLead: "Proposed from ₹39/mo",
    locations: "Miami, USA VPS Infrastructure",
    summary:
      "Always-on Discord, Telegram, Node.js, and Python bot containers proposed on Miami VPS infrastructure.",
    highlights: [
      "Pollen (512MB) to Blossom (6GB) drafts",
      "Guaranteed RAM + fair-use shared CPU",
      "Pending owner pricing & runtime approval",
    ],
    to: "/bots",
    ctaLabel: "View Bot Hosting drafts →",
    isDraft: true,
  },
];

export const serviceComparison = {
  heading: "Minecraft vs. VPS vs. Bot Hosting",
  sub: "Pick the exact Petalnodes platform built for your workload—switch or scale anytime as your community grows.",
  rows: [
    {
      feature: "Best suited for",
      minecraft: "Java & Bedrock survival worlds, plugins & Fabric mods",
      vps: "Full-root Linux apps, game proxies, Docker stacks & custom services",
      bots: "Always-on Discord, Telegram, Node.js & Python bots (Draft)",
    },
    {
      feature: "Control & access",
      minecraft: "Game Panel (panel.petalnodes.cloud)",
      vps: "Full Root SSH · KVM Virtualization · Linux OS",
      bots: "Game Panel container workflow (Draft)",
    },
    {
      feature: "Resource model",
      minecraft: "Dedicated plan RAM + 100%–600% CPU",
      vps: "Dedicated KVM RAM (4GB–16GB) + 2–4 vCPU",
      bots: "Guaranteed RAM (512MB–6GB) + shared fair-use CPU",
    },
    {
      feature: "Regions",
      minecraft: "Singapore · Miami · India",
      vps: "Singapore · Miami · India",
      bots: "Miami, USA VPS infrastructure only",
    },
    {
      feature: "Monthly INR pricing",
      minecraft: "₹59 – ₹449 / mo (Confirmed)",
      vps: "₹300 – ₹1,600 / mo (Confirmed)",
      bots: "₹39 – ₹279 / mo (Proposed Draft)",
    },
  ],
};

export const planIncludes: string[] = [
  "Java & Bedrock Support",
  "Paper, Purpur & Fabric",
  "2 Allocations",
  "2 Database Access Slots",
  "NVMe Storage",
  "DDoS Protection",
  "Daily Backups Included",
];

export const plans: Plan[] = [
  {
    id: "seed",
    name: "Seed",
    ramGb: 2,
    cpu: "100%",
    storage: "10GB NVMe",
    goodFor: "2–5 friends, vanilla",
    priceMonthly: "₹59",
    paymenterUrl: "https://billing.petalnodes.cloud",
    cardLine: "Just you and a couple of friends.",
  },
  {
    id: "sprout",
    name: "Sprout",
    ramGb: 4,
    cpu: "150%",
    storage: "15GB NVMe",
    goodFor: "5–10 players, light plugins",
    priceMonthly: "₹99",
    paymenterUrl: "https://billing.petalnodes.cloud",
    cardLine: "A cozy survival world that's starting to grow.",
  },
  {
    id: "sapling",
    name: "Sapling",
    ramGb: 8,
    cpu: "250%",
    storage: "25GB NVMe",
    goodFor: "10–20 players, plugin servers",
    priceMonthly: "₹169",
    paymenterUrl: "https://billing.petalnodes.cloud",
    cardLine: "The sweet spot. Room for plugins and friends.",
    ourPick: true,
  },
  {
    id: "blossom",
    name: "Blossom",
    ramGb: 12,
    cpu: "350%",
    storage: "35GB NVMe",
    goodFor: "Active SMPs & Fabric mods",
    priceMonthly: "₹239",
    paymenterUrl: "https://billing.petalnodes.cloud",
    cardLine: "Modded adventures, in full bloom.",
  },
  {
    id: "grove",
    name: "Grove",
    ramGb: 16,
    cpu: "400%",
    storage: "45GB NVMe",
    goodFor: "Heavy Paper/Fabric worlds",
    priceMonthly: "₹299",
    paymenterUrl: "https://billing.petalnodes.cloud",
    cardLine: "Room to spare for bustling towns.",
  },
  {
    id: "orchard",
    name: "Orchard",
    ramGb: 20,
    cpu: "500%",
    storage: "55GB NVMe",
    goodFor: "Large communities & heavy plugins",
    priceMonthly: "₹369",
    paymenterUrl: "https://billing.petalnodes.cloud",
    cardLine: "A whole orchard of thriving worlds.",
  },
  {
    id: "sakura",
    name: "Sakura",
    ramGb: 24,
    cpu: "600%",
    storage: "65GB NVMe",
    goodFor: "Peak community worlds & networks",
    priceMonthly: "₹449",
    paymenterUrl: "https://billing.petalnodes.cloud",
    cardLine: "Our flagship cherry blossom tier.",
  },
];

export const highlightPlanIds: PlanId[] = ["sprout", "sapling", "blossom"];

export const vpsPlans: VpsPlan[] = [
  {
    id: "root",
    name: "Root",
    ramGb: 4,
    vcpu: "2 vCPU",
    storage: "20GB NVMe",
    priceMonthly: "₹300",
    paymenterUrl: "https://billing.petalnodes.cloud",
    cardLine: "Compact KVM Linux node for bots, proxies, or lightweight services.",
  },
  {
    id: "branch",
    name: "Branch",
    ramGb: 6,
    vcpu: "2 vCPU",
    storage: "30GB NVMe",
    priceMonthly: "₹500",
    paymenterUrl: "https://billing.petalnodes.cloud",
    cardLine: "Balanced memory for web apps, panels, and multi-service stacks.",
  },
  {
    id: "trunk",
    name: "Trunk",
    ramGb: 8,
    vcpu: "3 vCPU",
    storage: "40GB NVMe",
    priceMonthly: "₹800",
    paymenterUrl: "https://billing.petalnodes.cloud",
    cardLine: "Three dedicated vCPU threads with ample DDR5 memory.",
  },
  {
    id: "canopy",
    name: "Canopy",
    ramGb: 12,
    vcpu: "4 vCPU",
    storage: "60GB NVMe",
    priceMonthly: "₹1,200",
    paymenterUrl: "https://billing.petalnodes.cloud",
    cardLine: "Serious capacity for networks, databases, and custom workloads.",
  },
  {
    id: "evergrove",
    name: "Evergrove",
    ramGb: 16,
    vcpu: "4 vCPU",
    storage: "80GB NVMe",
    priceMonthly: "₹1,600",
    paymenterUrl: "https://billing.petalnodes.cloud",
    cardLine: "Flagship 16GB KVM root server built for heavy projects.",
  },
];

export const vpsSection = {
  eyebrow: "kvm linux vps hosting",
  heading: "Root access, Cherry Blossom roots.",
  highlightWord: "Root",
  sub: "Full root KVM Linux servers powered by AMD Ryzen and Intel Xeon Gold infrastructure with DDR5 memory, NVMe storage, and DDoS protection.",
  cardCta: "Deploy VPS →",
  includes: [
    "KVM Virtualization",
    "Full Root Access",
    "Linux OS",
    "IPv4 Subject to Availability",
    "Network Protection",
    "Discord Support",
    "NVMe Storage",
    "Daily Backups Included",
  ],
  infrastructureHeading: "Platform Infrastructure",
  infrastructureNote:
    "Hardware varies across our Singapore, Miami, and India locations. Not every VPS node uses the same processor model or location-specific configuration.",
  infrastructureItems: [
    "AMD Ryzen processors",
    "Intel Xeon Gold processors",
    "DDR5 memory",
    "NVMe storage",
    "Cloudflare protection",
    "DDoS protection",
  ],
  locationAvailability: {
    heading: "Available Regions",
    regions: ["Singapore (SG)", "Miami (USA)", "India (IN)"],
    note: "Select your preferred deployment region at billing.petalnodes.cloud. IPv4 allocations and specific CPU models vary by location availability.",
  },
  useCases: [
    {
      title: "Discord Bot Clusters & Workers",
      recommendedTier: "Root (4GB) or Branch (6GB)",
      detail:
        "Run Docker Compose stacks, custom Python/Node.js workers, and local Redis/Postgres databases with full root Linux control.",
    },
    {
      title: "Game Networks & Proxy Frontends",
      recommendedTier: "Branch (6GB) or Trunk (8GB)",
      detail:
        "Host reverse proxies, custom panels, or multi-server routing protected by network DDoS mitigation.",
    },
    {
      title: "Web Applications & Databases",
      recommendedTier: "Trunk (8GB) or Canopy (12GB)",
      detail:
        "Serve APIs, dashboards, and persistent databases on NVMe storage with Cloudflare protection and daily backups.",
    },
    {
      title: "Heavy Custom Infrastructure",
      recommendedTier: "Evergrove (16GB)",
      detail:
        "Dedicated 16GB DDR5 memory and 4 vCPU capacity for resource-intensive community services and multi-tenant workloads.",
    },
  ],
  faqs: [
    {
      question: "What level of control do I get with Petalnodes VPS?",
      answer:
        "Every Cherry Blossom VPS uses KVM virtualization and includes full root Linux OS access, allowing you to configure packages, firewalls, Docker, or custom daemons.",
    },
    {
      question: "Which processors do the VPS nodes run?",
      answer:
        "Our infrastructure uses AMD Ryzen and Intel Xeon Gold processors paired with DDR5 memory and NVMe storage. Exact CPU hardware depends on the region and node pool.",
    },
    {
      question: "Is IPv4 guaranteed on every VPS order?",
      answer:
        "IPv4 is subject to availability per region and node pool at the time of provisioning inside billing.petalnodes.cloud.",
    },
    {
      question: "Are backups and protection included?",
      answer:
        "Yes — Daily Backups Included, Network Protection, DDoS Protection, Cloudflare protection, and Discord Support come standard across Root through Evergrove.",
    },
    {
      question: "How do I upgrade from Root to a larger VPS tier?",
      answer:
        "Manage plan scaling through your Client Area at billing.petalnodes.cloud or ask our team on Discord before resizing.",
    },
  ],
};

export const freeRewards = {
  heading: "Free Minecraft Server Rewards",
  sub: "Grow the Petalnodes community on Discord and claim a free server tier through a Discord Support Ticket.",
  claimCta: "Claim via Discord Ticket",
  tiers: [
    { id: "petal-1", name: "Petal I", invitesRequired: 6, ramGb: 2 },
    { id: "petal-2", name: "Petal II", invitesRequired: 8, ramGb: 5 },
    { id: "petal-3", name: "Petal III", invitesRequired: 12, ramGb: 7 },
    { id: "petal-4", name: "Petal IV", invitesRequired: 16, ramGb: 9 },
    { id: "petal-5", name: "Petal V", invitesRequired: 20, ramGb: 13 },
    { id: "petal-6", name: "Petal VI", invitesRequired: 30, ramGb: 17 },
  ] as FreeRewardTier[],
  rules: [
    { label: "Member Leave", penalty: "−2" },
    { label: "Rejoin", penalty: "−1" },
    { label: "Fake / Alt Account", penalty: "−2" },
    { label: "Mass Ping", penalty: "Invite Reset" },
  ],
};

export const boostRewards = {
  heading: "Discord Boost Rewards",
  sub: "Boost the Petalnodes Discord server and unlock a Java & Bedrock NVMe server.",
  requirementBanner:
    "Active boosts are required to maintain rewards. Claim through a Discord Support Ticket.",
  claimCta: "Boost & Claim on Discord",
  tiers: [
    { id: "bloom-1", name: "Bloom I", boostsRequired: 1, ramGb: 3 },
    { id: "bloom-2", name: "Bloom II", boostsRequired: 2, ramGb: 6 },
    { id: "bloom-3", name: "Bloom III", boostsRequired: 3, ramGb: 9 },
    { id: "bloom-4", name: "Bloom IV", boostsRequired: 4, ramGb: 12 },
  ] as BoostRewardTier[],
  specs: [
    "Java & Bedrock",
    "NVMe Storage",
    "Claim through a Discord Support Ticket",
    "Active boosts are required to maintain rewards",
  ],
};

export const botHosting = {
  eyebrow: "bot hosting · miami infrastructure · draft proposal",
  heading: "Keep your community bots blooming.",
  highlightWord: "blooming",
  sub: "Botanical-themed container hosting proposed on Miami, USA VPS infrastructure for always-on Discord, Telegram, Node.js, and Python bots.",
  infrastructureLocation: "Miami, USA (VPS Infrastructure)",
  infrastructureNote:
    "Bot Hosting will run strictly on Petalnodes Miami, USA VPS infrastructure (never described as Singapore or India infrastructure). Backed by NVMe storage and DDoS protection.",
  miamiLatencyTodo:
    "TODO: verify ~2ms Miami latency measurement source (local datacenter vs end-user route) before publishing numeric latency claims",
  draftNotice:
    "DRAFT FOR OWNER APPROVAL — Proposed botanical tiers, INR monthly pricing (₹39–₹279), fair-use CPU limits, and runtime presets are awaiting final owner confirmation. Checkout buttons remain disabled until official Paymenter links are added.",
  draftApprovalTodo:
    "TODO: owner approval required for proposed Bot Hosting pricing (₹39–₹279) and Miami container resource limits",
  proposedNamingNote:
    "Botanical hierarchy from Pollen (512MB) to Blossom (6GB) — stepping cleanly up into dedicated Root KVM VPS (4GB · ₹300/mo).",
  fairUseNote:
    "All Bot Hosting tiers pair guaranteed container RAM with shared fair-use vCPU limits rather than unlimited or unmetered CPU claims.",
  supportedRuntimesTodo:
    "TODO: confirm supported bot languages and runtimes (e.g. Node.js, Python, Java)",
  capabilitiesConfirmed: [
    "Miami, USA VPS base infrastructure",
    "NVMe storage backed volumes",
    "Always-on network DDoS protection",
    "Game Panel controls at panel.petalnodes.cloud",
    "Live console logs & file management",
    "Manual start, stop, restart & config files",
    "Environment variables & startup flags",
    "Human support through Discord tickets",
  ],
  capabilitiesProposed: [
    "24/7 managed bot container uptime",
    "Dedicated Node.js & Python runtime presets",
    "Automatic npm / pip dependency installation",
    "Automatic crash recovery & restart policies",
    "Scheduled container snapshot backups",
    "Real-time CPU & memory usage charts",
  ],
  useCases: [
    {
      title: "Discord Moderation & Utility Bots",
      tierHint: "Pollen (512MB) · Dewdrop (1GB)",
      detail:
        "Ticket panels, welcome roles, automod listeners, and slash-command utilities running steadily for friend servers and communities.",
    },
    {
      title: "Telegram & Webhook Automations",
      tierHint: "Pollen (512MB) · Dewdrop (1GB)",
      detail:
        "Lightweight Python or Node.js notification bots, status relays, and scheduled webhook scripts.",
    },
    {
      title: "Multi-Guild Economy & Music Bots",
      tierHint: "Nectar (2GB) · Petal (4GB)",
      detail:
        "Higher guaranteed RAM for caching guild data, audio libraries, and embedded SQLite/JSON storage on NVMe.",
    },
    {
      title: "Always-On APIs & Sharded Workers",
      tierHint: "Petal (4GB) · Blossom (6GB)",
      detail:
        "Sharded Discord bots or background workers—or upgrade straight to Root KVM VPS (₹300/mo) for full Linux root access.",
    },
  ],
  faqs: [
    {
      question: "Where will Petalnodes Bot Hosting servers be hosted?",
      answer:
        "Bot Hosting containers are planned exclusively on our Miami, USA VPS infrastructure, backed by NVMe storage and DDoS protection.",
    },
    {
      question: "Are Bot Hosting CPU allocations unlimited?",
      answer:
        "No. Every proposed tier pairs guaranteed RAM (512MB to 6GB) with shared fair-use vCPU percentages (50% to 250%) so noisy neighbors cannot stall your bot.",
    },
    {
      question: "Are the Bot Hosting plans and INR prices final?",
      answer:
        "No — Pollen through Blossom are currently Draft Proposals awaiting final owner confirmation of pricing, runtime presets, and Paymenter checkout links.",
    },
    {
      question: "Should I pick Bot Hosting or a KVM VPS?",
      answer:
        "Choose Bot Hosting for simple panel-managed Node.js or Python bots once launched. Choose Root KVM VPS (₹300/mo) right now if you need full Linux root access, Docker, or custom databases.",
    },
  ],
  features: [
    {
      title: "Managed via Game Panel",
      detail: "Control console logs, environment variables, startup commands, and restarts at panel.petalnodes.cloud.",
    },
    {
      title: "Miami VPS & NVMe Base",
      detail: "Engineered on Miami, USA VPS infrastructure with NVMe storage and network DDoS protection.",
    },
    {
      title: "Clear Upgrade Path to KVM",
      detail: "Scale smoothly from Pollen (₹39 draft) up to Blossom (₹279 draft), or switch to full-root Root VPS (₹300/mo).",
    },
  ],
  plans: [
    {
      id: "pollen",
      proposedName: "Pollen (Draft)",
      shortName: "Pollen",
      ram: "512 MB Guaranteed",
      cpu: "50% Shared vCPU (Fair-Use)",
      storage: "3 GB NVMe",
      priceMonthly: "₹39",
      useCase: "Single lightweight Discord or Telegram bot",
      isDraft: true,
      paymenterUrl: "TODO: Bot Hosting Tier 1 URL",
    },
    {
      id: "dewdrop",
      proposedName: "Dewdrop (Draft)",
      shortName: "Dewdrop",
      ram: "1 GB Guaranteed",
      cpu: "100% Shared vCPU (Fair-Use)",
      storage: "6 GB NVMe",
      priceMonthly: "₹69",
      useCase: "Moderation, ticket & Python webhook bots",
      isDraft: true,
      paymenterUrl: "TODO: Bot Hosting Tier 2 URL",
    },
    {
      id: "nectar",
      proposedName: "Nectar (Draft)",
      shortName: "Nectar",
      ram: "2 GB Guaranteed",
      cpu: "150% Shared vCPU (Fair-Use)",
      storage: "10 GB NVMe",
      priceMonthly: "₹119",
      useCase: "Recommended: multi-server Discord bots & light SQLite",
      recommended: true,
      isDraft: true,
      paymenterUrl: "TODO: Bot Hosting Tier 3 URL",
    },
    {
      id: "petal",
      proposedName: "Petal (Draft)",
      shortName: "Petal",
      ram: "4 GB Guaranteed",
      cpu: "200% Shared vCPU (Fair-Use)",
      storage: "15 GB NVMe",
      priceMonthly: "₹199",
      useCase: "Sharded bots, automation suites & REST workers",
      isDraft: true,
      paymenterUrl: "TODO: Bot Hosting Tier 4 URL",
    },
    {
      id: "blossom",
      proposedName: "Blossom (Draft)",
      shortName: "Blossom",
      ram: "6 GB Guaranteed",
      cpu: "250% Shared vCPU (Fair-Use)",
      storage: "25 GB NVMe",
      priceMonthly: "₹279",
      useCase: "Heavy concurrent bots before moving to Root KVM VPS",
      isDraft: true,
      paymenterUrl: "TODO: Bot Hosting Tier 5 URL",
    },
  ] as BotPlanDraft[],
};

export interface NavRouteItem {
  label: string;
  to: string;
}

export const nav = {
  howItWorksLabel: "How it works",
  plansLabel: "Minecraft Hosting",
  routeItems: [
    { label: "Home", to: "/" },
    { label: "Minecraft Hosting", to: "/plans" },
    { label: "VPS Hosting", to: "/vps" },
    { label: "Bot Hosting", to: "/bots" },
    { label: "Server Locations", to: "/locations" },
    { label: "Documentation", to: "/docs" },
  ] as NavRouteItem[],
  externalItems: [
    { label: "Discord", href: links.discord },
  ],
  ctaLabel: "Client Area",
  ctaHref: links.clientArea,
};

export const story: {
  chapters: StoryChapterContent[];
  heroPrimaryCta: string;
  heroSecondaryCta: string;
} = {
  heroPrimaryCta: "Get a server",
  heroSecondaryCta: "Minecraft plans",
  chapters: [
    {
      id: "seed",
      vineLabel: "Seed",
      eyebrow: "minecraft, vps & bot hosting, grown with care",
      heading: "Plant a seed. Grow a world.",
      highlightWord: "world",
      body: "Fast servers across Singapore, Miami, and India with Paper, Purpur, and Fabric support, daily backups included, and real humans on Discord. Every world starts as a little sapling.",
      annotation: "this is your server ↓ scroll to watch it grow",
      anchorName: "seed",
    },
    {
      id: "roots",
      vineLabel: "Roots",
      kicker: "01 · roots",
      heading: "Strong roots, zero guesswork.",
      body: "Our infrastructure pairs AMD Ryzen and Intel Xeon Gold processors with DDR5 memory and fast NVMe storage across Singapore, Miami, and India.",
      specs: [
        { label: "Processors", value: "Ryzen & Xeon Gold" },
        { label: "Storage", value: "NVMe Storage" },
        { label: "Memory", value: "DDR5 Memory" },
        { label: "Locations", value: "SG · Miami · IN" },
      ],
      annotation: "this glowy stuff = your hardware",
      anchorName: "ore",
    },
    {
      id: "shield",
      vineLabel: "Shield",
      kicker: "02 · shield",
      heading: "A shield that never sleeps.",
      body: "DDoS protection and Cloudflare protection help keep unwanted traffic away from your community so you can stay focused on building.",
      specs: [
        { label: "Mitigation", value: "DDoS & Cloudflare" },
        { label: "Included on", value: "every plan" },
      ],
      annotation: "boing. not today.",
      anchorName: "domeRim",
    },
    {
      id: "build",
      vineLabel: "Build",
      kicker: "03 · instant build",
      heading: "Pick your software. Start building.",
      body: "Choose Paper, Purpur, or Fabric with Java & Bedrock support, 2 allocations, 2 database slots, and daily backups included inside panel.petalnodes.cloud.",
      panelLoaders: ["Paper", "Purpur", "Fabric"],
      panelName: "panel.petalnodes.cloud",
      annotation: "managed cleanly in one panel",
      anchorName: "house",
    },
    {
      id: "neighbors",
      vineLabel: "Neighbors",
      kicker: "04 · neighbors",
      heading: "Good neighbors, fair prices.",
      body: "Need a hand? Join real humans in our Discord community or open a ticket in billing.petalnodes.cloud. Paid Minecraft tiers start at ₹59/mo — or earn a Petal server with invites.",
      specs: [
        { label: "From", value: "₹59 / month" },
        { label: "Free tiers", value: "Petal I – VI" },
        { label: "Locations", value: "SG · Miami · IN" },
      ],
      annotation: "that's us. hi!",
      anchorName: "mascots",
    },
    {
      id: "bloom",
      vineLabel: "Bloom",
      heading: "Your world, in full bloom.",
      body: "That's the whole idea. You bring the seed, we keep it growing.",
      polaroidCaption: "your world, day 1 of forever",
      ctaLabel: "Pick your plan ↓",
      annotation: "your world, ready to play",
      anchorName: "house",
    },
  ],
};

export const plansSection = {
  homeHeading: "Pick your seed.",
  homeSub:
    "Every Minecraft plan includes Java & Bedrock support, Paper/Purpur/Fabric, 2 allocations, 2 database slots, NVMe storage, DDoS protection, and daily backups.",
  cardCta: "Plant this server →",
  ourPickLabel: "OUR PICK",
  seeAllLabel: "See all seven plans →",
  pageHeading: "Plans that grow with you.",
  pageHighlightWord: "grow",
  pageSub:
    "Seven Cherry Blossom Minecraft tiers from 2GB Seed (₹59/mo) to 24GB Sakura (₹449/mo) — plus Petal free invite tiers and Bloom boost rewards.",
  compareHeading: "Compare every Minecraft tier",
};

export const trust = {
  heading: "Built on confirmed hardware.",
  items: [
    { id: "cpu", label: "Processors", value: "AMD Ryzen & Xeon Gold", icon: "clock" as const },
    { id: "locations", label: "Locations", value: "Singapore · Miami · India", icon: "globe" as const },
    { id: "protection", label: "Security", value: "DDoS & Cloudflare", icon: "coin" as const },
    { id: "backups", label: "Storage & Backups", value: "NVMe · Daily Backups", icon: "shield" as const },
  ],
  reviews: [] as ReviewItem[],
  reviewsTodoNotice: "TODO: add real reviews (no invented ones)",
};

export const faq: {
  heading: string;
  items: FaqItem[];
  plansPageIds: number[];
} = {
  heading: "Questions you probably have",
  plansPageIds: [2, 3, 4, 5, 6, 8],
  items: [
    {
      id: 1,
      question: "What is Petalnodes?",
      answer:
        "Petalnodes provides Cherry Blossom Minecraft hosting, KVM Linux VPS servers, Discord rewards, and draft Miami-based Bot Hosting with real Discord support.",
    },
    {
      id: 2,
      question: "How fast is my server ready?",
      answer:
        "TODO: confirm exact provisioning time after checkout at billing.petalnodes.cloud.",
    },
    {
      id: 3,
      question: "Which server software is supported?",
      answer:
        "Minecraft plans support Paper, Purpur, and Fabric with Java & Bedrock support, 2 allocations, and 2 database access slots.",
    },
    {
      id: 4,
      question: "Java or Bedrock?",
      answer:
        "Both! Java & Bedrock support is included across our paid Minecraft plans and Bloom Discord Boost reward tiers.",
    },
    {
      id: 5,
      question: "Can I upgrade later?",
      answer:
        "Yes — manage plans and upgrades from billing.petalnodes.cloud. TODO: confirm automated upgrade/proration policy.",
    },
    {
      id: 6,
      question: "Is DDoS protection included?",
      answer:
        "Yes. DDoS protection and Cloudflare protection are included across our infrastructure.",
    },
    {
      id: 7,
      question: "Where are your servers?",
      answer:
        "Minecraft and VPS nodes operate in Singapore (SG), Miami (USA), and India (IN), while proposed Bot Hosting containers are planned exclusively on Miami, USA VPS infrastructure.",
    },
    {
      id: 8,
      question: "Do you offer refunds?",
      answer: "TODO: refund policy (pending owner confirmation)",
    },
    {
      id: 9,
      question: "How do I get help?",
      answer:
        "Join our Discord at https://discord.gg/GS3wuc4HGk or open a ticket from your Client Area at https://billing.petalnodes.cloud.",
    },
    {
      id: 10,
      question: "Can I host Discord bots with Petalnodes?",
      answer:
        "Yes — dedicated KVM Linux VPS tiers (Root 4GB ₹300/mo and up) are available right now for Docker, Node.js, or Python bots, and dedicated Miami Bot Hosting draft tiers (Pollen through Blossom) are awaiting owner launch approval.",
    },
  ],
};

export const finalCta = {
  heading: "Ready to plant yours?",
  primaryLabel: "Get a server",
  primaryHref: links.store,
  secondaryLabel: "Join the Discord",
  secondaryHref: links.discord,
};

export const notFound = {
  heading: "This page didn't sprout.",
  body: "Looks like that link wandered off the path.",
  ctaLabel: "Back home",
};

export const footerConfig = {
  wordmark: brand.wordmark,
  brand: brand.logoText,
  blurb:
    "Minecraft, KVM VPS & Miami Bot hosting grown with care. Singapore, Miami, and India regions with NVMe storage, daily backups, and real humans on Discord.",
  tagline: brand.tagline,
  palette: {
    background: "#FBF6EE",
    ink: "#2B2230",
    accent: "#E2557B",
  },
  columns: [
    {
      title: "Hosting",
      links: [
        { label: "Minecraft Hosting", href: links.plans },
        { label: "VPS Hosting", href: links.vps },
        { label: "Bot Hosting", href: links.bots },
        { label: "Modpacks", href: links.modpacks },
        { label: "Locations", href: links.locations },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: links.docs },
        { label: "Status", href: links.status },
        { label: "Discord", href: links.discord },
        { label: "Contact", href: links.contact },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: links.about },
        { label: "Terms of Service", href: links.terms },
        { label: "Privacy Policy", href: links.privacy },
        { label: "SLA", href: links.sla },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Billing", href: links.store },
        { label: "Client Area", href: links.clientArea },
        { label: "Game Panel", href: links.gamePanel },
      ],
    },
  ] as FooterColumn[],
  actions: [
    {
      label: "Join the Discord",
      href: links.discord,
      icon: "petal",
      variant: "outline",
    },
    {
      label: "Get a server",
      href: links.store,
      icon: "bolt",
      variant: "solid",
    },
  ] as FooterAction[],
  copyright: brand.copyright,
  legal: [
    { label: "Terms of Service", href: links.terms },
    { label: "Privacy Policy", href: links.privacy },
    { label: "SLA", href: links.sla },
  ] as FooterLink[],
  get socials(): FooterLink[] {
    return links.socials.filter((s) => s.href && !isTodo(s.href));
  },
  doodles: [
    "petal",
    "petal",
    "heart",
    "star",
    "petal",
    "sparkle",
    "cube",
    "petal",
  ] as DoodleKind[],
  doodleCount: 12,
  crew: [
    {
      kind: "nodey",
      letter: 0,
      seat: "front",
      offset: -0.32,
      name: "Nodey",
      says: "Your world's safe with me.",
    },
    {
      kind: "bird",
      letter: 2,
      seat: "top",
      offset: 0.02,
      name: "Pip",
      says: "SG, Miami, or India — take your pick.",
    },
    {
      kind: "mushroom",
      letter: 3,
      seat: "front",
      offset: 0.12,
      scale: 0.95,
      name: "Morel",
      says: "Paper, Purpur, and Fabric ready.",
    },
    {
      kind: "sapling",
      letter: 5,
      seat: "top",
      offset: 0,
      name: "Sprout",
      says: "Plant me! I grow into islands.",
    },
    {
      kind: "ghost",
      letter: 6,
      seat: "behind",
      offset: 0,
      name: "Boo",
      says: "Daily backups included on every world.",
    },
    {
      kind: "cat",
      letter: 9,
      seat: "front",
      offset: 0.42,
      flip: true,
      name: "Patch",
      says: "Psst. Sapling's the sweet spot.",
    },
  ] as CrewMember[],
};

export interface TodoEntry {
  path: string;
  value: string;
  isUrl: boolean;
}

export function isTodo(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return /\bTODO\b/.test(value);
}

const URL_KEY_HINT = /(url|href|siteUrl|store|clientArea|gamePanel|discord|status|docs|terms|privacy|sla)$/i;

export function listTodos(): TodoEntry[] {
  const results: TodoEntry[] = [];
  const root = {
    links,
    hostingCategories,
    serviceComparison,
    planIncludes,
    plans,
    vpsPlans,
    vpsSection,
    botHosting,
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
  };

  function walk(node: unknown, currentPath: string, keyName: string) {
    if (typeof node === "string") {
      if (isTodo(node)) {
        const isUrl =
          URL_KEY_HINT.test(keyName) ||
          /\b(URL|domain|link)\b/i.test(node) ||
          currentPath.startsWith("links.");
        results.push({ path: currentPath, value: node, isUrl });
      }
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((item, idx) => walk(item, `${currentPath}[${idx}]`, keyName));
      return;
    }
    if (node && typeof node === "object") {
      for (const [k, v] of Object.entries(node)) {
        const nextPath = currentPath ? `${currentPath}.${k}` : k;
        walk(v, nextPath, k);
      }
    }
  }

  walk(root, "", "");
  return results;
}
