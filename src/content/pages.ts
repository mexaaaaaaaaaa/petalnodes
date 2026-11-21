export interface LocationInfo {
  id: "sg" | "miami" | "in";
  code: string;
  city: string;
  country: string;
  regionLabel: string;
  pinX: number;
  pinY: number;
  services: string[];
  summary: string;
  botInfraNote?: string;
}

export const locationsPage = {
  eyebrow: "global regions",
  heading: "Three regions, one cozy network.",
  highlightWord: "regions",
  sub: "Petalnodes operates Minecraft and VPS infrastructure across Singapore, Miami, and India, with Bot Hosting planned specifically on our Miami, USA VPS infrastructure.",
  infraHeading: "Infrastructure across our network",
  infraNote:
    "Our network uses AMD Ryzen and Intel Xeon Gold processors with DDR5 memory, NVMe storage, Cloudflare protection, and DDoS protection. Specific CPU models and node hardware vary by location and availability.",
  botLocationNote:
    "Bot Hosting containers run exclusively on our Miami, USA VPS infrastructure (never described as Singapore or India hosted). Verified latency measurements require owner confirmation before numeric ping targets are published.",
  infraBadges: [
    "AMD Ryzen Processors",
    "Intel Xeon Gold Processors",
    "DDR5 Memory",
    "NVMe Storage",
    "Cloudflare Protection",
    "DDoS Protection",
  ],
  locations: [
    {
      id: "miami",
      code: "USA",
      city: "Miami",
      country: "United States",
      regionLabel: "North America East",
      pinX: 146,
      pinY: 132,
      services: [
        "Minecraft Hosting",
        "KVM VPS Infrastructure",
        "Bot Hosting Infrastructure (Draft)",
      ],
      summary:
        "Serves players across North, Central, and South America — and hosts our proposed Miami-based Bot Hosting containers.",
      botInfraNote:
        "Dedicated region for Bot Hosting infrastructure; no unverified global ping guarantees are published.",
    },
    {
      id: "in",
      code: "IN",
      city: "India",
      country: "India",
      regionLabel: "South Asia",
      pinX: 356,
      pinY: 140,
      services: ["Minecraft Hosting", "KVM VPS Infrastructure"],
      summary:
        "Available for Indian and neighboring South Asian Minecraft and KVM VPS communities.",
    },
    {
      id: "sg",
      code: "SG",
      city: "Singapore",
      country: "Singapore",
      regionLabel: "Southeast Asia",
      pinX: 396,
      pinY: 170,
      services: ["Minecraft Hosting", "KVM VPS Infrastructure"],
      summary:
        "Available for players across Southeast Asia and nearby Asia-Pacific regions.",
    },
  ] as LocationInfo[],
  missingSpecsTodo:
    "TODO: add verified network speeds, latency probe results, or routing notes only after owner confirmation",
};

export interface DocArticle {
  id: string;
  title: string;
  summary: string;
  steps: string[];
  note?: string;
}

export interface DocCategory {
  id: string;
  title: string;
  description: string;
  articles: DocArticle[];
}

