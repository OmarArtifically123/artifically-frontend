// server/server.js - Re-enabling SSR with better error handling
import fs from "fs";
import path from "path";
import http from "http";
import crypto from "crypto";
import cookie from "cookie";
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
const SESSION_COOKIE_NAME = "__Host-artifically-session";
const CSRF_COOKIE_NAME = "__Host-artifically-csrf";
const SESSION_MAX_AGE = 60 * 60 * 8; // eight hours
const CSRF_MAX_AGE = 60 * 60; // one hour
const AUTH_RATE_LIMIT = { limit: 10, windowMs: 60 * 1000 };
const rateLimitBuckets = new Map();
const upstreamApiBase = process.env.API_UPSTREAM_URL || process.env.VITE_API_URL || "";
const normalizedUpstreamBase = upstreamApiBase.replace(/\/$/, "");

if (!normalizedUpstreamBase) {
  console.warn(
    "[security] API upstream URL is not configured. Authentication proxy endpoints will respond with 502 until configured."
  );
}

const createIsoTimestamp = () => new Date().toISOString();

const createNonce = () => crypto.randomBytes(16).toString("base64");

const isSecureRequest = (req) => {
  if (req.socket?.encrypted) {
    return true;
  }

  const forwardedProto = req.headers["x-forwarded-proto"];
  if (typeof forwardedProto === "string") {
    return forwardedProto.split(",")[0]?.trim().toLowerCase() === "https";
  }

  if (Array.isArray(forwardedProto) && forwardedProto.length) {
    return forwardedProto[0].toLowerCase() === "https";
  }

  return process.env.NODE_ENV === "production";
};

const getClientKey = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length) {
    return forwardedFor.split(",")[0].trim();
  }
  if (Array.isArray(forwardedFor) && forwardedFor.length) {
    return forwardedFor[0];
  }
  return req.socket?.remoteAddress || "unknown";
};

const isRateLimited = (key, { limit, windowMs }) => {
  const now = Date.now();
  const entry = rateLimitBuckets.get(key);

  if (!entry || now > entry.reset) {
    rateLimitBuckets.set(key, { count: 1, reset: now + windowMs });
    return false;
  }

  entry.count += 1;
  if (entry.count > limit) {
    return true;
  }

  rateLimitBuckets.set(key, entry);
  return false;
};

const parseCookies = (req) => {
  try {
    return cookie.parse(req.headers?.cookie ?? "");
  } catch (error) {
    console.warn("Failed to parse cookies", error);
    return {};
  }
};

const getRequestCookies = (req) => {
  if (!req) {
    return {};
  }
  if (!req.__parsedCookies) {
    req.__parsedCookies = parseCookies(req);
  }
  return req.__parsedCookies;
};

const appendSetCookie = (res, value) => {
  if (!value) {
    return;
  }
  const existing = res.getHeader("Set-Cookie");
  if (!existing) {
    res.setHeader("Set-Cookie", value);
  } else if (Array.isArray(existing)) {
    res.setHeader("Set-Cookie", [...existing, value]);
  } else {
    res.setHeader("Set-Cookie", [existing, value]);
  }
};

const buildSessionCookie = (token, req) =>
  cookie.serialize(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "Strict",
    secure: isSecureRequest(req),
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

const buildSessionDestroyCookie = (req) =>
  cookie.serialize(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "Strict",
    secure: isSecureRequest(req),
    path: "/",
    maxAge: 0,
  });

const buildCsrfCookie = (token, req) =>
  cookie.serialize(CSRF_COOKIE_NAME, token, {
    httpOnly: false,
    sameSite: "Strict",
    secure: isSecureRequest(req),
    path: "/",
    maxAge: CSRF_MAX_AGE,
  });

