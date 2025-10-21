"use client";

import { useCallback, useMemo, type MouseEvent } from "react";

import Header from "@/components/Header";
import { useAppShell } from "@/context/AppShellContext";

export default function AppShellHeader() {
  const { openAuth, user, signOut } = useAppShell();

  const handleSignIn = useCallback(
    (event?: MouseEvent<HTMLButtonElement>) => {
      openAuth("signin", { trigger: event?.currentTarget ?? null });
    },
    [openAuth],
  );
  const handleSignUp = useCallback(
    (event?: MouseEvent<HTMLButtonElement>) => {
      openAuth("signup", { trigger: event?.currentTarget ?? null });
    },
    [openAuth],
  );

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