export const docsPage = {
  eyebrow: "knowledge base",
  heading: "How everything works.",
  highlightWord: "everything",
  sub: "Step-by-step guides for Minecraft hosting, Paper/Purpur/Fabric engines, KVM VPS setup, upcoming Miami Bot Hosting, backups, and billing.",
  categories: [
    {
      id: "getting-started",
      title: "Getting Started",
      description: "From ordering at billing.petalnodes.cloud to opening panel.petalnodes.cloud.",
      articles: [
        {
          id: "order-to-panel",
          title: "Accessing your billing area and Game Panel",
          summary: "Where to manage subscriptions, tickets, and launch your server.",
          steps: [
            "Complete checkout in the Client Area at billing.petalnodes.cloud. Your server is generally provisioned within 15–30 minutes after successful payment.",
            "Sign in to the Game Panel at panel.petalnodes.cloud to locate your provisioned server once setup completes.",
            "Confirm your assigned region (Singapore, Miami, or India) and start your server from the Console tab.",
          ],
        },
        {
          id: "allocations-databases",
          title: "Using your 2 allocations and 2 database slots",
          summary: "Every paid Minecraft tier includes 2 network allocations and 2 databases.",
          steps: [
            "Open the Network tab inside panel.petalnodes.cloud to view your primary IP:Port allocation.",
            "Reserve the second allocation when running crossplay listeners or companion plugin ports.",
            "Create up to 2 databases in the Databases tab for economy, permissions, or logging plugins.",
          ],
        },
      ],
    },
    {
      id: "creating-minecraft-server",
      title: "Creating a Minecraft Server",
      description: "Selecting your engine, accepting the EULA, and sharing your server address.",
      articles: [
        {
          id: "first-boot",
          title: "Launching your Minecraft world for the first time",
          summary: "Pick your verified server software, generate spawn chunks, and connect.",
          steps: [
            "Select Paper, Purpur, or Fabric in panel.petalnodes.cloud according to whether you plan to run plugins or Fabric mods.",
            "Click Start in the Console tab and accept the official Minecraft EULA prompt when it appears.",
            "Wait until `Done` prints in the live console log, then share your primary IP:Port from Network with friends.",
          ],
        },
      ],
    },
    {
      id: "java-bedrock",
      title: "Java & Bedrock",
      description: "Confirmed support for both Java Edition and Bedrock Edition players.",
      articles: [
        {
          id: "editions-overview",
          title: "Java & Bedrock crossplay essentials",
          summary: "Java & Bedrock support is included across paid Minecraft plans and Bloom Boost reward tiers.",
          steps: [
            "Java Edition players enter your primary IP:Port under Multiplayer → Add Server.",
            "Keep your secondary network allocation reserved on the Network tab for crossplay port routing.",
            "For custom Bedrock port setup guidance before it is documented here, check with staff in our Discord Support channel.",
          ],
          note: "TODO: add exact Geyser/Bedrock port instructions once confirmed with owner.",
        },
      ],
    },
    {
      id: "paper-purpur-fabric",
      title: "Paper, Purpur, and Fabric",
      description: "Choosing among the three confirmed server engines on Petalnodes.",
      articles: [
        {
          id: "engine-comparison",
          title: "Comparing Paper, Purpur, and Fabric",
          summary: "Select the right engine for vanilla+ SMPs, plugin networks, or lightweight mods.",
          steps: [
            "Paper: Fast Spigot/Bukkit-compatible server suited for general survival worlds and plugin ecosystems.",
            "Purpur: Built on Paper with extra gameplay and configuration toggles while retaining Paper plugin compatibility.",
            "Fabric: Lightweight modular server loader for server-side optimization mods and Fabric modpacks.",
          ],
          note: "TODO: confirm whether Forge, NeoForge, or Velocity should be added to verified engines.",
        },
      ],
    },
    {
      id: "installing-plugins",
      title: "Installing Plugins",
      description: "Safely adding `.jar` plugins on Paper and Purpur servers.",
      articles: [
        {
          id: "plugin-install-workflow",
          title: "Uploading plugins and checking compatibility",
          summary: "Add verified `.jar` files cleanly without corrupting active worlds.",
          steps: [
            "Create a snapshot in Backups and stop your server safely from the Console tab.",
            "Open File Management in panel.petalnodes.cloud and enter the `/plugins` directory.",
            "Upload your plugin `.jar` matching your exact Minecraft version, start the server, and inspect startup logs for any missing library warnings.",
          ],
        },
      ],
    },
    {
      id: "file-management",
      title: "File Management",
      description: "Navigating directories, editing configs, and uploading worlds.",
      articles: [
        {
          id: "panel-file-manager",
          title: "Editing server configs and uploading archives",
          summary: "Use the built-in File Management view inside panel.petalnodes.cloud.",
          steps: [
            "Open the Files tab in panel.petalnodes.cloud to inspect root folders, `/plugins`, `/mods`, and world directories.",
            "Click configuration files (`server.properties`, `bukkit.yml`, `spigot.yml`, `paper-global.yml`) to edit them directly in the browser.",
            "Compress large custom worlds into a `.zip` or `.tar.gz` archive before uploading, then use Unarchive inside the file manager.",
          ],
        },
      ],
    },
    {
      id: "server-backups",
      title: "Server Backups",
      description: "Daily backups included across Minecraft and VPS plans.",
      articles: [
        {
          id: "backup-restore",
          title: "Using and restoring daily backups",
          summary: "Daily Backups Included protects worlds before plugin updates or major builds.",
          steps: [
            "Open the Backups section inside panel.petalnodes.cloud prior to major version upgrades or world edits.",
            "Verify your most recent automated daily backup appears cleanly in the list.",
            "When restoring a backup, stop the server first so open world chunk locks are flushed cleanly.",
          ],
          note: "TODO: document exact backup retention days and slot limit once confirmed.",
        },
      ],
    },
    {
      id: "server-configuration",
      title: "Server Configuration",
      description: "Access control, whitelists, operators, and world properties.",
      articles: [
        {
          id: "whitelist-operators",
          title: "Setting up whitelist, operators, and world rules",
          summary: "Keep friend-group worlds private and manage admin privileges safely.",
          steps: [
            "In `server.properties`, set `white-list=true` (or run `whitelist on` in the panel console).",
            "Add trusted usernames with `whitelist add <username>` and reload if needed.",
            "Grant operator access sparingly via `op <username>` and adjust `view-distance` responsibly if many players explore simultaneously.",
          ],
        },
      ],
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      description: "Diagnosing crashes, port errors, and checking regional status.",
      articles: [
        {
          id: "crash-diagnostics",
          title: "Reading startup logs and checking live node status",
          summary: "Quick triage steps when a server stalls or fails to restart.",
          steps: [
            "Read the final lines above `Server thread/ERROR` inside Console to spot incompatible plugins or mismatched Java/Minecraft versions.",
            "Check https://status.petalnodes.cloud for regional node notices across Singapore, Miami, and India.",
            "Copy the latest log snippet (`/logs/latest.log`) and share it inside a Discord Support Ticket or Client Area ticket for team help.",
          ],
        },
      ],
    },
    {
      id: "billing-account",
      title: "Billing and Account Access",
      description: "Managing billing.petalnodes.cloud, upgrades, and Discord rewards.",
      articles: [
        {
          id: "billing-and-rewards",
          title: "Client Area billing, upgrades, and Petal/Bloom claims",
          summary: "Separate workflows for paid INR hosting vs Discord invite & boost rewards.",
          steps: [
            "Manage paid Minecraft and VPS subscriptions, invoices, and plan upgrades inside https://billing.petalnodes.cloud.",
            "Provisioning: Servers are generally provisioned within 15–30 minutes after successful payment.",
            "Refunds: Refund requests are reviewed on a case-by-case basis. Please contact our support team for assistance. Refund approval is subject to review.",
            "To claim Petal Free Server Rewards (6–30 invites, 2GB–17GB RAM) or Bloom Boost Rewards (1–4 boosts, 3GB–12GB RAM), open a Discord Support Ticket.",
            "Keep active server boosts enabled for Bloom tiers and follow posted invite integrity rules for Petal rewards.",
          ],
        },
      ],
    },
    {
      id: "vps-getting-started",
      title: "VPS Getting Started",
      description: "Connecting to your KVM Linux VPS with full root access.",
      articles: [
        {
          id: "vps-first-ssh",
          title: "Connecting via SSH and basic KVM Linux setup",
          summary: "Verified KVM Virtualization, Full Root Access, Linux OS, and daily backups.",
          steps: [
            "After ordering one of the five KVM VPS plans (Root through Evergrove), locate your assigned server IPv4 (subject to availability) and root credentials inside billing.petalnodes.cloud.",
            "Connect from your terminal or SSH client using `ssh root@<your-server-ip>` and update OS packages on first login.",
            "Keep firewall rules clean, use SSH keys instead of plain passwords when possible, and confirm DDoS / Cloudflare network settings for exposed web services.",
          ],
        },
      ],
    },
    {
      id: "bot-hosting-getting-started",
      title: "Bot Hosting Getting Started (Draft)",
      description: "Pre-launch panel workflow for Miami Bot Hosting containers.",
      articles: [
        {
          id: "bot-hosting-workflow",
          title: "Expected panel workflow for Miami Bot Hosting",
          summary: "Draft guide covering verified panel controls while runtime & launch confirmations are pending.",
          steps: [
            "Bot Hosting containers will run on Petalnodes Miami, USA VPS infrastructure and connect to panel.petalnodes.cloud.",
            "Upload bot source files via File Management, set tokens and secrets inside environment/startup settings rather than hardcoding them, and control start/restart from the Console.",
            "If you need custom system packages or guaranteed multi-service Docker stacks right now, deploy a Root or Branch KVM Linux VPS instead.",
          ],
          note: "TODO: confirm exact supported runtimes (Node.js / Python / Java) and Bot Hosting launch instructions before finalizing this guide.",
        },
      ],
    },
  ] as DocCategory[],
};

