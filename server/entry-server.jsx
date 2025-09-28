import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { ApolloProvider } from "@apollo/client";
import { PassThrough } from "stream";
import App from "../src/App";
import { ThemeProvider } from "../src/context/ThemeContext";
import { createApolloClient, FEATURE_HIGHLIGHTS_QUERY } from "../src/lib/graphqlClient";

function FeatureInsightsStream({ data }) {
  const { featureHighlights = [], marketplaceStats } = data;
  const stats = marketplaceStats || { totalAutomations: 0, averageROI: 0, partners: 0 };

  return (
    <div className="rsc-feature-grid">
      {featureHighlights.slice(0, 4).map((feature) => (
        <article key={feature.id} data-rsc-node="feature-card">
          <header style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              aria-hidden="true"
              style={{
                width: "3rem",
                height: "3rem",
                display: "grid",
                placeItems: "center",
                borderRadius: "1rem",
                background: "linear-gradient(135deg, rgba(99,102,241,0.32), rgba(45,212,191,0.26))",
                fontSize: "1.35rem",
              }}
            >
              {feature.icon}
            </span>
            <div>
              <h4>{feature.title}</h4>
              <small style={{ color: "var(--gray-400)", fontWeight: 600 }}>{feature.status}</small>
            </div>
          </header>
          <p>{feature.description}</p>
          <footer>
            <span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M2.5 8.5L6 12L13.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {stats.averageROI}x avg ROI
            </span>
            <span>{stats.totalAutomations}+ live</span>
          </footer>
        </article>
      ))}
    </div>
  );
}

const ABORT_DELAY = 8000; // Reduced timeout for faster fallback

const safeSerialize = (data) =>
  JSON.stringify(data).replace(/</g, "\\u003c").replace(/\\u2028/g, "\\u2028").replace(/\\u2029/g, "\\u2029");

const toPublicPath = (asset) => (asset.startsWith("/") ? asset : `/${asset}`);

export async function render({ req, res, template, manifest, isProd }) {
  const url = req.originalUrl || req.url || "/";
  const client = createApolloClient();

  try {
    await client.query({ 
      query: FEATURE_HIGHLIGHTS_QUERY,
      errorPolicy: 'all' // Continue even if query fails
    });
  } catch (error) {
    console.warn("SSR prefetch failed", error);
  }

  const apolloState = client.extract();

  const bootstrapScripts = (() => {
    if (!isProd) {
      return ["/src/entry-client.jsx"];
    }

    if (!manifest) return [];
    const entry = manifest["src/entry-client.jsx"] || manifest["entry-client.jsx"];
    if (!entry) return [];

    if (Array.isArray(entry)) {
      return entry.filter((asset) => asset.endsWith(".js")).map(toPublicPath);
    }

    if (typeof entry === "string") {
      return [toPublicPath(entry)];
    }

    if (typeof entry === "object" && entry !== null) {
      const files = [];
      if (entry.file) files.push(toPublicPath(entry.file));
      if (Array.isArray(entry.imports)) {
        entry.imports.forEach((importPath) => {
          const importEntry = manifest[importPath];
          if (typeof importEntry === "string") {
            files.push(toPublicPath(importEntry));
          } else if (importEntry?.file) {
            files.push(toPublicPath(importEntry.file));
          }
        });
      }
      return files;
    }

    return [];
  })();

  return new Promise((resolve, reject) => {
    let didError = false;
    let errorDetails = null;
    const stream = new PassThrough();

    const [head = "", tailWithFallback = ""] = template.split("<!--app-html-->");
    const tail = tailWithFallback.replace("<!--app-fallback-->", "");

    // Enhanced bootstrap script with SSR detection
    const bootstrapScriptContent = `
      window.__APOLLO_STATE__=${safeSerialize(apolloState)};
      
      // SSR success marker
      window.__SSR_SUCCESS__ = true;
      
      // Debug info for hybrid rendering
      window.__SSR_DEBUG__ = ${JSON.stringify({
        url,
        timestamp: new Date().toISOString(),
        apolloStateKeys: Object.keys(apolloState || {}),
        mode: 'ssr'
      })};
      
      // Enhanced error handling
      window.addEventListener('error', function(e) {
        if (e.error?.message?.includes('Hydration')) {
          console.warn('SSR->Client: Hydration error detected, client will handle fallback');
        }
      });
    `;

    const { pipe, abort } = renderToPipeableStream(
      <ApolloProvider client={client}>
        <StaticRouter location={url}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </StaticRouter>
      </ApolloProvider>,
      {
        bootstrapScripts,
        bootstrapScriptContent,
        onShellReady() {
          res.statusCode = didError ? 500 : 200;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.setHeader("Cache-Control", isProd ? "public, max-age=60" : "no-cache");
          
          // Add SSR success headers
          res.setHeader("X-SSR-Mode", "success");
          if (!isProd) {
            res.setHeader("X-SSR-Render-Time", new Date().toISOString());
            res.setHeader("X-SSR-URL", url);
          }
          
          res.write(head);
          pipe(stream);
          stream.pipe(res, { end: false });
        },
        onShellError(error) {
          console.error("SSR Shell Error:", error);
          errorDetails = error;
          reject(error);
        },
        onError(error) {
          didError = true;
          errorDetails = error;
          console.error("SSR Render Error:", error);
          
          // In development, log more details for debugging
          if (!isProd) {
            console.error("Component stack:", error.componentStack || 'N/A');
            console.error("Error stack:", error.stack);
          }
        },
        onAllReady() {
          if (!isProd) {
            console.log(`SSR render ${didError ? 'completed with errors' : 'successful'} for: ${url}`);
          }
        },
      }
    );

    stream.on("end", () => {
      res.write(tail);
      res.end();
      resolve();
    });

    stream.on("error", (error) => {
      console.error("SSR Stream error:", error);
      reject(error);
    });

    // Timeout handler with better error information
    const timeoutId = setTimeout(() => {
      console.warn(`SSR render timeout (${ABORT_DELAY}ms) for: ${url}`);
      if (errorDetails) {
        console.warn("Last error before timeout:", errorDetails.message);
      }
      abort();
    }, ABORT_DELAY);

    // Clear timeout if we finish successfully
    stream.on("end", () => clearTimeout(timeoutId));
    stream.on("error", () => clearTimeout(timeoutId));
  });
}

export async function renderFeatureHighlightsRSC(res) {
  const client = createApolloClient();
  let data = { featureHighlights: [], marketplaceStats: null };

  try {
    const result = await client.query({ 
      query: FEATURE_HIGHLIGHTS_QUERY,
      errorPolicy: 'all'
    });
    data = result.data || data;
  } catch (error) {
    console.warn("RSC prefetch failed", error);
  }

  return new Promise((resolve, reject) => {
    const stream = new PassThrough();

    const { pipe, abort } = renderToPipeableStream(
      <ThemeProvider>
        <FeatureInsightsStream data={data} />
      </ThemeProvider>,
      {
        onShellReady() {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
          res.setHeader("X-Component-Type", "rsc");
          pipe(stream);
          stream.pipe(res);
        },
        onShellError(error) {
          console.error("RSC Shell Error:", error);
          reject(error);
        },
        onError(error) {
          console.error("RSC stream error", error);
        },
        onAllReady() {},
      }
    );

    stream.on("end", () => resolve());
    stream.on("error", (error) => {
      console.error("RSC stream failure", error);
      reject(error);
    });

    setTimeout(() => {
      console.warn("RSC render timeout");
      abort();
    }, ABORT_DELAY).unref?.();
  });
}

export default render;