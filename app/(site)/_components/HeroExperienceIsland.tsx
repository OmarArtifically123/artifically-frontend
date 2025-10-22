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
  const [heroReadyAnnouncement, setHeroReadyAnnouncement] = useState<string | null>(null);
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

  const toggleStaticHero = useCallback((shouldHide: boolean) => {
    if (typeof document === "undefined") {
      return;
    }

    const staticHero = document.querySelector<HTMLElement>("[data-hero-static]");
    if (!staticHero) {
      return;
    }

    if (shouldHide) {
      staticHero.hidden = true;
      staticHero.setAttribute("aria-hidden", "true");
      staticHero.setAttribute("inert", "");
    } else {
      staticHero.hidden = false;
      staticHero.removeAttribute("aria-hidden");
      staticHero.removeAttribute("inert");
    }
  }, []);

  const handleHeroReady = useCallback(() => {
    if (typeof document === "undefined") {
      return;
    }

    const staticHero = document.querySelector<HTMLElement>("[data-hero-static]");
    const previouslyFocused = document.activeElement;

    toggleStaticHero(true);

    if (
      staticHero &&
      previouslyFocused instanceof HTMLElement &&
      staticHero.contains(previouslyFocused)
    ) {
      const focusTarget =
        document.querySelector<HTMLElement>("[data-hero-enhanced] [data-hero-focus-target]") ??
        document.querySelector<HTMLElement>("[data-hero-enhanced]");
      focusTarget?.focus({ preventScroll: true });
    }

    setHeroReadyAnnouncement((current) => current ?? "Interactive hero experience is now available.");
  }, [toggleStaticHero]);

  useEffect(() => {
    setEnhanceHero(true);
  }, []);

  const handleHeroError = useCallback((error: unknown) => {
    if (process.env.NODE_ENV !== "production") {
      console.error("Hero enhancement failed", error);
    }
    toggleStaticHero(false);
    setEnhanceHero(false);
    setHeroReadyAnnouncement(null);
  }, [toggleStaticHero]);

  return (
    <>
      {heroReadyAnnouncement ? (
        <p role="status" aria-live="polite" className="sr-only">
          {heroReadyAnnouncement}
        </p>
      ) : null}
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