export const modpacksPage = {
  eyebrow: "server software & modpacks",
  heading: "Built for Paper, Purpur, and Fabric.",
  highlightWord: "Fabric",
  sub: "Run multiplayer SMPs with plugins or upload your own Fabric modpack setup using your Game Panel and NVMe storage.",
  verifiedSoftware: [
    {
      name: "Paper",
      role: "High-performance plugin server",
      detail:
        "Ideal for survival worlds, communities, and Spigot/Paper plugin setups.",
    },
    {
      name: "Purpur",
      role: "Customizable Paper drop-in",
      detail:
        "Adds deep gameplay and entity behavior toggles while keeping full Paper plugin compatibility.",
    },
    {
      name: "Fabric",
      role: "Lightweight modded loader",
      detail:
        "Great for server-side optimization mods and curated Fabric modpack environments.",
    },
  ],
  workflowSteps: [
    {
      step: "01",
      title: "Pick your Cherry Blossom tier",
      detail:
        "Vanilla and light plugin worlds fit comfortably on Seed through Sapling, while heavier modded worlds can scale up to Grove, Orchard, or Sakura (up to 24GB RAM).",
    },
    {
      step: "02",
      title: "Select Paper, Purpur, or Fabric",
      detail:
        "Choose a confirmed server engine in panel.petalnodes.cloud with Java & Bedrock support and 2 database slots ready.",
    },
    {
      step: "03",
      title: "Upload mods or packs via File Manager",
      detail:
        "Upload your curated mods, configs, and custom world files directly into your server directory on NVMe storage.",
    },
  ],
  catalogNotice:
    "TODO: confirm pre-installed modpack catalog and Forge/NeoForge support before adding specific named modpacks.",
};

