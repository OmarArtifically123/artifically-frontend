"use client";

import FinalCTASection from "@/components/landing/FinalCTASection";
import { useAppShell } from "@/context/AppShellContext";

export default function FinalCTASectionClient() {
  const { openAuth } = useAppShell();

  return (
    <FinalCTASection
      onSubmit={() => {
        openAuth("signup");
      }}
    />
  );
}