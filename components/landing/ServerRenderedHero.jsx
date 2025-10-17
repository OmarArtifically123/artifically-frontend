"use client";

import { memo } from "react";
import MarketingHomeServer from "../../rsc/MarketingHome.server.jsx";

function ServerRenderedHero({ hidden = false }) {
  return (
    <div
      className="marketing-rsc-shell"
      data-enhanced="false"
      hidden={hidden}
      aria-hidden={hidden}
    >
      <MarketingHomeServer />
    </div>
  );
}

export default memo(ServerRenderedHero);