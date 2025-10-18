"use client";

import { useCallback } from "react";

import Verify from "@/components/Verify";
import { useAppShell, type AuthUser } from "@/context/AppShellContext";

export default function VerifyRoute() {
  const { setUser } = useAppShell();
  const handleVerified = useCallback(
    (verifiedUser: AuthUser | undefined) => {
      setUser(verifiedUser ?? null);
    },
    [setUser],
  );

  return <Verify onVerified={handleVerified} />;
}