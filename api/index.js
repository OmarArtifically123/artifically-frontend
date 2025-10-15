import path from "path";
import fs from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import {
  buildSitemapXml,
  buildRobotsTxt,
  getCanonicalUrl,
  getStructuredData,
  injectSeoMeta,
  ssrStatusPayload,
} from "../server/seo.js";

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
  ".css": "text/css",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

const sendStaticFile = (filePath, res) => {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return false;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = mimeTypes[ext];
  if (!res.headersSent) {
    res.statusCode = 200;
    if (mime) {
      res.setHeader("Content-Type", mime);
    }
  }

  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath);
    stream.on("error", (error) => {
      console.error("Static asset stream error", error);
      if (!res.headersSent) {
        res.statusCode = 500;
      }
      res.end();
      reject(error);
    });
    stream.on("end", resolve);
    stream.pipe(res);
  });
};

const isStaticAssetRequest = (urlPath) => {
  if (!urlPath || urlPath === "/") {
    return false;
  }

  const hasExtension = path.extname(urlPath) !== "";
  return hasExtension && !urlPath.endsWith(".html");
};

const normaliseRequestPath = (rawPath = "/") => {
  try {
    const decoded = decodeURIComponent(rawPath.split("?")[0]);
    const normalised = path.posix.normalize(decoded);
    if (normalised.startsWith("..")) {
      return "/";
    }
    return normalised;
  } catch (error) {
    console.warn("Failed to decode request path", rawPath, error);
    return "/";
  }
};

const handleSeoRoutes = (req, res) => {
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
    const payload = ssrStatusPayload({ ...ssrStatus, environment: "production" });
    if (method === "HEAD") {
      res.end();
    } else {
      res.end(JSON.stringify(payload));
    }
    return true;
  }

  return false;
};

export default async function handler(req, res) {
  const clientDist = path.resolve(__dirname, "../dist/client");
  const serverDist = path.resolve(__dirname, "../dist/server");
  const templatePath = path.join(clientDist, "index.html");

  const requestPath = normaliseRequestPath(req.url);

  if (handleSeoRoutes(req, res)) {
    return;
  }

  if (isStaticAssetRequest(requestPath)) {
    const assetPath = path.join(clientDist, requestPath);
    const streamPromise = sendStaticFile(assetPath, res);

    if (streamPromise) {
      try {
        await streamPromise;
      } catch (error) {
        console.error("Failed to stream static asset", assetPath, error);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end();
        }
      }
      return;
    }

    if (!res.headersSent) {
      res.statusCode = 404;
      res.end("Not Found");
    }
    return;
  }

  const resolveEntryServerPath = () => {
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

  let template = null;
  let clientOnlyTemplate = null;

  try {
    template = fs.readFileSync(templatePath, "utf-8");
    clientOnlyTemplate = template
      .replace(
        "<!--app-html-->",
        '<div class="initial-loading"><div class="loading-spinner"></div><p>Loading Artifically...</p></div>'
      )
      .replace(
        "<!--app-fallback-->",
        '<script>window.__SSR_DISABLED__ = true;</script>'
      );

    // Load SSR entry
    const entryPath = resolveEntryServerPath();

    if (!entryPath) {
      throw new Error("SSR entry-server bundle not found");
    }

    const { render } = await import(pathToFileURL(entryPath).href);

    // Load manifest with fallbacks
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
      } catch (manifestError) {
        console.warn("⚠️ Failed to parse manifest", manifestError);
      }
    }

    if (!manifest) {
      console.warn("⚠️ ssr-manifest.json not found. Falling back to client rendering.");
      markSsrFallback(new Error("ssr-manifest.json missing"));
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-SSR-Fallback", "true");
      const canonicalUrl = getCanonicalUrl(requestPath);
      const structuredData = getStructuredData(requestPath);
      res.setHeader("Link", `<${canonicalUrl}>; rel="canonical"`);
      res.end(injectSeoMeta(clientOnlyTemplate, { canonicalUrl, structuredData }));
      return;
    }

    // Run SSR
    const canonicalUrl = getCanonicalUrl(requestPath);
    const structuredData = getStructuredData(requestPath);
    template = injectSeoMeta(template, { canonicalUrl, structuredData });
    const fallbackTemplate = injectSeoMeta(clientOnlyTemplate, { canonicalUrl, structuredData });

    res.setHeader("Link", `<${canonicalUrl}>; rel="canonical"`);

    try {
      await render({ req, res, template, manifest, isProd: true });
      markSsrSuccess();
    } catch (renderError) {
      markSsrFallback(renderError);
      if (!res.headersSent) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("X-SSR-Fallback", "true");
        res.end(fallbackTemplate);
      }
    }
  } catch (error) {
    console.error("❌ SSR error:", error);
    markSsrFallback(error);
    if (!res.headersSent) {
      if (clientOnlyTemplate) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("X-SSR-Fallback", "true");
        const canonicalUrl = getCanonicalUrl(requestPath);
        const structuredData = getStructuredData(requestPath);
        res.setHeader("Link", `<${canonicalUrl}>; rel="canonical"`);
        res.end(injectSeoMeta(clientOnlyTemplate, { canonicalUrl, structuredData }));
      } else {
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    }
  }
}