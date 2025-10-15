// server/server.js - Re-enabling SSR with better error handling
import fs from "fs";
import path from "path";
import http from "http";
import { fileURLToPath, pathToFileURL } from "url";
import {
  buildSitemapXml,
  buildRobotsTxt,
  getCanonicalUrl,
  getStructuredData,
  injectSeoMeta,
  ssrStatusPayload,
} from "./seo.js";

const isProd = process.env.NODE_ENV === "production";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const createIsoTimestamp = () => new Date().toISOString();

const ssrStatus = {
  healthy: false,
  lastSuccessAt: null,
  lastErrorAt: null,
  lastErrorMessage: null,
  lastFallbackAt: null,
};

const markSsrSuccess = () => {
  ssrStatus.healthy = true;
  ssrStatus.lastSuccessAt = createIsoTimestamp();
};

const markSsrFailure = (error) => {
  ssrStatus.healthy = false;
  ssrStatus.lastErrorAt = createIsoTimestamp();
  ssrStatus.lastErrorMessage = error?.message ?? String(error ?? "Unknown SSR failure");
};

const markSsrFallback = (error) => {
  markSsrFailure(error);
  ssrStatus.lastFallbackAt = createIsoTimestamp();
};

const mimeTypes = {
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".jsx": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
};

const setDefaultHeaders = (res) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
};

const handleSeoRoutes = (req, res, environment) => {
  const method = (req.method || "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    return false;
  }

  const pathname = (req.url || "/").split("?")[0];

  if (pathname === "/robots.txt") {
    const body = buildRobotsTxt();
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    if (method === "HEAD") {
      res.end();
    } else {
      res.end(body);
    }
    return true;
  }

  if (pathname === "/sitemap.xml") {
    const body = buildSitemapXml();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=900");
    if (method === "HEAD") {
      res.end();
    } else {
      res.end(body);
    }
    return true;
  }

  if (pathname === "/__ssr-status") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    const payload = ssrStatusPayload({ ...ssrStatus, environment });
    if (method === "HEAD") {
      res.end();
    } else {
      res.end(JSON.stringify(payload));
    }
    return true;
  }

  return false;
};

const normalizeRenderResult = (result) => {
  if (!result) {
    return null;
  }

  if (typeof result.pipe === "function" && typeof result.on === "function") {
    return {
      stream: result,
      abort: typeof result.abort === "function" ? result.abort : null,
      headers: result.headers || {},
      statusCode: result.statusCode,
    };
  }

  if (result.stream && typeof result.stream.pipe === "function") {
    return {
      stream: result.stream,
      abort: typeof result.abort === "function"
        ? result.abort
        : typeof result.stream.abort === "function"
        ? result.stream.abort
        : null,
      headers: result.headers || result.stream.headers || {},
      statusCode: result.statusCode || result.stream.statusCode,
    };
  }

  return null;
};