const ensureNoStoreHtml = (req, res) => {
  if (!res || typeof res.getHeader !== "function" || typeof res.setHeader !== "function") {
    return;
  }

  const cookies = getRequestCookies(req);
  const hasSession = Boolean(cookies[SESSION_COOKIE_NAME]);
  const directive = hasSession ? "private, no-store, must-revalidate" : "no-store, must-revalidate";

  const existing = res.getHeader("Cache-Control");
  if (!existing) {
    res.setHeader("Cache-Control", directive);
    return;
  }

  const existingValue = Array.isArray(existing) ? existing.join(",") : String(existing);
  if (!/no-store/i.test(existingValue) || (hasSession && !/private/i.test(existingValue))) {
    res.setHeader("Cache-Control", directive);
  }
};

const buildCspHeader = (nonce, req) => {
  const origin = req.headers.host ? `${isSecureRequest(req) ? "https" : "http"}://${req.headers.host}` : "";
  const directives = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net https://js.stripe.com https://*.stripe.com https://www.googletagmanager.com https://www.google-analytics.com`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `img-src 'self' data: blob: https://images.unsplash.com https://storage.googleapis.com https://cdn.jsdelivr.net https://www.google-analytics.com https://q.stripe.com https://r.stripe.com`,
    `font-src 'self' https://fonts.gstatic.com data:`,
    `connect-src 'self' ${normalizedUpstreamBase || origin} https://api.artifically.com https://vitals.vercel-insights.com https://vitals.vercel-analytics.com https://cdn.jsdelivr.net https://fonts.googleapis.com https://fonts.gstatic.com https://api.stripe.com https://www.google-analytics.com https://static.cloudflareinsights.com ws: wss:`,
    `frame-src 'self' https://js.stripe.com`,
    `media-src 'self' https://storage.googleapis.com`,
    `worker-src 'self' blob:`,
    `manifest-src 'self'`,
    `prefetch-src 'self' https://fonts.gstatic.com`,
    `upgrade-insecure-requests`,
  ];

  return directives.join("; ");
};

const setSecurityHeaders = (req, res, nonce) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self)");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Content-Security-Policy", buildCspHeader(nonce, req));

  if (isSecureRequest(req)) {
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
};

const applyNonceToTemplate = (html, nonce) =>
  html
    .replace(/__CSP_NONCE__/g, nonce)
    .replace(/<script(?![^>]*\bnonce=)([^>]*)>/gi, (_match, attrs) => `<script nonce="${nonce}"${attrs}>`);

const readRequestBody = (req, limit = 1024 * 1024) =>
  new Promise((resolve, reject) => {
    if (req.method === "GET" || req.method === "HEAD") {
      resolve(Buffer.alloc(0));
      return;
    }

    const chunks = [];
    let total = 0;

    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > limit) {
        reject(new Error("Request body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    req.on("error", (error) => {
      reject(error);
    });
  });

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
};

const handlePreflight = (req, res) => {
  const origin = req.headers.origin || "*";
  res.statusCode = 204;
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"] || "Content-Type, X-CSRF-Token, X-Request-ID"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Vary", "Origin");
  res.end();
};

const handleCsrfToken = (req, res) => {
  const token = crypto.randomBytes(32).toString("hex");
  appendSetCookie(res, buildCsrfCookie(token, req));
  sendJson(res, 200, { csrfToken: token });
};

const shouldClearSession = (statusCode, pathname, method) => {
  if (statusCode === 401 || statusCode === 419) {
    return true;
  }
  if (method === "POST" && ["/api/v1/auth/signout", "/api/v1/auth/logout"].includes(pathname)) {
    return true;
  }
  return false;
};

