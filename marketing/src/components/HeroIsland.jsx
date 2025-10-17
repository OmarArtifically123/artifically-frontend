import { useEffect, useMemo, useState } from "react";
import MarketingHomeServer from "@frontend/rsc/MarketingHome.server.jsx";

const DEFAULT_ENDPOINT = "/rsc/marketing/home";

export default function HeroIsland({ endpoint = DEFAULT_ENDPOINT }) {
  const [state, setState] = useState({ status: "idle", markup: "" });

  const status = state.status;
  const markup = state.markup;

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function hydrate() {
      try {
        setState((prev) => ({ ...prev, status: "loading" }));
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Accept: "text/html",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Unexpected status ${response.status}`);
        }

        const html = await response.text();
        if (!cancelled) {
          setState({ status: "ready", markup: html });
        }
      } catch (error) {
        if (!cancelled) {
          console.warn("Failed to stream marketing hero from RSC endpoint", error);
          setState({ status: "error", markup: "" });
        }
      }
    }

    hydrate();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [endpoint]);

  const fallback = useMemo(
    () => (
      <div className="hero-island__fallback" hidden={Boolean(markup)}>
        <MarketingHomeServer />
      </div>
    ),
    [markup],
  );

  return (
    <section className="hero-island" data-status={status} aria-live="polite">
      {markup ? (
        <div className="hero-island__stream" dangerouslySetInnerHTML={{ __html: markup }} />
      ) : (
        fallback
      )}
    </section>
  );
}