export const aboutPage = {
  eyebrow: "about petalnodes",
  heading: "Hosting grown with care, not bloat.",
  highlightWord: "care",
  intro:
    "Petalnodes is built around a simple promise: honest specifications, clear INR pricing, reliable NVMe infrastructure across Singapore, Miami, and India, and real humans ready on Discord.",
  pillars: [
    {
      title: "Honest infrastructure",
      body: "Our nodes run on AMD Ryzen and Intel Xeon Gold processors, DDR5 memory, and NVMe storage across Singapore, Miami, and India — protected by DDoS mitigation and Cloudflare.",
    },
    {
      title: "Community first",
      body: "From ₹59/mo Seed worlds to free Petal invite servers and Bloom Discord boost rewards, we build room for friend groups and growing communities alike.",
    },
    {
      title: "Friendly panel & root VPS access",
      body: "Manage Minecraft worlds cleanly at panel.petalnodes.cloud with daily backups included, or deploy full-root KVM Linux instances on our Cherry Blossom VPS tiers.",
    },
  ],
  ownerDetailsTodo:
    "TODO: confirm founding story, team members, and registered business details with owner.",
};

export const contactPage = {
  eyebrow: "contact & support",
  heading: "Talk to real humans.",
  highlightWord: "humans",
  sub: "Whether you have a pre-sales question, need help configuring a world or VPS, or want to claim a Discord reward, reach us through our verified support channels.",
  email: "support@petalnodes.cloud",
  channels: [
    {
      id: "discord",
      title: "Discord Community & Tickets",
      description:
        "Fastest way to reach the team 24/7, ask pre-sales questions, or claim Petal Free Server & Bloom Boost rewards.",
      ctaLabel: "Join Discord Server",
      hrefKey: "discord" as const,
      stamp: "ACTIVE",
    },
    {
      id: "email",
      title: "Direct Email Support",
      description:
        "Reach our team directly at support@petalnodes.cloud for general inquiries, accounts, and assistance.",
      ctaLabel: "Email Us",
      hrefKey: "email" as const,
      stamp: "OFFICIAL",
    },
    {
      id: "billing",
      title: "Client Area & Billing Tickets",
      description:
        "Open an account or billing ticket, manage invoices, and access your services at billing.petalnodes.cloud.",
      ctaLabel: "Open Client Area",
      hrefKey: "clientArea" as const,
      stamp: "VERIFIED",
    },
    {
      id: "panel",
      title: "Game Panel & Status",
      description:
        "Control running servers at panel.petalnodes.cloud or check live uptime notices at status.petalnodes.cloud.",
      ctaLabel: "Open Game Panel",
      hrefKey: "gamePanel" as const,
      stamp: "LIVE",
    },
  ],
  supportHours: "24/7 ticket support via Discord and Client Area; email responses typically within 24 hours.",
};

