"use client";

import { ReactNode, useEffect, useState } from "react";

type AppShellMainProps = {
  children: ReactNode;
};

export default function AppShellMain({ children }: AppShellMainProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <main
      id="main"
      role="main"
      className="app-shell"
      data-route-ready={hydrated ? "true" : "false"}
      tabIndex={-1}
    >
      {children}
    </main>
  );
}