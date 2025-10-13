if (typeof window !== "undefined" && typeof document !== "undefined") {
  (function () {
    const root = document.documentElement;

    const updateScrolled = () => {
      if (window.scrollY > 1) {
        root.classList.add("scrolled");
      } else {
        root.classList.remove("scrolled");
      }
    };

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    let killTimer;
    const killBlurNow = () => {
      root.classList.add("no-blur");

      const suspects = document.querySelectorAll(
        [
          "header.site-header",
          ".experience-backdrop",
          ".glass-card",
          ".glass-pill",
          ".glass-panel",
          ".hero-social-proof",
          "#product-preview.hero-preview",
          ".hero-preview__inner",
          "canvas.hero-background",
        ].join(","),
      );

      suspects.forEach((el) => {
        el.style.setProperty("filter", "none", "important");
        el.style.setProperty("backdrop-filter", "none", "important");
        el.style.setProperty("-webkit-backdrop-filter", "none", "important");
      });

      clearTimeout(killTimer);
      killTimer = window.setTimeout(() => {
        root.classList.remove("no-blur");
      }, 800);
    };

    let lastDpr = window.devicePixelRatio;
    const checkDevtoolsHeuristic = () =>
      Math.abs(window.outerWidth - window.innerWidth) > 160 ||
      Math.abs(window.outerHeight - window.innerHeight) > 160;

    const onResample = () => {
      const devtoolsOpen = checkDevtoolsHeuristic();
      const dprChanged = window.devicePixelRatio !== lastDpr;
      lastDpr = window.devicePixelRatio;

      if (devtoolsOpen || dprChanged) {
        killBlurNow();
      }
    };

    window.addEventListener("resize", onResample);

    const dppxQuery = window.matchMedia?.(
      `(resolution: ${window.devicePixelRatio}dppx)`,
    );

    if (dppxQuery?.addEventListener) {
      dppxQuery.addEventListener("change", killBlurNow);
    } else if (dppxQuery?.addListener) {
      dppxQuery.addListener(killBlurNow);
    }

    const legacyClasses = [
      "is-zoomed",
      "is-scrolling",
      "is-choreographed",
      "blur-on",
    ];
    legacyClasses.forEach((className) => root.classList.remove(className));

    const killBlurOnShow = () => killBlurNow();
    window.addEventListener("pageshow", killBlurOnShow);

    const cleanup = () => {
      window.removeEventListener("resize", onResample);
      window.removeEventListener("scroll", updateScrolled);
      window.removeEventListener("pageshow", killBlurOnShow);
      if (dppxQuery?.removeEventListener) {
        dppxQuery.removeEventListener("change", killBlurNow);
      } else if (dppxQuery?.removeListener) {
        dppxQuery.removeListener(killBlurNow);
      }
      clearTimeout(killTimer);
      root.classList.remove("no-blur");
    };

    killBlurNow();

    if (import.meta.env?.DEV) {
      window.blurGuardCleanup = cleanup;
    }
  })();
}