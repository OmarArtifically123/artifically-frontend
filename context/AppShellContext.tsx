"use client";

import { createContext, useContext } from "react";

export type AuthMode = "signin" | "signup";

export type AuthUser = {
  verified?: boolean;
  [key: string]: unknown;
} | null;

type OpenAuthOptions = {
  trigger?: HTMLElement | null;
};

type AppShellContextValue = {
  openAuth: (mode?: AuthMode, options?: OpenAuthOptions) => void;
  closeAuth: () => void;
  setUser: (user: AuthUser) => void;
  user: AuthUser;
  authChecking: boolean;
  signOut: () => void | Promise<void>;
  isHydrated: boolean;
  isNavigating: boolean;
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

export type { OpenAuthOptions };