async function createDevServer() {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  const requestListener = async (req, res) => {
    setDefaultHeaders(res);
    const url = req.url || "/";

    if (handleSeoRoutes(req, res, "development")) {
      return;
    }

    if (url.startsWith("/rsc/features")) {
      try {
        const mod = await vite.ssrLoadModule("/src/entry-server.jsx");
        await mod.renderFeatureHighlightsRSC(res);
      } catch (error) {
        vite.ssrFixStacktrace(error);
        console.error("RSC dev render failed", error);
        res.statusCode = 500;
        res.end("RSC render failed");
      }
      return;
    }

    try {
      let resolved = false;
      await new Promise((resolve, reject) => {
        vite.middlewares(req, res, async () => {
          try {
            const requestUrl = req.originalUrl || req.url || "/";
            const templatePath = path.resolve(__dirname, "../index.html");
            const canonicalUrl = getCanonicalUrl(requestUrl);
            const structuredData = getStructuredData(requestUrl);

            let template = fs.readFileSync(templatePath, "utf-8");
            template = await vite.transformIndexHtml(requestUrl, template);
            template = injectSeoMeta(template, { canonicalUrl, structuredData });

            const fallbackTemplate = injectSeoMeta(
              template
                .replace(
                  "<!--app-html-->",
                  '<div class="initial-loading"><div class="loading-spinner"></div><p>Loading Artifically...</p></div>'
                )
                .replace(
                  "<!--app-fallback-->",
                  '<script>window.__SSR_DISABLED__ = true;</script>'
                ),
              { canonicalUrl, structuredData },
            );
            
            try {
              const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");
              const rendered = normalizeRenderResult(await render(requestUrl, null));

              if (!rendered?.stream) {
                throw new Error("SSR renderer did not return a stream");
              }

              res.setHeader("Link", `<${canonicalUrl}>; rel="canonical"`);

              const [htmlStart = "", htmlEndWithFallback = ""] = template.split("<!--app-html-->");
              const htmlEnd = htmlEndWithFallback.replace("<!--app-fallback-->", "");

              res.statusCode = rendered.statusCode ?? 200;
              const headers = rendered.headers ?? {};
              for (const [key, value] of Object.entries(headers)) {
                if (value !== undefined) {
                  res.setHeader(key, value);
                }
              }

              res.write(htmlStart);

              rendered.stream.on("error", (streamError) => {
                console.error("SSR stream failure (dev):", streamError);
                markSsrFailure(streamError);
                if (!res.headersSent) {
                  res.statusCode = 500;
                }
                try {
                  rendered.abort?.();
                } catch (abortError) {
                  console.warn("Failed to abort SSR stream", abortError);
                }
                res.end();
              });

              rendered.stream.on("end", () => {
                markSsrSuccess();
                res.write(htmlEnd);
                res.end();
              });

              rendered.stream.pipe(res, { end: false });
              console.log(`✅ SSR successful for: ${requestUrl}`);
            } catch (ssrError) {
              markSsrFallback(ssrError);
              console.warn(`⚠️ SSR failed for ${requestUrl}, falling back to client-only:`, ssrError.message);

              res.statusCode = 200;
              res.setHeader("Content-Type", "text/html; charset=utf-8");
              res.setHeader("X-SSR-Fallback", "true");
              res.setHeader("Link", `<${canonicalUrl}>; rel="canonical"`);
              res.end(fallbackTemplate);
            }
            
            resolved = true;
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
      if (!resolved) {
        res.statusCode = 404;
        res.end();
      }
    } catch (error) {
      vite.ssrFixStacktrace(error);
      markSsrFailure(error);
      console.error(error);
      res.statusCode = 500;
      res.end(error.stack);
    }
  };

  const port = Number(process.env.PORT) || 4173;
  return new Promise((resolve) => {
    const server = http.createServer(requestListener);
    server.listen(port, () => {
      console.log(`🚀 Dev server (SSR enabled with fallback) listening on http://localhost:${port}`);
      resolve(server);
    });
  });
}

const serveStaticFile = (filePath, res) => {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return false;
  }

  if (!res.headersSent) {
    const ext = path.extname(filePath).toLowerCase();
    const type = mimeTypes[ext];
    if (type) {
      res.setHeader("Content-Type", type);
    }
  }
  
  const stream = fs.createReadStream(filePath);
  stream.on("error", (error) => {
    console.error("Static file error", error);
    if (!res.headersSent) {
      res.statusCode = 500;
    }
    res.end();
  });
  stream.pipe(res);
  return true;
};

const resolveEntryServerPath = (serverDist) => {
  const directCandidates = [
    path.join(serverDist, "entry-server.js"),
    path.join(serverDist, "entry-server.mjs"),
  ];

  for (const candidate of directCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  const assetsDir = path.join(serverDist, "assets");
  if (fs.existsSync(assetsDir)) {
    const entryFromAssets = fs
      .readdirSync(assetsDir)
      .find((file) => file.startsWith("entry-server") && file.endsWith(".js"));

    if (entryFromAssets) {
      return path.join(assetsDir, entryFromAssets);
    }
  }

  return null;
};

async function createProdServer() {
  const clientDist = path.resolve(__dirname, "../dist/client");
  const serverDist = path.resolve(__dirname, "../dist/server");
  const templatePath = path.join(clientDist, "index.html");
  const template = fs.readFileSync(templatePath, "utf-8");
  const clientOnlyTemplate = template
    .replace(
      "<!--app-html-->",
      '<div class="initial-loading"><div class="loading-spinner"></div><p>Loading Artifically...</p></div>'
    )
    .replace(
      "<!--app-fallback-->",
      '<script>window.__SSR_DISABLED__ = true;</script>'
    );

  const manifestCandidates = [
    path.join(clientDist, "ssr-manifest.json"),
    path.join(clientDist, ".vite/ssr-manifest.json")
  ];
  let manifest = null;
  for (const manifestPath of manifestCandidates) {
    if (!fs.existsSync(manifestPath)) {
      continue;
    }
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      break;
    } catch (error) {
      console.warn("⚠️ Unable to parse ssr-manifest.json, continuing to look for alternatives", error);
    }
  }
  if (!manifest) {
    console.warn("⚠️ ssr-manifest.json not found, falling back to client-only rendering.");
  }

  const entryPath = resolveEntryServerPath(serverDist);
  let render = null;
  let renderFeatureHighlightsRSC = null;
  if (!entryPath) {
    console.error(
      "⚠️ SSR entry module not found in dist/server. Falling back to client-only rendering."
    );
  } else {
    try {
      ({ render, renderFeatureHighlightsRSC } = await import(pathToFileURL(entryPath).href));
    } catch (error) {
      console.error("⚠️ Failed to load SSR entry module, falling back to client-only", error);
    }
  }

  const sendClientOnly = (res, requestUrl) => {
    if (res.headersSent) {
      return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-SSR-Fallback", "true");
    const canonicalUrl = getCanonicalUrl(requestUrl);
    const structuredData = getStructuredData(requestUrl);
    const fallbackTemplate = injectSeoMeta(clientOnlyTemplate, { canonicalUrl, structuredData });
    res.setHeader("Link", `<${canonicalUrl}>; rel="canonical"`);
    res.end(fallbackTemplate);
  };

  const requestListener = async (req, res) => {
    setDefaultHeaders(res);
    const url = (req.url || "/").split("?")[0];

    if (handleSeoRoutes(req, res, "production")) {
      return;
    }
    if (url.startsWith("/rsc/features")) {
      if (renderFeatureHighlightsRSC) {
        try {
          await renderFeatureHighlightsRSC(res);
        } catch (error) {
          console.error("RSC prod render failed", error);
          res.statusCode = 500;
          res.end("RSC render failed");
        }
      } else {
        console.warn("RSC renderer unavailable, returning empty response");
        res.statusCode = 204;
        res.end();
      }
      return;
    }
    const filePath = path.join(clientDist, url === "/" ? "index.html" : url);

    if (url !== "/" && serveStaticFile(filePath, res)) {
      return;
    }

    if (!render || !manifest) {
      markSsrFallback(new Error("SSR renderer unavailable"));
      sendClientOnly(res, url);
      return;
    }

    try {
      const canonicalUrl = getCanonicalUrl(url);
      const structuredData = getStructuredData(url);
      const enrichedTemplate = injectSeoMeta(template, { canonicalUrl, structuredData });
      const [htmlStart = "", htmlEndWithFallback = ""] = enrichedTemplate.split("<!--app-html-->");
      const htmlEnd = htmlEndWithFallback.replace("<!--app-fallback-->", "");

      const rendered = normalizeRenderResult(await render(url, manifest));
      if (!rendered?.stream) {
        throw new Error("SSR renderer did not provide a stream");
      }

      res.statusCode = rendered.statusCode ?? 200;
      const headers = rendered.headers ?? {};
      for (const [key, value] of Object.entries(headers)) {
        if (value !== undefined) {
          res.setHeader(key, value);
        }
      }

      res.setHeader("Link", `<${canonicalUrl}>; rel="canonical"`);

      res.write(htmlStart);

      rendered.stream.on("error", (error) => {
        console.error("SSR stream failure (prod):", error);
        markSsrFailure(error);
        if (!res.headersSent) {
          res.statusCode = 500;
        }
        try {
          rendered.abort?.();
        } catch (abortError) {
          console.warn("Failed to abort SSR stream", abortError);
        }
        res.end();
      });

      rendered.stream.on("end", () => {
        markSsrSuccess();
        res.write(htmlEnd);
        res.end();
      });

      rendered.stream.pipe(res, { end: false });
    } catch (error) {
      console.error("SSR render failed in production, falling back to client-only", error);
      markSsrFallback(error);
      sendClientOnly(res, url);
    }
  };

  const port = Number(process.env.PORT) || 4173;
  return new Promise((resolve) => {
    const server = http.createServer(requestListener);
    server.listen(port, () => {
      console.log(`SSR server listening on http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function createServer() {
  if (!isProd) {
    return createDevServer();
  }
  return createProdServer();
}

if (process.env.NODE_ENV !== "test") {
  createServer();
}

export default createServer;