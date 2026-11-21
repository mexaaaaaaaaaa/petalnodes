import * as React from "react";
import { footerConfig } from "@/content";
import DoodleCrewFooter from "@/components/ui/doodle-crew-footer";
import { LineBoilFilters, Nodey, PaperBackground } from "@/components/sketch";
import { Nav } from "./Nav";

const DevTodoBadgeLazy =
  typeof import.meta.env !== "undefined" && import.meta.env.DEV
    ? React.lazy(() =>
        import("./DevTodoBadge").then((m) => ({ default: m.DevTodoBadge })),
      )
    : null;

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <PaperBackground>
      <LineBoilFilters />
      <Nav />
      <main id="main-content">{children}</main>
      <DoodleCrewFooter
        wordmark={footerConfig.wordmark}
        brand={footerConfig.brand}
        blurb={footerConfig.blurb}
        tagline={footerConfig.tagline}
        palette={footerConfig.palette}
        fontFamily='"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif'
        serifFamily='"Fraunces", Georgia, serif'
        columns={footerConfig.columns}
        actions={footerConfig.actions}
        copyright={footerConfig.copyright}
        legal={footerConfig.legal}
        socials={footerConfig.socials}
        doodles={footerConfig.doodles}
        doodleCount={footerConfig.doodleCount}
        crew={footerConfig.crew}
        logo={<Nodey size={28} boil={false} />}
      />
      {import.meta.env?.DEV && DevTodoBadgeLazy && (
        <React.Suspense fallback={null}>
          <DevTodoBadgeLazy />
        </React.Suspense>
      )}
    </PaperBackground>
  );
}
