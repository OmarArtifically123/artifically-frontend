"use client";

import { useCallback, useMemo } from "react";

import Header from "@/components/Header";
import { useAppShell } from "@/context/AppShellContext";

export default function AppShellHeader() {
  const { openAuth, user, signOut } = useAppShell();

  const handleSignIn = useCallback(() => openAuth("signin"), [openAuth]);
  const handleSignUp = useCallback(() => openAuth("signup"), [openAuth]);

  const headerProps = useMemo(
    () => ({
      user,
      onSignIn: handleSignIn,
      onSignUp: handleSignUp,
      onSignOut: signOut,
    }),
    [user, handleSignIn, handleSignUp, signOut],
  );

  return <Header {...headerProps} />;
}