const handleApiProxy = async (req, res) => {
  const url = req.url || "/";
  if (!url.startsWith("/api/")) {
    return false;
  }

  const method = (req.method || "GET").toUpperCase();

  if (method === "OPTIONS") {
    handlePreflight(req, res);
    return true;
  }

  const origin = req.headers.host ? `${isSecureRequest(req) ? "https" : "http"}://${req.headers.host}` : "";
  const requestUrl = new URL(url, origin || "http://localhost");
  const pathname = requestUrl.pathname;

  const isAuthMutation = pathname.startsWith("/api/v1/auth/") && method === "POST";
  if (isAuthMutation) {
    const rateKey = `${pathname}:${getClientKey(req)}`;
    if (isRateLimited(rateKey, AUTH_RATE_LIMIT)) {
      sendJson(res, 429, {
        error: "RATE_LIMITED",
        message: "Too many authentication attempts. Please wait before retrying.",
      });
      return true;
    }
  }

  if (pathname === "/api/v1/auth/csrf-token" && method === "GET") {
    handleCsrfToken(req, res);
    return true;
  }

  if (!normalizedUpstreamBase) {
    sendJson(res, 502, {
      error: "UPSTREAM_NOT_CONFIGURED",
      message: "API upstream URL is not configured on the SSR server",
    });
    return true;
  }

  try {
    const bodyBuffer = await readRequestBody(req);
    const cookies = getRequestCookies(req);
    const sessionToken = cookies[SESSION_COOKIE_NAME];

    const upstreamHeaders = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value === undefined) {
        continue;
      }
      const normalizedKey = key.toLowerCase();
      if (["host", "content-length", "cookie", "connection"].includes(normalizedKey)) {
        continue;
      }
      if (Array.isArray(value)) {
        upstreamHeaders.set(key, value.join(","));
      } else {
        upstreamHeaders.set(key, value);
      }
    }

    if (sessionToken && !upstreamHeaders.has("authorization")) {
      upstreamHeaders.set("authorization", `Bearer ${sessionToken}`);
    }

    if (!upstreamHeaders.has("accept")) {
      upstreamHeaders.set("accept", "application/json, text/plain, */*");
    }

    const upstreamUrl = `${normalizedUpstreamBase}${pathname}${requestUrl.search}`;
    const response = await fetch(upstreamUrl, {
      method,
      headers: upstreamHeaders,
      redirect: "manual",
      body: method === "GET" || method === "HEAD" ? undefined : bodyBuffer,
    });

    const responseBuffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get("content-type") || "";
    let responseBodyText = null;
    let responseJson = null;

    if (contentType.includes("application/json")) {
      responseBodyText = responseBuffer.toString("utf-8");
      try {
        responseJson = JSON.parse(responseBodyText);
      } catch (error) {
        console.warn("Upstream returned invalid JSON", error);
        responseJson = null;
      }
    }

    const cookiesToSet = [];

    if (responseJson && typeof responseJson === "object" && responseJson !== null) {
      if (responseJson.token) {
        cookiesToSet.push(buildSessionCookie(String(responseJson.token), req));
        responseJson.session = {
          active: true,
          issuedAt: createIsoTimestamp(),
          expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString(),
        };
        delete responseJson.token;
        responseBodyText = JSON.stringify(responseJson);
      }
    }

    if (shouldClearSession(response.status, pathname, method)) {
      cookiesToSet.push(buildSessionDestroyCookie(req));
    }

    if (cookiesToSet.length) {
      const existing = res.getHeader("Set-Cookie");
      const next = existing
        ? Array.isArray(existing)
          ? [...existing, ...cookiesToSet]
          : [existing, ...cookiesToSet]
        : cookiesToSet;
      res.setHeader("Set-Cookie", next);
    }

    res.statusCode = response.status;
    if (pathname.startsWith("/api/v1/auth")) {
      res.setHeader("Cache-Control", "no-store");
    }
    if (!res.getHeader("Access-Control-Allow-Origin") && req.headers.origin) {
      res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        return;
      }
      if (key.toLowerCase() === "content-length") {
        return;
      }
      res.setHeader(key, value);
    });

    if (responseBodyText !== null) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(responseBodyText);
    } else {
      res.end(responseBuffer);
    }
  } catch (error) {
    console.error("API proxy failed", error);
    sendJson(res, 502, {
      error: "UPSTREAM_ERROR",
      message: "Failed to contact upstream API",
    });
  }

  return true;
};

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
    const nonce = createNonce();
    setSecurityHeaders(req, res, nonce);
    const url = req.url || "/";

    if (await handleApiProxy(req, res)) {
      return;
    }

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

    if (url.startsWith("/rsc/marketing/home")) {
      try {
        const mod = await vite.ssrLoadModule("/src/entry-server.jsx");
        await mod.renderMarketingHomeRSC(res);
      } catch (error) {
        vite.ssrFixStacktrace(error);
        console.error("Marketing RSC dev render failed", error);
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
            const templateWithNonce = applyNonceToTemplate(template, nonce);

            const fallbackTemplate = applyNonceToTemplate(
              injectSeoMeta(
                template
                  .replace(
                    "<!--app-html-->",
                    '<div class="initial-loading"><div class="loading-spinner"></div><p>Loading Artifically...</p></div>'
                  )
                  .replace(
                    "<!--app-fallback-->",
                    '<script nonce="__CSP_NONCE__">window.__SSR_DISABLED__ = true;</script>'
                  ),
                { canonicalUrl, structuredData },
              ),
              nonce,
            );

            try {
              const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");
              const rendered = normalizeRenderResult(await render(requestUrl, null));

              if (!rendered?.stream) {
                throw new Error("SSR renderer did not return a stream");
              }

              res.setHeader("Link", `<${canonicalUrl}>; rel="canonical"`);

              const [htmlStart = "", htmlEndWithFallback = ""] = templateWithNonce.split("<!--app-html-->");
              const htmlEnd = htmlEndWithFallback.replace("<!--app-fallback-->", "");

              res.statusCode = rendered.statusCode ?? 200;
              const headers = rendered.headers ?? {};
              for (const [key, value] of Object.entries(headers)) {
                if (value !== undefined) {
                  res.setHeader(key, value);
                }
              }

              ensureNoStoreHtml(req, res);

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
              ensureNoStoreHtml(req, res);
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
      '<script nonce="__CSP_NONCE__">window.__SSR_DISABLED__ = true;</script>'
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
  let renderMarketingHomeRSC = null;
  if (!entryPath) {
    console.error(
      "⚠️ SSR entry module not found in dist/server. Falling back to client-only rendering."
    );
  } else {
    try {
      ({ render, renderFeatureHighlightsRSC, renderMarketingHomeRSC } = await import(pathToFileURL(entryPath).href));
    } catch (error) {
      console.error("⚠️ Failed to load SSR entry module, falling back to client-only", error);
    }
  }

  const sendClientOnly = (req, res, requestUrl, nonce) => {
    if (res.headersSent) {
      return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-SSR-Fallback", "true");
    const canonicalUrl = getCanonicalUrl(requestUrl);
    const structuredData = getStructuredData(requestUrl);
    const fallbackTemplate = applyNonceToTemplate(
      injectSeoMeta(clientOnlyTemplate, { canonicalUrl, structuredData }),
      nonce,
    );
    res.setHeader("Link", `<${canonicalUrl}>; rel="canonical"`);
    ensureNoStoreHtml(req, res);
    res.end(fallbackTemplate);
  };

  const requestListener = async (req, res) => {
    const nonce = createNonce();
    setSecurityHeaders(req, res, nonce);
    const url = (req.url || "/").split("?")[0];

    if (await handleApiProxy(req, res)) {
      return;
    }

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

    if (url.startsWith("/rsc/marketing/home")) {
      if (renderMarketingHomeRSC) {
        try {
          await renderMarketingHomeRSC(res);
        } catch (error) {
          console.error("Marketing RSC prod render failed", error);
          res.statusCode = 500;
          res.end("RSC render failed");
        }
      } else {
        console.warn("Marketing RSC renderer unavailable, returning empty response");
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
      sendClientOnly(req, res, url, nonce);
      return;
    }

    try {
      const canonicalUrl = getCanonicalUrl(url);
      const structuredData = getStructuredData(url);
      const enrichedTemplate = applyNonceToTemplate(
        injectSeoMeta(template, { canonicalUrl, structuredData }),
        nonce,
      );
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
      ensureNoStoreHtml(req, res);

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
      sendClientOnly(req, res, url, nonce);
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