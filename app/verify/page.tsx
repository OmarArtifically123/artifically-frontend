"use client";

import Verify from "@/components/Verify";
import { useAppShell, type AuthUser } from "@/context/AppShellContext";

export default function VerifyRoute() {
  const { setUser } = useAppShell();
  return (
    <Verify onVerified={(verifiedUser: AuthUser | undefined) => setUser(verifiedUser ?? null)} />
  );
}