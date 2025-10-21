"use client";

import { lazy, Suspense, useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { ErrorBoundary } from "react-error-boundary";

import HeroDemoModal from "@/components/landing/HeroDemoModal";
import type { AuthMode } from "@/context/AppShellContext";
import { useAppShell } from "@/context/AppShellContext";

const HeroSection = lazy(() => import("@/components/landing/HeroSection"));

const demoDialogId = "hero-demo-modal";

type HeroExperienceIslandProps = {
  initialMode?: AuthMode;
};

export default function HeroExperienceIsland({ initialMode = "signup" }: HeroExperienceIslandProps) {
  const { openAuth } = useAppShell();
  const [demoOpen, setDemoOpen] = useState(false);
  const [enhanceHero, setEnhanceHero] = useState(false);
  const demoTriggerRef = useRef<HTMLButtonElement | null>(null);

  const handlePrimary = useCallback(
    (event?: MouseEvent<HTMLButtonElement>) => {
      openAuth(initialMode, { trigger: event?.currentTarget ?? null });
    },
    [initialMode, openAuth],
  );

  const handleSecondary = useCallback((event?: MouseEvent<HTMLButtonElement>) => {
    if (event?.currentTarget instanceof HTMLElement) {
      demoTriggerRef.current = event.currentTarget;
    } else {
      demoTriggerRef.current = null;
    }
    setDemoOpen(true);
  }, []);

  const handleDemoClose = useCallback(() => {
    setDemoOpen(false);
  }, []);

  const handleHeroReady = useCallback(() => {
    const staticHero = document.querySelector<HTMLElement>("[data-hero-static]");
    if (staticHero) {
      staticHero.hidden = true;
      staticHero.setAttribute("aria-hidden", "true");
    }
  }, []);

  useEffect(() => {
    setEnhanceHero(true);
  }, []);

  const handleHeroError = useCallback((error: unknown) => {
    if (process.env.NODE_ENV !== "production") {
      console.error("Hero enhancement failed", error);
    }
    setEnhanceHero(false);
  }, []);

  return (
    <>
      {enhanceHero ? (
        <ErrorBoundary fallback={null} onError={handleHeroError}>
          <Suspense fallback={null}>
            <HeroSection
              onReady={handleHeroReady}
              onPrimary={handlePrimary}
              onSecondary={handleSecondary}
              demoDialogId={demoDialogId}
              demoOpen={demoOpen}
            />
          </Suspense>
        </ErrorBoundary>
      ) : null}
      <HeroDemoModal
        open={demoOpen}
        onClose={handleDemoClose}
        dialogId={demoDialogId}
        returnFocusRef={demoTriggerRef}
      />
    </>
  );
}