"use client";

import Dashboard from "@/components/Dashboard";
import RouteShell from "@/components/skeletons/RouteShell";
import HomePage from "@/app/(site)/_components/HomePage";
import { useAppShell } from "@/context/AppShellContext";

export default function DashboardRouteClient() {
  const { user, openAuth, authChecking } = useAppShell();

  if (authChecking) {
    return <RouteShell rows={6} />;
  }

  if (!user) {
    return <HomePage />;
  }

  return <Dashboard user={user} openAuth={openAuth} />;
}