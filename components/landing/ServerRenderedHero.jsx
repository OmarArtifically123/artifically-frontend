"use client";

import { memo } from "react";
import MarketingHomeServer from "../../rsc/MarketingHome.server.jsx";
import ScrollIndicator from "./ScrollIndicator";

function ServerRenderedHero({ hidden = false }) {
  return (
    <div
      className="marketing-rsc-shell"
      data-enhanced="false"
      data-hero-static="true"
      hidden={hidden}
      aria-hidden={hidden}
    >
      <MarketingHomeServer />
      <ScrollIndicator targetId="problem-solution" hostId="marketing-hero-static" />
    </div>
  );
}

export default memo(ServerRenderedHero);