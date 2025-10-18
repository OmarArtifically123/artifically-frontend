"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import ContrastToggle from "./ContrastToggle";
import { useTheme } from "../context/ThemeContext";
import useMicroInteractions from "../hooks/useMicroInteractions";
import { space } from "../styles/spacing";
import MagneticButton from "./animation/MagneticButton";
import { StaggeredContainer, StaggeredItem } from "./animation/StaggeredList";
import LogoWordmark from "./ui/LogoWordmark";
import motionCatalog from "../design/motion/catalog";
import useViewTransitionNavigate from "../hooks/useViewTransitionNavigate";
import { Icon } from "./icons";
import AutomationsMegaMenu from "./header/AutomationsMegaMenu";
import SolutionsMegaMenu from "./header/SolutionsMegaMenu";

export default function Header({ user, onSignIn, onSignUp, onSignOut }) {
  const navigate = useViewTransitionNavigate();
  const pathname = usePathname() ?? "/";
  const { darkMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [predictedNav, setPredictedNav] = useState(null);
  const predictionTimerRef = useRef(null);
  const automationsTriggerRef = useRef(null);
  const automationsRestoreFocusRef = useRef(false);
  const solutionsTriggerRef = useRef(null);
  const solutionsRestoreFocusRef = useRef(false);
  const scrollIntentRef = useRef({
    y: typeof window !== "undefined" ? window.scrollY : 0,
    time: typeof performance !== "undefined" ? performance.now() : Date.now(),
  });
  const observerRef = useRef(null);
  const { dispatchInteraction } = useMicroInteractions();
  const [headerReady, setHeaderReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [automationsMenuState, setAutomationsMenuState] = useState("closed");
  const [solutionsMenuState, setSolutionsMenuState] = useState("closed");

  const headerVariants = useMemo(() => {
    const hidden = { opacity: 0 };
    if (!prefersReducedMotion) {
      hidden.y = -20;
    }
    const visible = {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionCatalog.durations.short,
        ease: motionCatalog.easings.out,
      },
    };
    if (prefersReducedMotion) {
      delete visible.y;
    }
    return { hidden, visible };
  }, [prefersReducedMotion]);

  const syncHeaderOffset = useCallback(() => {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const height = Math.round(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--header-offset", `${height}px`);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const timer = window.setTimeout(() => setHeaderReady(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (automationsMenuState === "opening") {
      if (prefersReducedMotion) {
        setAutomationsMenuState("open");
        return undefined;
      }
      const timer = window.setTimeout(() => {
        setAutomationsMenuState("open");
      }, 400);
      return () => window.clearTimeout(timer);
    }
    if (automationsMenuState === "closing") {
      if (prefersReducedMotion) {
        setAutomationsMenuState("closed");
        return undefined;
      }
      const timer = window.setTimeout(() => {
        setAutomationsMenuState("closed");
      }, 250);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [automationsMenuState, prefersReducedMotion]);

  useEffect(() => {
    if (solutionsMenuState === "opening") {
      if (prefersReducedMotion) {
        setSolutionsMenuState("open");
        return undefined;
      }
      const timer = window.setTimeout(() => {
        setSolutionsMenuState("open");
      }, 400);
      return () => window.clearTimeout(timer);
    }
    if (solutionsMenuState === "closing") {
      if (prefersReducedMotion) {
        setSolutionsMenuState("closed");
        return undefined;
      }
      const timer = window.setTimeout(() => {
        setSolutionsMenuState("closed");
      }, 250);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [solutionsMenuState, prefersReducedMotion]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }
    if (automationsMenuState === "closed") {
      document.body.classList.remove("automations-mega-open");
      return undefined;
    }
    document.body.classList.add("automations-mega-open");
    return () => {
      document.body.classList.remove("automations-mega-open");
    };
  }, [automationsMenuState]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }
    if (solutionsMenuState === "closed") {
      document.body.classList.remove("solutions-mega-open");
      return undefined;
    }
    document.body.classList.add("solutions-mega-open");
    return () => {
      document.body.classList.remove("solutions-mega-open");
    };
  }, [solutionsMenuState]);

  const closeAutomationsMenu = useCallback(
    (options = {}) => {
      if (options.focusTrigger) {
        automationsRestoreFocusRef.current = true;
      }
      setAutomationsMenuState((current) => {
        if (prefersReducedMotion) {
          return "closed";
        }
        if (current === "closed") {
          return current;
        }
        return "closing";
      });
    },
    [prefersReducedMotion],
  );

  const closeSolutionsMenu = useCallback(
    (options = {}) => {
      if (options.focusTrigger) {
        solutionsRestoreFocusRef.current = true;
      }
      setSolutionsMenuState((current) => {
        if (prefersReducedMotion) {
          return "closed";
        }
        if (current === "closed") {
          return current;
        }
        return "closing";
      });
    },
    [prefersReducedMotion],
  );

  useEffect(() => {
    if (automationsMenuState === "closed") {
      return undefined;
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAutomationsMenu({ focusTrigger: true });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [automationsMenuState, closeAutomationsMenu]);

  useEffect(() => {
    if (automationsMenuState === "closed" && automationsRestoreFocusRef.current) {
      automationsRestoreFocusRef.current = false;
      automationsTriggerRef.current?.focus({ preventScroll: true });
    }
  }, [automationsMenuState]);

  useEffect(() => {
    if (solutionsMenuState === "closed") {
      return undefined;
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSolutionsMenu({ focusTrigger: true });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [solutionsMenuState, closeSolutionsMenu]);

  useEffect(() => {
    if (solutionsMenuState === "closed" && solutionsRestoreFocusRef.current) {
      solutionsRestoreFocusRef.current = false;
      solutionsTriggerRef.current?.focus({ preventScroll: true });
    }
  }, [solutionsMenuState]);

  const commitPrediction = useCallback(
    (path, ttl = 1600) => {
      if (!path || path === pathname) {
        setPredictedNav(null);
        return;
      }
      setPredictedNav(path);
      if (predictionTimerRef.current && typeof window !== "undefined") {
        window.clearTimeout(predictionTimerRef.current);
      }
      if (typeof window !== "undefined") {
        predictionTimerRef.current = window.setTimeout(() => {
          setPredictedNav((current) => (current === path ? null : current));
        }, ttl);
      }
    },
    [pathname],
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleScroll = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      if (maxScroll <= 0) return;

      const position = window.scrollY;
      const ratio = Math.min(1, Math.max(0, position / maxScroll));
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      const { y, time } = scrollIntentRef.current;
      const deltaY = position - y;
      const deltaTime = Math.max(now - time, 16);
      const velocity = deltaY / deltaTime;
      scrollIntentRef.current = { y: position, time: now };

      let target = null;
      if (velocity > 0.3 && ratio > 0.55) {
        target = "/pricing";
      } else if (velocity > 0.18 && ratio > 0.25) {
        target = "/marketplace";
      } else if (velocity < -0.25 && ratio < 0.12) {
        target = "/docs";
      } else if (ratio > 0.85) {
        target = "/docs";
      }

      if (target && target !== pathname) {
        commitPrediction(target, 1400);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, commitPrediction]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      return undefined;
    }
    const elements = Array.from(document.querySelectorAll("[data-intent-route]"));
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const route = entry.target.dataset.intentRoute;
          if (!route || route === pathname) return;
          const threshold = Number(entry.target.dataset.intentThreshold || 0.4);
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            commitPrediction(route, 1800);
          }
        });
      },
      { threshold: [0.25, 0.4, 0.6] },
    );

    elements.forEach((element) => observer.observe(element));
    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [pathname, commitPrediction]);

  useEffect(() => {
    return () => {
      if (predictionTimerRef.current && typeof window !== "undefined") {
        window.clearTimeout(predictionTimerRef.current);
      }
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    setPredictedNav(null);
  }, [pathname]);

  useEffect(() => {
    setAutomationsMenuState("closed");
  }, [pathname]);

  useEffect(() => {
    syncHeaderOffset();
    window.addEventListener("resize", syncHeaderOffset, { passive: true });
    return () => window.removeEventListener("resize", syncHeaderOffset);
    }, [syncHeaderOffset]);

    useEffect(() => {
    const frame = window.requestAnimationFrame(syncHeaderOffset);
    return () => window.cancelAnimationFrame(frame);
  }, [scrolled, syncHeaderOffset]);

  const navItems = useMemo(
    () => [
      {
        type: "mega",
        label: "Automations",
        sections: [
          {
            heading: "AI Workflows",
            links: [
              {
                path: "/marketplace",
                label: "Automation Marketplace",
                description: "Launch prebuilt agents in minutes",
              },
              {
                path: "/products/marketplace",
                label: "Workflow Studio",
                description: "Design custom automations with guardrails",
              },
              {
                path: "/support",
                label: "Automation Support",
                description: "Get onboarding help from specialists",
              },
            ],
          },
          {
            heading: "Integrations",
            links: [
              {
                path: "/docs",
                label: "Developer Docs",
                description: "Connect Artifically to your stack",
              },
              {
                path: "/docs/api",
                label: "API Reference",
                description: "Ship automations programmatically",
              },
            ],
          },
        ],
      },
      {
        type: "mega",
        label: "Solutions",
        sections: [
          {
            heading: "By Team",
            links: [
              {
                path: "/customers",
                label: "Customer Success",
                description: "Automate customer onboarding journeys",
              },
              {
                path: "/case-studies",
                label: "Operations",
                description: "See how ops teams scale with AI",
              },
              {
                path: "/updates",
                label: "Product",
                description: "Prioritize features with real-time insights",
              },
            ],
          },
          {
            heading: "By Industry",
            links: [
              {
                path: "/security",
                label: "Financial Services",
                description: "Meet compliance with human-in-loop controls",
              },
              {
                path: "/case-studies",
                label: "Healthcare",
                description: "Safeguard PHI while automating care ops",
              },
            ],
          },
        ],
      },
      { type: "link", path: "/pricing", label: "Pricing" },
      {
        type: "mega",
        label: "Resources",
        sections: [
          {
            heading: "Learn",
            links: [
              {
                path: "/blog",
                label: "Blog",
                description: "Ideas from the automation frontier",
              },
              {
                path: "/docs",
                label: "Documentation",
                description: "Guides, SDKs, and integration tips",
              },
              {
                path: "/updates",
                label: "Release Notes",
                description: "See what's shipping every week",
              },
            ],
          },
          {
            heading: "Company",
            links: [
              {
                path: "/changelog",
                label: "Changelog",
                description: "Track platform improvements",
              },
              {
                path: "/status",
                label: "Status",
                description: "View live service availability",
              },
              {
                path: "/contact",
                label: "Contact",
                description: "Talk with our solutions engineers",
              },
            ],
          },
        ],
      },
    ],
    [],
  );

  const handleCommandPaletteOpen = useCallback(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("command-palette:open"));
  }, []);

  const toggleAutomationsMenu = useCallback(() => {
    closeSolutionsMenu();
    setAutomationsMenuState((current) => {
      const isOpen = current === "open" || current === "opening";
      if (prefersReducedMotion) {
        return isOpen ? "closed" : "open";
      }
      return isOpen ? "closing" : "opening";
    });
  }, [closeSolutionsMenu, prefersReducedMotion]);

  const toggleSolutionsMenu = useCallback(() => {
    closeAutomationsMenu();
    setSolutionsMenuState((current) => {
      const isOpen = current === "open" || current === "opening";
      if (prefersReducedMotion) {
        return isOpen ? "closed" : "open";
      }
      return isOpen ? "closing" : "opening";
    });
  }, [closeAutomationsMenu, prefersReducedMotion]);

  const handleLinkNavigation = useCallback(
    (event, path, options) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }
      event.preventDefault();
      navigate(path, options);
    },
    [navigate],
  );

  return (
    <motion.header
      className={`site-header ${scrolled ? "scrolled" : ""}`}
      data-ready={headerReady ? "true" : "false"}
      initial="hidden"
      animate={headerReady ? "visible" : "hidden"}
      variants={headerVariants}
    >
      <div
        className="header-inner"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          gap: space("md"),
        }}
      >
        <Link
          href="/"
          className="brand brand--interactive"
          data-prefetch-route="/"
          onClick={(event) => handleLinkNavigation(event, "/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: space("2xs", 1.5),
            width: "180px",
            maxWidth: "180px",
            position: "relative",
            zIndex: 1,
            padding: `${space("2xs", 1.2)} ${space("xs")}`,
            borderRadius: "0.75rem",
            transformOrigin: "center",
            transition: "transform 250ms ease-out",
          }}
        >
          <LogoWordmark
            variant={darkMode ? "dark" : "light"}
            style={{
              height: "48px",
              width: "auto",
              display: "block",
              filter: darkMode
                ? "drop-shadow(0 0 16px color-mix(in oklch, var(--brand-glow) 55%, transparent))"
                : "drop-shadow(0 0 10px color-mix(in oklch, var(--brand-primary) 45%, transparent))",
              transition: "filter var(--transition-normal)",
            }}
          />
        </Link>

        <nav
          className="nav"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "1 1 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <StaggeredContainer
            className="nav-items"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: space("xs", 1.8),
            }}
          >
            {navItems.map((item, index) => {
              if (item.type === "mega") {
                if (item.label === "Automations") {
                  const isMenuOpen = automationsMenuState === "open" || automationsMenuState === "opening";
                  const routeMatch =
                    pathname.startsWith("/marketplace") ||
                    pathname === "/contact/custom" ||
                    pathname === "/demo";
                  const isActive = isMenuOpen || routeMatch;
                  return (
                    <StaggeredItem key={item.label} index={index} style={{ display: "flex" }}>
                      <div className={`nav-item nav-item--mega${isActive ? " nav-item--active" : ""}`}>
                        <button
                          type="button"
                          ref={automationsTriggerRef}
                          className={["nav-trigger", isActive ? "nav-trigger--active" : ""]
                            .filter(Boolean)
                            .join(" ")}
                          aria-haspopup="dialog"
                          aria-expanded={isMenuOpen ? "true" : "false"}
                          onClick={() => {
                            closeSolutionsMenu();
                            if (automationsMenuState === "open" || automationsMenuState === "opening") {
                              closeAutomationsMenu({ focusTrigger: false });
                            } else {
                              toggleAutomationsMenu();
                            }
                          }}
                        >
                          <span>{item.label}</span>
                          <Icon name="chevronDown" size={16} aria-hidden="true" />
                        </button>
                        <AutomationsMegaMenu
                          state={automationsMenuState}
                          onRequestClose={() => closeAutomationsMenu({ focusTrigger: true })}
                          onNavigate={(event, path) => {
                            closeAutomationsMenu();
                            handleLinkNavigation(event, path);
                          }}
                        />
                      </div>
                    </StaggeredItem>
                  );
                }

                if (item.label === "Solutions") {
                  const isMenuOpen = solutionsMenuState === "open" || solutionsMenuState === "opening";
                  const routeMatch =
                    pathname.startsWith("/solutions") || pathname.startsWith("/case-studies");
                  const isActive = isMenuOpen || routeMatch;
                  return (
                    <StaggeredItem key={item.label} index={index} style={{ display: "flex" }}>
                      <div className={`nav-item nav-item--mega${isActive ? " nav-item--active" : ""}`}>
                        <button
                          type="button"
                          ref={solutionsTriggerRef}
                          className={["nav-trigger", isActive ? "nav-trigger--active" : ""]
                            .filter(Boolean)
                            .join(" ")}
                          aria-haspopup="dialog"
                          aria-expanded={isMenuOpen ? "true" : "false"}
                          onClick={() => {
                            closeAutomationsMenu();
                            if (solutionsMenuState === "open" || solutionsMenuState === "opening") {
                              closeSolutionsMenu({ focusTrigger: false });
                            } else {
                              toggleSolutionsMenu();
                            }
                          }}
                        >
                          <span>{item.label}</span>
                          <Icon name="chevronDown" size={16} aria-hidden="true" />
                        </button>
                        <SolutionsMegaMenu
                          state={solutionsMenuState}
                          onRequestClose={() => closeSolutionsMenu({ focusTrigger: true })}
                          onNavigate={(event, path) => {
                            closeSolutionsMenu();
                            handleLinkNavigation(event, path);
                          }}
                        />
                      </div>
                    </StaggeredItem>
                  );
                }
                
                const isActive = item.sections.some((section) =>
                  section.links.some((link) => link.path === pathname),
                );
                return (
                  <StaggeredItem key={item.label} index={index} style={{ display: "flex" }}>
                    <div className={`nav-item nav-item--mega${isActive ? " nav-item--active" : ""}`}>
                      <details className="nav-mega" data-enhanced>
                        <summary
                          className={["nav-trigger", isActive ? "nav-trigger--active" : ""]
                            .filter(Boolean)
                            .join(" ")}
                          aria-haspopup="menu"
                        >
                          <span>{item.label}</span>
                          <Icon name="chevronDown" size={16} aria-hidden="true" />
                        </summary>
                        <div className="nav-mega__panel" role="menu">
                          {item.sections.map((section) => (
                            <div className="nav-mega__section" key={`${item.label}-${section.heading}`}>
                              <p className="nav-mega__heading">{section.heading}</p>
                              <div className="nav-mega__links">
                                {section.links.map((entry) => (
                                  <Link
                                    key={entry.path}
                                    href={entry.path}
                                    role="menuitem"
                                    className="nav-mega__link"
                                    data-prefetch-route={entry.path}
                                    onClick={(event) => {
                                      handleLinkNavigation(event, entry.path);
                                      const rootDetails = event.currentTarget.closest("details");
                                      if (rootDetails) {
                                        rootDetails.removeAttribute("open");
                                      }
                                    }}
                                  >
                                    <span className="nav-mega__link-label">{entry.label}</span>
                                    <span className="nav-mega__link-description">{entry.description}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  </StaggeredItem>
                );
              }

              const { path, label } = item;
              const isActive = pathname === path;
              const isPredicted = !isActive && predictedNav === path;
              return (
                <StaggeredItem key={path} index={index} style={{ display: "flex" }}>
                  <Link
                    href={path}
                    data-prefetch-route={path}
                    className={[
                      "nav-trigger",
                      isActive ? "nav-trigger--active" : "",
                      isPredicted ? "nav-trigger--predicted" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={(event) => handleLinkNavigation(event, path)}
                  >
                    {label}
                  </Link>
                </StaggeredItem>
              );
            })}
          </StaggeredContainer>
        </nav>

        <div
          className="header-actions"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: space("xs", 1.6),
            position: "relative",
            zIndex: 1,
            minWidth: "220px",
          }}
        >
          <Link
            href="/design-system"
            data-prefetch-route="/design-system"
            className="header-actions__link"
            onClick={(event) => handleLinkNavigation(event, "/design-system")}
          >
            Design System
          </Link>
          <button
            type="button"
            className="header-actions__search"
            onClick={handleCommandPaletteOpen}
            aria-label="Open command palette"
            title="⌘K"
          >
            <Icon name="search" size={18} aria-hidden="true" />
            <span className="sr-only">Open command palette</span>
          </button>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: space("2xs", 1.4),
            }}
          >
            <ContrastToggle />
            <ThemeToggle />
          </div>

          {user ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: space("2xs", 1.6),
              }}
            >
              <MagneticButton
                type="button"
                size="sm"
                variant="secondary"
                data-prefetch-route="/dashboard"
                glowOnHover={false}
                onClick={(event) => {
                  dispatchInteraction("cta-secondary", { event });
                  navigate("/dashboard");
                }}
              >
                Dashboard
              </MagneticButton>
              <MagneticButton
                type="button"
                size="sm"
                variant="primary"
                data-prefetch-route="/signout"
                onClick={(event) => {
                  dispatchInteraction("cta-ghost", { event });
                  onSignOut?.(event);
                }}
              >
                <span>Sign out</span>
              </MagneticButton>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: space("2xs", 1.6),
              }}
            >
              <MagneticButton
                type="button"
                size="sm"
                variant="secondary"
                data-prefetch-route="/signin"
                glowOnHover={false}
                onClick={(event) => {
                  dispatchInteraction("cta-secondary", { event });
                  onSignIn?.(event);
                }}
              >
                <span>Sign in</span>
              </MagneticButton>
              <MagneticButton
                type="button"
                size="sm"
                variant="primary"
                data-prefetch-route="/signup"
                onClick={(event) => {
                  dispatchInteraction("cta-primary", { event });
                  onSignUp?.(event);
                }}
              >
                <span>Sign up</span>
              </MagneticButton>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}