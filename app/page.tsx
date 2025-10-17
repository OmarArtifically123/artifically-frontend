"use client";

import Home from "@/pages/Home";
import { useAppShell } from "@/context/AppShellContext";

export default function HomeRoute() {
  const { openAuth } = useAppShell();
  return <Home openAuth={openAuth} />;
}