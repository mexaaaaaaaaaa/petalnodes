import * as React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { QualityProvider } from "@/app/QualityProvider";
import { SmoothScrollProvider, useSmoothScroll } from "@/app/SmoothScroll";
import { PageShell } from "@/components/layout/PageShell";
import { brand } from "@/content";
import { ScrollTrigger } from "@/lib/gsap";
import { chapterStart } from "@/lib/storyStore";
import Home from "@/pages/Home";
import Plans from "@/pages/Plans";
import VpsHosting from "@/pages/VpsHosting";
import BotHosting from "@/pages/BotHosting";
import Locations from "@/pages/Locations";
import Docs from "@/pages/Docs";
import Modpacks from "@/pages/Modpacks";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import LegalPage from "@/pages/LegalPage";
import NotFound from "@/pages/NotFound";

const DevSketchLazy = (import.meta.env && import.meta.env.DEV)
  ? React.lazy(() => import("@/pages/DevSketch"))
  : null;
const DevTexturesLazy = (import.meta.env && import.meta.env.DEV)
  ? React.lazy(() => import("@/pages/DevTextures"))
  : null;

const ROUTE_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: brand.metaTitle,
    description: brand.metaDescription,
  },
  "/plans": {
    title: "Minecraft Hosting Plans — Seed to Sakura | Petalnodes",
    description:
      "Seven Cherry Blossom Minecraft hosting tiers from 2GB Seed (₹59/mo) to 24GB Sakura (₹449/mo) with Java & Bedrock, Paper/Purpur/Fabric, NVMe, DDoS protection, and daily backups.",
  },
  "/vps": {
    title: "KVM Linux VPS Hosting — Root to Evergrove | Petalnodes",
    description:
      "Cherry Blossom KVM Linux VPS hosting from 4GB Root (₹300/mo) to 16GB Evergrove (₹1,600/mo) with full root access, NVMe, and daily backups across Singapore, Miami, and India.",
  },
  "/bots": {
    title: "Bot Hosting (Miami Draft) — Pollen to Blossom | Petalnodes",
    description:
      "Proposed botanical Discord, Telegram, Node.js, and Python bot hosting tiers on Miami, USA VPS infrastructure with NVMe storage and Game Panel management.",
  },
  "/locations": {
    title: "Server Locations — Singapore, Miami & India | Petalnodes",
    description:
      "Petalnodes global server locations across Singapore (SG), Miami (USA), and India (IN) powered by AMD Ryzen & Intel Xeon Gold hardware.",
  },
  "/docs": {
    title: "Documentation & Knowledge Base | Petalnodes",
    description:
      "Step-by-step Petalnodes guides for Minecraft server setup, Paper/Purpur/Fabric, Java & Bedrock, KVM VPS SSH access, Bot Hosting drafts, backups, and billing.",
  },
  "/modpacks": {
    title: "Modpacks & Server Software — Paper, Purpur & Fabric | Petalnodes",
    description:
      "Run Paper, Purpur, or Fabric servers on Petalnodes with NVMe storage and easy File Management via panel.petalnodes.cloud.",
  },
  "/about": {
    title: "About Petalnodes — Honest Hosting Grown with Care",
    description:
      "Learn about Petalnodes Cherry Blossom Minecraft, KVM VPS, and Miami Bot hosting infrastructure with NVMe storage and Discord support.",
  },
  "/contact": {
    title: "Contact & Support — Discord & Client Area | Petalnodes",
    description:
      "Reach the Petalnodes team through Discord tickets, Client Area billing tickets at billing.petalnodes.cloud, and live server status.",
  },
  "/terms": {
    title: "Terms of Service (Draft) | Petalnodes",
    description: "Draft Terms of Service for Petalnodes Minecraft, VPS, Bot hosting, and community reward services.",
  },
  "/privacy": {
    title: "Privacy Policy (Draft) | Petalnodes",
    description: "Draft Privacy Policy for Petalnodes hosting services, backups, and support tickets.",
  },
  "/sla": {
    title: "Service Level Agreement (Draft) | Petalnodes",
    description: "Draft Service Level Agreement and live status communication practices for Petalnodes.",
  },
  "/dev/textures": {
    title: "Dev Procedural Texture Inspector | Petalnodes",
    description: "Development preview of 64x64 procedural PBR block textures.",
  },
  "/dev/sketch": {
    title: "Dev Sketchbook Kit | Petalnodes",
    description: "Development preview of Petalnodes sketchbook UI components.",
  },
};

function RouteMetaAndScrollSync() {
  const location = useLocation();
  const { scrollToStoryProgress, scrollToTarget } = useSmoothScroll();

  React.useEffect(() => {
    const meta = ROUTE_META[location.pathname] ?? {
      title: `Page Not Found | ${brand.name}`,
      description: brand.metaDescription,
    };
    document.title = meta.title;

    const setMetaContent = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute("content", content);
    };
    setMetaContent('meta[name="description"]', meta.description);
    setMetaContent('meta[property="og:title"]', meta.title);
    setMetaContent('meta[property="og:description"]', meta.description);
    setMetaContent('meta[property="og:url"]', window.location.origin + window.location.pathname);
    setMetaContent('meta[name="twitter:title"]', meta.title);
    setMetaContent('meta[name="twitter:description"]', meta.description);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", window.location.origin + window.location.pathname);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    if (location.pathname === "/" && location.hash === "#roots") {
      const id = window.setTimeout(() => {
        const staticRoots = document.getElementById("chapter-roots");
        if (staticRoots) {
          scrollToTarget(staticRoots, -20);
        } else {
          scrollToStoryProgress(chapterStart("roots") + 0.01);
        }
        ScrollTrigger.refresh();
      }, 120);
      return () => window.clearTimeout(id);
    }

    if (location.hash) {
      const id = window.setTimeout(() => {
        const target = document.getElementById(location.hash.slice(1));
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 90);
      return () => window.clearTimeout(id);
    }

    window.scrollTo({ top: 0, behavior: "auto" });
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 60);
    return () => window.clearTimeout(id);
  }, [location.pathname, location.hash, scrollToStoryProgress, scrollToTarget]);

  return null;
}

export default function App() {
  return (
    <QualityProvider>
      <BrowserRouter>
        <SmoothScrollProvider>
          <RouteMetaAndScrollSync />
          <PageShell>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/vps" element={<VpsHosting />} />
              <Route path="/bots" element={<BotHosting />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/modpacks" element={<Modpacks />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<LegalPage docId="terms" />} />
              <Route path="/privacy" element={<LegalPage docId="privacy" />} />
              <Route path="/sla" element={<LegalPage docId="sla" />} />
              {(import.meta.env && import.meta.env.DEV) && DevSketchLazy && (
                <Route
                  path="/dev/sketch"
                  element={
                    <React.Suspense fallback={<div className="pt-28 text-center">Loading…</div>}>
                      <DevSketchLazy />
                    </React.Suspense>
                  }
                />
              )}
              {(import.meta.env && import.meta.env.DEV) && DevTexturesLazy && (
                <Route
                  path="/dev/textures"
                  element={
                    <React.Suspense fallback={<div className="pt-28 text-center">Loading…</div>}>
                      <DevTexturesLazy />
                    </React.Suspense>
                  }
                />
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageShell>
        </SmoothScrollProvider>
      </BrowserRouter>
    </QualityProvider>
  );
}
