"use client";

import HomePage from "@/app/(site)/_components/HomePage";
import { useAppShell } from "@/context/AppShellContext";

export default function HomePageClient() {
  const { openAuth } = useAppShell();
  return <HomePage openAuth={openAuth} />;
}