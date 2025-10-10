import React from "react";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { getFallbackFeatureData } from "./lib/graphqlClient";

const ABORT_DELAY = 10000;

const toPublicPath = (asset) => (asset?.startsWith("/") ? asset : `/${asset}`);

const resolveBootstrapScripts = (manifest) => {
  if (!manifest) {
    return ["/src/entry-client.jsx"];
  }

  const entry =
    manifest["src/entry-client.jsx"] || manifest["entry-client.jsx"] || manifest["/src/entry-client.jsx"];

  if (!entry) {
    return [];
  }

  if (typeof entry === "string") {
    return [toPublicPath(entry)];
  }

  if (Array.isArray(entry)) {
    return entry.filter((file) => file.endsWith(".js")).map(toPublicPath);
  }

  if (typeof entry === "object" && entry !== null) {
    const files = [];
    if (entry.file) {
      files.push(toPublicPath(entry.file));
    }
    if (Array.isArray(entry.imports)) {
      for (const importPath of entry.imports) {
        const importEntry = manifest[importPath];
        if (!importEntry) continue;
        if (typeof importEntry === "string") {
          files.push(toPublicPath(importEntry));
        } else if (typeof importEntry === "object" && importEntry.file) {
          files.push(toPublicPath(importEntry.file));
        }
      }
    }
    return files;
  }

  return [];
};

const safeSerialize = (value) =>
  JSON.stringify(value).replace(/</g, "\\u003c").replace(/\\u2028/g, "\\u2028").replace(/\\u2029/g, "\\u2029");

export function render(url, manifest) {
  const featureData = getFallbackFeatureData();

  return new Promise((resolve, reject) => {
    let didError = false;
    let shellResolved = false;

    const passThrough = new PassThrough();
    const bootstrapScripts = resolveBootstrapScripts(manifest);

    const finalizeShell = (abort) => {
      if (shellResolved) return;
      shellResolved = true;

      const responseStream = Object.assign(passThrough, {
        statusCode: didError ? 500 : 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Transfer-Encoding": "chunked",
          "X-SSR-Mode": didError ? "partial" : "success",
        },
        abort,
      });

      resolve(responseStream);
    };

    const { pipe, abort } = renderToPipeableStream(
      <StaticRouter location={url}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </StaticRouter>,
      {
        bootstrapScripts,
        bootstrapScriptContent: `window.__FEATURE_DATA__=${safeSerialize(featureData)};window.__SSR_SUCCESS__=true;`,
        onShellReady() {
          finalizeShell(abort);
          pipe(passThrough);
        },
        onShellError(error) {
            passThrough.destroy(error);
          reject(error);
        },
        onAllReady() {},
        onError(error) {
          didError = true;
          console.error("SSR Error:", error);
        },
      },
    );

    const abortTimer = setTimeout(() => {
      if (!shellResolved) {
        finalizeShell(abort);
      }
      abort();
    }, ABORT_DELAY);

    const clearAbortTimer = () => clearTimeout(abortTimer);

    passThrough.on("end", clearAbortTimer);
    passThrough.on("close", clearAbortTimer);
    passThrough.on("error", (error) => {
      clearAbortTimer();
      if (!shellResolved) {
        didError = true;
        finalizeShell(abort);
      }
      console.error("SSR stream error:", error);
    });
  });
}

function FeatureInsightsStream({ data }) {
  const features = Array.isArray(data?.featureHighlights)
    ? data.featureHighlights
    : Array.isArray(data?.features)
    ? data.features
    : [];
  const stats = data?.marketplaceStats || data?.stats || {
    totalAutomations: 0,
    averageROI: 0,
    partners: 0,
  };

  return (
    <div className="rsc-feature-grid">
      {features.slice(0, 4).map((feature) => (
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
            <span>{stats.averageROI}x avg ROI</span>
            <span>{stats.totalAutomations}+ live</span>
          </footer>
        </article>
      ))}
    </div>
  );
}

export function renderFeatureHighlightsRSC(res) {
  const data = getFallbackFeatureData();

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
          reject(error);
        },
        onAllReady() {},
        onError(error) {
          console.error("RSC stream error", error);
        },
      },
    );

    const timeoutId = setTimeout(() => {
      abort();
    }, ABORT_DELAY);

    stream.on("end", () => {
      clearTimeout(timeoutId);
      resolve();
    });
    stream.on("close", () => clearTimeout(timeoutId));
    stream.on("error", (error) => {
      clearTimeout(timeoutId);
      reject(error);
    });
  });
}

export default render;