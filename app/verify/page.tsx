"use client";

import Verify from "@/components/Verify";
import { useAppShell } from "@/context/AppShellContext";

export default function VerifyRoute() {
  const { setUser } = useAppShell();
  return <Verify onVerified={(verifiedUser) => setUser(verifiedUser ?? null)} />;
}