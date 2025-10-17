"use client";

import { createContext, useContext } from "react";

type AuthMode = "signin" | "signup";

type AuthUser = {
  verified?: boolean;
  [key: string]: unknown;
} | null;

type AppShellContextValue = {
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  setUser: (user: AuthUser) => void;
  user: AuthUser;
  authChecking: boolean;
};

const AppShellContext = createContext<AppShellContextValue | undefined>(undefined);

export function AppShellProvider({
  value,
  children,
}: {
  value: AppShellContextValue;
  children: React.ReactNode;
}) {
  return <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>;
}

export function useAppShell() {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error("useAppShell must be used within an AppShellProvider");
  }
  return context;
}