import * as React from "react";
import { Story } from "@/sections/home/Story";
import { PlansHighlight } from "@/sections/home/PlansHighlight";
import { HostingCategories } from "@/sections/home/HostingCategories";
import { TrustStrip } from "@/sections/home/TrustStrip";
import { FAQ } from "@/sections/home/FAQ";
import { FinalCTA } from "@/sections/home/FinalCTA";

export default function Home() {
  return (
    <>
      <Story />
      <PlansHighlight />
      <HostingCategories />
      <TrustStrip />
      <FAQ />
      <FinalCTA />
    </>
  );
}
