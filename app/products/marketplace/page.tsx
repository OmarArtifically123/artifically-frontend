"use client";

import Marketplace from "@/pages/Marketplace";
import { useAppShell } from "@/context/AppShellContext";

export default function MarketplaceRoute() {
  const { user, openAuth } = useAppShell();
  return <Marketplace user={user} openAuth={openAuth} />;
}