"use client";

import Dashboard from "@/components/Dashboard";
import RouteShell from "@/components/skeletons/RouteShell";
import Home from "@/pages/Home";
import { useAppShell } from "@/context/AppShellContext";

export default function DashboardRoute() {
  const { user, openAuth, authChecking } = useAppShell();

  if (authChecking) {
    return <RouteShell rows={6} />;
  }

  if (!user) {
    return <Home openAuth={openAuth} />;
  }

  return <Dashboard user={user} openAuth={openAuth} />;
}