export interface LegalSection {
  id: string;
  title: string;
  body: string;
  todoMarker?: string;
}

export interface LegalDocument {
  id: "terms" | "privacy" | "sla";
  eyebrow: string;
  heading: string;
  lastUpdated: string;
  draftNotice: string;
  sections: LegalSection[];
}

export const legalDocs: Record<"terms" | "privacy" | "sla", LegalDocument> = {
  terms: {
    id: "terms",
    eyebrow: "legal draft · pending approval",
    heading: "Terms of Service (Draft)",
    lastUpdated: "TODO: effective date",
    draftNotice:
      "INITIAL DRAFT FOR OWNER REVIEW — Business registration details, refund eligibility window, billing rules, and governing jurisdiction are marked TODO until explicitly approved.",
    sections: [
      {
        id: "scope-operator",
        title: "1. Service Scope & Operator",
        body: "These draft Terms of Service apply to Petalnodes websites (petalnodes.cloud), billing portals (billing.petalnodes.cloud), game control panel (panel.petalnodes.cloud), Minecraft hosting, KVM VPS hosting, upcoming Miami Bot hosting, and community reward services.",
        todoMarker: "TODO: legal entity name, registered address, and contact email",
      },
      {
        id: "acceptable-use",
        title: "2. Acceptable Use & Fair Resource Rules",
        body: "Customers agree to use Petalnodes servers lawfully and in accordance with applicable Minecraft EULA guidelines (Not an official Minecraft product; not approved by or associated with Mojang or Microsoft). Network scanning, denial-of-service outbound attacks, copyright abuse, and deliberate exhaustion of shared resources are strictly prohibited.",
      },
      {
        id: "billing-refunds",
        title: "3. Billing, Renewals & Refunds",
        body: "Plan pricing is displayed in INR (₹) per month on petalnodes.cloud and managed via billing.petalnodes.cloud. Your server is generally provisioned within 15–30 minutes after successful payment. Refund requests are reviewed on a case-by-case basis. Please contact our support team for assistance. Refund approval is subject to review.",
      },
      {
        id: "backups-responsibility",
        title: "4. Backups & Customer Responsibility",
        body: "Daily backups are included across Minecraft and KVM VPS tiers to aid recovery, though customers remain responsible for maintaining off-site copies of critical worlds, databases, or application code prior to major updates.",
      },
      {
        id: "rewards-tiers",
        title: "5. Free & Discord Boost Reward Tiers",
        body: "Petal invite servers and Bloom Discord boost reward servers are claimed via Discord Support Tickets. Free invite rewards follow posted invite-integrity rules (Member Leave −2, Rejoin −1, Fake/Alt −2, Mass Ping Invite Reset). Bloom boost rewards require active boosts to be maintained.",
      },
      {
        id: "governing-law",
        title: "6. Governing Law & Disputes",
        body: "Final dispute resolution procedures, venue, and governing jurisdiction will be inserted once approved by the owner.",
        todoMarker: "TODO: governing country/state jurisdiction",
      },
    ],
  },
  privacy: {
    id: "privacy",
    eyebrow: "legal draft · pending approval",
    heading: "Privacy Policy (Draft)",
    lastUpdated: "TODO: effective date",
    draftNotice:
      "INITIAL DRAFT FOR OWNER REVIEW — Exact data-retention windows, third-party processors, and DPO/privacy contact details are marked TODO until owner confirmation.",
    sections: [
      {
        id: "info-collected",
        title: "1. Account, Billing & Support Information",
        body: "Account, billing, and ticket records submitted through billing.petalnodes.cloud, panel.petalnodes.cloud, or Discord support tickets are used to provision, secure, and support requested hosting services.",
        todoMarker: "TODO: list exact telemetry, analytics, and payment processor disclosures",
      },
      {
        id: "backups-retention",
        title: "2. Backups & Server Storage Data",
        body: "Customer game worlds, server configs, bot scripts, and KVM VPS volumes remain isolated to assigned instances. Daily backups are generated solely for customer recovery and operational resilience.",
        todoMarker: "TODO: specify exact backup & account-deletion retention periods",
      },
      {
        id: "security-controls",
        title: "3. Security & Network Protection",
        body: "Petalnodes employs network DDoS mitigation, Cloudflare protection, and authenticated panel controls to help safeguard infrastructure against unauthorized access.",
      },
      {
        id: "privacy-requests",
        title: "4. Data Access & Deletion Requests",
        body: "Requests for data export, correction, or deletion can be routed through Client Area or Discord tickets until a dedicated official privacy contact is finalized.",
        todoMarker: "TODO: official privacy contact email & jurisdiction-specific rights",
      },
    ],
  },
  sla: {
    id: "sla",
    eyebrow: "legal draft · pending approval",
    heading: "Service Level Agreement (Draft)",
    lastUpdated: "TODO: effective date",
    draftNotice:
      "INITIAL DRAFT FOR OWNER REVIEW — Specific uptime percentage targets, credit compensation schedules, and scheduled maintenance windows are marked TODO until approved.",
    sections: [
      {
        id: "status-transparency",
        title: "1. Live Status & Incident Communication",
        body: "Network incidents and regional availability across Singapore, Miami, and India are communicated via https://status.petalnodes.cloud and Discord announcements.",
      },
      {
        id: "uptime-credits",
        title: "2. Uptime Target & Service Credits",
        body: "Specific monthly uptime percentage commitments and service-credit compensation schedules require explicit owner approval and are intentionally withheld from guessing here.",
        todoMarker: "TODO: confirmed monthly uptime SLA target and credit schedule",
      },
      {
        id: "sla-exclusions",
        title: "3. Exclusions & Maintenance Windows",
        body: "Downtime resulting from customer misconfigurations, plugin/mod crashes, exceeded CPU/RAM allocations, upstream force majeure events, or announced maintenance windows is excluded from uptime calculations.",
        todoMarker: "TODO: confirm maintenance notice period and claim window",
      },
    ],
  },
};
